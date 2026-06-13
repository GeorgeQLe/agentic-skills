import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const REPO_ROOT = new URL("../..", import.meta.url).pathname;

function runAudit(args: string[]): string {
  return execFileSync("node", ["scripts/skill-alignment-routing-audit.mjs", ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
}

describe("skill alignment routing audit", () => {
  it("validates fixture behavior for alignment/YAML routing", () => {
    let output = "";
    try {
      output = runAudit(["--fixtures", "tests/fixtures/skill-alignment-routing"]);
    }
    catch (error) {
      output = String((error as { stdout?: Buffer | string }).stdout ?? "");
    }

    expect(output).toContain("Fixture SKILL.md files scanned: 4");
    expect(output).toContain("non-exec-direct-exec-handoff");
    expect(output).toContain("missing-alignment-yaml-stop-contract");
    expect(output).toContain("invalid/non-exec-recommends-exec/SKILL.md");
    expect(output).toContain("invalid/preapproval-routing/SKILL.md");
    expect(output).not.toContain("valid/game-no-exec/SKILL.md");
    expect(output).not.toContain("valid/exec-loop-allowed/SKILL.md");
  });

  it("keeps active skill contracts free of direct exec handoffs before approval", () => {
    const output = runAudit(["--report"]);

    expect(output).toContain("Active SKILL.md files scanned:");
    expect(output).toContain("Alignment-routing findings: 0");
  });
});
