import type { ScenarioContext } from './types.js';
import * as renderer from '../renderer.js';
import * as out from '../output.js';
import { getBashCommands } from '../data/commands.js';
import { pick, sleepRange } from '../timing.js';

export async function bashScenario(ctx: ScenarioContext): Promise<void> {
  const commands = getBashCommands(ctx.config.projectType);
  const cmd = pick(commands);

  // ⏺ Bash(npm test -- --coverage)
  renderer.toolHeader('Bash', cmd.command);

  // Simulate execution time
  await sleepRange(1500, 4000, ctx.signal);

  // ⎿  (output or success indicator)
  if (cmd.output.length === 0) {
    renderer.toolResult('(No output)');
  } else {
    // Show first line as result connector, rest as content
    const lines = cmd.output.filter(l => l.length > 0);
    if (lines.length > 0) {
      // Colorize and display
      const INDENT = '       ';
      let firstLine = true;
      for (const line of cmd.output) {
        if (ctx.signal.aborted) throw new DOMException('Aborted', 'AbortError');

        let colored = line;
        if (line.includes('PASS')) {
          colored = line.replace(/PASS/g, out.C.success('PASS'));
        } else if (line.includes('FAIL')) {
          colored = line.replace(/FAIL/g, out.C.error('FAIL'));
        } else if (line.match(/^ok\s/)) {
          colored = out.C.success(line);
        } else if (line.includes('passed')) {
          colored = out.C.success(line);
        } else if (line.includes('✓') || line.includes('✔') || line.includes('Finished')) {
          colored = out.C.success(line);
        }

        if (firstLine && line.trim().length > 0) {
          // First non-empty line gets the ⎿ connector
          renderer.toolResult(colored);
          firstLine = false;
        } else {
          out.writeLine(`${INDENT}${colored}`);
        }
        await sleepRange(30, 80, ctx.signal);
      }
    }
  }

  out.newLine();
}
