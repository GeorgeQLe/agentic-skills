---
name: ship-end-kanban
description: Wrap up the current session — update docs, commit, push, and move the kanban In Progress card to Done
---

# Ship End (Kanban)

Use this skill when the user wants the current session wrapped up cleanly. Moves the session's kanban card from In Progress to Done with commit references.

## Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask user. If no boards, offer to create one with `create-board --name "$(basename $(pwd))" --lists "Backlog,Todo,In Progress,Done:done,Punt:punt"`.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `create-list`.
3. If poketo-kanban scripts are missing or DB is unreachable, warn and continue without kanban.

All kanban commands use: `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs <command>`

## Workflow

1. Inspect `git status` and diffs.
2. If the tree is clean and there are no unpushed commits, report that there is nothing to ship and stop.
3. Update `tasks/todo.md` with completed items and blockers. Also update milestone progress in `tasks/roadmap.md` if criteria were met.
4. Update `tasks/history.md` with a brief record of the session. Create it if needed.
5. Deploy:
   - Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/`.
   - If no deploy method is found, ask the user. Do not guess or skip.
   - Run the deploy and verify output.
6. Commit and push using the `commit-and-push-by-feature` workflow.
7. **Kanban: Move session card to Done**
   - Get hostname (`hostname -s | lowercase`), fetch board state
   - Find In Progress card matching `[this-hostname]` in description or current step name
   - If found → move to Done + `done --id` + update description with commit SHAs
   - If not found → skip silently
8. Report:
   - What was accomplished
   - Test status — explicitly state whether failures are expected or unexpected
   - Kanban status (card moved or no card found)
   - What is still outstanding
   - Branch name, commit list, final working-tree state

## Constraints

- **Fix unrelated issues** — commit separately.
- Do not modify `CLAUDE.md` as part of progress tracking.
- Do not switch or create branches unless required.
- Do not amend or rewrite history.
- Stop and report if secrets are detected.
- Never use GitHub Actions for deployment.
- Never deploy to production without explicit user confirmation.
- Kanban operations are additive — if any fail, warn and continue. Core workflow must succeed.
