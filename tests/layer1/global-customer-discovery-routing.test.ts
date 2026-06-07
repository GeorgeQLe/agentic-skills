import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const activeGlobalSkillPaths = [
  "global/codex/idea-scope-brief/SKILL.md",
  "global/claude/idea-scope-brief/SKILL.md",
  "global/codex/afps-status/SKILL.md",
  "global/claude/afps-status/SKILL.md",
  "global/codex/codebase-status/SKILL.md",
  "global/claude/codebase-status/SKILL.md",
  "global/codex/skills/SKILL.md",
  "global/claude/skills/SKILL.md",
  "global/codex/pack/SKILL.md",
  "global/claude/pack/SKILL.md",
];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("global customer-discovery routing", () => {
  it("does not route active global contracts to the retired discovery command", () => {
    for (const path of activeGlobalSkillPaths) {
      const content = read(path)
        .replaceAll("research/icp.md", "")
        .replaceAll("enterprise-icp", "");

      expect(content, `${path} should not include retired discovery routes`).not.toMatch(
        /(\$icp|\/icp|icp-needed|\bicp\b)/i,
      );
    }
  });

  it("routes idea-scope-brief and afps-status to customer-discovery", () => {
    expect(read("global/codex/idea-scope-brief/SKILL.md")).toContain("$customer-discovery");
    expect(read("global/claude/idea-scope-brief/SKILL.md")).toContain("/customer-discovery");
    expect(read("global/codex/afps-status/SKILL.md")).toContain("`discovery-needed`");
    expect(read("global/codex/afps-status/SKILL.md")).toContain("$customer-discovery");
    expect(read("global/claude/afps-status/SKILL.md")).toContain("`discovery-needed`");
    expect(read("global/claude/afps-status/SKILL.md")).toContain("/customer-discovery");
  });

  it("keeps global inventory and pack examples aligned to the renamed skill", () => {
    expect(read("global/codex/skills/SKILL.md")).toContain(
      "| Discovery & Market Fit | `customer-discovery`, `enterprise-icp` |",
    );
    expect(read("global/claude/skills/SKILL.md")).toContain(
      "| Discovery & Market Fit | `customer-discovery` (business-discovery), `enterprise-icp` (business-discovery) |",
    );
    expect(read("global/codex/pack/SKILL.md")).toContain(
      '"enabled_skills": {"customer-discovery": "business-discovery"',
    );
    expect(read("global/claude/pack/SKILL.md")).toContain(
      '"enabled_skills": {"customer-discovery": "business-discovery"',
    );
  });

  it("starts codebase-status AFPS routing at customer-discovery while preserving the evidence artifact", () => {
    for (const path of [
      "global/codex/codebase-status/SKILL.md",
      "global/claude/codebase-status/SKILL.md",
    ]) {
      const content = read(path);

      expect(content).toContain("customer-discovery -> competitive-analysis");
      expect(content).toContain("research/icp.md");
    }
  });
});
