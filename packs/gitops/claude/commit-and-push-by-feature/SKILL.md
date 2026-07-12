---
name: commit-and-push-by-feature
description: Commit and push all changes to GitHub grouped by logical feature/function buckets with conventional commit messages
type: shipping
version: v0.2
argument-hint:
---

# Commit and Push by Feature

Compatibility wrapper that groups changes into feature/function commits while delegating issue, branch, publication, and pull-request safety to the canonical GitHub delivery contract.

## Process

1. **Inspect changes:**
   - Run `git status` and `git diff` to understand all changes.
   - **Pack install artifact boundary:** Treat `.agents/project.json` as the committed project designation. When pack configuration changed, bucket and commit `.agents/project.json`. Treat `.claude/skills/**` and `.codex/skills/**` as generated local skill roots recreated by `/pack`, `$pack`, or `scripts/pack.sh refresh`; generated skill roots must not be staged or committed. If those roots are untracked, leave them uncommitted and report them as generated local artifacts. If any path under those roots is already tracked or modified as a tracked file, stop unless the current task explicitly includes repository hygiene to untrack or ignore generated skill roots.

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
   - If there are uncommitted leftover changes at the end, bucket them; do not leave a dirty working tree. Do not bucket generated local skill roots under `.claude/skills/**` or `.codex/skills/**`, even in final leftover cleanup.

4. **Issue-backed branch handling:**
   - Follow `docs/github-delivery-contract.md`.
   - Run `/github-issue ensure`, then `/github-branch ensure` before committing. Reuse unambiguous existing state; stop on ambiguous issue, branch, remote, or dirty-tree ownership.
   - Never commit tracked mutations on the detected primary branch. If the current tree is on primary, create the issue-backed non-primary branch before staging.

5. **Publish and report:**
   - Run `/github-branch publish`, then `/github-pr upsert` to create or update one ready pull request. Do not merge it.
   - Output a concise summary: issue, branch, commits, working-tree state, push status, and pull-request URL or blocker.

## Output

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

Follow the shared shipping contract convention in CLAUDE.md.
