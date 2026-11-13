/**
 * Plain-English text form of the whole rule configuration.
 *
 *   formatConfig(...)  -> text shown in the "Edit as text" tab
 *   parseConfig(...)   -> rule set + per-person settings, with line-numbered errors
 *
 * One rule per line. "#" starts a comment. "# off: <rule>" is a disabled rule.
 * Section headers ("## Team") are only for readability.
 */
import {
  BreakKind,
  BreakPolicy,
  BuiltInId,
  CoverageRule,
  Employee,
  HHmm,
  IsoDate,
  LimitKind,
  newId,
  Restriction,
  Rule,
  RuleSet,
  Scope,
  ShiftTemplate,
  TimeOff,
  Weekday,
  WEEKDAY_NAMES,
} from './models';
import { BUILT_INS, CORE_RULES, defaultBuiltIns } from './rules-defaults';
import { formatDate, parseDate } from './time';

// ---------------------------------------------------------------- types

export interface PersonConfig {
  employeeId: string;
  limits: Partial<Record<LimitKind, number>>;
  /** weekly-unavailable, time-off and preference restrictions for this person */
  restrictions: Restriction[];
}

export interface ParsedConfig {
  ruleSet: RuleSet;
  /** Only people mentioned in the text. */
  people: Map<string, PersonConfig>;
}

export interface ParseIssue {
  line: number;
  message: string;
}

export interface ParseResult {
  config: ParsedConfig;
  errors: ParseIssue[];
  warnings: ParseIssue[];
}

export interface ConfigContext {
  employees: readonly Employee[];
  restrictions: readonly Restriction[];
  templates: readonly ShiftTemplate[];
  /** For year inference and hiding past time off. */
  today: IsoDate;
}

// ---------------------------------------------------------------- days & times

const DAY_ALIASES: Record<string, Weekday> = {
  sun: 0, sunday: 0, sundays: 0,
  mon: 1, monday: 1, mondays: 1,
  tue: 2, tues: 2, tuesday: 2, tuesdays: 2,
  wed: 3, weds: 3, wednesday: 3, wednesdays: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4, thursdays: 4,
  fri: 5, friday: 5, fridays: 5,
  sat: 6, saturday: 6, saturdays: 6,
};
const MON_FIRST: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

/** Parse "Mon-Fri", "weekends", "Mon, Wed, Fri", "every day". Returns null for "every day". */
export function parseDays(text: string): { days: Weekday[] | null; error?: string } {
  const original = text.trim();
  const t = original.toLowerCase();
  if (!t || t === 'every day' || t === 'daily' || t === 'all days' || t === 'everyday') return { days: null };
  const set = new Set<Weekday>();
  for (const orig of original.split(/\s*(?:,|\band\b|\s)\s*/i).filter(Boolean)) {
    const raw = orig.toLowerCase();
    if (raw === 'weekdays') [1, 2, 3, 4, 5].forEach((d) => set.add(d as Weekday));
    else if (raw === 'weekends') [0, 6].forEach((d) => set.add(d as Weekday));
    else if (raw.includes('-')) {
      const [a, b] = raw.split('-');
      const da = DAY_ALIASES[a];
      const db = DAY_ALIASES[b];
      if (da == null) return { days: null, error: `unknown day "${orig.split('-')[0]}"` };
      if (db == null) return { days: null, error: `unknown day "${orig.split('-')[1]}"` };
      // Walk in Mon-first order, wrapping (Fri-Mon = Fri, Sat, Sun, Mon).
      let i = MON_FIRST.indexOf(da);
      for (let n = 0; n < 7; n++) {
        const d = MON_FIRST[i % 7];
        set.add(d);
        if (d === db) break;
        i++;
      }
    } else {
      const d = DAY_ALIASES[raw];
      if (d == null) return { days: null, error: `unknown day "${orig}"` };
      set.add(d);
    }
  }
  if (set.size === 7) return { days: null };
  return { days: [...set].sort((a, b) => a - b) };
}

export function formatDays(days: readonly Weekday[] | null | undefined): string {
  if (!days || days.length === 0 || days.length === 7) return '';
  const set = new Set(days);
  const order = MON_FIRST.filter((d) => set.has(d));
  if (set.size === 2 && set.has(0) && set.has(6)) return 'weekends';
  // Contiguous run in Mon-first order?
  const idx = order.map((d) => MON_FIRST.indexOf(d));
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (contiguous && order.length >= 3) return `${WEEKDAY_NAMES[order[0]]}-${WEEKDAY_NAMES[order[order.length - 1]]}`;
  return order.map((d) => WEEKDAY_NAMES[d]).join(', ');
}

const TIME_RE = String.raw`\d{1,2}(?::\d{2})?\s*(?:[ap]\.?m?\.?)?`;

/** "7a", "7:30pm", "07:00", "24:00". */
export function parseTime(text: string): HHmm | null {
  const m = /^(\d{1,2})(?::(\d{2}))?\s*([ap])?\.?m?\.?$/i.exec(text.trim());
  if (!m) return null;
  let h = +m[1];
  const min = m[2] ? +m[2] : 0;
  const ap = m[3]?.toLowerCase();
  if (min > 59) return null;
  if (ap) {
    if (h < 1 || h > 12) return null;
    if (ap === 'a' && h === 12) h = 0;
    if (ap === 'p' && h !== 12) h += 12;
  }
  if (h > 24 || (h === 24 && min > 0)) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

/** Pull a time window off the end of `text`: "9:00-17:00", "until 16:00", "after 22:00", "all day". */
function takeWindow(text: string): { rest: string; from: HHmm | null; to: HHmm | null; error?: string } {
  let m = new RegExp(String.raw`(?:^|\s)(${TIME_RE})\s*(?:-|–|to)\s*(${TIME_RE})\s*$`, 'i').exec(text);
  if (m) {
    const from = parseTime(m[1]);
    const to = parseTime(m[2]);
    if (!from || !to) return { rest: text, from: null, to: null, error: `can't read the time "${m[0].trim()}"` };
    return { rest: text.slice(0, m.index).trim(), from, to };
  }
  m = new RegExp(String.raw`(?:^|\s)(?:until|before|till)\s+(${TIME_RE})\s*$`, 'i').exec(text);
  if (m) {
    const to = parseTime(m[1]);
    if (!to) return { rest: text, from: null, to: null, error: `can't read the time "${m[1]}"` };
    return { rest: text.slice(0, m.index).trim(), from: '00:00', to };
  }
  m = new RegExp(String.raw`(?:^|\s)(?:after|from)\s+(${TIME_RE})\s*$`, 'i').exec(text);
  if (m) {
    const from = parseTime(m[1]);
    if (!from) return { rest: text, from: null, to: null, error: `can't read the time "${m[1]}"` };
    return { rest: text.slice(0, m.index).trim(), from, to: '24:00' };
  }
  m = /(?:^|\s)all day\s*$/i.exec(text);
  if (m) return { rest: text.slice(0, m.index).trim(), from: null, to: null };
  return { rest: text.trim(), from: null, to: null };
}

function formatWindow(from: HHmm | null | undefined, to: HHmm | null | undefined): string {
  if (!from || !to) return '';
  if (from === '00:00' && to !== '24:00') return `until ${to}`;
  if (to === '24:00' && from !== '00:00') return `after ${from}`;
  if (from === '00:00' && to === '24:00') return '';
  return `${from}-${to}`;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The year a month/day refers to: this year, unless that's more than 30 days ago (then next year). */
function inferYear(month: number, day: number, today: IsoDate): number {
  const y = +today.slice(0, 4);
  const candidate = `${y}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const cutoff = formatDate(new Date(parseDate(today).getTime() - 30 * 86400000));
  return candidate < cutoff ? y + 1 : y;
}

export function parseDateText(text: string, today: IsoDate): IsoDate | null {
  const t = text.trim().toLowerCase();
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (m) return t;
  m = /^([a-z]{3})[a-z]*\.?\s+(\d{1,2})(?:,?\s+(\d{4}))?$/.exec(t);
  if (m) {
    const month = MONTHS.indexOf(m[1]) + 1;
    const day = +m[2];
    if (month < 1 || day < 1 || day > 31) return null;
    const year = m[3] ? +m[3] : inferYear(month, day, today);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  m = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/.exec(t);
  if (m) {
    const month = +m[1];
    const day = +m[2];
    const year = m[3] ? +m[3] : inferYear(month, day, today);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return null;
}

export function formatDateText(d: IsoDate, today: IsoDate): string {
  const [y, mo, da] = d.split('-').map(Number);
  const short = `${MONTH_NAMES[mo - 1]} ${da}`;
  return inferYear(mo, da, today) === y ? short : `${short} ${y}`;
}

// ---------------------------------------------------------------- names

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

function suggest(name: string, options: string[]): string {
  let best = '';
  let bestD = Infinity;
  for (const o of options) {
    const d = editDistance(name.toLowerCase(), o.toLowerCase());
    if (d < bestD) {
      bestD = d;
      best = o;
    }
  }
  return best && bestD <= Math.max(2, Math.floor(name.length / 3)) ? ` (did you mean ${best}?)` : '';
}

// ---------------------------------------------------------------- limits

const LIMIT_PATTERNS: { kind: LimitKind; re: RegExp; fmt: (n: number) => string }[] = [
  { kind: 'max-hours-week', re: /^max(?:imum)?\s+(\d+(?:\.\d+)?)\s*h(?:ours?)?\s*(?:per|a|\/)\s*week$/i, fmt: (n) => `max ${n} hours per week` },
  {
    kind: 'min-hours-week',
    re: /^(?:min(?:imum)?|at least)\s+(\d+(?:\.\d+)?)\s*h(?:ours?)?\s*(?:per|a|\/)\s*week$/i,
    fmt: (n) => `min ${n} hours per week`,
  },
  { kind: 'max-shifts-day', re: /^max(?:imum)?\s+(\d+)\s*shifts?\s*(?:per|a|\/)\s*day$/i, fmt: (n) => `max ${n} shift${n === 1 ? '' : 's'} per day` },
  { kind: 'max-consecutive-days', re: /^max(?:imum)?\s+(\d+)\s*days?\s*in\s*a\s*row$/i, fmt: (n) => `max ${n} days in a row` },
  {
    kind: 'min-rest-hours',
    re: /^(?:min(?:imum)?|at least)\s+(\d+(?:\.\d+)?)\s*h(?:ours?)?\s*(?:of\s+)?rest(?:\s+between\s+shifts)?$/i,
    fmt: (n) => `at least ${n} hours rest between shifts`,
  },
];

const EMPLOYEE_FIELD: Record<LimitKind, keyof Employee> = {
  'max-hours-week': 'maxHoursPerWeek',
  'min-hours-week': 'minHoursPerWeek',
  'max-shifts-day': 'maxShiftsPerDay',
  'max-consecutive-days': 'maxConsecutiveDays',
  'min-rest-hours': 'minRestHours',
};

// ---------------------------------------------------------------- format

function scopeLabel(scope: Scope): string {
  return scope.kind === 'everyone' ? 'everyone' : scope.role;
}

function flags(rule: { severity: 'hard' | 'soft' }, extra: string[] = []): string {
  const parts = [...extra];
  if (rule.severity === 'soft') parts.push('soft');
  return parts.length ? ` (${parts.join(', ')})` : '';
}

function join(...parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}

export function formatRule(rule: Rule, names: Map<string, string>): string {
  switch (rule.type) {
    case 'coverage': {
      const who = rule.role ?? (rule.min === 1 ? 'person' : 'people');
      const only =
        rule.appliesTo.length === 1 ? [rule.appliesTo[0] === 'schedule' ? 'schedule only' : 'breaks only'] : [];
      return join(`at least ${rule.min} ${who} on the floor`, formatDays(rule.days), formatWindow(rule.from, rule.to)) + flags(rule, only);
    }
    case 'never-together':
      return `never together: ${rule.employeeIds.map((id) => names.get(id) ?? '?').join(', ')}` + flags(rule);
    case 'max-on-break':
      return join(`at most ${rule.max} on break`, formatDays(rule.days), formatWindow(rule.from, rule.to)) + flags(rule);
    case 'break-blackout':
      return join(`no breaks ${rule.from}-${rule.to}`, formatDays(rule.days)) + flags(rule);
    case 'limit': {
      const p = LIMIT_PATTERNS.find((l) => l.kind === rule.limit)!;
      return `${scopeLabel(rule.scope)}: ${p.fmt(rule.value)}` + flags(rule);
    }
    case 'unavailable':
      return `${scopeLabel(rule.scope)}: ` + join('unavailable', formatDays(rule.days) || 'every day', formatWindow(rule.from, rule.to)) + flags(rule);
  }
}

function formatBreakList(list: { kind: BreakKind; minutes: number }[]): string {
  return list.length ? list.map((b) => `${b.kind} ${b.minutes}`).join(', ') : 'none';
}

/** Group a person's weekly unavailability by identical time window. */
function formatWeekly(restrictions: Restriction[]): string[] {
  const groups = new Map<string, Weekday[]>();
  for (const r of restrictions) {
    if (r.type !== 'weekly-unavailable') continue;
    const key = `${r.start ?? ''}|${r.end ?? ''}`;
    groups.set(key, [...(groups.get(key) ?? []), r.weekday]);
  }
  return [...groups.entries()].map(([key, days]) => {
    const [from, to] = key.split('|');
    const d = formatDays(days) || 'every day';
    return join('unavailable', d, formatWindow(from || null, to || null));
  });
}

export function formatPersonLines(
  emp: Employee,
  restrictions: readonly Restriction[],
  templates: readonly ShiftTemplate[],
  today: IsoDate,
  includePast = false,
): string[] {
  const lines: string[] = [];
  for (const p of LIMIT_PATTERNS) {
    const v = emp[EMPLOYEE_FIELD[p.kind]] as number | null | undefined;
    if (v != null && v !== 0) lines.push(p.fmt(v));
  }
  const mine = restrictions.filter((r) => r.employeeId === emp.id);
  lines.push(...formatWeekly(mine));
  for (const r of mine) {
    if (r.type !== 'time-off') continue;
    if (!includePast && r.endDate < today) continue;
    const dates =
      r.startDate === r.endDate
        ? formatDateText(r.startDate, today)
        : `${formatDateText(r.startDate, today)} to ${formatDateText(r.endDate, today)}`;
    lines.push(join('time off', dates, formatWindow(r.start, r.end)) + (r.reason ? ` (${r.reason})` : ''));
  }
  const tName = new Map(templates.map((t) => [t.id, t.name]));
  for (const r of mine) {
    if (r.type !== 'preference') continue;
    const what = r.shiftTemplateId ? tName.get(r.shiftTemplateId) ?? '' : '';
    const day = r.weekday != null ? WEEKDAY_NAMES[r.weekday] : '';
    if (!what && !day) continue;
    lines.push(`${r.kind === 'prefer' ? 'prefers' : 'avoids'} ${what && day ? `${what} on ${day}` : what || day}`);
  }
  return lines.map((l) => `${emp.name}: ${l}`);
}

export function formatConfig(ruleSet: RuleSet, ctx: ConfigContext, opts: { includePast?: boolean } = {}): string {
  const names = new Map(ctx.employees.map((e) => [e.id, e.name]));
  const out: string[] = [];
  const line = (rule: Rule) => (rule.enabled ? '' : '# off: ') + formatRule(rule, names);

  out.push('# One rule per line. Lines starting with # are notes. "# off:" turns a rule off.');
  out.push('');
  out.push('## Built-in');
  for (const c of CORE_RULES) out.push(`[locked] ${c}`);
  for (const b of BUILT_INS) {
    const s = ruleSet.builtIns[b.id] ?? b.default;
    const flag = s.severity !== b.default.severity ? ` (${s.severity})` : b.default.severity === 'soft' ? ' (soft)' : '';
    out.push(`${b.phrase}: ${s.enabled ? 'on' : 'off'}${flag}`);
  }

  const by = (types: Rule['type'][]) => ruleSet.rules.filter((r) => types.includes(r.type));
  out.push('', '## Team');
  for (const r of by(['limit', 'unavailable'])) out.push(line(r));

  out.push('', '## Coverage');
  for (const r of by(['coverage'])) out.push(line(r));

  out.push('', '## People');
  for (const emp of [...ctx.employees].sort((a, b) => a.name.localeCompare(b.name))) {
    out.push(...formatPersonLines(emp, ctx.restrictions, ctx.templates, ctx.today, opts.includePast));
  }
  for (const r of by(['never-together'])) out.push(line(r));

  out.push('', '## Breaks');
  const p = ruleSet.breakPolicy;
  out.push(`default meal length ${p.defaultMealMinutes} min`);
  out.push(`default rest length ${p.defaultRestMinutes} min`);
  for (const t of [...p.tiers].sort((a, b) => a.minShiftHours - b.minShiftHours)) {
    out.push(`breaks for shifts ${t.minShiftHours}h+: ${formatBreakList(t.breaks)}`);
  }
  out.push(`no breaks in first ${p.noBreakFirstMinutes} min`);
  out.push(`no breaks in last ${p.noBreakLastMinutes} min`);
  out.push(`at least ${p.minGapMinutes} min between breaks`);
  out.push(`break times every ${p.stepMinutes} min`);
  for (const r of by(['max-on-break', 'break-blackout'])) out.push(line(r));
  return out.join('\n') + '\n';
}

// ---------------------------------------------------------------- parse

interface Flags {
  severity: 'hard' | 'soft';
  /** True when the line said (soft) or (hard) explicitly. */
  explicitSeverity: boolean;
  appliesTo: ('schedule' | 'breaks')[];
  /** Any non-flag parenthesised text (e.g. a time-off reason). */
  note: string | null;
}

function takeFlags(text: string): { rest: string; flags: Flags; error?: string } {
  const flags: Flags = { severity: 'hard', explicitSeverity: false, appliesTo: ['schedule', 'breaks'], note: null };
  let rest = text.trim();
  const m = /\(([^()]*)\)\s*$/.exec(rest);
  if (!m) return { rest, flags };
  rest = rest.slice(0, m.index).trim();
  const notes: string[] = [];
  for (const part of m[1].split(',').map((s) => s.trim().toLowerCase())) {
    if (part === 'soft' || part === 'hard') {
      flags.severity = part;
      flags.explicitSeverity = true;
    }
    else if (part === 'schedule only') flags.appliesTo = ['schedule'];
    else if (part === 'breaks only') flags.appliesTo = ['breaks'];
    else notes.push(m[1].split(',').find((x) => x.trim().toLowerCase() === part)!.trim());
  }
  if (notes.length) flags.note = notes.join(', ');
  return { rest, flags };
}

export function parseConfig(text: string, ctx: ConfigContext): ParseResult {
  const errors: ParseIssue[] = [];
  const warnings: ParseIssue[] = [];
  const builtIns = defaultBuiltIns();
  const rules: Rule[] = [];
  const policy: BreakPolicy = {
    tiers: [],
    defaultMealMinutes: 45,
    defaultRestMinutes: 15,
    noBreakFirstMinutes: 60,
    noBreakLastMinutes: 60,
    minGapMinutes: 60,
    stepMinutes: 15,
  };
  const people = new Map<string, PersonConfig>();

  const empByName = new Map(ctx.employees.map((e) => [e.name.trim().toLowerCase(), e]));
  const empNames = ctx.employees.map((e) => e.name);
  const roles = new Set(ctx.employees.flatMap((e) => e.roles.map((r) => r.toLowerCase())));
  const tmplByName = new Map(ctx.templates.map((t) => [t.name.trim().toLowerCase(), t]));

  const person = (id: string) => {
    let p = people.get(id);
    if (!p) {
      p = { employeeId: id, limits: {}, restrictions: [] };
      people.set(id, p);
    }
    return p;
  };

  text.split(/\r?\n/).forEach((raw, i) => {
    const lineNo = i + 1;
    const err = (message: string): void => void errors.push({ line: lineNo, message });
    const warn = (message: string): void => void warnings.push({ line: lineNo, message });

    let line = raw.trim();
    let enabled = true;
    const off = /^#\s*off\s*:\s*(.*)$/i.exec(line);
    if (off) {
      enabled = false;
      line = off[1].trim();
    } else if (line.startsWith('#') || !line) {
      return;
    }
    // Inline comments: "rule  # note"
    line = line.replace(/\s+#.*$/, '').trim();
    if (!line) return;

    if (/^\[locked\]/i.test(line)) {
      const what = line.replace(/^\[locked\]\s*/i, '').toLowerCase();
      if (!CORE_RULES.includes(what)) err(`"[locked]" rules are built in and can't be changed or added`);
      return;
    }

    const { rest: body, flags } = takeFlags(line);
    const lower = body.toLowerCase();
    const base = { id: newId(), enabled, severity: flags.severity };
    let m: RegExpExecArray | null;

    // Built-in switches: "max days in a row: on (soft)"
    const bi = BUILT_INS.find((b) => lower.startsWith(b.phrase + ':'));
    if (bi) {
      const v = lower.slice(bi.phrase.length + 1).trim();
      if (v !== 'on' && v !== 'off') return err(`use "${bi.phrase}: on" or "${bi.phrase}: off"`);
      builtIns[bi.id as BuiltInId] = { enabled: v === 'on', severity: flags.explicitSeverity ? flags.severity : bi.default.severity };
      return;
    }

    // Coverage: "at least 2 Cashier on the floor Mon-Fri 11:00-14:00"
    if ((m = /^at least (\d+) (.+?) on the floor\b\s*(.*)$/i.exec(body))) {
      const who = m[2].trim();
      const role = /^(people|person|anyone|staff|employees?)$/i.test(who) ? null : who;
      const win = takeWindow(m[3]);
      if (win.error) return err(win.error);
      const d = parseDays(win.rest);
      if (d.error) return err(d.error);
      if (role && !roles.has(role.toLowerCase())) warn(`no employee has the role "${role}" yet`);
      const rule: CoverageRule = { ...base, type: 'coverage', role, min: +m[1], days: d.days, from: win.from, to: win.to, appliesTo: flags.appliesTo };
      rules.push(rule);
      return;
    }

    if ((m = /^never together\s*:\s*(.+)$/i.exec(body))) {
      const ids: string[] = [];
      for (const n of m[1].split(',').map((s) => s.trim()).filter(Boolean)) {
        const e = empByName.get(n.toLowerCase());
        if (!e) return err(`"${n}" isn't an employee${suggest(n, empNames)}`);
        ids.push(e.id);
      }
      if (ids.length < 2) return err('list at least two people, separated by commas');
      rules.push({ ...base, type: 'never-together', employeeIds: ids });
      return;
    }

    if ((m = /^at most (\d+)(?: people| person)? on break\b\s*(.*)$/i.exec(body))) {
      const win = takeWindow(m[2]);
      if (win.error) return err(win.error);
      const d = parseDays(win.rest);
      if (d.error) return err(d.error);
      rules.push({ ...base, type: 'max-on-break', max: +m[1], days: d.days, from: win.from, to: win.to });
      return;
    }

    // Break policy
    if ((m = /^breaks for shifts (\d+(?:\.\d+)?)\s*h(?:ours?)?\s*\+?\s*(?:or (?:more|longer))?\s*:\s*(.+)$/i.exec(body))) {
      const list: { kind: BreakKind; minutes: number }[] = [];
      if (!/^none$/i.test(m[2].trim())) {
        for (const part of m[2].split(',').map((s) => s.trim())) {
          const b = /^(rest|break|meal|lunch)(?:\s+(\d+)\s*(?:m|min|mins|minutes)?)?$/i.exec(part);
          if (!b) return err(`can't read "${part}" (use e.g. "rest 15, meal 45")`);
          // No length given = use the default (filled in after all lines are read).
          list.push({ kind: /meal|lunch/i.test(b[1]) ? 'meal' : 'rest', minutes: b[2] ? +b[2] : 0 });
        }
      }
      policy.tiers.push({ minShiftHours: +m[1], breaks: list });
      return;
    }
    if ((m = /^default (meal|lunch|rest|break) (?:length|time|break)?\s*(?:is\s*)?(\d+)\s*(?:m|min|mins|minutes)?$/i.exec(body))) {
      if (/meal|lunch/i.test(m[1])) policy.defaultMealMinutes = Math.max(5, +m[2]);
      else policy.defaultRestMinutes = Math.max(5, +m[2]);
      return;
    }
    if ((m = /^no breaks in (?:the )?(first|last) (\d+)\s*(?:m|min|mins|minutes)?(?: of (?:the )?shift)?$/i.exec(body))) {
      if (m[1].toLowerCase() === 'first') policy.noBreakFirstMinutes = +m[2];
      else policy.noBreakLastMinutes = +m[2];
      return;
    }
    if ((m = /^at least (\d+)\s*(?:m|min|mins|minutes)? between breaks$/i.exec(body))) {
      policy.minGapMinutes = +m[1];
      return;
    }
    if ((m = /^break times every (\d+)\s*(?:m|min|mins|minutes)?$/i.exec(body))) {
      policy.stepMinutes = Math.max(5, +m[1]);
      return;
    }
    if ((m = /^no breaks\s+(?:during\s+|between\s+)?(.+)$/i.exec(body))) {
      // "no breaks 12:00-13:00 Sat-Sun" — window first, then days
      const mm = new RegExp(String.raw`^(${TIME_RE})\s*(?:-|–|to|and)\s*(${TIME_RE})\s*(.*)$`, 'i').exec(m[1]);
      if (!mm) return err('use e.g. "no breaks 12:00-13:00 Sat-Sun"');
      const from = parseTime(mm[1]);
      const to = parseTime(mm[2]);
      if (!from || !to) return err(`can't read the time "${mm[1]}-${mm[2]}"`);
      const d = parseDays(mm[3]);
      if (d.error) return err(d.error);
      rules.push({ ...base, type: 'break-blackout', from, to, days: d.days });
      return;
    }

    // Scoped lines: "<everyone|Role|Employee>: <rule>"
    if ((m = /^([^:]+):\s*(.+)$/.exec(body))) {
      const who = m[1].trim();
      const what = m[2].trim();
      const emp = empByName.get(who.toLowerCase());
      const isEveryone = /^(everyone|everybody|all|team|all staff)$/i.test(who);

      const limit = LIMIT_PATTERNS.map((p) => ({ p, mm: p.re.exec(what) })).find((x) => x.mm);
      const unavail = /^unavailable\b\s*(.*)$/i.exec(what);

      if (emp && !isEveryone) {
        if (!enabled) return warn(`"# off:" isn't supported for a person's line; it was ignored`);
        const pc = person(emp.id);
        if (limit) {
          pc.limits[limit.p.kind] = +limit.mm![1];
          return;
        }
        if (unavail) {
          const win = takeWindow(unavail[1]);
          if (win.error) return err(win.error);
          const d = parseDays(win.rest);
          if (d.error) return err(d.error);
          for (const day of d.days ?? ([0, 1, 2, 3, 4, 5, 6] as Weekday[])) {
            pc.restrictions.push({
              id: newId(),
              employeeId: emp.id,
              type: 'weekly-unavailable',
              weekday: day,
              start: win.from === '00:00' && win.to === '24:00' ? null : win.from,
              end: win.from === '00:00' && win.to === '24:00' ? null : win.to,
            });
          }
          return;
        }
        let t: RegExpExecArray | null;
        if ((t = /^time off\s+(.+)$/i.exec(what))) {
          const win = takeWindow(t[1]);
          if (win.error) return err(win.error);
          const parts = win.rest.split(/\s+(?:to|through|thru|until|–)\s+|\s*-\s*(?=[a-z]{3}|\d{4}-|\d{1,2}\/)/i);
          const start = parseDateText(parts[0], ctx.today);
          const end = parts[1] ? parseDateText(parts[1], ctx.today) : start;
          if (!start || !end) return err(`can't read the date "${win.rest}" (use e.g. "Nov 18" or "Nov 18 to Nov 20")`);
          const to: TimeOff = {
            id: newId(),
            employeeId: emp.id,
            type: 'time-off',
            startDate: start,
            endDate: end < start ? start : end,
            start: win.from,
            end: win.to,
            reason: flags.note ?? undefined,
          };
          pc.restrictions.push(to);
          return;
        }
        if ((t = /^(prefers|avoids)\s+(.+)$/i.exec(what))) {
          const kind = t[1].toLowerCase() === 'prefers' ? 'prefer' : 'avoid';
          let shiftName = t[2].trim();
          let weekday: Weekday | null = null;
          const on = /^(.+?)\s+on\s+(\w+)$/i.exec(shiftName);
          if (on) {
            shiftName = on[1];
            const d = DAY_ALIASES[on[2].toLowerCase()];
            if (d == null) return err(`unknown day "${on[2]}"`);
            weekday = d;
          } else if (DAY_ALIASES[shiftName.toLowerCase()] != null) {
            weekday = DAY_ALIASES[shiftName.toLowerCase()];
            shiftName = '';
          }
          let templateId: string | null = null;
          if (shiftName) {
            const tm = tmplByName.get(shiftName.toLowerCase());
            if (!tm) return err(`no shift called "${shiftName}"${suggest(shiftName, ctx.templates.map((x) => x.name))}`);
            templateId = tm.id;
          }
          pc.restrictions.push({ id: newId(), employeeId: emp.id, type: 'preference', kind, weekday, shiftTemplateId: templateId });
          return;
        }
        return err(`don't understand "${what}" for ${emp.name}`);
      }

      // Team or role scope
      const scope: Scope = isEveryone ? { kind: 'everyone' } : { kind: 'role', role: who };
      if (limit) {
        if (scope.kind === 'role' && !roles.has(who.toLowerCase()))
          warn(`"${who}" isn't an employee or a role anyone has${suggest(who, empNames)}`);
        rules.push({ ...base, type: 'limit', scope, limit: limit.p.kind, value: +limit.mm![1] });
        return;
      }
      if (unavail) {
        if (scope.kind === 'role' && !roles.has(who.toLowerCase()))
          warn(`"${who}" isn't an employee or a role anyone has${suggest(who, empNames)}`);
        const win = takeWindow(unavail[1]);
        if (win.error) return err(win.error);
        const d = parseDays(win.rest);
        if (d.error) return err(d.error);
        const whole = win.from === '00:00' && win.to === '24:00';
        rules.push({ ...base, type: 'unavailable', scope, days: d.days, from: whole ? null : win.from, to: whole ? null : win.to });
        return;
      }
      if (!emp && !isEveryone && /^(time off|prefers|avoids)\b/i.test(what)) {
        return err(`"${who}" isn't an employee${suggest(who, empNames)}`);
      }
      return err(`don't understand "${what}"`);
    }

    err(`don't understand this line`);
  });

  return {
    config: {
      ruleSet: {
        version: 1,
        builtIns,
        rules,
        breakPolicy: {
          ...policy,
          tiers: policy.tiers.map((t) => ({
            ...t,
            breaks: t.breaks.map((b) =>
              b.minutes ? b : { ...b, minutes: b.kind === 'meal' ? policy.defaultMealMinutes : policy.defaultRestMinutes },
            ),
          })),
        },
      },
      people,
    },
    errors,
    warnings,
  };
}

// ---------------------------------------------------------------- apply

export interface ApplyPlan {
  ruleSet: RuleSet;
  /** Employee updates: id -> patched limit fields. */
  employeePatches: Map<string, Partial<Employee>>;
  /** Final restriction list for everyone. */
  restrictions: Restriction[];
  /** Human summary, one entry per changed person/section. */
  summary: string[];
}

/**
 * Turn a parsed config into store updates. Mentioned people get exactly what the text says
 * (past time off is always kept). With `replaceAllPeople`, unmentioned people are cleared too.
 */
export function planApply(parsed: ParsedConfig, current: RuleSet, ctx: ConfigContext, replaceAllPeople = false): ApplyPlan {
  const summary: string[] = [];
  const employeePatches = new Map<string, Partial<Employee>>();
  let restrictions = [...ctx.restrictions];
  const targets = replaceAllPeople ? ctx.employees : ctx.employees.filter((e) => parsed.people.has(e.id));

  for (const emp of targets) {
    const pc = parsed.people.get(emp.id) ?? { employeeId: emp.id, limits: {}, restrictions: [] };
    const patch: Partial<Employee> = {};
    for (const p of LIMIT_PATTERNS) {
      (patch as Record<string, unknown>)[EMPLOYEE_FIELD[p.kind]] = pc.limits[p.kind] ?? null;
    }
    const keepPast = restrictions.filter(
      (r) =>
        r.employeeId === emp.id &&
        r.type === 'time-off' &&
        r.endDate < ctx.today &&
        !pc.restrictions.some((x) => x.type === 'time-off' && x.startDate === r.startDate && x.endDate === r.endDate),
    );
    const before = formatPersonLines(emp, ctx.restrictions, ctx.templates, ctx.today, true);
    restrictions = [...restrictions.filter((r) => r.employeeId !== emp.id), ...keepPast, ...pc.restrictions];
    const after = formatPersonLines({ ...emp, ...patch }, restrictions, ctx.templates, ctx.today, true);
    const added = after.filter((l) => !before.includes(l)).length;
    const removed = before.filter((l) => !after.includes(l)).length;
    if (added || removed) summary.push(`${emp.name}: ${[added && `+${added}`, removed && `−${removed}`].filter(Boolean).join(' / ')} line(s)`);
    employeePatches.set(emp.id, patch);
  }

  const names = new Map(ctx.employees.map((e) => [e.id, e.name]));
  const ruleLines = (rs: RuleSet) => rs.rules.map((r) => `${r.enabled}|${formatRule(r, names)}`);
  const beforeRules = ruleLines(current);
  const afterRules = ruleLines(parsed.ruleSet);
  const rAdded = afterRules.filter((l) => !beforeRules.includes(l)).length;
  const rRemoved = beforeRules.filter((l) => !afterRules.includes(l)).length;
  if (rAdded || rRemoved) summary.push(`Rules: ${[rAdded && `+${rAdded}`, rRemoved && `−${rRemoved}`].filter(Boolean).join(' / ')}`);
  if (JSON.stringify(current.builtIns) !== JSON.stringify(parsed.ruleSet.builtIns)) summary.push('Built-in rules changed');
  if (JSON.stringify(current.breakPolicy) !== JSON.stringify(parsed.ruleSet.breakPolicy)) summary.push('Break rules changed');

  // Keep ids of rules that didn't change so references (and undo) stay stable.
  const byLine = new Map(current.rules.map((r) => [`${r.enabled}|${formatRule(r, names)}`, r]));
  const ruleSet: RuleSet = {
    ...parsed.ruleSet,
    rules: parsed.ruleSet.rules.map((r) => byLine.get(`${r.enabled}|${formatRule(r, names)}`) ?? r),
  };
  return { ruleSet, employeePatches, restrictions, summary };
}

