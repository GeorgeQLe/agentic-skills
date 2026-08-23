# Current Task

## Current Implementation - Terminating Prompt History Delivery

### Goal

Eliminate recursive prompt-only pull requests while preserving prompt records inside substantive work and retaining issue-backed delivery for real tracked mutations.

### Current Phase

- [x] Confirm the recursion against repository policy, git history, tests, and live pull-request inventory.
- [x] Obtain implementation permission and create issue `#103` plus branch `fix/103-stop-recursive-prompt-history-prs`.
- [x] Update the prompt-history convention and GitHub lifecycle contracts with a terminating rule.
- [x] Archive, bump, changelog, and refresh every affected skill mirror.
- [x] Consolidate the open prompt-only records without closing or deleting their existing delivery objects.
- [ ] Run focused and repository-level verification, record review evidence, and publish one ready pull request.

### Acceptance Criteria

- [x] Prompt capture never becomes the sole reason for tracked mutation delivery.
- [x] Operational GitHub lifecycle invocations do not generate follow-on bookkeeping pull requests.
- [x] Existing prompt records remain available through one substantive consolidation branch.
- [x] No existing pull request, issue, or branch is closed or deleted during this implementation phase.

### Verification

- [x] Prompt-history convention regressions: 3 focused files, 14 tests passed.
- [x] GitHub delivery contract audit: 411 active skills, zero direct-primary allowances.
- [x] Base skill version parity: 2 targeted pairs, zero failures.
- [x] Skill archive and changed-scope mirror verification: strict archive audit passed for 415 skills; the three repository-wide mirror findings reproduce unchanged on `origin/master` and none are in this change's scope.
- [x] Runtime refresh plus package/catalog checks required by changed base skills: refreshed runtime copies, regenerated catalog and canary manifest, and passed package build, manifest, staging-boundary, and npm-pack dry-run verification.
- [x] Task-document, diff-hygiene, and intended-path secret checks: task audit reports zero failures/warnings, cached and working-tree whitespace checks pass, and staged gitleaks scanning reports no leaks.
- [x] Full layer-one baseline differential: current branch has zero current-only failures and resolves two baseline failures (2,540/2,568 passing versus 2,536/2,566 on `origin/master`).

### Review

The terminating rule is implemented in the provisioned agent policies, canonical delivery contract, invocation taxonomy, and all six GitHub lifecycle skill mirrors. Twenty records from 16 open prompt-only pull requests plus the two current substantive-work prompt records are consolidated on this branch. Focused tests, strict version/archive checks, the full layer-one baseline differential, runtime refresh, catalog generation, canary package verification, task/diff hygiene, and staged secret scanning pass. Pull-request publication remains.

### Next Work

Publish the ready fix pull request. After it merges, separately confirm closure of superseded prompt-only pull requests/issues and optional branch deletion.

### Recommended Next Command

`$github-pr review <fix-pr-number>`
