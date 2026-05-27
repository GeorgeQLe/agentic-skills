import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("sync agent config drift contract", () => {
  const contracts = [
    {
      path: "packs/gitops/codex/sync/SKILL.md",
      command: "$provision-agentic-config",
      primarySkillPath: "~/.codex/skills/provision-agentic-config/SKILL.md",
      repoFallbackPath: "global/codex/provision-agentic-config/SKILL.md",
    },
    {
      path: "packs/gitops/claude/sync/SKILL.md",
      command: "/provision-agentic-config",
      primarySkillPath: "~/.claude/skills/provision-agentic-config/SKILL.md",
      repoFallbackPath: "global/claude/provision-agentic-config/SKILL.md",
    },
  ];

  it("compares provisioned files against canonical provision-agentic-config blocks", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} should be versioned`).toContain("version: v0.2");
      expect(content, `${contract.path} should keep version-comment detection`).toContain(
        "<!-- provision-agentic-config vX.Y -->",
      );
      expect(content, `${contract.path} should read primary installed skill`).toContain(
        contract.primarySkillPath,
      );
      expect(content, `${contract.path} should fall back to repo-local canonical skill`).toContain(
        contract.repoFallbackPath,
      );
      expect(content, `${contract.path} should extract Claude canonical block`).toContain(
        "Required Claude Block",
      );
      expect(content, `${contract.path} should extract AGENTS canonical block`).toContain(
        "Required AGENTS Block",
      );
      expect(content, `${contract.path} should normalize only harmless wrapper whitespace`).toContain(
        "normalizing line endings and trimming only leading/trailing whitespace around the block",
      );
      expect(content, `${contract.path} should warn on actual content drift`).toContain(
        "provisioned block differs from the canonical provision-agentic-config",
      );
      expect(content, `${contract.path} should route to provision command`).toContain(contract.command);
      expect(content, `${contract.path} should report drift status`).toContain("Agent config drift");
    }
  });
});
