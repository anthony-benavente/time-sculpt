import { Component, computed, effect, input, output, signal } from '@angular/core';
import { HHmm, Weekday, WEEKDAY_NAMES } from '../../core/models';
import { prettyTime, toMinutes } from '../../core/time';

export interface BlockedWindow {
  weekday: Weekday;
  start: HHmm | null;
  end: HHmm | null;
}

/** 7 days x 24 hours grid. Shaded = unavailable. Click or drag to paint. */
@Component({
  selector: 'app-availability-grid',
  template: `
    <div class="grid" (pointerleave)="endPaint()" (pointerup)="endPaint()">
      <div class="corner"></div>
      @for (d of dayOrder(); track d) {
        <button type="button" class="day-head" (click)="toggleDay(d)" title="Toggle the whole day">
          {{ names[d] }}
        </button>
      }
      @for (h of hours; track h) {
        <div class="hour-label">{{ hourLabel(h) }}</div>
        @for (d of dayOrder(); track d) {
          <div
            class="cell"
            [class.blocked]="cells()[d][h]"
            [class.hour-start]="h % 6 === 0"
            (pointerdown)="startPaint($event, d, h)"
            (pointerenter)="paint(d, h)"
          ></div>
        }
      }
    </div>
    <div class="legend small muted">
      <span class="sw avail"></span> Available
      <span class="sw blocked"></span> Unavailable — click or drag to change. Click a day name to toggle the whole day.
    </div>
  `,
  styles: `
    :host {
      display: block;
      user-select: none;
    }
    .grid {
      display: grid;
      grid-template-columns: 48px repeat(7, minmax(36px, 1fr));
      gap: 1px;
      background: var(--mat-sys-outline-variant);
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 8px;
      overflow: hidden;
      touch-action: none;
    }
    .corner,
    .hour-label,
    .day-head {
      background: var(--mat-sys-surface-container);
      font-size: 11px;
    }
    .day-head {
      border: 0;
      padding: 6px 0;
      font-weight: 500;
      cursor: pointer;
      color: inherit;
    }
    .day-head:hover {
      background: var(--mat-sys-secondary-container);
    }
    .hour-label {
      text-align: right;
      padding-right: 6px;
      line-height: 16px;
      color: var(--mat-sys-on-surface-variant);
    }
    .cell {
      height: 16px;
      background: #ecfdf5;
      cursor: pointer;
    }
    .cell.blocked {
      background: repeating-linear-gradient(45deg, #fca5a5, #fca5a5 4px, #fecaca 4px, #fecaca 8px);
    }
    .cell.hour-start {
      box-shadow: inset 0 1px 0 var(--mat-sys-outline);
    }
    .legend {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .sw {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      display: inline-block;
      border: 1px solid var(--mat-sys-outline-variant);
    }
    .sw.avail {
      background: #ecfdf5;
    }
    .sw.blocked {
      background: #fca5a5;
      margin-left: 8px;
    }
  `,
})
export class AvailabilityGrid {
  readonly windows = input.required<BlockedWindow[]>();
  readonly weekStartsOn = input<0 | 1>(1);
  readonly changed = output<BlockedWindow[]>();

  protected readonly names = WEEKDAY_NAMES;
  protected readonly hours = Array.from({ length: 24 }, (_, i) => i);
  protected readonly dayOrder = computed(() =>
    Array.from({ length: 7 }, (_, i) => ((i + this.weekStartsOn()) % 7) as Weekday),
  );
  protected readonly cells = signal<boolean[][]>(emptyCells());
  private painting: boolean | null = null;

  constructor() {
    effect(() => {
      if (this.painting === null) this.cells.set(windowsToCells(this.windows()));
    });
  }

  hourLabel(h: number): string {
    return prettyTime(`${String(h).padStart(2, '0')}:00`);
  }

  startPaint(ev: PointerEvent, d: Weekday, h: number): void {
    ev.preventDefault();
    (ev.target as HTMLElement).releasePointerCapture?.(ev.pointerId);
    this.painting = !this.cells()[d][h];
    this.paint(d, h);
  }

  paint(d: Weekday, h: number): void {
    if (this.painting === null) return;
    const value = this.painting;
    if (this.cells()[d][h] === value) return;
    this.cells.update((c) => {
      const copy = c.map((row) => [...row]);
      copy[d][h] = value;
      return copy;
    });
  }

  endPaint(): void {
    if (this.painting === null) return;
    this.painting = null;
    this.changed.emit(cellsToWindows(this.cells()));
  }

  toggleDay(d: Weekday): void {
    const allBlocked = this.cells()[d].every(Boolean);
    this.cells.update((c) => {
      const copy = c.map((row) => [...row]);
      copy[d] = copy[d].map(() => !allBlocked);
      return copy;
    });
    this.changed.emit(cellsToWindows(this.cells()));
  }
}

function emptyCells(): boolean[][] {
  return Array.from({ length: 7 }, () => Array<boolean>(24).fill(false));
}

export function windowsToCells(windows: readonly BlockedWindow[]): boolean[][] {
  const cells = emptyCells();
  for (const w of windows) {
    if (!w.start || !w.end) {
      cells[w.weekday].fill(true);
      continue;
    }
    const s = toMinutes(w.start);
    let e = toMinutes(w.end);
    if (e <= s) e += 1440; // overnight: spill into next day
    for (let h = 0; h < 48; h++) {
      const hs = h * 60;
      if (hs < e && hs + 60 > s) {
        const day = ((w.weekday + Math.floor(h / 24)) % 7) as Weekday;
        cells[day][h % 24] = true;
      }
    }
  }
  return cells;
}

export function cellsToWindows(cells: boolean[][]): BlockedWindow[] {
  const out: BlockedWindow[] = [];
  for (let d = 0; d < 7; d++) {
    const row = cells[d];
    if (row.every(Boolean)) {
      out.push({ weekday: d as Weekday, start: null, end: null });
      continue;
    }
    let h = 0;
    while (h < 24) {
      if (!row[h]) {
        h++;
        continue;
      }
      const start = h;
      while (h < 24 && row[h]) h++;
      out.push({
        weekday: d as Weekday,
        start: `${String(start).padStart(2, '0')}:00`,
        end: h === 24 ? '24:00' : `${String(h).padStart(2, '0')}:00`,
      });
    }
  }
  return out;
}
