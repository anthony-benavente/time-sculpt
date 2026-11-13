import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Employee, WEEKDAY_NAMES } from '../../core/models';
import { EmployeeStore, ScheduleStore } from '../../core/stores';
import { confirm } from '../../shared/confirm-dialog';
import { EmployeeDialog, EmployeeDialogData, EmployeeDialogResult } from './employee-dialog';

@Component({
  selector: 'app-employees-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Employees</h1>
        <mat-form-field style="width: 240px">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput placeholder="Search" [value]="query()" (input)="query.set($any($event.target).value)" />
        </mat-form-field>
        <a mat-stroked-button routerLink="/import"><mat-icon>upload_file</mat-icon>Import from Teams</a>
        <button mat-flat-button (click)="add()"><mat-icon>person_add</mat-icon>Add employee</button>
      </div>

      @if (store.employees().length === 0) {
        <div class="card empty">
          <mat-icon>group</mat-icon>
          <p>No employees yet. Add your team to start scheduling.</p>
          <button mat-flat-button (click)="add()">Add employee</button>
        </div>
      } @else {
        <div class="card table-scroll" style="padding: 0">
          <table class="data">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roles</th>
                <th>Hours / week</th>
                <th>Restrictions</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (e of filtered(); track e.id) {
                <tr [class.inactive]="!e.active">
                  <td>
                    <span class="color-dot" [style.background]="e.color"></span>
                    <a [routerLink]="['/employees', e.id]" class="name">{{ e.name }}</a>
                  </td>
                  <td>
                    <div class="chip-list">
                      @for (r of e.roles; track r) {
                        <span class="tag">{{ r }}</span>
                      }
                    </div>
                  </td>
                  <td>{{ hoursLabel(e) }}</td>
                  <td>
                    <a mat-button [routerLink]="['/employees', e.id]" matTooltip="Edit availability and time off">
                      <mat-icon>event_busy</mat-icon>
                      {{ summary().get(e.id) || 'Always available' }}
                    </a>
                  </td>
                  <td>
                    <mat-slide-toggle [checked]="e.active" (change)="store.update(e.id, { active: $event.checked })" />
                  </td>
                  <td style="white-space: nowrap; text-align: right">
                    <button mat-icon-button matTooltip="Edit" (click)="edit(e)"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button matTooltip="Duplicate (copy limits and availability)" (click)="duplicate(e)">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                    <button mat-icon-button matTooltip="Delete" (click)="remove(e)"><mat-icon>delete</mat-icon></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: `
    a.name {
      color: inherit;
      font-weight: 500;
      margin-left: 8px;
      text-decoration: none;
    }
    a.name:hover {
      text-decoration: underline;
    }
  `,
})
export class EmployeesPage {
  protected readonly store = inject(EmployeeStore);
  private readonly schedules = inject(ScheduleStore);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  protected readonly query = signal('');

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    return this.store
      .employees()
      .filter((e) => !q || e.name.toLowerCase().includes(q) || e.roles.some((r) => r.toLowerCase().includes(q)));
  });

  protected readonly summary = computed(() => {
    const map = new Map<string, string>();
    const counts = new Map<string, { days: Set<number>; off: number; prefs: number }>();
    for (const r of this.store.restrictions()) {
      const c = counts.get(r.employeeId) ?? { days: new Set<number>(), off: 0, prefs: 0 };
      if (r.type === 'weekly-unavailable') c.days.add(r.weekday);
      else if (r.type === 'time-off') c.off++;
      else c.prefs++;
      counts.set(r.employeeId, c);
    }
    for (const [id, c] of counts) {
      const parts: string[] = [];
      if (c.days.size) parts.push(`Limited: ${[...c.days].sort().map((d) => WEEKDAY_NAMES[d]).join(', ')}`);
      if (c.off) parts.push(`${c.off} time off`);
      if (c.prefs) parts.push(`${c.prefs} pref`);
      map.set(id, parts.join(' · '));
    }
    return map;
  });

  hoursLabel(e: Employee): string {
    const min = e.minHoursPerWeek;
    const max = e.maxHoursPerWeek;
    if (min && max) return `${min}–${max}h`;
    if (max) return `up to ${max}h`;
    if (min) return `at least ${min}h`;
    return 'Any';
  }

  async add(): Promise<void> {
    const data: EmployeeDialogData = {
      employee: {
        name: '',
        color: this.store.nextColor(),
        roles: [],
        active: true,
        maxShiftsPerDay: 1,
        minHoursPerWeek: null,
        maxHoursPerWeek: null,
        maxConsecutiveDays: null,
        minRestHours: null,
        notes: '',
      },
      knownRoles: this.store.allRoles(),
    };
    const result = await firstValueFrom(this.dialog.open(EmployeeDialog, { data, width: '640px' }).afterClosed());
    if (result) this.store.add(result);
  }

  async edit(e: Employee): Promise<void> {
    const data: EmployeeDialogData = { employee: e, knownRoles: this.store.allRoles() };
    const result = await firstValueFrom(this.dialog.open(EmployeeDialog, { data, width: '640px' }).afterClosed());
    if (result) this.store.update(e.id, result);
  }

  async duplicate(e: Employee): Promise<void> {
    const mine = this.store.restrictions().filter((r) => r.employeeId === e.id);
    const { id: _id, ...rest } = e;
    const data: EmployeeDialogData = {
      employee: { ...rest, name: '', email: null, color: this.store.nextColor(), notes: '' },
      knownRoles: this.store.allRoles(),
      duplicateOf: {
        name: e.name,
        availabilityCount: mine.filter((r) => r.type !== 'time-off').length,
        timeOffCount: mine.filter((r) => r.type === 'time-off').length,
      },
    };
    const result = await firstValueFrom(
      this.dialog.open<EmployeeDialog, EmployeeDialogData, EmployeeDialogResult>(EmployeeDialog, { data, width: '640px' }).afterClosed(),
    );
    if (!result) return;
    const { copy, ...employee } = result;
    const created = this.store.add(employee);
    const copied = copy ? this.store.copyRestrictions(e.id, created.id, copy) : 0;
    this.snack.open(
      `${created.name} added${copied ? ` with ${copied} restriction${copied > 1 ? 's' : ''} copied from ${e.name}` : ''}.`,
      undefined,
      { duration: 3000 },
    );
  }

  async remove(e: Employee): Promise<void> {
    const ok = await confirm(this.dialog, {
      title: `Delete ${e.name}?`,
      message:
        'Their availability and time off will be deleted, and they will be removed from all saved schedules. To keep history, turn off "Active" instead.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;
    const removed = this.schedules.unassignEmployee(e.id);
    this.store.remove(e.id);
    this.snack.open(`${e.name} deleted${removed ? `, removed from ${removed} shift(s)` : ''}.`, undefined, {
      duration: 3000,
    });
  }
}
