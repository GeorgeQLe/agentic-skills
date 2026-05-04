# Active Phase: Phase 26 - Monorepo Pack V1

**Project:** Claude Skills / agentic-skills
**Current phase:** 26 of 26
**Status:** Planned; ready for `/run`.

## Current Request: Remotion Pack Split

**Goal:** Separate Remotion-oriented format, script, and implementation workflows from the broader `creator-media` pack so projects can opt into creator-media strategy without also enabling Remotion production skills.

**Plan:**
- [x] Create a new `packs/remotion` pack with mirrored Claude/Codex `youtube-format-research`, `video-script`, and `video-build` skill contracts.
- [x] Remove those three skills from the `creator-media` pack inventory and default flow while preserving handoffs from creator-media research into Remotion production.
- [x] Update pack selection, install docs, skill references, and tests to install `remotion` where `video-build` is exercised.
- [x] Run focused validation for pack listing, routing scans, relevant tests, and diff hygiene.

**Review:** Created `packs/remotion` and moved mirrored `youtube-format-research`, `video-script`, and `video-build` skill contracts from `creator-media`. Updated creator-media pack docs and fallback routing to treat those skills as Remotion-pack handoffs. Updated README, pack docs, skill references, next-step contract notes, pack normalization, and layer2 video tests to use `remotion`.

Validation passed:
- `scripts/pack.sh list` includes `remotion`.
- `./scripts/skill-versions.sh --missing` -> `All 310 skills have a version field.`
- `./scripts/skill-deps.sh --broken` -> `No broken references found.`
- `./scripts/skill-next-step-routing.sh --missing` -> `All 225 mutation-capable skills have next-step routing.`
- `pnpm --dir tests test -- --run tests/layer2/video-script.test.ts tests/layer2/video-build.test.ts tests/layer2/video-pipeline.test.ts` ran the configured layer1 project and passed 1143 tests.
- Temporary `scripts/pack.sh install remotion` linked all three Claude and Codex Remotion skills and wrote `enabled_packs: ["remotion"]`.
- Targeted `rg` checks confirmed layer2 video tests now install/use `remotion`.
- `git diff --check` passed.

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

- [x] Step 26.3: Create the lane-spec artifact schema and `lane-spec-validate.sh`.
  - Classification: automated
  - Files: create `packs/monorepo/scripts/lane-spec-validate.sh`
  - Validate `.agents/lane-specs.json` against required fields: phase, source_roadmap_hash, lifecycle, cross_cutting_steps, lanes (each with id, step, packages, owns, must_not_edit, depends_on, mode).
  - Check `owns` paths are disjoint across lanes.
  - Check every lane's `must_not_edit` includes `pnpm-lock.yaml` and root config files.
  - Check `depends_on` references resolve to valid step IDs.
  - Check lifecycle is a valid state: draft, approved, dispatched, integrated, failed.
  - Exit 0 on valid, exit 1 with diagnostic on invalid.

- [x] Step 26.4: Create mirrored Claude/Codex `mono-detect` skill contracts.
  - Classification: automated
  - Files: create `packs/monorepo/claude/mono-detect/SKILL.md`, create `packs/monorepo/codex/mono-detect/SKILL.md`, create `packs/monorepo/codex/mono-detect/agents/openai.yaml`
  - Skill runs `mono-detect.sh`, reports workspace structure, package count, dependency graph summary, and Turborepo pipeline awareness.
  - Include staleness detection: re-run if config files are newer than `.agents/monorepo.json`.
  - If not a detected monorepo, exit with advisory and suggest `/mono-migrate` (v2).
  - Include augmentation injection pattern documentation: this is a foundation skill consumed by mono-run, mono-ship, and mono-guard.
  - Include next-step routing.

- [x] Step 26.5: Create mirrored Claude/Codex `mono-guard` skill contracts.
  - Classification: automated
  - Files: create `packs/monorepo/claude/mono-guard/SKILL.md`, create `packs/monorepo/codex/mono-guard/SKILL.md`, create `packs/monorepo/codex/mono-guard/agents/openai.yaml`
  - Pre-flight mode: validate lane-spec JSON via `lane-spec-validate.sh`, verify `owns` disjointness, verify `must_not_edit` includes lockfiles and root config, verify dependency ordering is a valid DAG.
  - Post-integration mode: verify actual file changes (from `git diff`) match declared `owns` paths, flag any lane that wrote outside its boundary, flag any lockfile modifications from parallel agents.
  - Consume `.agents/lane-specs.json` and `.agents/monorepo.json`.
  - Reference the existing global `/mono-guard` skill contract for behavioral compatibility.
  - Include next-step routing.

- [x] Step 26.6: Create mirrored Claude/Codex `mono-run` skill contracts.
  - Classification: automated
  - Files: create `packs/monorepo/claude/mono-run/SKILL.md`, create `packs/monorepo/codex/mono-run/SKILL.md`, create `packs/monorepo/codex/mono-run/agents/openai.yaml`
  - Document the augmentation injection: pre-execution (mono-detect, lane-spec generation, mono-guard pre-flight, plan-mode approval) → dispatch (cross-cutting serial first, then parallel worktree waves) → post-dispatch (mono-guard post-integration).
  - Delegate to standard `/run` when the project is not a detected monorepo or the phase mode is serial.
  - Generate `.agents/lane-specs.json` and `tasks/lane-specs.md` from roadmap execution profiles.
  - Implement stop-all-lanes failure semantics: any lane failure halts remaining agents, preserves worktree state, updates lane-spec lifecycle to `failed`.
  - Support flags: default (next step), `--phase` (all steps in current phase), `--pipeline` (plan → execute → ship).
  - Defer to `turbo run` for build/test/lint when `turbo.json` is present.
  - Include next-step routing.

- [x] Step 26.7: Create mirrored Claude/Codex `mono-ship` skill contracts.
  - Classification: automated
  - Files: create `packs/monorepo/claude/mono-ship/SKILL.md`, create `packs/monorepo/codex/mono-ship/SKILL.md`, create `packs/monorepo/codex/mono-ship/agents/openai.yaml`
  - Document the augmentation injection: pre-ship (mono-detect, read lane-specs, package-scoped test/lint/build, transitive-dependent validation) → ship (delegate to `/ship`) → post-ship (update lane-specs.md).
  - Use dependency graph from `.agents/monorepo.json` to test transitive dependents of modified packages.
  - Defer to `turbo run` when available, fall back to `pnpm --filter`.
  - Stop and report on any validation failure before shipping.
  - Include next-step routing.

- [x] Step 26.8: Wire the monorepo pack into repository docs and discovery.
  - Classification: automated
  - Files: modify `README.md`, modify `docs/skills-reference.md`, modify `docs/packs.md`
  - Register the monorepo pack in the pack list with description and skill inventory.
  - Document the augmentation injection pattern and how it differs from the `-kanban` duplication pattern.
  - Document the lane-spec artifact pattern (JSON + Markdown mirror) and its lifecycle.
  - Document package-scope YAML frontmatter tags for specs and roadmap phases.

- [x] Step 26.9: Create `monorepo-validate.sh` pack validation script.
  - Classification: automated
  - Files: create `packs/monorepo/scripts/monorepo-validate.sh`
  - Contract compliance: all monorepo pack skills reference the augmentation injection pattern.
  - Lane-spec schema: validate fixture JSON files pass `lane-spec-validate.sh`.
  - Detection correctness: run `mono-detect.sh` against fixture directories and verify output.
  - Mirrored skill parity: Claude and Codex skill contracts are structurally consistent.
  - Codex skills have `agents/openai.yaml` manifests.

- [ ] Step 26.10: Create test fixtures for monorepo detection and lane-spec validation.
  - Classification: automated
  - Files: create `tests/fixtures/monorepo/pnpm-turbo/pnpm-workspace.yaml`, create `tests/fixtures/monorepo/pnpm-turbo/turbo.json`, create `tests/fixtures/monorepo/pnpm-turbo/packages/api/package.json`, create `tests/fixtures/monorepo/pnpm-turbo/packages/web/package.json`, create `tests/fixtures/monorepo/pnpm-turbo/packages/shared-lib/package.json`, create `tests/fixtures/monorepo/pnpm-only/pnpm-workspace.yaml`, create `tests/fixtures/monorepo/pnpm-only/packages/app/package.json`, create `tests/fixtures/monorepo/not-monorepo/package.json`, create `tests/fixtures/monorepo/lane-specs-valid.json`, create `tests/fixtures/monorepo/lane-specs-invalid.json`
  - pnpm-turbo fixture: 2 packages (api, web) + 1 shared lib with internal dependencies and Turbo pipelines.
  - pnpm-only fixture: single package without Turborepo.
  - not-monorepo fixture: standard single-app package.json with no workspace config.
  - lane-specs-valid.json: complete lane-spec with disjoint owns, valid must_not_edit, resolved depends_on.
  - lane-specs-invalid.json: overlapping owns paths (should fail validation).

### Green
- [ ] Step 26.11: Run focused validation for the monorepo pack.
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

### Step 26.3 Review - Lane-Spec Validation Script

**Result:** Created `packs/monorepo/scripts/lane-spec-validate.sh` to validate `.agents/lane-specs.json` artifacts.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 26 plan.
- **Changed files:** `packs/monorepo/scripts/lane-spec-validate.sh`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `lane-spec-validate.sh` implements the Step 26.3 lane-spec validation command, including required schema fields, lifecycle validation, disjoint lane ownership boundaries, required root `must_not_edit` boundaries, and dependency reference checks; `tasks/todo.md` records Step 26.3 completion and validation evidence; `tasks/history.md` records the shipped project history.
- **User-goal mapping:** Step 26.3 explicitly requires creating the lane-spec artifact schema validator; the script provides the command surface that later `mono-guard`, `mono-run`, and pack validation steps can consume, while task/history updates satisfy the `$run` shipping contract.
- **Tests run:** `bash -n packs/monorepo/scripts/lane-spec-validate.sh` passed; temporary valid lane-spec fixture passed; temporary overlapping `owns` fixture failed as expected with `owns paths overlap`; temporary missing root boundary fixture failed as expected with `missing required root boundary: turbo.json`; temporary unknown dependency fixture failed as expected with `depends_on references unknown step: 26.99`; temporary invalid lifecycle fixture failed as expected with `invalid lifecycle: reviewed`; temporary duplicate step fixture failed as expected with `duplicate step id: 26.1`; `pnpm --dir tests test` passed with 4 files and 1148 tests; `git diff --check` passed.
- **Skipped tests:** committed `tests/fixtures/monorepo/*` and `monorepo-validate.sh` are planned for later Phase 26 steps, so this step used temporary local fixtures instead of committing the Step 26.10 fixture set early.
- **Adversarial review:** changed-file self-review found that duplicate cross-cutting step IDs were not rejected, which could let `depends_on` resolution become ambiguous; fixed by rejecting duplicate step IDs while collecting cross-cutting steps, then reran focused fixtures and regression tests.
- **Residual risk:** root config coverage is encoded as the v1 shared-boundary set `pnpm-lock.yaml`, `package.json`, `pnpm-workspace.yaml`, and `turbo.json`; projects with additional root config chokepoints will need generated lane specs to include those explicitly until later guard/run steps decide whether to infer project-specific root config files.
- **Rollback note:** revert the Step 26.3 commit to remove the validator and task/history records.
- **Next command:** `$run`.

### Step 26.4 Review - Mono Detect Skill Contracts

**Result:** Created mirrored Claude/Codex `mono-detect` skill contracts and Codex OpenAI metadata.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 26 plan.
- **Changed files:** `packs/monorepo/claude/mono-detect/SKILL.md`, `packs/monorepo/codex/mono-detect/SKILL.md`, `packs/monorepo/codex/mono-detect/agents/openai.yaml`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** Claude and Codex `mono-detect` skill contracts define how to run `mono-detect.sh`, handle staleness, report workspace/package/dependency/Turbo summaries, advise `/mono-migrate` or `$mono-migrate` for non-monorepos, and document the augmentation injection foundation for `mono-run`, `mono-ship`, and `mono-guard`; `openai.yaml` registers Codex display metadata and implicit invocation policy; `tasks/todo.md` records Step 26.4 completion and validation evidence; `tasks/history.md` records the shipped project history.
- **User-goal mapping:** Step 26.4 explicitly requires creating mirrored Claude/Codex `mono-detect` contracts plus the Codex OpenAI manifest; the new files provide those contracts, and the task/history updates satisfy the `$run` shipping contract.
- **Tests run:** targeted `rg` scan passed for frontmatter, `mono-detect.sh`, `--check-stale`, `pnpm-workspace.yaml`, `turbo.json`, `.agents/monorepo.json`, foundation language, `mono-run`, `mono-ship`, `mono-guard`, `mono-migrate`, and next-step routing across both skill contracts; Claude/Codex `diff -u` showed only expected invocation wording differences and the Codex `Invoke as` line; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 297 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 219 mutation-capable skills covered; `pnpm --dir tests test` passed with 4 files and 1154 tests; `git diff --check` passed.
- **Skipped tests:** full `monorepo-validate.sh` fixture-backed validation is planned for Step 26.9 and fixtures are planned for Step 26.10, so this step used repository skill audits and targeted contract scans instead of pack-level fixture validation.
- **Adversarial review:** changed-file self-review checked that the contracts do not modify task files, do not run install/add commands, do not infer non-pnpm managers in V1, and do not hand-edit `.agents/monorepo.json`; no source changes were needed after review.
- **Residual risk:** `/mono-migrate` and `$mono-migrate` are documented as V2 advisory routes but are not implemented in this V1 pack; users who follow that route before V2 exists will need roadmap/spec planning rather than an installed skill.
- **Rollback note:** revert the Step 26.4 commit to remove the new `mono-detect` skill contracts, Codex metadata, and task/history records.
- **Next command:** `$run`.

### Step 26.5 Review - Mono Guard Skill Contracts

**Result:** Created mirrored Claude/Codex `mono-guard` skill contracts and Codex OpenAI metadata.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 26 plan.
- **Changed files:** `packs/monorepo/claude/mono-guard/SKILL.md`, `packs/monorepo/codex/mono-guard/SKILL.md`, `packs/monorepo/codex/mono-guard/agents/openai.yaml`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** Claude and Codex `mono-guard` skill contracts define pre-flight validation via `lane-spec-validate.sh`, `.agents/lane-specs.json`, `.agents/monorepo.json`, `owns` disjointness, root/lockfile `must_not_edit` boundaries, dependency ordering, lane DAG checks, and post-integration `git diff --name-only` boundary audits; `openai.yaml` registers Codex display metadata and implicit invocation policy; `tasks/todo.md` records Step 26.5 completion and validation evidence; `tasks/history.md` records the shipped project history.
- **User-goal mapping:** Step 26.5 explicitly requires mirrored Claude/Codex `mono-guard` contracts plus the Codex OpenAI manifest; the new files provide those contracts, and the task/history updates satisfy the `$run` shipping contract.
- **Tests run:** targeted `rg` scan passed for frontmatter, `.agents/lane-specs.json`, `.agents/monorepo.json`, `lane-spec-validate.sh`, pre-flight/post-integration modes, `owns`, `must_not_edit`, `pnpm-lock.yaml`, `turbo.json`, `dependency_graph`, `git diff --name-only`, global `mono-guard` compatibility, `mono-run`, `mono-ship`, and next-step routing across both skill contracts; Claude/Codex `diff -u` showed only expected invocation wording differences and the Codex `Invoke as` line; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 299 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 221 mutation-capable skills covered; `pnpm --dir tests test` passed with 4 files and 1160 tests; `git diff --check` passed.
- **Skipped tests:** full `monorepo-validate.sh` fixture-backed validation is planned for Step 26.9 and committed monorepo fixtures are planned for Step 26.10, so this step used repository skill audits and targeted contract scans instead of pack-level fixture validation.
- **Adversarial review:** changed-file self-review checked that the contracts consume `lane-spec-validate.sh` rather than duplicating schema validation, preserve behavioral compatibility with global `/mono-guard` or `$mono-guard`, do not edit task files, do not run package-manager install/add commands, and report post-integration violations without reverting changes; no contract changes were needed after review.
- **Residual risk:** dependency-order validation is specified in the skill contract but not yet implemented as a standalone script beyond the lane-spec schema checks; Step 26.9 `monorepo-validate.sh` should enforce that the pack contracts and fixtures exercise this behavior before phase completion.
- **Rollback note:** revert the Step 26.5 commit to remove the new `mono-guard` skill contracts, Codex metadata, and task/history records.
- **Next command:** `$run`.

### Step 26.6 Review - Mono Run Skill Contracts

**Result:** Created mirrored Claude/Codex `mono-run` skill contracts and Codex OpenAI metadata.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 26 plan.
- **Changed files:** `packs/monorepo/claude/mono-run/SKILL.md`, `packs/monorepo/codex/mono-run/SKILL.md`, `packs/monorepo/codex/mono-run/agents/openai.yaml`, `tasks/todo.md`, `tasks/history.md`.
- **Unrelated worktree changes:** `tasks/lessons.md` and `global/codex/spin-off/` were already dirty or appeared outside this Step 26.6 scope; they are not included in this shipping boundary.
- **Per-file purpose:** Claude and Codex `mono-run` skill contracts define the augmentation injection pattern around standard run, including `mono-detect`, lane-spec generation, `mono-guard` pre-flight, plan-mode approval, cross-cutting serial execution, package-scoped worktree dispatch, stop-all-lanes failure semantics, post-integration guard checks, `--phase`, `--pipeline`, Turbo validation preference, pnpm fallback, and next-step routing; `openai.yaml` registers Codex display metadata and implicit invocation policy; `tasks/todo.md` records Step 26.6 completion and validation evidence; `tasks/history.md` records the shipped project history.
- **User-goal mapping:** Step 26.6 explicitly requires mirrored Claude/Codex `mono-run` contracts plus the Codex OpenAI manifest; the new files provide those contracts, and the task/history updates satisfy the `$run` shipping contract.
- **Tests run:** targeted `rg` scan passed for frontmatter, augmentation injection language, `mono-detect`, lane specs, `.agents/lane-specs.json`, `tasks/lane-specs.md`, `mono-guard`, pre-flight, plan-mode approval, cross-cutting serial work, worktree dispatch, stop-all-lanes semantics, failed lifecycle, `--phase`, `--pipeline`, `turbo run`, `pnpm --filter`, `mono-ship`, and next-step routing across both skill contracts; Claude/Codex `diff -u` showed only expected invocation wording differences and the Codex `Invoke as` line; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 302 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 223 mutation-capable skills covered; `pnpm --dir tests test` passed with 4 files and 1166 tests; `git diff --check` passed.
- **Skipped tests:** full `monorepo-validate.sh` fixture-backed validation is planned for Step 26.9 and committed monorepo fixtures are planned for Step 26.10, so this step used repository skill audits and targeted contract scans instead of pack-level fixture validation.
- **Adversarial review:** changed-file self-review checked that `mono-run` preserves standard `/run` or `$run` ownership for task selection, validation, history, commit/push, deploy, and next-step routing; does not dispatch package lanes without guard approval; does not allow package-manager install/add commands in lanes; and records lifecycle failure instead of shipping partial lane work. No contract changes were needed after review.
- **Residual risk:** lane-spec generation and actual worktree dispatch are documented as the skill contract but are not implemented as executable scripts in this step; later Step 26.9 pack validation and Step 26.11 focused validation should prove the contract language remains coherent across the full monorepo pack.
- **Rollback note:** revert the Step 26.6 commit to remove the new `mono-run` skill contracts, Codex metadata, and task/history records.
- **Next command:** `$run`.

### Step 26.7 Review - Mono Ship Skill Contracts

**Result:** Created mirrored Claude/Codex `mono-ship` skill contracts and Codex OpenAI metadata.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 26 plan.
- **Changed files:** `packs/monorepo/claude/mono-ship/SKILL.md`, `packs/monorepo/codex/mono-ship/SKILL.md`, `packs/monorepo/codex/mono-ship/agents/openai.yaml`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** Claude and Codex `mono-ship` skill contracts define the augmentation injection pattern around standard ship, including `mono-detect`, `.agents/lane-specs.json`, `.agents/monorepo.json`, package-scoped test/lint/build, transitive-dependent validation from `dependency_graph`, Turbo validation preference, `pnpm --filter` fallback, validation-failure stop behavior, standard ship delegation, post-ship lane-spec mirror status updates, and next-step routing; `openai.yaml` registers Codex display metadata and implicit invocation policy; `tasks/todo.md` records Step 26.7 completion and validation evidence; `tasks/history.md` records the shipped project history.
- **User-goal mapping:** Step 26.7 explicitly requires mirrored Claude/Codex `mono-ship` contracts plus the Codex OpenAI manifest; the new files provide those contracts, and the task/history updates satisfy the `$run` shipping contract.
- **Tests run:** targeted `rg` scan passed for frontmatter, augmentation injection language, `mono-detect`, `.agents/lane-specs.json`, `.agents/monorepo.json`, package-scoped validation, transitive-dependent validation, `dependency_graph`, `turbo run`, `pnpm --filter`, ship delegation, `tasks/lane-specs.md`, validation-failure stop behavior, and next-step routing across both skill contracts; Claude/Codex `diff -u` showed only expected invocation wording differences and the Codex `Invoke as` line; Codex metadata inspection passed; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 304 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 225 mutation-capable skills covered; `pnpm --dir tests test` passed with 4 files and 1172 tests; `git diff --check` passed.
- **Skipped tests:** full `monorepo-validate.sh` fixture-backed validation is planned for Step 26.9 and committed monorepo fixtures are planned for Step 26.10, so this step used repository skill audits and targeted contract scans instead of pack-level fixture validation.
- **Adversarial review:** initial `pnpm --dir tests test` exposed an output-path conflict because the `mono-ship` Output section claimed the same `tasks/lane-specs.md` output path as `mono-run`; fixed by keeping the required post-ship status behavior while changing the Output section to avoid independent artifact ownership, then reran the full suite successfully.
- **Residual risk:** package/transitive validation is documented as a skill contract but not yet enforced by an executable pack validation script; later Step 26.9 `monorepo-validate.sh` and Step 26.11 focused validation should prove the full pack contract against fixtures.
- **Rollback note:** revert the Step 26.7 commit to remove the new `mono-ship` skill contracts, Codex metadata, and task/history records.
- **Next command:** `$run`.

### Step 26.8 Review - Monorepo Pack Docs And Discovery

**Result:** Registered the monorepo pack in repository docs and discovery references.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 26 plan.
- **Changed files:** `README.md`, `docs/skills-reference.md`, `docs/packs.md`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `README.md` adds `monorepo` to project pack install examples, repository structure, and pack inventory with augmentation injection, lane-spec artifact, lifecycle, and package-scope tag documentation; `docs/skills-reference.md` adds a Monorepo Pack section with install command, skill inventory, default flow, augmentation pattern, lane-spec lifecycle, and package-scope tags; `docs/packs.md` adds `monorepo` to pack commands and selection guidance plus a dedicated Monorepo Pack section; `tasks/todo.md` records Step 26.8 completion and validation evidence; `tasks/history.md` records the shipped project history.
- **User-goal mapping:** Step 26.8 explicitly requires updating README, skills reference, and packs docs to register the pack, describe augmentation injection versus `-kanban` duplication, document lane-spec artifacts and lifecycle, and document package-scope YAML frontmatter tags; the edited docs cover each requested discovery surface and task/history updates satisfy the `$run` shipping contract.
- **Tests run:** targeted `rg` scan passed for `monorepo`, `mono-detect`, `mono-run`, `mono-guard`, `mono-ship`, augmentation injection pattern, `kanban`, `.agents/lane-specs.json`, `tasks/lane-specs.md`, lifecycle states `draft`/`approved`/`dispatched`/`integrated`/`failed`, `packages: [api, web]`, `scope: cross-cutting`, `package-scoped`, and `root-only` across `README.md`, `docs/skills-reference.md`, and `docs/packs.md`; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 304 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 225 mutation-capable skills covered; `pnpm --dir tests test` passed with 4 files and 1172 tests; `git diff --check` passed.
- **Skipped tests:** no executable monorepo pack behavior changed in this step; fixture-backed `monorepo-validate.sh` validation is planned for Step 26.9 and committed fixtures are planned for Step 26.10, so this docs-only registration used targeted docs scans plus the repository structural test suite.
- **Adversarial review:** changed-file self-review checked that docs register `monorepo` consistently in install examples, pack selection, structure, and skill inventory; distinguish augmentation injection from `*-kanban` workflow variants; and avoid claiming executable validation coverage before Step 26.9/26.11. No further edits were needed after the validation pass.
- **Residual risk:** docs now expose the monorepo pack before fixture-backed pack validation exists; Step 26.9 through Step 26.11 remain necessary to prove the executable validation surface.
- **Rollback note:** revert the Step 26.8 commit to remove monorepo pack registration from repository docs and task/history records.
- **Next command:** `$run`.

### Step 26.9 Review - Monorepo Pack Validation Script

**Result:** Created `packs/monorepo/scripts/monorepo-validate.sh` and normalized detect/guard contracts so pack validation can enforce the augmentation injection pattern consistently.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 26 plan.
- **Changed files:** `packs/monorepo/scripts/monorepo-validate.sh`, `packs/monorepo/claude/mono-detect/SKILL.md`, `packs/monorepo/codex/mono-detect/SKILL.md`, `packs/monorepo/claude/mono-guard/SKILL.md`, `packs/monorepo/codex/mono-guard/SKILL.md`, `tasks/todo.md`, `tasks/history.md`.
- **Unrelated worktree changes:** pre-existing Remotion planning edits in `tasks/lessons.md`, `tasks/roadmap.md`, and the top "Current Request" section of `tasks/todo.md` are outside the Step 26.9 shipping boundary and were preserved.
- **Per-file purpose:** `monorepo-validate.sh` validates monorepo pack skill augmentation sections, next-step routing, Claude/Codex mirror structure, Codex `agents/openai.yaml` manifests, lane-spec fixtures, and detection fixtures; detect/guard skill edits add explicit `## Augmentation Injection Pattern` sections so contract compliance is enforceable; task/history files record completion and validation evidence.
- **User-goal mapping:** Step 26.9 explicitly requires a pack validation script covering contract compliance, lane-spec fixtures, detection fixtures, mirrored skill parity, and Codex manifests; the script implements those checks and supports `--skip-fixtures` so pre-fixture contract validation can run before Step 26.10 creates committed fixtures.
- **Tests run:** `bash -n packs/monorepo/scripts/monorepo-validate.sh` passed; `packs/monorepo/scripts/monorepo-validate.sh --skip-fixtures` passed contract, parity, and manifest checks; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 310 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 225 mutation-capable skills covered; `pnpm --dir tests test` passed with 4 files and 1185 tests; `git diff --check` passed; `scripts/ship-quality-gate.sh tasks/todo.md` passed.
- **Skipped tests:** fixture-backed `monorepo-validate.sh` mode was not run because committed fixtures are explicitly planned for Step 26.10; the script fails missing fixtures by default and Step 26.11 will run it against the committed fixture set.
- **Adversarial review:** changed-file self-review checked that validation fails closed for missing fixture directories unless `--skip-fixtures` is explicit, avoids weakening contract compliance to loose text searches, verifies Codex manifests for every Codex monorepo skill, and copies detection fixtures to a temporary directory before running `mono-detect.sh` so validation does not dirty committed fixtures.
- **Residual risk:** the fixture-checking branch is implemented but not yet exercised against committed fixtures; Step 26.10 and Step 26.11 are required to prove the default validation path end to end.
- **Rollback note:** revert the Step 26.9 commit to remove the validation script, detect/guard contract normalization, and task/history records.
- **Next command:** `$run`.
