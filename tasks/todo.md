# Current Task

## Priority Task Queue

- [x] AFPS predecessor state is reconciled: PR `#16` merged as `f356ce200` on 2026-08-13, issue `#15` is closed, and `origin/master` contains the reviewed head.
- [x] Stable 1.0 cleanup has an issue-backed delivery lane: issue `#25`, branch `chore/25-stable-1.0-distribution-cleanup`, and ready PR `#26`.
- [x] Task pipeline is healthy; Phase 1 is planned and ready for `$exec`.

## Current Implementation - Stable 1.0 Distribution Cleanup

### Goal

Define the smallest coherent Stable 1.0 distribution cleanup after the merged AFPS foundation, then hand off an evidence-backed implementation boundary without publishing or deleting consumer state.

### Execution Profile

- Parallel mode: serial
- Reason: stable/canary manifests, convention assets, skill metadata, generated catalogs, lifecycle behavior, and release docs share one distribution boundary.
- Safety boundary: no npm publication, dist-tag mutation, release tagging, deployment, destructive consumer cleanup, or removal based only on the word “survivor.”

### Tests First

- [ ] Capture the stable and canary package manifests/build inventories from the merged `origin/master` boundary.
- [ ] Add or identify focused assertions that expose legacy ordinary-workflow coupling, implicit page producers, mixed-default risk, and release-lane leakage.

### Implementation

- [ ] Inventory stable-distributed skills, conventions, package assets, lifecycle/install behavior, catalog entries, and release documentation against `docs/afps-2.0-convention.md` and the RFC clean-break contract.
- [ ] Classify each cleanup candidate as legacy ordinary-workflow coupling, explicit review/admin tooling, historical support, or still-required operational behavior.
- [ ] Give `ship-end` and `sync` explicit keep, migrate, move-lane, or retire dispositions with evidence from their active contracts, consumers, tests, and usage role.
- [ ] Write the bounded next cleanup slice, compatibility/rollback boundary, generated-artifact impact, and exact verification commands into the roadmap/todo review.

### Green

- [ ] Run focused distribution/manifest tests plus stable and canary package build checks without publishing.
- [ ] Run task-document, convention-bundle, catalog freshness, archive, and diff-hygiene checks appropriate to any planned boundary.

### Acceptance Criteria

- [ ] Every proposed removal or lane change has source-path and executable evidence.
- [ ] Explicit page/admin tools and historical archives remain available where the AFPS clean-break contract requires them.
- [ ] `ship-end` and `sync` dispositions preserve operational value and permission boundaries rather than treating continued distribution as sufficient evidence for removal.
- [ ] The next slice cannot create mixed AFPS defaults across source, stable package, runtime refresh, catalogs, docs, or Claude/Codex mirrors.
- [ ] Phase 1 performs no publish, tag, dist-tag, deployment, or destructive consumer action.

### Verification

Planning intake verification:

- [x] `node scripts/audit-task-docs.mjs` passed with zero failures and zero warnings.
- [x] `git diff --check` and staged diff hygiene passed for the planning boundary.
- [x] Issue `#25`, non-primary branch, pushed commits, and ready PR `#26` were verified.

Phase 1 executable verification remains pending execution.

### Review

Roadmap intake confirmed that PR `#16` merged the AFPS foundation while explicitly deferring Stable 1.0 retirement and leaving `ship-end` plus `sync` unchanged. Current package logic defaults to the stable lane and admits canary-only skills/conventions only in canary builds. The audit therefore begins with distribution evidence and classification, not deletion.

Session closeout preserved the audit-first scope, recorded the issue/branch/PR boundary, and left all implementation checkboxes open for `$exec`.

### Next Work

Audit the stable/canary distribution boundary and produce the smallest verified retirement slice.

### Recommended Next Command

`$exec`
