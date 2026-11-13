import { inject, Injectable } from '@angular/core';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { Employee, IsoDate, Restriction, RuleSet, ShiftSlot, ShiftTemplate } from '../core/models';
import { SettingsStore } from '../core/stores';
import { AiScheduleSchema, AppliedAiResult, applyAiResult, buildAiPrompt } from './ai-prompt';

/** Models that accept the server-side refusal fallback with `fallbacks: "default"`. */
const FALLBACK_MODELS = new Set(['claude-opus-5-5', 'claude-opus-5', 'claude-sonnet-5-5', 'claude-fable-5-2', 'claude-fable-5-1']);

export const AI_MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5 (recommended)' },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (faster, cheaper)' },
  { id: 'claude-fable-5-2', label: 'Claude Fable 5.2 (most capable, most expensive)' },
];

export interface AiGenerateArgs {
  startDate: IsoDate;
  weeks: number;
  slots: ShiftSlot[];
  employees: readonly Employee[];
  restrictions: readonly Restriction[];
  templates: readonly ShiftTemplate[];
  extraInstructions?: string;
  rules?: RuleSet | null;
  signal?: AbortSignal;
}

/** Factory seam so tests can inject a fake client. */
export type AnthropicFactory = (apiKey: string) => Pick<Anthropic, 'beta'>;

@Injectable({ providedIn: 'root' })
export class AiSchedulerService {
  private readonly settings = inject(SettingsStore);

  createClient: AnthropicFactory = (apiKey) => new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  async generate(args: AiGenerateArgs): Promise<AppliedAiResult> {
    const { anthropicApiKey, aiModel } = this.settings.settings();
    if (!anthropicApiKey.trim()) {
      throw new Error('Add your Anthropic API key in Settings first.');
    }
    const prompt = buildAiPrompt(args);
    const client = this.createClient(anthropicApiKey.trim());
    const model = aiModel || 'claude-opus-5-5';
    const useFallback = FALLBACK_MODELS.has(model);

    try {
      const stream = client.beta.messages.stream(
        {
          model,
          max_tokens: 64000,
          system: prompt.system,
          messages: [{ role: 'user', content: prompt.user }],
          output_config: { effort: 'high', format: betaZodOutputFormat(AiScheduleSchema) },
          ...(useFallback ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
        },
        { signal: args.signal },
      );
      const message = await stream.finalMessage();

      if (message.stop_reason === 'refusal') {
        throw new Error('Claude declined to build this schedule. Try the built-in algorithm instead.');
      }
      if (message.stop_reason === 'max_tokens') {
        throw new Error('The schedule was too large for one AI response. Try fewer weeks at a time.');
      }
      const parsed = message.parsed_output;
      if (!parsed) {
        throw new Error('Claude returned a response that could not be read as a schedule.');
      }
      return applyAiResult(prompt, parsed);
    } catch (err) {
      throw friendlyError(err);
    }
  }
}

export function friendlyError(err: unknown): Error {
  if (err instanceof Anthropic.APIUserAbortError) return new Error('Cancelled.');
  if (err instanceof Anthropic.AuthenticationError) return new Error('Your Anthropic API key was rejected. Check it in Settings.');
  if (err instanceof Anthropic.PermissionDeniedError)
    return new Error('Your API key does not have access to this model. Pick another model in Settings.');
  if (err instanceof Anthropic.NotFoundError) return new Error('That model was not found. Pick another model in Settings.');
  if (err instanceof Anthropic.RateLimitError) return new Error('Rate limited by the Anthropic API. Wait a minute and try again.');
  if (err instanceof Anthropic.BadRequestError) return new Error(`The Anthropic API rejected the request: ${err.message}`);
  if (err instanceof Anthropic.APIConnectionError) return new Error('Could not reach the Anthropic API. Check your connection.');
  if (err instanceof Anthropic.APIError) return new Error(`Anthropic API error ${err.status ?? ''}: ${err.message}`);
  return err instanceof Error ? err : new Error(String(err));
}
