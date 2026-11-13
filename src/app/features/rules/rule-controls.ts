import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HHmm, Weekday, WEEKDAY_NAMES } from '../../core/models';
import { formatDays } from '../../core/rules-text';

/** 7 day chips. Value null = every day. */
@Component({
  selector: 'app-day-picker',
  imports: [MatButtonModule, MatMenuModule],
  template: `
    <span class="days">
      @for (d of order; track d) {
        <button type="button" class="day" [class.on]="isOn(d)" (click)="toggle(d)">{{ names[d].slice(0, 2) }}</button>
      }
      <button type="button" class="more" [matMenuTriggerFor]="m" aria-label="Day presets">▾</button>
      <mat-menu #m>
        <button mat-menu-item (click)="changed.emit(null)">Every day</button>
        <button mat-menu-item (click)="changed.emit([1, 2, 3, 4, 5])">Weekdays</button>
        <button mat-menu-item (click)="changed.emit([0, 6])">Weekends</button>
      </mat-menu>
    </span>
    <span class="small muted">{{ label() }}</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .days {
      display: inline-flex;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 8px;
      overflow: hidden;
    }
    button {
      border: 0;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface-variant);
      font: inherit;
      font-size: 12px;
      padding: 4px 7px;
      cursor: pointer;
      border-right: 1px solid var(--mat-sys-outline-variant);
    }
    button.on {
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
      font-weight: 600;
    }
    button.more {
      border-right: 0;
    }
  `,
})
export class DayPicker {
  readonly days = input<Weekday[] | null>(null);
  readonly changed = output<Weekday[] | null>();
  protected readonly order: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
  protected readonly names = WEEKDAY_NAMES;
  protected readonly label = computed(() => formatDays(this.days()) || 'every day');

  isOn(d: Weekday): boolean {
    const days = this.days();
    return !days || days.includes(d);
  }

  toggle(d: Weekday): void {
    const cur = new Set<Weekday>(this.days() ?? [0, 1, 2, 3, 4, 5, 6]);
    if (cur.has(d)) cur.delete(d);
    else cur.add(d);
    if (cur.size === 0) return;
    this.changed.emit(cur.size === 7 ? null : [...cur].sort((a, b) => a - b));
  }
}

/** "All open hours" / "All day", or a from–to window. */
@Component({
  selector: 'app-time-window',
  imports: [FormsModule, MatSlideToggleModule],
  template: `
    <mat-slide-toggle [checked]="!from()" (change)="toggleAll($event.checked)">{{ allLabel() }}</mat-slide-toggle>
    @if (from()) {
      <input type="time" class="t" [ngModel]="from()" (ngModelChange)="emit($event, to())" aria-label="From" />
      <span>–</span>
      <input type="time" class="t" [ngModel]="to() === '24:00' ? '23:59' : to()" (ngModelChange)="emit(from(), $event === '23:59' ? '24:00' : $event)" aria-label="To" />
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    input.t {
      font: inherit;
      padding: 3px 6px;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 6px;
      background: var(--mat-sys-surface);
      color: inherit;
    }
  `,
})
export class TimeWindow {
  readonly from = input<HHmm | null>(null);
  readonly to = input<HHmm | null>(null);
  readonly allLabel = input('All open hours');
  readonly defaultFrom = input<HHmm>('09:00');
  readonly defaultTo = input<HHmm>('17:00');
  readonly changed = output<{ from: HHmm | null; to: HHmm | null }>();

  toggleAll(all: boolean): void {
    this.changed.emit(all ? { from: null, to: null } : { from: this.defaultFrom(), to: this.defaultTo() });
  }

  emit(from: HHmm | null, to: HHmm | null): void {
    if (from && to) this.changed.emit({ from, to });
  }
}
