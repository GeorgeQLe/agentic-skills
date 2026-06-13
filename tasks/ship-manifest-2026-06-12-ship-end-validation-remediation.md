# Ship Manifest - Ship-End Validation Remediation

## User Goal

Wrap up the current session with `$ship-end`: update task docs, run required validation, and commit/push only if the shipping boundary is safe.

## Ship Status

Ready to ship. The prior generated-root blocker was resolved by commit `20b52116 chore: untrack generated skill install roots`; `git ls-files .codex/skills .claude/skills` now returns no tracked generated local skill-root files.

This manifest now covers the full remaining dirty boundary: generated alignment bundles, skill metadata/contracts, archives/changelogs, validation scripts, layer1 tests, Skills Showcase generated data and catalog surfaces, prompt history, and task/history docs. The boundary is intentionally broad because the dirty tree represents the accumulated validation-remediation work from the current session sequence, and the previous generated-root blocker is gone.

Follow-up `$ship-end` invocation on 2026-06-12 16:12 EDT captured `prompts/ship-end/skill-prompt-20260612-161257-ship-end.md`, reran validation, and confirmed the boundary is safe to commit and push.

## Changed Files

Ship-end validation/remediation touched these intended categories:

- Prompt/task/history/manifest docs:
  - `prompts/ship-end/skill-prompt-20260612-132329-wrap-up.md`
  - `prompts/ship-end/skill-prompt-20260612-140848-ship-end.md`
  - `prompts/ship-end/skill-prompt-20260612-161257-ship-end.md`
  - `tasks/todo.md`
  - `tasks/roadmap.md`
  - `tasks/history.md`
  - `tasks/ship-manifest-2026-06-12-ship-end-validation-remediation.md`
- Validation scripts:
  - `scripts/skill-next-step-routing.sh`
  - `scripts/skill-mirror-parity-audit.sh`
- Active skill contracts, changelogs, and archives:
  - `packs/code-debug/claude/debug/SKILL.md`
  - `packs/code-debug/claude/debug/CHANGELOG.md`
  - `packs/code-debug/claude/debug/archive/v0.1/SKILL.md`
  - `packs/code-debug/codex/debug/SKILL.md`
  - `packs/code-debug/codex/debug/CHANGELOG.md`
  - `packs/code-debug/codex/debug/archive/v0.1/SKILL.md`
  - `packs/game/claude/game-roadmap/SKILL.md`
  - `packs/game/claude/game-roadmap/CHANGELOG.md`
  - `packs/game/claude/game-roadmap/archive/v0.2/SKILL.md`
  - `packs/game/codex/game-roadmap/SKILL.md`
  - `packs/game/codex/game-roadmap/CHANGELOG.md`
  - `packs/game/codex/game-roadmap/archive/v0.2/SKILL.md`
  - `packs/customer-lifecycle/claude/journey-map/SKILL.md`
  - `packs/customer-lifecycle/claude/journey-map/CHANGELOG.md`
  - `packs/customer-lifecycle/claude/journey-map/archive/v0.15/SKILL.md`
  - `packs/customer-lifecycle/codex/journey-map/SKILL.md`
  - `packs/customer-lifecycle/codex/journey-map/CHANGELOG.md`
  - `packs/customer-lifecycle/codex/journey-map/archive/v0.15/SKILL.md`
- Bash portability fix:
  - `packs/project-fleet/claude/skill-inventory/scripts/skill-inventory.sh`
  - `packs/project-fleet/codex/skill-inventory/scripts/skill-inventory.sh`
- Generated Skills Showcase assets:
  - `docs/skills-showcase/assets/skills-data.js`
  - `apps/skills-showcase/public/assets/skills-data.js`
  - `docs/skills-showcase/assets/github-proof-data.js`
  - `apps/skills-showcase/public/assets/github-proof-data.js`
  - `docs/benchmark-results-matrix.md`
- Focused tests/docs/catalog surfaces remediated for current contracts:
  - `apps/skills-showcase/src/showcase/catalog.tsx`
  - `docs/pack-workflow-matrix.md`
  - `docs/skill-next-step-contracts.md`
  - `tests/layer1/alignment-tts-kokoro.test.ts`
  - `tests/layer1/benchmark-results-matrix.test.ts`
  - `tests/layer1/business-discovery-customer-discovery-routing.test.ts`
  - `tests/layer1/codebase-status-routing.test.ts`
  - `tests/layer1/competitive-analysis-routing.test.ts`
  - `tests/layer1/idea-scope-brief-approval-ordering.test.ts`
  - `tests/layer1/init-agentic-skills-contract.test.ts`
  - `tests/layer1/journey-map-alignment.test.ts`
  - `tests/layer1/journey-map-routing.test.ts`
  - `tests/layer1/marketplace-side-handoff.test.ts`
  - `tests/layer1/pack-skill-mirror-parity.test.ts`
  - `tests/layer1/product-path-manifest.test.ts`
  - `tests/layer1/prompt-history-convention.test.ts`
  - `tests/layer1/researchish-skill-lifecycle-audit.test.ts`
  - `tests/layer1/skill-inventory.test.ts`
  - `tests/layer1/skill-reload-language.test.ts`
  - `tests/layer1/skills-showcase-benchmark-demo.test.ts`
  - `tests/layer1/skills-showcase-pack-coverage.test.ts`

This is a summarized category list for the broad ship-end remediation boundary. The exact file set is the staged diff for the final session-wrap-up commit, excluding ignored generated local roots under `.codex/skills/**` and `.claude/skills/**`.

## Per-File Purpose

- Task, history, prompt, and manifest files record the wrap-up state and the blocked ship decision.
- `skill-next-step-routing.sh` now measures active mutation-capable skill contracts without archive noise, generic shipping-contract false positives, or misses for existing numbered/routing idioms.
- `skill-mirror-parity-audit.sh` recognizes current approved metadata and heading drift instead of failing known intentional mirror differences.
- `debug` and `game-roadmap` skill contracts now explicitly route next work after mutation-capable outcomes; archives and changelogs preserve their prior versions.
- `journey-map` active contracts were corrected from stale `business-discovery` routing to `business-research`.
- `skill-inventory.sh` mirrors no longer require Bash 4 associative arrays or `mapfile`, making them compatible with macOS `/bin/bash` 3.2.
- Generated Skills Showcase files reflect current active skill metadata, validation proof, and benchmark matrix expectations.
- Layer1 tests/docs/catalog changes align assertions with the current pack rename, versions, generated-data counts, install wording, routing contracts, and benchmark proof.

## User-Goal Mapping

- `$ship-end` requires validation before done; the full executable and documentation gate now passes.
- `$ship-end` requires a manifest and task/history updates; those are recorded here and in `tasks/todo.md` / `tasks/roadmap.md` / `tasks/history.md`.
- `$ship-end` requires commit/push only when safe; the generated-root hygiene commit makes it safe because generated local skill roots are no longer tracked.

## Tests Run

- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - first pass regenerated assets and reported stale as expected.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - final standalone rerun passed; generated data is fresh.
- `pnpm --dir tests exec vitest run --project layer1` - passed, 58 files / 2229 tests.
- `node scripts/upgrade-alignment-page.mjs --check` - passed; 294 generated bundles exact.
- `node scripts/audit-alignment-pages.mjs` - passed; active pages, TTS include, metadata, viewport, embed prohibition, and index integrity exact.
- `node --check scripts/upgrade-alignment-page.mjs` - passed.
- `pnpm --dir apps/skills-showcase typecheck` - passed.
- `pnpm --dir apps/skills-showcase test` - passed, 13 files / 136 tests.
- `pnpm --dir apps/skills-showcase build` - passed; Next.js production build completed and produced the expected static/dynamic route list.
- `git diff --check` - passed.
- `bash scripts/skill-archive-audit.sh --strict` - passed; 383 skills checked, 0 violations.
- `/opt/homebrew/bin/bash scripts/skill-versions.sh --missing` - passed; all 462 skills have version fields.
- `/opt/homebrew/bin/bash scripts/skill-deps.sh --broken` - passed; no broken references.
- `/opt/homebrew/bin/bash scripts/skill-next-step-routing.sh --missing` - passed; all 155 mutation-capable skills have next-step routing.
- `bash scripts/skill-mirror-parity-audit.sh` - passed; 155 mirrored pairs, 114 approved drift entries, 0 failures.
- `git ls-files .codex/skills .claude/skills` - passed; no tracked generated local skill-root files.
- `git status --short .codex/skills .claude/skills` - passed; no generated local skill-root files staged.

## Skipped Tests

- No package build was run because this boundary changed validation contracts, skill docs, tests, and generated website proof data, not package distribution artifacts.
- Browser smoke was skipped because no frontend runtime interaction changed; Skills Showcase data freshness, typecheck, unit tests, and production build covered the generated website assets.
- Deploy is a post-push step. `tasks/deploy.md` exists, so deploy routing must be checked after the commit is pushed. Production deploy remains out of scope without explicit confirmation.

## Adversarial Review

Equivalent adversarial review was performed through the full layer1 suite, archive/version/dependency audits, routing audit, mirror parity audit, generated-data freshness check, production build, generated-root tracking checks, and full whitespace check.

Findings fixed:

- Stale layer1 assertions for the `business-research` rename.
- Stale generated data and benchmark matrix expectations.
- Bash 4-only logic in `skill-inventory` scripts.
- Next-step routing audit false positives and three real missing routing contracts.
- Mirror parity allowlist gaps for current active mirror differences.

Accepted residual concerns:

- The boundary is broad and crosses docs, generated assets, tests, and skill contracts, but that breadth is the accumulated session remediation and is covered by the full validation gate.
- Deploy may require a separate skill/pack or manual Vercel route after push because this session has not yet confirmed an installed `$deploy` skill.

## Residual Risk

- Implementation risk is moderate because many validation expectations were updated together, but the full layer1 suite, Skills Showcase checks/build, generated-data freshness, and independent shell audits are green.
- Deploy risk remains external: Vercel environment variables and live route checks are manual/contractual follow-ups in `tasks/deploy.md`, not local source validation.

## Rollback Note

Revert the final session-wrap-up commit to roll back this broad remediation boundary. The prior hygiene commit `20b52116` should generally remain because it enforces the generated-root contract. If a narrower rollback is needed, revert the `skill-next-step-routing.sh` changes, the debug/game-roadmap/journey-map version bumps plus archives, the skill-inventory Bash portability change, generated alignment/data assets, and related layer1 expectation updates, then rerun the full validation gate.

## Next Command

After push, check deploy routing with `scripts/pack.sh which deploy`.
