import type { ScenarioContext } from './types.js';
import { permissionPrompt } from '../renderer.js';
import { PERMISSION_COMMANDS } from '../data/commands.js';
import { pick } from '../timing.js';

export async function permissionScenario(ctx: ScenarioContext): Promise<void> {
  const command = pick(PERMISSION_COMMANDS);
  await permissionPrompt(command, ctx.signal);
}
