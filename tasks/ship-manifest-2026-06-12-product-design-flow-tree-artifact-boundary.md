# Ship Manifest - Product Design Flow-Tree Artifact Boundary

## User goal

Wrap up and ship the current `$ship-end` boundary. The active dirty tree implements a product-design artifact-boundary change: pre-prototype product-design outputs move from `specs/` into `design/`, with a machine-readable flow-tree manifest before prototype and post-prototype spec work.

## Changed files

- `design/flow-tree.schema.json`
- `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`
- `packs/product-design/{codex,claude}/user-flow-map/CHANGELOG.md`
- `packs/product-design/{codex,claude}/user-flow-map/archive/v0.5/SKILL.md`
- `packs/product-design/{codex,claude}/ux-variations/SKILL.md`
- `packs/product-design/{codex,claude}/ux-variations/CHANGELOG.md`
- `packs/product-design/{codex,claude}/ux-variations/archive/v0.18/SKILL.md`
- `packs/product-design/{codex,claude}/ui-interview/SKILL.md`
- `packs/product-design/{codex,claude}/ui-interview/CHANGELOG.md`
- `packs/product-design/{codex,claude}/ui-interview/archive/v0.19/SKILL.md`
- `packs/product-design/{codex,claude}/prototype/SKILL.md`
- `packs/product-design/{codex,claude}/prototype/CHANGELOG.md`
- `packs/product-design/{codex,claude}/prototype/archive/v0.13/SKILL.md`
- `packs/product-design/{codex,claude}/consolidate-variations/SKILL.md`
- `packs/product-design/{codex,claude}/consolidate-variations/CHANGELOG.md`
- `packs/product-design/{codex,claude}/consolidate-variations/archive/v0.12/SKILL.md`
- `packs/product-design/{codex,claude}/spec-interview/SKILL.md`
- `packs/product-design/{codex,claude}/spec-interview/CHANGELOG.md`
- `packs/product-design/{codex,claude}/spec-interview/archive/v0.13/SKILL.md`
- `tests/layer1/product-design-flow-tree.test.ts`
- `apps/skills-showcase/public/assets/skills-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `docs/benchmark-results-matrix.md`
- `prompts/ship-end/skill-prompt-20260612-213808-ship-end.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-12-product-design-flow-tree-artifact-boundary.md`

## Per-file purpose

- `design/flow-tree.schema.json`: defines the product-design flow-tree manifest contract, including branch IDs, statuses, UI reviews, decisions, product-path mode, and route ordering.
- Product-design active `SKILL.md` files: route pre-prototype flow maps, variation plans, UI branch packets, prototype reads, consolidation outputs, and final spec handoff through `design/`, `prototypes/`, and post-prototype `specs/` boundaries.
- Product-design changelogs and archives: preserve previous active contracts and document versioned behavior changes.
- `tests/layer1/product-design-flow-tree.test.ts`: locks the design/spec/research boundary and route parity into executable regression coverage.
- Skills Showcase generated assets and benchmark matrix: refresh public generated data for changed active skill versions/content and validation evidence.
- Prompt/task/history/manifest files: record the visible shipping invocation, plan, completed review notes, history, and quality-gate evidence.

## User-goal mapping

- The user invoked `$ship-end`, so the session needed a clean validation, documentation, commit, and push.
- The dirty source boundary already represented a coherent product-design workflow change. Shipping it required completing validation, task evidence, generated showcase data, and quality-gate documentation rather than leaving a dirty tree.
- The new `design/` manifest gives downstream agents a clear pre-prototype artifact home and prevents ordinary UX branch state from leaking into product-path research manifests or finalized implementation specs.

## Tests run

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` — passed, 1 file / 5 tests.
- `pnpm --dir tests exec vitest run --project layer1 layer1/codex-interview-cadence.test.ts layer1/product-path-manifest.test.ts` — passed after fixing provenance wording, 2 files / 25 tests.
- `pnpm --dir tests exec vitest run --project layer1` — passed, 59 files / 2234 tests.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` — first runs regenerated stale assets after skill/task/history changes; final run passed with generated data fresh.
- `pnpm --dir apps/skills-showcase test` — passed, 13 files / 136 tests.
- `pnpm --dir apps/skills-showcase build` — passed; Next.js compiled and generated 16 static pages plus dynamic routes.
- `bash scripts/skill-archive-audit.sh --strict` — passed, 383 skills checked.
- `/opt/homebrew/bin/bash scripts/skill-versions.sh --missing` — passed, all 464 skills have versions.
- `/opt/homebrew/bin/bash scripts/skill-deps.sh --broken` — passed, no broken references.
- `/opt/homebrew/bin/bash scripts/skill-next-step-routing.sh --missing` — passed, all 155 mutation-capable skills have next-step routing.
- `bash scripts/skill-mirror-parity-audit.sh` — passed, 155 mirrored pairs checked.
- `git diff --check` — passed.

## Skipped tests

- No browser/UI smoke was run because the app changes are generated data refreshes, not interactive component or route behavior changes. The app test suite and production build cover that the refreshed data still loads into the Next.js app.
- No live deploy was run from ship-end because production deployment requires explicit confirmation, and the remaining deploy-relevant follow-up is a Vercel project setting update for the ignored-build command.

## Adversarial review

Method: changed-file self-review plus targeted regression scans and full layer1 suite.

Findings:

- Full layer1 initially failed because the `ui-interview` rewrite dropped exact requirements-only provenance wording required by `codex-interview-cadence.test.ts`. Fixed mirrored `ui-interview` contracts to keep the manifest-gate phrase and reran the failing tests and full layer1 successfully.
- The product-path terminology guard was checked by `product-path-manifest.test.ts`; the active UX variation contracts preserve the distinction between product paths and git branches.
- The source review found that `prototype` and `consolidate-variations` are part of the same coherent boundary, because they consume design-phase artifacts before final specs. Their versions, archives, and changelogs are included.

Accepted residual concerns: none from the review lane.

## Residual risk

- The new manifest is a contract schema only; no runtime writer validates actual generated `design/flow-tree-*.yaml` files yet. The risk is future skill executions producing malformed manifests. The layer1 contract reduces wording drift, but a future executor should add fixture-level validation when real manifest examples are produced.
- Vercel ignored-build project settings still need to be configured manually. Until that is done in Vercel, deploy noise can still happen even though the repo script and policy are committed.

## Rollback note

Revert the shipping commit to restore the previous product-design contract versions and generated showcase data. If only the generated showcase data is suspect, rerun `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` after reverting or amending the source skill changes.

## Next command

Configure the Vercel Ignored Build Step to `scripts/vercel-ignore-build.sh` in the Skills Showcase project settings, then run a lightweight deploy/skip smoke from the Vercel dashboard or project integration.
