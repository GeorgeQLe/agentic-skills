#!/usr/bin/env node
// Read-only convention audit for active interrogation/*.html pages, so direct
// edits made without invoking a skill can be checked against
// docs/interrogation-page-convention.md. Archived pages under
// docs/history/archive/ are out of scope. No write/fix mode: TTS diagnostics
// point at node scripts/inject-tts.mjs --dir interrogation, the rest are
// manual fixes.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { collapsingFillDiagnostics } from "./lib/collapsing-fill-audit.mjs";

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
const interrogationDir = `${repoRoot}/interrogation`;

const TIERS = new Set(["document", "visual", "prototype"]);
const STATUSES = new Set(["review", "confirmed"]);
const GATES = new Set(["continue", "coverage-checkpoint"]);
const KOKORO_TAG_RE = /<script\b[^>]*\bsrc="[^"]*alignment-tts-kokoro\.js"[^>]*><\/script>/;
const INLINE_TTS_RE = /alignTTS|\/\/ --- Brief Me TTS ---/;
const FILENAME_RE = /^[a-z0-9-]+-r(\d+)-[a-z0-9-]+\.html$/;
const OPEN_INPUT_RE = /<(?:textarea|input)\b[^>]*\bdata-open-input\b/i;
const OPEN_QUESTION_TAG_RE = /<[^>]*\bdata-open-question\b[^>]*>/gi;
const RECOMMENDED_ANSWER_TAG_RE = /<[^>]*\bdata-recommended-answer\b[^>]*>/gi;
const AGENT_RECOMMENDED_ANSWER_TAG_RE = /<[^>]*\bdata-agent-recommended-answer\b[^>]*>/gi;
const AGENT_CONFIDENCE_RE = /\bdata-agent-confidence="([^"]*)"/gi;
const CLARIFY_COPY_RE = /<button\b[^>]*\bdata-clarify-copy\b/gi;
const APPLY_RECOMMENDED_RE = /<button\b[^>]*\bdata-apply-recommended\b/gi;
const CONFIDENCE_VALUES = new Set(["high", "medium", "low"]);
const SIDECAR_VALUE_RE = /interrogation-[a-z0-9-]+-r\d+\.yaml/;
const HIDDEN_CLASS_VALUES = new Set(["hidden", "is-hidden", "u-hidden", "visually-hidden", "sr-only", "screen-reader-only"]);

const pages = existsSync(interrogationDir)
  ? readdirSync(interrogationDir).filter((f) => f.endsWith(".html") && f !== "index.html").sort()
  : [];

const ttsDiagnostics = [];
const metadataDiagnostics = [];
const viewportDiagnostics = [];
const embedDiagnostics = [];
const openInputDiagnostics = [];
const openQuestionDiagnostics = [];
const gateDiagnostics = [];
const namingDiagnostics = [];
const sidecarDiagnostics = [];
const collapsingFillDiag = [];

function checkAttribute(htmlTag, rel, attribute, allowed) {
  const match = htmlTag.match(new RegExp(`\\b${attribute}="([^"]*)"`));
  if (!match) {
    metadataDiagnostics.push(
      `Missing ${attribute} on <html> in ${rel} — set one of: ${[...allowed].join(", ")}.`,
    );
    return null;
  }
  if (!allowed.has(match[1])) {
    metadataDiagnostics.push(
      `Invalid ${attribute} "${match[1]}" in ${rel} — must be one of: ${[...allowed].join(", ")}.`,
    );
  }
  return match[1];
}

function attrValue(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? (match[2] ?? match[3] ?? match[4] ?? "") : null;
}

function hasBooleanAttribute(tag, attribute) {
  return new RegExp(`\\b${attribute}(?:\\s*=|\\s|/?>)`, "i").test(tag);
}

function isHiddenAgentRecommendedAnswer(tag) {
  if (hasBooleanAttribute(tag, "hidden")) return true;
  if (attrValue(tag, "type")?.toLowerCase() === "hidden") return true;
  if (attrValue(tag, "aria-hidden")?.toLowerCase() === "true") return true;

  const style = attrValue(tag, "style")?.toLowerCase() ?? "";
  if (/(^|;)\s*display\s*:\s*none(?:\s*;|$)/.test(style)) return true;
  if (/(^|;)\s*visibility\s*:\s*hidden(?:\s*;|$)/.test(style)) return true;

  const classes = (attrValue(tag, "class") ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return classes.some((className) => HIDDEN_CLASS_VALUES.has(className));
}

for (const file of pages) {
  const rel = `interrogation/${file}`;
  const html = readFileSync(`${interrogationDir}/${file}`, "utf8");

  if (!/<meta[^>]*\bname=["']viewport["']/.test(html)) {
    viewportDiagnostics.push(
      `Missing viewport meta in ${rel} — add <meta name="viewport" content="width=device-width, initial-scale=1"> to the head.`,
    );
  }

  const embedTags = new Set();
  for (const match of html.matchAll(/<(object|iframe|embed)\b/gi)) {
    embedTags.add(`<${match[1].toLowerCase()}>`);
  }
  if (embedTags.size) {
    embedDiagnostics.push(
      `Embedded content in ${rel} — uses ${[...embedTags].sort().join(", ")}; the embed prohibition requires rendering content directly in the page.`,
    );
  }

  collapsingFillDiag.push(...collapsingFillDiagnostics(html, rel));

  const kokoroTag = html.match(KOKORO_TAG_RE);
  if (!kokoroTag) {
    if (INLINE_TTS_RE.test(html)) {
      ttsDiagnostics.push(
        `Inline TTS in ${rel} — the Brief Me script must be the src tag, never inlined. Run node scripts/inject-tts.mjs --dir interrogation --force ${rel} to replace it.`,
      );
    } else {
      ttsDiagnostics.push(
        `Missing TTS include in ${rel} — every interrogation page needs <script src="../scripts/alignment-tts-kokoro.js"></script> before </body>. Run node scripts/inject-tts.mjs --dir interrogation ${rel} to add it.`,
      );
    }
  } else if (/\btype="module"/.test(kokoroTag[0])) {
    ttsDiagnostics.push(
      `Module TTS tag in ${rel} — type="module" scripts are blocked by CORS on file:// URLs. Run node scripts/inject-tts.mjs --dir interrogation --force ${rel} to replace it.`,
    );
  } else if (INLINE_TTS_RE.test(html)) {
    ttsDiagnostics.push(
      `Leftover inline TTS in ${rel} beside the src tag. Run node scripts/inject-tts.mjs --dir interrogation --force ${rel} to clean it up.`,
    );
  }

  const htmlTag = html.match(/<html\b[^>]*>/);
  let roundAttr = null;
  if (!htmlTag) {
    metadataDiagnostics.push(`Missing <html> element in ${rel} — cannot carry the required data attributes.`);
  } else {
    checkAttribute(htmlTag[0], rel, "data-visual-tier", TIERS);
    checkAttribute(htmlTag[0], rel, "data-interrogation-status", STATUSES);
    const roundMatch = htmlTag[0].match(/\bdata-interrogation-round="([^"]*)"/);
    if (!roundMatch) {
      metadataDiagnostics.push(`Missing data-interrogation-round on <html> in ${rel} — set the 1-based round number.`);
    } else if (!/^\d+$/.test(roundMatch[1])) {
      metadataDiagnostics.push(`Invalid data-interrogation-round "${roundMatch[1]}" in ${rel} — must be a positive integer.`);
    } else {
      roundAttr = roundMatch[1];
    }
  }

  // Round-file naming and round/filename agreement.
  const nameMatch = file.match(FILENAME_RE);
  if (!nameMatch) {
    namingDiagnostics.push(
      `Invalid interrogation page name ${rel} — must match {skill}-r{N}-{branch}.html (e.g. positioning-r1-acme.html).`,
    );
  } else if (roundAttr !== null && roundAttr !== nameMatch[1]) {
    namingDiagnostics.push(
      `Round mismatch in ${rel} — filename says r${nameMatch[1]} but data-interrogation-round="${roundAttr}".`,
    );
  }

  // The ≥1-open-input rule.
  if (!OPEN_INPUT_RE.test(html)) {
    openInputDiagnostics.push(
      `No open input in ${rel} — each round must contain at least one genuinely open input (textarea or text input) marked with data-open-input that shapes downstream research.`,
    );
  }

  // Open-question block markers: each data-open-question block must carry a
  // visible recommendation, a hidden agent recommendation, an agent-confidence
  // badge, a clarify-copy button, and an apply-recommended button.
  // Count-based association keeps this robust without a DOM parser.
  const openQuestionCount = (html.match(OPEN_QUESTION_TAG_RE) || []).length;
  if (openQuestionCount < 1) {
    openQuestionDiagnostics.push(
      `No open-question block in ${rel} — each round must contain at least one well-formed data-open-question block wrapping an open input with a visible recommended answer, hidden agent recommended answer, confidence badge, clarify-copy button, and apply-recommended button.`,
    );
  } else {
    const recommendedCount = (html.match(RECOMMENDED_ANSWER_TAG_RE) || []).length;
    const agentRecommendedTags = [...html.matchAll(AGENT_RECOMMENDED_ANSWER_TAG_RE)].map((match) => match[0]);
    const confidenceMatches = [...html.matchAll(AGENT_CONFIDENCE_RE)];
    const clarifyCount = (html.match(CLARIFY_COPY_RE) || []).length;
    const applyRecommendedCount = (html.match(APPLY_RECOMMENDED_RE) || []).length;
    if (recommendedCount < openQuestionCount) {
      openQuestionDiagnostics.push(
        `Missing recommended answer in ${rel} — found ${openQuestionCount} data-open-question block(s) but only ${recommendedCount} data-recommended-answer element(s); each open question needs a recommended/example answer.`,
      );
    }
    if (agentRecommendedTags.length < openQuestionCount) {
      openQuestionDiagnostics.push(
        `Missing hidden agent recommended answer in ${rel} — found ${openQuestionCount} data-open-question block(s) but only ${agentRecommendedTags.length} data-agent-recommended-answer element(s); each open question needs a hidden agent-facing answer payload.`,
      );
    }
    for (const tag of agentRecommendedTags) {
      if (!isHiddenAgentRecommendedAnswer(tag)) {
        openQuestionDiagnostics.push(
          `Visible agent recommended answer in ${rel} — each data-agent-recommended-answer element must be hidden using hidden, type="hidden", aria-hidden="true", display:none/visibility:hidden style, or a recognized hidden class.`,
        );
      }
    }
    if (confidenceMatches.length < openQuestionCount) {
      openQuestionDiagnostics.push(
        `Missing agent-confidence badge in ${rel} — found ${openQuestionCount} data-open-question block(s) but only ${confidenceMatches.length} data-agent-confidence badge(s); each open question needs a data-agent-confidence="high|medium|low" badge.`,
      );
    }
    for (const match of confidenceMatches) {
      if (!CONFIDENCE_VALUES.has(match[1])) {
        openQuestionDiagnostics.push(
          `Invalid data-agent-confidence "${match[1]}" in ${rel} — must be one of: ${[...CONFIDENCE_VALUES].join(", ")}.`,
        );
      }
    }
    if (clarifyCount < openQuestionCount) {
      openQuestionDiagnostics.push(
        `Missing clarify-copy button in ${rel} — found ${openQuestionCount} data-open-question block(s) but only ${clarifyCount} data-clarify-copy button(s); each open question needs a Need-clarification copy button.`,
      );
    }
    if (applyRecommendedCount < openQuestionCount) {
      openQuestionDiagnostics.push(
        `Missing apply-recommended button in ${rel} — found ${openQuestionCount} data-open-question block(s) but only ${applyRecommendedCount} data-apply-recommended button(s); each open question needs an Apply recommended button.`,
      );
    }
  }

  // Confidence/coverage exit gate.
  const gateMatch = html.match(/\bdata-interrogation-gate="([^"]*)"/);
  if (!gateMatch) {
    gateDiagnostics.push(
      `Missing data-interrogation-gate in ${rel} — set continue (more rounds expected) or coverage-checkpoint (loop exit).`,
    );
  } else if (!GATES.has(gateMatch[1])) {
    gateDiagnostics.push(
      `Invalid data-interrogation-gate "${gateMatch[1]}" in ${rel} — must be one of: ${[...GATES].join(", ")}.`,
    );
  }

  // Answer-sidecar reference.
  const sidecarMatch = html.match(/\bdata-answer-sidecar="([^"]*)"/);
  if (!sidecarMatch) {
    sidecarDiagnostics.push(
      `Missing data-answer-sidecar in ${rel} — name the round's capture file (research/_working/interrogation-{skill}-r{N}.yaml) on the compile section.`,
    );
  } else if (!SIDECAR_VALUE_RE.test(sidecarMatch[1])) {
    sidecarDiagnostics.push(
      `Invalid data-answer-sidecar "${sidecarMatch[1]}" in ${rel} — must point at an interrogation-{skill}-r{N}.yaml capture file.`,
    );
  }
}

console.log(`Active pages: ${pages.length}`);
console.log(`TTS include: ${pages.length} pages, ${ttsDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Page metadata: ${pages.length} pages, ${metadataDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Viewport meta: ${pages.length} pages, ${viewportDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Embed prohibition: ${pages.length} pages, ${embedDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Open input: ${pages.length} pages, ${openInputDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Open question: ${pages.length} pages, ${openQuestionDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Confidence gate: ${pages.length} pages, ${gateDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Round naming: ${pages.length} pages, ${namingDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Answer sidecar: ${pages.length} pages, ${sidecarDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Collapsing fill: ${pages.length} pages, ${collapsingFillDiag.length ? "DRIFT" : "exact"}`);

const groups = [
  ["TTS include drift:", ttsDiagnostics],
  ["Page metadata drift:", metadataDiagnostics],
  ["Viewport drift:", viewportDiagnostics],
  ["Embed prohibition drift:", embedDiagnostics],
  ["Open input drift:", openInputDiagnostics],
  ["Open question drift:", openQuestionDiagnostics],
  ["Confidence gate drift:", gateDiagnostics],
  ["Round naming drift:", namingDiagnostics],
  ["Answer sidecar drift:", sidecarDiagnostics],
  ["Collapsing fill drift:", collapsingFillDiag],
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
