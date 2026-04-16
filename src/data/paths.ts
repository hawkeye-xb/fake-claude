// Realistic file paths by project type

import type { ProjectType } from '../config.js';

const REACT_PATHS = [
  'src/index.tsx',
  'src/App.tsx',
  'src/App.css',
  'src/components/Button.tsx',
  'src/components/Header.tsx',
  'src/components/Sidebar.tsx',
  'src/components/SearchBar.tsx',
  'src/components/Modal.tsx',
  'src/components/DataTable.tsx',
  'src/components/Card.tsx',
  'src/components/Layout.tsx',
  'src/components/Navigation.tsx',
  'src/hooks/useAuth.ts',
  'src/hooks/useDebounce.ts',
  'src/hooks/useFetch.ts',
  'src/hooks/useLocalStorage.ts',
  'src/utils/auth.ts',
  'src/utils/api.ts',
  'src/utils/format.ts',
  'src/utils/validation.ts',
  'src/utils/constants.ts',
  'src/types/index.ts',
  'src/types/api.ts',
  'src/types/user.ts',
  'src/store/authSlice.ts',
  'src/store/index.ts',
  'src/services/userService.ts',
  'src/services/apiClient.ts',
  'src/middleware/auth.ts',
  'src/routes/index.tsx',
  'src/routes/Dashboard.tsx',
  'src/routes/Settings.tsx',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  '.env',
  'src/utils/auth.test.ts',
  'src/components/Button.test.tsx',
  'src/components/SearchBar.test.tsx',
  'src/hooks/useAuth.test.ts',
];

const NODE_PATHS = [
  'src/index.ts',
  'src/app.ts',
  'src/server.ts',
  'src/config/index.ts',
  'src/config/database.ts',
  'src/controllers/userController.ts',
  'src/controllers/authController.ts',
  'src/controllers/productController.ts',
  'src/middleware/auth.ts',
  'src/middleware/errorHandler.ts',
  'src/middleware/rateLimit.ts',
  'src/models/User.ts',
  'src/models/Product.ts',
  'src/models/Order.ts',
  'src/routes/api.ts',
  'src/routes/auth.ts',
  'src/routes/users.ts',
  'src/services/emailService.ts',
  'src/services/paymentService.ts',
  'src/utils/logger.ts',
  'src/utils/helpers.ts',
  'src/utils/validation.ts',
  'src/types/index.ts',
  'package.json',
  'tsconfig.json',
  '.env',
  'prisma/schema.prisma',
  'tests/auth.test.ts',
  'tests/user.test.ts',
];

const PYTHON_PATHS = [
  'main.py',
  'app/__init__.py',
  'app/main.py',
  'app/config.py',
  'app/models/user.py',
  'app/models/product.py',
  'app/routes/auth.py',
  'app/routes/api.py',
  'app/services/email.py',
  'app/services/payment.py',
  'app/utils/helpers.py',
  'app/utils/validators.py',
  'app/middleware/auth.py',
  'app/database.py',
  'requirements.txt',
  'pyproject.toml',
  'tests/test_auth.py',
  'tests/test_api.py',
  'tests/conftest.py',
  'alembic/versions/001_initial.py',
  'Dockerfile',
];

const RUST_PATHS = [
  'src/main.rs',
  'src/lib.rs',
  'src/config.rs',
  'src/error.rs',
  'src/models/mod.rs',
  'src/models/user.rs',
  'src/models/product.rs',
  'src/handlers/mod.rs',
  'src/handlers/auth.rs',
  'src/handlers/api.rs',
  'src/middleware/mod.rs',
  'src/middleware/auth.rs',
  'src/db/mod.rs',
  'src/db/pool.rs',
  'src/db/migrations.rs',
  'src/utils/mod.rs',
  'src/utils/crypto.rs',
  'Cargo.toml',
  'Cargo.lock',
  'tests/integration_test.rs',
  'benches/benchmarks.rs',
];

const GO_PATHS = [
  'main.go',
  'cmd/server/main.go',
  'internal/config/config.go',
  'internal/handlers/auth.go',
  'internal/handlers/user.go',
  'internal/handlers/product.go',
  'internal/middleware/auth.go',
  'internal/middleware/logging.go',
  'internal/models/user.go',
  'internal/models/product.go',
  'internal/repository/user_repo.go',
  'internal/repository/product_repo.go',
  'internal/services/auth_service.go',
  'internal/services/email_service.go',
  'pkg/utils/helpers.go',
  'pkg/utils/validation.go',
  'go.mod',
  'go.sum',
  'internal/handlers/auth_test.go',
  'internal/services/auth_service_test.go',
];

const PATH_MAP: Record<ProjectType, readonly string[]> = {
  react: REACT_PATHS,
  node: NODE_PATHS,
  python: PYTHON_PATHS,
  rust: RUST_PATHS,
  go: GO_PATHS,
};

export function getProjectPaths(type: ProjectType): readonly string[] {
  return PATH_MAP[type];
}

export function getTestPaths(type: ProjectType): string[] {
  return [...PATH_MAP[type]].filter(p =>
    p.includes('test') || p.includes('spec') || p.includes('bench')
  );
}

export function getSourcePaths(type: ProjectType): string[] {
  return [...PATH_MAP[type]].filter(p =>
    !p.includes('test') && !p.includes('spec') &&
    !p.includes('.json') && !p.includes('.toml') &&
    !p.includes('.lock') && !p.includes('.env') &&
    !p.includes('.txt') && !p.includes('Dockerfile')
  );
}
