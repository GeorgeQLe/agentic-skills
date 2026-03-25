---
name: ship-end-kanban
description: Wrap up the current session — update docs, commit, push, and move the kanban In Progress card to Done
allowed-tools: Bash(node *)
---

# Ship End (Kanban)

Wrap up the current session: mark progress, commit, push, and move the session's kanban card from In Progress to Done with commit references.

## Kanban Setup

Run these steps before the main process. If any step fails, warn the user and continue without kanban — the core ship-end workflow must always succeed.

### Board Resolution

```bash
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs boards
```

1. If `tasks/.kanban-board` exists, read the board ID. Verify it via `board <id>`. If stale (error), delete the file and continue to step 2.
2. If no valid mapping: match board names against `basename $(pwd)` (case-insensitive). Prefer exact match over substring.
3. If one match → use it, save ID to `tasks/.kanban-board`.
4. If zero or multiple matches → list boards, ask the user to pick. Save their choice.
5. If no boards exist → ask the user if they want to create one. If yes: `create-board --name "$(basename $(pwd))" --lists "Backlog,Todo,In Progress,Done:done,Punt:punt"`. Save the ID.

### Board Validation

After resolving the board, verify all 5 required lists exist (case-insensitive name match): **Backlog, Todo, In Progress, Done, Punt**. If any are missing, create them via `create-list --board <id> --name "<name>"`. Store list IDs for use in subsequent operations.

### Graceful Degradation

If the poketo-kanban scripts are not found at `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`, or if the first kanban command fails (DB connectivity, auth error), warn the user and continue with the base ship-end behavior. Kanban operations are additive — never block the core workflow.

## Process

1) Run `git status` and `git diff` to see all changes.
   - If the working tree is clean and no unpushed commits: report "nothing to ship" and stop.
2) Update `tasks/todo.md` — mark completed items as done, note any outstanding items or blockers. Also update milestone progress in `tasks/roadmap.md` if criteria were met.
3) Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.
4) Deploy:
   a) Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   b) Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   c) If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   d) Run the deploy and verify the output for errors.
   e) If the deploy fails, report the error. Do not retry automatically.
5) Commit and push using the /commit-and-push-by-feature workflow:
   - Group changes into logical feature/function buckets.
   - Use conventional commit messages.
   - Push to the current branch.

### 5b. Kanban: Move session card to Done

After committing and pushing, move the session's In Progress card to Done:

1. Get the device hostname: `hostname -s | tr '[:upper:]' '[:lower:]'`
2. Fetch the board state: `board <id>`
3. Find the session's card in the In Progress list. Match by:
   - Card description contains `[this-hostname]`, OR
   - Card name matches the current step name from `tasks/todo.md`
4. If found:
   - Move to Done list:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs move-card --id <card-id> --list <done-list-id>
     ```
   - Mark as done:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs done --id <card-id>
     ```
   - Update description with commit SHAs from this session:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs update-card --id <card-id> --description "<existing desc> | Commits: <sha1>, <sha2>, ..."
     ```
5. If no matching card found → skip silently. The card may not exist if `/run-kanban` wasn't used for this session.

6) Output a brief session summary:
   - What was accomplished
   - Deploy status (if deployed)
   - Test status — **explicitly state whether any failing tests are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
   - Kanban status (card moved to Done, or no card found)
   - What's outstanding
   - Branch and commit list
   - Confirm working tree is clean

## Constraints
- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message.
- Do NOT modify CLAUDE.md. CLAUDE.md is for project conventions and config only — not progress tracking.
- Progress and active work go in `tasks/todo.md`. Completed work history goes in `tasks/history.md`.
- Do not switch branches or create new branches unless the current state requires it.
- Do not amend or rewrite history.
- Do not commit secrets.
- If pre-commit hooks fail, fix and retry.
- Never use GitHub Actions for deployment.
- Never deploy to production without explicit user confirmation.
- Kanban operations are additive — if any kanban command fails, warn and continue. The core ship-end workflow must always succeed regardless of kanban state.
