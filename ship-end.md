Wrap up the current session: update documentation, commit, and push.

Process:
1) Read the project's CLAUDE.md (or equivalent tracking doc) to understand current progress and phase.
2) Run `git status` and `git diff` to see all changes.
3) Update documentation:
   - Update CLAUDE.md with what was accomplished this session.
   - Note any outstanding items, known issues, or blockers discovered.
   - Mark completed items/phases as done.
   - If there are other relevant docs (README, changelogs, etc.) that need updating based on the changes, update them too.
4) Commit and push using the /commit-and-push-by-feature workflow:
   - Group changes into logical feature/function buckets.
   - Use conventional commit messages.
   - Push to the current branch.
5) Output a brief session summary:
   - What was accomplished
   - What's outstanding
   - Branch and commit list
   - Confirm working tree is clean

Constraints:
- Do not switch branches or create new branches unless the current state requires it.
- Do not amend or rewrite history.
- Do not commit secrets.
- If pre-commit hooks fail, fix and retry.
