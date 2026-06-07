import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const routeBearingSkillPaths = [
  ["packs/business-growth/codex/experiment/SKILL.md", "$customer-discovery"],
  ["packs/business-growth/claude/experiment/SKILL.md", "/customer-discovery"],
  ["packs/business-growth/codex/gtm/SKILL.md", "$customer-discovery"],
  ["packs/business-growth/claude/gtm/SKILL.md", "/customer-discovery"],
  ["packs/business-growth/codex/monetization/SKILL.md", "$customer-discovery"],
  ["packs/business-growth/claude/monetization/SKILL.md", "/customer-discovery"],
  ["packs/business-growth/codex/pmf-assessment/SKILL.md", "$customer-discovery"],
  ["packs/business-growth/claude/pmf-assessment/SKILL.md", "/customer-discovery"],
] as const;

const inspectedSkillPaths = [
  ...routeBearingSkillPaths.map(([path]) => path),
  "packs/business-growth/codex/hook-model/SKILL.md",
  "packs/business-growth/claude/hook-model/SKILL.md",
  "packs/business-growth/codex/landing-copy/SKILL.md",
  "packs/business-growth/claude/landing-copy/SKILL.md",
  "packs/business-growth/codex/metrics/SKILL.md",
  "packs/business-growth/claude/metrics/SKILL.md",
] as const;

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("business-growth customer-discovery routing", () => {
  it("routes active business-growth contracts to customer-discovery instead of the retired icp command", () => {
    for (const [path, command] of routeBearingSkillPaths) {
      expect(read(path), `${path} should route to ${command}`).toContain(command);
    }
  });

  it("does not recommend the retired icp executable in active business-growth contracts", () => {
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
