# Ship Manifest - Research Amend Base Skill

Date: 2026-07-02

## User Goal

Add the `research-amend` base skill under `packs/base/{claude,codex}` with an alignment-gated amendment workflow.

## Changed Files

- `packs/base/claude/research-amend/SKILL.md`
- `packs/base/claude/research-amend/CHANGELOG.md`
- `packs/base/claude/research-amend/ALIGNMENT-PAGE.md`
- `packs/base/codex/research-amend/SKILL.md`
- `packs/base/codex/research-amend/CHANGELOG.md`
- `packs/base/codex/research-amend/ALIGNMENT-PAGE.md`
- `packs/base/codex/research-amend/agents/openai.yaml`
- `tests/layer1/research-amend-contract.test.ts`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `exports/skills-catalog/v1/catalog.json`
- `exports/skills-catalog/v1/manifest.json`
- `exports/skills-catalog/v1/proof.json`
- `prompts/exec/skill-prompt-20260702-120243-research-amend.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-07-02-research-amend-base-skill.md`

## Per-File Purpose

- Base skill files define the mirrored Claude/Codex amendment contract and generated alignment-page convention bundles.
- Codex `agents/openai.yaml` makes amendment requests discoverable for implicit invocation.
- The focused layer1 test preserves the intended impact ladder, alignment gate, bounded packet, and self-routed YAML behavior.
- Generated manifest/catalog files publish the new base skill to package and public catalog consumers.
- Prompt/task/history/manifest files record the invocation, execution plan, validation, and shipping boundary.

## User-Goal Mapping

- `packs/base/{claude,codex}/research-amend/**` implements the requested base skill and workflow.
- `tests/layer1/research-amend-contract.test.ts` proves the workflow contains the requested alignment gate and escalation behavior.
- Generated package/catalog files make the skill installable/discoverable from the base pack.

## Tests Run

- `pnpm exec vitest run --project layer1 layer1/research-amend-contract.test.ts`
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `npm run skillpacks:build`
- `npm --workspace packages/skillpacks run build:check`
- `node scripts/generate-skills-catalog-export.mjs`
- `scripts/validate-skills-catalog-export.sh`
- `node scripts/skill-alignment-routing-audit.mjs`
- `bash scripts/skill-install-routing-audit.sh --active`

## Skipped Tests

- Full repository Vitest and package Node test suites were not run because this change is a new documentation/skill contract plus generated catalog/package metadata. The targeted contract test and skill/package/catalog audits exercise the affected surfaces.

## Adversarial Review

- Checked the staged diff for scope: no existing Pattern A orchestrator behavior was changed.
- Confirmed `research-amend` appears in both the package manifest and public catalog with Claude and Codex commands.
- Ran alignment routing and install-routing audits to ensure the new non-exec research skill does not route to execution-loop commands while a review gate is pending.
- Confirmed high/systemic changes cannot be small-patched by the skill contract.

## Residual Risk

- The first real use of `research-amend` will still depend on an agent correctly rendering a compliant HTML alignment page from the generated convention. This is the same residual risk as other alignment-producing skills and is covered by the shared alignment-page audits when pages are created.

## Rollback Note

Revert this commit to remove the new base skill and generated package/catalog entries. No runtime schema or migration state is introduced.

## Next Command

`$exec`
