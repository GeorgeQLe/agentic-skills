# Changelog

## v0.18 - 2026-06-27

- Updated post-prototype spec intake to consume upstream surface inventory, channels, visual UI candidates, and route/screen realizations as design evidence.
- Reframed the prototype walkthrough and spec outline as surface-aware instead of screen-order-only.

## v0.17 - 2026-06-22

- Corrected the active prototype gate to require an AFPS graduation document and explicit graduation readiness before production spec work.
- Added AFPS graduation as required upstream evidence alongside the consolidated prototype and blocking post-prototype cleanup queue.

## v0.16 - 2026-06-22

- Updated the prototype gate to accept an AFPS graduation document as the explicit readiness signal after `$consolidate-prototypes`.
- Kept the consolidated prototype requirement and post-prototype cleanup blocker check before production spec work begins.

## v0.15 - 2026-06-21

- Reframed the body to the unified 5-stage design-tree flow (`interrogation -> research -> design -> plan -> implement(scoped)`) from `DESIGN-TREE-LOOP.md`: added the `## Design-Tree Flow` stage map, the per-branch iteration contract, and modify-back handling, plus explicit `## Next Work` / `## Invoke With YAML` self-routing handoff sections.
- Added the `design-tree-loop` required convention and its `DESIGN-TREE-LOOP.md` citation; joined the stage-zero interrogation set.

## v0.14 - 2026-06-13

- Updated post-prototype spec interviews to consume `design/user-flow-*`, `design/ux-variations-*`, `design/ui-*`, and scoped flow-tree manifests as upstream design evidence.
- Clarified that `spec-interview` keeps finalized production implementation specs in `specs/` and does not write pre-prototype design artifacts.

## v0.13 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.12 - 2026-06-11

- Added npm-aware install-route wording for pack and customer-lifecycle recommendations while preserving Codex `$pack install ...` routes.

## v0.11 - 2026-06-10

- Assumptions Checkpoint now renders inline as the final message text of its own turn (never only as mid-turn text before a tool or command call); the next turn asks the user to confirm or correct it together with one focused interview question, keeping momentum.
- Coverage checkpoint split across two turns: the structured summary is delivered as turn-final text, with the confirmation question asked in the following turn. Applies the Manifest Visibility Rule in docs/interview-convention.md.

## v0.10 - 2026-06-10

- Converted the hand-authored alignment-page section to the generator-owned stub plus a bundled `ALIGNMENT-PAGE.md`; the page contract now follows the full shared convention (lifecycle states, central alignment index, section feedback, gate/feedback YAML, TTS, browser open) with the spec-interview-specific gates from the generator gate map.

## v0.9 - 2026-06-06

- Read `specs/user-flow-*.md` as upstream evidence for screen order, routes, branches, states, failure/recovery paths, handoffs, and low-fidelity wireframe intent.
- Recommend `$user-flow-map` as upstream remediation when the consolidated prototype exposes missing or unclear flow structure.

## v0.8 - 2026-06-05

- Changed alignment-page section feedback so the positive option is `emphasize` with `feedback: emphasize` and `requested_agent_action: add-weight-to-section`, making it a revision/weighting request instead of approval as-is.


## v0.7 - 2026-05-31

- Required alignment pages to use a top in-flow Table of Contents instead of sidebar navigation, and to avoid sticky/fixed bottom compile banners.
- Restored bottom `Compile Feedback YAML` aggregation while keeping local section feedback YAML controls under selected section feedback textareas.

## v0.6 - 2026-05-31

- Kept final `Compile Answers` at the bottom while moving feedback-only YAML display/copy controls under each selected section feedback textarea.
- Clarified that section thumbs up/down/clarify selections always reveal their own multiline feedback textarea even when the section also has gate-question inputs.

## v0.5 - 2026-05-31

- Added top-level `alignment_page` to feedback-only and final compiled YAML so agents can reopen the exact HTML review page.

## v0.4 - 2026-05-30

- Added feedback-only YAML alignment-page handling so section concerns and clarification requests can be sent before final gate answers.

## v0.3 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.0

- Archived previous skill contract.

## v0.2 - 2026-05-27

- Added an explicit local alignment preview gate before production spec writes and roadmap routing.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
