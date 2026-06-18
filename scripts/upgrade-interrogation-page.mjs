#!/usr/bin/env node
// Generator for the per-skill INTERROGATION-PAGE.md bundle, mirroring
// scripts/upgrade-alignment-page.mjs for the stage-zero interrogation
// archetype. The convention is authored in docs/interrogation-page-convention.md
// between the <!-- interrogation-convention:start --> / :end markers; this
// script fills per-skill tokens and writes the bundle beside each participating
// SKILL.md, swapping a short stub paragraph into the skill's
// `## Interrogation Page` section. Rollout is additive: add a skill name to
// INTERROGATION_SKILLS to bring it into the archetype.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const argv = process.argv.slice(2);
let rootOverride = null;
const flags = new Set();
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === "--root") {
    rootOverride = argv[i + 1];
    i += 1;
    if (!rootOverride) {
      console.error("--root requires a path argument");
      process.exit(1);
    }
  } else {
    flags.add(argv[i]);
  }
}
const scriptRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = rootOverride ? resolve(rootOverride) : scriptRoot;
const dryRun = flags.has("--dry-run");
// --check: no writes; generated-bundle drift (stale/missing bundle or stale
// SKILL.md stub for a participating skill) becomes a failing diagnostic
// instead of a pending-update preview. Plain --dry-run keeps exiting 0.
const checkMode = flags.has("--check");
const noWrites = dryRun || checkMode;
const previewPrefix = checkMode ? "[check] " : dryRun ? "[dry-run] " : "";

// --- Participating-skill registry. Rollout is additive: add a name here. ---
const INTERROGATION_SKILLS = new Set([
  "customer-discovery",
  "positioning",
  "idea-scope-brief",
]);

const skipPath = `${repoRoot}/scripts/interrogation-skip-list.txt`;
const skippedNames = new Set();
if (existsSync(skipPath)) {
  for (const rawLine of readFileSync(skipPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (line) skippedNames.add(line);
  }
}

// Skills whose `## Interrogation Page` sections are intentionally hand-authored
// in BOTH mirrors. Exact list: unlisted bespoke sections, stale entries, and
// mixed generated/bespoke sibling pairs are failing diagnostics.
const bespokePath = `${repoRoot}/scripts/interrogation-bespoke-list.txt`;
const bespokeAllowlist = new Set();
if (existsSync(bespokePath)) {
  for (const rawLine of readFileSync(bespokePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (line) bespokeAllowlist.add(line);
  }
}

function skillNameFor(file) {
  const parts = file.split("/");
  return parts[parts.length - 2];
}

const authoringConventionPath = `${repoRoot}/docs/interrogation-page-convention.md`;
const packagedConventionPath = `${scriptRoot}/assets/interrogation-page-convention.md`;
const conventionPath = existsSync(authoringConventionPath) ? authoringConventionPath : packagedConventionPath;
const conventionFile = readFileSync(conventionPath, "utf8");
const markerMatch = conventionFile.match(
  /<!-- interrogation-convention:start -->\n([\s\S]*?)\n<!-- interrogation-convention:end -->/,
);
if (!markerMatch) {
  console.error(
    `Could not find <!-- interrogation-convention:start --> / :end markers in ${relative(repoRoot, conventionPath)}`,
  );
  process.exit(1);
}
const conventionTemplate = markerMatch[1];

function readSkillFrontmatterField(skillPath, field) {
  try {
    const content = readFileSync(`${repoRoot}/${skillPath}`, "utf8");
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) return null;
    const fieldMatch = fm[1].match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
    return fieldMatch ? fieldMatch[1].trim() : null;
  } catch {
    return null;
  }
}

// --- Visual tier (governs whether charts are allowed on round pages) ---
function skillVisualTier(skillPath) {
  const declared = skillPath ? readSkillFrontmatterField(skillPath, "visual_tier") : null;
  if (declared === "document" || declared === "visual" || declared === "prototype") return declared;
  return "document";
}

function visualTierGuidance(tier) {
  if (tier === "visual") {
    return `**Visual tier rendering.** This skill's interrogation pages may use the \`visual\` tier: inline charts and diagrams rendered via self-contained Canvas/SVG, with an \`aria-label\` and a \`<table>\` fallback per chart. Use charts only to make elicited context legible (e.g. an evidence-readiness snapshot); they never replace the open inputs that drive research.`;
  }
  if (tier === "prototype") {
    return `**Prototype tier rendering.** This skill's interrogation pages may use the \`prototype\` tier: in addition to charts, self-contained interactive components are permitted, each with a reset control and clear "preview" labeling and no external dependencies. Interactive previews never replace the open inputs that drive research.`;
  }
  return "";
}

// --- Skill-specific interview areas the confidence gate must cover ---
const INTERROGATION_AREAS = {
  "customer-discovery": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the candidate ICP segments under consideration and why each is in or out; the buyer-vs-user distinction per candidate; the pains, trigger events, and jobs each candidate experiences; willingness-to-pay and budget-authority signals; reachable-audience and channel constraints; and the riskiest assumption that, if wrong, would invalidate the segment choice. Open inputs must let the user add candidates, reweight them, and supply real buyer language the agent cannot infer.`,
  positioning: `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the target segment positioning will speak to; the competitive alternatives the customer actually weighs (including "do nothing"); the value wedge and differentiator; the market-vs-product mode and the evidence behind it; the category frame; and the customer language that should anchor the positioning. Open inputs must let the user correct the alternative set, supply real customer phrasing, and override the detected mode.`,
  "idea-scope-brief": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the concept identity and normalized slug; the problem hypothesis; the beneficiary/user hypothesis; the product-category guess; the value wedge; real constraints; explicit non-goals; the riskiest unknowns; and, when the concept looks multi-sided, the market-structure sides and value exchange (as hypotheses, not validated segments). Open inputs must let the user restate the concept in their own words, correct the slug, and name constraints and non-goals the agent cannot infer.`,
};

function interrogationAreas(skillName) {
  return (
    INTERROGATION_AREAS[skillName] ??
    `**Interview areas the confidence gate covers.** Before advancing to stage one, cover every context area this skill needs to produce useful output: the core hypotheses, the constraints and non-goals, the riskiest unknowns, and any domain-specific decisions the agent cannot infer from the repository. Open inputs must let the user correct the agent's assumptions and supply context that is not derivable from artifacts.`
  );
}

// Full convention text bundled into each skill's INTERROGATION-PAGE.md.
function bundledContentFor(skillName, skillPath) {
  const tier = skillVisualTier(skillPath);
  const tierText = visualTierGuidance(tier);
  const areasText = interrogationAreas(skillName);
  const body = conventionTemplate
    .replaceAll("{skill-name}", skillName)
    .replace(/\n*\{\{SKILL_INTERROGATION_AREAS\}\}\n*/, areasText ? `\n\n${areasText}\n\n` : "\n\n")
    .replace(/\n*\{\{SKILL_VISUAL_TIER\}\}\n*/, tierText ? `\n\n${tierText}\n\n` : "\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `# Interrogation Page — ${skillName}\n\n${body}\n`;
}

// Short SKILL.md stub paragraph that points at the bundled file. Carries the
// confidence-gate blocking language the contract test asserts.
const POINTER_PREFIX = "Follow the shared Interrogation Page convention";
const STUB_PREFIX = "Before producing research, run the stage-zero interrogation loop";

function stubParagraph(skillName) {
  return `Before producing research, run the stage-zero interrogation loop following \`INTERROGATION-PAGE.md\` in this skill's directory. Build one HTML page per round at \`interrogation/${skillName}-r{N}-{branch}.html\`, starting with the assumptions manifest as round 1, and loop until the confidence gate passes. This skill **cannot advance to stage one** (the framework/scope alignment page) **until** the confidence gate passes with at least one completed interrogation round and every interview area covered or waived. Each round page must contain at least one genuinely open input (\`data-open-input\`).`;
}

function isPointerOrStub(paragraph) {
  return paragraph.startsWith(POINTER_PREFIX) || paragraph.startsWith(STUB_PREFIX);
}

function replaceOrInsert(content, skillName) {
  const headingMatch = content.match(/^(#{2,3}) Interrogation Page$/m);
  const stub = stubParagraph(skillName);

  if (headingMatch?.index !== undefined) {
    const heading = headingMatch[0];
    const level = headingMatch[1].length;
    const afterHeading = headingMatch.index + heading.length;
    const nextHeading = new RegExp(`\\n#{1,${level}} (?!#)`, "g");
    nextHeading.lastIndex = afterHeading;
    const boundary = nextHeading.exec(content);
    const end = boundary ? boundary.index : content.length;

    const paragraphs = content.slice(afterHeading, end).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    let swapped = false;
    const next = paragraphs.map((p) => {
      if (!swapped && isPointerOrStub(p)) {
        swapped = true;
        return stub;
      }
      return p;
    });
    if (!swapped) next.unshift(stub);

    const head = `${content.slice(0, afterHeading)}\n\n${next.join("\n\n")}`;
    const tail = content.slice(end).replace(/^\n+/, "");
    return tail ? `${head}\n\n${tail}` : `${head}\n`;
  }

  const newSection = `## Interrogation Page\n\n${stub}`;
  const insertion = content.search(/^## (Alignment Page|Default Shipping Contract)$/m);
  if (insertion >= 0) {
    return `${content.slice(0, insertion).replace(/\n*$/, "\n\n")}${newSection}\n\n${content.slice(insertion)}`;
  }
  return `${content.replace(/\n*$/, "\n\n")}${newSection}\n`;
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "archive" || entry === "node_modules" || entry === ".git") continue;
    const abs = join(dir, entry);
    const stat = statSync(abs);
    if (stat.isDirectory()) walk(abs, out);
    if (stat.isFile() && entry === "SKILL.md") out.push(relative(repoRoot, abs));
  }
  return out;
}

const files = [...walk(`${repoRoot}/base`), ...walk(`${repoRoot}/packs`)]
  .filter((file) => /(^|\/)(codex|claude)\//.test(file))
  .filter((file) => INTERROGATION_SKILLS.has(skillNameFor(file)))
  .sort();

const hasSectionRe = /^#{2,3} Interrogation Page$/m;

function interrogationSectionBody(content) {
  const m = content.match(/^(#{2,3}) Interrogation Page$/m);
  if (!m || m.index === undefined) return null;
  const start = m.index + m[0].length;
  const level = m[1].length;
  const next = new RegExp(`\\n#{1,${level}} (?!#)`, "g");
  next.lastIndex = start;
  const boundary = next.exec(content);
  const end = boundary ? boundary.index : content.length;
  return content.slice(start, end).trim();
}

// A section the generator owns carries the stub paragraph (or no section yet).
function isOwnable(body) {
  if (body === null) return true; // missing section: generator inserts the stub
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .some(isPointerOrStub);
}

let updated = 0;
let skipList = 0;
let bespoke = 0;
let bundlesWritten = 0;

const classification = new Map();
function recordClassification(skillName, file, kind) {
  if (!classification.has(skillName)) {
    classification.set(skillName, { bespokeFiles: [], ownableFiles: [] });
  }
  classification.get(skillName)[kind].push(file);
}

for (const file of files) {
  const skillName = skillNameFor(file);
  if (skippedNames.has(skillName)) {
    skipList += 1;
    continue;
  }

  const abs = `${repoRoot}/${file}`;
  const before = readFileSync(abs, "utf8");
  const body = interrogationSectionBody(before);

  if (body !== null && !isOwnable(body)) {
    bespoke += 1;
    recordClassification(skillName, file, "bespokeFiles");
    continue;
  }
  recordClassification(skillName, file, "ownableFiles");

  // 1. Bundled, load-on-demand convention file beside the skill.
  const bundlePath = join(dirname(abs), "INTERROGATION-PAGE.md");
  const bundleContent = bundledContentFor(skillName, file);
  const bundleBefore = existsSync(bundlePath) ? readFileSync(bundlePath, "utf8") : "";
  const bundleChanged = bundleBefore !== bundleContent;

  // 2. Short stub inside SKILL.md pointing at the bundled file.
  const after = replaceOrInsert(before, skillName);
  const skillChanged = before !== after;

  if (!bundleChanged && !skillChanged) continue;

  updated += 1;
  if (skillChanged) {
    const action = hasSectionRe.test(before) ? "replace" : "insert";
    console.log(`${previewPrefix}${action} stub ${file}`);
    if (!noWrites) writeFileSync(abs, after);
  }
  if (bundleChanged) {
    bundlesWritten += 1;
    console.log(`${previewPrefix}write ${relative(repoRoot, bundlePath)}`);
    if (!noWrites) writeFileSync(bundlePath, bundleContent);
  }
}

// Generated-bundle drift validation (escalates to a failing exit in --check).
const bundleDiagnostics = [];
let ownableChecked = 0;
for (const [name, { ownableFiles, bespokeFiles }] of classification) {
  if (bespokeFiles.length) continue;
  for (const file of ownableFiles) {
    ownableChecked += 1;
    const abs = `${repoRoot}/${file}`;
    const bundlePath = join(dirname(abs), "INTERROGATION-PAGE.md");
    const relBundle = relative(repoRoot, bundlePath);
    const expected = bundledContentFor(name, file);
    if (!existsSync(bundlePath)) {
      bundleDiagnostics.push(
        `Missing generated bundle ${relBundle} for "${name}". Run node scripts/upgrade-interrogation-page.mjs to generate it.`,
      );
    } else if (readFileSync(bundlePath, "utf8") !== expected) {
      bundleDiagnostics.push(
        `Stale generated bundle ${relBundle} for "${name}" — differs from expected renderer output. Never hand-edit a generated bundle; re-run node scripts/upgrade-interrogation-page.mjs to regenerate it.`,
      );
    }
    const content = readFileSync(abs, "utf8");
    if (replaceOrInsert(content, name) !== content) {
      bundleDiagnostics.push(
        `Stale SKILL.md stub in ${file} for "${name}" — the interrogation section's stub paragraph needs replacing. Run node scripts/upgrade-interrogation-page.mjs to update it.`,
      );
    }
  }
}

// Path-consistency validation: every active INTERROGATION-PAGE.md must
// reference only its owning skill's interrogation/<name>-r{N}-{branch}.html.
const OUTPUT_PATH_RE = /interrogation\/([A-Za-z0-9_-]+)-r\{N\}/g;
const pathDiagnostics = [];
let bundlesChecked = 0;
for (const file of files) {
  const skillName = skillNameFor(file);
  const bundlePath = join(dirname(`${repoRoot}/${file}`), "INTERROGATION-PAGE.md");
  if (!existsSync(bundlePath)) continue;
  bundlesChecked += 1;
  const foreignNames = new Set();
  for (const match of readFileSync(bundlePath, "utf8").matchAll(OUTPUT_PATH_RE)) {
    if (match[1] !== skillName) foreignNames.add(match[1]);
  }
  if (foreignNames.size) {
    pathDiagnostics.push(
      `Foreign output path in ${relative(repoRoot, bundlePath)} — references ${[...foreignNames].map((n) => `interrogation/${n}-r{N}-{branch}.html`).join(", ")} but the owning skill is "${skillName}". Regenerate the bundle or fix the hand-authored path.`,
    );
  }
}

// Bespoke classification must match the allowlist exactly; siblings must agree.
const diagnostics = [];
for (const [name, { bespokeFiles, ownableFiles }] of classification) {
  if (bespokeFiles.length && ownableFiles.length) {
    diagnostics.push(
      `Mixed siblings for "${name}" — generated: ${ownableFiles.join(", ")}; bespoke: ${bespokeFiles.join(", ")}. Convert the bespoke mirror(s) to the generated stub paragraph or hand-author both mirrors.`,
    );
  } else if (bespokeFiles.length && !bespokeAllowlist.has(name)) {
    diagnostics.push(
      `Unlisted bespoke section for "${name}" in: ${bespokeFiles.join(", ")}. Add "${name}" to scripts/interrogation-bespoke-list.txt if intentional, or restore the generated stub paragraph.`,
    );
  }
}
for (const name of bespokeAllowlist) {
  const entry = classification.get(name);
  if (!entry || entry.bespokeFiles.length === 0) {
    diagnostics.push(
      `Stale allowlist entry "${name}" in scripts/interrogation-bespoke-list.txt — no bespoke interrogation section found. Remove the entry.`,
    );
  }
}

console.log("");
console.log(`Updated: ${updated}`);
console.log(`Bundled files written: ${bundlesWritten}`);
console.log(`Skipped by ${relative(repoRoot, skipPath)}: ${skipList}`);
console.log(`Preserved bespoke sections: ${bespoke}`);
console.log(`Participating skills: ${INTERROGATION_SKILLS.size}`);
console.log(`Bespoke allowlist: ${bespokeAllowlist.size} skills, ${diagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Output paths: ${bundlesChecked} bundles, ${pathDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Generated bundles: ${ownableChecked} ownable, ${bundleDiagnostics.length ? "DRIFT" : "exact"}`);

if (diagnostics.length) {
  console.error("");
  console.error("Bespoke classification drift:");
  for (const diagnostic of diagnostics) console.error(`  - ${diagnostic}`);
}
if (pathDiagnostics.length) {
  console.error("");
  console.error("Output path drift:");
  for (const diagnostic of pathDiagnostics) console.error(`  - ${diagnostic}`);
}
if (checkMode && bundleDiagnostics.length) {
  console.error("");
  console.error("Generated bundle drift:");
  for (const diagnostic of bundleDiagnostics) console.error(`  - ${diagnostic}`);
}
if (diagnostics.length || pathDiagnostics.length || (checkMode && bundleDiagnostics.length)) process.exit(1);
