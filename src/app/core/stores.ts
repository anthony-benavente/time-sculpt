import { computed, inject, Injectable, signal } from '@angular/core';
import {
  AppSettings,
  DEFAULT_SETTINGS,
  Employee,
  newId,
  PALETTE,
  Restriction,
  Schedule,
  ShiftTemplate,
} from './models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class SettingsStore {
  private readonly storage = inject(StorageService);
  private readonly _settings = signal<AppSettings>(this.load());
  readonly settings = this._settings.asReadonly();
  readonly hasApiKey = computed(() => !!this._settings().anthropicApiKey.trim());

  private load(): AppSettings {
    return { ...DEFAULT_SETTINGS, ...this.storage.read<Partial<AppSettings>>('settings', {}) };
  }

  update(patch: Partial<AppSettings>): void {
    this._settings.update((s) => ({ ...s, ...patch }));
    this.storage.write('settings', this._settings());
  }

  reload(): void {
    this._settings.set(this.load());
  }
}

@Injectable({ providedIn: 'root' })
export class EmployeeStore {
  private readonly storage = inject(StorageService);
  private readonly _employees = signal<Employee[]>(this.storage.read('employees', []));
  private readonly _restrictions = signal<Restriction[]>(this.storage.read('restrictions', []));

  readonly employees = this._employees.asReadonly();
  readonly restrictions = this._restrictions.asReadonly();
  readonly activeEmployees = computed(() => this._employees().filter((e) => e.active));
  readonly byId = computed(() => new Map(this._employees().map((e) => [e.id, e])));
  readonly allRoles = computed(() => {
    const roles = new Set<string>();
    for (const e of this._employees()) e.roles.forEach((r) => roles.add(r));
    return [...roles].sort();
  });

  restrictionsFor(employeeId: string) {
    return computed(() => this._restrictions().filter((r) => r.employeeId === employeeId));
  }

  nextColor(): string {
    return PALETTE[this._employees().length % PALETTE.length];
  }

  add(data: Omit<Employee, 'id'>): Employee {
    const emp: Employee = { ...data, id: newId() };
    this._employees.update((list) => [...list, emp].sort((a, b) => a.name.localeCompare(b.name)));
    this.persist();
    return emp;
  }

  /** Add employees that already have ids (e.g. from an import). */
  addMany(employees: Employee[]): void {
    if (!employees.length) return;
    this._employees.update((list) => [...list, ...employees].sort((a, b) => a.name.localeCompare(b.name)));
    this.persist();
  }

  addRestrictions(items: Restriction[]): void {
    if (!items.length) return;
    this._restrictions.update((list) => [...list, ...items]);
    this.persist();
  }

  update(id: string, patch: Partial<Employee>): void {
    this._employees.update((list) =>
      list.map((e) => (e.id === id ? { ...e, ...patch, id } : e)).sort((a, b) => a.name.localeCompare(b.name)),
    );
    this.persist();
  }

  remove(id: string): void {
    this._employees.update((list) => list.filter((e) => e.id !== id));
    this._restrictions.update((list) => list.filter((r) => r.employeeId !== id));
    this.persist();
  }

  /**
   * Copy restrictions from one employee to another (new ids).
   * `availability` = weekly availability + preferences; `timeOff` = dated time off.
   */
  copyRestrictions(fromId: string, toId: string, opts: { availability: boolean; timeOff: boolean }): number {
    const copies = this._restrictions()
      .filter((r) => r.employeeId === fromId)
      .filter((r) => (r.type === 'time-off' ? opts.timeOff : opts.availability))
      .map((r) => ({ ...r, id: newId(), employeeId: toId }));
    if (copies.length) {
      this._restrictions.update((list) => [...list, ...copies]);
      this.persist();
    }
    return copies.length;
  }

  addRestriction(r: Restriction): void {
    this._restrictions.update((list) => [...list, r]);
    this.persist();
  }

  updateRestriction(id: string, r: Restriction): void {
    this._restrictions.update((list) => list.map((x) => (x.id === id ? r : x)));
    this.persist();
  }

  removeRestriction(id: string): void {
    this._restrictions.update((list) => list.filter((x) => x.id !== id));
    this.persist();
  }

  /** Replace all weekly-unavailable restrictions for one employee (used by the availability grid). */
  setWeeklyUnavailable(employeeId: string, items: Restriction[]): void {
    this._restrictions.update((list) => [
      ...list.filter((r) => !(r.employeeId === employeeId && r.type === 'weekly-unavailable')),
      ...items,
    ]);
    this.persist();
  }

  reload(): void {
    this._employees.set(this.storage.read('employees', []));
    this._restrictions.set(this.storage.read('restrictions', []));
  }

  private persist(): void {
    this.storage.write('employees', this._employees());
    this.storage.write('restrictions', this._restrictions());
  }
}

@Injectable({ providedIn: 'root' })
export class ShiftTemplateStore {
  private readonly storage = inject(StorageService);
  private readonly _templates = signal<ShiftTemplate[]>(this.storage.read('shiftTemplates', []));
  readonly templates = this._templates.asReadonly();
  readonly byId = computed(() => new Map(this._templates().map((t) => [t.id, t])));

  nextColor(): string {
    return PALETTE[(this._templates().length + 3) % PALETTE.length];
  }

  add(data: Omit<ShiftTemplate, 'id'>): ShiftTemplate {
    const t: ShiftTemplate = { ...data, id: newId() };
    this._templates.update((list) => [...list, t]);
    this.persist();
    return t;
  }

  addMany(templates: ShiftTemplate[]): void {
    if (!templates.length) return;
    this._templates.update((list) => [...list, ...templates]);
    this.persist();
  }

  update(id: string, patch: Partial<ShiftTemplate>): void {
    this._templates.update((list) => list.map((t) => (t.id === id ? { ...t, ...patch, id } : t)));
    this.persist();
  }

  remove(id: string): void {
    this._templates.update((list) => list.filter((t) => t.id !== id));
    this.persist();
  }

  reload(): void {
    this._templates.set(this.storage.read('shiftTemplates', []));
  }

  private persist(): void {
    this.storage.write('shiftTemplates', this._templates());
  }
}

@Injectable({ providedIn: 'root' })
export class ScheduleStore {
  private readonly storage = inject(StorageService);
  private readonly _schedules = signal<Schedule[]>(this.storage.read('schedules', []));
  readonly schedules = computed(() =>
    [...this._schedules()].sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0)),
  );

  get(id: string) {
    return computed(() => this._schedules().find((s) => s.id === id));
  }

  save(schedule: Schedule): void {
    const now = new Date().toISOString();
    const s = { ...schedule, updatedAt: now };
    this._schedules.update((list) =>
      list.some((x) => x.id === s.id) ? list.map((x) => (x.id === s.id ? s : x)) : [...list, s],
    );
    this.persist();
  }

  duplicate(id: string): Schedule | undefined {
    const src = this._schedules().find((s) => s.id === id);
    if (!src) return undefined;
    const now = new Date().toISOString();
    const copy: Schedule = {
      ...structuredClone(src),
      id: newId(),
      name: `${src.name} (copy)`,
      createdAt: now,
      updatedAt: now,
    };
    this._schedules.update((list) => [...list, copy]);
    this.persist();
    return copy;
  }

  remove(id: string): void {
    this._schedules.update((list) => list.filter((s) => s.id !== id));
    this.persist();
  }

  /** Unassign an employee from every saved schedule. Returns how many assignments were removed. */
  unassignEmployee(employeeId: string): number {
    let removed = 0;
    this._schedules.update((list) =>
      list.map((s) => ({
        ...s,
        slots: s.slots.map((slot) => {
          if (!slot.assignedEmployeeIds.includes(employeeId)) return slot;
          removed++;
          return { ...slot, assignedEmployeeIds: slot.assignedEmployeeIds.filter((x) => x !== employeeId) };
        }),
      })),
    );
    this.persist();
    return removed;
  }

  reload(): void {
    this._schedules.set(this.storage.read('schedules', []));
  }

  private persist(): void {
    this.storage.write('schedules', this._schedules());
  }
}
