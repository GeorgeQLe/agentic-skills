# Ship Manifest - GitHub Delivery Phase 2

## User goal

Execute the full next incomplete phase: migrate shipping orchestrators from direct-primary mutation delivery to issue-backed non-primary branches and ready pull requests.

## Changed files and purpose

- `packs/gitops/**/commit-and-push-by-feature/**`: versioned compatibility wrappers over GitHub issue, branch, and PR safety primitives.
- `packs/release-ops/**/branch-lifecycle/**`: versioned compatibility/recovery wrappers delegating normal PR upsert and merge.
- `packs/exec-loop/**/{exec,ship,ship-end}/**`: versioned execution/shipping contracts with ready-PR delivery and merge-gated deployment.
- Active writing skills under `packs/base/**`, `packs/project-fleet/**`, and `packs/report-gen/**`: removed direct-primary overrides and archived prior versions.
- `scripts/audit-github-delivery-contract.mjs` and `tests/layer1/github-delivery-contract.test.ts`: narrowed the migration baseline and added executable orchestrator regression coverage.
- `exports/skills-catalog/v1/proof.json`: refreshed public catalog proof for changed source hashes.
- `prompts/exec/**`, `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, and this manifest: invocation, progress, review, and shipping evidence.

## User-goal mapping

Every Phase 2 roadmap item maps to the wrapper/orchestrator/writing-skill groups above. Ordinary shipping now ends at a ready pull request; merge and deployment remain separately gated.

## Accountability

- Topology: `sol-terra` requested; serial Sol implementation used.
- Luna: not used because the active session forbids subagent delegation and the write scope overlaps.
- Requested models: Sol GPT-5; Terra fresh reviewer. Resolved models: unavailable from runtime.
- Sol inspection: reviewed the integrated diff, remaining direct-primary matches, archive/version state, and deployment ordering.
- Terra: unavailable because the active session policy forbids subagents. Equivalent failure-oriented Sol review checked duplicate creation, primary-branch fallback, silent merge, deploy-before-merge, dirty-tree handoff, and stale audit allowlists.

## Tests run

- `npx vitest run tests/layer1/github-delivery-contract.test.ts` - 5/5 passed.
- `node scripts/audit-github-delivery-contract.mjs` - passed; four legacy lines remain only in two Phase 3 provisioning templates.
- `scripts/skill-archive-audit.sh` - 415 skills checked, zero violations.
- `scripts/base-skill-version-parity-audit.sh` - passed.
- `node scripts/generate-skills-catalog-export.mjs` and `scripts/validate-skills-catalog-export.sh` - passed.
- `scripts/pack.sh refresh` - completed; runtime roots remain generated and outside the commit boundary.
- `git diff --check` - passed before task/manifest finalization and will be rerun.

## Skipped tests

- Full layer-one suite was not rerun because the focused executable contract test directly covers the migrated behavior and the prior branch baseline already records 21 unrelated research/design/provisioning failures.
- A fresh Terra subagent audit was unavailable under the active no-subagent session policy; the residual independence limitation is recorded below.

## Adversarial review and dispositions

- Finding P2-01 (Medium): shipping contracts could deploy work before its new PR was merged. Accepted and remediated by explicit merge-gated deployment deferral in `ship`, `ship-end`, and Codex `exec`.
- Finding P2-02 (Low): the audit allowlist could preserve migrated direct-primary exceptions indefinitely. Accepted and remediated by removing every Phase 2 entry; only Phase 3 provisioning entries remain.
- No unresolved Critical or High findings.

## Residual risk

The contracts are declarative rather than an end-to-end mocked `gh` integration. Phase 3 dogfooding will exercise actual issue/branch/PR publication. Independent Terra context was unavailable, so Phase 3 should include a fresh adversarial review before PR readiness.

## Rollback note

Revert the Phase 2 commit to restore prior contracts; archived skill versions preserve the exact previous text for audit and recovery.

## Next command

`$exec --phase 3`

## Final Sol acceptance

Accepted for shipping after final focused validation. No accepted Critical/High finding is unresolved; deployment remains deferred until merge.
