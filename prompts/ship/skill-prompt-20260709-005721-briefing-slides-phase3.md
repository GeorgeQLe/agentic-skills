---
skill: ship
agent: claude
captured_at: 2026-07-09T00:57:21
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Next step — Briefing Slides Phase 3: convention + packaging + SKILL sync

## Ship summary (this /ship run)
- **Shipped:** Phase 2 was already committed/pushed this session (`2f31f8010` manifest + batch regenerate; `eae743125` overviews "skills" wording fix). This run recorded it and planned the next step — task docs committed in `d004f44a6` (history, lessons, todo, roadmap).
- **Deploy:** skipped — no `deploy.md`/`tasks/deploy.md` contract.
- **Tests:** `scripts/audit-briefing-slides.mjs` exit 0 (all groups exact, no parity notes); `scripts/audit-task-docs.mjs` 0 failures. No failing tests — none expected.
- **Manual/advisory:** no `tasks/manual-todo.md` blockers for this step; `tasks/recurring-todo.md` has 2 unchecked advisory items (not executable).

## Next step
Land the deferred Phase 3 follow-on for the briefing-slides manifest redesign. **The full self-contained plan is in `tasks/todo.md`** ("Current Implementation - Briefing Slides Phase 3").

- Document the manifest → generator → rotating-archetype pipeline in `docs/briefing-slides-convention.md` (names `_deck-manifest.json` + the four scripts + two locked chrome files).
- Sync the packaged convention copy (`assets/briefing-slides-convention.md`) if one exists.
- Add the archetype/manifest workflow step to both `create-briefing-slides` SKILL.md mirrors (`packs/base/{claude,codex}/create-briefing-slides/SKILL.md`), bump version one decimal, archive prior via `scripts/skill-archive.sh`, add changelog entries.
- Refresh the public skills catalog export; run `scripts/pack.sh refresh`.

## Approach / key decisions
- Serial execution: package `build`/`build:check` + catalog export write shared outputs; the skillpacks manifest is index-generated, so `git add` source edits before `npm run build`, then commit source + manifest together.
- Keep the Phase 2 constraints: flagships stay out of the manifest; pools exclude `meterRow`/`scorecard` (no honest numeric source); AFPS-workflow members are "skills," not "decks."

## Verification
`node scripts/generate-briefing-decks.mjs` → `node scripts/audit-briefing-slides.mjs` (exit 0); convention bundle audit; mirror-parity + `skill-archive-audit --strict`; `build:manifest:check` + `build:check`; `validate-skills-catalog-export.sh`; `audit-task-docs.mjs`; `git diff --check`.

## Ship-one-step handoff
Implement **only this step**, validate it, then run `/ship` when done.
