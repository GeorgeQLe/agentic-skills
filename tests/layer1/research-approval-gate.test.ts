import { describe, expect, it } from "vitest";
import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import matter from "gray-matter";

const ROOT_DIR = resolve(import.meta.dirname, "../..");

const skillFiles = [
  ...globSync("global/{claude,codex}/*/SKILL.md", { cwd: ROOT_DIR }),
  ...globSync("packs/*/{claude,codex}/**/SKILL.md", {
    cwd: ROOT_DIR,
    ignore: ["**/archive/**"],
  }),
].map((rel) => resolve(ROOT_DIR, rel));

describe("research skill approval gates", () => {
  const researchSkills = skillFiles.filter((filePath) => {
    const raw = readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    return data.type === "research";
  });

  it("finds research skills", () => {
    expect(researchSkills.length).toBeGreaterThan(80);
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

    it(`${rel} uses staged working packets before canonical research writes`, () => {
      const raw = readFileSync(filePath, "utf-8");

      expect(raw).toContain("## Staged Research Workflow");
      expect(raw).toContain("1. **Stage 1 - Research and clarify.**");
      expect(raw).toContain("`research/_working/preliminary-<skill>-research.md`");
      expect(raw).toContain("`research/{slug}/_working/preliminary-<skill>-research.md`");
      expect(raw).toContain("Do not create or update canonical research, spec, or task files in Stage 1");
      expect(raw).toContain("2. **Stage 2 - Review alignment.**");
      expect(raw).toContain("build the `review` HTML alignment page");
      expect(raw).toContain("Feedback-only YAML revises the working packet and page, then remains in Stage 2");
      expect(raw).toContain("3. **Stage 3 - Finalize approved artifacts.**");
      expect(raw).toContain("no unresolved `needs-clarification`, unresolved `down` feedback");
      expect(raw).toContain("archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`");
      expect(raw).toContain("remove the active working packet");
      expect(raw).toContain("Canonical output paths remain unchanged");
    });
  }
});
