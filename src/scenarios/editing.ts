import type { ScenarioContext } from './types.js';
import * as renderer from '../renderer.js';
import type { DiffLine } from '../renderer.js';
import * as out from '../output.js';
import { getDiffSnippets } from '../data/code.js';
import { pick } from '../timing.js';

export async function editingScenario(ctx: ScenarioContext): Promise<void> {
  const diffs = getDiffSnippets(ctx.config.projectType);
  const diff = pick(diffs);

  // ⏺ Update(src/utils/auth.ts)
  renderer.toolHeader('Update', diff.path);

  // Build diff lines with line numbers
  const lines: DiffLine[] = [];
  let lineNum = parseInt(diff.hunkHeader.match(/@@ -(\d+)/)?.[1] || '1');

  for (const line of diff.context) {
    lines.push({ marker: ' ', lineNum: lineNum++, text: line });
  }
  for (const line of diff.removals) {
    lines.push({ marker: '-', lineNum: lineNum++, text: line });
  }
  for (const line of diff.additions) {
    lines.push({ marker: '+', lineNum: lineNum++, text: line });
  }
  for (const line of diff.trailingContext) {
    lines.push({ marker: ' ', lineNum: lineNum++, text: line });
  }

  // ⎿  Added N lines, removed M lines
  const numAdded = diff.additions.length;
  const numRemoved = diff.removals.length;
  const addedText = `Added ${out.bold(String(numAdded))} ${numAdded === 1 ? 'line' : 'lines'}`;
  const removedText = `removed ${out.bold(String(numRemoved))} ${numRemoved === 1 ? 'line' : 'lines'}`;
  renderer.toolResult(`${addedText}, ${removedText}`);

  await renderer.diffBlock(lines, ctx.signal);
  out.newLine();
}
