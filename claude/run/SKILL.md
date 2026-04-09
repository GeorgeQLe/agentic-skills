---
name: run
description: Plan the next incomplete step (or full phase with --phase flag) from the plan, then enter plan mode for user approval before executing
type: execution
version: 1.0.0
argument-hint: "[--phase] [--kanban]"
allowed-tools: Bash(poketo *)
---

# Plan Executor

Identify the next incomplete unit of work from the phased plan, build an execution plan, and enter plan mode for user approval before implementing. By default, plans **only the next single incomplete step**. If `$ARGUMENTS` contains `--phase`, plans the **entire next phase**.

## Protocol

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
2. **Read `tasks/todo.md`** — this contains the current phase's steps. Reference `tasks/roadmap.md` only if cross-phase context is needed.
3. **Read CLAUDE.md** for project conventions.
4. **Find the next incomplete item:**
   - Look for the next phase with an unchecked milestone.
   - If `--phase` mode: scope the entire phase.
   - Otherwise (default): find only the next unchecked `- [ ]` step within that phase.
   - **If the phase has acceptance criteria but no implementation steps** (no `### Tests First` or `### Implementation` section): this phase needs just-in-time planning. **You MUST invoke `/plan-phases` for this phase** to generate implementation steps and file-level detail before proceeding. Do NOT tell the user the phase is "deferred" or that they need to run `/plan-phases` manually — this auto-invocation is the designed workflow. A phase without implementation steps is NOT deferred; it simply hasn't been decomposed yet. Only items under the `## Deferred / Future Work` heading in the roadmap are actually deferred.
5. **Check `tasks/manual-todo.md`** (if it exists) for blocking manual tasks:
   - Look for unchecked items with `_(blocks: Step N.X)_` annotations matching the step about to be executed.
   - If a blocking manual task is found, warn the user: "**Manual task blocking this step:** [task]. Complete it before proceeding." Do NOT skip the step — let the user decide.
6. **Research what's needed** — read only the files relevant to the step/phase to understand existing code, patterns, and dependencies.
7. **Enter plan mode** using the EnterPlanMode tool.
8. **Present the execution plan** to the user:
   - What the step/phase requires
   - Which files will be created or modified
   - The approach (e.g., what tests to write, what code to change)
   - Any decisions or trade-offs the user should weigh in on
9. **Wait for user approval.** Do NOT write any code until the user approves.
10. **After approval, exit plan mode** and execute the approved plan.

### Single Step Mode (default)

- If it's a "Tests First" step: write the failing tests, run them to confirm they fail (red). Stop.
- If it's an implementation step: implement it, run existing tests to check for regressions. Stop.
- If it's a "Green" step: run all tests. For `tests-after` phases, also write regression tests covering acceptance criteria. Fix any failures. Stop.
- **Mark the step as done** in `tasks/todo.md` (check it off).

### Full Phase Mode (`--phase`)

- Execute the entire phase, step by step:
  - Start with the "Tests First" steps — write the failing tests.
  - Run the tests to confirm they fail (red).
  - Implement each step in order.
  - Run tests after implementation to confirm they pass (green).
  - Refactor if needed while keeping tests green.
- **Verify the milestone**:
  - Check each acceptance criterion.
  - Run the full test suite to confirm no regressions.
  - Check off completed criteria in `tasks/todo.md`.

## After Execution (both modes)

**Report concisely:**
- Phase/step completed
- Files modified
- Test results (if tests were run) — **explicitly state whether any failures are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
- Manual tasks — if `tasks/manual-todo.md` exists, report count of pending manual tasks for this phase
- What's next (just its name — /ship will handle planning)

## What NOT to do

- Do NOT write code before entering plan mode and getting user approval.
- Do NOT execute more than one step (or more than one phase in `--phase` mode).
- Do NOT read unnecessary files — only what's needed for the current work.
- Do NOT plan ahead or analyze future phases/steps.
- Do NOT refactor unrelated code.
- Do NOT update CLAUDE.md.
- Do NOT execute items from `tasks/manual-todo.md` — those require human action.

## Workflow

```
/run                  → plans one step, enters plan mode, executes after approval
/run --phase          → plans the next full phase, enters plan mode, executes after approval
/ship                 → commits, pushes, plans next, enters plan mode
                      → select "clear context and implement"
                      → fresh context reads tasks/todo.md and implements
```

## Constraints
- **One step (or one phase). That's it.** Then stop and let the user decide what's next.
- **Always enter plan mode before executing.** The user must approve the approach first.
- Keep context footprint minimal — don't read the entire codebase, only files relevant to this work.
- If the work can't be completed due to a blocker, document the blocker in `tasks/todo.md` and stop.
- Follow the test strategy annotated on each phase (`tdd`, `tests-after`, or `none`). Do not skip test steps for `tdd` phases.
- Do not push shipping commits to an existing feature branch. Use `/commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely.
- Each execution must be self-contained — read the plan fresh, don't rely on prior context.

## Kanban Mode (`--kanban`)

When `$ARGUMENTS` contains `--kanban`, perform kanban operations during the run workflow.

### Kanban Setup

Read and follow the Kanban Setup protocol in `~/.claude/skills/poketo-kanban/KANBAN-SETUP.md` (all sections including Board Overview).

### Session Card (before Protocol step 1)

1. Get hostname (`hostname -s | tr '[:upper:]' '[:lower:]'`) and branch (`git branch --show-current`).
2. Read `tasks/todo.md` for the current step name.
3. Search board for card matching step name.
4. If in Todo → move to In Progress. If already in In Progress → skip. If not found → create in In Progress.
5. Update card description with: `[hostname] | Branch: <branch> | Started: YYYY-MM-DD HH:MM`

### Conflict Check (advisory only, never block)

Scan all In Progress cards:
- `[other-hostname]` with same branch/step → warn about overlap
- `[this-hostname]` with different step → stale session, offer to move to Done/Punt
- No hostname → report as "untracked"

### Post-Execution Card Update

After marking the step done in `tasks/todo.md`:
1. Count total and checked steps, calculate progress percentage.
2. Update the card description with progress info.
Do NOT move the card to Done — that's `/ship --kanban`'s job.

### Report Addition

Include kanban status (card moved, conflicts detected) in the after-execution report.

Kanban operations are additive — if any kanban command fails, warn and continue. Core run workflow must always succeed. Conflict warnings are advisory only — never block.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
