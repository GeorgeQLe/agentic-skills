import { describe, it, expect, afterEach } from "vitest";
import { execSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  realpathSync,
  symlinkSync,
  lstatSync,
  existsSync,
  rmSync,
  copyFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..", "..", "..", "..", "..");

const tempDirs = [];

function createTestEnv() {
  const base = realpathSync(mkdtempSync(join(tmpdir(), "install-test-")));
  tempDirs.push(base);
  const fakeHome = join(base, "home");
  const fakeRepo = join(base, "repo");
  mkdirSync(fakeHome, { recursive: true });
  mkdirSync(join(fakeRepo, "scripts"), { recursive: true });
  mkdirSync(join(fakeRepo, "global", "claude", "skill-a"), {
    recursive: true,
  });
  mkdirSync(join(fakeRepo, "global", "codex", "skill-b"), { recursive: true });
  mkdirSync(join(fakeRepo, "packs", "game", "claude", "game-a"), {
    recursive: true,
  });
  writeFileSync(
    join(fakeRepo, "global", "claude", "skill-a", "SKILL.md"),
    "test",
  );
  writeFileSync(
    join(fakeRepo, "global", "codex", "skill-b", "SKILL.md"),
    "test",
  );
  writeFileSync(
    join(fakeRepo, "packs", "game", "claude", "game-a", "SKILL.md"),
    "test",
  );
  copyFileSync(join(REPO_ROOT, "init.sh"), join(fakeRepo, "init.sh"));
  copyFileSync(
    join(REPO_ROOT, "scripts", "skill-links.sh"),
    join(fakeRepo, "scripts", "skill-links.sh"),
  );
  return { base, fakeHome, fakeRepo };
}

function runInstall(fakeHome, fakeRepo, args = "") {
  return execSync(`bash init.sh ${args}`, {
    cwd: fakeRepo,
    env: { ...process.env, HOME: fakeHome },
    encoding: "utf-8",
  });
}

describe("init.sh", () => {
  afterEach(() => {
    for (const dir of tempDirs) {
      rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("creates managed directories for claude skills", () => {
    const { fakeHome, fakeRepo } = createTestEnv();
    runInstall(fakeHome, fakeRepo);
    const skillRoot = join(fakeHome, ".claude", "skills", "skill-a");
    expect(lstatSync(skillRoot).isDirectory()).toBe(true);
    expect(existsSync(join(skillRoot, "SKILL.md"))).toBe(true);
    expect(existsSync(join(skillRoot, ".agentic-skills-managed"))).toBe(true);
  });

  it("creates managed directories for codex skills", () => {
    const { fakeHome, fakeRepo } = createTestEnv();
    runInstall(fakeHome, fakeRepo);
    const skillRoot = join(fakeHome, ".codex", "skills", "skill-b");
    expect(lstatSync(skillRoot).isDirectory()).toBe(true);
    expect(existsSync(join(skillRoot, "SKILL.md"))).toBe(true);
    expect(existsSync(join(skillRoot, ".agentic-skills-managed"))).toBe(true);
  });

  it("does not install domain packs globally", () => {
    const { fakeHome, fakeRepo } = createTestEnv();
    runInstall(fakeHome, fakeRepo);
    expect(existsSync(join(fakeHome, ".claude", "skills", "game-a"))).toBe(
      false,
    );
  });

  it("is idempotent on re-run", () => {
    const { fakeHome, fakeRepo } = createTestEnv();
    runInstall(fakeHome, fakeRepo);
    const output = runInstall(fakeHome, fakeRepo);
    expect(output).toContain("Installed 0 Claude core skills");
    expect(output).toContain("0 Codex core skills");
  });

  it("warns and skips non-repo-managed targets", () => {
    const { fakeHome, fakeRepo } = createTestEnv();
    const target = join(fakeHome, ".claude", "skills", "skill-a");
    mkdirSync(target, { recursive: true });
    writeFileSync(join(target, "file.txt"), "real dir");
    const output = runInstall(fakeHome, fakeRepo);
    expect(output).toContain("WARNING");
    expect(output).toContain("skill-a");
    // The real dir should still exist, not replaced
    expect(lstatSync(target).isSymbolicLink()).toBe(false);
  });

  it("replaces symlinks pointing elsewhere", () => {
    const { base, fakeHome, fakeRepo } = createTestEnv();
    const wrongTarget = join(base, "wrong");
    mkdirSync(wrongTarget, { recursive: true });
    const skillsDir = join(fakeHome, ".claude", "skills");
    mkdirSync(skillsDir, { recursive: true });
    symlinkSync(wrongTarget, join(skillsDir, "skill-a"));
    runInstall(fakeHome, fakeRepo);
    expect(lstatSync(join(skillsDir, "skill-a")).isDirectory()).toBe(true);
    expect(existsSync(join(skillsDir, "skill-a", "SKILL.md"))).toBe(true);
  });

  it("removes stale repo-managed symlinks for removed skills", () => {
    const { fakeHome, fakeRepo } = createTestEnv();
    const skillsDir = join(fakeHome, ".claude", "skills");
    mkdirSync(skillsDir, { recursive: true });
    symlinkSync(
      join(fakeRepo, "global", "claude", "removed-skill"),
      join(skillsDir, "removed-skill"),
    );

    const output = runInstall(fakeHome, fakeRepo);

    expect(output).toContain("Removed stale removed-skill");
    expect(existsSync(join(skillsDir, "removed-skill"))).toBe(false);
  });

  it("uninstall removes only repo-managed skill installs", () => {
    const { base, fakeHome, fakeRepo } = createTestEnv();
    runInstall(fakeHome, fakeRepo);
    // Add an unrelated symlink
    const unrelated = join(base, "unrelated");
    mkdirSync(unrelated, { recursive: true });
    symlinkSync(unrelated, join(fakeHome, ".claude", "skills", "other-skill"));
    runInstall(fakeHome, fakeRepo, "--uninstall");
    // Repo-managed skill root removed
    expect(existsSync(join(fakeHome, ".claude", "skills", "skill-a"))).toBe(
      false,
    );
    // Unrelated symlink preserved
    expect(
      lstatSync(
        join(fakeHome, ".claude", "skills", "other-skill"),
      ).isSymbolicLink(),
    ).toBe(true);
  });

  it("uninstall reports correct count", () => {
    const { fakeHome, fakeRepo } = createTestEnv();
    runInstall(fakeHome, fakeRepo);
    const output = runInstall(fakeHome, fakeRepo, "--uninstall");
    expect(output).toContain("Removed 2 repo-managed skill installs");
  });

  it("creates target directories if missing", () => {
    const { fakeHome, fakeRepo } = createTestEnv();
    // Ensure skills dirs don't exist
    expect(existsSync(join(fakeHome, ".claude", "skills"))).toBe(false);
    expect(existsSync(join(fakeHome, ".codex", "skills"))).toBe(false);
    runInstall(fakeHome, fakeRepo);
    expect(existsSync(join(fakeHome, ".claude", "skills", "skill-a"))).toBe(
      true,
    );
    expect(existsSync(join(fakeHome, ".codex", "skills", "skill-b"))).toBe(
      true,
    );
  });
});
