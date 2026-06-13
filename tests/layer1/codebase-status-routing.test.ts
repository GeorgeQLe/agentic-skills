import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const mirrors = [
  {
    path: resolve(TESTS_ROOT, "../global/codex/codebase-status/SKILL.md"),
    install: "npx skillpacks install customer-lifecycle",
    journey: "$journey-map",
    exec: "$exec",
    ship: "$ship",
    brainstorm: "$brainstorm",
  },
  {
    path: resolve(TESTS_ROOT, "../global/claude/codebase-status/SKILL.md"),
    install: "npx skillpacks install customer-lifecycle",
    journey: "/journey-map",
    exec: "/exec",
    ship: "/ship",
    brainstorm: "/brainstorm",
  },
];

describe("codebase-status routing", () => {
  it("requires canonical routing evidence before product research recommendations", () => {
    for (const mirror of mirrors) {
      const content = readFileSync(mirror.path, "utf8");

      expect(content, `${mirror.path} should read the pack workflow matrix`).toContain(
        "docs/pack-workflow-matrix.md",
      );
      expect(content, `${mirror.path} should read the skill next-step contracts`).toContain(
        "docs/skill-next-step-contracts.md",
      );
      expect(content, `${mirror.path} should consult last completed skill routing`).toMatch(
        /last completed relevant research\/product skill[\s\S]*## Next Steps[\s\S]*contract/i,
      );
    }
  });

  it("keeps AFPS routing order and optional detours explicit", () => {
    for (const mirror of mirrors) {
      const content = readFileSync(mirror.path, "utf8");
      const routeBlock = content.match(/canonical AFPS route[\s\S]*?roadmap`/)?.[0] ?? content;
      const journeyIndex = routeBlock.indexOf("journey-map");
      const positioningIndex = routeBlock.indexOf("positioning");
      const uxIndex = routeBlock.indexOf("ux-variations");

      expect(journeyIndex, `${mirror.path} should mention journey-map`).toBeGreaterThanOrEqual(0);
      expect(positioningIndex, `${mirror.path} should mention positioning`).toBeGreaterThanOrEqual(0);
      expect(uxIndex, `${mirror.path} should mention ux-variations`).toBeGreaterThanOrEqual(0);
      expect(journeyIndex, `${mirror.path} should route journey-map before positioning`).toBeLessThan(
        positioningIndex,
      );
      expect(positioningIndex, `${mirror.path} should route positioning before ux-variations`).toBeLessThan(
        uxIndex,
      );
      expect(content, `${mirror.path} should call detours optional`).toMatch(
        /value-prop-canvas`? and `?lean-canvas`? as optional risk-driven detours only/i,
      );
      expect(content, `${mirror.path} should not make detours default blockers`).not.toMatch(
        /journey-map\s*->\s*value-prop-canvas\s*->\s*positioning\s*->\s*lean-canvas/i,
      );
    }
  });

  it("routes missing journey-map through customer-lifecycle pack install when unavailable", () => {
    for (const mirror of mirrors) {
      const content = readFileSync(mirror.path, "utf8");
      const missingJourneyBranch = content.match(
        /If `research\/icp\.md` and `research\/competitive-analysis\.md` exist[\s\S]*?(?=\n {5}- If |\n {3}- `|\n## |$)/,
      )?.[0];

      expect(missingJourneyBranch, `${mirror.path} should document missing journey-map routing`).toBeTruthy();
      expect(missingJourneyBranch, `${mirror.path} should mention ${mirror.install}`).toContain(mirror.install);
      expect(missingJourneyBranch, `${mirror.path} should mention ${mirror.journey}`).toContain(mirror.journey);
      const installIndex = missingJourneyBranch!.indexOf(mirror.install);
      const directJourneyIndex = missingJourneyBranch!.indexOf(mirror.journey, installIndex + mirror.install.length);
      expect(
        installIndex,
        `${mirror.path} should install customer-lifecycle before direct journey-map routing`,
      ).toBeLessThan(directJourneyIndex);
    }
  });

  it("keeps execution, shipping, and exhausted-work phase boundaries", () => {
    for (const mirror of mirrors) {
      const content = readFileSync(mirror.path, "utf8");

      expect(content, `${mirror.path} should route actionable task work through the approved artifact`).toContain(
        "actionable implementation work, recommend the approved task artifact route",
      );
      expect(content, `${mirror.path} should route finished unshipped work to ship`).toContain(
        `recommend \`${mirror.ship}\``,
      );
      expect(content, `${mirror.path} should route exhausted work to brainstorm`).toContain(
        `recommend \`${mirror.brainstorm}\``,
      );
    }
  });
});
