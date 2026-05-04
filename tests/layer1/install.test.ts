import { describe, it, expect, afterEach } from "vitest";
import { execSync } from "node:child_process";
import { mkdtempSync, existsSync, readFileSync, lstatSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { rmSync } from "node:fs";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const PACK_SCRIPT = join(REPO_ROOT, "scripts/pack.sh");

const tmpDirs: string[] = [];

function makeTempProject(): string {
  const dir = mkdtempSync(join(tmpdir(), "pack-install-test-"));
  execSync("git init", { cwd: dir, stdio: "pipe" });
  tmpDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tmpDirs) {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // best effort
    }
  }
  tmpDirs.length = 0;
});

describe("pack.sh install", () => {
  it("installs alignment-loop pack with correct symlinks", () => {
    const dir = makeTempProject();
    execSync(`bash "${PACK_SCRIPT}" install alignment-loop`, {
      cwd: dir,
      stdio: "pipe",
    });

    const claudeSkills = join(dir, ".claude/skills");
    expect(existsSync(claudeSkills)).toBe(true);

    const entries = readdirSync(claudeSkills);
    expect(entries).toContain("destination-doc");
    expect(entries).toContain("vertical-slice-splitter");
    expect(entries).toContain("grill-me");

    for (const entry of entries) {
      const linkPath = join(claudeSkills, entry);
      expect(lstatSync(linkPath).isSymbolicLink()).toBe(true);
    }
  });

  it("creates valid .agents/project.json", () => {
    const dir = makeTempProject();
    execSync(`bash "${PACK_SCRIPT}" install alignment-loop`, {
      cwd: dir,
      stdio: "pipe",
    });

    const projectFile = join(dir, ".agents/project.json");
    expect(existsSync(projectFile)).toBe(true);

    const json = JSON.parse(readFileSync(projectFile, "utf-8"));
    expect(json.enabled_packs).toContain("alignment-loop");
    expect(json.skill_pack_version).toBe(1);
    expect(json.project_type).toBeTruthy();
  });

  it("is idempotent — running install twice does not break", () => {
    const dir = makeTempProject();
    execSync(`bash "${PACK_SCRIPT}" install alignment-loop`, {
      cwd: dir,
      stdio: "pipe",
    });
    execSync(`bash "${PACK_SCRIPT}" install alignment-loop`, {
      cwd: dir,
      stdio: "pipe",
    });

    const json = JSON.parse(
      readFileSync(join(dir, ".agents/project.json"), "utf-8"),
    );
    const count = json.enabled_packs.filter(
      (p: string) => p === "alignment-loop",
    ).length;
    expect(count).toBe(1);
  });
});
