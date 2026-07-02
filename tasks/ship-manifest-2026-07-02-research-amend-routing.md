# Ship Manifest - Research Amend Routing Integration

## User Goal

Add concise `research-amend` routing guidance to Pattern A and research-health surfaces while preserving high/systemic rerun routing.

## Changed Files

- `docs/research-session-loop-convention.md`
- `docs/orchestrator-convention.md`
- `packs/research-admin/{claude,codex}/research-roadmap/SKILL.md`
- `packs/research-admin/{claude,codex}/research-roadmap/CHANGELOG.md`
- `packs/research-admin/{claude,codex}/research-roadmap/archive/v0.19/SKILL.md`
- `packs/business-ops/{claude,codex}/reconcile-research/SKILL.md`
- `packs/business-ops/{claude,codex}/reconcile-research/CHANGELOG.md`
- `packs/business-ops/{claude,codex}/reconcile-research/archive/v0.10/SKILL.md`
- `tests/layer1/research-roadmap-routing.test.ts`
- `tests/layer1/reconcile-research-routing.test.ts`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `exports/skills-catalog/v1/{catalog,manifest,proof}.json`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `prompts/exec/skill-prompt-20260702-122139-research-amend-routing.md`

## Per-File Purpose

- Pattern A docs define post-canonical amendment routing and keep review-pending pages on YAML-only handling.
- Research-health skills queue `research-amend` for bounded low/medium corrections and preserve reruns for high/systemic drift.
- Reconciliation skill next-step logic recommends `research-amend` only for isolated findings, not conflict clusters.
- Tests lock the routing language and platform-specific command forms.
- Generated artifacts refresh package/catalog metadata for changed active skills.
- Task/history/prompt files record execution, verification, and invocation provenance.

## User-Goal Mapping

- Bounded amendments: covered by Pattern A docs, research-roadmap guidance, and reconcile-research recommendation logic.
- High/systemic reruns: explicitly preserved in every changed routing surface and tested.
- Review boundary: docs and research-roadmap guidance forbid `research-amend` while Pattern A pages remain in `review`.

## Tests Run

- `pnpm exec vitest run --project layer1 layer1/research-roadmap-routing.test.ts layer1/reconcile-research-routing.test.ts layer1/research-amend-contract.test.ts`
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `node scripts/skill-alignment-routing-audit.mjs`
- `bash scripts/skill-install-routing-audit.sh --active`
- `npm run skillpacks:build`
- `npm --workspace packages/skillpacks run build:check`
- `node scripts/generate-skills-catalog-export.mjs`
- `scripts/validate-skills-catalog-export.sh`
- `git diff --check`

## Skipped Tests

- Full repository test suite was not run because this is a documentation/skill-contract routing change with focused layer1 coverage and package/catalog audits. Residual risk is limited to unrelated dirty-tree work in other packs, which was not part of this boundary.

## Adversarial Review

- Risk: `research-amend` could be recommended before approval. Mitigation: Pattern A docs and research-roadmap guidance explicitly forbid amendment routing while pages are in `review`.
- Risk: bounded-amend guidance could weaken reruns. Mitigation: changed surfaces name high/systemic examples and preserve framework/synthesis/full rerun routing.
- Risk: Claude/Codex command drift. Mitigation: tests assert `$research-amend` and `/research-amend` in the correct mirrors.

## Residual Risk

Existing unrelated dirty work remains in other packs. It was not modified, staged, committed, or validated as part of this change.

## Rollback Note

Revert this commit to remove the routing guidance, version bumps, archives, tests, and regenerated metadata together.

## Next Command

`$exec` for the next implementation task, or `$brainstorm` if no current implementation queue remains.
