import { emp, tmpl, weekly } from '../testing/fixtures';
import { breakKey, dayTimeline, evaluateCoverage } from './coverage';
import { validateSchedule } from './constraint-checker';
import { CoverageRule, RuleSet, ShiftSlot, Weekday } from './models';
import { resolveEmployees, resolveLimit, resolveRestrictions } from './rule-resolution';
import { defaultRuleSet } from './rules-defaults';
import { generateSchedule, mulberry32 } from '../scheduling/greedy-scheduler';
import { expandTemplates } from '../scheduling/slot-expander';

const MON = '2026-11-16';

const cov = (extra: Partial<CoverageRule>): CoverageRule => ({
  id: 'c',
  type: 'coverage',
  enabled: true,
  severity: 'hard',
  role: 'Manager',
  min: 1,
  days: null,
  from: null,
  to: null,
  appliesTo: ['schedule', 'breaks'],
  ...extra,
});

const withRules = (...rules: RuleSet['rules']): RuleSet => ({ ...defaultRuleSet(), rules });

describe('rule resolution', () => {
  const rs = withRules(
    { id: 'a', type: 'limit', enabled: true, severity: 'hard', scope: { kind: 'everyone' }, limit: 'max-hours-week', value: 40 },
    { id: 'b', type: 'limit', enabled: true, severity: 'hard', scope: { kind: 'role', role: 'Minor' }, limit: 'max-hours-week', value: 20 },
    { id: 'c', type: 'limit', enabled: true, severity: 'hard', scope: { kind: 'role', role: 'Part' }, limit: 'max-hours-week', value: 25 },
    { id: 'd', type: 'limit', enabled: false, severity: 'hard', scope: { kind: 'everyone' }, limit: 'max-consecutive-days', value: 3 },
  );

  it('employee value beats role beats team; strictest role wins', () => {
    expect(resolveLimit(emp('a', { maxHoursPerWeek: 10 }), 'max-hours-week', rs)).toEqual({ value: 10, source: 'employee' });
    expect(resolveLimit(emp('a', { roles: ['Minor', 'Part'] }), 'max-hours-week', rs)).toMatchObject({ value: 20, source: 'role', role: 'Minor' });
    expect(resolveLimit(emp('a'), 'max-hours-week', rs)).toEqual({ value: 40, source: 'team' });
    expect(resolveLimit(emp('a'), 'max-consecutive-days', rs)).toEqual({ value: null, source: 'none' });
    expect(resolveEmployees([emp('a')], rs)[0].maxHoursPerWeek).toBe(40);
  });

  it('expands team/role unavailability into weekly restrictions', () => {
    const r = resolveRestrictions(
      [emp('a', { roles: ['Minor'] }), emp('b')],
      [],
      withRules(
        { id: 'u', type: 'unavailable', enabled: true, severity: 'hard', scope: { kind: 'everyone' }, days: [0], from: null, to: null },
        { id: 'v', type: 'unavailable', enabled: true, severity: 'hard', scope: { kind: 'role', role: 'minor' }, days: null, from: '22:00', to: '24:00' },
      ),
    );
    expect(r.filter((x) => x.employeeId === 'b').length).toBe(1);
    expect(r.filter((x) => x.employeeId === 'a').length).toBe(8);
  });
});

describe('built-in switches', () => {
  const slots: ShiftSlot[] = [
    { id: 's1', date: MON, templateId: 't', name: 'A', start: '09:00', end: '17:00', headcount: 1, assignedEmployeeIds: ['a'] },
    { id: 's2', date: '2026-11-17', templateId: 't', name: 'A', start: '09:00', end: '17:00', headcount: 2, assignedEmployeeIds: ['a'] },
  ];
  const employees = [emp('a', { maxConsecutiveDays: 1 })];

  it('default rule set gives the same result as no rules', () => {
    const plain = validateSchedule({ startDate: MON, weeks: 1, slots }, employees, []);
    const ruled = validateSchedule({ startDate: MON, weeks: 1, slots }, employees, [], defaultRuleSet());
    expect(ruled).toEqual(plain);
  });

  it('soft built-ins become warnings and off built-ins disappear', () => {
    const rs = defaultRuleSet();
    rs.builtIns['max-consecutive-days'] = { enabled: true, severity: 'soft' };
    rs.builtIns['fill-headcount'] = { enabled: false, severity: 'soft' };
    const v = validateSchedule({ startDate: MON, weeks: 1, slots }, employees, [], rs);
    expect(v.some((x) => x.severity === 'error')).toBe(false);
    expect(v.some((x) => x.message.includes('in a row') && x.severity === 'warning')).toBe(true);
    expect(v.some((x) => x.message.includes('needs'))).toBe(false);
  });

  it('never-together is an error when both work the same shift', () => {
    const rs = withRules({ id: 'n', type: 'never-together', enabled: true, severity: 'hard', employeeIds: ['a', 'b'] });
    const v = validateSchedule(
      { startDate: MON, weeks: 1, slots: [{ ...slots[0], headcount: 2, assignedEmployeeIds: ['a', 'b'] }] },
      [emp('a', { name: 'Ann' }), emp('b', { name: 'Bo' })],
      [],
      rs,
    );
    expect(v.filter((x) => x.message.includes("Can't work with")).length).toBe(2);
  });
});

describe('coverage', () => {
  const employees = [emp('m', { roles: ['Manager'] }), emp('x')];
  const slots: ShiftSlot[] = [
    { id: 'early', date: MON, templateId: 't', name: 'Early', start: '07:00', end: '15:00', headcount: 1, assignedEmployeeIds: ['x'] },
    { id: 'late', date: MON, templateId: 't', name: 'Late', start: '12:00', end: '20:00', headcount: 1, assignedEmployeeIds: ['m'] },
  ];

  it('default window = whenever someone is working', () => {
    const v = evaluateCoverage({ dates: [MON], slots, employees, rules: withRules(cov({})), target: 'schedule' });
    expect(v).toHaveLength(1);
    expect(v[0].message).toContain('7a–12p');
    expect(v[0].message).toContain('no Manager');
    expect(v[0].severity).toBe('error');
  });

  it('explicit windows and day filters', () => {
    const rs = withRules(cov({ from: '13:00', to: '14:00' }), cov({ id: 'd', days: [2 as Weekday] }));
    expect(evaluateCoverage({ dates: [MON], slots, employees, rules: rs, target: 'schedule' })).toEqual([]);
  });

  it('people on break do not count when breaks are included', () => {
    const breaks = { [breakKey('late', 'm')]: [{ kind: 'meal' as const, start: '16:00', minutes: 30 }] };
    const rs = withRules(cov({ from: '12:00', to: '20:00' }));
    expect(evaluateCoverage({ dates: [MON], slots, employees, rules: rs, target: 'breaks' })).toEqual([]);
    const v = evaluateCoverage({ dates: [MON], slots, employees, rules: rs, target: 'breaks', breaks });
    expect(v[0].message).toContain('4p–4:30p');
    const tl = dayTimeline(MON, slots, breaks);
    expect(tl.find((t) => t.t === 16 * 60)?.onBreak).toEqual(['m']);
  });
});

describe('scheduler with rules', () => {
  const ALL: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

  it('puts a Manager on every shift window when the rule exists', () => {
    const employees = [
      emp('m1', { roles: ['Manager'] }),
      emp('m2', { roles: ['Manager'] }),
      emp('a'),
      emp('b'),
      emp('c'),
      emp('d'),
    ];
    const templates = [tmpl('open', '07:00', '15:00', ALL, 2), tmpl('close', '15:00', '23:00', ALL, 2)];
    const slots = expandTemplates(MON, 1, templates);
    const rules = withRules(cov({}));
    const res = generateSchedule({ startDate: MON, weeks: 1, slots, employees, restrictions: [], rules, seed: 3 });
    const v = validateSchedule({ startDate: MON, weeks: 1, slots: res.slots }, employees, [], rules);
    expect(v.filter((x) => x.severity === 'error')).toEqual([]);
  });

  it('never breaks never-together or hard rules on random scenarios', () => {
    const rng = mulberry32(7);
    for (let trial = 0; trial < 10; trial++) {
      const employees = Array.from({ length: 6 + Math.floor(rng() * 5) }, (_, i) =>
        emp(`e${i}`, { roles: rng() < 0.4 ? ['Manager'] : [], maxHoursPerWeek: rng() < 0.5 ? 32 : null }),
      );
      const rules = withRules(
        cov({ severity: rng() < 0.5 ? 'hard' : 'soft' }),
        { id: 'n', type: 'never-together', enabled: true, severity: 'hard', employeeIds: ['e0', 'e1'] },
        { id: 'l', type: 'limit', enabled: true, severity: 'hard', scope: { kind: 'everyone' }, limit: 'max-consecutive-days', value: 5 },
      );
      const resolved = resolveEmployees(employees, rules);
      const restrictions = resolveRestrictions(resolved, [weekly('e2', 1)], rules);
      const slots = expandTemplates(MON, 2, [tmpl('open', '07:00', '15:00', ALL, 2), tmpl('close', '15:00', '23:00', ALL, 2)]);
      const res = generateSchedule({ startDate: MON, weeks: 2, slots, employees: resolved, restrictions, rules, iterations: 8, seed: trial });
      const errs = validateSchedule({ startDate: MON, weeks: 2, slots: res.slots }, resolved, restrictions, rules).filter(
        (x) => x.severity === 'error' && !x.message.includes('on the floor'),
      );
      expect(errs).toEqual([]);
      for (const s of res.slots) expect(s.assignedEmployeeIds.includes('e0') && s.assignedEmployeeIds.includes('e1')).toBe(false);
    }
  });
});
