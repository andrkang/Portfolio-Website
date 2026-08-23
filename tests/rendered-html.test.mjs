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

test("renders the selected-work homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive, nosnippet");

  const html = await response.text();
  assert.match(html, /Andrew Kang/);
  assert.match(html, /Selected Works/);
  assert.match(html, /Robotic Beaver Dam Analog/);
  assert.match(html, /ADAPTIV Studio/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders project-specific detail metadata", async () => {
  const response = await render("/work/service-in-practice");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Service in Practice — Andrew Kang<\/title>/);
  assert.match(html, /Green Club \/ Seattle University/);
  assert.match(html, /youtube\.com\/embed\/zdGP5_BhiaA/);
  assert.doesNotMatch(html, /og\.png/);
});
