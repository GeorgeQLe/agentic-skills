# Active Phase: Phase 28 - Session Triage Split

**Project:** Claude Skills / agentic-skills
**Current phase:** Phase 28
**Status:** Complete as of 2026-05-05.

## Plan

- [x] Narrow `global/codex/analyze-sessions/SKILL.md` back to broad cross-session trend analysis.
- [x] Narrow `global/claude/analyze-sessions/SKILL.md` back to broad cross-session trend analysis.
- [x] Add mirrored `session-triage` skills for immediate issue/session/correction investigations.
- [x] Add Codex `session-triage` agent metadata.
- [x] Update discovery docs, skill grouping, next-step contracts, and targeted-skill-builder routing language.
- [x] Validate the split and repository hygiene.

## Notes

- Use `$session-triage`, not `$analyze-session`, to avoid singular/plural command confusion.
- `$session-triage` remains analysis-oriented; it recommends skill fixes and routes implementation to `$targeted-skill-builder` or `$create-agentic-skill`.

## Review - 2026-05-05 Session Triage Split

- Restored mirrored `analyze-sessions` contracts to broad cross-session trend, repeated prompt, workflow evolution, automation, and skill-performance-over-time analysis.
- Added mirrored `session-triage` contracts for one immediate issue, correction, session, repo incident, failed run, or suspected skill failure.
- Added Codex `session-triage` agent metadata and narrowed `analyze-sessions` metadata to broad history analysis.
- Updated discovery docs, operating-mode roles, next-step contracts, `skills` grouping, and `targeted-skill-builder` guidance.
- Recorded the singular/plural command ambiguity lesson in `tasks/lessons.md`.
- Validation passed: `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests test`, targeted `rg` scans, exact no-`analyze-session` directory scan, and `git diff --check`.

## Next Work

Phase 28 is complete. Run `$brainstorm` to discover a candidate next phase, or explicitly park the project if no new work is desired.

**Recommended next command:** `$brainstorm`

## Review - 2026-05-05 Analyze-Sessions Targeted Skill Retrospectives

- Updated mirrored Claude/Codex `analyze-sessions` contracts to support targeted retrospectives for a named skill, skill path, repo/session scope, or user-identified mistake.
- Added explicit resolution rules for `agentic-skills`, pack/project-local skills, installed read-only fallback copies, and session metadata from Claude/Codex histories.
- Required the report to separate user-identified mistakes from agent-verified mistakes and to output root cause, exact skill fixes, validation checks, confidence, and evidence gaps.
- Updated the Codex `agents/openai.yaml` prompt metadata for the broader history-or-skill-retrospective behavior.
- Validation passed: `./install.sh`, targeted mirrored `rg` scans, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests test`, and `git diff --check`.

## Next Work

Phase 27 is complete. Run `$brainstorm` to discover a candidate next phase, or explicitly park the project if no new work is desired.

**Recommended next command:** `$brainstorm`

## Review - 2026-05-05 Cross-Pack Routing Guard

- Audited recommendation-like cross-pack skill references and found 95 skill contracts that could recommend pack-local skills without requiring the target pack to be enabled first.
- Added a standardized Pack Availability Guard to affected contracts and added `scripts/skill-pack-routing-audit.sh` to prevent regressions.
- Validation passed: `bash -n scripts/skill-pack-routing-audit.sh`, `./scripts/skill-pack-routing-audit.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests test`, and `git diff --check`.

## Review - 2026-05-05 Agentic Config Split

- Split the root `AGENTS.md` subagent guidance from `CLAUDE.md` so Codex follows active tool permissions instead of Claude-oriented liberal subagent defaults.
- Updated Claude and Codex `provision-agentic-config` contracts to generate separate Claude and AGENTS workflow blocks.
- Updated bootstrap contracts to verify the corresponding block in each target file rather than implying one identical mirrored block.
