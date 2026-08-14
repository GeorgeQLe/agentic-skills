---
skill: ship-end
agent: codex
captured_at: 2026-08-13T21:49:03-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Reconcile, Review, and Merge PR #16

## Summary

Preserve the staged AFPS 2.0 implementation, reconcile the branch with current `master` without reverting PR #18, fix hygiene issues, regenerate derived artifacts, and publish an exact reviewable PR head. Run an independent read-only adversarial review and, if every gate passes, merge PR #16 immediately with a merge commit while preserving its branch.

## Implementation Changes

- Snapshot the staged and unrelated untracked path sets. Capture the required `ship-end` and delegated `expert-review` prompt records; never stage `apps/`, `scratchpad/`, or pre-existing unrelated prompt files.
- Remove the four trailing blank-line violations and commit the existing 51-file AFPS implementation against its current parent before reconciliation. This preserves the staged delta without treating untouched pre-PR-18 index entries as deletions.
- Merge `origin/master` into `docs/15-youtube-afps2-target` without rebasing or rewriting history. Resolve the only overlapping files by:
  - keeping AFPS 2.0 as the current roadmap/todo task;
  - preserving completed PR #18 evidence as historical roadmap/history material;
  - keeping `tasks/todo.md` current-task-only.
- Stage the integrated source boundary, refresh local runtime copies, regenerate the public catalog and package manifest from the merged index, and exclude generated `.claude/skills/**` and `.codex/skills/**` roots from commits.
- Complete task history, review evidence, and the ship manifest. Commit all reconciliation/generated-document updates, push the branch, and update PR #16’s stale planning-only title/body with its implemented scope and verification evidence.
- Keep the later 1.0 cleanup out of PR #16. Record no retirement changes here; `ship-end` and `sync` remain explicit stable-1.0 survivors for that subsequent work.

## Verification and Review

- Run the focused Vitest suite for the AFPS launch canary, YouTube prelaunch generation, and GitHub delivery contract.
- Run mirror parity, skill archive, convention bundle, catalog validation, task-document, secret, and `git diff --check` audits.
- Run the full package Node suite plus stable and canary `build:check` and package dry-run verification; inspect warnings and regenerate stale index-derived outputs before continuing.
- Confirm the final PR diff against `origin/master` contains the AFPS implementation and reconciliation records without reverting PR #18, touching unrelated untracked files, or introducing unexpected alignment/interrogation producers.
- Push all commits, then verify GitHub reports the exact local head, a current conflict-free PR, no failed checks, and no unresolved review threads.
- Launch one fresh read-only reviewer for `expert-review --adversarial-diff --read-only`. Record each finding and its Sol disposition; remediate accepted findings, rerun affected checks, push the amended head, and repeat focused independent review when required.
- Merge only when the final exact head has no unresolved Critical/High findings, all required executable checks pass, GitHub remains mergeable, and the reviewed SHA still matches the PR head.

## Merge and Post-Merge Checks

- Merge PR #16 with a merge commit, do not delete `docs/15-youtube-afps2-target`, and perform no deployment, release, tag, npm publication, or `latest` change.
- Verify PR #16 is merged, issue #15 is closed, the merge commit is reachable from remote `master`, the source branch remains available, and unrelated local files are unchanged.
- If reconciliation, verification, exact-head identity, or review fails, stop without merging and report the precise blocker and remediation evidence.

## Assumptions

- The user’s earlier conditional merge authorization remains active; a clean exact-head approval triggers immediate merge without another confirmation.
- Merge-from-master is preferred over rebase because it preserves published branch history and avoids force-pushing.
- PR #16 remains limited to the AFPS 2.0 foundation and YouTube launch trio; Stable 1.0 distribution cleanup begins only after this merge.
