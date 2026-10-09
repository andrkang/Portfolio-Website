const state = {
  data: null,
  search: "",
  role: "all",
  org: "all",
  level: "all",
  sortKey: "rank",
  direction: "asc",
};

const metricLabels = {
  rank: "MLB Pipeline rank",
  name: "Player name",
  org: "Organization",
  position: "Position",
  level: "Level",
  eta: "ETA",
  age: "Age",
  fv: "Future Value",
  hobbyIndex: "Hobby Index",
  investmentRating: "Investment Rating",
  hit: "Hit",
  power: "Game Power",
  speed: "Speed",
  field: "Field",
  arm: "Arm",
  fastball: "Fastball",
  "best-secondary": "Best secondary",
  slider: "Slider",
  curveball: "Curveball",
  changeup: "Changeup",
  cutter: "Cutter",
  splitter: "Splitter",
  command: "Command / control",
};

const toolNames = {
  hit: "Hit",
  power: "Game Power",
  speed: "Speed",
  field: "Field",
  arm: "Arm",
  fastball: "Fastball",
  slider: "Slider",
  curveball: "Curveball",
  changeup: "Changeup",
  cutter: "Cutter",
  splitter: "Splitter",
  command: "Command",
};

const els = {};

document.addEventListener("DOMContentLoaded", async () => {
  Object.assign(els, {
    snapshotDate: document.querySelector("#snapshot-date"),
    metricPlayers: document.querySelector("#metric-players"),
    metricOrgs: document.querySelector("#metric-orgs"),
    metricHitters: document.querySelector("#metric-hitters"),
    metricPitchers: document.querySelector("#metric-pitchers"),
    sourceLink: document.querySelector("#source-link"),
    search: document.querySelector("#search"),
    role: document.querySelector("#role-filter"),
    org: document.querySelector("#org-filter"),
    level: document.querySelector("#level-filter"),
    sortKey: document.querySelector("#sort-key"),
    direction: document.querySelector("#sort-direction"),
    reset: document.querySelector("#reset-controls"),
    emptyReset: document.querySelector("#empty-reset"),
    resultCount: document.querySelector("#result-count"),
    sortDescription: document.querySelector("#sort-description"),
    selectedMetricHeading: document.querySelector("#selected-metric-heading"),
    body: document.querySelector("#ranking-body"),
    empty: document.querySelector("#empty-state"),
    download: document.querySelector("#download-csv"),
    dialog: document.querySelector("#player-dialog"),
    dialogContent: document.querySelector("#dialog-content"),
    dialogClose: document.querySelector("#dialog-close"),
  });

  bindControls();

  try {
    const [rankingResponse, scoresResponse] = await Promise.all([
      fetch("./data/prospects.json"),
      fetch("./data/model-scores.json"),
    ]);
    if (!rankingResponse.ok) throw new Error(`Snapshot returned ${rankingResponse.status}.`);
    if (!scoresResponse.ok) throw new Error(`Model scores returned ${scoresResponse.status}.`);
    state.data = await rankingResponse.json();
    const modelSnapshot = await scoresResponse.json();
    const scoresByRank = new Map(modelSnapshot.scores.map(([rank, hobbyIndex, investmentRating]) => [rank, { hobbyIndex, investmentRating }]));
    state.data.modelSnapshotDate = modelSnapshot.snapshotDate;
    state.data.prospects = state.data.prospects.map((player) => ({ ...player, ...(scoresByRank.get(player.rank) || {}) }));
    hydrateSummary();
    render();
  } catch (error) {
    els.resultCount.textContent = "The ranking snapshot could not be loaded.";
    els.body.innerHTML = `<tr><td colspan="13" class="load-error">${escapeHtml(error instanceof Error ? error.message : "Unknown error")}</td></tr>`;
  }
});

function bindControls() {
  els.search.addEventListener("input", () => { state.search = els.search.value; render(); });
  els.role.addEventListener("change", () => { state.role = els.role.value; render(); });
  els.org.addEventListener("change", () => { state.org = els.org.value; render(); });
  els.level.addEventListener("change", () => { state.level = els.level.value; render(); });
  els.sortKey.addEventListener("change", () => {
    state.sortKey = els.sortKey.value;
    state.direction = defaultDirection(state.sortKey);
    syncDirectionButton();
    render();
  });
  els.direction.addEventListener("click", () => {
    state.direction = state.direction === "asc" ? "desc" : "asc";
    syncDirectionButton();
    render();
  });
  els.reset.addEventListener("click", resetControls);
  els.emptyReset.addEventListener("click", resetControls);
  els.download.addEventListener("click", downloadCsv);
  els.dialogClose.addEventListener("click", () => els.dialog.close());
  els.dialog.addEventListener("click", (event) => {
    if (event.target === els.dialog) els.dialog.close();
  });
  document.querySelectorAll(".column-sort").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;
      if (state.sortKey === key) state.direction = state.direction === "asc" ? "desc" : "asc";
      else {
        state.sortKey = key;
        state.direction = defaultDirection(key);
      }
      els.sortKey.value = state.sortKey;
      syncDirectionButton();
      render();
    });
  });
}

function hydrateSummary() {
  const players = state.data.prospects;
  const pitchers = players.filter(isPitcher).length;
  els.snapshotDate.textContent = formatDate(state.data.snapshotDate);
  els.metricPlayers.textContent = players.length;
  els.metricOrgs.textContent = new Set(players.map((player) => player.org).filter(Boolean)).size;
  els.metricPitchers.textContent = pitchers;
  els.metricHitters.textContent = players.length - pitchers;
  els.sourceLink.href = state.data.sourceUrl;

  unique(players.map((player) => player.org).filter(Boolean)).forEach((org) => addOption(els.org, org, org));
  unique(players.map((player) => player.level).filter(Boolean)).sort(levelSort).forEach((level) => addOption(els.level, level, level));
}

function render() {
  if (!state.data) return;
  const rows = currentRows();
  const label = metricLabels[state.sortKey];
  els.resultCount.textContent = `Showing ${rows.length} of ${state.data.prospects.length} prospects`;
  els.sortDescription.textContent = `Sorted by ${label} · ${state.direction === "asc" ? "ascending" : "descending"}`;
  els.selectedMetricHeading.textContent = selectedMetricHeading();
  els.empty.hidden = rows.length > 0;
  els.body.innerHTML = rows.map((player, index) => rowMarkup(player, index)).join("");
  els.body.querySelectorAll("[data-player-rank]").forEach((button) => {
    button.addEventListener("click", () => openPlayer(Number(button.dataset.playerRank)));
  });
}

function currentRows() {
  const query = normalize(state.search);
  return state.data.prospects
    .filter((player) => !query || normalize(`${player.name} ${player.team} ${player.org} ${player.position}`).includes(query))
    .filter((player) => state.role === "all" || (state.role === "pitcher" ? isPitcher(player) : !isPitcher(player)))
    .filter((player) => state.org === "all" || player.org === state.org)
    .filter((player) => state.level === "all" || player.level === state.level)
    .sort(compareRows);
}

function compareRows(a, b) {
  const aValue = metricValue(a, state.sortKey);
  const bValue = metricValue(b, state.sortKey);
  const aMissing = aValue === undefined || aValue === null || aValue === "";
  const bMissing = bValue === undefined || bValue === null || bValue === "";
  if (aMissing && bMissing) return a.rank - b.rank;
  if (aMissing) return 1;
  if (bMissing) return -1;
  const factor = state.direction === "asc" ? 1 : -1;
  if (typeof aValue === "string" || typeof bValue === "string") {
    const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true, sensitivity: "base" });
    return comparison * factor || a.rank - b.rank;
  }
  return (aValue - bValue) * factor || a.rank - b.rank;
}

function metricValue(player, key) {
  if (key === "rank") return player.rank;
  if (["name", "org", "position", "level"].includes(key)) return player[key];
  if (["eta", "age", "fv"].includes(key)) return numeric(player[key]);
  if (["hobbyIndex", "investmentRating"].includes(key)) return player[key];
  if (key === "best-secondary") {
    return Math.max(0, ...["Slider", "Curveball", "Changeup", "Cutter", "Splitter"].map((tool) => gradeValue(player, tool) || 0)) || undefined;
  }
  return gradeValue(player, toolNames[key]);
}

function rowMarkup(player, index) {
  const selectedValue = metricValue(player, state.sortKey);
  const metricDisplay = formatMetric(selectedValue, state.sortKey);
  const initials = player.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
  const image = player.photoUrl
    ? `<img src="${escapeAttribute(player.photoUrl)}" alt="" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false" /><span class="initials" hidden>${escapeHtml(initials)}</span>`
    : `<span class="initials">${escapeHtml(initials)}</span>`;
  return `<tr>
    <td class="number-cell view-rank"><span>${index + 1}</span></td>
    <td class="number-cell official-rank">#${player.rank}</td>
    <td><div class="player-cell"><span class="headshot">${image}</span><div><strong>${escapeHtml(player.name)}</strong><small>${isPitcher(player) ? "Pitcher" : "Position player"}</small></div></div></td>
    <td><strong>${escapeHtml(player.org || "—")}</strong><small>${escapeHtml(player.team || "")}</small></td>
    <td>${escapeHtml(player.position || "—")}</td>
    <td>${escapeHtml(player.level || "—")}</td>
    <td>${escapeHtml(player.eta || "—")}</td>
    <td class="number-cell">${player.age || "—"}</td>
    <td class="number-cell"><span class="grade-pill">${escapeHtml(player.fv || "N/A")}</span></td>
    <td class="number-cell model-score model-score-hobby">${formatScore(player.hobbyIndex)}</td>
    <td class="number-cell model-score model-score-investment">${formatScore(player.investmentRating)}</td>
    <td class="number-cell selected-value">${metricDisplay}</td>
    <td class="number-cell"><button class="details-button" type="button" data-player-rank="${player.rank}" aria-label="View ${escapeAttribute(player.name)} details">View</button></td>
  </tr>`;
}

function openPlayer(rank) {
  const player = state.data.prospects.find((candidate) => candidate.rank === rank);
  if (!player) return;
  const tools = player.grades.length
    ? player.grades.map((grade) => {
      const value = numeric(grade.future || grade.present) || 0;
      const width = Math.max(0, Math.min(100, ((value - 20) / 60) * 100));
      return `<div class="tool-row"><span>${escapeHtml(grade.tool)}</span><div><i style="width:${width}%"></i></div><strong>${escapeHtml(grade.future || grade.present || "N/A")}</strong></div>`;
    }).join("")
    : `<p class="muted">No published tool breakdown was available in this snapshot.</p>`;
  const initials = player.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
  const portrait = player.photoUrl ? `<img src="${escapeAttribute(player.photoUrl)}" alt="${escapeAttribute(player.name)}" />` : `<span>${escapeHtml(initials)}</span>`;
  const hobbyExplanation = player.hobbyIndex == null
    ? `<strong>N/A</strong><p>A Hobby Index needs both a matched scouting profile and current performance evidence.</p>`
    : `<strong>${formatScoreText(player.hobbyIndex)}</strong><p><b>70%</b> Baseball Future + <b>30%</b> Hobby Relevance</p>`;
  const investmentExplanation = player.investmentRating == null
    ? `<strong>N/A</strong><p>An Investment Rating also needs a verified current card price and valuation evidence.</p>`
    : `<strong>${formatScoreText(player.investmentRating)}</strong><p><b>40%</b> Hobby Index + <b>50%</b> Valuation Score + <b>10%</b> Confidence</p>`;
  els.dialogContent.innerHTML = `
    <div class="dialog-hero">
      <div class="dialog-portrait">${portrait}</div>
      <div><p class="eyebrow">MLB Pipeline #${player.rank}</p><h2>${escapeHtml(player.name)}</h2><p>${escapeHtml([player.position, player.org, player.level, player.eta ? `ETA ${player.eta}` : ""].filter(Boolean).join(" · "))}</p></div>
      <div class="dialog-score-stack">
        <div class="dialog-fv"><span>FV</span><strong>${escapeHtml(player.fv || "N/A")}</strong></div>
        <div class="dialog-fv"><span>Hobby</span><strong>${formatScoreText(player.hobbyIndex)}</strong></div>
        <div class="dialog-fv"><span>Investment</span><strong>${formatScoreText(player.investmentRating)}</strong></div>
      </div>
    </div>
    <dl class="dialog-facts"><div><dt>Organization</dt><dd>${escapeHtml(player.team || player.org || "N/A")}</dd></div><div><dt>Age</dt><dd>${player.age || "N/A"}</dd></div><div><dt>Level</dt><dd>${escapeHtml(player.level || "N/A")}</dd></div><div><dt>ETA</dt><dd>${escapeHtml(player.eta || "N/A")}</dd></div></dl>
    <section class="calculation-summary" aria-labelledby="calculation-heading">
      <div class="calculation-heading"><p class="eyebrow">Simple score breakdown</p><h3 id="calculation-heading">How these ratings are calculated</h3></div>
      <div class="calculation-grid">
        <article class="calculation-card calculation-card-hobby"><span>Hobby Index</span>${hobbyExplanation}</article>
        <article class="calculation-card calculation-card-investment"><span>Investment Rating</span>${investmentExplanation}</article>
      </div>
      <a class="calculation-link" href="./methodology.html">See the complete methodology →</a>
    </section>
    <section class="dialog-tools"><p class="eyebrow">Published scouting grades</p><div class="tool-list">${tools}</div></section>
    <p class="dialog-note">MLB ranking snapshot ${formatDate(state.data.snapshotDate)} · Model score snapshot ${formatDate(state.data.modelSnapshotDate)} · Missing evidence remains N/A.</p>`;
  els.dialog.showModal();
}

function downloadCsv() {
  const rows = currentRows();
  const headers = ["View rank", "MLB Pipeline rank", "Player", "Position", "Organization", "Team", "Level", "ETA", "Age", "FV", "Hobby Index", "Investment Rating", "Hit", "Game Power", "Speed", "Field", "Arm", "Fastball", "Slider", "Curveball", "Changeup", "Cutter", "Splitter", "Command"];
  const output = [headers, ...rows.map((player, index) => [
    index + 1, player.rank, player.name, player.position, player.org, player.team, player.level, player.eta, player.age, player.fv, player.hobbyIndex ?? "", player.investmentRating ?? "",
    ...["Hit", "Game Power", "Speed", "Field", "Arm", "Fastball", "Slider", "Curveball", "Changeup", "Cutter", "Splitter", "Command"].map((tool) => gradeValue(player, tool) ?? ""),
  ])];
  const csv = output.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `mlb-pipeline-top-100-${state.data.snapshotDate}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function resetControls() {
  Object.assign(state, { search: "", role: "all", org: "all", level: "all", sortKey: "rank", direction: "asc" });
  els.search.value = "";
  els.role.value = "all";
  els.org.value = "all";
  els.level.value = "all";
  els.sortKey.value = "rank";
  syncDirectionButton();
  render();
}

function syncDirectionButton() {
  els.direction.textContent = state.direction === "asc" ? "Ascending ↑" : "Descending ↓";
}

function selectedMetricHeading() {
  if (["rank", "name", "org", "position", "level", "eta", "age", "fv"].includes(state.sortKey)) return "Selected metric";
  return metricLabels[state.sortKey];
}

function formatMetric(value, key) {
  if (value === undefined || value === null || value === "") return `<span class="na">N/A</span>`;
  if (key === "rank") return `#${value}`;
  return escapeHtml(String(value));
}

function formatScore(value) {
  return value === undefined || value === null ? `<span class="na">N/A</span>` : `<strong>${Number(value).toFixed(1)}</strong>`;
}

function formatScoreText(value) {
  return value === undefined || value === null ? "N/A" : Number(value).toFixed(1);
}

function gradeValue(player, tool) {
  const grade = player.grades.find((item) => item.tool === tool);
  return numeric(grade?.future || grade?.present);
}

function isPitcher(player) {
  return /(^|\/|\b)(LHP|RHP|P|SP|RP)(\/|\b|$)/i.test(player.position);
}

function defaultDirection(key) {
  return ["rank", "name", "org", "position", "level", "eta", "age"].includes(key) ? "asc" : "desc";
}

function numeric(value) {
  const match = String(value ?? "").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function normalize(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function levelSort(a, b) {
  const order = ["MLB", "AAA", "AA", "A+", "A", "ROK", "DSL"];
  const aIndex = order.indexOf(a);
  const bIndex = order.indexOf(b);
  return (aIndex < 0 ? 99 : aIndex) - (bIndex < 0 ? 99 : bIndex) || a.localeCompare(b);
}

function addOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.append(option);
}

function formatDate(value) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
