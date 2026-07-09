#!/usr/bin/env node
// ============================================================================
// generate-briefing-decks.mjs
// One source of truth for the briefing-slides visual system. Holds the slide
// archetype toolbox as composable template functions and emits:
//   --gallery      briefing-slides/slide-template-gallery.html (living style guide)
//   --deck <slug>  a single skill deck from the manifest
//   (default)      every skill deck in the manifest + overview + index
// Every emitted deck is theme-aware (light+dark), self-contained (works from
// file://), and conforms to scripts/audit-briefing-slides.mjs.
//
// Design tokens + chrome CSS live in scripts/briefing-deck-base.css.
// Runtime chrome JS lives in scripts/briefing-deck-chrome.js.
// Both are injected verbatim so escaping stays trivial and there is one place
// to edit the mechanics. Do not hand-edit generated decks.
// ============================================================================

import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import {
  manifestToDeck,
  deckArchetypeSequence,
  buildOverviewsDeck,
  parseIndexSections,
  renderIndex,
} from "./briefing-deck-manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const BRIEFING_DIR = `${REPO}/briefing-slides`;
const MANIFEST_PATH = `${BRIEFING_DIR}/_deck-manifest.json`;
const BASE_CSS = readFileSync(`${__dirname}/briefing-deck-base.css`, "utf8");
const CHROME_JS = readFileSync(`${__dirname}/briefing-deck-chrome.js`, "utf8");

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(`Missing ${MANIFEST_PATH.replace(REPO + "/", "")}. Run: node scripts/extract-deck-manifest.mjs`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

// --- tiny helpers -----------------------------------------------------------
const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
// Inline emphasis: allow `code` spans and **bold** without raw HTML injection.
const rich = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

const chipsRow = (refs = []) =>
  refs.length
    ? `<div class="chips">${refs
        .map((r) => `<a class="chip" data-reference-chip href="${esc(r.href)}">${esc(r.label)}</a>`)
        .join("")}</div>`
    : "";

// ============================================================================
// SLIDE ARCHETYPE TOOLBOX
// Each function returns the inner HTML that lives inside `.slide-card`.
// The assembler wraps it with the slide root + feedback trigger.
// `meta` on each drives the gallery style guide (purpose / best-fit / tier).
// ============================================================================

const A = {};

function def(name, meta, render) {
  A[name] = Object.assign(render, { archetypeName: name, meta });
}

const head = (d) =>
  `${d.eyebrow ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ""}` +
  `${d.heading ? `<h2>${rich(d.heading)}</h2>` : ""}` +
  `${d.lead ? `<p class="lead">${rich(d.lead)}</p>` : ""}`;

// --- Framing ----------------------------------------------------------------
def("hero",
  { group: "Framing", purpose: "Title / opening — one skill, one promise.", tier: "light",
    bestFit: "Deck opener, section owner, the single subject." },
  (d) => `
  ${d.eyebrow ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ""}
  <h1>${rich(d.heading)}</h1>
  ${d.lead ? `<p class="lead">${rich(d.lead)}</p>` : ""}
  ${d.meta && d.meta.length ? `<div class="stat-row" style="grid-auto-columns:auto">${d.meta
    .map((m) => `<div class="stat ${m.tone || ""}" style="padding:.7rem .9rem"><div class="cap">${esc(m.cap)}</div><div style="font-weight:800;font-size:1.05rem">${rich(m.value)}</div></div>`)
    .join("")}</div>` : ""}
  ${chipsRow(d.refs)}`);

def("divider",
  { group: "Framing", purpose: "Chapter break — full-bleed accent between acts.", tier: "light",
    bestFit: "Phase transitions, agenda markers.", bleed: true },
  (d) => `
  <div class="divider">
    ${d.index ? `<div class="idx">${esc(d.index)}</div>` : ""}
    <div class="kwill">${rich(d.heading)}</div>
    ${d.lead ? `<p class="lead" style="text-align:center">${rich(d.lead)}</p>` : ""}
  </div>`);

def("statement",
  { group: "Framing", purpose: "Principle / pull-quote — one idea, oversized.", tier: "light",
    bestFit: "A stance, a rule, the thesis." },
  (d) => `
  ${d.eyebrow ? `<p class="eyebrow">${esc(d.eyebrow)}</p>` : ""}
  <div class="statement">
    <div class="bar"></div>
    <blockquote>${rich(d.quote || d.heading)}</blockquote>
    ${d.cite ? `<cite>${rich(d.cite)}</cite>` : ""}
  </div>
  ${chipsRow(d.refs)}`);

def("bigStat",
  { group: "Framing", purpose: "1–3 oversized metrics with captions.", tier: "light",
    bestFit: "Scale, counts, headline numbers." },
  (d) => `
  ${head(d)}
  <div class="stat-row">
    ${(d.stats || []).map((s) => `
    <div class="stat ${s.tone || ""}">
      <div class="num">${esc(s.num)}${s.unit ? `<span class="unit">${esc(s.unit)}</span>` : ""}</div>
      <div class="cap">${rich(s.cap)}</div>
      ${s.spark ? sparkline(s.spark, s.tone) : ""}
    </div>`).join("")}
  </div>
  ${chipsRow(d.refs)}`);

// --- Structure / compare ----------------------------------------------------
def("splitPanel",
  { group: "Structure", purpose: "Two-panel contrast — fit vs not, before/after.", tier: "light",
    bestFit: "When-to-use vs when-not, do/don't." },
  (d) => `
  ${head(d)}
  <div class="split">
    <div class="panel pos">
      <div class="head"><span class="dot"></span>${esc(d.left.title)}</div>
      <ul>${d.left.items.map((i) => `<li>${rich(i)}</li>`).join("")}</ul>
    </div>
    <div class="panel neg">
      <div class="head"><span class="dot"></span>${esc(d.right.title)}</div>
      <ul>${d.right.items.map((i) => `<li>${rich(i)}</li>`).join("")}</ul>
    </div>
  </div>
  ${chipsRow(d.refs)}`);

def("comparisonMatrix",
  { group: "Structure", purpose: "Real table with status cells across options.", tier: "light",
    bestFit: "Feature/option comparison, capability grids." },
  (d) => {
    const cell = (v) =>
      typeof v === "object"
        ? `<span class="cell ${v.s}">${cellIcon(v.s)} ${esc(v.t || "")}</span>`
        : esc(v);
    return `
  ${head(d)}
  <table class="matrix">
    <thead><tr>${d.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
    <tbody>${d.rows.map((r) => `<tr><th>${esc(r[0])}</th>${r.slice(1).map((v) => `<td>${cell(v)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>
  ${chipsRow(d.refs)}`;
  });

def("scorecard",
  { group: "Structure", purpose: "Weighted options with score bars; winner marked.", tier: "light",
    bestFit: "Ranked decisions, evaluated alternatives." },
  (d) => `
  ${head(d)}
  <div class="scorecard">
    ${d.options.map((o) => `
    <div class="option ${o.win ? "win" : ""}">
      <div class="name">${rich(o.name)}${o.win ? ' <span class="badge execution">recommended</span>' : ""}</div>
      <div class="score">${esc(o.score)}</div>
      <div class="track"><span style="width:${Math.max(0, Math.min(100, o.pct))}%"></span></div>
    </div>`).join("")}
  </div>
  ${chipsRow(d.refs)}`);

def("featureCards",
  { group: "Structure", purpose: "Icon + accent-rail cards. Use sparingly, vary columns.", tier: "light",
    bestFit: "3–4 parallel facets that resist a richer structure." },
  (d) => `
  ${head(d)}
  <div class="card-grid cols-${d.cols || d.cards.length}">
    ${d.cards.map((c) => `
    <div class="card ${c.tone || ""}">
      <div class="kicker">${c.ic ? `<span class="ic">${esc(c.ic)}</span>` : ""}${rich(c.title)}</div>
      <p>${rich(c.body)}</p>
    </div>`).join("")}
  </div>
  ${chipsRow(d.refs)}`);

// --- Process / relationship -------------------------------------------------
def("timeline",
  { group: "Process", purpose: "Numbered stages with connectors.", tier: "light",
    bestFit: "What-happens-in-session, ordered procedure." },
  (d) => `
  ${head(d)}
  <div class="timeline">
    ${d.steps.map((s, i) => `
    <div class="step ${["", "teal", "violet"][i % 3]}">
      <div class="num">${i + 1}</div>
      <div class="body"><strong>${rich(s.title)}</strong><p>${rich(s.body)}</p></div>
    </div>`).join("")}
  </div>
  ${chipsRow(d.refs)}`);

def("flowDiagram",
  { group: "Process", purpose: "Sketchy SVG nodes + arrows (excalidraw filter).", tier: "rich",
    bestFit: "Pipelines, before→step→after, handoffs." },
  (d) => `
  ${head(d)}
  <div class="flow">${flowSvg(d.nodes)}</div>
  ${d.note ? `<p class="slide-note">${rich(d.note)}</p>` : ""}
  ${chipsRow(d.refs)}`);

def("kanbanBoard",
  { group: "Process", purpose: "Register board — risks / assumptions / open questions.", tier: "light",
    bestFit: "Risk & assumption registers, open-question columns." },
  (d) => `
  ${head(d)}
  <div class="board">
    ${d.columns.map((c) => `
    <div class="column">
      <h4>${esc(c.title)}<span class="count">${c.tickets.length}</span></h4>
      ${c.tickets.map((t) => `<div class="ticket ${c.kind || ""}">${rich(t)}</div>`).join("")}
    </div>`).join("")}
  </div>
  ${chipsRow(d.refs)}`);

def("anatomy",
  { group: "Process", purpose: "Focal object + numbered callouts.", tier: "light",
    bestFit: "Explaining one artifact's parts." },
  (d) => `
  ${head(d)}
  <div class="anatomy">
    <div class="focal">${d.focal || ""}</div>
    <div class="callouts">
      ${d.callouts.map((c, i) => `
      <div class="callout"><span class="pin">${i + 1}</span><div><strong>${rich(c.title)}</strong><p>${rich(c.body)}</p></div></div>`).join("")}
    </div>
  </div>
  ${chipsRow(d.refs)}`);

def("layeredStack",
  { group: "Process", purpose: "Horizontal bands — a layered model.", tier: "light",
    bestFit: "Stacks, tiers, dependency layers." },
  (d) => `
  ${head(d)}
  <div class="stack">
    ${d.bands.map((b, i) => `
    <div class="band">
      <div class="lyr">L${d.bands.length - i}</div>
      <div class="lbl"><strong>${rich(b.title)}</strong>${b.body ? `<p>${rich(b.body)}</p>` : ""}</div>
      ${b.tag ? `<div class="tag">${esc(b.tag)}</div>` : ""}
    </div>`).join("")}
  </div>
  ${chipsRow(d.refs)}`);

// --- Data (richer tier) -----------------------------------------------------
def("chart",
  { group: "Data", purpose: "Inline SVG bar chart + accessible table fallback.", tier: "rich",
    bestFit: "Distributions, comparisons, magnitudes." },
  (d) => `
  ${head(d)}
  <div class="chart">
    ${barChartSvg(d.data, d.axisLabel)}
    <details class="fallback"><summary>Data table</summary>
      <table><thead><tr><th>${esc(d.axisLabel || "Item")}</th><th>Value</th></tr></thead>
      <tbody>${d.data.map((p) => `<tr><td>${esc(p.label)}</td><td>${esc(p.value)}</td></tr>`).join("")}</tbody></table>
    </details>
  </div>
  ${chipsRow(d.refs)}`);

def("meterRow",
  { group: "Data", purpose: "Row of radial gauges.", tier: "rich",
    bestFit: "Readiness, coverage, confidence dials." },
  (d) => `
  ${head(d)}
  <div class="meters">
    ${d.gauges.map((g) => gauge(g)).join("")}
  </div>
  ${chipsRow(d.refs)}`);

// --- Meta / handoff ---------------------------------------------------------
def("references",
  { group: "Meta", purpose: "Grouped reference chips + provenance (non-action).", tier: "light",
    bestFit: "Sources, dense-page links, provenance.", isReferences: true },
  (d) => `
  <p class="eyebrow">${esc(d.eyebrow || "References")}</p>
  <h2>${rich(d.heading || "References")}</h2>
  <div class="ref-list">
    ${d.items.map((r) => `
    <a class="ref-item" data-reference-chip href="${esc(r.href)}">
      <span class="rk">${esc(r.kind || "doc")}</span>
      <span class="rt">${esc(r.title)}</span>
      <span class="rp">${esc(r.href.replace(/^\.\.\//, ""))}</span>
    </a>`).join("")}
  </div>
  ${d.provenance && d.provenance.length ? `
  <div class="provenance">
    <small>Provenance — carried in compiled source_artifacts, not a primary action:</small><br>
    ${d.provenance.map((p) => `<a href="${esc(p.href)}">${esc(p.title)}</a>`).join(" · ")}
  </div>` : ""}`);

def("compiler",
  { group: "Meta", purpose: "Response slide — full-deck YAML + review gate.", tier: "light",
    bestFit: "Final approval + compiled review payload.", isGate: true },
  (d) => `
  <p class="eyebrow">${esc(d.eyebrow || "Response")}</p>
  <h2>${rich(d.heading || "Review &amp; compile")}</h2>
  ${d.gate ? `
  <div class="gate">
    <div class="q">${rich(d.gate.question)}</div>
    <div class="opts">
      ${d.gate.options.map((o) => `<label><input type="radio" required data-gate-answer name="${esc(d.gate.name)}" value="${esc(o.value)}"> ${esc(o.label)}</label>`).join("")}
    </div>
    <textarea placeholder="Rationale (optional)" aria-label="Gate rationale"></textarea>
    <p class="why">${rich(d.gate.why || "")}</p>
    <span class="gate-flag">● gate status reflects the slide border</span>
  </div>` : ""}
  <div class="compiler">
    <div class="btn-row">
      <button class="btn primary" type="button" data-deck-compile>Compile full-deck YAML</button>
      <button class="btn" type="button" data-deck-copy>Copy YAML</button>
    </div>
    <pre class="yaml" data-full-deck-yaml aria-live="polite"># Compile the review payload from deck controls.
# command / briefing_slides / slide_feedback / approval_status are emitted here.</pre>
    <textarea class="copy-fallback" data-deck-fallback readonly aria-label="Copy fallback"></textarea>
  </div>
  ${chipsRow(d.refs)}`);

// ============================================================================
// SVG PRIMITIVES
// ============================================================================
function sparkline(values, tone) {
  const w = 120, h = 26, max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");
  const stroke = tone === "teal" ? "var(--teal)" : tone === "violet" ? "var(--violet)" : tone === "green" ? "var(--green)" : "var(--accent)";
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function cellIcon(s) {
  return s === "yes" ? "●" : s === "no" ? "○" : "◐";
}

function flowSvg(nodes) {
  // Horizontal pipeline of rounded-rect nodes joined by arrows. The node boxes
  // carry the sketch filter; the connector stem + arrowhead stay crisp.
  const nw = 240, nh = 104, gap = 82, pad = 10;
  const total = nodes.length * nw + (nodes.length - 1) * gap + pad * 2;
  const H = 156;
  const y = (H - nh) / 2;
  const cy = H / 2;
  let parts = "";
  nodes.forEach((n, i) => {
    const x = pad + i * (nw + gap);
    const tone = n.tone ? ` ${n.tone}` : "";
    const labelY = n.sub ? y + nh / 2 - 4 : y + nh / 2 + 6;
    parts += `<rect class="node-fill${tone}" x="${x}" y="${y}" width="${nw}" height="${nh}" rx="14"/>`;
    parts += `<text x="${x + nw / 2}" y="${labelY}" text-anchor="middle">${esc(n.label)}</text>`;
    if (n.sub) parts += `<text class="sub" x="${x + nw / 2}" y="${y + nh / 2 + 22}" text-anchor="middle" font-size="14">${esc(n.sub)}</text>`;
    if (i < nodes.length - 1) {
      const stemStart = x + nw + 6;
      const nextNode = x + nw + gap;
      const headBase = nextNode - 16;
      const headTip = nextNode - 4;
      parts += `<line class="edge" x1="${stemStart}" y1="${cy}" x2="${headBase}" y2="${cy}"/>`;
      parts += `<polygon class="edge head" points="${headBase},${cy - 8} ${headTip},${cy} ${headBase},${cy + 8}"/>`;
    }
  });
  return `<svg viewBox="0 0 ${total} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Flow: ${esc(nodes.map((n) => n.label).join(" then "))}">${parts}</svg>`;
}

function barChartSvg(data, axisLabel) {
  const W = 760, H = 300, padL = 44, padB = 40, padT = 12, padR = 12;
  const max = Math.max(...data.map((d) => d.value)) || 1;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const bw = (plotW / data.length) * 0.62;
  const step = plotW / data.length;
  const ticks = 4;
  let grid = "";
  for (let t = 0; t <= ticks; t++) {
    const gy = padT + plotH - (plotH * t) / ticks;
    const gv = Math.round((max * t) / ticks);
    grid += `<line class="grid-line" x1="${padL}" y1="${gy}" x2="${W - padR}" y2="${gy}"/>`;
    grid += `<text x="${padL - 6}" y="${gy + 4}" text-anchor="end">${gv}</text>`;
  }
  const tones = ["", "teal", "violet"];
  const bars = data
    .map((d, i) => {
      const bh = (d.value / max) * plotH;
      const x = padL + i * step + (step - bw) / 2;
      const yb = padT + plotH - bh;
      return `<rect class="bar-rect ${tones[i % 3]}" x="${x}" y="${yb}" width="${bw}" height="${bh}" rx="3"/>` +
        `<text class="val" x="${x + bw / 2}" y="${yb - 5}" text-anchor="middle">${esc(d.value)}</text>` +
        `<text x="${x + bw / 2}" y="${H - padB + 16}" text-anchor="middle">${esc(d.label)}</text>`;
    })
    .join("");
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(axisLabel || "Bar chart")}: ${esc(data.map((d) => d.label + " " + d.value).join(", "))}">
    ${grid}
    <line class="axis" x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}"/>
    <line class="axis" x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}"/>
    ${bars}
  </svg></div>`;
}

function gauge(g) {
  const r = 52, cx = 66, cy = 66, circ = Math.PI * r; // half circle
  const pct = Math.max(0, Math.min(100, g.value));
  const dash = (pct / 100) * circ;
  const tone = g.tone || "";
  return `<div class="gauge">
    <svg viewBox="0 0 132 84" role="img" aria-label="${esc(g.label)}: ${pct}%">
      <path class="arc-bg" d="M14 66 A52 52 0 0 1 118 66"/>
      <path class="arc-fg ${tone}" d="M14 66 A52 52 0 0 1 118 66" stroke-dasharray="${dash} ${circ}"/>
      <text class="gval" x="66" y="60" text-anchor="middle" style="font-size:18px;fill:var(--text);font-weight:800">${pct}%</text>
    </svg>
    <div class="glbl">${rich(g.label)}</div>
  </div>`;
}

const SKETCH_FILTER = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="deckSketch" x="-2%" y="-2%" width="104%" height="104%">
    <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" seed="7" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs></svg>`;

// ============================================================================
// SLIDE + DECK ASSEMBLER
// ============================================================================
function renderSlide(spec, index) {
  const fn = A[spec.archetype];
  if (!fn) throw new Error(`Unknown archetype: ${spec.archetype}`);
  const inner = fn(spec);
  const isGate = spec.gate && (fn.meta.isGate || spec.forceGate);
  const attrs = [
    "data-briefing-slide",
    `id="${spec.id || `slide-${index + 1}`}"`,
    `data-slide-title="${esc(spec.title || fn.meta.group)}"`,
  ];
  const classes = [];
  if (fn.meta.bleed) classes.push("bleed");
  if (isGate) {
    attrs.push("data-required-gate-slide", 'data-gate-status="unanswered"');
  }
  if (fn.meta.isReferences) attrs.push("data-references-slide");
  if (classes.length) attrs.push(`class="${classes.join(" ")}"`);
  return `<section ${attrs.join(" ")}>
  <div class="slide-card">
    <button class="fb-trigger" type="button" data-feedback-trigger aria-label="Open feedback for this slide">Feedback</button>
    ${inner}
  </div>
</section>`;
}

function feedbackPanel() {
  return `<aside class="fb-panel" data-slide-feedback-panel aria-label="Slide feedback sidebar" aria-hidden="true">
    <div class="fb-head">
      <div>
        <p data-fb-meta>Slide 1</p>
        <h3 data-fb-title>Slide</h3>
      </div>
      <button class="btn" type="button" data-fb-close aria-label="Close feedback sidebar">Close</button>
    </div>
    <div class="fb-body">
      <section class="fb-sec">
        <h4>Slide review</h4>
        <label>Feedback
          <select data-fb-feedback>
            <option value="">No feedback</option>
            <option value="emphasize">Emphasize</option>
            <option value="revise">Revise</option>
            <option value="needs-clarification">Needs clarification</option>
          </select>
        </label>
        <label>Mark
          <select data-fb-mark>
            <option value="">Unmarked</option>
            <option value="important">Important</option>
            <option value="question">Question</option>
            <option value="approved">Approved</option>
            <option value="skip">Skip</option>
          </select>
        </label>
        <label>Annotation
          <textarea data-fb-note placeholder="Note for this slide"></textarea>
        </label>
        <div class="fb-actions">
          <button class="btn" type="button" data-fb-copy-title>Copy title</button>
          <button class="btn" type="button" data-fb-copy-refs>Copy references</button>
        </div>
      </section>
      <section class="fb-sec">
        <h4>Slide feedback YAML</h4>
        <div class="fb-actions">
          <button class="btn" type="button" data-fb-compile>Compile slide YAML</button>
          <button class="btn" type="button" data-fb-copy>Copy slide YAML</button>
        </div>
        <pre class="yaml" data-slide-feedback-yaml aria-live="polite"># Compile YAML for the active slide.</pre>
        <textarea class="copy-fallback" data-fb-fallback readonly aria-label="Sidebar copy fallback"></textarea>
      </section>
    </div>
  </aside>`;
}

export function buildDeck(deck) {
  const slidesHtml = deck.slides.map((s, i) => renderSlide(s, i)).join("\n");
  const config = {
    slug: deck.slug,
    command: deck.command,
    briefingPath: deck.briefingPath || `briefing-slides/${deck.slug}.html`,
    references: deck.references || [],
    sourceArtifacts: deck.sourceArtifacts || deck.references || [],
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(deck.title)} — briefing</title>
<style>
${BASE_CSS}
</style>
</head>
<body>
${SKETCH_FILTER}
<header class="deck-topbar">
  <div class="deck-brand"><span>${esc(deck.title)}</span>${deck.subtitle ? `<small>${esc(deck.subtitle)}</small>` : ""}</div>
  <div class="topbar-right">
    <span data-slide-counter>1 / ${deck.slides.length}</span>
    <div class="deck-progress" data-slide-progress aria-label="Deck progress"><span></span></div>
    <button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle theme">☽ Dark</button>
  </div>
</header>
<main class="deck-stage">
${slidesHtml}
</main>
${feedbackPanel()}
<footer class="deck-footer" data-briefing-footer>
  <nav class="filmstrip" data-filmstrip aria-label="Slide filmstrip"></nav>
  <div class="footer-nav">
    <button class="btn" type="button" data-slide-prev aria-label="Previous slide">‹ Prev</button>
    <span data-slide-counter>1 / ${deck.slides.length}</span>
    <button class="btn" type="button" data-slide-next aria-label="Next slide">Next ›</button>
  </div>
</footer>
<script>window.__BRIEFING_DECK__ = ${JSON.stringify(config)};</script>
<script>
${CHROME_JS}
</script>
</body>
</html>
`;
}

// ============================================================================
// ARCHIVE
// ============================================================================
function pad2(n) { return String(n).padStart(2, "0"); }
function archiveExisting(files) {
  const existing = files.filter((f) => existsSync(`${BRIEFING_DIR}/${f}`));
  if (!existing.length) return null;
  const now = new Date();
  const day = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  const time = `${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
  const dir = `${REPO}/docs/history/archive/${day}/${time}/briefing-slides`;
  mkdirSync(dir, { recursive: true });
  for (const f of existing) copyFileSync(`${BRIEFING_DIR}/${f}`, `${dir}/${f}`);
  return dir;
}

// ============================================================================
// GALLERY — every archetype as a conforming deck (living style guide)
// ============================================================================
function galleryDeck() {
  const slides = [];
  slides.push({
    archetype: "hero", title: "Slide Template Gallery",
    eyebrow: "Briefing design system",
    heading: "Slide Archetype Toolbox",
    lead: "Every named archetype, rendered in the theme-aware deck chrome. Toggle the theme (top-right) to preview **light** and **dark**. Copy any archetype from `scripts/generate-briefing-decks.mjs`.",
    meta: [
      { cap: "Archetypes", value: String(Object.keys(A).length) },
      { cap: "Themes", value: "light + dark" },
      { cap: "Tiers", value: "light · rich" },
    ],
    refs: [
      { label: "convention", href: "../docs/briefing-slides-convention.md" },
      { label: "generator", href: "../scripts/generate-briefing-decks.mjs" },
    ],
  });

  // Sample data per archetype for the showcase.
  const samples = sampleData();
  for (const name of GALLERY_ORDER) {
    const s = Object.assign({ archetype: name, title: prettyName(name) }, samples[name]);
    // Add a small "archetype meta" eyebrow describing purpose/tier.
    s.eyebrow = `${A[name].meta.group} · ${A[name].meta.tier} tier`;
    slides.push(s);
  }

  slides.push({
    archetype: "references", title: "References",
    heading: "References",
    items: [
      { kind: "doc", title: "Briefing-slides convention", href: "../docs/briefing-slides-convention.md" },
      { kind: "js", title: "Deck generator (archetype source)", href: "../scripts/generate-briefing-decks.mjs" },
      { kind: "css", title: "Design tokens + chrome", href: "../scripts/briefing-deck-base.css" },
      { kind: "doc", title: "Excalidraw convention", href: "../docs/excalidraw-convention.md" },
    ],
  });
  slides.push({
    archetype: "compiler", title: "Compile", heading: "Review &amp; compile",
    gate: {
      name: "gallery_approve",
      question: "Does the archetype toolbox read as a varied, engaging design system?",
      options: [{ value: "approve", label: "Approve" }, { value: "revise", label: "Revise" }],
      why: "Approving confirms the visual language before regenerating the skill decks.",
    },
    refs: [{ label: "convention", href: "../docs/briefing-slides-convention.md" }],
  });

  return buildDeck({
    slug: "slide-template-gallery",
    title: "Slide Template Gallery",
    subtitle: "Living style guide",
    command: "$create-briefing-slides",
    briefingPath: "briefing-slides/slide-template-gallery.html",
    references: ["docs/briefing-slides-convention.md", "scripts/generate-briefing-decks.mjs", "scripts/briefing-deck-base.css"],
    slides,
  });
}

const GALLERY_ORDER = [
  "divider", "statement", "bigStat", "splitPanel", "comparisonMatrix",
  "scorecard", "featureCards", "timeline", "flowDiagram", "kanbanBoard",
  "anatomy", "layeredStack", "chart", "meterRow",
];

function prettyName(n) {
  return n.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function sampleData() {
  return {
    divider: { index: "PART 02", heading: "Structure &amp; Compare", lead: "Archetypes that put two or more things side by side." },
    statement: { quote: "One idea per slide. **Never** two identical archetypes back to back.", cite: "Archetype selection rule #1" },
    bigStat: {
      heading: "Big-number stat callout",
      stats: [
        { num: "44", cap: "skill decks regenerated", tone: "" },
        { num: "18", unit: "types", cap: "named archetypes", tone: "teal" },
        { num: "2", unit: "themes", cap: "light + dark", tone: "violet", spark: [3, 5, 4, 7, 8, 12] },
      ],
    },
    splitPanel: {
      heading: "When to use it vs when not",
      left: { title: "Reach for it when", items: ["Two states genuinely contrast", "Before / after is the point", "Do vs don't guidance"] },
      right: { title: "Skip it when", items: ["You have 3+ parallel facets", "The relation is sequential", "One side is empty"] },
    },
    comparisonMatrix: {
      heading: "Comparison matrix",
      columns: ["Capability", "Cards grid", "Matrix", "Timeline"],
      rows: [
        ["Parallel facets", { s: "yes", t: "" }, { s: "partial", t: "" }, { s: "no", t: "" }],
        ["Ordered steps", { s: "no", t: "" }, { s: "no", t: "" }, { s: "yes", t: "" }],
        ["Status cells", { s: "no", t: "" }, { s: "yes", t: "" }, { s: "no", t: "" }],
      ],
    },
    scorecard: {
      heading: "Scored options",
      options: [
        { name: "Theme-aware generator", score: "9.2", pct: 92, win: true },
        { name: "Hand-authored per deck", score: "5.1", pct: 51 },
        { name: "Single fixed template", score: "2.4", pct: 24 },
      ],
    },
    featureCards: {
      heading: "Refined feature cards (used sparingly)",
      cols: 3,
      cards: [
        { ic: "🎯", title: "Accent rail", body: "A colored spine keeps cards scannable.", tone: "" },
        { ic: "🧭", title: "Vary columns", body: "2, 3, or 4 — not always the same grid.", tone: "teal" },
        { ic: "⚖️", title: "Not every slide", body: "Cards are one tool, not the default.", tone: "violet" },
      ],
    },
    timeline: {
      heading: "Timeline / stepper",
      steps: [
        { title: "Resolve context", body: "Read repo state and prior artifacts." },
        { title: "Work the frame", body: "Interview, synthesize, or build." },
        { title: "Gate the result", body: "Review and approve before writing." },
      ],
    },
    flowDiagram: {
      heading: "Flow / pipeline (sketchy SVG)",
      nodes: [
        { label: "Dense page", sub: "canonical", tone: "" },
        { label: "Briefing deck", sub: "review surface", tone: "teal" },
        { label: "Compiled YAML", sub: "handoff", tone: "violet" },
      ],
      note: "Sketchy borders via the excalidraw feTurbulence filter; text stays crisp.",
    },
    kanbanBoard: {
      heading: "Register board",
      columns: [
        { title: "Risks", kind: "risk", tickets: ["Card monotony returns", "Dark mode contrast"] },
        { title: "Assumptions", kind: "assumption", tickets: ["6-beat structure holds", "Audit stays functional"] },
        { title: "Open questions", kind: "question", tickets: ["Side-by-side themes?"] },
      ],
    },
    anatomy: {
      heading: "Annotated anatomy",
      focal: `<div style="text-align:center"><div style="font-size:2.4rem">🖼️</div><strong>slide-card</strong></div>`,
      callouts: [
        { title: "Eyebrow", body: "Track + tier label." },
        { title: "Archetype body", body: "The chosen structure." },
        { title: "Reference chips", body: "Per-slide drill-down links." },
      ],
    },
    layeredStack: {
      heading: "Layered stack bands",
      bands: [
        { title: "Deck chrome", body: "nav, filmstrip, sidebar, YAML", tag: "shared" },
        { title: "Archetype toolbox", body: "composable slide templates", tag: "toolbox" },
        { title: "Deck manifest", body: "per-skill content beats", tag: "content" },
      ],
    },
    chart: {
      heading: "Chart slide (SVG + table fallback)",
      axisLabel: "Archetype group",
      data: [
        { label: "Framing", value: 4 },
        { label: "Structure", value: 4 },
        { label: "Process", value: 5 },
        { label: "Data", value: 2 },
        { label: "Meta", value: 3 },
      ],
    },
    meterRow: {
      heading: "Meter / gauge row",
      gauges: [
        { label: "Variety", value: 88, tone: "" },
        { label: "Legibility", value: 94, tone: "green" },
        { label: "Fit-to-slide", value: 76, tone: "gold" },
      ],
    },
  };
}

// ============================================================================
// CLI
// ============================================================================
function writeDeck(filename, html) {
  writeFileSync(`${BRIEFING_DIR}/${filename}`, html);
  return filename;
}

// ============================================================================
// BATCH — regenerate every deck from the manifest + flagships + gallery +
// overviews + a restyled theme-aware index. This is the default (no-arg) mode.
// ============================================================================
async function runBatch({ auditVariety } = {}) {
  const manifest = loadManifest();
  const { FLAGSHIP_DECKS } = await import("./briefing-deck-flagships.mjs");

  // Capture the current index catalog BEFORE archiving/overwriting it.
  const indexHtml = existsSync(`${BRIEFING_DIR}/index.html`)
    ? readFileSync(`${BRIEFING_DIR}/index.html`, "utf8")
    : "";
  const indexSections = parseIndexSections(indexHtml);

  // Archive every current deck (copies; originals stay in place).
  const allHtml = readdirSync(BRIEFING_DIR).filter((f) => f.endsWith(".html")).sort();
  const out = archiveExisting(allHtml);

  // 1) Manifest-driven skill decks with rotating archetypes.
  manifest.decks.forEach((entry, i) => {
    const deck = manifestToDeck(entry, i);
    writeDeck(`afps-skill-${entry.slug}.html`, buildDeck(deck));
    if (auditVariety) {
      console.log(`  variety[${String(i).padStart(2)}] ${entry.slug.padEnd(24)} ${deckArchetypeSequence(entry, i).join(" · ")}`);
    }
  });
  console.log(`manifest -> ${manifest.decks.length} skill decks (afps-skill-*.html)`);

  // 2) Flagship (bespoke) decks — idea-scope-brief, create-briefing-slides, release-lane.
  for (const deck of FLAGSHIP_DECKS) {
    writeDeck(`${deck.slug}.html`, buildDeck(deck));
  }
  console.log(`flagships -> ${FLAGSHIP_DECKS.map((d) => d.slug).join(", ")}`);

  // 3) Living style-guide gallery.
  writeDeck("slide-template-gallery.html", galleryDeck());
  console.log("gallery -> briefing-slides/slide-template-gallery.html");

  // 4) Manifest-derived overviews deck.
  const overviews = buildOverviewsDeck(manifest, buildDeck);
  writeDeck("afps-skill-overviews.html", overviews);
  const overviewsSlideCount = (overviews.match(/<section\b[^>]*\bdata-briefing-slide/g) || []).length;
  console.log("overviews -> briefing-slides/afps-skill-overviews.html");

  // 5) Restyled theme-aware index catalog (mirrors the current section layout).
  writeDeck("index.html", renderIndex(indexSections, BASE_CSS, { overviewsSlideCount }));
  console.log("index -> briefing-slides/index.html");

  if (out) console.log(`archived prior decks to ${out.replace(REPO + "/", "")}`);
}

async function main() {
  const argv = process.argv.slice(2);
  const wantGallery = argv.includes("--gallery");
  const wantFlagships = argv.includes("--flagships");
  const wantManifest = argv.includes("--manifest") || argv.includes("--batch");
  const auditVariety = argv.includes("--audit-variety");
  const deckArg = argv.includes("--deck") ? argv[argv.indexOf("--deck") + 1] : null;
  const targeted = wantGallery || wantFlagships || deckArg;

  if (wantGallery) {
    const out = archiveExisting(["slide-template-gallery.html"]);
    const html = galleryDeck();
    writeDeck("slide-template-gallery.html", html);
    console.log(`gallery -> briefing-slides/slide-template-gallery.html${out ? ` (archived prior to ${out.replace(REPO + "/", "")})` : ""}`);
  }

  if (wantFlagships) {
    const { FLAGSHIP_DECKS } = await import("./briefing-deck-flagships.mjs");
    const files = FLAGSHIP_DECKS.map((d) => `${d.slug}.html`);
    const out = archiveExisting(files);
    for (const deck of FLAGSHIP_DECKS) {
      writeDeck(`${deck.slug}.html`, buildDeck(deck));
      console.log(`deck    -> briefing-slides/${deck.slug}.html`);
    }
    if (out) console.log(`archived prior flagships to ${out.replace(REPO + "/", "")}`);
  }

  if (deckArg) {
    const { FLAGSHIP_DECKS } = await import("./briefing-deck-flagships.mjs");
    let deck = FLAGSHIP_DECKS.find((d) => d.slug === deckArg || d.slug === `afps-skill-${deckArg}`);
    let filename = deck ? `${deck.slug}.html` : null;
    if (!deck) {
      const manifest = loadManifest();
      const idx = manifest.decks.findIndex((e) => e.slug === deckArg || `afps-skill-${e.slug}` === deckArg);
      if (idx >= 0) {
        deck = manifestToDeck(manifest.decks[idx], idx);
        filename = `afps-skill-${manifest.decks[idx].slug}.html`;
      }
    }
    if (!deck) { console.error(`No deck named ${deckArg} in flagships or manifest`); process.exit(1); }
    archiveExisting([filename]);
    writeDeck(filename, buildDeck(deck));
    console.log(`deck    -> briefing-slides/${filename}`);
  }

  // Default (no targeted flag) or explicit --manifest/--batch: full regenerate.
  if (!targeted || wantManifest) {
    await runBatch({ auditVariety });
  }
}

main();
