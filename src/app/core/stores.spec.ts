import { TestBed } from '@angular/core/testing';
import { EmployeeStore } from './stores';

describe('EmployeeStore.copyRestrictions', () => {
  beforeEach(() => localStorage.clear());

  it('copies availability and preferences, and time off only when asked', () => {
    const store = TestBed.inject(EmployeeStore);
    const a = store.add({ name: 'A', color: '#000', roles: [], active: true, maxShiftsPerDay: 1 });
    const b = store.add({ name: 'B', color: '#000', roles: [], active: true, maxShiftsPerDay: 1 });
    store.addRestriction({ id: 'w', employeeId: a.id, type: 'weekly-unavailable', weekday: 0 });
    store.addRestriction({ id: 'p', employeeId: a.id, type: 'preference', kind: 'avoid', weekday: 6 });
    store.addRestriction({ id: 't', employeeId: a.id, type: 'time-off', startDate: '2026-12-01', endDate: '2026-12-02' });

    expect(store.copyRestrictions(a.id, b.id, { availability: true, timeOff: false })).toBe(2);
    const bs = store.restrictions().filter((r) => r.employeeId === b.id);
    expect(bs.map((r) => r.type).sort()).toEqual(['preference', 'weekly-unavailable']);
    expect(bs.every((r) => !['w', 'p', 't'].includes(r.id))).toBe(true);
    // Source is untouched.
    expect(store.restrictions().filter((r) => r.employeeId === a.id).length).toBe(3);

    expect(store.copyRestrictions(a.id, b.id, { availability: false, timeOff: true })).toBe(1);
    expect(store.restrictions().filter((r) => r.employeeId === b.id).length).toBe(3);
  });
});
