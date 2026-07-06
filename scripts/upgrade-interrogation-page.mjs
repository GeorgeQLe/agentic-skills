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
// --legacy-bundles retains the old transition behavior and writes full sibling
// INTERROGATION-PAGE.md files. Default mode validates shared resolver stubs and
// accepts existing sibling bundles only as legacy fallback artifacts.
const legacyBundles = flags.has("--legacy-bundles");

// --- Participating-skill registry. Rollout is additive: add a name here. ---
const INTERROGATION_SKILLS = new Set([
  "customer-discovery",
  "competitive-analysis",
  "porter-five-forces",
  "swot",
  "strategic-group-map",
  "feature-pricing-matrix",
  "positioning",
  "brainstorm",
  "idea-scope-brief",
  "user-flow-map",
  "state-model",
  "ux-variations",
  "ui-interview",
  "consolidate-prototypes",
  "spec-interview",
  "devtool-workflow",
  "devtool-user-map",
  "devtool-integration-map",
  "devtool-dx-journey",
  "devtool-adoption",
  "devtool-positioning",
  "devtool-monetization",
  "devtool-docs-audit",
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
  "competitive-analysis": `**Interview areas the confidence gate covers.** Before advancing to framework selection, cover: the competitor set and whether direct, indirect, incumbent, emerging, DIY, or "do nothing" alternatives are in scope; the market/category boundary and excluded adjacent categories; source coverage across pricing pages, docs, review sites, customer language, analyst/news evidence, and repository/product evidence; visible pricing and feature evidence availability; strategic-group axes that may matter; force assumptions for rivalry, entrants, substitutes, buyer power, and supplier/platform power; SWOT evidence expectations; and the unknowns that could change framework selection or source plans. Open inputs must let the user add/remove competitors, correct boundaries, flag source constraints, name must-cover pricing or feature evidence, and waive or prioritize framework lenses.`,
  "porter-five-forces": `**Interview areas the confidence gate covers.** Before advancing to research, cover: the market boundary and buyer frame; included direct, indirect, substitute, incumbent, emerging, DIY, and "do nothing" alternatives; initial assumptions for rivalry, new entrants, substitutes, buyer power, and supplier/platform/channel power; source coverage needed for each force; recent evidence requirements; and unknowns that could change pressure scoring. Open inputs must let the user correct the boundary, add competitors or substitutes, identify platform dependencies, and flag force assumptions the agent cannot infer.`,
  swot: `**Interview areas the confidence gate covers.** Before advancing to research, cover: the product or concept being assessed; the competitor set and market boundary; evidence available for internal-ish strengths and weaknesses versus external opportunities and threats; customer, repository, product, pricing, review, and market sources in or out of scope; weighting of strategic relevance versus evidence confidence; and unknowns that could change SWOT classification. Open inputs must let the user add evidence, correct product capability claims, reclassify assumptions, and name threats or opportunities the agent cannot infer.`,
  "strategic-group-map": `**Interview areas the confidence gate covers.** Before advancing to research, cover: the competitor universe large enough for grouping; candidate strategic axes such as segment, service level, platform breadth, price, incumbent-suite versus specialist, and workflow depth; source evidence available for each axis; competitors with uncertain placement; alternate maps that may be needed; and unknowns that could make a 2x2 misleading. Open inputs must let the user add/remove competitors, choose or reject axes, supply evidence for placement, and flag markets that need multiple maps or tables.`,
  "feature-pricing-matrix": `**Interview areas the confidence gate covers.** Before advancing to research, cover: which competitors and packages to compare; feature, integration, platform, proof-point, target-segment, pricing-model, and public-price evidence requirements; source coverage across pricing pages, docs, app stores, review sites, and sales-gated pages; how to label missing or stale pricing; feature categories that matter most; and unknowns that could change the matrix. Open inputs must let the user add competitors, prioritize features, name pricing constraints, and identify evidence sources or gaps the agent cannot infer.`,
  brainstorm: `**Interview areas the confidence gate covers.** Before generating the idea set, cover: the project identity and current state as the agent understands it; the ideation focus and which dimensions are in or out of scope (strategic/product, improvement, hygiene, market-fit); the effort and risk appetite (quick wins vs. larger bets) and any horizon constraints; areas explicitly off-limits and hard non-goals; what counts as a high-value idea for this project (the user's success criteria for the brainstorm); the target audience or product-path scope the ideas should serve; and the riskiest assumptions about where the real opportunity lies. Open inputs must let the user reframe the focus, add or remove ideation dimensions, set the effort/risk appetite, and supply constraints and non-goals the agent cannot infer from the repository.`,
  positioning: `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the target segment positioning will speak to; the competitive alternatives the customer actually weighs (including "do nothing"); the value wedge and differentiator; the market-vs-product mode and the evidence behind it; the category frame; and the customer language that should anchor the positioning. Open inputs must let the user correct the alternative set, supply real customer phrasing, and override the detected mode.`,
  "idea-scope-brief": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the concept identity and normalized slug; the problem hypothesis; the beneficiary/user hypothesis; the product-category guess; the value wedge; real constraints; explicit non-goals; the riskiest unknowns; and, when the concept looks multi-sided, the market-structure sides and value exchange (as hypotheses, not validated segments). Open inputs must let the user restate the concept in their own words, correct the slug, and name constraints and non-goals the agent cannot infer.`,
  "user-flow-map": `**Interview areas the confidence gate covers.** Before advancing to stage one (research/context resolution), cover: the persona, role, and goal of the flow under map; the entry points and triggering context; the first success or completion condition; the happy path and the alternate/branch/failure paths in play; the user, system, permission, and external decisions; the screens/routes likely required and the states each must represent; cross-role, cross-device, and manual handoffs; and the flow boundaries and explicit non-goals. Open inputs must let the user correct the persona/goal, add or remove branches and states, and name handoffs and non-goals the agent cannot infer.`,
  "state-model": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the flow nodes being modeled and the topic; the candidate domain-modeling framework set and run order and why each is in or out; the domain boundaries and the strict logical-only boundary (no storage/endpoints/auth/migrations); the ubiquitous-language seeds the flow already implies; the stateful subjects and their lifecycles; and the riskiest modeling assumptions. Open inputs must let the user adjust the framework set/order, correct domain vocabulary, and flag physical concerns to defer to spec.`,
  "ux-variations": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the surface, page, or flow under variation and its fixed flow/content contract; which dimensions are allowed to vary versus held constant; the candidate variation concepts and how they materially differ; the evaluation method the user will use to compare them; whether layout-mode (concrete component/spatial variation) or progression-path UX variation applies; and the variation count and scope boundaries. Open inputs must let the user add/reweight concepts, fix the variable-versus-fixed split, and name constraints the agent cannot infer.`,
  "ui-interview": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the product and user context; the parent user flow and selected UX variation branch and sibling branches it must coordinate with; the pages, routes, and primary tasks per page; navigation model, information hierarchy, layout grid, and density; component inventory, control/link semantics, and form/validation behavior; empty/loading/error/success and other visual states; responsive and accessibility requirements; visual language and stack/design-system constraints; and the prototype-first boundary (what to click through first, what data can be faked, what infrastructure is represented but not built). Open inputs must let the user correct scope, supply real interface decisions, and name constraints the agent cannot infer.`,
  "consolidate-prototypes": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: which built prototype branches the user has reviewed and wants to consolidate and which to skip; the UAT/evidence coverage backing each source prototype verdict; what works and what does not in each prototype; the specific components, regions, or interactions to keep with their source prototype; the elements to explicitly reject; conflicts where preferred choices are incompatible; and the AFPS graduation handoff assumptions. Open inputs must let the user add keep/reject decisions, supply evaluation evidence, resolve conflicts, and flag graduation risks the agent cannot infer.`,
  "spec-interview": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the consolidated prototype and research frame in scope; whether unchecked post-prototype items remain that must complete first; the concept constraints, ICP, and journey evidence the spec must fit; the screens/pages to walk through and their production behaviors; the riskiest solution-design decisions and their acceptance criteria; and explicit non-goals and deferred work. Open inputs must let the user supply proprietary technical constraints, correct solution decisions, and name acceptance criteria the agent cannot infer.`,
  "devtool-workflow": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: whether the product is developer-facing and which developer-tool category it belongs to; the product identity, repository evidence, and current maturity; the target developer audience, buyer, champion, operator, maintainer, and contributor distinctions; the desired AFPS route and any already-complete devtool artifacts; scope boundaries, constraints, non-goals, and decision owners; and the riskiest assumption that would change the first routed skill. Open inputs must let the user correct the devtool classification, choose or override the route, name missing evidence, and supply constraints the agent cannot infer.`,
  "devtool-user-map": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the developer-facing product and use context; candidate developer users, economic buyers, champions, maintainers, operators, and contributors; the jobs, adoption blockers, and workflow triggers each stakeholder experiences; source evidence available for each role; audience boundaries and non-goals; and the riskiest user/buyer assumption. Open inputs must let the user add or remove stakeholder classes, correct buyer-vs-user distinctions, and supply real developer or buyer language the agent cannot infer.`,
  "devtool-integration-map": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the developer stack surfaces the tool must fit into; required integrations, APIs, CLIs, SDKs, data formats, auth models, deployment targets, and ecosystem partners; setup and migration constraints; compatibility or version assumptions; source evidence for existing integration claims; and the riskiest integration dependency. Open inputs must let the user add or remove ecosystem targets, correct compatibility assumptions, and name integration constraints the agent cannot infer.`,
  "devtool-dx-journey": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: discovery, install, quickstart, first success, debugging, production adoption, team rollout, and retention journeys; the primary developer persona and environment; success moments and failure/recovery points; evidence from docs, examples, telemetry, support, or user feedback; journey boundaries and non-goals; and the riskiest DX assumption. Open inputs must let the user correct the journey shape, add missing failure states, and supply environment or workflow constraints the agent cannot infer.`,
  "devtool-adoption": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: adoption loops, activation paths, examples/templates, proof artifacts, community or distribution channels, team conversion triggers, and retention signals; the developer audience and buying context; available evidence for adoption claims; constraints and non-goals; and the riskiest growth or activation assumption. Open inputs must let the user adjust channels, add proof requirements, and supply adoption evidence the agent cannot infer.`,
  "devtool-positioning": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the target developer segment; alternatives developers actually compare against, including doing nothing or building in-house; workflow wedge, ecosystem fit, trust claims, switching cost, and category frame; source evidence and developer language for each claim; constraints and non-goals; and the riskiest positioning assumption. Open inputs must let the user correct alternatives, supply real customer/developer phrasing, and override the category or wedge.`,
  "devtool-monetization": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: free, open-source, usage-based, seat, team, enterprise, or support-led packaging hypotheses; limits and value meters; buyer authority and procurement triggers; team conversion and expansion signals; unit-economics or cost constraints; source evidence and unknowns; and the riskiest pricing or packaging assumption. Open inputs must let the user correct willingness-to-pay assumptions, add cost constraints, and supply commercial evidence the agent cannot infer.`,
  "devtool-docs-audit": `**Interview areas the confidence gate covers.** Before advancing to stage one, cover: docs surfaces in scope, quickstart clarity, examples, API reference, troubleshooting, migration paths, proof artifacts, docs ownership, target developer environment, known support issues, source evidence, constraints, and non-goals; and the riskiest docs-adoption assumption. Open inputs must let the user add or exclude docs surfaces, name known blockers, and supply support or customer language the agent cannot infer.`,
};

function interrogationAreas(skillName) {
  return (
    INTERROGATION_AREAS[skillName] ??
    `**Interview areas the confidence gate covers.** Before advancing to stage one, cover every context area this skill needs to produce useful output: the core hypotheses, the constraints and non-goals, the riskiest unknowns, and any domain-specific decisions the agent cannot infer from the repository. Open inputs must let the user correct the agent's assumptions and supply context that is not derivable from artifacts.`
  );
}

// Full convention text that older installed skills may carry in a sibling
// INTERROGATION-PAGE.md. Default generator mode no longer writes this; it is
// kept for legacy fallback validation and explicit --legacy-bundles mode.
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
const SHARED_RESOLVER_STUB_PREFIX = "Follow the shared interrogation-page convention via the packaged convention resolver";

function stubParagraph(skillName) {
  return `Follow the shared interrogation-page convention via the packaged convention resolver; output path is \`interrogation/${skillName}-r{N}-{branch}.html\`. Before producing research, run the stage-zero interrogation loop, starting with the assumptions manifest as round 1, and loop until the confidence gate passes. This skill **cannot advance to stage one until** the confidence gate passes with at least one completed interrogation round and every interview area covered or waived. Each round page must contain at least one genuinely open input (\`data-open-input\`).`;
}

function isPointerOrStub(paragraph) {
  return paragraph.startsWith(POINTER_PREFIX) || paragraph.startsWith(STUB_PREFIX) || paragraph.startsWith(SHARED_RESOLVER_STUB_PREFIX);
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

const files = [...walk(`${repoRoot}/packs`)]
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

  // 1. Legacy bundled convention file beside the skill. Default mode no longer
  // writes this file; --legacy-bundles keeps the previous behavior available
  // for installed skills that still need a sibling fallback regenerated.
  const bundlePath = join(dirname(abs), "INTERROGATION-PAGE.md");
  const bundleContent = bundledContentFor(skillName, file);
  const bundleBefore = existsSync(bundlePath) ? readFileSync(bundlePath, "utf8") : "";
  const bundleChanged = legacyBundles && bundleBefore !== bundleContent;

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

// Shared-resolver validation (escalates to a failing exit in --check).
// Existing sibling INTERROGATION-PAGE.md files are accepted as legacy fallback
// artifacts and path-checked below, but are no longer required or byte-equal
// checked by default. The old byte-equal check is available with
// --legacy-bundles.
const bundleDiagnostics = [];
let ownableChecked = 0;
for (const [name, { ownableFiles, bespokeFiles }] of classification) {
  if (bespokeFiles.length) continue;
  for (const file of ownableFiles) {
    ownableChecked += 1;
    const abs = `${repoRoot}/${file}`;
    const bundlePath = join(dirname(abs), "INTERROGATION-PAGE.md");
    const relBundle = relative(repoRoot, bundlePath);
    if (legacyBundles) {
      const expected = bundledContentFor(name, file);
      if (!existsSync(bundlePath)) {
        bundleDiagnostics.push(
          `Missing legacy generated bundle ${relBundle} for "${name}". Run node scripts/upgrade-interrogation-page.mjs --legacy-bundles to generate it.`,
        );
      } else if (readFileSync(bundlePath, "utf8") !== expected) {
        bundleDiagnostics.push(
          `Stale legacy generated bundle ${relBundle} for "${name}" — differs from expected renderer output. Re-run node scripts/upgrade-interrogation-page.mjs --legacy-bundles to regenerate it.`,
        );
      }
    }
    const content = readFileSync(abs, "utf8");
    if (replaceOrInsert(content, name) !== content) {
      bundleDiagnostics.push(
        `Stale SKILL.md resolver stub in ${file} for "${name}" — the interrogation section's stub paragraph needs replacing. Run node scripts/upgrade-interrogation-page.mjs to update it.`,
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
console.log(`Legacy bundled files written: ${bundlesWritten}`);
console.log(`Skipped by ${relative(repoRoot, skipPath)}: ${skipList}`);
console.log(`Preserved bespoke sections: ${bespoke}`);
console.log(`Participating skills: ${INTERROGATION_SKILLS.size}`);
console.log(`Bespoke allowlist: ${bespokeAllowlist.size} skills, ${diagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Output paths: ${bundlesChecked} bundles, ${pathDiagnostics.length ? "DRIFT" : "exact"}`);
console.log(`Shared resolver stubs: ${ownableChecked} ownable, ${bundleDiagnostics.length ? "DRIFT" : "exact"}`);

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
  console.error(legacyBundles ? "Legacy generated bundle drift:" : "Shared resolver stub drift:");
  for (const diagnostic of bundleDiagnostics) console.error(`  - ${diagnostic}`);
}
if (diagnostics.length || pathDiagnostics.length || (checkMode && bundleDiagnostics.length)) process.exit(1);
