import { Employee, Restriction, ShiftSlot, ShiftTemplate, Weekday } from '../core/models';

export function emp(id: string, extra: Partial<Employee> = {}): Employee {
  return {
    id,
    name: id.toUpperCase(),
    color: '#000',
    roles: [],
    active: true,
    maxShiftsPerDay: 1,
    ...extra,
  };
}

export function tmpl(id: string, start: string, end: string, weekdays: Weekday[], headcount = 1, requiredRole?: string): ShiftTemplate {
  return { id, name: id, start, end, weekdays, headcount, requiredRole: requiredRole ?? null, color: '#000' };
}

export function slot(date: string, start: string, end: string, extra: Partial<ShiftSlot> = {}): ShiftSlot {
  return {
    id: `${date}|${start}`,
    date,
    templateId: 't',
    name: 'Shift',
    start,
    end,
    headcount: 1,
    assignedEmployeeIds: [],
    ...extra,
  };
}

export function weekly(employeeId: string, weekday: Weekday, start?: string, end?: string): Restriction {
  return { id: `${employeeId}-${weekday}-${start}`, employeeId, type: 'weekly-unavailable', weekday, start, end };
}

export function timeOff(employeeId: string, startDate: string, endDate: string, start?: string, end?: string): Restriction {
  return { id: `${employeeId}-${startDate}`, employeeId, type: 'time-off', startDate, endDate, start, end };
}
