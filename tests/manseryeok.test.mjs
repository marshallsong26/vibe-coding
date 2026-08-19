import assert from "node:assert/strict";
import test from "node:test";
import { calculateManseryeok } from "../lib/manseryeok.ts";

const input = (birthDate, birthTime) => ({
  calendarType: "solar",
  birthDate,
  birthTime,
  birthCity: "서울",
  timeZone: "Asia/Seoul",
});

test("2025-01-01 11:00 서울 샘플의 네 기둥을 계산한다", () => {
  const result = calculateManseryeok(input("2025-01-01", "11:00"));
  assert.deepEqual(result.pillars, {
    year: { stem: "甲", branch: "辰" },
    month: { stem: "丙", branch: "子" },
    day: { stem: "庚", branch: "午" },
    hour: { stem: "壬", branch: "午" },
  });
  assert.equal(result.engine.ruleSet, "KR-SOLAR-KST-SECT2-v1");
});

test("23시는 자시지만 일주는 자정에 변경한다", () => {
  const beforeMidnight = calculateManseryeok(input("2025-01-01", "23:30"));
  const afterMidnight = calculateManseryeok(input("2025-01-02", "00:30"));
  assert.equal(beforeMidnight.pillars.day.stem + beforeMidnight.pillars.day.branch, "庚午");
  assert.equal(beforeMidnight.pillars.hour?.branch, "子");
  assert.equal(afterMidnight.pillars.day.stem + afterMidnight.pillars.day.branch, "辛未");
  assert.equal(afterMidnight.pillars.hour?.branch, "子");
});

test("태어난 시간을 모르면 시주를 제공하지 않는다", () => {
  const result = calculateManseryeok(input("2025-01-01", null));
  assert.equal(result.pillars.hour, null);
  assert.equal(result.fiveElements.hour, null);
});
