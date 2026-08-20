# 오늘왜그래 ㅎㅎ

아이의 양력 생년월일과 출생시간을 규칙 기반 만세력으로 계산하고,
그 결과를 마음속 꼬마동물과 쉬운 육아 리포트로 보여주는 서비스입니다.

## 기술 구성

- Next.js App Router
- React
- TypeScript
- `lunar-javascript` 기반 규칙 계산
- Vercel 배포

생성형 AI는 사주 원국을 계산하지 않습니다. 원국은 규칙 기반 모듈이 만들고,
서비스 문구는 계산 결과를 친근한 표현으로 번역하는 역할만 담당합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 확인

```bash
npm run build
npm test
npm run test:manseryeok
```

Vercel에서는 GitHub 저장소를 연결하면 Next.js 프로젝트로 자동 인식됩니다.
