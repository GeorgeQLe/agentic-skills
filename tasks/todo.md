# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 37 planned and ready for execution.
**Current phase:** Phase 37 of 38 — Skills Showcase Next.js Preservation Refactor
**Last completed phase:** Phase 36 — Benchmark Output Quality Evaluation

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
- [ ] Step 37.2: Port the existing static routes into the app router while preserving content hierarchy
  - Files: create `apps/skills-showcase/app/page.tsx`, create `apps/skills-showcase/app/workflows/page.tsx`, create `apps/skills-showcase/app/packs/page.tsx`, create `apps/skills-showcase/app/catalog/page.tsx`, create `apps/skills-showcase/app/inspect/page.tsx`, create `apps/skills-showcase/app/follow/page.tsx`, create or modify files under `apps/skills-showcase/src/showcase/`
  - Use the existing route inventory from `docs/skills-showcase/index.html`, `docs/skills-showcase/workflows/index.html`, `docs/skills-showcase/packs/index.html`, `docs/skills-showcase/catalog/index.html`, `docs/skills-showcase/inspect/index.html`, and `docs/skills-showcase/follow/index.html` as the source of truth.
- [ ] Step 37.3: Migrate the showcase styling and client interactions conservatively
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

### Next Step Plan — Step 37.2

- **Scope:** Port the existing static route surfaces into the Next.js App Router while preserving the current content hierarchy and public route paths.
- **Files expected:** Create `apps/skills-showcase/app/page.tsx`, `apps/skills-showcase/app/workflows/page.tsx`, `apps/skills-showcase/app/packs/page.tsx`, `apps/skills-showcase/app/catalog/page.tsx`, `apps/skills-showcase/app/inspect/page.tsx`, `apps/skills-showcase/app/follow/page.tsx`, and shared presentation/data helpers under `apps/skills-showcase/src/showcase/` as needed.
- **Source of truth:** Read only the existing static route files under `docs/skills-showcase/` plus `styles.css` and `app.js` where needed to preserve route hierarchy. Do not redesign the site and do not add persistence.
- **Verification target:** Run structural checks available without dependency installation, then defer full app build/typecheck until dependencies and migrated surfaces make those commands meaningful.
