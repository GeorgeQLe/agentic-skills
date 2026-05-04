---
name: mono-run
description: Augment the standard run lifecycle with monorepo detection, lane-spec generation, guard validation, and package-scoped dispatch
type: execution
version: 1.0.0
argument-hint: "[--phase] [--pipeline]"
---

# Mono Run

Use this skill to run planned work in a pnpm workspace monorepo with package-aware guardrails. `mono-run` does not replace `/run`; it injects monorepo-aware pre/post steps around the standard `/run` contract.

## Augmentation Injection Pattern

`mono-run` adds these stages around normal run execution:

1. **Pre-execution:** run `mono-detect`, generate lane specs when the phase is eligible for parallel monorepo dispatch, run `mono-guard` pre-flight, and present lane specs for plan-mode approval.
2. **Dispatch:** run cross-cutting steps serially first in the main agent, then dispatch package-scoped worktree waves only after lane specs are approved and guard validation passes.
3. **Post-dispatch:** run `mono-guard --post-integration`, update lane-spec lifecycle, then continue to `mono-ship` when shipping is requested.

The global `/run` skill remains the source of truth for task selection, task docs, validation, history updates, commit/push, deploy handling, and next-step routing.

## Flags

- Default: execute the next incomplete step.
- `--phase`: execute all steps in the current phase, using cross-cutting serial work first and package-scoped waves where eligible.
- `--pipeline`: execute the monorepo run flow and continue into `mono-ship` after successful post-integration guard validation.

## Workflow

1. Run `mono-detect`.
   - If the project is not a detected pnpm workspace monorepo, delegate directly to `/run`.
   - If `turbo.json` is present, record that build/test/lint should defer to `turbo run`.
   - If Turborepo is absent, record that build/test/lint should fall back to `pnpm --filter`.
2. Read the current phase execution profile from `tasks/todo.md` and, when needed for phase context, `tasks/roadmap.md`.
3. Decide execution mode:
   - If the phase mode is `serial`, delegate directly to `/run`.
   - If the phase mode is not monorepo-parallel eligible, delegate directly to `/run`.
   - If the phase mode is `agent-team` or explicitly package-scoped parallel work, continue with lane-spec generation.
4. Generate `.agents/lane-specs.json`.
   - Include `phase`, `source_roadmap_hash`, `lifecycle`, `cross_cutting_steps`, and `lanes`.
   - Each lane must include `id`, `step`, `packages`, `owns`, `must_not_edit`, `depends_on`, and `mode`.
   - Put root-only, shared-package, lockfile, and root-config work into `cross_cutting_steps` with serial mode.
   - Put package-contained work into lanes with package-owned `owns` paths.
   - Ensure every package lane's `must_not_edit` includes lockfiles, root config files, and other lanes' package paths.
5. Generate `tasks/lane-specs.md` as the committed human-readable mirror of `.agents/lane-specs.json`.
6. Run `mono-guard` pre-flight.
   - Use `packs/monorepo/scripts/lane-spec-validate.sh` through `mono-guard`.
   - Stop on `FAIL`.
   - Present `WARN` findings for review before dispatch.
7. Enter plan mode with lane specs for approval before launching package-scoped lanes.
8. Dispatch work:
   - Execute cross-cutting steps serially in the main agent first.
   - Create worktree-isolated package lanes for parallel work after cross-cutting work is integrated.
   - Give every lane its `owns`, `must_not_edit`, `depends_on`, package scope, validation commands, and deliverable.
   - Do not dispatch a lane until its `depends_on` steps are satisfied.
9. Apply stop-all-lanes failure semantics:
   - If any lane fails, halt remaining lanes.
   - Preserve worktree state for inspection.
   - Update `.agents/lane-specs.json` lifecycle to `failed`.
   - Update `tasks/lane-specs.md` with the failed lane and reason.
   - Report the blocker and stop before shipping.
10. After all lanes complete:
   - Integrate lane work in dependency order.
   - Run `mono-guard --post-integration`.
   - If post-integration guard fails, stop and report boundary violations.
   - If it passes, set lane-spec lifecycle to `integrated` and update `tasks/lane-specs.md`.
11. If `--pipeline` was used, continue to `mono-ship`; otherwise report next work and recommended command.

## Validation Command Preference

- With `turbo.json`: prefer `turbo run <task> --filter=<package>` for build, test, lint, and package validation.
- Without `turbo.json`: prefer `pnpm --filter <package> run <task>`.
- Use `.agents/monorepo.json.dependency_graph` to order package work when Turborepo is absent.

## Output Format

- **Detection:** monorepo detected or delegated to `/run`.
- **Execution mode:** serial delegation, guarded package lanes, or pipeline.
- **Lane specs:** `.agents/lane-specs.json` and `tasks/lane-specs.md` status.
- **Guard result:** pre-flight and post-integration verdicts.
- **Dispatch result:** cross-cutting steps, package lanes, failures, and preserved worktrees when applicable.
- **Lifecycle:** draft, approved, dispatched, integrated, or failed.
- **Next work:** concrete follow-up.
- **Recommended next command:** one command.

## Constraints

- Do not run package manager install/add commands in package lanes.
- Do not modify lockfiles from parallel lanes.
- Do not dispatch package lanes unless `mono-guard` pre-flight passes and lane specs are approved.
- Do not continue after a lane failure; preserve worktree state and mark lifecycle `failed`.
- Do not bypass standard `/run` task selection, validation, history, commit/push, deploy, or next-step routing responsibilities.
- Do not use GitHub Actions.

## Next-Step Routing

- Non-monorepo or serial phase: `/run`.
- Pre-flight guard failure: `/mono-guard` after fixing or regenerating lane specs.
- Successful guarded run without pipeline: `/mono-ship`.
- Failed lane dispatch: inspect preserved worktree state, then rerun `/mono-run` after the blocker is fixed.
- Completed pipeline: follow the next command reported by `mono-ship`.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include the two-line pair `**Next work:** <specific task, blocker, or follow-up>` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
