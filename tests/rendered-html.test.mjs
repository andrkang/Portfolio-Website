import assert from "node:assert/strict";
import { access } from "node:fs/promises";
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
  assert.match(html, /Robotic Assistance for Data-Driven Beaver Dam Analog Construction/);
  assert.match(html, /ADAPTIV Studio \| Product Development/);
  assert.match(html, /AI Parametric CAD Modeling Internship/);
  assert.match(html, /Bringing 3D Printing into Villages/);
  assert.match(html, /Introducing Beaver Dam Analogs and Wetland Protection at Seattle University/);
  assert.match(html, /API-Based Volunteer Opportunity-to-Padlet Automation/);
  assert.match(html, /ADAPTIV Studio \| Product Development.*Robotic Assistance for Data-Driven Beaver Dam Analog Construction.*Introducing Beaver Dam Analogs and Wetland Protection at Seattle University/);
  assert.doesNotMatch(html, /The story, in three parts/);
  assert.doesNotMatch(html, /href="\/work\//);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("keeps project media available", async () => {
  const assets = [
    "bda-robot.jpg",
    "bda-controller-display.jpg",
    "bda-building.jpg",
    "bda-simulation-experiment.png",
    "flow3d-hydro-simulation.png",
    "porosity-water-level-graph.png",
    "experiment-loss-rate-graph.png",
    "seattle-workshop-1.jpg",
    "seattle-workshop-2.jpg",
    "seattle-workshop-3.jpg",
    "seattle-workshop-presentation.jpg",
    "seattle-workshop-guidance.jpg",
    "village-3d-printing-1.jpg",
    "village-3d-printing-2.jpg",
    "village-3d-printing-3.jpg",
    "village-3d-printing-4.jpg",
    "village-3d-printing-article.png",
    "padlet-automation-workflow.png",
  ];

  await Promise.all(assets.map((asset) => access(new URL(`../public/images/${asset}`, import.meta.url))));
  await access(new URL("../public/tools/sparkoh-size-reference/index.html", import.meta.url));
  await access(new URL("../public/videos/parametric-model-remake.m4v", import.meta.url));
});

test("keeps search indexing disabled", async () => {
  const response = await render("/robots.txt");
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Disallow: \//);
});
