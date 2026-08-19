"use client";

import { useState } from "react";

const reportTabs = [
  { id: "nature", label: "원래왜그래" },
  { id: "reason", label: "그래서그랬구나" },
  { id: "today", label: "오늘왜그래" },
  { id: "note", label: "오늘도그랬다" },
];

const animals = [
  { name: "카피바라", alias: "급한 건 엄마아빠뿐인", image: "/characters/capybara.png" },
  { name: "호랑이", alias: "준비운동만 벌써 세 번째인", image: "/characters/tiger.png" },
  { name: "다람쥐", alias: "질문 주머니가 꽉 찬", image: "/characters/squirrel.png" },
  { name: "아기 여우", alias: "조용하다 싶으면 실험 중인", image: "/characters/fox.png" },
  { name: "수달", alias: "신나는 건 내일까지 못 미루는", image: "/characters/otter.png" },
  { name: "레서판다", alias: "익숙해지면 매력 폭발하는", image: "/characters/red-panda.png" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("nature");
  const [started, setStarted] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [note, setNote] = useState("");
  return (
    <main className="theme-earth">
      <header className="topbar">
        <a className="logo" href="#top" aria-label="오늘왜그래 홈">오늘왜그래 <span>ㅎㅎ</span></a>
        <nav aria-label="주요 메뉴">
          <a href="#sample">미리보기</a><a href="#how">이용 방법</a>
          <button className="nav-cta" onClick={() => setStarted(true)}>우리 아이 알아보기</button>
        </nav>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">도무지 알 수 없는 내 아이를 이해하는 가장 재미있는 방법</p>
        <h1>오늘 왜 그래?<br /><em>알고 보니 그럴 만했네.</em></h1>
        <p className="hero-copy">타고난 기질부터 오늘의 행동까지, 아이만의 이유를 발견하고 부모에게는 바로 써먹을 작은 작전을 건네요.</p>
        <div className="hero-actions"><button className="primary" onClick={() => setStarted(true)}>무료로 시작하기</button><a className="secondary" href="#sample">샘플 먼저 보기</a></div>
        <div className="character-teaser">
          <p>우리 집에는 어떤 작은 동물이 살고 있을까요?</p>
          <div className="animal-strip" aria-label="아이 캐릭터 예시">{animals.map((animal, index) => <article key={animal.name} className={`animal a${index + 1}`}>
            <img src={animal.image} alt={`${animal.alias} ${animal.name} 캐릭터`} />
            <div><small>{animal.alias}</small><strong>{animal.name}</strong></div>
          </article>)}</div>
        </div>
      </section>

      {started && <section className="start-panel" aria-label="아이 정보 입력">
        <div><p className="section-kicker">START</p><h2>우리 아이는 왜 그럴까요?</h2><p>현재는 내용 검토용 화면입니다. 아이 정보는 저장하지 않아요.</p></div>
        <form onSubmit={(event) => { event.preventDefault(); document.querySelector("#sample")?.scrollIntoView({ behavior: "smooth" }); }}>
          <label>아이 애칭<input defaultValue="별이" aria-label="아이 애칭" /></label>
          <label>생년월일<input type="date" defaultValue="2022-05-18" aria-label="생년월일" /></label>
          <label>태어난 시간<input type="time" defaultValue="09:20" aria-label="태어난 시간" /></label>
          <label>출생 도시<input defaultValue="서울" aria-label="출생 도시" /></label>
          <button className="primary" type="submit">샘플 결과 보기</button>
        </form>
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
        <div className="section-heading"><p className="section-kicker">SAMPLE REPORT</p><h2>별이는 오늘 왜 그럴까?</h2><p>2022. 5. 18 · 오전 9:20 · 서울 출생 · 샘플 결과</p></div>
        <div className="report-shell">
          <div className="report-tabs" role="tablist" aria-label="아이 리포트">{reportTabs.map((tab) => <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}</div>
          {activeTab === "nature" && <NaturePanel />}{activeTab === "reason" && <ReasonPanel />}{activeTab === "today" && <TodayPanel />}
          {activeTab === "note" && <section className="report-panel note-panel">
            <p className="report-label">부모의 관찰 기록</p><h3>오늘도 그랬다</h3><p>사주 해석보다 실제로 관찰한 별이의 모습을 더 소중하게 쌓아가요.</p>
            <div className="reaction-row" aria-label="오늘의 반응">{["아주 좋아했어요", "처음엔 망설였어요", "예상보다 집중했어요", "오늘은 관심 없어요"].map((item) => <button key={item} className={reaction === item ? "selected" : ""} onClick={() => setReaction(item)}>{item}</button>)}</div>
            <label className="note-label">오늘의 한 줄<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="예: 처음에는 안 한다더니 마지막까지 혼자 남아서 완성했다." /></label>
            <button className="primary" onClick={() => setNote(note || "오늘 블록을 색깔보다 크기로 먼저 나누었다.")}>이 기기에 임시 기록하기</button>{note && <p className="saved-note">“{note}”</p>}
          </section>}
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
