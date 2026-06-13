import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("init-agentic-skills freshness contract", () => {
  const contracts = [
    {
      skillPath: "base/codex/init-agentic-skills/SKILL.md",
      scriptPath: "base/codex/init-agentic-skills/scripts/init-agentic-skills.sh",
      packCommand: "$pack",
      version: "v0.10",
    },
    {
      skillPath: "base/claude/init-agentic-skills/SKILL.md",
      scriptPath: "base/claude/init-agentic-skills/scripts/init-agentic-skills.sh",
      packCommand: "/pack",
      version: "v0.9",
    },
  ];

  it("defines status and explicit fast-forward-only update modes", () => {
    for (const contract of contracts) {
      const content = read(contract.skillPath);

      expect(content, `${contract.skillPath} should be bumped`).toContain(`version: ${contract.version}`);
      expect(content, `${contract.skillPath} should describe managed provenance`).toContain(
        ".agentic-skills-managed",
      );
      expect(content, `${contract.skillPath} should accept update`).toContain("`update` or `latest`");
      expect(content, `${contract.skillPath} should report checkout commit`).toContain(
        "local checkout commit",
      );
      expect(content, `${contract.skillPath} should report remote URL`).toContain("remote URL");
      expect(content, `${contract.skillPath} should report preference state`).toContain(
        "~/.agentic-skills/preferences.json",
      );
      expect(content, `${contract.skillPath} should require confirmation`).toContain(
        "Confirm before running commands that fetch, pull, or reinstall",
      );
      expect(content, `${contract.skillPath} should require ff-only update`).toContain(
        "fast-forward-only",
      );
      expect(content, `${contract.skillPath} should rerun init after update`).toContain("rerun `init.sh`");
      expect(content, `${contract.skillPath} should recommend Claude reload-skills`).toContain(
        "/reload-skills",
      );
      expect(content, `${contract.skillPath} should mention clear-context reload`).toContain(
        "`/clear` starts a new empty-context conversation",
      );
      expect(content, `${contract.skillPath} should mention missing top-level skills dir`).toContain(
        "top-level `.claude/skills` directory did not exist at session start",
      );
      expect(content, `${contract.skillPath} should recommend Codex fresh CLI session`).toContain(
        "fresh Codex CLI session",
      );
      expect(content, `${contract.skillPath} should keep packs local`).toContain(
        "Do not install `packs/*` as base skills",
      );
      expect(content, `${contract.skillPath} should route pack setup`).toContain(contract.packCommand);
    }
  });

  it("launcher implements status and update/latest branches", () => {
    for (const contract of contracts) {
      const script = read(contract.scriptPath);

      expect(script, `${contract.scriptPath} should read local preference`).toContain(
        'PREFERENCES_FILE="$HOME/.agentic-skills/preferences.json"',
      );
      expect(script, `${contract.scriptPath} should resolve from BASH_SOURCE`).toContain(
        '${BASH_SOURCE[0]}',
      );
      expect(script, `${contract.scriptPath} should read managed provenance`).toContain(
        ".agentic-skills-managed",
      );
      expect(script, `${contract.scriptPath} should report local commit`).toContain("local commit:");
      expect(script, `${contract.scriptPath} should report remote URL`).toContain("remote URL:");
      expect(script, `${contract.scriptPath} should require update confirmation`).toContain(
        "confirm_update",
      );
      expect(script, `${contract.scriptPath} should fetch explicitly`).toContain("fetch origin");
      expect(script, `${contract.scriptPath} should merge ff-only`).toContain("merge --ff-only origin/HEAD");
      expect(script, `${contract.scriptPath} should rerun init`).toContain(
        'bash "$REPO_ROOT/$DELEGATE_SCRIPT"',
      );
      expect(script, `${contract.scriptPath} should recommend Claude reload-skills`).toContain(
        "/reload-skills first",
      );
      expect(script, `${contract.scriptPath} should mention clear-context reload`).toContain(
        "/clear starts a new empty-context conversation",
      );
      expect(script, `${contract.scriptPath} should mention missing top-level skills dir`).toContain(
        "top-level .claude/skills directory did not exist at session start",
      );
      expect(script, `${contract.scriptPath} should recommend Codex fresh CLI session`).toContain(
        "fresh Codex CLI session",
      );
      expect(script, `${contract.scriptPath} should branch on latest`).toContain("update|latest");
    }
  });
});
