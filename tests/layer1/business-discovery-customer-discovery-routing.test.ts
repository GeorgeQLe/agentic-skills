import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const routeBearingSkillPaths = [
  ["packs/business-research/codex/competitive-analysis/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/competitive-analysis/SKILL.md", "/customer-discovery"],
  ["packs/business-research/codex/customer-feedback/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/customer-feedback/SKILL.md", "/customer-discovery"],
  ["packs/business-research/codex/lean-canvas/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/lean-canvas/SKILL.md", "/customer-discovery"],
  ["packs/business-research/codex/value-prop-canvas/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/value-prop-canvas/SKILL.md", "/customer-discovery"],
  ["packs/business-research/codex/positioning/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/positioning/SKILL.md", "/customer-discovery"],
  ["packs/business-research/codex/positioning/frameworks/category-design/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/positioning/frameworks/category-design/SKILL.md", "/customer-discovery"],
  ["packs/business-research/codex/positioning/frameworks/jtbd-positioning/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/positioning/frameworks/jtbd-positioning/SKILL.md", "/customer-discovery"],
  ["packs/business-research/codex/positioning/frameworks/moore-positioning/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/positioning/frameworks/moore-positioning/SKILL.md", "/customer-discovery"],
  ["packs/business-research/codex/positioning/frameworks/obviously-awesome/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/positioning/frameworks/obviously-awesome/SKILL.md", "/customer-discovery"],
  ["packs/business-research/codex/positioning/frameworks/strategic-canvas/SKILL.md", "$customer-discovery"],
  ["packs/business-research/claude/positioning/frameworks/strategic-canvas/SKILL.md", "/customer-discovery"],
] as const;

const inspectedSkillPaths = [
  ...routeBearingSkillPaths.map(([path]) => path),
  "packs/business-research/codex/enterprise-icp/SKILL.md",
  "packs/business-research/claude/enterprise-icp/SKILL.md",
];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("business-research customer-discovery routing", () => {
  it("routes active pack contracts to customer-discovery instead of the retired icp command", () => {
    for (const [path, command] of routeBearingSkillPaths) {
      expect(read(path), `${path} should route to ${command}`).toContain(command);
    }
  });

  it("does not recommend the retired icp executable in active pack contracts", () => {
    for (const path of inspectedSkillPaths) {
      const content = read(path);

      expect(content, `${path} should not route to retired discovery command`).not.toMatch(
        /(^|[^A-Za-z0-9_.-])(\$icp|\/icp)(?![A-Za-z0-9_.-])/i,
      );
      expect(content, `${path} should not use the retired AFPS status`).not.toContain("icp-needed");
      expect(content, `${path} should not keep the old concept-validation verdict label`).not.toContain(
        "Proceed to ICP",
      );
    }
  });
});
