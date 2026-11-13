import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom } from 'rxjs';
import { ShiftTemplate, Weekday, WEEKDAY_NAMES } from '../../core/models';
import { EmployeeStore, SettingsStore, ShiftTemplateStore } from '../../core/stores';
import { prettyRange, shiftHours, toMinutes } from '../../core/time';
import { confirm } from '../../shared/confirm-dialog';
import { ShiftDialog, ShiftDialogData } from './shift-dialog';

@Component({
  selector: 'app-shifts-page',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Shifts</h1>
        <button mat-flat-button (click)="add()"><mat-icon>add</mat-icon>Add shift</button>
      </div>
      <p class="muted" style="margin-top: -8px">
        Shift templates describe what needs covering each week. The scheduler fills these with employees.
      </p>

      @if (sorted().length === 0) {
        <div class="card empty">
          <mat-icon>schedule</mat-icon>
          <p>No shifts yet. Add shifts like "Open 7a–3p, 2 people, Mon–Fri".</p>
          <button mat-flat-button (click)="add()">Add shift</button>
        </div>
      } @else {
        <div class="card table-scroll" style="padding: 0">
          <table class="data">
            <thead>
              <tr>
                <th>Shift</th>
                <th>Time</th>
                @for (d of dayOrder(); track d) {
                  <th class="c">{{ names[d] }}</th>
                }
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (t of sorted(); track t.id) {
                <tr>
                  <td>
                    <span class="color-dot" [style.background]="t.color"></span>
                    <strong style="margin-left: 8px">{{ t.name }}</strong>
                  </td>
                  <td>{{ range(t) }} <span class="muted small">({{ hours(t) }}h)</span></td>
                  @for (d of dayOrder(); track d) {
                    <td class="c">
                      @if (t.weekdays.includes(d)) {
                        <span class="tag">{{ t.headcount }}</span>
                      } @else {
                        <span class="muted">–</span>
                      }
                    </td>
                  }
                  <td>
                    @if (t.requiredRole) {
                      <span class="tag">{{ t.requiredRole }}</span>
                    }
                  </td>
                  <td style="white-space: nowrap; text-align: right">
                    <button mat-icon-button matTooltip="Edit" (click)="edit(t)"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button matTooltip="Duplicate" (click)="duplicate(t)">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                    <button mat-icon-button matTooltip="Delete" (click)="remove(t)"><mat-icon>delete</mat-icon></button>
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2">People-hours needed</th>
                @for (d of dayOrder(); track d) {
                  <th class="c">{{ dayHours()[d] }}</th>
                }
                <th colspan="2">Week: {{ weekHours() }}h</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <p class="small muted">
          Active employees can cover up to {{ capacity() }}h/week (based on their max hours; employees with no max count
          as 40h).
        </p>
      }
    </div>
  `,
  styles: `
    .c {
      text-align: center !important;
    }
  `,
})
export class ShiftsPage {
  private readonly store = inject(ShiftTemplateStore);
  private readonly employees = inject(EmployeeStore);
  private readonly settings = inject(SettingsStore).settings;
  private readonly dialog = inject(MatDialog);
  protected readonly names = WEEKDAY_NAMES;

  protected readonly dayOrder = computed(() =>
    Array.from({ length: 7 }, (_, i) => ((i + this.settings().weekStartsOn) % 7) as Weekday),
  );
  protected readonly sorted = computed(() =>
    [...this.store.templates()].sort((a, b) => toMinutes(a.start) - toMinutes(b.start)),
  );
  protected readonly dayHours = computed(() => {
    const hrs = [0, 0, 0, 0, 0, 0, 0];
    for (const t of this.store.templates()) {
      for (const d of t.weekdays) hrs[d] += shiftHours(t.start, t.end) * t.headcount;
    }
    return hrs.map((h) => Math.round(h * 10) / 10);
  });
  protected readonly weekHours = computed(() => Math.round(this.dayHours().reduce((a, b) => a + b, 0) * 10) / 10);
  protected readonly capacity = computed(() =>
    this.employees.activeEmployees().reduce((sum, e) => sum + (e.maxHoursPerWeek || 40), 0),
  );

  range(t: ShiftTemplate) {
    return prettyRange(t.start, t.end);
  }

  hours(t: ShiftTemplate) {
    return Math.round(shiftHours(t.start, t.end) * 100) / 100;
  }

  private open(template: ShiftDialogData['template']) {
    const data: ShiftDialogData = {
      template,
      roles: this.employees.allRoles(),
      weekStartsOn: this.settings().weekStartsOn,
    };
    return firstValueFrom(this.dialog.open(ShiftDialog, { data, width: '600px' }).afterClosed());
  }

  async add(): Promise<void> {
    const result = await this.open({
      name: '',
      start: '09:00',
      end: '17:00',
      weekdays: [1, 2, 3, 4, 5],
      headcount: 1,
      requiredRole: null,
      color: this.store.nextColor(),
    });
    if (result) this.store.add(result);
  }

  async edit(t: ShiftTemplate): Promise<void> {
    const result = await this.open(t);
    if (result) this.store.update(t.id, result);
  }

  duplicate(t: ShiftTemplate): void {
    const { id: _id, ...rest } = t;
    this.store.add({ ...rest, name: `${t.name} (copy)` });
  }

  async remove(t: ShiftTemplate): Promise<void> {
    const ok = await confirm(this.dialog, {
      title: `Delete "${t.name}"?`,
      message: 'Future generated schedules will no longer include this shift. Saved schedules are not changed.',
      confirmText: 'Delete',
      danger: true,
    });
    if (ok) this.store.remove(t.id);
  }
}
