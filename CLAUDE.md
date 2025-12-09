# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SVGFusion is a monorepo that converts SVG files into React and Vue 3 components with automatic color extraction, TypeScript support, and cross-platform compatibility (Node.js, Browser, VS Code extension). The project uses pnpm workspaces with multiple interdependent packages.

## Essential Commands

### Installation & Setup

```bash
pnpm install                    # Install all dependencies
pnpm run prepare                # Setup Husky git hooks
```

### Development Workflow

```bash
# Build entire monorepo (respects dependency order)
pnpm run build

# Individual package builds (in dependency order)
pnpm run build:utils            # 1. Foundation layer
pnpm run build:core             # 2. Core engine
pnpm run build:react            # 3. React generator
pnpm run build:vue              # 3. Vue generator
pnpm run build:browser          # 4. Browser package (svgfusion-dom)
pnpm run build:cli              # 4. CLI package (svgfusion-cmd)
pnpm run build:vscode           # 4. VS Code extension
pnpm run build:bundle           # 5. Main bundle (svgfusion)

# Development mode (watch all packages in parallel)
pnpm run dev
pnpm run dev:utils              # Watch single package
```

### Testing

```bash
pnpm test                       # Run all tests (excludes docs/demo)
pnpm run test:coverage          # Generate coverage reports
pnpm run test:watch             # Watch mode

# Individual package tests
pnpm --filter=svgfusion-core test
pnpm --filter=svgfusion-react test
```

### Code Quality

```bash
pnpm run lint                   # Lint all packages
pnpm run lint:fix               # Fix linting issues
pnpm run format                 # Format with Prettier
pnpm run format:check           # Check formatting
pnpm run type-check             # TypeScript type checking
pnpm run clean                  # Clean all dist directories
```

### Package-Specific Commands

```bash
# Filter commands to specific packages
pnpm --filter=svgfusion-core build
pnpm --filter=svgfusion-react test
pnpm --filter=svgfusion-bundle dev

# Run CLI locally (for testing)
pnpm run svgfusion ./test-icons --output ./test-output
```

## Architecture

### Package Dependency Hierarchy

The monorepo follows a strict layered architecture. **Build order is critical**:

1. **Foundation**: `svgfusion-utils` (no internal dependencies)
2. **Core Engine**: `svgfusion-core` (depends on utils)
3. **Framework Generators**: `svgfusion-react`, `svgfusion-vue` (depend on core + utils)
4. **Platform Interfaces**: `svgfusion-cmd`, `svgfusion-dom`, `svgfusion-vscode` (depend on generators)
5. **Main Bundle**: `svgfusion-bundle` (aggregates all packages)

**Critical Rule**: Lower layers MUST NOT depend on higher layers. When adding features, respect this hierarchy.

### Key Components

**svgfusion-core** (`packages/svgfusion-core/src/`):

- `engine.ts`: Main orchestration class (`SVGFusion`)
- `core/parser.ts`: SVG parsing and metadata extraction (`SVGParser`)
- `core/transformer.ts`: SVG transformations and optimizations (`SVGTransformer`)
- `core/generator.ts`: Base class for framework generators (`ComponentGenerator`)
- `features/`: Individual transformation features (color-splitting, stroke-fixing, accessibility, etc.)

**svgfusion-react/vue**: Framework-specific component code generators that extend `ComponentGenerator`

**svgfusion-utils**: Shared utilities (string manipulation, file operations, color extraction, CLI utilities)

**svgfusion-cmd**: Standalone CLI implementation for batch conversions

**svgfusion-dom**: Browser-optimized package (no file system operations)

**svgfusion-bundle**: Main distribution package published as `svgfusion` on npm

### Workspace Configuration

- Uses `workspace:*` for internal dependencies during development
- PNPM workspace defined in `pnpm-workspace.yaml`
- TypeScript project references in root `tsconfig.json`
- Each package has its own `tsconfig.json` that extends the root

## Development Guidelines

### Adding New Features

When adding transformation features:

1. Create a new feature file in `packages/svgfusion-core/src/features/`
2. Export the feature from `core/transformer.ts`
3. Add corresponding option to `TransformationOptions` type
4. Update both React and Vue generators if feature affects component props
5. Add tests in the package's `tests/` directory
6. Update documentation if user-facing

### Working with Multiple Packages

**When making cross-package changes:**

1. Build in dependency order (utils → core → generators → interfaces → bundle)
2. Test each package after building
3. Run `pnpm run type-check` at root to catch cross-package type errors
4. Use `pnpm --filter=<package-name>` to scope commands

**Common issue**: If you modify `svgfusion-utils`, you must rebuild all packages that depend on it.

### Testing Strategy

- Unit tests use Jest with ES modules (`NODE_OPTIONS="--experimental-vm-modules"`)
- Each package has its own test suite
- Test files are colocated in `tests/` directories within packages
- Coverage reports are generated per-package

### Code Style

- TypeScript strict mode enabled
- ESLint configuration at root (eslint.config.js)
- Prettier for formatting (.prettierrc)
- Husky pre-commit hooks run lint-staged
- Conventional commits enforced (commitlint.config.js)

### Package Exports

Packages use conditional exports for multiple environments:

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  },
  "./browser": {
    "types": "./dist/browser.d.ts",
    "import": "./dist/browser.js"
  }
}
```

When adding exports, maintain compatibility for both ESM and CommonJS.

## Common Patterns

### Programmatic API Usage

```typescript
import { SVGFusion } from 'svgfusion-core';

const engine = new SVGFusion();
const result = await engine.convert(svgContent, {
  framework: 'react',
  transformation: { splitColors: true },
  generator: { componentName: 'MyIcon', typescript: true },
});
```

### Adding a New Transformation

1. Create `packages/svgfusion-core/src/features/my-feature.ts`
2. Implement transformation logic using jsdom
3. Add to `TransformationOptions` in `core/transformer.ts`
4. Update `SVGTransformer.transform()` method to apply your feature
5. Add tests in `packages/svgfusion-core/tests/`

### Color Handling

The project uses `colord` for color manipulation. Colors are normalized to lowercase hex format. See `svgfusion-utils/src/color.ts` for utilities.

## CI/CD & Releases

- Semantic Release is configured per-package
- Version bumps are automated based on conventional commits
- Each package can be released independently
- Release commands: `pnpm run release:<package-name>`
- Git hooks enforce commit format and run tests

## Important Notes

- Always use `pnpm` (not npm or yarn) - configured in package.json `packageManager` field
- Node.js >= 18.0.0 required
- The `svgfusion-docs` and `svgfusion-demo` packages are excluded from most workspace commands
- When debugging, check the browser vs Node.js entry points - they're separate builds
- JSDOM is used for DOM manipulation in Node.js environment
