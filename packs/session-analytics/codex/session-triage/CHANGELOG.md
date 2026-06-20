# Changelog

## v0.4 - 2026-06-20

- Added `benchmark regression` mode: accepts the prior-vs-new delta carried from `$benchmark-test-skill` (and `benchmark/grade-history.json`), confirms the regression is real vs a thin-sample artifact, then distinguishes a real behavioral regression (route to `$targeted-skill-builder <skill> benchmark regression`, re-benchmark to confirm recovery) from harness/rubric drift (reuse the false-negative-family logic). See `docs/benchmark-improvement-loop.md`.
- Added an optional secondary-writer step: append verified, generalizable incidents to the machine-local `.session-insights/insights.md` store that `$analyze-sessions` accumulates, deduping by semantic match.

## v0.3 - 2026-06-19

- Updated the `$analyze-sessions` pointer to reflect the new split: analyze-sessions owns informational history questions (single or trend); session-triage owns live incidents that need a verified fix.

## v0.2 - 2026-06-17

- Caught Codex up to the Claude mirror with npm-aware cross-pack recommendation guidance and skill-dev pack labeling while preserving `$...` route syntax.

## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
