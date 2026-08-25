# 카카오톡 공유 설정

오늘왜그래의 결과 카드 공유는 카카오 JavaScript SDK의 기본 피드 템플릿을 사용한다. 공유 카드에는 아이의 애칭, 마음속 꼬마동물 별칭, 해당 동물 이미지와 서비스 이동 버튼만 포함한다. 생년월일·출생시간·출생 도시는 포함하지 않는다.

## 운영 설정

1. 카카오디벨로퍼스에서 애플리케이션을 만들거나 기존 앱을 선택한다.
2. JavaScript SDK 도메인과 제품 링크 관리의 웹 도메인에 `https://oneul-wae.vercel.app`을 등록한다.
3. 앱의 JavaScript 키를 Vercel 환경 변수 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`로 등록한다.
4. Production 환경을 다시 배포한다.

키가 없거나 SDK 초기화에 실패한 환경에서는 Web Share API를 열어 사용자가 카카오톡을 선택할 수 있게 하고, Web Share API도 없는 브라우저에서는 공유 문구와 링크를 복사한다.
