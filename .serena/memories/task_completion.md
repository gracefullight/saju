# 작업 완료 시 체크리스트

## 코드 변경 후

### 1. 린트 검사
```bash
pnpm lint
```
오류가 있으면 `pnpm lint:fix`로 자동 수정

### 2. 타입 검사
해당 패키지에서:
```bash
pnpm build
```
빌드 오류가 없어야 함

### 3. 테스트 실행
해당 패키지에서:
```bash
pnpm test
```
모든 테스트 통과 필요

## 배포 준비 시

### 1. Changeset 생성
```bash
pnpm changeset
```
- 변경 유형 선택 (major/minor/patch)
- 변경 내용 설명 작성

### 2. 버전 업데이트
```bash
pnpm version
```

### 3. 빌드 및 배포
```bash
pnpm release
```

## 커밋 전

1. `pnpm lint` - 린트 통과
2. `pnpm build` - 빌드 성공
3. `pnpm test` (해당 패키지) - 테스트 통과

## 주의사항
- `as any`, `@ts-ignore`, `@ts-expect-error` 사용 금지
- 타입 import 시 `import type` 사용 필수
- 빈 catch 블록 금지
