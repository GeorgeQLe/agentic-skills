import { describe, it, expect, afterEach } from "vitest";
import { execSync } from "node:child_process";
import { mkdtempSync, existsSync, readFileSync, lstatSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { rmSync } from "node:fs";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const PACK_SCRIPT = join(REPO_ROOT, "scripts/pack.sh");

const tmpDirs: string[] = [];

function expectInstalledSkill(path: string): void {
  const stat = lstatSync(path);
  expect(stat.isDirectory() || stat.isSymbolicLink()).toBe(true);
  expect(existsSync(join(path, "SKILL.md"))).toBe(true);
}

function findSkillFiles(path: string): string[] {
  return execSync(`find "${path}" -name SKILL.md | sort`, {
    encoding: "utf-8",
  })
    .trim()
    .split("\n")
    .filter(Boolean);
}

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
  it("installs alignment-loop pack with valid skill roots", () => {
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
    expect(entries).toContain("taste-calibration");

    for (const entry of entries) {
      expectInstalledSkill(join(claudeSkills, entry));
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

  it("installs and removes an individual pack skill without enabling the whole pack", () => {
    const dir = makeTempProject();
    const installOutput = execSync(`bash "${PACK_SCRIPT}" install design-system`, {
      cwd: dir,
      stdio: "pipe",
      encoding: "utf-8",
    });

    expect(installOutput).toContain("Installed .claude/skills/design-system");
    expect(installOutput).toContain("Installed .codex/skills/design-system");

    const claudeSkill = join(dir, ".claude/skills/design-system");
    const codexSkill = join(dir, ".codex/skills/design-system");
    expectInstalledSkill(claudeSkill);
    expectInstalledSkill(codexSkill);
    expect(existsSync(join(dir, ".claude/skills/feature-interview"))).toBe(false);
    expect(existsSync(join(dir, ".codex/skills/feature-interview"))).toBe(false);

    const projectFile = join(dir, ".agents/project.json");
    const json = JSON.parse(readFileSync(projectFile, "utf-8"));
    expect(json.enabled_packs ?? []).not.toContain("product-design");
    expect(json.enabled_skills).toEqual({ "design-system": "product-design" });

    const whichOutput = execSync(`bash "${PACK_SCRIPT}" which design-system`, {
      cwd: dir,
      stdio: "pipe",
      encoding: "utf-8",
    });
    expect(whichOutput).toContain("individually installed from pack 'product-design'");

    execSync(`bash "${PACK_SCRIPT}" remove design-system`, {
      cwd: dir,
      stdio: "pipe",
    });

    expect(existsSync(claudeSkill)).toBe(false);
    expect(existsSync(codexSkill)).toBe(false);
    const afterRemove = JSON.parse(readFileSync(projectFile, "utf-8"));
    expect(afterRemove.enabled_skills).toBeUndefined();
  });

  it("installs active skills without nested archived SKILL.md files", () => {
    const dir = makeTempProject();
    execSync(`bash "${PACK_SCRIPT}" install analyze-sessions`, {
      cwd: dir,
      stdio: "pipe",
    });

    for (const tool of ["claude", "codex"]) {
      const skillRoot = join(dir, `.${tool}/skills/analyze-sessions`);
      expectInstalledSkill(skillRoot);
      expect(existsSync(join(skillRoot, "archive"))).toBe(false);

      const skillFiles = findSkillFiles(skillRoot);
      expect(skillFiles).toEqual([join(skillRoot, "SKILL.md")]);
    }
  });
});
