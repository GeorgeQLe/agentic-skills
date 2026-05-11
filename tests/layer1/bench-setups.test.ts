import { describe, expect, it } from "vitest";
import { BENCH_SETUPS, supportedBenchSkills } from "../harness/bench-setups.js";

describe("benchmark setup registry", () => {
  it("lists supported benchmark targets explicitly", () => {
    expect(supportedBenchSkills()).toEqual([
      "design-system",
      "design-system-draftstonk",
    ]);
  });

  it("does not register run until it has layer2 and layer4 benchmark coverage", () => {
    expect(BENCH_SETUPS.run).toBeUndefined();
  });
});

