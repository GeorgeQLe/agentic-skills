---
name: commit-and-push-by-feature
description: Commit and push all changes to GitHub grouped by logical feature/function buckets with conventional commit messages
version: 1.0.0
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
6. Determine the primary branch: prefer `main`; if it does not exist, use `master`. If neither exists, stop and explain the blocker.
7. Ensure the commits land on the primary branch from step 6:
   - If already on `main` or `master`, stay there.
   - If on any other branch, switch to the primary branch before committing and pushing. Carry the working tree across only if it can be done safely.
   - If switching would discard work, introduce conflicts you cannot resolve confidently, or otherwise prevent a safe move onto the primary branch, stop and explain the blocker. Do **not** push the feature branch instead.
8. Push the resulting commits to the primary branch. `commit-and-push-by-feature` means commit **and** push when the workflow succeeds.

## Safety

- Do not amend or rewrite history unless the user explicitly asks.
- Stop if you detect likely secrets or credentials in the diff.
- If hooks or tests fail and the expected fix is straightforward, fix them and continue; otherwise report the blocker.

## Output

Report:

- Branch name
- Commits created, with hash and subject
- Final `git status` outcome


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
