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
const INLINE_TTS_RE = /alignTTS|\/\/ --- Brief Me TTS ---/;
const DATE_RE = /\b\d{4}-\d{2}-\d{2}\b/;
const BIP_STATUS_VALUES = new Set(["linked", "approved", "not-applicable"]);
const BIP_FINAL_GATE_KEYS = [
  "drafting-mode",
  "content-angles",
  "sample-drafts",
  "tone",
  "claim-safety",
  "publish-readiness",
];
const STALE_BIP_FUTURE_DRAFTING_QUESTION_RE = /Which drafting mode should apply if channels are later selected/i;
const STALE_BIP_NO_DRAFTING_OPTION_RE = /No drafting mode needed;\s*all channels remain not-now/i;

const pages = existsSync(alignmentDir)
  ? readdirSync(alignmentDir).filter((f) => f.endsWith(".html")).sort()
  : [];
// index.html is the central index, not an alignment page: it is exempt from
// the per-page TTS and metadata checks but still held to viewport/embed rules.
const activePages = pages.filter((f) => f !== "index.html");

const ttsDiagnostics = [];
const metadataDiagnostics = [];
const viewportDiagnostics = [];
const embedDiagnostics = [];
const alignmentStatusDiagnostics = [];
const indexDiagnostics = [];
const collapsingFillDiag = [];
const bipDiagnostics = [];

function readProjectBuildInPublicMode() {
  const projectConfigPath = `${repoRoot}/.agents/project.json`;
  if (!existsSync(projectConfigPath)) return false;
  try {
    const config = JSON.parse(readFileSync(projectConfigPath, "utf8"));
    return config?.alignment?.build_in_public === true;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    bipDiagnostics.push(
      `Unreadable BIP config .agents/project.json — cannot evaluate alignment.build_in_public: ${detail}.`,
    );
    return false;
  }
}

const buildInPublicEnabled = readProjectBuildInPublicMode();

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

function isReviewPage(html) {
  return /\bdata-alignment-status=["']review["']/i.test(html) || /\balignment_status:\s*review\b/i.test(html);
}

function isBipReviewPage(file, html) {
  return file.endsWith("-bip.html") || /\bdata-alignment-page-kind=["']bip["']/i.test(html);
}

function htmlAttributeValue(tag, attribute) {
  const escaped = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(new RegExp(`\\b${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? (match[1] ?? match[2] ?? match[3] ?? "").trim() : "";
}

function requiredGateRecords(html) {
  const records = [];
  for (const match of html.matchAll(/<[^!/][^>]*\bdata-required\s*=\s*(?:"true"|'true'|true)(?=\s|>|\/)[^>]*>/gi)) {
    const tag = match[0];
    const haystack = [
      htmlAttributeValue(tag, "data-gate"),
      htmlAttributeValue(tag, "data-gate-type"),
      htmlAttributeValue(tag, "data-section"),
      htmlAttributeValue(tag, "data-question-id"),
    ].join(" ").toLowerCase().replace(/_/g, "-");
    records.push({ tag, haystack });
  }
  return records;
}

function requiredGateRecordMatches(record, gateKey) {
  const haystack = record.haystack;
  const checks = {
    "target-channels": /\btarget[- ]channels?\b/,
    "drafting-mode": /\bdrafting[- ]mode\b/,
    "content-angles": /\bcontent[- ]angles?\b/,
    "sample-drafts": /\b(?:sample[- ]drafts?|sample[- ]posts?|video[- ]ideas?)\b/,
    tone: /\btone\b/,
    "claim-safety": /\bclaim[- ]safety\b/,
    "publish-readiness": /\bpublish[- ]readiness\b/,
  };
  return checks[gateKey]?.test(haystack) ?? false;
}

function requiredBipGateKeys(html, gateKeys) {
  const records = requiredGateRecords(html);
  return gateKeys.filter((gateKey) => records.some((record) => requiredGateRecordMatches(record, gateKey)));
}

function normalizeGateMetadata(value) {
  return value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function isGateQuestionContainerTag(tag) {
  const className = normalizeGateMetadata(htmlAttributeValue(tag, "class"));
  return (
    /\b(?:gate|question block)\b/.test(className) ||
    Boolean(htmlAttributeValue(tag, "data-gate")) ||
    Boolean(htmlAttributeValue(tag, "data-gate-type")) ||
    Boolean(htmlAttributeValue(tag, "data-question-id"))
  );
}

function hasFinalArtifactApprovalMetadata(tag) {
  const primaryMetadata = normalizeGateMetadata(
    [
      htmlAttributeValue(tag, "data-gate"),
      htmlAttributeValue(tag, "data-gate-type"),
      htmlAttributeValue(tag, "data-question-id"),
    ].join(" "),
  );
  const sectionMetadata = normalizeGateMetadata(
    [
      htmlAttributeValue(tag, "data-section"),
      htmlAttributeValue(tag, "aria-label"),
      htmlAttributeValue(tag, "title"),
    ].join(" "),
  );
  const hasPrimaryFinalArtifact = /\b(?:final|canonical) artifacts?\b/.test(primaryMetadata);
  const hasPrimaryDestinationOnly = /\b(?:destination|path|paths|file changes?|write|output)\b/.test(primaryMetadata);

  return (
    /\bartifact approval\b/.test(primaryMetadata) ||
    (hasPrimaryFinalArtifact && !hasPrimaryDestinationOnly) ||
    /\b(?:final|canonical) artifacts?\b.{0,40}\bapproval\b/.test(sectionMetadata) ||
    /\bapproval\b.{0,40}\b(?:final|canonical) artifacts?\b/.test(sectionMetadata) ||
    /\bartifact approval\b/.test(sectionMetadata)
  );
}

function activeFinalArtifactApprovalGateRecords(html) {
  const records = [];
  for (const match of html.matchAll(/<(article|section|div|fieldset|form)\b[^>]*>/gi)) {
    const tag = match[0];
    if (!isGateQuestionContainerTag(tag)) continue;
    if (!hasFinalArtifactApprovalMetadata(tag)) continue;
    const label = [
      htmlAttributeValue(tag, "data-gate-type"),
      htmlAttributeValue(tag, "data-gate"),
      htmlAttributeValue(tag, "data-question-id"),
      htmlAttributeValue(tag, "data-section"),
      htmlAttributeValue(tag, "class"),
    ].find(Boolean);
    records.push(label ? normalizeGateMetadata(label) : match[1].toLowerCase());
  }
  return records;
}

function hasRequiredTargetChannelGate(html) {
  return requiredBipGateKeys(html, ["target-channels"]).length > 0;
}

function hasSelectedChannelDraftSignals(html) {
  return (
    /\bselected-channel draft review\b/i.test(html) ||
    /\brendered selected-channel drafts?\b/i.test(html) ||
    /\bselected-channel sample drafts?\b/i.test(html) ||
    /\bdrafts rendered\b/i.test(html) ||
    /\bLoaded Convention Path\b/i.test(html) ||
    /\bselected text\/community channel set\b/i.test(html)
  );
}

function bipGateSequencingDiagnostics(rel, html) {
  const diagnostics = [];
  if (STALE_BIP_FUTURE_DRAFTING_QUESTION_RE.test(html)) {
    diagnostics.push(
      `Stale BIP drafting-mode question in ${rel} — remove "Which drafting mode should apply if channels are later selected?" and defer drafting-mode approval until channel-selection YAML has been approved and consumed.`,
    );
  }

  const prematureFinalGates = requiredBipGateKeys(html, BIP_FINAL_GATE_KEYS);
  if (hasRequiredTargetChannelGate(html) && !hasSelectedChannelDraftSignals(html) && prematureFinalGates.length) {
    diagnostics.push(
      `Premature BIP final gates in ${rel} — initial BIP channel-selection pages may require only target-channels until channel-selection YAML has been approved and consumed. Remove required gates: ${prematureFinalGates.join(", ")}.`,
    );
  }

  if (hasSelectedChannelDraftSignals(html) && STALE_BIP_NO_DRAFTING_OPTION_RE.test(html)) {
    diagnostics.push(
      `Stale BIP drafting-mode option in ${rel} — selected-channel draft pages must not offer "No drafting mode needed; all channels remain not-now."`,
    );
  }
  return diagnostics;
}

function normalizeAlignmentPath(value) {
  if (!value) return null;
  const clean = value.trim().replace(/^\.?\//, "");
  if (!clean.endsWith(".html")) return null;
  if (clean.startsWith("alignment/")) return clean;
  if (!clean.includes("/")) return `alignment/${clean}`;
  return null;
}

function bipSiblingName(file) {
  return file.replace(/\.html$/i, "-bip.html");
}

function normalPageNameForBip(file) {
  return file.replace(/-bip\.html$/i, ".html");
}

function bipGatedPage(html) {
  const attr = html.match(/\bdata-bip-gates=["']([^"']+)["']/i)?.[1];
  if (attr) return normalizeAlignmentPath(attr);
  const yaml = html.match(/\bbip_gates:\s*["']?(alignment\/[A-Za-z0-9._-]+\.html)["']?/i)?.[1];
  return yaml ? normalizeAlignmentPath(yaml) : null;
}

function isStageOneScopePage(html) {
  if (/\bdata-alignment-stage=["'](?:stage-1|stage-one|scope)["']/i.test(html)) return true;
  const hasStage2Preview = /\bStage 2 Preview\s*\/\s*Expected Review Format\b/i.test(html);
  const hasApprovedStage2Scope = /\b(?:Research|Validation) Scope Approved\b/i.test(html);
  return hasStage2Preview && !hasApprovedStage2Scope;
}

function claimsStage2ArtifactApproval(html) {
  if (/\bdata-alignment-stage=["'](?:stage-2|stage-two|artifact-review)["']/i.test(html)) return true;
  if (/\bdata-(?:review-)?stage=["'](?:stage-2|stage-two|artifact-review)["']/i.test(html)) return true;
  if (/\bdata-gate-type=["'](?:final-artifact-approval|artifact-approval|canonical-artifact-approval)["']/i.test(html)) {
    return true;
  }
  const hasApprovedScope = /\b(?:Research|Validation) Scope Approved\b/i.test(html);
  const hasStage2Marker = /\bStage 2\b|\bartifact review\b|\breview page\b/i.test(html);
  const hasArtifactApproval = /\bFinal Artifact Approval\b|\bArtifact Approval\b|\bProposed (?:Canonical|Final) Artifacts?\b|\bStage 3\b/i.test(html);
  return hasArtifactApproval && (hasApprovedScope || hasStage2Marker);
}

function requiresBipCheckpoint(file, html) {
  if (!buildInPublicEnabled) return false;
  if (isBipReviewPage(file, html)) return false;
  if (isConfirmedPage(html)) return false;
  if (!isReviewPage(html)) return false;
  if (isStageOneScopePage(html)) return false;
  return claimsStage2ArtifactApproval(html);
}

function bipStatusValues(html) {
  return [...html.matchAll(/\bdata-bip-status=["']([^"']+)["']/gi)].map((match) => match[1]);
}

function hasBipApprovalYaml(html) {
  return (
    /\bbip_approval_status:\s*ready-for-agent-review\b/i.test(html) ||
    /\bbip_review_status:\s*(?:approved|ready-for-agent-review)\b/i.test(html) ||
    /\bbip_handling:\s*approved\b/i.test(html)
  );
}

function hasBipNotApplicableReason(html) {
  const attr = html.match(/\bdata-bip-not-applicable-reason=["']([^"']{12,})["']/i)?.[1];
  if (attr) return true;
  return /\bbip_not_applicable_reason:\s*["']?[^"'\n]{12,}/i.test(html);
}

function hasBipPageReference(html, expectedFile, expectedRel) {
  const escapedFile = expectedFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedRel = expectedRel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    new RegExp(`\\bhref=["'][^"']*${escapedFile}["']`, "i").test(html) ||
    new RegExp(`\\bdata-bip-page=["'](?:${escapedFile}|${escapedRel})["']`, "i").test(html) ||
    new RegExp(`\\bbip_page:\\s*["']?(?:${escapedFile}|${escapedRel})["']?`, "i").test(html)
  );
}

function hasBipHandoffText(html, expectedFile, expectedRel) {
  if (!hasBipPageReference(html, expectedFile, expectedRel)) return false;
  return /\b(?:open|review)\b[\s\S]{0,160}\b(?:BIP|Build-In-Public)\b[\s\S]{0,220}\bbefore\b[\s\S]{0,120}\b(?:final artifact approval|normal artifact approval|Stage 3|confirming)/i.test(html);
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

  if (isBipReviewPage(file, html)) {
    bipDiagnostics.push(...bipGateSequencingDiagnostics(rel, html));
    const relGatedPage = bipGatedPage(html);
    if (!/\bdata-alignment-page-kind=["']bip["']/i.test(html)) {
      bipDiagnostics.push(
        `Missing BIP page metadata in ${rel} — set data-alignment-page-kind="bip" on the HTML page.`,
      );
    }
    if (!relGatedPage) {
      bipDiagnostics.push(
        `Missing BIP gated-page metadata in ${rel} — set data-bip-gates="alignment/${normalPageNameForBip(file)}".`,
      );
    } else if (!activePages.includes(relGatedPage.replace(/^alignment\//, ""))) {
      bipDiagnostics.push(
        `BIP gated page missing for ${rel} — data-bip-gates points to ${relGatedPage}, but that active page does not exist.`,
      );
    }
  }
}

let stage2BipPageCount = 0;
if (buildInPublicEnabled) {
  const activePageSet = new Set(activePages);
  for (const file of activePages) {
    const rel = `alignment/${file}`;
    const html = readFileSync(`${alignmentDir}/${file}`, "utf8");
    if (!requiresBipCheckpoint(file, html)) continue;

    stage2BipPageCount += 1;
    const expectedBipFile = bipSiblingName(file);
    const expectedBipRel = `alignment/${expectedBipFile}`;
    const siblingExists = activePageSet.has(expectedBipFile);
    const statuses = bipStatusValues(html);
    const hasCheckpoint = statuses.length > 0 || hasBipApprovalYaml(html) || hasBipNotApplicableReason(html) || hasBipPageReference(html, expectedBipFile, expectedBipRel);

    for (const status of statuses) {
      if (!BIP_STATUS_VALUES.has(status)) {
        bipDiagnostics.push(
          `Invalid BIP checkpoint status "${status}" in ${rel} — use one of: ${[...BIP_STATUS_VALUES].join(", ")}.`,
        );
      }
    }

    if (!hasCheckpoint && !siblingExists) {
      bipDiagnostics.push(
        `Missing BIP checkpoint in ${rel} — BIP is enabled and this Stage 2 review page has no data-bip-status checkpoint, approved BIP YAML, not-applicable reason, linked ${expectedBipRel}, or sibling BIP page.`,
      );
      continue;
    }

    if (statuses.includes("linked")) {
      if (!hasBipPageReference(html, expectedBipFile, expectedBipRel)) {
        bipDiagnostics.push(
          `Linked BIP checkpoint in ${rel} does not reference ${expectedBipRel}.`,
        );
      }
      if (!hasBipHandoffText(html, expectedBipFile, expectedBipRel)) {
        bipDiagnostics.push(
          `Linked BIP checkpoint in ${rel} must tell the reviewer to open/review ${expectedBipRel} before final artifact approval.`,
        );
      }
      const activeFinalArtifactGates = activeFinalArtifactApprovalGateRecords(html);
      if (activeFinalArtifactGates.length) {
        bipDiagnostics.push(
          `Linked BIP checkpoint in ${rel} cannot expose active final artifact approval controls before ${expectedBipRel} is approved; render final approval as read-only preview text or wait for data-bip-status="approved" or a narrow data-bip-status="not-applicable". Found: ${[...new Set(activeFinalArtifactGates)].join(", ")}.`,
        );
      }
    }

    if (statuses.includes("approved") && !hasBipApprovalYaml(html)) {
      bipDiagnostics.push(
        `Approved BIP checkpoint in ${rel} must record approved BIP YAML such as bip_approval_status: ready-for-agent-review.`,
      );
    }

    if (statuses.includes("not-applicable") && !hasBipNotApplicableReason(html)) {
      bipDiagnostics.push(
        `BIP not-applicable checkpoint in ${rel} must include a narrow data-bip-not-applicable-reason or bip_not_applicable_reason.`,
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
    const name = href.split("/").pop();
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
console.log(`Page metadata: ${activePages.length} pages, ${metadataDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Viewport meta: ${pages.length} pages, ${viewportDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Embed prohibition: ${pages.length} pages, ${embedDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Collapsing fill: ${pages.length} pages, ${collapsingFillDiag.length ? "DRIFT" : "exact"}`);
console.log(`Alignment status controls: ${activePages.length} pages, ${alignmentStatusDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(
  buildInPublicEnabled
    ? `BIP handling: ${stage2BipPageCount} Stage 2 pages, ${bipDiagnostics.length ? "DRIFT" : "exact"}`
    : `BIP handling: disabled, ${bipDiagnostics.length ? "DRIFT" : "exact"}`,
);
console.log(`Index integrity: ${indexEntries} entries, ${indexDiagnostics.length ? "DRIFT" : "exact"}`);

const groups = [
  ["TTS include drift:", ttsDiagnostics],
  ["Page metadata drift:", metadataDiagnostics],
  ["Viewport drift:", viewportDiagnostics],
  ["Embed prohibition drift:", embedDiagnostics],
  ["Collapsing fill drift:", collapsingFillDiag],
  ["Alignment status controls drift:", alignmentStatusDiagnostics],
  ["BIP handling drift:", bipDiagnostics],
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
