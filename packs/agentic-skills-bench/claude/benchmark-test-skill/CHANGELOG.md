# Changelog

## v0.6 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/benchmark-test-skill-{topic}.html` is now the primary review surface and compiled YAML routes back to `/benchmark-test-skill`.

## v0.5 - 2026-07-03

- Repointed benchmark coverage/failure/false-negative and unknown-skill routing off the archived `targeted-skill-builder`/`create-agentic-skill` to `session-triage` and `create-local-skill`/direct implementation.

## v0.4 - 2026-06-29

- Updated benchmark execution to run from `agentic-skills-benchmarks`, import the public skills catalog export, and keep reports, run data, and regression history in that repo.

## v0.3 - 2026-06-20

- Added Step 3.5 - Regression Check: after `pnpm bench`, run `node scripts/benchmark-regression-check.mjs <skill>` to compare the fresh grade against the prior grade in `benchmark/grade-history.json`. On a `regression` verdict (distinct from an absolute failure), route to `/session-triage <skill> benchmark regression` carrying the prior-vs-new delta. Closes the benchmark → triage → version-bump → re-benchmark loop documented in `docs/benchmark-improvement-loop.md`.

## v0.2 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
