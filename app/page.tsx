"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { calculateManseryeok, normalizeBirthInput, type ManseryeokResult } from "../lib/manseryeok";
import { selectLittleAnimal, type CharacterRuleResult } from "../lib/character-rules";
import { animalProfiles } from "../lib/animal-profiles";

const animals = [
  { name: "카피바라", alias: animalProfiles.카피바라.alias, image: "/characters/capybara-v3.png", sealColor: "#A36637B3" },
  { name: "호랑이", alias: animalProfiles.호랑이.alias, image: "/characters/tiger-v3.png", sealColor: "#EE5426B3" },
  { name: "다람쥐", alias: animalProfiles.다람쥐.alias, image: "/characters/squirrel-v3.png", sealColor: "#D99A09B3" },
  { name: "아기 여우", alias: animalProfiles["아기 여우"].alias, image: "/characters/fox-v3.png", sealColor: "#F06A9DB3" },
  { name: "수달", alias: animalProfiles.수달.alias, image: "/characters/otter-v3.png", sealColor: "#368F8BB3" },
  { name: "레서판다", alias: animalProfiles.레서판다.alias, image: "/characters/red-panda-v3.png", sealColor: "#8E3D2CB3" },
  { name: "토끼", alias: animalProfiles.토끼.alias, image: "/characters/rabbit-v3.png", sealColor: "#F798BDB3" },
  { name: "쿼카", alias: animalProfiles.쿼카.alias, image: "/characters/quokka-v3.png", sealColor: "#FFC038B3" },
  { name: "펭귄", alias: animalProfiles.펭귄.alias, image: "/characters/penguin-v3.png", sealColor: "#387CAAB3" },
  { name: "고슴도치", alias: animalProfiles.고슴도치.alias, image: "/characters/hedgehog-v3.png", sealColor: "#A36637B3" },
  { name: "미어캣", alias: animalProfiles.미어캣.alias, image: "/characters/meerkat-v3.png", sealColor: "#D99A09B3" },
  { name: "고양이", alias: animalProfiles.고양이.alias, image: "/characters/cat-v3.png", sealColor: "#8E6AAEB3" },
];

type ReportResult = { nickname: string; animal: typeof animals[number]; chart: ManseryeokResult; character: CharacterRuleResult };

const hanjaReadings: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
};

const readPillar = (stem: string, branch: string) => `${hanjaReadings[stem]}${hanjaReadings[branch]}`;

const sampleChart = calculateManseryeok({ calendarType: "solar", birthDate: "2025-01-01", birthTime: "11:00", birthCity: "서울", timeZone: "Asia/Seoul" });
const sampleCharacter = selectLittleAnimal(sampleChart);
const sampleReport: ReportResult = { nickname: "별이", chart: sampleChart, character: sampleCharacter, animal: animals.find((animal) => animal.name === sampleCharacter.animalName)! };

function formatBirth(result: ReportResult) {
  const [year, month, day] = result.chart.input.birthDate.split("-").map(Number);
  const time = result.chart.input.birthTime;
  if (!time) return `${year}. ${month}. ${day} · 태어난 시간 모름 · ${result.chart.input.birthCity} 출생`;
  const [hour, minute] = time.split(":").map(Number);
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 || 12;
  return `${year}. ${month}. ${day} · ${period} ${displayHour}:${String(minute).padStart(2, "0")} · ${result.chart.input.birthCity} 출생`;
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [shareNotice, setShareNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const startRef = useRef<HTMLElement>(null);
  const report = result ?? sampleReport;

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const openStart = () => {
    setStarted(true);
    window.setTimeout(() => startRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const birthInput = normalizeBirthInput(data);
      const chart = calculateManseryeok(birthInput);
      const character = selectLittleAnimal(chart);
      const animal = animals.find((candidate) => candidate.name === character.animalName);
      if (!animal) throw new Error("꼬마동물 규칙을 확인해 주세요.");
      setResult({ nickname: String(data.get("nickname") || "아이"), animal, chart, character });
      setFormError("");
    } catch (error) {
      setResult(null);
      setFormError(error instanceof Error ? error.message : "입력 정보를 확인해 주세요.");
      return;
    }
    window.setTimeout(() => document.querySelector("#animal-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };

  const handleShare = async () => {
    if (!result) return;
    const url = `${window.location.origin}${window.location.pathname}#sample`;
    const text = `${result.nickname}의 마음속 꼬마동물은 ‘${result.animal.alias} ${result.animal.name}’! 오늘왜그래 ㅎㅎ에서 확인해보세요.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${result.nickname}의 마음속 꼬마동물`, text, url });
        setShareNotice("공유할 곳을 선택했어요.");
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareNotice("공유 문구와 링크를 복사했어요.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareNotice("공유하지 못했어요. 잠시 후 다시 눌러주세요.");
    }
  };
  return (
    <main className="theme-earth">
      <header className="topbar">
        <a className="logo" href="#top" aria-label="오늘왜그래 홈">오늘왜그래 <span>ㅎㅎ</span></a>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          <a href="#sample">미리보기</a><a href="#how">이용 방법</a>
          <button className="nav-cta" onClick={openStart}>우리 아이 알아보기</button>
        </nav>
        <div className="mobile-nav">
          <button className="nav-cta" onClick={() => { openStart(); setMenuOpen(false); }}>아이 알아보기</button>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"} onClick={() => setMenuOpen((open) => !open)}>
            <span /><span /><span />
          </button>
          {menuOpen && <nav className="mobile-menu" id="mobile-menu" aria-label="모바일 메뉴">
            <a href="#sample" onClick={() => setMenuOpen(false)}><span>01</span> 미리보기</a>
            <a href="#how" onClick={() => setMenuOpen(false)}><span>02</span> 이용 방법</a>
            <button type="button" onClick={() => { openStart(); setMenuOpen(false); }}><span>03</span> 우리 아이 알아보기</button>
          </nav>}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-paper">
          <p className="eyebrow">도무지 알 수 없는 내 아이를 이해하는 가장 재미있는 방법</p>
          <h1>오늘 왜 그래?<br /><em>알고 보니 그럴 만했네.</em></h1>
          <p className="hero-copy">타고난 기질부터 오늘의 행동까지, 아이만의 이유를 발견하고 부모에게는 바로 써먹을 작은 작전을 건네요.</p>
          <div className="hero-actions"><button className="primary" onClick={openStart}>내 아이 알아보기</button><a className="secondary" href="#sample">샘플 먼저 보기</a></div>
          <p className="hero-footnote">생년월일과 태어난 시간을 입력하면 아이의 <span className="animal-word">마음속 꼬마동물</span>과 리포트를 만날 수 있어요.</p>
        </div>
      </section>

      {started && <section className="start-panel" ref={startRef} aria-label="아이 정보 입력">
        <div><p className="section-kicker">MY LITTLE REPORT</p><h2>내 아이 알아보기</h2><p>입력한 정보는 저장하지 않아요.<br />계산된 원국에 맞춰 아이만의 리포트가 바로 바뀌어요.</p></div>
        <form onSubmit={handleSubmit}>
          <label>아이 애칭<input name="nickname" defaultValue="별이" aria-label="아이 애칭" required /></label>
          <label>양력 생년월일<input name="birthDate" type="date" defaultValue="2025-01-01" aria-label="양력 생년월일" required /><small>현재는 양력 생일만 입력할 수 있어요.</small></label>
          <label>태어난 시간<input name="birthTime" type="time" defaultValue="11:00" aria-label="태어난 시간" required /></label>
          <label>출생 도시<input name="birthCity" defaultValue="서울" aria-label="출생 도시" required /></label>
          <button className="primary" type="submit">마음속 꼬마동물 누구?</button>
        </form>
        {formError && <p className="form-notice" role="status">{formError}</p>}
        {result && <article className="animal-result" id="animal-result" aria-live="polite">
          <div className="result-art"><img src={result.animal.image} alt={`${result.animal.alias} ${result.animal.name} 캐릭터`} /></div>
          <div className="result-copy">
            <p className="section-kicker">{result.nickname}의 마음속 꼬마동물</p>
            <h3>{result.nickname}는<br /><mark>{result.animal.alias} {result.animal.name}</mark></h3>
            <div className="pillars" aria-label="계산된 사주 네 기둥">
              <div><span>태어난 해 · 년주</span><b>{result.chart.pillars.year.stem}{result.chart.pillars.year.branch}</b><small>{readPillar(result.chart.pillars.year.stem, result.chart.pillars.year.branch)}</small><em>물려받은 바깥 배경</em></div>
              <div><span>태어난 달 · 월주</span><b>{result.chart.pillars.month.stem}{result.chart.pillars.month.branch}</b><small>{readPillar(result.chart.pillars.month.stem, result.chart.pillars.month.branch)}</small><em>자라나는 계절과 환경</em></div>
              <div><span>태어난 날 · 일주</span><b>{result.chart.pillars.day.stem}{result.chart.pillars.day.branch}</b><small>{readPillar(result.chart.pillars.day.stem, result.chart.pillars.day.branch)}</small><em>아이 자신을 보여주는 기둥</em></div>
              <div><span>태어난 시간 · 시주</span><b>{result.chart.pillars.hour ? `${result.chart.pillars.hour.stem}${result.chart.pillars.hour.branch}` : "—"}</b><small>{result.chart.pillars.hour ? readPillar(result.chart.pillars.hour.stem, result.chart.pillars.hour.branch) : "시간 모름"}</small><em>마음속 관심과 가능성</em></div>
            </div>
            <p>{result.nickname} 자신을 나타내는 중심 글자는 <b>{result.character.dayMaster}({hanjaReadings[result.character.dayMaster]})</b>이에요.<br />‘{result.character.basis}’을 오늘왜그래에서는 {result.animal.name}로 표현했어요.</p>
            <p className="character-disclaimer">꼬마동물은 사주에 원래 존재하는 분류가 아니라, 아이의 기질을 친근하게 이해하도록 만든 오늘왜그래만의 표현이에요.</p>
            <details className="calculation-note"><summary>이 결과는 어떻게 나왔나요?</summary><p>양력 생년월일과 출생시간을 규칙 기반 만세력으로 계산했어요.<br />한국 표준시 · 절입 기준 · 0시 일주 변경 기준을 사용합니다.</p></details>
            <div className="result-actions"><a href="#sample">샘플 리포트 이어서 보기 ↓</a><button type="button" onClick={handleShare}>결과 공유하기</button></div>
            <small>생년월일·출생시간·출생 도시는 공유되지 않아요.</small>{shareNotice && <p className="share-notice" role="status">{shareNotice}</p>}
          </div>
        </article>}
      </section>}

      <section className="how" id="how">
        <div className="section-heading"><p className="section-kicker">HOW IT WORKS</p><h2>답답함이 이해가 되는 세 단계</h2></div>
        <ol>
          <li><b>1</b><div><strong>오늘왜그래</strong><p>오늘 아이에게 잘 맞는 한마디와 놀이를 가장 먼저 확인해요.</p></div></li>
          <li><b>2</b><div><strong>원래왜그래</strong><p>출생 정보를 바탕으로 타고난 기질과 세상을 만나는 방식을 살펴봐요.</p></div></li>
          <li><b>3</b><div><strong>그래서그랬구나</strong><p>이해되지 않던 행동을 아이의 속도와 감정 언어로 다시 풀어봐요.</p></div></li>
        </ol>
      </section>

      <section className="sample" id="sample">
        <div className="sample-paper">
          <div className="section-heading"><p className="section-kicker">{result ? "MY LITTLE REPORT" : "SAMPLE REPORT"}</p><h2>{report.nickname}는 오늘 왜 그럴까?</h2><p>{formatBirth(report)}{result ? "" : " · 샘플 결과"}</p></div>
          <div className="report-shell">
            <nav className="report-index" aria-label="샘플 리포트 차례"><a href="#today-report">01 오늘왜그래</a><a href="#nature-report">02 원래왜그래</a><a href="#reason-report">03 그래서그랬구나</a></nav>
            <div className="report-flow"><div id="today-report"><TodayPanel report={report} /></div><div className="report-divider"><span>02</span><p>오늘을 봤다면, 타고난 마음도 들여다봐요</p></div><div id="nature-report"><NaturePanel report={report} /></div><div className="report-divider"><span>03</span><p>행동에는 아이만의 이유가 있어요</p></div><div id="reason-report"><ReasonPanel report={report} /></div></div>
          </div>
        </div>
      </section>

      <section className="promise"><p className="section-kicker">OUR PROMISE</p><h2>아이를 정해진 운명에 가두지 않아요.</h2><p>오늘왜그래는 명리학을 아이를 이해하는 하나의 문화적 관점으로 사용합니다.<br />성격·진로·건강을 단정하지 않고, 부모의 실제 관찰과 아이의 성장 가능성을 가장 중요하게 생각해요.</p></section>
      <footer>
        <a className="logo" href="#top">오늘왜그래 <span>ㅎㅎ</span></a><p>오늘도 조금 더 아이를 이해했나요?</p><small>이 서비스는 의료·심리·교육 진단을 대신하지 않습니다.</small>
        <details className="privacy-policy">
          <summary>개인정보 수집·이용 안내</summary>
          <div>
            <h3>아이의 정보는 필요한 만큼만 다뤄요.</h3>
            <p><b>현재 데모에서는</b> 입력한 정보를 화면 결과를 보여주는 용도로만 사용하며 서버에 저장하지 않습니다.</p>
            <dl>
              <div><dt>최소 수집 항목</dt><dd>아이 애칭, 생년월일, 출생시간, 출생 도시</dd></div>
              <div><dt>수집 목적</dt><dd>원국 계산과 마음속 꼬마동물·아이 이해 리포트 등 서비스 제공</dd></div>
              <div><dt>보관 기간</dt><dd>저장 기능 도입 시 서비스 이용 기간 동안만 보관하며, 아이 정보 삭제 또는 서비스 이용 종료 시 지체 없이 삭제</dd></div>
              <div><dt>별도 활용 없음</dt><dd>서비스 제공 외 광고·마케팅·제3자 제공 또는 AI 모델 학습 목적으로 수집하거나 활용하지 않음</dd></div>
            </dl>
            <p className="privacy-note">정식 저장 기능을 제공하기 전 수집 항목과 보유기간을 다시 안내하고 보호자의 별도 동의를 받습니다. 관계 법령에 따라 보존이 필요한 정보가 생기는 경우에는 해당 기간과 근거를 별도로 안내합니다.</p>
          </div>
        </details>
      </footer>
    </main>
  );
}

function NaturePanel({ report }: { report: ReportResult }) {
  const profile = animalProfiles[report.character.animalName];
  return <section className="report-panel">
  <div className="character-card"><div className="report-character-art"><img src={report.animal.image} alt={`${profile.alias} ${report.animal.name} 캐릭터`} /></div><div><p className="report-label">{report.nickname}의 ‘마음속 꼬마동물’</p><h3>{profile.alias}<br />{report.animal.name}</h3><p>{profile.intro}</p><span className="day-master-seal" style={{ backgroundColor: report.animal.sealColor }}>{report.character.dayMaster} · {hanjaReadings[report.character.dayMaster]}</span></div></div>
  <div className="card-grid three"><article><span>먼저 보이는 강점</span><h4>{profile.strengths[0]}</h4><p>{report.nickname}에게 자연스럽게 먼저 드러나는 힘이에요.</p></article><article><span>푹 빠질 때의 강점</span><h4>{profile.strengths[1]}</h4><p>좋아하는 순간 더욱 선명해지는 힘이에요.</p></article><article><span>기억해 주세요</span><h4>{profile.strengths[2]}</h4><p>재촉보다 관찰할 때 자기답게 자라나는 힘이에요.</p></article></div>
  </section>; }

function ReasonPanel({ report }: { report: ReportResult }) {
  const profile = animalProfiles[report.character.animalName];
  const tapeColors = ["#f8bbd0", "#ffff00", "#d5ff00", "#33ff33", "#e9ec69"];
  const tapeColor = tapeColors[new Date().getDate() % tapeColors.length];
  return <section className="report-panel"><p className="report-label">행동 뒤에 숨은 아이만의 이유</p><h3>그래서 그랬구나</h3><div className="reason-list">
  <article><b>“왜 바로 내 말대로 움직이지 않지?”</b><p>{profile.reason}<br />행동보다 아이의 준비 신호를 먼저 살펴봐주세요.</p></article>
  <article><b>“왜 바뀌는 순간에 더 힘들어하지?”</b><p>{profile.transition}<br />작은 예고가 마음의 다리가 되어줘요.</p></article>
  <article className="survival"><span style={{ backgroundColor: tapeColor }}>부모의 생존 한마디</span><blockquote>“{profile.survival}”</blockquote></article>
  </div></section>; }

function TodayPanel({ report }: { report: ReportResult }) {
  const profile = animalProfiles[report.character.animalName];
  const now = new Date();
  const today = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(now);
  const messages = ["마음이 먼저 움직일 때까지 한 박자 기다려주면 좋은 날이에요.", "작은 선택권 하나가 아이의 자신감을 크게 깨워주는 날이에요.", "익숙한 놀이에 새로운 규칙 하나를 더하면 신이 나는 날이에요.", "말보다 몸을 먼저 움직이면 마음도 술술 따라오는 날이에요.", "시작보다 마무리를 함께 축하해주면 좋은 날이에요.", "천천히 순서를 정할수록 아이의 마음이 가벼워지는 날이에요.", "잘하려는 마음보다 재미있는 마음을 응원해주면 좋은 날이에요."];
  const colors = [
    { name: "새싹 연두", hex: "#9EC244", play: "집 안에서 연두색 물건을 세 개 찾아보세요." },
    { name: "햇살 노랑", hex: "#FFC038", play: "노란 물건을 찾아 오늘의 햇살 이름을 붙여보세요." },
    { name: "구름 파랑", hex: "#6CBCE8", play: "파란색을 찾아 가장 시원한 파랑을 골라보세요." },
    { name: "복숭아 분홍", hex: "#F798BD", play: "분홍색 물건 하나를 골라 다정한 별명을 붙여보세요." },
    { name: "씩씩한 주황", hex: "#EE5426", play: "주황색을 발견할 때마다 힘나는 동작을 하나 해보세요." },
  ];
  const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  const todayColor = colors[dayNumber % colors.length];
  return <section className="report-panel"><p className="report-label">오늘 아이에게 딱 맞는 하루 힌트</p><h3>오늘왜그래</h3><div className="today-status"><b>{today}</b><p>{messages[now.getDay()]}</p></div><div className="daily-grid">
  <article className="mission"><span>오늘의 작전</span><h4>{profile.mission}</h4><p>{profile.missionBody}</p><b>“{profile.survival}”</b></article>
  <article className="color-card"><span>오늘의 짝꿍색</span><div className="color-dot" style={{ color: todayColor.hex }} aria-hidden="true" /><h4>{todayColor.name}</h4><p>{todayColor.play}</p></article>
  <article><span>오늘의 찰떡놀이</span><h4>{profile.play}</h4><p className="play-reason">{profile.playReason}</p><p>{profile.playBody}</p></article>
  <article><span>잠들기 전 질문해볼까요?</span><h4>“{profile.bedtime}”</h4><p className="prompt-reason">오늘 {report.nickname}의 마음이 움직인 순간을 편안하게 돌아보는 질문이에요.</p></article>
  </div></section>; }
