import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const routeBearingSkillPaths = [
  ["packs/business-ops/codex/mvp-gap/SKILL.md", "$customer-discovery"],
  ["packs/business-ops/claude/mvp-gap/SKILL.md", "/customer-discovery"],
  ["packs/business-ops/codex/platform-strategy/SKILL.md", "$customer-discovery"],
  ["packs/business-ops/claude/platform-strategy/SKILL.md", "/customer-discovery"],
  ["packs/business-ops/codex/product-line/SKILL.md", "$customer-discovery"],
  ["packs/business-ops/claude/product-line/SKILL.md", "/customer-discovery"],
  ["packs/business-ops/codex/retro/SKILL.md", "$customer-discovery"],
  ["packs/business-ops/claude/retro/SKILL.md", "/customer-discovery"],
] as const;

const inspectedSkillPaths = [
  "packs/business-ops/codex/assumption-tracker/SKILL.md",
  "packs/business-ops/claude/assumption-tracker/SKILL.md",
  "packs/business-ops/codex/burn-rate/SKILL.md",
  "packs/business-ops/claude/burn-rate/SKILL.md",
  "packs/business-ops/codex/cohort-review/SKILL.md",
  "packs/business-ops/claude/cohort-review/SKILL.md",
  ...routeBearingSkillPaths.map(([path]) => path),
  "packs/business-ops/codex/reconcile-research/SKILL.md",
  "packs/business-ops/claude/reconcile-research/SKILL.md",
  "packs/business-ops/codex/risk-register/SKILL.md",
  "packs/business-ops/claude/risk-register/SKILL.md",
  "packs/business-ops/codex/scale-audit/SKILL.md",
  "packs/business-ops/claude/scale-audit/SKILL.md",
] as const;

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("business-ops customer-discovery routing", () => {
  it("routes active business-ops contracts to customer-discovery instead of the retired icp command", () => {
    for (const [path, command] of routeBearingSkillPaths) {
      expect(read(path), `${path} should route to ${command}`).toContain(command);
    }
  });

  it("does not recommend the retired icp executable in active business-ops contracts", () => {
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
