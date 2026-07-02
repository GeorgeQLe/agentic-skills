import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const fileCache = new Map<string, string>();

const coreSkills = [
  "packs/product-design/claude/ui-interview/SKILL.md",
  "packs/product-design/codex/ui-interview/SKILL.md",
  "packs/product-design/claude/ux-variations/SKILL.md",
  "packs/product-design/codex/ux-variations/SKILL.md",
  "packs/product-design/claude/spec-interview/SKILL.md",
  "packs/product-design/codex/spec-interview/SKILL.md",
  "packs/product-design/claude/consolidate-prototypes/SKILL.md",
  "packs/product-design/codex/consolidate-prototypes/SKILL.md",
  "packs/product-design/claude/logic-wiring/SKILL.md",
  "packs/product-design/codex/logic-wiring/SKILL.md",
  "packs/product-testing/claude/uat/SKILL.md",
  "packs/product-testing/codex/uat/SKILL.md",
];

const optionalAlignmentSkills = [
  "base/claude/afps-status/SKILL.md",
  "base/claude/provision-agentic-config/SKILL.md",
  "base/codex/afps-status/SKILL.md",
  "base/codex/provision-agentic-config/SKILL.md",
  "packs/agent-work-admin/claude/plan-phase/SKILL.md",
  "packs/agent-work-admin/claude/roadmap/SKILL.md",
  "packs/agent-work-admin/codex/plan-phase/SKILL.md",
  "packs/agent-work-admin/codex/roadmap/SKILL.md",
  "packs/agentic-skills-bench/claude/benchmark-agent-review/SKILL.md",
  "packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md",
  "packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md",
  "packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md",
  "packs/alignment-loop/claude/vertical-slice-splitter/SKILL.md",
  "packs/alignment-loop/codex/vertical-slice-splitter/SKILL.md",
  "packs/business-growth/claude/experiment/SKILL.md",
  "packs/business-growth/codex/experiment/SKILL.md",
  "packs/business-ops/claude/product-line/SKILL.md",
  "packs/business-ops/codex/product-line/SKILL.md",
  "packs/context-transfer/claude/handoff/SKILL.md",
  "packs/context-transfer/codex/handoff/SKILL.md",
  "packs/devtool/claude/devtool-workflow/SKILL.md",
  "packs/devtool/codex/devtool-workflow/SKILL.md",
  "packs/docs-health/claude/reconcile-dev-docs/SKILL.md",
  "packs/docs-health/codex/reconcile-dev-docs/SKILL.md",
  "packs/game/claude/game-roadmap/SKILL.md",
  "packs/game/claude/game-workflow/SKILL.md",
  "packs/game/codex/game-roadmap/SKILL.md",
  "packs/game/codex/game-workflow/SKILL.md",
  "packs/monorepo/claude/mono-plan/SKILL.md",
  "packs/monorepo/codex/mono-plan/SKILL.md",
  "packs/project-fleet/claude/skill-inventory/SKILL.md",
  "packs/project-fleet/codex/skill-inventory/SKILL.md",
  "packs/release-ops/claude/branch-lifecycle/SKILL.md",
  "packs/release-ops/claude/release/SKILL.md",
  "packs/release-ops/codex/branch-lifecycle/SKILL.md",
  "packs/release-ops/codex/release/SKILL.md",
  "packs/research-admin/claude/research-roadmap/SKILL.md",
  "packs/research-admin/codex/research-roadmap/SKILL.md",
  "packs/session-analytics/claude/analyze-sessions/SKILL.md",
  "packs/session-analytics/claude/prompt-history-backfill/SKILL.md",
  "packs/session-analytics/codex/analyze-sessions/SKILL.md",
  "packs/session-analytics/codex/prompt-history-backfill/SKILL.md",
];

const skippedSkills = [
  "packs/exec-loop/claude/exec/SKILL.md",
  "packs/exec-loop/codex/exec/SKILL.md",
  "packs/exec-loop/claude/ship/SKILL.md",
  "packs/exec-loop/codex/ship/SKILL.md",
  "packs/exec-loop/claude/ship-end/SKILL.md",
  "packs/exec-loop/codex/ship-end/SKILL.md",
  "packs/gitops/claude/sync/SKILL.md",
  "packs/gitops/codex/sync/SKILL.md",
];

const researchQualitySkills = [
  "packs/research-admin/claude/research-roadmap/SKILL.md",
  "packs/research-admin/codex/research-roadmap/SKILL.md",
];

const bipPostConfirmationSnippets = [
  "alignment.bip_platforms",
  "set-bip-platforms <platform...>",
  "Do not treat `alignment.bip_platforms` as a channel filter",
  "alignment/bip/{skill-name}.html",
  "data-bip-generation=\"post-confirmation\"",
  "data-bip-source-skill=\"{skill-name}\"",
  "every bundled channel convention",
  "bip_phase",
  "`research`, `prototyping`, or `implementation`",
  "popular social-media angle patterns",
  "long, exhaustive list of candidate posts, community submissions, or video outlines for every bundled channel",
  "Rank the top options clearly for each channel",
  "recommendation status (`recommended`, `not-now`, or `rejected`)",
  "recommendation notes, source basis, fresh-audience context, jargon expansion, public-facing significance, claim-safety notes, risk level, publish precheck, loaded convention path",
  "does not publish posts, write social-ledger records, alter canonical artifacts, or require another approval",
];

function read(path: string) {
  const abs = resolve(ROOT, path);
  const cached = fileCache.get(abs);
  if (cached !== undefined) return cached;
  const content = readFileSync(abs, "utf8");
  fileCache.set(abs, content);
  return content;
}

// Resolve the sibling ALIGNMENT-PAGE.md bundled next to a SKILL.md.
function bundledPath(skillMdPath: string) {
  return relative(ROOT, resolve(dirname(resolve(ROOT, skillMdPath)), "ALIGNMENT-PAGE.md"));
}

function bundled(skillMdPath: string) {
  return read(bundledPath(skillMdPath));
}

function hasBundle(skillMdPath: string) {
  return existsSync(resolve(ROOT, bundledPath(skillMdPath)));
}

// Where the convention text lives for a skill: the bundled file when the
// generator owns it, otherwise the inline SKILL.md section (bespoke sections
// keep their convention inline).
function conventionText(skillMdPath: string) {
  return hasBundle(skillMdPath) ? bundled(skillMdPath) : read(skillMdPath);
}

function activeSkillFiles(dir: string, out: string[] = []) {
  for (const entry of readdirSync(resolve(ROOT, dir))) {
    const abs = resolve(ROOT, dir, entry);
    const rel = relative(ROOT, abs);
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      if (entry === "archive" || entry === "node_modules" || entry === ".git") continue;
      activeSkillFiles(rel, out);
    } else if (stat.isFile() && entry === "SKILL.md") {
      out.push(rel);
    }
  }
  return out;
}

// Alignment skills now carry the convention in a sibling ALIGNMENT-PAGE.md;
// the SKILL.md only holds a short stub heading that points at it.
const activeAlignmentSkillFiles = [...activeSkillFiles("base"), ...activeSkillFiles("packs")]
  .filter((path) => {
    const content = read(path);
    if (!/^#{2,3} Alignment Page$/m.test(content)) return false;
    // Bundled skills carry the convention in ALIGNMENT-PAGE.md; bespoke
    // skip-listed skills keep the full contract inline.
    return hasBundle(path) || content.includes("**Gate YAML contract.**") || content.includes("**Response YAML contract.**");
  })
  .sort();

const generatedAlignmentSkillFiles = activeAlignmentSkillFiles.filter(hasBundle);
const lightweightResearchSkillFiles = generatedAlignmentSkillFiles.filter((path) =>
  read(path).includes("research_workflow: lightweight"),
);
const heavyGeneratedAlignmentSkillFiles = generatedAlignmentSkillFiles.filter(
  (path) => !lightweightResearchSkillFiles.includes(path),
);

describe("alignment page gate contract", () => {
  it("points core skills at the bundled convention instead of CLAUDE.md", () => {
    for (const path of coreSkills) {
      const content = read(path);
      expect(content, `${path} alignment heading`).toMatch(/^#{2,3} Alignment Page$/m);
      expect(content, `${path} no dangling CLAUDE.md pointer`).not.toContain(
        "Follow the shared Alignment Page convention in CLAUDE.md",
      );
      if (hasBundle(path)) {
        // Generator-owned skills point their stub at the bundled file.
        expect(content, `${path} references bundled file`).toContain("ALIGNMENT-PAGE.md");
      } else {
        // Bespoke sections keep the gates inline.
        expect(content, `${path} inline gates`).toContain("**Alignment gates.**");
      }
    }
  });

  it("makes operational alignment pages optional while preserving the page contract when created", () => {
    for (const path of optionalAlignmentSkills) {
      const content = read(path);
      expect(content, `${path} alignment heading`).toMatch(/^#{2,3} Alignment Page$/m);
      expect(hasBundle(path), `${path} has generated bundle`).toBe(true);
      expect(content, `${path} inline default`).toContain("By default, this skill reports results inline");
      expect(content, `${path} durable artifacts default`).toContain("writes only its normal durable artifacts");
      expect(content, `${path} no automatic page`).toContain("Do not build an alignment page automatically");
      expect(content, `${path} conditional request`).toContain("only when the user explicitly requests an alignment page");
      expect(content, `${path} conditional clarification`).toContain("concrete clarification/review need");
      expect(content, `${path} references bundle`).toContain("ALIGNMENT-PAGE.md");
      expect(content, `${path} no automatic durable-output stub`).not.toContain(
        "When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following",
      );

      const bundle = bundled(path);
      expect(bundle, `${path} optional intro`).toContain("Alignment pages are optional for this operational skill");
      expect(bundle, `${path} inline default bundle`).toContain("By default, report the outcome inline");
      expect(bundle, `${path} conditional bundle`).toContain("only when the user explicitly requests an alignment page");
      expect(bundle, `${path} review need bundle`).toContain("concrete clarification/review need");
      expect(bundle, `${path} keeps gate contract`).toContain("**Alignment gates.**");
      expect(bundle, `${path} keeps yaml contract`).toMatch(/\*\*(Gate|Response) YAML contract\.\*\*/);
      expect(bundle, `${path} no automatic intro`).not.toContain(
        "When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at",
      );
    }
  });

  it("does not leave roadmap with the old automatic pre-write alignment blocker", () => {
    for (const path of [
      "packs/agent-work-admin/claude/roadmap/SKILL.md",
      "packs/agent-work-admin/codex/roadmap/SKILL.md",
      "packs/agent-work-admin/claude/plan-phase/SKILL.md",
      "packs/agent-work-admin/codex/plan-phase/SKILL.md",
    ]) {
      const content = read(path);
      expect(content, `${path} no tasks/roadmap blocker`).not.toContain(
        "before writing or replacing `tasks/roadmap.md`",
      );
      expect(content, `${path} no automatic roadmap gate`).not.toContain(
        "Build and attempt to open `alignment/roadmap-{topic}.html`",
      );
    }
  });

  it("requires gate-based HTML review pages for core planning and research skills", () => {
    for (const path of coreSkills) {
      const content = conventionText(path);
      expect(content, `${path} gates`).toContain("**Alignment gates.**");
      expect(content, `${path} required gate types`).toContain("evidence coverage, assumptions/confidence, scope/non-goals");
      expect(content, `${path} required questions`).toContain("**Required inline questions.**");
      expect(content, `${path} yaml contract`).toMatch(/\*\*(Gate|Response) YAML contract\.\*\*/);
      expect(content, `${path} yaml fields`).toContain("`section`, `gate_type`, `status`");
      expect(content, `${path} in-page assumptions`).toContain("assumptions/confidence");
      expect(content, `${path} proposed file changes`).toContain("proposed file changes");
      expect(content, `${path} pre-approval stop`).toContain("the next action is review of the HTML alignment page");
    }
  });

  it("defines artifact destination and proposed file changes as separate output gate concepts", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} output gate section`).toContain("**Output gate semantics and de-duplication.**");
      expect(content, `${path} artifact destination semantics`).toContain(
        "The `artifact destination` gate approves the durable or review artifact location",
      );
      expect(content, `${path} proposed file changes semantics`).toContain(
        "The `proposed file changes` gate approves downstream mutation scope, timing, and the allowed file set",
      );
      expect(content, `${path} separate approval concepts`).toContain("Keep these as separate approval concepts");
    }
  });

  it("combines duplicate path-only output gates visually while separating distinct decisions", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} duplicate path-only gates combined`).toContain(
        "If both gate concepts ask only the same path-destination question, render one combined visual section such as `Artifact Destination & Proposed File Changes`",
      );
      expect(content, `${path} distinct decisions separated`).toContain(
        "If the decisions differ, render separate gates",
      );
    }
  });

  it("preserves output gate_type values in final YAML without duplicating combined sections", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} no visual-title duplication`).toContain(
        "Do not duplicate YAML entries solely because one visual section title names both concepts",
      );
      expect(content, `${path} separate yaml entries only for separate decisions`).toContain(
        "emit separate YAML items only when the page asked separate decisions",
      );
      expect(content, `${path} gate_type preserved`).toContain(
        "keep each item's `gate_type` equal to the decision it controls (`artifact destination` or `proposed file changes`)",
      );
      expect(content, `${path} output target yaml fields`).toContain(
        "optional `target_artifact` or `target_path` when the gate controls file output",
      );
    }
  });

  it("defines post-confirmation BIP output in the canonical convention", () => {
    const content = read("docs/alignment-page-convention.md");

    expect(content).toContain('data-alignment-page-kind="bip"');
    expect(content).toContain('data-bip-generation="post-confirmation"');
    expect(content).toContain('data-bip-source-skill="{skill-name}"');
    expect(content).toContain("do not create a pre-final Stage 2 BIP checkpoint");
    expect(content).toContain("Only after that confirmation sequence succeeds");
    expect(content).toContain("write the read-only post-confirmation BIP page");
    expect(content).toContain("BIP handling");
    for (const snippet of bipPostConfirmationSnippets) {
      expect(content).toContain(snippet);
    }
    expect(content).not.toContain('data-bip-gates="alignment/{skill-name}-{topic}.html"');
    expect(content).not.toContain('data-bip-status="linked"');
    expect(content).not.toContain("bip_approval_status: ready-for-agent-review");
    expect(content).not.toContain("bip_channel_selection_status: ready-for-agent-review");
  });

  it("propagates post-confirmation BIP output to generated bundles", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      const skillName = dirname(path).split("/").pop();
      expect(content, `${path} BIP page kind`).toContain('data-alignment-page-kind="bip"');
      expect(content, `${path} BIP generation`).toContain('data-bip-generation="post-confirmation"');
      expect(content, `${path} BIP source skill`).toContain(`data-bip-source-skill="${skillName}"`);
      expect(content, `${path} BIP page path`).toContain(`alignment/bip/${skillName}.html`);
      expect(content, `${path} BIP no pre-final checkpoint`).toContain("do not create a pre-final Stage 2 BIP checkpoint");
      expect(content, `${path} BIP post-confirmation sequence`).toContain("Only after that confirmation sequence succeeds");
      for (const snippet of bipPostConfirmationSnippets) {
        const expected = snippet.replaceAll("{skill-name}", skillName ?? "");
        expect(content, `${path} BIP post-confirmation: ${expected}`).toContain(expected);
      }
      expect(content, `${path} no old gated page`).not.toContain(`data-bip-gates="alignment/${skillName}-{topic}.html"`);
      expect(content, `${path} no linked checkpoint`).not.toContain('data-bip-status="linked"');
      expect(content, `${path} no approved BIP YAML`).not.toContain("bip_approval_status: ready-for-agent-review");
      expect(content, `${path} no old channel-selection YAML`).not.toContain("bip_channel_selection_status: ready-for-agent-review");
    }
  });

  it("defines review, confirmed, and amended lifecycle states in generated alignment-page conventions", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} lifecycle section`).toContain("**Alignment lifecycle.**");
      expect(content, `${path} review state`).toContain("`review` is the draft/pre-approval page");
      expect(content, `${path} confirmed state`).toContain("`confirmed` is the post-approval page");
      expect(content, `${path} amended state`).toContain("`amended` is a future revision of a confirmed page");
      expect(content, `${path} finished current amendable`).toContain(
        "finished and current for the completed alignment cycle, but it remains amendable",
      );
    }
  });

  it("requires research alignment pages to register with the central alignment index", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} central index section`).toContain("**Central alignment index.**");
      expect(content, `${path} index path`).toContain("Look for `alignment/index.html` at the repository root");
      expect(content, `${path} create missing index`).toContain("If the index does not exist, create it");
      expect(content, `${path} links active pages`).toContain(
        "links to every active `alignment/*.html` page except itself",
      );
      expect(content, `${path} include new page`).toContain("includes the newly written page");
      expect(content, `${path} update existing`).toContain("If the index exists, update it instead of blindly appending");
      expect(content, `${path} dedupe entries`).toContain("remove duplicate entries for the same page path");
      expect(content, `${path} category/product-line sort`).toContain(
        "Group index entries by category first, then by product/product path within each category",
      );
      expect(content, `${path} progress manifest`).toContain("`product_paths[]`");
      expect(content, `${path} flat organization`).toContain(
        "In flat repositories, group by category, then preserve the existing index organization",
      );
    }
  });

  it("scopes approval gates, required questions, and final answer compilation to review pages", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} review gates`).toContain("In `review` pages, treat gates");
      expect(content, `${path} review-only finalization blocker`).toContain(
        "A gate blocks finalization only while the page is in `review`",
      );
      expect(content, `${path} confirmed read-only decisions`).toContain(
        "In `confirmed` pages, preserve the gate decisions as read-only approval records",
      );
      expect(content, `${path} review questions`).toContain(
        "In `review` pages, each gate must contain at least one required inline question",
      );
      expect(content, `${path} confirmed no required inputs`).toContain(
        "Confirmed pages must not keep these as required input controls",
      );
      expect(content, `${path} review compile controls`).toContain(
        'In `review` pages, at the bottom of the page, include an ordinary in-flow compile section with a single "Compile Responses" button',
      );
      expect(content, `${path} review pre-approval stop`).toContain(
        "While an alignment page is in `review`, the next action is review of the HTML alignment page",
      );
    }
  });

  it("hands off review pages through review/compile/paste YAML in the producing skill context", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} pre-approval handoff`).toContain("**Pre-approval stop.**");
      expect(content, `${path} review page handoff`).toContain(
        "ask the user to review the page, compile either local section-feedback YAML from the relevant section or bottom compiled response YAML",
      );
      expect(content, `${path} paste self-contained YAML`).toContain(
        "paste that YAML into a fresh or current agent session",
      );
      expect(content, `${path} yaml carries producing route`).toContain(
        "the YAML itself must begin with the invocation comment and include the top-level `command` field for the producing skill's continuation route/session",
      );
      expect(content, `${path} same producing skill`).toContain(
        "The continuation route is the same skill that produced the page",
      );
      expect(content, `${path} pattern a exception`).toContain(
        "for Pattern A pages that define `## Invoke With YAML`, use that parent-orchestrator route",
      );
      expect(content, `${path} feedback status revision`).toContain("`feedback_status: revision-request`");
      expect(content, `${path} partial response routing`).toContain("compiled response YAML is partial");
      expect(content, `${path} not-approved routing`).toContain("any YAML has `approval_status: not-approved`");
      expect(content, `${path} renewed review`).toContain(
        "ask again for review with the same review/compile/paste instruction",
      );
      expect(content, `${path} approval write blocker`).toContain(
        "approved artifacts have been written or updated",
      );
      expect(content, `${path} no duplicate clear`).toContain(
        "If the user already cleared context and pasted YAML into a fresh session, do not ask for another clear",
      );
    }
  });

  it("keeps self-routing YAML command metadata explicit without weakening approval boundaries", () => {
    const routing = read("docs/alignment-yaml-routing-contract.md");
    expect(routing).toContain("compiled YAML's invocation cue and top-level `command` field");
    expect(routing).toContain('command: "<command>"');
    expect(routing).toContain("machine-readable continuation metadata");
    expect(routing).toContain("not downstream routing");
    expect(routing).toContain("root `command` and `agent_routing.command` must match exactly");
    expect(routing).toContain("must name the parent orchestrator, never a child framework path command");

    const loop = read("docs/research-session-loop-convention.md");
    expect(loop).toContain("beginning with `# Invoke with: <parent-command>` followed by a top-level `command` field and an `agent_routing` mapping");
    expect(loop).toContain("# Invoke with: $competitive-analysis research/afps-tracker");
    expect(loop).toContain('command: "$competitive-analysis research/afps-tracker"');
    expect(loop).toContain("root `command` gives parsers the exact parent invocation");
    expect(loop).toContain("The parent orchestrator still owns interpretation");
  });

  it("requires confirmed pages to remove approval UI while preserving approval and evidence records", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} confirmed contract`).toContain("**Confirmed page contract.**");
      expect(content, `${path} confirmed status`).toContain("`alignment_status: confirmed`");
      expect(content, `${path} confirmation metadata`).toContain(
        "confirmation date, confirmed artifact paths, approval source summary",
      );
      expect(content, `${path} finished amendable language`).toContain("finished but amendable language");
      expect(content, `${path} remove gate ui`).toContain(
        'Remove required gate-question controls, section feedback input controls, local compile/copy controls, local read-only YAML outputs, the final "Compile Responses" button, response counters',
      );
      expect(content, `${path} no stale gate registry`).toContain("stale `requiredGateNames` or gate registry data");
      expect(content, `${path} read-only only`).toContain("Preserve decisions only as read-only approval records");
      expect(content, `${path} no compile feedback controls`).toContain("`Compile Feedback YAML` controls");
      expect(content, `${path} no retained controls`).toContain("retained controls remain");
      expect(content, `${path} preserve approval record`).toContain("Preserve the full research and approval record");
      expect(content, `${path} preserve evidence`).toContain(
        "answered decisions, user requests, evidence matrix, assumptions/confidence register, source gaps, proposed file changes",
      );
      expect(content, `${path} changed during confirmation`).toContain("what changed during confirmation");
      expect(content, `${path} research caveats`).toContain("Keep research caveats visible");
      expect(content, `${path} not immutable`).toContain(
        "`confirmed` means approved/current, not immutable or permanently true",
      );
    }
  });

  it("requires revised review pages to regenerate affected gates after feedback changes the premise", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} gate reactivity section`).toContain("**Gate reactivity after revisions.**");
      expect(content, `${path} revision triggers`).toContain(
        "feedback, partial compiled response YAML, `other` answers, `needs-clarification`, or approval-with-edits changes the artifact premise",
      );
      expect(content, `${path} regenerate gates`).toContain(
        "regenerate the affected gate set from the revised artifact",
      );
      expect(content, `${path} recompute blockers`).toContain(
        "Recompute gate questions, options, defaults, blocking state, `unanswered_required_questions`, and any `requiredGateNames` or gate registry",
      );
      expect(content, `${path} remove superseded gates`).toContain(
        "Remove or rewrite superseded gates",
      );
      expect(content, `${path} visible gate changes`).toContain(
        "Visibly mark changed gates in the revised review page",
      );
      expect(content, `${path} partial yaml reactivity`).toContain(
        "regenerate affected gates under the Gate reactivity after revisions rule",
      );
    }
  });

  it("handles final approval YAML by applying edits before confirmation or returning unresolved feedback to review", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} after approval section`).toContain("**After approval handling.**");
      expect(content, `${path} classify edits before confirmation`).toContain(
        "If it contains approvals plus user-requested edits, first classify the edit intent under the Feedback intake before mutation rule",
      );
      expect(content, `${path} confirmed amendments before confirmation`).toContain(
        "then update the page, research, and proposed canonical artifacts to satisfy confirmed amendments",
      );
      expect(content, `${path} confirm after writing`).toContain(
        "then write or update the approved canonical artifacts and confirm the page",
      );
      expect(content, `${path} unresolved feedback returns to review`).toContain(
        "If it contains `needs-clarification`, unresolved `down` feedback, unresolved pushback, or any unresolved negative feedback",
      );
      expect(content, `${path} unresolved feedback uses intake rule`).toContain(
        "resolve that feedback under the Feedback intake before mutation rule and return the page to `review` instead of marking it `confirmed`",
      );
      expect(content, `${path} archive before replace`).toMatch(
        /Before replacing any existing alignment page, archive it to `docs\/history\/archive\/YYYY-MM-DD\/HHMMSS\/alignment\/[^`]+\.html`/,
      );
      expect(content, `${path} future amendments`).toContain(
        "Future amendments to confirmed pages follow the same archive-first rule",
      );
    }
  });

  it("requires feedback intent classification before mutating alignment artifacts", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} feedback intake section`).toContain("**Feedback intake before mutation.**");
      expect(content, `${path} intake classes`).toContain(
        "`answer-only` (the note is a question that can be answered without changing the page)",
      );
      expect(content, `${path} amend class`).toContain(
        "`amend-page` (the user explicitly asks for a page/artifact change or the correction is plainly factual)",
      );
      expect(content, `${path} investigate class`).toContain("`investigate-before-amend`");
      expect(content, `${path} pushback class`).toContain("`pushback-needed`");
      expect(content, `${path} ask user class`).toContain("`ask-user-before-amend`");
      expect(content, `${path} question-like feedback`).toContain(
        'If the note is a question, concern, premise challenge, "can we...", "would X not...", or ambiguous tradeoff',
      );
      expect(content, `${path} answer before mutation`).toContain(
        "answer the question, state the pushback, or ask the needed follow-up in the agent response before mutating the HTML page",
      );
      expect(content, `${path} factual direct edits`).toContain(
        "Edit the page directly only when the clarification is plainly factual",
      );
      expect(content, `${path} clarify semantics`).toContain(
        "`clarify-before-approval` means resolve the clarification before approval; it does not mean silently patch the HTML",
      );
      expect(content, `${path} unresolved blocks confirmation`).toContain(
        "Never mark the page `confirmed`, write approved canonical artifacts, or route downstream while unresolved clarification",
      );
    }
  });

  it("keeps report-only research gates explicit", () => {
    for (const path of researchQualitySkills) {
      const content = conventionText(path);
      expect(content, `${path} report-only gates`).toContain("**Report-only research gates.**");
      expect(content, `${path} evidence coverage`).toContain("evidence coverage");
      expect(content, `${path} recommended output path`).toContain("recommended output path");
      expect(content, `${path} approval gates`).toContain("approval gates");
    }
  });

  it("defines staged working-packet handling for report-first research", () => {
    expect(heavyGeneratedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of heavyGeneratedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} staged research section`).toContain("**Staged research workflow.**");
      expect(content, `${path} scope-first workflow`).toContain("scope-first three-stage approval workflow");
      expect(content, `${path} stage 1 minimal discovery`).toContain("Stage 1 is minimal scope discovery only");
      expect(content, `${path} review page before synthesis`).toContain(
        "Build the `review` alignment page before synthesized research",
      );
      expect(content, `${path} stage 1 previews stage 2`).toContain(
        "`Stage 2 Preview / Expected Review Format` section that shows the future Stage 2 review shape before research starts",
      );
      expect(content, `${path} scope yaml approval`).toContain(
        "Stop for final compiled response YAML approval of the research scope",
      );
      expect(content, `${path} no stage 1 synthesis`).toContain(
        "Do not synthesize findings, rank candidates, recommend a path, or create working packets",
      );
      expect(content, `${path} old stage 1 research wording removed`).not.toContain(
        "Stage 1 performs research and clarification",
      );
      expect(content, `${path} flat working packet`).toMatch(
        /`research\/_working\/preliminary-[^`]+-research\.md`/,
      );
      expect(content, `${path} product-path working packet`).toMatch(
        /`research\/\{slug\}\/_working\/preliminary-[^`]+-research\.md`/,
      );
      expect(content, `${path} stage 2 waits for scope approval`).toContain(
        "Stage 2 starts only after final compiled response YAML approves the research scope",
      );
      expect(content, `${path} stage 2 research`).toContain("Perform the synthesized research");
      expect(content, `${path} structured packet rendering`).toContain(
        "renders the complete working-packet substance as structured HTML review UI",
      );
      expect(content, `${path} no primary packet dump`).toContain(
        "Raw Markdown packet text may appear only as a supplemental source view after the rendered review UI",
      );
      expect(content, `${path} old packet wording removed`).not.toContain("renders the full preliminary packet");
      expect(content, `${path} feedback remains stage 2`).toContain(
        "Partial compiled responses revise the working packet and review page, then remain in Stage 2",
      );
      expect(content, `${path} final yaml gating`).toContain(
        "Stage 3 consumes final compiled response YAML for artifact approval only when it has `approval_status: ready-for-agent-review`",
      );
      expect(content, `${path} archive working packet`).toContain(
        "archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`",
      );
      expect(content, `${path} remove working packet`).toContain("remove the active working packet");
      expect(content, `${path} confirmed page`).toContain("convert the page to `confirmed`");
    }
  });

  it("defines the Stage 2 research review template and Stage 1 preview gate", () => {
    expect(heavyGeneratedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of heavyGeneratedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} stage 2 template section`).toContain("**Stage 2 review-page template.**");
      expect(content, `${path} stage 1 format preview`).toContain(
        "Stage 1 scope-review pages must include a `Stage 2 Preview / Expected Review Format` section",
      );
      expect(content, `${path} preview format knobs`).toContain(
        "preferred content formats, grouping, labels, visuals, and evidence density",
      );
      expect(content, `${path} approved scope status`).toContain("`Research Scope Approved` status block");
      expect(content, `${path} executive findings confidence`).toContain(
        "`Executive Findings` or a skill-specific top-findings section with confidence labels",
      );
      expect(content, `${path} evidence matrix shape`).toContain(
        "`Evidence Matrix` mapping claim, evidence/source/path, inference, confidence, assumptions, and decision impact",
      );
      expect(content, `${path} working packet review shape`).toContain(
        "`Working Packet Review` with the complete working-packet substance rendered as purpose-built HTML sections",
      );
      expect(content, `${path} alternatives section`).toContain(
        "`Alternatives / Rejected or Lower-Confidence Findings`",
      );
      expect(content, `${path} source gaps section`).toContain("`Source Coverage & Gaps`");
      expect(content, `${path} confidence register section`).toContain("`Assumptions / Confidence Register`");
      expect(content, `${path} canonical artifacts section`).toContain(
        "`Proposed Canonical Artifacts & File Changes`",
      );
      expect(content, `${path} format preferences gate`).toContain("required `User Format Preferences` gate");
      expect(content, `${path} final artifact gate`).toContain(
        "required `Final Artifact Approval` gate for Stage 3 readiness",
      );
      expect(content, `${path} raw markdown supplemental`).toContain(
        "Raw Markdown packet text, search logs, or source notes may appear only as supplemental source views",
      );
    }
  });

  it("supports lightweight research bundles without heavy working packets", () => {
    expect(lightweightResearchSkillFiles.sort()).toEqual([
      "packs/ord/claude/ord-align/SKILL.md",
      "packs/ord/codex/ord-align/SKILL.md",
    ]);

    for (const path of lightweightResearchSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} lightweight quality`).toContain("**Lightweight research quality contract.**");
      expect(content, `${path} lightweight gates`).toContain("**Lightweight research gates.**");
      expect(content, `${path} lightweight workflow`).toContain("**Lightweight research workflow.**");
      expect(content, `${path} lightweight stage 2`).toContain("**Lightweight Stage 2 review-page template.**");
      expect(content, `${path} no heavy staged workflow`).not.toContain("**Staged research workflow.**");
      expect(content, `${path} no working packet paths`).not.toContain("preliminary-ord-align-research.md");
      expect(content, `${path} no working packet archive`).not.toContain("<original-working-path>");
      expect(content, `${path} no heavy packet review`).not.toContain("`Working Packet Review`");
      expect(content, `${path} validation scope approval`).toContain(
        "Stop for final compiled response YAML approval of the lightweight research scope",
      );
      expect(content, `${path} stage 2 validation review`).toContain("`Validation Scope Approved` status block");
    }
  });

  it("requires research output pages to preserve evidence, uncertainty, and decision context", () => {
    for (const path of researchQualitySkills) {
      const content = conventionText(path);
      expect(content, `${path} research quality contract`).toContain("**Research quality contract.**");
      expect(content, `${path} scope approval before synthesis`).toContain(
        "do not synthesize research findings, recommendations, candidate rankings, or working packets until the user approves the research scope",
      );
      expect(content, `${path} minimal pre-approval discovery`).toContain(
        "Before scope approval, do only minimal discovery needed to propose the research scope",
      );
      expect(content, `${path} claim/evidence/inference split`).toContain("`claims` (what the report concludes), `evidence`");
      expect(content, `${path} no context loss`).toContain("**No context loss rule.**");
      expect(content, `${path} evidence matrix`).toContain("evidence matrix");
      expect(content, `${path} confidence register`).toContain("confidence/assumption register");
      expect(content, `${path} rejected findings`).toContain("rejected or lower-confidence findings");
      expect(content, `${path} source gaps`).toContain("source coverage gaps");
      expect(content, `${path} downstream implications`).toContain("downstream implications");
      expect(content, `${path} research completeness gate`).toContain("**Research completeness gate.**");
      expect(content, `${path} evidence sufficiency question`).toContain("whether the evidence is sufficient for the recommendation");
    }
  });

  it("requires source coverage categories for web research and file evidence for repo research", () => {
    for (const path of researchQualitySkills) {
      const content = conventionText(path);
      expect(content, `${path} source coverage expectations`).toContain("**Source coverage expectations.**");
      expect(content, `${path} web source categories`).toContain("competitors, pricing, user sentiment, positioning, integrations, and recent activity");
      expect(content, `${path} repo evidence`).toContain("file/path evidence");
      expect(content, `${path} fact inference distinction`).toContain("distinguish observed code facts from inferred product, workflow, or user conclusions");
    }
  });

  it("requires delegated framework subskills to render framework-specific alignment pages", () => {
    const agents = ["claude", "codex"] as const;
    const frameworkChecks = [
      {
        root: "packs/business-research",
        family: "competitive-analysis/frameworks",
        name: "feature-pricing-matrix",
        title: "Feature-pricing matrix",
        snippets: ["competitor-by-feature matrix", "tier equivalence"],
      },
      {
        root: "packs/business-research",
        family: "competitive-analysis/frameworks",
        name: "porter-five-forces",
        title: "Porter five forces",
        snippets: ["five-force pressure map", "market boundary"],
      },
      {
        root: "packs/business-research",
        family: "competitive-analysis/frameworks",
        name: "strategic-group-map",
        title: "Strategic group map",
        snippets: ["two-axis strategic map", "axis choices"],
      },
      {
        root: "packs/business-research",
        family: "competitive-analysis/frameworks",
        name: "swot",
        title: "SWOT",
        snippets: ["four SWOT quadrants", "quadrant placement"],
      },
      {
        root: "packs/business-research",
        family: "customer-discovery/frameworks",
        name: "five-rings",
        title: "Five Rings",
        snippets: ["ICP-candidate-by-ring matrix", "buying-committee sources"],
      },
      {
        root: "packs/business-research",
        family: "customer-discovery/frameworks",
        name: "four-forces",
        title: "Four Forces",
        snippets: ["force map per ICP candidate", "trigger event"],
      },
      {
        root: "packs/business-research",
        family: "customer-discovery/frameworks",
        name: "jtbd-needs",
        title: "JTBD needs",
        snippets: ["outcome scorecards", "underserved needs"],
      },
      {
        root: "packs/business-research",
        family: "customer-discovery/frameworks",
        name: "pmf-engine",
        title: "PMF Engine",
        snippets: ["PMF signal table", "HXC realism"],
      },
      {
        root: "packs/business-research",
        family: "customer-discovery/frameworks",
        name: "seven-dimensions",
        title: "Seven dimensions",
        snippets: ["seven-dimension candidate scorecard", "dimension scores"],
      },
      {
        root: "packs/business-research",
        family: "customer-discovery/frameworks",
        name: "w3-hypothesis",
        title: "W3 hypothesis",
        snippets: ["WHO/WHAT/WHY triptych", "parent `customer-discovery` synthesis"],
      },
      {
        root: "packs/business-research",
        family: "positioning/frameworks",
        name: "category-design",
        title: "Category design",
        snippets: ["category POV canvas", "category boundary"],
      },
      {
        root: "packs/business-research",
        family: "positioning/frameworks",
        name: "jtbd-positioning",
        title: "JTBD positioning",
        snippets: ["job story map", "job wording"],
      },
      {
        root: "packs/business-research",
        family: "positioning/frameworks",
        name: "moore-positioning",
        title: "Moore positioning",
        snippets: ["Geoffrey Moore positioning templates", "category label"],
      },
      {
        root: "packs/business-research",
        family: "positioning/frameworks",
        name: "obviously-awesome",
        title: "Obviously Awesome",
        snippets: ["Obviously Awesome component matrix", "category choice"],
      },
      {
        root: "packs/business-research",
        family: "positioning/frameworks",
        name: "strategic-canvas",
        title: "Strategic canvas",
        snippets: ["value curve or strategic canvas", "ERRC moves"],
      },
      {
        root: "packs/customer-lifecycle",
        family: "journey-map/frameworks",
        name: "customer-journey-canvas",
        title: "Customer journey canvas",
        snippets: ["stage-by-touchpoint canvas", "journey stages"],
      },
      {
        root: "packs/customer-lifecycle",
        family: "journey-map/frameworks",
        name: "experience-map",
        title: "Experience map",
        snippets: ["emotional arc", "channel transitions"],
      },
      {
        root: "packs/customer-lifecycle",
        family: "journey-map/frameworks",
        name: "jtbd-timeline",
        title: "JTBD timeline",
        snippets: ["switching timeline", "force strengths"],
      },
      {
        root: "packs/customer-lifecycle",
        family: "journey-map/frameworks",
        name: "service-blueprint",
        title: "Service blueprint",
        snippets: ["front-stage/backstage/support/evidence swimlanes", "backstage dependencies"],
      },
      {
        root: "packs/customer-lifecycle",
        family: "journey-map/frameworks",
        name: "user-story-map",
        title: "User story map",
        snippets: ["activity-task-story backbone", "walking skeleton"],
      },
    ];

    for (const check of frameworkChecks) {
      for (const agent of agents) {
        const path = `${check.root}/${agent}/${check.family}/${check.name}/SKILL.md`;
        const content = bundled(path);
        expect(content, `${path} specific translation`).toContain(`**${check.title} translation.**`);
        expect(content, `${path} research focus`).toContain("Research focus:");
        expect(content, `${path} review/documentation format`).toContain("Review/documentation format:");
        expect(content, `${path} suggested feedback`).toContain("Suggested user feedback:");
        for (const snippet of check.snippets) {
          expect(content, `${path} ${snippet}`).toContain(snippet);
        }
        expect(content, `${path} no generic fallback`).not.toContain("fallback translation");
        expect(content, `${path} visual tier`).toContain("**Visual tier rendering.**");
      }
    }
  });

  it("preserves skill-specific gate language", () => {
    const uiInterviewConvention = conventionText("packs/product-design/codex/ui-interview/SKILL.md");
    expect(uiInterviewConvention).toContain("Render surfaced assumptions, the UI or content requirements manifest");
    expect(uiInterviewConvention).toContain("plain-language Interview Stage section");
    expect(uiInterviewConvention).toContain("Interview provenance");
    expect(uiInterviewConvention).toContain("`live-ui-interview`");
    expect(uiInterviewConvention).toContain("`evidence-synthesis-with-explicit-skip`");
    expect(uiInterviewConvention).toContain("`invalid-missing-ui-interview`");
    expect(uiInterviewConvention).toContain("upstream approval alone is not interview completion");
    expect(uiInterviewConvention).toContain("`evidence-synthesis review`");
    expect(uiInterviewConvention).toContain("do not use a single raw Markdown `<pre><code>` block as the primary review surface");
    const userFlowConvention = conventionText("packs/product-design/codex/user-flow-map/SKILL.md");
    expect(userFlowConvention).toContain("downstream handoff choices to UI requirements");
    expect(userFlowConvention).toContain("stop/clear-context and continue-now options");
    expect(userFlowConvention).toContain("continuing immediately still requires the next skill's own interaction gates");
    expect(conventionText("packs/product-design/codex/ux-variations/SKILL.md")).toContain("Render surfaced assumptions, variation manifest, concept selection");
    expect(conventionText("packs/customer-lifecycle/codex/journey-map/SKILL.md")).toContain("**Journey research translation.**");
    expect(conventionText("packs/research-admin/codex/research-roadmap/SKILL.md")).toContain("**Research-roadmap translation.**");
    expect(conventionText("base/codex/idea-scope-brief/SKILL.md")).toContain(
      "Apply the shared artifact-destination/proposed-file-changes de-duplication rule",
    );
    expect(conventionText("packs/product-design/codex/feature-interview/SKILL.md")).toContain(
      "combine them into one visual gate when they ask only the same path-destination question",
    );
  });

  it("requires every active alignment page to copy compiled YAML ergonomically", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} automatic copy`).toContain("automatically attempt to copy the YAML to the clipboard");
      expect(content, `${path} copy button`).toContain('explicit "Copy YAML" button');
      expect(content, `${path} fallback`).toContain("fall back to selecting the textarea contents");
      expect(content, `${path} old click-to-copy-only contract`).not.toContain("Display the YAML in a read-only, click-to-copy textarea.");
    }
  });

  it("does not leave unresolved generator tokens in bundled alignment-page conventions", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} no unresolved skill-specific gate token`).not.toContain("{{SKILL_SPECIFIC_GATES}}");
      expect(content, `${path} no unresolved visual-tier token`).not.toContain("{{SKILL_VISUAL_TIER}}");
      expect(content, `${path} no unresolved glossary token`).not.toContain("{{SKILL_GLOSSARY_GATE}}");
    }
  });

  it("uses the shared cross-platform opener command for generated alignment pages", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} browser open section`).toContain("**Browser open.**");
      expect(content, `${path} portable opener command`).toContain(
        "npx skillpacks alignment pages open",
      );
      expect(content, `${path} source fallback command`).toContain("node scripts/open-html-page.mjs");
      expect(content, `${path} browser auto`).toContain("--browser auto");
      expect(content, `${path} WSL bridge`).toContain("file://wsl.localhost/${WSL_DISTRO_NAME:-Ubuntu}/<absolute-linux-path>");
      expect(content, `${path} PowerShell bridge`).toContain(
        "/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell.exe",
      );
      expect(content, `${path} xdg fallback order`).toContain(
        "Try `xdg-open <absolute-linux-path>` only after the packaged CLI, source-checkout helper, and WSL PowerShell bridge",
      );
      expect(content, `${path} statuses`).toContain(
        "`focused`, `opened`, `fallback-opened`, `blocked`, or `failed`",
      );
      expect(content, `${path} blocked path reporting`).toContain(
        "include the absolute path when the status is `blocked` or `failed`",
      );
      expect(content, `${path} blocked continuation`).toContain("Continue when opening is `blocked`");
      expect(content, `${path} old generic open instruction`).not.toContain(
        "Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked",
      );
    }
  });

  it("recommends the portable localhost alignment server for Brief Me caching", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} portable serve command`).toContain(
        "npx skillpacks alignment pages serve --port 8907",
      );
      expect(content, `${path} source server fallback`).toContain("node scripts/serve-alignment.mjs");
      expect(content, `${path} localhost alignment URL`).toContain(
        "http://localhost:8907/alignment/<page>.html",
      );
    }
  });

  it("allows partial compiled responses before final gate answers are complete", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} response contract`).toContain("**Response YAML contract.**");
      expect(content, `${path} compile responses`).toContain('single "Compile Responses" button');
      expect(content, `${path} early enable`).toContain(
        "Enable it as soon as at least one gate question has an answer or at least one section-feedback control is selected",
      );
      expect(content, `${path} partial responses before final answers`).toContain(
        "do not require every required gate question to be answered before compiling partial responses",
      );
      expect(content, `${path} response status`).toContain("`response_status` (`partial` or `complete`)");
      expect(content, `${path} continuation command field`).toContain("**Continuation command YAML field.**");
      expect(content, `${path} invocation comment`).toContain("`# Invoke with: <producing-skill-or-parent-route>`");
      expect(content, `${path} local feedback command field`).toContain('`command: "<producing-skill-or-parent-route>"`');
      expect(content, `${path} response command field`).toContain('`command: "<producing-skill-or-parent-route>"`');
      expect(content, `${path} first real command key`).toContain("first real YAML key");
      expect(content, `${path} command avoids separate copy`).toContain(
        "so the user does not have to copy a separate command",
      );
      expect(content, `${path} command metadata boundary`).toContain(
        "review-loop continuation metadata, not downstream routing or execution authority",
      );
      expect(content, `${path} not approved`).toContain(
        "`approval_status` (`not-approved` or `ready-for-agent-review`)",
      );
      expect(content, `${path} gate status`).toContain("`required_gate_status` (`incomplete` or `complete`)");
      expect(content, `${path} unanswered questions`).toContain("`unanswered_required_questions`");
      expect(content, `${path} ready only when complete`).toContain(
        "Set `approval_status: ready-for-agent-review` only when every required gate is answered",
      );
      expect(content, `${path} emphasize feedback value`).toContain("`feedback` (`emphasize`, `down`, or `needs-clarification`)");
      expect(content, `${path} requested action`).toContain("`requested_agent_action`");
      expect(content, `${path} emphasize action`).toContain("add-weight-to-section");
      expect(content, `${path} emphasize semantics`).toContain("this is a revision request, not approval");
      expect(content, `${path} investigate action`).toContain("investigate-and-revise");
      expect(content, `${path} clarification action`).toContain("clarify-before-approval");
      expect(content, `${path} classification before mutation`).toContain(
        "classify the feedback intent before mutation under the Feedback intake before mutation rule",
      );
      expect(content, `${path} stale up feedback value`).not.toContain("`feedback` (`up`, `down`, or `needs-clarification`)");
      expect(content, `${path} stale accept action`).not.toContain("accept-as-is");
      expect(content, `${path} do not require gates for partial responses`).toContain(
        "Do not require the user to answer every gate before sending emphasis requests, negative feedback, clarification needs, or other partial responses",
      );
    }
  });

  it("uses top in-flow navigation and forbids generated sidebars or sticky compile banners", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} layout contract`).toContain("**Page layout contract.**");
      expect(content, `${path} top toc`).toContain('top-of-page "Table of Contents" section');
      expect(content, `${path} in flow toc`).toContain("Keep the Table of Contents in normal document flow");
      expect(content, `${path} no sidebar nav`).toContain("Do not use a sidebar, side rail, drawer, split-shell layout, or sticky navigation");
      expect(content, `${path} no sticky bottom banner`).toContain(
        "Do not place compile, copy, feedback, or answer controls in a sticky or fixed bottom banner/footer",
      );
      expect(content, `${path} bottom compile in flow`).toContain(
        "Bottom compile controls must appear as ordinary content in a bottom compile section",
      );
    }
  });

  it("gives create-alignment-page platform-specific YAML handoff instructions", () => {
    const cases = [
      ["base/codex/create-alignment-page/SKILL.md", "$<producing-skill> ..."],
      ["base/claude/create-alignment-page/SKILL.md", "/<producing-skill> ..."],
    ] as const;

    for (const [path, command] of cases) {
      const content = read(path);
      expect(content, `${path} version bump`).toContain("version: v0.2");
      expect(content, `${path} review page path`).toContain("review `alignment/<skill-name>-<topic>.html`");
      expect(content, `${path} local feedback compile`).toContain("local `Compile Feedback YAML` under a section");
      expect(content, `${path} bottom compile responses`).toContain("bottom `Compile Responses`");
      expect(content, `${path} paste command`).toContain(command);
      expect(content, `${path} feedback status`).toContain("`feedback_status: revision-request`");
      expect(content, `${path} not-approved`).toContain("`approval_status: not-approved`");
      expect(content, `${path} ready approval`).toContain("`approval_status: ready-for-agent-review`");
      expect(content, `${path} revision request`).toContain("as a review/revision request");
      expect(content, `${path} renewed review`).toContain("returns the page for renewed review");
      expect(content, `${path} no duplicate clear`).toContain("do not recommend another context clear");
    }
  });

  it("keeps local feedback YAML hidden until a section feedback choice is selected", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} local feedback contract`).toContain("**Section feedback YAML contract.**");
      expect(content, `${path} local feedback hidden by default`).toContain(
        "The section feedback textarea, local compile/copy controls, and local read-only YAML output are hidden by default",
      );
      expect(content, `${path} local feedback revealed`).toContain(
        'Selecting any one feedback choice reveals a multi-line section-feedback textarea plus local "Compile Feedback YAML", "Copy YAML", and read-only YAML controls',
      );
      expect(content, `${path} local feedback hidden on deselect`).toContain(
        "deselecting the active choice hides the textarea, local compile/copy controls, and local read-only YAML output again",
      );
      expect(content, `${path} local feedback textarea`).toContain("section-feedback textarea");
      expect(content, `${path} separate from gate inputs`).toMatch(
        /separate from (required )?gate-question text inputs/,
      );
      expect(content, `${path} appears despite gate inputs`).toMatch(
        /even when (the same section )?(also )?has (required )?gate questions/,
      );
      expect(content, `${path} local yaml textarea`).toContain(
        "a read-only YAML textarea directly under that section's feedback textarea",
      );
      expect(content, `${path} local single feedback entry`).toContain(
        "single selected section-feedback entry",
      );
      expect(content, `${path} no bottom feedback yaml control`).not.toContain(
        'The bottom "Compile Feedback YAML" control',
      );
      expect(content, `${path} no global feedback-only path`).not.toContain(
        "globally in the bottom compile section",
      );
      expect(content, `${path} old bottom feedback ban removed`).not.toContain(
        "Do not place a global feedback-only compile/output banner at the bottom of the page",
      );
      expect(content, `${path} old local-only bottom ban removed`).not.toContain(
        "feedback-only YAML output belongs under each selected section feedback textarea, not in the bottom area",
      );
    }
  });

  it("keeps one unified response compilation control at the bottom of the page", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} bottom compile responses`).toContain(
        'In `review` pages, at the bottom of the page, include an ordinary in-flow compile section with a single "Compile Responses" button',
      );
      expect(content, `${path} no persistent banner`).toContain(
        "The bottom compile section must not be sticky, fixed, floating, or styled as a persistent banner",
      );
      expect(content, `${path} no separate bottom answers`).not.toContain('separate "Compile Answers" button');
      expect(content, `${path} no bottom compile feedback`).not.toContain('bottom "Compile Feedback YAML" control');
    }
  });

  it("requires compiled YAML to identify the source alignment page and continuation command", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} feedback alignment_page`).toMatch(
        /The local feedback compile generates YAML with `# Invoke with: <producing-skill-or-parent-route>`, `command: "<producing-skill-or-parent-route>"`, `alignment_page: alignment\/[^`]+\.html`, `feedback_status: revision-request`/,
      );
      expect(content, `${path} response alignment_page`).toMatch(
        /mixed response payload beginning with `# Invoke with: <producing-skill-or-parent-route>`, `command: "<producing-skill-or-parent-route>"`, `alignment_page: alignment\/[^`]+\.html`, `response_status`/,
      );
      expect(content, `${path} repo-relative path source`).toMatch(
        /Populate `alignment_page` from the known repo-relative output path used to write the HTML page/,
      );
      expect(content, `${path} continuation command source`).toContain(
        "Populate `command` from the exact continuation route the user should invoke with this YAML",
      );
    }
  });

  it("leaves no-contract skip-list skills excluded from alignment requirements", () => {
    for (const path of skippedSkills) {
      const content = read(path);
      expect(content, `${path} skipped`).not.toContain("**Alignment gates.**");
      expect(hasBundle(path), `${path} has no bundled ALIGNMENT-PAGE.md`).toBe(false);
    }
  });

  it("bundles the convention so it travels with pointer-form skills", () => {
    // Pointer-form skills used to carry only a dangling reference to CLAUDE.md
    // (the afps-tracker incident). They must now ship a sibling
    // ALIGNMENT-PAGE.md with the full convention and their skill-specific gates.
    const pointerSkills = [
      "base/claude/idea-scope-brief/SKILL.md",
      "base/codex/idea-scope-brief/SKILL.md",
      "packs/customer-lifecycle/claude/journey-map/SKILL.md",
      "packs/customer-lifecycle/codex/journey-map/SKILL.md",
    ];
    for (const path of pointerSkills) {
      const skill = read(path);
      expect(hasBundle(path), `${path} has bundled ALIGNMENT-PAGE.md`).toBe(true);
      expect(skill, `${path} stub references bundle`).toContain("ALIGNMENT-PAGE.md");
      expect(skill, `${path} no dangling CLAUDE.md pointer`).not.toContain(
        "Follow the shared Alignment Page convention in CLAUDE.md",
      );
      const page = bundled(path);
      expect(page, `${path} bundle has response contract`).toContain("**Response YAML contract.**");
      expect(page, `${path} bundle has required questions`).toContain("**Required inline questions.**");
    }
    expect(bundled("base/claude/idea-scope-brief/SKILL.md"), "idea-scope-brief gates").toContain(
      "**Idea-specific gates.**",
    );
    expect(bundled("packs/customer-lifecycle/codex/journey-map/SKILL.md"), "journey-map gates").toContain(
      "**Journey research translation.**",
    );
  });

  it("keeps every bundled ALIGNMENT-PAGE.md in sync with CLAUDE.md (drift guard)", () => {
    const out = execFileSync("node", ["scripts/upgrade-alignment-page.mjs", "--dry-run"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    const updated = out.match(/^Updated: (\d+)$/m)?.[1];
    const bundles = out.match(/^Bundled files written: (\d+)$/m)?.[1];
    expect(updated, `generator reported drift:\n${out}`).toBe("0");
    expect(bundles, `generator reported bundle drift:\n${out}`).toBe("0");
  });
});
