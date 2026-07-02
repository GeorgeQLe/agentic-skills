import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const mirrors = [
  {
    path: "packs/business-ops/codex/reconcile-research/SKILL.md",
    command: "$research-amend",
  },
  {
    path: "packs/business-ops/claude/reconcile-research/SKILL.md",
    command: "/research-amend",
  },
] as const;

describe("reconcile-research next-step routing", () => {
  for (const mirror of mirrors) {
    it(`${mirror.path} recommends research-amend only for bounded findings`, () => {
      const content = readFileSync(resolve(ROOT, mirror.path), "utf8");

      expect(content).toContain(`recommend \`${mirror.command}\` for the affected artifact instead of a full rerun`);
      expect(content).toContain("isolated Error/Warning findings");
      expect(content).toContain("bounded low/medium amendment");
      expect(content).toContain("one missed competitor");
      expect(content).toContain("one corrected source fact");
      expect(content).toContain("Preserve rerun recommendations for conflict clusters");
      expect(content).toContain("upstream category/ICP/strategy changes");
      expect(content).toContain("broad source staleness");
      expect(content).toContain("anything requiring re-synthesis");
    });
  }
});
