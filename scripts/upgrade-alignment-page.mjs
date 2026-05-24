#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const all = args.has("--all");

const coreSkills = new Set([
  "concept-exploration",
  "feature-interview",
  "ui-interview",
  "ux-variations",
  "spec-interview",
  "consolidate-variations",
  "prototype",
  "uat",
  "icp",
  "competitive-analysis",
  "customer-feedback",
  "journey-map",
  "conversion-map",
  "retention-map",
  "assumption-tracker",
  "experiment",
  "cohort-review",
  "retro",
  "risk-register",
]);

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

function sectionFor(skillName, heading = "##") {
  const specific = skillSpecificGates(skillName);
  return `${heading} Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at \`alignment/${skillName}-{topic}.html\`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as \`research/assumption-tracker.md\`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: \`--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;\`. Apply \`background: var(--bg); color: var(--text);\` on body. Use \`--surface\` for cards, nav, and table headers. Use \`--border\` for all borders. Use \`--purple\` for question blocks and gate headings. Use \`--accent\` for links and section headings. Keep headings \`color: #fff\` or \`var(--accent)\` for hierarchy. Question block backgrounds should use \`#1c2333\`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.
${specific ? `\n${specific}\n` : ""}

**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: \`section\`, \`gate_type\`, \`status\` (\`answered\`, \`other\`, or \`needs-clarification\`), \`answer\`, optional \`notes\`, and optional \`target_artifact\` or \`target_path\` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include \`Recommended next skill\`, \`Recommended next command\`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to \`docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/${skillName}-{topic}.html\`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.`;
}

function skillSpecificGates(skillName) {
  const rules = {
    "concept-exploration": "**Concept-specific gates.** Render the Concept Assumptions Manifest as a first-class assumptions/confidence gate inside the alignment page before proposed deliverables. The concept identity, slug, scope/non-goals, ICP readiness, artifact destination, and proposed file changes must each be reviewable gates.",
    "feature-interview": "**Feature-specific gates.** Render the evidence brief, claim verdicts, assumptions, planning destination, prototype-first decision, priority hypothesis, artifact destination, and proposed file changes as gates before writing or updating durable planning artifacts.",
    "ui-interview": "**UI-specific gates.** Render surfaced assumptions, the UI or content requirements manifest, scope boundaries, artifact destination, proposed file changes, and the coverage checkpoint as gates. In requirements-only mode, the content requirements manifest is the candidate/verdict gate and layout decisions must remain non-goals.",
    "ux-variations": "**Variation-specific gates.** Render surfaced assumptions, variation manifest, concept selection, evaluation method, fixed-versus-variable scope, artifact destination, proposed file changes, and coverage checkpoint as gates before writing final variation plans.",
    "spec-interview": "**Spec-specific gates.** Render surfaced assumptions, scope/non-goals, candidate decisions, acceptance coverage, artifact destination, proposed file changes, and post-approval route as gates before writing or replacing specs.",
    "consolidate-variations": "**Consolidation-specific gates.** Render UAT evidence coverage, variation verdicts, selected concept, rejected alternatives, unresolved assumptions, artifact destination, proposed file changes, and coverage checkpoint as gates.",
    "prototype": "**Prototype-specific gates.** Render source-spec coverage, prototype scope, non-goals and deferred infrastructure, route/file destinations, proposed file changes, validation plan, and post-approval UAT route as gates.",
    "uat": "**UAT-specific gates.** Render journey coverage, participant or evaluator assumptions, acceptance verdicts, evidence gaps, artifact destination, proposed file changes, and post-approval route as gates.",
  };
  if (rules[skillName]) return rules[skillName];
  if (["icp", "competitive-analysis", "customer-feedback", "journey-map", "conversion-map", "retention-map"].includes(skillName)) {
    return "**Discovery-specific gates.** Render evidence coverage, assumptions/confidence, recommended path, artifact destination, proposed file changes, approval, and post-approval route as gates before creating or updating canonical discovery artifacts.";
  }
  if (["assumption-tracker", "experiment", "cohort-review", "retro", "risk-register"].includes(skillName)) {
    return "**Risk-validation gates.** Render assumption/risk evidence coverage, confidence, candidate verdicts or mitigations, artifact destination, proposed file changes, coverage checkpoint, and post-approval route as gates. Durable tracker outputs remain canonical markdown artifacts and must also be fully rendered in the alignment page.";
  }
  return "";
}

function replaceOrInsert(content, skillName) {
  const headingMatch = content.match(/^#{2,3} Alignment Page$/m);
  const newSection = sectionFor(skillName, headingMatch?.[0].startsWith("###") ? "###" : "##");

  if (headingMatch?.index !== undefined) {
    const start = headingMatch.index;
    const heading = headingMatch[0];
    const level = heading.match(/^#+/)?.[0].length ?? 2;
    const afterHeading = start + heading.length;
    const nextHeading = new RegExp(`\\n#{1,${level}} (?!#)`, "g");
    nextHeading.lastIndex = afterHeading;
    const boundary = nextHeading.exec(content);
    const end = boundary ? boundary.index + 1 : content.length;
    return `${content.slice(0, start)}${newSection}\n\n${content.slice(end).replace(/^\n+/, "")}`;
  }

  const insertion = content.search(/^## (Archive-First Replacement Policy|Default Shipping Contract)$/m);
  if (insertion >= 0) {
    return `${content.slice(0, insertion).replace(/\n*$/, "\n\n")}${newSection}\n\n${content.slice(insertion)}`;
  }
  return `${content.replace(/\n*$/, "\n\n")}${newSection}\n`;
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
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

let updated = 0;
let skipList = 0;
let outOfScope = 0;

for (const file of files) {
  const skillName = skillNameFor(file);
  if (skippedNames.has(skillName)) {
    skipList += 1;
    continue;
  }
  if (!all && !coreSkills.has(skillName)) {
    outOfScope += 1;
    continue;
  }

  const abs = `${repoRoot}/${file}`;
  const before = readFileSync(abs, "utf8");
  const after = replaceOrInsert(before, skillName);
  if (before === after) continue;

  updated += 1;
  const action = before.match(/^#{2,3} Alignment Page$/m) ? "replace" : "insert";
  console.log(`${dryRun ? "[dry-run] " : ""}${action} ${file}`);
  if (!dryRun) writeFileSync(abs, after);
}

console.log("");
console.log(`Updated: ${updated}`);
console.log(`Skipped by ${relative(repoRoot, skipPath)}: ${skipList}`);
console.log(`Out of scope: ${outOfScope}`);
