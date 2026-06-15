# Ship Manifest - Competitive Analysis Re-Entry Routing Guard

## User Goal

Update the existing `competitive-analysis` skill so repeated parent invocations advance to the first pending child framework instead of rerunning parent status/audit work or routing to `exec`.

## Changed Files

- `packs/business-research/{codex,claude}/competitive-analysis/SKILL.md` - bumped to `v0.21` and added the Re-entry Routing Guard.
- `packs/business-research/{codex,claude}/competitive-analysis/archive/v0.20/SKILL.md` - archived prior active contracts.
- `packs/business-research/{codex,claude}/competitive-analysis/CHANGELOG.md` - documented `v0.21`.
- `tests/layer4/setups/packs/pack-workflows.setup.ts` - added deterministic competitive-analysis re-entry fixture and forbidden-output assertions.
- `tests/harness/bench-coverage.ts` - added missing `ord-traction` and `vard-traction` coverage rows surfaced by validation.
- Generated assets under `docs/skills-showcase/assets/`, `apps/skills-showcase/public/assets/`, and `packages/skillpacks/dist/`.
- `prompts/targeted-skill-builder/skill-prompt-20260615-132732-competitive-analysis-reentry.md` - visible prompt record.
- `tasks/todo.md`, `tasks/history.md` - task tracking and history.

## User-Goal Mapping

- Re-entry guard directly addresses manifest-based and legacy queue-based repeated invocations.
- Benchmark fixture proves Porter complete + SWOT pending routes through parent-owned State C framework execution.
- Forbidden assertions guard against status-audit, `exec`, and direct framework-command regressions.

## Tests Run

- `scripts/pack.sh refresh`
- `./scripts/skill-deps.sh --broken`
- `./scripts/skill-versions.sh --missing`
- `./scripts/skill-next-step-routing.sh --missing`
- `pnpm --dir tests bench:coverage`
- `pnpm --dir tests exec vitest run layer1/competitive-analysis-routing.test.ts layer1/bench-setups.test.ts`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `npm run skillpacks:build`
- `npm run skillpacks:verify`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-mirror-parity-audit.sh`
- `git diff --check`

## Skipped Tests

- `npx skillpacks refresh` did not run successfully in this source checkout because the local workspace shim is absent (`sh: gskp: command not found`). The documented no-install fallback `scripts/pack.sh refresh` was run and passed.

## Adversarial Review

- Checked that the guard lives in state resolution, before cold-start/state-E work.
- Checked that the skill text does not document direct path-shaped framework invocations.
- Checked that generated mirrors contain the same `v0.21` guard.
- Tightened benchmark forbidden assertions so compliant "do not route to exec" wording does not fail the fixture.

## Residual Risk

- This is a contract and benchmark-fixture change; it does not execute the live research workflow end to end with a real agent-produced findings page.

## Rollback Note

Revert the `v0.21` skill/changelog/archive changes, generated assets, and benchmark fixture updates together. Then rerun `scripts/pack.sh refresh`, Skills Showcase generation, and benchmark coverage validation.

## Next Command

`$ship`
