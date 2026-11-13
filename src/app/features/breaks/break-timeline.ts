import { Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { breakIntervals, DayShift, dayTimeline } from '../../core/coverage';
import { Employee, IsoDate, PlannedBreak, ShiftSlot } from '../../core/models';
import { prettyTime } from '../../core/time';

interface Row {
  key: string;
  name: string;
  color: string;
  shift: [number, number];
  breaks: { iv: [number, number]; kind: PlannedBreak['kind']; label: string }[];
}

const fmt = (m: number) => {
  const x = ((m % 1440) + 1440) % 1440;
  return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
};

/** Gantt view of one day: shift bars with breaks cut out, plus people-on-the-floor per 15 minutes. */
@Component({
  selector: 'app-break-timeline',
  imports: [MatTooltipModule],
  template: `
    @if (rows().length) {
      <div class="tl">
        <div class="hours">
          <div class="label"></div>
          <div class="track">
            @for (h of hours(); track h.t) {
              <span class="hour" [style.left.%]="pct(h.t)">{{ h.label }}</span>
            }
          </div>
        </div>
        @for (r of rows(); track r.key) {
          <div class="row">
            <div class="label">{{ r.name }}</div>
            <div class="track">
              @for (h of hours(); track h.t) {
                <span class="grid" [style.left.%]="pct(h.t)"></span>
              }
              <div class="bar" [style.left.%]="pct(r.shift[0])" [style.width.%]="w(r.shift)" [style.--c]="r.color"></div>
              @for (b of r.breaks; track $index) {
                <div class="brk" [class.meal]="b.kind === 'meal'" [style.left.%]="pct(b.iv[0])" [style.width.%]="w(b.iv)" [matTooltip]="b.label">
                  {{ b.kind === 'meal' ? 'M' : 'R' }}
                </div>
              }
            </div>
          </div>
        }
        <div class="row floor">
          <div class="label">On the floor</div>
          <div class="track">
            @for (t of ticks(); track t.t) {
              <span
                class="cnt"
                [class.low]="t.low"
                [style.left.%]="pct(t.t)"
                [style.width.%]="w([t.t, t.t + 15])"
                [matTooltip]="fmtT(t.t) + ': ' + t.onFloor + ' working, ' + t.onBreak + ' on break'"
                >{{ t.onFloor }}</span
              >
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .tl {
      font-size: 12px;
      overflow-x: auto;
    }
    .row,
    .hours {
      display: flex;
      align-items: center;
      min-width: 720px;
    }
    .label {
      width: 130px;
      flex: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 8px;
    }
    .track {
      position: relative;
      flex: 1;
      height: 26px;
    }
    .hours .track {
      height: 18px;
    }
    .hour {
      position: absolute;
      transform: translateX(-50%);
      color: var(--mat-sys-on-surface-variant);
    }
    .grid {
      position: absolute;
      top: 0;
      bottom: 0;
      border-left: 1px dashed var(--mat-sys-outline-variant);
    }
    .bar {
      --c: #64748b;
      position: absolute;
      top: 5px;
      height: 16px;
      border-radius: 4px;
      background: color-mix(in srgb, var(--c) 35%, white);
      border: 1px solid var(--c);
    }
    .brk {
      position: absolute;
      top: 3px;
      height: 20px;
      border-radius: 4px;
      background: repeating-linear-gradient(45deg, #fde68a, #fde68a 3px, #fef3c7 3px, #fef3c7 6px);
      border: 1px solid #d97706;
      color: #92400e;
      font-weight: 700;
      font-size: 11px;
      text-align: center;
      line-height: 18px;
      overflow: hidden;
    }
    .brk.meal {
      background: repeating-linear-gradient(45deg, #fdba74, #fdba74 3px, #ffedd5 3px, #ffedd5 6px);
      border-color: #c2410c;
      color: #7c2d12;
    }
    .floor .track {
      height: 22px;
      border-top: 1px solid var(--mat-sys-outline-variant);
    }
    .cnt {
      position: absolute;
      top: 2px;
      text-align: center;
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
    }
    .cnt.low {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
      font-weight: 700;
      border-radius: 3px;
    }
  `,
})
export class BreakTimeline {
  readonly date = input.required<IsoDate>();
  readonly shifts = input.required<DayShift[]>();
  readonly slots = input.required<readonly ShiftSlot[]>();
  readonly employees = input.required<readonly Employee[]>();
  readonly breaks = input<Record<string, PlannedBreak[]> | undefined>(undefined);
  readonly colors = input<Map<string, string>>(new Map());
  /** Tick times (minutes) where a coverage rule fails, to highlight. */
  readonly lowTicks = input<Set<number>>(new Set());

  private readonly range = computed<[number, number]>(() => {
    const s = this.shifts();
    if (!s.length) return [0, 1440];
    const a = Math.floor(Math.min(...s.map((x) => x.start)) / 60) * 60;
    const b = Math.ceil(Math.max(...s.map((x) => x.end)) / 60) * 60;
    return [a, Math.max(b, a + 60)];
  });

  protected readonly hours = computed(() => {
    const [a, b] = this.range();
    const step = b - a > 14 * 60 ? 120 : 60;
    const out: { t: number; label: string }[] = [];
    for (let t = a; t <= b; t += step) out.push({ t, label: prettyTime(fmt(t)) });
    return out;
  });

  protected readonly rows = computed<Row[]>(() => {
    const names = new Map(this.employees().map((e) => [e.id, e.name]));
    return this.shifts().map((ds) => {
      const list = this.breaks()?.[`${ds.slot.id}|${ds.employeeId}`] ?? [];
      return {
        key: `${ds.slot.id}|${ds.employeeId}`,
        name: names.get(ds.employeeId) ?? '?',
        color: this.colors().get(ds.slot.templateId) ?? ds.slot.color ?? '#64748b',
        shift: [ds.start, ds.end] as [number, number],
        breaks: breakIntervals(ds, this.breaks()).map((iv, i) => ({
          iv,
          kind: list[i]?.kind ?? 'rest',
          label: `${list[i]?.kind === 'meal' ? 'Meal' : 'Break'} ${prettyTime(fmt(iv[0]))}–${prettyTime(fmt(iv[1]))}`,
        })),
      };
    });
  });

  protected readonly ticks = computed(() =>
    dayTimeline(this.date(), this.slots(), this.breaks())
      .filter((t) => t.onShift.length)
      .map((t) => ({ t: t.t, onFloor: t.onFloor.length, onBreak: t.onBreak.length, low: this.lowTicks().has(t.t) })),
  );

  pct(m: number): number {
    const [a, b] = this.range();
    return ((m - a) / (b - a)) * 100;
  }

  w(iv: [number, number]): number {
    const [a, b] = this.range();
    return ((iv[1] - iv[0]) / (b - a)) * 100;
  }

  fmtT(m: number): string {
    return prettyTime(fmt(m));
  }
}
