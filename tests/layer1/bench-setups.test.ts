import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
    const tier1Skills = [
      "run",
      "ship",
      "ship-end",
      "roadmap",
      "plan-phase",
      "feature-interview",
      "spec-interview",
      "investigate",
      "session-triage",
      "targeted-skill-builder",
      "benchmark-test-skill",
    ];

    for (const skill of tier1Skills) {
      const setup = resolveBenchSetup(skill);

      expect(setup?.qualityEvaluator, `${skill} quality evaluator`).toBeDefined();
    }

    expect(resolveBenchSetup("run")?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id)).toEqual(
      expect.arrayContaining([
        "evidence-linked",
        "scope-control",
        "validation-specificity",
        "actionable-next-route",
        "no-fabricated-facts",
      ]),
    );
    expect(resolveBenchSetup("ship")?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id)).toContain(
      "shipping-manifest-completeness",
    );
    expect(resolveBenchSetup("investigate")?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id)).toContain(
      "root-cause-specificity",
    );
    expect(resolveBenchSetup("benchmark-test-skill")?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id)).toContain(
      "benchmark-evidence-reporting",
    );
  });

  it("preserves custom setups that only define hard assertions", () => {
    const rows = benchmarkCoverageMatrix().map((row): BenchCoverageRow => (
      row.skill === "deploy"
        ? { ...row, coverage_status: "generic", blocked_reason: undefined, next_command: undefined }
        : row
    ));
    const setup = resolveBenchTarget("deploy", rows)?.setup;

    expect(setup).toBeDefined();
    expect(setup?.assertResult).toBeTypeOf("function");
    expect(setup?.qualityEvaluator).toBeUndefined();
  });

  it("exposes quality evaluators for design-system and high-signal global setups", () => {
    expect(resolveBenchSetup("design-system")?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id)).toEqual(
      expect.arrayContaining([
        "design-token-facts",
        "stitch-frontmatter-shape",
        "component-token-cross-references",
        "no-fabricated-design-values",
      ]),
    );
    expect(
      CUSTOM_BENCH_SETUPS["design-system-draftstonk"].qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id),
    ).toEqual(
      expect.arrayContaining([
        "draftstonk-token-facts",
        "draftstonk-frontmatter-shape",
        "draftstonk-prose-coverage",
        "no-fabricated-draftstonk-values",
      ]),
    );

    const globalSkills = [
      "affected",
      "brainstorm",
      "debug",
      "expert-review",
      "research-roadmap",
      "slim-audit",
      "spec-drift",
      "trace",
      "ui-interview",
    ];

    for (const skill of globalSkills) {
      expect(resolveBenchSetup(skill)?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id), skill).toEqual(
        expect.arrayContaining([
          "workflow-fixture-facts",
          "workflow-domain-specificity",
          "workflow-next-route",
          "no-generic-or-external-overreach",
        ]),
      );
    }
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

  it("uses agent-specific route assertions for the icon-handler workflow setup", () => {
    const setup = resolveBenchSetup("icon-handler");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "icon-handler-route-"));
    writeFileSync(
      resolve(workDir, "icon-audit.md"),
      [
        "## Icon Audit",
        "",
        "Framework: Next App Router",
        "Source asset: calc-mascot-icon.png",
        "Missing stale favicon.ico and apple-touch-icon surfaces need approval.",
        "",
        "Next command: `/icon-handler fix calc-mascot-icon.png`",
      ].join("\n"),
    );

    const claudeAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["icon-audit.md"],
      },
      { agent: "claude" },
    );
    const codexAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["icon-audit.md"],
      },
      { agent: "codex" },
    );

    expect(claudeAssertions.find((assertion) => assertion.description === "Output recommends /icon-handler")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output recommends $icon-handler")).toMatchObject({
      pass: false,
    });

    writeFileSync(
      resolve(workDir, "icon-audit.md"),
      [
        "## Icon Audit",
        "",
        "Framework: Next App Router",
        "Source asset: calc-mascot-icon.png",
        "Missing stale favicon.ico and apple-touch-icon surfaces need approval.",
        "",
        "Recommended next command: `$icon-handler fix calc-mascot-icon.png`",
      ].join("\n"),
    );

    expect(
      setup!.assertResult(
        {
          stdout: "",
          stderr: "",
          exitCode: 0,
          workDir,
          files: ["icon-audit.md"],
        },
        { agent: "codex" },
      ).find((assertion) => assertion.description === "Output recommends $icon-handler"),
    ).toMatchObject({
      pass: true,
    });

    expect(
      setup!.qualityEvaluator?.evaluate("Next command: /icon-handler").criteria.find((criterion) => criterion.id === "workflow-next-route"),
    ).toMatchObject({
      passed: true,
    });
    expect(
      setup!.qualityEvaluator?.evaluate("Next command: $icon-handler").criteria.find((criterion) => criterion.id === "workflow-next-route"),
    ).toMatchObject({
      passed: true,
    });
  });

  it("uses agent-specific route assertions for the ship workflow setup", () => {
    const setup = resolveBenchSetup("ship");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "ship-route-"));
    writeFileSync(
      resolve(workDir, "ship-manifest.md"),
      [
        "# Ship Manifest",
        "",
        "## User goal",
        "Package the completed fixture step.",
        "",
        "## Changed files",
        "- `tests/example.test.ts`",
        "- `tasks/todo.md`",
        "",
        "## Tests run",
        "Validation passed.",
        "",
        "## Deploy status",
        "Deploy skipped.",
        "",
        "## Rollback note",
        "Revert the fixture changes.",
        "",
        "## Next command",
        "`/run`",
      ].join("\n"),
    );

    const claudeAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["ship-manifest.md"],
      },
      { agent: "claude" },
    );
    const codexAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["ship-manifest.md"],
      },
      { agent: "codex" },
    );

    expect(claudeAssertions.find((assertion) => assertion.description === "Output recommends /run")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output recommends $run")).toMatchObject({
      pass: false,
    });

    writeFileSync(
      resolve(workDir, "ship-manifest.md"),
      [
        "# Ship Manifest",
        "",
        "## User goal",
        "Package the completed fixture step.",
        "",
        "## Changed files",
        "- `tests/example.test.ts`",
        "- `tasks/todo.md`",
        "",
        "## Tests run",
        "Validation passed.",
        "",
        "## Deploy status",
        "Deploy skipped.",
        "",
        "## Rollback note",
        "Revert the fixture changes.",
        "",
        "## Next command",
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
          files: ["ship-manifest.md"],
        },
        { agent: "codex" },
      ).find((assertion) => assertion.description === "Output recommends $run"),
    ).toMatchObject({
      pass: true,
    });
  });

  it("keeps the spec-interview benchmark route aligned with mirrored skill contracts", () => {
    const setup = resolveBenchSetup("spec-interview");
    expect(setup).toBeDefined();

    const codexSkill = readFileSync(resolve(TESTS_ROOT, "../global/codex/spec-interview/SKILL.md"), "utf8");
    const claudeSkill = readFileSync(resolve(TESTS_ROOT, "../global/claude/spec-interview/SKILL.md"), "utf8");

    expect(codexSkill).toContain("Treat `$roadmap` as the default next route after a completed or updated spec");
    expect(claudeSkill).toContain("Treat `/roadmap` as the default next route after a completed or updated spec");

    const workDir = mkdtempSync(resolve(tmpdir(), "spec-interview-route-"));
    mkdirSync(resolve(workDir, "specs"), { recursive: true });
    writeFileSync(
      resolve(workDir, "specs/benchmark-reporting.md"),
      [
        "# Benchmark Reporting",
        "",
        "## Overview",
        "Add benchmark coverage status to reports and list output.",
        "",
        "## Detailed Design",
        "The report and list output share one coverage status model.",
        "",
        "## Test Plan",
        "Validate report and list behavior.",
        "",
        "## Acceptance Criteria",
        "Coverage status appears in both surfaces.",
        "",
        "## Assumptions & Risks",
        "Benchmark coverage status is informational.",
        "",
        "## Next command",
        "`$roadmap`",
      ].join("\n"),
    );

    const assertions = setup!.assertResult({
      stdout: "",
      stderr: "",
      exitCode: 0,
      workDir,
      files: ["specs/benchmark-reporting.md"],
    });

    expect(assertions.find((assertion) => assertion.description === "Output recommends $roadmap")).toMatchObject({
      pass: true,
    });
    expect(assertions.some((assertion) => assertion.description === "Output recommends $plan-phase")).toBe(false);
    const nextRouteCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "actionable-next-route");
    expect(nextRouteCriterion?.evaluate("## Next command\n`$roadmap`")).toMatchObject({
      score: 1,
    });
    expect(nextRouteCriterion?.evaluate("## Next command\n`$plan-phase`")).toMatchObject({
      score: 0,
    });
    expect(setup!.qualityEvaluator?.rubric.criteria.some((criterion) => criterion.id === "file-reference")).toBe(false);
  });

  it("keeps session-triage benchmark routing aligned with the no-skill-change branch", () => {
    const setup = resolveBenchSetup("session-triage");
    expect(setup).toBeDefined();
    expect(setup!.prompt).toContain("write session-triage-report.md in the project root before doing any optional exploration");
    expect(setup!.prompt).toContain("verify that session-triage-report.md exists in the project root");
    expect(setup!.prompt).toContain("If it is missing, create it before responding");
    expect(setup!.prompt).toContain("one-off agent noncompliance with an adequate existing validation rule");
    expect(setup!.prompt).toContain("recommend no skill change");

    const workDir = mkdtempSync(resolve(tmpdir(), "session-triage-route-"));
    writeFileSync(
      resolve(workDir, "session-triage-report.md"),
      [
        "# Session Triage Report",
        "",
        "## Target",
        "",
        "`session-log.md` and `tasks/lessons.md`.",
        "",
        "## Verification verdict",
        "",
        "Partially verified. The log says the agent skipped coverage matrix validation and shipped anyway.",
        "",
        "## Timeline",
        "",
        "The user invoked `$run`, the agent skipped planned validation, and the agent shipped.",
        "",
        "## Root cause",
        "",
        "Agent noncompliance with an adequate contract. `tasks/lessons.md` already says: Run required validation before shipping.",
        "",
        "## Recommended fix",
        "",
        "Do not change a skill for this one-off noncompliance; rerun the missing validation and document the result.",
        "",
        "## Validation plan",
        "",
        "Run the coverage matrix validation and stop if it fails.",
        "",
        "## Next command",
        "",
        "Recommended next skill: none",
      ].join("\n"),
    );

    const assertions = setup!.assertResult({
      stdout: "",
      stderr: "",
      exitCode: 0,
      workDir,
      files: ["session-triage-report.md"],
    });

    expect(assertions.find((assertion) => assertion.description === "Output includes next command handoff")).toMatchObject({
      pass: true,
    });
    expect(assertions.find((assertion) => assertion.description === "session-triage-report.md created in project root")).toMatchObject({
      pass: true,
    });
    expect(assertions.find((assertion) => assertion.description === "Output includes Responsible contract gap")).toMatchObject({
      pass: false,
    });
    expect(assertions.some((assertion) => assertion.description === "Output recommends $targeted-skill-builder")).toBe(false);

    writeFileSync(
      resolve(workDir, "session-triage-report.md"),
      [
        "# Session Triage Report",
        "",
        "## Target",
        "`session-log.md` and `tasks/lessons.md`.",
        "",
        "## User-identified issue",
        "The user says `$run` skipped coverage matrix validation and shipped anyway.",
        "",
        "## Verification verdict",
        "Partially verified. The log says the agent skipped coverage matrix validation and shipped anyway.",
        "",
        "## Timeline",
        "The user invoked `$run`, the agent skipped planned validation, and the agent shipped.",
        "",
        "## Root cause",
        "Agent noncompliance with an adequate existing validation rule.",
        "",
        "## Responsible contract gap",
        "None. `tasks/lessons.md` already says: Run required validation before shipping.",
        "",
        "## Recommended fix",
        "Do not change a skill for this one-off noncompliance; rerun the missing validation and document the result.",
        "",
        "## Validation plan",
        "Run the coverage matrix validation and stop if it fails.",
        "",
        "## Confidence and evidence gaps",
        "The fixture does not include a full `$run` transcript, so no recurrence claim is made.",
        "",
        "## Recommended next skill",
        "Recommended next skill: none",
      ].join("\n"),
    );

    const completeAssertions = setup!.assertResult({
      stdout: "",
      stderr: "",
      exitCode: 0,
      workDir,
      files: ["session-triage-report.md"],
    });
    expect(completeAssertions.every((assertion) => assertion.pass), completeAssertions.map((assertion) => assertion.description)).toBe(true);

    const nextRouteCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "actionable-next-route");
    expect(nextRouteCriterion?.evaluate("## Next command\nRecommended next skill: none")).toMatchObject({
      score: 1,
    });
    expect(nextRouteCriterion?.evaluate("No follow-up required.")).toMatchObject({
      score: 0,
    });

    const overRemediationCriterion = setup!.qualityEvaluator?.rubric.criteria.find(
      (criterion) => criterion.id === "no-over-remediation-route",
    );
    expect(overRemediationCriterion).toBeDefined();
    expect(overRemediationCriterion?.weight).toBeGreaterThanOrEqual(5);
    expect(
      overRemediationCriterion?.evaluate(
        [
          "## Root cause",
          "Agent noncompliance with an adequate contract. The existing rule is already clear.",
          "",
          "## Next command",
          "Recommended next skill: none",
        ].join("\n"),
      ),
    ).toMatchObject({ score: 1 });
    expect(
      overRemediationCriterion?.evaluate(
        [
          "## Root cause",
          "Agent noncompliance with an adequate contract. The existing rule is already clear.",
          "",
          "## Next command",
          "Recommended next command: $targeted-skill-builder run",
        ].join("\n"),
      ),
    ).toMatchObject({ score: 0 });
    expect(
      setup!.qualityEvaluator?.evaluate(
        [
          "## Target",
          "`session-log.md` and `tasks/lessons.md`.",
          "",
          "## Verification verdict",
          "Partially verified. The log confirms the agent skipped coverage matrix validation and shipped anyway.",
          "",
          "## Timeline",
          "The user invoked `$run`, the agent skipped planned validation, and shipped anyway.",
          "",
          "## Root cause",
          "Missing evidence gate in the shipping path. No `/run` skill file was present in scope to confirm whether the contract was silent or ignored.",
          "",
          "## Recommended fix",
          "Add a blocking pre-ship validation gate referencing `tasks/lessons.md`.",
          "",
          "## Validation plan",
          "Run coverage matrix validation before shipping.",
          "",
          "## Next command",
          "Recommended next command: /targeted-skill-builder run",
        ].join("\n"),
      ),
    ).toMatchObject({
      thresholdPassed: false,
      passed: false,
      criticalFailures: expect.arrayContaining(["no-over-remediation-route"]),
    });
    expect(
      overRemediationCriterion?.evaluate(
        [
          "## Root cause",
          "Agent noncompliance with an adequate contract. The existing rule already requires validation before shipping.",
          "",
          "## Recommended fix",
          "Patch `$run` with a new validation evidence gate and update the contract.",
          "",
          "## Next command",
          "Recommended next command: $targeted-skill-builder run validation evidence gate",
        ].join("\n"),
      ),
    ).toMatchObject({ score: 0 });
    expect(
      overRemediationCriterion?.evaluate(
        [
          "## Root cause",
          "Agent noncompliance with an adequate contract. The existing rule already requires validation before shipping.",
          "",
          "## Recommended fix",
          "Treat this as an execution compliance failure. Re-run the missing validation and only consider skill hardening if recurrence evidence appears.",
          "",
          "## Next command",
          "Recommended next command: $run",
        ].join("\n"),
      ),
    ).toMatchObject({ score: 1 });
    expect(
      overRemediationCriterion?.evaluate(
        [
          "## Root cause",
          "The evidence points to one-off agent noncompliance with an existing validation rule.",
          "",
          "## Responsible contract gap",
          "None verified.",
          "",
          "## Recommended fix",
          "No skill change is recommended. Update the active task checklist, not the skill contract, unless additional evidence shows a contract gap.",
          "",
          "## Recommended next skill",
          "none",
        ].join("\n"),
      ),
    ).toMatchObject({ score: 1 });
  });

  it("keeps the benchmark-test-skill setup aligned with report-level route labels", () => {
    const setup = resolveBenchSetup("benchmark-test-skill");
    expect(setup).toBeDefined();

    const codexSkill = readFileSync(
      resolve(TESTS_ROOT, "../packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md"),
      "utf8",
    );
    const claudeSkill = readFileSync(
      resolve(TESTS_ROOT, "../packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md"),
      "utf8",
    );

    expect(codexSkill).toContain("recommended next route, using a literal label");
    expect(codexSkill).toContain("Recommended next skill: $benchmark-agent-review <skill>");
    expect(claudeSkill).toContain("recommended next route, using a literal label");
    expect(claudeSkill).toContain("Recommended next skill: /benchmark-agent-review <skill>");
    expect(setup!.prompt).toContain("literal `Recommended next command:` line");
    expect(setup!.prompt).toContain("structured benchmark report");
    expect(setup!.prompt).toContain("Use only bench-output.txt and verify-output.txt");
    expect(setup!.prompt).toContain("do not search the repository, read extra skill files, or run pnpm");
    expect(setup!.prompt).toContain("`## Verify`, `## Benchmark Metrics`, `## Raw Evidence`, and `## Next Route` sections");
    expect(setup!.prompt).toContain("Markdown tables for the verify and benchmark metrics sections");
    expect(setup!.prompt).toContain("exact evidence from the fixture");
    expect(setup!.prompt).toContain("`layer1 PASS`");
    expect(setup!.prompt).toContain("`layer2 SKIPPED`");
    expect(setup!.prompt).toContain("`passRate=1.0` or `100%`");
    expect(setup!.prompt).toContain("`p50=1200`");
    expect(setup!.prompt).toContain("`totalCost=0.42`");
    expect(setup!.prompt).toContain("literal report path `benchmark/test-run-2026-05-11.md`");
    expect(setup!.prompt).toContain("Claude `/ship`, Codex `$ship`");
    expect(setup!.prompt).toContain("regardless of fixture file names or raw session path text");
    expect(setup!.prompt).not.toContain("run-codex-abc");
    expect(setup!.timeoutMs).toBe(BENCH_TIMEOUTS_MS.standard);

    const workDir = mkdtempSync(resolve(tmpdir(), "benchmark-test-skill-route-"));
    mkdirSync(resolve(workDir, "benchmark"), { recursive: true });
    const reportBody = (route: string) => [
      "# Benchmark Test Run",
      "",
      "## Verify",
      "| Layer | Status | Wall time |",
      "| --- | --- | --- |",
      "| layer1 | layer1 PASS | 7.1s |",
      "| layer2 | layer2 SKIPPED | no tests matched run |",
      "",
      "## Benchmark Metrics",
      "| Metric | Value |",
      "| --- | --- |",
      "| coverage | custom |",
      "| pass rate | passRate=1.0 |",
      "| latency p50 | p50=1200 |",
      "| total cost | totalCost=0.42 |",
      "",
      "## Raw Evidence",
      "Raw session path: `tests/benchmarks/runs/run-agent-abc/report.json`.",
      "Source file names: `bench-output.txt`, `verify-output.txt`.",
      "Report path: `benchmark/test-run-2026-05-11.md`.",
      "",
      "## Next Route",
      "Recommended next command:",
      route,
    ].join("\n");

    writeFileSync(resolve(workDir, "benchmark/test-run-2026-05-11.md"), reportBody("/ship"));
    expect(
      setup!.assertResult(
        {
          stdout: "",
          stderr: "",
          exitCode: 0,
          workDir,
          files: ["benchmark/test-run-2026-05-11.md"],
        },
        { agent: "claude" },
      ).find((assertion) => assertion.description === "Output recommends /ship"),
    ).toMatchObject({
      pass: true,
    });

    writeFileSync(resolve(workDir, "benchmark/test-run-2026-05-11.md"), reportBody("$ship"));
    expect(
      setup!.assertResult(
        {
          stdout: "",
          stderr: "",
          exitCode: 0,
          workDir,
          files: ["benchmark/test-run-2026-05-11.md"],
        },
        { agent: "codex" },
      ).find((assertion) => assertion.description === "Output recommends $ship"),
    ).toMatchObject({
      pass: true,
    });

    const codexAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["benchmark/test-run-2026-05-11.md"],
      },
      { agent: "codex" },
    );
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes layer1 PASS")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes layer2 SKIPPED")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes p50=1200")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes totalCost=0.42")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes ## Verify")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes ## Benchmark Metrics")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes ## Raw Evidence")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes ## Next Route")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output matches workflow expectation")).toMatchObject({
      pass: true,
    });

    writeFileSync(
      resolve(workDir, "benchmark/test-run-2026-05-11.md"),
      [
        "# Benchmark Test Run",
        "",
        "layer1 PASS; layer2 SKIPPED.",
        "passRate=1.0; p50=1200; totalCost=0.42.",
        "Raw session path: tests/benchmarks/runs/run-agent-abc/report.json.",
        "Source file names: bench-output.txt, verify-output.txt.",
        "Report path: benchmark/test-run-2026-05-11.md.",
        "",
        "Recommended next command: $ship",
      ].join("\n"),
    );
    const unstructuredAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["benchmark/test-run-2026-05-11.md"],
      },
      { agent: "codex" },
    );
    expect(unstructuredAssertions.find((assertion) => assertion.description === "Output matches workflow expectation")).toMatchObject({
      pass: false,
    });

    writeFileSync(
      resolve(workDir, "benchmark/test-run-2026-05-11.md"),
      [
        "# Benchmark Test Run",
        "",
        "Verify status: PASS.",
        "Benchmark pass rate: 100%.",
        "Latency and cost recorded.",
        "Raw session path: tests/benchmarks/runs/run-agent-abc/report.json.",
        "Source file names: bench-output.txt, verify-output.txt.",
        "Report path: benchmark/test-run-2026-05-11.md.",
        "",
        "Recommended next command: $ship",
      ].join("\n"),
    );
    const thinAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["benchmark/test-run-2026-05-11.md"],
      },
      { agent: "codex" },
    );
    expect(thinAssertions.find((assertion) => assertion.description === "Output includes layer1 PASS")).toMatchObject({
      pass: false,
    });
    expect(thinAssertions.find((assertion) => assertion.description === "Output includes layer2 SKIPPED")).toMatchObject({
      pass: false,
    });
    expect(thinAssertions.find((assertion) => assertion.description === "Output includes p50=1200")).toMatchObject({
      pass: false,
    });
    expect(thinAssertions.find((assertion) => assertion.description === "Output includes totalCost=0.42")).toMatchObject({
      pass: false,
    });

    const nextRouteCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "actionable-next-route");
    expect(nextRouteCriterion?.evaluate("Recommended next command:\n/ship")).toMatchObject({
      score: 1,
    });
    expect(nextRouteCriterion?.evaluate("Recommended next command:\n$ship")).toMatchObject({
      score: 1,
    });
    expect(nextRouteCriterion?.evaluate("Next: $ship")).toMatchObject({
      score: 0,
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
      "ui-consolidate",
      "ui-interview",
      "ux-variation",
    ];
    const expectedBlockedSkills = [
      "delegate",
      "deploy",
      "install-agentic-skills",
      "patch-exec-profile",
      "release",
      "uat-guide",
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

    const commitPushRow = matrix.find((row) => row.skill === "commit-and-push-by-feature");
    expect(commitPushRow).toMatchObject({
      coverage_status: "custom",
      setup_path: "tests/layer4/setups/git-fixture-commit-and-push.setup.ts",
      agent_scope: "both",
      fixture_type: "git-disposable-repo-fixture",
    });

    const syncRow = matrix.find((row) => row.skill === "sync");
    expect(syncRow).toMatchObject({
      coverage_status: "custom",
      setup_path: "tests/layer4/setups/git-fixture-sync.setup.ts",
      agent_scope: "both",
      fixture_type: "git-disposable-repo-fixture",
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

  it("exposes quality evaluators for representative pack workflow families", () => {
    const representativePackSkills = [
      ["creator-presence-dossier", "creator-media-context"],
      ["assumption-tracker", "business-ops-context"],
      ["game-core-loop", "game-context"],
      ["devtool-workflow", "devtool-context"],
      ["mono-guard", "monorepo-context"],
      ["run-kanban", "kanban-context"],
      ["project-fleet", "project-fleet-context"],
      ["video-script", "remotion-context"],
      ["youtube-video-audit", "youtube-ops-context"],
    ];

    for (const [skill, familyCriterionId] of representativePackSkills) {
      expect(resolveBenchSetup(skill)?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id), skill).toEqual(
        expect.arrayContaining([
          "pack-skill-context",
          "pack-fixture-evidence",
          "pack-practical-risk-or-validation",
          "pack-next-route",
          "no-generic-or-external-pack-overreach",
          familyCriterionId,
        ]),
      );
    }
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
        "## Verify",
        "| Layer | Status | Wall time |",
        "| --- | --- | --- |",
        "| layer1 | layer1 PASS | 7.1s |",
        "| layer2 | layer2 SKIPPED | no tests matched run |",
        "",
        "## Benchmark Metrics",
        "| Metric | Value |",
        "| --- | --- |",
        "| coverage | custom |",
        "| pass rate | passRate=1.0 |",
        "| latency p50 | p50=1200 |",
        "| total cost | totalCost=0.42 |",
        "",
        "## Raw Evidence",
        "raw session path: tests/benchmarks/runs/run-agent-abc/report.json",
        "source files: bench-output.txt and verify-output.txt.",
        "report path: benchmark/test-run-2026-05-11.md.",
        "",
        "## Next Route",
        "Recommended next command: $ship",
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
    expect(setup.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "benchmark/test-run-2026-05-11.md"), "utf8"))).toMatchObject({
      passed: true,
      thresholdPassed: true,
      criticalFailures: [],
    });
  });

  it("rejects benchmark-test-skill reports that preserve facts but drop report structure", () => {
    const setup = CUSTOM_BENCH_SETUPS["benchmark-test-skill"];
    const workDir = mkdtempSync(resolve(tmpdir(), "tier1-benchmark-test-skill-unstructured-"));
    mkdirSync(resolve(workDir, "benchmark"), { recursive: true });
    writeFileSync(
      resolve(workDir, "benchmark/test-run-2026-05-11.md"),
      [
        "# Benchmark run",
        "",
        "layer1 PASS in 7.1s.",
        "layer2 SKIPPED because no tests matched run.",
        "custom coverage passRate=1.0.",
        "latency p50=1200.",
        "totalCost=0.42.",
        "raw session path: tests/benchmarks/runs/run-agent-abc/report.json",
        "source files: bench-output.txt and verify-output.txt.",
        "report path: benchmark/test-run-2026-05-11.md.",
        "Recommended next command: $ship",
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

    expect(assertions.find((assertion) => assertion.description === "Output matches workflow expectation")).toMatchObject({
      pass: false,
    });
  });

  it("rejects benchmark-test-skill reports that keep facts but move metrics out of the metrics table", () => {
    const setup = CUSTOM_BENCH_SETUPS["benchmark-test-skill"];
    const workDir = mkdtempSync(resolve(tmpdir(), "tier1-benchmark-test-skill-malformed-metrics-"));
    mkdirSync(resolve(workDir, "benchmark"), { recursive: true });
    writeFileSync(
      resolve(workDir, "benchmark/test-run-2026-05-11.md"),
      [
        "# Benchmark run",
        "",
        "## Verify",
        "| Layer | Status | Wall time |",
        "| --- | --- | --- |",
        "| layer1 | layer1 PASS | 7.1s |",
        "| layer2 | layer2 SKIPPED | no tests matched run |",
        "",
        "## Benchmark Metrics",
        "| Metric | Value |",
        "| --- | --- |",
        "| coverage | custom |",
        "",
        "The benchmark metrics were passRate=1.0, p50=1200, and totalCost=0.42.",
        "",
        "## Raw Evidence",
        "raw session path: tests/benchmarks/runs/run-agent-abc/report.json",
        "source files: bench-output.txt and verify-output.txt.",
        "report path: benchmark/test-run-2026-05-11.md.",
        "",
        "## Next Route",
        "Recommended next command: $ship",
        "",
      ].join("\n"),
    );

    const report = readFileSync(resolve(workDir, "benchmark/test-run-2026-05-11.md"), "utf8");
    const assertions = setup.assertResult({
      stdout: "",
      stderr: "",
      exitCode: 0,
      workDir,
      files: ["benchmark/test-run-2026-05-11.md"],
    });
    const quality = setup.qualityEvaluator?.evaluate(report);

    expect(assertions.find((assertion) => assertion.description === "Output matches workflow expectation")).toMatchObject({
      pass: false,
    });
    expect(quality?.passed).toBe(false);
    expect(quality?.criticalFailures).toContain("metrics-table-structure");
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

  it("scores pack workflow output quality and rejects generic output", () => {
    const setup = CUSTOM_BENCH_SETUPS["youtube-video-audit"];
    const evaluator = setup.qualityEvaluator;

    expect(evaluator).toBeDefined();

    const strong = evaluator!.evaluate(
      [
        "# youtube-video-audit",
        "",
        "Pack: youtube-ops",
        "Skill: youtube-video-audit",
        "Focus: YouTube single-video audit.",
        "Local-fixture evidence covers Retention notes and Packaging notes from pack-input.md.",
        "Risks: public data may be stale, so validate against local evidence before publishing.",
        "Next command: $run",
        "",
      ].join("\n"),
    );
    const generic = evaluator!.evaluate(
      [
        "# Great Plan",
        "",
        "This is a comprehensive strategy using best practices and industry-leading insights.",
        "It may use Google Analytics and an API dashboard to optimize everything.",
        "Next steps should be considered later.",
        "",
      ].join("\n"),
    );

    expect(strong.passed).toBe(true);
    expect(generic.passed).toBe(false);
    expect(generic.criticalFailures).toEqual(
      expect.arrayContaining(["pack-skill-context", "pack-fixture-evidence", "no-generic-or-external-pack-overreach"]),
    );
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
    expect(assertNextCommand("Recommended next command: $run")).toMatchObject({
      pass: true,
    });
    expect(assertNextCommand("Recommended next skill: $ship")).toMatchObject({
      pass: true,
    });
    expect(assertNextCommand("Next work: none\nRecommended next command: $ship")).toMatchObject({
      pass: true,
    });
    expect(assertNextCommand("Next: keep going")).toMatchObject({
      pass: false,
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
