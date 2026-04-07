---
name: commit-and-push-by-feature
description: Commit and push all changes to GitHub grouped by logical feature/function buckets with conventional commit messages
---

# Commit And Push By Feature

Use this skill when the user wants current changes committed and pushed in sensible feature-oriented buckets rather than one undifferentiated commit.

## Workflow

1. Inspect `git status` and relevant diffs to understand the change set.
2. Partition changes into logical buckets such as `auth`, `api`, `ui`, `tests`, `docs`, `build`, or `refactor`.
3. Prefer 2 to 6 commits unless the change set is genuinely tiny.
4. For each bucket:
   - Stage only the files for that bucket
   - Verify the staged diff matches the intended scope
   - Commit with a conventional message such as `feat(scope): summary`, `fix(scope): summary`, `refactor(scope): summary`, `test(scope): summary`, `docs(scope): summary`, or `chore(scope): summary`
5. Do not leave unrelated tracked changes behind. Either bucket them too or stop and explain the blocker.
6. Do not create or switch branches as part of this workflow unless the user explicitly asks.
7. Push only if the user explicitly asked for a push in the current task; otherwise commit locally and report that push was skipped.

## Safety

- Do not amend or rewrite history unless the user explicitly asks.
- Stop if you detect likely secrets or credentials in the diff.
- If hooks or tests fail and the expected fix is straightforward, fix them and continue; otherwise report the blocker.

## Output

Report:

- Branch name
- Commits created, with hash and subject
- Final `git status` outcome
