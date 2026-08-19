export type CalendarType = "solar";

export type BirthInput = {
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string | null;
  birthCity: string;
  timeZone: "Asia/Seoul";
};

export type Pillar = {
  stem: string;
  branch: string;
};

export type FourPillars = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
};

export type ManseryeokResult = {
  input: BirthInput;
  pillars: FourPillars;
  engine: {
    name: string;
    version: string;
    ruleSet: string;
  };
};

export type ManseryeokCalculator = (input: BirthInput) => ManseryeokResult;

/**
 * 화면 입력을 만세력 엔진이 받을 수 있는 고정 형식으로 바꿉니다.
 * 현재 서비스는 한국 출생·양력 입력만 지원합니다.
 */
export function normalizeBirthInput(form: FormData): BirthInput {
  const birthDate = String(form.get("birthDate") || "");
  const birthTimeValue = String(form.get("birthTime") || "");
  const birthCity = String(form.get("birthCity") || "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) throw new Error("양력 생년월일을 확인해 주세요.");
  if (birthTimeValue && !/^\d{2}:\d{2}$/.test(birthTimeValue)) throw new Error("태어난 시간을 확인해 주세요.");
  if (!birthCity) throw new Error("출생 도시를 입력해 주세요.");

  return {
    calendarType: "solar",
    birthDate,
    birthTime: birthTimeValue || null,
    birthCity,
    timeZone: "Asia/Seoul",
  };
}

/**
 * 검증된 규칙 엔진을 연결할 단일 진입점입니다.
 * 엔진 연결 전에는 원국을 추정하거나 생성하지 않습니다.
 */
export function calculateManseryeok(
  input: BirthInput,
  calculator?: ManseryeokCalculator,
): ManseryeokResult | null {
  return calculator ? calculator(input) : null;
}

