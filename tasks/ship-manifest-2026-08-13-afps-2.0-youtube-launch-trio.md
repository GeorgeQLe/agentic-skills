# Ship Manifest - AFPS 2.0 Foundation And YouTube Launch Trio

## User goal

Preserve the staged AFPS 2.0 implementation, reconcile PR `#16` with current `master` without reverting PR `#18`, regenerate index-derived artifacts, publish an exact reviewable head, run a fresh read-only adversarial review, and merge immediately with a merge commit only when every exact-head gate passes. Preserve the source branch and perform no deployment, release, tag, npm publication, or `latest` change.

## Accountability topology

- Topology: `sol-terra`; risk classification: non-trivial cross-package workflow-policy and generated-artifact mutation.
- Sol requested model: unavailable; resolved model: unavailable. Sol preserved the existing implementation, reconciled `master`, inspected the integrated diff and surrounding contracts, ran verification, owns all dispositions, and remains the sole delivery owner.
- Luna: not used. The accepted plan required serial ownership across overlapping source, task, catalog, package, and merge surfaces.
- Terra requested model: fresh independent reviewer; resolved model: unavailable until delegated execution. The captured read-only delegation prompt is `prompts/expert-review/skill-prompt-20260813-214903-pr-16-adversarial-diff.md`.

## Changed files and per-file purpose

The intended PR boundary against `origin/master` is:

- `AGENTS.md`, `CLAUDE.md`, `docs/afps-2.0-convention.md` — provision and define the canonical AFPS 2.0 operating contract.
- `packages/skillpacks/package.json`, `packages/skillpacks/scripts/build-package.mjs`, `packages/skillpacks/dist/skillpacks-manifest.json`, `scripts/skill-convention-registry.mjs` — package, register, and validate the AFPS convention/canary lane.
- `packs/base/claude/provision-agentic-config/SKILL.md`, `packs/base/claude/provision-agentic-config/CHANGELOG.md`, `packs/base/claude/provision-agentic-config/archive/v0.15/SKILL.md`, `packs/base/codex/provision-agentic-config/SKILL.md`, `packs/base/codex/provision-agentic-config/CHANGELOG.md`, `packs/base/codex/provision-agentic-config/archive/v0.16/SKILL.md` — version and archive the provisioned agent-pointer contracts.
- `packs/youtube-ops/claude/youtube-video-prelaunch-audit/SKILL.md`, `packs/youtube-ops/claude/youtube-video-prelaunch-audit/CHANGELOG.md`, `packs/youtube-ops/claude/youtube-video-prelaunch-audit/archive/v0.5/SKILL.md`, `packs/youtube-ops/codex/youtube-video-prelaunch-audit/SKILL.md`, `packs/youtube-ops/codex/youtube-video-prelaunch-audit/CHANGELOG.md`, `packs/youtube-ops/codex/youtube-video-prelaunch-audit/archive/v0.5/SKILL.md` — migrate and archive the mirrored prelaunch workflow.
- `packs/youtube-ops/claude/youtube-title-thumbnail-audit/SKILL.md`, `packs/youtube-ops/claude/youtube-title-thumbnail-audit/CHANGELOG.md`, `packs/youtube-ops/claude/youtube-title-thumbnail-audit/archive/v0.6/SKILL.md`, `packs/youtube-ops/codex/youtube-title-thumbnail-audit/SKILL.md`, `packs/youtube-ops/codex/youtube-title-thumbnail-audit/CHANGELOG.md`, `packs/youtube-ops/codex/youtube-title-thumbnail-audit/archive/v0.6/SKILL.md` — migrate and archive the mirrored title/thumbnail workflow.
- `packs/youtube-ops/claude/youtube-description-optimizer/SKILL.md`, `packs/youtube-ops/claude/youtube-description-optimizer/CHANGELOG.md`, `packs/youtube-ops/claude/youtube-description-optimizer/archive/v0.6/SKILL.md`, `packs/youtube-ops/codex/youtube-description-optimizer/SKILL.md`, `packs/youtube-ops/codex/youtube-description-optimizer/CHANGELOG.md`, `packs/youtube-ops/codex/youtube-description-optimizer/archive/v0.6/SKILL.md` — migrate and archive the mirrored description workflow.
- Deleted `packs/youtube-ops/{claude,codex}/{youtube-video-prelaunch-audit,youtube-title-thumbnail-audit,youtube-description-optimizer}/ALIGNMENT-PAGE.md` — remove the six legacy launch-trio review-page producers superseded by chat-first AFPS slices.
- `scripts/afps-2-launch-canary.mjs`, `tests/fixtures/afps-2.0-canary/youtube-launch-play/fixture.json`, `tests/fixtures/afps-2.0-canary/youtube-launch-play/checkpoint-good.json`, `tests/fixtures/afps-2.0-canary/youtube-launch-play/checkpoint-bad.json`, `tests/layer1/afps-2-launch-canary.test.ts`, `tests/layer1/youtube-video-prelaunch-thumbnail-generation.test.ts`, `tests/layer1/github-delivery-contract.test.ts` — enforce AFPS shape, baseline/target stop counts, parity, thumbnail safety, and issue-backed delivery compatibility.
- `exports/skills-catalog/v1/catalog.json`, `exports/skills-catalog/v1/manifest.json`, `exports/skills-catalog/v1/proof.json` — regenerate public catalog/proof metadata from the reconciled source and canary package manifest.
- `prompts/brainstorm/skill-prompt-20260810-235019-youtube-review-gates.md`, `prompts/exec/skill-prompt-20260811-111747-afps2-launch-trio.md`, `prompts/skill-creator/skill-prompt-20260811-111747-afps2-launch-trio.md`, `prompts/ship-end/skill-prompt-20260813-214903-reconcile-pr-16.md`, `prompts/expert-review/skill-prompt-20260813-214903-pr-16-adversarial-diff.md` — preserve visible invocation and delegated review provenance.
- `tasks/ideas.md`, `tasks/lessons.md`, `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, `tasks/ship-manifest-2026-08-13-afps-2.0-youtube-launch-trio.md` — preserve the accepted AFPS rationale, correction lessons, current-only execution state, reconciliation history, evidence, and shipping boundary.

Generated local `.claude/skills/**` and `.codex/skills/**` copies are explicitly excluded. Pre-existing untracked `apps/`, `scratchpad/`, `prompts/expert-review/skill-prompt-20260615-230417-ord-align-refactor.md`, and `prompts/sync/skill-prompt-20260620-231338-sync.md` remain untouched and excluded.

## User-goal mapping

- The convention, provision pointers, package registry, and generated catalog make AFPS 2.0 canonical and distributable.
- The launch-trio skill/version/archive changes remove routine approval rituals while preserving explicit external-action permission boundaries.
- The canary fixtures and focused tests prove the seven-stop legacy baseline versus zero routine stops and one possible material checkpoint.
- The merge commit incorporates current `master`; task history explicitly preserves PR `#18` completion evidence and diff inspection confirms no PR `#18` revert.
- The prompt records, task records, exact-head review lane, and GitHub gates provide the evidence needed for a conditional merge without broadening into Stable 1.0 cleanup.

## Tests run

- `pnpm exec vitest run --project layer1 layer1/afps-2-launch-canary.test.ts layer1/youtube-video-prelaunch-thumbnail-generation.test.ts layer1/github-delivery-contract.test.ts` — passed, 3 files / 27 tests. The first sandboxed attempt failed only because a nested local audit process received `spawnSync EPERM`; the exact suite passed with subprocess permission.
- `npm --workspace packages/skillpacks run test:node` — full serial package Node suite passed.
- Stable `npm --workspace packages/skillpacks run build:check` after direct stable manifest generation — passed.
- `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check` — passed.
- `SKILLPACKS_PACKAGE_LANE=canary npm_config_cache=/tmp/skillpacks-npm-cache npm --workspace packages/skillpacks run verify:package` — passed, including dry-run package staging. The informational notice that `latest` remains `0.1.21` is expected and accepted because this task performs no release or dist-tag mutation.
- `./scripts/skill-archive-audit.sh --strict` — passed.
- `node scripts/skill-convention-bundle-audit.mjs` — passed for 415 active skills and 409 tracked bundles.
- `scripts/validate-skills-catalog-export.sh` — passed after canary manifest restoration.
- `node scripts/audit-task-docs.mjs` — passed with zero failures and zero warnings before final current-only task reconciliation; rerun is required on the documented boundary.
- `git diff --check` and `git diff --cached --check` — required on the final staged boundary.
- Changed-boundary secret scan — required on the final staged boundary.
- `./scripts/skill-mirror-parity-audit.sh` — reports three repository-wide failures; the identical failures reproduce from an untouched `origin/master` archive. AFPS-focused Claude/Codex parity assertions pass in the focused Vitest suite, so this is accepted baseline evidence rather than a branch regression.

## Skipped tests

- No deployment, release, tag, npm publication, registry mutation, or `latest` verification is run because the user explicitly excluded those actions.
- No browser/UI test is relevant: the change removes six generated review-page bundles and adds no rendered application or active HTML artifact.
- The entire Vitest repository matrix is not required because the changed executable contracts are covered by the focused layer-one suite plus the full package Node suite, both package lanes, archive/convention/catalog/task audits, and the deterministic canary.

## Adversarial review

- Sol self-review: inspected `origin/master...HEAD`, all overlapping task conflicts, removed producer paths, package/catalog state, PR `#18` preservation, and Stable 1.0 scope boundaries. No Critical/High issue survived.
- Baseline differential: the three full mirror-audit findings reproduce identically on an untouched `origin/master` archive and do not touch the AFPS launch trio; disposition is `rejected as branch regression`, with focused parity tests as verification.
- Fresh Terra lane: captured and required after the exact head is pushed. Any surviving finding must receive one Sol disposition (`accepted`, `rejected`, or `deferred`); accepted Critical/High findings block merge. If remediation changes the head, affected checks and a new exact-head review are required.

## Residual risk

- The largest remaining risk is exact-head drift between local verification, GitHub PR state, and the independent reviewer. The merge gate requires local SHA = remote PR head = reviewed SHA and rechecks mergeability, checks, and unresolved threads immediately before merge.
- The repository-wide mirror audit remains noisy because of three known master-baseline differences in `plan-phase` and `expert-review`. The AFPS-specific parity test covers the changed skill mirrors; later cleanup should address the baseline without expanding PR `#16`.

## Rollback note

Revert PR `#16`'s merge commit on `master` to restore the pre-AFPS launch contracts. The preserved source branch and archived skill versions retain the exact prior contracts; no deployment, release, tag, publication, or dist-tag mutation needs rollback.

## Final Sol acceptance

Sol accepts the integrated implementation and local verification for publication to PR `#16`. Merge acceptance remains conditional on final staged audits, exact remote-head identity, a fresh read-only adversarial review with no unresolved accepted Critical/High finding, conflict-free GitHub state, no failed checks or unresolved threads, and preserved issue/branch semantics.

## Next command

`$expert-review --adversarial-diff --read-only`
