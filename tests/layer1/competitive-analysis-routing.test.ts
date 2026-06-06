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

  it("keeps AFPS route order journey-map before positioning before user-flow-map", () => {
    const checks = [
      {
        path: resolve(TESTS_ROOT, "../packs/business-discovery/codex/competitive-analysis/SKILL.md"),
        first: "$journey-map",
        second: "$positioning",
        third: "$user-flow-map",
      },
      {
        path: resolve(TESTS_ROOT, "../packs/business-discovery/claude/competitive-analysis/SKILL.md"),
        first: "/journey-map",
        second: "/positioning",
        third: "/user-flow-map",
      },
      {
        path: resolve(TESTS_ROOT, "../docs/skill-next-step-contracts.md"),
        first: "journey-map",
        second: "positioning",
        third: "user-flow-map",
      },
      {
        path: resolve(TESTS_ROOT, "../packs/business-discovery/PACK.md"),
        first: "journey-map",
        second: "positioning",
        third: "user-flow-map",
      },
    ];

    for (const check of checks) {
      const content = readFileSync(check.path, "utf8");
      const routeBlock =
        content.match(/Standard mode next steps:[\s\S]*?(?=\n\*\*Concept-validation mode next steps:)/)?.[0] ??
        content.match(/\*\*Standard mode:\*\*\n- RECOMMEND[\s\S]*?(?=\n\*\*Impact-aware adjustments:)/)?.[0] ??
        content.match(/- RECOMMEND the first matching item:[\s\S]*?(?=\nAny `\/spec-interview` recommendation)/)?.[0] ??
        content.match(/Default AFPS business-product route:[\s\S]*?\n/)?.[0] ??
        content.match(/Default flow:[\s\S]*?```text[\s\S]*?```/)?.[0] ??
        content;
      const firstIndex = routeBlock.indexOf(check.first);
      const secondIndex = routeBlock.indexOf(check.second);
      const thirdIndex = routeBlock.indexOf(check.third);
      expect(firstIndex, `${check.path} should mention ${check.first}`).toBeGreaterThanOrEqual(0);
      expect(secondIndex, `${check.path} should mention ${check.second}`).toBeGreaterThanOrEqual(0);
      expect(thirdIndex, `${check.path} should mention ${check.third}`).toBeGreaterThanOrEqual(0);
      expect(firstIndex, `${check.path} should route journey-map before positioning`).toBeLessThan(secondIndex);
      expect(secondIndex, `${check.path} should route positioning before user-flow-map`).toBeLessThan(thirdIndex);
    }
  });

  it("keeps value-prop-canvas and lean-canvas optional detours instead of default route blockers", () => {
    const checks = [
      resolve(TESTS_ROOT, "../packs/business-discovery/PACK.md"),
      resolve(TESTS_ROOT, "../docs/skill-next-step-contracts.md"),
      resolve(TESTS_ROOT, "../packs/business-discovery/codex/value-prop-canvas/SKILL.md"),
      resolve(TESTS_ROOT, "../packs/business-discovery/codex/lean-canvas/SKILL.md"),
      resolve(TESTS_ROOT, "../packs/business-discovery/claude/value-prop-canvas/SKILL.md"),
      resolve(TESTS_ROOT, "../packs/business-discovery/claude/lean-canvas/SKILL.md"),
    ];

    for (const path of checks) {
      const content = readFileSync(path, "utf8");
      expect(content, `${path} should call value-prop-canvas/lean-canvas optional`).toMatch(/optional/i);
      expect(content, `${path} should not describe optional detours as default blockers`).not.toMatch(
        /journey-map\s*->\s*value-prop-canvas\s*->\s*positioning\s*->\s*lean-canvas/i,
      );
    }
  });

  it("keeps research-roadmap from routing positioning before journey or spec-interview before UX/prototype gates", () => {
    const checks = [
      resolve(TESTS_ROOT, "../packs/research-admin/codex/research-roadmap/SKILL.md"),
      resolve(TESTS_ROOT, "../packs/research-admin/claude/research-roadmap/SKILL.md"),
    ];

    for (const path of checks) {
      const content = readFileSync(path, "utf8");
      const orderBlock = content.match(/Within research items[\s\S]*?```[\s\S]*?```/)?.[0] ?? "";
      const journeyIndex = orderBlock.indexOf("journey-map");
      const positioningIndex = orderBlock.indexOf("positioning");
      const uxIndex = orderBlock.indexOf("ux-variations");
      const prototypeIndex = orderBlock.indexOf("prototype");
      const specIndex = orderBlock.indexOf("spec-interview");

      expect(orderBlock, `${path} should expose research dependency order`).toBeTruthy();
      expect(journeyIndex, `${path} order should mention journey-map`).toBeGreaterThanOrEqual(0);
      expect(positioningIndex, `${path} order should mention positioning`).toBeGreaterThanOrEqual(0);
      expect(uxIndex, `${path} order should mention ux-variations`).toBeGreaterThanOrEqual(0);
      expect(prototypeIndex, `${path} order should mention prototype`).toBeGreaterThanOrEqual(0);
      expect(specIndex, `${path} order should mention spec-interview`).toBeGreaterThanOrEqual(0);
      expect(journeyIndex, `${path} should place journey-map before positioning`).toBeLessThan(positioningIndex);
      expect(positioningIndex, `${path} should place positioning before ux-variations`).toBeLessThan(uxIndex);
      expect(uxIndex, `${path} should place ux-variations before spec-interview`).toBeLessThan(specIndex);
      expect(prototypeIndex, `${path} should place prototype before spec-interview`).toBeLessThan(specIndex);
    }
  });
});
