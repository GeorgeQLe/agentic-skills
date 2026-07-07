#!/usr/bin/env node
// Read-only convention audit for active alignment/*.html pages, so direct
// edits made without invoking a skill can be checked against
// docs/alignment-page-convention.md. Archived pages under
// docs/history/archive/ are out of scope. No write/fix mode: diagnostics
// point at npx skillpacks alignment pages inject-tts, the local script fallback, or manual fixes.
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
const alignmentDir = `${repoRoot}/alignment`;

const CATEGORIES = new Set(["research", "product-design", "utility", "qa-meta", "ops-analysis"]);
const TIERS = new Set(["document", "visual", "prototype"]);
const KOKORO_TAG_RE = /<script\b[^>]*\bsrc="[^"]*alignment-tts-kokoro\.js"[^>]*><\/script>/;
const NAV_TAG_RE = /<script\b[^>]*\bsrc="[^"]*alignment-question-nav\.js"[^>]*><\/script>/;
const INLINE_TTS_RE = /alignTTS|\/\/ --- Brief Me TTS ---/;
// Review-answerable pages carry the unanswered questions the nav pager targets.
// The definitive marker is the review "Compile Responses" control, which the
// convention mandates on every review page and forbids on confirmed records;
// stray radios (chart toggles, filters) are deliberately not a trigger.
const ANSWERABLE_RE = /\bCompile Responses\b/;
const DATE_RE = /\b\d{4}-\d{2}-\d{2}\b/;
// Compiled-response YAML must join its line array with a real newline ("\n").
// A double-escaped separator (.join("\\n") in source) glues every YAML line
// onto one physical line separated by the literal characters \n, so the
// textarea renders the whole document on a single line. This catches that
// specific defect; value-escaping like .replace(/\n/g, "\\n") is unaffected
// because it is not a .join() separator.
const YAML_JOIN_NEWLINE_RE = /\.join\(\s*(["'])\\\\n\1\s*\)/;

function collectHtmlPages(dir, prefix = "") {
  if (!existsSync(dir)) return [];
  const entries = [];
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    if (dirent.name.startsWith(".")) continue;
    const rel = prefix ? `${prefix}/${dirent.name}` : dirent.name;
    const full = `${dir}/${dirent.name}`;
    if (dirent.isFile() && dirent.name.endsWith(".html")) {
      entries.push(rel);
    }
  }
  return entries.sort();
}

const pages = collectHtmlPages(alignmentDir);
// index.html is the central index, not an alignment page: it is exempt from
// the per-page TTS and metadata checks but still held to viewport/embed rules.
const activePages = pages.filter((f) => f !== "index.html");

const ttsDiagnostics = [];
const navDiagnostics = [];
const metadataDiagnostics = [];
const viewportDiagnostics = [];
const embedDiagnostics = [];
const alignmentStatusDiagnostics = [];
const indexDiagnostics = [];
const collapsingFillDiag = [];
const yamlJoinDiagnostics = [];

function checkAttribute(htmlTag, rel, attribute, allowed) {
  const match = htmlTag.match(new RegExp(`\\b${attribute}="([^"]*)"`));
  if (!match) {
    metadataDiagnostics.push(
      `Missing ${attribute} on <html> in ${rel} — set one of: ${[...allowed].join(", ")}.`,
    );
  } else if (!allowed.has(match[1])) {
    metadataDiagnostics.push(
      `Invalid ${attribute} "${match[1]}" in ${rel} — must be one of: ${[...allowed].join(", ")}.`,
    );
  }
}

function isConfirmedPage(html) {
  return /\bdata-alignment-status=["']confirmed["']/i.test(html) || /\balignment_status:\s*confirmed\b/i.test(html);
}

function confirmedPageControlFindings(html) {
  const findings = [];
  const checks = [
    [/class=["'][^"']*\bquestion-block\b/i, ".question-block gate controls"],
    [/<(?:input|textarea)\b[^>]*(?:\brequired\b|data-question-id=|data-gate|data-gate-type=)/i, "required gate inputs/textareas"],
    [/class=["'][^"']*\bsection-feedback\b/i, ".section-feedback controls"],
    [/class=["'][^"']*\b(?:local-yaml|compile-local|copy-local|yaml-output|compile-local-feedback|copy-local-feedback)\b/i, "local YAML/compile controls"],
    [/\bCompile Responses\b/i, "Compile Responses control"],
    [/\bCompile Feedback YAML\b/i, "Compile Feedback YAML control"],
    [/\brequiredGateNames\b/, "requiredGateNames registry"],
    [/\bgateRegistry\b/i, "gate registry data"],
    [/\b(?:response|answer|approval)[-_ ]?counter(?:s)?\b/i, "response counters"],
    [/\b(?:blocks finalization|approval[- ]blocking|approval is blocked|required questions remain|cannot approve|approval_status:\s*not-approved)\b/i, "approval-blocking wording"],
    [/\bretained controls\b/i, "retained controls wording"],
  ];

  for (const [pattern, label] of checks) {
    if (pattern.test(html)) findings.push(label);
  }
  return findings;
}

for (const file of pages) {
  const rel = `alignment/${file}`;
  const html = readFileSync(`${alignmentDir}/${file}`, "utf8");

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

  if (YAML_JOIN_NEWLINE_RE.test(html)) {
    yamlJoinDiagnostics.push(
      `Double-escaped YAML newline join in ${rel} — the compiled-response YAML uses .join("\\\\n") (literal backslash-n), so the whole document renders on one line in the textarea. Change the separator to a real newline .join("\\n").`,
    );
  }

  if (file === "index.html") continue;

  const kokoroTag = html.match(KOKORO_TAG_RE);
  if (!kokoroTag) {
    if (INLINE_TTS_RE.test(html)) {
      ttsDiagnostics.push(
        `Inline TTS in ${rel} — the Brief Me script must be the src tag, never inlined. Run npx skillpacks alignment pages inject-tts --force ${rel} to replace it (or node scripts/inject-tts.mjs --force ${rel} in this source checkout).`,
      );
    } else {
      ttsDiagnostics.push(
        `Missing TTS include in ${rel} — every alignment page needs <script src="../scripts/alignment-tts-kokoro.js"></script> before </body>. Run npx skillpacks alignment pages inject-tts ${rel} to add it (or node scripts/inject-tts.mjs ${rel} in this source checkout).`,
      );
    }
  } else if (/\btype="module"/.test(kokoroTag[0])) {
    ttsDiagnostics.push(
      `Module TTS tag in ${rel} — type="module" scripts are blocked by CORS on file:// URLs. Run npx skillpacks alignment pages inject-tts --force ${rel} to replace it (or node scripts/inject-tts.mjs --force ${rel} in this source checkout).`,
    );
  } else if (INLINE_TTS_RE.test(html)) {
    ttsDiagnostics.push(
      `Leftover inline TTS in ${rel} beside the src tag. Run npx skillpacks alignment pages inject-tts --force ${rel} to clean it up (or node scripts/inject-tts.mjs --force ${rel} in this source checkout).`,
    );
  }

  // Review-answerable pages must carry the question-nav include so each gate
  // and the compile section render the prev/next-unanswered pager. Confirmed
  // read-only records have no answerable questions and are exempt.
  if (!isConfirmedPage(html) && ANSWERABLE_RE.test(html) && !NAV_TAG_RE.test(html)) {
    navDiagnostics.push(
      `Missing question-nav include in ${rel} — review pages with answerable gates need <script src="../scripts/alignment-question-nav.js"></script> before </body> so each gate and the compile section show the prev/next-unanswered pager. Run node scripts/inject-tts.mjs ${rel} to add it.`,
    );
  }

  const htmlTag = html.match(/<html\b[^>]*>/);
  if (!htmlTag) {
    metadataDiagnostics.push(`Missing <html> element in ${rel} — cannot carry the required data attributes.`);
  } else {
    checkAttribute(htmlTag[0], rel, "data-alignment-category", CATEGORIES);
    checkAttribute(htmlTag[0], rel, "data-visual-tier", TIERS);
  }

  if (isConfirmedPage(html)) {
    const findings = confirmedPageControlFindings(html);
    if (findings.length) {
      alignmentStatusDiagnostics.push(
        `Confirmed page controls in ${rel} — remove active review UI and keep decisions only as read-only approval records. Found: ${findings.join(", ")}.`,
      );
    }
  }

}

// Index integrity: the central index must exist when active pages do, link
// every active page exactly once (no duplicates, no dangling entries), and
// every entry must carry a YYYY-MM-DD meta date near its link. The date is
// searched between the entry's anchor and the entry boundary (the closing
// </article> for card layouts, otherwise the next entry's anchor).
let indexEntries = 0;
const indexPath = `${alignmentDir}/index.html`;
if (!existsSync(indexPath)) {
  if (activePages.length) {
    indexDiagnostics.push(
      "Missing central index alignment/index.html — create it with a dated entry for every active alignment page.",
    );
  }
} else {
  const html = readFileSync(indexPath, "utf8");
  const entries = [];
  for (const match of html.matchAll(/<a\s[^>]*\bhref="([^"]+\.html)"[^>]*>/g)) {
    const href = match[1];
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) continue; // external links are not entries
    const name = href.replace(/^\.\//, "");
    if (name === "index.html") continue;
    entries.push({ name, pos: match.index });
  }

  const linkCounts = new Map();
  for (const { name } of entries) linkCounts.set(name, (linkCounts.get(name) ?? 0) + 1);
  indexEntries = linkCounts.size;

  const activeSet = new Set(activePages);
  for (const [name, count] of linkCounts) {
    if (count > 1) {
      indexDiagnostics.push(
        `Duplicate index entry for alignment/${name} — linked ${count} times in alignment/index.html; keep one entry.`,
      );
    }
    if (!activeSet.has(name)) {
      indexDiagnostics.push(
        `Dangling index entry alignment/${name} — page does not exist; remove the entry from alignment/index.html.`,
      );
    }
  }
  for (const page of activePages) {
    if (!linkCounts.has(page)) {
      indexDiagnostics.push(
        `Unlinked page alignment/${page} — add a dated entry to alignment/index.html.`,
      );
    }
  }

  const undated = new Set();
  for (let i = 0; i < entries.length; i += 1) {
    const { name, pos } = entries[i];
    if (undated.has(name)) continue;
    const nextAnchor = entries[i + 1]?.pos ?? html.length;
    const articleClose = html.indexOf("</article>", pos);
    const end = articleClose === -1 ? nextAnchor : Math.min(nextAnchor, articleClose);
    if (!DATE_RE.test(html.slice(pos, end))) {
      undated.add(name);
      indexDiagnostics.push(
        `Undated index entry for alignment/${name} — add a YYYY-MM-DD meta date span after the link (e.g. <span class="meta">2026-06-09</span>).`,
      );
    }
  }
}

console.log(`Active pages: ${activePages.length}`);
console.log(`TTS include: ${activePages.length} pages, ${ttsDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Question-nav include: ${activePages.length} pages, ${navDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Page metadata: ${activePages.length} pages, ${metadataDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Viewport meta: ${pages.length} pages, ${viewportDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Embed prohibition: ${pages.length} pages, ${embedDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Collapsing fill: ${pages.length} pages, ${collapsingFillDiag.length ? "DRIFT" : "exact"}`);
console.log(`Compiled-YAML newline join: ${pages.length} pages, ${yamlJoinDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Alignment status controls: ${activePages.length} pages, ${alignmentStatusDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Index integrity: ${indexEntries} entries, ${indexDiagnostics.length ? "DRIFT" : "exact"}`);

const groups = [
  ["TTS include drift:", ttsDiagnostics],
  ["Question-nav include drift:", navDiagnostics],
  ["Page metadata drift:", metadataDiagnostics],
  ["Viewport drift:", viewportDiagnostics],
  ["Embed prohibition drift:", embedDiagnostics],
  ["Collapsing fill drift:", collapsingFillDiag],
  ["Compiled-YAML newline join drift:", yamlJoinDiagnostics],
  ["Alignment status controls drift:", alignmentStatusDiagnostics],
  ["Index integrity drift:", indexDiagnostics],
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
