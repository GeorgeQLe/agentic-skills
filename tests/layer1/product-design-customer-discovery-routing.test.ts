import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const inspectedSkillPaths = [
  "packs/product-design/codex/brainstorm/SKILL.md",
  "packs/product-design/claude/brainstorm/SKILL.md",
  "packs/product-design/codex/prototype/SKILL.md",
  "packs/product-design/claude/prototype/SKILL.md",
  "packs/product-design/codex/spec-interview/SKILL.md",
  "packs/product-design/claude/spec-interview/SKILL.md",
  "packs/product-design/codex/consolidate-prototypes/SKILL.md",
  "packs/product-design/claude/consolidate-prototypes/SKILL.md",
  "packs/product-design/codex/design-system/SKILL.md",
  "packs/product-design/claude/design-system/SKILL.md",
  "packs/product-design/codex/feature-interview/SKILL.md",
  "packs/product-design/claude/feature-interview/SKILL.md",
  "packs/product-design/codex/ui-interview/SKILL.md",
  "packs/product-design/claude/ui-interview/SKILL.md",
  "packs/product-design/codex/user-flow-map/SKILL.md",
  "packs/product-design/claude/user-flow-map/SKILL.md",
  "packs/product-design/codex/ux-variations/SKILL.md",
  "packs/product-design/claude/ux-variations/SKILL.md",
] as const;

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("product-design customer-discovery routing", () => {
  it("does not recommend the retired icp executable in active product-design contracts", () => {
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
