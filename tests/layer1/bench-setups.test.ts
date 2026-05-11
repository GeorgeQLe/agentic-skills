import { describe, expect, it } from "vitest";
import {
  benchmarkCoverageMatrix,
  discoverRepositorySkills,
  validateBenchmarkCoverage,
  type BenchCoverageRow,
} from "../harness/bench-coverage.js";
import { CUSTOM_BENCH_SETUPS, resolveBenchSetup, supportedBenchSkills } from "../harness/bench-setups.js";

describe("benchmark setup registry", () => {
  it("lists repository skills as benchmarkable targets", () => {
    expect(supportedBenchSkills()).toContain("design-system");
    expect(supportedBenchSkills()).toContain("run");
  });

  it("uses custom setup for skills with domain-specific assertions", () => {
    expect(resolveBenchSetup("design-system")).toBe(CUSTOM_BENCH_SETUPS["design-system"]);
  });

  it("uses a generic smoke setup for repository skills without custom assertions", () => {
    const setup = resolveBenchSetup("run");

    expect(setup?.skill).toBe("run");
    expect(setup).not.toBe(CUSTOM_BENCH_SETUPS.run);
  });

  it("does not resolve unknown skills", () => {
    expect(resolveBenchSetup("not-a-real-skill")).toBeUndefined();
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
