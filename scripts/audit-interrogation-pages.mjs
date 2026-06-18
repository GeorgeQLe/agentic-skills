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
const SIDECAR_VALUE_RE = /interrogation-[a-z0-9-]+-r\d+\.yaml/;

const pages = existsSync(interrogationDir)
  ? readdirSync(interrogationDir).filter((f) => f.endsWith(".html") && f !== "index.html").sort()
  : [];

const ttsDiagnostics = [];
const metadataDiagnostics = [];
const viewportDiagnostics = [];
const embedDiagnostics = [];
const openInputDiagnostics = [];
const gateDiagnostics = [];
const namingDiagnostics = [];
const sidecarDiagnostics = [];

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
console.log(`Confidence gate: ${pages.length} pages, ${gateDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Round naming: ${pages.length} pages, ${namingDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Answer sidecar: ${pages.length} pages, ${sidecarDiagnostics.length ? "DRIFT" : "exact"}`);

const groups = [
  ["TTS include drift:", ttsDiagnostics],
  ["Page metadata drift:", metadataDiagnostics],
  ["Viewport drift:", viewportDiagnostics],
  ["Embed prohibition drift:", embedDiagnostics],
  ["Open input drift:", openInputDiagnostics],
  ["Confidence gate drift:", gateDiagnostics],
  ["Round naming drift:", namingDiagnostics],
  ["Answer sidecar drift:", sidecarDiagnostics],
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
