# fake-claude

Pretend Claude Code is working hard in your terminal. Inspired by [genact](https://github.com/svenstaro/genact).

![demo](https://github.com/hawkeye-xb/fake-claude/assets/demo-placeholder.gif)

## Features

- Realistic Claude Code terminal output with authentic formatting
- Animated thinking spinner with 187 real spinner verbs
- Tool use simulation: Read, Update, Write, Bash, Grep, Glob
- Diff display with line numbers, additions/removals
- Permission prompts, prose responses, session stats
- Configurable speed, duration, and project type
- Zero runtime dependencies
- Memory safe for long-running sessions

## Install

### From Release (recommended)

Download the latest release from the [Releases page](https://github.com/hawkeye-xb/fake-claude/releases), then:

```bash
# Unpack and run
tar -xzf fake-claude-v*.tar.gz
cd fake-claude
node bin/fake-claude.js
```

### Build from source

```bash
git clone https://github.com/hawkeye-xb/fake-claude.git
cd fake-claude
npm install
npm run build
node bin/fake-claude.js
```

### Install globally (from source)

```bash
git clone https://github.com/hawkeye-xb/fake-claude.git
cd fake-claude
npm install
npm run build
npm link
# Now you can run from anywhere:
fake-claude
```

## Usage

```bash
# Run with default settings (infinite, speed 1x, react project)
fake-claude

# Run at 2x speed for 5 minutes
fake-claude --speed 0.5 --duration 300

# Simulate a Python project
fake-claude --project python

# Slow down for a more realistic look
fake-claude --speed 1.5
```

### Options

| Option | Description | Default |
|---|---|---|
| `--speed, -s <factor>` | Speed multiplier. `0.5` = 2x fast, `2.0` = half speed | `1.0` |
| `--duration, -d <seconds>` | Run for N seconds then exit | infinite |
| `--project <type>` | Project type: `react`, `node`, `python`, `rust`, `go` | `react` |
| `--no-color` | Disable ANSI colors | |
| `--help, -h` | Show help | |
| `--version, -v` | Show version | |

Press `Ctrl+C` to exit gracefully (shows session stats).

## What it simulates

| State | Output |
|---|---|
| Thinking | Animated spinner with rotating verbs (Caffeinating, Kwisatz-haderaching...) |
| Read | File content with line numbers and collapse indicator |
| Update | Diff with line numbers, `Added N lines, removed M lines` |
| Write | New file creation with `Wrote N lines to file` |
| Bash | Command execution with colorized test output |
| Grep/Glob | Search results with file paths and match counts |
| Permission | Numbered choice prompt with auto-select |
| Response | Character-by-character typing with variable speed |
| Stats | Model, tokens, cost, duration on exit |

## Build for Release

```bash
npm run build
tar -czf fake-claude-v1.0.0.tar.gz \
  bin/ dist/ package.json README.md LICENSE
```

## Tech Stack

- TypeScript (ES2022, Node16 modules)
- Pure ANSI escape codes, no UI framework
- Zero runtime dependencies

## License

MIT
