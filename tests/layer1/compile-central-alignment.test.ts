import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = resolve(import.meta.dirname, "../..");

function read(relativePath: string): string {
  return readFileSync(resolve(REPO_ROOT, relativePath), "utf8");
}

const contracts = [
  "packs/alignment-page-admin/claude/compile-central-alignment",
  "packs/alignment-page-admin/codex/compile-central-alignment",
] as const;

describe("compile-central-alignment skill contract", () => {
  it("uses the shared HTML opener for the generated central index", () => {
    for (const skillDir of contracts) {
      const skillPath = `${skillDir}/SKILL.md`;
      const content = read(skillPath);

      expect(content, `${skillPath} opener script`).toContain("scripts/open-html-page.mjs");
      expect(content, `${skillPath} exact index open command`).toContain(
        "node scripts/open-html-page.mjs alignment/index.html --browser auto",
      );
      expect(content, `${skillPath} only opens central index`).toContain(
        "opens or focuses only the central index",
      );
    }
  });

  it("requires stable opener status reporting and treats blocked open as non-fatal", () => {
    for (const skillDir of contracts) {
      const skillPath = `${skillDir}/SKILL.md`;
      const content = read(skillPath);

      for (const status of ["focused", "opened", "fallback-opened", "blocked", "failed"]) {
        expect(content, `${skillPath} status ${status}`).toContain(status);
      }

      expect(content, `${skillPath} blocked non-failure`).toContain(
        "does not fail this skill when `alignment/index.html` was generated and verified",
      );
    }
  });

  it("removes the old WSL-specific opener language from active contracts", () => {
    for (const skillDir of contracts) {
      const skillPath = `${skillDir}/SKILL.md`;
      const content = read(skillPath);

      expect(content, `${skillPath} no wslpath opener`).not.toContain("wslpath -w");
      expect(content, `${skillPath} no cmd.exe opener`).not.toContain("cmd.exe /c start");
      expect(content, `${skillPath} no WSL-aware browser step`).not.toContain("WSL-aware");
    }
  });

  it("keeps the generated index as a local convenience artifact", () => {
    for (const skillDir of contracts) {
      const skillPath = `${skillDir}/SKILL.md`;
      const content = read(skillPath);

      expect(content, `${skillPath} only index mutation`).toContain(
        "only create or overwrite `alignment/index.html`",
      );
      expect(content, `${skillPath} no commit push default`).toContain(
        "Do not commit `alignment/index.html`",
      );
      expect(content, `${skillPath} local artifact`).toContain("local convenience");
    }
  });

  it("has versioned active contracts with v0.0 archives and changelogs", () => {
    for (const skillDir of contracts) {
      const skillPath = `${skillDir}/SKILL.md`;
      const archivePath = `${skillDir}/archive/v0.0/SKILL.md`;
      const changelogPath = `${skillDir}/CHANGELOG.md`;

      expect(read(skillPath), `${skillPath} active version`).toMatch(/^version: v\d+\.\d+$/m);
      expect(existsSync(resolve(REPO_ROOT, archivePath)), `${archivePath} exists`).toBe(true);
      expect(read(archivePath), `${archivePath} archived version`).toMatch(/^version: v0\.0$/m);

      const changelog = read(changelogPath);
      expect(changelog, `${changelogPath} v0.1`).toContain("## v0.1 - 2026-06-05");
      expect(changelog, `${changelogPath} opener behavior`).toContain(
        "node scripts/open-html-page.mjs alignment/index.html --browser auto",
      );
    }
  });
});
