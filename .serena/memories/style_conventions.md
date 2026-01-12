# 코드 스타일 및 컨벤션

## Biome 설정 (biome.json)

### 포맷터
- 들여쓰기: 스페이스 2칸
- 줄 너비: 100자
- 따옴표: 더블 쿼트 (`"`)
- 트레일링 콤마: 모든 곳에 사용 (`all`)

### 린터 규칙
- 권장 규칙 활성화
- `noExcessiveCognitiveComplexity`: warn
- `useImportType`: error (타입 import 시 `import type` 사용 필수)
- `useExportType`: error (타입 export 시 `export type` 사용 필수)

### Assist
- `organizeImports`: on (import 자동 정렬)

## TypeScript 컨벤션
- ESM 모듈 사용 (`"type": "module"`)
- 타입 정의 제공 (`.d.ts`)
- 타입 import/export 시 `type` 키워드 사용

## 패키지 구조
```
packages/{package-name}/
├── src/
│   ├── index.ts        # 공개 API
│   ├── core/           # 핵심 로직
│   ├── types/          # 타입 정의
│   └── __tests__/      # 테스트
├── dist/               # 빌드 출력
├── package.json
├── tsconfig.json
└── README.md
```

## 네이밍 컨벤션
- 파일명: kebab-case (`four-pillars.ts`)
- 클래스/타입: PascalCase (`DateAdapter`)
- 함수/변수: camelCase (`getFourPillars`)
- 상수: SCREAMING_SNAKE_CASE (`STANDARD_PRESET`)

## 테스트 컨벤션
- Vitest 사용
- 테스트 파일: `__tests__/` 디렉토리 또는 `.test.ts` 접미사
- describe/it 패턴 사용

## 문서화
- README.md: 한국어 (README.en.md: 영어)
- JSDoc 주석 권장
