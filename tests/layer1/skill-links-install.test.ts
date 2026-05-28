import { mkdtempSync, readFileSync, lstatSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const SKILL_LINKS = join(REPO_ROOT, "scripts/skill-links.sh");

function runBash(script: string): string {
  return execFileSync("bash", ["-lc", script], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
}

describe("managed skill installs", () => {
  it("copies active skill files into managed directories and excludes archives", () => {
    const root = mkdtempSync(join(tmpdir(), "agentic-skills-install-"));
    const source = join(root, "source");
    const target = join(root, "target");

    runBash(`
      set -euo pipefail
      mkdir -p "${source}/agents" "${source}/archive/v0.0"
      printf '%s\\n' '---' 'name: demo' 'description: Demo skill' 'version: v0.1' '---' > "${source}/SKILL.md"
      printf 'agent\\n' > "${source}/agents/openai.yaml"
      printf 'old\\n' > "${source}/archive/v0.0/SKILL.md"
      source "${SKILL_LINKS}"
      sync_skill_install "${source}" "${target}"
    `);

    expect(existsSync(join(target, ".agentic-skills-managed"))).toBe(true);
    expect(readFileSync(join(target, ".agentic-skills-managed"), "utf8")).toContain(`source=${source}`);
    expect(lstatSync(join(target, "SKILL.md")).isSymbolicLink()).toBe(false);
    expect(lstatSync(join(target, "agents")).isSymbolicLink()).toBe(false);
    expect(readFileSync(join(target, "SKILL.md"), "utf8")).toContain("name: demo");
    expect(existsSync(join(target, "archive"))).toBe(false);
  });

  it("keeps pinned archive installs as symlinks", () => {
    const root = mkdtempSync(join(tmpdir(), "agentic-skills-archive-install-"));
    const source = join(root, "source", "archive", "v0.0");
    const target = join(root, "target");

    runBash(`
      set -euo pipefail
      mkdir -p "${source}"
      printf '%s\\n' '---' 'name: demo' 'description: Demo skill' 'version: v0.0' '---' > "${source}/SKILL.md"
      source "${SKILL_LINKS}"
      sync_skill_install "${source}" "${target}"
    `);

    expect(lstatSync(target).isSymbolicLink()).toBe(true);
  });
});
