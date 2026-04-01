---
name: sync
description: Pull latest changes from remote and report status
---

# Sync

Pull the latest changes from the remote repository and report status.

## Workflow

1. Check current state:
   - Run `git status` to check for uncommitted changes.
   - If there are uncommitted changes, stash them first, pull, then pop the stash. Warn the user about the stash.
2. Pull from remote:
   - Run `git pull --rebase origin <current-branch>`.
   - If rebase conflicts occur, abort the rebase, try `git pull --no-rebase` instead, and report any merge conflicts for the user to resolve.
3. Check for outstanding work:
   - Check if `tasks/roadmap.md` exists for the full plan, and `tasks/todo.md` for the current phase.
   - If `tasks/todo.md` exists, read it and look for unchecked items (`- [ ]`).
   - If there are incomplete items, summarise: which phase is current, what the next step is, and how many steps/phases remain.
   - If `tasks/manual-todo.md` exists, count unchecked manual tasks and include in the summary.
   - If all items are checked, report that the plan is complete.
   - If neither file exists, note that there is no active plan.
4. Report status:
   - Branch name
   - Commits pulled (if any) — show short log of new commits
   - Whether stashed changes were re-applied
   - Any conflicts that need manual resolution
   - Current `git status`
   - **Outstanding work** — summary from step 3 (next step, current phase, remaining work, pending manual tasks) or "No active plan"
5. Post-sync actions:
   a) Check if `sync.md` exists at the project root.
   b) **If `sync.md` exists** — parse and execute it:
      - Read `sync.md` and identify sections by H2 headings.
      - **Dependencies** (aliases: "Deps", "Dependency Management"): Execute shell commands in fenced code blocks. Report output briefly.
      - **Conflict Resolution** (aliases: "Conflicts"): If the pull introduced merge conflicts (from step 2), apply the guidance in this section. If no conflicts, skip silently.
      - **Custom** (aliases: "Project-Specific", "Scripts", "Setup"): Execute shell commands in fenced code blocks in order. Report output briefly.
      - **Notifications** (aliases: "Awareness", "Alerts", "Watch"): For each bullet, check if the mentioned file/directory was modified in pulled commits (`git diff --name-only` against pre-pull HEAD). If any match, print a prominent alert.
      - Unrecognised headings: skip with a note.
      - Report a summary of all post-sync actions taken.
   c) **If `sync.md` does not exist** — suggest creating one:
      - Analyse the project to detect: package manager (look for lockfiles), common scripts (package.json, Makefile, Justfile), config templates (.env.example, docker-compose.yml).
      - Present a suggested `sync.md` following the format below.
      - Ask: "Would you like me to create this `sync.md`?"
      - **Only create the file if the user approves.**

## sync.md format

The `sync.md` file lives at the project root. H2 sections are categories. Shell commands go in fenced code blocks; prose guidance goes in bullet points.

```markdown
# Post-Sync Actions

## Dependencies

```sh
npm install
```

## Conflict Resolution

- Always accept theirs for `package-lock.json`

## Custom

```sh
npm run codegen
```

## Notifications

- `.env.example` — check for new environment variables
- `CLAUDE.md` — review if project conventions were updated
```

## Constraints

- Do not force-push or rewrite history.
- Do not auto-resolve merge conflicts — report them and let the user decide. However, if `sync.md` has a Conflict Resolution section, follow its guidance for the specific files/patterns it covers.
- If stash pop fails due to conflicts, leave the stash intact and report it.
- Post-sync commands from `sync.md` run in the project root directory.
- If any post-sync command fails, report the error and continue with remaining actions.
- Never auto-create `sync.md` without explicit user approval.
- Do not execute commented-out sections (`<!-- ... -->`).
