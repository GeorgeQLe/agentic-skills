import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const activeBaseSkillPaths = [
  "base/codex/idea-scope-brief/SKILL.md",
  "base/claude/idea-scope-brief/SKILL.md",
  "base/codex/afps-status/SKILL.md",
  "base/claude/afps-status/SKILL.md",
  "base/codex/codebase-status/SKILL.md",
  "base/claude/codebase-status/SKILL.md",
  "base/codex/skills/SKILL.md",
  "base/claude/skills/SKILL.md",
  "base/codex/pack/SKILL.md",
  "base/claude/pack/SKILL.md",
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
    expect(read("base/codex/idea-scope-brief/SKILL.md")).toContain("$customer-discovery");
    expect(read("base/claude/idea-scope-brief/SKILL.md")).toContain("/customer-discovery");
    expect(read("base/codex/afps-status/SKILL.md")).toContain("`discovery-needed`");
    expect(read("base/codex/afps-status/SKILL.md")).toContain("$customer-discovery");
    expect(read("base/claude/afps-status/SKILL.md")).toContain("`discovery-needed`");
    expect(read("base/claude/afps-status/SKILL.md")).toContain("/customer-discovery");
  });

  it("keeps base inventory and pack examples aligned to the renamed skill", () => {
    expect(read("base/codex/skills/SKILL.md")).toContain(
      "| Discovery & Market Fit | `customer-discovery`, `enterprise-icp` |",
    );
    expect(read("base/claude/skills/SKILL.md")).toContain(
      "| Discovery & Market Fit | `customer-discovery` (business-discovery), `enterprise-icp` (business-discovery) |",
    );
    expect(read("base/codex/pack/SKILL.md")).toContain(
      '"enabled_skills": {"customer-discovery": "business-discovery"',
    );
    expect(read("base/claude/pack/SKILL.md")).toContain(
      '"enabled_skills": {"customer-discovery": "business-discovery"',
    );
  });

  it("starts codebase-status AFPS routing at customer-discovery while preserving the evidence artifact", () => {
    for (const path of [
      "base/codex/codebase-status/SKILL.md",
      "base/claude/codebase-status/SKILL.md",
    ]) {
      const content = read(path);

      expect(content).toContain("customer-discovery -> competitive-analysis");
      expect(content).toContain("research/icp.md");
    }
  });
});
