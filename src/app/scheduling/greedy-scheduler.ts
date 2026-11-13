import {
  AssignmentState,
  availabilityReasons,
  builtIn,
  groupRestrictions,
  workloadCheck,
} from '../core/constraint-checker';
import { activeCoverageRules, COVERAGE_STEP, ruleAppliesOnDate } from '../core/coverage';
import { CoverageRule, Employee, IsoDate, Preference, Restriction, RuleSet, ShiftSlot } from '../core/models';
import { addDays, shiftMinutes, toMinutes, weekdayOf } from '../core/time';

export interface SlotGap {
  slotId: string;
  date: IsoDate;
  name: string;
  missing: number;
  reason: string;
}

export interface GenerateInput {
  startDate: IsoDate;
  weeks: number;
  /** Slots to fill. Existing assignments are kept as-is (locked). */
  slots: ShiftSlot[];
  employees: readonly Employee[];
  restrictions: readonly Restriction[];
  /** Number of randomized restarts. */
  iterations?: number;
  seed?: number;
  /** Built-in switches, never-together and coverage rules. Employees/restrictions should already be resolved. */
  rules?: RuleSet | null;
}

export interface GenerateResult {
  slots: ShiftSlot[];
  unfilled: SlotGap[];
  warnings: string[];
  cost: number;
}

/** Small deterministic PRNG so results are reproducible for a given seed. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Prepared {
  input: GenerateInput;
  activeEmployees: Employee[];
  empById: Map<string, Employee>;
  names: Map<string, string>;
  prefsByEmp: Map<string, Preference[]>;
  /** For each slot id, the employees who pass static availability checks. */
  available: Map<string, Employee[]>;
  /** For each slot id, the employees that were locked in by the caller. */
  locked: Map<string, Set<string>>;
  rules: RuleSet | null;
  coverageRules: CoverageRule[];
  /** For each slot id, the coverage rules (by index) whose window overlaps it. */
  slotRules: Map<string, number[]>;
}

// ---------- coverage tracking (minutes from the slot's own date) ----------

const TICKS = (2 * 1440) / COVERAGE_STEP; // room for overnight shifts

function slotTicks(slot: ShiftSlot): [number, number] {
  const a = toMinutes(slot.start) / COVERAGE_STEP;
  return [a, a + shiftMinutes(slot.start, slot.end) / COVERAGE_STEP];
}

function ruleTicks(rule: CoverageRule, slot: ShiftSlot): [number, number] {
  const [sa, sb] = slotTicks(slot);
  if (!rule.from || !rule.to) return [sa, sb];
  const a = toMinutes(rule.from) / COVERAGE_STEP;
  let b = toMinutes(rule.to) / COVERAGE_STEP;
  if (b <= a) b += 1440 / COVERAGE_STEP;
  return [Math.max(a, sa), Math.min(b, sb)];
}

function holds(emp: Employee, role: string | null): boolean {
  return !role || emp.roles.some((r) => r.toLowerCase() === role.toLowerCase());
}

/** Per date, per coverage rule: how many qualifying people are on shift at each tick. */
class CoverageTracker {
  private readonly counts = new Map<string, Int16Array>();
  constructor(private readonly prep: Prepared) {}

  static from(prep: Prepared, slots: readonly ShiftSlot[]): CoverageTracker {
    const t = new CoverageTracker(prep);
    for (const s of slots) for (const id of s.assignedEmployeeIds) t.change(id, s, 1);
    return t;
  }

  private arr(date: IsoDate, i: number): Int16Array {
    const k = `${date}|${i}`;
    let a = this.counts.get(k);
    if (!a) {
      a = new Int16Array(TICKS);
      this.counts.set(k, a);
    }
    return a;
  }

  change(empId: string, slot: ShiftSlot, delta: 1 | -1): void {
    const emp = this.prep.empById.get(empId);
    if (!emp) return;
    const [a, b] = slotTicks(slot);
    this.prep.coverageRules.forEach((rule, i) => {
      if (!holds(emp, rule.role) || !ruleAppliesOnDate(rule, slot.date)) return;
      const arr = this.arr(slot.date, i);
      for (let t = a; t < b && t < TICKS; t++) arr[t] += delta;
    });
  }

  /** Rule indexes still short somewhere inside this slot. */
  shortRules(slot: ShiftSlot): number[] {
    const out: number[] = [];
    for (const i of this.prep.slotRules.get(slot.id) ?? []) {
      const rule = this.prep.coverageRules[i];
      const [a, b] = ruleTicks(rule, slot);
      const arr = this.arr(slot.date, i);
      for (let t = a; t < b && t < TICKS; t++) {
        if (arr[t] < rule.min) {
          out.push(i);
          break;
        }
      }
    }
    return out;
  }

  /** Total shortfall in rule-ticks (hard rules weigh more). */
  deficit(slots: readonly ShiftSlot[]): number {
    let total = 0;
    const seen = new Set<string>();
    for (const s of slots) {
      for (const i of this.prep.slotRules.get(s.id) ?? []) {
        const rule = this.prep.coverageRules[i];
        const [a, b] = ruleTicks(rule, s);
        const arr = this.arr(s.date, i);
        for (let t = a; t < b && t < TICKS; t++) {
          const k = `${s.date}|${i}|${t}`;
          if (seen.has(k)) continue;
          seen.add(k);
          if (arr[t] < rule.min) total += (rule.min - arr[t]) * (rule.severity === 'hard' ? 3 : 1);
        }
      }
    }
    return total;
  }
}

function prepare(input: GenerateInput): Prepared {
  const restrByEmp = groupRestrictions(input.restrictions);
  const activeEmployees = input.employees.filter((e) => e.active);
  const prefsByEmp = new Map<string, Preference[]>();
  for (const [empId, list] of restrByEmp) {
    prefsByEmp.set(
      empId,
      list.filter((r): r is Preference => r.type === 'preference'),
    );
  }
  const available = new Map<string, Employee[]>();
  const locked = new Map<string, Set<string>>();
  for (const slot of input.slots) {
    available.set(
      slot.id,
      activeEmployees.filter((e) => availabilityReasons(e, slot, restrByEmp.get(e.id) ?? []).length === 0),
    );
    locked.set(slot.id, new Set(slot.assignedEmployeeIds));
  }
  const rules = input.rules ?? null;
  const coverageRules = activeCoverageRules(rules, 'schedule');
  const slotRules = new Map<string, number[]>();
  for (const slot of input.slots) {
    const idx: number[] = [];
    coverageRules.forEach((rule, i) => {
      if (!ruleAppliesOnDate(rule, slot.date)) return;
      const [a, b] = ruleTicks(rule, slot);
      if (b > a) idx.push(i);
    });
    if (idx.length) slotRules.set(slot.id, idx);
  }
  if (rules && builtIn(rules, 'preferences') === 'off') prefsByEmp.clear();
  return {
    input,
    activeEmployees,
    empById: new Map(input.employees.map((e) => [e.id, e])),
    names: new Map(input.employees.map((e) => [e.id, e.name])),
    prefsByEmp,
    available,
    locked,
    rules,
    coverageRules,
    slotRules,
  };
}

/** Hard reasons block the candidate; soft ones only lower their score. */
function check(prep: Prepared, emp: Employee, slot: ShiftSlot, state: AssignmentState) {
  return workloadCheck(emp, slot, state, prep.rules, prep.names);
}

function preferenceScore(prefs: readonly Preference[] | undefined, slot: ShiftSlot): number {
  if (!prefs?.length) return 0;
  const wd = weekdayOf(slot.date);
  let score = 0;
  for (const p of prefs) {
    const dayMatch = p.weekday == null || p.weekday === wd;
    const shiftMatch = !p.shiftTemplateId || p.shiftTemplateId === slot.templateId;
    if (p.weekday == null && !p.shiftTemplateId) continue;
    if (dayMatch && shiftMatch) score += p.kind === 'prefer' ? 1 : -1;
  }
  return score;
}

function candidateScore(
  prep: Prepared,
  emp: Employee,
  slot: ShiftSlot,
  state: AssignmentState,
  rng: () => number,
  softCount: number,
  shortRules: number[],
): number {
  const week = state.weekIndex(slot.date);
  const hrs = state.hoursInWeek(emp.id, week);
  let score = 0;
  // Coverage rules: strongly prefer people who fill a missing role during this shift.
  for (const i of shortRules) {
    const rule = prep.coverageRules[i];
    if (holds(emp, rule.role)) score += rule.severity === 'hard' ? 60 : 25;
  }
  // Soft built-in rules (e.g. "max days in a row" set to soft) are avoided, not forbidden.
  score -= softCount * 15;
  if (emp.minHoursPerWeek && hrs < emp.minHoursPerWeek) {
    score += 20 + (emp.minHoursPerWeek - hrs);
  }
  // Fairness: spread hours; scale by capacity when we know max hours.
  const cap = emp.maxHoursPerWeek || 40;
  score -= (hrs / cap) * 15;
  score += preferenceScore(prep.prefsByEmp.get(emp.id), slot) * 8;
  // Mild preference for not stacking long runs of consecutive days.
  const prevDay = addDays(slot.date, -1);
  if (state.shiftsFor(emp.id).some((s) => s.date === prevDay)) score -= 1.5;
  score += rng() * 4;
  return score;
}

function cloneSlots(slots: readonly ShiftSlot[]): ShiftSlot[] {
  return slots.map((s) => ({ ...s, assignedEmployeeIds: [...s.assignedEmployeeIds] }));
}

function fillSlot(
  prep: Prepared,
  slot: ShiftSlot,
  state: AssignmentState,
  rng: () => number,
  tracker?: CoverageTracker,
): void {
  while (slot.assignedEmployeeIds.length < slot.headcount) {
    let best: Employee | null = null;
    let bestScore = -Infinity;
    const short = tracker?.shortRules(slot) ?? [];
    for (const emp of prep.available.get(slot.id) ?? []) {
      if (slot.assignedEmployeeIds.includes(emp.id)) continue;
      const c = check(prep, emp, slot, state);
      if (c.hard.length) continue;
      const sc = candidateScore(prep, emp, slot, state, rng, c.soft.length, short);
      if (sc > bestScore) {
        bestScore = sc;
        best = emp;
      }
    }
    if (!best) return;
    slot.assignedEmployeeIds.push(best.id);
    state.add(best.id, slot);
  }
}

/**
 * Repair pass: for each understaffed slot, try moving an available employee off one of their
 * other (unlocked) shifts if somebody else can cover that shift.
 */
function repairGaps(prep: Prepared, slots: ShiftSlot[], state: AssignmentState, rng: () => number): void {
  const slotById = new Map(slots.map((s) => [s.id, s]));
  for (const gap of slots) {
    let guard = 0;
    while (gap.assignedEmployeeIds.length < gap.headcount && guard++ < gap.headcount) {
      let fixed = false;
      for (const emp of prep.available.get(gap.id) ?? []) {
        if (gap.assignedEmployeeIds.includes(emp.id)) continue;
        for (const worked of [...state.shiftsFor(emp.id)]) {
          const other = slotById.get(worked.slotId);
          if (!other || prep.locked.get(other.id)?.has(emp.id)) continue;
          // Tentatively move emp from `other` to `gap`.
          state.remove(emp.id, other);
          other.assignedEmployeeIds = other.assignedEmployeeIds.filter((id) => id !== emp.id);
          if (check(prep, emp, gap, state).hard.length === 0) {
            gap.assignedEmployeeIds.push(emp.id);
            state.add(emp.id, gap);
            const before = new Set(other.assignedEmployeeIds);
            fillSlot(prep, other, state, rng);
            if (other.assignedEmployeeIds.length >= other.headcount) {
              fixed = true;
              break;
            }
            // Couldn't backfill: undo whatever fillSlot added, then undo the move.
            for (const id of other.assignedEmployeeIds.filter((x) => !before.has(x))) {
              state.remove(id, other);
            }
            other.assignedEmployeeIds = other.assignedEmployeeIds.filter((x) => before.has(x));
            gap.assignedEmployeeIds = gap.assignedEmployeeIds.filter((id) => id !== emp.id);
            state.remove(emp.id, gap);
          }
          other.assignedEmployeeIds.push(emp.id);
          state.add(emp.id, other);
        }
        if (fixed) break;
      }
      if (!fixed) break;
    }
  }
}

/**
 * Min-hours pass: give shifts to employees under their weekly minimum by replacing
 * someone who has more hours (and isn't locked) on a shift the under-hours employee can work.
 */
function balanceMinHours(prep: Prepared, slots: ShiftSlot[], state: AssignmentState): void {
  const { weeks } = prep.input;
  for (const emp of prep.activeEmployees) {
    if (!emp.minHoursPerWeek) continue;
    for (let w = 0; w < weeks; w++) {
      for (const slot of slots) {
        if (state.hoursInWeek(emp.id, w) >= emp.minHoursPerWeek) break;
        if (state.weekIndex(slot.date) !== w) continue;
        if (slot.assignedEmployeeIds.includes(emp.id)) continue;
        if (!(prep.available.get(slot.id) ?? []).includes(emp)) continue;
        // Find the donor on this slot with the most surplus hours.
        let donor: Employee | null = null;
        let donorSurplus = 0;
        for (const id of slot.assignedEmployeeIds) {
          if (prep.locked.get(slot.id)?.has(id)) continue;
          const d = prep.empById.get(id);
          if (!d) continue;
          const surplus = state.hoursInWeek(id, w) - (d.minHoursPerWeek ?? 0);
          if (surplus > donorSurplus) {
            donor = d;
            donorSurplus = surplus;
          }
        }
        if (!donor) continue;
        state.remove(donor.id, slot);
        if (check(prep, emp, slot, state).hard.length === 0) {
          const after = state.hoursInWeek(donor.id, w);
          // Only swap if the donor stays at/above their own minimum.
          if (!donor.minHoursPerWeek || after >= donor.minHoursPerWeek) {
            slot.assignedEmployeeIds = slot.assignedEmployeeIds.map((id) => (id === donor!.id ? emp.id : id));
            state.add(emp.id, slot);
            continue;
          }
        }
        state.add(donor.id, slot);
      }
    }
  }
}

/**
 * Coverage pass: where a coverage rule is short during a shift, swap an assigned person who
 * doesn't count toward it for an eligible person who does. Locked assignments are kept.
 */
function repairCoverage(prep: Prepared, slots: ShiftSlot[], state: AssignmentState, tracker: CoverageTracker): void {
  if (!prep.coverageRules.length) return;
  for (const slot of slots) {
    for (const i of tracker.shortRules(slot)) {
      const rule = prep.coverageRules[i];
      const holders = (prep.available.get(slot.id) ?? []).filter(
        (e) => holds(e, rule.role) && !slot.assignedEmployeeIds.includes(e.id),
      );
      if (!holders.length) continue;
      // Someone to replace: not locked, doesn't count toward this rule.
      const outIds = slot.assignedEmployeeIds.filter((id) => {
        const e = prep.empById.get(id);
        return e && !holds(e, rule.role) && !prep.locked.get(slot.id)?.has(id);
      });
      let swapped = false;
      for (const outId of outIds) {
        state.remove(outId, slot);
        slot.assignedEmployeeIds = slot.assignedEmployeeIds.filter((x) => x !== outId);
        const pick = holders.find((h) => check(prep, h, slot, state).hard.length === 0);
        if (pick) {
          slot.assignedEmployeeIds.push(pick.id);
          state.add(pick.id, slot);
          swapped = true;
          break;
        }
        slot.assignedEmployeeIds.push(outId);
        state.add(outId, slot);
      }
      // Room left on the shift? Just add a holder.
      if (!swapped && slot.assignedEmployeeIds.length < slot.headcount) {
        const pick = holders.find((h) => check(prep, h, slot, state).hard.length === 0);
        if (pick) {
          slot.assignedEmployeeIds.push(pick.id);
          state.add(pick.id, slot);
        }
      }
    }
  }
}

function costOf(prep: Prepared, slots: readonly ShiftSlot[], state: AssignmentState, tracker?: CoverageTracker): number {
  let cost = tracker ? tracker.deficit(slots) * 60 : 0;
  for (const s of slots) cost += Math.max(0, s.headcount - s.assignedEmployeeIds.length) * 1000;
  for (const emp of prep.activeEmployees) {
    const weekly: number[] = [];
    for (let w = 0; w < prep.input.weeks; w++) {
      const h = state.hoursInWeek(emp.id, w);
      weekly.push(h);
      if (emp.minHoursPerWeek && h < emp.minHoursPerWeek) cost += (emp.minHoursPerWeek - h) * 20;
    }
    // Penalize uneven distribution relative to capacity.
    const cap = emp.maxHoursPerWeek || 40;
    for (const h of weekly) cost += (h / cap) ** 2 * 10;
  }
  for (const s of slots) {
    for (const id of s.assignedEmployeeIds) cost -= preferenceScore(prep.prefsByEmp.get(id), s) * 5;
  }
  return cost;
}

function explainGap(prep: Prepared, slot: ShiftSlot, state: AssignmentState): string {
  const avail = (prep.available.get(slot.id) ?? []).filter((e) => !slot.assignedEmployeeIds.includes(e.id));
  if (avail.length === 0) {
    const roleNote = slot.requiredRole ? ` with role "${slot.requiredRole}"` : '';
    return `Nobody${roleNote} is available at this time`;
  }
  const reasons = new Map<string, number>();
  for (const e of avail) {
    for (const r of check(prep, e, slot, state).hard) {
      const key = r.replace(/\(.*\)/, '').trim();
      reasons.set(key, (reasons.get(key) ?? 0) + 1);
    }
  }
  const top = [...reasons.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2);
  return `${avail.length} available but blocked: ${top.map(([r, n]) => `${r} (${n})`).join(', ')}`;
}

/** Order slots most-constrained-first: fewest available employees per open position. */
function orderSlots(prep: Prepared, slots: ShiftSlot[], rng: () => number): ShiftSlot[] {
  const keyed = slots.map((s) => {
    const open = s.headcount - s.assignedEmployeeIds.length;
    const avail = (prep.available.get(s.id)?.length ?? 0) || 0.1;
    // Shifts that matter for a coverage rule go earlier so role holders aren't used up elsewhere.
    const coverage = (prep.slotRules.get(s.id)?.length ?? 0) * 1.5;
    return { s, k: avail / Math.max(open, 1) - coverage + rng() * 0.5 };
  });
  keyed.sort((a, b) => a.k - b.k || (a.s.date < b.s.date ? -1 : a.s.date > b.s.date ? 1 : 0));
  return keyed.map((x) => x.s);
}

export function generateSchedule(input: GenerateInput): GenerateResult {
  const prep = prepare(input);
  const iterations = input.iterations ?? 60;
  const rng = mulberry32(input.seed ?? Date.now());

  let best: { slots: ShiftSlot[]; state: AssignmentState; cost: number } | null = null;
  for (let i = 0; i < iterations; i++) {
    const slots = cloneSlots(input.slots);
    const state = AssignmentState.fromSlots(input.startDate, slots);
    const tracker = CoverageTracker.from(prep, slots);
    state.onChange = (id, slot, delta) => tracker.change(id, slot, delta);
    for (const slot of orderSlots(prep, slots, rng)) fillSlot(prep, slot, state, rng, tracker);
    repairGaps(prep, slots, state, rng);
    balanceMinHours(prep, slots, state);
    repairCoverage(prep, slots, state, tracker);
    const cost = costOf(prep, slots, state, tracker);
    state.onChange = undefined;
    if (!best || cost < best.cost) best = { slots, state, cost };
    if (best.cost <= 0 && i > 5) break;
  }

  const { slots, state, cost } = best!;
  const unfilled: SlotGap[] = [];
  for (const s of slots) {
    const missing = s.headcount - s.assignedEmployeeIds.length;
    if (missing > 0) {
      unfilled.push({ slotId: s.id, date: s.date, name: s.name, missing, reason: explainGap(prep, s, state) });
    }
  }
  const warnings: string[] = [];
  for (const emp of prep.activeEmployees) {
    if (!emp.minHoursPerWeek) continue;
    for (let w = 0; w < input.weeks; w++) {
      const h = state.hoursInWeek(emp.id, w);
      if (h < emp.minHoursPerWeek) {
        warnings.push(`${emp.name}: ${Math.round(h * 10) / 10}h in week ${w + 1} (wanted at least ${emp.minHoursPerWeek}h)`);
      }
    }
  }
  if (prep.activeEmployees.length === 0) warnings.push('There are no active employees.');
  return { slots, unfilled, warnings, cost };
}
