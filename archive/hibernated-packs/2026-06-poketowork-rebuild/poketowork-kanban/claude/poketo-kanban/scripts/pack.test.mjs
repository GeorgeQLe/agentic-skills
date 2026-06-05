import { describe, it, expect, afterEach } from "vitest";
import { execSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readlinkSync,
  realpathSync,
  existsSync,
  rmSync,
  copyFileSync,
  lstatSync,
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
  const base = realpathSync(mkdtempSync(join(tmpdir(), "pack-test-")));
  tempDirs.push(base);
  const fakeLibrary = join(base, "library");
  const fakeProject = join(base, "project");
  mkdirSync(join(fakeLibrary, "scripts"), { recursive: true });
  mkdirSync(join(fakeLibrary, "packs", "game", "claude", "game-a"), {
    recursive: true,
  });
  mkdirSync(join(fakeLibrary, "packs", "game", "codex", "game-a"), {
    recursive: true,
  });
  mkdirSync(join(fakeLibrary, "packs", "code-quality", "claude", "quality-a"), {
    recursive: true,
  });
  mkdirSync(join(fakeLibrary, "packs", "code-quality", "codex", "quality-a"), {
    recursive: true,
  });
  writeFileSync(
    join(fakeLibrary, "packs", "game", "claude", "game-a", "SKILL.md"),
    "test",
  );
  writeFileSync(
    join(fakeLibrary, "packs", "game", "codex", "game-a", "SKILL.md"),
    "test",
  );
  writeFileSync(
    join(fakeLibrary, "packs", "code-quality", "claude", "quality-a", "SKILL.md"),
    "test",
  );
  writeFileSync(
    join(fakeLibrary, "packs", "code-quality", "codex", "quality-a", "SKILL.md"),
    "test",
  );
  mkdirSync(fakeProject, { recursive: true });
  copyFileSync(join(REPO_ROOT, "scripts", "pack.sh"), join(fakeLibrary, "scripts", "pack.sh"));
  copyFileSync(
    join(REPO_ROOT, "scripts", "skill-links.sh"),
    join(fakeLibrary, "scripts", "skill-links.sh"),
  );
  return { fakeLibrary, fakeProject };
}

function runPack(fakeLibrary, fakeProject, args) {
  return execSync(`${join(fakeLibrary, "scripts", "pack.sh")} ${args}`, {
    cwd: fakeProject,
    encoding: "utf-8",
  });
}

describe("pack.sh", () => {
  afterEach(() => {
    for (const dir of tempDirs) {
      rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("lists available packs", () => {
    const { fakeLibrary, fakeProject } = createTestEnv();
    expect(runPack(fakeLibrary, fakeProject, "list")).toContain("game");
  });

  it("installs project-local claude and codex skill roots", () => {
    const { fakeLibrary, fakeProject } = createTestEnv();
    const output = runPack(fakeLibrary, fakeProject, "install game");
    expect(
      lstatSync(join(fakeProject, ".claude", "skills", "game-a")).isSymbolicLink(),
    ).toBe(true);
    expect(readlinkSync(join(fakeProject, ".claude", "skills", "game-a"))).toBe(
      join(fakeLibrary, "packs", "game", "claude", "game-a"),
    );
    expect(readlinkSync(join(fakeProject, ".codex", "skills", "game-a"))).toBe(
      join(fakeLibrary, "packs", "game", "codex", "game-a"),
    );
    expect(output).toContain("start a fresh CLI session");
  });

  it("writes project designation", () => {
    const { fakeLibrary, fakeProject } = createTestEnv();
    runPack(fakeLibrary, fakeProject, "install game");
    const projectJson = join(fakeProject, ".agents", "project.json");
    expect(existsSync(projectJson)).toBe(true);
    expect(runPack(fakeLibrary, fakeProject, "status")).toContain(
      '"project_type": "game"',
    );
  });

  it("infers a concrete project type for additive packs without a base designation", () => {
    const { fakeLibrary, fakeProject } = createTestEnv();
    runPack(fakeLibrary, fakeProject, "install code-quality");
    const projectJson = join(fakeProject, ".agents", "project.json");
    expect(existsSync(projectJson)).toBe(true);
    expect(runPack(fakeLibrary, fakeProject, "status")).toContain(
      '"project_type": "business-app"',
    );
  });

  it("removes only links for the selected pack", () => {
    const { fakeLibrary, fakeProject } = createTestEnv();
    runPack(fakeLibrary, fakeProject, "install game");
    const output = runPack(fakeLibrary, fakeProject, "remove game");
    expect(existsSync(join(fakeProject, ".claude", "skills", "game-a"))).toBe(
      false,
    );
    expect(existsSync(join(fakeProject, ".codex", "skills", "game-a"))).toBe(
      false,
    );
    expect(output).toContain("start a fresh CLI session");
  });

  it("prints a fresh session notice after refresh", () => {
    const { fakeLibrary, fakeProject } = createTestEnv();
    mkdirSync(join(fakeProject, ".agents"), { recursive: true });
    writeFileSync(
      join(fakeProject, ".agents", "project.json"),
      JSON.stringify({
        project_type: "game",
        enabled_packs: ["game"],
        skill_pack_version: 1,
      }),
    );

    const output = runPack(fakeLibrary, fakeProject, "refresh");

    expect(output).toContain("start a fresh CLI session");
  });
});
