import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("builds the static portfolio shell", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /Andrew Kang.*Selected Works/);
  assert.match(html, /noindex, nofollow, noarchive, nosnippet/);
  assert.match(html, /id="root"/);
  assert.match(html, /assets\/index-[^"']+\.js/);
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
    "adaptiv/adaptiv-logo.png",
    "adaptiv/sclobo-keychain.png",
    "adaptiv/custom-keychain.png",
    "adaptiv/spanish-honor-society-keychain.png",
    "adaptiv/nfc-keychain.png",
    "adaptiv/mechanical-slot-machine.png",
    "adaptiv/atelier-press-assembled-cutout.png",
    "adaptiv/atelier-press-section-cutout.png",
    "sparkoh/team-office.jpg",
  ];

  await Promise.all(assets.map((asset) => access(new URL(`../dist/images/${asset}`, import.meta.url))));
  await access(new URL("../dist/models/adaptiv/nfc-identity-tag.stl", import.meta.url));
  await access(new URL("../dist/models/adaptiv/luka-keychain.stl", import.meta.url));
  await access(new URL("../dist/models/adaptiv/sclobo-keychain.stl", import.meta.url));
  await access(new URL("../dist/models/adaptiv/spanish-honor-society-keychain.stl", import.meta.url));
  await access(new URL("../dist/tools/sparkoh-size-reference/index.html", import.meta.url));
  await access(new URL("../dist/videos/parametric-model-remake.m4v", import.meta.url));
});

test("keeps search indexing disabled", async () => {
  const robots = await readFile(new URL("../dist/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Disallow: \//);
});

test("includes the latest baseball investment case study", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const script = html.match(/<script[^>]+src="([^"]+\.js)"/)?.[1];
  assert.ok(script);
  const source = await readFile(new URL(`../dist${script}`, import.meta.url), "utf8");
  assert.match(source, /Baseball Card Investment Index/);
  assert.match(source, /Prospect Investment Lab/);
  assert.match(source, /Official data snapshot · October 7, 2026/);
  assert.match(source, /Explore rankings & methodology/);
  assert.match(source, /Six-path pitcher forecasts/);
  assert.match(source, /Walk-forward validation/);
  assert.match(source, /Audited market evidence/);

  const ranking = await readFile(new URL("../dist/baseball-index/index.html", import.meta.url), "utf8");
  const methodology = await readFile(new URL("../dist/baseball-index/methodology.html", import.meta.url), "utf8");
  const snapshot = JSON.parse(await readFile(new URL("../dist/baseball-index/data/prospects.json", import.meta.url), "utf8"));
  assert.match(ranking, /MLB Pipeline Prospect Index/);
  assert.match(ranking, /Hobby Index/);
  assert.match(ranking, /Investment Rating/);
  assert.match(methodology, /How the model works/);
  assert.equal(snapshot.count, 100);
  const modelScores = JSON.parse(await readFile(new URL("../dist/baseball-index/data/model-scores.json", import.meta.url), "utf8"));
  assert.equal(modelScores.scores.length, 100);
  assert.ok(modelScores.scores.some(([, hobby, investment]) => Number.isFinite(hobby) && Number.isFinite(investment)));
  assert.doesNotMatch(source, /The GitHub Pages edition is frozen/);
});

test("keeps the admissions-focused project order and copy", async () => {
  const data = await readFile(new URL("../app/data/projects.ts", import.meta.url), "utf8");
  const expected = [
    ["beaver-dam-robot", "01"],
    ["seattle-environment-workshop", "02"],
    ["teaching-3d-printing", "03"],
    ["adaptiv-studio", "04"],
    ["baseball-card-investment-index", "05"],
    ["volunteer-padlet-automation", "06"],
    ["bit-infinite", "07"],
  ];

  for (const [slug, index] of expected) {
    assert.match(data, new RegExp(`slug: "${slug}",[\\s\\S]{0,80}index: "${index}"`));
  }

  assert.match(data, /3D Printing Education & Outreach/);
  assert.match(data, /in-person workshop at Zheng Ze, an online session, and a lecture at TCT Shenzhen/);
  assert.match(data, /Built for my school/);
});

test("shows the internship team photo before the interactive tool", async () => {
  const experience = await readFile(new URL("../app/PortfolioExperience.tsx", import.meta.url), "utf8");
  const teamPhoto = experience.indexOf('className="sparkoh-team experience-shell"');
  const mainMedia = experience.indexOf('project.slug === "adaptiv-studio"');

  assert.ok(teamPhoto > 0);
  assert.ok(teamPhoto < mainMedia);
  assert.equal(experience.match(/className="sparkoh-team experience-shell"/g)?.length, 1);
});

test("shows role without a timeline row", async () => {
  const experience = await readFile(new URL("../app/PortfolioExperience.tsx", import.meta.url), "utf8");

  assert.match(experience, /<span>Role<\/span>/);
  assert.doesNotMatch(experience, /<span>Timeline<\/span>/);
});
