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
import { resolveBenchTarget } from "../harness/bench-setups.js";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function rowsWithSkillPatch(
  skill: string,
  patch: Partial<BenchCoverageRow>,
): BenchCoverageRow[] {
  return benchmarkCoverageMatrix().map((row): BenchCoverageRow => (
    row.skill === skill ? { ...row, ...patch } : row
  ));
}

describe("benchmark coverage contract", () => {
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
