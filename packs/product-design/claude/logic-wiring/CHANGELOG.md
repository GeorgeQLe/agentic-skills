# Changelog

## v0.24 - 2026-07-02

- Removed the post-build `agent_routing` shortcut that mentioned `/consolidate-prototypes` after UAT evidence.
- Clarified that approved prototype previews route only to `/uat --variant-evaluation`, with consolidation deferred to later UAT evidence plus explicit MVP-scope/convergence decisions.

## v0.23 - 2026-07-02

- Added an explicit UAT Pack Availability Guard that routes unavailable `uat` skills through `npx skillpacks install product-testing`.
- Replaced bare `/uat --variant-evaluation` handoffs with plain install-then-run guidance.
- Clarified that `agent_routing` YAML cannot be the only human-facing UAT handoff.

## v0.22 - 2026-07-01

- Added Platform Fit Workshop `platform_probe` handling for thin web/mobile/CLI/API/SDK/extension/desktop/integration/marketplace/game risk probes.
- Allowed schema-backed non-visual probes with `platform_probe.non_visual: true` to omit `ui_experiment_id` while preserving UI experiment linkage for ordinary UI builds.
- Updated modify-back guidance to allow `platform_fit` remediation when probe evidence invalidates the platform recommendation.

## v0.21 - 2026-06-27

- Expanded upstream inputs from screen ordering to surface inventory, channel constraints, visual UI candidates, route/screen realizations, and branch state.
- Clarified that `logic-wiring` wires selected route/screen realizations and non-visual channel behaviors without inventing new screens or surface semantics.

## v0.20 - 2026-06-26

- Renamed the skill from `prototype` to `logic-wiring` (flow-walk re-cut; route step 4 token `prototype` → `logic-wiring`). A deprecated `prototype` alias still routes here.
- Reframed as the wiring step that consumes `/build-ui-screens` visual screens and makes them clickable/state-backed (CLI/API/infra runnable logic retained); acceptance bar is flow reachability with one binding alignment gate per variation.
- Advances `ui_experiments[].build_ledger[]` flow steps from `minimum-ui-reached` to `wired`; routes back to `/build-ui-screens` when a flow step has no screen yet.
- Alignment page output renamed to `alignment/logic-wiring-{topic}.html`.

## v0.19 - 2026-06-22

- Added a hard gate requiring prototype build-plan items to reference a UI experiment/review branch, matching the `ui_experiment_id` requirement in `design/flow-tree.schema.json`.
- Clarified that build plans with only UX variation IDs halt before building unless the user explicitly records an ad hoc bypass.

## v0.18 - 2026-06-22

- Updated post-UAT prototype handoff routing to `/consolidate-prototypes`.

## v0.17 - 2026-06-21

- Reframed the body to the unified 5-stage design-tree flow (`interrogation -> research -> design -> plan -> implement(scoped)`) from `DESIGN-TREE-LOOP.md`: added the `## Design-Tree Flow` stage map, the per-branch iteration contract, and modify-back handling, plus explicit `## Next Work` / `## Invoke With YAML` self-routing handoff sections.
- Stage 0 folds (scope comes from the approved build-plan slice); modify-back originates here via `decisions[].modify` + `targets[]`.

## v0.16 - 2026-06-14

- Cited `docs/prototype-session-loop-convention.md` as the prototype-phase contract.
- Clarified that prototype build status is stored in the build-plan ledger and flow-tree manifest, not `tasks/todo.md`.

## v0.15 - 2026-06-13

- Added `design/prototype-build-plan-[topic].md` as the required prototype todo ledger produced by `/user-flow-map --prototype-build-plan`.
- Updated prototype build behavior to build only pending/needs-revision items, skip deferred/dropped items, and update build-plan plus flow-tree status after each build.

## v0.14 - 2026-06-13

- Moved prototype gates and source reads from pre-prototype `specs/` files to `design/` flow maps, UX variation plans, UI branch packets, and flow-tree manifests.
- Clarified that prototype output remains under `prototypes/` and consumes design-phase branch approval state before post-prototype specification work.

## v0.13 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.12 - 2026-06-11

- Added npm-aware install-route wording for product-testing and cross-pack recommendations while preserving Claude `/pack install ...` routes.

## v0.11 - 2026-06-10

- Converted the hand-authored alignment-page section to the generator-owned stub plus a bundled `ALIGNMENT-PAGE.md`; the page contract now follows the full shared convention (lifecycle states, central alignment index, section feedback, gate/feedback YAML, TTS, browser open) with the prototype-specific gates from the generator gate map.
- Kept the prototype-first timing rule (prototype files may be created before the alignment page; the page is required before downstream routing, UAT handoff, consolidation, spec updates, research updates, or task/roadmap changes) as bespoke prose beside the stub.

## v0.10 - 2026-06-06

- Added `specs/user-flow-*.md` as a preferred prototype input for screen ordering, route inventory, branches, states, failure/recovery paths, handoffs, and low-fidelity wireframe structure while preserving the existing UX/UI hard gate.

## v0.9 - 2026-06-05

- Changed alignment-page section feedback so the positive option is `emphasize` with `feedback: emphasize` and `requested_agent_action: add-weight-to-section`, making it a revision/weighting request instead of approval as-is.


## v0.8 - 2026-05-31

- Required alignment pages to use a top in-flow Table of Contents instead of sidebar navigation, and to avoid sticky/fixed bottom compile banners.
- Restored bottom `Compile Feedback YAML` aggregation while keeping local section feedback YAML controls under selected section feedback textareas.

## v0.7 - 2026-05-31

- Kept final `Compile Answers` at the bottom while moving feedback-only YAML display/copy controls under each selected section feedback textarea.
- Clarified that section thumbs up/down/clarify selections always reveal their own multiline feedback textarea even when the section also has gate-question inputs.

## v0.6 - 2026-05-31

- Added top-level `alignment_page` to feedback-only and final compiled YAML so agents can reopen the exact HTML review page.

## v0.5 - 2026-05-30

- Added feedback-only YAML alignment-page handling so section concerns and clarification requests can be sent before final gate answers.

## v0.4 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.0

- Archived previous skill contract.

## v0.3 - 2026-05-27

- Added a prototype-specific alignment gate after runnable artifacts are created and before UAT, consolidation, spec, research, or task routing.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.2 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `/pack install <pack>` when the target pack is not enabled
