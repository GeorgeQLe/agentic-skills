---
name: roadmap
description: Build or update the project roadmap by interviewing across all specs, codebase state, and project history
version: 1.0.0
argument-hint: "[--existing]"
---

# Roadmap Builder

Build or update `tasks/roadmap.md` by synthesizing all project documentation, interviewing the user on priorities and sequencing, and producing a phased roadmap.

## Modes

- **New Project**: `tasks/roadmap.md` does not exist. Read specs and interview to create the roadmap from scratch.
- **Existing Project** (`--existing`, or when `tasks/roadmap.md` has content): Review codebase, history, and current roadmap. Update with new work, completed phases, or changed priorities.

## Workflow

1. **Gather context**: Read `.agents/project.json`, `specs/`, `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md` (if it exists), `tasks/history.md`, `tasks/ideas.md`, CLAUDE.md, AGENTS.md, README. For `business-app`, also read `research/icp.md`, `specs/mvp-gap.md`, `research/enterprise-icp.md`, `specs/scale-audit.md`, `research/gtm.md`, and `research/metrics.md`. For `game`, read `research/game-*.md`. For `devtool`, read `research/devtool-*.md`. For existing projects, also review source files and git log.
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

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
