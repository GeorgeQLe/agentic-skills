# Changelog

## v0.14 - 2026-06-10

- Converted the hand-authored alignment-page section to the generator-owned stub plus a bundled `ALIGNMENT-PAGE.md`; the page contract now follows the full shared convention (lifecycle states, central alignment index, section feedback, gate/feedback YAML, TTS, browser open) with the ux-variations-specific gates from the generator gate map.

## v0.13 - 2026-06-06

- Clarified the normal AFPS route as `$user-flow-map` then `$ui-interview --requirements-only` before `$ux-variations --layout-mode`.
- Prefer `specs/user-flow-*.md` plus `specs/ui-requirements-*.md` as layout-mode inputs, and route missing flow structure to `$user-flow-map`.

## v0.12 - 2026-06-05

- Changed alignment-page section feedback so the positive option is `emphasize` with `feedback: emphasize` and `requested_agent_action: add-weight-to-section`, making it a revision/weighting request instead of approval as-is.


## v0.11 - 2026-05-31

- Required alignment pages to use a top in-flow Table of Contents instead of sidebar navigation, and to avoid sticky/fixed bottom compile banners.
- Restored bottom `Compile Feedback YAML` aggregation while keeping local section feedback YAML controls under selected section feedback textareas.

## v0.10 - 2026-05-31

- Kept final `Compile Answers` at the bottom while moving feedback-only YAML display/copy controls under each selected section feedback textarea.
- Clarified that section thumbs up/down/clarify selections always reveal their own multiline feedback textarea even when the section also has gate-question inputs.

## v0.9 - 2026-05-31

- Added top-level `alignment_page` to feedback-only and final compiled YAML so agents can reopen the exact HTML review page.

## v0.8 - 2026-05-30

- Added feedback-only YAML alignment-page handling so section concerns and clarification requests can be sent before final gate answers.

## v0.7 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.4 - 2026-05-27

- Added product-path manifest handling for UX route experiments that imply materially different products, apps, ICPs, or product lines while keeping ordinary variants on the active path.

## v0.0

- Archived previous skill contract.

## v0.3 - 2026-05-27

- Added an explicit local alignment preview gate before canonical variation plan writes and downstream routing.

## v0.2 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `$pack install <pack>` when the target pack is not enabled

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.5

- Archived previous skill contract.

## v0.6

- Archived previous skill contract.
