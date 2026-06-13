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

const OPTIONAL_ALIGNMENT_SKILLS = new Set([
  "roadmap",
  "research-roadmap",
  "plan-phase",
  "brainstorm",
  "devtool-workflow",
  "game-workflow",
  "game-roadmap",
  "experiment",
  "mono-plan",
  "vertical-slice-splitter",
  "reconcile-dev-docs",
  "analyze-sessions",
  "prompt-history-backfill",
  "benchmark-test-skill",
  "benchmark-agent-review",
  "afps-status",
  "handoff",
  "branch-lifecycle",
  "release",
  "product-line",
  "skill-inventory",
  "provision-agentic-config",
]);

function isOptionalAlignmentSkill(skillName) {
  return OPTIONAL_ALIGNMENT_SKILLS.has(skillName);
}

function optionalConventionTemplate(skillName) {
  const automaticIntro =
    "When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/{skill-name}-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.";
  const optionalIntro =
    "Alignment pages are optional for this operational skill. By default, report the outcome inline and write only the skill's normal durable artifacts (`tasks/*.md`, reports, queues, benchmark notes, status docs, or other skill-specific files). Build `alignment/{skill-name}-{topic}.html` only when the user explicitly requests an alignment page or when the agent explicitly identifies a concrete clarification/review need that cannot be resolved cleanly in conversation or the normal artifacts. When an alignment page is created, use the full contract below and a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.";
  if (!conventionTemplate.startsWith(automaticIntro)) {
    throw new Error(`Unexpected alignment convention intro while rendering optional policy for ${skillName}`);
  }
  return conventionTemplate.replace(automaticIntro, optionalIntro);
}

// Full convention text bundled into each skill's ALIGNMENT-PAGE.md.
function bundledContentFor(skillName, skillPath) {
  const specific = skillSpecificGates(skillName, skillPath);
  const tier = skillVisualTier(skillName, skillPath);
  const tierText = visualTierGuidance(tier);
  const contextIntake = skillPath ? skillContextIntake(skillPath) : null;
  const contextText = contextIntake ? contextIntakeGuidance(contextIntake) : "";
  const skillType = skillPath ? readSkillType(skillPath) : null;
  const glossaryApplies = skillType === 'research' || skillType === 'analysis';
  const glossaryText = glossaryApplies ? glossaryGateText(skillName) : '';
  const template = isOptionalAlignmentSkill(skillName) ? optionalConventionTemplate(skillName) : conventionTemplate;
  const body = template
    .replaceAll("{skill-name}", skillName)
    .replace(/\n*\{\{SKILL_SPECIFIC_GATES\}\}\n*/, specific ? `\n\n${specific}\n\n` : "\n\n")
    .replace(/\n*\{\{SKILL_CONTEXT_INTAKE\}\}\n*/, contextText ? `\n\n${contextText}\n\n` : "\n\n")
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
const OPTIONAL_STUB_PREFIX = "By default, this skill reports results inline";

function stubParagraph(skillName) {
  if (isOptionalAlignmentSkill(skillName)) {
    return `By default, this skill reports results inline and writes only its normal durable artifacts (for example \`tasks/*.md\`, reports, queues, benchmark notes, status docs, or other skill-specific files). Do not build an alignment page automatically. Create \`alignment/${skillName}-{topic}.html\` only when the user explicitly requests an alignment page or when you explicitly identify a concrete clarification/review need that cannot be handled cleanly inline; when you create one, follow \`ALIGNMENT-PAGE.md\` in this skill's directory.`;
  }
  return `When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following \`ALIGNMENT-PAGE.md\` in this skill's directory. Output: \`alignment/${skillName}-{topic}.html\`.`;
}

function isPointerOrStub(paragraph) {
  return paragraph.startsWith(POINTER_PREFIX) || paragraph.startsWith(STUB_PREFIX) || paragraph.startsWith(OPTIONAL_STUB_PREFIX);
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
  'five-rings', 'four-forces', 'jtbd-needs', 'pmf-engine', 'seven-dimensions', 'w3-hypothesis',
  'feature-pricing-matrix', 'porter-five-forces', 'strategic-group-map', 'swot',
  'category-design', 'jtbd-positioning', 'moore-positioning', 'obviously-awesome', 'strategic-canvas',
  'customer-journey-canvas', 'experience-map', 'jtbd-timeline', 'service-blueprint', 'user-story-map',
]);

const PROTOTYPE_TIER_SKILLS = new Set([
  'ux-variations', 'prototype', 'design-system', 'ui-interview', 'user-flow-map',
  'consolidate-variations', 'brainstorm', 'game-prototype-test', 'game-store-page-test',
  'landing-copy', 'uat-guide', 'animation-design-planner',
]);

function skillVisualTier(skillName, skillPath) {
  const declared = skillPath ? readSkillFrontmatterField(skillPath, 'visual_tier') : null;
  if (declared === 'document' || declared === 'visual' || declared === 'prototype') return declared;
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

// --- Context Intake ---
function skillContextIntake(skillPath) {
  const declared = readSkillFrontmatterField(skillPath, 'context_intake');
  if (declared === 'deep' || declared === 'scoped' || declared === 'artifact_only') return declared;
  return null;
}

function contextIntakeGuidance(contextIntake) {
  if (contextIntake === 'deep') {
    return `**Context intake.** This skill declares \`context_intake: deep\` (Deep interview). Gather repo/project context before asking, present an assumptions manifest when the contract requires it, ask focused questions, and confirm coverage before building review artifacts.`;
  }
  if (contextIntake === 'scoped') {
    return `**Context intake.** This skill declares \`context_intake: scoped\` (Scoped intake). Ask only the focused questions needed to scope the research or analysis, then validate critical findings before building review artifacts.`;
  }
  if (contextIntake === 'artifact_only') {
    return `**Context intake.** This skill declares \`context_intake: artifact_only\` (Artifact-driven). Work from concrete artifacts, data, logs, or existing instructions by default; ask concise clarification questions only when the available artifacts are missing, contradictory, or unsafe to interpret.`;
  }
  return '';
}

// --- Glossary Gate ---
// Read the skill type from SKILL.md frontmatter to determine if glossary gate applies.
function readSkillFrontmatterField(skillPath, field) {
  try {
    const content = readFileSync(`${repoRoot}/${skillPath}`, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) return null;
    const fieldMatch = fm[1].match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
    return fieldMatch ? fieldMatch[1].trim() : null;
  } catch { return null; }
}

function readSkillType(skillPath) {
  return readSkillFrontmatterField(skillPath, 'type');
}

function glossaryGateText(skillName) {
  return `**Glossary Additions gate.** When this research introduces domain-specific terms, acronyms, or concept definitions that a reader outside the project would not know, include a \`## Glossary Additions\` section in the alignment page. Render a table of proposed terms with columns: Term, Definition, Source (\`${skillName}\`), Category (business/tooling/workflow/technical/domain), and per-term Approve/Edit/Reject/Flag radio controls. Only user-approved terms are appended to the target glossary (\`research/glossary.md\` or \`research/{slug}/glossary.md\` for scoped paths) during the confirmed-page write step. When the skill operates in a product-path scope, ask whether each term belongs in the parent or scoped glossary; default to the scoped glossary.`;
}

const FRAMEWORK_SUBSKILL_TRANSLATIONS = {
  "feature-pricing-matrix": {
    title: "Feature-pricing matrix",
    focus: "Compare competitors, tiers, packaging gates, usage limits, add-ons, buyer segments, and published pricing evidence. Separate observed pricing/feature facts from inferred value fences, assumptions about hidden enterprise terms, and decision impact for parent competitive synthesis.",
    format: "Render a competitor-by-feature matrix, a tier/price comparison table, source and recency badges per cell, confidence markers for estimated values, and a summary of pricing-packaging implications.",
    feedback: "Ask reviewers to confirm the competitor set, feature taxonomy, tier equivalence, estimated prices, confidence ratings, missing sources, and which packaging gaps should influence the parent recommendation.",
  },
  "porter-five-forces": {
    title: "Porter five forces",
    focus: "Gather evidence for rivalry, substitutes, new entrants, buyer power, and supplier power within a clearly bounded market. Separate market-structure claims from source evidence, pressure inferences, assumptions about boundaries, and decision impact for strategy.",
    format: "Render a five-force pressure map or scorecard, force-by-force evidence tables, confidence by force, contradictions, source gaps, and a concise industry-attractiveness verdict.",
    feedback: "Ask reviewers to confirm the market boundary, pressure ratings, force weighting, substitute and entrant definitions, buyer/supplier assumptions, missing evidence, and strategic implications.",
  },
  "strategic-group-map": {
    title: "Strategic group map",
    focus: "Gather evidence for competitor positioning, axis selection, strategic dimensions, and cluster membership. Separate factual competitor attributes from inferred placements, axis assumptions, confidence, and decision impact.",
    format: "Render a two-axis strategic map or scatter plot with cluster labels, axis definitions, competitor placement rationale, confidence by placement, and a table of alternatives considered for axes.",
    feedback: "Ask reviewers to confirm axis choices, competitor set, cluster names, placement confidence, outliers, missing competitors, and which whitespace or crowding patterns should matter to parent synthesis.",
  },
  swot: {
    title: "SWOT",
    focus: "Classify strengths, weaknesses, opportunities, and threats with evidence for each item. Separate internal facts from external market signals, inference from assumption, confidence level, and decision impact.",
    format: "Render four SWOT quadrants plus a prioritized evidence table that maps each item to source, confidence, owner scope, time horizon, and recommended action or watch item.",
    feedback: "Ask reviewers to confirm quadrant placement, priority, evidence sufficiency, stale or missing sources, overclaimed strengths, understated threats, and implications for the parent competitive recommendation.",
  },
  "five-rings": {
    title: "Five Rings",
    focus: "Gather candidate-specific evidence for Priority Initiatives, Success Factors, Perceived Barriers, Decision Criteria, and Buyer's Journey. Separate observed buyer language from inference, assumptions, confidence, and decision impact.",
    format: "Render an ICP-candidate-by-ring matrix, buyer-journey timeline, confidence by ring, source coverage gaps, contradictions, and parent-synthesis implications for candidate priority.",
    feedback: "Ask reviewers to confirm candidate definitions, ring labels, buyer-language evidence, confidence ratings, missing buying-committee sources, and which ring should most affect ICP selection.",
  },
  "four-forces": {
    title: "Four Forces",
    focus: "Gather switching-story evidence for push of the current situation, pull of the new solution, anxieties of change, and habits of the present. Separate user quotes/events from inferred force strength, assumptions, and decision impact.",
    format: "Render a force map per ICP candidate, a switching timeline, force-strength scorecards, evidence for and against each force, confidence, and source gaps.",
    feedback: "Ask reviewers to confirm the trigger event, force strengths, anxiety and habit barriers, candidate comparison, confidence ratings, missing switch-story evidence, and adoption implications.",
  },
  "jtbd-needs": {
    title: "JTBD needs",
    focus: "Gather job, circumstance, desired-outcome, current-alternative, pain, and gain evidence for each candidate. Separate observed job language from inferred outcome statements, assumptions, confidence, and decision impact.",
    format: "Render job statements and outcome scorecards, candidate-by-need matrices, importance/satisfaction or opportunity ratings when evidence supports them, evidence tables, and source gaps.",
    feedback: "Ask reviewers to confirm job framing, outcome wording, candidate fit, importance and satisfaction scoring, missing evidence, and which underserved needs should drive parent synthesis.",
  },
  "pmf-engine": {
    title: "PMF Engine",
    focus: "Gather real user evidence for Sean Ellis PMF signal, very-disappointed segmentation, retention/usage behavior, alternatives, and High-Expectation Customer synthesis. Separate observed user data from inference, sample assumptions, confidence, and decision impact.",
    format: "Render a data-readiness scorecard, PMF signal table, very-disappointed segment analysis, HXC profile, retention/behavior evidence matrix, confidence register, and minimum-evidence gaps.",
    feedback: "Ask reviewers to confirm evidence completeness, segment cuts, sample-size and bias risks, HXC realism, product-focus implications, missing data, and whether PMF claims are sufficiently supported.",
  },
  "seven-dimensions": {
    title: "Seven dimensions",
    focus: "Gather per-candidate evidence for Readiness, Willingness, Ability, Success Potential, Acquisition Efficiency, Ascension Potential, and Advocacy Potential. Separate scored claims from evidence, inference, assumptions, confidence, and decision impact.",
    format: "Render a seven-dimension candidate scorecard, weighted composite table, confidence by dimension, evidence-strength badges, weakest-dimension callouts, and sensitivity notes.",
    feedback: "Ask reviewers to confirm dimension scores, weighting, candidate definitions, weak-dimension interpretation, evidence strength, missing sources, and how the composite should influence ICP selection.",
  },
  "w3-hypothesis": {
    title: "W3 hypothesis",
    focus: "Gather evidence for WHO, WHAT, and WHY for each ICP candidate, including disproval hypotheses and evidence against each W. Separate candidate claims from source evidence, inference, assumptions, confidence, and decision impact.",
    format: "Render each ICP candidate as a WHO/WHAT/WHY triptych or equivalent side-by-side module with weakest-W confidence, cross-candidate comparison, research-log coverage by W dimension, and source gaps that could reverse the hypothesis.",
    feedback: "Ask reviewers to confirm candidate definitions, WHO/WHAT/WHY wording, disproval evidence, weakest-W confidence, missing sources, and explicit implications for the parent `customer-discovery` synthesis.",
  },
  "category-design": {
    title: "Category design",
    focus: "Gather evidence for category problem, old-game alternatives, new-category POV, ecosystem actors, language patterns, and category-name viability. Separate category claims from evidence, inference, assumptions, confidence, and decision impact.",
    format: "Render a category POV canvas, old-game/new-game comparison, ecosystem map, naming scorecard, evidence matrix, and confidence/source-gap register.",
    feedback: "Ask reviewers to confirm the category boundary, enemy/problem framing, name candidates, ecosystem assumptions, confidence ratings, missing sources, and implications for positioning synthesis.",
  },
  "jtbd-positioning": {
    title: "JTBD positioning",
    focus: "Gather evidence for target job, hiring circumstance, desired progress, current alternatives, anxieties, and value criteria. Separate job claims from evidence, inference, assumptions, confidence, and decision impact.",
    format: "Render a job story map, progress forces summary, alternatives table, outcome/value-criteria matrix, confidence register, and positioning implications.",
    feedback: "Ask reviewers to confirm job wording, circumstance boundaries, alternatives, value criteria, confidence ratings, missing customer language, and which job should anchor positioning.",
  },
  "moore-positioning": {
    title: "Moore positioning",
    focus: "Gather evidence for target customer, need, product category, key benefit, primary alternative, and differentiation. Separate template claims from evidence, inference, assumptions, confidence, and decision impact.",
    format: "Render Geoffrey Moore positioning templates, claim-by-claim evidence matrix, alternative/differentiator comparison, confidence register, and rejected template variants.",
    feedback: "Ask reviewers to confirm target segment, category label, benefit statement, alternative frame, differentiator, confidence, missing proof, and final template implications.",
  },
  "obviously-awesome": {
    title: "Obviously Awesome",
    focus: "Gather evidence for competitive alternatives, unique attributes, value themes, best-fit customers, and market category. Separate positioning claims from evidence, inference, assumptions, confidence, and decision impact.",
    format: "Render an Obviously Awesome component matrix, alternatives-to-attributes-to-value chain, best-fit customer scorecard, market-category options, and confidence/source gaps.",
    feedback: "Ask reviewers to confirm competitive alternatives, unique attributes, value themes, best-fit customer definition, category choice, confidence ratings, and synthesis implications.",
  },
  "strategic-canvas": {
    title: "Strategic canvas",
    focus: "Gather evidence for competing factors, buyer value criteria, competitor factor ratings, and raise/reduce/eliminate/create moves. Separate value-curve claims from evidence, inference, assumptions, confidence, and decision impact.",
    format: "Render a value curve or strategic canvas, factor-definition table, competitor scoring evidence, ERRC grid, confidence markers, and factor/source gaps.",
    feedback: "Ask reviewers to confirm factors, competitor ratings, value-curve shape, ERRC moves, confidence, missing sources, and which moves should influence positioning synthesis.",
  },
  "customer-journey-canvas": {
    title: "Customer journey canvas",
    focus: "Gather stage, touchpoint, action, emotion, backstage, pain, and opportunity evidence across the journey. Separate observed customer behavior from inferred stages, assumptions, confidence, and decision impact.",
    format: "Render a stage-by-touchpoint canvas with actions, emotions, backstage dependencies, pains, opportunities, source coverage, confidence, and stage-level gaps.",
    feedback: "Ask reviewers to confirm journey stages, touchpoints, emotional readings, backstage assumptions, opportunity priority, missing evidence, and implications for the parent journey map.",
  },
  "experience-map": {
    title: "Experience map",
    focus: "Gather evidence for doing, thinking, feeling, pain, delight, and channel transitions across the end-to-end experience. Separate observed evidence from inferred emotional arc, assumptions, confidence, and decision impact.",
    format: "Render an experience map with phase lanes, emotional arc, channel-transition markers, pain/delight moments, confidence by phase, and source gaps.",
    feedback: "Ask reviewers to confirm phases, emotional highs/lows, channel transitions, pain/delight priority, confidence ratings, missing evidence, and journey synthesis implications.",
  },
  "jtbd-timeline": {
    title: "JTBD timeline",
    focus: "Gather switching evidence for first thought, passive looking, active looking, deciding, consuming, and satisfaction, plus push, pull, anxiety, and habit forces. Separate observed switch events from inference, assumptions, confidence, and decision impact.",
    format: "Render a switching timeline with force overlays, stage evidence cards, trigger and decision criteria tables, anxiety/habit blockers, confidence, and source gaps.",
    feedback: "Ask reviewers to confirm timeline stages, trigger events, force strengths, decision criteria, anxieties/habits, confidence ratings, and implications for the parent journey map.",
  },
  "service-blueprint": {
    title: "Service blueprint",
    focus: "Gather evidence for customer actions, front-stage interactions, backstage work, support processes, physical/digital evidence, failure points, and operational dependencies. Separate observed service facts from inferred dependencies, assumptions, confidence, and decision impact.",
    format: "Render a service blueprint with front-stage/backstage/support/evidence swimlanes, line-of-interaction markers, failure/opportunity callouts, confidence, and source gaps.",
    feedback: "Ask reviewers to confirm swimlane assignments, backstage dependencies, support-process gaps, evidence artifacts, operational risks, confidence ratings, and journey synthesis implications.",
  },
  "user-story-map": {
    title: "User story map",
    focus: "Gather evidence for activities, tasks, stories, release slices, walking skeleton, persona/job fit, and dependency order. Separate user-behavior evidence from inferred story hierarchy, assumptions, confidence, and decision impact.",
    format: "Render an activity-task-story backbone, release-slice bands, walking-skeleton marker, dependency and confidence notes, evidence links, and source gaps.",
    feedback: "Ask reviewers to confirm activity backbone, task/story granularity, slice priority, walking skeleton, missing stories, confidence ratings, and implications for the parent journey map.",
  },
};

function frameworkGuidance(entry, outputGateDedup) {
  return `**${entry.title} translation.** Research focus: ${entry.focus} Review/documentation format: ${entry.format} Suggested user feedback: ${entry.feedback} ${outputGateDedup}`;
}

function frameworkSubskillTranslation(skillName, parent, outputGateDedup) {
  const specific = FRAMEWORK_SUBSKILL_TRANSLATIONS[skillName];
  if (specific) return frameworkGuidance(specific, outputGateDedup);
  if (parent === "customer-discovery") {
    return `**Customer-discovery framework fallback translation.** Research focus: render inherited ICP candidates and parent scope, framework dimensions, scores or verdicts, evidence for and against each candidate, confidence, assumptions, and decision impact for parent \`customer-discovery\` synthesis. Review/documentation format: use per-candidate matrices, scorecards, tables, or diagrams appropriate to \`${skillName}\`, with source gaps and lower-confidence findings visible. Suggested user feedback: ask reviewers to confirm candidate definitions, scoring, confidence ratings, missing evidence, assumptions, and parent-synthesis implications. ${outputGateDedup}`;
  }
  if (parent === "competitive-analysis") {
    return `**Competitive-analysis framework fallback translation.** Research focus: render inherited competitive scope, competitors or categories covered, tested dimensions, source evidence, inference, assumptions, confidence, and decision impact for parent \`competitive-analysis\` synthesis. Review/documentation format: use comparison tables, matrices, maps, force diagrams, or visual layouts appropriate to \`${skillName}\`, with lower-confidence comparisons and source gaps visible. Suggested user feedback: ask reviewers to confirm the competitor set, category boundaries, scores or verdicts, confidence ratings, missing sources, and synthesis implications. ${outputGateDedup}`;
  }
  if (parent === "positioning") {
    return `**Positioning framework fallback translation.** Research focus: render inherited positioning context, the framework method, positioning claims, evidence, inference, assumptions, confidence, alternatives, and decision impact for parent \`positioning\` synthesis. Review/documentation format: use templates, canvases, value curves, maps, scorecards, or comparison tables appropriate to \`${skillName}\`, with rejected alternatives and source gaps visible. Suggested user feedback: ask reviewers to confirm the target segment, category/market frame, value claim, alternatives, confidence ratings, missing proof, and synthesis implications. ${outputGateDedup}`;
  }
  if (parent === "journey-map") {
    return `**Journey-map framework fallback translation.** Research focus: render inherited ICP and journey scope, framework stages or lanes, observed evidence, inference, assumptions, confidence, source gaps, and decision impact for parent \`journey-map\` synthesis. Review/documentation format: use journey canvases, timelines, swimlanes, story maps, or experience maps appropriate to \`${skillName}\`, with stage confidence and evidence gaps visible. Suggested user feedback: ask reviewers to confirm stages, touchpoints, actions, emotions, dependencies, scoring or priority, missing evidence, and parent journey implications. ${outputGateDedup}`;
  }
  return `**Framework subskill fallback translation.** Research focus: render inherited parent context, framework method, intermediate outputs, claims, evidence, inference, assumptions, confidence, and decision impact for the parent skill. Review/documentation format: use structured tables, matrices, scorecards, canvases, maps, or diagrams appropriate to \`${skillName}\`, with source gaps and handoff implications visible. Suggested user feedback: ask reviewers to confirm the framework definitions, scoring or verdicts, assumptions, confidence ratings, missing evidence, and exact parent synthesis questions this subskill should answer. ${outputGateDedup}`;
}

function skillSpecificGates(skillName, skillPath) {
  const outputGateDedup =
    "Apply the shared artifact-destination/proposed-file-changes de-duplication rule: combine them into one visual gate when they ask only the same path-destination question, and render separate gates when destination approval differs from downstream mutation scope, timing, or allowed files.";
  const rules = {
    "idea-scope-brief": `**Idea-specific gates.** Render the Idea Assumptions Manifest as a first-class assumptions/confidence gate inside the alignment page before proposed deliverables. The idea identity, slug, scope/non-goals, ICP readiness, and output-location/change-scope decisions must each be reviewable gates. ${outputGateDedup}`,
    "feature-interview": `**Feature-specific gates.** Render the evidence brief, claim verdicts, assumptions, planning destination, prototype-first decision, priority hypothesis, and output-location/change-scope decisions as gates before writing or updating durable planning artifacts. ${outputGateDedup}`,
    "user-flow-map": `**User-flow-map gates.** Render surfaced flow assumptions, the proposed flow map, branch and decision coverage, state coverage, failure/recovery and handoff coverage, low-fidelity wireframe notes, output-location/change-scope decisions, and the downstream handoff choices to UI requirements as gates before writing final flow deliverables. The handoff gate must offer stop/clear-context and continue-now options, and must state that continuing immediately still requires the next skill's own interaction gates. ${outputGateDedup}`,
    "ui-interview": `**UI-specific gates.** Render surfaced assumptions, the UI or content requirements manifest, scope boundaries, output-location/change-scope decisions, and the coverage checkpoint as gates. In requirements-only mode, the content requirements manifest is the candidate/verdict gate and layout decisions must remain non-goals. Every \`ui-interview\` review page must include a plain-language Interview Stage section that names the invocation, distinguishes requirements-only review from a live page-by-page interview, states what user/agent interview work has already happened or was inferred from approved upstream evidence, and tells the reviewer whether the next action is section feedback, compiled approval YAML, or resuming the interview. Every page must include Interview provenance with exactly one of \`live-ui-interview\`, \`evidence-synthesis-with-explicit-skip\`, or \`invalid-missing-ui-interview\`; upstream approval alone is not interview completion. Evidence-only pages must be labeled \`evidence-synthesis review\` and route unresolved decisions to a resumed \`ui-interview\`. Render the working packet as structured HTML sections, lists, and real HTML tables; do not use a single raw Markdown \`<pre><code>\` block as the primary review surface. Raw Markdown may appear only as a supplemental source view after the rendered packet. ${outputGateDedup}`,
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
  const invocation = skillPath ? readSkillFrontmatterField(skillPath, "invocation") : null;
  if (invocation === "sub-skill") {
    return frameworkSubskillTranslation(skillName, readSkillFrontmatterField(skillPath, "parent"), outputGateDedup);
  }
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

function replaceOrInsert(content, skillName, { replaceSection = false } = {}) {
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

    if (replaceSection) {
      const head = `${content.slice(0, afterHeading)}\n\n${stub}`;
      const tail = content.slice(end).replace(/^\n+/, "");
      return tail ? `${head}\n\n${tail}` : `${head}\n`;
    }

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

const files = [...walk(`${repoRoot}/base`), ...walk(`${repoRoot}/packs`)]
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
    if (!isOptionalAlignmentSkill(skillName)) {
      outOfScope += 1;
      continue;
    }
    recordClassification(skillName, file, "ownableFiles");
  } else if (!isOwnable(body)) {
    // Preserve hand-authored / hybrid alignment sections verbatim unless the
    // skill is in the optional batch. Optional skills must not retain older
    // automatic page blockers such as "build before writing tasks/roadmap.md".
    if (!isOptionalAlignmentSkill(skillName)) {
      bespoke += 1;
      recordClassification(skillName, file, "bespokeFiles");
      continue;
    }
    recordClassification(skillName, file, "ownableFiles");
  } else {
    recordClassification(skillName, file, "ownableFiles");
  }

  // 1. Bundled, load-on-demand convention file beside the skill.
  const bundlePath = join(dirname(abs), "ALIGNMENT-PAGE.md");
  const bundleContent = bundledContentFor(skillName, file);
  const bundleBefore = existsSync(bundlePath) ? readFileSync(bundlePath, "utf8") : "";
  const bundleChanged = bundleBefore !== bundleContent;

  // 2. Short stub inside SKILL.md pointing at the bundled file.
  const after = replaceOrInsert(before, skillName, { replaceSection: body !== null && !isOwnable(body) && isOptionalAlignmentSkill(skillName) });
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
