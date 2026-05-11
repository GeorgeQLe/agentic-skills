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
      },
      {
        path: "packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md",
        command: "$benchmark-test-skill",
        customCoverageRoute: "$targeted-skill-builder <SKILL> benchmark coverage",
        failureRoute: "$session-triage <skill> benchmark failure",
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
      expect(content, `${contract.path} report verification`).toContain("After writing the report, verify the file exists");
      expect(content, `${contract.path} final route output`).toContain("Do not omit the final next-step route.");
      expect(content, `${contract.path} custom coverage route`).toContain(contract.customCoverageRoute);
      expect(content, `${contract.path} failure route`).toContain(contract.failureRoute);
    }
  });

  it("accepts the committed matrix for every repository skill", () => {
    const result = validateBenchmarkCoverage();

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("fails when a repository skill is missing from the matrix", () => {
    const rows = benchmarkCoverageMatrix().filter((row) => row.skill !== "run");
    const result = validateBenchmarkCoverage(rows, discoverRepositorySkills());

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Repository skill "run" is missing from benchmark coverage matrix.');
  });

  it("fails when a matrix row is duplicated or does not match a repository skill", () => {
    const duplicate = benchmarkCoverageMatrix().find((row) => row.skill === "run");
    const rows = [
      ...benchmarkCoverageMatrix(),
      { ...duplicate!, skill: "not-a-repository-skill" },
      duplicate!,
    ];
    const result = validateBenchmarkCoverage(rows, discoverRepositorySkills());

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Duplicate benchmark coverage row for skill "run".');
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

    expect(resolveBenchTarget("run")).toMatchObject({
      skill: "run",
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
      ["bench", "--skill", "run", "--agent", "codex", "--runs", "0", "--chunk-size", "1", "--pause", "0"],
      {
        cwd: TESTS_ROOT,
        encoding: "utf8",
      },
    );

    expect(listOutput).toContain("run\tcoverage=custom setup=tests/layer4/setups/tier1-workflows.setup.ts");
    expect(listOutput).toContain("deploy\tcoverage=blocked reason=Requires environment-specific deploy credentials");
    expect(runOutput).toContain("Benchmark coverage for run: custom");
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
