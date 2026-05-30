import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("prompt history convention", () => {
  const surfaces = [
    { path: "CLAUDE.md", minOccurrences: 1 },
    { path: "AGENTS.md", minOccurrences: 1 },
    { path: "global/claude/provision-agentic-config/SKILL.md", minOccurrences: 2 },
    { path: "global/codex/provision-agentic-config/SKILL.md", minOccurrences: 2 },
  ];

  it("requires visible skill invocation prompts to be persisted before skill work", () => {
    for (const surface of surfaces) {
      const content = read(surface.path);
      const occurrenceCount = content.match(/### Prompt History/g)?.length ?? 0;

      expect(occurrenceCount, `${surface.path} prompt history occurrence count`).toBeGreaterThanOrEqual(
        surface.minOccurrences,
      );
      expect(content, `${surface.path} canonical directory`).toContain("prompts/<skill-slug>/");
      expect(content, `${surface.path} canonical filename`).toContain(
        "skill-prompt-YYYYMMDD-HHMMSS-<short-topic>.md",
      );
      expect(content, `${surface.path} exact prompt capture`).toContain(
        "exact visible user invocation message",
      );
      expect(content, `${surface.path} attached context capture`).toContain(
        "directly attached or pasted visible context",
      );
      for (const field of ["skill", "agent", "captured_at", "source"]) {
        expect(content, `${surface.path} frontmatter field ${field}`).toContain(`\`${field}\``);
      }
      expect(content, `${surface.path} prompt scope`).toContain(
        "prompt_scope: visible-user-invocation",
      );
      expect(content, `${surface.path} default source`).toContain("source: user-invocation");
      expect(content, `${surface.path} tracked artifact default`).toContain(
        "tracked repo artifacts by default",
      );
      expect(content, `${surface.path} visible-only scope`).toContain(
        "hidden system/developer instructions and unavailable model context are out of scope",
      );
      expect(content, `${surface.path} no truncation`).toContain(
        "Do not summarize, redact, or truncate",
      );
      expect(content, `${surface.path} secret handling`).toContain(
        "stop before writing and ask the user for a sanitized prompt",
      );
    }
  });

  it("keeps provisioned config versions in sync with bumped provisioner skills", () => {
    for (const path of [
      "CLAUDE.md",
      "AGENTS.md",
      "global/claude/provision-agentic-config/SKILL.md",
      "global/codex/provision-agentic-config/SKILL.md",
    ]) {
      const content = read(path);

      expect(content, `${path} provisioned block version`).toContain(
        "<!-- provision-agentic-config v0.5 -->",
      );
    }

    for (const path of [
      "global/claude/provision-agentic-config/SKILL.md",
      "global/codex/provision-agentic-config/SKILL.md",
    ]) {
      expect(read(path), `${path} skill version`).toContain("version: v0.5");
    }
  });
});
