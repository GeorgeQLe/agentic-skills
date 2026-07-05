import { mkdtempSync, readFileSync, lstatSync, existsSync, readdirSync } from "node:fs";
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

function installedPaths(root: string): string[] {
  const paths: string[] = [];

  function visit(dir: string, prefix = ""): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      paths.push(relativePath);
      if (entry.isDirectory()) {
        visit(join(dir, entry.name), relativePath);
      }
    }
  }

  visit(root);
  return paths.sort();
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

  it("excludes nested framework archives from managed directory copies", () => {
    const root = mkdtempSync(join(tmpdir(), "agentic-skills-nested-archive-install-"));
    const source = join(root, "source");
    const target = join(root, "target");

    runBash(`
      set -euo pipefail
      mkdir -p "${source}/frameworks/category-design/archive/v0.0" "${source}/frameworks/category-design/.notes"
      printf '%s\\n' '---' 'name: positioning' 'description: Positioning skill' 'version: v0.1' '---' > "${source}/SKILL.md"
      printf '%s\\n' '---' 'name: category-design' 'description: Category design framework' 'version: v0.1' '---' > "${source}/frameworks/category-design/SKILL.md"
      printf 'old\\n' > "${source}/frameworks/category-design/archive/v0.0/SKILL.md"
      printf 'keep\\n' > "${source}/frameworks/category-design/.notes/context.md"
      source "${SKILL_LINKS}"
      sync_skill_install "${source}" "${target}"
    `);

    const paths = installedPaths(target);
    expect(paths).toContain("frameworks/category-design/SKILL.md");
    expect(paths).toContain("frameworks/category-design/.notes/context.md");
    expect(paths.some((path) => path.split("/").includes("archive"))).toBe(false);
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
