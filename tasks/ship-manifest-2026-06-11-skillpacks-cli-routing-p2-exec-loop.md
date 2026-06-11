# Ship Manifest — Skillpacks CLI Routing P2 Exec-Loop

## User Goal

Execute the next `$exec` step: remediate the P2 exec-loop install-routing bucket so active skill contracts include npm CLI install alternatives while preserving runner-local `/pack` and `$pack` routes.

## Changed Files

- `packs/exec-loop/claude/exec/SKILL.md`
- `packs/exec-loop/claude/exec/CHANGELOG.md`
- `packs/exec-loop/claude/exec/archive/v0.3/SKILL.md`
- `packs/exec-loop/claude/ship/SKILL.md`
- `packs/exec-loop/claude/ship/CHANGELOG.md`
- `packs/exec-loop/claude/ship/archive/v0.5/SKILL.md`
- `packs/exec-loop/claude/ship-end/SKILL.md`
- `packs/exec-loop/claude/ship-end/CHANGELOG.md`
- `packs/exec-loop/claude/ship-end/archive/v0.2/SKILL.md`
- `packs/exec-loop/codex/ship/SKILL.md`
- `packs/exec-loop/codex/ship/CHANGELOG.md`
- `packs/exec-loop/codex/ship/archive/v0.5/SKILL.md`
- `packs/exec-loop/codex/ship-end/SKILL.md`
- `packs/exec-loop/codex/ship-end/CHANGELOG.md`
- `packs/exec-loop/codex/ship-end/archive/v0.2/SKILL.md`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260611-002710-exec.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p2-exec-loop.md`

## Per-File Purpose

- Active exec-loop `SKILL.md` files: add npm CLI install alternatives to cross-pack install fallback wording and bump versions.
- Exec-loop changelogs and archive snapshots: satisfy skill-versioning requirements for the active skill behavior/metadata changes.
- Skills Showcase generated assets: publish the changed skill versions and refreshed proof fingerprints.
- Prompt history: preserve the exact visible `$exec` invocation and pasted context for this skill invocation.
- Task docs and manifest: record completion, validation evidence, residual debt, and the next executable step.

## User-Goal Mapping

The changed exec-loop contracts are exactly the five targets named by `tasks/todo.md`. Each keeps existing Claude/Codex runner routes and adds the package-consumer `npx skillpacks install ...` alternative required by `docs/skillpacks-install-routing-contract.md`. No later P2/P3 bucket was edited.

## Tests Run

- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt` then target-clean `rg` check: passed; no exec-loop target paths remain; report count is 67.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`: passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`: passed.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`: passed.
- `bash -n scripts/skill-install-routing-audit.sh`: passed.
- `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`: passed with 11 fixture files and 6 expected invalid findings.
- `bash scripts/skill-pack-routing-audit.sh`: passed.
- `bash scripts/skill-versions.sh --missing`: passed, all 439 skills have versions.
- `bash scripts/skill-archive-audit.sh --strict`: passed, 383 skills checked, 0 violations.
- `bash scripts/skill-deps.sh --broken`: passed.
- `node scripts/upgrade-alignment-page.mjs --check`: passed; generated bundles exact.
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts`: passed, 2 tests.
- `scripts/skill-install-routing-audit.sh --active`: expected-red, 67 remaining non-exec-loop findings.
- `pnpm --dir apps/skills-showcase build`: passed.
- `git diff --check`: passed.

## Skipped Tests

- Full layer1 suite was not rerun because the changed behavior is limited to install-route wording in five active skill contracts; the focused layer1 scanner test plus route/integrity audits cover this contract.

## Adversarial Review

Changed-file diff review confirmed the active `SKILL.md` edits are limited to version bumps and additive install-route fallback wording. Targeted `--report` filtering proved no exec-loop target remains in the active install-routing findings, while strict `--active` still surfaces only deferred non-exec-loop debt. The Skills Showcase build produced a mode-specific `apps/skills-showcase/next-env.d.ts` pointer flip; it was restored before shipping because it is unrelated to this boundary.

## Residual Risk

The remaining risk is deferred remediation debt, not this slice: 67 active files in game, guided-walkthrough, monorepo, ORD, product-design, product-testing, remotion, repo-maintenance, research-admin, session-analytics, teardown, youtube-ops, and later P3 sections still need npm-aware wording. The next task plan names a compact eight-file small workflow pack bucket to reduce that debt next.

## Rollback Note

Revert the shipping commit to restore the five active exec-loop skill versions and wording, remove their archive snapshots and changelog entries, and roll back the generated Skills Showcase data/proof refresh.

## Next Command

`$exec`
