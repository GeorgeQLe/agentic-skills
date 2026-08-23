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
    { path: "packs/base/claude/provision-agentic-config/SKILL.md", minOccurrences: 2 },
    { path: "packs/base/codex/provision-agentic-config/SKILL.md", minOccurrences: 2 },
  ];

  it("persists visible prompts with substantive tracked skill work", () => {
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
      expect(content, `${surface.path} substantive tracked work boundary`).toContain(
        "substantive tracked repository artifacts",
      );
      expect(content, `${surface.path} same delivery boundary`).toContain(
        "same issue, branch, commit, and pull request",
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

  it("terminates metadata-only and external-only invocations", () => {
    for (const surface of surfaces) {
      const content = read(surface.path);
      expect(content, `${surface.path} standalone lifecycle guard`).toContain(
        "Prompt history must never initiate its own issue, branch, commit, or pull request",
      );
      expect(content, `${surface.path} metadata-only exemption`).toContain(
        "where the prompt record would be the only tracked mutation, do not create a prompt file",
      );
      for (const operation of ["read-only", "status-only", "review-only", "merge-only", "cleanup-only"]) {
        expect(content, `${surface.path} ${operation} exemption`).toContain(operation);
      }
    }

    for (const agent of ["claude", "codex"]) {
      for (const skill of ["github-issue", "github-branch", "github-pr"]) {
        const content = read(`packs/base/${agent}/${skill}/SKILL.md`);
        expect(content, `${agent}/${skill} termination section`).toContain(
          "## Prompt History Termination",
        );
        expect(content, `${agent}/${skill} metadata boundary`).toContain(
          "Prompt history is metadata, not work that initiates this lifecycle",
        );
        expect(content, `${agent}/${skill} standalone delivery guard`).toContain(
          "solely to ship a prompt-history record",
        );
      }
    }
  });

  it("keeps provisioned block markers in sync", () => {
    const codexSource = read("packs/base/codex/provision-agentic-config/SKILL.md");
    const markerMatch = codexSource.match(
      /Each block begins with `<!-- provision-agentic-config (v\d+\.\d+) -->`/,
    );
    expect(markerMatch, "provision-agentic-config block marker").not.toBeNull();
    const marker = markerMatch![1];

    for (const path of [
      "CLAUDE.md",
      "AGENTS.md",
      "packs/base/claude/provision-agentic-config/SKILL.md",
      "packs/base/codex/provision-agentic-config/SKILL.md",
    ]) {
      const content = read(path);

      expect(content, `${path} provisioned block version`).toContain(
        `<!-- provision-agentic-config ${marker} -->`,
      );
    }
  });
});
