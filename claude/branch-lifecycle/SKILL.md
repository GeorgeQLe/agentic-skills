---
name: branch-lifecycle
description: Inventory, create PRs for, review, merge, and clean up Git branches
version: 1.0.0
argument-hint: [list | pr | review <branch-or-PR> | merge <PR> | cleanup]
---

# Branch Lifecycle

Manage the full lifecycle of Git branches — inventory unmerged work, create PRs, review, merge, and clean up stale branches.

## Process

1. **Parse the action** from `$ARGUMENTS`:
   - Empty or `list` → **list** (default)
   - `pr [branch...]` → **pr**
   - `review <branch-or-PR-number>` → **review**
   - `merge <PR-number>` → **merge**
   - `cleanup` → **cleanup**
   - If the argument doesn't match any action, treat it as a branch name for `list` filtered to that branch.

---

### Action: `list`

Inventory all unmerged branches with status context.

1. Run `git branch -a --no-merged` to find unmerged branches (exclude `HEAD` and the current branch).
2. For each branch:
   - Get ahead/behind counts vs. the main branch: `git rev-list --left-right --count main...<branch>`
   - Get last commit date and author: `git log -1 --format="%cr|%an" <branch>`
   - Check for an existing PR: `gh pr list --head <branch> --json number,title,state,url --limit 1`
3. Output a table sorted by last commit date (most recent first):

```
| Branch | Age | Ahead/Behind | PR | Author |
|--------|-----|--------------|-----|--------|
| feature/foo | 2 days ago | +5 / -0 | #42 (open) | Alice |
| fix/bar | 3 weeks ago | +1 / -12 | none | Bob |
```

4. Flag branches that are >30 days old with no PR as **stale**.

---

### Action: `pr`

Create PRs for branches that don't have one.

1. If specific branches given, use those. Otherwise, find all local branches without a PR (via `gh pr list`).
2. For each branch:
   - Run `git log main..<branch> --oneline` to summarize changes.
   - Create a PR: `gh pr create --head <branch> --title "<title>" --body "<body>"`
   - Title: derived from branch name and commit summary.
   - Body: commit list + summary of changes.
3. Output created PR URLs.

---

### Action: `review`

Evaluate a branch or PR for merge readiness.

1. Resolve the target: if a PR number, fetch details via `gh pr view <number> --json`. If a branch name, find the associated PR.
2. Gather context:
   - Read the PR diff: `gh pr diff <number>`
   - Check CI status: `gh pr checks <number>`
   - Check for merge conflicts: `gh pr view <number> --json mergeable`
   - Read `CLAUDE.md` for project conventions.
3. Evaluate against:
   - **Correctness**: Does the code do what the PR title/description claims?
   - **Tests**: Are there tests? Do they pass?
   - **Conflicts**: Any merge conflicts?
   - **Scope**: Is the PR focused or does it mix unrelated changes?
   - **Conventions**: Does it follow project conventions from `CLAUDE.md`?
4. Output:

```
### PR #42: <title>

- **Status**: Ready to merge / Needs work / Blocked
- **CI**: Passing / Failing / Pending
- **Conflicts**: None / Has conflicts
- **Scope**: Focused / Mixed concerns

#### Findings
- [list of issues or approvals]

#### Recommendation
- Merge / Request changes / Suggest `/investigate` for issues found
```

5. This action does NOT modify code. If issues are found, suggest `/investigate` to fix them.

---

### Action: `merge`

Merge an approved PR.

1. Fetch PR details: `gh pr view <number> --json state,reviewDecision,mergeStateStatus,title`
2. **Safety checks** (all must pass):
   - PR is open
   - PR is approved (reviewDecision = APPROVED) or has no required reviewers
   - CI checks pass (or no required checks)
   - No merge conflicts
3. If any check fails, report why and stop. Do NOT force merge.
4. Merge using squash by default: `gh pr merge <number> --squash`
   - If `CLAUDE.md` specifies a different merge strategy, use that instead.
5. Output the merge result and the merged commit hash.

---

### Action: `cleanup`

Delete merged branches and identify stale ones.

1. Find merged branches: `git branch --merged main` (exclude `main` and current branch).
2. For each merged branch:
   - Delete the local branch: `git branch -d <branch>`
   - If a remote tracking branch exists, delete it: `git push origin --delete <branch>`
   - Report what was deleted.
3. Find stale branches (>30 days old, unmerged, no PR):
   - List them with age and last author.
   - Ask the user before deleting any stale branch — never auto-delete unmerged branches.
4. Output:

```
### Cleaned Up
- Deleted <N> merged branches (local + remote)

### Stale Branches (unmerged, >30 days, no PR)
- `old-feature` — 45 days ago — Alice
- `experiment/x` — 60 days ago — Bob

Delete these? (confirm each individually)
```

## Constraints
- Never merge unapproved PRs — if reviewDecision is not APPROVED and reviews are required, stop and report.
- Never auto-delete stale (unmerged) branches — always ask the user first.
- Squash merge by default; respect `CLAUDE.md` merge strategy overrides.
- Uses `gh` CLI throughout — will fail gracefully if `gh` is not installed or not authenticated.
- This skill does NOT modify source code. If review finds issues, suggest `/investigate`.
- Do not create PRs for the main branch or the current branch.
