import type { AnimalName } from "./character-rules";
import { calculateManseryeok, type ManseryeokResult, type Pillar } from "./manseryeok.ts";

export type FiveElement = "목" | "화" | "토" | "금" | "수";

export type DailyColor = {
  name: string;
  hex: string;
  element: FiveElement;
  activity: string;
};

export type DailyPlay = {
  title: string;
  reason: string;
  body: string;
  elements: FiveElement[];
};

export type DailyGuidance = {
  dateKey: string;
  todayPillar: Pillar;
  color: DailyColor;
  play: DailyPlay;
  status: string;
  ruleSet: "DAILY-GUIDANCE-FIVE-ELEMENTS-v1";
};

const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const elements: FiveElement[] = ["목", "화", "토", "금", "수"];

const stemElement: Record<string, FiveElement> = {
  甲: "목", 乙: "목", 丙: "화", 丁: "화", 戊: "토", 己: "토", 庚: "금", 辛: "금", 壬: "수", 癸: "수",
};

const branchElement: Record<string, FiveElement> = {
  寅: "목", 卯: "목", 巳: "화", 午: "화", 辰: "토", 戌: "토", 丑: "토", 未: "토", 申: "금", 酉: "금", 亥: "수", 子: "수",
};

const colorPalette: Record<FiveElement, [DailyColor, DailyColor]> = {
  목: [
    { name: "새싹 연두", hex: "#9EC244", element: "목", activity: "연두색 물건을 찾아 오늘 해보고 싶은 일 하나를 말해보세요." },
    { name: "숲빛 초록", hex: "#4B8F5A", element: "목", activity: "초록색을 볼 때마다 몸을 길게 뻗어보세요." },
  ],
  화: [
    { name: "햇살 노랑", hex: "#FFC038", element: "화", activity: "노란 물건을 찾아 오늘의 햇살 이름을 붙여보세요." },
    { name: "씩씩한 주황", hex: "#EE5426", element: "화", activity: "주황색을 발견할 때마다 힘나는 동작을 하나 해보세요." },
  ],
  토: [
    { name: "포근한 베이지", hex: "#D6A66F", element: "토", activity: "베이지색 물건을 만지며 가장 편안한 촉감을 골라보세요." },
    { name: "꿀빛 머스타드", hex: "#D9A009", element: "토", activity: "따뜻한 노란빛 물건 세 개를 한곳에 차곡차곡 모아보세요." },
  ],
  금: [
    { name: "구름 하늘", hex: "#8CBFE0", element: "금", activity: "밝은 하늘색 물건을 찾아 반듯하게 줄 세워보세요." },
    { name: "달빛 라일락", hex: "#B89BC8", element: "금", activity: "라일락색과 닮은 물건을 찾아 가장 반짝이는 이름을 붙여보세요." },
  ],
  수: [
    { name: "파도 파랑", hex: "#4F9FD2", element: "수", activity: "파란색을 찾아 물결처럼 천천히 움직여보세요." },
    { name: "포도 보라", hex: "#8E6AAE", element: "수", activity: "보라색 물건을 골라 엉뚱한 이야기를 한 문장 만들어보세요." },
  ],
};

const basePlayElements: Record<AnimalName, FiveElement[]> = {
  호랑이: ["목", "화"], 다람쥐: ["목", "금"], 수달: ["수", "화"], "아기 여우": ["수", "금"],
  카피바라: ["토"], 레서판다: ["토", "목"], 토끼: ["목", "토"], 쿼카: ["화", "토"],
  펭귄: ["수", "금"], 고슴도치: ["금", "토"], 미어캣: ["금", "수"], 고양이: ["수", "목"],
};

const extraPlayOptions: Record<AnimalName, [DailyPlay, DailyPlay]> = {
  호랑이: [
    { title: "출발 신호 보물찾기", reason: "보고 고른 뒤 움직이면 결단력이 편안하게 나와요.", body: "방 안의 물건 세 개를 고른 뒤 출발 신호에 맞춰 가져와보세요.", elements: ["금", "목"] },
    { title: "동작 순서 카드", reason: "큰 에너지를 순서 안에서 신나게 쓸 수 있어요.", body: "뛰기·돌기·박수치기 카드를 놓고 순서를 직접 정해보세요.", elements: ["화", "토"] },
  ],
  다람쥐: [
    { title: "색깔 보물 주머니", reason: "찾고 모으는 힘이 오늘의 호기심과 잘 만나요.", body: "정한 색의 작은 물건을 세 개 찾아 주머니에 모아보세요.", elements: ["목", "토"] },
    { title: "질문 나뭇가지", reason: "떠오른 생각을 연결하며 마음을 정리할 수 있어요.", body: "질문 하나에서 이어지는 질문을 세 갈래로 그려보세요.", elements: ["수", "목"] },
  ],
  수달: [
    { title: "물방울 리듬 박수", reason: "몸의 리듬으로 넘치는 활기를 고르게 써요.", body: "빗방울 소리를 상상하며 느리게·빠르게 박수쳐보세요.", elements: ["수", "화"] },
    { title: "인형 구조대", reason: "재미와 협동이 만나 참여 에너지가 살아나요.", body: "수건 위 인형을 떨어뜨리지 않고 목적지까지 옮겨보세요.", elements: ["토", "금"] },
  ],
  "아기 여우": [
    { title: "소리 없는 탐정", reason: "조용한 관찰력이 오늘의 단서를 잘 찾아요.", body: "말하지 않고 방 안에서 달라진 물건 하나를 찾아보세요.", elements: ["금", "수"] },
    { title: "다른 길로 가기", reason: "한 가지 일의 여러 방법을 발견하는 날이에요.", body: "출발점에서 도착점까지 서로 다른 길 두 개를 만들어보세요.", elements: ["목", "화"] },
  ],
  카피바라: [
    { title: "폭신폭신 쉼터 짓기", reason: "편안한 공간에서 자기 속도를 회복해요.", body: "쿠션과 담요로 작고 포근한 쉼터를 만들어보세요.", elements: ["토", "목"] },
    { title: "느린 숨 풍선", reason: "천천히 내쉬는 호흡이 몸과 마음의 박자를 맞춰줘요.", body: "풍선을 키운다고 상상하며 길게 세 번 숨을 내쉬어보세요.", elements: ["수", "금"] },
  ],
  레서판다: [
    { title: "다정한 인형 돌보기", reason: "익숙한 놀이에서 돌봄의 힘이 자연스럽게 나와요.", body: "인형에게 이불을 덮어주고 오늘 이야기를 들려주세요.", elements: ["토", "화"] },
    { title: "우리 집 비밀 표지판", reason: "안전한 공간을 꾸미며 마음 문을 천천히 열어요.", body: "편안한 자리에 이름을 붙이고 작은 표지판을 만들어보세요.", elements: ["목", "금"] },
  ],
  토끼: [
    { title: "안심 길 미리 걷기", reason: "예측 가능한 길이 작은 용기를 꺼내줘요.", body: "다음에 할 일을 세 걸음 길로 만들고 미리 걸어보세요.", elements: ["목", "토"] },
    { title: "조용한 귀 기울이기", reason: "섬세한 감각을 편안하게 알아차리는 놀이예요.", body: "눈을 감고 가까운 소리부터 먼 소리까지 세 개 찾아보세요.", elements: ["수", "금"] },
  ],
  쿼카: [
    { title: "칭찬 공 주고받기", reason: "관계 속 따뜻한 에너지가 자신감을 채워줘요.", body: "공을 건네며 서로 좋은 점을 하나씩 말해보세요.", elements: ["화", "토"] },
    { title: "웃긴 이야기 이어말하기", reason: "상상과 웃음을 나누며 표현력이 활짝 열려요.", body: "한 문장씩 번갈아 말해 엉뚱한 이야기를 완성해보세요.", elements: ["수", "목"] },
  ],
  펭귄: [
    { title: "짝꿍 발맞추기", reason: "나란히 리듬을 맞추면 협동이 즐거워져요.", body: "둘이 같은 방향을 보며 열 걸음을 천천히 맞춰 걸어보세요.", elements: ["수", "금"] },
    { title: "그림 순서 뒤집기", reason: "눈에 보이는 순서가 변화에 적응하는 힘을 길러줘요.", body: "그림 카드 세 장을 놓고 한 장씩 순서를 바꿔보세요.", elements: ["목", "토"] },
  ],
  고슴도치: [
    { title: "말랑 가시 만들기", reason: "경계를 표현하면서도 마음을 부드럽게 풀 수 있어요.", body: "점토로 고슴도치를 만들고 편한 가시와 불편한 가시를 표시해보세요.", elements: ["토", "금"] },
    { title: "내 자리 테이프", reason: "편한 거리를 직접 정하면 마음이 안전해져요.", body: "바닥에 테이프로 나만의 편안한 자리를 만들어보세요.", elements: ["목", "수"] },
  ],
  미어캣: [
    { title: "창문 밖 관찰 빙고", reason: "충분히 살핀 뒤 참여하는 힘을 즐겁게 써요.", body: "밖을 보며 움직이는 것·둥근 것·밝은 것을 찾아보세요.", elements: ["금", "수"] },
    { title: "먼저 보고 따라 하기", reason: "관찰 후 시작할 수 있어 마음이 한결 가벼워요.", body: "부모가 짧은 동작을 먼저 보여주면 천천히 따라 해보세요.", elements: ["화", "목"] },
  ],
  고양이: [
    { title: "혼자만의 상자 방", reason: "자기 공간에서 호기심을 자기 속도로 펼쳐요.", body: "상자를 꾸미고 그 안에서 하고 싶은 놀이를 하나 골라보세요.", elements: ["수", "목"] },
    { title: "도움 버튼 정하기", reason: "혼자와 함께 사이를 직접 선택할 수 있어요.", body: "도움이 필요할 때 보여줄 손동작이나 카드를 만들어보세요.", elements: ["금", "토"] },
  ],
};

const harmonyPairs = new Set(["子丑", "丑子", "寅亥", "亥寅", "卯戌", "戌卯", "辰酉", "酉辰", "巳申", "申巳", "午未", "未午"]);
const clashPairs = new Set(["子午", "午子", "丑未", "未丑", "寅申", "申寅", "卯酉", "酉卯", "辰戌", "戌辰", "巳亥", "亥巳"]);
const generates: Record<FiveElement, FiveElement> = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };
const controls: Record<FiveElement, FiveElement> = { 목: "토", 토: "수", 수: "화", 화: "금", 금: "목" };

function indexOf(value: string, values: string[]) {
  const index = values.indexOf(value);
  if (index < 0) throw new Error(`지원하지 않는 명리 기호입니다: ${value}`);
  return index;
}

function seoulDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function dateOrdinal(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

export function calculateTodayPillar(date: Date): { dateKey: string; pillar: Pillar } {
  const dateKey = seoulDateKey(date);
  const chart = calculateManseryeok({
    calendarType: "solar", birthDate: dateKey, birthTime: "12:00", birthCity: "서울", timeZone: "Asia/Seoul",
  });
  return { dateKey, pillar: chart.pillars.day };
}

export function getDailyPlayOptions(
  animalName: AnimalName,
  basePlay: Omit<DailyPlay, "elements">,
): DailyPlay[] {
  return [
    { ...basePlay, elements: basePlayElements[animalName] },
    ...extraPlayOptions[animalName],
  ];
}

function statusMessage(child: Pillar, today: Pillar, animalName: AnimalName) {
  const pair = `${child.branch}${today.branch}`;
  if (harmonyPairs.has(pair)) return `오늘은 ${animalName}의 마음과 하루 흐름이 손을 잡기 쉬워요. 아이가 먼저 고른 방법을 따라가 보세요.`;
  if (clashPairs.has(pair)) return `오늘은 평소보다 전환 신호에 예민할 수 있어요. 갑자기 바꾸기보다 다음 순서를 먼저 보여주세요.`;

  const childElement = stemElement[child.stem];
  const todayElement = stemElement[today.stem];
  if (childElement === todayElement) return `아이의 익숙한 힘이 또렷해지는 날이에요. 잘하는 것을 충분히 해본 뒤 새것을 더해주세요.`;
  if (generates[todayElement] === childElement) return `하루의 흐름이 아이를 자연스럽게 받쳐주는 날이에요. 작은 시도도 바로 알아봐 주세요.`;
  if (generates[childElement] === todayElement) return `마음속 에너지가 밖으로 많이 나가기 쉬운 날이에요. 표현한 뒤에는 조용히 쉬는 틈도 챙겨주세요.`;
  if (controls[todayElement] === childElement) return `오늘의 규칙이 아이에게 조금 크게 느껴질 수 있어요. 할 일을 한 단계씩 작게 나눠주세요.`;
  return `아이의 선택하는 힘이 살아나는 날이에요. 가능한 두 가지를 보여주고 직접 고르게 해주세요.`;
}

export function getDailyGuidance(
  chart: ManseryeokResult,
  animalName: AnimalName,
  basePlay: Omit<DailyPlay, "elements">,
  date = new Date(),
): DailyGuidance {
  const { dateKey, pillar: todayPillar } = calculateTodayPillar(date);
  const childPillar = chart.pillars.day;
  const ordinal = dateOrdinal(dateKey);
  const seed =
    indexOf(childPillar.stem, stems) * 37 + indexOf(childPillar.branch, branches) * 31 +
    indexOf(todayPillar.stem, stems) * 23 + indexOf(todayPillar.branch, branches) * 19 + ordinal;

  const elementIndex = (
    elements.indexOf(stemElement[childPillar.stem]) * 3 +
    elements.indexOf(branchElement[childPillar.branch]) * 5 +
    elements.indexOf(stemElement[todayPillar.stem]) * 7 +
    elements.indexOf(branchElement[todayPillar.branch]) * 11 + ordinal
  ) % elements.length;
  const colorElement = elements[elementIndex];
  const color = colorPalette[colorElement][Math.abs(seed) % 2];

  const plays = getDailyPlayOptions(animalName, basePlay);
  const todayStemElement = stemElement[todayPillar.stem];
  const todayBranchElement = branchElement[todayPillar.branch];
  const childElement = stemElement[childPillar.stem];
  const ranked = plays
    .map((play, index) => ({
      play,
      score: (play.elements.includes(todayStemElement) ? 4 : 0) +
        (play.elements.includes(todayBranchElement) ? 3 : 0) +
        (play.elements.includes(childElement) ? 2 : 0) + ((seed + index) % 3),
    }))
    .sort((a, b) => b.score - a.score);

  return {
    dateKey,
    todayPillar,
    color,
    play: ranked[0].play,
    status: statusMessage(childPillar, todayPillar, animalName),
    ruleSet: "DAILY-GUIDANCE-FIVE-ELEMENTS-v1",
  };
}
