---
name: ship
description: Ship current work (update docs, commit, push) and optionally plan the next step
argument-hint: [--no-plan]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, EnterPlanMode
---

Ship current work, commit, push, and plan the next step. If `$ARGUMENTS` contains `--no-plan`, skip planning and just wrap up the session.

## Process

### 1. Check if there's anything to ship
Run `git status` and `git diff --stat`.
- If the working tree is clean AND there are no unpushed commits: skip to step 3 (or stop if `--no-plan`).
- If there are changes: continue to step 2.

### 2. Ship the work
a) Read the project's CLAUDE.md to understand current progress.
b) Update `tasks/todo.md` — mark completed items as done (check off steps and milestone criteria).
c) Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.
d) Commit and push using the /commit-and-push-by-feature workflow:
   - Group changes into logical feature/function buckets.
   - Use conventional commit messages.
   - Push to the current branch.

### 3. Plan the next step (skip if `--no-plan`)
a) Read `tasks/todo.md` to identify the next uncompleted step. `tasks/todo.md` contains the full phased plan — it is the single source of truth.
   - If the current phase has no more incomplete steps, **check for the next phase** in `tasks/todo.md`.
   - If a next phase exists, the "next step" is the first step of that next phase. Transition automatically — do NOT stop to ask for confirmation.
   - Only stop and report "all done" if there are truly no more phases or steps remaining.
b) Write a **self-contained** implementation plan for the next step into `tasks/todo.md`. This plan must be complete enough that a fresh context can execute it by reading only CLAUDE.md and `tasks/todo.md`. Include:
   - What needs to be built/changed
   - Which files will be affected (full paths)
   - Key technical decisions or risks
   - Relevant context from the current session (gotchas, patterns established, conventions used)
   - If TDD: which tests to write first and what they should assert
   - Acceptance criteria: how to verify the step is done
c) Commit and push the updated `tasks/todo.md`.

### 4. Output a brief summary (2-3 lines max to save context)
- What was shipped (if anything)
- What the next step is (1 sentence) — or "session wrapped up" if `--no-plan`

### 5. Enter plan mode (skip if `--no-plan`)
**YOU MUST call the EnterPlanMode tool.** This is not optional. This gives the user the option to "clear context and implement" — which starts a fresh context that reads `tasks/todo.md` and implements the plan.

## Constraints
- Do NOT write plans into CLAUDE.md. CLAUDE.md is for project conventions and config only.
- `tasks/todo.md` is the single source of truth for both the full phased plan and active work.
- Create `tasks/todo.md` if it doesn't exist.
- Do NOT re-read files you've already read this session. Use what's in context.
- Do NOT explore the codebase extensively for planning. Keep context footprint minimal.
- If the tree is clean and the next step plan already exists in `tasks/todo.md`, skip straight to step 5.
- Do not amend or rewrite history.
- Do not commit secrets.
- The plan must be actionable, not vague. Include specific file paths and technical details.
