import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("init-agentic-skills reload guidance", () => {
  const skillPaths = [
    "base/claude/init-agentic-skills/SKILL.md",
    "base/codex/init-agentic-skills/SKILL.md",
  ];

  it("documents Claude Code reload-skills, clear-context, restart, and Codex fresh-session paths", () => {
    for (const skillPath of skillPaths) {
      const content = read(skillPath);

      expect(content, `${skillPath} should carry a bumped version`).toMatch(/^version: v(?:0\.[1-9]\d*|[1-9]\d*\.\d+)$/m);
      expect(content, `${skillPath} should recommend reload-skills first`).toContain(
        "run `/reload-skills` first",
      );
      expect(content, `${skillPath} should describe clear-context behavior`).toContain(
        "`/clear` starts a new empty-context conversation",
      );
      expect(content, `${skillPath} should keep restart fallback`).toContain(
        "top-level `.claude/skills` directory did not exist at session start",
      );
      expect(content, `${skillPath} should keep Codex fresh-session fallback`).toContain(
        "fresh Codex CLI session",
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
