# Changelog

## v0.5 - 2026-06-29

- Replaced local benchmark-harness and Showcase-generation requirements with public catalog export refreshes plus optional coverage work in the separate `agentic-skills-benchmarks` repo.

## v0.4 - 2026-06-13

- Validation and reload steps use `npx skillpacks refresh` instead of the removed `./init.sh`.

## v0.3 - 2026-06-09

- Updated Skills Showcase refresh commands to use app-owned generator and validator paths after the workspace split.

## v0.2 - 2026-05-30

- Tightened post-`./init.sh` skill visibility guidance to distinguish Claude Code `/reload-skills`, `/clear`, and restart fallback behavior from Codex fresh CLI session fallback.

## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
