import { emp } from '../testing/fixtures';
import { planTeamsImport, timeOffToRestrictions } from './teams-import-plan';
import { parseCsv, parseDateCell, parseTeamsWorkbook, parseTimeCell, RawSheet, themeColor } from './teams-shifts';

const SHIFT_HEADERS = [
  'Member',
  'Work Email',
  'Group',
  'Start Date',
  'Start Time',
  'End Date',
  'End Time',
  'Theme Color',
  'Custom Label',
  'Unpaid Break (minutes)',
  'Notes',
  'Shared',
];
const OPEN_HEADERS = ['Group', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Open Slots', 'Theme Color', 'Custom Label', 'Unpaid Break (minutes)', 'Notes', 'Shared'];
const TIMEOFF_HEADERS = ['Member', 'Work Email', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Time Off Reason', 'Theme Color', 'Notes', 'Shared'];

function workbook(): RawSheet[] {
  return [
    { sheet: 'Instructions', data: [['Read me'], ['Some text']] },
    {
      sheet: 'Shifts',
      data: [
        SHIFT_HEADERS,
        ['Ana Diaz', 'ana@contoso.com', 'Front', '11/16/2026', '8:00 AM', '11/16/2026', '4:00 PM', '2. Blue', 'Open', 30, '', '1. Shared'],
        ['Ben Ko', 'ben@contoso.com', 'Front', '11/16/2026', '8:00 AM', '11/16/2026', '4:00 PM', '2. Blue', 'Open', 30, '', '1. Shared'],
        ['Ben Ko', 'ben@contoso.com', 'Front', '11/17/2026', '22:00', '11/18/2026', '06:00', '', 'Night', 0, '', '1. Shared'],
        ['Cy Park', 'cy@contoso.com', 'Kitchen', '11/24/2026', '10:00am', '11/24/2026', '6:00pm', '3. Green', '', 0, '', '1. Shared'],
        ['', '', '', '', '', '', '', '', '', '', '', ''],
        ['Broken', 'x@contoso.com', 'Front', 'not a date', '8:00 AM', '11/16/2026', '4:00 PM', '', '', '', '', ''],
      ],
    },
    {
      sheet: 'Open Shifts',
      data: [OPEN_HEADERS, ['Front', '11/16/2026', '8:00 AM', '11/16/2026', '4:00 PM', 2, '2. Blue', 'Open', 30, '', '1. Shared']],
    },
    {
      sheet: 'Time Off',
      data: [TIMEOFF_HEADERS, ['Ana Diaz', 'ana@contoso.com', '11/20/2026', '12:00 AM', '11/22/2026', '12:00 AM', 'Vacation', '', '', '1. Shared']],
    },
    { sheet: 'Members', data: [['Member', 'Work Email'], ['Ana Diaz', 'ana@contoso.com'], ['Dee Lux', 'dee@contoso.com']] },
  ];
}

describe('Teams Shifts cell parsing', () => {
  it('parses dates in both orders, ISO, Excel serials and Date cells', () => {
    expect(parseDateCell('11/16/2026', 'mdy')).toBe('2026-11-16');
    expect(parseDateCell('16/11/2026', 'dmy')).toBe('2026-11-16');
    expect(parseDateCell('2026-11-16', 'dmy')).toBe('2026-11-16');
    expect(parseDateCell(46342, 'mdy')).toBe('2026-11-16');
    expect(parseDateCell(new Date(Date.UTC(2026, 10, 16)), 'mdy')).toBe('2026-11-16');
    expect(parseDateCell('13/13/2026', 'mdy')).toBeNull();
  });

  it('parses 12h, 24h, Excel fractions and Date times', () => {
    expect(parseTimeCell('8:30am')).toBe('08:30');
    expect(parseTimeCell('8:30 PM')).toBe('20:30');
    expect(parseTimeCell('12:00 AM')).toBe('00:00');
    expect(parseTimeCell('12:15 p.m.')).toBe('12:15');
    expect(parseTimeCell('15:45')).toBe('15:45');
    expect(parseTimeCell('11/16/2026 7:00 AM')).toBe('07:00');
    expect(parseTimeCell(0.375)).toBe('09:00');
    expect(parseTimeCell(new Date(Date.UTC(1899, 11, 30, 17, 30)))).toBe('17:30');
    expect(parseTimeCell('nope')).toBeNull();
  });

  it('maps theme colors', () => {
    expect(themeColor('2. Blue')).toBe('#3b82f6');
    expect(themeColor('DarkGreen')).toBe('#047857');
    expect(themeColor('')).toBeNull();
  });

  it('parses CSV with quotes and semicolons', () => {
    expect(parseCsv('a,b\n"x, y","say ""hi"""\r\n')).toEqual([
      ['a', 'b'],
      ['x, y', 'say "hi"'],
    ]);
    expect(parseCsv('a;b\n1;2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });
});

describe('parseTeamsWorkbook', () => {
  it('reads shifts, open shifts, time off and members by header', () => {
    const wb = parseTeamsWorkbook(workbook());
    expect(wb.shifts.length).toBe(4);
    expect(wb.openShifts).toEqual([expect.objectContaining({ slots: 2, label: 'Open', startDate: '2026-11-16' })]);
    expect(wb.timeOff.length).toBe(1);
    expect(wb.people.map((p) => p.name)).toEqual(['Ana Diaz', 'Ben Ko', 'Cy Park', 'Dee Lux']);
    expect(wb.people.find((p) => p.name === 'Cy Park')?.groups).toEqual(['Kitchen']);
    expect(wb.warnings.some((w) => w.includes('Shifts row 7'))).toBe(true);
    expect(wb.dateOrder).toBe('mdy');
    expect(wb.dateOrderAmbiguous).toBe(false);
  });

  it('detects day-first dates', () => {
    const wb = parseTeamsWorkbook([
      { sheet: 'Shifts', data: [SHIFT_HEADERS, ['A', 'a@x.com', 'G', '16/11/2026', '09:00', '16/11/2026', '17:00', '', '', '', '', '']] },
    ]);
    expect(wb.dateOrder).toBe('dmy');
    expect(wb.shifts[0].startDate).toBe('2026-11-16');
  });

  it('explains how to export when the file is not an import-format export', () => {
    expect(() => parseTeamsWorkbook([{ sheet: 'Sheet1', data: [['Name', 'Mon', 'Tue']] }])).toThrow(/format that can be imported/);
  });
});

describe('planTeamsImport', () => {
  const ctx = (employees = [emp('ana', { name: 'Ana Diaz', email: 'ANA@contoso.com' }), emp('ben', { name: 'ben ko' })]) => ({
    employees,
    templates: [],
    weekStartsOn: 1 as const,
  });

  it('matches by email then name, creates the rest, and builds a schedule', () => {
    const wb = parseTeamsWorkbook(workbook());
    const plan = planTeamsImport(wb, ctx(), { importSchedule: true, createEmployees: true, importTimeOff: true, createTemplates: false });
    expect(plan.people.find((p) => p.person.name === 'Ana Diaz')?.existing?.id).toBe('ana');
    expect(plan.people.find((p) => p.person.name === 'Ben Ko')?.existing?.id).toBe('ben');
    expect(plan.newEmployees.map((e) => e.name).sort()).toEqual(['Cy Park', 'Dee Lux']);
    expect(plan.newEmployees.find((e) => e.name === 'Cy Park')?.roles).toEqual(['Kitchen']);

    const s = plan.schedule!;
    expect(s.startDate).toBe('2026-11-16');
    expect(s.weeks).toBe(2);
    const open = s.slots.find((x) => x.date === '2026-11-16' && x.name === 'Open')!;
    expect(open.headcount).toBe(4); // 2 assigned + 2 open slots
    expect(open.assignedEmployeeIds.sort()).toEqual(['ana', 'ben']);
    const night = s.slots.find((x) => x.name === 'Night')!;
    expect([night.start, night.end]).toEqual(['22:00', '06:00']);
    expect(s.slots.find((x) => x.name === 'Kitchen')?.assignedEmployeeIds.length).toBe(1);

    // Fri 00:00 -> Sun 00:00 means Fri + Sat, all day.
    expect(plan.timeOff).toEqual([
      expect.objectContaining({ employeeId: 'ana', startDate: '2026-11-20', endDate: '2026-11-21', start: null, end: null, reason: 'Vacation' }),
    ]);
  });

  it('leaves shifts open for unknown people when not creating employees', () => {
    const wb = parseTeamsWorkbook(workbook());
    const plan = planTeamsImport(wb, ctx(), { importSchedule: true, createEmployees: false, importTimeOff: true, createTemplates: false });
    expect(plan.newEmployees).toEqual([]);
    const kitchen = plan.schedule!.slots.find((x) => x.name === 'Kitchen')!;
    expect(kitchen.headcount).toBe(1);
    expect(kitchen.assignedEmployeeIds).toEqual([]);
    expect(plan.warnings.some((w) => w.includes("aren't in your employee list"))).toBe(true);
  });

  it('can import only employees', () => {
    const wb = parseTeamsWorkbook(workbook());
    const plan = planTeamsImport(wb, ctx([]), { importSchedule: false, createEmployees: true, importTimeOff: false, createTemplates: false });
    expect(plan.schedule).toBeNull();
    expect(plan.timeOff).toEqual([]);
    expect(plan.newEmployees.length).toBe(4);
  });

  it('creates shift templates and reuses existing ones', () => {
    const wb = parseTeamsWorkbook(workbook());
    const existing = { id: 'tOpen', name: 'open', start: '08:00', end: '16:00', weekdays: [1 as const], headcount: 1, color: '#000' };
    const plan = planTeamsImport(wb, { ...ctx(), templates: [existing] }, {
      importSchedule: true,
      createEmployees: true,
      importTimeOff: false,
      createTemplates: true,
    });
    expect(plan.newTemplates.map((t) => t.name).sort()).toEqual(['Kitchen', 'Night']);
    expect(plan.schedule!.slots.find((x) => x.name === 'Open')?.templateId).toBe('tOpen');
  });
});

describe('timeOffToRestrictions', () => {
  it('splits partial multi-day time off', () => {
    const r = timeOffToRestrictions('e', {
      member: '',
      email: '',
      startDate: '2026-11-20',
      start: '13:00',
      endDate: '2026-11-23',
      end: '09:00',
      reason: '',
    });
    expect(r.map((x) => [x.startDate, x.endDate, x.start, x.end])).toEqual([
      ['2026-11-20', '2026-11-20', '13:00', '24:00'],
      ['2026-11-21', '2026-11-22', null, null],
      ['2026-11-23', '2026-11-23', '00:00', '09:00'],
    ]);
  });

  it('handles a same-day window', () => {
    const r = timeOffToRestrictions('e', { member: '', email: '', startDate: '2026-11-20', start: '09:00', endDate: '2026-11-20', end: '12:00', reason: 'Dentist' });
    expect(r).toEqual([expect.objectContaining({ start: '09:00', end: '12:00', reason: 'Dentist' })]);
  });
});
