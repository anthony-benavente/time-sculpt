import { validateSchedule } from '../core/constraint-checker';
import { Employee, Restriction, Weekday } from '../core/models';
import { emp, timeOff, tmpl, weekly } from '../testing/fixtures';
import { generateSchedule, mulberry32 } from './greedy-scheduler';
import { expandTemplates } from './slot-expander';

const START = '2026-11-16'; // Monday
const ALL: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

describe('expandTemplates', () => {
  it('creates one slot per template per matching day', () => {
    const slots = expandTemplates(START, 2, [tmpl('open', '07:00', '15:00', [1, 2, 3, 4, 5]), tmpl('sun', '10:00', '16:00', [0])]);
    expect(slots.length).toBe(12);
    expect(slots[0].date).toBe(START);
    expect(new Set(slots.map((s) => s.id)).size).toBe(12);
  });
});

describe('generateSchedule', () => {
  it('fills everything when it is feasible, without breaking rules', () => {
    const employees = [emp('a', { maxHoursPerWeek: 40 }), emp('b', { maxHoursPerWeek: 40 }), emp('c', { maxHoursPerWeek: 40 })];
    const templates = [tmpl('day', '09:00', '17:00', ALL, 2)];
    const slots = expandTemplates(START, 1, templates);
    const result = generateSchedule({ startDate: START, weeks: 1, slots, employees, restrictions: [], seed: 1 });
    expect(result.unfilled).toEqual([]);
    expect(validateSchedule({ startDate: START, weeks: 1, slots: result.slots }, employees, []).filter((v) => v.severity === 'error')).toEqual([]);
  });

  it('honors roles and availability', () => {
    const employees = [emp('k', { roles: ['Keyholder'] }), emp('x'), emp('y')];
    const restrictions = [weekly('x', 1), timeOff('y', '2026-11-17', '2026-11-17')];
    const templates = [tmpl('open', '07:00', '15:00', [1, 2, 3], 1, 'Keyholder'), tmpl('mid', '10:00', '18:00', [1, 2, 3], 1)];
    const slots = expandTemplates(START, 1, templates);
    const result = generateSchedule({ startDate: START, weeks: 1, slots, employees, restrictions, seed: 2 });
    for (const s of result.slots) {
      if (s.name === 'open') expect(s.assignedEmployeeIds).toEqual(['k']);
      if (s.date === '2026-11-16') expect(s.assignedEmployeeIds).not.toContain('x');
      if (s.date === '2026-11-17') expect(s.assignedEmployeeIds).not.toContain('y');
    }
    expect(result.unfilled).toEqual([]);
  });

  it('reports gaps with a reason when infeasible', () => {
    const employees = [emp('a')];
    const templates = [tmpl('open', '07:00', '15:00', [1], 1, 'Keyholder')];
    const slots = expandTemplates(START, 1, templates);
    const result = generateSchedule({ startDate: START, weeks: 1, slots, employees, restrictions: [], seed: 3 });
    expect(result.unfilled.length).toBe(1);
    expect(result.unfilled[0].reason).toContain('Keyholder');
  });

  it('gives employees their minimum hours when possible', () => {
    const employees = [emp('a', { minHoursPerWeek: 32 }), emp('b'), emp('c'), emp('d')];
    const templates = [tmpl('day', '09:00', '17:00', [1, 2, 3, 4, 5], 1)];
    const slots = expandTemplates(START, 1, templates);
    const result = generateSchedule({ startDate: START, weeks: 1, slots, employees, restrictions: [], seed: 4 });
    const aShifts = result.slots.filter((s) => s.assignedEmployeeIds.includes('a')).length;
    expect(aShifts).toBeGreaterThanOrEqual(4);
    expect(result.warnings).toEqual([]);
  });

  it('keeps existing (locked) assignments', () => {
    const employees = [emp('a'), emp('b')];
    const slots = expandTemplates(START, 1, [tmpl('day', '09:00', '17:00', [1, 2], 1)]);
    slots[0].assignedEmployeeIds = ['b'];
    const result = generateSchedule({ startDate: START, weeks: 1, slots, employees, restrictions: [], seed: 5 });
    expect(result.slots[0].assignedEmployeeIds).toEqual(['b']);
    expect(result.slots[1].assignedEmployeeIds.length).toBe(1);
  });

  it('never breaks hard rules on random scenarios (property test)', () => {
    const rng = mulberry32(42);
    const pick = <T>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
    for (let trial = 0; trial < 15; trial++) {
      const employees: Employee[] = Array.from({ length: 4 + Math.floor(rng() * 8) }, (_, i) =>
        emp(`e${i}`, {
          roles: rng() < 0.4 ? ['Keyholder'] : [],
          maxHoursPerWeek: pick([null, 16, 24, 32, 40]),
          minHoursPerWeek: pick([null, null, 8, 16]),
          maxConsecutiveDays: pick([null, 3, 5]),
          minRestHours: pick([null, 8, 10]),
          maxShiftsPerDay: pick([1, 1, 2]),
          active: rng() > 0.1,
        }),
      );
      const restrictions: Restriction[] = [];
      for (const e of employees) {
        if (rng() < 0.5) restrictions.push(weekly(e.id, Math.floor(rng() * 7) as Weekday));
        if (rng() < 0.3) restrictions.push(weekly(e.id, Math.floor(rng() * 7) as Weekday, '00:00', '12:00'));
        if (rng() < 0.2) restrictions.push(timeOff(e.id, '2026-11-18', '2026-11-20'));
      }
      const templates = [
        tmpl('open', '07:00', '15:00', ALL, 1, rng() < 0.5 ? 'Keyholder' : undefined),
        tmpl('mid', '11:00', '19:00', [1, 2, 3, 4, 5], 1 + Math.floor(rng() * 2)),
        tmpl('close', '15:00', '23:00', ALL, 1 + Math.floor(rng() * 2)),
        tmpl('night', '22:00', '06:00', [5, 6], 1),
      ];
      const weeks = 1 + Math.floor(rng() * 3);
      const slots = expandTemplates(START, weeks, templates);
      const result = generateSchedule({ startDate: START, weeks, slots, employees, restrictions, iterations: 10, seed: trial });
      const errors = validateSchedule({ startDate: START, weeks, slots: result.slots }, employees, restrictions).filter(
        (v) => v.severity === 'error',
      );
      expect(errors).toEqual([]);
      for (const s of result.slots) expect(s.assignedEmployeeIds.length).toBeLessThanOrEqual(s.headcount);
    }
  });

  it('generates 4 weeks for 20 employees quickly', () => {
    const employees = Array.from({ length: 20 }, (_, i) => emp(`e${i}`, { maxHoursPerWeek: 40, minHoursPerWeek: 16, minRestHours: 10, maxConsecutiveDays: 5 }));
    const templates = [
      tmpl('open', '06:00', '14:00', ALL, 3),
      tmpl('mid', '10:00', '18:00', ALL, 2),
      tmpl('close', '14:00', '22:00', ALL, 3),
    ];
    const slots = expandTemplates(START, 4, templates);
    const t0 = performance.now();
    const result = generateSchedule({ startDate: START, weeks: 4, slots, employees, restrictions: [], seed: 9 });
    const ms = performance.now() - t0;
    expect(result.unfilled).toEqual([]);
    expect(ms).toBeLessThan(5000);
  });
});
