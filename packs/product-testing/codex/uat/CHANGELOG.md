# Changelog

## v0.14 - 2026-06-22

- Updated variant-evaluation readiness and post-evaluation recommendations to hand off to `$consolidate-prototypes`.

## v0.13 - 2026-06-21

- Reframed to the unified design-tree loop (`DESIGN-TREE-LOOP.md`) as a sub-skill: marked `invocation: sub-skill` with `parent: prototype`; added the `## Design-Tree Role` note (enters at its checklist/evaluation stage, parent-owned handoff) and regenerated its alignment bundle for the sub-skill translation.

## v0.12 - 2026-06-14

- Cited `docs/prototype-session-loop-convention.md` as the prototype-phase contract.
- Updated variant-evaluation mode to prefer `design/` UX/UI artifacts and prototype build plans, using legacy `specs/` files only as fallback evidence.

## v0.11 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.10 - 2026-06-10

- Converted the hand-authored alignment-page section to the generator-owned stub plus a bundled `ALIGNMENT-PAGE.md`; the page contract now follows the full shared convention (lifecycle states, central alignment index, section feedback, gate/feedback YAML, TTS, browser open) with the uat-specific gates from the generator gate map.
- Gained the shared glossary additions gate from the convention (applies because the skill is `type: analysis`).

## v0.9 - 2026-06-07

- Routed missing-discovery UAT handoffs from the retired `$icp` executable to `$customer-discovery` while preserving `research/icp.md` as evidence input.

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

- Added an explicit local alignment preview gate before UAT plan, variant-evaluation, and manual task writes.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
