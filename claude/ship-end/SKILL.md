---
name: ship-end
description: Wrap up the current session — update docs, commit, and push
type: shipping
version: 1.0.0
argument-hint: [--kanban] [--no-deploy]
allowed-tools: Bash(poketo *)
---

# Ship End

Wrap up the current session: mark progress, commit, and push.

## Process

1. **Check for changes:**
   - Run `git status` and `git diff` to see all changes.
   - If the working tree is clean and no unpushed commits: report "nothing to ship" and stop.

2. **Update task tracking:**
   - Update `tasks/todo.md` — mark completed items as done, note any outstanding items or blockers.
   - Update milestone progress in `tasks/roadmap.md` if criteria were met.
   - Check `tasks/manual-todo.md` (if it exists) — note the status of manual tasks (how many checked vs unchecked). Do NOT modify checked items.
   - Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.

3. **Deploy:**
   - Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   - Run the deploy and verify the output for errors.
   - If the deploy fails, report the error. Do not retry automatically.

4. **Ship the session changes:**
   - Use the `/commit-and-push-by-feature` workflow: group changes into logical feature/function buckets, use conventional commit messages, and only push if that workflow created a new branch from `main`/`master`. If already on an existing feature branch, commit locally and report that push was skipped.

5. **Report session summary:**
   - What was accomplished
   - Deploy status (if deployed)
   - Test status — explicitly state whether any failing tests are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)
   - What's outstanding
   - Branch and commit list
   - Confirm working tree is clean

## Output Format

```
## Session Summary
- **Accomplished**: [what was done]
- **Deploy**: [status]
- **Tests**: [pass/fail — expected or unexpected]
- **Manual tasks**: [X/Y complete, or "none"]
- **Outstanding**: [remaining work]
- **Branch**: [branch name]
- **Commits**: [list]
- **Working tree**: clean
```

## Constraints

- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message.
- Do NOT modify CLAUDE.md. CLAUDE.md is for project conventions and config only — not progress tracking.
- Progress and active work go in `tasks/todo.md`. Completed work history goes in `tasks/history.md`.
- Do not switch branches or create new branches unless the current state requires it.
- Do not amend or rewrite history.
- Do not commit secrets.
- **Do not push to an existing feature branch.** If already on a feature branch, commit locally only. The `/commit-and-push-by-feature` workflow enforces this — do not bypass it.
- If pre-commit hooks fail, fix and retry.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.

## Kanban Mode (`--kanban`)

When `$ARGUMENTS` contains `--kanban`, move the session's kanban card to Done after committing.

### Kanban Setup

Read and follow the Kanban Setup protocol in `~/.claude/skills/poketo-kanban/KANBAN-SETUP.md` (Board Resolution, Board Validation, and Graceful Degradation — skip Board Overview).

### After Step 4 — Move Session Card to Done

1. Get the device hostname: `hostname -s | tr '[:upper:]' '[:lower:]'`
2. Fetch the board state.
3. Find the session's card in the In Progress list — match by `[this-hostname]` in description or current step name from `tasks/todo.md`.
4. If found → move to Done + `done --id` + update description with commit SHAs.
5. If no matching card found → skip silently.

### Next Work Suggestion

After kanban operations, suggest the top Todo card by priority (overdue > starred > list order). If no Todo cards, check Backlog. If nothing: "Board is clear."

### Summary Addition

Include kanban status (card moved to Done, or no card found) in the session summary.

Kanban operations are additive — if any kanban command fails, warn and continue. Core ship-end workflow must always succeed.
