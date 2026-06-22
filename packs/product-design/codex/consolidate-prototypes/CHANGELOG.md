# Changelog

## v0.17 - 2026-06-22

- Corrected the active consolidation contract to require the AFPS graduation document promised by v0.16.
- Added the graduation document to deliverables and made the handoff depend on both the consolidated MVP and graduation approval before `$research-roadmap --post-prototype`.

## v0.16 - 2026-06-22

- Renamed the primary skill from `consolidate-variations` to `consolidate-prototypes`, keeping the old command as a deprecated compatibility alias for one transition period.
- Reframed consolidation around evaluated prototype branches, UAT findings, a user-approved consolidated MVP, and handoff into `$research-roadmap --post-prototype` followed by `$spec-interview`.
- Added the required AFPS graduation document output at `design/afps-graduation-{topic}.md` or `design/{slug}/afps-graduation-{topic}.md`, including final MVP decisions, rejected alternatives, unresolved risks, stale-research cleanup status, and production-readiness guidance.

## v0.15 - 2026-06-21

- Reframed the body to the unified 5-stage design-tree flow (`interrogation -> research -> design -> plan -> implement(scoped)`) from `DESIGN-TREE-LOOP.md`: added the `## Design-Tree Flow` stage map, the per-branch iteration contract, and modify-back handling, plus explicit `## Next Work` / `## Invoke With YAML` self-routing handoff sections.
- Joined the stage-zero interrogation set (`## Interrogation Page` / `INTERROGATION-PAGE.md`).

## v0.14 - 2026-06-14

- Cited `docs/prototype-session-loop-convention.md` as the prototype-phase contract.
- Made UAT evidence and explicit consolidation decisions prerequisites for writing `prototypes/{topic}/consolidated/`.

## v0.13 - 2026-06-13

- Updated consolidation to consume `design/` variation plans, UI requirements, and flow-tree manifests instead of pre-prototype `specs/` files.
- Clarified that consolidation outputs a consolidated prototype under `prototypes/{topic}/consolidated/` and records consolidation state in the design flow-tree manifest.

## v0.12 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.11 - 2026-06-11

- Added npm-aware install-route wording for product-testing recommendations while preserving Codex `$pack install ...` routes.

## v0.10 - 2026-06-10

- Converted the hand-authored alignment-page section to the generator-owned stub plus a bundled `ALIGNMENT-PAGE.md`; the page contract now follows the full shared convention (lifecycle states, central alignment index, section feedback, gate/feedback YAML, TTS, browser open) with the consolidate-prototypes-specific gates from the generator gate map.

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

- Added an explicit local alignment preview gate before consolidated prototype, interview log, or final UI specification writes.

## v0.2 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `$pack install <pack>` when the target pack is not enabled

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
