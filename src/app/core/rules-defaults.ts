import { BreakPolicy, BuiltInId, BuiltInSetting, LimitKind, newId, RuleSet } from './models';

export interface BuiltInDef {
  id: BuiltInId;
  /** Text-form phrase, e.g. "max hours per week". */
  phrase: string;
  label: string;
  description: string;
  default: BuiltInSetting;
}

/** Rules the app has always enforced. Switchable, with today's behavior as the default. */
export const BUILT_INS: BuiltInDef[] = [
  {
    id: 'max-hours-week',
    phrase: 'max hours per week',
    label: 'Max hours per week',
    description: "Don't schedule anyone over their weekly hour limit.",
    default: { enabled: true, severity: 'hard' },
  },
  {
    id: 'min-hours-week',
    phrase: 'min hours per week',
    label: 'Min hours per week',
    description: 'Try to give everyone at least their minimum weekly hours.',
    default: { enabled: true, severity: 'soft' },
  },
  {
    id: 'max-shifts-day',
    phrase: 'max shifts per day',
    label: 'Max shifts per day',
    description: 'Limit how many shifts a person works in one day.',
    default: { enabled: true, severity: 'hard' },
  },
  {
    id: 'max-consecutive-days',
    phrase: 'max days in a row',
    label: 'Max days in a row',
    description: 'Limit consecutive working days.',
    default: { enabled: true, severity: 'hard' },
  },
  {
    id: 'min-rest',
    phrase: 'min rest between shifts',
    label: 'Min rest between shifts',
    description: 'Require rest hours between the end of one shift and the start of the next.',
    default: { enabled: true, severity: 'hard' },
  },
  {
    id: 'fill-headcount',
    phrase: 'fill shifts to headcount',
    label: 'Fill every shift',
    description: 'Flag shifts that have fewer people than they need.',
    default: { enabled: true, severity: 'soft' },
  },
  {
    id: 'no-overfill',
    phrase: 'never overfill shifts',
    label: 'Never overfill a shift',
    description: 'Flag shifts that have more people than they need.',
    default: { enabled: true, severity: 'soft' },
  },
  {
    id: 'preferences',
    phrase: 'honor preferences',
    label: 'Honor preferences',
    description: 'Use "prefers" / "avoids" when choosing who works.',
    default: { enabled: true, severity: 'soft' },
  },
];

/** Rules that can never be turned off; shown for reference. */
export const CORE_RULES = [
  'no overlapping shifts',
  'inactive employees are not scheduled',
  'respect time off and availability',
  'respect required shift roles',
];

export const LIMIT_LABELS: Record<LimitKind, string> = {
  'max-hours-week': 'Max hours / week',
  'min-hours-week': 'Min hours / week',
  'max-shifts-day': 'Max shifts / day',
  'max-consecutive-days': 'Max days in a row',
  'min-rest-hours': 'Min rest between shifts (h)',
};

export const BREAK_PRESETS: Record<'retail' | 'california' | 'simpleLunch', { label: string; policy: BreakPolicy }> = {
  retail: {
    label: 'Common retail',
    policy: {
      tiers: [
        { minShiftHours: 4, breaks: [{ kind: 'rest', minutes: 15 }] },
        { minShiftHours: 6, breaks: [{ kind: 'rest', minutes: 15 }, { kind: 'meal', minutes: 45 }] },
        {
          minShiftHours: 8,
          breaks: [
            { kind: 'rest', minutes: 15 },
            { kind: 'meal', minutes: 45 },
            { kind: 'rest', minutes: 15 },
          ],
        },
      ],
      defaultMealMinutes: 45,
      defaultRestMinutes: 15,
      noBreakFirstMinutes: 60,
      noBreakLastMinutes: 60,
      minGapMinutes: 60,
      stepMinutes: 15,
    },
  },
  california: {
    label: 'California-style',
    policy: {
      tiers: [
        { minShiftHours: 3.5, breaks: [{ kind: 'rest', minutes: 10 }] },
        {
          minShiftHours: 6,
          breaks: [
            { kind: 'rest', minutes: 10 },
            { kind: 'meal', minutes: 30 },
            { kind: 'rest', minutes: 10 },
          ],
        },
        {
          minShiftHours: 10,
          breaks: [
            { kind: 'rest', minutes: 10 },
            { kind: 'meal', minutes: 30 },
            { kind: 'rest', minutes: 10 },
            { kind: 'meal', minutes: 30 },
            { kind: 'rest', minutes: 10 },
          ],
        },
      ],
      defaultMealMinutes: 30,
      defaultRestMinutes: 10,
      noBreakFirstMinutes: 60,
      noBreakLastMinutes: 30,
      minGapMinutes: 45,
      stepMinutes: 15,
    },
  },
  simpleLunch: {
    label: 'Simple lunch',
    policy: {
      tiers: [{ minShiftHours: 6, breaks: [{ kind: 'meal', minutes: 45 }] }],
      defaultMealMinutes: 45,
      defaultRestMinutes: 15,
      noBreakFirstMinutes: 120,
      noBreakLastMinutes: 120,
      minGapMinutes: 0,
      stepMinutes: 15,
    },
  },
};

export function defaultBuiltIns(): Record<BuiltInId, BuiltInSetting> {
  return Object.fromEntries(BUILT_INS.map((b) => [b.id, { ...b.default }])) as Record<BuiltInId, BuiltInSetting>;
}

/** Out of the box this behaves exactly like the app did before rules existed. */
export function defaultRuleSet(): RuleSet {
  return {
    version: 1,
    builtIns: defaultBuiltIns(),
    rules: [
      {
        id: newId(),
        type: 'max-on-break',
        enabled: true,
        severity: 'soft',
        max: 2,
        days: null,
        from: null,
        to: null,
      },
    ],
    breakPolicy: structuredClone(BREAK_PRESETS.retail.policy),
  };
}

/** Fill in anything missing from a stored (possibly older) rule set. */
export function normalizeRuleSet(stored: Partial<RuleSet> | null | undefined): RuleSet {
  const base = defaultRuleSet();
  if (!stored) return base;
  let breakPolicy: BreakPolicy = { ...base.breakPolicy, ...(stored.breakPolicy ?? {}) };
  // Saved before meal length was configurable: meals were 30 min; the default is now 45.
  if (stored.breakPolicy && stored.breakPolicy.defaultMealMinutes == null) {
    breakPolicy = {
      ...breakPolicy,
      defaultMealMinutes: 45,
      defaultRestMinutes: stored.breakPolicy.defaultRestMinutes ?? 15,
      tiers: breakPolicy.tiers.map((t) => ({
        ...t,
        breaks: t.breaks.map((b) => (b.kind === 'meal' && b.minutes === 30 ? { ...b, minutes: 45 } : b)),
      })),
    };
  }
  return {
    version: 1,
    builtIns: { ...base.builtIns, ...(stored.builtIns ?? {}) },
    rules: Array.isArray(stored.rules) ? stored.rules : base.rules,
    breakPolicy,
  };
}
