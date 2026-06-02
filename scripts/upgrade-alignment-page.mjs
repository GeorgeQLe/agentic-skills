#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
// --all is retained as a no-op alias: all alignment-producing skills are covered by default.

const skipPath = `${repoRoot}/scripts/alignment-skip-list.txt`;
const skippedNames = new Set();
if (existsSync(skipPath)) {
  for (const rawLine of readFileSync(skipPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (line) skippedNames.add(line);
  }
}

function skillNameFor(file) {
  const parts = file.split("/");
  return parts[parts.length - 2];
}

// Single authoring source: the marked block inside CLAUDE.md.
const claudeMdPath = `${repoRoot}/CLAUDE.md`;
const claudeMd = readFileSync(claudeMdPath, "utf8");
const markerMatch = claudeMd.match(
  /<!-- alignment-convention:start -->\n([\s\S]*?)\n<!-- alignment-convention:end -->/,
);
if (!markerMatch) {
  console.error(
    "Could not find <!-- alignment-convention:start --> / :end markers in CLAUDE.md",
  );
  process.exit(1);
}
const conventionTemplate = markerMatch[1];

// Full convention text bundled into each skill's ALIGNMENT-PAGE.md.
function bundledContentFor(skillName) {
  const specific = skillSpecificGates(skillName);
  const body = conventionTemplate
    .replaceAll("{skill-name}", skillName)
    .replace(/\n*\{\{SKILL_SPECIFIC_GATES\}\}\n*/, specific ? `\n\n${specific}\n\n` : "\n\n")
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

function skillSpecificGates(skillName) {
  const rules = {
    "idea-scope-brief": "**Concept-specific gates.** Render the Concept Assumptions Manifest as a first-class assumptions/confidence gate inside the alignment page before proposed deliverables. The concept identity, slug, scope/non-goals, ICP readiness, artifact destination, and proposed file changes must each be reviewable gates.",
    "feature-interview": "**Feature-specific gates.** Render the evidence brief, claim verdicts, assumptions, planning destination, prototype-first decision, priority hypothesis, artifact destination, and proposed file changes as gates before writing or updating durable planning artifacts.",
    "ui-interview": "**UI-specific gates.** Render surfaced assumptions, the UI or content requirements manifest, scope boundaries, artifact destination, proposed file changes, and the coverage checkpoint as gates. In requirements-only mode, the content requirements manifest is the candidate/verdict gate and layout decisions must remain non-goals.",
    "ux-variations": "**Variation-specific gates.** Render surfaced assumptions, variation manifest, concept selection, evaluation method, fixed-versus-variable scope, artifact destination, proposed file changes, and coverage checkpoint as gates before writing final variation plans.",
    "spec-interview": "**Spec-specific gates.** Render surfaced assumptions, scope/non-goals, candidate decisions, acceptance coverage, artifact destination, proposed file changes, and post-approval route as gates before writing or replacing specs.",
    "consolidate-variations": "**Consolidation-specific gates.** Render UAT evidence coverage, variation verdicts, selected concept, rejected alternatives, unresolved assumptions, artifact destination, proposed file changes, and coverage checkpoint as gates.",
    "prototype": "**Prototype-specific gates.** Render source-spec coverage, prototype scope, non-goals and deferred infrastructure, route/file destinations, proposed file changes, validation plan, and post-approval UAT route as gates.",
    "uat": "**UAT-specific gates.** Render journey coverage, participant or evaluator assumptions, acceptance verdicts, evidence gaps, artifact destination, proposed file changes, and post-approval route as gates.",
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
    "research-roadmap": "**Research-roadmap translation.** Render repository/documentation evidence by file path, observed documentation facts, inferred research gaps, priority rationale, rejected lower-priority items, source coverage gaps, and downstream implications for the next skill route.",
  };
  if (rules[skillName]) return rules[skillName];
  if (["icp", "competitive-analysis", "customer-feedback", "journey-map", "conversion-map", "retention-map"].includes(skillName)) {
    return "**Discovery-specific gates.** Render evidence coverage, assumptions/confidence, recommended path, artifact destination, proposed file changes, approval, and post-approval route as gates before creating or updating canonical discovery artifacts.";
  }
  if (/(research|audience|comparables|genre-map|store-page-test|playtest|positioning|adoption|user-map|monetization|platform-strategy|mvp-gap)/.test(skillName)) {
    return "**Research-pack translation.** For business, devtool, game, creator, and media research packs, render the claim/evidence/inference/assumption/decision-impact structure, source coverage categories appropriate to the domain, lower-confidence findings, and downstream implications before asking for approval or routing to the next skill.";
  }
  if (["assumption-tracker", "experiment", "cohort-review", "retro", "risk-register"].includes(skillName)) {
    return "**Risk-validation gates.** Render assumption/risk evidence coverage, confidence, candidate verdicts or mitigations, artifact destination, proposed file changes, coverage checkpoint, and post-approval route as gates. Durable tracker outputs remain canonical markdown artifacts and must also be fully rendered in the alignment page.";
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
    continue;
  }

  // 1. Bundled, load-on-demand convention file beside the skill.
  const bundlePath = join(dirname(abs), "ALIGNMENT-PAGE.md");
  const bundleContent = bundledContentFor(skillName);
  const bundleBefore = existsSync(bundlePath) ? readFileSync(bundlePath, "utf8") : "";
  const bundleChanged = bundleBefore !== bundleContent;

  // 2. Short stub inside SKILL.md pointing at the bundled file.
  const after = replaceOrInsert(before, skillName);
  const skillChanged = before !== after;

  if (!bundleChanged && !skillChanged) continue;

  updated += 1;
  if (skillChanged) {
    const action = hasSectionRe.test(before) ? "replace" : "insert";
    console.log(`${dryRun ? "[dry-run] " : ""}${action} stub ${file}`);
    if (!dryRun) writeFileSync(abs, after);
  }
  if (bundleChanged) {
    bundlesWritten += 1;
    console.log(`${dryRun ? "[dry-run] " : ""}write ${relative(repoRoot, bundlePath)}`);
    if (!dryRun) writeFileSync(bundlePath, bundleContent);
  }
}

console.log("");
console.log(`Updated: ${updated}`);
console.log(`Bundled files written: ${bundlesWritten}`);
console.log(`Skipped by ${relative(repoRoot, skipPath)}: ${skipList}`);
console.log(`Preserved bespoke sections: ${bespoke}`);
console.log(`Out of scope: ${outOfScope}`);
