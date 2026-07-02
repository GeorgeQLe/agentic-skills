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

      expect(content, mirror.name).toContain("## Handoff Verification");
      expect(content, mirror.name).toContain("continue-design-branch");
      expect(content, mirror.name).toContain("manual-uat-needed");
      expect(content, mirror.name).toContain("single-variant-convergence-needs-explicit-scope");
      expect(content, mirror.name).toContain("ready-for-consolidation");
      expect(content, mirror.name).toContain("Use conservative routing when artifacts conflict");
      expect(content, mirror.name).toContain("Do not use `research/.progress.yaml` for UX branch state, prototype readiness, UAT status, or consolidation readiness");
      expect(content, mirror.name).toContain("Handoff verification:");
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

      expect(content, mirror.name).toContain("## Handoff Verification");
      expect(content, mirror.name).toContain("continue-design-branch");
      expect(content, mirror.name).toContain("manual-uat-needed");
      expect(content, mirror.name).toContain("single-variant-convergence-needs-explicit-scope");
      expect(content, mirror.name).toContain("ready-for-consolidation");
      expect(content, mirror.name).toContain("Proceed with consolidation only after the classification is `ready-for-consolidation`");
      expect(content, mirror.name).toContain("If artifacts are contradictory, choose the conservative route");
      expect(content, mirror.name).toContain("Do not use `research/.progress.yaml` for UX branch state, prototype readiness, UAT status, or consolidation readiness");
      expect(content, mirror.name).toContain("Handoff verification: ready-for-consolidation");
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

    expect(designTree).toContain("### Handoff Verification");
    expect(designTree).toContain("continue-design-branch");
    expect(designTree).toContain("manual-uat-needed");
    expect(designTree).toContain("single-variant-convergence-needs-explicit-scope");
    expect(designTree).toContain("ready-for-consolidation");
    expect(designTree).toContain("If artifacts are missing, stale, or contradictory, choose the conservative route");
    expect(designTree).toContain("Consolidation readiness requires recorded UAT evidence");
    expect(designTree).toContain("explicit handling of every approved branch");
    expect(designTree).toContain("A single-variant MVP is");
    expect(designTree).toContain("valid only when the user explicitly chooses");
    expect(designTree).toContain("Do not use `research/.progress.yaml` for UX branch state");
    expect(designTree).toContain("prototype readiness, UAT status, or consolidation readiness");
    expect(designTree).not.toContain("source of truth is `research/.progress.yaml`");
    expect(designTree).not.toContain("store consolidation readiness in `research/.progress.yaml`");

    expect(nextSteps).toContain("Before any terminal handoff names `consolidate-prototypes`, the producing skill must emit Handoff Verification");
    expect(nextSteps).toContain("readiness requires recorded UAT evidence plus explicit handling of unbuilt/deferred approved branches");
    expect(nextSteps).toContain("Single-variant MVP convergence requires the user's explicit scope choice");
    expect(nextSteps).toContain("`research/.progress.yaml` must not be used for UAT/prototype/consolidation readiness");
    expect(nextSteps).not.toContain("source of truth is `research/.progress.yaml`");
    expect(nextSteps).not.toContain("store consolidation readiness in `research/.progress.yaml`");
  });

  it("keeps logic-wiring pre-final handoffs on conservative UAT routing", () => {
    for (const mirror of mirrors) {
      const content = read(mirror.logicWiring);
      const nextWork = sectionFrom(content, "## Next Work");
      const agentRouting = sectionFrom(content, "## Invoke With YAML");

      expect(content, mirror.name).toContain("## Handoff Verification");
      expect(content, mirror.name).toContain("continue-design-branch");
      expect(content, mirror.name).toContain("manual-uat-needed");
      expect(content, mirror.name).toContain("single-variant-convergence-needs-explicit-scope");
      expect(content, mirror.name).toContain("ready-for-consolidation");
      expect(content, mirror.name).toContain("Do not use `research/.progress.yaml` for UX branch state, prototype readiness, UAT status, or consolidation readiness");
      expect(nextWork, mirror.name).toContain("Handoff verification: manual-uat-needed");
      expect(agentRouting, mirror.name).toContain("Run Handoff Verification immediately before emitting this payload");
    }
  });
});
