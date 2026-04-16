import type { ScenarioContext } from './types.js';
import { thinkingSpinner } from '../renderer.js';
import { randInt } from '../timing.js';

export async function thinkingScenario(ctx: ScenarioContext): Promise<void> {
  const duration = randInt(2000, 6000);
  await thinkingSpinner(duration, ctx.signal);
}
