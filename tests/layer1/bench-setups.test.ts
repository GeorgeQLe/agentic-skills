import { describe, expect, it } from "vitest";
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
