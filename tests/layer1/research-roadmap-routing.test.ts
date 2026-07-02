import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const mirrors = [
  {
    agent: "codex",
    path: "packs/research-admin/codex/research-roadmap/SKILL.md",
    amendCommand: "$research-amend",
    examples: ["`$customer-discovery`", "`$journey-map`", "`$devtool-user-map`"],
    forbidden: ["`$exec $customer-discovery`", "`$exec --phase`"],
  },
  {
    agent: "claude",
    path: "packs/research-admin/claude/research-roadmap/SKILL.md",
    amendCommand: "/research-amend",
    examples: ["`/customer-discovery`", "`/journey-map`", "`/devtool-user-map`"],
    forbidden: ["`/exec /customer-discovery`", "`/exec --phase`"],
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

    it(`${mirror.path} routes bounded post-canonical corrections to research-amend without replacing systemic reruns`, () => {
      const content = readFileSync(resolve(ROOT, mirror.path), "utf8");

      expect(content).toContain(`queue \`${mirror.amendCommand}\` instead of a full rerun`);
      expect(content).toContain("one missed competitor");
      expect(content).toContain("one corrected source fact");
      expect(content).toContain("Preserve full rerun routing for high-impact or systemic changes");
      expect(content).toContain("changed ICP/category strategy");
      expect(content).toContain("broad source staleness");
      expect(content).toContain("anything that requires re-synthesis");
      expect(content).toContain(`Do not route review-pending Pattern A alignment pages to \`${mirror.amendCommand}\``);
      expect(content).toContain("those pages continue through their approval YAML");
    });
  }
});

describe("Pattern A post-canonical amendment routing docs", () => {
  it("keeps research-amend post-canonical and preserves reruns for systemic drift", () => {
    const loopConvention = readFileSync(resolve(ROOT, "docs/research-session-loop-convention.md"), "utf8");
    const orchestratorConvention = readFileSync(resolve(ROOT, "docs/orchestrator-convention.md"), "utf8");

    for (const content of [loopConvention, orchestratorConvention]) {
      expect(content).toContain("Post-canonical amendment routing");
      expect(content).toContain("bounded low/medium corrections");
      expect(content).toContain("one missed competitor");
      expect(content).toContain("one corrected source fact");
      expect(content).toContain("High-impact or systemic");
      expect(content).toContain("affected framework");
      expect(content).toContain("full Pattern A rerun");
      expect(content).toContain("review");
      expect(content).toContain("YAML");
    }
  });
});
