# Scheduler

Angular 22 app for a manager to schedule employees: manage employees and their availability restrictions, generate 1–8 week schedules (built-in algorithm or Claude), edit and print them, and import from Microsoft Teams Shifts. No backend; everything lives in the browser.

## Commands

- `npm start`: dev server (`ng serve`, http://localhost:4200)
- `npx ng test --watch=false`: run all Vitest specs once (`npm test` starts watch mode)
- `npm run build`: production build (budgets: 1MB warning / 2MB error initial; 6kB/10kB per component style)

## Stack and conventions

- Standalone components, signals (`signal`/`computed`/`input()`/`output()`), new control flow (`@if`/`@for`/`@let`), zoneless (Angular 22 default). No NgModules.
- Angular Material 3 + CDK. Theme and shared utility classes (`.page`, `.card`, `.row`, `.tag`, `.form-grid`, `.dialog-form`, `table.data`) are in `src/styles.scss`. Prefer these over per-component CSS.
- Form fields default to `appearance: 'outline'`, `subscriptSizing: 'dynamic'` (set in `app.config.ts`), so put forms in dialogs inside `.dialog-form` to get vertical spacing.
- Routes are lazy (`loadComponent`) in `app.routes.ts`. Route params bind to `input()`s via `withComponentInputBinding()`.
- Dates are ISO strings (`yyyy-mm-dd`), times are `HH:mm`. **All date and time math goes through `src/app/core/time.ts`** (local-time, DST-safe). Overnight shifts have `end <= start`. `'24:00'` is a valid window end.
- Weekdays use `Date.getDay()` numbering (0 = Sunday).

## Layout

```
src/app/
  core/         models.ts, time.ts, constraint-checker.ts, storage.service.ts, stores.ts
  scheduling/   slot-expander.ts, greedy-scheduler.ts, repair.ts, ai-prompt.ts, ai-scheduler.service.ts
  import/       teams-shifts.ts (parse export), teams-import-plan.ts (match people, build schedule)
  features/     one folder per page: employees, restrictions, shifts, generate, schedules,
                schedule-view, schedule-print, import, settings
  shared/       schedule-grid (week grid, by employee or by shift), slot-dialog, confirm-dialog
  testing/      fixtures.ts (emp/tmpl/slot/weekly/timeOff builders for specs)
```

## Key design rules

- **`core/constraint-checker.ts` is the single source of truth for scheduling rules.** The greedy scheduler, AI result validation, import preview, slot dialog and live editor checks all use `canAssign` / `availabilityReasons` / `workloadReasons` / `validateSchedule`. Add or change a rule there, not in callers. Hard rules: active, required role, weekly unavailability, time off, no overlap, max shifts/day, max hours/week, max consecutive days, min rest. Coverage gaps and min-hours shortfalls are warnings.
- `AssignmentState` tracks assignments in absolute minutes from the schedule start. Weeks are 7-day blocks from `schedule.startDate`.
- Slots (`ShiftSlot`) are concrete dated shifts expanded from `ShiftTemplate`s. Slot id = `${date}|${templateId}`. Imported Teams slots may have a synthetic `templateId` (`teams:...`) and their own `color`.
- The greedy scheduler (`generateSchedule`) is pure and deterministic for a given `seed`. Existing assignments passed in are **locked**. Auto-fill and repair rely on that.
- Stores (`stores.ts`) are root services holding signals. Every mutation persists to localStorage (`scheduler.v1.*` keys via `StorageService`). Call `reload()` on stores after writing storage directly (import/sample data).
- Export/import JSON never includes the Anthropic API key.

## AI scheduling (Claude)

- `scheduling/ai-scheduler.service.ts` uses `@anthropic-ai/sdk` in the browser (`dangerouslyAllowBrowser: true`, the user supplies their own key in Settings).
- `client.beta.messages.stream` + `finalMessage()`, `output_config: { effort: 'high', format: betaZodOutputFormat(AiScheduleSchema) }`, `max_tokens: 64000`. Default model `claude-opus-5-5`. Server-side refusal fallback (`betas: ['server-side-fallback-2026-07-01']`, `fallbacks: 'default'`) is on only for models in `FALLBACK_MODELS`.
- The prompt uses short keys (`e1`, `s1`). `applyAiResult` maps them back and drops unknown keys and extras. AI output is **always** validated with `validateSchedule`. Never trust it directly.
- Tests replace `createClient` with a fake. Don't call the real API in specs.

## Teams Shifts import

- Supports the export made with **"Export in a format that can be imported"** (.xlsx via `read-excel-file/browser`, loaded with dynamic import, or a CSV of the Shifts sheet).
- Sheets are identified by their **header row**, not their name: Shifts, Open Shifts (`Open Slots`), Time Off (`Time Off Reason`), Members.
- Dates can be month/day or day/month. Order is auto-detected (any first part > 12 means day-first), with a UI override. Excel date and time cells arrive as UTC `Date`s or day fractions.
- People match existing employees by email, then name. New employees get their Teams Group as a role. Teams time off (one continuous block) is split into partial-day / full-day / partial-day `TimeOff` restrictions.

## Testing

- Specs sit next to the code (`*.spec.ts`), run by Vitest through `ng test` with jsdom. `localStorage.clear()` in `beforeEach` for anything touching stores.
- The greedy scheduler has a property-style test asserting that random scenarios never produce hard-rule errors. Keep it passing when changing scheduler or checker logic.
- For UI changes, run the app and check it in a browser. Unit tests don't cover templates or styling.

## Dependencies to be careful with

- `read-excel-file` is pinned to an exact version (`9.3.14`). Bump deliberately.
- `standardwebhooks` (pulled in by the Anthropic SDK) is in `allowedCommonJsDependencies`.
