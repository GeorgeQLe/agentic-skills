# Active Phase: Phase 31 - Parallel Agent Branch/PR Guard

**Project:** Claude Skills / agentic-skills
**Current phase:** Phase 31 of 31
**Status:** Complete as of 2026-05-07.

## Phase 31: Parallel Agent Branch/PR Guard
> Test strategy: none

### Goal

Make the branch policy explicit across parallel agent-team skills: sequential work still lands directly on `main`/`master`, but parallel agent-team write lanes must work on separate GitHub branches and pass a consolidation/PR review gate before final integration.

### Scope

- Update root guidance in `AGENTS.md` and `CLAUDE.md` to add a narrow branch exception for agent-team parallel write lanes.
- Update mirrored `plan-phase` contracts so `agent-team` execution profiles include branch names and an explicit consolidation/PR review step.
- Update `run` and monorepo parallel skills so write lanes create/use separate GitHub branches, return commit/PR evidence, and stop when PR review cannot happen.
- Update monorepo docs and lessons so the branch/PR lifecycle is discoverable and repeatable.

### Acceptance Criteria

- [x] Sequential/direct work still defaults to committing and pushing on `main` or `master`.
- [x] Agent-team write lanes require separate GitHub branches with deterministic names.
- [x] Agent-team lane deliverables include branch, commit SHA, validation evidence, and PR URL or an explicit blocker.
- [x] Agent-team planning includes a consolidation/PR review step after parallel lanes and before final validation/shipping.
- [x] Monorepo lane-spec guidance carries the same branch/PR requirements.
- [x] Validation passes with targeted scans, skill metadata/routing checks, tests, and whitespace checks.

### Execution Profile

**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** docs/API conformance, workflow-policy consistency

**Subagent lanes:** none

### Implementation

- [x] Step 31.1: Update task planning and lessons for the branch/PR correction.
  - Files: modify `tasks/roadmap.md`, `tasks/todo.md`, `tasks/lessons.md`
- [x] Step 31.2: Update root agent guidance and mirrored planning contracts.
  - Files: modify `AGENTS.md`, `CLAUDE.md`, `global/codex/plan-phase/SKILL.md`, `global/claude/plan-phase/SKILL.md`
- [x] Step 31.3: Update execution and monorepo parallel contracts.
  - Files: modify `global/codex/run/SKILL.md`, `global/claude/run/SKILL.md`, `global/codex/mono-plan/SKILL.md`, `global/claude/mono-plan/SKILL.md`, `packs/monorepo/codex/mono-run/SKILL.md`, `packs/monorepo/claude/mono-run/SKILL.md`, `docs/skills-reference.md`
- [x] Step 31.4: Validate focused behavior and ship.
  - Files: modify `tasks/todo.md`, `tasks/history.md`

### Review

## Review - 2026-05-07 Parallel Agent Branch/PR Guard

- **User goal:** Parallel agent-team skills must use separate GitHub branches and include consolidation/PR review, while sequential work remains direct-to-primary.
- **Changed files:** Root guidance (`AGENTS.md`, `CLAUDE.md`), mirrored global planning/execution skills (`roadmap`, `plan-phase`, `run`, `mono-plan`, `mono-guard`, `branch-lifecycle`, `provision-agentic-config`, `patch-exec-profile`), monorepo pack skills (`mono-run`, `mono-guard`, `mono-ship`), monorepo docs, lane-spec validator/fixtures, and task docs.
- **Per-file purpose:** Root and provisioned guidance now document the agent-team branch exception; planning skills require `Branch:` fields and consolidation/PR review steps; run/mono-run require branch, commit, validation, and PR evidence; guard/ship contracts verify branch/PR evidence; the lane-spec validator enforces non-primary unique branch names; docs and lessons preserve the policy.
- **User-goal mapping:** The branch exception is limited to `agent-team` parallel write lanes; normal serial shipping still routes to `main`/`master`. Agent-team plans now require branch-backed lanes and a consolidation/PR review gate before integration or shipping.
- **Tests run:** `./install.sh`; `./scripts/skill-deps.sh --broken`; `./scripts/skill-versions.sh --missing`; `./scripts/skill-next-step-routing.sh --missing`; `./scripts/skill-pack-routing-audit.sh`; `packs/monorepo/scripts/lane-spec-validate.sh tests/fixtures/monorepo/lane-specs-valid.json`; intentionally invalid `lane-specs-invalid.json` failed with the expected overlapping-owns error; `packs/monorepo/scripts/monorepo-validate.sh`; targeted branch/PR policy `rg` scan; `pnpm --dir tests test` passed with 5 files and 1177 tests; `git diff --check`.
- **Skipped tests:** No live agent-team GitHub branch/PR dispatch was run because these are skill-contract and fixture changes, not an execution of a real parallel phase against GitHub.
- **Adversarial review:** Checked for direct-to-primary contradictions, stale generated config text, missing branch fields in monorepo fixtures, and accidental branch-policy bleed into serial shipping. Also patched `provision-agentic-config` so future generated `AGENTS.md`/`CLAUDE.md` blocks retain the exception.
- **Residual risk:** Actual branch push and PR creation remain runtime responsibilities of the agent-team execution environment; the contracts now stop when GitHub branch/PR review is unavailable, but no live GitHub PR was opened for this documentation-policy update.
- **Rollback note:** Revert the Phase 31 commit to restore the prior direct-to-primary-only policy and lane-spec schema without branch requirements.
- **Next command:** `$brainstorm`

## Next Work

Phase 31 is complete. Run `$brainstorm` to discover a candidate next phase, or explicitly park the project if no new work is desired.

**Recommended next command:** `$brainstorm`

## Prior Review - 2026-05-06 Feature Interview Evidence Intake

- Updated mirrored Claude/Codex `feature-interview` contracts from v1.0.0 to v1.1.0.
- Added a required evidence-backed intake pass before deep questioning, including claim validation, technical gotcha discovery, journey/workflow placement, and documentation destination selection.
- Added a Planning Destination + Priority Checkpoint so roadmap/task mutation requires user-confirmed priority.
- Expanded deliverables so interview logs preserve evidence, gotchas, journey placement, documentation changes, priority decision, and next command.
- Refreshed Codex `agents/openai.yaml`, `docs/skills-reference.md`, and `docs/operating-modes.md` descriptions.
- Validation passed: stale-text scans, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `./scripts/skill-pack-routing-audit.sh`, `pnpm --dir tests test`, and `git diff --check`.

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
