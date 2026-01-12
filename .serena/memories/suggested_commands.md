# 개발 명령어

## 환경 설정
```bash
# mise로 Node.js 24, pnpm 10 설치
mise install

# 의존성 설치
pnpm install
```

## 루트 레벨 명령어
```bash
# 전체 빌드
pnpm build

# 전체 린트 검사
pnpm lint

# 린트 자동 수정
pnpm lint:fix

# 포맷팅
pnpm format

# Changeset 생성
pnpm changeset

# 버전 업데이트
pnpm version

# 패키지 배포
pnpm release
```

## 패키지별 명령어

### packages/saju
```bash
cd packages/saju

pnpm build       # tsc + tsc-alias로 빌드
pnpm dev         # tsx로 개발 실행
pnpm test        # vitest 테스트
pnpm test:ui     # vitest UI 모드
pnpm test:coverage  # 커버리지 리포트
pnpm lint        # biome 린트
pnpm lint:fix    # biome 린트 자동 수정
pnpm format      # biome 포맷
```

### packages/validate-branch
```bash
cd packages/validate-branch

pnpm build       # tsup으로 빌드
pnpm dev         # tsx로 CLI 개발 실행
pnpm test        # vitest 테스트
pnpm lint        # biome 린트
pnpm lint:fix    # biome 린트 자동 수정
pnpm format      # biome 포맷
```

### apps/saju-example
```bash
cd apps/saju-example

pnpm dev         # Next.js 개발 서버 (Turbopack)
pnpm build       # Next.js 빌드
pnpm start       # 프로덕션 서버
pnpm lint        # Next.js 린트
```

## Git 명령어
```bash
git status
git diff
git log --oneline -10
git add .
git commit -m "message"
git push
```
