# Ship Manifest: PoketoWork Kanban Pack Hibernation

## User Goal

Hibernate all Poketo.work/PoketoWork kanban skill surfaces while the service is being rebuilt. Preserve the source, remove active discovery/install/recommendation surfaces, regenerate active catalogs, validate behavior, then commit and push on `master`.

## Changed Files

- Archived pack source: `archive/hibernated-packs/2026-06-poketowork-rebuild/` contains the moved `business-app-kanban`, `devtool-kanban`, `game-kanban`, and `poketowork-kanban` pack directories plus the hibernation `README.md`.
- Removed active pack source paths by Git rename from `packs/business-app-kanban/`, `packs/devtool-kanban/`, `packs/game-kanban/`, and `packs/poketowork-kanban/`.
- Active command and audit surfaces: `scripts/pack.sh`, `scripts/alignment-skip-list.txt`, `scripts/skill-mirror-parity-audit.sh`.
- Active pack/skill contracts and archives: `global/claude/pack/**`, `global/codex/pack/**`, `global/claude/skills/**`, `global/codex/skills/**`, `packs/exec-loop/{claude,codex}/exec/**`, `packs/business-app/PACK.md`.
- Docs and active inventory/report surfaces: `README.md`, `docs/canonical-workflow-report.md`, `docs/codex-workflow.md`, `docs/operating-modes.md`, `docs/pack-workflow-matrix.md`, `docs/packs.md`, `docs/skill-invocation-types.md`, `docs/skills-reference.md`, `alignment/canonical-workflow-report.html`, `alignment/skills-inventory.html`, `research/devtool-integration-map.md`, `specs/drift-report.md`.
- Generated assets: `docs/skills-showcase/assets/{skills-data.js,github-proof-data.js}`, `apps/skills-showcase/public/assets/{skills-data.js,github-proof-data.js}`.
- Showcase app source: `apps/skills-showcase/src/showcase/catalog.tsx`.
- Benchmark/test coverage: `tests/harness/bench-coverage.ts`, `tests/layer1/bench-setups.test.ts`, `tests/layer4/setups/packs/pack-workflows.setup.ts`.
- Task and prompt artifacts: `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, this manifest, `prompts/exec/skill-prompt-20260604-234318-poketowork-kanban-hibernate.md`, and `prompts/pack/skill-prompt-20260604-234318-poketowork-kanban-hibernate.md`.

## Per-File Purpose

- Archive directory: preserve the full hibernated pack source without leaving it discoverable under active `packs/`.
- `scripts/pack.sh`: make direct pack names, common aliases, and hibernated skill names fail with explicit hibernation guidance.
- Pack/skills/exec contracts: remove guidance that recommended kanban installs or substituted kanban command variants, with version archives/changelogs for active behavior changes.
- Docs, README, alignment pages, and app catalog metadata: stop presenting kanban packs as installable active routes and keep active inventory counts aligned.
- Generated assets and benchmark fixtures: remove hibernated pack/skill entries from public catalog data and active benchmark coverage expectations.
- Task/prompt/history/manifest files: record the visible invocation, implementation plan, validation evidence, and shipping boundary.

## User-Goal Mapping

- Preserved source: the moved archive directory keeps all four pack surfaces recoverable.
- Removed active surfaces: active `packs/`, pack list, generated data, benchmark inventory, and checked-in active inventory no longer expose kanban packs/skills.
- Clear hibernation behavior: install/alias/which checks now report explicit rebuild/reactivation requirements.
- Docs/routing updates: recommendation flows and next-step routing now prefer global/default routes and mention hibernation instead of installable kanban workflows.

## Tests Run

- `find packs -path '*kanban*' -name SKILL.md -not -path '*/archive/*'` passed with no output.
- `scripts/pack.sh list` passed and listed no kanban packs.
- `scripts/pack.sh install business-app-kanban` failed as expected with explicit hibernation text.
- `scripts/pack.sh install dev-kanban` failed as expected with explicit hibernation text.
- `scripts/pack.sh which brainstorm-kanban` failed as expected and reported hibernated archive packs, not an active installable pack.
- `node scripts/generate-skills-showcase-data.mjs` passed: 309 skills, 37 packs.
- `node scripts/generate-skills-showcase-github-data.mjs` passed.
- `bash scripts/validate-skills-showcase-data.sh` passed.
- `bash scripts/skill-archive-audit.sh --strict` passed: 320 skills, 0 violations.
- `bash scripts/skill-mirror-parity-audit.sh` passed: 145 mirrored pairs, 0 failures.
- `bash scripts/skill-pack-routing-audit.sh` passed.
- `pnpm --dir tests bench:coverage` passed: 162 skills.
- `pnpm --dir tests exec vitest run --project layer1 layer1/bench-setups.test.ts` passed: 79 tests.
- `pnpm --dir apps/skills-showcase test src/showcase/catalog.test.tsx` passed: 19 tests.
- `pnpm --dir apps/skills-showcase typecheck` passed.
- `bash -n scripts/pack.sh` passed.
- `bash -n scripts/skill-mirror-parity-audit.sh` passed.
- `git diff --check` passed.
- `rg` checks against generated showcase data, benchmark matrix, active inventory HTML, and catalog source found no hibernated kanban pack or skill entries.

## Skipped Tests

- Full `pnpm --dir tests test` was not run. This change is a pack hibernation and routing/catalog update; the targeted audit, routing, generated-data, benchmark coverage, focused layer1, and app catalog/typecheck commands cover the changed behavior without invoking unrelated live-agent benchmark suites.
- No PoketoWork service smoke test was run because the service is intentionally under rebuild and the active kanban surfaces are hibernated; reactivation criteria require updated smoke tests later.

## Adversarial Review

- Method: changed-file self-review plus targeted `rg` scans for active kanban pack/skill names across docs, generated assets, active inventory HTML, app catalog code, scripts, tests, and active skill contracts.
- Finding fixed: the generated showcase script initially saw deleted pack paths from the index until the pack move was staged; staging the intended rename boundary made generation operate on the active shipping inventory.
- Finding fixed: README, `alignment/skills-inventory.html`, `alignment/canonical-workflow-report.html`, `apps/skills-showcase/src/showcase/catalog.tsx`, `research/devtool-integration-map.md`, and `specs/drift-report.md` still implied active kanban availability or active old paths; those were updated.
- Accepted residual: historical phase docs, old benchmark reports, prompt logs, conversations, and archived skill snapshots still mention kanban workflows as historical records, not active recommendations.

## Residual Risk

- Downstream repositories may still have stale `.agents/project.json` entries or generated local roots for hibernated kanban packs until users refresh or remove them. `scripts/pack.sh remove <kanban-pack>` now supports cleanup guidance.
- Historical docs/specs may still contain old path references by design. The active install/list/which/catalog surfaces and current recommendation docs were validated.

## Rollback Note

Restore the four pack directories from `archive/hibernated-packs/2026-06-poketowork-rebuild/` back to `packs/`, remove hibernation branches from `scripts/pack.sh`, restore kanban recommendation text and benchmark fixtures, then regenerate and validate Skills Showcase assets. Reactivation should only happen after the service/API, auth contract, and smoke tests are stable.

## Next Command

`$pack status`
