# Ship Manifest — 2026-06-10 — Generated-Bundle Drift Check (Drift Plan Phase 2 Step 4)

## User goal

Execute ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 4 from the approved clear-context plan: add a `--check` mode to `scripts/upgrade-alignment-page.mjs` so a generator-owned skill's stale, hand-edited, or missing `ALIGNMENT-PAGE.md` (or stale SKILL.md stub) fails loudly instead of exiting 0 as a pending-update preview, then `/ship` the boundary.

## Changed files (this session's boundary)

| File | Purpose | User-goal mapping |
| --- | --- | --- |
| `scripts/upgrade-alignment-page.mjs` | `--check` flag (no writes, `[check]` preview prefix), generated-bundle drift pass after the write loop with three named diagnostics, `Generated bundles: N ownable, exact|DRIFT` summary line, drift joins the shared exit-1 only in check mode | Core Step 4 gate |
| `tests/layer1/upgrade-alignment-page-bespoke.test.ts` | `runScript` extended for `--check`; 6 new tests: repo-state `--check` exit 0, hand-edited bundle exit 1, missing bundle exit 1, stale pointer stub exit 1, clean tree + exempt bespoke pair exit 0, stale fixture under plain `--dry-run` exit 0 | Layer1 enforcement of the gate |
| `docs/alignment-page-convention.md` | "Generated-bundle drift check" paragraph outside the generated-marker block | Documentation step |
| `tasks/todo.md` | Step 4 section checked off with review notes; drift plan Phase 2 Step 4 checked; Phase 2 Step 4 review notes added; next-step plan (Step 5) appended this ship | Task tracking + handoff |
| `tasks/history.md`, `tasks/ship-manifest-2026-06-10-generated-bundle-drift-check.md`, `prompts/ship/skill-prompt-20260610-104900-generated-bundle-drift-check.md` | Session record, this manifest, prompt history | Shipping contract |

## Boundary anomaly (included vs. untouched files)

A concurrent session shipping the `env-setup` skill committed and pushed this session's then-uncommitted source changes inside its own grouped commits at 10:41:

- `8534bf21 feat(alignment): add --check generated-bundle drift gate to upgrade script` — contains this session's four source files **plus** foreign `packs/repo-maintenance/*/env-setup/*` skill files and `tests/layer1/env-setup-contract.test.ts`.
- `8e78309b feat(repo-maintenance): add env-setup skill for secret-safe .env scaffolding` — env-setup showcase data, docs, `scripts/alignment-skip-list.txt` (+`env-setup`), bench coverage.

The work itself is correct and verified (see below; the full layer1 run covered the combined tree). The per-feature grouping is mixed, but both commits are already pushed to `origin/master`, so no history rewrite was performed (destructive-history safety rule). This ship's remaining boundary is the task-doc/manifest/prompt-history commit only. No other unrelated tracked changes exist; tree was clean before the doc updates.

## Tests run (executable verification)

- `node --check scripts/upgrade-alignment-page.mjs` — pass.
- `node scripts/upgrade-alignment-page.mjs --check` — exit 0 on the repo; `Generated bundles: 270 ownable, exact` (also `Bespoke allowlist: 7 skills, exact`, `Output paths: 270 bundles, exact`). Re-run after the convention-doc edit to prove no bundle regeneration triggered.
- `node scripts/upgrade-alignment-page.mjs --dry-run` — exit 0, unchanged behavior.
- Focused vitest: `tests/layer1/upgrade-alignment-page-bespoke.test.ts` — 17/17 pass.
- Full layer1 suite: 55 files / 2188 tests / 0 failed (includes the concurrent env-setup test file).
- `git diff --check` — clean.

## Skipped tests

None. Layer2+ suites not run (layer1 is the contract surface for this script, matching Steps 2–3).

## Adversarial review

Self-review of the exact diff (equivalent review justified by small, test-covered surface; consistent with Steps 2–3 ships):

- Write-suppression: `--check` shares the `noWrites` path with `--dry-run`; no `writeFileSync` reachable in check mode.
- Drift pass runs after the write loop and re-reads disk, so write mode always reports `exact` post-write (no false DRIFT after a fix run); `replaceOrInsert` idempotence on its own output is proven by the repo-state `exact` result and the clean-tree fixture test.
- Exemptions are deliberate and documented: bespoke pairs (no expected render; skipped via `bespokeFiles.length`), mixed sibling pairs (already exit-1 via Step 2 diagnostics), skip-listed/out-of-scope skills (Step 3 path check + future Step 6 direct-edit audit).
- `DRIFT` in the summary line under plain `--dry-run` with exit 0 is intentional (pending-update preview) and documented in the convention doc.

## Residual risk

- The `Generated bundles` summary counts ownable mirrors (270), which coincidentally equals the Step 3 bundle count; the numbers are computed independently and can diverge (e.g. skip-listed bundles count for paths but not ownable).
- Mixed commit grouping from the concurrent session (above) — cosmetic git-history concern only; no code risk.

## Rollback note

Revert `8534bf21` partially (the four alignment files) or set no `--check` flag in callers; the flag is additive and default behavior (`--dry-run`/write) is unchanged. Task-doc commit reverts cleanly.

## Next command

/exec
