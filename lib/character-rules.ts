import type { ManseryeokResult } from "./manseryeok";

export type CharacterRuleResult = {
  animalName: "카피바라" | "호랑이" | "다람쥐" | "아기 여우" | "수달" | "레서판다";
  dayMaster: string;
  basis: string;
  ruleSet: "LITTLE-ANIMAL-DAY-MASTER-v1";
};

/**
 * 전통 명리의 일간을 서비스의 캐릭터 언어로 번역하는 편집 규칙입니다.
 * 동물 자체는 전통 명리의 공식 분류가 아니므로 결과 근거와 버전을 함께 반환합니다.
 */
const dayMasterRules: Record<string, Omit<CharacterRuleResult, "dayMaster" | "ruleSet">> = {
  甲: { animalName: "호랑이", basis: "앞을 향해 뻗는 양목의 추진력" },
  乙: { animalName: "다람쥐", basis: "주변을 살피며 자라는 음목의 탐색력" },
  丙: { animalName: "수달", basis: "밝게 움직이고 표현하는 양화의 활기" },
  丁: { animalName: "아기 여우", basis: "작은 변화를 섬세하게 밝히는 음화의 감각" },
  戊: { animalName: "카피바라", basis: "자기 자리를 든든하게 지키는 양토의 안정감" },
  己: { animalName: "레서판다", basis: "익숙한 환경을 차분히 가꾸는 음토의 포용력" },
  庚: { animalName: "호랑이", basis: "기준을 세우고 움직이는 양금의 결단력" },
  辛: { animalName: "아기 여우", basis: "차이를 정교하게 알아채는 음금의 관찰력" },
  壬: { animalName: "수달", basis: "큰 흐름을 타고 움직이는 양수의 유연함" },
  癸: { animalName: "레서판다", basis: "조용히 스며들며 연결하는 음수의 감수성" },
};

export function selectLittleAnimal(chart: ManseryeokResult): CharacterRuleResult {
  const dayMaster = chart.pillars.day.stem;
  const rule = dayMasterRules[dayMaster];
  if (!rule) throw new Error(`지원하지 않는 일간입니다: ${dayMaster}`);
  return { ...rule, dayMaster, ruleSet: "LITTLE-ANIMAL-DAY-MASTER-v1" };
}

