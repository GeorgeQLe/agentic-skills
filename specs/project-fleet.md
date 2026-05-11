# Project Fleet Specification

## Summary

`$project-fleet` is a Codex orchestration skill for repositories that coordinate many related downstream repositories, implementation targets, specs, clients, migrations, content items, experiments, or generated artifacts. It turns a control repository into the source of truth for queue state, guarded provisioning, blocker handling, status reporting, productive fallback work, verification, and shipping.

## Scope

This spec covers the generic fleet orchestration contract implemented by `packs/project-fleet/codex/project-fleet/SKILL.md`. Domain-specific workflows may use clearer file names and scripts, but they must preserve the state, guard, blocker, verification, and shipping semantics below.

## Core Model

A fleet has these parts:

- **Control repo:** canonical state, conventions, queue, scripts, logs, and status.
- **Fleet items:** downstream repositories or work units, each with an ID, target, source, state, blocker, and next action.
- **Provisioning lane:** creates or updates external targets under strict guards.
- **Work lane:** advances already-provisioned targets while provisioning is blocked or waiting.
- **Repair lane:** fixes actionable blockers without bypassing guards.
- **Planning lane:** adds enough detail for later execution when queue state is incomplete.
- **Portfolio lane:** manages the candidate-to-active-build funnel with shortlisting, seeding, and active-build caps when the fleet operates as a portfolio of projects.
- **Blocker ledger:** records stop conditions and retry rules.
- **Status dashboard:** summarizes fleet state and next action without requiring a full project reread.

## State Machine

Fleet implementations may use project-specific labels, but the generic semantics are:

```text
candidate
ready-to-provision
provisioning-blocked
provisioned
planning-needed
plan-ready
work-in-progress
verification-needed
done
blocked
```

`provisioned` must not be treated as `done`. A created repo, generated scaffold, or reserved artifact is only available for work until planning, implementation, and verification finish.

## Workflow Contract

1. Read project conventions first, including `AGENTS.md`, `CLAUDE.md`, and local task docs.
2. Locate or create minimal fleet state in `tasks/`, `docs/`, scripts, manifests, queue files, or project-specific status files.
3. Normalize the queue so each item has ID, name, target, source/reference, state, last action, blocker, and next action.
4. Run preflight guards for auth, rate limits, dirty worktrees, target visibility/safety, required scripts, and project-specific stop conditions.
5. Select exactly one lane: provisioning, work, repair, planning, or portfolio.
6. Execute bounded batches using the project batch size, serial/parallel limits, and external-service rules. Default batch size is one item when no policy exists.
7. Verify before changing item state.
8. Update central state with completed work, blocker evidence, retry timing, next targets, and skipped items.
9. Ship tracked repository changes through the repository shipping convention.
10. Report the next concrete fleet action and recommended command.

## Control Repo Files

The skill prefers existing project files. If a project lacks a structure, the fallback file set is:

```text
tasks/fleet-status.md
tasks/fleet-queue.md
tasks/fleet-blockers.md
tasks/history.md
scripts/fleet-status.*
scripts/fleet-next.*
scripts/fleet-provision.*
```

Domain-specific names such as `tasks/repo-seeding.md`, `tasks/migration-queue.md`, or `tasks/customer-rollout.md` are valid when they more clearly describe the fleet.

## Guarded Provisioning

Provisioning is any operation that creates, publishes, mutates, or schedules many external targets, including remote repository creation, pushes, deployments, package publishing, account/API provisioning, bulk imports, or paid-service operations.

Before provisioning, the workflow must confirm explicit approval for the operation class, target visibility/privacy defaults, service limits, local rolling caps, required scripts, and project-specific stop conditions. Provisioning must stop on auth failures, rate limits, permission errors, target conflicts, visibility mismatches, partial propagation, template validation failures, unexpected paid actions, or irreversible actions.

On rate limits, the workflow must obey `retry-after` or reset headers when available. If no retry timing is available, it records a conservative next eligible time and switches to safe fallback work when possible.

## Productive Fallback Work

When provisioning is blocked or waiting, the workflow may advance existing fleet items by generating or refining per-item roadmaps, expanding plans from source specs, running local validation or hygiene checks, fixing non-provisioning blockers, preparing templates or scripts, creating status reports, or verifying already-created targets.

Fallback work must not bypass provisioning guards. If the blocked operation is required for an item, the workflow must choose a different eligible item or record a blocker.

## Blocker Ledger

Each blocker entry should include:

```text
timestamp
item ID / target
lane
blocker type
evidence
attempted fix
retry rule or owner
next eligible action
```

Common blocker types include `auth-permission`, `rate-limit`, `target-conflict`, `propagation-delay`, `visibility-safety`, `template-validation`, `dirty-worktree`, `missing-source`, `verification-failure`, `legal-or-policy-risk`, and `manual-human-action`.

## Output Contract

The final report should include current fleet count by state, lane selected and why, items advanced, guards checked, blockers created or cleared, validation evidence, files changed and shipped status, next work, and the recommended next command.

## Integration Points

- `packs/project-fleet/codex/project-fleet/SKILL.md` is the implementation surface for `$project-fleet`.
- `packs/project-fleet/codex/clone-spec-store/SKILL.md` routes ongoing multi-repo queue operation through `$project-fleet` after the clone/spec-store pipeline reaches downstream seeding.
- `README.md`, `docs/packs.md`, and `docs/skills-reference.md` list `project-fleet` as a project-local pack.

## Acceptance Criteria

- A fleet queue has explicit item state, target, source/reference, blocker, and next action fields.
- The workflow runs preflight guards before external provisioning.
- Exactly one execution lane is selected per run (provisioning, work, repair, planning, or portfolio).
- Provisioning stops on guard failures and records blocker evidence.
- Productive fallback work advances only eligible items and does not bypass guards.
- Items are not marked advanced until verification evidence exists.
- Central state and history are updated after work.
- Tracked mutations are committed and pushed unless a stricter project rule blocks shipping.
