# Changelog

## v0.9 - 2026-07-03

- Added a mandatory **Canonical Fix Target** rule to step 6: a skill fix must target the canonical `packs/<pack>/{claude,codex}/<skill>/SKILL.md` source (both variants), resolved with `scripts/pack.sh which <skill>`, and must never land on a managed mirror or installed copy (`.codex/skills`, `~/.codex/skills`, `~/.npm/**/skillpacks`, etc.) — those are read-only evidence and do not propagate. Added a cross-directory rule routing fixes back to the managing repo when cwd is a consuming repo.
- Added the **publish + refresh loop** (archive/version bump → update both variants + CHANGELOG → `git add` → `npm run skillpacks:build` → commit source+manifest together → `scripts/pack.sh refresh` / consumer `npx skillpacks refresh` + fresh Codex CLI session) to the step 6 fix, Output, and Validation plan, and required the `$targeted-skill-builder` handoff to carry the canonical target path + publish/refresh loop. Added a matching Constraint.

## v0.8 - 2026-06-30

- Added the `agentic-skills-bench` install prerequisite directly to benchmark-regression loop-closing recommendations when `$benchmark-test-skill` is unavailable, matching the Pack Availability Guard.

## v0.7 - 2026-06-29

- Updated benchmark-regression evidence paths for the split `agentic-skills-benchmarks` repository.

## v0.6 - 2026-06-24

- Updated the Pack Availability Guard to check `enabled_skills`, enabled provider packs, and local/global skill files before recommending downstream skills, so individually installed skills are not treated as missing just because their pack is absent from `enabled_packs`.

## v0.5 - 2026-06-23

- Added an explicit Pack Availability Guard for benchmark regression loop-closing: check `.agents/project.json` `enabled_packs` for `agentic-skills-bench` before recommending or relying on `$benchmark-test-skill <skill>`, recommend `npx skillpacks install agentic-skills-bench` when missing, and tell Codex users to start a fresh Codex CLI session if the `$` skill list remains stale after install.

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
