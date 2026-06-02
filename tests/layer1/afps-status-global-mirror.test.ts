import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(REPO_ROOT, path), "utf8");

describe("afps-status global mirror", () => {
  it("is available as both a Claude and Codex global skill", () => {
    const claude = read("global/claude/afps-status/SKILL.md");
    const codex = read("global/codex/afps-status/SKILL.md");

    expect(claude).toContain("name: afps-status");
    expect(claude).toContain("Invoke as `/afps-status`.");
    expect(claude).toContain("/codebase-status");
    expect(claude).not.toContain("Invoke as `$afps-status`.");

    expect(codex).toContain("name: afps-status");
    expect(codex).toContain("Invoke as `$afps-status`.");
    expect(codex).toContain("$codebase-status");
  });

  it("is grouped in the global skills inventory for both runners", () => {
    const claudeSkills = read("global/claude/skills/SKILL.md");
    const codexSkills = read("global/codex/skills/SKILL.md");

    expect(claudeSkills).toContain("| Context & Session | `afps-status`, `codebase-status`");
    expect(codexSkills).toContain("| Context & Session | `afps-status`, `codebase-status`");
  });
});
