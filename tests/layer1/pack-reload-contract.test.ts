import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("pack skill reload guidance", () => {
  const skillPaths = [
    "global/claude/pack/SKILL.md",
    "global/codex/pack/SKILL.md",
  ];

  it("documents Claude Code reload-skills, clear-context, restart, and Codex fresh-session paths", () => {
    for (const skillPath of skillPaths) {
      const content = read(skillPath);

      expect(content, `${skillPath} should be bumped`).toContain("version: v0.3");
      expect(content, `${skillPath} should mention Claude live detection`).toContain(
        "Claude Code watches skill files under existing `.claude/skills` roots",
      );
      expect(content, `${skillPath} should recommend reload-skills first`).toContain(
        "supports `/reload-skills`",
      );
      expect(content, `${skillPath} should describe clear-context behavior`).toContain(
        "`/clear` starts a new empty-context conversation",
      );
      expect(content, `${skillPath} should keep restart fallback`).toContain(
        "top-level `.claude/skills` directory did not exist when the session started",
      );
      expect(content, `${skillPath} should keep Codex fresh-session fallback`).toContain(
        "fresh Codex CLI session",
      );
      expect(content, `${skillPath} should remove stale generic no-refresh wording`).not.toContain(
        "No supported in-session CLI skill refresh command is configured in this pack workflow.",
      );
    }
  });

  it("keeps the shared installer notice aligned with the skill contract", () => {
    const script = read("scripts/pack.sh");
    const readme = read("README.md");

    for (const content of [script, readme]) {
      expect(content).toContain("/reload-skills");
      expect(content).toContain("new empty-context conversation");
      expect(content).toContain("did not exist when the session started");
      expect(content).toContain("fresh Codex CLI session");
    }
  });
});
