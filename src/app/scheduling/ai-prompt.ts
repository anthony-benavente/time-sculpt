import { z } from 'zod';
import { Employee, IsoDate, Restriction, ShiftSlot, ShiftTemplate, WEEKDAY_NAMES } from '../core/models';
import { shiftHours, weekdayOf } from '../core/time';

export const AiScheduleSchema = z.object({
  assignments: z.array(
    z.object({
      slot: z.string().describe('Slot key, e.g. "s12"'),
      employees: z.array(z.string()).describe('Employee keys assigned to this slot, e.g. ["e1","e4"]'),
    }),
  ),
  notes: z.string().describe('Short explanation of any trade-offs, unfilled slots, or rules that could not be met.'),
});
export type AiSchedule = z.infer<typeof AiScheduleSchema>;

export interface AiPrompt {
  system: string;
  user: string;
  slotKeys: Map<string, ShiftSlot>;
  employeeKeys: Map<string, Employee>;
}

export const AI_SYSTEM_PROMPT = `You build staff work schedules for a small business manager.
You receive employees (with roles, hour limits and availability restrictions) and a list of shift slots that need people.
Assign employees to slots and return only the structured JSON.

Hard rules (never break these):
- Only assign an employee to a slot if they are available for the slot's entire time (check weekly unavailability and time off, including overnight shifts).
- If a slot has a required role, only assign employees with that role.
- An employee cannot work overlapping shifts, or more shifts in a day than their maxShiftsPerDay.
- Respect maxHoursPerWeek, maxConsecutiveDays and minRestHours. Weeks are counted in 7-day blocks from the schedule start date.
- Never assign more people to a slot than its headcount. Use only the slot and employee keys given.

Goals, in priority order:
1. Fill every slot to its headcount. If a slot cannot be filled without breaking a hard rule, leave it short and say why in notes.
2. Give each employee at least their minHoursPerWeek where possible.
3. Spread hours fairly relative to each person's capacity.
4. Honor "prefer" and avoid "avoid" preferences.

Keep notes brief: a few sentences at most.`;

function describeRestriction(r: Restriction, templates: Map<string, ShiftTemplate>): string | null {
  switch (r.type) {
    case 'weekly-unavailable':
      return r.start && r.end
        ? `unavailable every ${WEEKDAY_NAMES[r.weekday]} ${r.start}-${r.end}`
        : `unavailable every ${WEEKDAY_NAMES[r.weekday]} (all day)`;
    case 'time-off': {
      const range = r.startDate === r.endDate ? r.startDate : `${r.startDate} to ${r.endDate}`;
      return `time off ${range}${r.start && r.end ? ` ${r.start}-${r.end}` : ' (all day)'}`;
    }
    case 'preference': {
      const parts: string[] = [];
      if (r.weekday != null) parts.push(WEEKDAY_NAMES[r.weekday]);
      if (r.shiftTemplateId) parts.push(`"${templates.get(r.shiftTemplateId)?.name ?? 'unknown'}" shifts`);
      if (!parts.length) return null;
      return `${r.kind === 'prefer' ? 'prefers' : 'would rather avoid'} ${parts.join(' ')}`;
    }
  }
}

export function buildAiPrompt(args: {
  startDate: IsoDate;
  weeks: number;
  slots: readonly ShiftSlot[];
  employees: readonly Employee[];
  restrictions: readonly Restriction[];
  templates: readonly ShiftTemplate[];
  extraInstructions?: string;
}): AiPrompt {
  const tmplById = new Map(args.templates.map((t) => [t.id, t]));
  const employeeKeys = new Map<string, Employee>();
  const empKeyById = new Map<string, string>();
  args.employees
    .filter((e) => e.active)
    .forEach((e, i) => {
      const key = `e${i + 1}`;
      employeeKeys.set(key, e);
      empKeyById.set(e.id, key);
    });

  const employees = [...employeeKeys.entries()].map(([key, e]) => {
    const rules = args.restrictions
      .filter((r) => r.employeeId === e.id)
      .map((r) => describeRestriction(r, tmplById))
      .filter((x): x is string => !!x);
    const row: Record<string, unknown> = { key, name: e.name, roles: e.roles, maxShiftsPerDay: e.maxShiftsPerDay || 1 };
    if (e.minHoursPerWeek) row['minHoursPerWeek'] = e.minHoursPerWeek;
    if (e.maxHoursPerWeek) row['maxHoursPerWeek'] = e.maxHoursPerWeek;
    if (e.maxConsecutiveDays) row['maxConsecutiveDays'] = e.maxConsecutiveDays;
    if (e.minRestHours) row['minRestHours'] = e.minRestHours;
    if (rules.length) row['restrictions'] = rules;
    return row;
  });

  const slotKeys = new Map<string, ShiftSlot>();
  const slots = args.slots.map((s, i) => {
    const key = `s${i + 1}`;
    slotKeys.set(key, s);
    const row: Record<string, unknown> = {
      key,
      date: s.date,
      day: WEEKDAY_NAMES[weekdayOf(s.date)],
      shift: s.name,
      time: `${s.start}-${s.end}`,
      hours: Math.round(shiftHours(s.start, s.end) * 100) / 100,
      headcount: s.headcount,
    };
    if (s.requiredRole) row['requiredRole'] = s.requiredRole;
    const locked = s.assignedEmployeeIds.map((id) => empKeyById.get(id)).filter(Boolean);
    if (locked.length) row['alreadyAssigned'] = locked;
    return row;
  });

  const user = [
    `Schedule start: ${args.startDate} (${WEEKDAY_NAMES[weekdayOf(args.startDate)]}), ${args.weeks} week(s).`,
    '',
    'Employees:',
    JSON.stringify(employees),
    '',
    'Slots to fill (keep any alreadyAssigned employees and include them in your answer):',
    JSON.stringify(slots),
    args.extraInstructions?.trim() ? `\nAdditional instructions from the manager:\n${args.extraInstructions.trim()}` : '',
  ].join('\n');

  return { system: AI_SYSTEM_PROMPT, user, slotKeys, employeeKeys };
}

export interface AppliedAiResult {
  slots: ShiftSlot[];
  notes: string;
  /** Keys in the AI answer that didn't match anything, or were dropped (duplicates, over headcount). */
  problems: string[];
}

/** Map the AI's key-based answer back onto real slots. Unknown keys are reported, not trusted. */
export function applyAiResult(prompt: AiPrompt, result: AiSchedule): AppliedAiResult {
  const problems: string[] = [];
  const assigned = new Map<string, string[]>();
  for (const a of result.assignments) {
    const slot = prompt.slotKeys.get(a.slot);
    if (!slot) {
      problems.push(`Unknown slot "${a.slot}" ignored`);
      continue;
    }
    const list = assigned.get(slot.id) ?? [];
    for (const key of a.employees) {
      const emp = prompt.employeeKeys.get(key);
      if (!emp) {
        problems.push(`Unknown employee "${key}" on ${slot.name} ${slot.date} ignored`);
        continue;
      }
      if (list.includes(emp.id)) continue;
      list.push(emp.id);
    }
    assigned.set(slot.id, list);
  }
  const slots = [...prompt.slotKeys.values()].map((s) => {
    let ids = assigned.get(s.id) ?? [...s.assignedEmployeeIds];
    // Never drop locked employees.
    for (const locked of s.assignedEmployeeIds) if (!ids.includes(locked)) ids.unshift(locked);
    if (ids.length > s.headcount) {
      problems.push(`${s.name} ${s.date}: AI assigned ${ids.length} for ${s.headcount} spots; extras removed`);
      ids = ids.slice(0, s.headcount);
    }
    return { ...s, assignedEmployeeIds: ids };
  });
  return { slots, notes: result.notes, problems };
}
