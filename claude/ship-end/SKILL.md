---
name: ship-end
description: Wrap up the current session — update docs, commit, and push
version: 1.0.0
argument-hint:
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
   - Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.

3. **Deploy:**
   - Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   - Run the deploy and verify the output for errors.
   - If the deploy fails, report the error. Do not retry automatically.

4. **Commit and push:**
   - Use the `/commit-and-push-by-feature` workflow: group changes into logical feature/function buckets, use conventional commit messages, push to the current branch.

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
- If pre-commit hooks fail, fix and retry.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
