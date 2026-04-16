import type { ScenarioContext } from './types.js';
import * as renderer from '../renderer.js';
import * as out from '../output.js';
import { getSourcePaths } from '../data/paths.js';
import { SEARCH_PATTERNS, GLOB_PATTERNS } from '../data/messages.js';
import { pick, shuffle, randInt, sleepRange } from '../timing.js';

export async function grepScenario(ctx: ScenarioContext): Promise<void> {
  const pattern = pick(SEARCH_PATTERNS);
  const paths = getSourcePaths(ctx.config.projectType);
  const matchCount = randInt(2, 5);
  const matchedPaths = shuffle(paths).slice(0, matchCount);

  // ⏺ Grep(pattern)
  renderer.toolHeader('Grep', `"${pattern}" in src/**/*`);

  await sleepRange(500, 1200, ctx.signal);

  const results: string[] = [];
  for (const p of matchedPaths) {
    const lineNum = randInt(5, 60);
    const fakeContext = `   ${pattern.replace(/[.*\\]/g, '')}(...)`;
    results.push(`${out.C.path(p)}${out.C.dimmed(':' + lineNum + ':')}${fakeContext}`);
  }

  renderer.toolResult(`${matchCount} results`);
  await renderer.searchResults(results, matchCount, 'results', ctx.signal);
  out.newLine();
}

export async function globScenario(ctx: ScenarioContext): Promise<void> {
  const pattern = pick(GLOB_PATTERNS);
  const paths = getSourcePaths(ctx.config.projectType);
  const matchCount = randInt(4, 10);
  const matchedPaths = shuffle(paths).slice(0, Math.min(matchCount, paths.length));

  // ⏺ Glob(pattern)
  renderer.toolHeader('Glob', pattern);

  await sleepRange(300, 800, ctx.signal);

  const results = matchedPaths.map(p => out.C.path(p));

  renderer.toolResult(`${matchedPaths.length} files found`);
  await renderer.searchResults(results, matchedPaths.length, 'files found', ctx.signal);
  out.newLine();
}
