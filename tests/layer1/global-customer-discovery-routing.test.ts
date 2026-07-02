import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const activeBaseSkillPaths = [
  "packs/base/codex/idea-scope-brief/SKILL.md",
  "packs/base/claude/idea-scope-brief/SKILL.md",
  "packs/base/codex/afps-status/SKILL.md",
  "packs/base/claude/afps-status/SKILL.md",
  "packs/base/codex/codebase-status/SKILL.md",
  "packs/base/claude/codebase-status/SKILL.md",
  "packs/base/codex/skills/SKILL.md",
  "packs/base/claude/skills/SKILL.md",
];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("base customer-discovery routing", () => {
  it("does not route active base contracts to the retired discovery command", () => {
    for (const path of activeBaseSkillPaths) {
      const content = read(path)
        .replaceAll("research/icp.md", "")
        .replaceAll("enterprise-icp", "");

      expect(content, `${path} should not include retired discovery routes`).not.toMatch(
        /(\$icp|\/icp|icp-needed|\bicp\b)/i,
      );
    }
  });

  it("routes idea-scope-brief and afps-status to customer-discovery", () => {
    expect(read("packs/base/codex/idea-scope-brief/SKILL.md")).toContain("$customer-discovery");
    expect(read("packs/base/claude/idea-scope-brief/SKILL.md")).toContain("/customer-discovery");
    expect(read("packs/base/codex/afps-status/SKILL.md")).toContain("`discovery-needed`");
    expect(read("packs/base/codex/afps-status/SKILL.md")).toContain("$customer-discovery");
    expect(read("packs/base/claude/afps-status/SKILL.md")).toContain("`discovery-needed`");
    expect(read("packs/base/claude/afps-status/SKILL.md")).toContain("/customer-discovery");
  });

  it("keeps base inventory aligned to the renamed skill", () => {
    expect(read("packs/base/codex/skills/SKILL.md")).toContain(
      "| Discovery & Market Fit | `customer-discovery`, `enterprise-icp` |",
    );
    expect(read("packs/base/claude/skills/SKILL.md")).toContain(
      "| Discovery & Market Fit | `customer-discovery` (business-discovery), `enterprise-icp` (business-discovery) |",
    );
  });

  it("starts codebase-status AFPS routing at customer-discovery while preserving the evidence artifact", () => {
    for (const path of [
      "packs/base/codex/codebase-status/SKILL.md",
      "packs/base/claude/codebase-status/SKILL.md",
    ]) {
      const content = read(path);

      expect(content).toContain("customer-discovery -> competitive-analysis");
      expect(content).toContain("research/icp.md");
    }
  });
});
