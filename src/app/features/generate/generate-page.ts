import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { validateSchedule } from '../../core/constraint-checker';
import { newId, Schedule, ScheduleSource, ShiftSlot } from '../../core/models';
import { EffectiveRules, EmployeeStore, ScheduleStore, SettingsStore, ShiftTemplateStore } from '../../core/stores';
import { addDays, formatDate, nextWeekStart, parseDate, prettyDate, today } from '../../core/time';
import { AiSchedulerService } from '../../scheduling/ai-scheduler.service';
import { generateSchedule, SlotGap } from '../../scheduling/greedy-scheduler';
import { repairSchedule } from '../../scheduling/repair';
import { expandTemplates } from '../../scheduling/slot-expander';
import { ScheduleGrid } from '../../shared/schedule-grid';

interface Draft {
  source: ScheduleSource;
  startDate: string;
  weeks: number;
  slots: ShiftSlot[];
  unfilled: SlotGap[];
  warnings: string[];
  notes?: string;
}

@Component({
  selector: 'app-generate-page',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    ScheduleGrid,
  ],
  templateUrl: './generate-page.html',
  styles: `
    .options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
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
    .issues {
      max-height: 220px;
      overflow: auto;
    }
    .error-box {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
      padding: 12px;
      border-radius: 8px;
      margin-top: 12px;
    }
  `,
})
export class GeneratePage {
  protected readonly employees = inject(EmployeeStore);
  protected readonly eff = inject(EffectiveRules);
  protected readonly templateStore = inject(ShiftTemplateStore);
  protected readonly settingsStore = inject(SettingsStore);
  private readonly schedules = inject(ScheduleStore);
  private readonly ai = inject(AiSchedulerService);
  private readonly router = inject(Router);
  protected readonly prettyDate = prettyDate;

  protected startDate: Date = parseDate(nextWeekStart(today(), this.settingsStore.settings().weekStartsOn));
  protected weeks = 2;
  protected method: 'algorithm' | 'ai' = 'algorithm';
  protected extraInstructions = '';
  protected readonly weekOptions = [1, 2, 3, 4, 5, 6, 8];

  protected readonly running = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly draft = signal<Draft | null>(null);
  protected readonly previewWeek = signal(0);
  protected readonly previewMode = signal<'employee' | 'shift'>('employee');
  private abort: AbortController | null = null;

  protected readonly ready = computed(
    () => this.employees.activeEmployees().length > 0 && this.templateStore.templates().length > 0,
  );

  protected readonly violations = computed(() => {
    const d = this.draft();
    return d ? validateSchedule(d, this.eff.employees(), this.eff.restrictions(), this.eff.ruleSet()) : [];
  });
  protected readonly errors = computed(() => this.violations().filter((v) => v.severity === 'error'));
  protected readonly stats = computed(() => {
    const d = this.draft();
    if (!d) return null;
    const needed = d.slots.reduce((s, x) => s + x.headcount, 0);
    const filled = d.slots.reduce((s, x) => s + Math.min(x.headcount, x.assignedEmployeeIds.length), 0);
    return { needed, filled, pct: needed ? Math.round((filled / needed) * 100) : 100 };
  });
  protected readonly weekTabs = computed(() => {
    const d = this.draft();
    return d ? Array.from({ length: d.weeks }, (_, i) => ({ i, label: prettyDate(addDays(d.startDate, i * 7)) })) : [];
  });

  async run(): Promise<void> {
    this.error.set(null);
    this.running.set(true);
    this.previewWeek.set(0);
    const startDate = formatDate(this.startDate);
    const weeks = this.weeks;
    const slots = expandTemplates(startDate, weeks, this.templateStore.templates());
    try {
      if (this.method === 'algorithm') {
        // Let the spinner render before the synchronous work.
        await new Promise((r) => setTimeout(r, 30));
        const result = generateSchedule({
          startDate,
          weeks,
          slots,
          employees: this.eff.employees(),
          restrictions: this.eff.restrictions(),
          rules: this.eff.ruleSet(),
        });
        this.draft.set({ source: 'algorithm', startDate, weeks, ...result });
      } else {
        this.abort = new AbortController();
        const result = await this.ai.generate({
          startDate,
          weeks,
          slots,
          employees: this.eff.employees(),
          restrictions: this.eff.restrictions(),
          rules: this.eff.ruleSet(),
          templates: this.templateStore.templates(),
          extraInstructions: this.extraInstructions,
          signal: this.abort.signal,
        });
        this.draft.set({
          source: 'ai',
          startDate,
          weeks,
          slots: result.slots,
          unfilled: [],
          warnings: result.problems,
          notes: result.notes,
        });
      }
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : String(e));
    } finally {
      this.running.set(false);
      this.abort = null;
    }
  }

  cancel(): void {
    this.abort?.abort();
  }

  fixWithAlgorithm(): void {
    const d = this.draft();
    if (!d) return;
    const result = repairSchedule({
      startDate: d.startDate,
      weeks: d.weeks,
      slots: d.slots,
      employees: this.eff.employees(),
      restrictions: this.eff.restrictions(),
      rules: this.eff.ruleSet(),
    });
    this.draft.set({
      ...d,
      slots: result.slots,
      unfilled: result.unfilled,
      warnings: [`Removed ${result.removed} assignment(s) that broke rules and filled gaps with the algorithm.`, ...result.warnings],
    });
  }

  save(): void {
    const d = this.draft();
    if (!d) return;
    const now = new Date().toISOString();
    const end = addDays(d.startDate, d.weeks * 7 - 1);
    const schedule: Schedule = {
      id: newId(),
      name: `${prettyDate(d.startDate)} – ${prettyDate(end)}`,
      startDate: d.startDate,
      weeks: d.weeks,
      createdAt: now,
      updatedAt: now,
      source: d.source,
      notes: d.notes,
      slots: d.slots,
    };
    this.schedules.save(schedule);
    this.router.navigate(['/schedules', schedule.id]);
  }
}
