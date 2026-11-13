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
  maxShiftsPerDay: number;
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
