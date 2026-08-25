import assert from "node:assert/strict";
import test from "node:test";
import { calculateManseryeok } from "../lib/manseryeok.ts";
import { calculateTodayPillar, getDailyGuidance, getDailyPlayOptions } from "../lib/daily-guidance.ts";

const input = (birthDate) => ({
  calendarType: "solar",
  birthDate,
  birthTime: "11:00",
  birthCity: "서울",
  timeZone: "Asia/Seoul",
});

const basePlay = {
  title: "기본 놀이",
  reason: "기본 이유",
  body: "기본 설명",
};

const animals = ["카피바라", "호랑이", "다람쥐", "아기 여우", "수달", "레서판다", "토끼", "쿼카", "펭귄", "고슴도치", "미어캣", "고양이"];

test("한국 날짜를 기준으로 오늘의 일진을 규칙 계산한다", () => {
  const result = calculateTodayPillar(new Date("2025-01-01T03:00:00Z"));
  assert.equal(result.dateKey, "2025-01-01");
  assert.deepEqual(result.pillar, { stem: "庚", branch: "午" });
});

test("열두 동물은 각각 세 가지 찰떡놀이 후보를 가진다", () => {
  for (const animal of animals) {
    assert.equal(getDailyPlayOptions(animal, basePlay).length, 3);
  }
});

test("같은 아이와 날짜에는 같은 안내가 나온다", () => {
  const chart = calculateManseryeok(input("2025-01-01"));
  const date = new Date("2026-08-25T03:00:00Z");
  const first = getDailyGuidance(chart, "호랑이", basePlay, date);
  const second = getDailyGuidance(chart, "호랑이", basePlay, date);
  assert.deepEqual(first, second);
  assert.equal(first.ruleSet, "DAILY-GUIDANCE-FIVE-ELEMENTS-v1");
});

test("아이의 일주가 다르면 같은 날에도 짝꿍색 조합이 달라질 수 있다", () => {
  const date = new Date("2026-08-25T03:00:00Z");
  const colors = new Set();
  for (let day = 1; day <= 20; day += 1) {
    const chart = calculateManseryeok(input(`2025-01-${String(day).padStart(2, "0")}`));
    colors.add(getDailyGuidance(chart, "호랑이", basePlay, date).color.name);
  }
  assert.ok(colors.size >= 5);
});

test("같은 동물도 날짜에 따라 여러 찰떡놀이를 사용한다", () => {
  const chart = calculateManseryeok(input("2025-01-01"));
  const plays = new Set();
  for (let day = 1; day <= 31; day += 1) {
    plays.add(getDailyGuidance(chart, "호랑이", basePlay, new Date(`2026-08-${String(day).padStart(2, "0")}T03:00:00Z`)).play.title);
  }
  assert.equal(plays.size, 3);
});
