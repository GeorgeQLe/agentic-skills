#!/usr/bin/env node
// Read-only convention audit for active briefing-slides/*.html decks.
// Archived decks under docs/history/archive/ are out of scope because this
// script only scans the top-level briefing-slides directory.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const argv = process.argv.slice(2);
let rootOverride = null;
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === "--root") {
    rootOverride = argv[i + 1];
    i += 1;
    if (!rootOverride) {
      console.error("--root requires a path argument");
      process.exit(1);
    }
  }
}

const repoRoot = rootOverride ? resolve(rootOverride) : dirname(dirname(fileURLToPath(import.meta.url)));
const briefingDir = `${repoRoot}/briefing-slides`;

const YAML_JOIN_NEWLINE_RE = /\.join\(\s*(["'])\\\\n\1\s*\)/;
const TAG_RE = /<([a-z][a-z0-9:-]*)\b[^>]*>/gi;
const ANCHOR_RE = /<a\b[^>]*\bhref\s*=\s*(["'])([^"']+\.ya?ml(?:#[^"']*)?)\1[^>]*>[\s\S]*?<\/a>/gi;
const REQUIRED_GATE_CONTROL_RE =
  /<(?:input|select|textarea)\b(?=[^>]*(?:\brequired\b|\baria-required\s*=\s*["']?true["']?))(?=[^>]*(?:\bdata-(?:gate-answer|required-gate|gate-question|required-question)\b|\bname\s*=\s*(["'])[^"']*(?:gate|question|approval)[^"']*\1))[^>]*>/i;
const GATE_STATUS_UPDATE_RE =
  /\bsetAttribute\(\s*(["'])data-gate-status\1|\.dataset\.gateStatus\s*=|\bdataset\[\s*(["'])gateStatus\2\s*\]\s*=/;
const NAV_PATTERNS = {
  previous: /\bdata-(?:slide-)?prev(?:ious)?\b|\baria-label\s*=\s*["'][^"']*(?:previous|prev)\b[^"']*["']|>\s*(?:previous|prev|back|<)/i,
  next: /\bdata-(?:slide-)?next\b|\baria-label\s*=\s*["'][^"']*next\b[^"']*["']|>\s*(?:next|forward|>)/i,
  counter: /\bdata-(?:briefing-)?slide-counter\b|\bclass\s*=\s*["'][^"']*(?:slide-counter|counter)[^"']*["']/i,
  progress: /\bdata-(?:briefing-)?slide-progress\b|<progress\b|\bclass\s*=\s*["'][^"']*(?:slide-progress|progress-track|progress)[^"']*["']/i,
};
const REFERENCE_RE =
  /\bdata-reference(?:s|-chip)?\b|\bclass\s*=\s*["'][^"']*\breference-chip\b|<a\b[^>]*\bhref\s*=\s*["'][^"']*(?:\.\.\/)?(?:alignment|interrogation|research|docs|packs|tasks)\/[^"']+["']/i;
const REFERENCES_SLIDE_RE =
  /\bdata-references-slide\b|<[^>]*\bdata-briefing-slide\b[^>]*(?:\bid|\bdata-slide-id)\s*=\s*["']references["']|<h[1-6]\b[^>]*>\s*references\s*<\/h[1-6]>/i;
const YAML_FIELDS = [
  ["command", /\bcommand\s*:/],
  ["briefing_slides", /\bbriefing_slides\s*:/],
  ["slide_feedback", /\bslide_feedback\s*:/],
  ["approval_status", /\bapproval_status\s*:/],
];

const pages = existsSync(briefingDir)
  ? readdirSync(briefingDir).filter((f) => f.endsWith(".html")).sort()
  : [];
const activeDecks = pages.filter((f) => f !== "index.html");

const viewportDiagnostics = [];
const embedDiagnostics = [];
const structureDiagnostics = [];
const navigationDiagnostics = [];
const printDiagnostics = [];
const referenceDiagnostics = [];
const feedbackDiagnostics = [];
const yamlDiagnostics = [];
const footerDiagnostics = [];
const sidecarDiagnostics = [];
const yamlJoinDiagnostics = [];
const gateBorderDiagnostics = [];

function hasAttribute(tag, attribute) {
  return new RegExp(`\\b${attribute}(?:\\s*=|\\s|/?>)`, "i").test(tag);
}

function attrValue(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? (match[2] ?? match[3] ?? match[4] ?? "") : null;
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function tagsWithAttribute(html, attribute) {
  const matches = [];
  for (const match of html.matchAll(TAG_RE)) {
    const tag = match[0];
    if (hasAttribute(tag, attribute)) {
      matches.push({ tag, index: match.index ?? 0 });
    }
  }
  return matches;
}

function slideSegments(html) {
  const slideTags = tagsWithAttribute(html, "data-briefing-slide");
  return slideTags.map((slide, index) => ({
    tag: slide.tag,
    index,
    start: slide.index,
    end: slideTags[index + 1]?.index ?? html.length,
    content: html.slice(slide.index, slideTags[index + 1]?.index ?? html.length),
  }));
}

function displaySlideName(slide) {
  const id = attrValue(slide.tag, "data-slide-id") || attrValue(slide.tag, "id");
  return id ? `slide "${id}"` : `slide ${slide.index + 1}`;
}

function closingTagEnd(html, tagName, startIndex) {
  const close = html.indexOf(`</${tagName}>`, startIndex);
  return close === -1 ? -1 : close + tagName.length + 3;
}

function collectFooterBlocks(html) {
  const blocks = [];
  const seen = new Set();
  const footerRe = /<footer\b[^>]*>[\s\S]*?<\/footer>/gi;
  for (const match of html.matchAll(footerRe)) {
    blocks.push(match[0]);
    seen.add(match.index ?? -1);
  }

  for (const match of html.matchAll(TAG_RE)) {
    const tag = match[0];
    const index = match.index ?? 0;
    if (seen.has(index)) continue;
    if (
      hasAttribute(tag, "data-briefing-footer") ||
      /\b(?:class|id)\s*=\s*["'][^"']*(?:bottom-bar|bottombar|footer)[^"']*["']/i.test(tag)
    ) {
      const tagName = match[1].toLowerCase();
      const end = closingTagEnd(html, tagName, index);
      blocks.push(end === -1 ? tag : html.slice(index, end));
      seen.add(index);
    }
  }
  return blocks;
}

function footerFindings(block) {
  const findings = [];
  const checks = [
    [/<(?:input|select|textarea)\b[^>]*(?:\brequired\b|\bdata-(?:gate|gate-answer|required-gate|open-input)\b)/i, "required gate inputs"],
    [/<(?:input|select|textarea)\b[^>]*(?:\brequired\b|\bdata-feedback(?:\b|-)|\bname\s*=\s*["'][^"']*feedback[^"']*["'])/i, "required feedback inputs"],
    [/<(?:button|input|select|textarea)\b[^>]*(?:\bdata-approval\b|\bapproval_status\b|\bready-for-agent-review\b|\bnot-approved\b|\bapprove\b)/i, "approval controls"],
    [/<textarea\b[^>]*(?:\bdata-slide-feedback-yaml\b|\bdata-full-deck-yaml\b|\byaml\b)/i, "YAML textarea"],
  ];
  for (const [pattern, label] of checks) {
    if (pattern.test(block)) findings.push(label);
  }
  return findings;
}

function isReferenceOrProvenanceArea(html, anchorIndex) {
  const before = html.slice(Math.max(0, anchorIndex - 1200), anchorIndex).toLowerCase();
  const after = html.slice(anchorIndex, Math.min(html.length, anchorIndex + 500)).toLowerCase();
  const window = `${before}\n${after}`;
  return (
    /\bdata-references-slide\b|\bdata-provenance\b|\bdata-source-artifacts\b|\bdata-source_artifacts\b/.test(window) ||
    /<(?:section|article|aside|div)\b[^>]*(?:\bid|\bclass)\s*=\s*["'][^"']*(?:references?|provenance|source-artifacts?|source_artifacts)[^"']*["']/.test(window) ||
    /<h[1-6]\b[^>]*>\s*(?:references?|provenance|source artifacts)\s*<\/h[1-6]>/.test(window)
  );
}

function isPrimaryActionAnchor(anchorHtml) {
  const text = stripTags(anchorHtml);
  return (
    /\b(?:class|role)\s*=\s*["'][^"']*(?:button|primary|action|cta)[^"']*["']/i.test(anchorHtml) ||
    /\b(?:open|download|copy|use|review|compiled|prior|sidecar|yaml)\b/i.test(text)
  );
}

function containsRequiredGateQuestion(content) {
  return REQUIRED_GATE_CONTROL_RE.test(content) || /\bdata-required-gate-question(?:\s*=|\s|\/?>)/i.test(content);
}

function hasRequiredGateSlideMarker(tag) {
  return hasAttribute(tag, "data-required-gate-slide");
}

function hasGateStatus(tag) {
  return /\bdata-gate-status\s*=\s*(["'])(?:unanswered|answered)\1|\bdata-gate-status\s*=\s*(?:unanswered|answered)(?:\s|\/?>)/i.test(
    tag,
  );
}

function hasGateBorderRule(html, status) {
  const styleBlocks = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .join("\n");
  const css = styleBlocks || html;
  const colorToken =
    status === "unanswered"
      ? /--(?:required-)?gate-(?:unanswered|border-unanswered)|--(?:red|danger|error)|\b(?:red|danger|error)\b|#(?:b42318|b91c1c|dc2626|d92d20|ef4444|f85149)\b/i
      : /--(?:required-)?gate-(?:answered|border-answered)|--(?:green|success)|\b(?:green|success)\b|#(?:027a48|15803d|16803c|16a34a|22c55e|3fb950)\b/i;

  for (const match of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
    const selector = match[1];
    const body = match[2];
    if (
      /\[data-required-gate-slide\]/i.test(selector) &&
      /\[data-gate-status\s*=\s*(["']?)(?:unanswered|answered)\1\]/i.test(selector) &&
      new RegExp(`\\b${status}\\b`, "i").test(selector) &&
      /\bborder(?:-[a-z-]+)?\s*:/.test(body) &&
      colorToken.test(body)
    ) {
      return true;
    }
  }
  return false;
}

for (const file of pages) {
  const rel = `briefing-slides/${file}`;
  const html = readFileSync(`${briefingDir}/${file}`, "utf8");

  if (!/<meta[^>]*\bname=["']viewport["']/.test(html)) {
    viewportDiagnostics.push(
      `Missing viewport meta in ${rel} - add <meta name="viewport" content="width=device-width, initial-scale=1"> to the head.`,
    );
  }

  const embedTags = new Set();
  for (const match of html.matchAll(/<(object|iframe|embed)\b/gi)) {
    embedTags.add(`<${match[1].toLowerCase()}>`);
  }
  if (embedTags.size) {
    embedDiagnostics.push(
      `Embedded content in ${rel} - uses ${[...embedTags].sort().join(", ")}; render references directly as links/chips instead.`,
    );
  }

  if (YAML_JOIN_NEWLINE_RE.test(html)) {
    yamlJoinDiagnostics.push(
      `Double-escaped YAML newline join in ${rel} - compiled YAML uses .join("\\\\n"), so the textarea renders literal backslash-n separators. Use .join("\\n").`,
    );
  }

  for (const match of html.matchAll(ANCHOR_RE)) {
    const anchorHtml = match[0];
    if (!isReferenceOrProvenanceArea(html, match.index ?? 0) && isPrimaryActionAnchor(anchorHtml)) {
      sidecarDiagnostics.push(
        `Promoted YAML sidecar link in ${rel} - keep ${match[2]} in source_artifacts or a References/Provenance slide, not as a primary action link.`,
      );
    }
  }

  for (const [index, block] of collectFooterBlocks(html).entries()) {
    const findings = footerFindings(block);
    if (findings.length) {
      footerDiagnostics.push(
        `Footer/bottom bar controls in ${rel} block ${index + 1} - footer may show navigation/progress and compact status only. Found: ${findings.join(", ")}.`,
      );
    }
  }

  if (file === "index.html") continue;

  const slides = slideSegments(html);
  if (slides.length === 0) {
    structureDiagnostics.push(
      `Missing data-briefing-slide roots in ${rel} - every active deck needs at least one slide root marked data-briefing-slide.`,
    );
  }

  const missingNav = [];
  for (const [name, pattern] of Object.entries(NAV_PATTERNS)) {
    if (!pattern.test(html)) missingNav.push(name);
  }
  if (missingNav.length) {
    navigationDiagnostics.push(
      `Missing presentation navigation in ${rel} - required affordance(s): ${missingNav.join(", ")}.`,
    );
  }

  if (!/@media\s+print\b/i.test(html)) {
    printDiagnostics.push(
      `Missing print CSS in ${rel} - add @media print rules that produce one slide per page.`,
    );
  }

  if (!REFERENCE_RE.test(html) && !REFERENCES_SLIDE_RE.test(html)) {
    referenceDiagnostics.push(
      `Missing references in ${rel} - include per-slide reference chips/links or a References slide.`,
    );
  }

  for (const slide of slides) {
    if (!/\bdata-feedback-trigger(?:\s*=|\s|\/?>)/i.test(slide.content)) {
      feedbackDiagnostics.push(
        `Missing data-feedback-trigger in ${rel} ${displaySlideName(slide)} - every slide needs a slide-scoped feedback trigger.`,
      );
    }

    if (containsRequiredGateQuestion(slide.content)) {
      if (!hasRequiredGateSlideMarker(slide.tag)) {
        gateBorderDiagnostics.push(
          `Missing required-gate slide marker in ${rel} ${displaySlideName(slide)} - slides with required gate questions must mark the slide root data-required-gate-slide.`,
        );
      }
      if (!hasGateStatus(slide.tag)) {
        gateBorderDiagnostics.push(
          `Missing required-gate slide status in ${rel} ${displaySlideName(slide)} - required gate slides must initialize data-gate-status to unanswered or answered.`,
        );
      }
    }
  }

  if (slides.some((slide) => containsRequiredGateQuestion(slide.content))) {
    if (!hasGateBorderRule(html, "unanswered")) {
      gateBorderDiagnostics.push(
        `Missing unanswered required-gate border style in ${rel} - use a red border rule for [data-required-gate-slide][data-gate-status="unanswered"].`,
      );
    }
    if (!hasGateBorderRule(html, "answered")) {
      gateBorderDiagnostics.push(
        `Missing answered required-gate border style in ${rel} - use a green border rule for [data-required-gate-slide][data-gate-status="answered"].`,
      );
    }
    if (!GATE_STATUS_UPDATE_RE.test(html)) {
      gateBorderDiagnostics.push(
        `Missing required-gate status updater in ${rel} - update data-gate-status when required gate answers change.`,
      );
    }
  }

  if (!/\bdata-slide-feedback-panel(?:\s*=|\s|\/?>)/i.test(html)) {
    feedbackDiagnostics.push(
      `Missing slide feedback panel in ${rel} - add a sidebar/drawer marked data-slide-feedback-panel.`,
    );
  }

  if (!/\bdata-slide-feedback-yaml(?:\s*=|\s|\/?>)/i.test(html)) {
    yamlDiagnostics.push(
      `Missing local slide-feedback YAML in ${rel} - add a slide feedback YAML output marked data-slide-feedback-yaml.`,
    );
  }

  if (!/\bdata-full-deck-yaml(?:\s*=|\s|\/?>)/i.test(html)) {
    yamlDiagnostics.push(
      `Missing full-deck YAML compiler in ${rel} - add a final response compiler marked data-full-deck-yaml.`,
    );
  }

  for (const [field, pattern] of YAML_FIELDS) {
    if (!pattern.test(html)) {
      yamlDiagnostics.push(
        `Missing YAML field ${field} in ${rel} - compiled briefing YAML must include ${field}.`,
      );
    }
  }
}

console.log(`Active decks: ${activeDecks.length}`);
console.log(`Viewport meta: ${pages.length} pages, ${viewportDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Embed prohibition: ${pages.length} pages, ${embedDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Slide structure: ${activeDecks.length} decks, ${structureDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Presentation navigation: ${activeDecks.length} decks, ${navigationDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Print CSS: ${activeDecks.length} decks, ${printDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`References: ${activeDecks.length} decks, ${referenceDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Slide feedback: ${activeDecks.length} decks, ${feedbackDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`YAML compiler: ${activeDecks.length} decks, ${yamlDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Footer controls: ${pages.length} pages, ${footerDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`YAML sidecar links: ${pages.length} pages, ${sidecarDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Compiled-YAML newline join: ${pages.length} pages, ${yamlJoinDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Required gate borders: ${activeDecks.length} decks, ${gateBorderDiagnostics.length ? "DRIFT" : "exact"}`);

const groups = [
  ["Viewport drift:", viewportDiagnostics],
  ["Embed prohibition drift:", embedDiagnostics],
  ["Slide structure drift:", structureDiagnostics],
  ["Presentation navigation drift:", navigationDiagnostics],
  ["Print CSS drift:", printDiagnostics],
  ["References drift:", referenceDiagnostics],
  ["Slide feedback drift:", feedbackDiagnostics],
  ["YAML compiler drift:", yamlDiagnostics],
  ["Footer controls drift:", footerDiagnostics],
  ["YAML sidecar link drift:", sidecarDiagnostics],
  ["Compiled-YAML newline join drift:", yamlJoinDiagnostics],
  ["Required gate border drift:", gateBorderDiagnostics],
];
let failed = false;
for (const [title, diagnostics] of groups) {
  if (!diagnostics.length) continue;
  failed = true;
  console.error("");
  console.error(title);
  for (const diagnostic of diagnostics) console.error(`  - ${diagnostic}`);
}
if (failed) process.exit(1);
