import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
for (const runner of ["claude", "codex"]) {
  describe(`${runner} run continuation contract`, () => {
    const text = readFileSync(resolve(root, `global/${runner}/run/SKILL.md`), "utf8");
    it("continues after ordinary checkpoints while preserving explicit scope", () => {
      expect(text).toContain("## Continuous execution contract");
      expect(text).toContain("Do not end a turn merely to recommend another run command");
      expect(text).toContain("Use `--step` to stop after one step or `--phase` to stop after one phase");
      expect(text).not.toMatch(/Then stop and let the user decide|Do NOT execute more than one step|Single Step Mode \(default\)/);
    });
    it("preserves authorization and works around independent blockers", () => {
      expect(text).toContain("A blocked item blocks its dependents, not unrelated authorized work");
      expect(text).toContain("Never bypass a safety boundary");
      expect(text).toContain("not authorization for paid actions, deployment or destructive changes");
      expect(text).toContain("Never widen packet scope");
      expect(text).toContain("explicit scope or stopping instruction takes precedence");
    });
  });
}

for (const name of ["AGENTS.md", "CLAUDE.md"]) {
  it(`${name} does not reintroduce routine step handoffs`, () => {
    const text = readFileSync(resolve(root, name), "utf8");
    expect(text).toContain("## Continuous Execution");
    expect(text).not.toContain("Check in before starting implementation");
    expect(text).not.toContain("hands a dirty tracked tree to");
  });
}
