import { describe, it, expect } from "vitest";
import { globSync } from "glob";
import { resolve } from "node:path";
import { validFrontmatter, parseFrontmatter } from "../harness/judge.js";

const PACKS_DIR = resolve(import.meta.dirname, "../../packs");
const ROOT_DIR = resolve(import.meta.dirname, "../..");

const skillFiles = globSync("**/SKILL.md", {
  cwd: PACKS_DIR,
  ignore: ["**/archive/**"],
}).map((rel) => resolve(PACKS_DIR, rel));

const activeSkillFiles = [
  ...globSync("base/{claude,codex}/*/SKILL.md", {
    cwd: ROOT_DIR,
    ignore: ["**/archive/**"],
  }),
  ...globSync("packs/{claude,codex}/*/SKILL.md", {
    cwd: ROOT_DIR,
    ignore: ["**/archive/**"],
  }),
  ...globSync("packs/*/{claude,codex}/**/SKILL.md", {
    cwd: ROOT_DIR,
    ignore: ["**/archive/**"],
  }),
].map((rel) => resolve(ROOT_DIR, rel));

describe("SKILL.md frontmatter", () => {
  it("finds at least one SKILL.md file", () => {
    expect(skillFiles.length).toBeGreaterThan(0);
  });

  for (const filePath of skillFiles) {
    const rel = filePath.replace(PACKS_DIR + "/", "");

    it(`${rel} has valid frontmatter`, () => {
      const result = validFrontmatter(filePath);
      expect(result.pass, result.description).toBe(true);
    });

    it(`${rel} has valid version format`, () => {
      const meta = parseFrontmatter(filePath);
      expect(meta.version).toMatch(/^v\d+\.\d+$/);
    });

    it(`${rel} has non-empty name and description`, () => {
      const meta = parseFrontmatter(filePath);
      expect(meta.name.length).toBeGreaterThan(0);
      expect(meta.description.length).toBeGreaterThan(0);
    });
  }

  it("uses context_intake instead of the retired interview_depth key", () => {
    expect(activeSkillFiles.length).toBeGreaterThan(0);

    for (const filePath of activeSkillFiles) {
      const rel = filePath.replace(ROOT_DIR + "/", "");
      const meta = parseFrontmatter(filePath);

      expect(meta, `${rel} retired key`).not.toHaveProperty("interview_depth");
      if (meta.context_intake !== undefined) {
        expect(["deep", "scoped", "artifact_only"], `${rel} context_intake`).toContain(meta.context_intake);
      }
    }
  });

  it("uses valid visual_tier values when declared", () => {
    for (const filePath of activeSkillFiles) {
      const rel = filePath.replace(ROOT_DIR + "/", "");
      const meta = parseFrontmatter(filePath);

      if (meta.visual_tier !== undefined) {
        expect(["document", "visual", "prototype"], `${rel} visual_tier`).toContain(meta.visual_tier);
      }
    }
  });
});
