import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the public landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko">/i);
  assert.match(
    html,
    /<title>오늘왜그래 ㅎㅎ \| 우리 아이를 이해하는 가장 재미있는 방법<\/title>/i,
  );
  assert.match(html, /우리 아이 마음속에는,/);
  assert.match(html, /어떤 꼬마동물이 살고 있을까요\?/);
  assert.match(html, /내 아이 알아보기/);
  assert.match(html, /샘플 먼저 보기/);
  assert.match(html, /개인정보 수집·이용 안내/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
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
