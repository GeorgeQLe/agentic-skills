import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../..");

interface ShowcaseData {
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
  workflowBenchmarks?: Record<string, {
    workflowKey: string;
    stepsTotal: number;
    stepsBenchmarked: number;
    aggregatePassRate: string | null;
    aggregateQuality: string | null;
    stepBenchmarks: Record<number, {
      skill: string;
      passRate: string | null;
      qualityScore: string | null;
      demo: { prompt: string; output: string; agent: string; runIndex: number } | null;
    }>;
  }>;
}

function loadShowcaseData(): ShowcaseData {
  const content = readFileSync(resolve(repoRoot, "docs/skills-showcase/assets/skills-data.js"), "utf8");
  const json = content.match(/window\.SKILLS_SHOWCASE_DATA = ([\s\S]*);\n$/)?.[1];
  if (!json) throw new Error("skills-data.js did not contain generated showcase data");
  return JSON.parse(json);
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

    expect(contentProgramming?.benchmarkEvidence?.reportPath).toBe("benchmark/test-content-programming-2026-05-21.md");
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
    const shipSkill = data.skills.find((skill) => skill.name === "ship" && skill.platform === "codex");

    // ship has raw run artifacts, so the regenerated showcase carries its
    // benchmark-backed prompt/output demo.
    expect(shipSkill?.benchmarkEvidence?.demo).toBeDefined();
    expect(shipSkill?.benchmarkEvidence?.demo?.prompt).toBeTruthy();
    expect(shipSkill?.benchmarkEvidence?.demo?.output).toBeTruthy();
    expect(shipSkill?.benchmarkEvidence?.demo?.runPath).toContain("ship-codex");
  });
});

describe("workflow benchmark integration", () => {
  const EXPECTED_WORKFLOW_KEYS = ["first", "ship", "spec", "research", "handoff", "validation"];

  it("generates workflowBenchmarks with expected workflow keys", () => {
    const data = loadShowcaseData();
    expect(data.workflowBenchmarks).toBeDefined();
    expect(Object.keys(data.workflowBenchmarks!).sort()).toEqual(EXPECTED_WORKFLOW_KEYS.sort());
  });

  it("step benchmarks reference valid skill names with matching evidence", () => {
    const data = loadShowcaseData();
    const evidenceSkills = new Set(
      data.skills.filter((s) => s.benchmarkEvidence).map((s) => s.name),
    );

    for (const summary of Object.values(data.workflowBenchmarks!)) {
      for (const stepBench of Object.values(summary.stepBenchmarks)) {
        expect(stepBench.skill).toBeTruthy();
        if (stepBench.passRate !== null) {
          expect(evidenceSkills).toContain(stepBench.skill);
        }
      }
    }
  });

  it("computes aggregate pass rate and quality score correctly", () => {
    const data = loadShowcaseData();

    for (const summary of Object.values(data.workflowBenchmarks!)) {
      const benchmarkedSteps = Object.values(summary.stepBenchmarks).filter(
        (sb) => sb.passRate !== null,
      );
      expect(summary.stepsBenchmarked).toBe(benchmarkedSteps.length);

      if (summary.aggregatePassRate) {
        expect(summary.aggregatePassRate).toMatch(/^\d+%$/);
      }
      if (summary.aggregateQuality) {
        expect(summary.aggregateQuality).toMatch(/^\d+(\.\d+)?%$/);
      }
      if (benchmarkedSteps.length === 0) {
        expect(summary.aggregatePassRate).toBeNull();
        expect(summary.aggregateQuality).toBeNull();
      }
    }
  });
});
