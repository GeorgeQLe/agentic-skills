import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
import {
  assertNextCommand,
  assertRecommendedExactNextRoute,
  assertRecommendedRoute,
  nextCommandHandoffPattern,
  recommendedExactNextRoutePattern,
  recommendedNextRoutePattern,
} from "../layer4/setup-helpers/routing.js";

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
    expect(resolveBenchSetup("ship")?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id)).toContain(
      "ship-goal-specificity",
    );
    expect(resolveBenchSetup("investigate")?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id)).toContain(
      "root-cause-specificity",
    );
    expect(resolveBenchSetup("investigate")?.qualityEvaluator?.rubric.criteria.map((criterion) => criterion.id)).toContain(
      "clean-shipped-no-ship-end",
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

  it("requires the ship manifest user goal to summarize completed fixture work", () => {
    const evaluator = resolveBenchSetup("ship")?.qualityEvaluator;

    expect(evaluator).toBeDefined();

    const strong = evaluator?.evaluate([
      "# Ship Manifest",
      "## User goal",
      "Wrap up the completed fixture step after validation passed.",
      "## Changed files",
      "- `tests/example.test.ts`",
      "- `tasks/todo.md`",
      "## Tests run",
      "Validation passed for the completed fixture step.",
      "## Deploy status",
      "Deploy not run.",
      "## Rollback note",
      "Revert `tests/example.test.ts` and `tasks/todo.md`.",
      "## Next command",
      "`$run`",
    ].join("\n"));
    const metaGoal = evaluator?.evaluate([
      "# Ship Manifest",
      "## User goal",
      "Record the completed fixture shipping summary from the task and diff summary.",
      "## Changed files",
      "- `tests/example.test.ts`",
      "- `tasks/todo.md`",
      "## Tests run",
      "Validation passed for the completed fixture step.",
      "## Deploy status",
      "Deploy not run.",
      "## Rollback note",
      "Revert `tests/example.test.ts` and `tasks/todo.md`.",
      "## Next command",
      "`$run`",
    ].join("\n"));
    const bulletFieldGoal = evaluator?.evaluate([
      "# Ship Manifest",
      "- **User goal:** Wrap up the completed fixture step and prepare it for shipping.",
      "- **Changed files:**",
      "  - `tests/example.test.ts`",
      "  - `tasks/todo.md`",
      "- **Tests run:** Fixture validation passed (per `tasks/todo.md` Review section); no additional test command executed in this session.",
      "- **Deploy status:** Not deployed. Staging/production deploy was skipped.",
      "- **Rollback note:** Revert the two changed files (`tests/example.test.ts`, `tasks/todo.md`) to their prior commit state to undo this step.",
      "- **Next command:** `/run`",
    ].join("\n"));

    expect(strong?.criteria.find((criterion) => criterion.id === "ship-goal-specificity")).toMatchObject({
      passed: true,
    });
    expect(bulletFieldGoal?.criteria.find((criterion) => criterion.id === "ship-goal-specificity")).toMatchObject({
      passed: true,
    });
    expect(bulletFieldGoal?.criteria.find((criterion) => criterion.id === "scope-control")).toMatchObject({
      passed: true,
    });
    expect(bulletFieldGoal?.criteria.find((criterion) => criterion.id === "no-fabricated-facts")).toMatchObject({
      passed: true,
    });
    expect(metaGoal?.criteria.find((criterion) => criterion.id === "ship-goal-specificity")).toMatchObject({
      passed: false,
    });
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

  it("accepts bold Markdown next-route labels from shipping contracts", () => {
    const slashRoute = "**Recommended next command:** /session-triage";
    const dollarRoute = "- **Recommended next skill:** $targeted-skill-builder analyze-sessions benchmark fixture routing";

    expect(assertNextCommand(slashRoute)).toMatchObject({ pass: true });
    expect(assertNextCommand(dollarRoute)).toMatchObject({ pass: true });
    expect(nextCommandHandoffPattern.test("**Next work:** verify the scoped incident")).toBe(true);
    expect(recommendedNextRoutePattern("/session-triage").test(slashRoute)).toBe(true);
    expect(recommendedNextRoutePattern("$targeted-skill-builder").test(dollarRoute)).toBe(true);
    expect(assertRecommendedExactNextRoute("**Recommended next command:** `$run`", "$run")).toMatchObject({ pass: true });
    expect(recommendedExactNextRoutePattern("$run").test("**Recommended next command:** $run for Codex")).toBe(false);
  });

  it("requires runner-specific final routing and allows fixture-backed package-lock evidence for update-packages", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();
    expect(setup?.perRunBudgetUsd).toBe(BENCH_BUDGETS_USD.standard);

    const reportBody = (route: string) => [
      "# Package Update Plan",
      "",
      "This package-update-plan.md records the update plan.",
      "The source project has package-lock.json and no pnpm-lock.yaml according to package-lock-note.md.",
      "Package-manager migration strategy: migrate to pnpm because no deployment notes require npm.",
      "Package-manager toolchain proof: set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days and age-eligible.",
      "Age-gate config: create `.npmrc` with npm's relative age gate `min-release-age=8` and pnpm coverage `minimum-release-age=11520`.",
      "For modern pnpm project config, also use pnpm `minimumReleaseAge: 11520`.",
      "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
      "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0 because they are inside the 8-day safety window.",
      "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
      "Batch 0 package-manager migration: mutation command `pnpm install`; verification command `test -f pnpm-lock.yaml`; expected proof `packageManager` and `pnpm-lock.yaml`; do not proceed on red.",
      "Batch 1 low-risk zod update: mutation command `pnpm add zod@3.25.76`; verification command `pnpm test`; expected proof selected package version; stop condition routes broad compatibility work to $migrate zod.",
      "Batch 2 React 18 to 19: mutation command `pnpm add react@19.2.0`; verification command `pnpm build`; expected proof focused smoke-test output; stop condition routes broad compatibility work to $migrate react.",
      "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
      "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
      "Stop condition: if React compatibility requires broad source migration, route to $migrate react.",
      "## Verification",
      "",
      "```sh",
      "pnpm install --frozen-lockfile",
      "pnpm run build",
      "pnpm run test",
      "```",
      `Recommended next command: ${route}`,
    ].join("\n\n");

    const codexWorkDir = mkdtempSync(resolve(tmpdir(), "update-packages-codex-route-"));
    writeFileSync(resolve(codexWorkDir, "package-update-plan.md"), reportBody("$run"));

    const claudeWorkDir = mkdtempSync(resolve(tmpdir(), "update-packages-claude-route-"));
    writeFileSync(resolve(claudeWorkDir, "package-update-plan.md"), reportBody("/run"));

    const codexAssertions = setup!.assertResult(
      { stdout: "", stderr: "", exitCode: 0, workDir: codexWorkDir, files: ["package-update-plan.md"] },
      { agent: "codex" },
    );
    const claudeAssertions = setup!.assertResult(
      { stdout: "", stderr: "", exitCode: 0, workDir: claudeWorkDir, files: ["package-update-plan.md"] },
      { agent: "claude" },
    );

    expect(codexAssertions.find((assertion) => assertion.description === "Output includes .npmrc")).toMatchObject({ pass: true });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes min-release-age")).toMatchObject({ pass: true });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes verification command evidence")).toMatchObject({ pass: true });
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes major-upgrade compatibility risk handling")).toMatchObject({ pass: true });
    expect(codexAssertions.find((assertion) => assertion.description === "Output avoids unqualified pnpm@latest")).toMatchObject({ pass: true });
    expect(codexAssertions.find((assertion) => assertion.description === "Output proves selected pnpm toolchain age eligibility")).toMatchObject({ pass: true });
    expect(codexAssertions.find((assertion) => assertion.description === "Output preserves age-gate key semantics")).toMatchObject({ pass: true });
    expect(codexAssertions.find((assertion) => assertion.description === "Output recommends $run")).toMatchObject({ pass: true });
    expect(claudeAssertions.find((assertion) => assertion.description === "Output recommends /run")).toMatchObject({ pass: true });

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(codexWorkDir, "package-update-plan.md"), "utf8"));

    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-artifact-reference")).toMatchObject({ passed: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-output-includes-verification-command-evidence")).toMatchObject({ passed: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-output-includes-major-upgrade-compatibility-risk-handling")).toMatchObject({ passed: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-output-avoids-unqualified-pnpm-latest")).toMatchObject({ passed: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-output-proves-selected-pnpm-toolchain-age-eligibility")).toMatchObject({ passed: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-output-preserves-age-gate-key-semantics")).toMatchObject({ passed: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-next-route")).toMatchObject({ passed: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-targeted-migration-routes")).toMatchObject({ passed: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "no-generic-or-external-overreach")).toMatchObject({ passed: true });
    expect(quality?.criticalFailures).not.toContain("no-generic-or-external-overreach");

    const checklistWorkDir = mkdtempSync(resolve(tmpdir(), "update-packages-verification-checklist-"));
    writeFileSync(
      resolve(checklistWorkDir, "package-update-plan.md"),
      reportBody("$run").replace("## Verification", "## Full Verification Checklist"),
    );
    const checklistAssertions = setup!.assertResult(
      { stdout: "", stderr: "", exitCode: 0, workDir: checklistWorkDir, files: ["package-update-plan.md"] },
      { agent: "codex" },
    );

    expect(checklistAssertions.find((assertion) => assertion.description === "Output includes verification command evidence")).toMatchObject({ pass: true });
  });

  it("rejects update-packages plans without major-upgrade risk handling", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-missing-major-risk-"));
    writeFileSync(
      resolve(workDir, "package-update-plan.md"),
      [
        "# Package Update Plan",
        "This package-update-plan.md records the update plan.",
        "Package-manager migration strategy: migrate to pnpm.",
        "Package-manager toolchain proof: set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days.",
        "Age-gate config: create `.npmrc` with npm's relative age gate `min-release-age=8` and pnpm coverage `minimum-release-age=11520`.",
        "For modern pnpm project config, also use pnpm `minimumReleaseAge: 11520`.",
        "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
        "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
        "Verification commands: pnpm install --frozen-lockfile, pnpm run build, pnpm run test.",
        "Recommended next command: $run",
      ].join("\n\n"),
    );

    const assertions = setup!.assertResult(
      { stdout: "", stderr: "", exitCode: 0, workDir, files: ["package-update-plan.md"] },
      { agent: "codex" },
    );

    expect(assertions.find((assertion) => assertion.description === "Output includes major-upgrade compatibility risk handling")).toMatchObject({ pass: false });

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));

    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-output-includes-major-upgrade-compatibility-risk-handling")).toMatchObject({ passed: false });
    expect(quality?.criticalFailures).toContain("workflow-output-includes-major-upgrade-compatibility-risk-handling");
  });

  it("rejects unqualified pnpm latest in update-packages plans", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const basePlan = [
      "# Package Update Plan",
      "This package-update-plan.md records the update plan.",
      "Package-manager toolchain proof: set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days.",
      "Age-gate config: create `.npmrc` with npm's relative age gate `min-release-age=8` and pnpm coverage `minimum-release-age=11520`.",
      "For modern pnpm project config, also use pnpm `minimumReleaseAge: 11520`.",
      "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
      "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
      "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
      "Batch 0 package-manager migration: mutation command `pnpm install`; verification command `test -f pnpm-lock.yaml`; expected proof `packageManager` and `pnpm-lock.yaml`; do not proceed on red.",
      "Batch 1 low-risk zod update: mutation command `pnpm add zod@3.25.76`; verification command `pnpm test`; expected proof selected package version; stop condition routes broad compatibility work to $migrate zod.",
      "Batch 2 React 18 to 19: mutation command `pnpm add react@19.2.0`; verification command `pnpm build`; expected proof focused smoke-test output; stop condition routes broad compatibility work to $migrate react.",
      "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
      "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
      "Stop condition: if React compatibility requires broad source migration, route to $migrate react.",
      "Verification commands: pnpm install --frozen-lockfile, pnpm run build, pnpm run test.",
      "Recommended next command: $run",
    ];

    const assertPnpmLatest = (line: string) => {
      const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-pnpm-latest-"));
      writeFileSync(resolve(workDir, "package-update-plan.md"), [basePlan[0], line, ...basePlan.slice(1)].join("\n\n"));

      const assertions = setup!.assertResult(
        { stdout: "", stderr: "", exitCode: 0, workDir, files: ["package-update-plan.md"] },
        { agent: "codex" },
      );
      const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));

      return {
        assertion: assertions.find((assertion) => assertion.description === "Output avoids unqualified pnpm@latest"),
        criterion: quality?.criteria.find((criterion) => criterion.id === "workflow-output-avoids-unqualified-pnpm-latest"),
        criticalFailures: quality?.criticalFailures ?? [],
      };
    };

    for (const line of [
      "Use pnpm@10.22.0 from the existing local toolchain; do not use unqualified pnpm@latest.",
      "Pin pnpm@9.15.4; do not use pnpm@latest because it floats past the age gate.",
      "Use pnpm@9.12.0 rather than pnpm@latest.",
      "Never default to pnpm@latest; choose an age-eligible pinned version.",
      "We do **not** use unqualified `pnpm@latest` because pinning is required.",
      "Choose pnpm@9.15.0, not `pnpm@latest`.",
      "pnpm@10.11.0 pinned with npm view evidence (not pnpm@latest).",
      "pnpm@10.11.0 pinned with npm view evidence (not `pnpm@latest`).",
      "### pnpm version selection (no unqualified pnpm@latest)",
      "### pnpm version selection (no unqualified `pnpm@latest`)",
      "Reject `pnpm@latest` — unqualified, unverifiable at lock time.",
    ]) {
      const result = assertPnpmLatest(line);
      expect(result.assertion).toMatchObject({ pass: true });
      expect(result.criterion).toMatchObject({ passed: true });
      expect(result.criticalFailures).not.toContain("workflow-output-avoids-unqualified-pnpm-latest");
    }

    for (const line of [
      "Package-manager migration strategy: migrate to pnpm using pnpm@latest.",
      "corepack prepare pnpm@latest --activate",
      'Add packageManager: "pnpm@latest" to package.json.',
    ]) {
      const result = assertPnpmLatest(line);
      expect(result.assertion).toMatchObject({ pass: false });
      expect(result.criterion).toMatchObject({ passed: false });
      expect(result.criticalFailures).toContain("workflow-output-avoids-unqualified-pnpm-latest");
    }
  });

  it("accepts retained update-packages parenthetical pnpm latest warning", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-retained-pnpm-latest-"));
    const retainedPlan = [
      "# Package Update Plan",
      "This package-update-plan.md records the npm to pnpm migration.",
      "Age gate: only versions older than 8 days are eligible.",
      "Wrote package-update-plan.md with pnpm@10.11.0 pinned with `npm view` evidence (not `pnpm@latest`).",
      "### pnpm version selection (no unqualified `pnpm@latest`)",
      "Chosen: pnpm 10.11.0.",
      "Set `packageManager` to `pnpm@10.11.0`.",
      "npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z.",
      "That is older than 8 days, so it is age-eligible.",
      "Skip pnpm@10.22.0 because 2026-05-16 is inside the age gate.",
      "Age-gate config: create `.npmrc` with npm's relative age gate `min-release-age=8` and pnpm coverage `minimum-release-age=11520`.",
      "For modern pnpm project config, also use pnpm `minimumReleaseAge: 11520`.",
      "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
      "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
      "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
      "Batch 0 package-manager migration: mutation command `pnpm install`; verification command `test -f pnpm-lock.yaml`; expected proof `packageManager` and `pnpm-lock.yaml`; do not proceed on red.",
      "Batch 1 low-risk zod update: mutation command `pnpm add zod@3.25.76`; verification command `pnpm test`; expected proof selected package version; stop condition routes broad compatibility work to $migrate zod.",
      "Batch 2 React 18 to 19: mutation command `pnpm add react@19.2.0`; verification command `pnpm build`; expected proof focused smoke-test output; stop condition routes broad compatibility work to $migrate react.",
      "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
      "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
      "Stop condition: if React compatibility requires broad source migration, route to $migrate react.",
      "Verification commands: pnpm install --frozen-lockfile, pnpm run build, pnpm run test.",
      "Recommended next command: $run",
    ].join("\n\n");
    writeFileSync(resolve(workDir, "package-update-plan.md"), retainedPlan);

    const assertions = setup!.assertResult(
      { stdout: "", stderr: "", exitCode: 0, workDir, files: ["package-update-plan.md"] },
      { agent: "codex" },
    );
    const quality = setup!.qualityEvaluator?.evaluate(retainedPlan);

    expect(assertions.find((assertion) => assertion.description === "Output avoids unqualified pnpm@latest")).toMatchObject({ pass: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-output-avoids-unqualified-pnpm-latest")).toMatchObject({ passed: true });
    expect(quality?.criticalFailures).not.toContain("workflow-output-avoids-unqualified-pnpm-latest");
  });

  it("credits retained update-packages artifact-reference and actionability shapes", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const evaluateQuality = (body: string) => {
      const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-artifact-quality-"));
      writeFileSync(resolve(workDir, "package-update-plan.md"), body);
      return setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));
    };

    const retainedHeadingShape = evaluateQuality([
      "# Package Update Plan",
      "Today: 2026-05-18. Age gate: only versions older than 8 days are eligible.",
      "Package-manager migration strategy: migrate to pnpm because no deployment notes require npm.",
      "Set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z.",
      "Age-gate config: create `.npmrc` with npm's relative age gate `min-release-age=8` and pnpm coverage `minimum-release-age=11520`.",
      "For modern pnpm project config, also use pnpm `minimumReleaseAge: 11520`.",
      "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
      "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
      "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
      "Batch 0 package-manager migration: mutation command `pnpm install`; verification command `test -f pnpm-lock.yaml`; expected proof `packageManager` and `pnpm-lock.yaml`; do not proceed on red.",
      "Batch 1 low-risk zod update: mutation command `pnpm add zod@3.25.76`; verification command `pnpm test`; expected proof selected package version; stop condition routes broad compatibility work to $migrate zod.",
      "Batch 2 React 18 to 19: mutation command `pnpm add react@19.2.0`; verification command `pnpm build`; expected proof focused smoke-test output; stop condition routes broad compatibility work to $migrate react.",
      "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
      "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
      "Stop condition: if React compatibility requires broad source migration, route to $migrate react.",
      "## Verification commands",
      "pnpm install --frozen-lockfile",
      "pnpm run build",
      "pnpm run test",
      "Recommended next command: /run",
    ].join("\n\n"));

    expect(retainedHeadingShape?.criteria.find((criterion) => criterion.id === "workflow-artifact-reference")).toMatchObject({ passed: true });
    expect(retainedHeadingShape?.criteria.find((criterion) => criterion.id === "workflow-actionability")).toMatchObject({ passed: true });
    expect(retainedHeadingShape?.criteria.find((criterion) => criterion.id === "workflow-targeted-migration-routes")).toMatchObject({ passed: true });

    const retainedFilenameShape = evaluateQuality([
      "# package-update-plan.md",
      "Plan dependency updates using only versions published older than 8 days.",
      "Package-manager migration strategy: migrate to pnpm and set packageManager to pnpm@10.11.0.",
      "Retained publish-time evidence: npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z.",
      "Age-gate config: `.npmrc` keeps npm's relative guard `min-release-age=8`; pnpm coverage uses `minimum-release-age=11520`, and pnpm project config uses `minimumReleaseAge: 11520` when required.",
      "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
      "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
      "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
      "Batch 0 package-manager migration: mutation command `pnpm install`; verification command `test -f pnpm-lock.yaml`; expected proof `packageManager` and `pnpm-lock.yaml`; do not proceed on red.",
      "Batch 1 low-risk zod update: mutation command `pnpm add zod@3.25.76`; verification command `pnpm test`; expected proof selected package version; stop condition routes broad compatibility work to $migrate zod.",
      "Batch 2 React 18 to 19: mutation command `pnpm add react@19.2.0`; verification command `pnpm build`; expected proof focused smoke-test output; stop condition routes broad compatibility work to $migrate react.",
      "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
      "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
      "Stop condition: if React compatibility requires broad source migration, route to $migrate react.",
      "Recommended next command: $run",
    ].join("\n\n"));

    expect(retainedFilenameShape?.criteria.find((criterion) => criterion.id === "workflow-artifact-reference")).toMatchObject({ passed: true });
    expect(retainedFilenameShape?.criteria.find((criterion) => criterion.id === "workflow-actionability")).toMatchObject({ passed: true });
    expect(retainedFilenameShape?.criteria.find((criterion) => criterion.id === "workflow-targeted-migration-routes")).toMatchObject({ passed: true });

    const retainedLetteredBatchShape = evaluateQuality([
      "# Package Update Plan",
      "This package-update-plan.md records the update plan.",
      "Package-manager migration strategy: migrate to pnpm and set packageManager to pnpm@10.11.0.",
      "Retained publish-time evidence: npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days.",
      "Age-gate config: `.npmrc` keeps npm's relative guard `min-release-age=8`; pnpm coverage uses `minimum-release-age=11520`, and pnpm project config uses `minimumReleaseAge: 11520` when required.",
      "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
      "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
      "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
      "Batch A package-manager migration: implementation command `pnpm install`; verification command `test -f pnpm-lock.yaml`; expected proof `packageManager` and `pnpm-lock.yaml`; do not proceed on red.",
      "Batch B low-risk zod update: mutation command `pnpm add zod@3.25.76`; verification command `pnpm test`; expected proof selected package version; stop condition routes broad compatibility work to $migrate zod.",
      "Batch C React 18 to 19: mutation command `pnpm add react@19.2.0`; verification command `pnpm build`; expected proof focused smoke-test output; stop condition routes broad compatibility work to $migrate react.",
      "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
      "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
      "Recommended next command: $run",
    ].join("\n\n"));

    expect(retainedLetteredBatchShape?.criteria.find((criterion) => criterion.id === "workflow-actionability")).toMatchObject({ passed: true });
    expect(retainedLetteredBatchShape?.criteria.find((criterion) => criterion.id === "workflow-targeted-migration-routes")).toMatchObject({ passed: true });

    const retainedOneBasedBatchShape = evaluateQuality([
      "# Package Update Plan",
      "This package-update-plan.md records the update plan.",
      "Package-manager migration strategy: migrate to pnpm and set packageManager to pnpm@10.11.0.",
      "Retained publish-time evidence: npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days.",
      "Age-gate config: `.npmrc` keeps npm's relative guard `min-release-age=8`; pnpm coverage uses `minimum-release-age=11520`, and pnpm project config uses `minimumReleaseAge: 11520` when required.",
      "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
      "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
      "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
      "Batch 1 package-manager migration: exact command `pnpm install`; verification command `test -f pnpm-lock.yaml`; do not proceed on red.",
      "Batch 2 zod update: mutation command `pnpm add zod@3.25.76`; verification command `pnpm test`; expected proof selected package version; stop condition routes broad compatibility work to $migrate zod.",
      "Batch 3 Vitest 1 to 3: mutation command `pnpm add -D vitest@3.2.4`; verification command `pnpm test`; expected artifact focused smoke-test output; stop condition routes broad compatibility work to $migrate vitest.",
      "Batch 4 React 18 to 19: mutation command `pnpm add react@19.2.0`; verification command `pnpm build`; expected proof focused smoke-test output; stop condition routes broad compatibility work to $migrate react.",
      "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
      "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
      "Recommended next command: $run",
    ].join("\n\n"));

    expect(retainedOneBasedBatchShape?.criteria.find((criterion) => criterion.id === "workflow-actionability")).toMatchObject({ passed: true });
    expect(retainedOneBasedBatchShape?.criteria.find((criterion) => criterion.id === "workflow-targeted-migration-routes")).toMatchObject({ passed: true });
  });

  it("rejects update-packages quality without artifact naming or actionable validation evidence", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-missing-artifact-actionability-"));
    writeFileSync(
      resolve(workDir, "package-update-plan.md"),
      [
        "# Dependency Update Notes",
        "Use pnpm and only versions older than 8 days.",
        "Set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z.",
        "Age-gate config: `.npmrc` keeps npm's relative guard `min-release-age=8`; pnpm coverage uses `minimum-release-age=11520`, and pnpm project config uses `minimumReleaseAge: 11520` when required.",
        "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
        "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
        "Recommended next command: $run",
      ].join("\n\n"),
    );

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));

    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-artifact-reference")).toMatchObject({ passed: false });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-actionability")).toMatchObject({ passed: false });
    expect(quality?.criticalFailures).toContain("workflow-actionability");
  });

  it("marks retained update-packages actionability failures as critical quality failures", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-retained-actionability-failure-"));
    writeFileSync(
      resolve(workDir, "package-update-plan.md"),
      [
        "# Package Update Plan",
        "This package-update-plan.md records the update plan.",
        "Package-manager migration strategy: migrate to pnpm because no deployment notes require npm.",
        "Set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days.",
        "Age-gate config: create `.npmrc` with npm's relative age gate `min-release-age=8` and pnpm coverage `minimum-release-age=11520`.",
        "For modern pnpm project config, also use pnpm `minimumReleaseAge: 11520`.",
        "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
        "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
        "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
        "### Batch Order",
        "1. Batch A: bump zod to 3.25.76 and verify build plus tests still pass.",
        "2. Batch B: bump Vitest 1 to 3 and review config.",
        "3. Batch C: bump React 18 to 19 and review peers.",
        "### Stop Condition",
        "If any batch surfaces broad compatibility breakage, stop and route to /migrate.",
        "## Verification Commands",
        "pnpm install --frozen-lockfile",
        "pnpm test",
        "pnpm build",
        "Recommended next command: /run",
      ].join("\n\n"),
    );

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));

    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-actionability")).toMatchObject({ passed: false });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-targeted-migration-routes")).toMatchObject({ passed: false });
    expect(quality?.criticalFailures).toContain("workflow-actionability");
    expect(quality?.passed).toBe(false);
    expect(quality?.score).toBeLessThan(0.95);
  });

  it("reduces update-packages quality for bare migrate routes when a target is known", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-generic-migrate-route-"));
    writeFileSync(
      resolve(workDir, "package-update-plan.md"),
      [
        "# Package Update Plan",
        "This package-update-plan.md records the update plan.",
        "Package-manager migration strategy: migrate to pnpm.",
        "Package-manager toolchain proof: set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days.",
        "Age-gate config: create `.npmrc` with npm's relative age gate `min-release-age=8` and pnpm coverage `minimum-release-age=11520`.",
        "For modern pnpm project config, also use pnpm `minimumReleaseAge: 11520`.",
        "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
        "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
        "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
        "Batch 0 package-manager migration: mutation command `pnpm install`; verification command `test -f pnpm-lock.yaml`; expected proof `packageManager` and `pnpm-lock.yaml`; do not proceed on red.",
        "Batch 1 low-risk zod update: mutation command `pnpm add zod@3.25.76`; verification command `pnpm test`; expected proof selected package version; stop condition routes broad compatibility work to /migrate.",
        "Batch 2 React 18 to 19: mutation command `pnpm add react@19.2.0`; verification command `pnpm build`; expected proof focused smoke-test output; stop condition routes broad compatibility work to /migrate.",
        "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
        "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
        "Verification commands: pnpm install --frozen-lockfile, pnpm run build, pnpm run test.",
        "Recommended next command: /run",
      ].join("\n\n"),
    );

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));

    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-actionability")).toMatchObject({ passed: true });
    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-targeted-migration-routes")).toMatchObject({ passed: false });
  });

  it("rejects update-packages plans without per-batch commands, proof, and stop gates", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-missing-batch-actionability-"));
    writeFileSync(
      resolve(workDir, "package-update-plan.md"),
      [
        "# Package Update Plan",
        "This package-update-plan.md records the update plan.",
        "Package-manager migration strategy: migrate to pnpm.",
        "Package-manager toolchain proof: set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days.",
        "Age-gate config: create `.npmrc` with npm's relative age gate `min-release-age=8` and pnpm coverage `minimum-release-age=11520`.",
        "For modern pnpm project config, also use pnpm `minimumReleaseAge: 11520`.",
        "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
        "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
        "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
        "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
        "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
        "Stop condition: if React compatibility requires broad source migration, route to $migrate react.",
        "Verification commands: pnpm install, pnpm test, pnpm build.",
        "Recommended next command: $run",
      ].join("\n\n"),
    );

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));

    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-actionability")).toMatchObject({ passed: false });
  });

  it("scores update-packages pnpm toolchain proof and age-gate semantics", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const basePlan = [
      "# Package Update Plan",
      "This package-update-plan.md records the update plan.",
      "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
      "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
      "Major-upgrade risk handling: React 18 to 19 and Vitest 1 to 3 move in separate batches.",
      "Compatibility checks: verify React renderer/framework peer compatibility and Vitest/Vite/TypeScript config compatibility.",
      "Focused smoke checks: run the primary React render smoke test and Vitest config smoke test.",
      "Stop condition: if React compatibility requires broad source migration, route to $migrate react.",
      "Verification commands: pnpm install --frozen-lockfile, pnpm run build, pnpm run test.",
      "Recommended next command: $run",
    ];

    const evaluatePlan = (lines: string[]) => {
      const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-pnpm-proof-"));
      writeFileSync(resolve(workDir, "package-update-plan.md"), lines.join("\n\n"));
      const assertions = setup!.assertResult(
        { stdout: "", stderr: "", exitCode: 0, workDir, files: ["package-update-plan.md"] },
        { agent: "codex" },
      );
      const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));

      return { assertions, quality };
    };

    const passing = evaluatePlan([
      ...basePlan.slice(0, 2),
      "Package-manager toolchain proof: set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days and age-eligible.",
      "Age-gate config: `.npmrc` keeps npm's relative guard `min-release-age=8`; pnpm coverage uses `minimum-release-age=11520`, and pnpm project config uses `minimumReleaseAge: 11520` when required.",
      ...basePlan.slice(2),
    ]);

    expect(passing.assertions.find((assertion) => assertion.description === "Output proves selected pnpm toolchain age eligibility")).toMatchObject({ pass: true });
    expect(passing.assertions.find((assertion) => assertion.description === "Output preserves age-gate key semantics")).toMatchObject({ pass: true });
    expect(passing.quality?.criteria.find((criterion) => criterion.id === "workflow-output-proves-selected-pnpm-toolchain-age-eligibility")).toMatchObject({ passed: true });
    expect(passing.quality?.criteria.find((criterion) => criterion.id === "workflow-output-preserves-age-gate-key-semantics")).toMatchObject({ passed: true });

    const retainedClaudeShape = evaluatePlan([
      ...basePlan.slice(0, 2),
      "Chosen pnpm version: 10.11.0 (published 2026-05-01, 16 days old - age-eligible).",
      "Retained publish-time evidence (from `npm view pnpm@10.11.0 time.version`): `2026-05-01T12:00:00.000Z`.",
      "Migration steps: add `\"packageManager\": \"pnpm@10.11.0\"` to `package.json`.",
      "Ownership: `min-release-age=8` - npm's relative age gate (days). `minimum-release-age=11520` (`.npmrc`) and `minimumReleaseAge: 11520` (`package.json#pnpm`) - pnpm coverage where supported.",
      ...basePlan.slice(2),
    ]);

    expect(retainedClaudeShape.assertions.find((assertion) => assertion.description === "Output proves selected pnpm toolchain age eligibility")).toMatchObject({ pass: true });
    expect(retainedClaudeShape.assertions.find((assertion) => assertion.description === "Output preserves age-gate key semantics")).toMatchObject({ pass: true });
    expect(retainedClaudeShape.quality?.criteria.find((criterion) => criterion.id === "workflow-output-proves-selected-pnpm-toolchain-age-eligibility")).toMatchObject({ passed: true });
    expect(retainedClaudeShape.quality?.criteria.find((criterion) => criterion.id === "workflow-output-preserves-age-gate-key-semantics")).toMatchObject({ passed: true });

    const retainedCodexShape = evaluatePlan([
      ...basePlan.slice(0, 2),
      "Recommended `packageManager`: `pnpm@10.11.0`.",
      "Retained publish-time evidence from `npm-view-times.json`: `pnpm@10.11.0` published `2026-05-01T12:00:00.000Z`, which is older than 8 days for this fixture.",
      "Create or update project-root `.npmrc` with:\n\n```ini\nmin-release-age=8\nminimum-release-age=11520\n```",
      "Ownership:\n\n- `min-release-age=8` is npm's relative age gate.\n- `minimum-release-age=11520` is pnpm coverage in `.npmrc` where supported.\n- `minimumReleaseAge: 11520` is pnpm project config coverage where supported, for example in `pnpm-workspace.yaml`.",
      ...basePlan.slice(2),
    ]);

    expect(retainedCodexShape.assertions.find((assertion) => assertion.description === "Output proves selected pnpm toolchain age eligibility")).toMatchObject({ pass: true });
    expect(retainedCodexShape.assertions.find((assertion) => assertion.description === "Output preserves age-gate key semantics")).toMatchObject({ pass: true });
    expect(retainedCodexShape.quality?.criteria.find((criterion) => criterion.id === "workflow-output-proves-selected-pnpm-toolchain-age-eligibility")).toMatchObject({ passed: true });
    expect(retainedCodexShape.quality?.criteria.find((criterion) => criterion.id === "workflow-output-preserves-age-gate-key-semantics")).toMatchObject({ passed: true });

    const retainedProofListShape = evaluatePlan([
      ...basePlan.slice(0, 2),
      "Recommended `packageManager`: `pnpm@10.11.0`.",
      "Publish-time proof retained in `npm-view-times.json`:\n\n- `pnpm@10.11.0`: 2026-05-01T12:00:00.000Z, eligible because it is older than 8 days.\n- `pnpm@10.22.0`: 2026-05-16T12:00:00.000Z, skipped because it is not older than 8 days.",
      "Create or update project-root `.npmrc` with:\n\n```ini\nmin-release-age=8\nminimum-release-age=11520\n```",
      "Ownership:\n\n- `min-release-age=8` is npm's relative age gate.\n- `minimum-release-age=11520` is pnpm coverage in `.npmrc` where supported.\n- `minimumReleaseAge: 11520` is pnpm project config coverage where supported.",
      ...basePlan.slice(2),
    ]);

    expect(retainedProofListShape.assertions.find((assertion) => assertion.description === "Output proves selected pnpm toolchain age eligibility")).toMatchObject({ pass: true });
    expect(retainedProofListShape.quality?.criteria.find((criterion) => criterion.id === "workflow-output-proves-selected-pnpm-toolchain-age-eligibility")).toMatchObject({ passed: true });

    const fixtureKeyShape = evaluatePlan([
      ...basePlan.slice(0, 2),
      "Recommended migration:\n1. Add `packageManager: \"pnpm@10.11.0\"` to `package.json`.",
      "pnpm version selection proof:\n- Do not use unqualified `pnpm@latest`.\n- `pnpm@10.11.0` is selected because `npm-view-times.json` records `\"10.11.0\": \"2026-05-01T12:00:00.000Z\"`, which is older than 8 days.\n- `pnpm@10.22.0` is skipped because `npm-view-times.json` records `\"10.22.0\": \"2026-05-16T12:00:00.000Z\"`, which is not older than 8 days.",
      "Create or update project-root `.npmrc` with:\n\n```ini\nmin-release-age=8\nminimum-release-age=11520\n```",
      "Ownership:\n\n- `min-release-age=8` is npm's relative age gate.\n- `minimum-release-age=11520` is pnpm coverage in `.npmrc` where supported.\n- `minimumReleaseAge: 11520` is pnpm project config coverage where supported.",
      ...basePlan.slice(2),
    ]);

    expect(fixtureKeyShape.assertions.find((assertion) => assertion.description === "Output proves selected pnpm toolchain age eligibility")).toMatchObject({ pass: true });
    expect(fixtureKeyShape.quality?.criteria.find((criterion) => criterion.id === "workflow-output-proves-selected-pnpm-toolchain-age-eligibility")).toMatchObject({ passed: true });

    const missingProof = evaluatePlan([
      ...basePlan.slice(0, 2),
      "Package-manager migration strategy: set packageManager to pnpm@10.22.0 from the existing local toolchain. Before real mutation, verify its publish timestamp with npm view pnpm@10.22.0 time.version.",
      "Age-gate config: `.npmrc` keeps npm's relative guard `min-release-age=8`; pnpm coverage uses `minimum-release-age=11520`, and pnpm project config uses `minimumReleaseAge: 11520` when required.",
      ...basePlan.slice(2),
    ]);

    expect(missingProof.assertions.find((assertion) => assertion.description === "Output proves selected pnpm toolchain age eligibility")).toMatchObject({ pass: false });
    expect(missingProof.quality?.criteria.find((criterion) => criterion.id === "workflow-output-proves-selected-pnpm-toolchain-age-eligibility")).toMatchObject({ passed: false });
    expect(missingProof.quality?.criticalFailures).toContain("workflow-output-proves-selected-pnpm-toolchain-age-eligibility");

    const mismatchedFixtureProof = evaluatePlan([
      ...basePlan.slice(0, 2),
      "Recommended migration: add `packageManager: \"pnpm@10.22.0\"` to `package.json`.",
      "pnpm version selection proof: `pnpm@10.22.0` is selected because `npm-view-times.json` records `\"10.11.0\": \"2026-05-01T12:00:00.000Z\"`, which is older than 8 days.",
      "Age-gate config: `.npmrc` keeps npm's relative guard `min-release-age=8`; pnpm coverage uses `minimum-release-age=11520`, and pnpm project config uses `minimumReleaseAge: 11520` when required.",
      ...basePlan.slice(2),
    ]);

    expect(mismatchedFixtureProof.assertions.find((assertion) => assertion.description === "Output proves selected pnpm toolchain age eligibility")).toMatchObject({ pass: false });
    expect(mismatchedFixtureProof.quality?.criteria.find((criterion) => criterion.id === "workflow-output-proves-selected-pnpm-toolchain-age-eligibility")).toMatchObject({ passed: false });

    const reversedSemantics = evaluatePlan([
      ...basePlan.slice(0, 2),
      "Package-manager toolchain proof: set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days and age-eligible.",
      "Age-gate config: npm reads `minimum-release-age=11520`; pnpm reads `min-release-age=8`; write both values.",
      ...basePlan.slice(2),
    ]);

    expect(reversedSemantics.assertions.find((assertion) => assertion.description === "Output preserves age-gate key semantics")).toMatchObject({ pass: false });
    expect(reversedSemantics.quality?.criteria.find((criterion) => criterion.id === "workflow-output-preserves-age-gate-key-semantics")).toMatchObject({ passed: false });
    expect(reversedSemantics.quality?.criticalFailures).toContain("workflow-output-preserves-age-gate-key-semantics");
  });

  it("rejects update-packages plans without behavior-level verification command evidence", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-missing-verification-"));
    writeFileSync(
      resolve(workDir, "package-update-plan.md"),
      [
        "# Package Update Plan",
        "This package-update-plan.md records the update plan.",
        "Package-manager migration strategy: migrate to pnpm.",
        "Package-manager toolchain proof: set packageManager to pnpm@10.11.0 because npm view pnpm@10.11.0 time.version returned 2026-05-01T12:00:00.000Z, older than 8 days.",
        "Age-gate config: create `.npmrc` with npm's relative age gate `min-release-age=8` and pnpm coverage `minimum-release-age=11520`.",
        "For modern pnpm project config, also use pnpm `minimumReleaseAge: 11520`.",
        "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
        "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
        "Recommended next command: $run",
      ].join("\n\n"),
    );

    const assertions = setup!.assertResult(
      { stdout: "", stderr: "", exitCode: 0, workDir, files: ["package-update-plan.md"] },
      { agent: "codex" },
    );

    expect(assertions.find((assertion) => assertion.description === "Output includes verification command evidence")).toMatchObject({ pass: false });

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));

    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-output-includes-verification-command-evidence")).toMatchObject({ passed: false });
    expect(quality?.criticalFailures).toContain("workflow-output-includes-verification-command-evidence");
  });

  it("does not accept package-manager shell commands as the final update-packages handoff", () => {
    const setup = resolveBenchSetup("update-packages");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "update-packages-shell-route-"));
    writeFileSync(
      resolve(workDir, "package-update-plan.md"),
      [
        "# Package Update Plan",
        "This package-update-plan.md records the update plan.",
        "Package-manager migration strategy: migrate to pnpm.",
        "Age-gate config: create `.npmrc` with `min-release-age=8` and `minimum-release-age=11520`.",
        "Eligible versions older than 8 days: react 19.2.0, zod 3.25.76, vitest 3.2.4.",
        "Skipped packages: react 19.3.0, zod 4.1.12, and vitest 4.0.0.",
        "Verification commands: pnpm install, pnpm test, pnpm build.",
        "Next command: pnpm install && pnpm test && pnpm build",
      ].join("\n\n"),
    );

    const assertions = setup!.assertResult(
      { stdout: "", stderr: "", exitCode: 0, workDir, files: ["package-update-plan.md"] },
      { agent: "codex" },
    );

    expect(assertions.find((assertion) => assertion.description === "Output includes next command handoff")).toMatchObject({ pass: true });
    expect(assertions.find((assertion) => assertion.description === "Output recommends $run")).toMatchObject({ pass: false });

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "package-update-plan.md"), "utf8"));

    expect(quality?.criteria.find((criterion) => criterion.id === "workflow-next-route")).toMatchObject({ passed: false });
    expect(quality?.criticalFailures).toContain("workflow-next-route");
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
        "Source asset: calc-mascot-icon.svg",
        "Missing stale favicon.ico and apple-touch-icon surfaces need approval.",
        "",
        "Next command: `/icon-handler fix calc-mascot-icon.svg`",
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
        "Source asset: calc-mascot-icon.svg",
        "Missing stale favicon.ico and apple-touch-icon surfaces need approval.",
        "",
        "Recommended next command: `$icon-handler fix calc-mascot-icon.svg`",
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

    writeFileSync(
      resolve(workDir, "icon-audit.md"),
      [
        "## Icon Audit",
        "",
        "Framework: Next App Router",
        "Source asset: calc-mascot-icon.svg",
        "Missing stale favicon.ico and apple-touch-icon surfaces need approval.",
        "",
        "Verification commands: npx next build",
        "Next command: npx next build",
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
        { agent: "claude" },
      ).find((assertion) => assertion.description === "Output recommends /icon-handler"),
    ).toMatchObject({
      pass: false,
    });

    writeFileSync(
      resolve(workDir, "icon-audit.md"),
      [
        "## Icon Audit",
        "",
        "Framework: Next App Router",
        "Source asset: calc-mascot-icon.svg",
        "Missing stale favicon.ico and apple-touch-icon surfaces need approval.",
        "",
        "Approval requirement: Recommended approval command: `$icon-handler fix calc-mascot-icon.svg`",
        "Verification commands: npm run build",
        "Next command: npm run build",
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
      pass: false,
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
    expect(
      setup!.qualityEvaluator?.evaluate("## Recommended Next Command\n```\n/icon-handler fix calc-mascot-icon.svg\n```").criteria.find((criterion) => criterion.id === "workflow-next-route"),
    ).toMatchObject({
      passed: true,
    });
    expect(
      setup!.qualityEvaluator?.evaluate("## Next command\nRun the icon-handler fix approval route for this runner:\n\n- Claude: `/icon-handler fix calc-mascot-icon.svg`\n- Codex: `$icon-handler fix calc-mascot-icon.svg`").criteria.find((criterion) => criterion.id === "workflow-next-route"),
    ).toMatchObject({
      passed: true,
    });
    expect(
      setup!.qualityEvaluator?.evaluate("Recommended approval command: $icon-handler fix calc-mascot-icon.svg\nNext command: npm run build").criteria.find((criterion) => criterion.id === "workflow-next-route"),
    ).toMatchObject({
      passed: false,
    });
  });

  it("uses broad repeated evidence and runner-specific routes for the analyze-sessions setup", () => {
    const setup = resolveBenchSetup("analyze-sessions");
    expect(setup).toBeDefined();
    expect(setup?.prompt).toContain("all local session history files under sessions/");
    expect(setup?.prompt).toContain("remediation-ready targeted-skill-builder");
    expect(setup?.prompt).toContain("no runner label suffix");
    expect(setup?.prompt).toContain("Use exactly `/targeted-skill-builder run post-doc-edit validation and lessons capture gate` when running as Claude");
    expect(setup?.prompt).toContain("Use exactly `$targeted-skill-builder run post-doc-edit validation and lessons capture gate` when running as Codex");
    expect(setup?.prompt).toContain("distinguish explicit evidence from inference");
    expect(setup?.prompt).toContain("do not put both route spellings in the final handoff");
    expect(setup?.perRunBudgetUsd).toBe(BENCH_BUDGETS_USD.standard);

    const workDir = mkdtempSync(resolve(tmpdir(), "analyze-sessions-fixture-"));
    setup!.setupProject?.(workDir);

    const fixtureFiles = [
      "sessions/2026-05-01-log.md",
      "sessions/2026-05-08-log.md",
      "sessions/2026-05-15-log.md",
    ];
    for (const file of fixtureFiles) {
      expect(readFileSync(resolve(workDir, file), "utf8")).toMatch(/validation|lessons/i);
    }

    const baseReport = [
      "# Session Analysis",
      "",
      "Generated artifact: session-analysis.md",
      "",
      "## Recurring Patterns",
      "- validation skipped after task-doc edits across sessions/2026-05-01-log.md, sessions/2026-05-08-log.md, and sessions/2026-05-15-log.md.",
      "- lessons updates were missed repeatedly.",
      "",
      "## Automation Opportunities",
      "- Add a targeted builder guard for validation and lessons capture.",
      "",
      "Likely owner surface: the run workflow should own the post-doc-edit validation and lessons capture gate.",
      "",
      "Validation expectation: add a layer1 contract test and one-run benchmark smoke for this handoff.",
      "",
      "Source attribution: explicit evidence says validation and lessons were missed; runner ownership is not stated for every log.",
      "",
      "## Risks",
      "- Repeated missing validation and lessons updates creates process drift.",
      "",
    ].join("\n");

    writeFileSync(
      resolve(workDir, "session-analysis.md"),
      `${baseReport}**Recommended next command:** /targeted-skill-builder run post-doc-edit validation and lessons capture gate\n`,
    );
    const claudeAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["session-analysis.md", ...fixtureFiles],
      },
      { agent: "claude" },
    );
    expect(claudeAssertions.find((assertion) => assertion.description === "Output includes next command handoff")).toMatchObject({
      pass: true,
    });
    expect(claudeAssertions.find((assertion) => assertion.description === "Output recommends exactly /targeted-skill-builder run post-doc-edit validation and lessons capture gate")).toMatchObject({
      pass: true,
    });
    expect(
      setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "session-analysis.md"), "utf8")).criteria.find(
        (criterion) => criterion.id === "workflow-remediation-ready-handoff",
      ),
    ).toMatchObject({
      passed: true,
    });
    expect(claudeAssertions.some((assertion) => assertion.description === "Output recommends $targeted-skill-builder run post-doc-edit validation and lessons capture gate")).toBe(false);

    const sectionBasedHandoff = [
      "# Session Analysis",
      "",
      "## Automation Opportunities",
      "All three sessions show validation and lessons misses.",
      "",
      "### Likely owner surface",
      "",
      "Task / roadmap / lessons documentation surface - i.e. the post-edit hook point that fires when `tasks/`, `roadmap`, or todo docs change.",
      "",
      "### Validation expectation",
      "",
      "A skill-specific validation command that runs the project task-doc validator and checks for a lessons-file update.",
      "",
      "Source attribution: explicit evidence says validation and lessons were missed; runner ownership is not stated for every log.",
      "",
      "**Recommended next command:** /targeted-skill-builder run post-doc-edit validation and lessons capture gate",
    ].join("\n");
    expect(
      setup!.qualityEvaluator?.evaluate(sectionBasedHandoff).criteria.find(
        (criterion) => criterion.id === "workflow-remediation-ready-handoff",
      ),
    ).toMatchObject({
      passed: true,
    });

    const tableBasedHandoff = [
      "# Session Analysis",
      "",
      "## Automation Opportunity",
      "",
      "| Pattern | Frequency | Recommendation | Likely owner surface | Validation expectation |",
      "| --- | --- | --- | --- | --- |",
      "| Validation and lessons capture skipped after doc edits | 3/3 sessions | Targeted skill builder update | `run` skill post-edit step | Skill must require a validation pass and lessons-file update before allowing ship/exit |",
      "",
      "Ownership note: explicit evidence points to the Codex `$run` path on 2 of 3 sessions; the third session is not stated.",
      "",
      "**Recommended next command:** /targeted-skill-builder run post-doc-edit validation and lessons capture gate",
    ].join("\n");
    expect(
      setup!.qualityEvaluator?.evaluate(tableBasedHandoff).criteria.find(
        (criterion) => criterion.id === "workflow-remediation-ready-handoff",
      ),
    ).toMatchObject({
      passed: true,
    });

    writeFileSync(
      resolve(workDir, "session-analysis.md"),
      `${baseReport}**Recommended next command:** /targeted-skill-builder\n`,
    );
    const genericClaudeAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["session-analysis.md", ...fixtureFiles],
      },
      { agent: "claude" },
    );
    expect(genericClaudeAssertions.find((assertion) => assertion.description === "Output recommends exactly /targeted-skill-builder run post-doc-edit validation and lessons capture gate")).toMatchObject({
      pass: false,
    });

    writeFileSync(
      resolve(workDir, "session-analysis.md"),
      `${baseReport}**Recommended next command:** $targeted-skill-builder run post-doc-edit validation and lessons capture gate\n`,
    );
    const codexAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["session-analysis.md", ...fixtureFiles],
      },
      { agent: "codex" },
    );
    expect(codexAssertions.find((assertion) => assertion.description === "Output includes next command handoff")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.find((assertion) => assertion.description === "Output recommends exactly $targeted-skill-builder run post-doc-edit validation and lessons capture gate")).toMatchObject({
      pass: true,
    });
    expect(
      setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "session-analysis.md"), "utf8")).criteria.find(
        (criterion) => criterion.id === "workflow-next-route",
      ),
    ).toMatchObject({
      passed: true,
    });

    writeFileSync(
      resolve(workDir, "session-analysis.md"),
      `${baseReport}**Recommended next command:** $targeted-skill-builder run post-doc-edit validation and lessons capture gate for Codex\n`,
    );
    const suffixedCodexAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["session-analysis.md", ...fixtureFiles],
      },
      { agent: "codex" },
    );
    expect(suffixedCodexAssertions.find((assertion) => assertion.description === "Output recommends exactly $targeted-skill-builder run post-doc-edit validation and lessons capture gate")).toMatchObject({
      pass: false,
    });
    expect(
      setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "session-analysis.md"), "utf8")).criteria.find(
        (criterion) => criterion.id === "workflow-next-route",
      ),
    ).toMatchObject({
      passed: false,
    });

    const missingOwnerSurface = [
      "# Session Analysis",
      "",
      "## Recurring Patterns",
      "recurring patterns show validation and lessons misses.",
      "",
      "## Automation Opportunities",
      "automation opportunities include targeted skill building.",
      "",
      "## Risks",
      "risks include process drift.",
      "",
      "**Recommended next command:** $targeted-skill-builder run post-doc-edit validation and lessons capture gate",
    ].join("\n");
    expect(
      setup!.qualityEvaluator?.evaluate(missingOwnerSurface).criteria.find(
        (criterion) => criterion.id === "workflow-remediation-ready-handoff",
      ),
    ).toMatchObject({
      passed: false,
    });
  });

  it("lints analyze-sessions contracts for remediation-ready targeted-skill-builder handoffs", () => {
    const contracts = [
      {
        path: "global/claude/analyze-sessions/SKILL.md",
        route: "/targeted-skill-builder <concrete gap phrase>",
        example: "/targeted-skill-builder run post-doc-edit validation and lessons capture gate",
        runner: "Claude-native",
      },
      {
        path: "global/codex/analyze-sessions/SKILL.md",
        route: "$targeted-skill-builder <concrete gap phrase>",
        example: "$targeted-skill-builder run post-doc-edit validation and lessons capture gate",
        runner: "Codex-native",
      },
    ];

    for (const contract of contracts) {
      const content = readFileSync(resolve(TESTS_ROOT, "..", contract.path), "utf8");

      expect(content, `${contract.path} remediation section`).toContain("## Remediation-Ready Handoffs");
      expect(content, `${contract.path} concrete route`).toContain(contract.route);
      expect(content, `${contract.path} example`).toContain(contract.example);
      expect(content, `${contract.path} runner-native final route`).toContain(contract.runner);
      expect(content, `${contract.path} owner surface`).toContain("likely owner surface");
      expect(content, `${contract.path} validation expectation`).toContain("validation expectation");
      expect(content, `${contract.path} attribution guard`).toContain("Distinguish explicit evidence from inference");
    }
  });

  it("creates an SVG source asset for the icon-handler workflow setup to avoid runner image ingestion", () => {
    const setup = resolveBenchSetup("icon-handler");
    expect(setup).toBeDefined();

    const workDir = mkdtempSync(resolve(tmpdir(), "icon-handler-fixture-"));
    setup!.setupProject?.(workDir);

    const sourceAsset = readFileSync(resolve(workDir, "calc-mascot-icon.svg"), "utf8");
    expect(sourceAsset).toContain("<svg");
    expect(sourceAsset).toContain('width="512"');
    expect(sourceAsset).not.toContain("fixture-png-placeholder");
    expect(existsSync(resolve(workDir, "calc-mascot-icon.png"))).toBe(false);
    expect(setup!.perRunBudgetUsd).toBe(BENCH_BUDGETS_USD.standard);
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
        "Fixture review notes validation already passed for the completed step.",
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

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "ship-manifest.md"), "utf8"));

    expect(quality?.criteria.find((criterion) => criterion.id === "evidence-linked")).toMatchObject({
      passed: true,
    });
    expect(quality?.criteria.find((criterion) => criterion.id === "validation-evidence")).toMatchObject({
      passed: true,
    });
    expect(quality?.criticalFailures).not.toContain("evidence-linked");
    expect(quality?.criticalFailures).not.toContain("validation-evidence");

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
        "Not recorded in this manifest.",
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

    const missingValidationQuality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(workDir, "ship-manifest.md"), "utf8"));
    expect(missingValidationQuality?.criticalFailures).toContain("validation-evidence");
  });

  it("uses fixture-grounded runner-specific route assertions for the ship-end workflow setup", () => {
    const setup = resolveBenchSetup("ship-end");
    expect(setup).toBeDefined();
    expect(setup?.prompt).toContain("Use the fixture task files as the source of truth");
    expect(setup?.prompt).toContain("name both `tasks/todo.md` and `tasks/history.md`");
    expect(setup?.prompt).toContain("`/run` when running as Claude and `$run` when running as Codex");

    const writeHandoff = (workDir: string, route: string, nextWork = "- Complete `Step 1.2 next` from `tasks/todo.md`.") => {
      writeFileSync(
        resolve(workDir, "session-handoff.md"),
        [
          "# Session Handoff",
          "",
          "## Completed Work",
          "- Completed `Step 1.1` from `tasks/todo.md`.",
          "- `tasks/history.md` records: Completed Step 1.1 with tests.",
          "",
          "## Validation Evidence",
          "- The fixture history says Step 1.1 was completed with tests.",
          "",
          "## Remaining Risks",
          "- No git inspection was run for this benchmark fixture.",
          "",
          "## Next Work",
          nextWork,
          "",
          "## Next Command",
          `\`${route}\``,
        ].join("\n"),
      );
    };

    const claudeWorkDir = mkdtempSync(resolve(tmpdir(), "ship-end-claude-route-"));
    writeHandoff(claudeWorkDir, "/run");
    const claudeAssertions = setup!.assertResult(
      { stdout: "", stderr: "", exitCode: 0, workDir: claudeWorkDir, files: ["session-handoff.md"] },
      { agent: "claude" },
    );
    expect(claudeAssertions.find((assertion) => assertion.description === "Output includes Step 1.2")).toMatchObject({
      pass: true,
    });
    expect(claudeAssertions.find((assertion) => assertion.description === "Output recommends /run")).toMatchObject({
      pass: true,
    });

    const codexWorkDir = mkdtempSync(resolve(tmpdir(), "ship-end-codex-route-"));
    writeHandoff(codexWorkDir, "$run");
    const codexAssertions = setup!.assertResult(
      { stdout: "", stderr: "", exitCode: 0, workDir: codexWorkDir, files: ["session-handoff.md"] },
      { agent: "codex" },
    );
    expect(codexAssertions.find((assertion) => assertion.description === "Output recommends $run")).toMatchObject({
      pass: true,
    });

    const quality = setup!.qualityEvaluator?.evaluate(readFileSync(resolve(claudeWorkDir, "session-handoff.md"), "utf8"));
    expect(quality?.criteria.find((criterion) => criterion.id === "actionable-next-route")).toMatchObject({
      passed: true,
    });

    const missingNextWorkDir = mkdtempSync(resolve(tmpdir(), "ship-end-missing-next-work-"));
    writeHandoff(missingNextWorkDir, "/run", "- Decide what to work on next.");
    expect(
      setup!.assertResult(
        { stdout: "", stderr: "", exitCode: 0, workDir: missingNextWorkDir, files: ["session-handoff.md"] },
        { agent: "claude" },
      ).find((assertion) => assertion.description === "Output includes Step 1.2"),
    ).toMatchObject({
      pass: false,
    });

    const recursiveRouteWorkDir = mkdtempSync(resolve(tmpdir(), "ship-end-recursive-route-"));
    writeHandoff(recursiveRouteWorkDir, "/ship-end");
    expect(
      setup!.assertResult(
        { stdout: "", stderr: "", exitCode: 0, workDir: recursiveRouteWorkDir, files: ["session-handoff.md"] },
        { agent: "claude" },
      ).find((assertion) => assertion.description === "Output recommends /run"),
    ).toMatchObject({
      pass: false,
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

  it("allows roadmap evidence-linked quality to preserve benchmark coverage without exact source phrasing", () => {
    const setup = resolveBenchSetup("roadmap");
    expect(setup).toBeDefined();

    expect(setup!.prompt).toContain("$plan-phase 1");

    const evidenceCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "evidence-linked");
    expect(evidenceCriterion?.evaluate([
      "# Roadmap: Benchmark Coverage Reporting",
      "",
      "## Phase 1: Benchmark Coverage Model",
      "Define the benchmark coverage data model.",
      "",
      "## Phase 2: CLI Status Output",
      "Expose coverage through CLI status output.",
    ].join("\n"))).toMatchObject({
      score: 1,
    });
    expect(evidenceCriterion?.evaluate([
      "# Roadmap",
      "",
      "## Phase 1: Coverage Report Foundation",
      "Define the benchmark coverage data model and report format.",
      "",
      "## Phase 2: Validation Rules",
      "Add a CLI command that reads benchmark coverage data and prints status output.",
    ].join("\n"))).toMatchObject({
      score: 1,
    });
    expect(evidenceCriterion?.evaluate([
      "# Roadmap",
      "",
      "## Phase 1",
      "Define generic reporting.",
      "",
      "## Phase 2",
      "Expose generic status output.",
    ].join("\n"))).toMatchObject({
      score: 0,
    });
  });

  it("keeps the feature-interview benchmark from routing unconfirmed ideas directly to spec-interview", () => {
    const setup = resolveBenchSetup("feature-interview");
    expect(setup).toBeDefined();
    expect(setup!.prompt).toContain("explicit Artifact path line");
    expect(setup!.prompt).toContain("Treat the planning destination as confirmed for roadmap sequencing");
    expect(setup!.prompt).toContain("do not route directly to spec-interview");

    const codexSkill = readFileSync(resolve(TESTS_ROOT, "../global/codex/feature-interview/SKILL.md"), "utf8");
    const claudeSkill = readFileSync(resolve(TESTS_ROOT, "../global/claude/feature-interview/SKILL.md"), "utf8");

    expect(codexSkill).toContain("Artifact path: the exact path of this interview log.");
    expect(claudeSkill).toContain("Artifact path: the exact path of this interview log.");
    expect(codexSkill).toContain("Do not route brainstorm ideas directly to `$spec-interview`");
    expect(claudeSkill).toContain("Do not route brainstorm ideas directly to `/spec-interview`");

    const workDir = mkdtempSync(resolve(tmpdir(), "feature-interview-route-"));
    mkdirSync(resolve(workDir, "specs"), { recursive: true });
    writeFileSync(
      resolve(workDir, "specs/benchmark-reporting-feature-interview.md"),
      [
        "# Benchmark Reporting Feature Interview",
        "",
        "Artifact path: `specs/benchmark-reporting-feature-interview.md`",
        "",
        "## Assumptions",
        "Benchmark reports need custom, generic, and blocked coverage labels.",
        "",
        "## Evidence",
        "`feature-idea.md` requests custom, generic, and blocked coverage visibility in benchmark reports.",
        "",
        "## Decision",
        "Proceed to roadmap sequencing for the confirmed reporting slice.",
        "",
        "## Risks",
        "Blocked coverage labels need reasons so reports do not hide benchmark gaps.",
        "",
        "## Next command",
        "`$roadmap`",
      ].join("\n"),
    );

    const codexAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["specs/benchmark-reporting-feature-interview.md"],
      },
      { agent: "codex" },
    );

    expect(codexAssertions.find((assertion) => assertion.description === "Output recommends $roadmap")).toMatchObject({
      pass: true,
    });
    expect(codexAssertions.some((assertion) => assertion.description === "Output recommends $spec-interview")).toBe(false);

    writeFileSync(
      resolve(workDir, "specs/benchmark-reporting-feature-interview.md"),
      [
        "# Benchmark Reporting Feature Interview",
        "",
        "Artifact path: `specs/benchmark-reporting-feature-interview.md`",
        "",
        "## Assumptions",
        "Benchmark reports need custom, generic, and blocked coverage labels.",
        "",
        "## Evidence",
        "`feature-idea.md` requests custom, generic, and blocked coverage visibility in benchmark reports.",
        "",
        "## Decision",
        "Proceed to roadmap sequencing for the confirmed reporting slice.",
        "",
        "## Risks",
        "Blocked coverage labels need reasons so reports do not hide benchmark gaps.",
        "",
        "## Next command",
        "`/roadmap`",
      ].join("\n"),
    );

    const claudeAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["specs/benchmark-reporting-feature-interview.md"],
      },
      { agent: "claude" },
    );

    expect(claudeAssertions.find((assertion) => assertion.description === "Output recommends /roadmap")).toMatchObject({
      pass: true,
    });
    expect(claudeAssertions.some((assertion) => assertion.description === "Output recommends /spec-interview")).toBe(false);

    const nextRouteCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "actionable-next-route");
    expect(nextRouteCriterion?.evaluate("## Next command\n`$roadmap`")).toMatchObject({
      score: 1,
    });
    expect(nextRouteCriterion?.evaluate("## Next command\n`/roadmap`")).toMatchObject({
      score: 1,
    });
    expect(nextRouteCriterion?.evaluate("## Next command\n`$spec-interview`")).toMatchObject({
      score: 0,
    });

    const fileReferenceCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "file-reference");
    expect(fileReferenceCriterion?.evaluate([
      "Artifact path: `specs/benchmark-reporting-feature-interview.md`",
      "",
      "Evidence: `feature-idea.md` requests custom, generic, and blocked coverage labels.",
    ].join("\n"))).toMatchObject({
      score: 1,
    });
    expect(fileReferenceCriterion?.evaluate([
      "# Benchmark Reporting Feature Interview",
      "",
      "Evidence: `feature-idea.md` requests custom, generic, and blocked coverage labels.",
    ].join("\n"))).toMatchObject({
      score: 0,
    });

    const evidenceCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "evidence-linked");
    expect(evidenceCriterion?.evaluate([
      "# Benchmark Reporting Dashboard Feature Interview",
      "",
      "The supplied idea asks for a SaaS dashboard where maintainers compare custom, generic, and blocked skill coverage.",
      "The first artifact uses fake rows so the benchmark coverage dashboard workflow can be validated before infrastructure.",
    ].join("\n"))).toMatchObject({
      score: 1,
    });
    expect(evidenceCriterion?.evaluate([
      "# Feature Interview",
      "",
      "The output mentions custom, generic, and blocked labels but never ties them to the dashboard concept or fake rows.",
    ].join("\n"))).toMatchObject({
      score: 0,
    });

    const prototypeGateCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "prototype-first-product-gate");
    expect(prototypeGateCriterion?.evaluate([
      "## Prototype-First Gate",
      "",
      "Decision: `multiple route experiments` in a separate Prototype Phase 0.",
      "The next build artifact should be a local/static dashboard prototype with fake or fixture-backed skill rows.",
      "Experiment routes: `/experiments/table-first`, `/experiments/board-first`, and `/experiments/command-first`.",
      "Explicitly deferred until prototype acceptance: authentication, Stripe or billing, product analytics, durable database or storage, deployment, admin tooling, multi-tenancy, and production observability.",
      "Evidence that would justify promoting a deferred item into a later phase:",
      "- Auth: multiple user roles or private skill inventories are validated as necessary.",
      "- Database/storage: maintainers accept the row schema and need persistent edits or imported benchmark history.",
      "- Analytics: measured usage is needed after the workflow is accepted.",
    ].join("\n"))).toMatchObject({
      score: 1,
    });
    expect(prototypeGateCriterion?.evaluate([
      "## Prototype-First Gate",
      "",
      "Roadmap impact: create a prototype-first benchmark reporting phase that sequences `/experiments/table-first`, `/experiments/board-first`, and `/experiments/command-first`, then evaluates which route should graduate into a fuller spec or implementation plan.",
      "The first build artifact should be clickable local/static prototype routes with fake or fixture-backed data.",
      "Deferred until one route is accepted: durable storage, auth, Stripe, analytics, deployment, admin tooling, multi-tenancy, production observability, and production reporting exports.",
      "Promotion evidence for deferred infrastructure: a selected route, accepted core workflow, fixture fields that match real maintainer decisions, and clear evidence that persistent history or authenticated collaboration is needed for the next phase.",
    ].join("\n"))).toMatchObject({
      score: 1,
    });
    expect(prototypeGateCriterion?.evaluate([
      "## Prototype-First Gate",
      "",
      "Recommended roadmap placement: prototype-first phase before any production SaaS infrastructure phase.",
      "The next build artifact should use fake, fixture, or in-memory rows only.",
      "Route-based experiments: `/experiments/benchmark-reporting/table-first`, `/experiments/benchmark-reporting/board-first`, and `/experiments/benchmark-reporting/command-first`.",
      "The prototype should intentionally defer durable storage, auth, payments, analytics, deployment, admin tooling, multi-tenancy, production observability, and any external data ingestion.",
      "Promotion criteria for production infrastructure: one route demonstrates a clear maintainer workflow, the fixture schema survives review, and maintainers can identify next actions for blocked skills.",
    ].join("\n"))).toMatchObject({
      score: 1,
    });
    expect(prototypeGateCriterion?.evaluate([
      "## Prototype-First Gate",
      "",
      "Decision: clickable prototype.",
      "Use fake data and defer auth, database, analytics, and deployment until later.",
    ].join("\n"))).toMatchObject({
      score: 0,
    });
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

  it("requires runner-aware targeted-skill-builder routes for benchmark-agent-review", () => {
    const setup = resolveBenchSetup("benchmark-agent-review");
    const target = resolveBenchTarget("benchmark-agent-review");

    expect(setup?.skill).toBe("benchmark-agent-review");
    expect(target).toMatchObject({
      skill: "benchmark-agent-review",
      coverageStatus: "custom",
      setupPath: "tests/layer4/setups/packs/pack-workflows.setup.ts",
    });
    expect(setup?.prompt).toContain("remediation-ready handoff for the residual-risk-awareness output-quality gap");
    expect(setup?.prompt).toContain("inspect retained artifact text in ship-manifest.md directly before grading the output");
    expect(setup?.prompt).toContain("name the owner target, proposed behavior change, and validation check for every material remediation finding");
    expect(setup?.prompt).toContain("claude: /targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap");
    expect(setup?.prompt).toContain("codex: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap");

    const workDir = mkdtempSync(resolve(tmpdir(), "benchmark-agent-review-route-"));
    setup!.setupProject?.(workDir);
    const retainedArtifact = readFileSync(resolve(workDir, "ship-manifest.md"), "utf8");
    expect(retainedArtifact).toContain("## Residual Risks");
    expect(retainedArtifact).toContain("Not captured.");
    expect(retainedArtifact).toContain("## Post-Ship Monitoring");
    expect(retainedArtifact).toContain("## Known Unknowns");

    const baseOutput = [
      "# Pack Benchmark Output",
      "",
      "Pack: agentic-skills-bench",
      "Skill: benchmark-agent-review",
      "This subjective quality review scores the persisted output artifact and separates benchmark score from output quality.",
      "Evidence: pack-input.md says Hard assertions: 100% and Deterministic quality score: 78.6%.",
      "Evidence: fixtures/local-evidence.md says the fixture is local and deterministic.",
      "Evidence from ship-manifest.md: the Residual Risks section says Not captured, Post-Ship Monitoring says Not specified, and Known Unknowns says future artifact-text inspection is not documented.",
      "Risk: ship-manifest.md is compliant but lacks residual-risk awareness, so remediation should target that output-quality gap.",
      "Subjective score: 78/100, separate from deterministic quality score 78.6%.",
      "Owner target: packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md and the Claude mirror SKILL.md.",
      "Proposed behavior change: require placeholder risk and monitoring text to become owner-specific remediation.",
      "Validation check: add a layer1 assertion for placeholder residual-risk review output and run $benchmark-test-skill benchmark-agent-review.",
      "",
    ].join("\n");

    writeFileSync(
      resolve(workDir, "pack-benchmark-output.md"),
      `${baseOutput}Recommended next command: /targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap\n`,
    );
    const claudeAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["pack-benchmark-output.md"],
      },
      { agent: "claude" },
    );
    expect(
      claudeAssertions.find(
        (assertion) =>
          assertion.description === "Output recommends /targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
      ),
    ).toMatchObject({ pass: true });
    expect(claudeAssertions.find((assertion) => assertion.description === "Output cites retained ship-manifest.md evidence")).toMatchObject({
      pass: true,
    });

    writeFileSync(
      resolve(workDir, "pack-benchmark-output.md"),
      [
        "# Pack Benchmark Output",
        "",
        "Pack: agentic-skills-bench",
        "Skill: benchmark-agent-review",
        "Evidence: pack-input.md says ship-manifest.md lacks residual-risk awareness.",
        "Recommended next command: /targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
        "",
      ].join("\n"),
    );
    const summaryOnlyAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["pack-benchmark-output.md"],
      },
      { agent: "claude" },
    );
    expect(summaryOnlyAssertions.find((assertion) => assertion.description === "Output cites retained ship-manifest.md evidence")).toMatchObject({
      pass: false,
    });
    expect(
      summaryOnlyAssertions.find((assertion) => assertion.description === "Output includes remediation owner target and validation check"),
    ).toMatchObject({
      pass: false,
    });

    const strongQuality = setup!.qualityEvaluator?.evaluate([
      baseOutput,
      "Remediation table:",
      "Owner target: packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md and packs/agentic-skills-bench/claude/benchmark-agent-review/SKILL.md.",
      "Proposed behavior change: require retained artifact placeholder risks to name a remediation owner and proof.",
      "Validation check: add a focused layer1 assertion for placeholder residual-risk output and run $benchmark-test-skill benchmark-agent-review.",
      "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
    ].join("\n"));
    expect(strongQuality?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-remediation-owner-target")).toMatchObject({
      passed: true,
    });
    expect(strongQuality?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-validation-specificity")).toMatchObject({
      passed: true,
    });
    expect(strongQuality?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-subjective-score-separation")).toMatchObject({
      passed: true,
    });

    const exactOwnerWithBenignUpdateLabel = setup!.qualityEvaluator?.evaluate([
      baseOutput,
      "Remediation table:",
      "Owner target: packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md and packs/agentic-skills-bench/claude/benchmark-agent-review/SKILL.md.",
      "Proposed behavior change: require retained artifact placeholder risks to name a remediation owner and proof.",
      "Validation check: add a focused layer1 assertion for placeholder residual-risk output and run $benchmark-test-skill benchmark-agent-review.",
      "Preferred output: update existing skill.",
      "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
    ].join("\n"));
    expect(exactOwnerWithBenignUpdateLabel?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-remediation-owner-target")).toMatchObject({
      passed: true,
    });
    expect(exactOwnerWithBenignUpdateLabel?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-validation-specificity")).toMatchObject({
      passed: true,
    });
    expect(exactOwnerWithBenignUpdateLabel?.criticalFailures).not.toContain("benchmark-agent-review-validation-specificity");

    const ownerTargetSlashFile = setup!.qualityEvaluator?.evaluate([
      baseOutput,
      "### Finding 1 — Residual Risks section emitted as a stub",
      "**Owner target / file:** `packs/agentic-skills-bench/claude/benchmark-agent-review/SKILL.md` and `packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md`",
      "**Proposed behavior change:** require retained artifact placeholder risks to name a remediation owner and proof.",
      "**Validation check:** Layer-level assertion that residual risk sections contain non-placeholder bullets.",
      "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
    ].join("\n"));
    expect(ownerTargetSlashFile?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-remediation-owner-target")).toMatchObject({
      passed: true,
    });
    expect(ownerTargetSlashFile?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-validation-specificity")).toMatchObject({
      passed: true,
    });

    const exactOwnerFilesSentence = setup!.qualityEvaluator?.evaluate([
      baseOutput,
      "**Exact owner files.**",
      "- `packs/agentic-skills-bench/claude/benchmark-agent-review/SKILL.md`",
      "- `packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md`",
      "- `tests/layer4/setups/packs/pack-workflows.setup.ts`",
      "**Validation check.** Add a layer4 setup test that feeds placeholder residual-risk content and asserts a below-ceiling score.",
      "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
    ].join("\n"));
    expect(exactOwnerFilesSentence?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-remediation-owner-target")).toMatchObject({
      passed: true,
    });
    expect(exactOwnerFilesSentence?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-validation-specificity")).toMatchObject({
      passed: true,
    });

    const ownerTargetOwnerFileTable = setup!.qualityEvaluator?.evaluate([
      baseOutput,
      "| Finding | Classification | Owner target / owner file | Proposed behavior change | Validation check | Route |",
      "|---|---|---|---|---|---|",
      "| Placeholder residual risks are accepted. | target-skill contract | `packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md` and `packs/agentic-skills-bench/claude/benchmark-agent-review/SKILL.md` | Require retained artifact placeholder risks to name a remediation owner and proof. | Contract validation must fail unless output mentions `ship-manifest.md` placeholder text and includes owner target, proposed change, and validation check. | `$targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap` |",
      "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
    ].join("\n"));
    expect(ownerTargetOwnerFileTable?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-remediation-owner-target")).toMatchObject({
      passed: true,
    });
    expect(ownerTargetOwnerFileTable?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-validation-specificity")).toMatchObject({
      passed: true,
    });

    const exactOwnerTargetFilesTable = setup!.qualityEvaluator?.evaluate([
      baseOutput,
      "| Finding | Classification | Exact owner target / files | Proposed behavior change | Validation check | Route |",
      "|---|---|---|---|---|---|",
      "| Placeholder monitoring text is not operationalized. | retained-evidence gap | `packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md`; `packs/agentic-skills-bench/claude/benchmark-agent-review/SKILL.md`; `tests/layer4/setups/packs/pack-workflows.setup.ts` | Require reviewers to inspect retained artifact text before grading. | Focused fixture assertion must require `ship-manifest.md`, `Residual Risks`, an exact owner file, and a validation check tied to rejecting placeholder output. | `$targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap` |",
      "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
    ].join("\n"));
    expect(exactOwnerTargetFilesTable?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-remediation-owner-target")).toMatchObject({
      passed: true,
    });
    expect(exactOwnerTargetFilesTable?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-validation-specificity")).toMatchObject({
      passed: true,
    });

    const scopedOwnerWithLookup = setup!.qualityEvaluator?.evaluate([
      baseOutput,
      "Remediation table:",
      "Owner target: benchmark-agent-review owner surface; lookup needed to confirm exact file before patching.",
      "Proposed behavior change: require retained artifact placeholder risks to name a remediation owner and proof.",
      "Validation check: add a focused layer1 assertion for placeholder residual-risk output.",
      "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
    ].join("\n"));
    expect(scopedOwnerWithLookup?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-remediation-owner-target")).toMatchObject({
      passed: true,
    });

    const broadOwnerQuality = setup!.qualityEvaluator?.evaluate([
      "# Pack Benchmark Output",
      "Pack: agentic-skills-bench",
      "Skill: benchmark-agent-review",
      "Evidence: pack-input.md and fixtures/local-evidence.md show ship-manifest.md has Residual Risks: Not captured.",
      "Subjective score differs from deterministic quality.",
      "Remediation table:",
      "Owner target: benchmark-agent-review skill behavior.",
      "Proposed behavior change: require retained artifact placeholder risks to name a remediation owner and proof.",
      "Validation check: add a focused layer1 assertion for placeholder residual-risk output.",
      "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
    ].join("\n"));
    expect(broadOwnerQuality?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-remediation-owner-target")).toMatchObject({
      passed: false,
    });

    const broadQuality = setup!.qualityEvaluator?.evaluate([
      "# Pack Benchmark Output",
      "Pack: agentic-skills-bench",
      "Skill: benchmark-agent-review",
      "Evidence: pack-input.md and fixtures/local-evidence.md show ship-manifest.md has Residual Risks: Not captured.",
      "Subjective score differs from deterministic quality.",
      "Risk: update the skill and tighten the rubric.",
      "Validation: rerun the fixture.",
      "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
    ].join("\n"));
    expect(broadQuality?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-remediation-owner-target")).toMatchObject({
      passed: false,
    });
    expect(broadQuality?.criteria.find((criterion) => criterion.id === "benchmark-agent-review-validation-specificity")).toMatchObject({
      passed: false,
    });
    expect(broadQuality?.criticalFailures).toContain("benchmark-agent-review-validation-specificity");

    writeFileSync(
      resolve(workDir, "pack-benchmark-output.md"),
      `${baseOutput}Recommended next command: /targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap\n`,
    );
    const codexAssertionsWithClaudeRoute = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["pack-benchmark-output.md"],
      },
      { agent: "codex" },
    );
    expect(
      codexAssertionsWithClaudeRoute.find(
        (assertion) =>
          assertion.description === "Output recommends $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
      ),
    ).toMatchObject({ pass: false });

    writeFileSync(
      resolve(workDir, "pack-benchmark-output.md"),
      `${baseOutput}Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap\n`,
    );
    const codexAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["pack-benchmark-output.md"],
      },
      { agent: "codex" },
    );
    expect(
      codexAssertions.find(
        (assertion) =>
          assertion.description === "Output recommends $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
      ),
    ).toMatchObject({ pass: true });

    for (const route of ["$targeted-skill-builder", "$benchmark-agent-review", "$ship-end", "$expert-review"]) {
      writeFileSync(resolve(workDir, "pack-benchmark-output.md"), `${baseOutput}Recommended next command: ${route}\n`);
      const genericAssertions = setup!.assertResult(
        {
          stdout: "",
          stderr: "",
          exitCode: 0,
          workDir,
          files: ["pack-benchmark-output.md"],
        },
        { agent: "codex" },
      );
      expect(
        genericAssertions.find(
          (assertion) =>
            assertion.description === "Output recommends $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
        ),
      ).toMatchObject({ pass: false });
    }

    const nextRouteCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "pack-next-route");
    expect(
      nextRouteCriterion?.evaluate(
        "Recommended next command: /targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
      ),
    ).toMatchObject({ score: 1 });
    expect(
      nextRouteCriterion?.evaluate(
        "Recommended next command: $targeted-skill-builder benchmark-agent-review residual-risk-awareness output-quality gap",
      ),
    ).toMatchObject({ score: 1 });
    expect(nextRouteCriterion?.evaluate("Recommended next command: $targeted-skill-builder")).toMatchObject({ score: 0 });
  });

  it("requires runner-aware next-route coverage for content-programming", () => {
    const setup = resolveBenchSetup("content-programming");
    const target = resolveBenchTarget("content-programming");

    expect(setup?.skill).toBe("content-programming");
    expect(target).toMatchObject({
      skill: "content-programming",
      coverageStatus: "custom",
      setupPath: "tests/layer4/setups/packs/pack-workflows.setup.ts",
    });
    expect(setup?.prompt).toContain("literal final handoff label accepted by the harness");
    expect(setup?.prompt).toContain("claude: /series-spec");
    expect(setup?.prompt).toContain("codex: $series-spec");
    expect(setup?.prompt).toContain("durable pillars with audience jobs");
    expect(setup?.prompt).toContain("portfolio balance across acquisition, trust, proof, education, and retention");
    expect(setup?.prompt).toContain("measurement plan with warning signs");
    expect(setup?.prompt).toContain("cleanup or refactor plan for stale content");
    expect(setup?.prompt).toContain("next series candidates to specify");

    const workDir = mkdtempSync(resolve(tmpdir(), "content-programming-route-"));
    writeFileSync(
      resolve(workDir, "pack-benchmark-output.md"),
      [
        "# Pack Benchmark Output",
        "",
        "Pack: creator-foundation",
        "Skill: content-programming",
        "This content programming strategy uses local-fixture evidence.",
        "Pillars: build-in-public notes, implementation tradeoffs, and shipped artifact proof.",
        "Formats: build note, decision log, demo walkthrough, and monthly retro.",
        "Portfolio balance: acquisition, trust, proof, education, and retention.",
        "Measurement plan: cadence completion, evidence coverage, artifact readiness, and warning signs.",
        "Cleanup/refactor plan: update stale setup walkthroughs.",
        "Next series candidate: local-first benchmark workflow.",
        "Evidence: Audience wants practical build notes; Cadence target: weekly.",
        "Risk: weekly cadence may exceed production capacity.",
        "",
        "Recommended next skill: /series-spec",
      ].join("\n"),
    );

    const claudeAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["pack-benchmark-output.md"],
      },
      { agent: "claude" },
    );
    expect(claudeAssertions.find((assertion) => assertion.description === "Output recommends /series-spec")).toMatchObject({
      pass: true,
    });

    const codexAssertionsWithClaudeRoute = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["pack-benchmark-output.md"],
      },
      { agent: "codex" },
    );
    expect(
      codexAssertionsWithClaudeRoute.find((assertion) => assertion.description === "Output recommends $series-spec"),
    ).toMatchObject({
      pass: false,
    });

    writeFileSync(
      resolve(workDir, "pack-benchmark-output.md"),
      [
        "# Pack Benchmark Output",
        "",
        "Pack: creator-foundation",
        "Skill: content-programming",
        "This content programming strategy uses local-fixture evidence.",
        "Pillars: build-in-public notes, implementation tradeoffs, and shipped artifact proof.",
        "Formats: build note, decision log, demo walkthrough, and monthly retro.",
        "Portfolio balance: acquisition, trust, proof, education, and retention.",
        "Measurement plan: cadence completion, evidence coverage, artifact readiness, and warning signs.",
        "Cleanup/refactor plan: update stale setup walkthroughs.",
        "Next series candidate: local-first benchmark workflow.",
        "Evidence: Audience wants practical build notes; Cadence target: weekly.",
        "Risk: weekly cadence may exceed production capacity.",
        "",
        "Recommended next skill: $series-spec",
      ].join("\n"),
    );

    const codexAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["pack-benchmark-output.md"],
      },
      { agent: "codex" },
    );
    expect(codexAssertions.find((assertion) => assertion.description === "Output recommends $series-spec")).toMatchObject({
      pass: true,
    });

    const nextRouteCriterion = setup!.qualityEvaluator?.rubric.criteria.find((criterion) => criterion.id === "pack-next-route");
    expect(nextRouteCriterion?.evaluate("Recommended next skill: /series-spec")).toMatchObject({
      score: 1,
    });
    expect(nextRouteCriterion?.evaluate("Recommended next skill: $series-spec")).toMatchObject({
      score: 1,
    });
    expect(nextRouteCriterion?.evaluate("Recommended next command: $run")).toMatchObject({
      score: 0,
    });
    expect(nextRouteCriterion?.evaluate("Next: $series-spec")).toMatchObject({
      score: 0,
    });

    writeFileSync(
      resolve(workDir, "pack-benchmark-output.md"),
      [
        "# Pack Benchmark Output",
        "",
        "Pack: creator-foundation",
        "Skill: content-programming",
        "This content programming calendar uses local-fixture evidence.",
        "Evidence: Audience wants practical build notes; Cadence target: weekly.",
        "Risk: weekly cadence may exceed production capacity.",
        "",
        "Recommended next skill: /series-spec",
      ].join("\n"),
    );
    const calendarOnlyAssertions = setup!.assertResult(
      {
        stdout: "",
        stderr: "",
        exitCode: 0,
        workDir,
        files: ["pack-benchmark-output.md"],
      },
      { agent: "claude" },
    );
    expect(calendarOnlyAssertions.find((assertion) => assertion.description === "Output covers durable pillars")).toMatchObject({
      pass: false,
    });
    expect(calendarOnlyAssertions.find((assertion) => assertion.description === "Output covers measurement plan")).toMatchObject({
      pass: false,
    });
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
        "Prototype gate: keep this as a clickable prototype with fixture data; defer database, auth, payments, analytics, deployment, admin, multi-tenant, and observability infrastructure until calibration evidence justifies promotion.",
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
        "`fixtures/local-evidence.md` confirms local deterministic evidence.",
        "`pack-input.md` covers Retention notes and Packaging notes.",
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

  it("accepts concrete fixture references for content-programming evidence quality", () => {
    const setup = CUSTOM_BENCH_SETUPS["content-programming"];
    const evaluator = setup.qualityEvaluator;

    expect(evaluator).toBeDefined();

    const fixtureCited = evaluator!.evaluate(
      [
        "# content-programming",
        "",
        "Pack: creator-foundation",
        "Skill: content-programming",
        "Focus: creator content programming strategy for a creator platform workflow.",
        "Pillars: build-in-public notes, implementation tradeoffs, and shipped artifact proof.",
        "Formats: build note, decision log, demo walkthrough, and monthly retro.",
        "Portfolio balance: acquisition, trust, proof, education, and retention.",
        "Measurement plan: cadence completion, evidence coverage, artifact readiness, and warning signs.",
        "Cleanup/refactor plan: update stale setup walkthroughs.",
        "Next series candidate: local-first benchmark workflow.",
        "Fixture strategy facts: build-in-public notes; implementation tradeoffs; shipped artifact proof; stale setup walkthroughs.",
        "Fixture evidence: `fixtures/local-evidence.md` confirms local deterministic evidence.",
        "`pack-input.md` states Audience wants practical build notes and Cadence target: weekly.",
        "Risk: cadence may need validation against real audience evidence and provenance.",
        "Recommended next skill: /series-spec",
        "",
      ].join("\n"),
    );
    const generic = evaluator!.evaluate(
      [
        "# content-programming",
        "",
        "Pack: creator-foundation",
        "Skill: content-programming",
        "This creator calendar is based on local evidence and a weekly cadence.",
        "Recommended next skill: /series-spec",
        "",
      ].join("\n"),
    );

    expect(fixtureCited.criticalFailures).not.toContain("pack-fixture-evidence");
    expect(fixtureCited.passed).toBe(true);
    expect(generic.criticalFailures).toContain("pack-fixture-evidence");
  });

  it("scores content-programming full-contract coverage beyond calendar-only output", () => {
    const setup = CUSTOM_BENCH_SETUPS["content-programming"];
    const evaluator = setup.qualityEvaluator;

    expect(evaluator).toBeDefined();

    const fullStrategy = evaluator!.evaluate(
      [
        "# content-programming",
        "",
        "Pack: creator-foundation",
        "Skill: content-programming",
        "Pillars: build-in-public notes, implementation tradeoffs, and shipped artifact proof.",
        "Formats: build note, decision log, demo walkthrough, and monthly retro.",
        "Portfolio balance: acquisition, trust, proof, education, and retention.",
        "Measurement plan: cadence completion, evidence coverage, artifact readiness, and warning signs.",
        "Cleanup/refactor plan: update stale setup walkthroughs.",
        "Next series candidate: local-first benchmark workflow.",
        "Fixture strategy facts: build-in-public notes; implementation tradeoffs; shipped artifact proof; stale setup walkthroughs.",
        "`pack-input.md` states Audience wants practical build notes and Cadence target: weekly.",
        "`fixtures/local-evidence.md` confirms local deterministic evidence.",
        "Risk: weekly cadence may exceed production capacity.",
        "Recommended next skill: $series-spec",
      ].join("\n"),
    );
    const calendarOnly = evaluator!.evaluate(
      [
        "# content-programming",
        "",
        "Pack: creator-foundation",
        "Skill: content-programming",
        "Creator content programming calendar for practical build notes.",
        "`pack-input.md` states Audience wants practical build notes and Cadence target: weekly.",
        "`fixtures/local-evidence.md` confirms local deterministic evidence.",
        "Risk: weekly cadence may exceed production capacity.",
        "Recommended next skill: $series-spec",
      ].join("\n"),
    );

    expect(fullStrategy.criteria.find((criterion) => criterion.id === "content-programming-full-contract")).toMatchObject({
      score: 1,
    });
    expect(fullStrategy.criteria.find((criterion) => criterion.id === "content-programming-fixture-strategy-facts")).toMatchObject({
      score: 1,
    });
    expect(calendarOnly.criteria.find((criterion) => criterion.id === "content-programming-full-contract")).toMatchObject({
      score: 0,
    });
    expect(calendarOnly.score).toBeLessThan(fullStrategy.score);
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
