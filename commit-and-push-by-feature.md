Commit and push all changes to GitHub grouped by feature/function.

Process:
1) Inspect `git status` and `git diff` to understand all changes.
2) Identify logical feature/function buckets (e.g., "auth", "api", "ui", "tests", "docs", "build", "refactor"). Prefer 2–6 commits total unless the change set is tiny.
3) For each bucket:
   - Stage only the files for that bucket (use `git add <paths>`; avoid `git add -A` unless it's the final bucket and everything belongs together).
   - Create a conventional commit message:
     - `feat(<scope>): <summary>` for new functionality
     - `fix(<scope>): <summary>` for bug fixes
     - `refactor(<scope>): <summary>` for refactors without behavior change
     - `test(<scope>): <summary>` for tests only
     - `docs(<scope>): <summary>` for documentation
     - `chore(<scope>): <summary>` for tooling/config
   - Include a short body only if it clarifies intent or risk.
   - Verify `git diff --cached` matches the bucket before committing.
4) If there are uncommitted leftover changes at the end, bucket them; do not leave a dirty working tree.
5) Ensure we are on an appropriate branch:
   - If on `main`/`master`, create a new feature branch named `feature/<short-slug>` derived from the primary bucket.
6) Push to `origin`:
   - `git push -u origin <branch>`
7) Output a concise summary:
   - branch name
   - list of commits (hash + subject)
   - confirmation that working tree is clean (`git status`)

Constraints:
- Do not amend or rewrite history unless explicitly asked.
- Do not commit secrets; if you detect likely secrets, stop and report before committing.
- If pre-commit hooks/tests fail, fix them and continue.
