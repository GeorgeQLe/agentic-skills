# Current Task State

## Current Implementation - Split Showcase And Benchmarking Into Public Repos

Project: `agentic-skills`.

### Execution Profile

- Parallel mode: serial edits, parallel read-only inspection where useful.
- Reason: repository boundary changes touch package manifests, generated export artifacts, shipping contracts, docs, and history-preserving split repos. Integration must stay linear on the primary branch.
- Safety boundary: preserve all existing skill/package source history; do not create GitHub Actions; do not deploy production surfaces during the migration.

### Plan

- [x] Add a stable committed export contract under `exports/skills-catalog/v1/` with catalog, proof, manifest, generation, and validation commands.
- [x] Remove the Skills Showcase app, static mirror assets, and benchmark-results matrix from the `agentic-skills` workspace and package boundary.
- [x] Remove benchmark harness/runtime, benchmark reports, and benchmark-owned validation/report scripts from `agentic-skills`; keep only canonical skills/package source and export validation.
- [x] Update shipping, skill-development, deploy, package-boundary, and reference docs so `SKILL.md` / `PACK.md` changes require export validation, not Showcase data regeneration or Next.js builds.
- [x] Create `agentic-skills-showcase` with preserved history for the app/specs/docs and rewrite its import scripts to consume `agentic-skills` exports by `SKILLS_REPO_URL` and `SKILLS_REPO_REF`.
- [x] Create `agentic-skills-benchmarks` with preserved history for benchmark harness/runtime/reports and rewrite its scripts to consume `agentic-skills` exports by `SKILLS_REPO_URL` and `SKILLS_REPO_REF`.
- [x] Run focused root, showcase, and benchmark verification; document results, commit, and push intended changes.

### Acceptance Criteria

- `agentic-skills` owns `exports/skills-catalog/v1/catalog.json`, `proof.json`, and `manifest.json` with `schema_version`, `source_commit`, `generated_at`, source fingerprint/provenance, skills, packs, and package manifest summary.
- Normal skill/package shipping validates `exports/skills-catalog/v1/**` and no longer requires `apps/skills-showcase/**`, `docs/skills-showcase/**`, `docs/benchmark-results-matrix.md`, `tests/harness/**`, `tests/layer4/**`, or `tests/bench.ts`.
- `agentic-skills-showcase` can import pinned exports from `SKILLS_REPO_URL` / `SKILLS_REPO_REF`, validate data, and build the Next app without reading the source checkout internals.
- `agentic-skills-benchmarks` can import pinned exports from `SKILLS_REPO_URL` / `SKILLS_REPO_REF`, resolve benchmark targets from the exported catalog, run focused harness tests, and write reports inside the benchmark repo.
- The two new repos preserve relevant git history and are pushed as public repositories when GitHub access allows it.

### Test Plan

- `node scripts/generate-skills-catalog-export.mjs`
- `scripts/validate-skills-catalog-export.sh`
- `npm --workspace skillpacks run build:check`
- `pnpm --dir tests test:layer1`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- In `agentic-skills-showcase`: import/sync command, data validation, `pnpm build`, unit tests, and current Playwright smoke tests as available.
- In `agentic-skills-benchmarks`: import/sync command, focused benchmark harness tests, and a smoke report write confined to the benchmark repo as available.

### Results

- Root `agentic-skills` now owns `exports/skills-catalog/v1/{catalog.json,proof.json,manifest.json}` with 411 active skill entries, 42 packs, source fingerprint metadata, package manifest summary, proof artifacts, and validation script metadata.
- Removed the in-repo Skills Showcase app, generated docs mirror, benchmark matrix, benchmark harness/runtime/reports, benchmark-specific docs/specs, and Vercel ignore scripts from the root repo boundary.
- Updated shipping, skill-dev, benchmark, session-triage, report-website, package-boundary, and reference docs so normal skill/package shipping runs export/package validation instead of Showcase generation or Next.js builds.
- Split repos were prepared at `/private/tmp/agentic-skills-showcase` and `/private/tmp/agentic-skills-benchmarks` with preserved relevant history from git filtering, root-level app/harness layouts, and `SKILLS_REPO_URL` / `SKILLS_REPO_REF` import scripts.
- Verification passed:
  - Root: `scripts/validate-skills-catalog-export.sh`; `npm run skillpacks:verify`; `pnpm --dir tests test:layer1`; `pnpm --dir tests test:layer2`; `scripts/skill-archive-audit.sh --strict`; `scripts/skill-versions.sh --missing`; `node scripts/audit-task-docs.mjs`; active stale-path `rg`; `git diff --check`.
  - Showcase: import from local `agentic-skills` WORKTREE, `scripts/validate-skills-showcase-data.sh`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`.
  - Benchmarks: import from local `agentic-skills` WORKTREE, `scripts/validate-skills-catalog-import.sh`, `pnpm bench:list`, and `pnpm verify -- --skill design-system` with local export env. The first verify attempt hit sandbox `tsx` IPC permissions and passed when rerun outside the sandbox.
- Live both-agent benchmark execution was not run during the split because it would execute real agents; the benchmark repo validation proves catalog resolution, coverage matrix, listing, and focused harness tests against the imported export.

## Next Work

Push the root migration and the two split public repositories.

## Recommended Next Command

`git push`
