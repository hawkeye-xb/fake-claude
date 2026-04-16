// Bash commands and their fake outputs

import type { ProjectType } from '../config.js';

export interface BashCommand {
  command: string;
  output: string[];
  exitCode: number;
}

const REACT_COMMANDS: BashCommand[] = [
  {
    command: 'npm test -- --coverage',
    output: [
      '',
      'PASS  src/utils/auth.test.ts',
      'PASS  src/components/Button.test.tsx',
      'PASS  src/hooks/useAuth.test.ts',
      '',
      'Test Suites:  3 passed, 3 total',
      'Tests:        12 passed, 12 total',
      'Snapshots:    0 total',
      'Time:         2.847s',
      '',
      '----------|---------|----------|---------|---------|',
      'File      | % Stmts | % Branch | % Funcs | % Lines |',
      '----------|---------|----------|---------|---------|',
      'All files |   87.5  |   72.3   |   91.2  |   86.8  |',
      '----------|---------|----------|---------|---------|',
    ],
    exitCode: 0,
  },
  {
    command: 'npx tsc --noEmit',
    output: [],
    exitCode: 0,
  },
  {
    command: 'npm run build',
    output: [
      'vite v5.4.2 building for production...',
      '✓ 187 modules transformed.',
      'dist/index.html                  0.46 kB │ gzip:  0.30 kB',
      'dist/assets/index-DkR2c1Js.css   8.12 kB │ gzip:  2.84 kB',
      'dist/assets/index-BvYg3k1n.js  142.87 kB │ gzip: 45.91 kB',
      '✓ built in 1.87s',
    ],
    exitCode: 0,
  },
  {
    command: 'npm run lint',
    output: [
      '',
      '✖ 0 problems (0 errors, 0 warnings)',
      '',
    ],
    exitCode: 0,
  },
  {
    command: 'git diff --stat',
    output: [
      ' src/utils/auth.ts       | 8 +++++---',
      ' src/components/Button.tsx| 3 ++-',
      ' src/hooks/useAuth.ts    | 5 +++--',
      ' 3 files changed, 10 insertions(+), 6 deletions(-)',
    ],
    exitCode: 0,
  },
  {
    command: 'git status',
    output: [
      'On branch feature/auth-fix',
      "Your branch is up to date with 'origin/feature/auth-fix'.",
      '',
      'Changes not staged for commit:',
      '  modified:   src/utils/auth.ts',
      '  modified:   src/components/Button.tsx',
      '',
      'Untracked files:',
      '  src/components/SearchBar.tsx',
      '  src/hooks/useDebounce.ts',
    ],
    exitCode: 0,
  },
];

const NODE_COMMANDS: BashCommand[] = [
  {
    command: 'npm test',
    output: [
      '',
      ' PASS  tests/auth.test.ts (1.234s)',
      ' PASS  tests/user.test.ts (0.892s)',
      '',
      'Test Suites:  2 passed, 2 total',
      'Tests:        8 passed, 8 total',
      'Time:         2.126s',
    ],
    exitCode: 0,
  },
  {
    command: 'npx prisma migrate dev',
    output: [
      'Environment variables loaded from .env',
      'Prisma schema loaded from prisma/schema.prisma',
      'Datasource "db": PostgreSQL database "myapp"',
      '',
      'Applying migration `20240315_add_user_roles`',
      '',
      'The following migration(s) have been applied:',
      '',
      'migrations/',
      '  └─ 20240315_add_user_roles/',
      '    └─ migration.sql',
      '',
      '✔ Generated Prisma Client to ./node_modules/@prisma/client',
    ],
    exitCode: 0,
  },
  {
    command: 'npm run build',
    output: [
      'Successfully compiled 24 files with swc.',
    ],
    exitCode: 0,
  },
];

const PYTHON_COMMANDS: BashCommand[] = [
  {
    command: 'python -m pytest -v',
    output: [
      'collected 15 items',
      '',
      'tests/test_auth.py::test_login_success PASSED            [  6%]',
      'tests/test_auth.py::test_login_invalid_password PASSED   [ 13%]',
      'tests/test_auth.py::test_token_refresh PASSED            [ 20%]',
      'tests/test_api.py::test_get_users PASSED                 [ 26%]',
      'tests/test_api.py::test_create_user PASSED               [ 33%]',
      'tests/test_api.py::test_update_user PASSED               [ 40%]',
      'tests/test_api.py::test_delete_user PASSED               [ 46%]',
      '',
      '============ 7 passed in 1.84s ============',
    ],
    exitCode: 0,
  },
  {
    command: 'python -m mypy app/',
    output: [
      'Success: no issues found in 12 source files',
    ],
    exitCode: 0,
  },
];

const RUST_COMMANDS: BashCommand[] = [
  {
    command: 'cargo build',
    output: [
      '   Compiling myapp v0.1.0 (/home/user/myapp)',
      '    Finished `dev` profile [unoptimized + debuginfo] target(s) in 3.47s',
    ],
    exitCode: 0,
  },
  {
    command: 'cargo test',
    output: [
      '   Compiling myapp v0.1.0 (/home/user/myapp)',
      '    Finished `test` profile [unoptimized + debuginfo] target(s) in 4.12s',
      '     Running unittests src/lib.rs',
      '',
      'running 8 tests',
      'test handlers::auth::tests::test_login ... ok',
      'test handlers::auth::tests::test_invalid_token ... ok',
      'test models::user::tests::test_create ... ok',
      'test models::user::tests::test_validate ... ok',
      '',
      'test result: ok. 8 passed; 0 failed; 0 ignored',
    ],
    exitCode: 0,
  },
  {
    command: 'cargo clippy',
    output: [
      '    Checking myapp v0.1.0 (/home/user/myapp)',
      '    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.23s',
    ],
    exitCode: 0,
  },
];

const GO_COMMANDS: BashCommand[] = [
  {
    command: 'go test ./...',
    output: [
      'ok      myapp/internal/handlers     0.234s',
      'ok      myapp/internal/services     0.189s',
      'ok      myapp/internal/middleware    0.112s',
      'ok      myapp/pkg/utils             0.078s',
    ],
    exitCode: 0,
  },
  {
    command: 'go build -o bin/server ./cmd/server',
    output: [],
    exitCode: 0,
  },
  {
    command: 'go vet ./...',
    output: [],
    exitCode: 0,
  },
];

const COMMANDS_MAP: Record<ProjectType, BashCommand[]> = {
  react: REACT_COMMANDS,
  node: NODE_COMMANDS,
  python: PYTHON_COMMANDS,
  rust: RUST_COMMANDS,
  go: GO_COMMANDS,
};

export function getBashCommands(type: ProjectType): readonly BashCommand[] {
  return COMMANDS_MAP[type];
}

// Commands that trigger permission prompts
export const PERMISSION_COMMANDS = [
  'rm -rf dist && npm run build',
  'npm run build',
  'npm test -- --coverage',
  'npx prisma migrate dev',
  'cargo build --release',
  'go build -o bin/server ./cmd/server',
  'python -m pytest -v --tb=short',
  'docker build -t myapp .',
  'git push origin feature/auth-fix',
];
