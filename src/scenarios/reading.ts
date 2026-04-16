import type { ScenarioContext } from './types.js';
import * as renderer from '../renderer.js';
import * as out from '../output.js';
import { getReadSnippets } from '../data/code.js';
import { pick } from '../timing.js';

export async function readingScenario(ctx: ScenarioContext): Promise<void> {
  const snippets = getReadSnippets(ctx.config.projectType);
  const snippet = pick(snippets);

  // ⏺ Read(src/utils/auth.ts)
  renderer.toolHeader('Read', snippet.path);

  // ⎿  Wrote to / content summary
  const totalShown = snippet.lines.length;
  const extra = snippet.totalLines - totalShown;
  renderer.toolResult(`Read ${snippet.totalLines} lines (ctrl+o to expand)`);

  await renderer.contentBlock(snippet.lines, ctx.signal, {
    lineNumbers: true,
    startLine: 1,
    totalLines: snippet.totalLines,
    collapsedExtra: extra,
  });

  out.newLine();
}
