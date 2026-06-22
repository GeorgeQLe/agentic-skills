# Current Implementation - Fix Alignment-Page Review Routing

## Goal

Fix product-design routing contracts and repair Alignmeant's invalid alignment-page-review prototype state.

## Plan

- [x] Inspect relevant skill contracts, schema, task docs, and repo states.
- [x] Archive current skill versions before contract edits.
- [x] Patch `ux-variations` and `prototype` contracts and changelogs.
- [x] Repair Alignmeant active artifacts with archive preservation.
- [x] Run requested verification gates and targeted routing checks.
- [ ] Commit and push intended tracked changes in both repos.

## Acceptance Criteria

- `$ux-variations` default mode routes to `$ui-interview [specific-ux-variation]`, not pre-UI prototype buildout.
- `$prototype` rejects build-plan items that only name UX variation IDs without UI experiment/review linkage.
- Alignmeant active state has no prototype build-plan or prototype hub routing for alignment-page-review.
- Invalid Alignmeant prototypes remain preserved under archive only.
- The next active route is `$ui-interview uxv-alignment-page-review-trust-first-review-page`.

## Review

- Archived and bumped mirrored `ux-variations` contracts to `v0.27`; default progression mode now routes approved branches to `$ui-interview [specific-ux-variation]` before prototype build-plan synthesis.
- Archived and bumped mirrored `prototype` contracts to `v0.19`; prototype now gates buildable items on `ui_experiment_id` or equivalent UI review linkage.
- Updated the installed Codex `ux-variations` copy under `.codex/skills/ux-variations` after archiving its `v0.26` snapshot.
- Repaired Alignmeant active routing by archiving invalid prototype artifacts under `docs/history/archive/2026-06-22/131528/`, removing active prototype files, and routing next to `$ui-interview uxv-alignment-page-review-trust-first-review-page`.
- Verification passed: targeted `rg` route checks, `find design/alignmeant -name 'ui-*.md'` empty, active `prototypes/` empty, `scripts/skill-archive-audit.sh`, `scripts/skill-mirror-parity-audit.sh`, `npm run skillpacks:build`, and `git diff --check` in both repos.
- Alignmeant alignment audit was run with `node /Users/georgele/projects/tools/agentic-skills/scripts/audit-alignment-pages.mjs --root /Users/georgele/projects/tools/dev/alignmeant`; it still fails on pre-existing project-wide alignment drift in older confirmed pages and one legacy page missing TTS/metadata.

# Current Implementation - Fix `skillpacks uninstall-global` Legacy Cleanup

## Goal

Make `skillpacks uninstall-global` clean up legacy skillpacks-owned global installs without deleting user-defined or foreign managed skills.

## Plan

- [x] Record active task tracking in task docs.
- [x] Patch uninstall ownership and marker checks.
- [x] Add focused lifecycle fixtures for legacy and foreign marker cases.
- [x] Update package changelog.
- [ ] Run verification gates and publish dry run.
- [ ] Publish patch release and verify npm behavior.
- [ ] Commit and push intended tracked changes.

## Acceptance Criteria

- Legacy `global/claude/*` and `global/codex/*` managed installs are removed.
- Current `base/*` and `packs/*` skillpacks-owned installs remain removable.
- Markerless user skills remain.
- Foreign-source markers remain.
- Markers without `managed_by=agentic-skills` remain.

## Review

- Updated `packages/skillpacks/src/cli/lifecycle.mjs` so `uninstall-global` recognizes current `base/*` and `packs/*` sources plus retired `global/*` source roots from this package/repo lineage.
- Tightened managed directory removal to require `.agentic-skills-managed` with `managed_by=agentic-skills`; foreign marker owners now remain even if their `source=` resembles a legacy owned path.
- Extended `packages/skillpacks/test/lifecycle.test.mjs` to remove current and legacy managed installs while preserving markerless local skills, foreign-source markers, and non-agentic marker owners.
- Updated `CHANGELOG.md` under `Unreleased`.
- Verification passed so far: `npm --workspace packages/skillpacks run test:node`, `npm run skillpacks:verify`, and `git diff --check`.
- `./publish.sh --dry-run patch` was attempted before commit and correctly refused to run with tracked working tree changes; the release script requires committing implementation changes before dry-run or real publish.

# Current Implementation - Alignment Feedback YAML Clarification Intake

## Goal

Require agents to classify alignment feedback YAML intent before mutating alignment pages, especially for fresh-session `needs-clarification` / `clarify-before-approval` snippets that are questions, concerns, or premise challenges.

## Plan

- [x] Record the task plan in task docs.
- [x] Patch the canonical alignment-page convention.
- [x] Update Layer 1 regression assertions.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundles.
- [x] Add prevention lesson.
- [x] Run requested verification gates and inspect generated diff.
- [x] Commit and push intended tracked changes.

## Acceptance Criteria

- Existing YAML fields and review lifecycle are preserved.
- Feedback is classified as `answer-only`, `amend-page`, `investigate-before-amend`, `pushback-needed`, or `ask-user-before-amend` before mutation.
- Question-like or ambiguous clarification feedback is answered or pushed back before editing.
- Direct page edits remain allowed for plainly factual clarification or explicit amendment requests.
- Unresolved clarification or negative feedback blocks confirmation and downstream routing.

## Review

- Updated `docs/alignment-page-convention.md` to add `Feedback intake before mutation`, requiring `answer-only`, `amend-page`, `investigate-before-amend`, `pushback-needed`, or `ask-user-before-amend` classification before artifact edits.
- Tightened section-feedback YAML, pre-approval stop, and after-approval handling language so `clarify-before-approval` means resolve clarification before approval, not silently patch HTML.
- Regenerated 304 generated `ALIGNMENT-PAGE.md` bundles from the canonical source; no `SKILL.md` versions were changed.
- Added Layer 1 regression coverage for feedback-intake classification and updated approval-handling assertions.
- Added a prevention lesson for question-like alignment YAML.
- Verification passed: `node scripts/upgrade-alignment-page.mjs --check`, `pnpm --dir tests exec vitest run layer1/alignment-gates.test.ts layer1/upgrade-alignment-page-bespoke.test.ts` (51/51), `node scripts/audit-alignment-pages.mjs`, and `git diff --check`.
- The requested `node --test tests/layer1/*.test.ts` commands were attempted but are not the correct harness for these Vitest files; both failed before assertions with Vitest runner initialization errors, then passed under the repo Vitest runner.

# Current Implementation - Skillpacks Refresh Dry-Run UX

## Goal

Fix `skillpacks refresh` reload guidance and `refresh --all --dry-run` planning output.

## Plan

- [x] Inspect lifecycle implementation and tests for refresh/install/remove behavior.
- [x] Record the task plan in task docs.
- [x] Implement change-count refresh behavior and dry-run planner summary.
- [x] Add/adjust lifecycle tests and changelog entry.
- [x] Run focused and package verification, then review diff.
- [ ] Commit and push intended tracked changes.

## Acceptance Criteria

- No-op `refresh` exits 0 without reload guidance or false `.agents/project.json` update noise.
- Changing `refresh` still prints reload guidance for stale updates and managed orphan removals.
- `refresh --all` repeats failed project paths and emitted error messages in the final summary.
- `refresh --all --dry-run` reports proposed install/update/remove counts, affected skills/targets, failures, unmanaged skips, and `Safe to run: yes/no`.
- Failed dry-run project config returns nonzero with `Safe to run: no`.

## Review

- Updated `packages/skillpacks/src/cli/lifecycle.mjs` so `refresh` uses direct expected-root sync plus orphan prune counts instead of re-running install helpers that rewrite/log config on no-ops.
- Added no-op config-write guards for pack/skill config helpers so unchanged `.agents/project.json` content is neither rewritten nor logged.
- Added a refresh-specific `refresh --all --dry-run` planner that reports proposed installs, updates, removals, skipped unmanaged roots, per-project counts, aggregate affected targets, failures, `Safe to run: yes/no`, and `skillpacks refresh --all` when safe.
- Preserved `refresh --dry-run` without `--all` rejection.
- Added a final failure-detail section for non-dry-run `refresh --all` so project failures and emitted error messages are visible after long output.
- Updated package changelog and regenerated `packages/skillpacks/dist/skillpacks-manifest.json`.
- Verification passed: `node --test packages/skillpacks/test/lifecycle.test.mjs` (46/46), `npm --workspace packages/skillpacks run verify:package`, and `git diff --check`.

# Previous Implementation - Prepare skillpacks 0.1.10 Publish

## Goal

Prepare the consolidate-prototypes/graduation release boundary for the next public `skillpacks` / `@glexcorp/gskp` publish without running the real publish command.

## Plan

- [x] Inspect release state, package version, generated artifacts, and changed skill contracts.
- [x] Fix publish-blocking contract/version inconsistencies found during release prep.
- [x] Archive and bump active skills whose behavior changes before publish.
- [x] Regenerate package and Skills Showcase generated artifacts from the staged skill boundary.
- [x] Add package changelog and task review records for the pending `0.1.10` release.
- [x] Run release gates without publishing.
- [x] Run dry-run publish check without publishing.
- [ ] Commit and push the publish-prep source state so the real `./publish.sh patch` can run from a clean tree.

## Acceptance Criteria

- Active product-design contracts are internally consistent: `consolidate-prototypes` writes AFPS graduation and `spec-interview` gates on it.
- Changed active skills have archive snapshots and changelog entries.
- Generated package manifest and Skills Showcase data reflect the corrected active versions.
- `CHANGELOG.md` has a pending `0.1.10` release entry.
- The real publish command is left for the user and can run from a clean committed tree.

## Review

- Publish-prep found and fixed a release-blocking inconsistency: active `consolidate-prototypes` v0.16 still said not to write AFPS graduation while its changelog and design-tree convention said graduation was required.
- Archived current `v0.16` snapshots and bumped mirrored `consolidate-prototypes` and `spec-interview` skills to `v0.17`.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` and Skills Showcase generated data from the staged skill boundary.
- Updated `packages/skillpacks/test/lifecycle.test.mjs` so the base-skill refresh test reads the current `codebase-status` version from the source snapshot instead of pinning a stale literal.
- Verification passed: `npm --workspace packages/skillpacks run test:node` (112/112), `npm run skillpacks:verify`, `pnpm --dir apps/skills-showcase validate:data`, `node scripts/skill-convention-bundle-audit.mjs`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-mirror-parity-audit.sh --verbose`, `scripts/base-skill-version-parity-audit.sh`, and `git diff --check`.
- Dry-run publish check passed: `./publish.sh --dry-run patch` staged `skillpacks@0.1.10` and `@glexcorp/gskp@0.1.10`, completed both dry-run publishes, and restored source package state to `0.1.9`.
- Dry-run note: npm CLI emitted `Cannot read properties of null (reading 'matches')` during `npm version`, but `publish.sh` detected that `0.1.10` was written and continued successfully.

# Current Implementation - Rename Consolidation Skill And Add AFPS Graduation

## Goal

Rename `consolidate-variations` to `consolidate-prototypes` as the primary product-design consolidation skill and add an AFPS graduation artifact that closes research/prototyping before post-prototype cleanup and production spec work.

## Plan

- [x] Inspect active consolidation, research-roadmap, spec-interview, routing, and generated catalog contracts.
- [x] Archive and rename mirrored primary consolidation skills to `consolidate-prototypes`.
- [x] Add deprecated `consolidate-variations` compatibility aliases for Claude and Codex.
- [x] Add AFPS graduation output requirements to `consolidate-prototypes`.
- [x] Make `research-roadmap --post-prototype` graduation-aware and keep cleanup narrowly scoped.
- [x] Update `spec-interview` gates to accept graduation readiness while preserving prototype and cleanup blockers.
- [x] Update active route docs, design-tree convention/schema, UAT handoffs, maps, and generated bundles.
- [x] Regenerate Skills Showcase assets and the skillpacks manifest.
- [x] Run focused validation and record the shipping manifest.

## Acceptance Criteria

- Active product-design routes prefer `$consolidate-prototypes` or `/consolidate-prototypes`.
- `consolidate-variations` remains only as a deprecated alias plus historical/benchmark references.
- AFPS graduation outputs are documented under `design/`.
- Post-prototype cleanup reads graduation when present and avoids broad non-blocking research recommendations.
- `spec-interview` still requires the consolidated prototype and a clean blocking post-prototype queue.

## Review

- Primary mirrors now live at `packs/product-design/{claude,codex}/consolidate-prototypes/` with active version `v0.16`; `consolidate-variations` is a small deprecated alias.
- Graduation-aware handoff sequence is now: `$prototype` -> `$uat --variant-evaluation` -> `$consolidate-prototypes` -> `$research-roadmap --post-prototype` -> `$spec-interview` -> `$roadmap`/`$exec`.
- Verification passed: active-reference scan, generated-data validation, design-tree bundle check, convention bundle audit, alignment/interrogation audits, strict archive audit, mirror parity, base parity, focused Vitest 1485/1485, `npm run skillpacks:verify`, and `git diff --check`.
- Deploy skipped: no production deploy requested; this change updates skill/source catalogs and generated package metadata only.

## Next Work

Run the next discovery or maintenance phase when needed; there is no blocking follow-up for this rename.

**Recommended next command:** `$brainstorm`

# Previous Implementation - Clean Up 0.1.9 Publish Blockers

## Goal

Prepare the repo for a clean `skillpacks` / `@glexcorp/gskp` `0.1.9` publish by fixing release metadata, recording already-verified release-readiness evidence, and rerunning the exact release gates before any publish.

## Plan

- [x] Inspect current release metadata, task tracking, package version state, and release runbook.
- [x] Add the `0.1.9` package changelog entry and correct the stale `0.1.8` publication wording.
- [x] Record release-readiness status and the remaining npm-auth human action in task tracking.
- [x] Run the release gates in order: package tests, package verify, convention bundle audit, alignment audit, interrogation audit, and npm registry checks.
- [x] Check npm auth and skip `./publish.sh --dry-run patch` because `npm whoami --registry https://registry.npmjs.org/` currently fails with npm `E401`.
- [x] Commit and push metadata cleanup before any real publish attempt.

## Acceptance Criteria

- `CHANGELOG.md` documents `0.1.9` release contents and pre-publish verification status.
- `CHANGELOG.md` no longer says `0.1.8` is unpublished.
- Active skill version hygiene is recorded as passing: no missing `version:`, no bumped active skill missing archive/changelog, and no package-boundary failure after clean rebuild.
- The remaining human action is clear: run `npm login --registry https://registry.npmjs.org/` as `glexcorp` or an explicitly authorized publisher.
- No runtime code changes are made unless a deterministic verification failure reproduces from a clean build.

## Review

- Added the `0.1.9` package changelog entry covering post-`0.1.8` convention, bundle, publish-recovery, Pattern A handoff, benchmark/self-improvement, and bundled-snapshot changes.
- Corrected the `0.1.8` changelog status to published for both packages.
- Release-readiness evidence from the prior audit is preserved here: active skill version hygiene passed, no bumped active skill was missing an archive/changelog entry, and the earlier package-boundary failure was stale `packages/skillpacks/build` state that passed after a clean rebuild.
- Verification passed: `npm --workspace packages/skillpacks run test:node` (112/112), `npm run skillpacks:verify` (385 skills, 41 packs, package boundary passed), `node scripts/skill-convention-bundle-audit.mjs` (385 active skills, 368 tracked bundles), `node scripts/audit-alignment-pages.mjs` (53 active pages), and `node scripts/audit-interrogation-pages.mjs` (0 active pages).
- npm registry checks passed: `skillpacks` latest is `0.1.8`, `@glexcorp/gskp` latest is `0.1.8`, and both `skillpacks@0.1.9` and `@glexcorp/gskp@0.1.9` return npm `E404`.
- Dry-run publish was not run because `npm whoami --registry https://registry.npmjs.org/` returns npm `E401 Unauthorized`.
- Committed and pushed metadata cleanup to `master` as `e072d0f7` (`Document skillpacks 0.1.9 publish readiness`).
- Follow-up npm cache ownership verification found `/Users/georgele/.npm` owned by `georgele:staff` with no ownership drift; no repair was run.
- Follow-up cache/package verification passed: `npm cache verify` and `npm pack ./packages/skillpacks/build --dry-run --json --silent`.
- Follow-up npm auth check still fails with npm `E401 Unauthorized`, so the remaining blocker is registry authentication, not cache ownership.
- User completed the npm publish. Post-publish verification confirms `skillpacks@0.1.9` and `@glexcorp/gskp@0.1.9` are both published as latest with package-version parity.
- Published-package smoke checks passed for `@glexcorp/gskp@0.1.9` via `npx @glexcorp/gskp@0.1.9 list` and for `skillpacks@0.1.9` via clean temp install and `./node_modules/.bin/skillpacks list`.
- Source release state is now updated to `0.1.9` in `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

# Previous Implementation - Clarify Chunked Skill Progress

## Goal

Make product-design chunked self-routing stops visibly explain progress and continuation, while fixing the active Codex `state-model` path contract to match the canonical pack source layout.

## Plan

- [x] Update the canonical design-tree loop convention with a required Progress Handoff Block for chunked setup, per-unit, and assemble stops.
- [x] Regenerate `DESIGN-TREE-LOOP.md` bundles from the convention.
- [x] Archive and bump mirrored `state-model` skills from `v0.3` to `v0.4`; fix Codex malformed paths and add explicit progress-handoff requirements.
- [x] Archive and bump mirrored `ux-variations` skills from `v0.23` to `v0.24`; add explicit progress-handoff requirements.
- [x] Add focused Layer 1 coverage for malformed Codex `state-model` paths and missing chunked progress copy.
- [x] Run malformed-path, progress-handoff, convention, and focused test checks; fix any failures.
- [x] Record review notes, commit, and push intended changes on `master`.

## Acceptance Criteria

- Active Codex and Claude pack skills require a user-facing Progress Handoff Block at every chunked stop.
- The handoff copy explains completed count, durable cursor, completed/current phase, next phase, why the same command is repeated, fresh-session guidance, and exact next command.
- Codex `state-model` active paths use `design/{slug}/_working/state-model-{topic}-brief.md`, `design/{slug}/state-model-{topic}/{framework}.md`, and `alignment/state-model-{topic}.html`.
- Generated `DESIGN-TREE-LOOP.md` bundles are in sync with `docs/design-tree-loop-convention.md`.
- Regression coverage fails on the malformed `$state-model` paths and missing progress-handoff language.

## Review

- Added a required Progress Handoff Block to `docs/design-tree-loop-convention.md`; regenerated all `DESIGN-TREE-LOOP.md` bundles so every design-tree skill receives the convention update.
- Archived and bumped mirrored `state-model` skills to `v0.4`; Codex path literals now use slash-delimited active paths for the context brief, framework intermediates, and alignment page.
- Archived and bumped mirrored `ux-variations` skills to `v0.24`; chunked setup, variation, and assemble stops now require the explicit progress block and repeated-command explanation.
- Added Layer 1 regression coverage in `tests/layer1/product-design-flow-tree.test.ts` for active `state-model` paths and progress handoff copy.
- Regenerated Skills Showcase generated data and package staging metadata required by the skill version changes.
- Verification passed: active malformed-path guard with archive exclusion; progress-handoff guard; `node scripts/upgrade-design-tree-loop.mjs --check`; `node scripts/skill-convention-bundle-audit.mjs`; corrected focused Vitest command (`pnpm --dir tests exec vitest run layer1/product-design-flow-tree.test.ts layer1/skill-alignment-routing-audit.test.ts layer1/frontmatter.test.ts`) with 1105 passing tests; `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`; `npm run skillpacks:build`; `npm run skillpacks:verify`; `git diff --check`; `scripts/skill-archive-audit.sh --strict`; `scripts/skill-mirror-parity-audit.sh --verbose`; `scripts/base-skill-version-parity-audit.sh`.
- The original malformed-path guard over all `packs/product-design` still reports historical archive hits, including the newly archived Codex `state-model` v0.3 snapshot. Active-source validation uses `--glob '!**/archive/**'`, matching the archive-retention assumption.

# Latest Implementation - Skills Library + Browse Revamp Complete

## Status

Shipped 2026-06-21 (commits `a793c76c`, `8aad0695`, `200eba13`). No active phase selected.

## Review

- Replaced the weak Stage-1 `.select-secondary` deck-pill list with a two-audience
  browse surface: a dedicated SSG `/library` route (Skills + Decks tabs, live
  search/Type/Platform/Pack filtering, card-grid tiles → `/card/[id]` modal, deck
  cards → `/deck/<slug>` builder hard-load) and an inline `BrowseSection` on `/`
  (shared `DeckCard`s + "Browse the full library →"). `Library` added to nav.
- Contract preserved: deck mount-once morph, 5 legacy 308 redirects, and the
  staged-journey controller/`BuildStage`/`__landing` bridge are untouched.
- Verified: `tsc` clean, Vitest 159/159, `next build` OK (`/library` prerendered
  static, 196 crawlable `/card` anchors), Playwright 33/33 on the new + locked
  specs; deck-table-shell 18/18 real tests green (2 dev-only debug-driver tests
  can't run under a prod build). See `tasks/history.md` for the full record.

## Next Work

Discover the next concrete product, workflow, documentation, or package-maintenance phase, or explicitly park the project.

**Recommended next command:** `$brainstorm`

# Prior Research - Managed Skill Library SaaS Prompt

## Status

Research and prompt drafting complete.

## Plan

- [x] Capture prompt history and local package context.
- [x] Research current competitor and adjacent product surfaces.
- [x] Draft the separate-repo `$idea-scope-brief` prompt.
- [x] Verify source links and diff hygiene.
- [x] Record review notes, commit, and push intended artifacts.

## Review

- Read the active `idea-scope-brief` skill contract and used it as the target prompt format, while keeping the actual deliverable separate from a canonical idea-brief run.
- Confirmed local `skillpacks` context from `README.md`, `packages/skillpacks/package.json`, and `docs/skillpacks-npm-distribution.md`.
- Researched skills.sh public positioning, docs, CLI, API, audit page, and official-skills directory.
- Researched adjacent Claude Skills, Agent Skills standard, OpenAI GPT/agent surfaces, and recent agent-skill ecosystem/security papers.
- Wrote the reusable prompt at `research/managed-skill-library-saas-prompt.md`.
- Verified the prompt distinguishes sourced facts from hypotheses and preserves the core gap question: managed/private/white-label SaaS versus public directory/CLI package.

## Next Work

No immediate implementation work remains for this prompt-preparation task.

# Previous Implementation - Landing Redesign Complete

## Status

No active implementation phase is currently selected.

## Review

- Landing redesign (staged journey Select → Open → Build + light/dark theme) for
  `apps/skills-showcase` was implemented across 6 phases and shipped on 2026-06-21
  (commits `07ee9941`..`ebca5806`). See `tasks/history.md` for the full record.
- The deck-routing morph/mount-id contract is preserved — full
  `e2e/deck-table-shell.spec.ts` suite passes via the new `revealTable()` helper.
- Verified: `tsc` clean, Vitest 133/133, Playwright 45/45, `next build` OK, plus
  light/dark screenshot QA.
- Unified Experience Phases 1–7 remain complete (archived under `tasks/phases/`).
- `tasks/manual-todo.md` contains only deferred production newsletter setup tasks
  from Phase 38; they do not block current development.
- `tasks/recurring-todo.md` has 2 advisory items, but advisory queues are not
  selected by `$exec`.

## Next Work

Discover the next concrete product, workflow, documentation, or package-maintenance phase, or explicitly park the project.

**Recommended next command:** `$brainstorm`
