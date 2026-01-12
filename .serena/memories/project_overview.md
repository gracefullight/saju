# ts-workspace Project Overview

## Purpose
Gracefullight's TypeScript package monorepo. A workspace for managing and publishing multiple npm packages.

## Tech Stack
- **Runtime**: Node.js 24, pnpm 10
- **Language**: TypeScript
- **Linter/Formatter**: Biome
- **Versioning**: Changesets
- **Testing**: Vitest
- **Build**: tsc, tsup (varies by package)

## Monorepo Structure
```
ts-workspace/
├── packages/
│   ├── saju/            # Four Pillars calculator library (@gracefullight/saju)
│   └── validate-branch/ # Git branch name validation tool (@gracefullight/validate-branch)
├── apps/
│   └── saju-example/    # Next.js saju example app (private)
├── .changeset/          # Changesets config
├── biome.json           # Biome linter/formatter config
├── pnpm-workspace.yaml  # pnpm workspace config
└── package.json         # Root package.json
```

## Package Descriptions

### @gracefullight/saju
- Four Pillars (四柱命理) calculator TypeScript library
- Supports Luxon, date-fns adapter pattern
- Features: Ten Gods, strength analysis, relations (clashes/combines), major luck, yearly luck, yong-shen analysis
- Tested with Vitest (91%+ coverage)

### @gracefullight/validate-branch
- Git branch name validation CLI tool
- Custom regexp pattern support
- Built-in presets: gitflow, jira

### @gracefullight/saju-example (private)
- Next.js 16 based saju example app
- Uses Tailwind CSS 4, React 19
