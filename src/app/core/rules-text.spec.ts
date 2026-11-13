import { emp, tmpl, timeOff, weekly } from '../testing/fixtures';
import { Restriction, RuleSet } from './models';
import { defaultRuleSet, normalizeRuleSet } from './rules-defaults';
import { formatConfig, formatDays, parseConfig, parseDays, parseTime, planApply } from './rules-text';

const TODAY = '2026-11-13';
const employees = [
  emp('riley', { name: 'Riley Novak', roles: ['Cashier'], maxHoursPerWeek: 16 }),
  emp('sam', { name: 'Sam Patel', roles: ['Cashier'] }),
  emp('alex', { name: 'Alex Rivera', roles: ['Manager', 'Keyholder'], minRestHours: 10 }),
];
const templates = [tmpl('close', '15:00', '23:00', [1, 2, 3, 4, 5], 1)];
templates[0].name = 'Close';
const restrictions: Restriction[] = [
  weekly('riley', 1, '00:00', '16:00'),
  weekly('riley', 2, '00:00', '16:00'),
  weekly('riley', 3, '00:00', '16:00'),
  weekly('riley', 0),
  { ...timeOff('sam', '2026-11-18', '2026-11-20'), reason: 'Vacation' } as Restriction,
  timeOff('sam', '2026-12-03', '2026-12-03', '09:00', '13:00'),
  timeOff('sam', '2026-01-02', '2026-01-02'), // past
  { id: 'p1', employeeId: 'alex', type: 'preference', kind: 'prefer', weekday: null, shiftTemplateId: 'close' },
  { id: 'p2', employeeId: 'alex', type: 'preference', kind: 'avoid', weekday: 6, shiftTemplateId: null },
];
const ctx = { employees, restrictions, templates, today: TODAY };

function richRuleSet(): RuleSet {
  const rs = defaultRuleSet();
  rs.builtIns['max-consecutive-days'] = { enabled: true, severity: 'soft' };
  rs.builtIns['preferences'] = { enabled: false, severity: 'soft' };
  rs.rules.push(
    { id: 'c1', type: 'coverage', enabled: true, severity: 'hard', role: 'Manager', min: 1, days: null, from: null, to: null, appliesTo: ['schedule', 'breaks'] },
    { id: 'c2', type: 'coverage', enabled: true, severity: 'soft', role: 'Cashier', min: 2, days: [1, 2, 3, 4, 5], from: '11:00', to: '14:00', appliesTo: ['schedule'] },
    { id: 'c3', type: 'coverage', enabled: false, severity: 'hard', role: null, min: 3, days: [0, 6], from: null, to: null, appliesTo: ['breaks'] },
    { id: 'n1', type: 'never-together', enabled: true, severity: 'hard', employeeIds: ['sam', 'riley'] },
    { id: 'l1', type: 'limit', enabled: true, severity: 'hard', scope: { kind: 'everyone' }, limit: 'max-consecutive-days', value: 5 },
    { id: 'l2', type: 'limit', enabled: true, severity: 'hard', scope: { kind: 'role', role: 'Keyholder' }, limit: 'max-shifts-day', value: 1 },
    { id: 'u1', type: 'unavailable', enabled: true, severity: 'hard', scope: { kind: 'everyone' }, days: [0], from: null, to: null },
    { id: 'u2', type: 'unavailable', enabled: true, severity: 'hard', scope: { kind: 'role', role: 'Cashier' }, days: null, from: '22:00', to: '24:00' },
    { id: 'b1', type: 'break-blackout', enabled: true, severity: 'hard', from: '12:00', to: '13:00', days: [0, 6] },
  );
  return rs;
}

/** Strip ids so structures can be compared. */
const noIds = <T>(x: T): T => JSON.parse(JSON.stringify(x, (k, v) => (k === 'id' ? undefined : v)));
/** Rule order follows the text's sections, so compare rules order-insensitively. */
const sortKeys = (x: unknown): unknown =>
  Array.isArray(x) ? x.map(sortKeys) : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, sortKeys(v)])) : x;
const canon = (rs: RuleSet) => ({ ...noIds(rs), rules: noIds(rs.rules).map((r) => JSON.stringify(sortKeys(r))).sort() });

describe('days and times', () => {
  it('parses day lists, ranges and keywords', () => {
    expect(parseDays('Mon-Fri').days).toEqual([1, 2, 3, 4, 5]);
    expect(parseDays('weekends').days).toEqual([0, 6]);
    expect(parseDays('Fri-Mon').days).toEqual([0, 1, 5, 6]);
    expect(parseDays('Mon, Wed and Fri').days).toEqual([1, 3, 5]);
    expect(parseDays('every day').days).toBeNull();
    expect(parseDays('Fir').error).toContain('Fir');
  });

  it('formats days compactly', () => {
    expect(formatDays([1, 2, 3, 4, 5])).toBe('Mon-Fri');
    expect(formatDays([0, 6])).toBe('weekends');
    expect(formatDays([1, 3])).toBe('Mon, Wed');
    expect(formatDays(null)).toBe('');
  });

  it('parses times', () => {
    expect(parseTime('7a')).toBe('07:00');
    expect(parseTime('7:30pm')).toBe('19:30');
    expect(parseTime('24:00')).toBe('24:00');
    expect(parseTime('25:00')).toBeNull();
  });
});

describe('formatConfig / parseConfig', () => {
  it('round-trips every rule type, built-ins and break policy', () => {
    const rs = richRuleSet();
    const text = formatConfig(rs, ctx);
    const parsed = parseConfig(text, ctx);
    expect(parsed.errors).toEqual([]);
    expect(canon(parsed.config.ruleSet)).toEqual(canon(rs));
  });

  it('round-trips people lines', () => {
    const text = formatConfig(defaultRuleSet(), ctx);
    expect(text).toContain('Riley Novak: max 16 hours per week');
    expect(text).toContain('Riley Novak: unavailable Mon-Wed until 16:00');
    expect(text).toContain('Riley Novak: unavailable Sun');
    expect(text).toContain('Sam Patel: time off Nov 18 to Nov 20 (Vacation)');
    expect(text).toContain('Sam Patel: time off Dec 3 09:00-13:00');
    expect(text).not.toContain('Jan 2'); // past time off hidden
    expect(text).toContain('Alex Rivera: prefers Close');
    expect(text).toContain('Alex Rivera: avoids Sat');

    const { config, errors } = parseConfig(text, ctx);
    expect(errors).toEqual([]);
    const riley = config.people.get('riley')!;
    expect(riley.limits).toEqual({ 'max-hours-week': 16, 'max-shifts-day': 1 });
    expect(riley.restrictions.filter((r) => r.type === 'weekly-unavailable').length).toBe(4);
    const sam = config.people.get('sam')!;
    expect(sam.restrictions).toEqual([
      expect.objectContaining({ type: 'time-off', startDate: '2026-11-18', endDate: '2026-11-20', reason: 'Vacation' }),
      expect.objectContaining({ type: 'time-off', startDate: '2026-12-03', start: '09:00', end: '13:00' }),
    ]);
    expect(config.people.get('alex')!.limits).toEqual({ 'min-rest-hours': 10, 'max-shifts-day': 1 });
  });

  it('reports errors with line numbers and suggestions', () => {
    const text = ['# comment', 'at least 1 Manager on the floor Fir', 'Sam Pate: time off Nov 20', 'gibberish here'].join('\n');
    const { errors } = parseConfig(text, ctx);
    expect(errors.map((e) => e.line)).toEqual([2, 3, 4]);
    expect(errors[0].message).toContain('Fir');
    expect(errors[1].message).toContain('did you mean Sam Patel');
  });

  it('warns about unknown roles', () => {
    const { warnings, errors } = parseConfig('at least 1 Supervisor on the floor', ctx);
    expect(errors).toEqual([]);
    expect(warnings[0].message).toContain('Supervisor');
  });

  it('refuses to change locked rules', () => {
    expect(parseConfig('[locked] no overlapping shifts', ctx).errors).toEqual([]);
    expect(parseConfig('[locked] anything goes', ctx).errors.length).toBe(1);
  });

  it('reads natural variants', () => {
    const { config, errors } = parseConfig(
      [
        'at least 2 people on the floor weekends 10am-4pm (soft)',
        'Keyholder: max 1 shift per day',
        'Riley Novak: unavailable weekdays after 9pm',
        'Riley Novak: time off 2027-01-05',
        'Sam Patel: prefers Close on Fri',
        'breaks for shifts 6h+: rest 10, lunch 30',
      ].join('\n'),
      ctx,
    );
    expect(errors).toEqual([]);
    expect(config.ruleSet.rules[0]).toMatchObject({ type: 'coverage', role: null, min: 2, days: [0, 6], from: '10:00', to: '16:00', severity: 'soft' });
    expect(config.people.get('riley')!.restrictions[0]).toMatchObject({ weekday: 1, start: '21:00', end: '24:00' });
    expect(config.people.get('sam')!.restrictions[0]).toMatchObject({ kind: 'prefer', weekday: 5, shiftTemplateId: 'close' });
    expect(config.ruleSet.breakPolicy.tiers).toEqual([{ minShiftHours: 6, breaks: [{ kind: 'rest', minutes: 10 }, { kind: 'meal', minutes: 30 }] }]);
  });
});

describe('planApply', () => {
  it('replaces mentioned people exactly, keeps past time off, leaves others alone', () => {
    const text = ['Sam Patel: max 20 hours per week', 'Sam Patel: time off Dec 24'].join('\n');
    const { config } = parseConfig(text, ctx);
    const plan = planApply(config, defaultRuleSet(), ctx);
    expect(plan.employeePatches.get('sam')).toMatchObject({ maxHoursPerWeek: 20, minRestHours: null });
    expect(plan.employeePatches.has('riley')).toBe(false);
    const sam = plan.restrictions.filter((r) => r.employeeId === 'sam');
    expect(sam.map((r) => (r.type === 'time-off' ? r.startDate : r.type)).sort()).toEqual(['2026-01-02', '2026-12-24']);
    expect(plan.restrictions.filter((r) => r.employeeId === 'riley').length).toBe(4);
    expect(plan.summary.some((s) => s.startsWith('Sam Patel'))).toBe(true);
  });

  it('keeps ids of unchanged rules', () => {
    const rs = richRuleSet();
    const { config } = parseConfig(formatConfig(rs, ctx), ctx);
    const plan = planApply(config, rs, ctx);
    expect(plan.ruleSet.rules.map((r) => r.id).sort()).toEqual(rs.rules.map((r) => r.id).sort());
  });
});

describe('default break lengths', () => {
  it('defaults meals to 45 minutes and round-trips the setting', () => {
    const rs = defaultRuleSet();
    expect(rs.breakPolicy.defaultMealMinutes).toBe(45);
    expect(rs.breakPolicy.tiers.flatMap((t) => t.breaks).filter((b) => b.kind === 'meal').every((b) => b.minutes === 45)).toBe(true);
    const text = formatConfig(rs, ctx);
    expect(text).toContain('default meal length 45 min');
    const { config, errors } = parseConfig(text, ctx);
    expect(errors).toEqual([]);
    expect(config.ruleSet.breakPolicy).toEqual(rs.breakPolicy);
  });

  it('uses the default when a tier leaves out the length', () => {
    const { config, errors } = parseConfig('default meal length 40 min\nbreaks for shifts 6h+: rest, meal', ctx);
    expect(errors).toEqual([]);
    expect(config.ruleSet.breakPolicy.tiers[0].breaks).toEqual([
      { kind: 'rest', minutes: 15 },
      { kind: 'meal', minutes: 40 },
    ]);
  });

  it('upgrades rules saved before the setting existed (30-min meals become 45)', () => {
    const old = defaultRuleSet();
    const legacy = {
      ...old,
      breakPolicy: {
        tiers: [{ minShiftHours: 6, breaks: [{ kind: 'rest' as const, minutes: 15 }, { kind: 'meal' as const, minutes: 30 }] }],
        noBreakFirstMinutes: 60,
        noBreakLastMinutes: 60,
        minGapMinutes: 60,
        stepMinutes: 15,
      },
    };
    const rs = normalizeRuleSet(legacy as unknown as RuleSet);
    expect(rs.breakPolicy.defaultMealMinutes).toBe(45);
    expect(rs.breakPolicy.tiers[0].breaks[1].minutes).toBe(45);
    // Already-configured policies are left alone.
    const custom = defaultRuleSet();
    custom.breakPolicy.defaultMealMinutes = 30;
    expect(normalizeRuleSet(custom).breakPolicy.defaultMealMinutes).toBe(30);
  });
});
