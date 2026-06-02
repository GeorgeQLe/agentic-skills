import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const mirrors = [
  {
    path: "packs/research-admin/codex/research-roadmap/SKILL.md",
    examples: ["`$icp`", "`$journey-map`", "`$devtool-user-map`"],
    forbidden: ["`$exec $icp`", "`$exec --phase`"],
  },
  {
    path: "packs/research-admin/claude/research-roadmap/SKILL.md",
    examples: ["`/icp`", "`/journey-map`", "`/devtool-user-map`"],
    forbidden: ["`/exec /icp`", "`/exec --phase`"],
  },
];

describe("research-roadmap direct research routing", () => {
  for (const mirror of mirrors) {
    it(`${mirror.path} queues direct skill commands instead of exec wrappers`, () => {
      const content = readFileSync(resolve(ROOT, mirror.path), "utf8");

      expect(content).toContain("Do not run the queued research skills from this skill");
      expect(content).toContain("Queue direct skill commands only");
      expect(content).toContain("the unchecked todo item must name the research or planning skill itself");
      expect(content).toContain("users invoke those research skills directly");
      expect(content).toContain("using the direct skill command written in that item");
      for (const example of mirror.examples) {
        expect(content, `${mirror.path} should include direct example ${example}`).toContain(example);
      }
      for (const forbidden of mirror.forbidden) {
        expect(content, `${mirror.path} should reject wrapper example ${forbidden}`).toContain(forbidden);
      }
    });
  }
});
