// ============================================================================
// briefing-deck-manifest.mjs
// Maps briefing-slides/_deck-manifest.json entries onto the shared archetype
// toolbox with ROTATING archetypes, so the 42 regenerated skill decks read as a
// varied folder rather than 42 identical layouts. Also builds the manifest-
// derived overviews deck and the theme-aware index catalog.
//
// The 6 fixed content beats map to slides:
//   1 overview   -> hero            (fixed)
//   2 when-to-use-> rotate          POOL2
//   3 session    -> rotate          POOL3
//   4 expect     -> rotate          POOL4
//   5 handoff    -> rotate          POOL5
//   6a references-> references      (fixed)
//   6b gate      -> compiler        (fixed)
//
// Rotation: pool[(deckIndex + beatOffset) % pool.length]. Adjacent beat pools are
// disjoint, so no two neighboring slides in one deck can collide; a guard re-rolls
// defensively anyway. deckIndex (manifest order) offsets every pool so adjacent
// folder decks differ.
//
// Deviation from the Phase-2 brief's suggested pools: `meterRow` (beat 4) and
// `scorecard` (beat 5) are omitted because they render numeric gauges/scores and
// the extracted beat copy carries no honest numbers to fill them. bigStat (beat 4)
// is used as labeled icon tiles, never fabricated metrics.
// ============================================================================

const R = (label, href) => ({ label, href });
const relHref = (repoPath) => (repoPath ? `../${repoPath}` : "#");
const track = (subtitle) => {
  const parts = String(subtitle || "").split("/");
  return (parts.length > 1 ? parts.slice(1).join("/") : parts[0] || "").trim();
};
const firstSentence = (s) => {
  const t = String(s || "").trim();
  const m = t.match(/^[^.]*\./);
  return (m ? m[0] : t).trim();
};

// The session beat is boilerplate shared across every skill deck.
const SESSION = [
  { title: "Resolve context", body: "Reads repo state, source artifacts, and relevant prior AFPS outputs before asking deeper questions." },
  { title: "Work the frame", body: "Runs an interview, research synthesis, planning loop, build loop, audit, or shipping pass based on its type." },
  { title: "Gate the result", body: "Uses review artifacts, checks, or approval language before writing canonical outputs or routing onward." },
];

const POOL2 = ["splitPanel", "featureCards", "anatomy"];
const POOL3 = ["timeline", "flowDiagram", "layeredStack", "kanbanBoard"];
const POOL4 = ["featureCards", "splitPanel", "bigStat"];
const POOL5 = ["flowDiagram", "timeline", "statement"];

function pick(pool, deckIndex, offset) {
  return pool[(deckIndex + offset) % pool.length];
}

// --- per-beat adapters ------------------------------------------------------
function heroSlide(e) {
  return {
    archetype: "hero",
    title: `${e.slug} overview`,
    eyebrow: `${e.deckFamily || "AFPS"} · ${e.tier}`,
    heading: e.title,
    lead: e.lead,
    meta: [
      { cap: "Where it fits", value: track(e.subtitle) || e.deckFamily, tone: "teal" },
      { cap: "Invoke", value: "`" + e.command + "`" },
      { cap: "Next", value: e.nextSkill || "no follow-up", tone: "violet" },
    ],
    refs: [R("SKILL.md", relHref(e.skillPath)), R("overview deck", "../briefing-slides/afps-skill-overviews.html")],
  };
}

function whenSlide(e, archetype) {
  const w = e.beats.whenToUse;
  const base = { title: "When to use it", eyebrow: track(e.subtitle), heading: "When to use it" };
  const refs = [R("SKILL.md", relHref(e.skillPath)), R("decks", "../docs/decks.md")];
  if (archetype === "splitPanel") {
    return {
      ...base, archetype, lead: w.primaryQuestion ? `Primary question: ${w.primaryQuestion}` : "",
      left: { title: "Run this when", items: [w.runWhen, w.primaryInput ? `Primary input — ${w.primaryInput}` : ""].filter(Boolean) },
      right: { title: "Do not expect", items: [w.doNotExpect].filter(Boolean) },
      refs,
    };
  }
  if (archetype === "anatomy") {
    return {
      ...base, archetype,
      focal: `<div style="text-align:center"><div style="font-size:2.2rem">🎯</div><strong>${e.title}</strong></div>`,
      callouts: [
        { title: "Run this when", body: w.runWhen },
        { title: "Do not expect", body: w.doNotExpect },
        { title: "Primary input", body: w.primaryInput },
        { title: "Primary question", body: w.primaryQuestion },
      ].filter((c) => c.body),
      refs,
    };
  }
  // featureCards
  return {
    ...base, archetype, cols: 2,
    cards: [
      { ic: "✅", title: "Run this when", body: w.runWhen, tone: "teal" },
      { ic: "⛔", title: "Do not expect", body: w.doNotExpect, tone: "" },
      { ic: "📥", title: "Primary input", body: w.primaryInput, tone: "violet" },
      { ic: "❓", title: "Primary question", body: w.primaryQuestion, tone: "green" },
    ].filter((c) => c.body),
    refs,
  };
}

function sessionSlide(e, archetype) {
  const base = { title: "What happens in the session", eyebrow: track(e.subtitle), heading: "What happens in the session" };
  const refs = [R("SKILL.md", relHref(e.skillPath)), R("decks", "../docs/decks.md")];
  if (archetype === "flowDiagram") {
    return {
      ...base, archetype,
      nodes: SESSION.map((s, i) => ({ label: s.title, sub: ["read", "work", "gate"][i], tone: ["", "teal", "violet"][i] })),
      note: "Every skill resolves context, works its frame, then gates before writing canonical output.",
      refs,
    };
  }
  if (archetype === "layeredStack") {
    return { ...base, archetype, bands: SESSION.map((s, i) => ({ title: s.title, body: s.body, tag: ["read", "work", "gate"][i] })), refs };
  }
  if (archetype === "kanbanBoard") {
    return {
      ...base, archetype,
      columns: SESSION.map((s, i) => ({
        title: s.title,
        kind: ["assumption", "question", "risk"][i],
        tickets: s.body.split(/,\s+|\.\s+/).map((t) => t.replace(/\.$/, "").trim()).filter(Boolean).slice(0, 3),
      })),
      refs,
    };
  }
  // timeline
  return { ...base, archetype, steps: SESSION, refs };
}

function expectSlide(e, archetype) {
  const x = e.beats.expect;
  const base = { title: "What people should expect", eyebrow: track(e.subtitle), heading: "What people should expect" };
  const refs = [R("SKILL.md", relHref(e.skillPath)), R("overview", "../briefing-slides/afps-skill-overviews.html")];
  if (archetype === "splitPanel") {
    return {
      ...base, archetype,
      left: { title: "What you get", items: [x.output, x.detailLives ? `Where detail lives — ${x.detailLives}` : ""].filter(Boolean) },
      right: { title: "Quality & review", items: [x.qualityBar, x.humanReview ? `Human review — ${x.humanReview}` : ""].filter(Boolean) },
      refs,
    };
  }
  if (archetype === "bigStat") {
    return {
      ...base, archetype,
      stats: [
        { num: "📦", cap: `Output — ${firstSentence(x.output)}`, tone: "" },
        { num: "🎚️", cap: `Quality bar — ${firstSentence(x.qualityBar)}`, tone: "teal" },
        { num: "👤", cap: `Human review — ${firstSentence(x.humanReview)}`, tone: "violet" },
      ].filter((s) => s.cap.length > 12),
      refs,
    };
  }
  // featureCards
  return {
    ...base, archetype, cols: 2,
    cards: [
      { ic: "📦", title: "Expected output", body: x.output, tone: "" },
      { ic: "🗂️", title: "Where detail lives", body: x.detailLives, tone: "teal" },
      { ic: "🎚️", title: "Quality bar", body: x.qualityBar, tone: "violet" },
      { ic: "👤", title: "Human review", body: x.humanReview, tone: "green" },
    ].filter((c) => c.body),
    refs,
  };
}

function handoffSlide(e, archetype) {
  const h = e.beats.handoff;
  const base = { title: "Handoff and next route", eyebrow: track(e.subtitle), heading: "Handoff and next route" };
  const refs = [R("skill-next-step-contracts", "../docs/skill-next-step-contracts.md"), R("decks", "../docs/decks.md")];
  const next = e.nextSkill || "no follow-up";
  if (archetype === "timeline") {
    return {
      ...base, archetype,
      steps: [
        { title: "Before", body: h.before || "Upstream evidence exists." },
        { title: e.title, body: "This skill runs its frame, then hands off." },
        { title: `After — ${next}`, body: h.seriesPoint || "" },
      ].filter((s) => s.body || s.title),
      refs,
    };
  }
  if (archetype === "statement") {
    return {
      ...base, archetype, eyebrow: "Handoff",
      quote: h.seriesPoint || `Why this boundary exists before ${next}.`,
      cite: `${h.before ? "Before: " + firstSentence(h.before) + " → " : ""}After: ${next}`,
      refs,
    };
  }
  // flowDiagram
  return {
    ...base, archetype,
    lead: h.before ? `Before: ${h.before}` : "",
    nodes: [
      { label: "Prerequisite", sub: "before", tone: "" },
      { label: e.title, sub: e.command.replace(/^\$/, ""), tone: "teal" },
      { label: next, sub: "after", tone: "violet" },
    ],
    note: h.seriesPoint || "",
    refs,
  };
}

function referenceSlide(e) {
  const kindOf = (ref) => (/SKILL\.md$/.test(ref) ? "skill" : /\.html$/.test(ref) ? "deck" : "doc");
  const titleOf = (ref) => {
    if (/SKILL\.md$/.test(ref)) return `${e.slug} SKILL.md`;
    if (/afps-skill-overviews\.html$/.test(ref)) return "AFPS skill overviews";
    return ref.split("/").pop();
  };
  return {
    archetype: "references",
    title: "References",
    eyebrow: "Review handoff",
    heading: "References",
    items: (e.references || []).map((ref) => ({ kind: kindOf(ref), title: titleOf(ref), href: relHref(ref) })),
  };
}

function compilerSlide(e) {
  return {
    archetype: "compiler",
    title: "Review and review YAML",
    eyebrow: "Review handoff",
    heading: "Review &amp; review YAML",
    gate: {
      name: `${e.slug.replace(/-/g, "_")}_accurate`,
      question: e.gate.question,
      options: e.gate.options,
      why: `Approving marks the deck ready for agent review and routes the compiled YAML back to ${e.command}.`,
    },
    refs: [R("SKILL.md", relHref(e.skillPath)), R("convention", "../docs/briefing-slides-convention.md")],
  };
}

// --- deck assembly ----------------------------------------------------------
export function manifestToDeck(entry, deckIndex) {
  const a2 = pick(POOL2, deckIndex, 0);
  const a3 = pick(POOL3, deckIndex, 1);
  const a4 = pick(POOL4, deckIndex, 2);
  let a5 = pick(POOL5, deckIndex, 3);
  // Defensive intra-deck collision guard (pools are disjoint, so this is a no-op
  // in practice, but keeps variety correct if a pool is ever edited).
  const chosen = [a2, a3, a4, a5];
  for (let i = 1; i < chosen.length; i += 1) {
    if (chosen[i] === chosen[i - 1]) {
      const pool = [POOL2, POOL3, POOL4, POOL5][i];
      chosen[i] = pool[(deckIndex + i + 1) % pool.length];
    }
  }
  [, , , a5] = chosen;
  const [b2, b3, b4, b5] = chosen;

  const slides = [
    heroSlide(entry),
    whenSlide(entry, b2),
    sessionSlide(entry, b3),
    expectSlide(entry, b4),
    handoffSlide(entry, b5),
    referenceSlide(entry),
    compilerSlide(entry),
  ];

  return {
    slug: `afps-skill-${entry.slug}`,
    title: entry.title,
    subtitle: entry.subtitle,
    command: entry.command,
    briefingPath: `briefing-slides/afps-skill-${entry.slug}.html`,
    references: entry.references,
    sourceArtifacts: entry.references,
    slides,
  };
}

// Archetype sequence for a deck (for --audit-variety).
export function deckArchetypeSequence(entry, deckIndex) {
  return manifestToDeck(entry, deckIndex).slides.map((s) => s.archetype);
}

// ============================================================================
// OVERVIEWS DECK — series map derived from the manifest + canonical chains.
// ============================================================================
const CHAINS = {
  business: {
    label: "Business AFPS",
    phases: [
      { label: "Concept & market", sub: "discovery", tone: "" },
      { label: "Product shape", sub: "flows & model", tone: "teal" },
      { label: "Prototype & proof", sub: "build & UAT", tone: "violet" },
      { label: "Production handoff", sub: "specs", tone: "" },
      { label: "Execution", sub: "roadmap→ship", tone: "green" },
    ],
    full: "customer-discovery → competitive-analysis → journey-map → positioning → user-flow-map → ux-variations → ui-interview → logic-wiring → uat → consolidate-prototypes → spec-interview → roadmap → ship",
  },
  devtool: {
    label: "Devtool AFPS",
    phases: [
      { label: "devtool-positioning", sub: "position", tone: "" },
      { label: "devtool-adoption", sub: "adopt", tone: "teal" },
      { label: "devtool-dx-journey", sub: "DX", tone: "violet" },
      { label: "devtool-docs-audit", sub: "docs", tone: "" },
      { label: "devtool-monetization", sub: "pricing", tone: "green" },
    ],
    full: "devtool-positioning → devtool-adoption → devtool-dx-journey → devtool-docs-audit → devtool-monetization",
  },
  game: {
    label: "Game AFPS",
    phases: [
      { label: "Audience & fantasy", sub: "who & why", tone: "" },
      { label: "Genre & comparables", sub: "market", tone: "teal" },
      { label: "Core loop", sub: "play", tone: "violet" },
      { label: "Playtest & store", sub: "validate", tone: "" },
      { label: "Launch & roadmap", sub: "ship", tone: "green" },
    ],
    full: "game-audience → game-fantasy → game-genre-map → game-comparables → game-core-loop → game-prototype-test → game-playtest-metrics → game-store-page-test → game-launch → game-roadmap",
  },
  vard: { label: "VARD", chain: ["vard-scan", "vard-align", "vard-ship", "vard-traction"] },
  ord: { label: "ORD", chain: ["ord-scan", "ord-align", "ord-ship", "ord-traction"] },
};

export function buildOverviewsDeck(manifest, buildDeck) {
  const byFamily = {};
  for (const d of manifest.decks) (byFamily[d.familyKey] ||= []).push(d.slug);
  const count = (k) => (byFamily[k] || []).length;

  const slides = [
    {
      archetype: "hero", title: "AFPS skill overview",
      eyebrow: "Briefing series", heading: "AFPS skill decks",
      lead: "One slide-first map of every skill deck across the Business, Devtool, and Game deliberate pipelines and the VARD/ORD rapid feeders.",
      meta: [
        { cap: "Skill decks", value: String(manifest.decks.length), tone: "teal" },
        { cap: "Deliberate", value: "Business · Devtool · Game" },
        { cap: "Rapid", value: "VARD · ORD", tone: "violet" },
      ],
      refs: [R("decks", "../docs/decks.md"), R("index", "../briefing-slides/index.html")],
    },
    {
      archetype: "comparisonMatrix", title: "The five decks",
      eyebrow: "Two axes", heading: "Domain × tempo",
      columns: ["Tempo", "Business / Consumer", "Developer / OSS", "Game"],
      rows: [
        ["Rapid (days)", "VARD", "ORD", "—"],
        ["Deliberate (weeks–months)", "Business AFPS", "Devtool AFPS", "Game AFPS"],
      ],
      refs: [R("decks", "../docs/decks.md")],
    },
    {
      archetype: "flowDiagram", title: "Business AFPS",
      eyebrow: `Business AFPS · ${count("business")} decks`, heading: "Deliberate business pipeline",
      nodes: CHAINS.business.phases,
      note: CHAINS.business.full,
      refs: [R("decks", "../docs/decks.md")],
    },
    {
      archetype: "flowDiagram", title: "Devtool AFPS",
      eyebrow: `Devtool AFPS · ${count("devtool")} decks`, heading: "Deliberate devtool pipeline",
      nodes: CHAINS.devtool.phases,
      note: CHAINS.devtool.full,
      refs: [R("decks", "../docs/decks.md")],
    },
    {
      archetype: "flowDiagram", title: "Game AFPS",
      eyebrow: `Game AFPS · ${count("game")} decks`, heading: "Deliberate game pipeline",
      nodes: CHAINS.game.phases,
      note: CHAINS.game.full,
      refs: [R("decks", "../docs/decks.md")],
    },
    {
      archetype: "splitPanel", title: "Rapid feeders",
      eyebrow: "Rapid feeders", heading: "VARD & ORD feed the deliberate decks",
      lead: "Rapid decks turn a weekly experiment into shipped evidence, then graduate on traction.",
      left: { title: "VARD → Business AFPS", items: CHAINS.vard.chain },
      right: { title: "ORD → Devtool AFPS", items: CHAINS.ord.chain },
      refs: [R("decks", "../docs/decks.md")],
    },
    {
      archetype: "references", title: "References", eyebrow: "Sources", heading: "References",
      items: [
        { kind: "doc", title: "Deck families & chains", href: "../docs/decks.md" },
        { kind: "doc", title: "Skill next-step contracts", href: "../docs/skill-next-step-contracts.md" },
        { kind: "deck", title: "Briefing slides index", href: "../briefing-slides/index.html" },
      ],
    },
    {
      archetype: "compiler", title: "Review and review YAML", eyebrow: "Review handoff", heading: "Review &amp; review YAML",
      gate: {
        name: "overview_accurate",
        question: "Does this overview accurately map the AFPS deck families and their canonical chains?",
        options: [{ value: "approve", label: "Approve" }, { value: "revise", label: "Revise" }],
        why: "Approving confirms the series map before individual skill decks are reviewed.",
      },
      refs: [R("decks", "../docs/decks.md"), R("index", "../briefing-slides/index.html")],
    },
  ];

  return buildDeck({
    slug: "afps-skill-overviews",
    title: "AFPS Skill Overview",
    subtitle: "Series map · deliberate + rapid decks",
    command: "$create-briefing-slides",
    briefingPath: "briefing-slides/afps-skill-overviews.html",
    references: ["docs/decks.md", "docs/skill-next-step-contracts.md", "briefing-slides/index.html"],
    slides,
  });
}

// ============================================================================
// INDEX CATALOG — parse the current index into ordered sections, then re-render
// theme-aware. Idempotent: renderIndex output parses back cleanly.
// ============================================================================
const esc = (s) =>
  String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const untag = (s) => String(s || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

export function parseIndexSections(html) {
  const sections = [];
  const sectionRe = /<section\b[^>]*data-section[^>]*>([\s\S]*?)<\/section>/gi;
  for (const sMatch of html.matchAll(sectionRe)) {
    const block = sMatch[1];
    const title = untag((block.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] || "");
    const cards = [];
    const cardRe = /<a\b[^>]*class="card\s+(\w+)"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    for (const c of block.matchAll(cardRe)) {
      const familyKey = c[1];
      const href = c[2];
      const inner = c[3];
      const name = untag((inner.match(/<strong\b[^>]*>([\s\S]*?)<\/strong>/i) || [])[1] || "");
      const blurb = untag((inner.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "");
      const chips = [...inner.matchAll(/<span class="chip">([\s\S]*?)<\/span>/gi)].map((m) => untag(m[1]));
      cards.push({ familyKey, href, name, blurb, chips });
    }
    sections.push({ title, cards });
  }
  return sections;
}

export function renderIndex(sections, BASE_CSS, opts = {}) {
  const total = sections.reduce((n, s) => n + s.cards.length, 0);
  const chipCountFor = (card) => {
    // Keep the overview card's slide-count chip accurate when provided.
    if (opts.overviewsSlideCount && /afps-skill-overviews\.html$/.test(card.href)) {
      return card.chips.map((c) => (/\d+\s*slides?/.test(c) ? `${opts.overviewsSlideCount} slides` : c));
    }
    return card.chips;
  };
  const cardHtml = (card) => {
    const effectiveChips = chipCountFor(card);
    const dataText = `${card.name} ${card.familyKey} ${effectiveChips.join(" ")} ${card.blurb}`.toLowerCase();
    const chips = effectiveChips.map((c) => `<span class="chip">${esc(c)}</span>`).join("");
    return `<a class="card ${esc(card.familyKey)}" href="${esc(card.href)}" data-card data-text="${esc(dataText)}"><strong>${esc(card.name)}</strong><p>${esc(card.blurb)}</p><div class="chips">${chips}</div></a>`;
  };
  const sectionHtml = (s) => `
    <section data-section>
      <div class="section-head"><h2>${esc(s.title)}</h2><span>${s.cards.length} deck${s.cards.length === 1 ? "" : "s"}</span></div>
      <div class="index-grid">
        ${s.cards.map(cardHtml).join("\n        ")}
      </div>
    </section>`;

  const INDEX_CSS = `
/* --- index catalog layer (reuses base tokens) --------------------------- */
body { margin: 0; background: var(--bg); color: var(--text); font-family: var(--sans); }
a { color: inherit; text-decoration: none; }
a:hover { text-decoration: none; }
.index-hero { padding: clamp(1.4rem, 4vw, 2.8rem) clamp(1rem, 4vw, 2.6rem) 1.2rem; border-bottom: 1px solid var(--border); background: var(--surface-2); }
.index-hero .eyebrow { color: var(--teal); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; }
.index-hero h1 { margin: 0.3rem 0 0; font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1.04; letter-spacing: -0.01em; max-width: 60rem; }
.index-hero p { margin: 0.7rem 0 0; max-width: 52rem; color: var(--muted); font-size: clamp(1rem, 1.6vw, 1.2rem); line-height: 1.45; }
main.index-main { max-width: 78rem; margin: 0 auto; padding: 1.2rem clamp(1rem, 4vw, 2.6rem) 3rem; }
.index-toolbar { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.8rem; align-items: center; margin: 1rem 0 0.4rem; }
.index-toolbar input[type="search"] { width: 100%; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--text); padding: 0.7rem 0.9rem; font: inherit; box-shadow: var(--shadow-soft); }
.index-count { color: var(--muted); font-size: 0.85rem; white-space: nowrap; }
.index-empty { display: none; padding: 1.1rem; border: 1px dashed var(--border); border-radius: var(--radius-sm); color: var(--muted); background: var(--surface-2); margin-top: 0.8rem; }
section[data-section] { margin: 1.5rem 0; }
.section-head { display: flex; justify-content: space-between; gap: 0.8rem; align-items: end; margin-bottom: 0.6rem; }
.section-head h2 { margin: 0; font-size: clamp(1.3rem, 3vw, 1.9rem); letter-spacing: -0.01em; }
.section-head span { color: var(--muted); font-size: 0.82rem; }
.index-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.8rem; }
.index-grid .card { display: grid; gap: 0.5rem; align-content: start; min-height: 8.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--border-strong); border-radius: var(--radius-sm); padding: 0.85rem 0.9rem; box-shadow: var(--shadow-soft); transition: border-color 120ms ease, transform 120ms ease; }
.index-grid .card:hover { border-color: var(--accent); transform: translateY(-2px); }
.index-grid .card strong { font-size: 1.05rem; line-height: 1.2; }
.index-grid .card p { margin: 0; color: var(--muted); font-size: 0.85rem; line-height: 1.4; }
.card.business { border-left-color: var(--accent); }
.card.devtool  { border-left-color: var(--teal); }
.card.game     { border-left-color: var(--green); }
.card.rapid    { border-left-color: var(--gold); }
.card.other    { border-left-color: var(--violet); }
.index-footer { margin: 2rem 0 0.6rem; color: var(--muted); font-size: 0.82rem; }
@media (max-width: 60rem) { .index-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 40rem) { .index-grid { grid-template-columns: 1fr; } .index-toolbar { grid-template-columns: 1fr; } .section-head { flex-direction: column; align-items: start; } }
@media print { .deck-topbar, .index-toolbar { display: none; } }
`;

  const THEME_JS = `
(function () {
  var KEY = "briefing:theme";
  function resolve() {
    var explicit = document.documentElement.getAttribute("data-theme");
    if (explicit) return explicit;
    try { var saved = localStorage.getItem(KEY); if (saved) return saved; } catch (e) {}
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    Array.prototype.forEach.call(document.querySelectorAll("[data-theme-toggle]"), function (btn) {
      btn.textContent = theme === "dark" ? "☀ Light" : "☽ Dark";
    });
  }
  apply(resolve());
  Array.prototype.forEach.call(document.querySelectorAll("[data-theme-toggle]"), function (btn) {
    btn.addEventListener("click", function () {
      apply(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });
  var search = document.getElementById("index-search");
  var count = document.getElementById("index-count");
  var empty = document.getElementById("index-empty");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  function update() {
    var q = search.value.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var text = ((card.textContent || "") + " " + (card.getAttribute("data-text") || "")).toLowerCase();
      var match = !q || text.indexOf(q) !== -1;
      card.style.display = match ? "" : "none";
      if (match) visible += 1;
    });
    sections.forEach(function (section) {
      var has = Array.prototype.some.call(section.querySelectorAll("[data-card]"), function (c) { return c.style.display !== "none"; });
      section.style.display = has ? "" : "none";
    });
    count.textContent = visible + " deck" + (visible === 1 ? "" : "s");
    empty.style.display = visible === 0 ? "block" : "none";
  }
  if (search) { search.addEventListener("input", update); update(); }
})();
`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Briefing Slides Index</title>
<style>
${BASE_CSS}
${INDEX_CSS}
</style>
</head>
<body>
<header class="deck-topbar">
  <div class="deck-brand"><span>Briefing Slides</span><small>slide-first review decks</small></div>
  <div class="topbar-right">
    <span class="index-count" id="index-count">${total} decks</span>
    <button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle theme">☽ Dark</button>
  </div>
</header>
<section class="index-hero">
  <div class="eyebrow">Briefing slides</div>
  <h1>Index of slide-first review decks.</h1>
  <p>Open the AFPS series overview, individual skill decks, rapid feeder decks, and standalone briefing artifacts. All links are repo-relative and work from <code>file://</code>.</p>
</section>
<main class="index-main">
  <div class="index-toolbar">
    <input id="index-search" type="search" placeholder="Search decks by skill, deck, phase, or filename" aria-label="Search briefing slide decks">
    <div class="index-count" id="index-count-2" aria-hidden="true"></div>
  </div>
  <div class="index-empty" id="index-empty">No matching briefing decks.</div>
${sections.map(sectionHtml).join("\n")}
  <footer class="index-footer">
    Index links are repo-relative and intended to work from <code>file://</code>. Dense source artifacts remain in their original docs, research, pack, and skill files.
  </footer>
</main>
<script>
${THEME_JS}
</script>
</body>
</html>
`;
}
