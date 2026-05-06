# Active Phase: Phase 30 - Feature Interview Evidence Intake

**Project:** Claude Skills / agentic-skills
**Current phase:** Phase 30
**Status:** Complete as of 2026-05-06.

## Plan

- [x] Update the Codex `feature-interview` contract to require evidence-backed claim validation and technical gotcha discovery before deep user interrogation.
- [x] Mirror the same behavior in the Claude `feature-interview` contract while preserving slash-command routing language.
- [x] Add explicit journey/user-story placement and research/spec documentation destination rules.
- [x] Add a user-confirmed prioritization gate before mutating roadmap or task files.
- [x] Validate mirrored behavior, skill metadata, routing contracts, tests, and whitespace.

## Notes

- This is an enhancement to the existing `feature-interview` workflow, not a new skill.
- The skill should borrow `$investigate`'s evidence discipline without inheriting its automatic fix-and-test behavior.
- User prioritization belongs before roadmap/todo mutation; phase-level sequencing remains owned by `$roadmap`.

## Review - 2026-05-06 Feature Interview Evidence Intake

- Updated mirrored Claude/Codex `feature-interview` contracts from v1.0.0 to v1.1.0.
- Added a required evidence-backed intake pass before deep questioning, including claim validation, technical gotcha discovery, journey/workflow placement, and documentation destination selection.
- Added a Planning Destination + Priority Checkpoint so roadmap/task mutation requires user-confirmed priority.
- Expanded deliverables so interview logs preserve evidence, gotchas, journey placement, documentation changes, priority decision, and next command.
- Refreshed Codex `agents/openai.yaml`, `docs/skills-reference.md`, and `docs/operating-modes.md` descriptions.
- Validation passed: stale-text scans, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `./scripts/skill-pack-routing-audit.sh`, `pnpm --dir tests test`, and `git diff --check`.

## Next Work

Phase 30 is complete. Run `$brainstorm` to discover a candidate next phase, or explicitly park the project if no new work is desired.

**Recommended next command:** `$brainstorm`

## Review - 2026-05-06 Live Skill Harness

- Added reusable live-agent test helpers for temp git fixtures, structured JSON schemas, Claude `-p`, and `codex exec`.
- Added opt-in layer3 Vitest tests for `analyze-sessions` and `session-triage` behavior.
- Added `test:layer3`, `test:live`, `test:live:claude`, and `test:live:codex` scripts while keeping `pnpm --dir tests test` on layer1.
- Documented live test usage in `README.md`.
- Live Codex validation passed for single-incident `session-triage` routing and broad-trend `analyze-sessions` routing.
- Live Claude validation passed for the same two scenarios after the harness learned to parse Claude's `structured_output` envelope.
- Validation passed: `pnpm --dir tests test:layer3` with live tests skipped, `pnpm --dir tests test`, `pnpm --dir tests test:live:claude`, `pnpm --dir tests test:live:codex`, skill dependency/version/routing scripts, and `git diff --check`.
- Note: `pnpm --dir tests exec tsc --noEmit` is not part of the gate because the existing tests package lacks Node type definitions; it fails on pre-existing imports across the suite.

## Next Work

Phase 29 is complete. Run `$brainstorm` to discover a candidate next phase, or explicitly park the project if no new work is desired.

**Recommended next command:** `$brainstorm`

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
