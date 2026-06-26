import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");
const DESIGN_TREE_LOOP_GENERATOR = resolve(ROOT, "scripts/upgrade-design-tree-loop.mjs");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");
const between = (content: string, start: string, end: string) => {
  const startIndex = content.indexOf(start);
  expect(startIndex, `missing start marker: ${start}`).toBeGreaterThanOrEqual(0);
  const endIndex = content.indexOf(end, startIndex + start.length);
  expect(endIndex, `missing end marker: ${end}`).toBeGreaterThan(startIndex);
  return content.slice(startIndex, endIndex);
};
const expectContainsAll = (content: string, expected: string[]) => {
  for (const value of expected) {
    expect(content).toContain(value);
  }
};
const collectUiExperimentKeys = (content: string) => {
  const keys = new Set<string>();
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    const markerMatch = lines[i].match(/^(\s*)ui_experiments:\s*$/);
    if (!markerMatch) continue;

    const markerIndent = markerMatch[1].length;
    let propertyIndent: number | null = null;

    for (let j = i + 1; j < lines.length; j += 1) {
      const line = lines[j];
      if (line.trim() === "" || line.trimStart().startsWith("#")) continue;

      const indent = line.match(/^\s*/)?.[0].length ?? 0;
      if (indent <= markerIndent) break;

      const dashKey = line.match(/^(\s*)-\s+([A-Za-z_][A-Za-z0-9_]*):/);
      if (dashKey) {
        propertyIndent = dashKey[1].length + 2;
        keys.add(dashKey[2]);
        continue;
      }

      const propertyKey = line.match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*):/);
      if (propertyKey && propertyIndent !== null && propertyKey[1].length === propertyIndent) {
        keys.add(propertyKey[2]);
      }
    }
  }

  return [...keys].sort();
};

const mirrors = ["codex", "claude"] as const;
const command = {
  codex: "$",
  claude: "/",
} as const;

describe("product-design flow tree artifact boundaries", () => {
  it("defines a machine-readable design flow-tree manifest schema (v0.3)", () => {
    const schema = JSON.parse(read("design/flow-tree.schema.json"));

    expect(schema.properties.schema_version.const).toBe("v0.3");
    expect(schema.properties.route.prefixItems.map((item: { const: string }) => item.const)).toEqual([
      "user-flow-map",
      "ux-variations",
      "ui-interview",
      "prototype",
      "consolidate-prototypes",
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
    expect(schema.$defs.ui_experiment.additionalProperties).toBe(false);
    expect(schema.$defs.ui_experiment.properties.experiment_path).toEqual({
      type: "string",
      minLength: 1,
      description: "Repo-relative route or experiment directory path for a clickable UI experiment output.",
    });
    expect(schema.$defs.ui_experiment.properties.review_evidence).toEqual({
      type: "string",
      minLength: 1,
      description: "Concise evidence note or repo-relative review artifact proving the clickable UI experiment was reviewed.",
    });
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

  it("requires deterministic branch-order metadata on flow-tree branches", () => {
    const schema = JSON.parse(read("design/flow-tree.schema.json"));
    const userFlowBranch = schema.$defs.user_flow_branch;
    const uxVariationBranch = schema.$defs.ux_variation_branch;
    const progressiveReview = schema.$defs.progressive_review_guidance;

    expect(userFlowBranch.required).toEqual(
      expect.arrayContaining(["journey_stage", "journey_sequence", "priority_rationale", "progressive_review"]),
    );
    expect(userFlowBranch.properties.journey_stage.enum).toEqual([
      "discovery",
      "activation",
      "first-value",
      "ongoing-use",
      "recovery",
      "handoff",
    ]);
    expect(userFlowBranch.properties.journey_sequence.type).toBe("integer");
    expect(userFlowBranch.properties.journey_sequence.minimum).toBe(1);
    expect(userFlowBranch.properties.priority_rationale.minLength).toBe(1);
    expect(userFlowBranch.properties.progressive_review.$ref).toBe("#/$defs/progressive_review_guidance");

    expect(uxVariationBranch.required).toEqual(
      expect.arrayContaining([
        "evaluation_priority",
        "activation_fit",
        "first_value_fit",
        "priority_rationale",
        "progressive_review",
      ]),
    );
    expect(uxVariationBranch.properties.evaluation_priority.type).toBe("integer");
    expect(uxVariationBranch.properties.evaluation_priority.minimum).toBe(1);
    expect(uxVariationBranch.properties.activation_fit.enum).toEqual(["high", "medium", "low"]);
    expect(uxVariationBranch.properties.first_value_fit.enum).toEqual(["high", "medium", "low"]);
    expect(uxVariationBranch.properties.priority_rationale.minLength).toBe(1);
    expect(uxVariationBranch.properties.progressive_review.$ref).toBe("#/$defs/progressive_review_guidance");

    expect(progressiveReview.required).toEqual(
      expect.arrayContaining([
        "first_value_step",
        "primary_task_path",
        "staged_disclosure_notes",
        "evidence_required",
      ]),
    );
    expect(progressiveReview.properties.first_value_step.minLength).toBe(1);
    expect(progressiveReview.properties.primary_task_path.minLength).toBe(1);
    expect(progressiveReview.properties.staged_disclosure_notes.minLength).toBe(1);
    expect(progressiveReview.properties.evidence_required.items.minLength).toBe(1);
  });

  it("ships a v0.3 sample manifest exercising ordering metadata and modify-back decisions", () => {
    const sample = read("design/flow-tree-sample.yaml");
    expect(sample).toContain("schema_version: v0.3");
    // per-branch model attachment round-trips
    expect(sample).toContain("model_ref: design/model-tree-invoice-approval-submit-and-approve.yaml");
    expectContainsAll(sample, [
      "journey_stage: activation",
      "journey_sequence: 1",
      "priority_rationale:",
      "progressive_review:",
      "first_value_step:",
      "primary_task_path:",
      "staged_disclosure_notes:",
      "evidence_required:",
      "evaluation_priority: 1",
      "activation_fit: high",
      "first_value_fit: high",
    ]);
    expect(sample).toMatch(/branch_order_override:|user_override:|override_rationale:/);
    // renamed UI experiment nodes + build-plan linkage
    expect(sample).toContain("ui_experiments:");
    expect(sample).toContain("ui_experiment_id: wizard-stepper");
    expect(sample).toContain("experiment_path: experiments/invoice-approval/wizard-stepper/");
    expect(sample).toContain("review_evidence: alignment/create-ui-experiment-invoice-approval.html#wizard-stepper-review");
    const schema = JSON.parse(read("design/flow-tree.schema.json"));
    const uiExperimentKeys = collectUiExperimentKeys(sample);
    for (const key of uiExperimentKeys) {
      expect(Object.keys(schema.$defs.ui_experiment.properties)).toContain(key);
    }
    expect(uiExperimentKeys).not.toContain("label");
    // modify decision feeds back up to the model + user-flow branch
    expect(sample).toContain("decision: modify");
    expect(sample).toMatch(/targets:\s*\n\s*- design\/model-tree-invoice-approval-submit-and-approve\.yaml/);

    const modelSample = read("design/model-tree-sample.yaml");
    expect(modelSample).toContain("schema_version: v0.2");
    expect(modelSample).toContain("user_flow_branch_ref: submit-and-approve");
  });

  it("requires mirrored user-flow maps to order branches by journey progression and persist overrides", () => {
    for (const mirror of mirrors) {
      const userFlow = read(`packs/product-design/${mirror}/user-flow-map/SKILL.md`);

      expectContainsAll(userFlow, [
        "Order `branches[]` by journey progression by default",
        "Record explicit user branch-order overrides in `design/user-flow-[topic].md`",
        "Record explicit user branch-order overrides in `design/user-flow-[topic]-interview.md`",
        "Persist branch order override metadata in `design/**/flow-tree-*.yaml`",
        "`ordered_branch_ids`",
        "`override_rationale`",
        "`recorded_at`",
        "`parent_branch_id`",
        "first value moment",
        "primary task path",
        "progressive review sequence",
      ]);
      expect(userFlow).toContain("discovery or activation before first-value");
      expect(userFlow).not.toContain("activation or setup");
      expect(userFlow).not.toContain("who/what changed and why");
    }
  });

  it("requires mirrored UX variations to select child branches by journey and value priority", () => {
    for (const mirror of mirrors) {
      const uxVariations = read(`packs/product-design/${mirror}/ux-variations/SKILL.md`);

      expect(uxVariations).toContain(
        "Branch selection order: explicit user override, journey_sequence, status, then stable array order.",
      );
      expect(uxVariations).toContain("Do not use raw first-pending array order as the default branch selector.");
      expect(uxVariations).not.toContain("first modelled user-flow branch with no `ux_variations`");
      expect(uxVariations).not.toContain("first modeled user-flow branch with no `ux_variations`");
    }
  });

  it("keeps mirrored UI interview non-buildout and delegates clickable experiments", () => {
    for (const mirror of mirrors) {
      const uiInterview = read(`packs/product-design/${mirror}/ui-interview/SKILL.md`);
      const sigil = command[mirror];

      expectContainsAll(uiInterview, [
        "Write UI branch state to `ui_experiments[]`",
        "Resolve the next UX variation in this order: explicit user override, `evaluation_priority`, first-value/activation fit, status, then stable array order.",
        "Default full UI mode stops at UI requirements, branch packet, static or bounded HTML mockup, and branch decision.",
        `Route approved clickable route experiment needs to ${sigil}create-ui-experiment [approved-ui-experiment]`,
        "Do not write or route default clickable prototype buildout from `ui-interview`.",
      ]);
      expect(uiInterview).not.toContain("first UX variation with no `ui_experiments`");
      expect(uiInterview).not.toContain("ui_reviews[]");
    }
  });

  it("defines mirrored create-ui-experiment contracts as the clickable experiment owner", () => {
    const pack = read("packs/product-design/PACK.md");
    expect(pack).toContain("`create-ui-experiment`: Own clickable UI experiment routes");

    for (const mirror of mirrors) {
      const createUiExperiment = read(`packs/product-design/${mirror}/create-ui-experiment/SKILL.md`);
      const sigil = command[mirror];

      expectContainsAll(createUiExperiment, [
        "name: create-ui-experiment",
        "version: v0.1",
        "Own clickable UI experiment routes or project-native lightweight prototypes",
        "fake, fixture, local, or in-memory data",
        "first-value journey",
        "progressive reveal",
        "`experiment_path`",
        "`review_evidence`",
        `${sigil}prototype`,
        `${sigil}uat --variant-evaluation`,
        `${sigil}user-flow-map --prototype-build-plan`,
      ]);
    }
  });

  it("routes pre-prototype flow maps, UX variations, and UI branch packets through design artifacts", () => {
    for (const mirror of mirrors) {
      const userFlow = read(`packs/product-design/${mirror}/user-flow-map/SKILL.md`);
      const uxVariations = read(`packs/product-design/${mirror}/ux-variations/SKILL.md`);
      const uiInterview = read(`packs/product-design/${mirror}/ui-interview/SKILL.md`);
      const prototype = read(`packs/product-design/${mirror}/prototype/SKILL.md`);
      const consolidate = read(`packs/product-design/${mirror}/consolidate-prototypes/SKILL.md`);
      const sigil = command[mirror];

      expect(userFlow).toContain("design/flow-tree.schema.json");
      expect(userFlow).toContain("design/flow-tree-[topic].yaml");
      expect(userFlow).toContain("design/{slug}/flow-tree-[topic].yaml");
      expect(userFlow).toContain("design/user-flow-[topic].md");
      expect(userFlow).toContain("design/prototype-build-plan-[topic].md");
      expect(userFlow).toContain("approved UI experiment");
      expect(userFlow).toContain("source UI experiment");
      expect(userFlow).toContain("ui_experiment_id");
      expect(userFlow).toContain(`${sigil}user-flow-map`);
      expect(userFlow).toContain(`${sigil}ux-variations [specific-user-flow]`);
      expect(userFlow).toContain(`${sigil}user-flow-map --prototype-build-plan [topic]`);
      expect(userFlow).not.toContain("`specs/user-flow-[topic].md`");
      expect(userFlow).not.toContain("approved UI review");
      expect(userFlow).not.toContain("UI review branch");
      expect(userFlow).not.toContain("source UI review");

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

  it("orders ux-variations branch selection only by user_flow_branch schema fields", () => {
    const schema = JSON.parse(read("design/flow-tree.schema.json"));
    const userFlowBranchProps = new Set(Object.keys(schema.$defs.user_flow_branch.properties));

    // ux-variations selects a user_flow_branch node, so every snake_case
    // tiebreaker it names must be a property of $defs.user_flow_branch (which is
    // additionalProperties:false). activation_fit / first_value_fit /
    // evaluation_priority belong to ux_variation_branch (the children it grows),
    // not the node it selects.
    for (const mirror of mirrors) {
      const content = read(`packs/product-design/${mirror}/ux-variations/SKILL.md`);
      const match = content.match(/Branch selection order: ([^.]+)\./);
      expect(match, `${mirror}/ux-variations should declare a branch selection order`).not.toBeNull();
      const fieldTokens = (match![1].match(/[a-z][a-z0-9]*(?:_[a-z0-9]+)+/g) ?? []);
      expect(fieldTokens.length, `${mirror}/ux-variations should name at least one schema field`).toBeGreaterThan(0);
      for (const token of fieldTokens) {
        expect(
          userFlowBranchProps.has(token),
          `${mirror}/ux-variations selection key "${token}" must be a $defs.user_flow_branch property`,
        ).toBe(true);
      }
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
      expect(specInterview).toContain("Production Ready Approval");
      expect(specInterview).toContain("docs/production-ready-approval.md");
      expect(specInterview).toContain("Do not create a new state database");
      expect(specInterview).not.toContain("`design/[topic].md`");
    }
  });

  it("keeps state-model active paths slash-delimited and aligned across mirrors", () => {
    const codexStateModel = read("packs/product-design/codex/state-model/SKILL.md");

    expect(codexStateModel).toContain("design/{slug}/_working/state-model-{topic}-brief.md");
    expect(codexStateModel).toContain("design/{slug}/state-model-{topic}/{framework}.md");
    expect(codexStateModel).toContain("alignment/state-model-{topic}.html");
    expect(codexStateModel).not.toMatch(
      /design\/\{slug\}\$state-model|alignment\$state-model|_working\$state-model|design\$state-model/,
    );

    for (const mirror of mirrors) {
      const stateModel = read(`packs/product-design/${mirror}/state-model/SKILL.md`);
      expect(stateModel).toContain("design/{slug}/_working/state-model-{topic}-brief.md");
      expect(stateModel).toContain("design/{slug}/state-model-{topic}/{framework}.md");
      expect(stateModel).toContain("alignment/state-model-{topic}.html");
    }
  });

  it("requires progress handoff blocks for chunked product-design self-routing stops", () => {
    for (const mirror of mirrors) {
      for (const skill of ["state-model", "ux-variations"] as const) {
        const content = read(`packs/product-design/${mirror}/${skill}/SKILL.md`);

        expect(content).toContain("Required Progress Handoff Block");
        expect(content).toContain("Progress Handoff");
        expect(content).toMatch(/Completed: <completed (framework|variation) count> \/ <(planned framework|approved variation) count>\./);
        expect(content).toContain("Durable cursor: checked");
        expect(content).toContain("Current phase complete:");
        expect(content).toContain("Next phase:");
        expect(content).toContain("the repeated command is intentional");
        expect(content).toContain("continue in a fresh session");
        expect(content).toContain("Exact next command:");
      }
    }

    const convention = read("docs/design-tree-loop-convention.md");
    expect(convention).toContain("Progress Handoff Block");
    expect(convention).toContain("The block is required even when the next command is the same");
    expect(convention).toContain("Durable cursor");
  });

  it("requires HTML-first canonical writes for chunked design deliverables", () => {
    const convention = read("docs/design-tree-loop-convention.md");

    expect(convention).toContain("HTML-first canonical write rule");
    expect(convention).toMatch(
      /Chunked design skills may write `_working\/` briefs and per-unit Markdown intermediates before\s+approval/,
    );
    expect(convention).toMatch(/The final assembled\s+deliverable remains \*\*proposed review content\*\*/);
    expect(convention).toContain("Canonical `design/**/*.md` and `design/**/*.yaml` writes");
    expect(convention).toMatch(/happen only after that\s+confirmed alignment approval/);

    for (const mirror of mirrors) {
      const stateModel = read(`packs/product-design/${mirror}/state-model/SKILL.md`);
      const uxVariations = read(`packs/product-design/${mirror}/ux-variations/SKILL.md`);

      const statePreApproval = between(
        stateModel,
        "Assemble the per-framework intermediates plus the brief into proposed review content for the alignment page:",
        "On approval (compiled YAML with no unresolved negative feedback):",
      );
      expect(statePreApproval).toContain("Proposed domain model doc content");
      expect(statePreApproval).toContain("Proposed synthesized manifest content");
      expect(statePreApproval).toContain("Build the **one** alignment page");
      expect(statePreApproval).not.toContain("**Canonical doc**");
      expect(statePreApproval).not.toMatch(/Write `design\/domain-model-\{topic\}\.md`/);
      expect(statePreApproval).not.toMatch(/Write `design\/model-tree-\{topic\}\.yaml`/);

      const stateApproval = stateModel.slice(
        stateModel.indexOf("On approval (compiled YAML with no unresolved negative feedback):"),
        stateModel.indexOf("### 5. Next Steps (after synthesis only)"),
      );
      expect(stateApproval).toContain("Write `design/domain-model-{topic}.md` and `design/model-tree-{topic}.yaml`.");
      expect(stateApproval).toContain("Attach the branch-scoped model via `branches[].model_ref`");
      expect(stateApproval).toContain("Write the optional top-level `model_tree_ref` pointer");
      expect(stateApproval).toContain("Append only user-approved glossary terms");
      expect(stateApproval).toContain("Archive the brief and per-framework intermediates");

      const uxSetup = between(
        uxVariations,
        "**Chunked-mode setup handoff**",
        "7. **Specify each approved variation enough to build**",
      );
      expect(uxSetup).toContain("do not initialize or update scoped flow-tree `ux_variations[]` entries before alignment approval");
      expect(uxSetup).not.toContain("Initialize the scoped flow-tree `ux_variations[]` entries");

      const uxAssemble = between(
        uxVariations,
        "**Chunked-mode assemble+approve session**",
        "   - Recommend serial full buildout",
      );
      expect(uxAssemble).toContain("proposed whole-set review content");
      expect(uxAssemble).toContain("build the **one** alignment page before any canonical writes");
      expect(uxAssemble).toContain("On approval, write the final variation plan and interview log");
      expect(uxAssemble).toContain("create or update the scoped flow-tree `ux_variations[]` status/artifact entries");
      expect(uxAssemble).not.toContain("single canonical `design/{slug}/ux-variations-[topic].md`");
      expect(uxAssemble).not.toContain("whole assembled set");

      const uxDeliverablesPreApproval = between(
        uxVariations,
        "## Deliverables",
        "On approval (compiled YAML with no unresolved negative feedback):",
      );
      expect(uxDeliverablesPreApproval).toContain("Before approval, build `alignment/ux-variations-{topic}.html`");
      expect(uxDeliverablesPreApproval).toContain("complete proposed variation plan");
      expect(uxDeliverablesPreApproval).not.toMatch(/Write the variation plan to `design\/ux-variations-\[topic\]\.md`/);

      const uxApproval = between(
        uxVariations,
        "On approval (compiled YAML with no unresolved negative feedback):",
        "### Alignment Page",
      );
      expect(uxApproval).toContain("Write the variation plan to `design/ux-variations-[topic].md`");
      expect(uxApproval).toContain("Write the interview log to `design/ux-variations-[topic]-interview.md`");
      expect(uxApproval).toContain("Update the scoped flow-tree manifest with UX variation branch IDs");
      expect(uxApproval).toContain("Archive the brief and per-variation intermediates");
    }
  });

  it("preserves the mirrored AFPS product-design route through prototype consolidation and specs", () => {
    const expectedRoute =
      "user-flow-map -> state-model [topic] (optional sibling) -> ux-variations [specific-user-flow] -> ui-interview [specific-ux-variation] -> user-flow-map --prototype-build-plan [topic] -> prototype -> uat --variant-evaluation -> consolidate-prototypes -> research-roadmap --post-prototype -> spec-interview";

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

  it("passes the design-tree-loop generator --check drift gate", () => {
    const result = spawnSync(process.execPath, [DESIGN_TREE_LOOP_GENERATOR, "--check"], { encoding: "utf8" });
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("design tree loop bundles checked: 20 skills");
    expect(result.stdout).toContain("0 bundle write(s)");
  });
});
