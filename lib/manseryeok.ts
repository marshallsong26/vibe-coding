import lunar from "lunar-javascript";

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
  fiveElements: {
    year: string;
    month: string;
    day: string;
    hour: string | null;
  };
  engine: {
    name: string;
    version: string;
    ruleSet: string;
  };
};

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
 * 검증 가능한 규칙 엔진을 호출하는 단일 진입점입니다.
 */
export function calculateManseryeok(input: BirthInput): ManseryeokResult {
  const [year, month, day] = input.birthDate.split("-").map(Number);
  const [hour, minute] = (input.birthTime || "12:00").split(":").map(Number);
  const eightChar = lunar.Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar().getEightChar();

  // sect 2: 23시는 자시로 보지만 일주는 민간시 00:00에 변경합니다.
  eightChar.setSect(2);

  const hasBirthTime = input.birthTime !== null;
  return {
    input,
    pillars: {
      year: { stem: eightChar.getYearGan(), branch: eightChar.getYearZhi() },
      month: { stem: eightChar.getMonthGan(), branch: eightChar.getMonthZhi() },
      day: { stem: eightChar.getDayGan(), branch: eightChar.getDayZhi() },
      hour: hasBirthTime ? { stem: eightChar.getTimeGan(), branch: eightChar.getTimeZhi() } : null,
    },
    fiveElements: {
      year: eightChar.getYearWuXing(),
      month: eightChar.getMonthWuXing(),
      day: eightChar.getDayWuXing(),
      hour: hasBirthTime ? eightChar.getTimeWuXing() : null,
    },
    engine: {
      name: "lunar-javascript",
      version: "1.7.7",
      ruleSet: "KR-SOLAR-KST-SECT2-v1",
    },
  };
}
