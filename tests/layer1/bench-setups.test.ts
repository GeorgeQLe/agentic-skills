import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
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

  it("uses custom setup for Tier 1 workflow skills", () => {
    const setup = resolveBenchSetup("run");
    const target = resolveBenchTarget("run");

    expect(setup?.skill).toBe("run");
    expect(setup).toBe(CUSTOM_BENCH_SETUPS.run);
    expect(target).toMatchObject({
      skill: "run",
      coverageStatus: "custom",
      setupPath: "tests/layer4/setups/tier1-workflows.setup.ts",
    });
    expect(target?.setup?.skill).toBe("run");
  });

  it("gives the run workflow enough budget for Claude plan output", () => {
    const setup = resolveBenchSetup("run");

    expect(setup?.perRunBudgetUsd).toBe(BENCH_BUDGETS_USD.standard);
  });

  it("exposes quality evaluators for opted-in custom setups", () => {
    const setup = resolveBenchSetup("run");

    expect(setup?.qualityEvaluator).toBeDefined();
    expect(setup?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id)).toEqual(
      expect.arrayContaining([
        "evidence-linked",
        "scope-control",
        "validation-specificity",
        "actionable-next-route",
        "no-fabricated-facts",
      ]),
    );
  });

  it("preserves custom setups that only define hard assertions", () => {
    const setup = resolveBenchSetup("design-system");

    expect(setup).toBeDefined();
    expect(setup?.assertResult).toBeTypeOf("function");
    expect(setup?.qualityEvaluator).toBeUndefined();
  });

  it("uses agent-specific route assertions for the run workflow setup", () => {
    const setup = resolveBenchSetup("run");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "run-route-"));
    mkdirSync(resolve(workDir, "tasks"), { recursive: true });
    writeFileSync(
      resolve(workDir, "run-plan.md"),
      [
        "# Run Plan",
        "",
        "Step 1.1: Add a deterministic benchmark fixture.",
        "",
        "Validation commands are discovered before execution.",
        "",
        "Shipping note: ship verified changes.",
        "",
        "Next Command",
        "`/ship`",
      ].join("\n"),
    );

    const claudeAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["run-plan.md"],
      },
      { agent: "claude" },
    );
    const codexAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["run-plan.md"],
      },
      { agent: "codex" },
    );

    expect(claudeAssertions.find((assertion) => assertion.description === "Output recommends /ship")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output recommends $run")).toMatchObject({
      pass: false,
    });

    writeFileSync(
      resolve(workDir, "run-plan.md"),
      [
        "# Run Plan",
        "",
        "Step 1.1: Add a deterministic benchmark fixture.",
        "",
        "Validation commands are discovered before execution.",
        "",
        "Shipping note: ship verified changes.",
        "",
        "Next Command",
        "`$run`",
      ].join("\n"),
    );

    expect(
      setup!.assertResult(
        {
          stdout: "",
          stderr: "",
          exitCode: 0,
          workDir,
          files: ["run-plan.md"],
        },
        { agent: "codex" },
      ).find((assertion) => assertion.description === "Output recommends $run"),
    ).toMatchObject({
      pass: true,
    });
  });

  it("uses custom setup for deterministic Tier 2 and Tier 3 global workflows", () => {
    const setup = resolveBenchSetup("affected");
    const target = resolveBenchTarget("affected");

    expect(setup?.skill).toBe("affected");
    expect(setup).toBe(CUSTOM_BENCH_SETUPS.affected);
    expect(target).toMatchObject({
      skill: "affected",
      coverageStatus: "custom",
      setupPath: "tests/layer4/setups/tier23-global-workflows.setup.ts",
    });
  });

  it("uses custom setup for deterministic pack workflows", () => {
    const setup = resolveBenchSetup("assumption-tracker");
    const target = resolveBenchTarget("assumption-tracker");

    expect(setup?.skill).toBe("assumption-tracker");
    expect(setup).toBe(CUSTOM_BENCH_SETUPS["assumption-tracker"]);
    expect(target).toMatchObject({
      skill: "assumption-tracker",
      coverageStatus: "custom",
      setupPath: "tests/layer4/setups/packs/pack-workflows.setup.ts",
    });
    expect(target?.setup?.skill).toBe("assumption-tracker");
  });

  it("keeps the generic smoke setup available for rows without custom assertions", () => {
    const rows = benchmarkCoverageMatrix().map((row): BenchCoverageRow => (
      row.skill === "deploy"
        ? { ...row, coverage_status: "generic", blocked_reason: undefined, next_command: undefined }
        : row
    ));
    const target = resolveBenchTarget("deploy", rows);

    expect(target).toMatchObject({
      skill: "deploy",
      coverageStatus: "generic",
    });
    expect(target?.setup?.skill).toBe("deploy");
    expect(target?.setup).not.toBe(CUSTOM_BENCH_SETUPS.deploy);
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
      coverage_status: "custom",
    });
    expect(supportedBenchSkillRows().find((row) => row.skill === "affected")).toMatchObject({
      coverage_status: "custom",
    });
    expect(supportedBenchSkillRows().find((row) => row.skill === "assumption-tracker")).toMatchObject({
      coverage_status: "custom",
    });
    expect(supportedBenchSkillRows().find((row) => row.skill === "deploy")).toMatchObject({
      coverage_status: "blocked",
    });
  });

  it("prints coverage status in the list-skills CLI", () => {
    const output = execFileSync("pnpm", ["bench", "--list-skills"], {
      cwd: TESTS_ROOT,
      encoding: "utf8",
    });

    expect(output).toContain("design-system\tcoverage=custom setup=tests/layer4/setups/design-system.setup.ts");
    expect(output).toContain("run\tcoverage=custom setup=tests/layer4/setups/tier1-workflows.setup.ts");
    expect(output).toContain("affected\tcoverage=custom setup=tests/layer4/setups/tier23-global-workflows.setup.ts");
    expect(output).toContain("assumption-tracker\tcoverage=custom setup=tests/layer4/setups/packs/pack-workflows.setup.ts");
    expect(output).toContain("deploy\tcoverage=blocked reason=Requires environment-specific deploy credentials");
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
      coverage_status: "custom",
      fixture_type: "execution-plan-fixture",
      priority_tier: 1,
    });
  });

  it("records custom coverage for every Tier 1 workflow setup", () => {
    const matrix = benchmarkCoverageMatrix();
    const tier1Skills = [
      "benchmark-test-skill",
      "feature-interview",
      "investigate",
      "plan-phase",
      "roadmap",
      "run",
      "session-triage",
      "ship",
      "ship-end",
      "spec-interview",
      "targeted-skill-builder",
    ];

    for (const skill of tier1Skills) {
      expect(matrix.find((row) => row.skill === skill)).toMatchObject({
        coverage_status: "custom",
        setup_path: "tests/layer4/setups/tier1-workflows.setup.ts",
        priority_tier: 1,
        agent_scope: "codex",
      });
      expect(resolveBenchSetup(skill)).toBe(CUSTOM_BENCH_SETUPS[skill]);
    }
  });

  it("records custom or blocked coverage for remaining global Tier 2 and Tier 3 skills", () => {
    const matrix = benchmarkCoverageMatrix();
    const expectedCustomSkills = [
      "affected",
      "analyze-sessions",
      "bootstrap-repo",
      "brainstorm",
      "branch-lifecycle",
      "codebase-status",
      "concept-exploration",
      "create-agentic-skill",
      "create-local-skill",
      "dead-code",
      "debug",
      "decommission",
      "dogfood",
      "expert-review",
      "guide",
      "handoff",
      "hygiene",
      "migrate",
      "mono-plan",
      "pack",
      "provision-agentic-config",
      "reconcile-dev-docs",
      "regression-check",
      "research-roadmap",
      "scaffold",
      "skills",
      "slim-audit",
      "spec-drift",
      "trace",
      "uat",
      "ui-interview",
      "ux-variation",
    ];
    const expectedBlockedSkills = [
      "commit-and-push-by-feature",
      "delegate",
      "deploy",
      "install-agentic-skills",
      "patch-exec-profile",
      "release",
      "sync",
      "uat-guide",
      "ui-consolidate",
    ];

    for (const skill of expectedCustomSkills) {
      expect(matrix.find((row) => row.skill === skill)).toMatchObject({
        coverage_status: "custom",
        setup_path: "tests/layer4/setups/tier23-global-workflows.setup.ts",
        agent_scope: "codex",
      });
      expect(resolveBenchSetup(skill)).toBe(CUSTOM_BENCH_SETUPS[skill]);
    }

    for (const skill of expectedBlockedSkills) {
      const target = resolveBenchTarget(skill);
      expect(matrix.find((row) => row.skill === skill)).toMatchObject({
        coverage_status: "blocked",
        agent_scope: "codex",
      });
      expect(target?.coverageStatus).toBe("blocked");
      expect(target?.blockedReason).toBeTruthy();
      expect(target?.nextCommand).toBeTruthy();
      expect(target?.setup).toBeUndefined();
    }
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

  it("records custom coverage for pack skill setups", () => {
    const matrix = benchmarkCoverageMatrix();
    const expectedPackSkills = [
      "assumption-tracker",
      "brainstorm-kanban",
      "competitive-analysis",
      "devtool-workflow",
      "game-core-loop",
      "mono-guard",
      "poketo-kanban",
      "project-fleet",
      "video-script",
      "youtube-video-audit",
    ];

    for (const skill of expectedPackSkills) {
      expect(matrix.find((row) => row.skill === skill)).toMatchObject({
        coverage_status: "custom",
        setup_path: "tests/layer4/setups/packs/pack-workflows.setup.ts",
        agent_scope: "codex",
        fixture_type: "pack-local-fixture",
      });
      expect(resolveBenchSetup(skill)).toBe(CUSTOM_BENCH_SETUPS[skill]);
    }
  });

  it("does not leave pack skill rows on generic coverage", () => {
    const genericPackRows = benchmarkCoverageMatrix().filter((row) => (
      row.coverage_status === "generic"
      && row.source_paths.some((sourcePath) => sourcePath.startsWith("packs/"))
    ));

    expect(genericPackRows).toEqual([]);
  });
});

describe("Tier 1 workflow benchmark setups", () => {
  it("sets up and validates the run workflow artifact", () => {
    const setup = CUSTOM_BENCH_SETUPS.run;
    const workDir = mkdtempSync(resolve(tmpdir(), "tier1-run-"));

    setup.setupProject(workDir);
    writeFileSync(
      resolve(workDir, "run-plan.md"),
      [
        "# Run Plan",
        "",
        "Selected next step: Step 1.1.",
        "Modify tests/example.test.ts for the benchmark fixture.",
        "validation commands cover tests and git diff --check.",
        "shipping note: commit and push after validation.",
        "Next command: $run",
        "",
      ].join("\n"),
    );

    const assertions = setup.assertResult({
      stdout: "",
      stderr: "",
      exitCode: 0,
      workDir,
      files: ["run-plan.md"],
    });

    expect(assertions.every((assertion) => assertion.pass)).toBe(true);
  });

  it("validates benchmark-test-skill report expectations", () => {
    const setup = CUSTOM_BENCH_SETUPS["benchmark-test-skill"];
    const workDir = mkdtempSync(resolve(tmpdir(), "tier1-benchmark-test-skill-"));
    mkdirSync(resolve(workDir, "benchmark"), { recursive: true });
    writeFileSync(
      resolve(workDir, "benchmark/test-run-2026-05-11.md"),
      [
        "# Benchmark run",
        "",
        "verify passed with one layer skip.",
        "custom coverage pass rate: 1.0.",
        "latency p50 was 1200ms.",
        "cost was 0.42.",
        "raw session path: tests/benchmarks/runs/run-codex-abc/report.json",
        "Next command: $ship",
        "",
      ].join("\n"),
    );

    const assertions = setup.assertResult({
      stdout: "",
      stderr: "",
      exitCode: 0,
      workDir,
      files: ["benchmark/test-run-2026-05-11.md"],
    });

    expect(assertions.every((assertion) => assertion.pass)).toBe(true);
  });
});

describe("Tier 2 and Tier 3 global workflow benchmark setups", () => {
  it("sets up and validates the affected workflow artifact", () => {
    const setup = CUSTOM_BENCH_SETUPS.affected;
    const workDir = mkdtempSync(resolve(tmpdir(), "tier23-affected-"));

    setup.setupProject(workDir);
    writeFileSync(
      resolve(workDir, "affected-report.md"),
      [
        "# Affected Report",
        "",
        "changed files: packages/web/src/button.ts and packages/shared/src/tokens.ts.",
        "affected packages: web and shared.",
        "validation commands: pnpm --filter web test and pnpm --filter shared test.",
        "Next command: $run",
        "",
      ].join("\n"),
    );

    const assertions = setup.assertResult({
      stdout: "",
      stderr: "",
      exitCode: 0,
      workDir,
      files: ["affected-report.md"],
    });

    expect(assertions.every((assertion) => assertion.pass)).toBe(true);
  });
});

describe("pack workflow benchmark setups", () => {
  it("sets up and validates a pack workflow artifact", () => {
    const setup = CUSTOM_BENCH_SETUPS["youtube-video-audit"];
    const workDir = mkdtempSync(resolve(tmpdir(), "pack-youtube-video-audit-"));

    setup.setupProject(workDir);
    writeFileSync(
      resolve(workDir, "pack-benchmark-output.md"),
      [
        "# youtube-video-audit",
        "",
        "Pack: youtube-ops",
        "Skill: youtube-video-audit",
        "Local-fixture evidence covers YouTube video audit packaging and retention notes.",
        "Risks: public data may be stale.",
        "Next command: $run",
        "",
      ].join("\n"),
    );

    const assertions = setup.assertResult({
      stdout: "",
      stderr: "",
      exitCode: 0,
      workDir,
      files: ["pack-benchmark-output.md"],
    });

    expect(assertions.every((assertion) => assertion.pass)).toBe(true);
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
