# Code Style and Conventions

## Biome Configuration (biome.json)

### Formatter
- Indent: 2 spaces
- Line width: 100 characters
- Quote style: double quotes (`"`)
- Trailing commas: all

### Linter Rules
- Recommended rules enabled
- `noExcessiveCognitiveComplexity`: warn
- `useImportType`: error (must use `import type` for type imports)
- `useExportType`: error (must use `export type` for type exports)

### Assist
- `organizeImports`: on (auto-sort imports)

## TypeScript Conventions
- ESM modules (`"type": "module"`)
- Provide type definitions (`.d.ts`)
- Use `type` keyword for type imports/exports

## Package Structure
```
packages/{package-name}/
├── src/
│   ├── index.ts        # Public API
│   ├── core/           # Core logic
│   ├── types/          # Type definitions
│   └── __tests__/      # Tests
├── dist/               # Build output
├── package.json
├── tsconfig.json
└── README.md
```

## Naming Conventions
- File names: kebab-case (`four-pillars.ts`)
- Classes/Types: PascalCase (`DateAdapter`)
- Functions/Variables: camelCase (`getFourPillars`)
- Constants: SCREAMING_SNAKE_CASE (`STANDARD_PRESET`)

## Testing Conventions
- Use Vitest
- Test files: `__tests__/` directory or `.test.ts` suffix
- Use describe/it pattern

## Documentation
- README.md: Korean (README.en.md: English)
- JSDoc comments recommended
