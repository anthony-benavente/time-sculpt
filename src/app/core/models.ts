/** ISO date string, yyyy-mm-dd */
export type IsoDate = string;
/** 24h time string, HH:mm */
export type HHmm = string;
/** 0 = Sunday ... 6 = Saturday (same as Date.getDay()) */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Employee {
  id: string;
  name: string;
  /** Work email; used to match people when importing from Microsoft Teams Shifts. */
  email?: string | null;
  color: string;
  roles: string[];
  active: boolean;
  minHoursPerWeek?: number | null;
  maxHoursPerWeek?: number | null;
  /** Max shifts on a single calendar day. Defaults to 1. */
  maxShiftsPerDay?: number | null;
  maxConsecutiveDays?: number | null;
  /** Minimum hours of rest between the end of one shift and the start of the next. */
  minRestHours?: number | null;
  notes?: string;
}

export interface WeeklyUnavailable {
  id: string;
  employeeId: string;
  type: 'weekly-unavailable';
  weekday: Weekday;
  /** If start/end are omitted the whole day is blocked. */
  start?: HHmm | null;
  end?: HHmm | null;
}

export interface TimeOff {
  id: string;
  employeeId: string;
  type: 'time-off';
  startDate: IsoDate;
  endDate: IsoDate;
  /** Optional partial-day window (applies to every day in the range). */
  start?: HHmm | null;
  end?: HHmm | null;
  reason?: string;
}

export interface Preference {
  id: string;
  employeeId: string;
  type: 'preference';
  kind: 'prefer' | 'avoid';
  weekday?: Weekday | null;
  shiftTemplateId?: string | null;
}

export type Restriction = WeeklyUnavailable | TimeOff | Preference;

export interface ShiftTemplate {
  id: string;
  name: string;
  start: HHmm;
  /** May be earlier than start for overnight shifts. */
  end: HHmm;
  weekdays: Weekday[];
  headcount: number;
  requiredRole?: string | null;
  color: string;
}

export interface ShiftSlot {
  id: string;
  date: IsoDate;
  templateId: string;
  name: string;
  start: HHmm;
  end: HHmm;
  headcount: number;
  requiredRole?: string | null;
  assignedEmployeeIds: string[];
  /** Overrides the template color (e.g. Teams theme color for imported shifts). */
  color?: string | null;
}

export type ScheduleSource = 'algorithm' | 'ai' | 'manual' | 'teams';

export interface Schedule {
  id: string;
  name: string;
  startDate: IsoDate;
  weeks: number;
  createdAt: string;
  updatedAt: string;
  source: ScheduleSource;
  notes?: string;
  slots: ShiftSlot[];
  /** Planned breaks keyed by `${slotId}|${employeeId}`. */
  breaks?: Record<string, PlannedBreak[]>;
}

// ---------- Breaks ----------

export type BreakKind = 'rest' | 'meal';

export interface PlannedBreak {
  kind: BreakKind;
  start: HHmm;
  minutes: number;
}

export interface BreakTier {
  minShiftHours: number;
  breaks: { kind: BreakKind; minutes: number }[];
}

export interface BreakPolicy {
  /** The highest tier whose minShiftHours <= shift length applies. */
  tiers: BreakTier[];
  /** Length used for new meal breaks (tiers, presets, "+ Meal"). */
  defaultMealMinutes: number;
  /** Length used for new rest breaks. */
  defaultRestMinutes: number;
  noBreakFirstMinutes: number;
  noBreakLastMinutes: number;
  minGapMinutes: number;
  stepMinutes: number;
}

// ---------- Rules ----------

export type Severity = 'hard' | 'soft';
export type RuleTarget = 'schedule' | 'breaks';

export interface RuleBase {
  id: string;
  enabled: boolean;
  severity: Severity;
}

export type Scope = { kind: 'everyone' } | { kind: 'role'; role: string };

/** "At least N <role> on the floor" during a window. */
export interface CoverageRule extends RuleBase {
  type: 'coverage';
  /** null = anyone */
  role: string | null;
  min: number;
  /** null = every day */
  days: Weekday[] | null;
  /** null = whenever any shift is running that day */
  from: HHmm | null;
  to: HHmm | null;
  appliesTo: RuleTarget[];
}

export interface NeverTogetherRule extends RuleBase {
  type: 'never-together';
  employeeIds: string[];
}

export interface MaxOnBreakRule extends RuleBase {
  type: 'max-on-break';
  max: number;
  days: Weekday[] | null;
  from: HHmm | null;
  to: HHmm | null;
}

export interface BreakBlackoutRule extends RuleBase {
  type: 'break-blackout';
  from: HHmm;
  to: HHmm;
  days: Weekday[] | null;
}

export type LimitKind = 'max-hours-week' | 'min-hours-week' | 'max-shifts-day' | 'max-consecutive-days' | 'min-rest-hours';

/** Team or role default for an employee limit. An employee's own value always wins. */
export interface LimitRule extends RuleBase {
  type: 'limit';
  scope: Scope;
  limit: LimitKind;
  value: number;
}

/** Team or role-wide weekly unavailability (e.g. closed Sundays, minors not after 22:00). */
export interface UnavailableRule extends RuleBase {
  type: 'unavailable';
  scope: Scope;
  days: Weekday[] | null;
  from: HHmm | null;
  to: HHmm | null;
}

export type Rule = CoverageRule | NeverTogetherRule | MaxOnBreakRule | BreakBlackoutRule | LimitRule | UnavailableRule;

export type BuiltInId =
  | 'max-hours-week'
  | 'min-hours-week'
  | 'max-shifts-day'
  | 'max-consecutive-days'
  | 'min-rest'
  | 'fill-headcount'
  | 'no-overfill'
  | 'preferences';

export interface BuiltInSetting {
  enabled: boolean;
  severity: Severity;
}

export interface RuleSet {
  version: 1;
  builtIns: Record<BuiltInId, BuiltInSetting>;
  rules: Rule[];
  breakPolicy: BreakPolicy;
}

export interface AppSettings {
  anthropicApiKey: string;
  aiModel: string;
  /** 0 = Sunday, 1 = Monday */
  weekStartsOn: 0 | 1;
  businessName: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  anthropicApiKey: '',
  aiModel: 'claude-opus-5-5',
  weekStartsOn: 1,
  businessName: 'My Business',
};

export interface Violation {
  slotId: string;
  employeeId?: string;
  severity: 'error' | 'warning';
  message: string;
}

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const WEEKDAY_FULL_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const PALETTE = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#84cc16',
  '#06b6d4',
  '#a855f7',
];

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
