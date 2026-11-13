import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { newId, Preference, TimeOff, Weekday, WEEKDAY_FULL_NAMES, WeeklyUnavailable } from '../../core/models';
import { EmployeeStore, SettingsStore, ShiftTemplateStore } from '../../core/stores';
import { formatDate, prettyDate, prettyRange, today } from '../../core/time';
import { EmployeeDialog } from '../employees/employee-dialog';
import { AvailabilityGrid, BlockedWindow } from './availability-grid';

@Component({
  selector: 'app-restrictions-page',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    AvailabilityGrid,
  ],
  templateUrl: './restrictions-page.html',
  styles: `
    .layout {
      display: grid;
      grid-template-columns: minmax(340px, 1.1fr) minmax(320px, 1fr);
      gap: 16px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
    .limits {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .add-form {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }
    .add-form mat-form-field {
      width: 150px;
    }
    .add-form mat-form-field.wide {
      width: 240px;
    }
  `,
})
export class RestrictionsPage {
  /** Route param */
  readonly id = input.required<string>();

  protected readonly store = inject(EmployeeStore);
  protected readonly templates = inject(ShiftTemplateStore).templates;
  protected readonly settings = inject(SettingsStore).settings;
  private readonly dialog = inject(MatDialog);
  protected readonly dayNames = WEEKDAY_FULL_NAMES;
  protected readonly weekdays: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
  protected readonly prettyDate = prettyDate;
  protected readonly prettyRange = prettyRange;

  protected readonly employee = computed(() => this.store.byId().get(this.id()));
  private readonly mine = computed(() => this.store.restrictions().filter((r) => r.employeeId === this.id()));

  protected readonly weekly = computed<BlockedWindow[]>(() =>
    this.mine()
      .filter((r): r is WeeklyUnavailable => r.type === 'weekly-unavailable')
      .map((r) => ({ weekday: r.weekday, start: r.start ?? null, end: r.end ?? null })),
  );
  protected readonly timeOff = computed(() =>
    this.mine()
      .filter((r): r is TimeOff => r.type === 'time-off')
      .sort((a, b) => (a.startDate < b.startDate ? -1 : 1)),
  );
  protected readonly upcomingTimeOff = computed(() => this.timeOff().filter((t) => t.endDate >= today()));
  protected readonly pastTimeOff = computed(() => this.timeOff().filter((t) => t.endDate < today()));
  protected readonly preferences = computed(() =>
    this.mine().filter((r): r is Preference => r.type === 'preference'),
  );

  // Time-off form
  protected toStart: Date | null = null;
  protected toEnd: Date | null = null;
  protected toFrom = '';
  protected toUntil = '';
  protected toReason = '';

  // Preference form
  protected prefKind: 'prefer' | 'avoid' = 'prefer';
  protected prefDay: Weekday | null = null;
  protected prefShift: string | null = null;

  saveWeekly(windows: BlockedWindow[]): void {
    const id = this.id();
    this.store.setWeeklyUnavailable(
      id,
      windows.map((w) => ({
        id: newId(),
        employeeId: id,
        type: 'weekly-unavailable',
        weekday: w.weekday,
        start: w.start,
        end: w.end,
      })),
    );
  }

  clearWeekly(): void {
    this.store.setWeeklyUnavailable(this.id(), []);
  }

  addTimeOff(): void {
    if (!this.toStart) return;
    const start = formatDate(this.toStart);
    const end = formatDate(this.toEnd ?? this.toStart);
    const partial = this.toFrom && this.toUntil;
    this.store.addRestriction({
      id: newId(),
      employeeId: this.id(),
      type: 'time-off',
      startDate: start,
      endDate: end < start ? start : end,
      start: partial ? this.toFrom : null,
      end: partial ? this.toUntil : null,
      reason: this.toReason.trim() || undefined,
    });
    this.toStart = this.toEnd = null;
    this.toFrom = this.toUntil = this.toReason = '';
  }

  addPreference(): void {
    if (this.prefDay == null && !this.prefShift) return;
    this.store.addRestriction({
      id: newId(),
      employeeId: this.id(),
      type: 'preference',
      kind: this.prefKind,
      weekday: this.prefDay,
      shiftTemplateId: this.prefShift,
    });
    this.prefDay = null;
    this.prefShift = null;
  }

  prefLabel(p: Preference): string {
    const parts: string[] = [];
    if (p.shiftTemplateId) parts.push(this.templates().find((t) => t.id === p.shiftTemplateId)?.name ?? '(deleted shift)');
    if (p.weekday != null) parts.push(`on ${WEEKDAY_FULL_NAMES[p.weekday]}s`);
    return `${p.kind === 'prefer' ? 'Prefers' : 'Avoid'} ${parts.join(' ')}`;
  }

  timeOffLabel(t: TimeOff): string {
    const dates = t.startDate === t.endDate ? prettyDate(t.startDate) : `${prettyDate(t.startDate)} – ${prettyDate(t.endDate)}`;
    return t.start && t.end ? `${dates}, ${prettyRange(t.start, t.end)}` : `${dates} (all day)`;
  }

  async editEmployee(): Promise<void> {
    const emp = this.employee();
    if (!emp) return;
    const result = await firstValueFrom(
      this.dialog
        .open(EmployeeDialog, { data: { employee: emp, knownRoles: this.store.allRoles() }, width: '640px' })
        .afterClosed(),
    );
    if (result) this.store.update(emp.id, result);
  }
}
