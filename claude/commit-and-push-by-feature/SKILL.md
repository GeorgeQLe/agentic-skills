---
name: commit-and-push-by-feature
description: Commit and push all changes to GitHub grouped by logical feature/function buckets with conventional commit messages
type: shipping
version: 1.0.0
argument-hint:
---

# Commit and Push by Feature

Commit and push all changes to GitHub grouped by feature/function.

## Process

1. **Inspect changes:**
   - Run `git status` and `git diff` to understand all changes.

2. **Identify logical buckets:**
   - Group changes into feature/function buckets (e.g., "auth", "api", "ui", "tests", "docs", "build", "refactor"). Prefer 2–6 commits total unless the change set is tiny.

3. **Commit each bucket:**
   - For each bucket:
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
   - If there are uncommitted leftover changes at the end, bucket them; do not leave a dirty working tree.

4. **Branch guard:**
   - If on `main`/`master`, create a new feature branch named `feature/<short-slug>` derived from the primary bucket.
   - If already on a feature branch (anything other than `main`/`master`), **do NOT push**. Commit locally only and report that push was skipped because you are on an existing feature branch. The user manages pushes to their own branches.

5. **Push and report:**
   - Push with `git push -u origin <branch>` **only** if you created the branch in step 4.
   - Output a concise summary: branch name, list of commits (hash + subject), confirmation that working tree is clean, and whether push was performed or skipped.

## Output Format

```
## Commits
| Hash | Message |
|------|---------|
| abc1234 | feat(auth): add OAuth2 login flow |
| def5678 | docs(readme): update setup instructions |

Branch: feature/oauth-login
Working tree: clean
```

## Constraints

- Do not amend or rewrite history unless explicitly asked.
- Do not commit secrets; if you detect likely secrets, stop and report before committing.
- If pre-commit hooks/tests fail, fix and retry.
