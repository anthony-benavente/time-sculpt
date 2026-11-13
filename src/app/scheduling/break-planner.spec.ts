import { breakKey } from '../core/coverage';
import { CoverageRule, RuleSet, ShiftSlot } from '../core/models';
import { BREAK_PRESETS, defaultRuleSet } from '../core/rules-defaults';
import { toMinutes } from '../core/time';
import { emp } from '../testing/fixtures';
import { planBreaks, requiredBreaks, validateBreaks } from './break-planner';

const MON = '2026-11-16';
const slot = (id: string, start: string, end: string, ids: string[]): ShiftSlot => ({
  id,
  date: MON,
  templateId: 't',
  name: id,
  start,
  end,
  headcount: ids.length,
  assignedEmployeeIds: ids,
});
const managerRule: CoverageRule = {
  id: 'm',
  type: 'coverage',
  enabled: true,
  severity: 'hard',
  role: 'Manager',
  min: 1,
  days: null,
  from: null,
  to: null,
  appliesTo: ['breaks'],
};
const rules = (...extra: RuleSet['rules']): RuleSet => ({ ...defaultRuleSet(), rules: extra });

describe('requiredBreaks', () => {
  const p = BREAK_PRESETS.retail.policy;
  it('picks the highest tier that applies', () => {
    expect(requiredBreaks(3.5, p)).toEqual([]);
    expect(requiredBreaks(5, p).map((b) => b.kind)).toEqual(['rest']);
    expect(requiredBreaks(7, p).map((b) => b.kind)).toEqual(['rest', 'meal']);
    expect(requiredBreaks(8, p).map((b) => b.kind)).toEqual(['rest', 'meal', 'rest']);
    expect(requiredBreaks(8, BREAK_PRESETS.simpleLunch.policy).map((b) => b.kind)).toEqual(['meal']);
  });
});

describe('planBreaks', () => {
  it('keeps breaks inside the window, ordered, spaced, with the meal mid-shift', () => {
    const slots = [slot('a', '07:00', '15:00', ['x'])];
    const { breaks, warnings } = planBreaks({ date: MON, slots, employees: [emp('x')], rules: rules() });
    expect(warnings).toEqual([]);
    const list = breaks[breakKey('a', 'x')];
    expect(list.map((b) => b.kind)).toEqual(['rest', 'meal', 'rest']);
    const starts = list.map((b) => toMinutes(b.start));
    expect(starts[0]).toBeGreaterThanOrEqual(8 * 60);
    expect(starts[2] + 15).toBeLessThanOrEqual(14 * 60);
    expect(starts[1]).toBeGreaterThan(10 * 60);
    expect(starts[1]).toBeLessThan(12 * 60 + 30);
    expect(starts[1] - (starts[0] + 15)).toBeGreaterThanOrEqual(60);
    expect(validateBreaks({ date: MON, slots, employees: [emp('x')], rules: rules(), breaks })).toEqual([]);
  });

  it('staggers people on the same shift', () => {
    const slots = [slot('a', '07:00', '15:00', ['x', 'y', 'z'])];
    const { breaks } = planBreaks({ date: MON, slots, employees: [emp('x'), emp('y'), emp('z')], rules: rules() });
    const meals = ['x', 'y', 'z'].map((id) => toMinutes(breaks[breakKey('a', id)].find((b) => b.kind === 'meal')!.start));
    for (let i = 0; i < meals.length; i++)
      for (let j = i + 1; j < meals.length; j++) expect(Math.abs(meals[i] - meals[j])).toBeGreaterThanOrEqual(30);
  });

  it('never has both managers on break at once with "Manager min 1"', () => {
    const employees = [emp('m1', { roles: ['Manager'] }), emp('m2', { roles: ['Manager'] })];
    const slots = [slot('a', '07:00', '15:00', ['m1', 'm2'])];
    const rs = rules(managerRule);
    const { breaks, warnings } = planBreaks({ date: MON, slots, employees, rules: rs });
    expect(warnings).toEqual([]);
    expect(validateBreaks({ date: MON, slots, employees, rules: rs, breaks }).filter((v) => v.severity === 'error')).toEqual([]);
  });

  it('warns (does not crash) when a lone manager must take breaks', () => {
    const slots = [slot('a', '07:00', '15:00', ['m1'])];
    const { breaks, warnings } = planBreaks({ date: MON, slots, employees: [emp('m1', { roles: ['Manager'] })], rules: rules(managerRule) });
    expect(breaks[breakKey('a', 'm1')].length).toBe(3);
    expect(warnings.some((w) => w.includes('no Manager'))).toBe(true);
  });

  it('respects blackout windows', () => {
    const slots = [slot('a', '09:00', '17:00', ['x'])];
    const rs = rules({ id: 'b', type: 'break-blackout', enabled: true, severity: 'hard', from: '12:00', to: '14:00', days: null });
    const { breaks } = planBreaks({ date: MON, slots, employees: [emp('x')], rules: rs });
    for (const b of breaks[breakKey('a', 'x')]) {
      const s = toMinutes(b.start);
      expect(s + b.minutes <= 12 * 60 || s >= 14 * 60).toBe(true);
    }
  });

  it('keeps existing breaks when asked', () => {
    const slots = [slot('a', '07:00', '15:00', ['x', 'y'])];
    const existing = { [breakKey('a', 'x')]: [{ kind: 'meal' as const, start: '11:00', minutes: 30 }] };
    const { breaks } = planBreaks({ date: MON, slots, employees: [emp('x'), emp('y')], rules: rules(), existing, keepExisting: true });
    expect(breaks[breakKey('a', 'x')]).toEqual(existing[breakKey('a', 'x')]);
    expect(breaks[breakKey('a', 'y')].length).toBe(3);
  });

  it('handles overnight shifts', () => {
    const slots = [slot('n', '22:00', '06:00', ['x'])];
    const { breaks, warnings } = planBreaks({ date: MON, slots, employees: [emp('x')], rules: rules() });
    expect(warnings).toEqual([]);
    expect(breaks[breakKey('n', 'x')].length).toBe(3);
    expect(validateBreaks({ date: MON, slots, employees: [emp('x')], rules: rules(), breaks })).toEqual([]);
  });
});

describe('validateBreaks', () => {
  it('flags missing, out-of-shift, overlapping and too-many-at-once breaks', () => {
    const slots = [slot('a', '07:00', '15:00', ['x', 'y', 'z'])];
    const employees = [emp('x', { name: 'X' }), emp('y', { name: 'Y' }), emp('z', { name: 'Z' })];
    const rs = rules({ id: 'cap', type: 'max-on-break', enabled: true, severity: 'soft', max: 1, days: null, from: null, to: null });
    const breaks = {
      [breakKey('a', 'x')]: [
        { kind: 'rest' as const, start: '06:00', minutes: 15 },
        { kind: 'meal' as const, start: '11:00', minutes: 30 },
        { kind: 'rest' as const, start: '11:15', minutes: 15 },
      ],
      [breakKey('a', 'y')]: [{ kind: 'meal' as const, start: '11:00', minutes: 30 }],
    };
    const msgs = validateBreaks({ date: MON, slots, employees, rules: rs, breaks }).map((v) => v.message);
    expect(msgs.some((m) => m.includes('outside the shift'))).toBe(true);
    expect(msgs.some((m) => m.includes('overlaps another break'))).toBe(true);
    expect(msgs.some((m) => m.includes('Y') && m.includes('missing 2 rest'))).toBe(true);
    expect(msgs.some((m) => m.includes('Z') && m.includes('none planned'))).toBe(true);
    expect(msgs.some((m) => m.includes('people on break at'))).toBe(true);
  });
});

describe('default meal length', () => {
  it('plans 45-minute meals with the default rules', () => {
    const slots = [slot('a', '07:00', '15:00', ['x'])];
    const { breaks } = planBreaks({ date: MON, slots, employees: [emp('x')], rules: rules() });
    expect(breaks[breakKey('a', 'x')].find((b) => b.kind === 'meal')?.minutes).toBe(45);
  });
});
