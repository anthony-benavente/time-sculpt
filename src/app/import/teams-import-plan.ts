import {
  Employee,
  IsoDate,
  newId,
  PALETTE,
  Schedule,
  ShiftSlot,
  ShiftTemplate,
  TimeOff,
  Weekday,
} from '../core/models';
import { addDays, daysBetween, prettyDate, startOfWeek, toMinutes, weekdayOf } from '../core/time';
import { TeamsPerson, TeamsTimeOff, TeamsWorkbook } from './teams-shifts';

export interface ImportOptions {
  /** Create a saved schedule from the shifts and open shifts. */
  importSchedule: boolean;
  /** Add people from the file who aren't in your employee list yet. */
  createEmployees: boolean;
  /** Add Teams time off as time-off restrictions. */
  importTimeOff: boolean;
  /** Save each distinct shift (name + times) as a shift template for future generation. */
  createTemplates: boolean;
}

export interface PersonMatch {
  person: TeamsPerson;
  /** Existing employee this person matched, by email first, then by name. */
  existing: Employee | null;
  /** Employee that will be created (when not matched and createEmployees is on). */
  created: Employee | null;
}

export interface ImportPlan {
  people: PersonMatch[];
  newEmployees: Employee[];
  newTemplates: ShiftTemplate[];
  timeOff: TimeOff[];
  schedule: Schedule | null;
  warnings: string[];
  range: { start: IsoDate; end: IsoDate } | null;
}

export interface ImportContext {
  employees: readonly Employee[];
  templates: readonly ShiftTemplate[];
  weekStartsOn: 0 | 1;
}

const personKey = (name: string, email: string) => (email ? email.toLowerCase() : `name:${name.trim().toLowerCase()}`);

export function planTeamsImport(wb: TeamsWorkbook, ctx: ImportContext, opts: ImportOptions): ImportPlan {
  const warnings: string[] = [];

  // ---- people ----
  const byEmail = new Map(ctx.employees.filter((e) => e.email).map((e) => [e.email!.toLowerCase(), e]));
  const byName = new Map(ctx.employees.map((e) => [e.name.trim().toLowerCase(), e]));

  // Most shifts any one person works on a single day (so imported people don't trip "max shifts/day").
  const perDay = new Map<string, number>();
  for (const s of wb.shifts) {
    const k = `${personKey(s.member, s.email)}|${s.startDate}`;
    perDay.set(k, (perDay.get(k) ?? 0) + 1);
  }
  const maxPerDay = new Map<string, number>();
  for (const [k, n] of perDay) {
    const pk = k.slice(0, k.lastIndexOf('|'));
    maxPerDay.set(pk, Math.max(maxPerDay.get(pk) ?? 1, n));
  }

  const resolved = new Map<string, string>(); // personKey -> employee id
  const people: PersonMatch[] = [];
  const newEmployees: Employee[] = [];
  let colorIdx = ctx.employees.length;
  for (const person of wb.people) {
    const existing =
      (person.email && byEmail.get(person.email.toLowerCase())) || byName.get(person.name.trim().toLowerCase()) || null;
    let created: Employee | null = null;
    if (!existing && opts.createEmployees) {
      created = {
        id: newId(),
        name: person.name,
        email: person.email || null,
        color: PALETTE[colorIdx++ % PALETTE.length],
        // Teams "Group" (e.g. Cashiers, Kitchen) is kept as a role.
        roles: [...person.groups].filter(Boolean),
        active: true,
        maxShiftsPerDay: maxPerDay.get(personKey(person.name, person.email)) ?? 1,
        minHoursPerWeek: null,
        maxHoursPerWeek: null,
        maxConsecutiveDays: null,
        minRestHours: null,
        notes: 'Imported from Teams Shifts',
      };
      newEmployees.push(created);
    }
    const emp = existing ?? created;
    if (emp) {
      resolved.set(personKey(person.name, person.email), emp.id);
      // Also resolve by name so rows that only have a name still match.
      resolved.set(personKey(person.name, ''), emp.id);
    }
    people.push({ person, existing, created });
  }
  const resolve = (name: string, email: string) => resolved.get(personKey(name, email)) ?? resolved.get(personKey(name, ''));

  // ---- templates ----
  const tmplKey = (name: string, start: string, end: string) => `${name.trim().toLowerCase()}|${start}|${end}`;
  const existingTmpl = new Map(ctx.templates.map((t) => [tmplKey(t.name, t.start, t.end), t]));
  const patterns = new Map<
    string,
    { name: string; start: string; end: string; color: string | null; weekdays: Set<Weekday>; perDate: Map<IsoDate, number> }
  >();
  const noteShift = (name: string, date: IsoDate, start: string, end: string, color: string | null, count: number) => {
    const k = tmplKey(name, start, end);
    const p = patterns.get(k) ?? { name, start, end, color, weekdays: new Set<Weekday>(), perDate: new Map() };
    p.weekdays.add(weekdayOf(date));
    p.perDate.set(date, (p.perDate.get(date) ?? 0) + count);
    patterns.set(k, p);
  };
  const shiftName = (label: string, group: string) => label || group || 'Shift';
  for (const s of wb.shifts) noteShift(shiftName(s.label, s.group), s.startDate, s.start, s.end, s.color, 1);
  for (const o of wb.openShifts) noteShift(shiftName(o.label, o.group), o.startDate, o.start, o.end, o.color, o.slots);

  const newTemplates: ShiftTemplate[] = [];
  const templateIdFor = new Map<string, string>();
  let tColor = ctx.templates.length + 3;
  for (const [k, p] of [...patterns.entries()].sort((a, b) => toMinutes(a[1].start) - toMinutes(b[1].start))) {
    const existing = existingTmpl.get(k);
    if (existing) {
      templateIdFor.set(k, existing.id);
    } else if (opts.createTemplates) {
      const t: ShiftTemplate = {
        id: newId(),
        name: p.name,
        start: p.start,
        end: p.end,
        weekdays: [...p.weekdays].sort(),
        headcount: Math.max(1, ...p.perDate.values()),
        requiredRole: null,
        color: p.color ?? PALETTE[tColor++ % PALETTE.length],
      };
      newTemplates.push(t);
      templateIdFor.set(k, t.id);
    } else {
      templateIdFor.set(k, `teams:${k}`);
    }
  }

  // ---- schedule ----
  let schedule: Schedule | null = null;
  let range: ImportPlan['range'] = null;
  const dates = [...wb.shifts.map((s) => s.startDate), ...wb.openShifts.map((o) => o.startDate)].sort();
  if (dates.length) range = { start: dates[0], end: dates[dates.length - 1] };

  if (opts.importSchedule && range) {
    const slotMap = new Map<string, ShiftSlot>();
    const slotFor = (name: string, date: IsoDate, start: string, end: string) => {
      const k = `${date}|${tmplKey(name, start, end)}`;
      let slot = slotMap.get(k);
      if (!slot) {
        slot = {
          id: `${date}|${templateIdFor.get(tmplKey(name, start, end))}`,
          date,
          templateId: templateIdFor.get(tmplKey(name, start, end))!,
          name,
          start,
          end,
          headcount: 0,
          requiredRole: null,
          assignedEmployeeIds: [],
          color: patterns.get(tmplKey(name, start, end))?.color ?? null,
        };
        slotMap.set(k, slot);
      }
      return slot;
    };
    let unassigned = 0;
    for (const s of wb.shifts) {
      const slot = slotFor(shiftName(s.label, s.group), s.startDate, s.start, s.end);
      slot.headcount++;
      const id = resolve(s.member, s.email);
      if (id && !slot.assignedEmployeeIds.includes(id)) slot.assignedEmployeeIds.push(id);
      else if (!id) unassigned++;
    }
    for (const o of wb.openShifts) {
      slotFor(shiftName(o.label, o.group), o.startDate, o.start, o.end).headcount += o.slots;
    }
    if (unassigned) {
      warnings.push(
        `${unassigned} shift(s) belong to people who aren't in your employee list; they're left open. Turn on "Add new employees" to keep them assigned.`,
      );
    }
    const start = startOfWeek(range.start, ctx.weekStartsOn);
    const weeks = Math.max(1, Math.ceil((daysBetween(start, range.end) + 1) / 7));
    const now = new Date().toISOString();
    schedule = {
      id: newId(),
      name: `Teams: ${prettyDate(range.start)} – ${prettyDate(range.end)}`,
      startDate: start,
      weeks,
      createdAt: now,
      updatedAt: now,
      source: 'teams',
      notes: 'Imported from Microsoft Teams Shifts',
      slots: [...slotMap.values()].sort((a, b) =>
        a.date === b.date ? toMinutes(a.start) - toMinutes(b.start) : a.date < b.date ? -1 : 1,
      ),
    };
  }

  // ---- time off ----
  const timeOff: TimeOff[] = [];
  if (opts.importTimeOff) {
    let skipped = 0;
    for (const t of wb.timeOff) {
      const id = resolve(t.member, t.email);
      if (!id) {
        skipped++;
        continue;
      }
      timeOff.push(...timeOffToRestrictions(id, t));
    }
    if (skipped) warnings.push(`${skipped} time-off entr${skipped > 1 ? 'ies' : 'y'} skipped for people not in your employee list.`);
  }

  return { people, newEmployees, newTemplates, timeOff, schedule, warnings: [...wb.warnings, ...warnings], range };
}

/**
 * Teams time off is one continuous block (e.g. Fri 13:00 → Mon 09:00). Our TimeOff applies an
 * optional daily window over a date range, so split into: partial first day, full middle days,
 * partial last day.
 */
export function timeOffToRestrictions(employeeId: string, t: TeamsTimeOff): TimeOff[] {
  let { endDate, end } = t;
  const { startDate, start } = t;
  // Ending at midnight means "through the end of the previous day".
  if (end === '00:00' && endDate > startDate) {
    endDate = addDays(endDate, -1);
    end = '24:00';
  }
  const make = (from: IsoDate, to: IsoDate, s: string | null, e: string | null): TimeOff => ({
    id: newId(),
    employeeId,
    type: 'time-off',
    startDate: from,
    endDate: to,
    start: s,
    end: e,
    reason: t.reason || undefined,
  });
  const full = (s: string, e: string) => s === '00:00' && (e === '24:00' || e === '23:59');

  if (startDate === endDate) {
    return [full(start, end) ? make(startDate, endDate, null, null) : make(startDate, endDate, start, end === '24:00' ? '24:00' : end)];
  }
  const out: TimeOff[] = [];
  let firstFull = startDate;
  if (start !== '00:00') {
    out.push(make(startDate, startDate, start, '24:00'));
    firstFull = addDays(startDate, 1);
  }
  let lastFull = endDate;
  const lastPartial = end !== '24:00' && end !== '23:59';
  if (lastPartial) lastFull = addDays(endDate, -1);
  if (firstFull <= lastFull) out.push(make(firstFull, lastFull, null, null));
  if (lastPartial) out.push(make(endDate, endDate, '00:00', end));
  return out;
}
