# research-roadmap changelog (claude)

## v0.9 - 2026-05-31

- Kept final `Compile Answers` at the bottom while moving feedback-only YAML display/copy controls under each selected section feedback textarea.
- Clarified that section thumbs up/down/clarify selections always reveal their own multiline feedback textarea even when the section also has gate-question inputs.

## v0.8 - 2026-05-31

- Added top-level `alignment_page` to feedback-only and final compiled YAML so agents can reopen the exact HTML review page.

## v0.7 - 2026-05-30

- Added feedback-only YAML alignment-page handling so section concerns and clarification requests can be sent before final gate answers.

## v0.5 - 2026-05-27

- Handle plural `active_paths` manifest field with backward compatibility for singular `active_path`
- Show per-path pipeline progress in the priority queue
- Queue `/product-line review` when 3+ deferred paths accumulate
- Added `/product-line review` to business-app research outputs and dependency order

## v0.4 - 2026-05-27

- Added `research/.progress.yaml` product-path manifest intake so active and deferred paths appear in the documentation queue without forcing full downstream research for parked paths.

## v0.3 - 2026-05-27

- Added an explicit local alignment preview gate before documentation queue writes and downstream routing.

## v0.1

- Reorder the fallback business-app documentation queue so journey-map precedes positioning and UX/prototype/UAT gates precede spec-interview.
- Add research-roadmap post-prototype refresh before production spec work in the default AFPS route.

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
