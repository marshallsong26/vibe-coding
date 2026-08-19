import type { ManseryeokResult } from "./manseryeok";

export type AnimalName = "카피바라" | "호랑이" | "다람쥐" | "아기 여우" | "수달" | "레서판다" | "토끼" | "쿼카" | "펭귄" | "고슴도치" | "미어캣" | "고양이";

export type CharacterRuleResult = {
  animalName: AnimalName;
  dayMaster: string;
  basis: string;
  ruleSet: "LITTLE-ANIMAL-DAY-MASTER-SEASON-v2";
};

const baseRules: Record<string, { animalName: AnimalName; basis: string }> = {
  甲: { animalName: "다람쥐", basis: "앞을 향해 뻗으며 새것을 모으는 양목의 성장력" },
  乙: { animalName: "토끼", basis: "주변을 살피며 유연하게 자라는 음목의 감각" },
  丙: { animalName: "수달", basis: "밝게 움직이고 표현하는 양화의 활기" },
  丁: { animalName: "쿼카", basis: "가까운 관계를 따뜻하게 밝히는 음화의 온기" },
  戊: { animalName: "카피바라", basis: "자기 자리를 든든하게 지키는 양토의 안정감" },
  己: { animalName: "레서판다", basis: "익숙한 환경을 차분히 가꾸는 음토의 포용력" },
  庚: { animalName: "호랑이", basis: "기준을 세우고 움직이는 양금의 결단력" },
  辛: { animalName: "고슴도치", basis: "차이를 정교하게 알아채는 음금의 섬세함" },
  壬: { animalName: "아기 여우", basis: "큰 흐름을 읽고 길을 바꾸는 양수의 유연함" },
  癸: { animalName: "고양이", basis: "조용히 스며들며 자기 리듬을 지키는 음수의 감수성" },
};

const inwardBranches = new Set(["申", "酉", "戌", "亥", "子", "丑"]);
const coldBranches = new Set(["亥", "子", "丑"]);

/** 일간을 중심으로 월지의 계절감을 보조 지표로 사용하는 서비스 편집 규칙입니다. */
export function selectLittleAnimal(chart: ManseryeokResult): CharacterRuleResult {
  const dayMaster = chart.pillars.day.stem;
  const monthBranch = chart.pillars.month.branch;
  let rule = baseRules[dayMaster];
  if (!rule) throw new Error(`지원하지 않는 일간입니다: ${dayMaster}`);

  if ((dayMaster === "甲" || dayMaster === "乙") && inwardBranches.has(monthBranch)) {
    rule = { animalName: "미어캣", basis: "자라는 힘에 계절을 먼저 살피는 신중함이 더해진 관찰력" };
  } else if (dayMaster === "壬" && coldBranches.has(monthBranch)) {
    rule = { animalName: "펭귄", basis: "큰 물의 유연함에 차분히 순서를 맞추는 겨울의 리듬" };
  }

  return { ...rule, dayMaster, ruleSet: "LITTLE-ANIMAL-DAY-MASTER-SEASON-v2" };
}
