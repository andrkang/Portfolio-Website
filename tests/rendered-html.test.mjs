import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the single-page project switcher", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive, nosnippet");

  const html = await response.text();
  assert.match(html, /Andrew Kang.*Portfolio/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /Robotic Beaver Dam Analog/);
  assert.match(html, /BDA Robot/);
  assert.match(html, /ADAPTIV/);
  assert.match(html, /3D Workshops/);
  assert.match(html, /Bit Infinite/);
  assert.match(html, /Service/);
  assert.doesNotMatch(html, /href="\/work\//);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("keeps search indexing disabled", async () => {
  const response = await render("/robots.txt");
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Disallow: \//);
});
