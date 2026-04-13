---
name: triage
description: Scan task pipeline health and maintain a priority action queue in tasks/todo.md before execution continues
type: planning
version: 1.0.0
---

# Triage - Task Pipeline Health Check

Use this skill to make the task execution pipeline healthy before build work continues. It scans the roadmap, todo, manual tasks, history, ideas, specs, and git state, then updates `tasks/todo.md` by putting a priority action queue at the front of the file.

Do not run the task skills from this triage. The job here is to maintain the action queue so the user can resolve all task-health issues in the right order.

## Process

### 1. Resolve Project Context

1. Read `.agents/project.json` if it exists.
2. Read `CLAUDE.md` for project conventions.
3. Read `README.md` or equivalent for project overview.

### 2. Scan Task State

Record existence, content summary, and last-modified timestamps for:

- `tasks/roadmap.md` — full phased plan
- `tasks/todo.md` — current phase working document
- `tasks/manual-todo.md` — pending manual tasks
- `tasks/history.md` — completed work log
- `tasks/ideas.md` — unspecced ideas
- `tasks/phases/` — archived phase files
- `specs/` or `spec.md` — specifications
- `tasks/lessons.md` — accumulated lessons

Also gather:

- Git log (last 20 commits) for recent activity
- Working tree status (uncommitted changes, unpushed commits)

### 3. Classify Issues

Check for each issue type in order. Include timestamps or evidence for every finding.

#### A. Dirty Working Tree
Uncommitted changes or unpushed commits exist. These must be resolved before task pipeline work.

#### B. Phase Completion Not Advanced
`tasks/todo.md` has all steps checked and milestone criteria met, but the phase has not been archived or the next phase loaded. Evidence: all `- [x]` in todo, no `- [ ]` remaining under implementation steps.

#### C. Stale Todo
`tasks/roadmap.md` was modified more recently than `tasks/todo.md`, suggesting the roadmap was updated but the current working document was not refreshed. Evidence: roadmap mtime vs todo mtime.

#### D. Missing Implementation Steps
A roadmap phase has acceptance criteria but no implementation steps (no `### Tests First`, `### Implementation`, or `### Green` section). This phase needs `$plan-phases` before `$run` can execute it.

#### E. Blocking Manual Tasks
`tasks/manual-todo.md` contains unchecked items with `_(blocks: Step N.X)_` annotations for steps that are next in the execution queue. These block automated progress.

#### F. Orphaned Manual Tasks
`tasks/manual-todo.md` references a phase that has already been completed or archived, but unchecked items remain. These need resolution or explicit deferral.

#### G. Missing Roadmap
Specs exist in `specs/` (or `spec.md`) but `tasks/roadmap.md` does not exist. The project has specifications but no execution plan.

#### H. Unspecced Ideas Ready for Interview
`tasks/ideas.md` contains ideas that have no corresponding spec in `specs/`. These are candidates for `$plan-interview --ideas` or individual `$plan-interview` runs.

#### I. History Gap
Work has been completed (checked-off steps in todo, archived phases) but `tasks/history.md` is missing, empty, or its last entry predates the most recent phase archive. Evidence: phase archive timestamps vs history mtime.

#### J. Spec-Task Drift
Specs have been modified more recently than the roadmap, suggesting the plan may not reflect the current specifications. Evidence: spec mtime vs roadmap mtime. Only flag when the spec modification is substantive (not just formatting).

#### K. Lessons Not Reviewed
`tasks/lessons.md` was updated more recently than the current phase's implementation steps were written, suggesting new lessons may apply to in-progress work.

### 4. Order the Priority Queue

Order action items so the user can resolve task-health issues without guessing:

1. Dirty working tree (uncommitted/unpushed work).
2. Phase completion not advanced (work is done but pipeline is stuck).
3. Blocking manual tasks (human action needed before automation can continue).
4. Stale todo (working document out of sync with roadmap).
5. Missing implementation steps (phase needs decomposition before execution).
6. Orphaned manual tasks (leftover from completed phases).
7. History gap (completed work not recorded).
8. Spec-task drift (plan may be outdated).
9. Missing roadmap (specs exist but no plan).
10. Lessons not reviewed (new lessons may apply).
11. Unspecced ideas (ideas waiting for interview).

Within each category, prefer items that unblock the most downstream work.

### 5. Update `tasks/todo.md`

Write a single top-level section named exactly:

```md
## Priority Task Health
```

Rules:

1. If `tasks/todo.md` does not exist, create it with only this section.
2. If a previous `## Priority Task Health` section exists, replace only that section.
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

For dirty tree:

```md
- [ ] `$ship-end --no-deploy` - commit and push uncommitted changes before continuing task work.
```

If all task health checks pass:

```md
- [x] Task pipeline is healthy; no issues found. Ready for `$run`.
```

### 6. Output to User

After editing, summarize:

```
## Task Triage Complete

- Wrote/updated `tasks/todo.md`
- Priority action items: N
- Blocking issues: N (must resolve before `$run`)
- Advisory issues: N (should resolve soon)

Next: start at the first unchecked item in `tasks/todo.md`.
```

If the pipeline is fully healthy:

```
## Task Triage Complete

- Task pipeline is healthy
- No blocking or advisory issues found

Next: `$run` to continue execution.
```

## Constraints

- This skill updates `tasks/todo.md`; it must not run the queued skills.
- Preserve user-authored todo content outside `## Priority Task Health`.
- Every issue must include evidence (timestamps, checked-item counts, file existence).
- Do not modify `tasks/roadmap.md`, `tasks/manual-todo.md`, `tasks/history.md`, or any specs.
- Do not create or modify source code.
- Do not archive phases, advance the pipeline, or execute implementation steps.
- Prefer actionable skill invocations (`$ship`, `$run`, `$plan-phases N`, `$roadmap`) over vague guidance.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
