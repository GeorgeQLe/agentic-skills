import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("init-agentic-skills project-local contract", () => {
  const contracts = [
    {
      skillPath: "base/codex/init-agentic-skills/SKILL.md",
      version: "v0.12",
    },
    {
      skillPath: "base/claude/init-agentic-skills/SKILL.md",
      version: "v0.12",
    },
  ];

  it("drives base installation through project-local npx skillpacks", () => {
    for (const contract of contracts) {
      const content = read(contract.skillPath);

      expect(content, `${contract.skillPath} should be bumped`).toContain(`version: ${contract.version}`);
      expect(content, `${contract.skillPath} should install via npx skillpacks init`).toContain(
        "npx skillpacks init",
      );
      expect(content, `${contract.skillPath} should describe project-local installs`).toContain(
        "project-local",
      );
      expect(content, `${contract.skillPath} should report status`).toContain("npx skillpacks status");
      expect(content, `${contract.skillPath} should report drift`).toContain("npx skillpacks doctor");
      expect(content, `${contract.skillPath} should describe managed provenance`).toContain(
        ".agentic-skills-managed",
      );
      expect(content, `${contract.skillPath} should offer legacy global cleanup`).toContain(
        "npx skillpacks uninstall-global",
      );
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
      expect(content, `${contract.skillPath} should route pack setup through skillpacks install`).toContain(
        "npx skillpacks install <pack-or-skill>",
      );
    }
  });

  it("retires the user-home launcher and init.sh references", () => {
    for (const contract of contracts) {
      const content = read(contract.skillPath);

      expect(content, `${contract.skillPath} should not reference init.sh`).not.toContain("init.sh");
      expect(content, `${contract.skillPath} should not reference --global`).not.toContain("--global");
      expect(content, `${contract.skillPath} should not delegate to a launcher script`).not.toContain(
        "scripts/init-agentic-skills.sh",
      );
    }

    expect(
      existsSync(repoPath("base/claude/init-agentic-skills/scripts/init-agentic-skills.sh")),
      "claude launcher should be removed",
    ).toBe(false);
    expect(
      existsSync(repoPath("base/codex/init-agentic-skills/scripts/init-agentic-skills.sh")),
      "codex launcher should be removed",
    ).toBe(false);
    expect(existsSync(repoPath("init.sh")), "root init.sh should be removed").toBe(false);
    expect(existsSync(repoPath("scripts/init-agentic-skills.sh")), "dispatcher should be removed").toBe(
      false,
    );
  });
});
