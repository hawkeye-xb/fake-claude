// Configuration — parsed once from CLI args, then frozen

export type ProjectType = 'react' | 'node' | 'python' | 'rust' | 'go';

export interface FakeClaudeConfig {
  speedFactor: number;
  durationSeconds: number | null;  // null = infinite
  projectType: ProjectType;
  color: boolean;
  terminalWidth: number;
}

const HELP_TEXT = `
fake-claude — Pretend Claude Code is working hard in your terminal

Usage: fake-claude [options]

Options:
  --speed, -s <factor>     Speed multiplier (default: 1.0)
                            0.5 = twice as fast, 2.0 = half speed
  --duration, -d <seconds> Run for N seconds then exit (default: infinite)
  --project <type>         Project type: react | node | python | rust | go
                            (default: react)
  --no-color               Disable ANSI colors
  --help, -h               Show this help
  --version, -v            Show version
`.trim();

export function parseArgs(argv: string[]): FakeClaudeConfig | null {
  const args = argv.slice(2); // skip node + script path
  let speedFactor = 1.0;
  let durationSeconds: number | null = null;
  let projectType: ProjectType = 'react';
  let color = !process.env['NO_COLOR'];
  const terminalWidth = process.stdout.columns || 80;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--help':
      case '-h':
        console.log(HELP_TEXT);
        return null;
      case '--version':
      case '-v':
        console.log('fake-claude 1.0.1');
        return null;
      case '--speed':
      case '-s': {
        const val = parseFloat(args[++i]);
        if (isNaN(val) || val <= 0) {
          console.error('Error: --speed must be a positive number');
          return null;
        }
        speedFactor = val;
        break;
      }
      case '--duration':
      case '-d': {
        const val = parseInt(args[++i], 10);
        if (isNaN(val) || val <= 0) {
          console.error('Error: --duration must be a positive integer');
          return null;
        }
        durationSeconds = val;
        break;
      }
      case '--project': {
        const val = args[++i] as ProjectType;
        if (!['react', 'node', 'python', 'rust', 'go'].includes(val)) {
          console.error('Error: --project must be one of: react, node, python, rust, go');
          return null;
        }
        projectType = val;
        break;
      }
      case '--no-color':
        color = false;
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        console.log(HELP_TEXT);
        return null;
    }
  }

  return Object.freeze({
    speedFactor,
    durationSeconds,
    projectType,
    color,
    terminalWidth,
  });
}
