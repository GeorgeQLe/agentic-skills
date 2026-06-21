import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

const mirrors = ["codex", "claude"] as const;
const command = {
  codex: "$",
  claude: "/",
} as const;

describe("product-design flow tree artifact boundaries", () => {
  it("defines a machine-readable design flow-tree manifest schema (v0.2)", () => {
    const schema = JSON.parse(read("design/flow-tree.schema.json"));

    expect(schema.properties.schema_version.const).toBe("v0.2");
    expect(schema.properties.route.prefixItems.map((item: { const: string }) => item.const)).toEqual([
      "user-flow-map",
      "ux-variations",
      "ui-interview",
      "prototype",
      "consolidate-variations",
      "spec-interview",
    ]);
    expect(schema.properties.mode.enum).toEqual(["flat", "product-path"]);
    // v0.2: `modify` feeds validation decisions back up the tree.
    expect(schema.$defs.decision.properties.decision.enum).toEqual(["approve", "reject", "retry", "modify"]);
    // A `modify` decision must name the upstream node(s) to re-open.
    const modifyRule = schema.$defs.decision.allOf?.[0];
    expect(modifyRule?.if?.properties?.decision?.const).toBe("modify");
    expect(modifyRule?.then?.required).toContain("targets");
    // v0.2: per-user-flow-branch model attachment replaces the top-level model_tree_ref as primary.
    expect(schema.$defs.user_flow_branch.properties.model_ref).toBeDefined();
    expect(schema.properties.model_tree_ref).toBeDefined();
    // v0.2: UI review child nodes renamed to UI experiments.
    expect(schema.$defs.ux_variation_branch.required).toContain("ui_experiments");
    expect(schema.$defs.ux_variation_branch.properties.ui_experiments.items.$ref).toBe("#/$defs/ui_experiment");
    expect(schema.$defs.ui_experiment).toBeDefined();
    expect(schema.$defs.prototype_build_item.required).toContain("ui_experiment_id");
    expect(schema.properties.prototype_build_plan.$ref).toBe("#/$defs/prototype_build_plan");
    expect(schema.$defs.prototype_build_status.enum).toEqual([
      "pending",
      "built",
      "needs-revision",
      "deferred",
      "dropped",
    ]);
  });

  it("ships a v0.2 sample manifest exercising model_ref and modify-back decisions", () => {
    const sample = read("design/flow-tree-sample.yaml");
    expect(sample).toContain("schema_version: v0.2");
    // per-branch model attachment round-trips
    expect(sample).toContain("model_ref: design/model-tree-invoice-approval-submit-and-approve.yaml");
    // renamed UI experiment nodes + build-plan linkage
    expect(sample).toContain("ui_experiments:");
    expect(sample).toContain("ui_experiment_id: wizard-stepper");
    // modify decision feeds back up to the model + user-flow branch
    expect(sample).toContain("decision: modify");
    expect(sample).toMatch(/targets:\s*\n\s*- design\/model-tree-invoice-approval-submit-and-approve\.yaml/);

    const modelSample = read("design/model-tree-sample.yaml");
    expect(modelSample).toContain("schema_version: v0.2");
    expect(modelSample).toContain("user_flow_branch_ref: submit-and-approve");
  });

  it("routes pre-prototype flow maps, UX variations, and UI branch packets through design artifacts", () => {
    for (const mirror of mirrors) {
      const userFlow = read(`packs/product-design/${mirror}/user-flow-map/SKILL.md`);
      const uxVariations = read(`packs/product-design/${mirror}/ux-variations/SKILL.md`);
      const uiInterview = read(`packs/product-design/${mirror}/ui-interview/SKILL.md`);
      const prototype = read(`packs/product-design/${mirror}/prototype/SKILL.md`);
      const consolidate = read(`packs/product-design/${mirror}/consolidate-variations/SKILL.md`);
      const sigil = command[mirror];

      expect(userFlow).toContain("design/flow-tree.schema.json");
      expect(userFlow).toContain("design/flow-tree-[topic].yaml");
      expect(userFlow).toContain("design/{slug}/flow-tree-[topic].yaml");
      expect(userFlow).toContain("design/user-flow-[topic].md");
      expect(userFlow).toContain("design/prototype-build-plan-[topic].md");
      expect(userFlow).toContain(`${sigil}user-flow-map`);
      expect(userFlow).toContain(`${sigil}ux-variations [specific-user-flow]`);
      expect(userFlow).toContain(`${sigil}user-flow-map --prototype-build-plan [topic]`);
      expect(userFlow).not.toContain("`specs/user-flow-[topic].md`");

      expect(uxVariations).toContain("design/flow-tree.schema.json");
      expect(uxVariations).toContain("design/ux-variations-[topic].md");
      expect(uxVariations).toContain("design/user-flow-[topic].md");
      expect(uxVariations).toContain("design/ui-requirements-[topic].md");
      expect(uxVariations).toContain(`${sigil}ui-interview [specific-ux-variation]`);
      expect(uxVariations).not.toContain("`specs/ux-variations-[topic].md`");
      expect(uxVariations).not.toContain("`specs/user-flow-[topic].md`");

      expect(uiInterview).toContain("design/flow-tree.schema.json");
      expect(uiInterview).toContain("design/ui-[topic].md");
      expect(uiInterview).toContain("design/ui-requirements-[topic].md");
      expect(uiInterview).toContain("approve/reject/retry");
      expect(uiInterview).toContain(`${sigil}ux-variations [specific-user-flow]`);
      expect(uiInterview).not.toContain("`specs/ui-[topic].md`");
      expect(uiInterview).not.toContain("`specs/ui-requirements-[topic].md`");

      expect(prototype).toContain("design/ux-variations-[topic].md");
      expect(prototype).toContain("design/ui-[topic].md");
      expect(prototype).toContain("design/prototype-build-plan-[topic].md");
      expect(prototype).toContain("design/**/flow-tree-*.yaml");
      expect(prototype).toContain("pending");
      expect(prototype).toContain("needs-revision");
      expect(prototype).toContain("deferred");
      expect(prototype).toContain("dropped");
      expect(prototype).toContain("prototypes/{topic}/variation-{N}/");
      expect(prototype).not.toContain("`specs/ux-variations-[topic].md`");
      expect(prototype).not.toContain("`specs/user-flow-[topic].md`");
      expect(prototype).not.toContain("`specs/ui-[topic].md`");

      expect(consolidate).toContain("design/ux-variations-[topic].md");
      expect(consolidate).toContain("design/ui-requirements-[topic].md");
      expect(consolidate).toContain("design/flow-tree-[topic].yaml");
      expect(consolidate).toContain("prototypes/{topic}/consolidated/");
      expect(consolidate).not.toContain("`specs/ux-variations-[topic].md`");
      expect(consolidate).not.toContain("`specs/ui-requirements-[topic].md`");
    }
  });

  it("keeps research progress manifests out of ordinary UX branch state", () => {
    for (const mirror of mirrors) {
      for (const skill of ["user-flow-map", "ux-variations", "ui-interview"] as const) {
        const content = read(`packs/product-design/${mirror}/${skill}/SKILL.md`);
        expect(content, `${mirror}/${skill} should reserve research progress for product paths`).toMatch(
          /research\/\.progress\.yaml.*product-path|product-path.*research\/\.progress\.yaml|Do not use `research\/\.progress\.yaml` for ordinary UX branch/,
        );
      }
    }
  });

  it("keeps spec-interview as the post-prototype production spec writer", () => {
    for (const mirror of mirrors) {
      const specInterview = read(`packs/product-design/${mirror}/spec-interview/SKILL.md`);

      expect(specInterview).toContain("design/**/flow-tree-*.yaml");
      expect(specInterview).toContain("Keep `specs/` as the canonical output directory");
      expect(specInterview).toContain("`specs/[topic].md`");
      expect(specInterview).not.toContain("`design/[topic].md`");
    }
  });

  it("preserves the mirrored AFPS product-design route through prototype consolidation and specs", () => {
    const expectedRoute =
      "user-flow-map -> state-model [topic] (optional sibling) -> ux-variations [specific-user-flow] -> ui-interview [specific-ux-variation] -> user-flow-map --prototype-build-plan [topic] -> prototype -> uat --variant-evaluation -> consolidate-variations -> research-roadmap --post-prototype -> spec-interview";

    expect(read("docs/skill-next-step-contracts.md")).toContain(expectedRoute);

    for (const mirror of mirrors) {
      const userFlow = read(`packs/product-design/${mirror}/user-flow-map/SKILL.md`);
      const uxVariations = read(`packs/product-design/${mirror}/ux-variations/SKILL.md`);
      const uiInterview = read(`packs/product-design/${mirror}/ui-interview/SKILL.md`);
      const sigil = command[mirror];

      expect(userFlow).toContain(`${sigil}user-flow-map`);
      expect(userFlow).toContain(`${sigil}ux-variations [specific-user-flow]`);
      expect(uxVariations).toContain(`${sigil}ui-interview [specific-ux-variation]`);
      expect(uiInterview).toContain(`${sigil}user-flow-map --prototype-build-plan [topic]`);
      expect(uiInterview).toContain("route based on the branch decision");
      expect(uiInterview).toContain("prototype build ledger");
      expect(uiInterview).not.toContain(`recommend ${sigil}roadmap`);
    }
  });
});
