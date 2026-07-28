---
skill: expert-review
agent: codex
captured_at: 2026-07-27T22:07:41-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Review and Conditional Merge of PR #6

## Summary

Review [PR #6](https://github.com/GeorgeQLe/agentic-skills/pull/6) at its final commit, remediate any accepted blockers on the existing branch, and merge only after presenting the complete gate evidence and receiving explicit user confirmation. Use a merge commit, matching recent repository convention. Do not deploy or delete the branch.

## Review and Remediation

- Confirm PR #6 remains open, non-draft, based on `master`, linked to issue #5, conflict-free, and unchanged from the reviewed head SHA.
- Run a fresh-context, read-only adversarial review of the complete diff and surrounding skill contracts using `expert-review --adversarial-diff --read-only`.
- Review correctness, Claude/Codex parity, archives and changelogs, Stage 2.5 ordering, asset accounting, immutable generations, HTML embedding, capability failure behavior, second approval gating, generated-artifact freshness, and shipping records.
- Treat the existing unresolved upload-readiness thread as blocking until addressed. Update both active v0.5 mirrors and focused tests to require actual JPG/PNG/GIF validation, byte-size verification against YouTube Studio’s current desktop limit, and manifest recording of format and size before a generation becomes complete. YouTube currently documents JPG/GIF/PNG and a 50 MB desktop limit; the API/mobile 2 MB limit is outside this manual desktop workflow. [YouTube thumbnail requirements](https://support.google.com/youtube/answer/72431?hl=en)
- Because v0.5 has not merged, fold any remediation into the existing v0.5 change and changelog entry without another version bump or archive.
- Push fixes to `feat/issue-5-youtube-thumbnail-generation`, reply to the review thread with verification evidence, resolve it only after the fix is present, and rerun the independent review on the new final SHA.
- Record a disposition for every finding. Accepted Critical/High findings and any functional upload-readiness defect block merging; advisory findings must be explicitly accepted or deferred with rationale.

## Verification and Merge Gate

- Rerun the focused Stage 2.5 contract, strict version/archive audits, normalized mirror and changelog parity, dependency and next-step routing comparisons, task-document audit, package build/check, catalog/showcase freshness, whitespace checks, and secret scan.
- Confirm any repository-wide pre-existing failures reproduce unchanged on `master`; any new branch-only failure blocks merging.
- Re-fetch GitHub state and verify no failed or pending required checks, change requests, unresolved review threads, conflicts, or documented blockers. The lack of configured remote checks or branch protection must be reported explicitly and cannot substitute for local verification.
- Present the repository, PR URL, final head SHA, `master` base, merge-commit method, review findings and dispositions, verification results, and confirmation that `Closes #5` will close the issue.
- Request explicit user confirmation immediately before running the merge. Any new commit or changed GitHub gate after confirmation invalidates it and requires renewed review evidence and confirmation.
- On approval, run `gh pr merge 6 --merge` without branch deletion or policy bypass.

## Post-Merge Verification

- Verify PR #6 is merged and capture its merge commit and timestamp.
- Verify issue #5 closed through the PR’s closing keyword; if it does not, report the discrepancy instead of closing it manually.
- Confirm `master` contains the reviewed change and report the final status.
- Leave the feature branch intact. Branch cleanup and deployment remain separate, explicitly authorized actions.

## Assumptions

- “Approved” means the user explicitly confirms the exact final SHA and merge operation after seeing the completed review evidence.
- Merge commit is the default because all methods are allowed and the repository’s latest merged PR used a merge commit.
- Existing unrelated untracked `apps/`, `scratchpad/`, and historical prompt files remain untouched.
