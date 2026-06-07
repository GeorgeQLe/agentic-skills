import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const routeBearingSkillPaths = [
  ["packs/product-testing/codex/dogfood/SKILL.md", "$customer-discovery"],
  ["packs/product-testing/claude/dogfood/SKILL.md", "/customer-discovery"],
  ["packs/product-testing/codex/uat/SKILL.md", "$customer-discovery"],
  ["packs/product-testing/claude/uat/SKILL.md", "/customer-discovery"],
] as const;

const inspectedSkillPaths = routeBearingSkillPaths.map(([path]) => path);

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("product-testing customer-discovery routing", () => {
  it("routes active product-testing contracts to customer-discovery instead of the retired icp command", () => {
    for (const [path, command] of routeBearingSkillPaths) {
      expect(read(path), `${path} should route to ${command}`).toContain(command);
    }
  });

  it("does not recommend the retired icp executable in active product-testing contracts", () => {
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
