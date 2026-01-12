# ts-workspace 프로젝트 개요

## 프로젝트 목적
Gracefullight의 TypeScript 패키지 모노레포. 여러 npm 패키지를 관리하고 배포하기 위한 워크스페이스.

## 기술 스택
- **런타임**: Node.js 24, pnpm 10
- **언어**: TypeScript
- **린터/포맷터**: Biome
- **버전 관리**: Changesets
- **테스트**: Vitest
- **빌드**: tsc, tsup (패키지별 상이)

## 모노레포 구조
```
ts-workspace/
├── packages/
│   ├── saju/           # 사주명리 계산 라이브러리 (@gracefullight/saju)
│   └── validate-branch/ # Git 브랜치 이름 유효성 검사 도구 (@gracefullight/validate-branch)
├── apps/
│   └── saju-example/    # Next.js 사주 예제 앱 (비공개)
├── .changeset/          # Changesets 설정
├── biome.json           # Biome 린터/포맷터 설정
├── pnpm-workspace.yaml  # pnpm 워크스페이스 설정
└── package.json         # 루트 package.json
```

## 패키지 설명

### @gracefullight/saju
- 사주명리(四柱命理) 계산 TypeScript 라이브러리
- Luxon, date-fns 어댑터 패턴 지원
- 십신, 신강약, 합충형파해, 대운, 세운, 용신 분석 기능
- Vitest로 테스트 (91%+ 커버리지)

### @gracefullight/validate-branch
- Git 브랜치 이름 유효성 검사 CLI 도구
- 커스텀 정규식 패턴 지원
- gitflow, jira 프리셋 제공

### @gracefullight/saju-example (비공개)
- Next.js 16 기반 사주 예제 앱
- Tailwind CSS 4, React 19 사용
