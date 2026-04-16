// Scenario interface and shared types

import type { FakeClaudeConfig } from '../config.js';

export interface ScenarioContext {
  signal: AbortSignal;
  config: FakeClaudeConfig;
}

export type Scenario = (ctx: ScenarioContext) => Promise<void>;
