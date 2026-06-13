import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = resolve(import.meta.dirname, "../..");

type Agent = "claude" | "codex";

function copyManagedLauncher(
  fakeHome: string,
  agent: Agent,
  skill: "pack",
  scriptName: "pack.sh",
): string {
  const sourceSkill = join(REPO_ROOT, "base", agent, skill);
  const agentDir = agent === "claude" ? ".claude" : ".codex";
  const copiedSkill = join(fakeHome, agentDir, "skills", skill);
  const copiedScripts = join(copiedSkill, "scripts");

  mkdirSync(copiedScripts, { recursive: true });
  writeFileSync(
    join(copiedSkill, ".agentic-skills-managed"),
    `source=${sourceSkill}\nmanaged_by=agentic-skills\n`,
  );
  copyFileSync(join(sourceSkill, "scripts", scriptName), join(copiedScripts, scriptName));

  return join(copiedScripts, scriptName);
}

function runCopiedLauncher(fakeHome: string, script: string, args: string[]): string {
  return execFileSync("bash", [script, ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    env: {
      ...process.env,
      HOME: fakeHome,
    },
  });
}

describe("base copied managed launchers", () => {
  it("resolves copied pack launchers through managed provenance", () => {
    for (const agent of ["claude", "codex"] as const) {
      const fakeHome = mkdtempSync(join(tmpdir(), `agentic-skills-${agent}-pack-`));
      try {
        const script = copyManagedLauncher(fakeHome, agent, "pack", "pack.sh");
        const output = runCopiedLauncher(fakeHome, script, ["status"]);

        expect(output).toContain("Project designation:");
        expect(output).toContain("Installed local pack skills:");
      } finally {
        rmSync(fakeHome, { recursive: true, force: true });
      }
    }
  });
});
