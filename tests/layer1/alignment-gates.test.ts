import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const coreSkills = [
  "global/claude/concept-exploration/SKILL.md",
  "global/codex/concept-exploration/SKILL.md",
  "global/claude/feature-interview/SKILL.md",
  "global/codex/feature-interview/SKILL.md",
  "global/claude/ui-interview/SKILL.md",
  "global/codex/ui-interview/SKILL.md",
  "global/claude/ux-variations/SKILL.md",
  "global/codex/ux-variations/SKILL.md",
  "global/claude/spec-interview/SKILL.md",
  "global/codex/spec-interview/SKILL.md",
  "global/claude/consolidate-variations/SKILL.md",
  "global/codex/consolidate-variations/SKILL.md",
  "global/claude/prototype/SKILL.md",
  "global/codex/prototype/SKILL.md",
  "global/claude/uat/SKILL.md",
  "global/codex/uat/SKILL.md",
  "packs/business-discovery/claude/icp/SKILL.md",
  "packs/business-discovery/codex/icp/SKILL.md",
  "packs/business-discovery/claude/competitive-analysis/SKILL.md",
  "packs/business-discovery/codex/competitive-analysis/SKILL.md",
  "packs/business-discovery/claude/customer-feedback/SKILL.md",
  "packs/business-discovery/codex/customer-feedback/SKILL.md",
  "packs/customer-lifecycle/claude/journey-map/SKILL.md",
  "packs/customer-lifecycle/codex/journey-map/SKILL.md",
  "packs/customer-lifecycle/claude/conversion-map/SKILL.md",
  "packs/customer-lifecycle/codex/conversion-map/SKILL.md",
  "packs/customer-lifecycle/claude/retention-map/SKILL.md",
  "packs/customer-lifecycle/codex/retention-map/SKILL.md",
  "packs/business-ops/claude/assumption-tracker/SKILL.md",
  "packs/business-ops/codex/assumption-tracker/SKILL.md",
  "packs/business-growth/claude/experiment/SKILL.md",
  "packs/business-growth/codex/experiment/SKILL.md",
  "packs/business-ops/claude/cohort-review/SKILL.md",
  "packs/business-ops/codex/cohort-review/SKILL.md",
  "packs/business-ops/claude/retro/SKILL.md",
  "packs/business-ops/codex/retro/SKILL.md",
  "packs/business-ops/claude/risk-register/SKILL.md",
  "packs/business-ops/codex/risk-register/SKILL.md",
];

const skippedSkills = ["run", "ship", "ship-end", "sync", "roadmap", "plan-phase"];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("alignment page gate contract", () => {
  it("requires gate-based HTML review pages for core planning and research skills", () => {
    for (const path of coreSkills) {
      const content = read(path);
      expect(content, `${path} alignment heading`).toMatch(/^#{2,3} Alignment Page$/m);
      expect(content, `${path} gates`).toContain("**Alignment gates.**");
      expect(content, `${path} required gate types`).toContain("evidence coverage, assumptions/confidence, scope/non-goals");
      expect(content, `${path} required questions`).toContain("**Required inline questions.**");
      expect(content, `${path} yaml contract`).toContain("**Gate YAML contract.**");
      expect(content, `${path} yaml fields`).toContain("`section`, `gate_type`, `status`");
      expect(content, `${path} in-page assumptions`).toContain("assumptions/confidence");
      expect(content, `${path} proposed file changes`).toContain("proposed file changes");
      expect(content, `${path} pre-approval stop`).toContain("the next action is review of the HTML alignment page");
    }
  });

  it("keeps report-only research gates explicit", () => {
    for (const path of coreSkills.filter((p) => p.startsWith("packs/"))) {
      const content = read(path);
      expect(content, `${path} report-only gates`).toContain("**Report-only research gates.**");
      expect(content, `${path} evidence coverage`).toContain("evidence coverage");
      expect(content, `${path} recommended path`).toContain("recommended path");
      expect(content, `${path} approval gates`).toContain("approval gates");
    }
  });

  it("preserves skill-specific gate language", () => {
    expect(read("global/codex/concept-exploration/SKILL.md")).toContain("Concept Assumptions Manifest as a first-class assumptions/confidence gate");
    expect(read("global/codex/feature-interview/SKILL.md")).toContain("Render the evidence brief, claim verdicts, assumptions, planning destination");
    expect(read("global/codex/ui-interview/SKILL.md")).toContain("Render surfaced assumptions, the UI or content requirements manifest");
    expect(read("global/codex/ux-variations/SKILL.md")).toContain("Render surfaced assumptions, variation manifest, concept selection");
  });

  it("requires investigate alignment pages to copy compiled YAML ergonomically", () => {
    const content = read("global/codex/investigate/SKILL.md");
    expect(content).toContain("automatically attempt to copy the YAML to the clipboard");
    expect(content).toContain('explicit "Copy YAML" button');
    expect(content).toContain("fall back to selecting the textarea contents");
  });

  it("leaves skip-list skills excluded from alignment requirements", () => {
    for (const skill of skippedSkills) {
      for (const agent of ["claude", "codex"]) {
        const path = `global/${agent}/${skill}/SKILL.md`;
        const content = read(path);
        expect(content, `${path} skipped`).not.toContain("**Alignment gates.**");
      }
    }
  });
});
