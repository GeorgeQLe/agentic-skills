---
name: commit-and-push-by-feature
description: Commit and push all changes to GitHub grouped by logical feature/function buckets with conventional commit messages
type: shipping
version: v0.0
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

4. **Branch handling:**
   - Determine the primary branch: prefer `main`; if it does not exist, use `master`. If neither exists, stop and explain the blocker.
   - Ensure the commits land on the primary branch.
   - If already on `main` or `master`, stay there.
   - If on any other branch, switch to the primary branch before committing and pushing. Carry the working tree across only if it can be done safely.
   - If switching would discard work, introduce conflicts you cannot resolve confidently, or otherwise prevent a safe move onto the primary branch, stop and explain the blocker. Do not push the feature branch instead.

5. **Push and report:**
   - Push the resulting commits to the primary branch. `commit-and-push-by-feature` means commit and push when the workflow succeeds.
   - Output a concise summary: branch name, list of commits (hash + subject), confirmation that working tree is clean, and whether push was performed or blocked.

## Output Format

```
## Commits
| Hash | Message |
|------|---------|
| abc1234 | feat(auth): add OAuth2 login flow |
| def5678 | docs(readme): update setup instructions |

Branch: current branch
Working tree: clean
```

## Constraints

- Do not amend or rewrite history unless explicitly asked.
- Do not commit secrets; if you detect likely secrets, stop and report before committing.
- If pre-commit hooks/tests fail, fix and retry.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
