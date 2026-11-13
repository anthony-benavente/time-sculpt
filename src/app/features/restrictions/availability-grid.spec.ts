import { cellsToWindows, windowsToCells } from './availability-grid';

describe('availability grid conversion', () => {
  it('round-trips partial and whole-day windows', () => {
    const windows = [
      { weekday: 1 as const, start: null, end: null },
      { weekday: 3 as const, start: '00:00', end: '09:00' },
      { weekday: 3 as const, start: '18:00', end: '24:00' },
    ];
    expect(cellsToWindows(windowsToCells(windows))).toEqual(windows);
  });

  it('spills overnight windows into the next day', () => {
    const cells = windowsToCells([{ weekday: 6, start: '22:00', end: '02:00' }]);
    expect(cells[6][22]).toBe(true);
    expect(cells[6][23]).toBe(true);
    expect(cells[0][0]).toBe(true);
    expect(cells[0][1]).toBe(true);
    expect(cells[0][2]).toBe(false);
  });
});
