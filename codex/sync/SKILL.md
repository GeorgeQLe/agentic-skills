---
name: sync
description: Pull latest changes from remote and report status.
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
3. Report status:
   - Branch name
   - Commits pulled (if any) — show short log of new commits
   - Whether stashed changes were re-applied
   - Any conflicts that need manual resolution
   - Current `git status`

## Constraints

- Do not force-push or rewrite history.
- Do not auto-resolve merge conflicts — report them and let the user decide.
- If stash pop fails due to conflicts, leave the stash intact and report it.
