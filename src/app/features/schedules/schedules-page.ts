import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Schedule } from '../../core/models';
import { ScheduleStore } from '../../core/stores';
import { addDays, prettyDate, today } from '../../core/time';
import { confirm } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-schedules-page',
  imports: [RouterLink, DatePipe, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Schedules</h1>
        <a mat-stroked-button routerLink="/import"><mat-icon>upload_file</mat-icon>Import from Teams</a>
        <a mat-flat-button routerLink="/generate"><mat-icon>auto_awesome</mat-icon>New schedule</a>
      </div>

      @if (store.schedules().length === 0) {
        <div class="card empty">
          <mat-icon>calendar_month</mat-icon>
          <p>No schedules yet.</p>
          <p class="small">Add employees and shifts, then generate your first schedule.</p>
          <div class="row" style="justify-content: center">
            <a mat-stroked-button routerLink="/employees">1. Employees</a>
            <a mat-stroked-button routerLink="/shifts">2. Shifts</a>
            <a mat-flat-button routerLink="/generate">3. Generate</a>
          </div>
        </div>
      } @else {
        <div class="card table-scroll" style="padding: 0">
          <table class="data">
            <thead>
              <tr>
                <th>Schedule</th>
                <th>Dates</th>
                <th>Made by</th>
                <th>Coverage</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (s of store.schedules(); track s.id) {
                <tr>
                  <td>
                    <a [routerLink]="['/schedules', s.id]" class="name">{{ s.name }}</a>
                    @if (isCurrent(s)) {
                      <span class="tag ok" style="margin-left: 6px">Current</span>
                    }
                  </td>
                  <td>{{ range(s) }} <span class="muted small">({{ s.weeks }} wk)</span></td>
                  <td>{{ sourceLabel[s.source] }}</td>
                  <td>
                    @let c = coverage(s);
                    <span class="tag" [class.ok]="c === 100" [class.warn]="c < 100">{{ c }}%</span>
                  </td>
                  <td class="muted small">{{ s.updatedAt | date: 'short' }}</td>
                  <td style="white-space: nowrap; text-align: right">
                    <a mat-icon-button [routerLink]="['/schedules', s.id]" matTooltip="Open"><mat-icon>edit_calendar</mat-icon></a>
                    <a mat-icon-button [routerLink]="['/schedules', s.id, 'print']" matTooltip="Print"><mat-icon>print</mat-icon></a>
                    <button mat-icon-button (click)="store.duplicate(s.id)" matTooltip="Duplicate"><mat-icon>content_copy</mat-icon></button>
                    <button mat-icon-button (click)="remove(s)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
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
    }
  `,
})
export class SchedulesPage {
  protected readonly store = inject(ScheduleStore);
  private readonly dialog = inject(MatDialog);
  protected readonly sourceLabel: Record<Schedule['source'], string> = {
    algorithm: 'Algorithm',
    ai: 'Claude',
    manual: 'Manual',
    teams: 'Teams import',
  };

  range(s: Schedule): string {
    return `${prettyDate(s.startDate)} – ${prettyDate(addDays(s.startDate, s.weeks * 7 - 1))}`;
  }

  isCurrent(s: Schedule): boolean {
    const t = today();
    return s.startDate <= t && addDays(s.startDate, s.weeks * 7 - 1) >= t;
  }

  coverage(s: Schedule): number {
    const needed = s.slots.reduce((a, x) => a + x.headcount, 0);
    const filled = s.slots.reduce((a, x) => a + Math.min(x.headcount, x.assignedEmployeeIds.length), 0);
    return needed ? Math.round((filled / needed) * 100) : 100;
  }

  async remove(s: Schedule): Promise<void> {
    const ok = await confirm(this.dialog, {
      title: `Delete "${s.name}"?`,
      message: 'This cannot be undone. Tip: export a backup from Settings first.',
      confirmText: 'Delete',
      danger: true,
    });
    if (ok) this.store.remove(s.id);
  }
}
