// CLI entry point

import { parseArgs } from './config.js';
import { setSpeedFactor, isAbortError } from './timing.js';
import { hideCursor, showCursor } from './output.js';
import { startupBanner } from './renderer.js';
import { runSession } from './scenarios/session.js';
import type { ScenarioContext } from './scenarios/types.js';

async function main(): Promise<void> {
  const config = parseArgs(process.argv);
  if (!config) {
    process.exit(0);
    return; // unreachable, helps TS narrow
  }

  // Apply speed factor
  setSpeedFactor(config.speedFactor);

  // Set up abort controller for clean shutdown
  const controller = new AbortController();
  const { signal } = controller;

  // Ensure cursor is always restored
  function cleanup(): void {
    showCursor();
  }

  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    controller.abort();
    // Give time for session to print stats, then force exit
    setTimeout(() => {
      process.exit(0);
    }, 500);
  });
  process.on('SIGTERM', () => {
    controller.abort();
    setTimeout(() => {
      process.exit(0);
    }, 500);
  });

  // Hide cursor for clean animation
  hideCursor();

  // Show startup banner
  startupBanner();

  // Run the session
  const ctx: ScenarioContext = { signal, config };

  try {
    await runSession(ctx);
  } catch (err) {
    if (!isAbortError(err)) {
      showCursor();
      console.error('Unexpected error:', err);
      process.exit(1);
    }
  }

  showCursor();
  process.exit(0);
}

main();
