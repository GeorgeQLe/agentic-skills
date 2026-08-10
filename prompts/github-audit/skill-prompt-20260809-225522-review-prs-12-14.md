---
skill: github-audit
agent: codex
captured_at: 2026-08-09T22:55:22-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Review and Conditionally Merge PRs #12 and #14

## Summary

PR #14 passes the substantive review. PR #12 requires metadata and review-thread cleanup before approval. Merge both using merge commits, preserving their branches and performing no deployment.

## Execution

- Capture the required `github-audit` and `expert-review` prompt history on PR #14’s branch; update task tracking without creating alignment or interrogation pages.
- For PR #12:
  - Replace `Closes #11` with evidence-only wording.
  - Record that the user ratified the three research-ledger entries.
  - Reply to and resolve the outstanding P2 thread.
  - Recheck its exact head, checks, mergeability, and base currency.
  - Present the exact merge details for immediate confirmation, then merge with a merge commit.
- Refresh PR #14 from the resulting `master`, update its body to close both issues #11 and #13, and remove stale wording that PR #12 remains open.
- Update PR #14’s task records, commit and push all intended changes, then conduct a fresh exact-head review.
- Present PR #14’s exact merge details for immediate confirmation, then merge with a merge commit.

## Verification

- Rerun the briefing-slides audit, task-document audit, terminology/interface consistency checks, link and scope assertions, deck interaction/viewport checks, and `git diff --check`.
- Confirm PR #14 still changes no active skill, convention, generator, runtime mirror, alignment page, or interrogation page.
- Before each merge, require an open, non-draft, current, conflict-free PR with no failed checks, unresolved threads, or accepted blocking findings.
- Afterward, verify both PRs are merged, issues #11 and #13 are closed by PR #14, `master` contains both merge commits, branches remain intact, and existing unrelated untracked files are untouched.

## Assumptions

- “Both” means PR #12 and PR #14; issue #13 is closed rather than merged.
- Merge commits are used to preserve research and RFC history.
- The current instruction ratifies PR #12’s ledger entries but does not waive the repository’s exact-details confirmation immediately before each merge.
