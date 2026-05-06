# Active Phase: Phase 27 - Analyze-Sessions Targeted Skill Retrospectives

**Project:** Claude Skills / agentic-skills
**Current phase:** Phase 27
**Status:** Complete as of 2026-05-05.

## Plan

- [x] Update `global/codex/analyze-sessions/SKILL.md` with a targeted skill-retrospective mode.
- [x] Update `global/claude/analyze-sessions/SKILL.md` with the mirrored targeted workflow.
- [x] Ensure the workflow resolves skills from `agentic-skills`, pack/project-local locations, and active session/repo metadata.
- [x] Require agent verification before treating a user-reported mistake as confirmed.
- [x] Define output fields for evidence, root cause, skill fixes, validation checks, and confidence gaps.
- [x] Validate the mirrored contracts and repository hygiene.

## Notes

- Preserve broad usage-history analysis as the default path for general `$analyze-sessions` requests.
- Keep this analysis-oriented; it should recommend skill fixes, not silently rewrite a skill unless paired with a builder/update workflow.

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
