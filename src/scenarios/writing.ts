import type { ScenarioContext } from './types.js';
import * as renderer from '../renderer.js';
import * as out from '../output.js';
import { getNewFileSnippets } from '../data/code.js';
import { pick } from '../timing.js';

export async function writingScenario(ctx: ScenarioContext): Promise<void> {
  const files = getNewFileSnippets(ctx.config.projectType);
  const file = pick(files);

  // ⏺ Write(src/components/SearchBar.tsx)
  renderer.toolHeader('Write', file.path);

  // ⎿  Wrote 35 lines to src/components/SearchBar.tsx
  renderer.toolResult(`Wrote ${file.lines.length} lines to ${file.path}`);

  await renderer.newFileBlock(file.lines, ctx.signal);
  out.newLine();
}
