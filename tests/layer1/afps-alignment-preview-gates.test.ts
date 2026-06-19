import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

// The generated ALIGNMENT-PAGE.md bundled beside a converted SKILL.md.
function readBundle(skillMdPath: string) {
  return readFileSync(resolve(ROOT, dirname(skillMdPath), "ALIGNMENT-PAGE.md"), "utf8");
}

const explicitReportFirstSkills = [
  "packs/business-research/claude/customer-discovery/SKILL.md",
  "packs/business-research/codex/customer-discovery/SKILL.md",
  "packs/business-research/claude/competitive-analysis/SKILL.md",
  "packs/business-research/codex/competitive-analysis/SKILL.md",
  "packs/customer-lifecycle/claude/journey-map/SKILL.md",
  "packs/customer-lifecycle/codex/journey-map/SKILL.md",
  "packs/business-research/claude/positioning/SKILL.md",
  "packs/business-research/codex/positioning/SKILL.md",
];

// Converted from bespoke alignment sections to the generated stub + bundled
// ALIGNMENT-PAGE.md (Drift Plan Phase 2 Step 5): SKILL.md carries the stub,
// the sibling bundle carries the gate contract plus the skill-specific gates
// from the generator gate map.
const localPlanningPreviewSkills: Array<[path: string, specificGates: string]> = [
  ["packs/product-design/claude/ux-variations/SKILL.md", "**Variation-specific gates.**"],
  ["packs/product-design/codex/ux-variations/SKILL.md", "**Variation-specific gates.**"],
  ["packs/product-design/claude/ui-interview/SKILL.md", "**UI-specific gates.**"],
  ["packs/product-design/codex/ui-interview/SKILL.md", "**UI-specific gates.**"],
  ["packs/product-testing/claude/uat/SKILL.md", "**UAT-specific gates.**"],
  ["packs/product-testing/codex/uat/SKILL.md", "**UAT-specific gates.**"],
  ["packs/product-design/claude/consolidate-variations/SKILL.md", "**Consolidation-specific gates.**"],
  ["packs/product-design/codex/consolidate-variations/SKILL.md", "**Consolidation-specific gates.**"],
  ["packs/product-design/claude/spec-interview/SKILL.md", "**Spec-specific gates.**"],
  ["packs/product-design/codex/spec-interview/SKILL.md", "**Spec-specific gates.**"],
];

const prototypeSkills = [
  "packs/product-design/claude/prototype/SKILL.md",
  "packs/product-design/codex/prototype/SKILL.md",
];

const roadmapSkills = [
  "packs/agent-work-admin/claude/roadmap/SKILL.md",
  "packs/agent-work-admin/codex/roadmap/SKILL.md",
];

const optionalPlanningSkills = [
  "packs/agent-work-admin/claude/roadmap/SKILL.md",
  "packs/agent-work-admin/codex/roadmap/SKILL.md",
  "packs/agent-work-admin/claude/plan-phase/SKILL.md",
  "packs/agent-work-admin/codex/plan-phase/SKILL.md",
  "packs/research-admin/claude/research-roadmap/SKILL.md",
  "packs/research-admin/codex/research-roadmap/SKILL.md",
];

describe("AFPS alignment preview gates", () => {
  it("keeps upstream AFPS research skills report-first before canonical writes and routing", () => {
    for (const path of explicitReportFirstSkills) {
      const content = read(path);
      expect(content, `${path} alignment output`).toMatch(/alignment\/[a-z-]+-\{topic\}\.html/);
      expect(content, `${path} report-first gate`).toContain("## Report-First Approval Gate");
      expect(content, `${path} scope-first approval`).toContain("Default to scope-first approval");
      expect(content, `${path} scope approval before synthesis`).toContain("final compiled YAML approves the research scope");
      expect(content, `${path} staged scope discovery`).toContain("Stage 1 - Scope discovery and approval");
      expect(content, `${path} proposed changes`).toContain("proposed canonical file changes");
      // Accept either the canonical downstream-stop literal or the unified
      // paraphrase the AFPS research orchestrators deliberately share.
      expect(content, `${path} downstream stop`).toMatch(
        /Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language|Do not include downstream or cross-skill command recommendations/,
      );
    }
  });

  it("keeps later durable AFPS skills locally gated before canonical writes and routing", () => {
    for (const [path, specificGates] of localPlanningPreviewSkills) {
      const content = read(path);
      expect(content, `${path} alignment output`).toMatch(/alignment\/[a-z-]+-\{topic\}\.html/);
      expect(content, `${path} generated stub`).toContain("build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md`");

      const bundle = readBundle(path);
      expect(bundle, `${path} bundled alignment gates`).toContain("**Alignment gates.**");
      expect(bundle, `${path} bundled skill-specific gates`).toContain(specificGates);
      expect(bundle, `${path} evidence coverage`).toContain("evidence coverage");
      expect(bundle, `${path} assumptions`).toContain("assumptions/confidence");
      expect(bundle, `${path} proposed changes`).toContain("proposed file changes");
      expect(bundle, `${path} approval gates`).toContain("approval gates");
      expect(bundle, `${path} yaml`).toContain("**Response YAML contract.**");
      expect(bundle, `${path} downstream stop`).toContain("Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language");
      expect(bundle, `${path} approval stop`).toContain("the next action is review of the HTML alignment page");
    }
  });

  it("allows prototype files first but blocks downstream routing until the prototype preview is approved", () => {
    for (const path of prototypeSkills) {
      // The prototype-first timing rule is retained as bespoke prose in
      // SKILL.md beside the generated stub (hybrid section).
      const content = read(path);
      expect(content, `${path} generated stub`).toContain("build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md`");
      expect(content, `${path} mode-specific timing`).toContain("Prototype files may be created before the alignment page");
      expect(content, `${path} post-build preview`).toContain("After building or updating prototype files, build and attempt to open");
      expect(content, `${path} downstream block`).toContain("before downstream routing, UAT handoff, consolidation, spec updates, research updates, or task/roadmap changes");

      const bundle = readBundle(path);
      expect(bundle, `${path} bundled skill-specific gates`).toContain("**Prototype-specific gates.**");
      expect(bundle, `${path} yaml`).toContain("**Response YAML contract.**");
      expect(bundle, `${path} routing suppressed`).toContain("Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language");
    }
  });

  it("makes roadmap optional instead of blocking task writes on an automatic preview gate", () => {
    for (const path of roadmapSkills) {
      const content = read(path);
      expect(content, `${path} alignment heading`).toMatch(/^## Alignment Page$/m);
      expect(content, `${path} output`).toContain("alignment/roadmap-{topic}.html");
      expect(content, `${path} inline default`).toContain("By default, this skill reports results inline");
      expect(content, `${path} no automatic page`).toContain("Do not build an alignment page automatically");
      expect(content, `${path} conditional page`).toContain("only when the user explicitly requests an alignment page");
      expect(content, `${path} review need`).toContain("concrete clarification/review need");
      expect(content, `${path} no before roadmap writes`).not.toContain(
        "before writing or replacing `tasks/roadmap.md`, `tasks/todo.md`",
      );
    }
  });

  it("keeps optional planning pages fully gated when the page is explicitly created", () => {
    for (const path of optionalPlanningSkills) {
      const content = read(path);
      expect(content, `${path} generated stub`).toContain("Do not build an alignment page automatically");

      const bundle = readBundle(path);
      expect(bundle, `${path} optional intro`).toContain("Alignment pages are optional for this operational skill");
      expect(bundle, `${path} default inline artifacts`).toContain("By default, report the outcome inline");
      expect(bundle, `${path} conditional creation`).toContain("only when the user explicitly requests an alignment page");
      expect(bundle, `${path} clarification need`).toContain("concrete clarification/review need");
      expect(bundle, `${path} bundled alignment gates`).toContain("**Alignment gates.**");
      expect(bundle, `${path} yaml`).toContain("**Response YAML contract.**");
      expect(bundle, `${path} approval stop when created`).toContain("the next action is review of the HTML alignment page");
    }
  });
});
