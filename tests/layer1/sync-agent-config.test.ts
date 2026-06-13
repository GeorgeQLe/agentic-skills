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
      repoFallbackPath: "base/codex/provision-agentic-config/SKILL.md",
    },
    {
      path: "packs/gitops/claude/sync/SKILL.md",
      command: "/provision-agentic-config",
      primarySkillPath: "~/.claude/skills/provision-agentic-config/SKILL.md",
      repoFallbackPath: "base/claude/provision-agentic-config/SKILL.md",
    },
  ];

  it("compares provisioned files against canonical provision-agentic-config blocks", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} should be versioned`).toContain("version: v0.4");
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
      expect(content, `${contract.path} should report local canonical source`).toContain(
        "Always report the local canonical source path used",
      );
      expect(content, `${contract.path} should define preference file`).toContain(
        "~/.agentic-skills/preferences.json",
      );
      expect(content, `${contract.path} should define preference key`).toContain(
        "sync.github_freshness_check",
      );
      expect(content, `${contract.path} should allow ask preference`).toContain('"ask"');
      expect(content, `${contract.path} should allow always preference`).toContain('"always"');
      expect(content, `${contract.path} should allow never preference`).toContain('"never"');
      expect(content, `${contract.path} should ask once on missing preference`).toContain(
        "ask the user once which default to remember",
      );
      expect(content, `${contract.path} should skip repeated prompt when always is saved`).toContain(
        'If the value is `"always"`, check GitHub remote freshness automatically',
      );
      expect(content, `${contract.path} should skip repeated prompt when never is saved`).toContain(
        'If the value is `"never"`, skip GitHub freshness checks',
      );
      expect(content, `${contract.path} should not mutate agentic-skills from plain sync`).toContain(
        "Plain",
      );
      expect(content, `${contract.path} should prohibit checkout mutation from plain sync`).toContain(
        "must not update the `agentic-skills` checkout",
      );
      expect(content, `${contract.path} should route stale checkout to explicit init update`).toContain(
        "init-agentic-skills update",
      );
    }
  });
});
