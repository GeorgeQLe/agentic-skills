import { describe, expect, it } from "vitest";
import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT_DIR = resolve(import.meta.dirname, "../..");

const skillFiles = [
  ...globSync("global/{claude,codex}/*/SKILL.md", { cwd: ROOT_DIR }),
  ...globSync("packs/*/{claude,codex}/**/SKILL.md", {
    cwd: ROOT_DIR,
    ignore: ["**/archive/**"],
  }),
].map((rel) => resolve(ROOT_DIR, rel));

describe("research skill approval gates", () => {
  const stagedResearchSkills = skillFiles.filter((filePath) => {
    const raw = readFileSync(filePath, "utf-8");
    return raw.includes("## Report-First Approval Gate") || raw.includes("## Staged Research Workflow");
  });

  it("finds staged research/report skills", () => {
    expect(stagedResearchSkills.length).toBeGreaterThan(100);
  });

  for (const filePath of stagedResearchSkills) {
    const rel = filePath.replace(ROOT_DIR + "/", "");

    it(`${rel} requires scope approval before synthesized research`, () => {
      const raw = readFileSync(filePath, "utf-8");

      expect(raw).toContain("## Report-First Approval Gate");
      expect(raw).toMatch(/Default to scope-first approval/i);
      expect(raw).toMatch(/inspect only enough[\s\S]*to propose research scope/i);
      expect(raw).toMatch(/Do not perform synthesized research/i);
      expect(raw).toMatch(/until final compiled YAML approves the research scope/i);
      expect(raw).toMatch(/label it as scope evidence, not findings/i);
      expect(raw).not.toMatch(/Default to report-only: present findings/i);
    });

    it(`${rel} uses scope-first staged working packets before canonical research writes`, () => {
      const raw = readFileSync(filePath, "utf-8");

      expect(raw).toContain("## Staged Research Workflow");
      expect(raw).toContain("1. **Stage 1 - Scope discovery and approval.**");
      expect(raw).toContain("Build the `review` HTML alignment page before synthesized research");
      expect(raw).toContain("Stop for final compiled YAML approval of the research scope");
      expect(raw).toContain("Do not perform synthesized research, rank candidates, make recommendations, or write working packets");
      expect(raw).not.toContain("1. **Stage 1 - Research and clarify.** Perform the research");
      expect(raw).not.toContain("Perform the research, run required source/code checks");
      expect(raw).toContain("`research/_working/preliminary-<skill>-research.md`");
      expect(raw).toContain("`research/{slug}/_working/preliminary-<skill>-research.md`");
      expect(raw).toContain("2. **Stage 2 - Research and artifact review.**");
      expect(raw).toContain("Only after approved research-scope YAML");
      expect(raw).toContain("perform the synthesized research");
      expect(raw).toContain("Update the `review` HTML alignment page");
      expect(raw).toContain("Feedback-only YAML revises the working packet and page, then remains in Stage 2");
      expect(raw).toContain("3. **Stage 3 - Finalize approved artifacts.**");
      expect(raw).toContain("no unresolved `needs-clarification`, unresolved `down` feedback");
      expect(raw).toContain("archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`");
      expect(raw).toContain("remove the active working packet");
      expect(raw).toContain("Canonical output paths remain unchanged");
    });
  }
});
