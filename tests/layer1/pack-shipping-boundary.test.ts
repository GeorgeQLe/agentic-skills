import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("pack install artifact shipping boundary", () => {
  const shipSkillPaths = [
    "packs/exec-loop/claude/ship/SKILL.md",
    "packs/exec-loop/codex/ship/SKILL.md",
    "packs/exec-loop/claude/ship-end/SKILL.md",
    "packs/exec-loop/codex/ship-end/SKILL.md",
  ];

  const commitSkillPaths = [
    "packs/gitops/claude/commit-and-push-by-feature/SKILL.md",
    "packs/gitops/codex/commit-and-push-by-feature/SKILL.md",
  ];

  const packSkillPaths = [
    "base/claude/init-agentic-skills/SKILL.md",
    "base/codex/init-agentic-skills/SKILL.md",
  ];

  it("requires ship and ship-end to include project designation but exclude generated local skill roots", () => {
    for (const skillPath of shipSkillPaths) {
      const content = read(skillPath);

      expect(content, `${skillPath} should define the boundary`).toContain(
        "Pack install artifact boundary",
      );
      expect(content, `${skillPath} should commit pack designation`).toContain(
        "`.agents/project.json` as the committed project designation",
      );
      expect(content, `${skillPath} should include project.json when pack config changes`).toContain(
        "include `.agents/project.json` in the shipping boundary",
      );
      expect(content, `${skillPath} should classify local roots as generated`).toContain(
        "`.claude/skills/**` and `.codex/skills/**` as generated local skill roots",
      );
      expect(content, `${skillPath} should forbid staging or committing roots`).toContain(
        "generated skill roots must not be staged or committed",
      );
      expect(content, `${skillPath} should leave untracked roots local`).toContain(
        "leave them uncommitted",
      );
      expect(content, `${skillPath} should stop on tracked generated roots`).toContain(
        "already tracked or modified as a tracked file",
      );
    }
  });

  it("forbids commit-and-push buckets from sweeping generated local skill roots", () => {
    for (const skillPath of commitSkillPaths) {
      const content = read(skillPath);

      expect(content, `${skillPath} should define the boundary`).toContain(
        "Pack install artifact boundary",
      );
      expect(content, `${skillPath} should bucket project designation`).toContain(
        "bucket and commit `.agents/project.json`",
      );
      expect(content, `${skillPath} should classify local roots as generated`).toContain(
        "`.claude/skills/**` and `.codex/skills/**` as generated local skill roots",
      );
      expect(content, `${skillPath} should forbid staging or committing roots`).toContain(
        "generated skill roots must not be staged or committed",
      );
      expect(content, `${skillPath} should cover final cleanup`).toContain(
        "final leftover cleanup",
      );
    }
  });

  it("surfaces the same commit rule from the pack skill reporting contract", () => {
    for (const skillPath of packSkillPaths) {
      const content = read(skillPath);

      expect(content, `${skillPath} should carry a bumped version`).toMatch(/^version: v(?:0\.[1-9]\d*|[1-9]\d*\.\d+)$/m);
      expect(content, `${skillPath} should report shipping guidance`).toContain(
        "shipping guidance:",
      );
      expect(content, `${skillPath} should name committed project designation`).toContain(
        "`.agents/project.json` is the committed project designation",
      );
      expect(content, `${skillPath} should classify local roots as generated`).toContain(
        "`.claude/skills/**` and `.codex/skills/**` are generated local skill roots",
      );
      expect(content, `${skillPath} should forbid staging or committing roots`).toContain(
        "generated skill roots must not be staged or committed",
      );
    }
  });
});
