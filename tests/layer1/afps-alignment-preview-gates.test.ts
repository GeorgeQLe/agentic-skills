import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

const explicitReportFirstSkills = [
  "packs/business-discovery/claude/icp/SKILL.md",
  "packs/business-discovery/codex/icp/SKILL.md",
  "packs/business-discovery/claude/competitive-analysis/SKILL.md",
  "packs/business-discovery/codex/competitive-analysis/SKILL.md",
  "packs/customer-lifecycle/claude/journey-map/SKILL.md",
  "packs/customer-lifecycle/codex/journey-map/SKILL.md",
  "packs/business-discovery/claude/positioning/SKILL.md",
  "packs/business-discovery/codex/positioning/SKILL.md",
];

const localPlanningPreviewSkills = [
  "packs/product-design/claude/ux-variations/SKILL.md",
  "packs/product-design/codex/ux-variations/SKILL.md",
  "packs/product-design/claude/ui-interview/SKILL.md",
  "packs/product-design/codex/ui-interview/SKILL.md",
  "packs/product-testing/claude/uat/SKILL.md",
  "packs/product-testing/codex/uat/SKILL.md",
  "packs/product-design/claude/consolidate-variations/SKILL.md",
  "packs/product-design/codex/consolidate-variations/SKILL.md",
  "packs/research-admin/claude/research-roadmap/SKILL.md",
  "packs/research-admin/codex/research-roadmap/SKILL.md",
  "packs/product-design/claude/spec-interview/SKILL.md",
  "packs/product-design/codex/spec-interview/SKILL.md",
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
      expect(content, `${path} evidence coverage`).toContain("evidence coverage");
      expect(content, `${path} proposed changes`).toContain("proposed file changes");
      expect(content, `${path} report-first gate`).toContain("## Report-First Approval Gate");
      expect(content, `${path} preview before approval`).toContain("build and attempt to open the alignment preview page first");
      expect(content, `${path} downstream stop`).toContain("Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language");
    }
  });

  it("keeps later durable AFPS skills locally gated before canonical writes and routing", () => {
    for (const path of localPlanningPreviewSkills) {
      const content = read(path);
      expect(content, `${path} alignment output`).toMatch(/alignment\/[a-z-]+-\{topic\}\.html/);
      expect(content, `${path} local alignment gates`).toContain("**Alignment gates.**");
      expect(content, `${path} evidence coverage`).toContain("evidence coverage");
      expect(content, `${path} assumptions`).toContain("assumptions/confidence");
      expect(content, `${path} proposed changes`).toContain("proposed file changes");
      expect(content, `${path} approval gates`).toContain("approval gates");
      expect(content, `${path} yaml`).toContain("**Gate YAML contract.**");
      expect(content, `${path} downstream stop`).toContain("Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language");
      expect(content, `${path} approval stop`).toContain("the next action is review of the HTML alignment page");
    }
  });

  it("allows prototype files first but blocks downstream routing until the prototype preview is approved", () => {
    for (const path of prototypeSkills) {
      const content = read(path);
      expect(content, `${path} mode-specific timing`).toContain("Prototype files may be created before the alignment page");
      expect(content, `${path} post-build preview`).toContain("After building or updating prototype files, build and attempt to open");
      expect(content, `${path} downstream block`).toContain("before downstream routing, UAT handoff, consolidation, spec updates, research updates, or task/roadmap changes");
      expect(content, `${path} yaml`).toContain("**Gate YAML contract.**");
      expect(content, `${path} routing suppressed`).toContain("Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language");
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
