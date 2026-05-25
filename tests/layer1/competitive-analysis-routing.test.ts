import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("competitive-analysis routing", () => {
  it("routes missing journey-map through customer-lifecycle pack install when unavailable", () => {
    const checks = [
      {
        path: resolve(TESTS_ROOT, "../packs/business-discovery/codex/competitive-analysis/SKILL.md"),
        install: "$pack install customer-lifecycle",
        journey: "recommend `$journey-map`",
      },
      {
        path: resolve(TESTS_ROOT, "../packs/business-discovery/claude/competitive-analysis/SKILL.md"),
        install: "/pack install customer-lifecycle",
        journey: "recommend `/journey-map`",
      },
    ];

    for (const check of checks) {
      const content = readFileSync(check.path, "utf8");
      const missingJourneyBranch = content.match(
        /IF no `research\/journey-map\.md`:[\s\S]*?(?=\n(?:\d+\.| {2}\d+\.|[-*] )|$)/,
      )?.[0];

      expect(content, `${check.path} should mention ${check.install}`).toContain(check.install);
      expect(missingJourneyBranch, `${check.path} should document missing journey-map routing`).toBeTruthy();
      expect(missingJourneyBranch, `${check.path} should mention ${check.install}`).toContain(check.install);
      expect(missingJourneyBranch, `${check.path} should mention ${check.journey}`).toContain(check.journey);
      expect(
        missingJourneyBranch!.indexOf(check.install),
        `${check.path} should install customer-lifecycle before direct journey-map routing`,
      ).toBeLessThan(missingJourneyBranch!.indexOf(check.journey));
    }
  });

  it("keeps standard routing journey-first before value-prop-canvas", () => {
    const checks = [
      {
        path: resolve(TESTS_ROOT, "../packs/business-discovery/codex/competitive-analysis/SKILL.md"),
        first: "$journey-map",
        second: "$value-prop-canvas",
      },
      {
        path: resolve(TESTS_ROOT, "../packs/business-discovery/claude/competitive-analysis/SKILL.md"),
        first: "/journey-map",
        second: "/value-prop-canvas",
      },
      {
        path: resolve(TESTS_ROOT, "../docs/skill-next-step-contracts.md"),
        first: "journey-map",
        second: "value-prop-canvas",
      },
      {
        path: resolve(TESTS_ROOT, "../packs/business-discovery/PACK.md"),
        first: "journey-map",
        second: "value-prop-canvas",
      },
    ];

    for (const check of checks) {
      const content = readFileSync(check.path, "utf8");
      const firstIndex = content.indexOf(check.first);
      const secondIndex = content.indexOf(check.second);
      expect(firstIndex, `${check.path} should mention ${check.first}`).toBeGreaterThanOrEqual(0);
      expect(secondIndex, `${check.path} should mention ${check.second}`).toBeGreaterThanOrEqual(0);
      expect(firstIndex, `${check.path} should route to journey-map before value-prop-canvas`).toBeLessThan(secondIndex);
    }
  });
});
