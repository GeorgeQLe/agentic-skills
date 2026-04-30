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

- `.agents/project.json`: project type and enabled project-local skill packs
- `tasks/roadmap.md`: long-range phased plan
- `tasks/todo.md`: current execution contract
- `tasks/manual-todo.md`: human-only tasks linked to automated steps via `_(blocks: ...)_` and `_(after: ...)_` annotations
- `tasks/record-todo.md`: non-blocking, condition-gated one-time records or baseline measurements
- `tasks/recurring-todo.md`: cadence-based operational, research, or maintenance work
- `tasks/history.md`: append-only execution log
- `tasks/handoff.md`: optional session summary

Do not rely on chat history as the source of truth when these files can carry the state.

`tasks/todo.md` is the only default execution queue. `tasks/manual-todo.md` is only for human action tied to automated work. Non-blocking future measurements, condition-gated records, and recurring operational checks should stay out of the execution queue unless they are explicitly promoted into concrete build work.

## Project Packs

Codex global skills are intentionally domain-neutral. Business-app, game, and devtool workflows are enabled per project with:

```bash
scripts/pack.sh install <pack>
```

The installer writes `.agents/project.json` and local `.codex/skills/*` symlinks. If local skill discovery is unavailable in a Codex session, use `$pack` or `$research-roadmap` as the launcher and read the enabled pack files from `packs/<pack>/codex`. Pack `refresh` recreates symlinks; it does not reload the active Codex process, so start a fresh CLI session after pack changes if the changed skills are not visible.

Running `$pack` with no arguments is the Codex bootstrap path. If `.agents/project.json` exists, it refreshes local links from that committed project designation. If the file is missing, Codex inspects the codebase, recommends a pack, and presents a text-based Pack Decision Checkpoint. The checkpoint is the Codex stand-in for Claude's AskUserQuestion flow: Codex shows numbered choices and waits for an explicit reply before running `scripts/pack.sh install <pack...>`.

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

### `$spec-interview`

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

### `$plan-phase`

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
- execute by default under implicit approval
- execute in-thread
- update `tasks/todo.md` and `tasks/history.md`
- commit/push the result
- optionally deploy when a manual deploy contract exists
- prepare the next step in `tasks/todo.md`

**Manual gap**
- no `EnterPlanMode`
- no automatic clear-context approval gate; `$run` treats invocation as approval for the next planned step
- no automatic clear-context transition

**Recommended Codex usage**
- use `$run` as the default execute-and-ship loop in Codex
- use a fresh thread only when the work is intentionally being split across sessions

### `$ship`

**Claude Code**
- ship current work
- plan next step
- sometimes continue naturally into the next execution loop

**Codex**
- package already-finished work that is already in the tree
- refresh `tasks/todo.md` and `tasks/history.md`
- optionally deploy when a manual deploy contract exists
- summarize the next step

**Manual gap**
- not the normal execution path anymore

**Recommended Codex usage**
- treat `$ship` as a compatibility/manual cleanup wrapper
- use it when execution already happened and the remaining work is packaging or planning

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
- execute by default under implicit approval
- execute in-thread
- commit/push the result
- move the completed card to Done
- prepare the next card in Todo

**Manual gap**
- no skill-controlled plan-mode boundary

**Recommended Codex usage**
- use `$run-kanban` as the default kanban execution loop in Codex when a kanban variant pack is explicitly installed

### `$ship-kanban` and `$ship-end-kanban`

**Claude Code**
- ship work
- move cards
- optionally suggest next work

**Codex**
- use `$ship-kanban` only when finished work or board state needs manual cleanup
- use `$ship-end-kanban` to wrap a session that is not the normal completed-step path

**Manual gap**
- no automatic continuation into the next approved execution phase

## Manual Gaps Summary

These are the main workflow features that Claude Code has and Codex currently does not replicate from skills alone:

- entering Plan mode from a skill
- guaranteed multiple-choice user input in normal sessions
- clear-context-after-approval transition
- tool-managed boundary between planning context and implementation context

The manual replacements are:

- plan visibility plus implicit approval for routine `$run` execution
- executing in-thread after the plan is presented
- treating `tasks/todo.md` as the execution handoff artifact

## Recommended Operating Rules

### 1. `$run` uses implicit approval

Codex should still present the plan before implementation, then proceed by default for `$run`. Ask explicitly only for separate safety decisions such as destructive commands, production deploys, paid/external account actions, credential or secret handling beyond the project contract, execution-profile downgrades, blockers, or material scope changes.

### 2. `tasks/todo.md` must be execution-ready

Each active step should include:

- exact goal
- likely files to touch
- constraints / out-of-scope notes
- tests to run
- acceptance criteria
- blockers or open questions

If a fresh thread cannot execute from the file, the plan is not finished.

Deferred task surfaces are advisory by default:

- `tasks/record-todo.md` holds one-time records that should happen when a condition becomes true, such as baseline measurements after production aggregate access exists.
- `tasks/recurring-todo.md` holds repeated operational, research, or maintenance checks with a cadence and evidence path.
- `$run`, `$ship`, and kanban sync wrappers must not select these files as next executable work unless an item has first been promoted into `tasks/todo.md`.

### 3. Fresh threads are optional, not required

Use a fresh thread when the work is intentionally being split across sessions or the context has become noisy. Otherwise, `$run` can execute and ship in-thread.

### 4. Execution threads should read minimal context

Start with:

- `tasks/todo.md`
- `tasks/history.md` when needed
- only the relevant code files

Avoid re-reading the whole roadmap or spec set unless blocked.

### 5. `run` should usually leave behind clean shipped state

After execution, leave behind clean repo state:

- updated `tasks/todo.md`
- updated `tasks/history.md`
- pushed commits
- optional `tasks/handoff.md`

## Claude Code to Codex Translation

If you are used to this Claude Code rhythm:

1. `$concept-exploration`
2. `$pack install business-app` for business/product concepts
3. `$icp`
4. `$competitive-analysis`
5. `$positioning`
6. `$journey-map`
7. `$spec-interview`
8. `$ux-variation`
9. `$ui-interview`
10. `$roadmap`
11. `$plan-phase` (seeded by `$roadmap`; rerun only for later phases)
12. `$run`
13. `$ship`
14. `$ship-end` when wrapping an off-script or partial session

The closest Codex translation is:

1. `$concept-exploration`
2. `$pack install business-app` for business/product concepts
3. `$icp`
4. `$competitive-analysis`
5. `$positioning`
6. `$journey-map`
7. `$spec-interview`
8. `$ux-variation`
9. `$ui-interview`
10. `$roadmap`
11. `$plan-phase` (seeded by `$roadmap`; rerun only for later phases)
12. `$run` to present the plan, execute the work, ship it, and refresh `tasks/todo.md`
13. repeat `$run` for the next planned step
14. use `$ship` only if finished work needs manual packaging
15. use `$ship-end` to wrap an interrupted or partial session

The main manual additions are still plain-chat approval and the lack of a skill-controlled plan-mode boundary.

## Bottom Line

Claude Code keeps part of the workflow state in the tool.

Codex should keep the workflow state in repo files and prefer in-thread execution for the normal `$run` loop, using fresh threads when sessions are intentionally split or context has become noisy.

Do not aim for fake parity. The Codex workflow should be optimized for:

- explicit handoff artifacts when work crosses sessions
- compact execution context
- plan visibility before implementation, with implicit approval for normal `$run` execution
