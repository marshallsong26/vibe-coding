import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the public landing copy and metadata", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /오늘왜그래 ㅎㅎ \| 우리 아이를 이해하는 가장 재미있는 방법/);
  assert.match(page, /우리 아이 마음속에는,/);
  assert.match(page, /어떤 꼬마동물이 살고 있을까요\?/);
  assert.match(page, /내 아이 알아보기/);
  assert.match(page, /샘플 먼저 보기/);
  assert.match(page, /개인정보 수집·이용 안내/);
  assert.doesNotMatch(page, /Your site is taking shape|Building your site/);
});

test("keeps reports client-controlled until the user asks for one", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /showReport/);
  assert.match(page, /const openSample/);
  assert.match(page, /handleSubmit/);
  assert.match(page, /마음속 꼬마동물 누구\?/);
  assert.match(page, /양력 생년월일/);
  assert.match(page, /calculateManseryeok/);
});
