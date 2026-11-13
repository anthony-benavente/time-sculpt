import { Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { breakKey, dayShifts } from '../../core/coverage';
import { IsoDate, PlannedBreak, WEEKDAY_FULL_NAMES } from '../../core/models';
import { EffectiveRules, ScheduleStore, SettingsStore } from '../../core/stores';
import { addDays, prettyDate, prettyRange, prettyTime, weekdayOf } from '../../core/time';

interface SheetRow {
  name: string;
  shift: string;
  cols: (PlannedBreak | null)[];
  start: number;
}

/** Printable daily break sheet: one portrait page per day. */
@Component({
  selector: 'app-breaks-print-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatButtonToggleModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (schedule(); as s) {
      <div class="bp-toolbar no-print">
        <a mat-button [routerLink]="['/schedules', s.id, 'breaks']"><mat-icon>arrow_back</mat-icon>Back</a>
        <mat-button-toggle-group [value]="scope()" (change)="scope.set($event.value)" hideSingleSelectionIndicator>
          <mat-button-toggle value="day">This day</mat-button-toggle>
          <mat-button-toggle value="week">This week</mat-button-toggle>
          <mat-button-toggle value="all">Whole schedule</mat-button-toggle>
        </mat-button-toggle-group>
        <span class="spacer"></span>
        <span class="muted small">Portrait, one day per page</span>
        <button mat-flat-button (click)="print()"><mat-icon>print</mat-icon>Print</button>
      </div>
      <div class="bp-root">
        @for (p of pages(); track p.date) {
          <section class="bp-sheet">
            <header>
              <div>
                <div class="biz">{{ settings().businessName }}</div>
                <div class="title">Break schedule · {{ p.dayName }}, {{ p.pretty }}</div>
              </div>
              <div class="meta">{{ p.rows.length }} working</div>
            </header>
            <table class="bp">
              <thead>
                <tr>
                  <th class="n">Name</th>
                  <th class="sh">Shift</th>
                  @for (h of p.headers; track $index) {
                    <th>{{ h }}</th>
                  }
                  <th class="ok">Taken ✓ / initials</th>
                </tr>
              </thead>
              <tbody>
                @for (r of p.rows; track $index) {
                  <tr>
                    <td class="n">{{ r.name }}</td>
                    <td class="sh">{{ r.shift }}</td>
                    @for (c of r.cols; track $index) {
                      <td class="c">
                        @if (c) {
                          <b>{{ time(c.start) }}</b> <span class="len">{{ c.minutes }}m</span>
                        }
                      </td>
                    }
                    <td class="ok"></td>
                  </tr>
                }
              </tbody>
            </table>
            @if (!p.planned) {
              <p class="note">Breaks haven't been planned for this day yet.</p>
            }
            <footer>Printed {{ printedOn }}</footer>
          </section>
        } @empty {
          <p style="padding: 24px">Nobody is scheduled on the selected day(s).</p>
        }
      </div>
    }
  `,
  styles: `
    @page {
      size: portrait;
      margin: 12mm;
    }
    .bp-toolbar {
      position: sticky;
      top: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding: 8px 16px;
      background: var(--mat-sys-surface-container);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .bp-root {
      padding: 16px;
      background: #e5e7eb;
      color: #111;
    }
    .bp-sheet {
      background: #fff;
      width: 186mm;
      min-height: 250mm;
      margin: 0 auto 16px;
      padding: 10mm;
      box-sizing: border-box;
      box-shadow: 0 1px 4px rgb(0 0 0 / 0.2);
      display: flex;
      flex-direction: column;
      font-family: Roboto, Arial, sans-serif;
    }
    .bp-sheet header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid #111;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .bp-sheet .biz {
      font-size: 18px;
      font-weight: 700;
    }
    .bp-sheet .title {
      font-size: 14px;
    }
    .bp-sheet .meta {
      font-size: 11px;
      color: #444;
    }
    table.bp {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    table.bp th,
    table.bp td {
      border: 1px solid #444;
      padding: 6px;
      text-align: left;
    }
    table.bp th {
      background: #f3f4f6;
    }
    table.bp td.c {
      white-space: nowrap;
    }
    table.bp .len {
      margin-left: 4px;
      color: #555;
      font-size: 11px;
    }
    table.bp .ok {
      width: 30mm;
    }
    table.bp tr {
      break-inside: avoid;
    }
    .bp-sheet .note {
      font-size: 11px;
      color: #555;
    }
    .bp-sheet footer {
      margin-top: auto;
      padding-top: 6px;
      font-size: 9px;
      color: #666;
      text-align: right;
    }
    @media print {
      .bp-root {
        padding: 0;
        background: #fff;
      }
      .bp-sheet {
        width: auto;
        min-height: 0;
        margin: 0;
        padding: 0;
        box-shadow: none;
        break-after: page;
      }
      .bp-sheet:last-child {
        break-after: auto;
      }
    }
  `,
})
export class BreaksPrintPage {
  readonly id = input.required<string>();
  /** ?date=yyyy-mm-dd */
  readonly date = input<string | undefined>(undefined);

  private readonly store = inject(ScheduleStore);
  private readonly eff = inject(EffectiveRules);
  protected readonly settings = inject(SettingsStore).settings;
  protected readonly scope = signal<'day' | 'week' | 'all'>('day');
  protected readonly printedOn = new Date().toLocaleDateString();

  protected readonly schedule = computed(() => this.store.get(this.id())());

  private readonly dates = computed<IsoDate[]>(() => {
    const s = this.schedule();
    if (!s) return [];
    const all = Array.from({ length: s.weeks * 7 }, (_, i) => addDays(s.startDate, i));
    const d = this.date() && all.includes(this.date()!) ? this.date()! : s.startDate;
    if (this.scope() === 'day') return [d];
    if (this.scope() === 'week') {
      const w = Math.floor(all.indexOf(d) / 7);
      return all.slice(w * 7, w * 7 + 7);
    }
    return all;
  });

  protected readonly pages = computed(() => {
    const s = this.schedule();
    if (!s) return [];
    const names = new Map(this.eff.employees().map((e) => [e.id, e.name]));
    return this.dates()
      .map((date) => {
        const shifts = dayShifts(date, s.slots).filter((x) => x.slot.date === date);
        const lists = shifts.map((ds) => s.breaks?.[breakKey(ds.slot.id, ds.employeeId)] ?? []);
        // Column headers from the longest pattern: Break 1, Meal, Break 2...
        const longest = lists.reduce((a, b) => (b.length > a.length ? b : a), [] as PlannedBreak[]);
        let rest = 0;
        let meal = 0;
        const headers = longest.map((b) => (b.kind === 'meal' ? `Meal${++meal > 1 ? ` ${meal}` : ''}` : `Break ${++rest}`));
        const rows: SheetRow[] = shifts
          .map((ds, i) => ({
            name: names.get(ds.employeeId) ?? '?',
            shift: prettyRange(ds.slot.start, ds.slot.end),
            start: ds.start,
            cols: headers.map((_, k) => lists[i][k] ?? null),
          }))
          .sort((a, b) => a.start - b.start || a.name.localeCompare(b.name));
        return {
          date,
          dayName: WEEKDAY_FULL_NAMES[weekdayOf(date)],
          pretty: prettyDate(date),
          headers: headers.length ? headers : ['Break 1', 'Meal', 'Break 2'],
          rows: rows.map((r) => ({ ...r, cols: r.cols.length ? r.cols : [null, null, null] })),
          planned: lists.some((l) => l.length),
        };
      })
      .filter((p) => p.rows.length);
  });

  time(t: string): string {
    return prettyTime(t);
  }

  print(): void {
    window.print();
  }
}

