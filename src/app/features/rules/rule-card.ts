import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Employee, LimitKind, Rule, Scope } from '../../core/models';
import { LIMIT_LABELS } from '../../core/rules-defaults';
import { DayPicker, TimeWindow } from './rule-controls';

/** One editable rule, written as a sentence with inline controls. */
@Component({
  selector: 'app-rule-card',
  imports: [
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    DayPicker,
    TimeWindow,
  ],
  templateUrl: './rule-card.html',
  styles: `
    :host {
      display: block;
    }
    .rule {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 10px;
      padding: 10px 12px;
      margin-bottom: 8px;
      background: var(--mat-sys-surface);
    }
    .rule.off {
      opacity: 0.55;
    }
    .sentence {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 8px;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 14px;
      margin-top: 8px;
    }
    input.n,
    input.txt,
    select {
      font: inherit;
      padding: 3px 6px;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 6px;
      background: var(--mat-sys-surface);
      color: inherit;
    }
    input.n {
      width: 56px;
    }
    input.txt {
      width: 130px;
    }
    .sev {
      --mat-standard-button-toggle-height: 26px;
      font-size: 12px;
    }
    .spacer {
      flex: 1;
    }
  `,
})
export class RuleCard {
  readonly rule = input.required<Rule>();
  readonly roles = input<string[]>([]);
  readonly employees = input<readonly Employee[]>([]);
  readonly changed = output<Partial<Rule>>();
  readonly removed = output<void>();

  protected readonly limitKinds = Object.entries(LIMIT_LABELS) as [LimitKind, string][];
  protected readonly datalistId = `roles-${Math.random().toString(36).slice(2)}`;
  protected readonly scopeValue = computed(() => {
    const r = this.rule();
    return 'scope' in r ? (r.scope.kind === 'everyone' ? '' : r.scope.role) : '';
  });

  set(patch: Record<string, unknown>): void {
    this.changed.emit(patch as Partial<Rule>);
  }

  setScope(value: string): void {
    const v = value.trim();
    const scope: Scope = !v || /^everyone$/i.test(v) ? { kind: 'everyone' } : { kind: 'role', role: v };
    this.set({ scope });
  }

  setRole(value: string): void {
    const v = value.trim();
    this.set({ role: !v || /^(anyone|people|person)$/i.test(v) ? null : v });
  }

  toggleTarget(target: 'schedule' | 'breaks'): void {
    const r = this.rule();
    if (r.type !== 'coverage') return;
    const has = r.appliesTo.includes(target);
    const next = has ? r.appliesTo.filter((t) => t !== target) : [...r.appliesTo, target];
    if (next.length) this.set({ appliesTo: next });
  }

  num(v: unknown, min = 0): number {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(min, n) : min;
  }
}
