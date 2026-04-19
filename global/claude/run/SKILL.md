---
name: run
description: Plan the next incomplete step (or full phase with --phase flag) from the plan, then enter plan mode for user approval before executing
type: execution
version: 1.0.0
argument-hint: "[--phase]"
---

# Run

Identify the next incomplete unit of work from the phased plan, build an execution plan, and enter plan mode for user approval before implementing. By default, plans **only the next single incomplete step**. If `$ARGUMENTS` contains `--phase`, plans the **entire next phase**.

## Protocol

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` -> `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Stop after the migration and tell the user to run `/ship` to package and push the task-doc split. Do **not** commit or push from `/run`.
2. **Read `tasks/todo.md`** — this contains the current phase's steps. Reference `tasks/roadmap.md` only if cross-phase context is needed.
3. **Read CLAUDE.md** for project conventions.
3b. If `tasks/record-todo.md` or `tasks/recurring-todo.md` exists, count unchecked advisory items for status only. Do not select them as next work.
4. **Find the next incomplete item:**
   - Look for the next phase with an unchecked milestone.
   - If `--phase` mode: scope the entire phase.
   - Otherwise (default): find only the next unchecked `- [ ]` step within that phase.
   - **If the phase has acceptance criteria but no implementation steps** (no `### Tests First` or `### Implementation` section): this phase needs just-in-time planning. **You MUST invoke `/plan-phase` for this phase** to generate implementation steps and file-level detail before proceeding. Do NOT tell the user the phase is "deferred" or that they need to run `/plan-phase` manually — this auto-invocation is the designed workflow. A phase without implementation steps is NOT deferred; it simply hasn't been decomposed yet. Only items under the `## Deferred / Future Work` heading in the roadmap are actually deferred.
5. **Check `tasks/manual-todo.md`** (if it exists) for blocking manual tasks:
   - Look for unchecked items with `_(blocks: Step N.X)_` annotations matching the step about to be executed.
   - If a blocking manual task is found, stop and ask the user how to proceed: "**Manual task blocking this step:** [task]. Complete it before proceeding, or run `/guide` for step-by-step instructions." Do NOT execute the step unless the manual task is completed or the user explicitly overrides the blocker.
6. **Research what's needed** — read only the files relevant to the step/phase to understand existing code, patterns, and dependencies.
6b. **Read the execution profile** — read the current phase's `### Execution Profile` from `tasks/todo.md` if present:
   - If missing, treat the phase as `serial`.
   - Use the profile only for the current step or scoped phase; do not plan ahead.
   - If the profile's `Parallel mode` is `agent-team`, stop before implementation and recommend worktree isolation or Claude agent teams rather than one shared local tree.
7. **Enter plan mode** using the EnterPlanMode tool.
8. **Present the execution plan** to the user:
   - What the step/phase requires
   - Which files will be created or modified
   - The approach (e.g., what tests to write, what code to change)
   - Whether the execution profile will run serially, use read-only research lanes, use review lanes, or use disjoint write lanes
   - Any decisions or trade-offs the user should weigh in on
9. **Wait for user approval.** Do NOT write any code until the user approves.
10. **After approval, execute the approved plan.** If Claude Code already returned to normal mode after approval, do not call ExitPlanMode again; continue directly with implementation. Only use the plan-mode exit tool when the session is still visibly in plan mode.

### Execution Profile Handling

After approval, apply the current phase's `### Execution Profile`:

- `serial`: execute normally.
- `research-only`: launch read-only subagent lanes first when the active environment permits subagents, synthesize their findings, then implement in the main agent.
- `review-only`: implement in the main agent, then launch review subagent lanes before final validation.
- `implementation-safe`: launch write subagent lanes only when every write lane has disjoint `Owns` paths and explicit `Must not edit` boundaries; otherwise downgrade to `research-only` or `serial` and report the downgrade.
- `agent-team`: do not execute locally; report that the phase requires isolated worktrees or a dedicated agent team.

The main agent owns integration, conflict resolution, task doc updates, history updates, shipping handoff, and deploy handoff. If a subagent touches files outside its owned paths or returns conflicting changes, stop and reconcile before validation.

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
- Advisory tasks — pending record/recurring counts from `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist
- What's next (just its name — /ship will handle planning)

## What NOT to do

- Do NOT write code before entering plan mode and getting user approval.
- Do NOT call ExitPlanMode from normal mode. If Claude Code reports "You are not in plan mode" after approval, treat approval as complete and continue implementation.
- Do NOT execute more than one step (or more than one phase in `--phase` mode).
- Do NOT read unnecessary files — only what's needed for the current work.
- Do NOT plan ahead or analyze future phases/steps.
- Do NOT refactor unrelated code.
- Do NOT update CLAUDE.md.
- Do NOT commit or push. `/run` is the Claude execution step; `/ship` owns packaging, task-history updates, commits, pushes, deploys, and next-step planning.
- Do NOT execute items from `tasks/manual-todo.md` — those require human action.
- Do NOT execute items from `tasks/record-todo.md` or `tasks/recurring-todo.md` unless the item has first been promoted into `tasks/todo.md`.

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
- Follow the `### Execution Profile` annotated on each phase. If subagents are unavailable in the active environment, execute serially and report the downgrade.
- Do not let subagents update `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, shipping commits, or deploy steps. Those remain main-agent responsibilities.
- Do not run parallel write lanes unless their `Owns` paths are disjoint. When in doubt, downgrade to `research-only` or `serial`.
- Do not invoke `/commit-and-push-by-feature`, `git commit`, or `git push`. A dirty tracked tree after successful `/run` is expected and is the handoff to `/ship`.
- Each execution must be self-contained — read the plan fresh, don't rely on prior context.

## Execution Handoff Contract

- `/run` deliberately leaves completed tracked changes uncommitted so `/ship` can validate, update `tasks/history.md`, commit, push, deploy, plan the next step, and enter plan mode in one coherent shipping pass.
- If the user explicitly asks `/run` to commit or push, stop and redirect them to `/ship` or `/commit-and-push-by-feature`; do not reinterpret `/run` as a shipping command.
- Report the exact next command as `/ship` unless a blocker prevents shipping.
