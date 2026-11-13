import {
  addDays,
  absoluteRange,
  daysBetween,
  nextWeekStart,
  prettyRange,
  shiftHours,
  startOfWeek,
  weekdayOf,
  windowOverlapsShift,
} from './time';

describe('time helpers', () => {
  it('computes shift hours, including overnight shifts', () => {
    expect(shiftHours('09:00', '17:00')).toBe(8);
    expect(shiftHours('22:00', '06:00')).toBe(8);
    expect(shiftHours('15:00', '24:00')).toBe(9);
  });

  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(daysBetween('2026-11-01', '2026-11-15')).toBe(14);
  });

  it('is DST-safe', () => {
    // US DST ends 2026-11-01
    expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2);
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
  });

  it('finds week starts', () => {
    expect(weekdayOf('2026-11-13')).toBe(5); // Friday
    expect(startOfWeek('2026-11-13', 1)).toBe('2026-11-09');
    expect(startOfWeek('2026-11-13', 0)).toBe('2026-11-08');
    expect(nextWeekStart('2026-11-13', 1)).toBe('2026-11-16');
    expect(nextWeekStart('2026-11-16', 1)).toBe('2026-11-16');
  });

  it('builds absolute ranges for overnight shifts', () => {
    expect(absoluteRange('2026-11-16', '2026-11-17', '22:00', '06:00')).toEqual([1440 + 1320, 1440 + 1320 + 480]);
  });

  it('detects a window overlapping an overnight shift on the next day', () => {
    // Shift Mon 22:00 - Tue 06:00; window Tue 00:00-08:00 overlaps.
    expect(windowOverlapsShift('2026-11-17', '00:00', '08:00', '2026-11-16', '22:00', '06:00')).toBe(true);
    // Window Tue 07:00-09:00 does not.
    expect(windowOverlapsShift('2026-11-17', '07:00', '09:00', '2026-11-16', '22:00', '06:00')).toBe(false);
    // Whole-day window on the shift date overlaps.
    expect(windowOverlapsShift('2026-11-16', null, null, '2026-11-16', '09:00', '10:00')).toBe(true);
  });

  it('formats ranges', () => {
    expect(prettyRange('07:00', '15:30')).toBe('7a–3:30p');
    expect(prettyRange('00:00', '12:00')).toBe('12a–12p');
  });
});
