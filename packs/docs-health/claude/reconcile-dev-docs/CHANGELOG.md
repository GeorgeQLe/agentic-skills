# Changelog

## v0.4 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/reconcile-dev-docs-{topic}.html` is now the primary review surface and compiled YAML routes back to `/reconcile-dev-docs`.

## v0.3 - 2026-06-23

- Added current-only task-doc routing checks for overloaded `tasks/todo.md`, stale roadmap `Current Implementation` headings, advisory unchecked items, and the `scripts/audit-task-docs.mjs` verification gate.

## v0.2 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
