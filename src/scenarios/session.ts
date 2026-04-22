// Session orchestrator — controls realistic conversation flow

import type { ScenarioContext } from './types.js';
import { thinkingScenario } from './thinking.js';
import { readingScenario } from './reading.js';
import { editingScenario } from './editing.js';
import { writingScenario } from './writing.js';
import { bashScenario } from './bash.js';
import { grepScenario, globScenario } from './searching.js';
import { permissionScenario } from './permission.js';
import { responseScenario } from './response.js';
import * as renderer from '../renderer.js';
import * as out from '../output.js';
import { USER_PROMPTS } from '../data/messages.js';
import { pick, sleepRange } from '../timing.js';

const CLEAR_SCREEN_EVERY = 5; // restart session (clear scrollback) every N conversations

// A "conversation pattern" is a sequence of scenario steps.
// Each step is [scenarioFn, optional description].
// These mimic real Claude Code conversation flows.

type Step = (ctx: ScenarioContext) => Promise<void>;

function buildConversationPattern(): Step[] {
  // Randomly decide which pattern to follow
  const patterns: Step[][] = [
    // Pattern 1: Investigate → Fix → Test
    [
      async (ctx) => { await responseScenario(ctx, 'plan'); },
      async (ctx) => { await thinkingScenario(ctx); await globScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await readingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await readingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await grepScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await responseScenario(ctx, 'mid'); },
      async (ctx) => { await thinkingScenario(ctx); await editingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await editingScenario(ctx); },
      async (ctx) => { await permissionScenario(ctx); await bashScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await responseScenario(ctx, 'summary'); },
    ],
    // Pattern 2: Build new feature
    [
      async (ctx) => { await responseScenario(ctx, 'plan'); },
      async (ctx) => { await thinkingScenario(ctx); await readingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await grepScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await writingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await writingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await editingScenario(ctx); },
      async (ctx) => { await permissionScenario(ctx); await bashScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await editingScenario(ctx); },
      async (ctx) => { await bashScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await responseScenario(ctx, 'summary'); },
    ],
    // Pattern 3: Deep investigation
    [
      async (ctx) => { await responseScenario(ctx, 'plan'); },
      async (ctx) => { await thinkingScenario(ctx); await globScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await readingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await grepScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await readingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await readingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await grepScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await responseScenario(ctx, 'mid'); },
      async (ctx) => { await thinkingScenario(ctx); await editingScenario(ctx); },
      async (ctx) => { await permissionScenario(ctx); await bashScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await responseScenario(ctx, 'summary'); },
    ],
    // Pattern 4: Quick fix
    [
      async (ctx) => { await responseScenario(ctx, 'plan'); },
      async (ctx) => { await thinkingScenario(ctx); await readingScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await editingScenario(ctx); },
      async (ctx) => { await bashScenario(ctx); },
      async (ctx) => { await thinkingScenario(ctx); await responseScenario(ctx, 'summary'); },
    ],
  ];

  return pick(patterns);
}

function printSessionStats(durationMs: number): void {
  out.clearLine();
  out.newLine();
  const inputTokens = 20000 + Math.floor(Math.random() * 30000);
  const outputTokens = 8000 + Math.floor(Math.random() * 15000);
  renderer.sessionStats({
    model: 'claude-sonnet-4-5-20250514',
    inputTokens,
    cacheReadTokens: inputTokens * 60 + Math.floor(Math.random() * 500000),
    outputTokens,
    cost: parseFloat((0.15 + Math.random() * 0.8).toFixed(2)),
    durationMs,
  });
}

export async function runSession(ctx: ScenarioContext): Promise<void> {
  const startTime = Date.now();
  let conversationCount = 0;
  let miniSessionStart = Date.now();

  try {
    // Main loop — keep cycling through conversation patterns
    while (!ctx.signal.aborted) {
      // Check duration limit
      if (ctx.config.durationSeconds !== null) {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= ctx.config.durationSeconds) break;
      }

      // Show a user prompt
      const prompt = pick(USER_PROMPTS);
      await renderer.userPrompt(prompt, ctx.signal);

      // Initial thinking before responding
      await thinkingScenario(ctx);

      // Run through a conversation pattern
      const steps = buildConversationPattern();
      for (const step of steps) {
        if (ctx.signal.aborted) break;

        // Check duration limit between steps
        if (ctx.config.durationSeconds !== null) {
          const elapsed = (Date.now() - startTime) / 1000;
          if (elapsed >= ctx.config.durationSeconds) break;
        }

        await step(ctx);

        // Small pause between steps
        await sleepRange(500, 1500, ctx.signal);
      }

      conversationCount++;

      // Every N conversations: end the mini-session naturally, then restart
      if (conversationCount % CLEAR_SCREEN_EVERY === 0) {
        // Show session stats — looks like Claude session wrapping up
        printSessionStats(Date.now() - miniSessionStart);
        // Pause so it feels like the user is reading / about to re-run claude
        await sleepRange(3000, 5000, ctx.signal);
        // Clear screen + scrollback, then show fresh banner
        out.clearScreen();
        renderer.startupBanner();
        miniSessionStart = Date.now();
      } else {
        // Normal pause before next conversation
        await sleepRange(2000, 4000, ctx.signal);
      }
    }
  } catch (err) {
    // AbortError is expected (Ctrl+C), swallow it to show stats
    if (!(err instanceof DOMException && err.name === 'AbortError')) {
      throw err;
    }
  }

  // Show final session stats on exit
  printSessionStats(Date.now() - startTime);
}
