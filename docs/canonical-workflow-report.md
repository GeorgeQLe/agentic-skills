# Canonical Agentic Workflow Report

> Date: 2026-04-19
> Scope: current `agentic-skills` workflow as implemented through Phase 11 Step 6, with Phase 11 Step 7 still active planning work.
> Evidence: `tasks/todo.md`, `tasks/history.md`, `docs/operating-modes.md`, `docs/codex-workflow.md`, `README.md`, `CLAUDE.md`, `global/{claude,codex}/*/SKILL.md`, and recent git history.

## Executive Summary

The canonical workflow is now a file-backed, mode-routed planning and execution system shared by Claude Code and Codex. The source of truth is no longer chat history or a single monolithic todo. It is the task pipeline:

- `specs/*.md` captures decision-complete feature intent.
- `tasks/roadmap.md` captures strategic phased sequencing.
- `tasks/todo.md` captures the active phase and the next executable step.
- `tasks/manual-todo.md` captures human-only blockers.
- `tasks/record-todo.md` and `tasks/recurring-todo.md` capture advisory non-blocking work.
- `tasks/history.md` captures completed work as append-only evidence.
- `tasks/phases/phase-N.md` archives completed phase execution contracts.
- `tasks/approved-plan.md` mirrors safe cross-CLI approval state.

The canonical entry path depends on what exists in the directory:

| Starting point | Canonical first move | Next move |
| --- | --- | --- |
| Fresh directory + rough idea | `/pack` or `$pack`, then `/spec-interview` or `$spec-interview` | `/roadmap` or `$roadmap` |
| Existing spec | `/roadmap` or `$roadmap` | auto-seed Phase 1 with `/plan-phase 1` or `$plan-phase 1` |
| Existing codebase | `/pack` or `$pack`, then `/roadmap` or `$roadmap` | resolve queued pipeline issues or create specs |
| Existing active session | read `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, git status | `/run`, `$run`, `/delegate $run`, or `/ship` depending on mode and state |

The operating model is plural by default:

- `claude-only`: Claude plans, executes, ships, and wraps.
- `codex-only`: Codex plans, executes, ships, and wraps.
- `hybrid`: Claude orchestrates; Codex executes via `/delegate` and the shared approval packet.

The mode signal exists today: `.agents/project.json.agent_mode`, overridden by `SKILLS_AGENT_MODE`, resolved by `scripts/agent-mode.sh`. Mode-aware terminal recommendations are not fully wired yet; that is the active Phase 11 Step 7.

## What Is Canonical Now

### 1. Start by designating the project

From a project directory, use the pack flow before deep planning:

```bash
/pack
```

or:

```bash
$pack
```

The pack flow reads or creates `.agents/project.json`, infers or confirms project type, and installs project-local skills under `.claude/skills` and `.codex/skills`. Global skills remain domain-neutral; business-app, game, devtool, code-quality, and kanban workflows are project-local opt-ins.

For scripted setup:

```bash
scripts/pack.sh recommend
scripts/pack.sh install business-app
scripts/pack.sh install game
scripts/pack.sh install devtool
scripts/pack.sh install code-quality
scripts/pack.sh install business-app-kanban
scripts/pack.sh set-mode hybrid
```

Use `scripts/pack.sh set-mode <claude-only|codex-only|hybrid|unset>` when you know the desired operating mode. If the mode is unset, skills should present all viable paths.

### 2. Keep project state in files

The workflow assumes a fresh session can resume from files. The minimum context set is:

```text
CLAUDE.md or AGENTS.md
README.md
.agents/project.json
tasks/roadmap.md
tasks/todo.md
tasks/history.md
tasks/manual-todo.md
tasks/record-todo.md
tasks/recurring-todo.md
tasks/handoff.md
specs/*.md
```

Not every project has every file. Missing files route the workflow:

- No specs: run `spec-interview`.
- Specs but no roadmap: run `roadmap`.
- Roadmap but no executable current phase: run `plan-phase`.
- Current phase with unchecked steps: run `run`.
- Finished work or dirty tree: run `ship`.
- Interrupted session: run `handoff` or read `tasks/handoff.md`.

### 3. Separate strategy from execution detail

`tasks/roadmap.md` is the strategic plan. It owns:

- phase goals
- scope
- acceptance criteria
- manual task declarations
- strategic parallelization mode
- coordination notes
- deferred work

`tasks/todo.md` is the active execution contract. It owns:

- one active phase
- test strategy
- execution profile
- ordered implementation steps
- active step plan
- milestone criteria
- immediate blockers and notes

Implementation detail is generated just-in-time by `plan-phase`, not upfront for every roadmap phase. This is now a core invariant.

### 4. Use `roadmap` as the pipeline manager

`/roadmap` and `$roadmap` are not generic brainstorming commands. They scan pipeline state and choose the right next queue item.

The state machine is:

| State | Condition | Canonical behavior |
| --- | --- | --- |
| No specs | no `specs/` and no `spec.md` | queue `spec-interview` |
| Specs, no roadmap | specs exist, no usable `tasks/roadmap.md` | interview and write roadmap |
| Work in progress | roadmap exists with unchecked phases | classify pipeline issues |
| All complete | all phases checked | queue `research-roadmap` |

When `roadmap` creates a new roadmap, it immediately invokes `plan-phase 1` so the project lands on actionable work instead of an undecomposed plan.

### 5. Use `plan-phase` to create an executable contract

`/plan-phase` and `$plan-phase` decompose exactly one roadmap phase. They write:

- `> Test strategy: tdd|tests-after|none`
- `### Execution Profile`
- `### Tests First`, `### Implementation`, and `### Green` as appropriate
- file-level task detail
- manual, record, and recurring task outputs when applicable

Execution profiles are canonical:

| Profile | Meaning |
| --- | --- |
| `serial` | main agent does all work |
| `research-only` | read-only subagents can gather context; main agent implements |
| `review-only` | main agent implements; subagents review |
| `implementation-safe` | write subagents may edit disjoint owned paths only |
| `agent-team` | use isolated worktrees or a dedicated agent team; do not run in one shared local tree |

The main agent always owns task docs, history, commits, deploy handoff, and integration.

## Canonical Workflows By Starting Point

### Fresh Directory With Only An Idea

Use this when there is no codebase contract and no spec.

Claude:

```bash
/pack
/spec-interview
/roadmap
/run
/ship
/ship-end
```

Codex:

```bash
$pack
$spec-interview
$roadmap
$run
$ship-end
```

Hybrid:

```bash
/pack
scripts/pack.sh set-mode hybrid
/spec-interview
/roadmap
/delegate $run
/ship-end
```

Canonical behavior:

1. `pack` designates the project type and installs local pack skills.
2. `spec-interview` turns the rough idea into a decision-complete spec under `specs/`.
3. `roadmap` sequences specs into phases and seeds Phase 1 with `plan-phase`.
4. Execution proceeds through the mode-specific loop.

Do not skip `spec-interview` for non-trivial ideas. The current workflow assumes specs are the boundary between ideation and implementation planning.

### Fresh Directory With An Existing Spec

Use this when `specs/*.md`, `spec.md`, or a user-provided spec already exists.

Claude:

```bash
/pack
/roadmap path/to/spec.md
/run
/ship
```

Codex:

```bash
$pack
$roadmap path/to/spec.md
$run
```

Hybrid:

```bash
/pack
scripts/pack.sh set-mode hybrid
/roadmap path/to/spec.md
/delegate $run
```

Canonical behavior:

1. Confirm project type and packs.
2. Run `roadmap`; it interviews on sequencing, MVP, manual tasks, parallelization, and review gates.
3. `roadmap` writes `tasks/roadmap.md`.
4. `roadmap` invokes `plan-phase 1`.
5. Execute only the next step unless `--phase` is explicitly chosen.

If the spec is stale or contradicted by the codebase, use `spec-drift` before turning it into execution work.

### Existing Codebase With No Current Workflow Files

Use this when the repo exists but has no usable `tasks/` pipeline.

Claude:

```bash
/pack
/roadmap
```

Codex:

```bash
$pack
$roadmap
```

Canonical behavior:

1. `pack` infers project type from repository signals.
2. `roadmap` scans README, existing specs, ideas, tasks, git history, and code shape.
3. If no specs exist, `roadmap` queues `spec-interview`.
4. If specs exist, `roadmap` builds or updates the phase plan.
5. If old-style task docs exist, `run` or `ship` migrates split roadmap/todo shape before proceeding.

If the codebase is mature but undocumented, a common sequence is:

```bash
/hygiene
/research-roadmap
/spec-interview
/roadmap
```

or the Codex equivalents.

### Existing Codebase With Active Workflow Files

Use this when `tasks/roadmap.md` and `tasks/todo.md` already exist.

First read:

```text
tasks/todo.md
tasks/roadmap.md
tasks/history.md
git status
git log --oneline -10
```

Then route:

| State | Canonical next command |
| --- | --- |
| dirty tree with finished work | `/ship` or `$ship` |
| unchecked current step | `/run`, `$run`, or `/delegate $run` |
| current phase complete | `/ship` or `$ship` to archive and advance |
| docs contradict git/code | `/reconcile-dev-docs audit` or `$reconcile-dev-docs audit` |
| spec likely stale | `/spec-drift` or `$spec-drift` |
| no remaining roadmap work | `/research-roadmap` or `$research-roadmap` |

## Mode-Specific Execution Loops

### Claude-Only

Use this when Codex is unavailable.

Canonical loop:

```bash
/spec-interview
/roadmap
/run
/ship
/ship-end
```

Important boundaries:

- `/run` is execution-only in Claude.
- `/run` gets approval through plan mode before writing code.
- `/run` marks the completed step but does not commit or push.
- `/ship` validates, updates history, commits, pushes, optionally deploys, writes the next plan, enters plan mode, and stops before the next implementation.
- `/ship-end` wraps a partial or ending session.

Claude Code remains the strongest mode for plan-mode approval and clear-context handoffs.

### Codex-Only

Use this when Claude is unavailable.

Canonical loop:

```bash
$spec-interview
$roadmap
$run
$ship-end
```

Important boundaries:

- `$run` is the normal execute-and-ship loop in Codex.
- `$run` asks one plain-text approval question unless it is consuming an approved packet.
- `$run` implements, validates, updates task docs/history, commits, pushes, optionally deploys, and prepares the next step.
- `$ship` is compatibility/manual cleanup when work already exists in the tree.
- Codex cannot force Claude-style plan mode or clear-context handoff from a skill, so `tasks/todo.md` carries the contract.

For substantial work in Codex, the practical high-quality pattern remains:

1. planning thread writes files
2. user approval
3. fresh execution thread reads files
4. `$run` executes and ships

### Hybrid

Use this when both Claude and Codex are available.

Canonical loop as implemented today:

```bash
/spec-interview
/roadmap
/delegate $run
```

Async variant:

```bash
/handoff --target=codex
$run --execute-approved
```

Role split:

- Claude orchestrates: interviews, specs, roadmap, phase planning, tradeoffs, approval packet production.
- Codex executes: implementation, validation, task updates, shipping.

The shared approval packet is the contract:

- `.agents/approved-plan.json`: machine-readable source of truth, gitignored, local to the developer.
- `tasks/approved-plan.md`: committed sanitized mirror.
- `specs/approved-plan.schema.json`: schema.
- `scripts/approved-plan.sh`: lifecycle helper.

Packet lifecycle:

```text
draft -> approved -> consumed | stale | superseded | uncertain
```

Only `approved` packets are executable. `$run --execute-approved` checks:

1. lifecycle is `approved`
2. git HEAD matches
3. `tasks/todo.md` hash matches
4. dirty tree is clean or allowed
5. no new blocking manual task appeared
6. TTL has not expired

`/delegate` never blind-retries. If Codex may have started but outcome is unclear, the packet becomes `uncertain` and the user must inspect, discard, or continue inline.

## Fresh Session Resume Rules

From Claude:

```bash
/handoff
```

From Codex:

```bash
$handoff
```

For cross-CLI async execution from Claude to Codex:

```bash
/handoff --target=codex
```

Resume checklist:

1. Read `tasks/handoff.md` if present.
2. Read `tasks/todo.md` for the active step.
3. Read `tasks/roadmap.md` for phase context.
4. Read `tasks/history.md` for what already shipped.
5. Run `git status`.
6. If using hybrid async handoff, run `$run --execute-approved` in Codex.

Do not rely on previous chat context when the files carry the workflow state.

## Human And Advisory Task Handling

`tasks/manual-todo.md` is for human-only work. Items can block automated execution with:

```text
_(blocks: Step N.X)_
```

or follow a completed automated step with:

```text
_(after: Step N.X)_
```

Blocking manual tasks stop `run` before implementation unless the user explicitly overrides them.

`tasks/record-todo.md` is for non-blocking condition-gated records or measurements. `tasks/recurring-todo.md` is for cadence-based operational or research work. They are advisory by default and must be promoted into `tasks/todo.md` before an agent executes them as build work.

## Shipping And Deploy Rules

Shipping is direct-to-primary by default:

- commit to `main` or `master`
- push before stopping
- do not continue feature-branch workflows unless explicitly requested
- do not commit secrets
- do not rewrite history

Deploy is opt-in by contract:

- deploy only if `deploy.md` or `tasks/deploy.md` exists
- never infer deployment from GitHub Actions
- never deploy production without explicit confirmation
- if AWS SSO auth is uncertain, check live identity before running `aws sso login`

Claude:

- `/run` does not commit or push.
- `/ship` owns commit/push/deploy/next-plan.

Codex:

- `$run` executes and ships by default.
- `$ship` packages already-finished work.

## Current Gaps And Active Work

The following are planned but not fully wired as of this report:

1. Phase 11 Step 7: next-step routing across planning/execution skills.
2. Phase 11 Step 8: degraded-path audit table in `docs/operating-modes.md`.
3. Phase 11 Step 9: pack emphasis split by CLI role.
4. Phase 11 Step 10: pack-aware `$run` routing on Codex.
5. Phase 11 Step 11: expand `docs/operating-modes.md` into the authoritative reference.

There is also a known documentation freshness issue: `docs/operating-modes.md` still says no skill consumes the mode signal or packet, but Steps 4-6 have shipped consumers and producers. Treat `tasks/todo.md` and `tasks/history.md` as newer evidence until Step 11 rewrites the operating modes reference.

## Recommended Canonical Decision Tree

Use this as the high-level workflow router:

```text
Do I have a project designation?
  no  -> /pack or $pack
  yes -> continue

Do I have a decision-complete spec?
  no  -> /spec-interview or $spec-interview
  yes -> continue

Do I have tasks/roadmap.md?
  no  -> /roadmap or $roadmap
  yes -> continue

Does the current roadmap phase have implementation steps?
  no  -> /plan-phase or $plan-phase
  yes -> continue

Is there finished dirty work?
  yes -> /ship or $ship
  no  -> continue

Which mode am I in?
  claude-only -> /run, then /ship
  codex-only  -> $run
  hybrid      -> /delegate $run
  unset       -> choose one of the three explicitly

Am I switching sessions or CLIs?
  same CLI -> /handoff or $handoff if context needs compression
  Claude to Codex async -> /handoff --target=codex, then $run --execute-approved
```

## Bottom Line

The canonical workflow is now:

```text
pack -> spec-interview -> roadmap -> plan-phase -> run/delegate -> ship -> ship-end
```

with three valid execution modes:

```text
claude-only: Claude does all of it
codex-only: Codex does all of it
hybrid: Claude plans, Codex executes through an approved packet
```

The durable contract is the file system. Specs define intent, roadmap defines strategy, todo defines executable work, history records evidence, and the approval packet safely bridges Claude and Codex.
