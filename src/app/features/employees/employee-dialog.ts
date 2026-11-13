import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Employee, PALETTE } from '../../core/models';

export interface EmployeeDialogData {
  employee: Omit<Employee, 'id'> & { id?: string };
  knownRoles: string[];
  /** Set when duplicating: what can be copied from the source employee. */
  duplicateOf?: { name: string; availabilityCount: number; timeOffCount: number };
}

export interface CopyOptions {
  /** Weekly availability and preferences. */
  availability: boolean;
  timeOff: boolean;
}

export type EmployeeDialogResult = Omit<Employee, 'id'> & { copy?: CopyOptions };

@Component({
  selector: 'app-employee-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content>
      <form #f="ngForm" id="empForm" class="dialog-form" (ngSubmit)="save()">
        <div class="row" style="align-items: flex-start">
          <mat-form-field style="flex: 1">
            <mat-label>Name</mat-label>
            <input matInput name="name" [(ngModel)]="emp.name" required />
          </mat-form-field>
          <div class="colors">
            @for (c of palette; track c) {
              <button
                type="button"
                class="swatch"
                [style.background]="c"
                [class.selected]="emp.color === c"
                (click)="emp.color = c"
                [attr.aria-label]="'Color ' + c"
              ></button>
            }
          </div>
        </div>

        <mat-form-field class="full">
          <mat-label>Work email (optional)</mat-label>
          <input matInput type="email" name="email" [(ngModel)]="emp.email" autocomplete="off" />
          <mat-hint>Used to match people when importing from Teams Shifts.</mat-hint>
        </mat-form-field>

        <mat-form-field class="full">
          <mat-label>Roles / skills</mat-label>
          <mat-chip-grid #chipGrid>
            @for (role of roles(); track role) {
              <mat-chip-row (removed)="removeRole(role)">
                {{ role }}
                <button matChipRemove [attr.aria-label]="'Remove ' + role"><mat-icon>cancel</mat-icon></button>
              </mat-chip-row>
            }
            <input
              placeholder="e.g. Keyholder, Cashier"
              [matChipInputFor]="chipGrid"
              [matChipInputSeparatorKeyCodes]="separators"
              [matAutocomplete]="auto"
              (matChipInputTokenEnd)="addRole($event)"
            />
          </mat-chip-grid>
          <mat-autocomplete #auto (optionSelected)="addRoleText($event.option.value)">
            @for (r of data.knownRoles; track r) {
              @if (!roles().includes(r)) {
                <mat-option [value]="r">{{ r }}</mat-option>
              }
            }
          </mat-autocomplete>
          <mat-hint>Shifts can require a role (e.g. only a Keyholder can open).</mat-hint>
        </mat-form-field>

        <h3>Limits</h3>
        <div class="form-grid">
          <mat-form-field>
            <mat-label>Min hours / week</mat-label>
            <input matInput type="number" min="0" name="minH" [(ngModel)]="emp.minHoursPerWeek" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Max hours / week</mat-label>
            <input matInput type="number" min="0" name="maxH" [(ngModel)]="emp.maxHoursPerWeek" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Max shifts / day</mat-label>
            <input matInput type="number" min="1" name="maxS" [(ngModel)]="emp.maxShiftsPerDay" required />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Max days in a row</mat-label>
            <input matInput type="number" min="1" name="maxC" [(ngModel)]="emp.maxConsecutiveDays" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Min rest between shifts (h)</mat-label>
            <input matInput type="number" min="0" name="rest" [(ngModel)]="emp.minRestHours" />
          </mat-form-field>
        </div>

        <mat-form-field class="full">
          <mat-label>Notes</mat-label>
          <textarea matInput rows="2" name="notes" [(ngModel)]="emp.notes"></textarea>
        </mat-form-field>

        @if (data.duplicateOf; as src) {
          <div class="copy-box">
            <div class="small"><b>Copy from {{ src.name }}</b></div>
            <mat-checkbox name="copyAvail" [(ngModel)]="copy.availability" [disabled]="!src.availabilityCount">
              Weekly availability &amp; preferences ({{ src.availabilityCount }})
            </mat-checkbox>
            <mat-checkbox name="copyOff" [(ngModel)]="copy.timeOff" [disabled]="!src.timeOffCount">
              Time off ({{ src.timeOffCount }})
            </mat-checkbox>
          </div>
        }

        <mat-slide-toggle name="active" style="align-self: flex-start" [(ngModel)]="emp.active">Active (include in schedules)</mat-slide-toggle>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button type="submit" form="empForm" [disabled]="!emp.name.trim()">Save</button>
    </mat-dialog-actions>
  `,
  styles: `
    .copy-box {
      display: flex;
      flex-direction: column;
      padding: 8px 12px;
      border-radius: 8px;
      background: var(--mat-sys-surface-container);
    }
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
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
    }
    .swatch.selected {
      outline: 2px solid var(--mat-sys-on-surface);
      outline-offset: 1px;
    }
  `,
})
export class EmployeeDialog {
  protected readonly data = inject<EmployeeDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<EmployeeDialog>);
  protected readonly palette = PALETTE;
  protected readonly separators = [ENTER, COMMA];
  protected readonly emp = structuredClone(this.data.employee);
  protected readonly roles = signal<string[]>([...this.emp.roles]);
  protected readonly copy: CopyOptions = {
    availability: !!this.data.duplicateOf?.availabilityCount,
    timeOff: false,
  };
  protected readonly title = this.data.duplicateOf
    ? `Duplicate ${this.data.duplicateOf.name}`
    : this.data.employee.id
      ? 'Edit employee'
      : 'Add employee';

  addRole(e: MatChipInputEvent): void {
    this.addRoleText(e.value);
    e.chipInput.clear();
  }

  addRoleText(value: string): void {
    const v = (value ?? '').trim();
    if (v && !this.roles().some((r) => r.toLowerCase() === v.toLowerCase())) {
      this.roles.update((r) => [...r, v]);
    }
  }

  removeRole(role: string): void {
    this.roles.update((r) => r.filter((x) => x !== role));
  }

  save(): void {
    if (!this.emp.name.trim()) return;
    const num = (v: unknown) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v));
    const result: EmployeeDialogResult = {
      ...this.emp,
      name: this.emp.name.trim(),
      email: this.emp.email?.trim() || null,
      roles: this.roles(),
      minHoursPerWeek: num(this.emp.minHoursPerWeek),
      maxHoursPerWeek: num(this.emp.maxHoursPerWeek),
      maxShiftsPerDay: Math.max(1, num(this.emp.maxShiftsPerDay) ?? 1),
      maxConsecutiveDays: num(this.emp.maxConsecutiveDays),
      minRestHours: num(this.emp.minRestHours),
      ...(this.data.duplicateOf ? { copy: { ...this.copy } } : {}),
    };
    this.ref.close(result);
  }
}
