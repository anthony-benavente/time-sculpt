import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { validateSchedule } from '../../core/constraint-checker';
import { resolveEmployees, resolveRestrictions } from '../../core/rule-resolution';
import { EmployeeStore, RulesStore, ScheduleStore, SettingsStore, ShiftTemplateStore } from '../../core/stores';
import { addDays, prettyDate } from '../../core/time';
import { ImportOptions, planTeamsImport } from '../../import/teams-import-plan';
import { DateOrder, parseCsv, parseTeamsWorkbook, RawSheet, TeamsWorkbook } from '../../import/teams-shifts';
import { ScheduleGrid } from '../../shared/schedule-grid';

@Component({
  selector: 'app-import-page',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    ScheduleGrid,
  ],
  templateUrl: './import-page.html',
  styles: `
    ol.steps {
      margin: 0;
      padding-left: 20px;
      line-height: 1.7;
    }
    .drop {
      border: 2px dashed var(--mat-sys-outline-variant);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: background 0.15s;
    }
    .drop:hover,
    .drop.over {
      background: var(--mat-sys-surface-container-low);
      border-color: var(--mat-sys-primary);
    }
    .summary {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .stat {
      background: var(--mat-sys-surface-container);
      border-radius: 8px;
      padding: 8px 14px;
      min-width: 110px;
    }
    .stat b {
      display: block;
      font-size: 20px;
    }
    .options {
      display: flex;
      flex-direction: column;
    }
    .error-box {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
      padding: 12px;
      border-radius: 8px;
    }
    .people {
      max-height: 320px;
      overflow: auto;
    }
  `,
})
export class ImportPage {
  private readonly employees = inject(EmployeeStore);
  private readonly rules = inject(RulesStore);
  private readonly templateStore = inject(ShiftTemplateStore);
  private readonly schedules = inject(ScheduleStore);
  private readonly settings = inject(SettingsStore).settings;
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  protected readonly prettyDate = prettyDate;

  protected readonly fileName = signal<string | null>(null);
  protected readonly reading = signal(false);
  protected readonly readError = signal<string | null>(null);
  private readonly raw = signal<RawSheet[] | null>(null);
  protected readonly dateOrder = signal<DateOrder | null>(null);
  protected readonly dragOver = signal(false);

  protected readonly opts = signal<ImportOptions>({
    importSchedule: true,
    createEmployees: true,
    importTimeOff: true,
    createTemplates: false,
  });

  protected readonly previewWeek = signal(0);

  protected readonly parsed = computed<{ wb: TeamsWorkbook | null; error: string | null }>(() => {
    const raw = this.raw();
    if (!raw) return { wb: null, error: null };
    try {
      return { wb: parseTeamsWorkbook(raw, this.dateOrder() ?? undefined), error: null };
    } catch (e) {
      return { wb: null, error: e instanceof Error ? e.message : String(e) };
    }
  });

  protected readonly plan = computed(() => {
    const wb = this.parsed().wb;
    if (!wb) return null;
    return planTeamsImport(
      wb,
      {
        employees: this.employees.employees(),
        templates: this.templateStore.templates(),
        weekStartsOn: this.settings().weekStartsOn,
      },
      this.opts(),
    );
  });

  protected readonly matchedCount = computed(() => this.plan()?.people.filter((p) => p.existing).length ?? 0);
  protected readonly newCount = computed(() => this.plan()?.people.filter((p) => !p.existing).length ?? 0);

  /** Employees and templates as they will be after import (for the preview grid). */
  protected readonly previewEmployees = computed(() => [...this.employees.employees(), ...(this.plan()?.newEmployees ?? [])]);
  protected readonly previewTemplates = computed(() => [...this.templateStore.templates(), ...(this.plan()?.newTemplates ?? [])]);
  protected readonly previewViolations = computed(() => {
    const p = this.plan();
    if (!p?.schedule) return [];
    const rules = this.rules.ruleSet();
    const employees = resolveEmployees(this.previewEmployees(), rules);
    const restrictions = resolveRestrictions(employees, [...this.employees.restrictions(), ...p.timeOff], rules);
    return validateSchedule(p.schedule, employees, restrictions, rules);
  });
  protected readonly weekTabs = computed(() => {
    const s = this.plan()?.schedule;
    return s ? Array.from({ length: s.weeks }, (_, i) => ({ i, label: prettyDate(addDays(s.startDate, i * 7)) })) : [];
  });

  setOpt<K extends keyof ImportOptions>(key: K, value: ImportOptions[K]): void {
    this.opts.update((o) => ({ ...o, [key]: value }));
  }

  async onFile(file: File | undefined | null): Promise<void> {
    if (!file) return;
    this.fileName.set(file.name);
    this.readError.set(null);
    this.raw.set(null);
    this.dateOrder.set(null);
    this.previewWeek.set(0);
    this.reading.set(true);
    try {
      if (/\.csv$/i.test(file.name) || file.type === 'text/csv') {
        this.raw.set([{ sheet: 'CSV', data: parseCsv(await file.text()) }]);
      } else if (/\.xlsx$/i.test(file.name)) {
        const { default: readExcelFile } = await import('read-excel-file/browser');
        const sheets = await readExcelFile(file);
        this.raw.set(sheets.map((s) => ({ sheet: s.sheet, data: s.data as RawSheet['data'] })));
      } else {
        throw new Error('Choose the .xlsx file exported from Teams Shifts (or a .csv saved from it).');
      }
    } catch (e) {
      this.readError.set(e instanceof Error ? e.message : String(e));
    } finally {
      this.reading.set(false);
    }
  }

  onInput(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    this.onFile(input.files?.[0]);
    input.value = '';
  }

  onDrop(ev: DragEvent): void {
    ev.preventDefault();
    this.dragOver.set(false);
    this.onFile(ev.dataTransfer?.files?.[0]);
  }

  reset(): void {
    this.raw.set(null);
    this.fileName.set(null);
    this.readError.set(null);
  }

  canImport(): boolean {
    const p = this.plan();
    if (!p) return false;
    return !!p.schedule || p.newEmployees.length > 0 || p.timeOff.length > 0 || p.newTemplates.length > 0;
  }

  doImport(): void {
    const p = this.plan();
    if (!p) return;
    this.employees.addMany(p.newEmployees);
    this.templateStore.addMany(p.newTemplates);
    this.employees.addRestrictions(p.timeOff);
    if (p.schedule) this.schedules.save(p.schedule);

    const parts: string[] = [];
    if (p.schedule) parts.push(`a ${p.schedule.weeks}-week schedule`);
    if (p.newEmployees.length) parts.push(`${p.newEmployees.length} employee(s)`);
    if (p.timeOff.length) parts.push(`${p.timeOff.length} time-off entr${p.timeOff.length > 1 ? 'ies' : 'y'}`);
    if (p.newTemplates.length) parts.push(`${p.newTemplates.length} shift template(s)`);
    this.snack.open(`Imported ${parts.join(', ')}.`, undefined, { duration: 4000 });
    this.router.navigate(p.schedule ? ['/schedules', p.schedule.id] : ['/employees']);
  }
}
