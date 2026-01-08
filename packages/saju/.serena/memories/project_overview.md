# Project Overview
This is a TypeScript project for calculating Saju (Four Pillars) and related astrological data.
It is a monorepo package located in `packages/saju`.
It uses `vitest` for testing and `biome` for linting/formatting.

# Tech Stack
- Language: TypeScript
- Testing: Vitest
- Linting: Biome
- Date Handling: luxon, date-fns adapters
- Calendar: lunar-javascript

# Structure
Proprietary logic is in `src/core`.
Adapters in `src/adapters`.
Tests in `src/__tests__`.