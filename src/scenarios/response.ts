import type { ScenarioContext } from './types.js';
import { proseResponse } from '../renderer.js';
import { PLAN_RESPONSES, MID_RESPONSES, SUMMARY_RESPONSES } from '../data/messages.js';
import { pick } from '../timing.js';

export type ResponseType = 'plan' | 'mid' | 'summary';

export async function responseScenario(
  ctx: ScenarioContext,
  type: ResponseType = 'mid',
): Promise<void> {
  let pool: readonly string[];
  switch (type) {
    case 'plan':
      pool = PLAN_RESPONSES;
      break;
    case 'summary':
      pool = SUMMARY_RESPONSES;
      break;
    default:
      pool = MID_RESPONSES;
  }

  const text = pick(pool);
  await proseResponse(text, ctx.signal);
}
