/**
 * Parse a Microsoft Teams Shifts export ("Export in a format that can be imported").
 *
 * Workbook sheets (matched by their header row, not their names):
 *  - Shifts:      Member, Work Email, Group, Start Date, Start Time, End Date, End Time,
 *                 Theme Color, Custom Label, Unpaid Break (minutes), Notes, Shared
 *  - Open Shifts: Group, Start Date, Start Time, End Date, End Time, Open Slots, Theme Color,
 *                 Custom Label, Unpaid Break (minutes), Notes, Shared
 *  - Time Off:    Member, Work Email, Start Date, Start Time, End Date, End Time,
 *                 Time Off Reason, Theme Color, Notes, Shared
 *  - Members:     Member, Work Email (read-only list of the team)
 *
 * Pure functions only: no Angular, no I/O.
 */
import { HHmm, IsoDate } from '../core/models';
import { formatDate } from '../core/time';

export type CellValue = string | number | boolean | Date | null | undefined;
export interface RawSheet {
  sheet: string;
  data: CellValue[][];
}

export type DateOrder = 'mdy' | 'dmy';

export interface TeamsShift {
  member: string;
  email: string;
  group: string;
  label: string;
  startDate: IsoDate;
  start: HHmm;
  endDate: IsoDate;
  end: HHmm;
  color: string | null;
  notes: string;
}

export interface TeamsOpenShift {
  group: string;
  label: string;
  startDate: IsoDate;
  start: HHmm;
  endDate: IsoDate;
  end: HHmm;
  slots: number;
  color: string | null;
}

export interface TeamsTimeOff {
  member: string;
  email: string;
  startDate: IsoDate;
  start: HHmm;
  endDate: IsoDate;
  end: HHmm;
  reason: string;
}

export interface TeamsPerson {
  name: string;
  email: string;
  groups: string[];
}

export interface TeamsWorkbook {
  shifts: TeamsShift[];
  openShifts: TeamsOpenShift[];
  timeOff: TeamsTimeOff[];
  people: TeamsPerson[];
  dateOrder: DateOrder;
  /** True when no date in the file proved which of month/day comes first. */
  dateOrderAmbiguous: boolean;
  warnings: string[];
}

/** Teams theme colors -> hex. Exports write them like "2. Blue" or "Blue". */
const THEME_COLORS: Record<string, string> = {
  white: '#94a3b8',
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  pink: '#ec4899',
  yellow: '#f59e0b',
  grey: '#64748b',
  gray: '#64748b',
  darkblue: '#1e40af',
  darkgreen: '#047857',
  darkpurple: '#6d28d9',
  darkpink: '#be185d',
  darkyellow: '#b45309',
};

export function themeColor(v: CellValue): string | null {
  const key = String(v ?? '')
    .replace(/^\s*\d+\s*\.\s*/, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  return THEME_COLORS[key] ?? null;
}

const norm = (s: CellValue) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

type Kind = 'shifts' | 'open' | 'timeoff' | 'members';

function classify(headers: string[]): Kind | null {
  const h = new Set(headers);
  const hasDates = h.has('startdate') && h.has('starttime') && h.has('enddate') && h.has('endtime');
  if (hasDates && h.has('openslots')) return 'open';
  if (hasDates && h.has('timeoffreason')) return 'timeoff';
  if (hasDates && (h.has('workemail') || h.has('member'))) return 'shifts';
  if (!hasDates && (h.has('workemail') || h.has('member'))) return 'members';
  return null;
}

/** Find the header row within the first rows of a sheet. */
function findHeader(data: CellValue[][]): { index: number; headers: string[]; kind: Kind } | null {
  for (let i = 0; i < Math.min(data.length, 10); i++) {
    const headers = (data[i] ?? []).map(norm);
    const kind = classify(headers);
    if (kind) return { index: i, headers, kind };
  }
  return null;
}

// ---------- cell parsing ----------

const pad = (n: number) => String(n).padStart(2, '0');

function excelSerialToIso(serial: number): IsoDate {
  // Excel's day 0 is 1899-12-30 (accounts for the 1900 leap-year bug).
  const ms = Date.UTC(1899, 11, 30) + Math.floor(serial) * 86400000;
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Split a date string into numeric parts; returns null if it isn't a date. */
function dateParts(s: string): { a: number; b: number; y: number; iso?: boolean } | null {
  const t = s.trim();
  let m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(t);
  if (m) return { a: +m[2], b: +m[3], y: +m[1], iso: true };
  m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/.exec(t);
  if (m) {
    let y = +m[3];
    if (y < 100) y += 2000;
    return { a: +m[1], b: +m[2], y };
  }
  return null;
}

export function parseDateCell(v: CellValue, order: DateOrder): IsoDate | null {
  if (v instanceof Date) {
    if (isNaN(v.getTime()) || v.getUTCFullYear() < 1901) return null;
    return `${v.getUTCFullYear()}-${pad(v.getUTCMonth() + 1)}-${pad(v.getUTCDate())}`;
  }
  if (typeof v === 'number') return v > 59 ? excelSerialToIso(v) : null;
  if (typeof v !== 'string' || !v.trim()) return null;
  const p = dateParts(v);
  if (!p) {
    // Last resort: let the browser try ("Nov 16, 2026").
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : formatDate(d);
  }
  const [month, day] = p.iso ? [p.a, p.b] : order === 'mdy' ? [p.a, p.b] : [p.b, p.a];
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${p.y}-${pad(month)}-${pad(day)}`;
}

export function parseTimeCell(v: CellValue): HHmm | null {
  if (v instanceof Date) {
    if (isNaN(v.getTime())) return null;
    return `${pad(v.getUTCHours())}:${pad(v.getUTCMinutes())}`;
  }
  if (typeof v === 'number') {
    // Excel stores times as a fraction of a day (a date-time has an integer part too).
    const frac = v - Math.floor(v);
    const mins = Math.round(frac * 1440) % 1440;
    return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
  }
  if (typeof v !== 'string') return null;
  // Take the time portion even if a date is in front of it.
  const m = /(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*([ap])\.?\s*m?\.?\s*$/i.exec(v.trim()) ?? /(\d{1,2}):(\d{2})(?::\d{2})?\s*$/.exec(v.trim());
  if (!m) return null;
  let h = +m[1];
  const min = m[2] ? +m[2] : 0;
  const ap = m[3]?.toLowerCase();
  if (ap) {
    if (h < 1 || h > 12) return null;
    if (ap === 'a' && h === 12) h = 0;
    if (ap === 'p' && h !== 12) h += 12;
  }
  if (h > 24 || min > 59) return null;
  if (h === 24) h = 0;
  return `${pad(h)}:${pad(min)}`;
}

/** Decide month/day order from string dates: any first part > 12 means day-first. */
function detectDateOrder(cells: CellValue[]): { order: DateOrder; ambiguous: boolean } {
  let dayFirst = false;
  let monthFirst = false;
  for (const c of cells) {
    if (typeof c !== 'string') continue;
    const p = dateParts(c);
    if (!p || p.iso) continue;
    if (p.a > 12) dayFirst = true;
    if (p.b > 12) monthFirst = true;
  }
  if (dayFirst && !monthFirst) return { order: 'dmy', ambiguous: false };
  if (monthFirst && !dayFirst) return { order: 'mdy', ambiguous: false };
  const anyStrings = cells.some((c) => typeof c === 'string' && dateParts(c) && !dateParts(c)!.iso);
  return { order: 'mdy', ambiguous: anyStrings };
}

// ---------- CSV ----------

/** Minimal RFC 4180 CSV parser (quotes, escaped quotes, CRLF). Detects ; or , delimiter. */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, '');
  const firstLine = src.split(/\r?\n/, 1)[0] ?? '';
  const delim = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delim) {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

// ---------- workbook ----------

export function parseTeamsWorkbook(sheets: RawSheet[], forcedOrder?: DateOrder): TeamsWorkbook {
  const warnings: string[] = [];
  const found = sheets
    .map((s) => ({ s, h: findHeader(s.data) }))
    .filter((x): x is { s: RawSheet; h: NonNullable<ReturnType<typeof findHeader>> } => !!x.h);

  if (!found.some((f) => f.h.kind !== 'members')) {
    throw new Error(
      'No Shifts, Open Shifts or Time Off sheet was found. In Teams Shifts, choose Export schedule and turn on "Export in a format that can be imported".',
    );
  }

  // Collect all date cells to decide the date order.
  const dateCells: CellValue[] = [];
  for (const { s, h } of found) {
    const cols = ['startdate', 'enddate'].map((k) => h.headers.indexOf(k)).filter((i) => i >= 0);
    for (const row of s.data.slice(h.index + 1)) for (const c of cols) dateCells.push(row[c]);
  }
  const detected = detectDateOrder(dateCells);
  const order = forcedOrder ?? detected.order;

  const wb: TeamsWorkbook = {
    shifts: [],
    openShifts: [],
    timeOff: [],
    people: [],
    dateOrder: order,
    dateOrderAmbiguous: !forcedOrder && detected.ambiguous,
    warnings,
  };
  const people = new Map<string, TeamsPerson>();
  const addPerson = (name: string, email: string, group?: string) => {
    if (!name && !email) return;
    const key = email ? email.toLowerCase() : `name:${name.toLowerCase()}`;
    const p = people.get(key) ?? { name: name || email.split('@')[0], email, groups: [] };
    if (!p.name && name) p.name = name;
    if (group && !p.groups.includes(group)) p.groups.push(group);
    people.set(key, p);
  };

  for (const { s, h } of found) {
    const col = (k: string) => h.headers.indexOf(k);
    const get = (row: CellValue[], k: string): CellValue => (col(k) >= 0 ? row[col(k)] : null);
    const str = (row: CellValue[], k: string) => String(get(row, k) ?? '').trim();

    s.data.slice(h.index + 1).forEach((row, i) => {
      if (!row || row.every((c) => c == null || String(c).trim() === '')) return;
      const where = `${s.sheet} row ${h.index + i + 2}`;
      if (h.kind === 'members') {
        addPerson(str(row, 'member'), str(row, 'workemail'));
        return;
      }
      const startDate = parseDateCell(get(row, 'startdate'), order);
      const endDate = parseDateCell(get(row, 'enddate'), order);
      const start = parseTimeCell(get(row, 'starttime'));
      const end = parseTimeCell(get(row, 'endtime'));
      if (!startDate || !endDate || !start || !end) {
        warnings.push(`${where}: couldn't read the date or time, skipped.`);
        return;
      }
      if (h.kind === 'shifts') {
        const member = str(row, 'member');
        const email = str(row, 'workemail');
        if (!member && !email) {
          warnings.push(`${where}: no member or email, skipped.`);
          return;
        }
        const group = str(row, 'group');
        addPerson(member, email, group);
        wb.shifts.push({
          member,
          email,
          group,
          label: str(row, 'customlabel'),
          startDate,
          start,
          endDate,
          end,
          color: themeColor(get(row, 'themecolor')),
          notes: str(row, 'notes'),
        });
      } else if (h.kind === 'open') {
        const slots = Math.max(1, Math.floor(Number(get(row, 'openslots')) || 1));
        wb.openShifts.push({
          group: str(row, 'group'),
          label: str(row, 'customlabel'),
          startDate,
          start,
          endDate,
          end,
          slots,
          color: themeColor(get(row, 'themecolor')),
        });
      } else {
        const member = str(row, 'member');
        const email = str(row, 'workemail');
        if (!member && !email) {
          warnings.push(`${where}: no member or email, skipped.`);
          return;
        }
        addPerson(member, email);
        wb.timeOff.push({ member, email, startDate, start, endDate, end, reason: str(row, 'timeoffreason') });
      }
    });
  }

  wb.people = [...people.values()].sort((a, b) => a.name.localeCompare(b.name));
  return wb;
}
