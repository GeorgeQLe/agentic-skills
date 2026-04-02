---
name: ship-kanban
description: Ship current work, move kanban card to Done or Punt, deploy, and plan the next step with card in Todo
---

# Ship (Kanban)

Ship current work, commit, push, deploy, and plan the next step. Moves completed kanban cards to Done or Punt, ensures next step's card is in Todo.

## Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask the user. If the session is already in Plan mode and there are 2-3 concrete board choices, prefer `request_user_input`; otherwise ask a concise plain-text question. If no boards exist, offer to create one with `create-board --name "$(basename $(pwd))" --template standard`.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `create-list`.
3. If poketo-kanban scripts are missing or DB is unreachable, warn and continue without kanban.

All kanban commands use: `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs <command>`

## Workflow

1. Check if there is anything to ship:
   - Run `git status` and `git diff --stat`.
   - If the working tree is clean and there are no unpushed commits, skip to step 3.
   - If there are changes, continue to step 2.
1b. **Pre-ship error check:**
   - First check conversation context for lint/typecheck/test output already produced this session (e.g., from a TDD run step). Do NOT re-run commands whose results are already available.
   - For any validation category not already run, find commands from: `CLAUDE.md`, `Makefile`/`Justfile` (check/lint/typecheck/test targets), `package.json` (lint/typecheck/check/test scripts), `pyproject.toml`/`setup.cfg`, `Cargo.toml`. If none found and no prior output exists, skip.
   - If pre-existing errors are found (from prior output or fresh runs), fix them and re-run only the failing commands to confirm. Include fixes in the step's commit (or as a separate commit if unrelated).
   - If errors can't be auto-fixed, document them in the summary and continue.
2. Ship the work:
   - Read `CLAUDE.md` to understand current progress.
   - Update `tasks/todo.md` — mark completed items as done.
   - Update `tasks/history.md` — append a brief record of what was accomplished. Create it if needed.
   - Commit and push using the commit-and-push-by-feature workflow.
2b. **Kanban: Move completed card**
   - Find the completed step's card on the board
   - Step checked off → move to Done + `done --id`
   - Step has blocker/deferred → move to Punt + add reason
   - Unclear → ask the user: Done or Punt? If the session is already in Plan mode, prefer `request_user_input` with those choices.
   - Update card description with commit SHAs
3. Deploy:
   - Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/`.
   - If no deploy method is found, ask the user. Do not guess or skip.
   - Run the deploy and verify output.
4. Plan the next step:
   - Migration check, read todo.md, check phase completion, handle transitions.
   - On phase transition: archive `tasks/manual-todo.md` to `tasks/phases/phase-N-manual.md` (if it exists, warn on unchecked items). Extract next phase's manual tasks into fresh `tasks/manual-todo.md`.
   - Write self-contained next-step plan into `tasks/todo.md`.
   - Commit and push (include `tasks/manual-todo.md` if it exists).
4b. **Kanban: Ensure next card in Todo**
   - Search for next step's card
   - If in Backlog → move to Todo
   - If not found → create in Todo
   - If already in Todo or later → skip
4c. **Next Work Suggestion:** Suggest the top Todo card by priority (overdue > starred > list order). If no Todo cards, check Backlog. If nothing: "Board is clear."
5. Output brief summary: shipped, deploy status, test status, manual tasks (pending count, any blocking), kanban status, next step.

## Constraints

- **Fix unrelated issues** — commit separately.
- Do not write plans into `CLAUDE.md`.
- `tasks/roadmap.md` is the source of truth. `tasks/todo.md` holds only the current phase.
- Do not amend or rewrite history.
- Do not commit secrets.
- Never use GitHub Actions for deployment.
- Never deploy to production without explicit user confirmation.
- Kanban operations are additive — if any fail, warn and continue. Core workflow must succeed.
