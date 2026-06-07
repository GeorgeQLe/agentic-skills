# Ship Manifest — Global Customer Discovery Routing

## User Goal

Execute the next `$exec` step: update global skills that still route users to the retired short-form discovery command so they route to `customer-discovery`, and prepare the next project step.

## Changed Files

- `prompts/exec/skill-prompt-20260606-223937-exec.md`
- `global/codex/idea-scope-brief/SKILL.md`
- `global/codex/idea-scope-brief/CHANGELOG.md`
- `global/codex/idea-scope-brief/archive/v0.11/SKILL.md`
- `global/claude/idea-scope-brief/SKILL.md`
- `global/claude/idea-scope-brief/CHANGELOG.md`
- `global/claude/idea-scope-brief/archive/v0.11/SKILL.md`
- `global/codex/afps-status/SKILL.md`
- `global/codex/afps-status/CHANGELOG.md`
- `global/codex/afps-status/archive/v0.0/SKILL.md`
- `global/claude/afps-status/SKILL.md`
- `global/claude/afps-status/CHANGELOG.md`
- `global/claude/afps-status/archive/v0.0/SKILL.md`
- `global/codex/codebase-status/SKILL.md`
- `global/codex/codebase-status/CHANGELOG.md`
- `global/codex/codebase-status/archive/v0.4/SKILL.md`
- `global/claude/codebase-status/SKILL.md`
- `global/claude/codebase-status/CHANGELOG.md`
- `global/claude/codebase-status/archive/v0.4/SKILL.md`
- `global/codex/skills/SKILL.md`
- `global/codex/skills/CHANGELOG.md`
- `global/codex/skills/archive/v0.4/SKILL.md`
- `global/claude/skills/SKILL.md`
- `global/claude/skills/CHANGELOG.md`
- `global/claude/skills/archive/v0.4/SKILL.md`
- `global/codex/pack/SKILL.md`
- `global/codex/pack/CHANGELOG.md`
- `global/codex/pack/archive/v0.5/SKILL.md`
- `global/claude/pack/SKILL.md`
- `global/claude/pack/CHANGELOG.md`
- `global/claude/pack/archive/v0.5/SKILL.md`
- `tests/layer1/global-customer-discovery-routing.test.ts`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-06-global-customer-discovery-routing.md`

## Per-File Purpose

- Prompt history: capture the visible `$exec` invocation before substantive work.
- Active global `SKILL.md` files: replace retired discovery command routing with `customer-discovery`, rename `afps-status` stage to `discovery-needed`, and preserve `enterprise-icp` / `research/icp.md` only where intentional.
- Active global `CHANGELOG.md` files: record the versioned behavior updates.
- Archive snapshots: preserve the pre-change `SKILL.md` for every bumped global skill mirror.
- `tests/layer1/global-customer-discovery-routing.test.ts`: enforce the global route cleanup and artifact-name exceptions.
- Skills Showcase generated assets: reflect changed global skill descriptions and versions in static showcase data.
- Task docs: mark Phase 4.3 complete, record validation, and prepare Phase 4.4.
- This manifest: record the quality gate and shipping boundary.

## User-Goal Mapping

- The global skills named in the task now route to `customer-discovery` using correct Codex/Claude syntax.
- `afps-status` now exposes `discovery-needed` instead of `icp-needed`.
- Version archives, changelogs, and generated showcase data satisfy the repository skill-versioning and showcase-refresh contracts.
- The new layer1 test prevents the exact global-route regression this step fixed.

## Tests Run

- Targeted active global scan: `rg -n -i "(\$icp|/icp|icp-needed|\bicp\b)" ...` over edited active global `SKILL.md` files; output contained only intentional `enterprise-icp` and `research/icp.md` references.
- `pnpm --dir tests exec vitest run --project layer1 layer1/global-customer-discovery-routing.test.ts layer1/afps-status-global-mirror.test.ts layer1/codebase-status-routing.test.ts layer1/idea-scope-brief-approval-ordering.test.ts` — 4 files passed, 14 tests passed.
- `scripts/skill-versions.sh --missing` — all 405 skills have a version field.
- `scripts/skill-archive-audit.sh --strict` — checked 357 active skills, 0 violations.
- `scripts/skill-deps.sh --broken` — no broken references found.
- `scripts/skill-pack-routing-audit.sh` — no cross-pack recommendation gaps found.
- `node scripts/upgrade-alignment-page.mjs --dry-run` — no bundled alignment drift.
- `node scripts/generate-skills-showcase-data.mjs` — wrote fresh data with 315 skills and 37 packs.
- `node scripts/generate-skills-showcase-github-data.mjs` — wrote fresh proof data.
- `scripts/validate-skills-showcase-data.sh` — after `tasks/history.md` changed, the first rerun detected stale proof data; explicit generator reruns followed by the final validator passed with generated data fresh.
- `pnpm --dir apps/skills-showcase build` — Next.js production build passed.
- `git diff --check` — passed.

## Skipped Tests

- Full `pnpm --dir tests test` was not rerun. `tasks/todo.md` already documents broad layer1 failures unrelated to this route cleanup, and this step added/ran focused route regression coverage plus the repository skill integrity checks that directly exercise the changed contracts.

## Adversarial Review

- Review method: changed-file self-review, targeted legacy-route scan, new regression test, version/archive integrity checks, generated-data freshness check, and Skills Showcase build.
- Finding fixed during review: remaining uppercase concept wording in active global contracts would have tripped the standalone legacy-term acceptance scan; replaced it with customer/customer-discovery wording while preserving `research/icp.md`.
- Residual external finding: `scripts/skill-mirror-parity-audit.sh` still fails on 29 known pack-level heading/section drift items outside the edited global-skill boundary. No reported failure referenced the changed global files.

## Residual Risk

- Some pack-local skills and older docs still mention the retired command. Those are explicit later Phase 4 backlog items and were not edited to avoid scope sprawl.
- The `research/icp.md` artifact name remains intentionally unchanged; users may still see the artifact name until a separate artifact-rename decision exists.

## Rollback Note

Revert the shipping commit. If a partial rollback is needed, restore the archived global `SKILL.md` snapshots for the affected skill mirrors and regenerate Skills Showcase data.

## Next Command

`$exec`
