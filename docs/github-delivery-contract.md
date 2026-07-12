# GitHub Delivery Contract

This is the canonical delivery contract for tracked repository mutations. Skills that create or modify tracked files inherit it through the shared shipping contract or apply it explicitly.

## Default Lifecycle

When a repository has a GitHub remote, every tracked mutation must use one reviewable lifecycle:

1. `github-issue ensure` reuses one unambiguous linked open issue or creates one issue for the work.
2. `github-branch ensure` reuses or creates one issue-backed non-primary branch after proving dirty-tree ownership.
3. Work is validated and committed on that branch.
4. `github-branch publish` pushes that branch without force.
5. `github-pr upsert` reuses the pull request for the branch or creates one ready-for-review pull request.
6. Ordinary shipping stops at the ready pull request. `github-pr merge` is a separate, explicitly confirmed action.

Reuse before create. A command must stop on ambiguous issue, branch, pull-request, remote, or dirty-tree ownership instead of guessing or creating duplicates.

## Primary-Branch Boundary

- Never commit tracked mutations on, push tracked mutations directly to, or force-update `main`, `master`, or the repository's detected primary branch.
- Never use a primary-branch push as a fallback when GitHub, the remote, or authentication is unavailable.
- Release and deployment workflows are the only operational exceptions: they may require and inspect an already-merged, clean, current primary branch, but they do not deliver development mutations directly to it.
- Merge is not ordinary shipping authority. It requires `github-pr merge` and all merge gates below.

## Degraded Environments

If the repository is not GitHub-backed, the GitHub remote is missing, `gh` is unavailable, or authentication fails, keep safe work and commits on a non-primary local branch and report the publication blocker. Do not close issues, delete branches, merge, or push primary as compensation.

## Ownership And Secrets

- Inspect status before branch adoption, staging, committing, or cleanup.
- Adopt dirty files only when their ownership and relation to the task are explicit. Stop on overlapping or ambiguous user/concurrent work.
- Stage explicit intended paths and inspect the staged diff. Never use broad staging as a substitute for ownership proof.
- Run repository secret checks and never commit credentials or protected local configuration.

## Merge And Closure

`github-pr merge` must verify the pull request is open, non-draft, mergeable without conflicts, current with its base, passing required checks, approved under repository policy, and free of unresolved review threads or accepted blocking findings. It must show the exact repository, pull request, head, base, merge method, and linked issue disposition, then obtain explicit user confirmation immediately before merge.

Do not close the linked issue when a pull request opens. Prefer a supported closing keyword in the pull-request body so GitHub closes the issue only when the pull request merges. Manual issue closure outside that path is a separate explicit action.

Post-merge branch cleanup is optional and separately confirmed. Never delete an unmerged branch, a branch with unique commits, the current branch, or a branch whose ownership is ambiguous.

## Transitional Enforcement

`scripts/audit-github-delivery-contract.mjs` rejects active skill instructions that introduce direct-primary mutation delivery. The audit has no legacy allowance: newly discovered wording must be migrated and covered by regression tests rather than baselined.
