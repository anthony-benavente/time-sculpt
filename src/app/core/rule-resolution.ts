import { Employee, LimitKind, LimitRule, Restriction, RuleSet, Scope, UnavailableRule, Weekday } from './models';

const LIMIT_FIELD: Record<LimitKind, keyof Employee> = {
  'max-hours-week': 'maxHoursPerWeek',
  'min-hours-week': 'minHoursPerWeek',
  'max-shifts-day': 'maxShiftsPerDay',
  'max-consecutive-days': 'maxConsecutiveDays',
  'min-rest-hours': 'minRestHours',
};

/** For "max"-style limits the smallest value is strictest; for "min"-style the largest. */
const STRICTER: Record<LimitKind, (a: number, b: number) => number> = {
  'max-hours-week': Math.min,
  'min-hours-week': Math.max,
  'max-shifts-day': Math.min,
  'max-consecutive-days': Math.min,
  'min-rest-hours': Math.max,
};

export function scopeMatches(scope: Scope, employee: Employee): boolean {
  return scope.kind === 'everyone' || employee.roles.some((r) => r.toLowerCase() === scope.role.toLowerCase());
}

export type LimitSource = 'employee' | 'role' | 'team' | 'none';

export interface ResolvedLimit {
  value: number | null;
  source: LimitSource;
  /** Role name when source is 'role'. */
  role?: string;
}

/** The value an employee's limit resolves to and where it came from. Employee > role (strictest) > team. */
export function resolveLimit(employee: Employee, limit: LimitKind, ruleSet: RuleSet | null | undefined): ResolvedLimit {
  const own = employee[LIMIT_FIELD[limit]] as number | null | undefined;
  if (own != null && own !== 0) return { value: own, source: 'employee' };
  const rules = (ruleSet?.rules ?? []).filter((r): r is LimitRule => r.type === 'limit' && r.enabled && r.limit === limit);
  let roleValue: number | null = null;
  let roleName: string | undefined;
  for (const r of rules) {
    if (r.scope.kind !== 'role' || !scopeMatches(r.scope, employee)) continue;
    const next: number = roleValue == null ? r.value : STRICTER[limit](roleValue, r.value);
    if (next !== roleValue) roleName = r.scope.role;
    roleValue = next;
  }
  if (roleValue != null) return { value: roleValue, source: 'role', role: roleName };
  const team = rules.filter((r) => r.scope.kind === 'everyone').map((r) => r.value);
  if (team.length) return { value: team.reduce(STRICTER[limit]), source: 'team' };
  return { value: null, source: 'none' };
}

/** Employees with team/role limits filled in where they have no value of their own. */
export function resolveEmployees(employees: readonly Employee[], ruleSet: RuleSet | null | undefined): Employee[] {
  if (!ruleSet?.rules.some((r) => r.type === 'limit' && r.enabled)) return [...employees];
  return employees.map((e) => {
    const out: Employee = { ...e };
    for (const limit of Object.keys(LIMIT_FIELD) as LimitKind[]) {
      const r = resolveLimit(e, limit, ruleSet);
      if (r.source === 'role' || r.source === 'team') (out as unknown as Record<string, unknown>)[LIMIT_FIELD[limit]] = r.value;
    }
    return out;
  });
}

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

/** Employee restrictions plus weekly unavailability expanded from team/role rules. */
export function resolveRestrictions(
  employees: readonly Employee[],
  restrictions: readonly Restriction[],
  ruleSet: RuleSet | null | undefined,
): Restriction[] {
  const rules = (ruleSet?.rules ?? []).filter((r): r is UnavailableRule => r.type === 'unavailable' && r.enabled);
  if (!rules.length) return [...restrictions];
  const extra: Restriction[] = [];
  for (const rule of rules) {
    for (const e of employees) {
      if (!scopeMatches(rule.scope, e)) continue;
      for (const day of rule.days ?? ALL_DAYS) {
        extra.push({
          id: `rule:${rule.id}:${e.id}:${day}`,
          employeeId: e.id,
          type: 'weekly-unavailable',
          weekday: day,
          start: rule.from,
          end: rule.to,
        });
      }
    }
  }
  return [...restrictions, ...extra];
}
