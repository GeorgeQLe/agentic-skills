---
name: sync
description: Pull latest changes from remote and report status
version: 1.0.0
argument-hint:
---

# Sync

Pull the latest changes from the remote repository and report status.

## Process

1. **Check current state:**
   - Run `git status` to check for uncommitted changes.
   - If there are uncommitted changes, stash them first (`git stash`), pull, then pop the stash. Warn the user about the stash.

2. **Pull from remote:**
   - Run `git pull --rebase origin <current-branch>`.
   - If rebase conflicts occur, abort the rebase (`git rebase --abort`), try `git pull --no-rebase` instead, and report any merge conflicts for the user to resolve.

3. **Check for outstanding work:**
   - Check if `tasks/roadmap.md` exists for the full plan, and `tasks/todo.md` for the current phase.
   - If `tasks/todo.md` exists, read it and look for unchecked items (`- [ ]`).
   - If there are incomplete items, summarise: which phase is current, what the next step is, and how many steps/phases remain.
   - If all items are checked, report that the plan is complete.
   - If neither file exists, note that there is no active plan.

4. **Report status:**
   - Branch name
   - Commits pulled (if any) — show short log of new commits
   - Whether stashed changes were re-applied
   - Any conflicts that need manual resolution
   - Current `git status`
   - **Outstanding work** — summary from step 3 (next step, current phase, remaining work) or "No active plan"

5. **Post-sync actions:**

   a) Check if `sync.md` exists at the project root.

   b) **If `sync.md` exists** — parse and execute it:
      - Read `sync.md` and identify sections by H2 headings.
      - **Dependencies** (aliases: "Deps", "Dependency Management"):
        Execute shell commands found in fenced code blocks (e.g., `npm install`). Report output briefly.
      - **Conflict Resolution** (aliases: "Conflicts"):
        If the pull introduced merge conflicts (from step 2), apply the guidance in this section. For example, if it says "accept theirs for lockfiles", run the appropriate `git checkout --theirs` command. If no conflicts exist, skip silently.
      - **Custom** (aliases: "Project-Specific", "Scripts", "Setup"):
        Execute shell commands found in fenced code blocks in order. Report output briefly.
      - **Notifications** (aliases: "Awareness", "Alerts", "Watch"):
        For each bullet point, check if the mentioned file or directory was modified in the pulled commits (use `git diff --name-only` against the pre-pull HEAD). If any match, print a prominent alert with the bullet's description.
      - Sections with unrecognised headings: skip with a note ("Skipped unknown sync.md section: <heading>").
      - Report a summary of all post-sync actions taken.

   c) **If `sync.md` does not exist** — suggest creating one:
      - Analyse the project to detect:
        - Package manager (look for `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Pipfile.lock`, `requirements.txt`, `go.sum`, `Cargo.lock`, `Gemfile.lock`, `composer.lock`)
        - Common scripts (check `package.json` scripts, `Makefile`, `Justfile` for build/codegen/migrate targets)
        - Config templates (`.env.example`, `docker-compose.yml`, `config/`)
      - Present a suggested `sync.md` to the user with detected actions pre-filled, following the format in the **sync.md format** section below.
      - Ask: "Would you like me to create this `sync.md`? You can customise it anytime."
      - **Only create the file if the user approves.**

## sync.md format

The `sync.md` file lives at the project root. It uses H2 sections as categories. Shell commands go in fenced code blocks; prose guidance goes in bullet points.

```markdown
# Post-Sync Actions

## Dependencies

Commands to run after pulling to keep local dependencies up to date.

```sh
npm install
```

## Conflict Resolution

Project-specific guidance for handling merge conflicts.

- Always accept theirs for `package-lock.json` — regenerate via install command above
- For `generated/` files, regenerate with `npm run codegen` instead of resolving manually

## Custom

Project-specific scripts or commands to run after sync.

```sh
npm run codegen
```

## Notifications

Files and patterns to check for changes after a pull. Alert the user if any were modified.

- `.env.example` — check for new environment variables you may need to add to `.env`
- `CLAUDE.md` — review if project conventions were updated
- `config/` — warn about config schema changes
```

## Constraints
- Do not force-push or rewrite history.
- Do not auto-resolve merge conflicts — report them and let the user decide. However, if `sync.md` has a **Conflict Resolution** section, follow its guidance for the specific files/patterns it covers.
- If stash pop fails due to conflicts, leave the stash intact and report it.
- Post-sync commands from `sync.md` run in the project root directory.
- If any post-sync command fails, report the error and continue with remaining actions (do not abort).
- Never auto-create `sync.md` without explicit user approval.
- Do not execute commands from `sync.md` sections that are commented out with HTML comments (`<!-- ... -->`).
