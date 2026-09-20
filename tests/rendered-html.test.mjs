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
  ];

  await Promise.all(assets.map((asset) => access(new URL(`../dist/images/${asset}`, import.meta.url))));
  await access(new URL("../dist/models/adaptiv/nfc-identity-tag.stl", import.meta.url));
  await access(new URL("../dist/tools/sparkoh-size-reference/index.html", import.meta.url));
  await access(new URL("../dist/videos/parametric-model-remake.m4v", import.meta.url));
});

test("keeps search indexing disabled", async () => {
  const robots = await readFile(new URL("../dist/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Disallow: \//);
});
