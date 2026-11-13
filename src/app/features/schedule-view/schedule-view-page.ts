import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { validateSchedule } from '../../core/constraint-checker';
import { IsoDate, ShiftSlot } from '../../core/models';
import { EffectiveRules, EmployeeStore, ScheduleStore, ShiftTemplateStore } from '../../core/stores';
import { addDays, daysBetween, prettyDate, prettyRange, today } from '../../core/time';
import { generateSchedule } from '../../scheduling/greedy-scheduler';
import { CellEvent, ChipEvent, MoveEvent, ScheduleGrid } from '../../shared/schedule-grid';
import { SlotDialog, SlotDialogData } from '../../shared/slot-dialog';

const MAX_UNDO = 50;

@Component({
  selector: 'app-schedule-view-page',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatMenuModule,
    ScheduleGrid,
  ],
  templateUrl: './schedule-view-page.html',
  styles: `
    .title-input {
      font: var(--mat-sys-headline-small);
      border: 1px solid transparent;
      border-radius: 6px;
      padding: 2px 6px;
      background: transparent;
      color: inherit;
      min-width: 200px;
      flex: 1;
    }
    .title-input:hover,
    .title-input:focus {
      border-color: var(--mat-sys-outline-variant);
      outline: none;
    }
    .layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 16px;
      align-items: start;
    }
    @media (max-width: 1100px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
    .issues {
      max-height: 60vh;
      overflow: auto;
    }
  `,
})
export class ScheduleViewPage {
  readonly id = input.required<string>();

  private readonly store = inject(ScheduleStore);
  protected readonly employees = inject(EmployeeStore);
  protected readonly eff = inject(EffectiveRules);
  protected readonly templates = inject(ShiftTemplateStore).templates;
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  protected readonly prettyDate = prettyDate;

  protected readonly schedule = computed(() => this.store.get(this.id())());
  protected readonly week = signal(0);
  protected readonly mode = signal<'employee' | 'shift'>('employee');
  private readonly undoStack = signal<ShiftSlot[][]>([]);
  protected readonly canUndo = computed(() => this.undoStack().length > 0);

  constructor() {
    // When a schedule is opened, start on the week containing today (if it's in range).
    let openedId: string | null = null;
    effect(() => {
      const s = this.schedule();
      if (!s || s.id === openedId) return;
      openedId = s.id;
      untracked(() => {
        const diff = Math.floor(daysBetween(s.startDate, today()) / 7);
        this.week.set(diff >= 0 && diff < s.weeks ? diff : 0);
      });
    });
  }

  protected readonly violations = computed(() => {
    const s = this.schedule();
    return s ? validateSchedule(s, this.eff.employees(), this.eff.restrictions(), this.eff.ruleSet()) : [];
  });
  protected readonly errors = computed(() => this.violations().filter((v) => v.severity === 'error'));
  protected readonly warnings = computed(() => this.violations().filter((v) => v.severity === 'warning'));
  protected readonly weekTabs = computed(() => {
    const s = this.schedule();
    return s ? Array.from({ length: s.weeks }, (_, i) => ({ i, label: prettyDate(addDays(s.startDate, i * 7)) })) : [];
  });
  protected readonly openCount = computed(() =>
    (this.schedule()?.slots ?? []).reduce((a, s) => a + Math.max(0, s.headcount - s.assignedEmployeeIds.length), 0),
  );

  // ---------- mutations ----------
  private commit(slots: ShiftSlot[], message?: string): void {
    const s = this.schedule();
    if (!s) return;
    this.undoStack.update((st) => [...st.slice(-MAX_UNDO + 1), s.slots]);
    this.store.save({ ...s, slots });
    if (message) {
      const ref = this.snack.open(message, 'Undo', { duration: 4000 });
      ref.onAction().subscribe(() => this.undo());
    }
  }

  undo(): void {
    const st = this.undoStack();
    const s = this.schedule();
    if (!st.length || !s) return;
    this.undoStack.set(st.slice(0, -1));
    this.store.save({ ...s, slots: st[st.length - 1] });
  }

  rename(name: string): void {
    const s = this.schedule();
    if (s && name.trim() && name.trim() !== s.name) this.store.save({ ...s, name: name.trim() });
  }

  private setAssigned(slotId: string, ids: string[], message?: string): void {
    const s = this.schedule();
    if (!s) return;
    this.commit(
      s.slots.map((x) => (x.id === slotId ? { ...x, assignedEmployeeIds: ids } : x)),
      message,
    );
  }

  async openSlot(slot: ShiftSlot): Promise<void> {
    const s = this.schedule();
    if (!s) return;
    const data: SlotDialogData = {
      slot,
      allSlots: s.slots,
      startDate: s.startDate,
      employees: this.eff.employees(),
      restrictions: this.eff.restrictions(),
      rules: this.eff.ruleSet(),
    };
    const result = await firstValueFrom(this.dialog.open(SlotDialog, { data, width: '520px' }).afterClosed());
    if (result && JSON.stringify(result) !== JSON.stringify(slot.assignedEmployeeIds)) {
      this.setAssigned(slot.id, result);
    }
  }

  onChip(ev: ChipEvent): void {
    this.openSlot(ev.slot);
  }

  /** Click on an employee's empty day cell: pick a shift on that day to add them to. */
  protected cellTarget = signal<{ employeeId: string; date: IsoDate; slots: ShiftSlot[] } | null>(null);

  onCell(ev: CellEvent): void {
    const s = this.schedule();
    if (!s) return;
    const slots = s.slots.filter((x) => x.date === ev.date && !x.assignedEmployeeIds.includes(ev.employeeId));
    this.cellTarget.set({ ...ev, slots });
  }

  addToSlot(slot: ShiftSlot, employeeId: string): void {
    const name = this.employees.byId().get(employeeId)?.name ?? 'Employee';
    this.setAssigned(slot.id, [...slot.assignedEmployeeIds, employeeId], `${name} added to ${slot.name}`);
  }

  onMove(ev: MoveEvent): void {
    const s = this.schedule();
    const slot = s?.slots.find((x) => x.id === ev.slotId);
    if (!slot) return;
    if (slot.assignedEmployeeIds.includes(ev.toEmployeeId)) {
      this.snack.open('They are already on that shift.', undefined, { duration: 2500 });
      return;
    }
    const to = this.employees.byId().get(ev.toEmployeeId)?.name ?? 'employee';
    this.setAssigned(
      slot.id,
      slot.assignedEmployeeIds.map((x) => (x === ev.fromEmployeeId ? ev.toEmployeeId : x)),
      `${slot.name} moved to ${to}`,
    );
  }

  autoFill(scope: 'week' | 'all'): void {
    const s = this.schedule();
    if (!s) return;
    const weekStart = addDays(s.startDate, this.week() * 7);
    const weekEnd = addDays(weekStart, 6);
    const inScope = (x: ShiftSlot) => scope === 'all' || (x.date >= weekStart && x.date <= weekEnd);
    const result = generateSchedule({
      startDate: s.startDate,
      weeks: s.weeks,
      slots: s.slots,
      employees: this.eff.employees(),
      restrictions: this.eff.restrictions(),
      rules: this.eff.ruleSet(),
      iterations: 30,
    });
    // Only take new assignments for slots in scope.
    const byId = new Map(result.slots.map((x) => [x.id, x]));
    let added = 0;
    const slots = s.slots.map((x) => {
      if (!inScope(x)) return x;
      const filled = byId.get(x.id)!;
      added += filled.assignedEmployeeIds.length - x.assignedEmployeeIds.length;
      return filled;
    });
    if (added === 0) {
      this.snack.open('No open shifts could be filled without breaking a rule.', undefined, { duration: 3500 });
      return;
    }
    this.commit(slots, `Filled ${added} open position(s)`);
  }

  clearWeek(): void {
    const s = this.schedule();
    if (!s) return;
    const weekStart = addDays(s.startDate, this.week() * 7);
    const weekEnd = addDays(weekStart, 6);
    this.commit(
      s.slots.map((x) => (x.date >= weekStart && x.date <= weekEnd ? { ...x, assignedEmployeeIds: [] } : x)),
      'Week cleared',
    );
  }

  slotLabel(slot: ShiftSlot): string {
    return `${slot.name} ${prettyRange(slot.start, slot.end)} (${slot.assignedEmployeeIds.length}/${slot.headcount})`;
  }

  jumpTo(slotId: string): void {
    const s = this.schedule();
    const slot = s?.slots.find((x) => x.id === slotId);
    if (!s || !slot) return;
    this.week.set(Math.floor(daysBetween(s.startDate, slot.date) / 7));
    this.openSlot(slot);
  }
}
