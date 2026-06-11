# Changelog

## v0.9 - 2026-06-11

- Updated the inline alignment-page response model to use one bottom `Compile Responses` control with local section feedback YAML hidden until a section feedback choice is selected.

## v0.8 - 2026-06-10

- Added npm-aware install-route alternatives to pack availability guidance while preserving Claude `/pack install` syntax.

## v0.7 - 2026-06-06

- Add `/user-flow-map`, requirements-only UI interview, and layout-mode UX variations to the user-facing design-gate queue.
- Recognize `specs/user-flow-*.md` and `specs/ui-requirements-*.md` as required pre-roadmap planning artifacts.

## v0.6 - 2026-06-05

- Changed alignment-page section feedback so the positive option is `emphasize` with `feedback: emphasize` and `requested_agent_action: add-weight-to-section`, making it a revision/weighting request instead of approval as-is.


## v0.5 - 2026-05-31

- Required alignment pages to use a top in-flow Table of Contents instead of sidebar navigation, and to avoid sticky/fixed bottom compile banners.
- Restored bottom `Compile Feedback YAML` aggregation while keeping local section feedback YAML controls under selected section feedback textareas.

## v0.4 - 2026-05-31

- Kept final `Compile Answers` at the bottom while moving feedback-only YAML display/copy controls under each selected section feedback textarea.
- Clarified that section thumbs up/down/clarify selections always reveal their own multiline feedback textarea even when the section also has gate-question inputs.

## v0.3 - 2026-05-31

- Added top-level `alignment_page` to feedback-only and final compiled YAML so agents can reopen the exact HTML review page.

## v0.2 - 2026-05-30

- Added feedback-only YAML alignment-page handling so section concerns and clarification requests can be sent before final gate answers.

## v0.1 - 2026-05-27

- Added an explicit local alignment preview gate before roadmap and task queue writes or downstream routing.

## v0.0

- Initial version.
