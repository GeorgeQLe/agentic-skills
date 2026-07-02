import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const mirrors = [
  {
    name: "codex",
    uat: "packs/product-testing/codex/uat/SKILL.md",
    logicWiring: "packs/product-design/codex/logic-wiring/SKILL.md",
    consolidate: "packs/product-design/codex/consolidate-prototypes/SKILL.md",
    uatCommand: "$uat --variant-evaluation",
    consolidateCommand: "$consolidate-prototypes",
    uiCommand: "$ui-interview uxv-alignment-page-review-change-first-revision-workspace",
  },
  {
    name: "claude",
    uat: "packs/product-testing/claude/uat/SKILL.md",
    logicWiring: "packs/product-design/claude/logic-wiring/SKILL.md",
    consolidate: "packs/product-design/claude/consolidate-prototypes/SKILL.md",
    uatCommand: "/uat --variant-evaluation",
    consolidateCommand: "/consolidate-prototypes",
    uiCommand: "/ui-interview uxv-alignment-page-review-change-first-revision-workspace",
  },
] as const;

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

function sectionFrom(content: string, start: string) {
  const marker = `\n${start}\n`;
  const markerIndex = content.lastIndexOf(marker);
  expect(markerIndex, `missing section marker: ${start}`).toBeGreaterThanOrEqual(0);
  const startIndex = markerIndex + 1;
  const nextHeadingIndex = content.indexOf("\n## ", startIndex + start.length);
  return content.slice(startIndex, nextHeadingIndex === -1 ? undefined : nextHeadingIndex);
}

describe("post-UAT consolidation routing", () => {
  it("keeps logic-wiring handoffs routed only to UAT after prototype approval", () => {
    for (const mirror of mirrors) {
      const content = read(mirror.logicWiring);
      const nextWork = sectionFrom(content, "## Next Work");
      const agentRouting = sectionFrom(content, "## Invoke With YAML");

      expect(nextWork, mirror.name).toContain(`route the built variants only to \`${mirror.uatCommand}\``);
      expect(nextWork, mirror.name).toContain("Consolidation is a later decision owned by the UAT evidence");
      expect(nextWork, mirror.name).toContain("approved but unbuilt or deferred UX/UI branches");

      expect(agentRouting, mirror.name).toContain(mirror.uatCommand);
      expect(agentRouting, mirror.name).toContain("Do not include");
      expect(agentRouting, mirror.name).toContain(mirror.consolidateCommand);
      expect(agentRouting, mirror.name).toContain("explicit MVP-scope decision");
      expect(agentRouting, mirror.name).not.toContain("once evaluation evidence exists");
    }
  });

  it("requires UAT output to classify readiness and single-variant MVP scope explicitly", () => {
    for (const mirror of mirrors) {
      const content = read(mirror.uat);

      expect(content, mirror.name).toContain("built + evaluated");
      expect(content, mirror.name).toContain("built + not run");
      expect(content, mirror.name).toContain("approved but unbuilt/deferred");
      expect(content, mirror.name).toContain("explicitly excluded from MVP");
      expect(content, mirror.name).toContain("No built MVP-scope result log is still `Not run`");
      expect(content, mirror.name).toContain("Every approved but unbuilt/deferred branch is explicitly excluded");
      expect(content, mirror.name).toContain("the user explicitly chose a single-variant MVP");
      expect(content, mirror.name).toContain("manual UAT/evidence capture");
      expect(content, mirror.name).toContain(mirror.consolidateCommand);
    }
  });

  it("hardens consolidate-prototypes against missing evidence and unhandled deferred branches", () => {
    for (const mirror of mirrors) {
      const content = read(mirror.consolidate);

      expect(content, mirror.name).toContain("Stop if `research/uat-variant-evaluation-[topic].md`");
      expect(content, mirror.name).toContain("says `not ready`");
      expect(content, mirror.name).toContain("includes unchecked items");
      expect(content, mirror.name).toContain("contains only `Not run`, skipped, deferred, or spec-only result logs");
      expect(content, mirror.name).toContain("Stop while any built MVP-scope branch has `Status: Not run`");
      expect(content, mirror.name).toContain("approved UX/UI variants are unbuilt or deferred");
      expect(content, mirror.name).toContain("exclude/defer them from MVP scope, build/evaluate them first, or include them only as spec references");
      expect(content, mirror.name).toContain("single-variant MVP");
      expect(content, mirror.name).toContain(mirror.uiCommand);
    }
  });

  it("documents reusable readiness as UAT evidence plus explicit unbuilt branch handling", () => {
    const designTree = read("docs/design-tree-loop-convention.md");
    const nextSteps = read("docs/skill-next-step-contracts.md");

    expect(designTree).toContain("Consolidation readiness requires recorded UAT evidence");
    expect(designTree).toContain("explicit handling of every approved branch");
    expect(designTree).toContain("A single-variant MVP is");
    expect(designTree).toContain("valid only when the user explicitly chooses");

    expect(nextSteps).toContain("readiness requires recorded UAT evidence plus explicit handling of unbuilt/deferred approved branches");
    expect(nextSteps).toContain("Single-variant MVP convergence requires the user's explicit scope choice");
  });
});
