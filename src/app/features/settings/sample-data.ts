import { Employee, newId, PALETTE, Restriction, ShiftTemplate, Weekday } from '../../core/models';
import { defaultRuleSet } from '../../core/rules-defaults';
import { StorageService } from '../../core/storage.service';
import { addDays, nextWeekStart, today } from '../../core/time';

export function buildSampleData(): { employees: Employee[]; restrictions: Restriction[]; templates: ShiftTemplate[] } {
  const emp = (name: string, i: number, extra: Partial<Employee> = {}): Employee => ({
    id: newId(),
    name,
    color: PALETTE[i % PALETTE.length],
    roles: [],
    active: true,
    maxShiftsPerDay: 1,
    minHoursPerWeek: null,
    maxHoursPerWeek: 40,
    maxConsecutiveDays: 5,
    minRestHours: 10,
    ...extra,
  });
  const employees = [
    emp('Alex Rivera', 0, { roles: ['Keyholder', 'Cashier'], minHoursPerWeek: 32 }),
    emp('Jordan Lee', 1, { roles: ['Keyholder'], minHoursPerWeek: 30 }),
    emp('Sam Patel', 2, { roles: ['Cashier'], maxHoursPerWeek: 24 }),
    emp('Taylor Kim', 3, { roles: ['Cashier', 'Stock'], maxHoursPerWeek: 32 }),
    emp('Morgan Chen', 4, { roles: ['Stock'], maxHoursPerWeek: 20 }),
    emp('Casey Brooks', 5, { roles: ['Keyholder', 'Stock'], maxHoursPerWeek: 40 }),
    emp('Riley Novak', 6, { roles: ['Cashier'], maxHoursPerWeek: 16 }),
    emp('Jamie Ortiz', 7, { roles: ['Keyholder', 'Cashier'], maxHoursPerWeek: 32 }),
  ];
  const [alex, jordan, sam, taylor, morgan, casey, riley] = employees;
  const weekly = (e: Employee, weekday: Weekday, start?: string, end?: string): Restriction => ({
    id: newId(),
    employeeId: e.id,
    type: 'weekly-unavailable',
    weekday,
    start: start ?? null,
    end: end ?? null,
  });
  const start = nextWeekStart(today(), 1);
  const restrictions: Restriction[] = [
    weekly(alex, 0),
    weekly(jordan, 6),
    weekly(sam, 2, '00:00', '15:00'),
    weekly(sam, 4, '00:00', '15:00'),
    weekly(morgan, 1),
    weekly(morgan, 3),
    weekly(riley, 1, '00:00', '16:00'),
    weekly(riley, 2, '00:00', '16:00'),
    weekly(riley, 3, '00:00', '16:00'),
    weekly(riley, 4, '00:00', '16:00'),
    weekly(riley, 5, '00:00', '16:00'),
    {
      id: newId(),
      employeeId: taylor.id,
      type: 'time-off',
      startDate: addDays(start, 2),
      endDate: addDays(start, 4),
      reason: 'Vacation',
    },
  ];
  const tmpl = (name: string, s: string, e: string, weekdays: Weekday[], headcount: number, color: number, role?: string): ShiftTemplate => ({
    id: newId(),
    name,
    start: s,
    end: e,
    weekdays,
    headcount,
    requiredRole: role ?? null,
    color: PALETTE[color],
  });
  const templates = [
    tmpl('Open', '07:00', '15:00', [1, 2, 3, 4, 5, 6], 1, 0, 'Keyholder'),
    tmpl('Morning', '08:00', '14:00', [1, 2, 3, 4, 5, 6, 0], 1, 1),
    tmpl('Close', '15:00', '23:00', [1, 2, 3, 4, 5, 6], 1, 4, 'Keyholder'),
    tmpl('Evening', '16:00', '22:00', [1, 2, 3, 4, 5, 6, 0], 1, 3),
    tmpl('Sunday', '10:00', '18:00', [0], 1, 6, 'Keyholder'),
  ];
  restrictions.push(
    { id: newId(), employeeId: casey.id, type: 'preference', kind: 'prefer', weekday: null, shiftTemplateId: templates[2].id },
    { id: newId(), employeeId: alex.id, type: 'preference', kind: 'avoid', weekday: 6, shiftTemplateId: null },
  );
  return { employees, restrictions, templates };
}

export function loadSampleData(storage: StorageService): void {
  const { employees, restrictions, templates } = buildSampleData();
  storage.write('employees', employees);
  storage.write('restrictions', restrictions);
  storage.write('shiftTemplates', templates);
  const rules = defaultRuleSet();
  rules.rules.push({
    id: newId(),
    type: 'coverage',
    enabled: true,
    severity: 'hard',
    role: 'Keyholder',
    min: 1,
    days: null,
    from: null,
    to: null,
    appliesTo: ['schedule', 'breaks'],
  });
  storage.write('rules', rules);
}
