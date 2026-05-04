# Active Phase: Phase 25 - Codebase Status

**Project:** Claude Skills / agentic-skills
**Status:** Phase 25 complete; priority queue refreshed for the next roadmap/spec-drift work.

## Priority Task Queue

- [ ] `$plan-phase 14` - generate implementation steps for Phase 14 LinkedIn Evidence Lane because `tasks/roadmap.md` still has unchecked Phase 14 acceptance criteria and `tasks/todo.md` is still oriented around completed Phase 25 work; evidence: `tasks/roadmap.md` modified 2026-05-04 11:04:38 -0400, `tasks/todo.md` modified 2026-05-04 11:09:39 -0400, Phase 14 acceptance criteria remain unchecked.
- [ ] `$spec-interview specs/monorepo-execution-controller.md` - confirm whether to implement the promised monorepo pack as a future roadmap phase or rescope the spec because `specs/drift-report.md` reports one Warning: `packs/monorepo/`, `mono-detect`, `mono-run`, `mono-ship`, and V1 validation scripts/fixtures are not implemented; evidence: `specs/drift-report.md` modified 2026-05-04 11:09:39 -0400 and `tasks/todo.md` already carries this spec drift follow-up.

## Current Phase Todo

- [x] Parse full Claude/Codex history for roadmap and status-audit patterns.
- [x] Inspect `roadmap` and overlapping analysis/status skills.
- [x] Document Phase 25 in `tasks/roadmap.md`.
- [x] Add mirrored `codebase-status` skills.
- [x] Add Codex `agents/openai.yaml`.
- [x] Update discovery docs and skill catalog mappings.
- [x] Run validation:
  - [x] `./install.sh`
  - [x] `./scripts/skill-deps.sh --broken`
  - [x] `./scripts/skill-versions.sh --missing`
  - [x] `./scripts/skill-next-step-routing.sh --missing`
  - [x] targeted `rg` checks for codebase-status behavior
  - [x] `git diff --check`
- [x] Commit and push intended changes.

## Current State

- [x] Phase 22: Feature Interview Routing is complete in `tasks/roadmap.md`.
- [x] Phase 23: Targeted Skill Builder is complete in `tasks/roadmap.md`.
- [x] Phase 24: Installer Skill is complete in `tasks/roadmap.md`.
- [x] Phase 25: Codebase Status is complete in `tasks/roadmap.md`.
- [ ] Discover candidate next phase or explicitly park the project.

## Spec Drift Follow-up

- [ ] Implement or rescope `specs/monorepo-execution-controller.md`.
  - Evidence: `$spec-drift fix all` on 2026-05-04 found that the spec promises a `packs/monorepo` V1 pack with `mono-detect`, `mono-run`, `mono-ship`, `mono-guard`, plus `scripts/mono-detect.sh`, `scripts/lane-spec-validate.sh`, `scripts/monorepo-validate.sh`, and monorepo fixtures.
  - Current repo state: only global advisory `mono-plan` and `mono-guard` skills exist; `packs/monorepo/` and the V1 scripts/fixtures do not exist.
  - Next implementation route: `$roadmap` should promote this into a new phase, or `$spec-interview specs/monorepo-execution-controller.md` should revise the spec if the intended scope is global skills only.

## Review

### Phase 25 Review

- Evidence scan:
  - Parsed full authored local histories: 8,506 Claude prompts and 4,386 Codex prompts.
  - Excluded injected skill payloads, AGENTS/system instructions, and tool-output shaped records from prompt-pattern counts.
  - Found 181 authored roadmap mentions and 111 roadmap/repo status-audit prompts relevant to this workflow shape.
  - Representative prompts included: `$roadmap ... what specs are outstanding and we need to work on?`, "ok what other work do we have outstanding?", "what is the status of our codebase in order to support that user story?", and "can you summarize all of the goal of this directory and what has happened so far and what is outstanding?"
- Decision: create a new `codebase-status` skill rather than overloading `roadmap`, because `roadmap` owns task-pipeline queue maintenance while the new workflow needs read-only status synthesis across code, task docs, git, and related conversation history.
- Implemented mirrored Claude/Codex `codebase-status` skills and Codex OpenAI agent metadata.
- Updated README, global `skills` discovery mappings, `docs/skills-reference.md`, `docs/operating-modes.md`, and `tasks/roadmap.md`.
- Ran `./install.sh`; installed `codebase-status` into both global Claude and Codex skill directories.
- Validation:
  - `./scripts/skill-deps.sh --broken` - passed; no broken references found.
  - `./scripts/skill-versions.sh --missing` - passed; all 295 skills have a version field.
  - `./scripts/skill-next-step-routing.sh --missing` - passed; all 217 mutation-capable skills have next-step routing.
  - Targeted `rg` scan - passed across mirrored skills, discovery docs, operating modes, and task docs.
  - `git diff --check` - passed; no whitespace errors.
- Reload note: after the install refresh, start a fresh Claude Code or Codex CLI/session if `codebase-status` is not visible yet.

### Phase 24 Review

- Implemented mirrored Claude/Codex `install-agentic-skills` skills and Codex OpenAI agent metadata.
- Added bundled launcher scripts that resolve the repository root from the skill directory and delegate to root `install.sh`.
- Updated README, global `skills` discovery tables, `docs/skills-reference.md`, and `docs/operating-modes.md`.
- Ran `./install.sh`; it completed with 0 newly installed Claude/Codex links because existing repo-managed symlinks were already current.
- Ran `global/codex/install-agentic-skills/scripts/install-agentic-skills.sh`; it delegated to root `install.sh` and completed cleanly with the same current-link result.
- Validation:
  - `global/codex/install-agentic-skills/scripts/install-agentic-skills.sh --help` - passed; printed root `install.sh` usage, including `--uninstall`.
  - Targeted installer/pack `rg` scan - passed across mirrored skills and discovery docs.
  - `./scripts/skill-deps.sh --broken` - passed; no broken references found.
  - `./scripts/skill-versions.sh --missing` - passed; all 293 skills have a version field.
  - `./scripts/skill-next-step-routing.sh --missing` - passed; all 215 mutation-capable skills have next-step routing.
  - `pnpm --dir tests test` - passed; 4 files and 1147 tests.
  - `git diff --check` - passed; no whitespace errors.
- Reload note: after the install refresh, start a fresh Claude Code or Codex CLI/session if `install-agentic-skills` is not visible yet.

### Phase 23 Review

- Implemented mirrored Claude/Codex `targeted-skill-builder` skills and Codex OpenAI agent metadata.
- Updated README, global `skills` discovery tables, `docs/skills-reference.md`, and `docs/operating-modes.md`.
- Ran `./install.sh`; refreshed 3 Claude core skills and 3 Codex core skills, including `targeted-skill-builder`.
- Validation:
  - `./scripts/skill-deps.sh --broken` - passed; no broken references found.
  - `./scripts/skill-versions.sh --missing` - passed; all 291 skills have a version field.
  - `./scripts/skill-next-step-routing.sh --missing` - passed; all 215 mutation-capable skills have next-step routing.
  - Targeted focused-behavior `rg` scan - passed; mirrored skills require `tasks/lessons.md` first, forbid default broad history scans, treat broad session analysis as optional evidence, require Codex `agents/openai.yaml`, and route uncertain planning to `feature-interview`.
  - `git diff --check` - passed; no whitespace errors.
- Reload note: after the install refresh, start a fresh Claude Code or Codex CLI/session if `targeted-skill-builder` is not visible yet.

### Previous Review

- Completed Phase 21 Step 21.6 repository validation and review gate.
- Validation:
  - `./scripts/skill-deps.sh --broken` - passed; no broken references found.
  - `./scripts/skill-versions.sh --missing` - passed; all 287 skills have a version field.
  - `./scripts/skill-next-step-routing.sh --missing` - passed; all 211 mutation-capable skills have next-step routing.
  - `git diff --check` - passed; no whitespace errors.
- Deploy skipped: no explicit manual deploy contract (`deploy.md` or `tasks/deploy.md`).
- `$research-roadmap` result: documentation queue is current; no priority documentation work, record item, or recurring item was promoted.
- Next route: `$brainstorm` unless a more specific project direction is supplied.

### Phase 22 Review

- Implemented mirrored Claude/Codex `feature-interview` skills and Codex OpenAI agent metadata.
- Updated brainstorm prompts, roadmap unspecced-idea handling, research routing, spec-interview post-spec routing, skill discovery, and routing docs.
- Validation:
  - `./scripts/skill-deps.sh --broken` - passed; no broken references found.
  - `./scripts/skill-versions.sh --missing` - passed; all 289 skills have a version field.
  - `./scripts/skill-next-step-routing.sh --missing` - passed; all 213 mutation-capable skills have next-step routing.
  - Targeted negative brainstorm/spec-interview routing scan - passed; no direct brainstorm prompt to spec-interview remains in mirrored brainstorm skills.
  - Targeted positive feature-interview routing scan - passed across brainstorm, roadmap, and discovery docs.
  - `pnpm --dir tests test` - passed; 4 files and 1147 tests.
  - `git diff --check` - passed; no whitespace errors.
