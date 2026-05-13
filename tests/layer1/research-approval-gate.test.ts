import { describe, expect, it } from "vitest";
import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import matter from "gray-matter";

const ROOT_DIR = resolve(import.meta.dirname, "../..");

const skillFiles = [
  ...globSync("global/{claude,codex}/*/SKILL.md", { cwd: ROOT_DIR }),
  ...globSync("packs/*/{claude,codex}/*/SKILL.md", { cwd: ROOT_DIR }),
].map((rel) => resolve(ROOT_DIR, rel));

describe("research skill approval gates", () => {
  const researchSkills = skillFiles.filter((filePath) => {
    const raw = readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    return data.type === "research";
  });

  it("finds research skills", () => {
    expect(researchSkills.length).toBeGreaterThan(0);
  });

  for (const filePath of researchSkills) {
    const rel = filePath.replace(ROOT_DIR + "/", "");

    it(`${rel} presents findings for approval before synthesized file writes`, () => {
      const raw = readFileSync(filePath, "utf-8");

      expect(raw).toContain("## Report-First Approval Gate");
      expect(raw).toMatch(/present findings[\s\S]*for user approval/i);
      expect(raw).toMatch(/Do not write or overwrite synthesized deliverables/i);
      expect(raw).toMatch(/until the user explicitly approves/i);
      expect(raw).toMatch(/Raw evidence capture may be persisted before analysis/i);
    });
  }
});
