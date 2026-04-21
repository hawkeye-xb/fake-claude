// ANSI terminal output primitives — handles stdout backpressure correctly
let silenced = false;
let drainPromise: Promise<void> | null = null;

export function silence(): void {
  silenced = true;
}

export function write(text: string): void {
  if (!silenced) {
    const canContinue = process.stdout.write(text);
    // If write returned false, buffer is full - set up drain listener
    if (!canContinue && !drainPromise) {
      drainPromise = new Promise(resolve => {
        process.stdout.once('drain', () => {
          drainPromise = null;
          resolve();
        });
      });
    }
  }
}

export function writeLine(text: string): void {
  write(text + '\n');
}

export async function flush(): Promise<void> {
  if (drainPromise) {
    await drainPromise;
  }
}

export function newLine(): void {
  write('\n');
}

export function clearLine(): void {
  write('\r\x1b[2K');
}

export function cursorUp(n: number): void {
  if (n > 0) write(`\x1b[${n}A`);
}

export function cursorDown(n: number): void {
  if (n > 0) write(`\x1b[${n}B`);
}

export function hideCursor(): void {
  write('\x1b[?25l');
}

export function showCursor(): void {
  write('\x1b[?25h');
}

// --- Color helpers (256-color mode) ---

export function color256(code: number, text: string): string {
  return `\x1b[38;5;${code}m${text}\x1b[0m`;
}

export function bg256(code: number, text: string): string {
  return `\x1b[48;5;${code}m${text}\x1b[0m`;
}

export function colorBg256(fg: number, bg: number, text: string): string {
  return `\x1b[38;5;${fg};48;5;${bg}m${text}\x1b[0m`;
}

export function bold(text: string): string {
  return `\x1b[1m${text}\x1b[0m`;
}

export function dim(text: string): string {
  return `\x1b[2m${text}\x1b[0m`;
}

export function italic(text: string): string {
  return `\x1b[3m${text}\x1b[0m`;
}

// --- Semantic color shortcuts ---

export const C = {
  spinner: (t: string) => color256(174, t),    // salmon
  spinnerVerb: (t: string) => color256(216, t), // light orange
  toolDot: (t: string) => color256(75, t),      // blue
  toolName: (t: string) => bold(t),
  diffAdd: (t: string) => colorBg256(78, 22, t),    // green on dark green
  diffRem: (t: string) => colorBg256(168, 52, t),   // red on dark red
  diffHunk: (t: string) => color256(117, t),         // cyan
  diffContext: (t: string) => t,
  lineNum: (t: string) => dim(color256(248, t)),     // dim gray
  cost: (t: string) => color256(117, t),             // cyan
  success: (t: string) => color256(78, t),           // green
  error: (t: string) => color256(168, t),            // red
  warning: (t: string) => color256(220, t),          // yellow
  dimmed: (t: string) => dim(t),
  path: (t: string) => color256(248, t),             // gray
  keyword: (t: string) => bold(color256(75, t)),     // bold blue
};
