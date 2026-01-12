# Task Completion Checklist

## After Code Changes

### 1. Lint Check
```bash
pnpm lint
```
If errors, run `pnpm lint:fix` for auto-fix

### 2. Type Check
In the relevant package:
```bash
pnpm build
```
Should have no build errors

### 3. Run Tests
In the relevant package:
```bash
pnpm test
```
All tests must pass

## Before Release

### 1. Create Changeset
```bash
pnpm changeset
```
- Select change type (major/minor/patch)
- Write change description

### 2. Update Versions
```bash
pnpm version
```

### 3. Build and Publish
```bash
pnpm release
```

## Before Commit

1. `pnpm lint` - Lint passes
2. `pnpm build` - Build succeeds
3. `pnpm test` (in relevant package) - Tests pass

## Important Notes
- Never use `as any`, `@ts-ignore`, `@ts-expect-error`
- Must use `import type` for type imports
- No empty catch blocks
