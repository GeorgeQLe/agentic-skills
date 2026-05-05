# Active Phase: None

**Project:** Claude Skills / agentic-skills
**Current phase:** none
**Status:** All planned roadmap phases are complete as of 2026-05-04.

## Handoff

- Phase 14 was archived to `tasks/phases/phase-14.md`.
- `tasks/roadmap.md` now marks Phases 1-26 complete.
- No manual blockers were present for Phase 14.
- No record or recurring advisory tasks are currently active in this repo.

## Next Work

Run `$brainstorm` to discover a candidate next phase, or explicitly park the project if no new work is desired.

**Recommended next command:** `$brainstorm`

## Review - 2026-05-05 Cross-Pack Routing Guard

- Audited recommendation-like cross-pack skill references and found 95 skill contracts that could recommend pack-local skills without requiring the target pack to be enabled first.
- Added a standardized Pack Availability Guard to affected contracts and added `scripts/skill-pack-routing-audit.sh` to prevent regressions.
- Validation passed: `bash -n scripts/skill-pack-routing-audit.sh`, `./scripts/skill-pack-routing-audit.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests test`, and `git diff --check`.

## Review - 2026-05-05 Agentic Config Split

- Split the root `AGENTS.md` subagent guidance from `CLAUDE.md` so Codex follows active tool permissions instead of Claude-oriented liberal subagent defaults.
- Updated Claude and Codex `provision-agentic-config` contracts to generate separate Claude and AGENTS workflow blocks.
- Updated bootstrap contracts to verify the corresponding block in each target file rather than implying one identical mirrored block.
