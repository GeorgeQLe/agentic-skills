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
    files: [],
    estimatedCostUsd: 1,
  };
}

function report(failedRuns: BenchReport["failedRuns"]): BenchReport {
  return {
    sessionId: "test",
    skill: "design-system",
    totalRuns: 2,
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
