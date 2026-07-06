# Changelog

## v0.5 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/game-roadmap-{topic}.html` is now the primary review surface and compiled YAML routes back to `/game-roadmap`.

## v0.4 - 2026-06-13

- Removed direct execution-loop command handoffs from non-exec routing; route through approved YAML, task, or roadmap artifacts instead.
- Added the alignment-page review-state rule: section-feedback YAML or final compiled YAML is the only pre-approval next action.


## v0.3 - 2026-06-12

- Added explicit next-step routing from roadmap updates to phase planning, execution, missing game validation, or no-follow-up completion.

## v0.2 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
