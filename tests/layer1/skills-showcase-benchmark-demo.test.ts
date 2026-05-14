import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../..");

function loadShowcaseData() {
  const content = readFileSync(resolve(repoRoot, "docs/skills-showcase/assets/skills-data.js"), "utf8");
  const json = content.match(/window\.SKILLS_SHOWCASE_DATA = ([\s\S]*);\n$/)?.[1];
  if (!json) throw new Error("skills-data.js did not contain generated showcase data");
  return JSON.parse(json) as {
    skills: Array<{
      name: string;
      platform: string;
      benchmarkEvidence?: {
        reportPath?: string;
        agents: Array<{ agent: string }>;
        quality?: Array<{ agent: string }>;
        subjectiveReview?: {
          reportPath?: string;
          medianScore?: string;
          scoreRange?: string;
          nextCommand?: string;
        };
        demo?: {
          prompt?: string;
          output?: string;
          runPath?: string;
        };
      };
    }>;
  };
}

describe("skills showcase benchmark demos", () => {
  it("publishes the latest icon-handler benchmark evidence when report rows use title-case agents", () => {
    const data = loadShowcaseData();
    const iconHandler = data.skills.find((skill) => skill.name === "icon-handler" && skill.platform === "codex");

    expect(iconHandler?.benchmarkEvidence?.reportPath).toBe("benchmark/test-icon-handler-2026-05-14.md");
    expect(iconHandler?.benchmarkEvidence?.agents.map((agent) => agent.agent)).toEqual(["claude", "codex"]);
    expect(iconHandler?.benchmarkEvidence?.quality?.map((entry) => entry.agent)).toEqual(["claude", "codex"]);
  });

  it("publishes the latest content-programming benchmark and agent-review evidence", () => {
    const data = loadShowcaseData();
    const contentProgramming = data.skills.find(
      (skill) => skill.name === "content-programming" && skill.platform === "codex",
    );

    expect(contentProgramming?.benchmarkEvidence?.reportPath).toBe("benchmark/test-content-programming-2026-05-14.md");
    expect(contentProgramming?.benchmarkEvidence?.agents.map((agent) => agent.agent)).toEqual(["claude", "codex"]);
    expect(contentProgramming?.benchmarkEvidence?.quality?.map((entry) => entry.agent)).toEqual(["claude", "codex"]);
    expect(contentProgramming?.benchmarkEvidence?.subjectiveReview).toMatchObject({
      reportPath: "benchmark/review-content-programming-2026-05-14.md",
      medianScore: "92.0",
      scoreRange: "90-94",
      nextCommand: "$ship",
    });
  });

  it("publishes benchmark-backed prompt and output excerpts when raw run artifacts contain them", () => {
    const data = loadShowcaseData();
    const runSkill = data.skills.find((skill) => skill.name === "run" && skill.platform === "codex");

    expect(runSkill?.benchmarkEvidence?.demo?.prompt).toContain("You have the run skill installed");
    expect(runSkill?.benchmarkEvidence?.demo?.output).toContain("run-plan.md");
    expect(runSkill?.benchmarkEvidence?.demo?.runPath).toMatch(
      /^tests\/benchmarks\/runs\/run-codex-.+\/run-\d{3}\.json$/,
    );
  });
});
