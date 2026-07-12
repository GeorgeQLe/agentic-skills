# Ship Manifest - GitHub Delivery Phase 3

## User goal

Execute Phase 3 of the approved Issue-Backed Branch and PR Delivery migration and publish the completed migration as a ready pull request without merging it.

## Shipping boundary

- Root/provisioning policy: `AGENTS.md`, `CLAUDE.md`, and both `packs/base/*/provision-agentic-config/**` mirrors, changelogs, and version archives.
- Shared documentation: GitHub delivery, accountable-agent, quality-gate, operating-mode, pack, invocation-type, and skills-reference contracts.
- Terra remediation: both `update-packages` mirrors and both `product-line` mirrors with archives/changelogs.
- Enforcement: `scripts/audit-github-delivery-contract.mjs` and `tests/layer1/github-delivery-contract.test.ts`.
- Generated artifacts: `exports/skills-catalog/v1/**` and `packages/skillpacks/dist/skillpacks-manifest.json`.
- Records: Phase 3 prompt captures, task roadmap/todo/history, and this manifest.

## Per-file purpose and user-goal mapping

- Policy and skill sources make issue-backed non-primary delivery the executable default and remove all active direct-primary mutation routes.
- Archives/changelogs preserve skill version history required by repository convention.
- Documentation explains the same lifecycle across agents, modes, quality gates, installation, and invocation surfaces.
- Audit/tests prevent the exact direct-primary phrases found during migration and Terra review from returning.
- Generated manifests/catalogs publish the final staged skill versions, hashes, and archive metadata.
- Task and prompt records make the Phase 3 execution and review boundary reproducible.

## Accountability topology

- Topology: `sol-terra`; Phase 3 implementation was serial and had no Luna write lanes.
- Requested/resolved models: platform default models; no fallback was reported.
- Sol inspection/integration: Sol inspected the branch diff and relevant surrounding contracts, staged the source boundary before index-backed generation, integrated Terra remediation, and reran all affected checks.

## Tests run

- `node --test packages/skillpacks/test/lifecycle.test.mjs` — 76/76 passed.
- `pnpm --dir tests exec vitest run --project layer1 layer1/github-delivery-contract.test.ts` — 7/7 passed after remediation.
- `node scripts/audit-github-delivery-contract.mjs` — passed for 411 active skills with zero legacy allowances.
- `scripts/skill-archive-audit.sh --strict` — passed.
- `scripts/base-skill-version-parity-audit.sh` — passed.
- `scripts/skill-mirror-parity-audit.sh` — passed.
- `node scripts/audit-task-docs.mjs` — passed with zero failures/warnings and two advisory-info items.
- `scripts/validate-skills-catalog-export.sh` — passed against the staged source boundary.
- `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check` — passed.
- `git diff --check` — passed.

## Skipped tests

- Full repository layer-one suite was not rerun because the changed behavior has dedicated delivery-contract, lifecycle, archive, parity, catalog, and package-build coverage; the branch also carries previously documented unrelated layer-one failures.
- No UI/visual test applies because this phase changes workflow policy, skills, documentation, and generated metadata rather than a rendered interface.

## Adversarial review and Sol dispositions

- `TERRA-GD-001` (High, audit missed active “repository primary branch” instructions): **accepted**. Migrated `update-packages` and Codex `product-line`, versioned both mirrors, expanded the audit regex, and added focused assertions.
- `TERRA-GD-002` (Medium, generated artifacts stale relative to unstaged sources): **accepted**. Staged the complete skill source/archive/changelog boundary before regenerating and staging catalog/package artifacts; verified provision versions Claude v0.15 and Codex v0.16.
- `TERRA-GD-003` (Medium, obsolete direct-primary exception/allowlist framing): **accepted**. Removed the framing from provisioned/root/accountability contracts and replaced the delivery-contract transition note with zero-allowance behavior.
- Remediation verification: all integrated commands in `Tests run` passed. A focused fresh Terra re-audit resolved `TERRA-GD-001`, `TERRA-GD-002`, and `TERRA-GD-003`; it found no remediation regression and confirmed staged diff hygiene.

## Residual risk

- The phrase-based audit can only reject wording represented by its patterns. The dedicated regression assertions now cover every direct-primary phrase discovered in this migration, and future discoveries must be migrated rather than baselined.
- GitHub publication depends on current `gh` authentication and repository permissions; failure preserves the commits on the non-primary branch and blocks PR publication without falling back to primary.

## Rollback note

Revert the Phase 3 commit on the work branch to restore prior provisioning/docs/audit/generated state. Do not rewrite or force-push branch history; close or supersede the ready PR through the explicit GitHub lifecycle if the migration is abandoned.

## Next command

`$github-pr merge` after human review and explicit merge confirmation.

## Final Sol acceptance

Accepted. Integrated verification passes, all accepted Terra findings are resolved, focused re-audit passes, and no Critical/High finding remains open. Ready-PR publication is the remaining delivery action.
