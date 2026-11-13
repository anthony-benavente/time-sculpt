import { TestBed } from '@angular/core/testing';
import { SettingsStore } from '../core/stores';
import { emp, tmpl, weekly } from '../testing/fixtures';
import { applyAiResult, buildAiPrompt } from './ai-prompt';
import { AiSchedulerService } from './ai-scheduler.service';
import { expandTemplates } from './slot-expander';

const START = '2026-11-16';
const employees = [emp('a', { roles: ['Keyholder'], maxHoursPerWeek: 32 }), emp('b'), emp('c', { active: false })];
const templates = [tmpl('open', '07:00', '15:00', [1, 2], 2, 'Keyholder')];
const restrictions = [weekly('b', 2)];

describe('buildAiPrompt / applyAiResult', () => {
  it('uses short keys and leaves out inactive employees', () => {
    const slots = expandTemplates(START, 1, templates);
    const p = buildAiPrompt({ startDate: START, weeks: 1, slots, employees, restrictions, templates });
    expect([...p.employeeKeys.keys()]).toEqual(['e1', 'e2']);
    expect([...p.slotKeys.keys()]).toEqual(['s1', 's2']);
    expect(p.user).toContain('unavailable every Tue (all day)');
    expect(p.user).toContain('"requiredRole":"Keyholder"');
    expect(p.user).not.toContain('"C"');
  });

  it('maps keys back, ignores unknown ones, and trims over-headcount', () => {
    const slots = expandTemplates(START, 1, templates);
    const p = buildAiPrompt({ startDate: START, weeks: 1, slots, employees, restrictions, templates });
    const applied = applyAiResult(p, {
      assignments: [
        { slot: 's1', employees: ['e1', 'e2', 'e2', 'e9'] },
        { slot: 's99', employees: ['e1'] },
      ],
      notes: 'ok',
    });
    expect(applied.slots[0].assignedEmployeeIds).toEqual(['a', 'b']);
    expect(applied.slots[1].assignedEmployeeIds).toEqual([]);
    expect(applied.problems.some((x) => x.includes('e9'))).toBe(true);
    expect(applied.problems.some((x) => x.includes('s99'))).toBe(true);
    expect(applied.notes).toBe('ok');
  });
});

describe('AiSchedulerService', () => {
  beforeEach(() => localStorage.clear());

  it('requires an API key', async () => {
    const svc = TestBed.inject(AiSchedulerService);
    await expect(
      svc.generate({ startDate: START, weeks: 1, slots: [], employees, restrictions, templates }),
    ).rejects.toThrow(/API key/);
  });

  it('sends a structured-output request and applies the parsed result', async () => {
    TestBed.inject(SettingsStore).update({ anthropicApiKey: 'sk-test' });
    const svc = TestBed.inject(AiSchedulerService);
    let captured: Record<string, unknown> | undefined;
    svc.createClient = () =>
      ({
        beta: {
          messages: {
            stream: (body: Record<string, unknown>) => {
              captured = body;
              return {
                finalMessage: async () => ({
                  stop_reason: 'end_turn',
                  parsed_output: { assignments: [{ slot: 's1', employees: ['e1'] }], notes: 'Done' },
                }),
              };
            },
          },
        },
      }) as never;
    const slots = expandTemplates(START, 1, templates);
    const result = await svc.generate({ startDate: START, weeks: 1, slots, employees, restrictions, templates });
    expect(captured?.['model']).toBe('claude-opus-5-5');
    expect(captured?.['fallbacks']).toBe('default');
    expect((captured?.['output_config'] as { effort: string }).effort).toBe('high');
    expect(result.slots[0].assignedEmployeeIds).toEqual(['a']);
    expect(result.notes).toBe('Done');
  });

  it('turns a refusal into a readable error', async () => {
    TestBed.inject(SettingsStore).update({ anthropicApiKey: 'sk-test' });
    const svc = TestBed.inject(AiSchedulerService);
    svc.createClient = () =>
      ({
        beta: { messages: { stream: () => ({ finalMessage: async () => ({ stop_reason: 'refusal', parsed_output: null }) }) } },
      }) as never;
    await expect(
      svc.generate({ startDate: START, weeks: 1, slots: [], employees, restrictions, templates }),
    ).rejects.toThrow(/declined/);
  });
});
