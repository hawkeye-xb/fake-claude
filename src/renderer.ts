// High-level UI rendering primitives — matches real Claude Code output format

import * as out from './output.js';
import { sleep, sleepRange, pick, randInt } from './timing.js';
import { SPINNER_CHARS, SPINNER_VERBS } from './data/verbs.js';

// Real Claude Code indentation (from source):
// ⏺ ToolName(arg)          col 0  — tool header, NO indent
//   ⎿  result summary       col 2  — connector: 2 spaces + ⎿ + 2 spaces
//       content line         col 6  — content: 6 spaces
//       … +N lines          col 6
const CONNECTOR = out.C.dimmed('  ⎿  ');     // "  ⎿  " at col 2
const CONTENT_INDENT = '      ';              // 6 spaces for content

// --- Thinking Spinner ---

export async function thinkingSpinner(durationMs: number, signal: AbortSignal): Promise<void> {
  const startTime = Date.now();
  let charIdx = 0;
  let verb = pick(SPINNER_VERBS);
  let lastVerbChange = Date.now();

  while (Date.now() - startTime < durationMs) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    if (Date.now() - lastVerbChange > 2000) {
      verb = pick(SPINNER_VERBS);
      lastVerbChange = Date.now();
    }

    const char = SPINNER_CHARS[charIdx % SPINNER_CHARS.length];
    out.clearLine();
    out.write(`${out.C.spinner(char)} ${out.C.spinnerVerb(verb + '...')}`);

    charIdx++;
    await sleep(120, signal);
  }

  out.clearLine();
  await out.flush();
}

// --- Tool Header: ⏺ ToolName(detail) ---

export function toolHeader(toolName: string, detail?: string): void {
  const dot = out.C.toolDot('⏺');
  const name = out.C.toolName(toolName);
  if (detail) {
    out.writeLine(`${dot} ${name}(${detail})`);
  } else {
    out.writeLine(`${dot} ${name}`);
  }
}

// --- Tool Result Connector: ⎿  summary ---

export function toolResult(summary: string): void {
  out.writeLine(`${CONNECTOR}${summary}`);
}

// --- Content Block with ⎿ prefix (file reads, command output) ---

export async function contentBlock(
  lines: string[],
  signal: AbortSignal,
  options?: {
    lineNumbers?: boolean;
    startLine?: number;
    totalLines?: number;
    collapsedExtra?: number;
  }
): Promise<void> {
  const showLineNums = options?.lineNumbers ?? false;
  const startLine = options?.startLine ?? 1;

  for (let i = 0; i < lines.length; i++) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    let prefix = CONTENT_INDENT;
    if (showLineNums) {
      const num = String(startLine + i).padStart(4, ' ');
      prefix = `${CONTENT_INDENT}${out.C.lineNum(num)}  `;
    }
    out.writeLine(`${prefix}${lines[i]}`);
    await sleepRange(30, 60, signal);
  }

  // Collapsed extra lines indicator
  const extra = options?.collapsedExtra ?? (
    options?.totalLines
      ? options.totalLines - lines.length - (startLine - 1)
      : 0
  );
  if (extra > 0) {
    out.writeLine(`${CONTENT_INDENT}${out.C.dimmed(`… +${extra} lines (ctrl+o to expand)`)}`);
  }
  await out.flush();
}

// --- Diff Block with line numbers ---

export interface DiffLine {
  marker: ' ' | '+' | '-';
  lineNum: number;
  text: string;
}

export async function diffBlock(
  diffLines: DiffLine[],
  signal: AbortSignal,
): Promise<void> {
  const maxNum = Math.max(...diffLines.map(l => l.lineNum));
  const numWidth = String(maxNum).length;

  for (const line of diffLines) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    const num = String(line.lineNum).padStart(numWidth, ' ');
    const marker = line.marker;

    let formatted: string;
    if (marker === '+') {
      formatted = `${CONTENT_INDENT}${out.C.diffAdd(marker + ' ' + num + '  ' + line.text)}`;
    } else if (marker === '-') {
      formatted = `${CONTENT_INDENT}${out.C.diffRem(marker + ' ' + num + '  ' + line.text)}`;
    } else {
      formatted = `${CONTENT_INDENT}${out.C.lineNum(marker + ' ' + num)}  ${line.text}`;
    }

    out.writeLine(formatted);
    await sleepRange(50, 100, signal);
  }
  await out.flush();
}

// --- New file (all additions) ---

export async function newFileBlock(lines: string[], signal: AbortSignal): Promise<void> {
  const numWidth = String(lines.length).length;

  for (let i = 0; i < lines.length; i++) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    const num = String(i + 1).padStart(numWidth, ' ');
    out.writeLine(`${CONTENT_INDENT}${out.C.diffAdd('+ ' + num + '  ' + lines[i])}`);
    await sleepRange(40, 80, signal);
  }
  await out.flush();
}

// --- Permission Prompt ---

export async function permissionPrompt(command: string, signal: AbortSignal): Promise<void> {
  toolHeader('Claude wants to run:', out.C.dimmed(command));

  out.newLine();
  out.writeLine(`${CONTENT_INDENT}${out.C.warning('Allow this command?')}`);
  out.writeLine(`${CONTENT_INDENT}${out.C.dimmed('1.')} Yes`);
  out.writeLine(`${CONTENT_INDENT}${out.C.dimmed('2.')} Yes, don't ask again for this session`);
  out.writeLine(`${CONTENT_INDENT}${out.C.dimmed('3.')} No`);
  out.newLine();

  await sleepRange(1500, 3000, signal);

  out.writeLine(`${CONTENT_INDENT}${out.C.dimmed('>')} 2`);
  out.newLine();
}

// --- Prose Response (character-by-character typing) ---

export async function proseResponse(text: string, signal: AbortSignal): Promise<void> {
  // Real CC: prose starts with ⏺ at col 0, continuation lines at col 2
  out.write(`${out.C.toolDot('⏺')} `);
  for (let i = 0; i < text.length; i++) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    const char = text[i];
    out.write(char);

    if (char === '\n' && i < text.length - 1) {
      out.write('  '); // continuation indent at col 2
    }

    if (char === '.' || char === '!' || char === '?') {
      await sleepRange(80, 150, signal);
    } else if (char === ',' || char === ';' || char === ':') {
      await sleepRange(40, 80, signal);
    } else if (char === '\n') {
      await sleepRange(50, 100, signal);
    } else if (char === ' ') {
      await sleepRange(10, 25, signal);
    } else {
      await sleepRange(12, 35, signal);
    }
  }
  out.newLine();
  out.newLine();
  await out.flush();
}

// --- Search Results ---

export async function searchResults(
  results: string[],
  count: number,
  unit: string,
  signal: AbortSignal
): Promise<void> {
  for (const line of results) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    out.writeLine(`${CONTENT_INDENT}${line}`);
    await sleepRange(40, 80, signal);
  }
  out.newLine();
  out.writeLine(`${CONTENT_INDENT}${out.C.dimmed(`${count} ${unit}`)}`);
  await out.flush();
}

// --- Collapsed Read/Search Summary ---
// e.g. "  Read 3 files, searched for 2 patterns"

export function collapsedSummary(parts: string[]): void {
  const text = parts.join(', ');
  out.writeLine(`  ${out.C.dimmed(text)}`);
}

// --- Session Stats ---

export interface SessionStats {
  model: string;
  inputTokens: number;
  cacheReadTokens: number;
  outputTokens: number;
  cost: number;
  durationMs: number;
}

export function sessionStats(stats: SessionStats): void {
  const divider = out.C.dimmed('─'.repeat(42));
  const duration = formatDuration(stats.durationMs);

  out.newLine();
  out.writeLine(`  ${divider}`);
  out.writeLine(`  Model: ${out.bold(stats.model)}`);
  out.writeLine(`  Input tokens:  ${stats.inputTokens.toLocaleString()} ${out.C.dimmed(`(${(stats.cacheReadTokens / 1e6).toFixed(1)}M cache read)`)}`);
  out.writeLine(`  Output tokens: ${stats.outputTokens.toLocaleString()}`);
  out.writeLine(`  Total cost:    ${out.C.cost('$' + stats.cost.toFixed(2))}`);
  out.writeLine(`  Duration:      ${out.C.cost(duration)}`);
  out.writeLine(`  ${divider}`);
  out.newLine();
}

// --- User Prompt ---

export async function userPrompt(text: string, signal: AbortSignal): Promise<void> {
  out.newLine();
  out.write(out.C.keyword('❯') + ' '); // ❯ at col 0

  for (const char of text) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    out.write(char);
    await sleepRange(30, 70, signal);
  }
  out.newLine();
  out.newLine();
}

// --- Startup Banner (matches real Claude Code condensed logo) ---
// Layout: Clawd ASCII art on left, info on right
//
//  ▐▛███▜▌   Claude Code v2.1.110
// ▝▜█████▛▘  Opus 4.6 (1M context) · Claude Enterprise
//   ▘▘ ▝▝    ~/github/fake-claude

export function startupBanner(cwd?: string): void {
  const version = '2.1.110';
  const model = 'Opus 4.6 (1M context)';
  const billing = 'Claude Enterprise';
  const dir = cwd ?? process.cwd().replace(/^\/Users\/[^/]+/, '~');

  // Clawd character (3 rows, body color)
  const clawdColor = out.color256(209, ''); // orange-ish for clawd body
  const r1 = out.color256(209, ' ▐▛███▜▌ ');
  const r2 = out.color256(209, '▝▜█████▛▘');
  const r3 = out.color256(209, '  ▘▘ ▝▝  ');

  // Right side info
  const info1 = `  ${out.bold('Claude Code')} ${out.C.dimmed(`v${version}`)}`;
  const info2 = `  ${out.C.dimmed(`${model} · ${billing}`)}`;
  const info3 = `  ${out.C.dimmed(dir)}`;

  out.writeLine(`${r1}${info1}`);
  out.writeLine(`${r2}${info2}`);
  out.writeLine(`${r3}${info3}`);
  out.newLine();
}

// --- Helpers ---

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}
