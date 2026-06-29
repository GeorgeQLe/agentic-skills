# Ship Manifest — Benchmarks catalog pin determinism (2026-06-29)

## Scope

Cross-repo follow-up to the three-repo split. The split double-check found one
negative: in `agentic-skills-benchmarks`, a clean-checkout `pnpm verify` exited 1
on its first run (self-healing on the second) because `catalog:check` re-imported
the catalog from the moving `master` branch, so the committed snapshot drifted
stale as root master advanced.

The fix lives entirely in the `agentic-skills-benchmarks` repo. This repo
(`agentic-skills`) was untouched by the fix — its canonical export
(`exports:check`) is already fresh. The only artifact landing here is the
investigate prompt-history file that produced the plan.

## Changes (in `agentic-skills-benchmarks`, commit `dca929b`, pushed to master)

- `scripts/import-skills-catalog.mjs`: pinned the importer's default
  `SKILLS_REPO_REF` to root commit `8b71c638a` via a named `defaultRepoRef`
  const, so the committed snapshot is reproducible. `SKILLS_REPO_REF` env and the
  `WORKTREE` local-dev override still work.
- Re-imported the snapshot against the pin — regenerated
  `data/skills-catalog/v1/{catalog,proof,manifest,import-source}.json`.
- `README.md`: documented that the catalog is pinned for reproducibility and that
  refreshing is a deliberate bump-pin → `pnpm catalog:import` → commit step.

## Artifacts in this repo

- `prompts/investigate/skill-prompt-20260629-140226-verify-repo-split.md`
  (investigate prompt-history capture for the split double-check).

## Verification (brand-new clone of benchmarks master)

- `git status` clean before and after first-run `pnpm verify --skill design-system`
  → **exit 0** (the acceptance criterion; previously red on first run).
- `pnpm catalog:check` → "artifacts are fresh."
- `pnpm bench:coverage` → 208 skills · `pnpm test` → 3 passed.

## Out of scope (flagged, not fixed)

- `tests/bench.ts` `--verify` ignores `--skill`/`--scenario` and always runs the
  full suite, so `verify --skill design-system` is effectively just `verify`.
