import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PALETTE, ShiftTemplate, Weekday, WEEKDAY_NAMES } from '../../core/models';
import { shiftHours } from '../../core/time';

export interface ShiftDialogData {
  template: Omit<ShiftTemplate, 'id'> & { id?: string };
  roles: string[];
  weekStartsOn: 0 | 1;
}

@Component({
  selector: 'app-shift-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.template.id ? 'Edit shift' : 'Add shift' }}</h2>
    <mat-dialog-content>
      <form id="shiftForm" class="dialog-form" (ngSubmit)="save()">
        <div class="row" style="align-items: flex-start">
          <mat-form-field style="flex: 1">
            <mat-label>Shift name</mat-label>
            <input matInput name="name" [(ngModel)]="t.name" required placeholder="e.g. Open, Mid, Close" />
          </mat-form-field>
          <div class="colors">
            @for (c of palette; track c) {
              <button
                type="button"
                class="swatch"
                [style.background]="c"
                [class.selected]="t.color === c"
                (click)="t.color = c"
              ></button>
            }
          </div>
        </div>
        <div class="form-grid">
          <mat-form-field>
            <mat-label>Start</mat-label>
            <input matInput type="time" name="start" [(ngModel)]="t.start" required />
          </mat-form-field>
          <mat-form-field>
            <mat-label>End</mat-label>
            <input matInput type="time" name="end" [(ngModel)]="t.end" required />
            <mat-hint>{{ hoursHint() }}</mat-hint>
          </mat-form-field>
          <mat-form-field>
            <mat-label>People needed</mat-label>
            <input matInput type="number" min="1" name="headcount" [(ngModel)]="t.headcount" required />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Required role</mat-label>
            <mat-select name="role" [(ngModel)]="t.requiredRole">
              <mat-option [value]="null">None</mat-option>
              @for (r of data.roles; track r) {
                <mat-option [value]="r">{{ r }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
        <p class="small muted" style="margin: 0 0 -8px">Days this shift runs</p>
        <mat-button-toggle-group multiple name="days" [(ngModel)]="t.weekdays">
          @for (d of dayOrder; track d) {
            <mat-button-toggle [value]="d">{{ names[d] }}</mat-button-toggle>
          }
        </mat-button-toggle-group>
        <div class="row small" style="margin-top: -8px">
          <button mat-button type="button" (click)="t.weekdays = [1, 2, 3, 4, 5]">Weekdays</button>
          <button mat-button type="button" (click)="t.weekdays = [0, 6]">Weekends</button>
          <button mat-button type="button" (click)="t.weekdays = [0, 1, 2, 3, 4, 5, 6]">Every day</button>
        </div>
        @if (data.roles.length === 0) {
          <p class="small muted">Tip: give employees roles (e.g. "Keyholder") to require them on certain shifts.</p>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button type="submit" form="shiftForm" [disabled]="!valid()">Save</button>
    </mat-dialog-actions>
  `,
  styles: `
    .colors {
      display: grid;
      grid-template-columns: repeat(6, 20px);
      gap: 6px;
      padding-top: 8px;
    }
    .swatch {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 0;
      cursor: pointer;
      padding: 0;
    }
    .swatch.selected {
      outline: 2px solid var(--mat-sys-on-surface);
      outline-offset: 1px;
    }
  `,
})
export class ShiftDialog {
  protected readonly data = inject<ShiftDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ShiftDialog>);
  protected readonly palette = PALETTE;
  protected readonly names = WEEKDAY_NAMES;
  protected readonly dayOrder = Array.from({ length: 7 }, (_, i) => ((i + this.data.weekStartsOn) % 7) as Weekday);
  protected readonly t = structuredClone(this.data.template);

  hoursHint(): string {
    if (!this.t.start || !this.t.end) return '';
    const h = shiftHours(this.t.start, this.t.end);
    return `${Math.round(h * 100) / 100}h${this.t.end <= this.t.start ? ' (overnight)' : ''}`;
  }

  valid(): boolean {
    return !!this.t.name.trim() && !!this.t.start && !!this.t.end && this.t.headcount >= 1 && this.t.weekdays.length > 0;
  }

  save(): void {
    if (!this.valid()) return;
    this.ref.close({
      ...this.t,
      name: this.t.name.trim(),
      headcount: Math.max(1, Math.floor(Number(this.t.headcount))),
      weekdays: [...this.t.weekdays].sort(),
    });
  }
}
