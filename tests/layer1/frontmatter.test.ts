import { describe, it, expect } from "vitest";
import { globSync } from "glob";
import { resolve } from "node:path";
import { validFrontmatter, parseFrontmatter } from "../harness/judge.js";

const PACKS_DIR = resolve(import.meta.dirname, "../../packs");

const skillFiles = globSync("**/SKILL.md", { cwd: PACKS_DIR }).map((rel) =>
  resolve(PACKS_DIR, rel),
);

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
      expect(meta.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it(`${rel} has non-empty name and description`, () => {
      const meta = parseFrontmatter(filePath);
      expect(meta.name.length).toBeGreaterThan(0);
      expect(meta.description.length).toBeGreaterThan(0);
    });
  }
});
