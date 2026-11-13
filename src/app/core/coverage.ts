import { CoverageRule, Employee, IsoDate, PlannedBreak, RuleSet, RuleTarget, ShiftSlot, Violation, WEEKDAY_NAMES } from './models';
import { addDays, prettyDate, prettyTime, shiftMinutes, toMinutes, weekdayOf } from './time';

export const COVERAGE_STEP = 15;

export function breakKey(slotId: string, employeeId: string): string {
  return `${slotId}|${employeeId}`;
}

/** A person working during part of a day, in minutes from that day's midnight (may exceed 1440). */
export interface DayShift {
  slot: ShiftSlot;
  employeeId: string;
  start: number;
  end: number;
}

/** Shifts that touch `date`: shifts starting that day, plus overnight shifts from the day before. */
export function dayShifts(date: IsoDate, slots: readonly ShiftSlot[]): DayShift[] {
  const prev = addDays(date, -1);
  const out: DayShift[] = [];
  for (const s of slots) {
    let offset: number;
    if (s.date === date) offset = 0;
    else if (s.date === prev) offset = -1440;
    else continue;
    const start = toMinutes(s.start) + offset;
    const end = start + shiftMinutes(s.start, s.end);
    if (end <= 0) continue;
    for (const id of s.assignedEmployeeIds) out.push({ slot: s, employeeId: id, start, end });
  }
  return out;
}

/** Break intervals (minutes from the day's midnight) for one person-shift. */
export function breakIntervals(ds: DayShift, breaks: Record<string, PlannedBreak[]> | undefined): [number, number][] {
  const list = breaks?.[breakKey(ds.slot.id, ds.employeeId)] ?? [];
  const base = ds.start - toMinutes(ds.slot.start); // 0 or -1440
  return list.map((b) => {
    let s = toMinutes(b.start) + base;
    // A break after midnight in an overnight shift.
    if (s < ds.start) s += 1440;
    return [s, s + b.minutes] as [number, number];
  });
}

export interface Tick {
  t: number;
  onShift: string[];
  onFloor: string[];
  onBreak: string[];
}

/** Per-tick view of who's working / on break during a day. */
export function dayTimeline(
  date: IsoDate,
  slots: readonly ShiftSlot[],
  breaks?: Record<string, PlannedBreak[]>,
  step = COVERAGE_STEP,
): Tick[] {
  const shifts = dayShifts(date, slots);
  if (!shifts.length) return [];
  const from = Math.max(0, Math.floor(Math.min(...shifts.map((s) => s.start)) / step) * step);
  const to = Math.min(1440, Math.max(...shifts.map((s) => s.end)));
  const withBreaks = shifts.map((s) => ({ s, br: breakIntervals(s, breaks) }));
  const ticks: Tick[] = [];
  for (let t = from; t < to; t += step) {
    const onShift = new Set<string>();
    const onBreak = new Set<string>();
    for (const { s, br } of withBreaks) {
      if (t < s.start || t >= s.end) continue;
      onShift.add(s.employeeId);
      if (br.some(([a, b]) => t >= a && t < b)) onBreak.add(s.employeeId);
    }
    ticks.push({
      t,
      onShift: [...onShift],
      onBreak: [...onBreak],
      onFloor: [...onShift].filter((id) => !onBreak.has(id)),
    });
  }
  return ticks;
}

export function ruleAppliesOnDate(rule: { days: number[] | null }, date: IsoDate): boolean {
  return !rule.days || rule.days.includes(weekdayOf(date));
}

/** Is tick t inside the rule's time window? null window = whenever someone is on shift. */
export function inWindow(rule: { from: string | null; to: string | null }, t: number, anyoneOnShift: boolean): boolean {
  if (!rule.from || !rule.to) return anyoneOnShift;
  const a = toMinutes(rule.from);
  let b = toMinutes(rule.to);
  if (b <= a) b += 1440;
  const tt = t % 1440;
  return (tt >= a && tt < b) || (tt + 1440 >= a && tt + 1440 < b);
}

export function countWithRole(ids: readonly string[], role: string | null, empById: Map<string, Employee>): number {
  if (!role) return ids.length;
  const r = role.toLowerCase();
  return ids.filter((id) => empById.get(id)?.roles.some((x) => x.toLowerCase() === r)).length;
}

export function activeCoverageRules(rules: RuleSet | null | undefined, target: RuleTarget): CoverageRule[] {
  return (rules?.rules ?? []).filter(
    (r): r is CoverageRule => r.type === 'coverage' && r.enabled && r.appliesTo.includes(target),
  );
}

export function coverageLabel(rule: CoverageRule): string {
  return `${rule.min} ${rule.role ?? (rule.min === 1 ? 'person' : 'people')}`;
}

/**
 * Coverage rule violations across the given dates.
 * With `breaks`, people on break don't count as on the floor.
 */
export function evaluateCoverage(args: {
  dates: IsoDate[];
  slots: readonly ShiftSlot[];
  employees: readonly Employee[];
  rules: RuleSet | null | undefined;
  target: RuleTarget;
  breaks?: Record<string, PlannedBreak[]>;
}): Violation[] {
  const rules = activeCoverageRules(args.rules, args.target);
  if (!rules.length) return [];
  const empById = new Map(args.employees.map((e) => [e.id, e]));
  const out: Violation[] = [];
  for (const date of args.dates) {
    const daySlots = args.slots.filter((s) => s.date === date);
    const timeline = dayTimeline(date, args.slots, args.target === 'breaks' ? args.breaks : undefined);
    for (const rule of rules) {
      if (!ruleAppliesOnDate(rule, date)) continue;
      // Ticks inside the window, including ones where nobody is working (explicit windows).
      // `working` counts holders on shift ignoring breaks, to explain shortfalls.
      const ticks: { t: number; have: number; working: number }[] = [];
      const count = (x: Tick | undefined) => ({
        have: countWithRole(x?.onFloor ?? [], rule.role, empById),
        working: countWithRole(x?.onShift ?? [], rule.role, empById),
      });
      if (rule.from && rule.to) {
        const a = toMinutes(rule.from);
        let b = toMinutes(rule.to);
        if (b <= a) b += 1440;
        const byT = new Map(timeline.map((x) => [x.t, x]));
        for (let t = a; t < Math.min(b, 1440); t += COVERAGE_STEP) ticks.push({ t, ...count(byT.get(t)) });
      } else {
        for (const x of timeline) if (x.onShift.length) ticks.push({ t: x.t, ...count(x) });
      }
      // Merge short ticks into ranges.
      let run: { from: number; to: number; minHave: number; minWorking: number } | null = null;
      const flush = () => {
        if (!run) return;
        const slot =
          daySlots.find((s) => toMinutes(s.start) < run!.to && toMinutes(s.start) + shiftMinutes(s.start, s.end) > run!.from) ??
          daySlots[0];
        const who = rule.role ?? 'people';
        let msg =
          run.minHave === 0
            ? `no ${rule.role ?? 'one'} on the floor`
            : `only ${run.minHave} ${who} on the floor`;
        if (args.target === 'breaks' && run.minWorking <= rule.min && run.minWorking > 0) {
          msg += ` — only ${run.minWorking} ${who} working then, so their break can't be covered`;
        } else if (run.minWorking === 0 && rule.from && rule.to) {
          msg += ' — nobody qualifying is scheduled then';
        }
        out.push({
          slotId: slot?.id ?? '',
          severity: rule.severity === 'hard' ? 'error' : 'warning',
          message: `${WEEKDAY_NAMES[weekdayOf(date)]} ${prettyDate(date)} ${prettyTime(fmt(run.from))}–${prettyTime(fmt(run.to))}: ${msg} (needs ${rule.min})`,
        });
        run = null;
      };
      for (const { t, have, working } of ticks) {
        if (have < rule.min) {
          if (run && run.to === t) {
            run.to = t + COVERAGE_STEP;
            run.minHave = Math.min(run.minHave, have);
            run.minWorking = Math.min(run.minWorking, working);
          } else {
            flush();
            run = { from: t, to: t + COVERAGE_STEP, minHave: have, minWorking: working };
          }
        } else flush();
      }
      flush();
    }
  }
  return out;
}

function fmt(mins: number): string {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
