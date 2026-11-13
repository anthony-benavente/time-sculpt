import { IsoDate, ShiftSlot, ShiftTemplate } from '../core/models';
import { addDays, toMinutes, weekdayOf } from '../core/time';

/** Expand shift templates into concrete slots for [startDate, startDate + weeks*7). */
export function expandTemplates(startDate: IsoDate, weeks: number, templates: readonly ShiftTemplate[]): ShiftSlot[] {
  const slots: ShiftSlot[] = [];
  const sorted = [...templates].sort((a, b) => toMinutes(a.start) - toMinutes(b.start) || a.name.localeCompare(b.name));
  for (let i = 0; i < weeks * 7; i++) {
    const date = addDays(startDate, i);
    const wd = weekdayOf(date);
    for (const t of sorted) {
      if (!t.weekdays.includes(wd) || t.headcount <= 0) continue;
      slots.push({
        id: `${date}|${t.id}`,
        date,
        templateId: t.id,
        name: t.name,
        start: t.start,
        end: t.end,
        headcount: t.headcount,
        requiredRole: t.requiredRole || null,
        assignedEmployeeIds: [],
      });
    }
  }
  return slots;
}

/** Sort slots chronologically. */
export function sortSlots(slots: ShiftSlot[]): ShiftSlot[] {
  return slots.sort((a, b) => (a.date === b.date ? toMinutes(a.start) - toMinutes(b.start) : a.date < b.date ? -1 : 1));
}
