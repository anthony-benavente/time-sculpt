import { emp, slot, timeOff, weekly } from '../testing/fixtures';
import { AssignmentState, canAssign, validateSchedule } from './constraint-checker';

// 2026-11-16 is a Monday.
const MON = '2026-11-16';
const TUE = '2026-11-17';

describe('canAssign', () => {
  it('allows a simple assignment', () => {
    const state = new AssignmentState(MON);
    expect(canAssign(emp('a'), slot(MON, '09:00', '17:00'), [], state).ok).toBe(true);
  });

  it('rejects inactive employees and missing roles', () => {
    const state = new AssignmentState(MON);
    expect(canAssign(emp('a', { active: false }), slot(MON, '09:00', '17:00'), [], state).reasons).toContain('Inactive');
    const r = canAssign(emp('a'), slot(MON, '09:00', '17:00', { requiredRole: 'Keyholder' }), [], state);
    expect(r.ok).toBe(false);
    expect(r.reasons[0]).toContain('Keyholder');
    expect(canAssign(emp('a', { roles: ['Keyholder'] }), slot(MON, '09:00', '17:00', { requiredRole: 'Keyholder' }), [], state).ok).toBe(true);
  });

  it('respects weekly unavailability (whole day and partial)', () => {
    const state = new AssignmentState(MON);
    const s = slot(MON, '09:00', '17:00');
    expect(canAssign(emp('a'), s, [weekly('a', 1)], state).ok).toBe(false);
    expect(canAssign(emp('a'), s, [weekly('a', 1, '17:00', '24:00')], state).ok).toBe(true);
    expect(canAssign(emp('a'), s, [weekly('a', 1, '16:00', '24:00')], state).ok).toBe(false);
    expect(canAssign(emp('a'), s, [weekly('a', 2)], state).ok).toBe(true);
  });

  it('catches overnight shifts that run into an unavailable day', () => {
    const state = new AssignmentState(MON);
    const overnight = slot(MON, '22:00', '06:00');
    expect(canAssign(emp('a'), overnight, [weekly('a', 2)], state).ok).toBe(false);
  });

  it('respects time off (full and partial day)', () => {
    const state = new AssignmentState(MON);
    expect(canAssign(emp('a'), slot(TUE, '09:00', '17:00'), [timeOff('a', MON, TUE)], state).ok).toBe(false);
    expect(canAssign(emp('a'), slot(TUE, '09:00', '12:00'), [timeOff('a', TUE, TUE, '13:00', '15:00')], state).ok).toBe(true);
    expect(canAssign(emp('a'), slot(TUE, '09:00', '14:00'), [timeOff('a', TUE, TUE, '13:00', '15:00')], state).ok).toBe(false);
  });

  it('rejects overlapping shifts and enforces max shifts per day', () => {
    const a = emp('a', { maxShiftsPerDay: 2 });
    const s1 = slot(MON, '09:00', '13:00');
    const state = AssignmentState.fromSlots(MON, [{ ...s1, assignedEmployeeIds: ['a'] }]);
    expect(canAssign(a, slot(MON, '12:00', '16:00'), [], state).reasons).toContain('Overlaps another shift');
    expect(canAssign(a, slot(MON, '14:00', '18:00'), [], state).ok).toBe(true);
    expect(canAssign(emp('a'), slot(MON, '14:00', '18:00'), [], state).reasons[0]).toContain('Max 1 shift/day');
  });

  it('enforces max hours per week', () => {
    const a = emp('a', { maxHoursPerWeek: 10 });
    const state = AssignmentState.fromSlots(MON, [{ ...slot(MON, '09:00', '17:00'), assignedEmployeeIds: ['a'] }]);
    expect(canAssign(a, slot(TUE, '09:00', '11:00'), [], state).ok).toBe(true);
    expect(canAssign(a, slot(TUE, '09:00', '12:00'), [], state).ok).toBe(false);
    // Next week is a fresh budget.
    expect(canAssign(a, slot('2026-11-23', '09:00', '17:00'), [], state).ok).toBe(true);
  });

  it('enforces max consecutive days, counting days on both sides', () => {
    const a = emp('a', { maxConsecutiveDays: 3 });
    const days = ['2026-11-16', '2026-11-17', '2026-11-19', '2026-11-20'];
    const state = AssignmentState.fromSlots(
      MON,
      days.map((d) => ({ ...slot(d, '09:00', '17:00'), assignedEmployeeIds: ['a'] })),
    );
    // Filling Wed would make Mon-Fri = 5 in a row.
    expect(canAssign(a, slot('2026-11-18', '09:00', '17:00'), [], state).ok).toBe(false);
    expect(canAssign(emp('a', { maxConsecutiveDays: 5 }), slot('2026-11-18', '09:00', '17:00'), [], state).ok).toBe(true);
  });

  it('enforces minimum rest between shifts', () => {
    const a = emp('a', { minRestHours: 10 });
    const state = AssignmentState.fromSlots(MON, [{ ...slot(MON, '15:00', '23:00'), assignedEmployeeIds: ['a'] }]);
    expect(canAssign(a, slot(TUE, '07:00', '15:00'), [], state).ok).toBe(false); // 8h rest
    expect(canAssign(a, slot(TUE, '09:00', '17:00'), [], state).ok).toBe(true); // 10h rest
  });
});

describe('validateSchedule', () => {
  it('reports coverage gaps, rule breaks and min-hours shortfalls', () => {
    const employees = [emp('a', { minHoursPerWeek: 20, maxHoursPerWeek: 8 }), emp('b')];
    const slots = [
      { ...slot(MON, '09:00', '17:00', { headcount: 2 }), assignedEmployeeIds: ['a'] },
      { ...slot(TUE, '09:00', '17:00'), assignedEmployeeIds: ['a'] },
      { ...slot('2026-11-18', '09:00', '17:00'), assignedEmployeeIds: ['b'] },
    ];
    const v = validateSchedule({ startDate: MON, weeks: 1, slots }, employees, [weekly('b', 3)]);
    const msgs = v.map((x) => `${x.severity}:${x.message}`);
    expect(msgs.some((m) => m.startsWith('warning') && m.includes('needs 1 more'))).toBe(true);
    expect(msgs.some((m) => m.startsWith('error') && m.includes('16h in week 1 (max 8h)'))).toBe(true);
    expect(msgs.some((m) => m.startsWith('error') && m.includes('B') && m.includes('Unavailable'))).toBe(true);
    expect(msgs.some((m) => m.startsWith('warning') && m.includes('min 20h'))).toBe(true);
  });

  it('returns nothing for a valid, fully staffed schedule', () => {
    const slots = [{ ...slot(MON, '09:00', '17:00'), assignedEmployeeIds: ['a'] }];
    expect(validateSchedule({ startDate: MON, weeks: 1, slots }, [emp('a')], [])).toEqual([]);
  });
});
