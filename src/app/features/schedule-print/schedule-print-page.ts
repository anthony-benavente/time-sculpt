import { Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Employee, IsoDate, ShiftSlot, WEEKDAY_NAMES } from '../../core/models';
import { EmployeeStore, ScheduleStore, SettingsStore, ShiftTemplateStore } from '../../core/stores';
import { addDays, prettyDate, prettyRange, shiftHours, toMinutes, weekdayOf } from '../../core/time';

interface PrintWeek {
  index: number;
  dates: IsoDate[];
  employees: { emp: Employee; days: ShiftSlot[][]; hours: number }[];
  shiftRows: { name: string; color: string; time: string; cells: (ShiftSlot | null)[] }[];
  dayCounts: number[];
  open: ShiftSlot[];
}

@Component({
  selector: 'app-schedule-print-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatButtonToggleModule, MatCheckboxModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './schedule-print-page.html',
  styleUrl: './schedule-print-page.scss',
})
export class SchedulePrintPage {
  readonly id = input.required<string>();

  private readonly store = inject(ScheduleStore);
  private readonly employeeStore = inject(EmployeeStore);
  private readonly templates = inject(ShiftTemplateStore);
  protected readonly settings = inject(SettingsStore).settings;
  protected readonly names = WEEKDAY_NAMES;
  protected readonly prettyDate = prettyDate;
  protected readonly prettyRange = prettyRange;

  protected readonly mode = signal<'employee' | 'shift'>('employee');
  protected readonly showColor = signal(true);
  protected readonly hideEmpty = signal(true);
  protected readonly selectedWeeks = signal<Set<number> | null>(null);

  protected readonly schedule = computed(() => this.store.get(this.id())());

  protected readonly weeks = computed<PrintWeek[]>(() => {
    const s = this.schedule();
    if (!s) return [];
    const empById = this.employeeStore.byId();
    const tmpl = this.templates.byId();
    const out: PrintWeek[] = [];
    for (let w = 0; w < s.weeks; w++) {
      const dates = Array.from({ length: 7 }, (_, i) => addDays(s.startDate, w * 7 + i));
      const dateIdx = new Map(dates.map((d, i) => [d, i]));
      const slots = s.slots
        .filter((x) => dateIdx.has(x.date))
        .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

      const empRows = new Map<string, { emp: Employee; days: ShiftSlot[][]; hours: number }>();
      for (const slot of slots) {
        for (const id of slot.assignedEmployeeIds) {
          const emp = empById.get(id);
          if (!emp) continue;
          const row = empRows.get(id) ?? { emp, days: dates.map(() => []), hours: 0 };
          row.days[dateIdx.get(slot.date)!].push(slot);
          row.hours += shiftHours(slot.start, slot.end);
          empRows.set(id, row);
        }
      }
      if (!this.hideEmpty()) {
        for (const e of this.employeeStore.activeEmployees()) {
          if (!empRows.has(e.id)) empRows.set(e.id, { emp: e, days: dates.map(() => []), hours: 0 });
        }
      }

      const shiftMap = new Map<string, PrintWeek['shiftRows'][number]>();
      for (const slot of slots) {
        const key = `${slot.templateId}|${slot.start}|${slot.end}`;
        const row = shiftMap.get(key) ?? {
          name: slot.name,
          color: tmpl.get(slot.templateId)?.color ?? slot.color ?? '#64748b',
          time: prettyRange(slot.start, slot.end),
          cells: dates.map(() => null),
        };
        row.cells[dateIdx.get(slot.date)!] = slot;
        shiftMap.set(key, row);
      }

      out.push({
        index: w,
        dates,
        employees: [...empRows.values()]
          .map((r) => ({ ...r, hours: Math.round(r.hours * 10) / 10 }))
          .sort((a, b) => a.emp.name.localeCompare(b.emp.name)),
        shiftRows: [...shiftMap.values()],
        dayCounts: dates.map((d) => new Set(slots.filter((x) => x.date === d).flatMap((x) => x.assignedEmployeeIds)).size),
        open: slots.filter((x) => x.assignedEmployeeIds.length < x.headcount),
      });
    }
    return out;
  });

  protected readonly visibleWeeks = computed(() => {
    const sel = this.selectedWeeks();
    return sel ? this.weeks().filter((w) => sel.has(w.index)) : this.weeks();
  });

  colorOf(slot: ShiftSlot): string {
    return this.templates.byId().get(slot.templateId)?.color ?? slot.color ?? '#64748b';
  }

  empName(id: string): string {
    return this.employeeStore.byId().get(id)?.name ?? '?';
  }

  blanks(slot: ShiftSlot): number[] {
    return Array.from({ length: Math.max(0, slot.headcount - slot.assignedEmployeeIds.length) }, (_, i) => i);
  }

  weekday(d: IsoDate): string {
    return WEEKDAY_NAMES[weekdayOf(d)];
  }

  toggleWeek(i: number, on: boolean): void {
    const all = new Set(this.selectedWeeks() ?? this.weeks().map((w) => w.index));
    if (on) all.add(i);
    else all.delete(i);
    this.selectedWeeks.set(all);
  }

  isSelected(i: number): boolean {
    return this.selectedWeeks()?.has(i) ?? true;
  }

  print(): void {
    window.print();
  }

  printedOn(): string {
    return new Date().toLocaleDateString();
  }
}
