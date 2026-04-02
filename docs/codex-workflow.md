# Codex Workflow

This document records the closest practical translation of the repository's Claude Code workflow into a Codex workflow.

It is not a parity claim. The current workflow in `CLAUDE.md` is still the canonical Claude Code workflow. Codex needs a different operating model because skills cannot force the same plan-mode and clear-context transitions.

## Core Constraint

Claude Code workflow benefits from tool-level support for:

- entering plan mode
- asking structured approval questions
- clearing context after approval
- continuing implementation from a fresh context

Codex does not currently expose that same end-to-end flow from skills alone.

In this Codex environment:

- `request_user_input` is only available when the session is already in Plan mode
- Codex skills cannot force Plan mode from a normal session
- there is no skill-level equivalent of Claude Code's "clear context and implement" transition

So the Codex workflow must rely on:

- repo files as the workflow contract
- plain-text approval in normal chat
- manual fresh-thread boundaries for context minimization

## Design Goal

If you care about quality under low context pressure, the Codex workflow should optimize for:

1. compressing context into files
2. stopping after planning
3. starting fresh threads for implementation

The key artifact is `tasks/todo.md`. It replaces much of the workflow glue that Claude Code provides at the tool level.

## File Contract

These files are the shared workflow surface:

- `tasks/roadmap.md`: long-range phased plan
- `tasks/todo.md`: current execution contract
- `tasks/manual-todo.md`: human-only tasks and blockers
- `tasks/history.md`: append-only execution log
- `tasks/handoff.md`: optional session summary

Do not rely on chat history as the source of truth when these files can carry the state.

## Default Codex Cycle

For non-trivial work, the default Codex cycle should be:

1. Planning thread
2. Approval in normal chat
3. Stop
4. Fresh execution thread
5. Verify and compress state
6. Stop or start a new planning thread

That is the manual replacement for Claude Code's plan-mode-first workflow with a clear-context implementation handoff.

## Skill Translation

In this document, Codex skill invocations use the native `$skill` form.

### `$plan-interview`

**Claude Code**
- interview the user
- refine decisions
- write a spec

**Codex**
- same overall purpose
- ask questions in normal chat unless the session already happens to be in Plan mode
- write the spec as usual

**Manual gap**
- no guaranteed structured multiple-choice flow from the skill

### `$roadmap`

**Claude Code**
- interview on sequencing and scope
- write phased roadmap

**Codex**
- same overall purpose
- plain-text questioning by default
- write `tasks/roadmap.md`

**Manual gap**
- no skill-controlled transition into a richer approval mode

### `$plan-phases`

**Claude Code**
- turn roadmap into executable phase detail

**Codex**
- same artifact goal, but more important as a context-compression step
- should write the current phase into `tasks/todo.md` so that a fresh thread can execute from files alone

**Manual gap**
- none in the writing step itself
- the user should usually stop after this and start a fresh implementation thread

### `$run`

**Claude Code**
- identify next step
- enter plan mode
- get approval
- clear context and implement

**Codex**
- identify next step
- summarize the plan
- update `tasks/todo.md`
- ask for approval in plain chat
- either stop or execute in-thread

**Manual gap**
- no `EnterPlanMode`
- no automatic approval gate
- no automatic clear-context transition

**Recommended Codex usage**
- use `$run` as a planning/compression step for non-trivial work
- after approval, stop and start a fresh Codex thread to implement from `tasks/todo.md`

### Fresh implementation after `$run`

**Claude Code**
- handled by the tool after plan approval

**Codex**
- manual step

**Recommended prompt**
- `Execute the next unchecked step from tasks/todo.md. Read only the files you need.`

This manual fresh-thread start is the closest replacement for Claude Code's clear-context implementation handoff.

### `$ship`

**Claude Code**
- ship current work
- plan next step
- sometimes continue naturally into the next execution loop

**Codex**
- ship current work
- refresh `tasks/todo.md`
- refresh `tasks/history.md`
- optionally summarize the next step

**Manual gap**
- no true "ship then continue through plan mode" loop

**Recommended Codex usage**
- treat `$ship` as a state-compression step
- if next-step planning is substantial, stop and begin a new planning thread

### `$ship-end`

**Claude Code**
- wrap session

**Codex**
- almost identical

**Manual gap**
- minimal

This skill ports well because it already depends on repo state more than tool state.

### `$migrate`, `$decommission`, `$scaffold`

**Claude Code**
- audit
- enter plan mode
- approve
- execute in batches

**Codex**
- audit
- write explicit plan into `tasks/todo.md`
- ask for approval in plain chat
- preferably stop if the work is substantial
- execute in a fresh thread

**Manual gap**
- no plan-mode enforcement
- no automatic context reset

**Recommended Codex usage**
- treat these as two-stage operations:
  1. planning/compression
  2. fresh-thread execution

### `$run-kanban`

**Claude Code**
- move card into progress
- warn on conflicts
- enter plan mode
- execute

**Codex**
- move card into progress
- warn on conflicts
- summarize the plan
- ask for approval in plain chat
- stop for a fresh execution thread if non-trivial

**Manual gap**
- no skill-controlled plan-mode boundary

**Recommended Codex usage**
- use kanban to track state, not to imply workflow enforcement that the tool does not provide

### `$ship-kanban` and `$ship-end-kanban`

**Claude Code**
- ship work
- move cards
- optionally suggest next work

**Codex**
- mostly the same for board state changes
- next-step suggestions should be treated as advisory

**Manual gap**
- no automatic continuation into the next approved execution phase

## Manual Gaps Summary

These are the main workflow features that Claude Code has and Codex currently does not replicate from skills alone:

- entering Plan mode from a skill
- guaranteed multiple-choice user input in normal sessions
- clear-context-after-approval transition
- tool-managed boundary between planning context and implementation context

The manual replacements are:

- plain-text approval questions
- stopping after planning
- starting a fresh thread for implementation
- treating `tasks/todo.md` as the execution handoff artifact

## Recommended Operating Rules

### 1. Non-trivial tasks default to planning-only threads

If a task needs meaningful exploration, do not implement in the same thread by default.

### 2. `tasks/todo.md` must be execution-ready

Each active step should include:

- exact goal
- likely files to touch
- constraints / out-of-scope notes
- tests to run
- acceptance criteria
- blockers or open questions

If a fresh thread cannot execute from the file, the plan is not finished.

### 3. Implementation should usually happen in a fresh thread

This is the Codex replacement for Claude Code's clear-context implementation step.

### 4. Execution threads should read minimal context

Start with:

- `tasks/todo.md`
- `tasks/history.md` when needed
- only the relevant code files

Avoid re-reading the whole roadmap or spec set unless blocked.

### 5. Ship steps should compress state for the next thread

After execution, leave behind clean repo state:

- updated `tasks/todo.md`
- updated `tasks/history.md`
- optional `tasks/handoff.md`

## Claude Code to Codex Translation

If you are used to this Claude Code rhythm:

1. `$plan-interview`
2. `$roadmap`
3. `$plan-phases`
4. `$run`
5. `$ship`

The closest Codex translation is:

1. `$plan-interview`
2. `$roadmap`
3. `$plan-phases`
4. `$run` to prepare and compress the next step into `tasks/todo.md`
5. approve in normal chat
6. stop
7. start a fresh Codex thread to execute from `tasks/todo.md`
8. `$ship` to close and compress state

That explicit stop-and-restart is the main manual addition.

## Bottom Line

Claude Code keeps part of the workflow state in the tool.

Codex should keep the workflow state in repo files and use fresh threads aggressively to minimize context growth.

Do not aim for fake parity. The Codex workflow should be optimized for:

- explicit handoff artifacts
- frequent context shedding
- small execution threads
- strong separation between planning and implementation
