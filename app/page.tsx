"use client";

import { FormEvent, useRef, useState } from "react";

const animals = [
  { name: "카피바라", alias: "급한 건 엄마아빠뿐인", image: "/characters/capybara.png" },
  { name: "호랑이", alias: "준비운동만 벌써 세 번째인", image: "/characters/tiger.png" },
  { name: "다람쥐", alias: "질문 주머니가 꽉 찬", image: "/characters/squirrel.png" },
  { name: "아기 여우", alias: "조용하다 싶으면 실험 중인", image: "/characters/fox.png" },
  { name: "수달", alias: "신나는 건 내일까지 못 미루는", image: "/characters/otter.png" },
  { name: "레서판다", alias: "익숙해지면 매력 폭발하는", image: "/characters/red-panda.png" },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<{ nickname: string; animal: typeof animals[number] } | null>(null);
  const startRef = useRef<HTMLElement>(null);

  const openStart = () => {
    setStarted(true);
    window.setTimeout(() => startRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const birthDate = String(data.get("birthDate") || "");
    const seed = birthDate.replaceAll("-", "").split("").reduce((sum, number) => sum + Number(number), 0);
    setResult({ nickname: String(data.get("nickname") || "아이"), animal: animals[seed % animals.length] });
    window.setTimeout(() => document.querySelector("#animal-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };
  return (
    <main className="theme-earth">
      <header className="topbar">
        <a className="logo" href="#top" aria-label="오늘왜그래 홈">오늘왜그래 <span>ㅎㅎ</span></a>
        <nav aria-label="주요 메뉴">
          <a href="#sample">미리보기</a><a href="#how">이용 방법</a>
          <button className="nav-cta" onClick={openStart}>우리 아이 알아보기</button>
        </nav>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">도무지 알 수 없는 내 아이를 이해하는 가장 재미있는 방법</p>
        <h1>오늘 왜 그래?<br /><em>알고 보니 그럴 만했네.</em></h1>
        <p className="hero-copy">타고난 기질부터 오늘의 행동까지, 아이만의 이유를 발견하고 부모에게는 바로 써먹을 작은 작전을 건네요.</p>
        <div className="hero-actions"><button className="primary" onClick={openStart}>내 아이 알아보기</button><a className="secondary" href="#sample">샘플 먼저 보기</a></div>
        <p className="hero-footnote">생년월일과 태어난 시간을 입력하면 아이결 캐릭터와 리포트를 만날 수 있어요.</p>
      </section>

      {started && <section className="start-panel" ref={startRef} aria-label="아이 정보 입력">
        <div><p className="section-kicker">MY LITTLE REPORT</p><h2>내 아이 알아보기</h2><p>입력한 정보는 저장하지 않아요. 지금은 캐릭터를 만나는 화면 흐름을 테스트할 수 있어요.</p></div>
        <form onSubmit={handleSubmit}>
          <label>아이 애칭<input name="nickname" defaultValue="별이" aria-label="아이 애칭" required /></label>
          <label>생년월일<input name="birthDate" type="date" defaultValue="2024-08-30" aria-label="생년월일" required /></label>
          <label>태어난 시간<input name="birthTime" type="time" defaultValue="12:41" aria-label="태어난 시간" required /></label>
          <label>출생 도시<input name="birthCity" defaultValue="서울" aria-label="출생 도시" required /></label>
          <button className="primary" type="submit">우리 아이 동물 만나기</button>
        </form>
        {result && <article className="animal-result" id="animal-result" aria-live="polite">
          <div className="result-art"><img src={result.animal.image} alt={`${result.animal.name} 캐릭터`} /></div>
          <div><p className="section-kicker">화면 흐름 테스트 결과</p><h3>{result.nickname}는<br /><mark>{result.animal.alias} {result.animal.name}</mark></h3><p>아직 만세력 계산 모듈을 연결하기 전이라 동물은 생년월일을 이용한 임시 규칙으로 보여드려요. 실제 결과는 검증된 원국 계산값을 바탕으로 정해집니다.</p><a href="#sample">샘플 리포트 이어서 보기 ↓</a></div>
        </article>}
      </section>}

      <section className="how" id="how">
        <div className="section-heading"><p className="section-kicker">HOW IT WORKS</p><h2>답답함이 이해가 되는 세 단계</h2></div>
        <ol>
          <li><b>1</b><div><strong>원래왜그래</strong><p>출생 정보를 바탕으로 타고난 기질과 세상을 만나는 방식을 살펴봐요.</p></div></li>
          <li><b>2</b><div><strong>그래서그랬구나</strong><p>이해되지 않던 행동을 아이의 속도와 감정 언어로 다시 풀어봐요.</p></div></li>
          <li><b>3</b><div><strong>오늘의 작전</strong><p>오늘 바로 해볼 놀이와 한마디를 가볍게 챙겨가요.</p></div></li>
        </ol>
      </section>

      <section className="sample" id="sample">
        <div className="section-heading"><p className="section-kicker">SAMPLE REPORT</p><h2>별이는 오늘 왜 그럴까?</h2><p>2024. 8. 30 · 오후 12:41 · 서울 출생 · 샘플 결과</p></div>
        <div className="report-shell">
          <nav className="report-index" aria-label="샘플 리포트 차례"><a href="#nature-report">01 원래왜그래</a><a href="#reason-report">02 그래서그랬구나</a><a href="#today-report">03 오늘왜그래</a></nav>
          <div className="report-flow"><div id="nature-report"><NaturePanel /></div><div className="report-divider"><span>02</span><p>행동에는 아이만의 이유가 있어요</p></div><div id="reason-report"><ReasonPanel /></div><div className="report-divider"><span>03</span><p>이해했다면, 오늘은 가볍게 이렇게</p></div><div id="today-report"><TodayPanel /></div></div>
        </div>
      </section>

      <section className="promise"><p className="section-kicker">OUR PROMISE</p><h2>아이를 정해진 운명에 가두지 않아요.</h2><p>오늘왜그래는 명리학을 아이를 이해하는 하나의 문화적 관점으로 사용합니다. 성격·진로·건강을 단정하지 않고, 부모의 실제 관찰과 아이의 성장 가능성을 가장 중요하게 생각해요.</p></section>
      <footer><a className="logo" href="#top">오늘왜그래 <span>ㅎㅎ</span></a><p>오늘도 조금 더 아이를 이해했나요?</p><small>이 서비스는 의료·심리·교육 진단을 대신하지 않습니다.</small></footer>
    </main>
  );
}

function NaturePanel() { return <section className="report-panel">
  <div className="character-card"><div className="character-face" aria-hidden="true"><span>虎</span></div><div><p className="report-label">별이의 아이결 캐릭터</p><h3>준비운동만 벌써<br />세 번째인 호랑이</h3><p>큰 에너지를 안에 품고 있지만, 새로운 상황에서는 충분히 살펴보고 자기 마음의 출발 신호를 기다리는 아이예요.</p></div></div>
  <div className="card-grid three"><article><span>반짝이는 강점</span><h4>관찰력</h4><p>작은 변화를 발견하고 마음에 든 것은 오래 들여다봐요.</p></article><article><span>반짝이는 강점</span><h4>몰입</h4><p>준비가 끝나면 호랑이처럼 힘차게 자기 세계로 뛰어들어요.</p></article><article><span>기억해 주세요</span><h4>자기 속도</h4><p>느린 시작은 의욕이 없다는 뜻이 아니라 준비하는 방식일 수 있어요.</p></article></div>
  </section>; }

function ReasonPanel() { return <section className="report-panel"><p className="report-label">행동 뒤에 숨은 아이만의 이유</p><h3>그래서 그랬구나</h3><div className="reason-list">
  <article><b>“놀이터에 가서 왜 바로 안 놀지?”</b><p>낯선 상황의 사람과 규칙을 먼저 살펴보고 있을 수 있어요. 구경하는 시간도 별이에게는 참여의 일부예요.</p></article>
  <article><b>“끝낼 시간이면 왜 갑자기 화를 내지?”</b><p>몰입한 마음이 현실의 전환 속도를 따라가지 못한 순간일 수 있어요. 끝나기 5분 전에 미리 알려주세요.</p></article>
  <article className="survival"><span>부모의 생존 한마디</span><blockquote>“먼저 보고 있어도 괜찮아. 준비되면 네가 출발 신호를 알려줘.”</blockquote></article>
  </div></section>; }

function TodayPanel() { return <section className="report-panel"><p className="report-label">매일 바뀌는 가벼운 보너스</p><h3>오늘왜그래</h3><div className="daily-grid">
  <article className="mission"><span>오늘의 작전</span><h4>오늘의 순서 대장을 맡겨주세요</h4><p>옷 입기, 양치하기, 가방 챙기기 중 무엇을 먼저 할지 별이가 정하게 해주세요.</p><b>“어떤 것부터 시작할래?”</b></article>
  <article className="color-card"><span>오늘의 기분색</span><div className="color-dot" /><h4>새싹 연두</h4><p>집 안에서 연두색 물건을 세 개 찾아보세요.</p></article>
  <article><span>오늘의 냠냠 작전</span><h4>바삭한 소리 탐정</h4><p>먹지 않아도 괜찮아요. 오늘 가장 재미있는 음식 소리를 함께 찾아봐요.</p></article>
  <article><span>잠들기 전 질문</span><h4>“오늘 네 마음속 호랑이는 언제 깨어났어?”</h4></article>
  </div></section>; }
