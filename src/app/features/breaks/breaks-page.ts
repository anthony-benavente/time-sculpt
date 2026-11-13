import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  activeCoverageRules,
  breakKey,
  countWithRole,
  dayShifts,
  dayTimeline,
  inWindow,
  ruleAppliesOnDate,
} from '../../core/coverage';
import { IsoDate, PlannedBreak, Schedule, WEEKDAY_NAMES } from '../../core/models';
import { EffectiveRules, ScheduleStore, SettingsStore, ShiftTemplateStore } from '../../core/stores';
import { addDays, daysBetween, prettyDate, prettyRange, shiftHours, toMinutes, today, weekdayOf } from '../../core/time';
import { BreakMap, planBreaks, requiredBreaks, validateBreaks } from '../../scheduling/break-planner';
import { BreakTimeline } from './break-timeline';

const MAX_UNDO = 50;

@Component({
  selector: 'app-breaks-page',
  imports: [FormsModule, RouterLink, MatButtonModule, MatButtonToggleModule, MatIconModule, MatMenuModule, MatTooltipModule, BreakTimeline],
  templateUrl: './breaks-page.html',
  styles: `
    .days {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    .day {
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface);
      color: inherit;
      border-radius: 10px;
      padding: 6px 12px;
      cursor: pointer;
      font: inherit;
      text-align: center;
      line-height: 1.2;
    }
    .day small {
      display: block;
      color: var(--mat-sys-on-surface-variant);
    }
    .day.on {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      border-color: var(--mat-sys-primary);
    }
    .day.on small {
      color: inherit;
    }
    .day:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .day .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #059669;
      margin-left: 4px;
      vertical-align: middle;
    }
    .layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 16px;
      align-items: start;
    }
    @media (max-width: 1100px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
    .brk {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-right: 6px;
      padding: 2px 4px 2px 8px;
      border-radius: 8px;
      background: #fef3c7;
    }
    .brk.meal {
      background: #ffedd5;
    }
    .brk input {
      font: inherit;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 6px;
      padding: 1px 4px;
      background: var(--mat-sys-surface);
      color: inherit;
    }
    .brk .x {
      border: 0;
      background: transparent;
      cursor: pointer;
      font-size: 16px;
      color: inherit;
    }
    .issues {
      max-height: 60vh;
      overflow: auto;
    }
  `,
})
export class BreaksPage {
  readonly id = input.required<string>();

  private readonly store = inject(ScheduleStore);
  protected readonly eff = inject(EffectiveRules);
  private readonly templates = inject(ShiftTemplateStore).templates;
  protected readonly settings = inject(SettingsStore).settings;
  private readonly snack = inject(MatSnackBar);
  protected readonly prettyDate = prettyDate;
  protected readonly prettyRange = prettyRange;

  protected readonly schedule = computed(() => this.store.get(this.id())());
  protected readonly policy = computed(() => this.eff.ruleSet().breakPolicy);
  protected readonly week = signal(0);
  protected readonly date = signal<IsoDate>('');
  private readonly undoStack = signal<(BreakMap | undefined)[]>([]);
  protected readonly canUndo = computed(() => this.undoStack().length > 0);

  constructor() {
    let opened: string | null = null;
    effect(() => {
      const s = this.schedule();
      if (!s || s.id === opened) return;
      opened = s.id;
      untracked(() => {
        const t = today();
        const inRange = t >= s.startDate && daysBetween(s.startDate, t) < s.weeks * 7;
        const firstWithShifts = this.allDates(s).find((d) => s.slots.some((x) => x.date === d && x.assignedEmployeeIds.length));
        const d = inRange ? t : (firstWithShifts ?? s.startDate);
        this.date.set(d);
        this.week.set(Math.floor(daysBetween(s.startDate, d) / 7));
      });
    });
  }

  private allDates(s: Schedule): IsoDate[] {
    return Array.from({ length: s.weeks * 7 }, (_, i) => addDays(s.startDate, i));
  }

  protected readonly weekTabs = computed(() => {
    const s = this.schedule();
    return s ? Array.from({ length: s.weeks }, (_, i) => ({ i, label: prettyDate(addDays(s.startDate, i * 7)) })) : [];
  });

  protected readonly days = computed(() => {
    const s = this.schedule();
    if (!s) return [];
    return Array.from({ length: 7 }, (_, i) => addDays(s.startDate, this.week() * 7 + i)).map((d) => {
      const shifts = dayShifts(d, s.slots).filter((x) => x.slot.date === d);
      return {
        date: d,
        name: WEEKDAY_NAMES[weekdayOf(d)],
        label: prettyDate(d),
        working: shifts.length,
        planned: shifts.length > 0 && shifts.every((x) => (s.breaks?.[breakKey(x.slot.id, x.employeeId)]?.length ?? 0) > 0),
      };
    });
  });

  protected readonly shifts = computed(() => {
    const s = this.schedule();
    const d = this.date();
    if (!s || !d) return [];
    return dayShifts(d, s.slots)
      .filter((x) => x.slot.date === d)
      .sort((a, b) => a.start - b.start);
  });

  protected readonly rows = computed(() => {
    const s = this.schedule();
    const names = new Map(this.eff.employees().map((e) => [e.id, e.name]));
    const policy = this.eff.ruleSet().breakPolicy;
    return this.shifts().map((ds) => {
      const key = breakKey(ds.slot.id, ds.employeeId);
      return {
        ds,
        key,
        name: names.get(ds.employeeId) ?? '?',
        hours: Math.round(shiftHours(ds.slot.start, ds.slot.end) * 10) / 10,
        required: requiredBreaks(shiftHours(ds.slot.start, ds.slot.end), policy),
        breaks: s?.breaks?.[key] ?? [],
      };
    });
  });

  protected readonly colors = computed(() => new Map(this.templates().map((t) => [t.id, t.color])));

  protected readonly violations = computed(() => {
    const s = this.schedule();
    const d = this.date();
    if (!s || !d) return [];
    return validateBreaks({ date: d, slots: s.slots, employees: this.eff.employees(), rules: this.eff.ruleSet(), breaks: s.breaks });
  });
  protected readonly errors = computed(() => this.violations().filter((v) => v.severity === 'error'));
  protected readonly warnings = computed(() => this.violations().filter((v) => v.severity === 'warning'));

  /** Ticks where a break-coverage rule fails (for timeline highlighting). */
  protected readonly lowTicks = computed(() => {
    const s = this.schedule();
    const d = this.date();
    const out = new Set<number>();
    if (!s || !d) return out;
    const empById = new Map(this.eff.employees().map((e) => [e.id, e]));
    const rules = activeCoverageRules(this.eff.ruleSet(), 'breaks').filter((r) => ruleAppliesOnDate(r, d));
    for (const t of dayTimeline(d, s.slots, s.breaks)) {
      for (const r of rules) {
        if (inWindow(r, t.t, t.onShift.length > 0) && countWithRole(t.onFloor, r.role, empById) < r.min) out.add(t.t);
      }
    }
    return out;
  });

  // ---------------- mutations ----------------

  private saveBreaks(breaks: BreakMap, message?: string): void {
    const s = this.schedule();
    if (!s) return;
    this.undoStack.update((st) => [...st.slice(-MAX_UNDO + 1), s.breaks]);
    this.store.save({ ...s, breaks });
    if (message) {
      this.snack
        .open(message, 'Undo', { duration: 4000 })
        .onAction()
        .subscribe(() => this.undo());
    }
  }

  undo(): void {
    const st = this.undoStack();
    const s = this.schedule();
    if (!st.length || !s) return;
    this.undoStack.set(st.slice(0, -1));
    this.store.save({ ...s, breaks: st[st.length - 1] });
  }

  private planDates(dates: IsoDate[], base: BreakMap): { breaks: BreakMap; warnings: string[] } {
    const s = this.schedule()!;
    let breaks = { ...base };
    const warnings: string[] = [];
    for (const d of dates) {
      // Drop this day's old breaks, then plan fresh.
      for (const ds of dayShifts(d, s.slots).filter((x) => x.slot.date === d)) delete breaks[breakKey(ds.slot.id, ds.employeeId)];
      const res = planBreaks({ date: d, slots: s.slots, employees: this.eff.employees(), rules: this.eff.ruleSet(), existing: breaks });
      breaks = { ...breaks, ...res.breaks };
      warnings.push(...res.warnings);
    }
    return { breaks, warnings };
  }

  planDay(): void {
    const s = this.schedule();
    if (!s) return;
    const { breaks, warnings } = this.planDates([this.date()], s.breaks ?? {});
    this.saveBreaks(breaks, warnings.length ? `Breaks planned with ${warnings.length} note(s) — see Checks` : 'Breaks planned');
  }

  planAll(): void {
    const s = this.schedule();
    if (!s) return;
    const { breaks } = this.planDates(this.allDates(s), {});
    this.saveBreaks(breaks, `Breaks planned for all ${s.weeks * 7} days`);
  }

  clearDay(): void {
    const s = this.schedule();
    if (!s) return;
    const breaks = { ...(s.breaks ?? {}) };
    for (const ds of this.shifts()) delete breaks[breakKey(ds.slot.id, ds.employeeId)];
    this.saveBreaks(breaks, 'Day cleared');
  }

  private setFor(key: string, list: PlannedBreak[]): void {
    const s = this.schedule();
    if (!s) return;
    const sorted = [...list].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    this.saveBreaks({ ...(s.breaks ?? {}), [key]: sorted });
  }

  setStart(row: { key: string; breaks: PlannedBreak[] }, i: number, start: string): void {
    if (!start) return;
    this.setFor(row.key, row.breaks.map((b, j) => (j === i ? { ...b, start } : b)));
  }

  setMinutes(row: { key: string; breaks: PlannedBreak[] }, i: number, minutes: number): void {
    if (!(minutes > 0)) return;
    this.setFor(row.key, row.breaks.map((b, j) => (j === i ? { ...b, minutes } : b)));
  }

  removeBreak(row: { key: string; breaks: PlannedBreak[] }, i: number): void {
    this.setFor(row.key, row.breaks.filter((_, j) => j !== i));
  }

  addBreak(row: { key: string; breaks: PlannedBreak[]; ds: { slot: { start: string } } }, kind: PlannedBreak['kind']): void {
    const after = row.breaks.length ? row.breaks[row.breaks.length - 1].start : row.ds.slot.start;
    const m = (toMinutes(after) + 120) % 1440;
    const start = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    this.setFor(row.key, [...row.breaks, { kind, start, minutes: kind === 'meal' ? this.policy().defaultMealMinutes : this.policy().defaultRestMinutes }]);
  }

  pickDay(d: IsoDate): void {
    this.date.set(d);
  }

  pickWeek(i: number): void {
    const s = this.schedule();
    if (!s) return;
    this.week.set(i);
    const firstWorking = this.days().find((x) => x.working);
    this.date.set(firstWorking?.date ?? addDays(s.startDate, i * 7));
  }
}
