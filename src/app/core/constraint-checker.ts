import { evaluateCoverage } from './coverage';
import {
  BuiltInId,
  Employee,
  IsoDate,
  Restriction,
  RuleSet,
  Schedule,
  Severity,
  ShiftSlot,
  Violation,
  WEEKDAY_NAMES,
} from './models';
import {
  absoluteRange,
  addDays,
  daysBetween,
  prettyDate,
  rangesOverlap,
  shiftHours,
  weekdayOf,
  windowOverlapsShift,
} from './time';

/** One shift an employee is working, in absolute minutes from the schedule epoch. */
export interface WorkedShift {
  slotId: string;
  date: IsoDate;
  range: [number, number];
  hours: number;
}

/**
 * Tracks who is assigned where, for fast incremental constraint checks.
 * All ranges are absolute minutes relative to `epoch` (the schedule start date).
 */
export class AssignmentState {
  private readonly byEmployee = new Map<string, WorkedShift[]>();
  private readonly weekHours = new Map<string, number>();

  /** Optional hook, called after every add (+1) / remove (-1). Used for coverage tracking. */
  onChange?: (employeeId: string, slot: ShiftSlot, delta: 1 | -1) => void;

  constructor(readonly epoch: IsoDate) {}

  static fromSlots(epoch: IsoDate, slots: ShiftSlot[]): AssignmentState {
    const state = new AssignmentState(epoch);
    for (const slot of slots) {
      for (const empId of slot.assignedEmployeeIds) state.add(empId, slot);
    }
    return state;
  }

  clone(): AssignmentState {
    const c = new AssignmentState(this.epoch);
    for (const [k, v] of this.byEmployee) c.byEmployee.set(k, [...v]);
    for (const [k, v] of this.weekHours) c.weekHours.set(k, v);
    return c;
  }

  weekIndex(date: IsoDate): number {
    return Math.floor(daysBetween(this.epoch, date) / 7);
  }

  toWorked(slot: ShiftSlot): WorkedShift {
    return {
      slotId: slot.id,
      date: slot.date,
      range: absoluteRange(this.epoch, slot.date, slot.start, slot.end),
      hours: shiftHours(slot.start, slot.end),
    };
  }

  add(employeeId: string, slot: ShiftSlot): void {
    const w = this.toWorked(slot);
    const list = this.byEmployee.get(employeeId) ?? [];
    list.push(w);
    this.byEmployee.set(employeeId, list);
    const key = `${employeeId}|${this.weekIndex(slot.date)}`;
    this.weekHours.set(key, (this.weekHours.get(key) ?? 0) + w.hours);
    this.onChange?.(employeeId, slot, 1);
  }

  remove(employeeId: string, slot: ShiftSlot): void {
    const list = this.byEmployee.get(employeeId);
    if (!list) return;
    const idx = list.findIndex((w) => w.slotId === slot.id);
    if (idx < 0) return;
    const [w] = list.splice(idx, 1);
    const key = `${employeeId}|${this.weekIndex(slot.date)}`;
    this.weekHours.set(key, (this.weekHours.get(key) ?? 0) - w.hours);
    this.onChange?.(employeeId, slot, -1);
  }

  shiftsFor(employeeId: string): readonly WorkedShift[] {
    return this.byEmployee.get(employeeId) ?? [];
  }

  hoursInWeek(employeeId: string, weekIndex: number): number {
    return this.weekHours.get(`${employeeId}|${weekIndex}`) ?? 0;
  }

  totalHours(employeeId: string): number {
    return this.shiftsFor(employeeId).reduce((s, w) => s + w.hours, 0);
  }

  isAssigned(employeeId: string, slotId: string): boolean {
    return this.shiftsFor(employeeId).some((w) => w.slotId === slotId);
  }
}

export interface CheckResult {
  ok: boolean;
  reasons: string[];
}

/** Hard-availability check: role, active, weekly unavailability, time off. Independent of other assignments. */
export function availabilityReasons(
  employee: Employee,
  slot: ShiftSlot,
  restrictions: readonly Restriction[],
): string[] {
  const reasons: string[] = [];
  if (!employee.active) reasons.push('Inactive');
  if (slot.requiredRole && !employee.roles.includes(slot.requiredRole)) {
    reasons.push(`Missing role "${slot.requiredRole}"`);
  }
  // An overnight shift or overnight window can cross days, so check the day before and after too.
  const nearby = [addDays(slot.date, -1), slot.date, addDays(slot.date, 1)];
  for (const r of restrictions) {
    if (r.type === 'weekly-unavailable') {
      for (const d of nearby) {
        if (weekdayOf(d) !== r.weekday) continue;
        if (windowOverlapsShift(d, r.start, r.end, slot.date, slot.start, slot.end)) {
          reasons.push('Unavailable (weekly availability)');
          break;
        }
      }
    } else if (r.type === 'time-off') {
      for (const d of nearby) {
        if (d < r.startDate || d > r.endDate) continue;
        if (windowOverlapsShift(d, r.start, r.end, slot.date, slot.start, slot.end)) {
          reasons.push(`Time off${r.reason ? ` (${r.reason})` : ''}`);
          break;
        }
      }
    }
  }
  return reasons;
}

/** Longest run of consecutive worked dates that includes `date`, given a set of worked dates. */
function consecutiveRun(dates: Set<IsoDate>, date: IsoDate): number {
  let run = 1;
  let d = addDays(date, -1);
  while (dates.has(d)) {
    run++;
    d = addDays(d, -1);
  }
  d = addDays(date, 1);
  while (dates.has(d)) {
    run++;
    d = addDays(d, 1);
  }
  return run;
}

/**
 * Can `employee` be added to `slot` given the current state?
 * `state` must NOT already contain this assignment.
 */
export function canAssign(
  employee: Employee,
  slot: ShiftSlot,
  restrictions: readonly Restriction[],
  state: AssignmentState,
  rules?: RuleSet | null,
  names?: Map<string, string>,
): CheckResult & { soft: string[] } {
  const reasons = availabilityReasons(employee, slot, restrictions);
  const w = workloadCheck(employee, slot, state, rules, names);
  reasons.push(...w.hard);
  return { ok: reasons.length === 0, reasons, soft: w.soft };
}

/** How a built-in rule applies: 'off', 'hard' or 'soft'. No rule set = today's behavior (hard). */
export function builtIn(rules: RuleSet | null | undefined, id: BuiltInId): 'off' | Severity {
  const s = rules?.builtIns?.[id];
  if (!s) return id === 'min-hours-week' || id === 'fill-headcount' || id === 'no-overfill' || id === 'preferences' ? 'soft' : 'hard';
  return s.enabled ? s.severity : 'off';
}

/** Hard-blocking workload reasons only (what the scheduler must not break). */
export function workloadReasons(
  employee: Employee,
  slot: ShiftSlot,
  state: AssignmentState,
  rules?: RuleSet | null,
  names?: Map<string, string>,
): string[] {
  return workloadCheck(employee, slot, state, rules, names).hard;
}

/** Checks that depend on the employee's other assignments, split by severity. */
export function workloadCheck(
  employee: Employee,
  slot: ShiftSlot,
  state: AssignmentState,
  rules?: RuleSet | null,
  names?: Map<string, string>,
): { hard: string[]; soft: string[] } {
  const hard: string[] = [];
  const soft: string[] = [];
  const put = (sev: 'off' | Severity, msg: string) => {
    if (sev === 'hard') hard.push(msg);
    else if (sev === 'soft') soft.push(msg);
  };
  const shifts = state.shiftsFor(employee.id);
  if (shifts.some((w) => w.slotId === slot.id)) {
    hard.push('Already on this shift');
    return { hard, soft };
  }
  const w = state.toWorked(slot);

  if (shifts.some((s) => rangesOverlap(s.range, w.range))) {
    hard.push('Overlaps another shift');
  }

  const sameDay = shifts.filter((s) => s.date === slot.date).length;
  const maxPerDay = employee.maxShiftsPerDay || 1;
  if (sameDay + 1 > maxPerDay) {
    put(builtIn(rules, 'max-shifts-day'), `Max ${maxPerDay} shift${maxPerDay > 1 ? 's' : ''}/day`);
  }

  if (employee.maxHoursPerWeek != null && employee.maxHoursPerWeek > 0) {
    const hrs = state.hoursInWeek(employee.id, state.weekIndex(slot.date)) + w.hours;
    if (hrs > employee.maxHoursPerWeek + 1e-9) {
      put(builtIn(rules, 'max-hours-week'), `Would exceed ${employee.maxHoursPerWeek}h/week (${round1(hrs)}h)`);
    }
  }

  if (employee.maxConsecutiveDays != null && employee.maxConsecutiveDays > 0) {
    const dates = new Set(shifts.map((s) => s.date));
    if (!dates.has(slot.date)) {
      const run = consecutiveRun(dates, slot.date);
      if (run > employee.maxConsecutiveDays) {
        put(builtIn(rules, 'max-consecutive-days'), `Would work ${run} days in a row (max ${employee.maxConsecutiveDays})`);
      }
    }
  }

  if (employee.minRestHours != null && employee.minRestHours > 0) {
    const minGap = employee.minRestHours * 60;
    const tooClose = shifts.some((s) => {
      if (rangesOverlap(s.range, w.range)) return false; // reported above
      const gap = s.range[1] <= w.range[0] ? w.range[0] - s.range[1] : s.range[0] - w.range[1];
      return gap < minGap;
    });
    if (tooClose) put(builtIn(rules, 'min-rest'), `Less than ${employee.minRestHours}h rest between shifts`);
  }

  for (const rule of rules?.rules ?? []) {
    if (rule.type !== 'never-together' || !rule.enabled || !rule.employeeIds.includes(employee.id)) continue;
    const partner = slot.assignedEmployeeIds.find((id) => id !== employee.id && rule.employeeIds.includes(id));
    if (partner) put(rule.severity, `Can't work with ${names?.get(partner) ?? 'a listed partner'}`);
  }
  return { hard, soft };
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function groupRestrictions(restrictions: readonly Restriction[]): Map<string, Restriction[]> {
  const map = new Map<string, Restriction[]>();
  for (const r of restrictions) {
    const list = map.get(r.employeeId) ?? [];
    list.push(r);
    map.set(r.employeeId, list);
  }
  return map;
}

/** Validate a whole schedule. Returns errors (hard rule breaks) and warnings (coverage, min hours). */
export function validateSchedule(
  schedule: Pick<Schedule, 'startDate' | 'weeks' | 'slots'>,
  employees: readonly Employee[],
  restrictions: readonly Restriction[],
  rules?: RuleSet | null,
): Violation[] {
  const violations: Violation[] = [];
  const empById = new Map(employees.map((e) => [e.id, e]));
  const names = new Map(employees.map((e) => [e.id, e.name]));
  const restrByEmp = groupRestrictions(restrictions);
  const full = AssignmentState.fromSlots(schedule.startDate, schedule.slots);
  const sev = (s: Severity): Violation['severity'] => (s === 'hard' ? 'error' : 'warning');
  const fill = builtIn(rules, 'fill-headcount');
  const overfill = builtIn(rules, 'no-overfill');

  for (const slot of schedule.slots) {
    const assigned = slot.assignedEmployeeIds;
    if (assigned.length < slot.headcount && fill !== 'off') {
      violations.push({
        slotId: slot.id,
        severity: sev(fill),
        message: `${slot.name} on ${when(slot.date)} needs ${slot.headcount - assigned.length} more`,
      });
    } else if (assigned.length > slot.headcount && overfill !== 'off') {
      violations.push({
        slotId: slot.id,
        severity: sev(overfill),
        message: `${slot.name} on ${when(slot.date)} has ${assigned.length - slot.headcount} extra`,
      });
    }
    const seen = new Set<string>();
    for (const empId of assigned) {
      const emp = empById.get(empId);
      if (!emp) {
        violations.push({ slotId: slot.id, employeeId: empId, severity: 'error', message: 'Unknown employee' });
        continue;
      }
      if (seen.has(empId)) {
        violations.push({
          slotId: slot.id,
          employeeId: empId,
          severity: 'error',
          message: `${emp.name} is listed twice on ${slot.name} ${when(slot.date)}`,
        });
        continue;
      }
      seen.add(empId);
      // Check this assignment against everything else.
      const state = full.clone();
      state.remove(empId, slot);
      const check = workloadCheck(emp, slot, state, rules, names);
      const notWeekly = (r: string) => !r.startsWith('Would exceed');
      const reasons: [string, Violation['severity']][] = [
        ...availabilityReasons(emp, slot, restrByEmp.get(empId) ?? []).map((r) => [r, 'error'] as [string, 'error']),
        ...check.hard.filter(notWeekly).map((r) => [r, 'error'] as [string, 'error']),
        ...check.soft.filter(notWeekly).map((r) => [r, 'warning'] as [string, 'warning']),
      ];
      for (const [reason, severity] of reasons) {
        violations.push({
          slotId: slot.id,
          employeeId: empId,
          severity,
          message: `${emp.name} – ${slot.name} ${when(slot.date)}: ${reason}`,
        });
      }
    }
  }

  // Weekly hour limits are reported once per employee per week rather than per slot.
  const maxH = builtIn(rules, 'max-hours-week');
  const minH = builtIn(rules, 'min-hours-week');
  for (const emp of employees) {
    if (!emp.active) continue;
    for (let w = 0; w < schedule.weeks; w++) {
      const hrs = full.hoursInWeek(emp.id, w);
      const firstSlotInWeek = schedule.slots.find(
        (s) => s.assignedEmployeeIds.includes(emp.id) && full.weekIndex(s.date) === w,
      );
      if (maxH !== 'off' && emp.maxHoursPerWeek && hrs > emp.maxHoursPerWeek + 1e-9) {
        violations.push({
          slotId: firstSlotInWeek?.id ?? '',
          employeeId: emp.id,
          severity: sev(maxH),
          message: `${emp.name} works ${round1(hrs)}h in week ${w + 1} (max ${emp.maxHoursPerWeek}h)`,
        });
      }
      if (minH !== 'off' && emp.minHoursPerWeek && hrs < emp.minHoursPerWeek - 1e-9) {
        violations.push({
          slotId: firstSlotInWeek?.id ?? '',
          employeeId: emp.id,
          severity: sev(minH),
          message: `${emp.name} has ${round1(hrs)}h in week ${w + 1} (min ${emp.minHoursPerWeek}h)`,
        });
      }
    }
  }

  // Custom coverage rules ("at least 1 Manager on the floor").
  if (rules) {
    const dates = Array.from({ length: schedule.weeks * 7 }, (_, i) => addDays(schedule.startDate, i));
    violations.push(...evaluateCoverage({ dates, slots: schedule.slots, employees, rules, target: 'schedule' }));
  }

  return violations;
}

/** "Mon Nov 16" */
function when(date: IsoDate): string {
  return `${WEEKDAY_NAMES[weekdayOf(date)]} ${prettyDate(date)}`;
}
