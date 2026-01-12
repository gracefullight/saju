# Development Commands

## Environment Setup
```bash
# Install Node.js 24, pnpm 10 via mise
mise install

# Install dependencies
pnpm install
```

## Root Level Commands
```bash
# Build all packages
pnpm build

# Lint check
pnpm lint

# Lint auto-fix
pnpm lint:fix

# Format
pnpm format

# Create changeset
pnpm changeset

# Update versions
pnpm version

# Publish packages
pnpm release
```

## Package-specific Commands

### packages/saju
```bash
cd packages/saju

pnpm build          # Build with tsc + tsc-alias
pnpm dev            # Run with tsx
pnpm test           # Run vitest
pnpm test:ui        # Vitest UI mode
pnpm test:coverage  # Coverage report
pnpm lint           # Biome lint
pnpm lint:fix       # Biome lint auto-fix
pnpm format         # Biome format
```

### packages/validate-branch
```bash
cd packages/validate-branch

pnpm build       # Build with tsup
pnpm dev         # Run CLI with tsx
pnpm test        # Run vitest
pnpm lint        # Biome lint
pnpm lint:fix    # Biome lint auto-fix
pnpm format      # Biome format
```

### apps/saju-example
```bash
cd apps/saju-example

pnpm dev         # Next.js dev server (Turbopack)
pnpm build       # Next.js build
pnpm start       # Production server
pnpm lint        # Next.js lint
```

## Git Commands
```bash
git status
git diff
git log --oneline -10
git add .
git commit -m "message"
git push
```
