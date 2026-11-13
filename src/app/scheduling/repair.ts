import { AssignmentState, validateSchedule } from '../core/constraint-checker';
import { Employee, IsoDate, Restriction, ShiftSlot } from '../core/models';
import { generateSchedule, GenerateResult } from './greedy-scheduler';

/**
 * Remove every assignment that breaks a hard rule, then fill the gaps with the greedy algorithm.
 * Valid assignments are kept (locked).
 */
export function repairSchedule(args: {
  startDate: IsoDate;
  weeks: number;
  slots: ShiftSlot[];
  employees: readonly Employee[];
  restrictions: readonly Restriction[];
  iterations?: number;
}): GenerateResult & { removed: number } {
  let slots = args.slots.map((s) => ({ ...s, assignedEmployeeIds: [...new Set(s.assignedEmployeeIds)] }));
  const known = new Set(args.employees.map((e) => e.id));
  let removed = 0;

  // Trim over-headcount and unknown employees.
  for (const s of slots) {
    const before = s.assignedEmployeeIds.length;
    s.assignedEmployeeIds = s.assignedEmployeeIds.filter((id) => known.has(id)).slice(0, s.headcount);
    removed += before - s.assignedEmployeeIds.length;
  }

  // Repeatedly drop flagged assignments until no hard errors remain (each pass removes at least one).
  for (let pass = 0; pass < 50; pass++) {
    const errors = validateSchedule({ ...args, slots }, args.employees, args.restrictions).filter(
      (v) => v.severity === 'error' && v.employeeId,
    );
    if (errors.length === 0) break;
    const empById = new Map(args.employees.map((e) => [e.id, e]));
    const toDrop = new Set<string>();
    for (const v of errors) {
      if (v.message.includes('h in week')) {
        // Weekly max exceeded: drop that employee's last shift in that week.
        const emp = empById.get(v.employeeId!);
        const state = AssignmentState.fromSlots(args.startDate, slots);
        const target = slots.find((x) => x.id === v.slotId);
        if (!emp || !target) continue;
        const wk = state.weekIndex(target.date);
        const mine = slots.filter((x) => x.assignedEmployeeIds.includes(emp.id) && state.weekIndex(x.date) === wk);
        const last = mine[mine.length - 1];
        if (last) toDrop.add(`${last.id}|${emp.id}`);
      } else {
        toDrop.add(`${v.slotId}|${v.employeeId}`);
      }
    }
    // Only drop one per employee per pass for overlap-type pairs, so we keep one of the two.
    const seenEmp = new Set<string>();
    slots = slots.map((s) => {
      const keep = s.assignedEmployeeIds.filter((id) => {
        const key = `${s.id}|${id}`;
        if (!toDrop.has(key) || seenEmp.has(id)) return true;
        seenEmp.add(id);
        removed++;
        return false;
      });
      return keep.length === s.assignedEmployeeIds.length ? s : { ...s, assignedEmployeeIds: keep };
    });
  }

  const result = generateSchedule({
    startDate: args.startDate,
    weeks: args.weeks,
    slots,
    employees: args.employees,
    restrictions: args.restrictions,
    iterations: args.iterations ?? 30,
  });
  return { ...result, removed };
}
