#!/usr/bin/env node
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
const repoRoot = rootOverride ? resolve(rootOverride) : dirname(dirname(fileURLToPath(import.meta.url)));
const dryRun = flags.has("--dry-run");
// --check: no writes; generated-bundle drift (stale/missing bundle or stale
// SKILL.md stub for an ownable skill) becomes a failing diagnostic instead of
// a pending-update preview. Plain --dry-run keeps exiting 0 on pending
// updates so the edit-convention → preview → write workflow is preserved.
const checkMode = flags.has("--check");
const noWrites = dryRun || checkMode;
const previewPrefix = checkMode ? "[check] " : dryRun ? "[dry-run] " : "";
// --all is retained as a no-op alias: all alignment-producing skills are covered by default.

const skipPath = `${repoRoot}/scripts/alignment-skip-list.txt`;
const skippedNames = new Set();
if (existsSync(skipPath)) {
  for (const rawLine of readFileSync(skipPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (line) skippedNames.add(line);
  }
}

// Skills whose `## Alignment Page` sections are intentionally hand-authored
// in BOTH mirrors. This list is exact: unlisted bespoke sections, stale
// entries, and mixed generated/bespoke sibling pairs are failing diagnostics.
const bespokePath = `${repoRoot}/scripts/alignment-bespoke-list.txt`;
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

// Single authoring source: the marked block inside docs/alignment-page-convention.md.
const conventionPath = `${repoRoot}/docs/alignment-page-convention.md`;
const conventionFile = readFileSync(conventionPath, "utf8");
const markerMatch = conventionFile.match(
  /<!-- alignment-convention:start -->\n([\s\S]*?)\n<!-- alignment-convention:end -->/,
);
if (!markerMatch) {
  console.error(
    "Could not find <!-- alignment-convention:start --> / :end markers in docs/alignment-page-convention.md",
  );
  process.exit(1);
}
const conventionTemplate = markerMatch[1];

// Full convention text bundled into each skill's ALIGNMENT-PAGE.md.
function bundledContentFor(skillName, skillPath) {
  const specific = skillSpecificGates(skillName);
  const tier = skillVisualTier(skillName);
  const tierText = visualTierGuidance(tier);
  const skillType = skillPath ? readSkillType(skillPath) : null;
  const glossaryApplies = skillType === 'research' || skillType === 'analysis';
  const glossaryText = glossaryApplies ? glossaryGateText(skillName) : '';
  const body = conventionTemplate
    .replaceAll("{skill-name}", skillName)
    .replace(/\n*\{\{SKILL_SPECIFIC_GATES\}\}\n*/, specific ? `\n\n${specific}\n\n` : "\n\n")
    .replace(/\n*\{\{SKILL_VISUAL_TIER\}\}\n*/, tierText ? `\n\n${tierText}\n\n` : "\n\n")
    .replace(/\n*\{\{SKILL_GLOSSARY_GATE\}\}\n*/, glossaryText ? `\n\n${glossaryText}\n\n` : "\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `# Alignment Page — ${skillName}\n\n${body}\n`;
}

// Short SKILL.md stub paragraph that points at the bundled file. Replaces the
// pointer paragraph in place, leaving any surrounding bespoke prose untouched.
const POINTER_PREFIX = "Follow the shared Alignment Page convention in CLAUDE.md";
const STUB_PREFIX = "When this skill produces durable deliverables";

function stubParagraph(skillName) {
  return `When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following \`ALIGNMENT-PAGE.md\` in this skill's directory. Output: \`alignment/${skillName}-{topic}.html\`.`;
}

function isPointerOrStub(paragraph) {
  return paragraph.startsWith(POINTER_PREFIX) || paragraph.startsWith(STUB_PREFIX);
}

// --- Visual Tier ---
const VISUAL_TIER_SKILLS = new Set([
  'competitive-analysis', 'positioning', 'devtool-positioning', 'enterprise-icp', 'devtool-user-map',
  'game-audience', 'lean-canvas', 'value-prop-canvas', 'growth-model', 'hook-model', 'game-core-loop',
  'metrics', 'lifecycle-metrics', 'game-playtest-metrics', 'monetization', 'devtool-monetization',
  'burn-rate', 'runway-model', 'cohort-review', 'assumption-tracker', 'risk-register',
  'journey-map', 'devtool-dx-journey', 'conversion-map', 'onboarding-map', 'retention-map',
  'transaction-map', 'analyze-sessions', 'youtube-peer-benchmark', 'youtube-cadence-diagnosis',
  'creator-platform-capability-matrix', 'expansion-map', 'pmf-assessment', 'platform-strategy',
  'gtm', 'customer-feedback', 'investor-update', 'product-line', 'scale-audit', 'mvp-gap',
  'devtool-adoption', 'devtool-integration-map', 'devtool-workflow', 'game-comparables',
  'game-genre-map', 'game-launch', 'game-roadmap', 'customer-discovery',
]);

const PROTOTYPE_TIER_SKILLS = new Set([
  'ux-variations', 'prototype', 'design-system', 'ui-interview', 'user-flow-map',
  'consolidate-variations', 'brainstorm', 'game-prototype-test', 'game-store-page-test',
  'landing-copy', 'uat-guide', 'animation-design-planner',
]);

function skillVisualTier(skillName) {
  if (PROTOTYPE_TIER_SKILLS.has(skillName)) return 'prototype';
  if (VISUAL_TIER_SKILLS.has(skillName)) return 'visual';
  return 'document';
}

function visualTierGuidance(tier) {
  if (tier === 'visual') {
    return `**Visual tier rendering.** This skill's alignment page uses the \`visual\` tier. Inline charts and diagrams are rendered via self-contained Canvas/SVG within the HTML file. Use the alignment chart snippet library (\`scripts/alignment-chart-snippets.js\`) as reference — copy needed chart functions directly into the page's \`<script>\` block. Charts must read CSS variables (\`--chart-1\` through \`--chart-8\`) for the data visualization palette. Every chart must include a \`<table>\` fallback, \`aria-label\` on canvas/SVG, and a "View as table" toggle. Data is embedded as inline JSON — no external fetches.`;
  }
  if (tier === 'prototype') {
    return `**Prototype tier rendering.** This skill's alignment page uses the \`prototype\` tier. In addition to charts and diagrams, functional interactive components (clickable flows, live CSS previews, drag interactions) are permitted. Prototypes are ephemeral previews, not production code. Each interactive component must include a reset button that restores initial state. Interactive components must be self-contained within the HTML file with no external dependencies. Include all visual tier requirements (chart snippets, table fallbacks, aria-labels, toggles) plus: state isolation (no localStorage/sessionStorage persistence), clear "this is a preview" labeling, and graceful degradation when JavaScript is disabled.`;
  }
  return '';
}

// --- Interview Depth ---
const FULL_INTERVIEW_SKILLS = new Set([
  'enterprise-icp', 'gtm', 'landing-copy', 'metrics', 'monetization', 'conversion-map',
  'expansion-map', 'lifecycle-metrics', 'onboarding-map', 'retention-map', 'transaction-map',
  'feature-interview', 'ui-interview', 'spec-interview', 'skill-interview', 'idea-scope-brief',
  'customer-discovery', 'user-flow-map',
]);

const LIGHT_INTERVIEW_SKILLS = new Set([
  'competitive-analysis', 'customer-feedback', 'lean-canvas', 'positioning', 'value-prop-canvas',
  'experiment', 'growth-model', 'hook-model', 'pmf-assessment', 'burn-rate', 'platform-strategy',
  'risk-register', 'runway-model', 'retro', 'devtool-adoption', 'devtool-monetization',
  'devtool-positioning', 'devtool-user-map', 'game-audience', 'game-comparables', 'game-fantasy',
  'game-genre-map', 'game-launch', 'game-prototype-test', 'game-store-page-test',
  'youtube-concept-research', 'content-programming', 'creator-positioning',
  'product-led-media-map', 'series-spec', 'brainstorm',
]);

function skillInterviewDepth(skillName) {
  if (FULL_INTERVIEW_SKILLS.has(skillName)) return 'full';
  if (LIGHT_INTERVIEW_SKILLS.has(skillName)) return 'light';
  return 'none';
}

// --- Glossary Gate ---
// Read the skill type from SKILL.md frontmatter to determine if glossary gate applies.
function readSkillType(skillPath) {
  try {
    const content = readFileSync(`${repoRoot}/${skillPath}`, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) return null;
    const typeMatch = fm[1].match(/^type:\s*(.+)$/m);
    return typeMatch ? typeMatch[1].trim() : null;
  } catch { return null; }
}

function glossaryGateText(skillName) {
  return `**Glossary Additions gate.** When this research introduces domain-specific terms, acronyms, or concept definitions that a reader outside the project would not know, include a \`## Glossary Additions\` section in the alignment page. Render a table of proposed terms with columns: Term, Definition, Source (\`${skillName}\`), Category (business/tooling/workflow/technical/domain), and per-term Approve/Edit/Reject/Flag radio controls. Only user-approved terms are appended to the target glossary (\`research/glossary.md\` or \`research/{slug}/glossary.md\` for scoped paths) during the confirmed-page write step. When the skill operates in a product-path scope, ask whether each term belongs in the parent or scoped glossary; default to the scoped glossary.`;
}

function skillSpecificGates(skillName) {
  const outputGateDedup =
    "Apply the shared artifact-destination/proposed-file-changes de-duplication rule: combine them into one visual gate when they ask only the same path-destination question, and render separate gates when destination approval differs from downstream mutation scope, timing, or allowed files.";
  const rules = {
    "idea-scope-brief": `**Idea-specific gates.** Render the Idea Assumptions Manifest as a first-class assumptions/confidence gate inside the alignment page before proposed deliverables. The idea identity, slug, scope/non-goals, ICP readiness, and output-location/change-scope decisions must each be reviewable gates. ${outputGateDedup}`,
    "feature-interview": `**Feature-specific gates.** Render the evidence brief, claim verdicts, assumptions, planning destination, prototype-first decision, priority hypothesis, and output-location/change-scope decisions as gates before writing or updating durable planning artifacts. ${outputGateDedup}`,
    "user-flow-map": `**User-flow-map gates.** Render surfaced flow assumptions, the proposed flow map, branch and decision coverage, state coverage, failure/recovery and handoff coverage, low-fidelity wireframe notes, output-location/change-scope decisions, and the downstream route to UI requirements as gates before writing final flow deliverables. ${outputGateDedup}`,
    "ui-interview": `**UI-specific gates.** Render surfaced assumptions, the UI or content requirements manifest, scope boundaries, output-location/change-scope decisions, and the coverage checkpoint as gates. In requirements-only mode, the content requirements manifest is the candidate/verdict gate and layout decisions must remain non-goals. ${outputGateDedup}`,
    "ux-variations": `**Variation-specific gates.** Render surfaced assumptions, variation manifest, concept selection, evaluation method, fixed-versus-variable scope, output-location/change-scope decisions, and coverage checkpoint as gates before writing final variation plans. ${outputGateDedup}`,
    "spec-interview": `**Spec-specific gates.** Render surfaced assumptions, scope/non-goals, candidate decisions, acceptance coverage, output-location/change-scope decisions, and post-approval route as gates before writing or replacing specs. ${outputGateDedup}`,
    "consolidate-variations": `**Consolidation-specific gates.** Render UAT evidence coverage, variation verdicts, selected concept, rejected alternatives, unresolved assumptions, output-location/change-scope decisions, and coverage checkpoint as gates. ${outputGateDedup}`,
    "prototype": `**Prototype-specific gates.** Render source-spec coverage, prototype scope, non-goals and deferred infrastructure, route/file destinations, file mutation scope, validation plan, and post-approval UAT route as gates. ${outputGateDedup}`,
    "uat": `**UAT-specific gates.** Render journey coverage, participant or evaluator assumptions, acceptance verdicts, evidence gaps, output-location/change-scope decisions, and post-approval route as gates. ${outputGateDedup}`,
    "icp": "**ICP research translation.** Render segment claims, exclusion rationale, buyer/user distinction, source coverage by customer category, evidence-backed pain intensity, uncertainty about reachable audiences, and the recommended next research or positioning decision as first-class research gates.",
    "competitive-analysis": "**Competitive research translation.** Render competitor coverage by category, pricing and packaging evidence, positioning claims, user-sentiment signals, integration or distribution evidence, recent activity, alternatives considered, lower-confidence comparisons, and source gaps that could change the strategic recommendation.",
    "journey-map": "**Journey research translation.** Render observed user/customer evidence separately from inferred journey stages. Include trigger, evaluation, activation, conversion, retention, and failure-point evidence where available, plus confidence gaps for any stage inferred without direct evidence.",
    "positioning": [
      "**Positioning research translation.** Render positioning claims with supporting ICP, competitive, journey, and customer-language evidence. Show alternatives considered, rejected narratives, confidence by claim, and which missing evidence would change the recommended position.",
      "**Multi-select framework convention.** When the positioning parent router presents framework selection in Mode A, the alignment page must include a multi-select checkbox section. Each framework option uses a checkbox input with `name=\"framework\"` and `value` matching the framework slug. Pre-check recommended defaults based on detected mode. The compiled YAML for framework selection includes `selected_frameworks` as a list of selected slugs and `execution_mode: sequential-todo`.",
      "**Product-positioning shortcut translation.** When Mode C queues the product-positioning shortcut, render the shortcut explanation, evidence readiness, exact proposed `tasks/todo.md` execution plan, and an approval gate. The page must make clear that `tasks/todo.md` is written only after final compiled YAML approval.",
      "**Synthesis mode translation.** When the skill runs in synthesis mode (`--synthesize`), the alignment page must render the full proposed `research/positioning.md` content with an evidence matrix mapping claims to supporting framework(s), a confidence register, market-mode validation plan, and framework cross-references showing where frameworks agree, disagree, or complement each other.",
    ].join("\n\n"),
    "customer-feedback": "**Customer-feedback research translation.** Render feedback evidence with source, date, segment, quote or observation, confidence, and bias risk. Separate verbatim feedback from agent interpretation, and show unresolved contradictions or sample coverage gaps.",
    "fork-idea-branch": `**Fork-specific gates.** Render the fork rationale, per-branch scope (label, slug, ICP hypothesis, value wedge hypothesis), reuse decisions per branch (fresh start vs. carry-forward with artifact types), archive confirmation for the current path, and proposed file changes as gates. The reuse decision gate must default to "Fresh start (recommended)" and explain contamination risk before presenting carry-forward options. ${outputGateDedup}`,
    "research-roadmap": "**Research-roadmap translation.** Render repository/documentation evidence by file path, observed documentation facts, inferred research gaps, priority rationale, rejected lower-priority items, source coverage gaps, and downstream implications for the next skill route.",
  };
  if (rules[skillName]) return rules[skillName];
  if (skillName === "repo-glossary") {
    return `**Glossary audit gates.** Render the seven term categories (existing, missing, conflicting, stale, shadowed, cross-path divergences, and inheritance gaps) as separate gate sections. Each category must include per-term inline radio questions for the user to approve, edit, reject, or flag terms. Include an evidence matrix mapping proposed changes to source documents. The glossary approval gate must show term, proposed definition, source, category, origin (parent or scoped), and per-term action controls. For shadowed terms, show parent and scoped definitions side by side. For cross-path divergences, show each sibling definition with its slug. ${outputGateDedup}`;
  }
  if (["icp", "competitive-analysis", "customer-feedback", "journey-map", "conversion-map", "retention-map"].includes(skillName)) {
    return `**Discovery-specific gates.** Render evidence coverage, assumptions/confidence, recommended path, output-location/change-scope decisions, approval, and post-approval route as gates before creating or updating canonical discovery artifacts. ${outputGateDedup}`;
  }
  if (/(research|audience|comparables|genre-map|store-page-test|playtest|positioning|adoption|user-map|monetization|platform-strategy|mvp-gap)/.test(skillName)) {
    return "**Research-pack translation.** For business, devtool, game, creator, and media research packs, render the claim/evidence/inference/assumption/decision-impact structure, source coverage categories appropriate to the domain, lower-confidence findings, and downstream implications before asking for approval or routing to the next skill.";
  }
  if (["assumption-tracker", "experiment", "cohort-review", "retro", "risk-register"].includes(skillName)) {
    return `**Risk-validation gates.** Render assumption/risk evidence coverage, confidence, candidate verdicts or mitigations, output-location/change-scope decisions, coverage checkpoint, and post-approval route as gates. Durable tracker outputs remain canonical markdown artifacts and must also be fully rendered in the alignment page. ${outputGateDedup}`;
  }
  return "";
}

function replaceOrInsert(content, skillName) {
  const headingMatch = content.match(/^(#{2,3}) Alignment Page$/m);
  const stub = stubParagraph(skillName);

  if (headingMatch?.index !== undefined) {
    const heading = headingMatch[0];
    const level = headingMatch[1].length;
    const afterHeading = headingMatch.index + heading.length;
    const nextHeading = new RegExp(`\\n#{1,${level}} (?!#)`, "g");
    nextHeading.lastIndex = afterHeading;
    const boundary = nextHeading.exec(content);
    const end = boundary ? boundary.index : content.length;

    // Swap only the pointer/stub paragraph for the stub; keep bespoke prose.
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

  const newSection = `## Alignment Page\n\n${stub}`;
  const insertion = content.search(/^## (Archive-First Replacement Policy|Default Shipping Contract)$/m);
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

const files = [...walk(`${repoRoot}/global`), ...walk(`${repoRoot}/packs`)]
  .filter((file) => /(^|\/)(codex|claude)\//.test(file))
  .sort();

const hasSectionRe = /^#{2,3} Alignment Page$/m;

// Extract the body of the `## Alignment Page` section (between its heading and
// the next heading of the same or higher level). Returns null if absent.
function alignmentSectionBody(content) {
  const m = content.match(/^(#{2,3}) Alignment Page$/m);
  if (!m || m.index === undefined) return null;
  const start = m.index + m[0].length;
  const level = m[1].length;
  const next = new RegExp(`\\n#{1,${level}} (?!#)`, "g");
  next.lastIndex = start;
  const boundary = next.exec(content);
  const end = boundary ? boundary.index : content.length;
  return content.slice(start, end).trim();
}

// The generator owns any section that carries the shared-convention pointer
// paragraph (or an already-generated stub). It bundles the convention and
// swaps just that paragraph for the stub, leaving any surrounding bespoke
// prose intact. Fully hand-authored sections with no pointer/stub paragraph
// (condensed gates, custom timing rules) are self-contained and left verbatim.
function isOwnable(body) {
  if (body === null) return false;
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .some(isPointerOrStub);
}

let updated = 0;
let skipList = 0;
let outOfScope = 0;
let bespoke = 0;
let bundlesWritten = 0;

// Per-skill-name classification across mirrors, so a half-converted pair or
// an unlisted bespoke section cannot be skipped silently.
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
  const body = alignmentSectionBody(before);
  // Skills without an alignment section are out of scope.
  if (body === null) {
    outOfScope += 1;
    continue;
  }
  // Preserve hand-authored / hybrid alignment sections verbatim.
  if (!isOwnable(body)) {
    bespoke += 1;
    recordClassification(skillName, file, "bespokeFiles");
    continue;
  }
  recordClassification(skillName, file, "ownableFiles");

  // 1. Bundled, load-on-demand convention file beside the skill.
  const bundlePath = join(dirname(abs), "ALIGNMENT-PAGE.md");
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

// Generated-bundle drift validation: every generator-owned (ownable) skill's
// on-disk ALIGNMENT-PAGE.md must byte-equal the renderer's expected output,
// and its SKILL.md stub paragraph must be current. Runs after the write loop
// so write mode validates final on-disk state. Bespoke (allowlisted) and
// skip-listed bundles have no expected render and are exempt — their path
// consistency is still validated below. Drift here fails only in --check
// mode; in --dry-run it is the legitimate pending-update preview.
const bundleDiagnostics = [];
let ownableChecked = 0;
for (const [name, { ownableFiles, bespokeFiles }] of classification) {
  // Mixed sibling pairs already fail via the bespoke diagnostics below.
  if (bespokeFiles.length) continue;
  for (const file of ownableFiles) {
    ownableChecked += 1;
    const abs = `${repoRoot}/${file}`;
    const bundlePath = join(dirname(abs), "ALIGNMENT-PAGE.md");
    const relBundle = relative(repoRoot, bundlePath);
    const expected = bundledContentFor(name, file);
    if (!existsSync(bundlePath)) {
      bundleDiagnostics.push(
        `Missing generated bundle ${relBundle} for "${name}". Run node scripts/upgrade-alignment-page.mjs to generate it.`,
      );
    } else if (readFileSync(bundlePath, "utf8") !== expected) {
      bundleDiagnostics.push(
        `Stale generated bundle ${relBundle} for "${name}" — differs from expected renderer output. Never hand-edit a generated bundle; re-run node scripts/upgrade-alignment-page.mjs to regenerate it.`,
      );
    }
    const content = readFileSync(abs, "utf8");
    if (replaceOrInsert(content, name) !== content) {
      bundleDiagnostics.push(
        `Stale SKILL.md stub in ${file} for "${name}" — the alignment section's pointer/stub paragraph needs replacing. Run node scripts/upgrade-alignment-page.mjs to update it.`,
      );
    }
  }
}

// Path-consistency validation: every active ALIGNMENT-PAGE.md must reference
// only its owning skill's `alignment/{skill-name}-{topic}.html` output path.
// Archive copies (docs/history/archive/.../alignment/<name>-{topic}.html) end
// with the same segment, so the check applies uniformly. Runs after the write
// loop so write mode validates final on-disk state; a foreign name indicates a
// stale, hand-edited, or mis-rendered bundle.
const OUTPUT_PATH_RE = /alignment\/([A-Za-z0-9_-]+)-\{topic\}\.html/g;
const pathDiagnostics = [];
let bundlesChecked = 0;
for (const file of files) {
  const skillName = skillNameFor(file);
  const bundlePath = join(dirname(`${repoRoot}/${file}`), "ALIGNMENT-PAGE.md");
  if (!existsSync(bundlePath)) continue;
  bundlesChecked += 1;
  const foreignNames = new Set();
  for (const match of readFileSync(bundlePath, "utf8").matchAll(OUTPUT_PATH_RE)) {
    if (match[1] !== skillName) foreignNames.add(match[1]);
  }
  if (foreignNames.size) {
    pathDiagnostics.push(
      `Foreign output path in ${relative(repoRoot, bundlePath)} — references ${[...foreignNames].map((n) => `alignment/${n}-{topic}.html`).join(", ")} but the owning skill is "${skillName}". Regenerate the bundle or fix the hand-authored path.`,
    );
  }
}

// Failing diagnostics: bespoke classification must match the allowlist
// exactly, and sibling mirrors must agree, in both dry-run and write mode.
const diagnostics = [];
for (const [name, { bespokeFiles, ownableFiles }] of classification) {
  if (bespokeFiles.length && ownableFiles.length) {
    diagnostics.push(
      `Mixed siblings for "${name}" — generated: ${ownableFiles.join(", ")}; bespoke: ${bespokeFiles.join(", ")}. Convert the bespoke mirror(s) to the generated stub paragraph or hand-author both mirrors.`,
    );
  } else if (bespokeFiles.length && !bespokeAllowlist.has(name)) {
    diagnostics.push(
      `Unlisted bespoke section for "${name}" in: ${bespokeFiles.join(", ")}. Add "${name}" to scripts/alignment-bespoke-list.txt if intentional, or restore the generated stub paragraph so the bundle stays in sync.`,
    );
  }
}
for (const name of bespokeAllowlist) {
  const entry = classification.get(name);
  if (!entry || entry.bespokeFiles.length === 0) {
    diagnostics.push(
      `Stale allowlist entry "${name}" in scripts/alignment-bespoke-list.txt — no bespoke alignment section found. Remove the entry.`,
    );
  }
}

console.log("");
console.log(`Updated: ${updated}`);
console.log(`Bundled files written: ${bundlesWritten}`);
console.log(`Skipped by ${relative(repoRoot, skipPath)}: ${skipList}`);
console.log(`Preserved bespoke sections: ${bespoke}`);
console.log(`Out of scope: ${outOfScope}`);
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
