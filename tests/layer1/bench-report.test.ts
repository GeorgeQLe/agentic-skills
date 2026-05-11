import { describe, expect, it } from "vitest";
import { formatMarkdown, summarizeFailedRuns } from "../harness/bench-report.js";
import type { BenchReport, SingleRunResult } from "../harness/bench-types.js";

describe("bench report", () => {
  it("surfaces exit codes and failed assertions for failed runs", () => {
    const runs = [
      run({ index: 0, exitCode: 0, passed: true, failedAssertions: [] }),
      run({
        index: 1,
        exitCode: 143,
        passed: false,
        failedAssertions: ["Interview log created"],
      }),
    ];

    const failedRuns = summarizeFailedRuns(runs);
    expect(failedRuns).toEqual([
      {
        index: 1,
        exitCode: 143,
        failedAssertions: ["Interview log created"],
      },
    ]);

    const markdown = formatMarkdown(report(failedRuns));
    expect(markdown).toContain("## Failed Runs");
    expect(markdown).toContain("| #1 | 143 | Interview log created |");
  });

  it("separates infrastructure-blocked runs from skill pass rate", () => {
    const markdown = formatMarkdown({
      ...report([]),
      totalRuns: 3,
      evaluatedRuns: 1,
      blockedRuns: [{ index: 2, reason: "agent runner rate limit" }],
      passRate: 1,
    });

    expect(markdown).toContain("**100.0%** (1/1 evaluated runs)");
    expect(markdown).toContain("Infrastructure blocked: 1");
    expect(markdown).toContain("| #2 | agent runner rate limit |");
  });

  it("reports output-quality score separately from hard assertion pass rate", () => {
    const markdown = formatMarkdown({
      ...report([]),
      passRate: 1,
      qualitySummary: {
        evaluatedRuns: 2,
        averageScore: 0.775,
        thresholdFailures: 1,
        criticalFailures: 1,
        lowestScoringCriteria: [
          { id: "evidence-linked", averageScore: 0.5 },
          { id: "no-fabrication", averageScore: 0.75 },
        ],
      },
    } as BenchReport);

    expect(markdown).toContain("## Output Quality");
    expect(markdown).toContain("Hard assertion pass rate");
    expect(markdown).toContain("**100.0%** (2/2 evaluated runs)");
    expect(markdown).toContain("Average quality score: **77.5%** (2 evaluated runs)");
    expect(markdown).toContain("Threshold failures: 1");
    expect(markdown).toContain("Critical failures: 1");
    expect(markdown).toContain("| evidence-linked | 50.0% |");
  });

  it("keeps infrastructure-blocked runs out of output-quality statistics", () => {
    const markdown = formatMarkdown({
      ...report([]),
      totalRuns: 3,
      evaluatedRuns: 2,
      blockedRuns: [{ index: 2, reason: "agent runner budget exceeded" }],
      qualitySummary: {
        evaluatedRuns: 2,
        averageScore: 0.9,
        thresholdFailures: 0,
        criticalFailures: 0,
        lowestScoringCriteria: [],
      },
    } as BenchReport);

    expect(markdown).toContain("Average quality score: **90.0%** (2 evaluated runs)");
    expect(markdown).toContain("Infrastructure blocked: 1");
    expect(markdown).not.toContain("3 evaluated runs");
  });
});

function run(opts: {
  index: number;
  exitCode: number;
  passed: boolean;
  failedAssertions: string[];
}): SingleRunResult {
  return {
    index: opts.index,
    startedAt: "2026-05-10T00:00:00.000Z",
    completedAt: "2026-05-10T00:01:00.000Z",
    durationMs: 60_000,
    exitCode: opts.exitCode,
    assertions: opts.failedAssertions.map((description) => ({
      description,
      pass: false,
    })),
    passed: opts.passed,
    stdout: "",
    stderr: "",
    files: [],
    estimatedCostUsd: 1,
  };
}

function report(failedRuns: BenchReport["failedRuns"]): BenchReport {
  return {
    sessionId: "test",
    skill: "design-system",
    agent: "claude",
    totalRuns: 2,
    evaluatedRuns: 2,
    blockedRuns: [],
    passRate: 0.5,
    wilsonLower: 0.1,
    wilsonUpper: 0.9,
    latency: {
      p50: 60_000,
      p95: 60_000,
      p99: 60_000,
    },
    consistency: {
      meanPairwiseSimilarity: 1,
      medoidIndex: 0,
      medoidAvgSimilarity: 1,
      outliers: [],
    },
    totalEstimatedCostUsd: 2,
    failedRuns,
    generatedAt: "2026-05-10T00:00:00.000Z",
  };
}
