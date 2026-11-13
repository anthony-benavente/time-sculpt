import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Employee, IsoDate, ShiftSlot, ShiftTemplate, Violation, WEEKDAY_NAMES } from '../core/models';
import { addDays, prettyDate, prettyRange, shiftHours, toMinutes, weekdayOf } from '../core/time';

export interface ChipEvent {
  slot: ShiftSlot;
  employeeId: string;
}
export interface CellEvent {
  employeeId: string;
  date: IsoDate;
}
export interface MoveEvent {
  slotId: string;
  fromEmployeeId: string;
  toEmployeeId: string;
}

interface ShiftRow {
  key: string;
  name: string;
  color: string;
  byDate: Map<IsoDate, ShiftSlot>;
}

/** Week view of a schedule, by employee or by shift. Read-only unless `editable`. */
@Component({
  selector: 'app-schedule-grid',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './schedule-grid.html',
  styleUrl: './schedule-grid.scss',
})
export class ScheduleGrid {
  readonly slots = input.required<ShiftSlot[]>();
  readonly employees = input.required<readonly Employee[]>();
  readonly templates = input<readonly ShiftTemplate[]>([]);
  readonly startDate = input.required<IsoDate>();
  readonly week = input(0);
  readonly mode = input<'employee' | 'shift'>('employee');
  readonly editable = input(false);
  readonly violations = input<Violation[]>([]);

  readonly chipClick = output<ChipEvent>();
  readonly cellClick = output<CellEvent>();
  readonly slotClick = output<ShiftSlot>();
  readonly move = output<MoveEvent>();

  protected readonly names = WEEKDAY_NAMES;
  protected readonly prettyDate = prettyDate;
  protected readonly prettyRange = prettyRange;

  protected readonly dates = computed(() =>
    Array.from({ length: 7 }, (_, i) => addDays(this.startDate(), this.week() * 7 + i)),
  );

  protected readonly weekSlots = computed(() => {
    const dates = new Set(this.dates());
    return this.slots()
      .filter((s) => dates.has(s.date))
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  });

  private readonly tmplColor = computed(() => new Map(this.templates().map((t) => [t.id, t.color])));
  protected readonly empById = computed(() => new Map(this.employees().map((e) => [e.id, e])));

  /** Error keys `${slotId}|${employeeId}` for red highlighting. */
  protected readonly errorKeys = computed(() => {
    const map = new Map<string, string[]>();
    for (const v of this.violations()) {
      if (v.severity !== 'error' || !v.employeeId) continue;
      const k = `${v.slotId}|${v.employeeId}`;
      map.set(k, [...(map.get(k) ?? []), v.message]);
    }
    return map;
  });

  protected readonly rows = computed(() => {
    const assignedIds = new Set(this.weekSlots().flatMap((s) => s.assignedEmployeeIds));
    return this.employees().filter((e) => e.active || assignedIds.has(e.id));
  });

  /** employeeId -> date -> slots */
  protected readonly byEmpDate = computed(() => {
    const map = new Map<string, Map<IsoDate, ShiftSlot[]>>();
    for (const s of this.weekSlots()) {
      for (const id of s.assignedEmployeeIds) {
        const m = map.get(id) ?? new Map<IsoDate, ShiftSlot[]>();
        m.set(s.date, [...(m.get(s.date) ?? []), s]);
        map.set(id, m);
      }
    }
    return map;
  });

  protected readonly hoursByEmp = computed(() => {
    const map = new Map<string, number>();
    for (const s of this.weekSlots()) {
      const h = shiftHours(s.start, s.end);
      for (const id of s.assignedEmployeeIds) map.set(id, (map.get(id) ?? 0) + h);
    }
    return map;
  });

  protected readonly openByDate = computed(() => {
    const map = new Map<IsoDate, ShiftSlot[]>();
    for (const s of this.weekSlots()) {
      if (s.assignedEmployeeIds.length < s.headcount) map.set(s.date, [...(map.get(s.date) ?? []), s]);
    }
    return map;
  });

  protected readonly shiftRows = computed<ShiftRow[]>(() => {
    const rows = new Map<string, ShiftRow>();
    for (const s of this.weekSlots()) {
      const key = `${s.templateId}|${s.start}|${s.end}`;
      const row = rows.get(key) ?? {
        key,
        name: s.name,
        color: this.color(s),
        byDate: new Map<IsoDate, ShiftSlot>(),
      };
      row.byDate.set(s.date, s);
      rows.set(key, row);
    }
    return [...rows.values()];
  });

  color(s: ShiftSlot): string {
    return this.tmplColor().get(s.templateId) ?? s.color ?? '#64748b';
  }

  weekdayName(d: IsoDate): string {
    return WEEKDAY_NAMES[weekdayOf(d)];
  }

  hours(id: string): number {
    return Math.round((this.hoursByEmp().get(id) ?? 0) * 10) / 10;
  }

  hoursClass(e: Employee): string {
    const h = this.hoursByEmp().get(e.id) ?? 0;
    if (e.maxHoursPerWeek && h > e.maxHoursPerWeek) return 'over';
    if (e.minHoursPerWeek && h < e.minHoursPerWeek) return 'under';
    return '';
  }

  missing(s: ShiftSlot): number[] {
    return Array.from({ length: Math.max(0, s.headcount - s.assignedEmployeeIds.length) }, (_, i) => i);
  }

  // ---- Native drag & drop (employee mode): move a shift to another person on the same day.
  private dragging: { slotId: string; employeeId: string; date: IsoDate } | null = null;

  dragStart(ev: DragEvent, slot: ShiftSlot, employeeId: string): void {
    if (!this.editable()) return;
    this.dragging = { slotId: slot.id, employeeId, date: slot.date };
    ev.dataTransfer?.setData('text/plain', slot.id);
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
  }

  dragOver(ev: DragEvent, date: IsoDate): void {
    if (this.dragging && this.dragging.date === date) ev.preventDefault();
  }

  drop(ev: DragEvent, employeeId: string): void {
    ev.preventDefault();
    const d = this.dragging;
    this.dragging = null;
    if (!d || d.employeeId === employeeId) return;
    this.move.emit({ slotId: d.slotId, fromEmployeeId: d.employeeId, toEmployeeId: employeeId });
  }

  dragEnd(): void {
    this.dragging = null;
  }
}
