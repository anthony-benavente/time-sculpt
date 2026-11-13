import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  BreakKind,
  BreakPolicy,
  BuiltInId,
  Employee,
  LimitKind,
  newId,
  Rule,
  Severity,
} from '../../core/models';
import { resolveLimit } from '../../core/rule-resolution';
import { BREAK_PRESETS, BUILT_INS, CORE_RULES, LIMIT_LABELS } from '../../core/rules-defaults';
import { formatConfig, formatPersonLines, parseConfig, planApply } from '../../core/rules-text';
import { EmployeeStore, RulesStore, ShiftTemplateStore } from '../../core/stores';
import { today } from '../../core/time';
import { confirm } from '../../shared/confirm-dialog';
import { RuleCard } from './rule-card';

type Section = 'team' | 'coverage' | 'people' | 'breaks';

const LIMIT_FIELD: Record<LimitKind, keyof Employee> = {
  'max-hours-week': 'maxHoursPerWeek',
  'min-hours-week': 'minHoursPerWeek',
  'max-shifts-day': 'maxShiftsPerDay',
  'max-consecutive-days': 'maxConsecutiveDays',
  'min-rest-hours': 'minRestHours',
};

@Component({
  selector: 'app-rules-page',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
    RuleCard,
  ],
  templateUrl: './rules-page.html',
  styleUrl: './rules-page.scss',
})
export class RulesPage {
  protected readonly store = inject(RulesStore);
  protected readonly employeeStore = inject(EmployeeStore);
  private readonly templates = inject(ShiftTemplateStore).templates;
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  protected readonly builtIns = BUILT_INS;
  protected readonly coreRules = CORE_RULES;
  protected readonly presets = Object.entries(BREAK_PRESETS) as [keyof typeof BREAK_PRESETS, (typeof BREAK_PRESETS)[keyof typeof BREAK_PRESETS]][];
  protected readonly limitKinds = Object.entries(LIMIT_LABELS) as [LimitKind, string][];
  protected readonly limitField = LIMIT_FIELD;

  protected readonly query = signal('');
  protected readonly tab = signal(0);
  protected readonly expanded = signal<string | null>(null);

  protected readonly roles = computed(() => {
    const set = new Set(this.employeeStore.allRoles());
    for (const r of this.store.rules()) {
      if (r.type === 'coverage' && r.role) set.add(r.role);
      if ((r.type === 'limit' || r.type === 'unavailable') && r.scope.kind === 'role') set.add(r.scope.role);
    }
    return [...set].sort();
  });

  private matches(rule: Rule): boolean {
    const q = this.query().trim().toLowerCase();
    if (!q) return true;
    const names = new Map(this.employeeStore.employees().map((e) => [e.id, e.name]));
    return JSON.stringify(rule).toLowerCase().includes(q) || (rule.type === 'never-together' && rule.employeeIds.some((id) => names.get(id)?.toLowerCase().includes(q)));
  }

  protected readonly section = computed(() => {
    const rules = this.store.rules().filter((r) => this.matches(r));
    return {
      team: rules.filter((r) => r.type === 'limit' || r.type === 'unavailable'),
      coverage: rules.filter((r) => r.type === 'coverage'),
      people: rules.filter((r) => r.type === 'never-together'),
      breaks: rules.filter((r) => r.type === 'max-on-break' || r.type === 'break-blackout'),
    } satisfies Record<Section, Rule[]>;
  });

  protected readonly people = computed(() => {
    const q = this.query().trim().toLowerCase();
    const rs = this.store.ruleSet();
    const restrictions = this.employeeStore.restrictions();
    const t = today();
    return this.employeeStore
      .employees()
      .filter((e) => !q || e.name.toLowerCase().includes(q) || e.roles.some((r) => r.toLowerCase().includes(q)))
      .map((e) => ({
        emp: e,
        lines: formatPersonLines(e, restrictions, this.templates(), t).map((l) => l.slice(e.name.length + 2)),
        limits: this.limitKinds.map(([k, label]) => ({ kind: k, label, resolved: resolveLimit(e, k, rs), own: e[LIMIT_FIELD[k]] as number | null | undefined })),
      }));
  });

  // ---------------- builder actions ----------------

  setBuiltIn(id: BuiltInId, enabled: boolean, severity: Severity): void {
    this.store.setBuiltIn(id, { enabled, severity });
  }

  add(kind: string): void {
    const base = { id: newId(), enabled: true, severity: 'hard' as Severity };
    const all = { days: null, from: null, to: null };
    const rules: Record<string, Rule> = {
      manager: { ...base, type: 'coverage', role: 'Manager', min: 1, ...all, appliesTo: ['schedule', 'breaks'] },
      'role-window': { ...base, type: 'coverage', role: this.roles()[0] ?? 'Cashier', min: 2, days: [1, 2, 3, 4, 5], from: '11:00', to: '14:00', appliesTo: ['schedule', 'breaks'] },
      'min-people': { ...base, type: 'coverage', role: null, min: 2, ...all, appliesTo: ['schedule', 'breaks'] },
      'never-together': { ...base, type: 'never-together', employeeIds: [] },
      'max-on-break': { ...base, severity: 'soft', type: 'max-on-break', max: 2, ...all },
      blackout: { ...base, type: 'break-blackout', from: '12:00', to: '13:00', days: null },
      'team-limit': { ...base, type: 'limit', scope: { kind: 'everyone' }, limit: 'max-hours-week', value: 40 },
      'role-limit': { ...base, type: 'limit', scope: { kind: 'role', role: this.roles()[0] ?? 'Manager' }, limit: 'max-shifts-day', value: 1 },
      'team-unavailable': { ...base, type: 'unavailable', scope: { kind: 'everyone' }, days: [0], from: null, to: null },
    };
    this.store.add(rules[kind]);
  }

  update(id: string, patch: Partial<Rule>): void {
    this.store.update(id, patch);
  }

  remove(id: string): void {
    const rule = this.store.remove(id);
    if (!rule) return;
    this.snack
      .open('Rule deleted', 'Undo', { duration: 4000 })
      .onAction()
      .subscribe(() => this.store.add(rule));
  }

  setPersonLimit(emp: Employee, kind: LimitKind, value: string): void {
    const n = value === '' ? null : Number(value);
    this.employeeStore.update(emp.id, { [LIMIT_FIELD[kind]]: n != null && Number.isFinite(n) && n > 0 ? n : null } as Partial<Employee>);
  }

  inheritLabel(r: { resolved: ReturnType<typeof resolveLimit>; own: number | null | undefined }): string {
    if (r.own) return '';
    if (r.resolved.source === 'role') return `${r.resolved.value} (from ${r.resolved.role})`;
    if (r.resolved.source === 'team') return `${r.resolved.value} (team)`;
    return 'none';
  }

  // ---------------- break policy ----------------

  setPolicy(patch: Partial<BreakPolicy>): void {
    this.store.setBreakPolicy({ ...this.store.ruleSet().breakPolicy, ...patch });
  }

  usePreset(key: keyof typeof BREAK_PRESETS): void {
    this.store.setBreakPolicy(structuredClone(BREAK_PRESETS[key].policy));
  }

  setTier(i: number, patch: Partial<BreakPolicy['tiers'][number]>): void {
    const tiers = this.store.ruleSet().breakPolicy.tiers.map((t, j) => (j === i ? { ...t, ...patch } : t));
    this.setPolicy({ tiers });
  }

  /** Change a default length; breaks that were using the old default follow it. */
  setDefaultLength(kind: BreakKind, value: unknown): void {
    const minutes = this.num(value, 5);
    const pol = this.store.ruleSet().breakPolicy;
    const old = kind === 'meal' ? pol.defaultMealMinutes : pol.defaultRestMinutes;
    this.setPolicy({
      [kind === 'meal' ? 'defaultMealMinutes' : 'defaultRestMinutes']: minutes,
      tiers: pol.tiers.map((t) => ({
        ...t,
        breaks: t.breaks.map((b) => (b.kind === kind && b.minutes === old ? { ...b, minutes } : b)),
      })),
    });
  }

  addTier(): void {
    const tiers = this.store.ruleSet().breakPolicy.tiers;
    const last = tiers[tiers.length - 1];
    this.setPolicy({
      tiers: [...tiers, { minShiftHours: (last?.minShiftHours ?? 2) + 2, breaks: [...(last?.breaks ?? []), { kind: 'rest', minutes: this.store.ruleSet().breakPolicy.defaultRestMinutes }] }],
    });
  }

  removeTier(i: number): void {
    this.setPolicy({ tiers: this.store.ruleSet().breakPolicy.tiers.filter((_, j) => j !== i) });
  }

  setTierBreak(i: number, b: number, patch: Partial<{ kind: BreakKind; minutes: number }>): void {
    const tier = this.store.ruleSet().breakPolicy.tiers[i];
    this.setTier(i, { breaks: tier.breaks.map((x, k) => (k === b ? { ...x, ...patch } : x)) });
  }

  addTierBreak(i: number): void {
    const tier = this.store.ruleSet().breakPolicy.tiers[i];
    this.setTier(i, { breaks: [...tier.breaks, { kind: 'rest', minutes: this.store.ruleSet().breakPolicy.defaultRestMinutes }] });
  }

  removeTierBreak(i: number, b: number): void {
    const tier = this.store.ruleSet().breakPolicy.tiers[i];
    this.setTier(i, { breaks: tier.breaks.filter((_, k) => k !== b) });
  }

  num(v: unknown, min = 0): number {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(min, n) : min;
  }

  // ---------------- text tab ----------------

  protected readonly includePast = signal(false);
  protected readonly replaceAll = signal(false);
  protected readonly text = signal('');
  protected readonly dirty = signal(false);

  private ctx() {
    return {
      employees: this.employeeStore.employees(),
      restrictions: this.employeeStore.restrictions(),
      templates: this.templates(),
      today: today(),
    };
  }

  /** The text generated from the current rules. */
  protected readonly generated = computed(() =>
    formatConfig(this.store.ruleSet(), this.ctx(), { includePast: this.includePast() }),
  );

  constructor() {
    // Keep the editor in sync with the builder until the user starts typing.
    effect(() => {
      const g = this.generated();
      untracked(() => {
        if (!this.dirty()) this.text.set(g);
      });
    });
  }

  protected readonly parsed = computed(() => parseConfig(this.text(), this.ctx()));
  protected readonly lineNumbers = computed(() => Array.from({ length: this.text().split('\n').length }, (_, i) => i + 1));
  protected readonly errorLines = computed(() => new Set(this.parsed().errors.map((e) => e.line)));

  onText(value: string): void {
    this.text.set(value);
    this.dirty.set(true);
  }

  revert(): void {
    this.dirty.set(false);
    this.text.set(this.generated());
  }

  async applyText(): Promise<void> {
    const p = this.parsed();
    if (p.errors.length) return;
    const ctx = this.ctx();
    const plan = planApply(p.config, this.store.ruleSet(), ctx, this.replaceAll());
    if (!plan.summary.length) {
      this.snack.open('No changes to apply.', undefined, { duration: 2500 });
      this.revert();
      return;
    }
    const ok = await confirm(this.dialog, {
      title: 'Apply these changes?',
      message: plan.summary.join(' · '),
      confirmText: 'Apply',
    });
    if (!ok) return;
    this.store.set(plan.ruleSet);
    this.employeeStore.applyPeople(plan.employeePatches, plan.restrictions);
    this.dirty.set(false);
    this.text.set(this.generated());
    this.snack.open('Rules updated.', undefined, { duration: 2500 });
  }

  jumpToLine(textarea: HTMLTextAreaElement, line: number): void {
    const lines = this.text().split('\n');
    const start = lines.slice(0, line - 1).reduce((a, l) => a + l.length + 1, 0);
    textarea.focus();
    textarea.setSelectionRange(start, start + (lines[line - 1]?.length ?? 0));
  }
}
