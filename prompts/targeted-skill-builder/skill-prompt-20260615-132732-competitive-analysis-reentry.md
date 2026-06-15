---
skill: targeted-skill-builder
agent: codex
captured_at: 2026-06-15T13:27:32-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Competitive Analysis Re-Entry Routing Guard

## Summary

Update the existing `competitive-analysis` skill, not a new skill. The fix will close the re-entry gap where a repeated parent invocation sees an already-approved framework queue/state and must advance to the next child framework instead of rerunning parent status/audit work.

## Key Changes

- Patch `packs/business-research/codex/competitive-analysis/SKILL.md` and `packs/business-research/claude/competitive-analysis/SKILL.md`.
- Bump both from `v0.20` to `v0.21` after archiving current `SKILL.md` files with `scripts/skill-archive.sh <skill-dir>`.
- Add a "Re-entry Routing Guard" under the Research Session Loop / state resolution section:
  - If a run manifest exists and at least one selected framework intermediate is missing, resolve directly to State C and run the first pending framework inline.
  - If legacy `tasks/todo.md` contains an approved `## Competitive Analysis Framework Execution` queue with child framework rows, treat it as compatibility evidence only: route to the first unchecked framework by running that framework inline through the parent orchestrator.
  - Do not rerun State E, perform a status audit, do bookkeeping-only cleanup, route to `$exec`/`/exec`, or tell the user to invoke `$competitive-analysis/frameworks/...` or `/competitive-analysis/frameworks/...`.
  - Exceptions: if the user explicitly asks for status, re-scoping, queue cleanup, or synthesis, honor that explicit request.
- Update both changelogs with a `v0.21 - 2026-06-15` entry describing the re-entry guard.
- Run `npx skillpacks refresh` so `.codex/skills/competitive-analysis/SKILL.md` and `.claude/skills/competitive-analysis/SKILL.md` mirror the source behavior.
- Capture the visible invocation prompt under `prompts/targeted-skill-builder/` before implementation, per repo convention.

## Test Plan

- Add or update deterministic benchmark coverage in `tests/layer4/setups/packs/pack-workflows.setup.ts` for `competitive-analysis`:
  - Fixture state: Porter checked/complete, SWOT unchecked/pending, parent `$competitive-analysis` or `/competitive-analysis` invoked again.
  - Expected behavior: output routes into the parent-owned SWOT framework execution path.
  - Forbidden behavior: parent status audit, `$exec`/`/exec`, and direct path-shaped framework commands.
- Keep `tests/harness/bench-coverage.ts` unchanged if inspection confirms `competitive-analysis` is already classified as custom coverage; otherwise update only the minimal coverage metadata required.
- Validation commands:
  - `rg -n "Re-entry Routing Guard|first pending|Framework Execution|status audit|\\$exec|/exec" packs/business-research/codex/competitive-analysis/SKILL.md packs/business-research/claude/competitive-analysis/SKILL.md .codex/skills/competitive-analysis/SKILL.md .claude/skills/competitive-analysis/SKILL.md`
  - `npx skillpacks refresh`
  - `./scripts/skill-deps.sh --broken`
  - `./scripts/skill-versions.sh --missing`
  - `./scripts/skill-next-step-routing.sh --missing`
  - `pnpm --dir tests bench:coverage`
  - focused layer test for the updated pack workflow setup, using the repo's existing test command if available
  - Skills Showcase refresh commands because tracked `SKILL.md` behavior changes:
    - `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
    - `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
    - `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
  - `git diff --check`

## Assumptions

- The source-of-truth skill files are the pack files under `packs/business-research/{codex,claude}/competitive-analysis/`; `.codex` and `.claude` are refreshed mirrors.
- This is a behavior change, so version bump + archive + changelog are required.
- The fix should preserve the v0.20 self-advancing run-manifest model while adding compatibility handling for the already-existing AFPS Tracker `tasks/todo.md` queue state.
- No GitHub Actions changes are needed.

The user also pasted the full visible `competitive-analysis` v0.20 Codex skill contract and the full visible `exec` v0.3 Codex skill contract as context for this implementation.
