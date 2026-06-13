import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const mirrors = [
  {
    path: resolve(TESTS_ROOT, "../packs/customer-lifecycle/codex/journey-map/SKILL.md"),
    packInstall: "npx skillpacks install business-growth",
    hook: "$hook-model",
    positioning: "$positioning",
    userFlow: "$user-flow-map",
    lifecycleMetrics: "$lifecycle-metrics",
    metrics: "$metrics",
    commands: [
      "$onboarding-map",
      "$conversion-map",
      "$transaction-map",
      "$retention-map",
      "$expansion-map",
      "$lifecycle-metrics",
      "$value-prop-canvas",
      "$lean-canvas",
      "$monetization",
      "$gtm",
      "$growth-model",
    ],
  },
  {
    path: resolve(TESTS_ROOT, "../packs/customer-lifecycle/claude/journey-map/SKILL.md"),
    packInstall: "npx skillpacks install business-growth",
    hook: "/hook-model",
    positioning: "/positioning",
    userFlow: "/user-flow-map",
    lifecycleMetrics: "/lifecycle-metrics",
    metrics: "/metrics",
    commands: [
      "/onboarding-map",
      "/conversion-map",
      "/transaction-map",
      "/retention-map",
      "/expansion-map",
      "/lifecycle-metrics",
      "/value-prop-canvas",
      "/lean-canvas",
      "/monetization",
      "/gtm",
      "/growth-model",
    ],
  },
];

function section(content: string, heading: string): string {
  return content.match(new RegExp(`(?:^|\\n)#{2,3} (?:\\d+\\. )?${heading}[^\\n]*[\\s\\S]*?(?=\\n#{2,3} |$)`))?.[0] ?? "";
}

describe("journey-map routing", () => {
  it("evaluates optional research triggers before ordinary positioning and user-flow routing", () => {
    for (const mirror of mirrors) {
      const content = readFileSync(mirror.path, "utf8");
      const routing = section(content, "Next Steps");

      const triggerIndex = routing.indexOf("Blocking optional research trigger");
      const positioningIndex = routing.indexOf(mirror.positioning);
      const userFlowIndex = routing.indexOf(mirror.userFlow);

      expect(triggerIndex, `${mirror.path} should classify optional triggers`).toBeGreaterThanOrEqual(0);
      expect(positioningIndex, `${mirror.path} should still route to positioning`).toBeGreaterThanOrEqual(0);
      expect(userFlowIndex, `${mirror.path} should still route to user-flow-map`).toBeGreaterThanOrEqual(0);
      expect(triggerIndex, `${mirror.path} should check triggers before positioning`).toBeLessThan(
        positioningIndex,
      );
      expect(positioningIndex, `${mirror.path} should keep positioning before user-flow-map`).toBeLessThan(userFlowIndex);
    }
  });

  it("routes habit-suitable repeat-use risk through business-growth before hook-model", () => {
    for (const mirror of mirrors) {
      const content = readFileSync(mirror.path, "utf8");
      const triggerMap = section(content, "Optional Research Trigger Map");
      const repeatUseRow = triggerMap.match(
        /Product value depends on repeat use[\s\S]*?(?=\n\| Expansion,|\n\n|$)/,
      )?.[0];

      expect(repeatUseRow, `${mirror.path} should document repeat-use hook routing`).toBeTruthy();
      expect(repeatUseRow, `${mirror.path} should mention ${mirror.packInstall}`).toContain(mirror.packInstall);
      expect(repeatUseRow, `${mirror.path} should mention ${mirror.hook}`).toContain(mirror.hook);
      expect(
        repeatUseRow!.indexOf(mirror.packInstall),
        `${mirror.path} should install business-growth before recommending hook-model`,
      ).toBeLessThan(repeatUseRow!.indexOf(mirror.hook));
      expect(repeatUseRow, `${mirror.path} should keep hook-model pre-user-flow`).toContain(
        `before \`${mirror.userFlow}\``,
      );
    }
  });

  it("skips hook-model for enterprise, infrastructure, transactional, or infrequent products", () => {
    for (const mirror of mirrors) {
      const content = readFileSync(mirror.path, "utf8");
      const triggerMap = section(content, "Optional Research Trigger Map");
      const repeatUseRow = triggerMap.match(
        /Product value depends on repeat use[\s\S]*?(?=\n\| Expansion,|\n\n|$)/,
      )?.[0];
      const instrumentationRow = triggerMap.match(
        /Stage instrumentation[\s\S]*?(?=\n\| Product value depends|\n\n|$)/,
      )?.[0];

      expect(repeatUseRow, `${mirror.path} should document hook skip conditions`).toMatch(
        /Do not force this on B2B\/enterprise, infrastructure, transactional, or naturally infrequent products/i,
      );
      expect(repeatUseRow, `${mirror.path} should route infrequent products to lifecycle metrics`).toContain(
        mirror.lifecycleMetrics,
      );
      expect(repeatUseRow, `${mirror.path} should allow broader metrics when needed`).toContain(mirror.metrics);
      expect(instrumentationRow, `${mirror.path} should prefer measurement over hook-model for infrequent products`).toContain(
        `Prefer this over \`${mirror.hook}\``,
      );
    }
  });

  it("maps optional journey triggers to existing framework/model skills", () => {
    for (const mirror of mirrors) {
      const content = readFileSync(mirror.path, "utf8");
      const triggerMap = section(content, "Optional Research Trigger Map");

      for (const command of mirror.commands) {
        expect(triggerMap, `${mirror.path} should route to existing ${command}`).toContain(command);
      }
      expect(triggerMap, `${mirror.path} should name Strategyzer ownership`).toMatch(/Strategyzer-style framework/i);
      expect(triggerMap, `${mirror.path} should name Lean Canvas ownership`).toMatch(/Ash Maurya Lean Canvas/i);
      expect(triggerMap, `${mirror.path} should name Reforge ownership`).toMatch(/Reforge-style framework owner/i);
    }
  });

  it("documents the optional hook-model detour in AFPS docs", () => {
    const contract = readFileSync(resolve(TESTS_ROOT, "../docs/skill-next-step-contracts.md"), "utf8");
    const matrix = readFileSync(resolve(TESTS_ROOT, "../docs/pack-workflow-matrix.md"), "utf8");
    const workflow = readFileSync(resolve(TESTS_ROOT, "../docs/codex-workflow.md"), "utf8");

    for (const content of [contract, matrix, workflow]) {
      expect(content).toMatch(/hook-model/i);
      expect(content).toMatch(/repeat use|habit formation|engagement loops/i);
      expect(content).toMatch(/not mandatory|not required|Use .* only when|only when/i);
      expect(content).toMatch(/enterprise|infrastructure|transactional|naturally infrequent/i);
    }
  });
});
