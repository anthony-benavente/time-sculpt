import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentState, canAssign, groupRestrictions, round1 } from '../core/constraint-checker';
import { Employee, IsoDate, Restriction, RuleSet, ShiftSlot, WEEKDAY_FULL_NAMES } from '../core/models';
import { prettyDate, prettyRange, weekdayOf } from '../core/time';

export interface SlotDialogData {
  slot: ShiftSlot;
  allSlots: ShiftSlot[];
  startDate: IsoDate;
  employees: readonly Employee[];
  restrictions: readonly Restriction[];
  rules?: RuleSet | null;
}

/** Pick who works one shift. Returns the new list of employee ids, or undefined if cancelled. */
@Component({
  selector: 'app-slot-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <h2 mat-dialog-title>
      {{ data.slot.name }} · {{ dayName }} {{ prettyDate(data.slot.date) }}
      <div class="muted small">
        {{ prettyRange(data.slot.start, data.slot.end) }} · {{ assigned().length }}/{{ data.slot.headcount }} assigned
        @if (data.slot.requiredRole) {
          · requires {{ data.slot.requiredRole }}
        }
      </div>
    </h2>
    <mat-dialog-content>
      <h3>Working</h3>
      @if (assigned().length === 0) {
        <p class="muted small">Nobody yet.</p>
      }
      <ul class="list-plain">
        @for (id of assigned(); track id) {
          @let e = empById.get(id);
          <li>
            <span class="color-dot" [style.background]="e?.color"></span>
            <span>{{ e?.name ?? 'Unknown' }}</span>
            <span class="spacer"></span>
            <button mat-icon-button (click)="remove(id)" matTooltip="Remove from shift"><mat-icon>person_remove</mat-icon></button>
          </li>
        }
      </ul>

      <h3>Add someone</h3>
      @if (assigned().length >= data.slot.headcount) {
        <p class="small muted">This shift is full. You can still add extra people.</p>
      }
      <ul class="list-plain">
        @for (c of candidates(); track c.emp.id) {
          <li [class.blocked]="!c.ok">
            <span class="color-dot" [style.background]="c.emp.color"></span>
            <span>{{ c.emp.name }}</span>
            <span class="muted small">{{ c.hours }}h this week</span>
            @if (c.reasons.length) {
              <span class="tag" [class.warn]="!c.ok" [matTooltip]="c.reasons.join('\n')">{{ c.reasons[0] }}{{ c.reasons.length > 1 ? ' +' + (c.reasons.length - 1) : '' }}</span>
            }
            <span class="spacer"></span>
            <button mat-stroked-button (click)="add(c.emp.id)" [matTooltip]="c.ok ? '' : 'Add anyway (breaks a rule)'">
              <mat-icon>{{ c.ok ? 'person_add' : 'warning' }}</mat-icon>Add
            </button>
          </li>
        }
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button (click)="done()">Done</button>
    </mat-dialog-actions>
  `,
  styles: `
    h3 {
      font: var(--mat-sys-title-small);
      margin: 12px 0 4px;
    }
    li > span {
      white-space: nowrap;
    }
    li .tag {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }
    li.blocked > span:nth-child(2) {
      opacity: 0.6;
    }
  `,
})
export class SlotDialog {
  protected readonly data = inject<SlotDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<SlotDialog, string[]>);
  protected readonly prettyDate = prettyDate;
  protected readonly prettyRange = prettyRange;
  protected readonly dayName = WEEKDAY_FULL_NAMES[weekdayOf(this.data.slot.date)];
  protected readonly empById = new Map(this.data.employees.map((e) => [e.id, e]));
  private readonly restr = groupRestrictions(this.data.restrictions);
  private readonly names = new Map(this.data.employees.map((e) => [e.id, e.name]));

  protected readonly assigned = signal<string[]>([...this.data.slot.assignedEmployeeIds]);

  protected readonly candidates = computed(() => {
    const assigned = this.assigned();
    const slots = this.data.allSlots.map((s) => (s.id === this.data.slot.id ? { ...s, assignedEmployeeIds: assigned } : s));
    const state = AssignmentState.fromSlots(this.data.startDate, slots);
    const slot = { ...this.data.slot, assignedEmployeeIds: assigned };
    const week = state.weekIndex(slot.date);
    return this.data.employees
      .filter((e) => e.active && !assigned.includes(e.id))
      .map((emp) => {
        const r = canAssign(emp, slot, this.restr.get(emp.id) ?? [], state, this.data.rules, this.names);
        const reasons = [...r.reasons, ...r.soft.map((x) => `${x} (soft rule)`)];
        return { emp, ok: r.ok, reasons, hours: round1(state.hoursInWeek(emp.id, week)) };
      })
      .sort((a, b) => Number(b.ok) - Number(a.ok) || a.hours - b.hours || a.emp.name.localeCompare(b.emp.name));
  });

  add(id: string): void {
    this.assigned.update((a) => [...a, id]);
  }

  remove(id: string): void {
    this.assigned.update((a) => a.filter((x) => x !== id));
  }

  done(): void {
    this.ref.close(this.assigned());
  }
}
