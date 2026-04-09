---
name: roadmap
description: Build or update the project roadmap by interviewing across all specs, codebase state, and project history
argument-hint: "[--existing] [--kanban]"
---

# Roadmap Builder

Build or update `tasks/roadmap.md` by synthesizing all project documentation, interviewing the user on priorities and sequencing, and producing a phased roadmap.

## Modes

- **New Project**: `tasks/roadmap.md` does not exist. Read specs and interview to create the roadmap from scratch.
- **Existing Project** (`--existing`, or when `tasks/roadmap.md` has content): Review codebase, history, and current roadmap. Update with new work, completed phases, or changed priorities.

## Workflow

1. **Gather context**: Read `specs/`, `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md` (if it exists), `tasks/history.md`, `tasks/ideas.md`, `research/icp.md`, `specs/mvp-gap.md`, `research/enterprise-icp.md`, `specs/scale-audit.md`, `research/gtm.md` (launch milestones affect sequencing), `research/metrics.md` (instrumentation may need its own phase), CLAUDE.md, README. For existing projects, also review source files and git log.
2. **Synthesise**: Present a structured summary — features identified, dependencies, conflicts, and (for existing projects) what's built vs. remaining.
3. **Interview on strategy** (1–3 questions per turn). If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask concise plain-text questions:
   - Priority — What's MVP vs. later?
   - Grouping — Combine or split specs?
   - Sequencing — Dependencies, risk reduction, user value order
   - Scope — Defer, drop, or stretch?
   - Phase sizing — Many small vs. fewer large?
   - Manual tasks — Any steps requiring human action (DNS, OAuth, browser testing, deploy approvals)? Which phases?
   - Market fit (when ICP/gap specs exist) — Which phases address deal-blockers? Prioritise by market impact.
4. **Write roadmap**: Write `tasks/roadmap.md` with agreed phase structure (phases, goals, scope, acceptance criteria — NOT implementation steps).
5. **Update history** (existing projects): Append entry to `tasks/history.md`.

## Deliverables

- `tasks/roadmap.md` — Phased plan with goals, scope, acceptance criteria, and optional `**Manual Tasks:**` per phase (no implementation steps — those are generated just-in-time by `$plan-phases` when a phase is started)

## Constraints

- Always interview — do not produce a roadmap without user input.
- Do not modify files in `specs/`.
- Phase headers must use `## Phase N: [Title]` format for `$run` compatibility.
- Do not include TDD steps or file-level detail — that's `$plan-phases`' job.
- `tasks/roadmap.md` is the source of truth. Do not put roadmap content in CLAUDE.md.

## Kanban Mode (`--kanban`)

When `$ARGUMENTS` contains `--kanban`, sync phases and steps to the kanban board after writing the roadmap.

### Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `poketo kanban board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask the user. If the session is already in Plan mode and there are 2-3 concrete board choices, prefer `request_user_input`; otherwise ask a concise plain-text question. If no boards exist, offer to create one with `poketo kanban create-board --name "$(basename $(pwd))" --template standard`.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `poketo kanban create-list`.
3. If the poketo CLI is missing or the gateway is unreachable, warn and continue without kanban.
4. **Board Overview:** Fetch board state and display a brief summary.

All kanban commands use: `poketo kanban <command>`

### Kanban Sync

After writing the roadmap:

1. **Current phase steps → Todo**: For each `- [ ]` step in `tasks/todo.md`:
   - Search board for card with that name
   - If in Backlog → move to Todo
   - If in Todo or later → skip
   - If not found → create in Todo with phase context in description

2. **Future phases → Backlog**: For each future phase in the roadmap:
   - Search for card with phase title
   - If not found → create summary card in Backlog with phase goal
   - If found → skip

3. Report: cards created, moved, and skipped.

Kanban operations are additive — if any kanban command fails, warn and continue. Roadmap output must always succeed. Only move cards FROM Backlog → Todo. Never move backward.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
