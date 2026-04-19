---
name: roadmap
description: Scan task pipeline health, build or update the project roadmap, and maintain a priority task queue
type: planning
version: 2.0.0
argument-hint: "[--existing] [path-to-spec]"
---

# Roadmap - Task Pipeline Manager

Invoke as `$roadmap`.

Use this skill to keep the task execution pipeline healthy and moving. It scans roadmap, todo, manual tasks, record tasks, recurring tasks, history, ideas, specs, and git state, then either builds a roadmap (when none exists) or updates `tasks/todo.md` with a priority task queue.

Do not run the queued skills from this workflow. The job here is to maintain the task queue so the user can resolve all pipeline issues in the right order.

## Process

### 1. Resolve Project Context

1. Read `.agents/project.json` if it exists.
2. Use `project_type` and `enabled_packs` to decide which project-pack skills apply.
3. If `.agents/project.json` is missing, infer the project type from repository signals:
   - game: game engine files, Steam/store assets, playable prototypes, or game-specific README/spec language
   - devtool: SDK, CLI, API, library, infra, docs, examples, or package-first developer workflow
   - business-app: SaaS, marketplace, productivity, workflow, enterprise, or user-facing app
4. If the project type cannot be inferred, default to `business-app`.
5. Read `CLAUDE.md` for project conventions, or `AGENTS.md` for Codex conventions.
6. Read `README.md` or equivalent for project overview.

### 2. Scan Pipeline State

Record existence, content summary, and last-modified timestamps for:

- `tasks/roadmap.md` — full phased plan
- `tasks/todo.md` — current phase working document
- `tasks/manual-todo.md` — pending manual tasks
- `tasks/record-todo.md` — non-blocking condition-gated records and measurements
- `tasks/recurring-todo.md` — cadence-based operational, research, or maintenance tasks
- `tasks/history.md` — completed work log
- `tasks/ideas.md` — unspecced ideas
- `tasks/phases/` — archived phase files
- `tasks/lessons.md` — accumulated lessons
- `specs/` or `spec.md` — specifications

Also gather:

- Git log (last 20 commits) for recent activity
- Working tree status (uncommitted changes, unpushed commits)

### 3. Determine Project State

Route behavior based on the current pipeline state:

| State | Condition | Behavior |
|-------|-----------|----------|
| A — No specs | No `specs/` files, no `spec.md` | Queue `$plan-interview`. Done (skip to step 7). |
| B — Specs, no roadmap | Specs exist, `tasks/roadmap.md` missing or empty | Go to step 4 (build roadmap), then continue to step 5. |
| C — Work in progress | `tasks/roadmap.md` exists, unchecked phases remain | Skip to step 5 (classify issues). |
| D — All complete | All phases in `tasks/roadmap.md` are checked | Queue `$research-roadmap` for documentation scan. Done (skip to step 7). |

### 4. Build Roadmap (State B Only)

When specs exist but no roadmap does, interview the user to build one.

#### 4a. Synthesize and Present

Present the user with a structured summary:

- List each spec section / feature area identified
- Note dependencies between them
- Highlight any conflicts or overlaps between specs
- Flag specs that seem incomplete or ambiguous

#### 4b. Interview on Strategy

Ask focused questions to align on roadmap decisions (1–3 questions per turn). If the session is already in Plan mode and there are 2–3 concrete choices, prefer `request_user_input`; otherwise ask concise plain-text questions. Cover:

- **Priority**: Which features/specs are most important? What's MVP vs. later?
- **Grouping**: Should any specs be combined into a single phase? Split apart?
- **Sequencing**: What depends on what? What should ship first for user value or risk reduction?
- **Scope**: Should anything be deferred, dropped, or marked as stretch?
- **Market fit** (when ICP/gap specs exist): Which phases directly address customer pain points or deal-blockers from gap analysis? Prioritise these unless technically impossible.
- **Phase sizing**: Preference for many small phases vs. fewer larger ones?
- **Manual tasks**: Any steps requiring human action (DNS, OAuth, browser testing, deploy approvals)? Which phases?
- **Parallelization**: Which phase work can run independently, which modules or files are shared chokepoints, and where should work stay serial?
- **Review needs**: Which phases need specialized review gates (correctness, tests, security, performance, docs/API conformance, UX)?
- **Agent-team fit**: Which phases are too broad or cross-cutting for local in-session subagents and should instead use Codex app worktrees or Claude agent teams?

When options exist, present pros/cons with a recommendation. Do not manufacture artificial choices.

Continue until the user confirms the phase structure is complete.

#### 4c. Write the Roadmap

Write `tasks/roadmap.md` with the agreed phase structure (phases, goals, scope, acceptance criteria, parallelization strategy — NOT implementation steps). Implementation detail is generated just-in-time by `$plan-phase` when a phase is started, not upfront.

For each phase, include these strategic fields:

```markdown
**Parallelization:** serial | research-only | review-only | implementation-safe | agent-team
**Coordination Notes:** [dependencies, shared chokepoints, and why this mode was chosen]
```

Use `serial` when work is tightly coupled or file ownership cannot be separated. Use `research-only` when parallel exploration helps but implementation should remain integrated. Use `review-only` when the build should be serial but post-implementation review benefits from multiple lenses. Use `implementation-safe` only when likely write ownership can be cleanly separated. Use `agent-team` for broad cross-cutting phases that should run in isolated worktrees or a dedicated multi-agent team rather than one shared local tree.

#### 4d. Seed Phase 1

After writing `tasks/roadmap.md`, immediately invoke `$plan-phase 1` to generate the implementation detail for the first phase. This produces `tasks/todo.md` and, when applicable, `tasks/manual-todo.md`, `tasks/record-todo.md`, or `tasks/recurring-todo.md`, so the user lands on an actionable starting point rather than an undecomposed roadmap.

Do not decompose later phases — those are generated just-in-time when each phase begins (via `$ship` or `$run`).

After `$plan-phase 1` completes, continue to step 5 to scan the freshly-created roadmap for any pipeline issues.

### 5. Classify Issues (States B-after and C)

Check for each issue type in order. Include timestamps or evidence for every finding.

#### 1. Dirty Working Tree
Uncommitted changes or unpushed commits exist. These must be resolved before task pipeline work.

#### 2. Phase Completion Not Advanced
`tasks/todo.md` has all steps checked and milestone criteria met, but the phase has not been archived or the next phase loaded. Evidence: all `- [x]` in todo, no `- [ ]` remaining under implementation steps.

#### 3. Blocking Manual Tasks
`tasks/manual-todo.md` contains unchecked items with `_(blocks: Step N.X)_` annotations for steps that are next in the execution queue. These block automated progress.

#### 4. Stale Todo
`tasks/roadmap.md` was modified more recently than `tasks/todo.md`, suggesting the roadmap was updated but the current working document was not refreshed. Evidence: roadmap mtime vs todo mtime.

#### 5. Missing Implementation Steps
A roadmap phase has acceptance criteria but no implementation steps (no `### Tests First`, `### Implementation`, or `### Green` section). This phase needs `$plan-phase` before `$run` can execute it.

#### 6. Orphaned Manual Tasks
`tasks/manual-todo.md` references a phase that has already been completed or archived, but unchecked items remain. These need resolution or explicit deferral.

#### 7. Eligible Record Tasks
`tasks/record-todo.md` contains unchecked items whose condition appears to be true. These are advisory by default. Queue promotion to `tasks/todo.md` only when the item is now concrete execution work; otherwise leave it in `tasks/record-todo.md` with updated evidence or revisit timing.

#### 8. Due Recurring Tasks
`tasks/recurring-todo.md` contains unchecked or active items whose `Next due` is today or earlier. These are advisory by default. Queue promotion to `tasks/todo.md` only when the due item requires real execution work; otherwise leave it in `tasks/recurring-todo.md` with updated run/evidence state.

#### 9. History Gap
Work has been completed (checked-off steps in todo, archived phases) but `tasks/history.md` is missing, empty, or its last entry predates the most recent phase archive. Evidence: phase archive timestamps vs history mtime.

#### 10. Spec-Task Drift
Specs have been modified more recently than the roadmap, suggesting the plan may not reflect the current specifications. Evidence: spec mtime vs roadmap mtime. Only flag when the spec modification is substantive (not just formatting).

#### 11. Missing Roadmap (defensive)
Specs exist in `specs/` (or `spec.md`) but `tasks/roadmap.md` does not exist. This should not occur after step 4 but is included as a safety net.

#### 12. Lessons Not Reviewed
`tasks/lessons.md` was updated more recently than the current phase's implementation steps were written, suggesting new lessons may apply to in-progress work.

#### 13. Unspecced Ideas
`tasks/ideas.md` contains ideas that have no corresponding spec in `specs/`. These are candidates for `$plan-interview --ideas` or individual `$plan-interview` runs.

### 6. Order the Priority Queue

Order action items so the user can resolve pipeline issues without guessing:

1. Dirty working tree (uncommitted/unpushed work).
2. Phase completion not advanced (work is done but pipeline is stuck).
3. Blocking manual tasks (human action needed before automation can continue).
4. Stale todo (working document out of sync with roadmap).
5. Missing implementation steps (phase needs decomposition before execution).
6. Orphaned manual tasks (leftover from completed phases).
7. Eligible record tasks (advisory unless promoted to execution work).
8. Due recurring tasks (advisory unless promoted to execution work).
9. History gap (completed work not recorded).
10. Spec-task drift (plan may be outdated).
11. Missing roadmap (specs exist but no plan).
12. Lessons not reviewed (new lessons may apply).
13. Unspecced ideas (ideas waiting for interview).

Within each category, prefer items that unblock the most downstream work.

### 7. Update `tasks/todo.md`

Write a single top-level section named exactly:

```md
## Priority Task Queue
```

Rules:

1. If `tasks/todo.md` does not exist, create it with only this section.
2. If a previous `## Priority Task Queue` section exists, replace only that section.
3. Put the section before existing implementation work. If the file starts with a title or status block, keep that orientation text at the top and insert the priority section immediately after it.
4. Preserve all other todo content exactly unless it is inside the old priority section.
5. Do not mark existing implementation steps complete.
6. Do not remove unrelated todo sections.
7. Use unchecked boxes for unresolved issues.
8. Use checked boxes only when an issue is already resolved.

Action item format:

```md
- [ ] `$skill [args]` - [action description] because [reason with evidence].
```

For manual tasks that block progress:

```md
- [ ] Complete manual task: "[task description]" _(blocks: Step N.X)_ — resolve before `$run` can continue.
```

For advisory record or recurring tasks:

```md
- [ ] Review `tasks/record-todo.md`: "[task description]" — condition appears eligible; promote to `tasks/todo.md` only if this is now concrete execution work.
- [ ] Review `tasks/recurring-todo.md`: "[task description]" — next due is today or earlier; promote to `tasks/todo.md` only if this requires execution work.
```

For dirty tree:

```md
- [ ] `$ship-end --no-deploy` - commit and push uncommitted changes before continuing task work.
```

If all pipeline checks pass:

```md
- [x] Task pipeline is healthy; no issues found. Ready for `$run`.
```

### 8. Output to User

After editing, summarize:

```
## Roadmap Updated

- Wrote/updated `tasks/todo.md`
- Priority task items: N
- Blocking issues: N (must resolve before `$run`)
- Advisory issues: N (should resolve soon)

Next: start at the first unchecked item in `tasks/todo.md`.
```

For State A (no specs):

```
## No Specs Found

- No specifications found in `specs/` or `spec.md`
- Queued `$plan-interview` to create project specifications

Next: `$plan-interview` to define what to build.
```

For State D (all complete):

```
## All Phases Complete

- All roadmap phases are checked off
- Queued `$research-roadmap` for documentation scan

Next: `$research-roadmap` to check documentation health.
```

If the pipeline is fully healthy:

```
## Roadmap Updated

- Task pipeline is healthy
- No blocking or advisory issues found

Next: `$run` to continue execution.
```

## Mode-aware next-step recommendation

Before handing back to the user, resolve the effective agent mode via `./scripts/agent-mode.sh` and emit exactly one recommendation line matching the resolved agent mode via scripts/agent-mode.sh:

- `hybrid` → **Next:** return to Claude for the next orchestration step (run `/plan-phase <N>` or the first unchecked priority-queue item there) — Claude orchestrates in hybrid; do not delegate further from Codex.
- `codex-only` → **Next:** run `$plan-phase <N>` or the first unchecked priority-queue item — stay in Codex.
- `claude-only` → **Next:** switch to Claude and run `/plan-phase <N>` or the first unchecked priority-queue item — Codex is not the planner in this mode.
- unset → present all three options and point the user at `docs/operating-modes.md` for mode-signal resolution rules.

Keep it to one line beyond the normal report; do not restate mode-signal precedence in skill copy.

## Constraints

- **Always interview for new roadmaps.** Do not produce a roadmap without user input on priorities and sequencing when building one from scratch (State B).
- **Respect existing specs.** Do not modify files in `specs/` (or `spec.md`).
- **Phase headers must use `## Phase N: [Title]` format** for `$run` compatibility.
- **Do not include TDD steps or file-level implementation detail** — that's `$plan-phase`' job.
- **`tasks/roadmap.md` is the source of truth.** Do not put roadmap content in CLAUDE.md or AGENTS.md.
- This skill updates `tasks/todo.md` and `tasks/roadmap.md`; it must not run queued priority items. It may invoke `$plan-phase 1` only as the explicit Phase 1 seed described above.
- Preserve user-authored todo content outside `## Priority Task Queue`.
- Every issue must include evidence (timestamps, checked-item counts, file existence).
- Do not directly modify `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, or any specs (except to create `tasks/roadmap.md` in State B). `$plan-phase 1` may create or update task files during the explicit Phase 1 seed.
- Do not treat `tasks/record-todo.md` or `tasks/recurring-todo.md` as execution queues. They are advisory surfaces unless an item is explicitly promoted into `tasks/todo.md`.
- Do not create or modify source code.
- Do not archive phases, advance the pipeline, or execute implementation steps.
- Prefer actionable skill invocations (`$ship`, `$run`, `$plan-phase N`, `$research-roadmap`) over vague guidance.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
