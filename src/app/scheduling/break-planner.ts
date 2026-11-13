import {
  activeCoverageRules,
  breakIntervals,
  breakKey,
  countWithRole,
  DayShift,
  dayShifts,
  evaluateCoverage,
  ruleAppliesOnDate,
} from '../core/coverage';
import {
  BreakBlackoutRule,
  BreakPolicy,
  BreakTier,
  Employee,
  IsoDate,
  MaxOnBreakRule,
  PlannedBreak,
  RuleSet,
  ShiftSlot,
  Violation,
} from '../core/models';
import { prettyRange, prettyTime, toMinutes } from '../core/time';
import { mulberry32 } from './greedy-scheduler';

export type BreakMap = Record<string, PlannedBreak[]>;

/** Which breaks a shift of `hours` length needs: the highest tier that applies. */
export function requiredBreaks(hours: number, policy: BreakPolicy): BreakTier['breaks'] {
  const tier = [...policy.tiers]
    .sort((a, b) => a.minShiftHours - b.minShiftHours)
    .filter((t) => hours + 1e-9 >= t.minShiftHours)
    .pop();
  return tier ? tier.breaks : [];
}

const fmt = (mins: number) => {
  const m = ((Math.round(mins) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

function blackouts(rules: RuleSet | null | undefined, date: IsoDate): [number, number][] {
  return (rules?.rules ?? [])
    .filter((r): r is BreakBlackoutRule => r.type === 'break-blackout' && r.enabled && ruleAppliesOnDate(r, date))
    .flatMap((r) => {
      const a = toMinutes(r.from);
      let b = toMinutes(r.to);
      if (b <= a) b += 1440;
      return [
        [a, b],
        [a + 1440, b + 1440],
      ] as [number, number][];
    });
}

function maxOnBreak(rules: RuleSet | null | undefined, date: IsoDate): (MaxOnBreakRule & { a: number; b: number })[] {
  return (rules?.rules ?? [])
    .filter((r): r is MaxOnBreakRule => r.type === 'max-on-break' && r.enabled && ruleAppliesOnDate(r, date))
    .map((r) => {
      const a = r.from ? toMinutes(r.from) : 0;
      let b = r.to ? toMinutes(r.to) : 2880;
      if (r.from && r.to && b <= a) b += 1440;
      return { ...r, a, b };
    });
}

const overlaps = (a: [number, number], b: [number, number]) => a[0] < b[1] && b[0] < a[1];

interface Need {
  ds: DayShift;
  index: number;
  kind: PlannedBreak['kind'];
  minutes: number;
  target: number;
  lo: number;
  hi: number;
}

export interface PlanBreaksInput {
  date: IsoDate;
  slots: readonly ShiftSlot[];
  employees: readonly Employee[];
  rules: RuleSet;
  /** Existing breaks; with `keepExisting`, people who already have breaks are left alone. */
  existing?: BreakMap;
  keepExisting?: boolean;
  iterations?: number;
  seed?: number;
}

export interface PlanBreaksResult {
  breaks: BreakMap;
  warnings: string[];
}

/** Plan breaks for everyone working shifts that start on `date`. */
export function planBreaks(input: PlanBreaksInput): PlanBreaksResult {
  const { date, rules } = input;
  const policy = rules.breakPolicy;
  const step = Math.max(5, policy.stepMinutes || 15);
  const empById = new Map(input.employees.map((e) => [e.id, e]));
  const all = dayShifts(date, input.slots);
  const mine = all.filter((d) => d.slot.date === date);
  const warnings: string[] = [];
  const black = blackouts(rules, date);
  const caps = maxOnBreak(rules, date);
  const coverage = activeCoverageRules(rules, 'breaks').filter((r) => ruleAppliesOnDate(r, date));

  const locked: BreakMap = {};
  const needs: Need[] = [];
  for (const ds of mine) {
    const key = breakKey(ds.slot.id, ds.employeeId);
    if (input.keepExisting && input.existing?.[key]?.length) {
      locked[key] = input.existing[key];
      continue;
    }
    const req = requiredBreaks((ds.end - ds.start) / 60, policy);
    const len = ds.end - ds.start;
    const lo = ds.start + policy.noBreakFirstMinutes;
    req.forEach((b, i) => {
      const hi = ds.end - policy.noBreakLastMinutes - b.minutes;
      const target = ds.start + (len * (i + 1)) / (req.length + 1) - b.minutes / 2;
      needs.push({ ds, index: i, kind: b.kind, minutes: b.minutes, target, lo, hi });
    });
  }

  // Other people's shifts that touch this day (e.g. overnight from yesterday) count for coverage but aren't planned.
  const lockedIntervals = (map: BreakMap) =>
    all.flatMap((ds) => breakIntervals(ds, map).map((iv) => ({ ds, iv })));

  const onFloorCount = (t: number, plan: { ds: DayShift; iv: [number, number] }[], role: string | null) => {
    const onShift = all.filter((d) => t >= d.start && t < d.end).map((d) => d.employeeId);
    const off = new Set(plan.filter((p) => t >= p.iv[0] && t < p.iv[1]).map((p) => p.ds.employeeId));
    return countWithRole(
      onShift.filter((id) => !off.has(id)),
      role,
      empById,
    );
  };

  const costFor = (n: Need, start: number, plan: { ds: DayShift; iv: [number, number] }[]) => {
    const iv: [number, number] = [start, start + n.minutes];
    let cost = (Math.abs(start - n.target) / step) * 1;
    const others = plan.filter((p) => p.ds.employeeId !== n.ds.employeeId);
    for (let t = iv[0]; t < iv[1]; t += step) {
      const offNow = others.filter((p) => t >= p.iv[0] && t < p.iv[1]).length;
      cost += offNow * 10;
      for (const cap of caps) {
        if (t >= cap.a && t < cap.b && offNow + 1 > cap.max) cost += cap.severity === 'hard' ? 400 : 50;
      }
      for (const rule of coverage) {
        if (rule.from && rule.to) {
          const a = toMinutes(rule.from);
          let b = toMinutes(rule.to);
          if (b <= a) b += 1440;
          if (!(t >= a && t < b)) continue;
        }
        const emp = empById.get(n.ds.employeeId);
        if (rule.role && !emp?.roles.some((r) => r.toLowerCase() === rule.role!.toLowerCase())) continue;
        const withMe = onFloorCount(t, [...plan, { ds: n.ds, iv }], rule.role);
        if (withMe < rule.min) cost += rule.severity === 'hard' ? 1000 : 100;
      }
    }
    return cost;
  };

  const rng = mulberry32(input.seed ?? 1);
  let best: { plan: { n: Need; start: number }[]; cost: number } | null = null;
  const iterations = input.iterations ?? 30;
  for (let it = 0; it < iterations; it++) {
    // Narrowest windows first; jitter the rest.
    const order = [...needs].sort((a, b) => a.hi - a.lo - (b.hi - b.lo) + (rng() - 0.5) * 60);
    const placed: { n: Need; start: number }[] = [];
    const plan = lockedIntervals(locked);
    let total = 0;
    for (const n of order) {
      const mineSoFar = placed.filter((p) => p.n.ds === n.ds);
      let bestStart: number | null = null;
      let bestCost = Infinity;
      const first = Math.ceil(n.lo / step) * step;
      for (let s = first; s <= n.hi; s += step) {
        const iv: [number, number] = [s, s + n.minutes];
        if (black.some((b) => overlaps(iv, b))) continue;
        // Keep the person's breaks in order and apart.
        const tooClose = mineSoFar.some((p) => {
          const o: [number, number] = [p.start, p.start + p.n.minutes];
          const gap = o[1] <= iv[0] ? iv[0] - o[1] : o[0] - iv[1];
          return overlaps(o, iv) || gap < policy.minGapMinutes;
        });
        if (tooClose) continue;
        const outOfOrder = mineSoFar.some((p) => (p.n.index < n.index ? p.start >= s : p.start <= s));
        if (outOfOrder) continue;
        const c = costFor(n, s, plan) + rng() * 0.5;
        if (c < bestCost) {
          bestCost = c;
          bestStart = s;
        }
      }
      if (bestStart == null) {
        total += 5000;
        continue;
      }
      placed.push({ n, start: bestStart });
      plan.push({ ds: n.ds, iv: [bestStart, bestStart + n.minutes] });
      total += bestCost;
    }
    if (!best || total < best.cost) best = { plan: placed, cost: total };
  }

  const breaks: BreakMap = { ...locked };
  for (const { n, start } of best?.plan ?? []) {
    const key = breakKey(n.ds.slot.id, n.ds.employeeId);
    (breaks[key] ??= []).push({ kind: n.kind, start: fmt(start), minutes: n.minutes });
  }
  for (const k of Object.keys(breaks)) breaks[k].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

  // Explain anything that didn't fit.
  for (const ds of mine) {
    const key = breakKey(ds.slot.id, ds.employeeId);
    if (locked[key]) continue;
    const req = requiredBreaks((ds.end - ds.start) / 60, policy);
    const got = breaks[key]?.length ?? 0;
    if (got < req.length) {
      const name = empById.get(ds.employeeId)?.name ?? 'Someone';
      warnings.push(
        `${name} (${prettyRange(ds.slot.start, ds.slot.end)}): couldn't fit ${req.length - got} break(s) within the shift, buffers and blackouts`,
      );
    }
  }
  const covViolations = evaluateCoverage({
    dates: [date],
    slots: input.slots,
    employees: input.employees,
    rules,
    target: 'breaks',
    breaks,
  });
  for (const v of covViolations) warnings.push(`During breaks: ${v.message}`);
  return { breaks, warnings };
}

/** Live checks for a day's breaks (after manual edits). */
export function validateBreaks(args: {
  date: IsoDate;
  slots: readonly ShiftSlot[];
  employees: readonly Employee[];
  rules: RuleSet;
  breaks: BreakMap | undefined;
}): Violation[] {
  const { date, rules } = args;
  const policy = rules.breakPolicy;
  const empById = new Map(args.employees.map((e) => [e.id, e]));
  const out: Violation[] = [];
  const black = blackouts(rules, date);
  const all = dayShifts(date, args.slots);
  for (const ds of all.filter((d) => d.slot.date === date)) {
    const name = empById.get(ds.employeeId)?.name ?? 'Someone';
    const who = `${name} (${prettyRange(ds.slot.start, ds.slot.end)})`;
    const v = (message: string, severity: Violation['severity'] = 'error') =>
      out.push({ slotId: ds.slot.id, employeeId: ds.employeeId, severity, message: `${who}: ${message}` });
    const req = requiredBreaks((ds.end - ds.start) / 60, policy);
    const list = args.breaks?.[breakKey(ds.slot.id, ds.employeeId)] ?? [];
    const ivs = breakIntervals(ds, args.breaks);
    if (!list.length && req.length) {
      v(`needs ${req.length} break(s), none planned`, 'warning');
      continue;
    }
    const needRest = req.filter((b) => b.kind === 'rest').length;
    const needMeal = req.filter((b) => b.kind === 'meal').length;
    const haveRest = list.filter((b) => b.kind === 'rest').length;
    const haveMeal = list.filter((b) => b.kind === 'meal').length;
    if (haveRest < needRest) v(`missing ${needRest - haveRest} rest break(s)`);
    if (haveMeal < needMeal) v(`missing ${needMeal - haveMeal} meal break(s)`);
    ivs.forEach(([a, b], i) => {
      const label = `${list[i].kind === 'meal' ? 'Meal' : 'Break'} at ${prettyTime(list[i].start)}`;
      if (a < ds.start || b > ds.end) v(`${label} is outside the shift`);
      else if (a < ds.start + policy.noBreakFirstMinutes || b > ds.end - policy.noBreakLastMinutes)
        v(`${label} is too close to the start or end of the shift`, 'warning');
      if (black.some((x) => overlaps([a, b], x))) v(`${label} is during a no-break window`);
      for (let j = i + 1; j < ivs.length; j++) {
        const o = ivs[j];
        const gap = o[0] >= b ? o[0] - b : a - o[1];
        if (overlaps([a, b], o)) v(`${label} overlaps another break`);
        else if (gap < policy.minGapMinutes) v(`breaks less than ${policy.minGapMinutes} min apart`, 'warning');
      }
    });
  }
  // Max-on-break rules.
  for (const cap of maxOnBreak(rules, date)) {
    const ivs = all.flatMap((ds) => breakIntervals(ds, args.breaks));
    let worst = 0;
    let at = 0;
    for (let t = 0; t < 2880; t += 5) {
      if (t < cap.a || t >= cap.b) continue;
      const n = ivs.filter(([a, b]) => t >= a && t < b).length;
      if (n > worst) {
        worst = n;
        at = t;
      }
    }
    if (worst > cap.max) {
      out.push({
        slotId: '',
        severity: cap.severity === 'hard' ? 'error' : 'warning',
        message: `${worst} people on break at ${prettyTime(fmt(at))} (max ${cap.max})`,
      });
    }
  }
  out.push(
    ...evaluateCoverage({ dates: [date], slots: args.slots, employees: args.employees, rules, target: 'breaks', breaks: args.breaks }),
  );
  return out;
}
