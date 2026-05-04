# Active Phase: Phase 26 - Monorepo Pack V1

**Project:** Claude Skills / agentic-skills
**Current phase:** 26 of 26
**Status:** Planned; ready for `/run`.

## Context

Phase 26 creates a new `monorepo` pack using an augmentation injection pattern — pack skills add pre/post steps to existing global skill contracts rather than duplicating them. V1 ships four skills (mono-detect, mono-run, mono-ship, mono-guard) targeting pnpm workspaces + Turborepo, with a structured lane-spec artifact (JSON + Markdown mirror) for parallel agent-team dispatch.

**Source Spec:** `specs/monorepo-execution-controller.md`

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Implementation

- [x] Step 26.1: Create the monorepo pack structure and PACK.md.
  - Classification: automated
  - Files: create `packs/monorepo/PACK.md`
  - Define the pack: name, description, skill list (mono-detect, mono-run, mono-ship, mono-guard), install instructions, and the augmentation injection pattern explanation.
  - Document that this pack targets pnpm workspaces + Turborepo and uses package-scope YAML frontmatter tags in specs/roadmap phases.
  - Include the v1/v2 scope boundary and the relationship to existing global `/mono-plan` and `/mono-guard` skills.

- [x] Step 26.2: Create the `mono-detect.sh` detection script and `.agents/monorepo.json` schema.
  - Classification: automated
  - Files: create `packs/monorepo/scripts/mono-detect.sh`
  - Detect workspace manager via `pnpm-workspace.yaml` presence, build orchestrator via `turbo.json` presence.
  - Enumerate packages from `pnpm-workspace.yaml` globs, read each `package.json` for name, dependencies, devDependencies, and scripts.
  - Build dependency graph from internal workspace references.
  - Validate the graph is a DAG (detect circular dependencies).
  - Output `.agents/monorepo.json` with workspace_manager, build_orchestrator, root, packages, dependency_graph, turbo_pipelines, and detected_at.
  - Support staleness check: re-run if workspace config files are newer than `.agents/monorepo.json`.

- Step 26.3: Create the lane-spec artifact schema and `lane-spec-validate.sh`.
  - Classification: automated
  - Files: create `packs/monorepo/scripts/lane-spec-validate.sh`
  - Validate `.agents/lane-specs.json` against required fields: phase, source_roadmap_hash, lifecycle, cross_cutting_steps, lanes (each with id, step, packages, owns, must_not_edit, depends_on, mode).
  - Check `owns` paths are disjoint across lanes.
  - Check every lane's `must_not_edit` includes `pnpm-lock.yaml` and root config files.
  - Check `depends_on` references resolve to valid step IDs.
  - Check lifecycle is a valid state: draft, approved, dispatched, integrated, failed.
  - Exit 0 on valid, exit 1 with diagnostic on invalid.

- Step 26.4: Create mirrored Claude/Codex `mono-detect` skill contracts.
  - Classification: automated
  - Files: create `packs/monorepo/claude/mono-detect/SKILL.md`, create `packs/monorepo/codex/mono-detect/SKILL.md`, create `packs/monorepo/codex/mono-detect/agents/openai.yaml`
  - Skill runs `mono-detect.sh`, reports workspace structure, package count, dependency graph summary, and Turborepo pipeline awareness.
  - Include staleness detection: re-run if config files are newer than `.agents/monorepo.json`.
  - If not a detected monorepo, exit with advisory and suggest `/mono-migrate` (v2).
  - Include augmentation injection pattern documentation: this is a foundation skill consumed by mono-run, mono-ship, and mono-guard.
  - Include next-step routing.

- Step 26.5: Create mirrored Claude/Codex `mono-guard` skill contracts.
  - Classification: automated
  - Files: create `packs/monorepo/claude/mono-guard/SKILL.md`, create `packs/monorepo/codex/mono-guard/SKILL.md`, create `packs/monorepo/codex/mono-guard/agents/openai.yaml`
  - Pre-flight mode: validate lane-spec JSON via `lane-spec-validate.sh`, verify `owns` disjointness, verify `must_not_edit` includes lockfiles and root config, verify dependency ordering is a valid DAG.
  - Post-integration mode: verify actual file changes (from `git diff`) match declared `owns` paths, flag any lane that wrote outside its boundary, flag any lockfile modifications from parallel agents.
  - Consume `.agents/lane-specs.json` and `.agents/monorepo.json`.
  - Reference the existing global `/mono-guard` skill contract for behavioral compatibility.
  - Include next-step routing.

- Step 26.6: Create mirrored Claude/Codex `mono-run` skill contracts.
  - Classification: automated
  - Files: create `packs/monorepo/claude/mono-run/SKILL.md`, create `packs/monorepo/codex/mono-run/SKILL.md`, create `packs/monorepo/codex/mono-run/agents/openai.yaml`
  - Document the augmentation injection: pre-execution (mono-detect, lane-spec generation, mono-guard pre-flight, plan-mode approval) → dispatch (cross-cutting serial first, then parallel worktree waves) → post-dispatch (mono-guard post-integration).
  - Delegate to standard `/run` when the project is not a detected monorepo or the phase mode is serial.
  - Generate `.agents/lane-specs.json` and `tasks/lane-specs.md` from roadmap execution profiles.
  - Implement stop-all-lanes failure semantics: any lane failure halts remaining agents, preserves worktree state, updates lane-spec lifecycle to `failed`.
  - Support flags: default (next step), `--phase` (all steps in current phase), `--pipeline` (plan → execute → ship).
  - Defer to `turbo run` for build/test/lint when `turbo.json` is present.
  - Include next-step routing.

- Step 26.7: Create mirrored Claude/Codex `mono-ship` skill contracts.
  - Classification: automated
  - Files: create `packs/monorepo/claude/mono-ship/SKILL.md`, create `packs/monorepo/codex/mono-ship/SKILL.md`, create `packs/monorepo/codex/mono-ship/agents/openai.yaml`
  - Document the augmentation injection: pre-ship (mono-detect, read lane-specs, package-scoped test/lint/build, transitive-dependent validation) → ship (delegate to `/ship`) → post-ship (update lane-specs.md).
  - Use dependency graph from `.agents/monorepo.json` to test transitive dependents of modified packages.
  - Defer to `turbo run` when available, fall back to `pnpm --filter`.
  - Stop and report on any validation failure before shipping.
  - Include next-step routing.

- Step 26.8: Wire the monorepo pack into repository docs and discovery.
  - Classification: automated
  - Files: modify `README.md`, modify `docs/skills-reference.md`, modify `docs/packs.md`
  - Register the monorepo pack in the pack list with description and skill inventory.
  - Document the augmentation injection pattern and how it differs from the `-kanban` duplication pattern.
  - Document the lane-spec artifact pattern (JSON + Markdown mirror) and its lifecycle.
  - Document package-scope YAML frontmatter tags for specs and roadmap phases.

- Step 26.9: Create `monorepo-validate.sh` pack validation script.
  - Classification: automated
  - Files: create `packs/monorepo/scripts/monorepo-validate.sh`
  - Contract compliance: all monorepo pack skills reference the augmentation injection pattern.
  - Lane-spec schema: validate fixture JSON files pass `lane-spec-validate.sh`.
  - Detection correctness: run `mono-detect.sh` against fixture directories and verify output.
  - Mirrored skill parity: Claude and Codex skill contracts are structurally consistent.
  - Codex skills have `agents/openai.yaml` manifests.

- Step 26.10: Create test fixtures for monorepo detection and lane-spec validation.
  - Classification: automated
  - Files: create `tests/fixtures/monorepo/pnpm-turbo/pnpm-workspace.yaml`, create `tests/fixtures/monorepo/pnpm-turbo/turbo.json`, create `tests/fixtures/monorepo/pnpm-turbo/packages/api/package.json`, create `tests/fixtures/monorepo/pnpm-turbo/packages/web/package.json`, create `tests/fixtures/monorepo/pnpm-turbo/packages/shared-lib/package.json`, create `tests/fixtures/monorepo/pnpm-only/pnpm-workspace.yaml`, create `tests/fixtures/monorepo/pnpm-only/packages/app/package.json`, create `tests/fixtures/monorepo/not-monorepo/package.json`, create `tests/fixtures/monorepo/lane-specs-valid.json`, create `tests/fixtures/monorepo/lane-specs-invalid.json`
  - pnpm-turbo fixture: 2 packages (api, web) + 1 shared lib with internal dependencies and Turbo pipelines.
  - pnpm-only fixture: single package without Turborepo.
  - not-monorepo fixture: standard single-app package.json with no workspace config.
  - lane-specs-valid.json: complete lane-spec with disjoint owns, valid must_not_edit, resolved depends_on.
  - lane-specs-invalid.json: overlapping owns paths (should fail validation).

### Green
- Step 26.11: Run focused validation for the monorepo pack.
  - Classification: automated
  - Files: modify `tasks/todo.md`
  - Run `packs/monorepo/scripts/monorepo-validate.sh` against fixtures and verify pass/fail.
  - Run `packs/monorepo/scripts/lane-spec-validate.sh tests/fixtures/monorepo/lane-specs-valid.json` (expect pass).
  - Run `packs/monorepo/scripts/lane-spec-validate.sh tests/fixtures/monorepo/lane-specs-invalid.json` (expect fail).
  - Run `packs/monorepo/scripts/mono-detect.sh` against each fixture directory and verify correct detection output.
  - Run targeted `rg` checks for augmentation injection language, lane-spec lifecycle, Turbo defer language, and stop-all-lanes semantics across all monorepo pack skills.
  - Run `pnpm --dir tests test`.
  - Run `./scripts/skill-deps.sh --broken`.
  - Run `./scripts/skill-versions.sh --missing`.
  - Run `./scripts/skill-next-step-routing.sh --missing`.
  - Run `git diff --check`.
  - Record exact command results in the `tasks/todo.md` review section.

### Milestone: Phase 26 Monorepo Pack V1
**Acceptance Criteria:**
- [ ] `mono-detect` correctly identifies pnpm workspaces and Turborepo, outputs `.agents/monorepo.json` with package list and dependency graph.
- [ ] `mono-run` generates lane specs from roadmap execution profiles, runs `/mono-guard` pre-flight, dispatches parallel worktree agents for package-scoped steps, and runs cross-cutting steps serially.
- [ ] `mono-run` stops all lanes on any lane failure and preserves worktree state.
- [ ] `mono-ship` runs package-scoped and transitive-dependent tests/lint/build before delegating to `/ship`.
- [ ] `mono-guard` validates lane-spec disjointness pre-flight and boundary compliance post-integration.
- [ ] Lane-spec artifact follows JSON + Markdown mirror pattern with lifecycle tracking.
- [ ] Skills defer to `turbo run` when `turbo.json` is present, fall back to `pnpm --filter` otherwise.
- [ ] Mirrored Claude/Codex skill contracts exist for all v1 skills.
- [ ] Pack structure registered in README, `docs/skills-reference.md`, and `docs/packs.md`.
- [ ] Script-based validation passes for contracts, lane-spec schema, detection, and boundary checks.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: [none, or describe]
- Tech debt / follow-ups: [none, or list]
- Ready for next phase: yes/no

## Review

- Planning created from `tasks/roadmap.md` Phase 26 and `specs/monorepo-execution-controller.md`.
- No manual tasks identified; this phase is repo-edit, script, and local-validation work only.
- No record or recurring tasks identified.

### Step 26.1 Review - Monorepo Pack Structure

**Result:** Created `packs/monorepo/PACK.md` as the monorepo pack contract.

**Ship manifest:**
- User goal: Execute the next `$run` unit from the active Phase 26 plan.
- Changed files: `packs/monorepo/PACK.md`, `tasks/todo.md`, `tasks/history.md`.
- Per-file purpose: `PACK.md` defines the new pack, skill inventory, augmentation injection pattern, pnpm/Turbo scope, package-scope tags, V1/V2 boundary, and relationship to global monorepo skills; `tasks/todo.md` records Step 26.1 completion and review evidence; `tasks/history.md` records the shipped project history.
- User-goal mapping: Step 26.1 explicitly requires creating the monorepo pack structure and `PACK.md`; task and history updates satisfy the `$run` shipping contract.
- Tests run: `rg -n "augmentation injection pattern|pnpm-workspace.yaml|turbo.json|package-scope|V1|V2|mono-detect|mono-run|mono-ship|mono-guard|global /mono-plan|global /mono-guard" packs/monorepo/PACK.md` passed; `git diff --check` passed.
- Skipped tests: executable monorepo scripts and pack fixtures do not exist until later Phase 26 steps, so script-based validation is not applicable to Step 26.1.
- Adversarial review: changed-file self-review plus targeted contract scans found one gap: concrete install commands were missing from `PACK.md`; fixed before commit.
- Residual risk: the pack is not discoverable from global docs until planned Step 26.8, so users must know the pack path or install name before that docs registration step.
- Rollback note: revert the Step 26.1 commit to remove the new pack contract and task/history records.
- Next command: `$run`.

### Step 26.2 Review - Monorepo Detection Script

**Result:** Created `packs/monorepo/scripts/mono-detect.sh` to generate `.agents/monorepo.json` for pnpm workspace monorepos.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 26 plan.
- **Changed files:** `packs/monorepo/scripts/mono-detect.sh`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `mono-detect.sh` implements the Step 26.2 detection command, including pnpm workspace detection, package enumeration, dependency graph construction, DAG validation, Turbo pipeline detection, `.agents/monorepo.json` output, and `--check-stale`; `tasks/todo.md` records Step 26.2 completion and validation evidence; `tasks/history.md` records the shipped project history.
- **User-goal mapping:** Step 26.2 explicitly requires creating the detection script and `.agents/monorepo.json` schema behavior; the script provides that command surface and the task/history updates satisfy the `$run` shipping contract.
- **Tests run:** `bash -n packs/monorepo/scripts/mono-detect.sh` passed; temporary pnpm+Turbo fixture detection passed and verified `workspace_manager`, `build_orchestrator`, package count, external dependency preservation, internal `dependency_graph`, Turbo pipeline list, and `--check-stale`; temporary circular dependency fixture failed as expected with `workspace dependency graph contains a cycle: a -> b -> a`; temporary non-monorepo fixture failed as expected with `not a detected pnpm monorepo`; `pnpm --dir tests test` passed with 4 files and 1148 tests; `git diff --check` passed.
- **Skipped tests:** full fixture-backed `monorepo-validate.sh`, `tests/fixtures/monorepo/*`, and lane-spec validation are planned for later Phase 26 steps, so this step used temporary local fixtures instead of committing test fixtures ahead of Step 26.10.
- **Adversarial review:** changed-file self-review found that package dependency arrays were incorrectly collapsed to internal-only dependencies while the schema needed to preserve package.json dependency keys; fixed by preserving package entries and filtering only `dependency_graph` to internal workspace references. The same review found a stale status-line variable after that fix; fixed and reran checks.
- **Residual risk:** the pnpm-workspace YAML parser intentionally supports the common `packages:` list shape used by pnpm workspaces but is not a full YAML parser; Step 26.10 fixtures and Step 26.11 pack validation should cover the supported contract before broader use.
- **Rollback note:** revert the Step 26.2 commit to remove the detection script and task/history records.
- **Next command:** `$run`.
