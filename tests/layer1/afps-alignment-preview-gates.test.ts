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
  "packs/business-discovery/claude/customer-discovery/SKILL.md",
  "packs/business-discovery/codex/customer-discovery/SKILL.md",
  "packs/business-discovery/claude/competitive-analysis/SKILL.md",
  "packs/business-discovery/codex/competitive-analysis/SKILL.md",
  "packs/customer-lifecycle/claude/journey-map/SKILL.md",
  "packs/customer-lifecycle/codex/journey-map/SKILL.md",
  "packs/business-discovery/claude/positioning/SKILL.md",
  "packs/business-discovery/codex/positioning/SKILL.md",
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
  ["packs/research-admin/claude/research-roadmap/SKILL.md", "**Research-roadmap translation.**"],
  ["packs/research-admin/codex/research-roadmap/SKILL.md", "**Research-roadmap translation.**"],
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
      expect(content, `${path} downstream stop`).toContain("Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language");
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
      expect(bundle, `${path} yaml`).toContain("**Gate YAML contract.**");
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
      expect(bundle, `${path} yaml`).toContain("**Gate YAML contract.**");
      expect(bundle, `${path} routing suppressed`).toContain("Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language");
    }
  });

  it("treats roadmap as a durable planning-output skill with a preview gate", () => {
    for (const path of roadmapSkills) {
      const content = read(path);
      expect(content, `${path} alignment heading`).toMatch(/^## Alignment Page$/m);
      expect(content, `${path} output`).toContain("alignment/roadmap-{topic}.html");
      expect(content, `${path} before roadmap writes`).toContain("before writing or replacing `tasks/roadmap.md`, `tasks/todo.md`");
      expect(content, `${path} yaml`).toContain("**Gate YAML contract.**");
      expect(content, `${path} routing suppressed`).toContain("Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language");
    }
  });
});
