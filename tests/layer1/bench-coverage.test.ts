import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  benchmarkCoverageMatrix,
  discoverRepositorySkills,
  validateBenchmarkCoverage,
  type BenchCoverageRow,
} from "../harness/bench-coverage.js";
import { resolveBenchTarget } from "../harness/bench-setups.js";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(TESTS_ROOT, "..");

function rowsWithSkillPatch(
  skill: string,
  patch: Partial<BenchCoverageRow>,
): BenchCoverageRow[] {
  return benchmarkCoverageMatrix().map((row): BenchCoverageRow => (
    row.skill === skill ? { ...row, ...patch } : row
  ));
}

describe("benchmark coverage contract", () => {
  it("lints benchmark-test-skill contracts for command routing and report verification", () => {
    const skillContracts = [
      {
        path: "packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md",
        command: "/benchmark-test-skill",
        customCoverageRoute: "/targeted-skill-builder <SKILL> benchmark coverage",
        failureRoute: "/session-triage <skill> benchmark failure",
        reviewRoute: "/benchmark-agent-review <skill>",
      },
      {
        path: "packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md",
        command: "$benchmark-test-skill",
        customCoverageRoute: "$targeted-skill-builder <SKILL> benchmark coverage",
        failureRoute: "$session-triage <skill> benchmark failure",
        reviewRoute: "$benchmark-agent-review <skill>",
      },
    ];

    for (const contract of skillContracts) {
      const content = readFileSync(resolve(REPO_ROOT, contract.path), "utf8");

      expect(content, `${contract.path} active command`).toContain(
        `resolve \`benchmark-test-skill\` as the active command first`,
      );
      expect(content, `${contract.path} pack path`).toContain("packs/agentic-skills-bench");
      expect(content, `${contract.path} trailing argument`).toContain("trailing argument as the skill under test");
      expect(content, `${contract.path} command syntax`).toContain(contract.command);
      expect(content, `${contract.path} direct-run guard`).toContain("never run that skill directly as the benchmark action");
      expect(content, `${contract.path} eligibility preflight`).toContain("pnpm bench --list-skills");
      expect(content, `${contract.path} unknown skill stop`).toContain("Do not run `pnpm verify` or `pnpm bench` for unknown skills.");
      expect(content, `${contract.path} both-agent default`).toContain("Use `--agent both` by default.");
      expect(content, `${contract.path} infrastructure blocked`).toContain("infrastructure-blocked runs, not skill failures");
      expect(content, `${contract.path} repeated false-negative route`).toContain(
        "repeated same-family benchmark false negatives",
      );
      expect(content, `${contract.path} generalization route`).toContain(
        "benchmark repeated false-negative generalization",
      );
      expect(content, `${contract.path} blind rerun guard`).toContain("do not recommend another blind rerun");
      expect(content, `${contract.path} report verification`).toContain("After writing the report, verify the file exists");
      expect(content, `${contract.path} final route output`).toContain("Do not omit the final next-step route.");
      expect(content, `${contract.path} custom coverage route`).toContain(contract.customCoverageRoute);
      expect(content, `${contract.path} failure route`).toContain(contract.failureRoute);
      expect(content, `${contract.path} deterministic boundary`).toMatch(
        /Produce deterministic benchmark evidence only\.|This skill produces deterministic benchmark evidence only\./,
      );
      expect(content, `${contract.path} review handoff`).toContain(contract.reviewRoute);
      expect(content, `${contract.path} separate step`).toContain("as the next separate step");
      expect(content, `${contract.path} subjective review gate`).toContain(
        "subjective output-quality review or remediation planning has not yet been performed",
      );
    }
  });

  it("lints session-triage contracts for repeated benchmark false-negative generalization", () => {
    const skillContracts = [
      {
        path: "packs/session-analytics/claude/session-triage/SKILL.md",
        route: "/targeted-skill-builder",
      },
      {
        path: "packs/session-analytics/codex/session-triage/SKILL.md",
        route: "$targeted-skill-builder",
      },
    ];

    for (const contract of skillContracts) {
      const content = readFileSync(resolve(REPO_ROOT, contract.path), "utf8");

      expect(content, `${contract.path} recent triage check`).toContain(
        "check recent same-skill `benchmark/triage-<skill>-*.md` reports",
      );
      expect(content, `${contract.path} repeated family threshold`).toContain(
        "two or more recent reports classify the same family",
      );
      expect(content, `${contract.path} one-off patch guard`).toContain("stop patching individual phrasings");
      expect(content, `${contract.path} generalized fix`).toContain(
        "generalized rubric, semantic evaluator, fixture-family, or infrastructure-classifier fix",
      );
      expect(content, `${contract.path} family validation`).toContain("positive and negative fixture shapes");
      expect(content, `${contract.path} targeted route`).toContain(contract.route);
    }
  });

  it("lints benchmark-agent-review contracts for remediation-ready handoffs", () => {
    const skillContracts = [
      {
        path: "packs/agentic-skills-bench/claude/benchmark-agent-review/SKILL.md",
        targetedRoute: "/targeted-skill-builder <skill> <specific output-quality gap>",
        shipRoute: "`/ship` only when no remediation is needed",
      },
      {
        path: "packs/agentic-skills-bench/codex/benchmark-agent-review/SKILL.md",
        targetedRoute: "$targeted-skill-builder <skill> <specific output-quality gap>",
        shipRoute: "`$ship` only when no remediation is needed",
      },
    ];

    for (const contract of skillContracts) {
      const content = readFileSync(resolve(REPO_ROOT, contract.path), "utf8");

      expect(content, `${contract.path} remediation handoff`).toContain("Build the remediation handoff");
      expect(content, `${contract.path} weakness conversion`).toContain(
        "Convert every material weakness into a remediation target",
      );
      expect(content, `${contract.path} classification`).toContain(
        "target-skill contract, benchmark rubric, retained-evidence gap, harness/setup issue, or one-off run behavior",
      );
      expect(content, `${contract.path} owner target`).toContain(
        "Name the exact owner file, skill contract, benchmark setup, or report artifact",
      );
      expect(content, `${contract.path} validation proof`).toContain(
        "validation command or contract-lint assertion",
      );
      expect(content, `${contract.path} remediation table`).toContain(
        "Remediation table with finding, classification, owner target, proposed change, validation check, and route",
      );
      expect(content, `${contract.path} definitive next route`).toContain(
        "one definitive remediation selected from the remediation table",
      );
      expect(content, `${contract.path} targeted route`).toContain(contract.targetedRoute);
      expect(content, `${contract.path} ship route guard`).toContain(contract.shipRoute);
      expect(content, `${contract.path} vague handoff guard`).toContain(
        "Do not collapse multiple material weaknesses into a vague handoff",
      );
    }
  });

  it("lints ship contracts to prevent routine self-routing after completion", () => {
    const skillContracts = [
      {
        path: "packs/exec-loop/claude/ship/SKILL.md",
        command: "/ship",
        forbiddenDeployRoute: "/ship --no-deploy",
        executableRoute: "/exec",
      },
      {
        path: "packs/exec-loop/codex/ship/SKILL.md",
        command: "$ship",
        forbiddenDeployRoute: "$ship --no-deploy",
        executableRoute: "$exec",
      },
    ];

    for (const contract of skillContracts) {
      const content = readFileSync(resolve(REPO_ROOT, contract.path), "utf8");

      expect(content, `${contract.path} completed ship guard`).toContain(
        `Never recommend \`${contract.command}\``,
      );
      expect(content, `${contract.path} no-deploy self-route guard`).toContain(contract.forbiddenDeployRoute);
      expect(content, `${contract.path} incomplete retry exception`).toContain(
        "shipping failed before commit/push",
      );
      expect(content, `${contract.path} executable handoff`).toContain(contract.executableRoute);
      expect(content, `${contract.path} route convention`).toContain("Next command");
      expect(content, `${contract.path} blank route guard`).toContain("Do not leave `Next command` blank");
      expect(content, `${contract.path} final contract guard`).toContain("must not self-route back");
    }
  });

  it("accepts the committed matrix for every repository skill", () => {
    const result = validateBenchmarkCoverage();

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("fails when a repository skill is missing from the matrix", () => {
    const rows = benchmarkCoverageMatrix().filter((row) => row.skill !== "exec");
    const result = validateBenchmarkCoverage(rows, discoverRepositorySkills());

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Repository skill "exec" is missing from benchmark coverage matrix.');
  });

  it("fails when a matrix row is duplicated or does not match a repository skill", () => {
    const duplicate = benchmarkCoverageMatrix().find((row) => row.skill === "exec");
    const rows = [
      ...benchmarkCoverageMatrix(),
      { ...duplicate!, skill: "not-a-repository-skill" },
      duplicate!,
    ];
    const result = validateBenchmarkCoverage(rows, discoverRepositorySkills());

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Duplicate benchmark coverage row for skill "exec".');
    expect(result.errors).toContain('Benchmark coverage row "not-a-repository-skill" does not match any repository skill.');
  });

  it("fails when a custom row lacks a setup path or points to a missing setup", () => {
    const missingPath = validateBenchmarkCoverage(
      rowsWithSkillPatch("design-system", { setup_path: "" }),
      discoverRepositorySkills(),
    );
    const missingFile = validateBenchmarkCoverage(
      rowsWithSkillPatch("design-system", { setup_path: "tests/layer4/setups/missing.setup.ts" }),
      discoverRepositorySkills(),
    );

    expect(missingPath.ok).toBe(false);
    expect(missingPath.errors).toContain('Custom benchmark coverage row for "design-system" must include setup_path.');
    expect(missingFile.ok).toBe(false);
    expect(missingFile.errors).toContain(
      'Custom benchmark coverage row for "design-system" points to missing setup_path: tests/layer4/setups/missing.setup.ts.',
    );
  });

  it("fails blocked rows independently when reason or next command is absent", () => {
    const missingReason = validateBenchmarkCoverage(
      rowsWithSkillPatch("deploy", { blocked_reason: "", next_command: "$guide deploy benchmark fixture" }),
      discoverRepositorySkills(),
    );
    const missingNextCommand = validateBenchmarkCoverage(
      rowsWithSkillPatch("deploy", { blocked_reason: "Requires external deploy credentials", next_command: "" }),
      discoverRepositorySkills(),
    );

    expect(missingReason.ok).toBe(false);
    expect(missingReason.errors).toContain('Blocked benchmark coverage row for "deploy" must include blocked_reason.');
    expect(missingReason.errors).not.toContain('Blocked benchmark coverage row for "deploy" must include next_command.');
    expect(missingNextCommand.ok).toBe(false);
    expect(missingNextCommand.errors).toContain('Blocked benchmark coverage row for "deploy" must include next_command.');
    expect(missingNextCommand.errors).not.toContain('Blocked benchmark coverage row for "deploy" must include blocked_reason.');
  });

  it("resolves custom, generic, and blocked coverage statuses", () => {
    const genericRows = rowsWithSkillPatch("deploy", {
      coverage_status: "generic",
      blocked_reason: undefined,
      next_command: undefined,
      setup_path: undefined,
    });

    expect(resolveBenchTarget("exec")).toMatchObject({
      skill: "exec",
      coverageStatus: "custom",
      setupPath: "tests/layer4/setups/tier1-workflows.setup.ts",
    });
    expect(resolveBenchTarget("deploy", genericRows)).toMatchObject({
      skill: "deploy",
      coverageStatus: "generic",
    });
    expect(resolveBenchTarget("deploy")).toMatchObject({
      skill: "deploy",
      coverageStatus: "blocked",
      blockedReason: "Requires environment-specific deploy credentials, possible production safety decisions, and external service state.",
      nextCommand: "$guide deploy benchmark fixture",
    });
  });

  it("keeps generic fallback runnable for a synthetic generic row", () => {
    const genericRows = rowsWithSkillPatch("deploy", {
      coverage_status: "generic",
      blocked_reason: undefined,
      next_command: undefined,
      setup_path: undefined,
    });
    const target = resolveBenchTarget("deploy", genericRows);

    expect(target?.coverageStatus).toBe("generic");
    expect(target?.setup?.skill).toBe("deploy");
    expect(target?.setup?.prompt).toContain("minimal smoke exercise");
  });

  it("reports custom, blocked, and zero-run coverage status through the CLI", () => {
    const listOutput = execFileSync("pnpm", ["bench", "--list-skills"], {
      cwd: TESTS_ROOT,
      encoding: "utf8",
    });
    const runOutput = execFileSync(
      "pnpm",
      ["bench", "--skill", "exec", "--agent", "codex", "--runs", "0", "--chunk-size", "1", "--pause", "0"],
      {
        cwd: TESTS_ROOT,
        encoding: "utf8",
      },
    );

    expect(listOutput).toContain("exec\tcoverage=custom setup=tests/layer4/setups/tier1-workflows.setup.ts");
    expect(listOutput).toContain("deploy\tcoverage=blocked reason=Requires environment-specific deploy credentials");
    expect(runOutput).toContain("Benchmark coverage for exec: custom");
  });

  it("stops blocked coverage before benchmark execution", () => {
    expect(() => execFileSync(
      "pnpm",
      ["bench", "--skill", "deploy", "--agent", "codex", "--runs", "0", "--chunk-size", "1", "--pause", "0"],
      {
        cwd: TESTS_ROOT,
        encoding: "utf8",
        stdio: "pipe",
      },
    )).toThrow(/Benchmark coverage for deploy: blocked/);
  });
});
