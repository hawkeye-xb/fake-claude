// Claude-style prose responses

export interface ProseMessage {
  context: string;   // when to use this message
  text: string;
}

export const PLAN_RESPONSES: readonly string[] = [
  `I'll help you fix the authentication issue and add the search component. Let me start by understanding the current codebase structure.`,
  `Let me analyze the failing tests and understand the root cause before making any changes.`,
  `I'll look at the existing code to understand the architecture, then propose a fix.`,
  `Let me examine the relevant files to understand how the current implementation works.`,
  `I'll start by reviewing the test failures, then trace the issue back to the source.`,
];

export const MID_RESPONSES: readonly string[] = [
  `I found the issue. The retry logic has an off-by-one error — it retries MAX_RETRIES times but doesn't account for the initial attempt. The test assertion needs to match the actual retry count. Let me fix both.`,
  `The problem is in the error handling. When the token expires, the refresh logic doesn't await the new token before retrying. I'll add proper async handling.`,
  `I see — the test is mocking the API client but the mock doesn't match the actual interface signature. The response shape changed when we added the \`expires_at\` field. Let me update the mock.`,
  `The race condition is caused by concurrent state updates. When two requests fire simultaneously, the second one overwrites the first one's token. I'll add a mutex-style lock.`,
  `The validation is too strict — it rejects valid inputs that contain unicode characters. I'll update the regex pattern and add test cases for international names.`,
];

export const SUMMARY_RESPONSES: readonly string[] = [
  `Here's a summary of the changes I made:

1. **Fixed retry logic** in \`auth.ts\` — increased MAX_RETRIES to 5 and added proper delay between attempts
2. **Updated test assertions** to match the corrected retry behavior
3. **Created SearchBar component** with debounced input handling
4. **Added useDebounce hook** for reusable debounce logic

All tests are passing. The auth fix handles transient network failures more gracefully, and the new SearchBar component is ready to integrate into the Dashboard.`,

  `Changes complete:

1. **Fixed the off-by-one error** in the authentication retry loop
2. **Added error boundary** to prevent silent failures
3. **Created new utility function** for consistent error formatting
4. **Updated all related tests** — 12 passing, 0 failing

The root cause was the comparison operator in the while loop (\`<\` vs \`<=\`). With this fix, the auth flow correctly retries up to MAX_RETRIES times including the initial attempt.`,

  `All done. Here's what changed:

1. **Refactored API client** to use AbortController for request timeouts
2. **Added rate limiting middleware** with configurable window and max requests
3. **Fixed type definitions** to match the updated API response schema
4. **Added integration tests** covering the new timeout behavior

The build passes and all 15 tests are green. The timeout handling prevents hung requests from blocking the UI.`,
];

export const USER_PROMPTS: readonly string[] = [
  'Help me fix the failing auth tests and add a search component',
  'The login flow is broken after the last deploy, can you investigate?',
  'Refactor the API client to handle timeouts properly',
  'Add rate limiting to the API endpoints',
  'The test suite is flaky — some tests pass sometimes and fail other times',
  'Update the user model to support roles and permissions',
  'Optimize the database queries — the dashboard is loading slowly',
  'Add input validation to all form fields',
  'Set up error boundaries so the app doesn\'t crash on API errors',
  'Migrate from REST to GraphQL for the user endpoints',
];

export const SEARCH_PATTERNS: readonly string[] = [
  'handleAuth',
  'MAX_RETRIES',
  'token.*expired',
  'async.*function',
  'import.*from',
  'export.*default',
  'useState',
  'useEffect',
  'throw new Error',
  'catch.*err',
  'interface.*Props',
  'class.*Controller',
  'middleware',
  'authenticate',
  'validate',
];

export const GLOB_PATTERNS: readonly string[] = [
  'src/**/*.{ts,tsx}',
  'src/**/*.test.{ts,tsx}',
  'src/components/**/*.tsx',
  'src/utils/**/*.ts',
  'src/hooks/**/*.ts',
  'src/**/*.css',
  '**/*.config.{ts,js}',
];
