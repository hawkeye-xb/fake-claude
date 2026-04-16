// Timing system — all delays go through here for speed control and abort

let speedFactor = 1.0;

export function setSpeedFactor(factor: number): void {
  speedFactor = factor;
}

export function getSpeedFactor(): number {
  return speedFactor;
}

export function sleep(baseMs: number, signal: AbortSignal): Promise<void> {
  const ms = Math.round(baseMs * speedFactor);
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

export function sleepRange(minMs: number, maxMs: number, signal: AbortSignal): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return sleep(ms, signal);
}

export function typeDelay(signal: AbortSignal): Promise<void> {
  return sleepRange(15, 40, signal);
}

export function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

// Random integer in [min, max] inclusive
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pick a random element from an array
export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Shuffle array (Fisher-Yates) — returns new array
export function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
