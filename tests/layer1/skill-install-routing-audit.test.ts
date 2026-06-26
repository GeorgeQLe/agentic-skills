import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const REPO_ROOT = new URL("../..", import.meta.url).pathname;

function runAudit(args: string[]): string {
  return execFileSync("bash", ["scripts/skill-install-routing-audit.sh", ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
}

describe("skill install routing audit", () => {
  it("validates fixture behavior for npm-aware install guidance", () => {
    const output = runAudit(["--fixtures", "tests/fixtures/skill-install-routing"]);

    expect(output).toContain("Fixture SKILL.md files scanned: 16");
    expect(output).toContain("Fixture findings:");
    expect(output).not.toContain("Fixture expectation failures:");
    expect(output).not.toContain("Allowlist failures:");
  });

  it("keeps the P1 base routing inventory in the active scan", () => {
    const output = runAudit(["--report"]);

    expect(output).toContain("P1 required coverage files: 12/12");
    expect(output).toContain("Active SKILL.md files scanned:");
    expect(output).toContain("Install-routing findings:");
  });
});
