import { HHmm, IsoDate, Weekday } from './models';

/** Parse HH:mm to minutes since midnight. */
export function toMinutes(t: HHmm): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function fromMinutes(mins: number): HHmm {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** Duration of a shift in minutes; end <= start means it runs overnight. */
export function shiftMinutes(start: HHmm, end: HHmm): number {
  const s = toMinutes(start);
  let e = toMinutes(end);
  if (e <= s) e += 1440;
  return e - s;
}

export function shiftHours(start: HHmm, end: HHmm): number {
  return shiftMinutes(start, end) / 60;
}

/** Parse an ISO date as a local-time Date at midnight. */
export function parseDate(d: IsoDate): Date {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day);
}

export function formatDate(d: Date): IsoDate {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function addDays(d: IsoDate, n: number): IsoDate {
  const dt = parseDate(d);
  dt.setDate(dt.getDate() + n);
  return formatDate(dt);
}

export function weekdayOf(d: IsoDate): Weekday {
  return parseDate(d).getDay() as Weekday;
}

/** Whole days from a to b (b - a). DST-safe because we round. */
export function daysBetween(a: IsoDate, b: IsoDate): number {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / 86400000);
}

export function today(): IsoDate {
  return formatDate(new Date());
}

/** The date of the first day of the week containing d. */
export function startOfWeek(d: IsoDate, weekStartsOn: 0 | 1): IsoDate {
  const wd = weekdayOf(d);
  const diff = (wd - weekStartsOn + 7) % 7;
  return addDays(d, -diff);
}

/** Next week start on or after d. */
export function nextWeekStart(d: IsoDate, weekStartsOn: 0 | 1): IsoDate {
  const wd = weekdayOf(d);
  const diff = (weekStartsOn - wd + 7) % 7;
  return addDays(d, diff);
}

/** Absolute minute range of a shift on a date, relative to an epoch date. */
export function absoluteRange(
  epoch: IsoDate,
  date: IsoDate,
  start: HHmm,
  end: HHmm,
): [number, number] {
  const base = daysBetween(epoch, date) * 1440;
  const s = base + toMinutes(start);
  return [s, s + shiftMinutes(start, end)];
}

export function rangesOverlap(a: [number, number], b: [number, number]): boolean {
  return a[0] < b[1] && b[0] < a[1];
}

/**
 * Does the time-of-day window [wStart, wEnd) on `date` overlap a shift on `date`?
 * Window with no times = the whole day. Windows can be overnight too.
 */
export function windowOverlapsShift(
  date: IsoDate,
  wStart: HHmm | null | undefined,
  wEnd: HHmm | null | undefined,
  shiftDate: IsoDate,
  sStart: HHmm,
  sEnd: HHmm,
): boolean {
  const epoch = shiftDate;
  const shift = absoluteRange(epoch, shiftDate, sStart, sEnd);
  let win: [number, number];
  if (!wStart || !wEnd) {
    const base = daysBetween(epoch, date) * 1440;
    win = [base, base + 1440];
  } else {
    win = absoluteRange(epoch, date, wStart, wEnd);
  }
  return rangesOverlap(win, shift);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function prettyDate(d: IsoDate): string {
  const dt = parseDate(d);
  return `${MONTHS[dt.getMonth()]} ${dt.getDate()}`;
}

export function prettyTime(t: HHmm): string {
  const m = toMinutes(t);
  const h = Math.floor(m / 60);
  const min = m % 60;
  const suffix = h >= 12 ? 'p' : 'a';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return min === 0 ? `${h12}${suffix}` : `${h12}:${String(min).padStart(2, '0')}${suffix}`;
}

export function prettyRange(start: HHmm, end: HHmm): string {
  return `${prettyTime(start)}–${prettyTime(end)}`;
}
