# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 37 planned and ready for execution.
**Current phase:** Phase 37 of 38 — Skills Showcase Next.js Preservation Refactor
**Last completed phase:** Phase 36 — Benchmark Output Quality Evaluation

## Current Benchmark: spec-interview

**Goal:** Run `$benchmark-test-skill spec-interview` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `spec-interview` is known and reports its coverage status.
- [x] `pnpm verify --skill spec-interview` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill spec-interview --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-spec-interview-2026-05-12.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Preflight:** `spec-interview` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`.

**Result:** Benchmark completed on 2026-05-12. Verify passed with layer1 in 7.9s across 1,255 tests; layer2 was skipped because no target-specific layer2 tests matched `spec-interview`. Claude had 3/3 infrastructure-blocked runs because the agent runner budget was exceeded. Codex completed 3 evaluated runs and failed 0/3 hard assertions because every run omitted the expected `$plan-phase` recommendation. Codex output quality averaged 85.7%, with no threshold failures and 3 critical failures. Report: `benchmark/test-spec-interview-2026-05-12.md`. Recommended next command: `$session-triage spec-interview benchmark failure`.

## Current Fix: spec-interview Benchmark Route

**Goal:** Fix the stale `spec-interview` benchmark setup so it expects the current `$roadmap` post-spec route instead of `$plan-phase`.

**Result:** Updated `tests/layer4/setups/tier1-workflows.setup.ts` to align the hard assertion and output-quality next-route criterion with the mirrored `spec-interview` contract. Removed the generated-spec body file-reference quality criterion because the skill contract requires creating `specs/benchmark-reporting.md`, not embedding fixture file paths inside the generated spec. Validation passed with focused layer1 benchmark setup tests, benchmark coverage validation, `pnpm --dir tests verify --skill spec-interview`, and a one-run Codex smoke benchmark that passed 1/1 with 100.0% quality and no blocked runs.

## Current Fix: benchmark-test-skill Setup Alignment Gate

**Goal:** Make basic benchmark setup versus skill-contract drift fail during verify/layer1 before paid or slow benchmark runs.

**Result:** Added a layer1 alignment test that reads the mirrored `spec-interview` contracts and proves the custom benchmark setup/rubric expects `$roadmap` rather than stale `$plan-phase`. Updated mirrored `benchmark-test-skill` pack contracts to explain layer1's static harness-contract gate and route setup-alignment failures to targeted benchmark remediation before running `pnpm bench`. Validation passed with focused layer1 benchmark setup tests, `pnpm --dir tests bench:coverage`, skill dependency/version/routing checks, `./install.sh`, `pnpm --dir tests verify --skill benchmark-test-skill`, generated showcase data refresh/validation, and `git diff --check`.

## Phase 37: Skills Showcase Next.js Preservation Refactor

**Goal:** Preserve the existing Skills Showcase website while migrating it from static HTML/CSS/JS under `docs/skills-showcase/` into a minimal Next.js app that can support first-party newsletter capture in the following phase.

**Source:** `specs/first-party-skills-showcase-newsletter-capture.md` and user clarification on 2026-05-11 to split the work into a Next.js refactor phase followed by the Neon capture/admin phase.

**Scope:**
- Create a minimal Next.js app surface for the Skills Showcase without redesigning the product.
- Port existing routes, content hierarchy, Swiss grid/blueprint visual system, shared interactions, and generated data consumption from `docs/skills-showcase/`.
- Preserve the existing public routes: `/`, `/workflows`, `/packs`, `/catalog`, `/inspect`, and `/follow`.
- Keep generated skill/proof data committed and deployable, updating generator/validator output paths only as needed.
- Keep the follow page newsletter UI present but do not add Neon persistence or admin export behavior in this phase.
- Update Vercel/deployment notes to reflect the app-enabled showcase path.

**Non-Goals:**
- Do not add Neon, tRPC, TanStack Query, admin authentication, or subscriber persistence in this phase.
- Do not redesign the showcase or change its positioning.
- Do not replace generated catalog/proof data with runtime database reads.
- Do not create or modify GitHub Actions.

**Acceptance Criteria:**
- [ ] A minimal Next.js Skills Showcase app exists and can render the migrated public routes.
- [ ] Existing showcase content, styling intent, catalog, workflow, pack, inspect, and follow surfaces are preserved.
- [ ] Generated skill/proof data still loads from committed assets and freshness validation remains available.
- [ ] Old static-site deployment assumptions are replaced or clearly superseded by the Next.js app deployment contract.
- [ ] Newsletter capture remains non-persistent until Phase 38.
- [ ] Local app validation, generated-data validation, and whitespace checks pass.
- [ ] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial
**Coordination Notes:** This phase introduces package/dependency and route-structure changes while preserving existing generated-data contracts. Keep it serial to avoid conflicts across app setup, asset paths, shared styles, and deployment docs.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** high
**Review gates:** correctness, tests, docs/API conformance, UX

**Subagent lanes:** none

### Implementation
- [x] Step 37.1: Establish the minimal Next.js app shell without adding persistence dependencies
  - Files: create `apps/skills-showcase/package.json`, create `apps/skills-showcase/next.config.mjs`, create `apps/skills-showcase/tsconfig.json`, create `apps/skills-showcase/app/layout.tsx`, create `apps/skills-showcase/app/globals.css`, create `apps/skills-showcase/src/showcase/routes.ts`
  - Keep dependencies limited to the app framework needed for this phase. Do not add Neon, tRPC, TanStack Query, admin auth, or database packages.
- [x] Step 37.2: Port the existing static routes into the app router while preserving content hierarchy
  - Files: create `apps/skills-showcase/app/page.tsx`, create `apps/skills-showcase/app/workflows/page.tsx`, create `apps/skills-showcase/app/packs/page.tsx`, create `apps/skills-showcase/app/catalog/page.tsx`, create `apps/skills-showcase/app/inspect/page.tsx`, create `apps/skills-showcase/app/follow/page.tsx`, create or modify files under `apps/skills-showcase/src/showcase/`
  - Use the existing route inventory from `docs/skills-showcase/index.html`, `docs/skills-showcase/workflows/index.html`, `docs/skills-showcase/packs/index.html`, `docs/skills-showcase/catalog/index.html`, `docs/skills-showcase/inspect/index.html`, and `docs/skills-showcase/follow/index.html` as the source of truth.
- [x] Step 37.3: Migrate the showcase styling and client interactions conservatively
  - Files: modify `apps/skills-showcase/app/globals.css`, create or modify `apps/skills-showcase/src/showcase/ShowcaseShell.tsx`, create or modify `apps/skills-showcase/src/showcase/catalog.tsx`, create or modify `apps/skills-showcase/src/showcase/workflows.tsx`, create or modify `apps/skills-showcase/src/showcase/newsletter-form.tsx`
  - Preserve the Swiss grid/blueprint visual system from `docs/skills-showcase/styles.css` and the route-specific interactions from `docs/skills-showcase/app.js`, including the non-persistent follow form states.
- [ ] Step 37.4: Preserve generated showcase data as committed static app assets
  - Files: modify `scripts/generate-skills-showcase-data.mjs`, modify `scripts/generate-skills-showcase-github-data.mjs`, modify `scripts/validate-skills-showcase-data.sh`, create `apps/skills-showcase/public/assets/skills-data.js`, create `apps/skills-showcase/public/assets/github-proof-data.js`, modify `docs/skills-reference.md`
  - Either keep `docs/skills-showcase/assets/` as compatibility output or clearly supersede it, but the validator must prove the canonical generated assets are fresh after skill or pack metadata changes.
- [ ] Step 37.5: Update deployment and local operation documentation for the app-enabled showcase
  - Files: modify `README.md`, modify `docs/skills-reference.md`, create or modify `apps/skills-showcase/README.md`
  - Replace or clearly supersede static-site assumptions with the Next.js app path and validation commands. Do not create, modify, or recommend GitHub Actions.
- [ ] Step 37.6: Retire or mark the old static-site surface as superseded only after the app routes and generated assets are validated
  - Files: modify or delete files under `docs/skills-showcase/` only if the replacement app and docs clearly preserve public routes and data freshness; otherwise leave the old static files in place as compatibility evidence for this phase.

### Green
- [ ] Step 37.7: Write regression tests covering migrated route/data behavior
  - Files: create or modify `apps/skills-showcase/src/showcase/*.test.tsx`, create or modify `apps/skills-showcase/src/showcase/*.test.ts`, create or modify test configuration under `apps/skills-showcase/` if needed
  - Cover public route rendering, generated asset loading/parsing, catalog/search/filter behavior, inspect proof rendering, workflow/pack surfaces, and the follow form's non-persistent states.
- [ ] Step 37.8: Run local app validation, generated-data validation, and whitespace checks; perform only concrete cleanup found by validation
  - Files: modify only files implicated by failing validation
  - Run the app's typecheck/build/test command, `scripts/validate-skills-showcase-data.sh`, and `git diff --check`.

### Follow-up Todo

- [ ] Add a Skills Showcase benchmark-results surface after the app routes and generated asset pipeline are stable.
  - Source: `docs/benchmark-results-matrix.md`
  - Files: create or modify a benchmark-results route or section under `apps/skills-showcase/`, and update generated-data validation if the surface consumes generated benchmark metadata.
  - Requirement: distinguish benchmark setup coverage from skills that have already undergone evaluated benchmark runs with persisted test data and grades.
  - Related roadmap: Phase 39, including permission-gated safe GitHub test-repository fixtures for `commit-and-push-by-feature` and `sync`.

### Milestone: Phase 37 Next.js Preservation Refactor
**Acceptance Criteria:**
- [ ] A minimal Next.js Skills Showcase app exists and can render the migrated public routes.
- [ ] Existing showcase content, styling intent, catalog, workflow, pack, inspect, and follow surfaces are preserved.
- [ ] Generated skill/proof data still loads from committed assets and freshness validation remains available.
- [ ] Old static-site deployment assumptions are replaced or clearly superseded by the Next.js app deployment contract.
- [ ] Newsletter capture remains non-persistent until Phase 38.
- [ ] Local app validation, generated-data validation, and whitespace checks pass.
- [ ] No GitHub Actions are created, modified, or recommended.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion**
- Deviations from plan: [fill when phase is done]
- Tech debt / follow-ups: [fill when phase is done]
- Ready for next phase: no

## Review

- 2026-05-11 — Completed `$targeted-skill-builder benchmark-agent-review remediation handoff`. Updated mirrored `benchmark-agent-review` contracts to require a remediation table and definitive next route for every material finding. Updated mirrored `benchmark-test-skill` contracts so deterministic benchmark execution hands off to `benchmark-agent-review` as a separate subjective review/remediation step when needed. Added layer1 contract lint coverage and refreshed the correction lesson.
- 2026-05-11 — Planned Phase 37 from `tasks/roadmap.md` and `specs/first-party-skills-showcase-newsletter-capture.md`. Execution is serial because the app shell, generated data paths, route migration, styling, and deployment documentation share integration points. Test strategy is tests-after because the work is a preservation-focused UI/app migration with design parity checks after the route and asset surface exists.
- 2026-05-11 — Completed `$benchmark-agent-review ship` against `tests/benchmarks/runs/ship-claude-726530ae/` and `tests/benchmarks/runs/ship-codex-b69cb187/`. The review report is `benchmark/review-ship-2026-05-11.md`; median subjective score was 79 with a 74-88 range. Next work is to tighten the `ship` benchmark rubric for retained artifact text, evidence-linked manifest fields, and full manifest-completeness checks.
- 2026-05-11 — Completed Step 37.1. Created the self-contained `apps/skills-showcase` Next.js shell with package scripts, strict TypeScript config, root app layout, baseline globals, and canonical public route metadata. Verified current package versions with `npm view` (`next` 16.2.6, `react` 19.2.6, `typescript` 6.0.3). No persistence, database, auth, GitHub Actions, generated-data, or route-porting behavior was added.

### Ship Manifest — Step 37.1

- **User goal:** Execute the next `$run` step for Phase 37 by establishing the minimal Next.js Skills Showcase app shell without persistence dependencies.
- **Changed files:** `apps/skills-showcase/package.json`, `apps/skills-showcase/next.config.mjs`, `apps/skills-showcase/tsconfig.json`, `apps/skills-showcase/app/layout.tsx`, `apps/skills-showcase/app/globals.css`, `apps/skills-showcase/src/showcase/routes.ts`, `docs/skills-showcase/assets/github-proof-data.js`, `tasks/todo.md`, `tasks/history.md`, modified active specs under `specs/benchmark-custom-coverage.md`, `specs/creator-platform-evidence-schema.md`, `specs/drift-report.md`, `specs/monorepo-execution-controller.md`, `specs/poketo-headless-auth-migration.md`, `specs/project-fleet.md`, `specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`, moved stale specs from `specs/board-flag-kanban-search.md`, `specs/kanban-command-test-coverage.md`, `specs/kanban-multi-user.md`, `specs/kanban-offline-queue-soft-delete.md`, and `specs/kanban-production-test-plan.md` to matching archived copies under `docs/history/archive/2026-05-11/165500/specs/`, and added `docs/history/archive/2026-05-11/165500/specs/poketo-headless-auth-migration.md`.
- **Per-file purpose:** App package/config files define the isolated Next.js shell and validation scripts; layout/global CSS files provide the minimum App Router surface; `routes.ts` records the preserved public route inventory for the next porting step; active spec edits and stale spec moves were pre-existing reconciliation work in the shared tree; generated proof data refreshes the source fingerprint for the current tracked tree; task docs record progress, quality evidence, and next-step planning.
- **User-goal mapping:** Every app file maps directly to the Step 37.1 file list. Spec reconciliation/archive changes were pre-existing coherent tracked work in the shared tree and are included to satisfy the repository's no-dirty-shipping contract without reverting user work. Task doc updates satisfy the repository `$run` tracking and shipping contract.
- **Tests run:** `npm view next version` returned 16.2.6; `npm view react version` returned 19.2.6; `npm view typescript version` returned 6.0.3; `node -e "JSON.parse(...)"` parsed the new `package.json` and `tsconfig.json`; `scripts/validate-skills-showcase-data.sh` initially reported stale generated data after source changes and then passed on rerun after regenerating; `pnpm --dir tests test:layer1 -- bench-setups` passed with 10 files and 1254 tests; `git diff --check` passed before final commit.
- **Skipped tests:** App `typecheck`, `build`, and route rendering were not run because Step 37.1 intentionally creates package metadata without installing dependencies or implementing pages. Full spec-drift/reconciliation tests were not run because the spec edits were already present and the executable risk for Step 37.1 is limited to the new app shell.
- **Adversarial review:** Changed-file self-review checked dependency scope for forbidden persistence packages, confirmed no shared lockfile or root package metadata was changed, verified the public route list matches Phase 37 scope, verified archived spec copies match the deleted HEAD blobs, reran showcase-data validation after source-fingerprint churn, and found/fixed ambiguous plain-bullet step tracking by converting Phase 37 steps to checkboxes.
- **Residual risk:** The app shell has not been installed or compiled yet, so version compatibility and Next-generated type files remain unproven until the later app validation step. The included spec reconciliation/archive changes are documentation-state changes carried from the shared tree and were not re-derived in this `$run`.
- **Rollback note:** Revert the Step 37.1 commit to remove the `apps/skills-showcase` shell and restore Phase 37 task tracking.
- **Next command:** `$run`

- 2026-05-11 — Completed Step 37.2 App Router refactor. Moved ShowcaseHeader + MobilePanel into root layout (rendered once), added per-page `metadata` exports with unique titles, converted ShowcaseHeader to `"use client"` with `usePathname()` replacing the manual `currentPath` prop, switched all imports to the `@/` path alias, and added `viewport` export to root layout. All 6 page files now contain only `<main>` content. Verified: `"use client"` only on ShowcaseHeader, zero `currentPath` prop usage, zero `../../src/` imports, every page exports metadata, no page imports ShowcaseHeader/MobilePanel.
- 2026-05-11 — Added `docs/benchmark-results-matrix.md` as the clean matrix for skills that already have persisted evaluated benchmark data and grades. Added Phase 39 to the roadmap for Skills Showcase benchmark-results visibility and permission-gated disposable GitHub test-repository fixtures for `commit-and-push-by-feature` and `sync`. Added a follow-up todo to surface the matrix on the website after the app route/data pipeline is stable.

- 2026-05-12 — Completed Step 37.3. Ported full CSS from `docs/skills-showcase/styles.css` into `globals.css`. Created 4 client components: `ShowcaseShell.tsx` (menu toggle), `workflows.tsx` (8-workflow selector/animation/preview), `catalog.tsx` (search/filter, pack map, proof rendering, follow proof), `newsletter-form.tsx` (form state machine). Wired all into pages and layout. Added `.gitignore`. Verified: `pnpm typecheck` clean, `pnpm build` produces 6 static routes, dev server renders styled pages.

### Next Step Plan — Step 37.4

- **Scope:** Preserve generated showcase data as committed static app assets. The Next.js app currently has no access to `skills-data.js` or `github-proof-data.js` — the client components read from `window.SKILLS_SHOWCASE_DATA` and `window.SKILLS_SHOWCASE_GITHUB_PROOF_DATA` but no script tags load those files.
- **Files to modify/create:**
  - `apps/skills-showcase/public/assets/skills-data.js` — copy or symlink from `docs/skills-showcase/assets/skills-data.js`
  - `apps/skills-showcase/public/assets/github-proof-data.js` — copy or symlink from `docs/skills-showcase/assets/github-proof-data.js`
  - `scripts/generate-skills-showcase-data.mjs` — update output path to also write to the Next.js app's `public/assets/` directory
  - `scripts/generate-skills-showcase-github-data.mjs` — update output path to also write to the Next.js app's `public/assets/` directory
  - `scripts/validate-skills-showcase-data.sh` — update to validate the app asset path alongside or instead of the old static-site path
  - `apps/skills-showcase/app/layout.tsx` — add `<script>` tags to load the generated data files from `/assets/skills-data.js` and `/assets/github-proof-data.js`
  - `docs/skills-reference.md` — update any references to the generated data asset paths
- **Key decisions:**
  - Generated assets must set `window.SKILLS_SHOWCASE_DATA` and `window.SKILLS_SHOWCASE_GITHUB_PROOF_DATA` before client components mount — use `<Script strategy="beforeInteractive">` or standard `<script>` in the layout
  - Keep `docs/skills-showcase/assets/` as compatibility output for now (Step 37.6 handles retirement)
  - The validator must prove canonical generated assets are fresh after skill/pack metadata changes
- **Execution Profile:** serial, implementation-safe, main agent
- **Test strategy:** tests-after
- **Verification:** Run `node scripts/generate-skills-showcase-data.mjs` and `node scripts/generate-skills-showcase-github-data.mjs`, verify outputs land in `apps/skills-showcase/public/assets/`, run `scripts/validate-skills-showcase-data.sh`, confirm catalog/proof data renders in the dev server
- **Acceptance criteria:** Generated data files load in the Next.js app, catalog populates with skill rows, proof/inspect surfaces show data, validator passes against the app asset path.
- **Ship-one-step handoff:** implement only Step 37.4, validate it, then run `/ship` when done.
