import { describe, expect, it } from "vitest";
import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT_DIR = resolve(import.meta.dirname, "../..");

const codexSkillFiles = [
  ...globSync("global/codex/*/SKILL.md", { cwd: ROOT_DIR }),
  ...globSync("packs/*/codex/*/SKILL.md", { cwd: ROOT_DIR }),
].map((rel) => resolve(ROOT_DIR, rel));

const oneQuestionCodexSkills = [
  "packs/product-design/codex/spec-interview/SKILL.md",
  "packs/product-design/codex/feature-interview/SKILL.md",
  "global/codex/idea-scope-brief/SKILL.md",
  "packs/product-design/codex/ui-interview/SKILL.md",
  "packs/product-design/codex/ux-variations/SKILL.md",
  "packs/product-design/codex/consolidate-variations/SKILL.md",
  "packs/agent-work-admin/codex/roadmap/SKILL.md",
  "packs/product-design/codex/design-system/SKILL.md",
  "packs/business-discovery/codex/enterprise-icp/SKILL.md",
  "packs/business-growth/codex/gtm/SKILL.md",
  "packs/business-growth/codex/metrics/SKILL.md",
];

const groupedQuestionPhrases = [
  /Ask 1 to 3 focused questions per turn/i,
  /Ask 1-3 focused questions per turn/i,
  /Ask 1–3 focused questions per turn/i,
  /1 to 3 focused questions per turn/i,
  /1-3 focused questions per turn/i,
  /1–3 focused questions per turn/i,
  /1-3 questions per turn/i,
  /1–3 questions per turn/i,
  /request_user_input` for 1-3 focused questions/i,
];

describe("Codex interview cadence", () => {
  it("does not carry Claude AskUserQuestion instructions in Codex skill contracts", () => {
    expect(codexSkillFiles.length).toBeGreaterThan(0);

    for (const filePath of codexSkillFiles) {
      const rel = filePath.replace(ROOT_DIR + "/", "");
      const raw = readFileSync(filePath, "utf8");
      expect(raw, rel).not.toContain("AskUserQuestion");
    }
  });

  for (const rel of oneQuestionCodexSkills) {
    it(`${rel} asks one primary question at a time`, () => {
      const raw = readFileSync(resolve(ROOT_DIR, rel), "utf8");

      expect(raw).toMatch(/one (primary|focused) (decision |interview |confirmation or adjustment )?question per turn|one focused interview question/i);
      expect(raw).toMatch(/not to batch unrelated questions|one category or decision at a time/i);
      for (const phrase of groupedQuestionPhrases) {
        expect(raw).not.toMatch(phrase);
      }
    });
  }
});
