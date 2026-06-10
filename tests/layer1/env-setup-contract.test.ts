import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "../harness/judge.js";

const ROOT = resolve(import.meta.dirname, "../..");

const claudeSkillPath = "packs/repo-maintenance/claude/env-setup/SKILL.md";
const codexSkillPath = "packs/repo-maintenance/codex/env-setup/SKILL.md";
const variantSkillPaths = [claudeSkillPath, codexSkillPath] as const;

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("env-setup secret-safety and scaffolding contract", () => {
  it("ships active claude and codex variants outside archive", () => {
    for (const path of variantSkillPaths) {
      expect(existsSync(resolve(ROOT, path)), `${path} should exist`).toBe(true);
      expect(path).not.toContain("/archive/");
    }
  });

  it("keeps mirror parity on name and version across variants", () => {
    const claudeMeta = parseFrontmatter(resolve(ROOT, claudeSkillPath));
    const codexMeta = parseFrontmatter(resolve(ROOT, codexSkillPath));

    expect(claudeMeta.name).toBe("env-setup");
    expect(codexMeta.name).toBe("env-setup");
    expect(claudeMeta.version).toBe(codexMeta.version);
  });

  it("states the never-read-secret-values contract in both variants", () => {
    for (const path of variantSkillPaths) {
      const content = read(path);

      expect(content, `${path} should prohibit reading secret values`).toContain(
        "Never read, print, echo, or summarize secret **values**",
      );
      expect(content, `${path} should restrict env-file inspection to key names`).toContain(
        "key names only",
      );
      expect(content, `${path} should guard gitignore coverage`).toContain(
        "Never remove an env file from `.gitignore`",
      );
      expect(content, `${path} should forbid committing the env file`).toContain(
        "Never commit the target env file",
      );
    }
  });

  it("states the stub scaffolding contract in both variants", () => {
    for (const path of variantSkillPaths) {
      const content = read(path);

      expect(content, `${path} should discover keys from .env.example`).toContain(".env.example");
      expect(content, `${path} should scaffold missing keys as empty stubs`).toContain("`KEY=` stubs");
      expect(content, `${path} should preserve existing lines`).toContain(
        "Never overwrite, reorder, or rewrite existing lines",
      );
    }
  });

  it("uses claude command syntax in the claude variant and codex syntax in the codex variant", () => {
    const claudeContent = read(claudeSkillPath);
    const codexContent = read(codexSkillPath);

    expect(claudeContent).not.toContain("$env-setup");
    expect(codexContent).toContain("Invoke as `$env-setup`");
  });

  it("ships the codex agents/openai.yaml interface", () => {
    const yamlPath = resolve(ROOT, "packs/repo-maintenance/codex/env-setup/agents/openai.yaml");
    expect(existsSync(yamlPath), "codex env-setup openai.yaml should exist").toBe(true);
  });
});
