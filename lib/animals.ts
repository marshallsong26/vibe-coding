import { animalProfiles } from "./animal-profiles";

export const animals = [
  { slug: "capybara", name: "카피바라", alias: animalProfiles.카피바라.alias, image: "/characters/capybara-v3.png", sealColor: "#A36637B3" },
  { slug: "tiger", name: "호랑이", alias: animalProfiles.호랑이.alias, image: "/characters/tiger-v3.png", sealColor: "#EE5426B3" },
  { slug: "squirrel", name: "다람쥐", alias: animalProfiles.다람쥐.alias, image: "/characters/squirrel-v3.png", sealColor: "#D99A09B3" },
  { slug: "fox", name: "아기 여우", alias: animalProfiles["아기 여우"].alias, image: "/characters/fox-v3.png", sealColor: "#F06A9DB3" },
  { slug: "otter", name: "수달", alias: animalProfiles.수달.alias, image: "/characters/otter-v3.png", sealColor: "#368F8BB3" },
  { slug: "red-panda", name: "레서판다", alias: animalProfiles.레서판다.alias, image: "/characters/red-panda-v3.png", sealColor: "#8E3D2CB3" },
  { slug: "rabbit", name: "토끼", alias: animalProfiles.토끼.alias, image: "/characters/rabbit-v3.png", sealColor: "#F798BDB3" },
  { slug: "quokka", name: "쿼카", alias: animalProfiles.쿼카.alias, image: "/characters/quokka-v3.png", sealColor: "#FFC038B3" },
  { slug: "penguin", name: "펭귄", alias: animalProfiles.펭귄.alias, image: "/characters/penguin-v3.png", sealColor: "#387CAAB3" },
  { slug: "hedgehog", name: "고슴도치", alias: animalProfiles.고슴도치.alias, image: "/characters/hedgehog-v3.png", sealColor: "#A36637B3" },
  { slug: "meerkat", name: "미어캣", alias: animalProfiles.미어캣.alias, image: "/characters/meerkat-v3.png", sealColor: "#D99A09B3" },
  { slug: "cat", name: "고양이", alias: animalProfiles.고양이.alias, image: "/characters/cat-v3.png", sealColor: "#8E6AAEB3" },
] as const;

export type Animal = (typeof animals)[number];

export function getAnimalBySlug(slug: string) {
  return animals.find((animal) => animal.slug === slug);
}
