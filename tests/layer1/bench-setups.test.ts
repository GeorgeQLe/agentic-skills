import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  benchmarkCoverageMatrix,
  discoverRepositorySkills,
  validateBenchmarkCoverage,
  type BenchCoverageRow,
} from "../harness/bench-coverage.js";
import {
  CUSTOM_BENCH_SETUPS,
  resolveBenchSetup,
  resolveBenchTarget,
  supportedBenchSkillRows,
  supportedBenchSkills,
} from "../harness/bench-setups.js";
import { assertFileCreated } from "../layer4/setup-helpers/artifacts.js";
import { BENCH_BUDGETS_USD, BENCH_TIMEOUTS_MS } from "../layer4/setup-helpers/budgets.js";
import {
  assertFrontmatterKeys,
  assertMarkdownHeadings,
  assertTokenCrossReferences,
  parseYamlFrontmatter,
} from "../layer4/setup-helpers/markdown.js";
import {
  assertReportHasEvaluatedRuns,
  assertReportPassRateAtLeast,
  assertReportRecordsFailedAssertions,
} from "../layer4/setup-helpers/reports.js";
import { assertNextCommand, assertRecommendedRoute } from "../layer4/setup-helpers/routing.js";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("benchmark setup registry", () => {
  it("lists repository skills as benchmarkable targets", () => {
    expect(supportedBenchSkills()).toContain("design-system");
    expect(supportedBenchSkills()).toContain("run");
  });

  it("uses custom setup for skills with domain-specific assertions", () => {
    expect(resolveBenchSetup("design-system")).toBe(CUSTOM_BENCH_SETUPS["design-system"]);
    expect(resolveBenchTarget("design-system")).toMatchObject({
      coverageStatus: "custom",
      setupPath: "tests/layer4/setups/design-system.setup.ts",
    });
  });

  it("uses a generic smoke setup for repository skills without custom assertions", () => {
    const setup = resolveBenchSetup("run");
    const target = resolveBenchTarget("run");

    expect(setup?.skill).toBe("run");
    expect(setup).not.toBe(CUSTOM_BENCH_SETUPS.run);
    expect(target).toMatchObject({
      skill: "run",
      coverageStatus: "generic",
    });
    expect(target?.setup?.skill).toBe("run");
  });

  it("does not resolve unknown skills", () => {
    expect(resolveBenchSetup("not-a-real-skill")).toBeUndefined();
    expect(resolveBenchTarget("not-a-real-skill")).toBeUndefined();
  });

  it("resolves blocked coverage rows without a runnable setup", () => {
    const rows = benchmarkCoverageMatrix().map((row): BenchCoverageRow => (
      row.skill === "run"
        ? {
          ...row,
          coverage_status: "blocked",
          blocked_reason: "Requires paid external account",
          next_command: "$guide",
        }
        : row
    ));

    expect(resolveBenchTarget("run", rows)).toMatchObject({
      skill: "run",
      coverageStatus: "blocked",
      blockedReason: "Requires paid external account",
      nextCommand: "$guide",
    });
    expect(resolveBenchTarget("run", rows)?.setup).toBeUndefined();
  });

  it("lists benchmark skills with coverage status", () => {
    expect(supportedBenchSkillRows().find((row) => row.skill === "design-system")).toMatchObject({
      coverage_status: "custom",
    });
    expect(supportedBenchSkillRows().find((row) => row.skill === "run")).toMatchObject({
      coverage_status: "generic",
    });
  });

  it("prints coverage status in the list-skills CLI", () => {
    const output = execFileSync("pnpm", ["bench", "--list-skills"], {
      cwd: TESTS_ROOT,
      encoding: "utf8",
    });

    expect(output).toContain("design-system\tcoverage=custom setup=tests/layer4/setups/design-system.setup.ts");
    expect(output).toContain("run\tcoverage=generic");
  });
});

describe("benchmark coverage matrix", () => {
  it("lists every repository skill", () => {
    const result = validateBenchmarkCoverage();

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("records custom coverage for existing custom setups", () => {
    const matrix = benchmarkCoverageMatrix();

    expect(matrix.find((row) => row.skill === "design-system")).toMatchObject({
      coverage_status: "custom",
      setup_path: "tests/layer4/setups/design-system.setup.ts",
    });
    expect(matrix.find((row) => row.skill === "run")).toMatchObject({
      coverage_status: "generic",
      fixture_type: "generic-smoke",
    });
  });

  it("fails when a repository skill is missing from the matrix", () => {
    const rows = benchmarkCoverageMatrix().filter((row) => row.skill !== "run");
    const result = validateBenchmarkCoverage(rows, discoverRepositorySkills());

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Repository skill "run" is missing from benchmark coverage matrix.');
  });

  it("fails when a custom row points to a missing setup", () => {
    const rows = benchmarkCoverageMatrix().map((row): BenchCoverageRow => (
      row.skill === "design-system"
        ? { ...row, setup_path: "tests/layer4/setups/missing.setup.ts" }
        : row
    ));
    const result = validateBenchmarkCoverage(rows, discoverRepositorySkills());

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      'Custom benchmark coverage row for "design-system" points to missing setup_path: tests/layer4/setups/missing.setup.ts.',
    );
  });

  it("fails when a blocked row lacks a reason and next command", () => {
    const rows = benchmarkCoverageMatrix().map((row): BenchCoverageRow => (
      row.skill === "run"
        ? { ...row, coverage_status: "blocked", blocked_reason: "", next_command: "" }
        : row
    ));
    const result = validateBenchmarkCoverage(rows, discoverRepositorySkills());

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Blocked benchmark coverage row for "run" must include blocked_reason.');
    expect(result.errors).toContain('Blocked benchmark coverage row for "run" must include next_command.');
  });
});

describe("layer4 setup helpers", () => {
  it("asserts generated artifact presence", () => {
    expect(assertFileCreated({
      stdout: "",
      stderr: "",
      exitCode: 0,
      workDir: TESTS_ROOT,
      files: ["DESIGN.md"],
    }, "DESIGN.md")).toMatchObject({
      description: "DESIGN.md created in project root",
      pass: true,
    });
  });

  it("parses YAML frontmatter and Markdown prose headings", () => {
    const parsed = parseYamlFrontmatter([
      "---",
      "colors:",
      "  primary: '#2563EB'",
      "typography:",
      "  sans: Inter",
      "---",
      "",
      "## Colors",
      "## Typography",
    ].join("\n"));

    expect(parsed.assertions.every((assertion) => assertion.pass)).toBe(true);
    expect(assertFrontmatterKeys(parsed.frontmatter, ["colors", "typography"]))
      .toEqual([
        { description: "Has colors section", pass: true },
        { description: "Has typography section", pass: true },
      ]);
    expect(assertMarkdownHeadings(parsed.prose, ["Colors", "Typography"]))
      .toEqual([
        { description: "Has Colors prose section", pass: true },
        { description: "Has Typography prose section", pass: true },
      ]);
  });

  it("asserts token references and next-command routing", () => {
    expect(assertTokenCrossReferences("Use {colors.primary} here")).toMatchObject({
      pass: true,
    });
    expect(assertNextCommand("Next command: $run")).toMatchObject({
      pass: true,
    });
    expect(assertRecommendedRoute("Next command: $run", "$run")).toMatchObject({
      pass: true,
    });
  });

  it("exposes reusable benchmark budget and timeout tiers", () => {
    expect(BENCH_BUDGETS_USD).toMatchObject({
      smoke: 0.25,
      standard: 1.0,
      expanded: 1.5,
    });
    expect(BENCH_TIMEOUTS_MS).toMatchObject({
      smoke: 180_000,
      standard: 300_000,
      focused: 240_000,
    });
  });

  it("asserts benchmark report expectations", () => {
    const report = {
      sessionId: "session-1",
      skill: "design-system",
      agent: "codex" as const,
      totalRuns: 2,
      evaluatedRuns: 2,
      blockedRuns: [],
      passRate: 0.5,
      wilsonLower: 0,
      wilsonUpper: 1,
      latency: {
        p50: 100,
        p95: 100,
        p99: 100,
      },
      consistency: {
        meanPairwiseSimilarity: 1,
        medoidIndex: 0,
        medoidAvgSimilarity: 1,
        outliers: [],
      },
      totalEstimatedCostUsd: 0.1,
      failedRuns: [
        {
          index: 1,
          exitCode: 1,
          failedAssertions: ["DESIGN.md created in project root"],
        },
      ],
      generatedAt: "2026-05-11T00:00:00.000Z",
    };

    expect(assertReportHasEvaluatedRuns(report)).toMatchObject({ pass: true });
    expect(assertReportPassRateAtLeast(report, 0.5)).toMatchObject({ pass: true });
    expect(assertReportRecordsFailedAssertions(report)).toMatchObject({ pass: true });
  });
});
