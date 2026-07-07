# Current Task

## Current Implementation - Active Skill Cut

### Goal

Remove agreed deprecated, superseded, and conflicting surfaces from active discovery while preserving compatibility aliases and deprecated command failures where existing CLI behavior already supports them.

### Plan

- [x] Inspect active source surfaces: pack metadata, active skills, docs, routing maps, catalog/showcase generation scripts, and generated exports.
- [x] Remove active discovery, recommendation, or default-route references for cut surfaces.
- [x] Preserve intentional compatibility behavior for `business-app`, `creator-media`, and `business-discovery` aliases.
- [x] Keep BIP commands deprecated/failing and kanban packs/skills non-installable.
- [x] Add or update routing notes for consolidation candidates without deleting them.
- [x] Regenerate package/catalog artifacts and review diffs.
- [x] Run targeted tests and validation gates.
- [x] Commit and push intended changes.

### Acceptance Criteria

- [x] `prototype` and `create-ui-experiment` are absent from active skill directories, pack skills, catalog cards, and route targets, with replacement guidance to `logic-wiring` and `build-ui-screens`.
- [x] Compatibility aliases are described as aliases, not active packs, while old installs still route to replacements.
- [x] BIP commands and kanban surfaces remain removed/hibernated from active discovery.
- [x] `dead-code`, `slim-audit`, `debug`, and `hygiene` remain present but are routed narrowly against `quality-sweep`, `investigate`, and `reconcile-dev-docs`.
- [x] Generated package/catalog artifacts reflect the active-surface pruning.

### Verification

- [x] `pnpm --dir tests test layer1/bip-removed.test.ts`
- [x] `pnpm --dir tests test layer1/install.test.ts`
- [x] `pnpm --dir tests test layer1/skill-install-routing-audit.test.ts`
- [x] `pnpm --dir tests test layer1/skills-showcase-pack-coverage.test.ts`
- [x] `node --test packages/skillpacks/test/pack-normalization.test.mjs`
- [x] `npm --workspace packages/skillpacks run build:check`
- [x] `scripts/validate-skills-catalog-export.sh`
- [x] `./scripts/skill-pack-routing-audit.sh`
- [x] `./scripts/skill-mirror-parity-audit.sh`
- [x] `./scripts/skill-versions.sh --missing`
- [x] `node scripts/audit-task-docs.mjs`
- [x] `git diff --check --cached`

### Review

Filtered compatibility and hibernated pack names out of active catalog/list/map discovery while keeping legacy normalization for `business-app`, `creator-media`, and `business-discovery`. Regenerated the package manifest, public skills-catalog export, and skill map; active pack count is now 40 and `product-design` lists `build-ui-screens` and `logic-wiring` without the removed `prototype` or `create-ui-experiment` aliases.

Updated CLI resolver coverage so only the intended compatibility aliases remain accepted as install tokens, and updated showcase coverage to exclude inactive alias/hibernated pack metadata from active pack expectations. Added routing guidance that sends broad cleanup to `quality-sweep`, claim validation to `investigate`, debug changelog work to `debug`, and task/spec/history drift to `reconcile-dev-docs`.

Manual acceptance passed: `skillpacks list --skills`, `skillpacks list --tree`, `scripts/pack.sh list`, compatibility installs for `business-app`, `creator-media`, and `business-discovery`, removed `set-bip`, and hibernated `dev-kanban` / `exec-kanban` failures with guidance. The originally planned Vitest paths under `tests/layer1/...` are not valid from `pnpm --dir tests`; the equivalent `layer1/...` filters passed.

## Historical Task State

## Review - Experimental Publish Dry-Run Verification

### Goal

Fix `./publish.sh --dry-run --tag experimental --preid experimental prerelease` so package verification passes while source metadata is temporarily bumped to an experimental prerelease.

### Verification

- [x] `node --test packages/skillpacks/test/package-boundary.test.mjs packages/skillpacks/test/publish-recovery.test.mjs`
- [x] `npm --workspace packages/skillpacks run test:node`
- [x] `node scripts/audit-task-docs.mjs`
- [x] `git diff --check`
- [x] `./publish.sh --dry-run --tag experimental --preid experimental prerelease`

### Review

Fixed canary package staging so `build-package.mjs` generates a lane-local staged manifest instead of copying whatever manifest was last written to `packages/skillpacks/dist`. Stable staging now stays stable even after a canary manifest is generated during a publish dry run, while canary staging still includes briefing-slide canary assets.

Updated publish recovery tests to derive npm prerelease expectations from the current source version and to use the experimental tag for `--current` recovery when the suite is running under a temporarily pre-bumped prerelease source.

Verification passed for the targeted failure files, full package Node suite, task-doc audit, diff hygiene, and the original experimental publish dry run. The dry run restored source metadata to `0.1.21` / `stable` afterward.


## Review - Cleanup Scope Flags

### Goal

Add explicit cleanup scope flags so `cleanup --all` spells the current recursive project cleanup scope and `cleanup --global` scans user-home projects plus legacy user-home skill roots, while plain `cleanup` remains backward compatible.

### Plan

- [x] Update CLI help and parser for `cleanup [--all|--global] [--reinstall-base] [--dry-run]`.
- [x] Treat `--all` as the current default recursive cleanup from the command cwd.
- [x] Treat `--global` as user-home cleanup scope for project config cleanup, deprecated alias cleanup, and optional base-skill reinstall migration.
- [x] Reject `cleanup --all --global` with a clear error.
- [x] Keep `uninstall-global` as a compatibility alias while routing docs toward `cleanup --global`.
- [x] Add focused parser, lifecycle, and compatibility coverage.
- [x] Run focused and package-level verification.

### Acceptance Criteria

- [x] `cleanup`, `cleanup --all`, and `cleanup --all --dry-run` scan projects from the command cwd.
- [x] `cleanup --global --dry-run` scans projects under the fake/user home, not the command cwd, and still previews legacy user-home skill removals.
- [x] `cleanup --global --reinstall-base` uses the user-home project scan root for migration.
- [x] `cleanup --all --global` is rejected.
- [x] Help text, compatibility docs, and tests document `cleanup --global` as the replacement for device-wide `uninstall-global` usage.

### Verification

- [x] `node --test packages/skillpacks/test/lifecycle.test.mjs packages/skillpacks/test/project-config.test.mjs packages/skillpacks/test/compatibility.test.mjs`
- [x] `npm --workspace packages/skillpacks run test:node`
- [x] `node scripts/audit-task-docs.mjs`
- [x] `git diff --check`

### Review

Added `--all` and `--global` cleanup scope parsing. Plain `cleanup` remains current-directory recursive cleanup, `cleanup --all` is its explicit spelling, `cleanup --global` scans projects under the user home while still removing legacy user-home base skill roots, and `cleanup --all --global` is rejected.

Updated lifecycle labels, refresh warnings, help text, README, quickstart, scripts reference, skillpack distribution docs, pack docs, and skills reference to route device/user-home cleanup toward `cleanup --global`. `uninstall-global` remains as a compatibility alias for the user-home scope.

Added focused coverage for explicit `--all`, `--global --dry-run`, `--global --reinstall-base --dry-run`, flag ordering with `--reinstall-base`, incompatible scope rejection, and compatibility/help docs.

Verification passed: focused lifecycle/project-config/compatibility Node tests, full `npm --workspace packages/skillpacks run test:node`, task-doc audit, and diff whitespace check.

## Review - Release Lane Briefing Slides 2026-07-06

### Goal

Create a briefing slide deck for the release-lane change-boundary COAs, linked to the dense alignment briefing, so the canary-vs-general-release standard can be reviewed as slides.

### Review

Created `briefing-slides/release-lane-change-boundary.html` as the slide-first review surface for the release-lane COAs. The deck links to the dense alignment page, summarizes the problem and recommendation, answers the directory-split question, and includes decision gates plus a compiled YAML handoff.

The deck includes previous/next controls, filmstrip navigation, keyboard and empty-stage navigation, hash resume, print CSS, slide-scoped feedback, marking, annotations, per-slide YAML, and final full-deck YAML.

Static deck hooks, linked reference existence, task-doc audit, diff hygiene, and the HTML opener passed.

## Review - Release Lane Alignment Briefing 2026-07-06

### Goal

Create an alignment briefing that evaluates how to keep canary and general-release edits from mixing across future skill, convention, and package changes.

### Review

Created `alignment/release-lane-change-boundary.html` as a review-state alignment briefing for canary versus general-release change boundaries. The page compares task metadata, lane contract plus audit, canary overlays, and separate source trees, and recommends the release-lane contract plus audit gate while keeping one canonical skill tree by default.

Updated `alignment/index.html` under QA/meta and corrected the visible index count/date to match the active-page audit.

Verification passed for alignment-page audit, task-doc audit, diff hygiene, and the HTML opener.

## Review - Enterprise ICP Interrogation Upgrade 2026-07-06

### Goal

Upgrade `enterprise-icp` in both Claude and Codex mirrors so it participates in the shared `interrogation-page` workflow while preserving existing alignment-page behavior.

### Review

Upgraded both `enterprise-icp` mirrors from `v0.10` to `v0.12` with `interrogation-page` in `required_conventions`. Each mirror now has a Stage 0 interrogation gate before Stage 1 scope approval and a generated shared interrogation-page resolver stub plus sibling bundle.

Archived both pre-upgrade `SKILL.md` files to `archive/v0.10/`, added matching changelog entries, registered `enterprise-icp` in the interrogation generator and layer1 contract, and refreshed skills catalog export artifacts.

Verification passed through interrogation/alignment generator checks, targeted layer1 Vitest, strict archive audit, mirror parity audit, package manifest/export/build checks, task-doc audit, and diff hygiene.

## Review - Competitive Analysis Interrogation Upgrade 2026-07-05

### Goal

Upgrade `competitive-analysis` and its active framework subskills so the parent orchestrator and framework mirrors participate in the shared `interrogation-page` workflow alongside `alignment-page`.

### Plan

- [x] Archive current `competitive-analysis` parent mirrors and four framework subskill mirrors before editing.
- [x] Bump parent mirrors to `v0.29` and framework mirrors to `v0.11`.
- [x] Add `interrogation-page` to parent and framework `required_conventions`.
- [x] Add parent State G stage-zero interrogation before State E framework selection.
- [x] Clarify inherited interrogation plus multi-select approval satisfies inline framework pre-research gates.
- [x] Register the parent and framework subskills in the interrogation generator/test contract.
- [x] Run full verification and fix any failures.
- [x] Commit and push intended changes on `master`.

### Acceptance Criteria

- [x] Both parent mirrors declare `required_conventions: [alignment-page, interrogation-page]`.
- [x] Both parent mirrors run stage-zero interrogation before framework selection on cold start.
- [x] Both mirrors of `porter-five-forces`, `swot`, `strategic-group-map`, and `feature-pricing-matrix` declare `interrogation-page`.
- [x] Framework mirrors keep parent-owned routing and output paths unchanged.
- [x] Interrogation generator/test registry includes all five skills and expects 46 participating stubs.

### Verification

- [x] `node scripts/upgrade-interrogation-page.mjs --check`
- [x] `node scripts/upgrade-alignment-page.mjs --check`
- [x] `pnpm --dir tests exec vitest run --project layer1 layer1/interrogation-confidence-gate.test.ts`
- [x] `bash scripts/skill-archive-audit.sh --strict`
- [x] `bash scripts/skill-mirror-parity-audit.sh`
- [x] `npm --workspace packages/skillpacks run build:manifest:check`
- [x] `npm run exports:check`
- [x] `npm --workspace packages/skillpacks run build:check`
- [x] `node scripts/audit-task-docs.mjs`
- [x] `git diff --check`

### Review

Upgraded both `competitive-analysis` mirrors from `v0.28` to `v0.29` with `interrogation-page` in `required_conventions`, a State G stage-zero interrogation gate before State E framework selection, and an explicit requirement that compiled interrogation YAML be consumed before multi-select approval.

Upgraded both mirrors of `porter-five-forces`, `swot`, `strategic-group-map`, and `feature-pricing-matrix` from `v0.10` to `v0.11`. Each framework now declares `interrogation-page`, has a generated `INTERROGATION-PAGE.md`, and clarifies that parent interrogation plus approved multi-select scope satisfies the inline pre-research context gate without direct child invocation.

Updated the interrogation generator and layer1 registry for the five new participating skills, including skill-specific interview-area guidance and the 46-stub contract. Verification passed through generator checks, targeted layer1 test, archive audit, mirror parity audit, package manifest/export/build checks, and initial diff hygiene.

### Backlog Status

Business research:

- `competitive-analysis` completed
- `enterprise-icp` completed
- `customer-feedback`
- `lean-canvas`
- `value-prop-canvas`

Customer lifecycle:

- `journey-map`

Business growth:

- `monetization`
- `gtm`
- `landing-copy`
- `growth-model`
- `hook-model`
- `pmf-assessment`

Business ops:

- `platform-strategy`

Creator foundation:

- `product-led-media-map`
- `creator-positioning`
- `content-programming`

Game:

- `game-audience`
- `game-comparables`
- `game-fantasy`
- `game-genre-map`
- `game-launch`
- `game-store-page-test`

YouTube ops:

- `youtube-concept-research`

Product design:

- `brainstorm-inspirations`
- `take-inspiration`

ORD:

- `ord-align`

## Review - Bottom-Bar Feedback Sidebar 2026-07-05

### Goal

Add a slide-scoped feedback sidebar opened from the bottom bar while preserving inline gate questions and final-slide full-deck YAML handoff.

### Review

Implemented the bottom-bar `Feedback` button and right-side slide feedback sidebar in `briefing-slides/create-briefing-slides.html`. The sidebar tracks the active slide title, persists feedback/mark/annotation state in `localStorage`, closes via its close button or `Escape`, provides active-slide YAML, and provides all-feedback YAML using the same full-deck builder as slide 8.

Updated `docs/briefing-slides-convention.md` to allow slide-scoped bottom-bar feedback sidebars when inline gate questions remain on slides. Archived the pre-amendment dogfood deck at `docs/history/archive/2026-07-05/224616/briefing-slides/create-briefing-slides.html`.

Verified static source hooks, script parsing, DOM-harness interaction behavior, package build, package build check, task-doc audit, diff hygiene, and opener status `opened`.

## Review - Stage-Click And A/D Slide Navigation 2026-07-05

### Goal

Add stage-click navigation and `A`/`D` slide hotkeys to the briefing-slides convention and the `create-briefing-slides` dogfood deck while preserving all existing review controls.

### Review

Implemented the briefing-slides convention update for `A`/`D` hotkeys and empty-stage click navigation. The rule now explicitly protects slide content, links, buttons, form controls, filmstrip controls, topbar, footer, and review inputs from accidental stage-click advance.

Archived the previous dogfood deck to `docs/history/archive/2026-07-05/215911/briefing-slides/create-briefing-slides.html`, then amended `briefing-slides/create-briefing-slides.html` with a visible `Updated: click-stage + A/D navigation` marker, presentation copy that names `A`/`D` and empty-stage clicks, guarded keyboard handling, and empty-stage-only click handling.

Verified package regeneration, convention/deck text, no dense-reference embed tags in the deck, repo-local reference existence, browser-level navigation behavior, package build checks, diff hygiene, and opener status `opened`.

## Review - Interrogation and Alignment Upgrade Target Backlog 2026-07-05

### Goal

Create the active backlog for high-confidence interrogation/alignment workflow upgrade targets. This task is tracking-only: it does not refactor any skill source, generated convention registry, package metadata, archive, or changelog files yet.

### Target Policy

High-confidence targets are active, non-archived deep/scoped staged research or interview skills that already use `alignment-page` workflows and do not yet declare or implement `interrogation-page`.

### Targets

For every target below, handle the `claude` and `codex` mirrors together where both exist. Parent orchestrator targets also carry their active framework subskills when those framework `SKILL.md` files match the same policy.

Business research:

- `competitive-analysis`
- `enterprise-icp`
- `customer-feedback`
- `lean-canvas`
- `value-prop-canvas`

Customer lifecycle:

- `journey-map`

Business growth:

- `monetization`
- `gtm`
- `landing-copy`
- `growth-model`
- `hook-model`
- `pmf-assessment`

Business ops:

- `platform-strategy`

Creator foundation:

- `product-led-media-map`
- `creator-positioning`
- `content-programming`

Game:

- `game-audience`
- `game-comparables`
- `game-fantasy`
- `game-genre-map`
- `game-launch`
- `game-store-page-test`

YouTube ops:

- `youtube-concept-research`

Product design:

- `brainstorm-inspirations`
- `take-inspiration`

ORD:

- `ord-align`

### Acceptance Criteria

- [x] Target list is derived from active, non-archived `SKILL.md` files.
- [x] Artifact-only skills are explicitly out of scope for this todo unless later promoted by audit.
- [x] Actual refactors require version, archive, and changelog handling per skill versioning rules.
- [x] Generator checks must stay clean after future upgrades.

### Verification

- [x] Re-run the target derivation search and confirm this todo list matches the high-confidence set.
- [x] Run `node scripts/upgrade-alignment-page.mjs --check`.
- [x] Run `node scripts/upgrade-interrogation-page.mjs --check`.
- [x] Run `node scripts/audit-task-docs.mjs`.
- [x] Run `git diff --check`.

### Review

Implemented the tracking-only active backlog for 26 high-confidence target skills. The skill upgrade target checkboxes remain open intentionally; this step only promoted and verified the future-work list.

Verified the active non-archived `SKILL.md` derivation, alignment/interrogation generator cleanliness, task-doc audit, and diff hygiene.

## Review - Fit-To-Slide Briefing Deck Convention 2026-07-06

### Goal

Add an explicit fit-to-slide rule to the briefing-slides convention and amend the `create-briefing-slides` dogfood deck to model concise, viewport-fitting slides that link out for detail.

### Review

Implemented:

- Added `## Fit-To-Slide Content` to `docs/briefing-slides-convention.md`.
- Required authored slide content to fit visible desktop and mobile-sized viewports without hidden overflow, clipped text, slide-body scrolling, or walls of text.
- Directed dense rationale, evidence, edge cases, and procedural detail into linked artifacts with per-slide reference chips.
- Archived the prior dogfood deck to `docs/history/archive/2026-07-05/213310/briefing-slides/create-briefing-slides.html`.
- Amended `briefing-slides/create-briefing-slides.html` with a visible `Updated: fit-to-slide rule` marker, a concise fit-rule slide, shorter content, and retained links to `SKILL.md`, `docs/briefing-slides-convention.md`, and `openai.yaml`.
- Updated `tasks/lessons.md` with the correction pattern.

Verified:

- `npm --workspace packages/skillpacks run build` passed and refreshed package staging.
- `npm --workspace packages/skillpacks run build:check` passed.
- `node scripts/audit-task-docs.mjs` passed.
- `git diff --check` passed.
- Textual inspection confirmed required navigation, keyboard controls, progress, print CSS, gate controls, feedback/annotation/marking controls, YAML compiler, copy fallback, reference chips, and no dense-reference embed tags.
- Repo-local references and archive path exist.
- Playwright screenshots of representative desktop and mobile slides showed fit-rule, review-controls, title, and compiler slides fitting without visible clipping or incoherent overlap.
- `node scripts/open-html-page.mjs briefing-slides/create-briefing-slides.html --browser auto` reported `opened`.

## Review - Dogfood Create Briefing Slides 2026-07-05

### Goal

Generate `briefing-slides/create-briefing-slides.html` as the deck-first review surface for the `create-briefing-slides` skill and its shared convention.

### Review

Implemented:

- Captured the visible invocation under `prompts/create-briefing-slides/`.
- Created `briefing-slides/create-briefing-slides.html` with eight slides covering the skill problem, artifact model, source/output rules, presentation behavior, review controls, YAML handoff contract, dogfood findings, and references.
- Linked `packs/base/codex/create-briefing-slides/SKILL.md`, `docs/briefing-slides-convention.md`, and `packs/base/codex/create-briefing-slides/agents/openai.yaml` as dense references without embedding or auto-opening them.
- Included an inline gate question, slide feedback, annotations, marking controls, copy controls, Clipboard API fallback textarea, and final YAML compiler.

Verified:

- Textual inspection found previous/next controls, keyboard navigation, slide counter/progress indicator, reference links, gate controls, feedback/annotation/marking controls, YAML compiler, copy fallback, and print CSS.
- All repo-local reference links exist.
- No embedded dense-reference tags (`iframe`, `object`, or `embed`) are present.
- `git diff --check` passed.
- `node scripts/open-html-page.mjs briefing-slides/create-briefing-slides.html --browser auto` reported `opened`.

## Review - Briefing Slides Convention 2026-07-05

### Goal

Extract the briefing slide deck standard into a shared convention document and make `create-briefing-slides` reference it like alignment and interrogation page skills reference their conventions.

### Review

Implemented:

- Added canonical `docs/briefing-slides-convention.md`.
- Registered `briefing-slides` in `scripts/skill-convention-registry.mjs`.
- Packaged the convention as `assets/briefing-slides-convention.md`.
- Updated both `create-briefing-slides` mirrors to declare `required_conventions: [briefing-slides]` and reference the shared resolver.
- Regenerated package manifest and catalog exports.

Verified:

- `node scripts/skill-convention-bundle-audit.mjs` passed.
- `bash scripts/skill-mirror-parity-audit.sh` passed.
- `npm --workspace packages/skillpacks run build:manifest:check` passed.
- `npm run exports:check` passed.
- `npm --workspace packages/skillpacks run build:check` passed.

## Review - create-briefing-slides Skill 2026-07-05

### Goal

Add a canary-ready base skill named `create-briefing-slides` that creates slide-first HTML briefing decks for interrogation and alignment review artifacts while preserving dense pages as linked references.

### Review

Implemented:

- Added mirrored `packs/base/{codex,claude}/create-briefing-slides` source skills at `v0.0`.
- Defined the slide-first artifact contract: `briefing-slides/*.html` output, dense references linked but not auto-opened, slide navigation, keyboard controls, per-slide feedback, gate answers, annotation/marking, copy fallback, YAML compilation, archive-before-replace, and open-only-deck behavior.
- Added Codex `agents/openai.yaml` metadata.
- Updated base pack metadata and regenerated package manifest plus catalog exports.
- Captured the visible skill-creation prompt under `prompts/skill-creator/`.

Verified:

- `bash scripts/base-skill-version-parity-audit.sh` passed.
- `bash scripts/skill-mirror-parity-audit.sh` passed.
- `bash scripts/skill-archive-audit.sh --strict` passed.
- `npm --workspace packages/skillpacks run build:manifest:check` passed.
- `npm run exports:check` passed.
- `npm run skillpacks:verify` passed.
- `node scripts/audit-task-docs.mjs` passed.
- `git diff --check --cached` passed.

## Review - Clarify Stable vs Canary Package Language 2026-07-05

### Goal

Clarify public release wording so `skillpacks@latest` remains the normal install channel and `skillpacks@experimental` is clearly a canary prerelease channel for testing unproven package behavior.

### Review

Implemented:

- Added a prominent `@experimental` warning near the top of `scripts/publish-canary-steps.sh`.
- Replaced `experimental-skill` placeholder examples with `<pack-or-skill>`.
- Updated `docs/release-runbook.md`, `docs/skillpacks-npm-distribution.md`, and `README.md` to contrast stable/default installs with canary/testing-only installs.
- Left `docs/QUICKSTART.md` and `docs/scripts-reference.md` unchanged because they do not mention the experimental package channel.

Verified:

- `bash scripts/publish-canary-steps.sh` printed the stable/default versus canary/testing-only distinction.
- `rg "experimental-skill|until that lane exists|skillpacks@experimental" README.md docs scripts/publish-canary-steps.sh` found no `experimental-skill` or stale lane-existence wording; remaining hits are intentional `skillpacks@experimental` examples.
- `bash -n scripts/publish-canary-steps.sh scripts/publish-steps.sh` passed.
- `node scripts/audit-task-docs.mjs` passed.
- `git diff --check` passed.

## Review - publish-canary Command 2026-07-05

### Goal

Create a `publish-canary` command that mirrors the existing `publish-skills` command but prints the canary/experimental npm release lane.

### Review

Implemented:

- Added executable `scripts/publish-canary-steps.sh` with canary auth, gates, dry-run, publish, commit/tag/push, dist-tag validation, smoke checks, recovery, and GA follow-up steps.
- Updated `sync.md` so `/sync` installs both `publish-skills` and `publish-canary` wrappers into `~/.local/bin`.
- Updated `CHANGELOG.md` with the new post-sync command helper.

Verified:

- `bash -n scripts/publish-steps.sh scripts/publish-canary-steps.sh` passed.
- `bash scripts/publish-canary-steps.sh` printed the canary release checklist with local staged version `0.1.19`.
- Temporary wrapper-install simulation passed for `publish-skills` and `publish-canary`.
- `node scripts/audit-task-docs.mjs` passed.
- `git diff --check` passed.

## Review - Fix Nested Archived Skill Copies In Source-Checkout Installs 2026-07-05

### Goal

Fix the source-checkout shell install path so latest managed skill installs never copy nested `archive/` directories from framework subskills, then refresh the reported `vectorfit-redux` install.

### Review

Implemented:

- Updated `scripts/skill-links.sh` so latest managed source-checkout installs copy recursively while excluding any directory named `archive` and the managed marker at every depth.
- Preserved pinned archive installs as symlinks by leaving the existing `archive/<version>` branch unchanged.
- Added focused shell installer coverage for nested framework archives and extended package lifecycle coverage for `positioning/frameworks/category-design`.
- Refreshed `/Users/georgele/projects/web/dev/vectorfit-redux`; no nested `positioning/frameworks/*/archive` directories remain under `.codex/skills` or `.claude/skills`, and no top-level `category-design` skill exists.
- Refreshed stale `packages/skillpacks/dist/skillpacks-manifest.json` metadata for the prior `idea-scope-brief` version change so package gates pass.

Verified:

- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-links-install.test.ts` passed: 3 tests.
- `node --test packages/skillpacks/test/lifecycle.test.mjs` passed: 66 tests.
- `npm --workspace packages/skillpacks run build:check` passed.
- `npm run skillpacks:verify` passed.
- `node scripts/audit-task-docs.mjs` passed.
- `git diff --check` passed.

## Review - idea-scope-brief Deck Post-Install Routing 2026-07-05

### Goal

Fix `idea-scope-brief` so high-confidence deck recommendations keep deck installation as the sole primary command while also giving the user the exact first post-install workflow command, including the scoped product path when available.

### Review

Implemented:

- Archived both `idea-scope-brief` mirrors at `v0.22` and bumped the active Codex and Claude mirrors to `v0.23`.
- Updated Deck Fit Handoff, Customer Discovery Readiness, and Next Steps contracts so high-confidence deck install stays primary while a copy-pasteable `After install, start with: ...` line is required as secondary context.
- Documented Business AFPS customer discovery as the default first workflow after install.
- Added focused layer1 coverage for primary install routing and mirror-specific post-install customer-discovery syntax.
- Captured the visible investigation prompt under `prompts/investigate/`.

Verified:

- `scripts/pack.sh refresh` passed.
- `pnpm --dir tests exec vitest run --project layer1 layer1/idea-scope-brief-approval-ordering.test.ts` passed: 4 tests.
- `pnpm --dir tests exec vitest run --project layer1 layer1/idea-scope-brief-deck-post-install-routing.test.ts` passed: 2 tests.
- `pnpm --dir tests exec vitest run --project layer1 layer1/global-customer-discovery-routing.test.ts` passed: 4 tests.
- `npm --workspace packages/skillpacks run build:manifest:check` passed.
- `npm run exports:check` passed.
- `bash scripts/skill-archive-audit.sh --strict` passed: 407 skills, 0 violations.
- `npm run skillpacks:verify` passed.
- `node scripts/audit-task-docs.mjs` passed.
- `git diff --check` passed.

## Review - skillpacks Canary Release Lane 2026-07-05

### Goal

Add an npm canary/prerelease lane for `skillpacks` and `@glexcorp/gskp` that publishes both package names in lockstep under an explicit non-`latest` dist-tag, defaulting user-facing canary usage to `experimental` while preserving stable `latest` release behavior.

### Plan

- [x] Extend `publish.sh` with `--tag <dist-tag>` and `--preid <identifier>` options, keeping `latest` as the default tag for stable releases.
- [x] Add release-channel guardrails so prerelease versions cannot publish to `latest`, stable `latest` publishes cannot carry prerelease versions, and both package names always share version and dist-tag.
- [x] Preserve `--current` partial-publish recovery while reusing the intended dist-tag and publishing only the missing package.
- [x] Add focused publish-script tests for canary prerelease publishing, guardrail failures, stable non-`latest` opt-in, dry-run behavior, and canary `--current` recovery.
- [x] Update `docs/release-runbook.md`, `docs/skillpacks-npm-distribution.md`, and `CHANGELOG.md` with canary release commands, validation, and publishing rules.
- [x] Run focused and package-level verification, record the review, then commit and push intended changes.

### Acceptance Criteria

- `./publish.sh --tag experimental --preid experimental prerelease` stages versions such as `0.1.20-experimental.0` and publishes both package names with `--tag experimental`.
- `./publish.sh patch` and other stable release commands continue to publish to `latest` unchanged.
- `./publish.sh` rejects prerelease + `latest` and rejects any `latest` publish whose staged version is a prerelease.
- `--current --tag experimental` recovers a partial canary publish using the experimental dist-tag and only publishes the missing package.
- Docs explain canary usage via `npx skillpacks@experimental ...` and `npx @glexcorp/gskp@experimental ...`, plus dist-tag parity verification.

### Review

Implemented:

- Added `--tag` and `--preid` handling to `publish.sh`, with `latest` as the stable default and `--tag experimental --preid experimental prerelease` as the canary path.
- Published-package verification is now dist-tag aware through `SKILLPACKS_EXPECTED_DIST_TAG`.
- `--current` recovery preserves the requested dist-tag and rejects existing-package registry states where the requested tag does not point at the recovered version.
- Release docs and changelog now document canary publish, validation, recovery, and GA follow-up rules.

Verified:

- `node --test packages/skillpacks/test/publish-recovery.test.mjs` passed: 22 tests.
- `node --test packages/skillpacks/test/prepublish-auth-check.test.mjs` passed: 11 tests.
- `node --test packages/skillpacks/test/verify-published-package.test.mjs` passed: 5 tests.
- `npm --workspace packages/skillpacks run test:node` passed: 197 tests.
- `npm run skillpacks:verify` passed.
- `node scripts/audit-task-docs.mjs` passed: 0 failures, 0 warnings.
- `git diff --check` passed.

## Review - Investigate Permission Gate 2026-07-04

Project: `agentic-skills`.

### Goal

Amend the `investigate` skill so it explicitly asks the user for permission before implementing any fix.

### Review

Implemented:

- Archived `investigate` v0.2 for both Claude and Codex mirrors.
- Bumped both active `investigate` mirrors to v0.3 and added a mandatory permission gate after root-cause/proposed-fix discovery.
- Updated both changelogs, refreshed runtime skill copies, and regenerated package/catalog metadata.
- Captured the visible prompt in `prompts/skill-creator/`.

Verified:

- `scripts/pack.sh refresh` passed.
- `bash scripts/skill-mirror-parity-audit.sh` passed.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `node scripts/audit-task-docs.mjs` passed.
- `npm --workspace packages/skillpacks run build:manifest:check` passed.
- `npm run exports:check` passed.
- `npm run skillpacks:verify` passed.
- `git diff --check` passed.

# Historical Task State

## Review - Analyze Sessions Skill Usage Rates 2026-07-04

Project: `agentic-skills`.

### Goal

Update `alignment/analyze-sessions-skill-usage-rates.html` with a session-history analysis that separates user-invoked skill counts from agent-invoked skill counts.

### Review

Implemented:

- Added `scripts/analyze-skill-usage-actors.mjs` to reproduce actor-split skill usage counts from Claude/Codex compact prompt histories and rich assistant transcripts.
- Updated `alignment/analyze-sessions-skill-usage-rates.html` with user-invoked vs agent-invoked skill counts, including 3,215 direct user repo-skill invocations, 9,125 assistant-side skill contract-load events, 3,747 assistant session-skill pairs, and 1,267 assistant recommendation/use-reference events.
- Updated `alignment/index.html` metadata for the amended review page.
- Updated machine-local `.session-insights/` memory and watermark; it remains gitignored and should not be committed.

Verified:

- `node --check scripts/analyze-skill-usage-actors.mjs` passed.
- `node scripts/analyze-skill-usage-actors.mjs --cutoff 2026-07-04T20:45:12.007Z` reproduced the page counts.
- `node scripts/audit-alignment-pages.mjs alignment/analyze-sessions-skill-usage-rates.html` passed.

## Review - Hard-Rename Design Inspiration Workflows

Project: `agentic-skills`.

### Goal

Replace active `design-inspirations` with `brainstorm-inspirations` and add `take-inspiration` as separate product-design skills, preserving archives and updating design-tree contracts, consumers, generated bundles, metadata, and tests.

### Plan

- [x] Inspect current skill mirrors, pack metadata, conventions, generated bundles, references, and tests.
- [x] Archive and rename `design-inspirations` to `brainstorm-inspirations` in both mirrors.
- [x] Add mirrored `take-inspiration` skills with initial changelogs and required bundled conventions.
- [x] Update design-tree convention, alignment-page routing, consumers, metadata, catalog/manifest outputs, and generated bundles.
- [x] Add focused layer-1 coverage for rename, optional feeder/amendment role, `source_artifacts[]`, structured board contract, and route exclusion.
- [x] Run required verification commands and fix failures.
- [x] Commit and push intended changes.

### Review

Verified:

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` passed: 21 tests.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 24 skills checked, 0 bundle writes.
- `node scripts/upgrade-alignment-page.mjs --check` passed.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills, 0 violations.
- `npm run skillpacks:verify` passed.
- `scripts/validate-skills-catalog-export.sh` passed after staging regenerated catalog artifacts.
- `git diff --check` passed.

Implemented:

- Hard-renamed active `design-inspirations` mirrors to `brainstorm-inspirations`, archived v0.3, bumped the active skill to v0.4, and removed active callable `design-inspirations`.
- Added mirrored `take-inspiration` skills at v0.0.
- Updated design-tree loop conventions, alignment page routing, pack metadata, generated convention bundles, catalog exports, package manifest, and skillmap artifacts.
- Updated `ui-interview` and `build-ui-screens` consumers to read `brainstorm-inspirations` and `take-inspiration` artifacts.

## Review - Uninstall-Global Ownership Investigation

Project: `agentic-skills`.

### Goal

Verify why `uninstall-global` reports zero removable global installs while a global `codebase-status` skill exists, then fix the CLI behavior or wording so legacy repo-managed global installs can be identified and cleaned correctly.

### Plan

- [x] Verify the global and project-local `codebase-status` skill markers and versions.
- [x] Trace `uninstall-global` ownership detection in the CLI source.
- [x] Identify the minimal fix and add focused regression coverage.
- [x] Run focused tests and hygiene checks.
- [x] Record review, commit, and push intended changes.

### Acceptance Criteria

- The user’s claim is classified against local evidence.
- `uninstall-global` handles legacy local-checkout managed global installs intentionally, either by removing them under an explicit contract or by reporting them separately with actionable guidance.
- Tests cover npm-package/current-checkout ownership and legacy local-checkout marker sources.

### Review

Confirmed:

- Global `~/.codex/skills/codebase-status` exists at v0.10 with a marker source under `/home/georgeqle/projects/tools/dev/agentic-skills/base/codex/codebase-status`.
- Project-local `omni-editor/.codex/skills/codebase-status` exists at v0.11 with a marker source under the npm `npx` cache.
- The old `uninstall-global` ownership check only trusted sources under the currently executing package root or inferred checkout root, so npm-run cleanup could decline old local-checkout marker sources.

Fixed:

- `uninstall-global` now recognizes managed user-home skill directories whose marker source matches legacy `agentic-skills` or `skillpacks` global/base layouts for the same tool and skill name.
- Symlink and project-local refresh ownership remain on the stricter current-package source check.
- Added regression coverage for an older local checkout source plus a mismatched target that must remain untouched.

Verified:

- `node --test test/lifecycle.test.mjs` passed: 60 tests.
- `node packages/skillpacks/bin/skillpacks.mjs uninstall-global --dry-run` now reports 19 removable repo-managed user-home installs in this home directory, including `.codex/skills/codebase-status`.
- `node --test --test-concurrency=1 packages/skillpacks/test/*.test.mjs` passed: 179 tests.
- Plain `npm --workspace packages/skillpacks run test:node` failed because package test files mutate package metadata concurrently; rerunning serialized passed.
- `npm --workspace packages/skillpacks run build:check` passed after regenerating the stale tracked manifest.

## Review - Patch Packaged Alignment Audit Missing Shared Lib 2026-07-04

Project: `agentic-skills`.

### Goal

Fix the packaged `skillpacks alignment pages audit` failure by packaging the shared collapsing-fill audit helper and covering the package boundary.

### Plan

- [x] Add `scripts/lib/` to package build staging.
- [x] Add `scripts/lib/` to package publish files.
- [x] Add staged/tarball regression assertions for `scripts/lib/collapsing-fill-audit.mjs`.
- [x] Rebuild `packages/skillpacks/build`.
- [x] Verify source audit, packaged audit, focused package tests, dry-run package contents, task docs, and diff hygiene.

### Acceptance Criteria

- Packaged alignment audit passes from `packages/skillpacks/build`.
- Packed npm dry-run contains `scripts/lib/collapsing-fill-audit.mjs`.
- Patch does not modify alignment page artifacts or audit behavior.

### Review

Verified:

- `node packages/skillpacks/scripts/build-package.mjs` passed.
- `node scripts/audit-alignment-pages.mjs` passed.
- `node packages/skillpacks/build/bin/skillpacks.mjs alignment pages audit` passed.
- `node --test packages/skillpacks/test/alignment.test.mjs` passed: 14 tests.
- `node --test packages/skillpacks/test/package-boundary.test.mjs` passed: 2 tests.
- `npm --workspace packages/skillpacks run pack:dry-run` passed and included `scripts/lib/collapsing-fill-audit.mjs`.
- `node scripts/audit-task-docs.mjs` passed: 0 failures, 0 warnings.
- `git diff --check` passed.

## Review - Refresh Stale Skillpacks Generated Artifacts 2026-07-04

Project: `agentic-skills`.

### Goal

Fix the failed `build:manifest:check` by regenerating stale generated skillpacks artifacts from the current committed skill source.

### Review

Verified:

- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` from current skill source.
- Staged the refreshed package manifest before regenerating catalog exports so `scripts/generate-skills-catalog-export.mjs` read the fresh manifest from the git index.
- Regenerated `exports/skills-catalog/v1/catalog.json`, `exports/skills-catalog/v1/manifest.json`, and `exports/skills-catalog/v1/proof.json`.
- `npm --workspace packages/skillpacks run build:manifest:check` passed.
- `npm --workspace packages/skillpacks run build:check` passed.
- `npm run exports:check` passed.
- `npm run skillpacks:verify` passed.
- `git diff --check` and `git diff --cached --check` passed.

## Review - Skill Quality Audit Before Publish 2026-07-04

Project: `agentic-skills`.

### Goal

Run a publish-blocking skill quality audit before `./publish.sh --dry-run patch`, patching any release-impacting skill issues before moving from the clean prep state into publish dry run.

### Review

Patched release-blocking audit findings:

- Updated `scripts/skill-mirror-parity-audit.sh` so known intentional platform version drift is explicitly approved and platform-specific refresh/fresh-session wording normalizes correctly.
- Updated `scripts/skill-ship-end-routing-audit.sh` so it asserts the current `ship-end` contract versions instead of stale `v0.5` expectations.
- Reclassified `research-amend` from `type: research` to `type: analysis` in both mirrors, archived `v0.1`, bumped to `v0.2`, and updated skill changelogs.
- Added standard staged-research lifecycle marker wording to both `youtube-meta-research` mirrors, archived `v0.0`, bumped to `v0.1`, and updated skill changelogs.
- Fixed focused product-design flow-tree coverage to read `idea-scope-brief` from `packs/base/{claude,codex}`.
- Regenerated package manifest and skills-catalog export metadata after skill frontmatter/content changes.

Verified:

- Starting state was clean on `master`; `npm view skillpacks version` and `npm view @glexcorp/gskp version` both reported `0.1.19`.
- Structural audits passed: `./scripts/skill-versions.sh --missing`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-next-step-routing.sh --missing`, `bash scripts/base-skill-version-parity-audit.sh`, `bash scripts/skill-archive-audit.sh --strict`, and `bash scripts/skill-mirror-parity-audit.sh --verbose`.
- Workflow/routing audits passed: `bash scripts/skill-install-routing-audit.sh --active`, `bash scripts/skill-pack-routing-audit.sh`, `bash scripts/skill-ship-end-routing-audit.sh`, `bash scripts/skill-research-loop-handoff-audit.sh`, `node scripts/skill-alignment-routing-audit.mjs`, and `node scripts/researchish-skill-lifecycle-audit.mjs`.
- Convention/page checks passed: `node scripts/upgrade-alignment-page.mjs --check`, `node scripts/upgrade-interrogation-page.mjs --check`, `node scripts/upgrade-design-tree-loop.mjs --check`, `node scripts/audit-alignment-pages.mjs`, and `node scripts/audit-interrogation-pages.mjs`.
- Package/export checks passed: `npm run exports:check`, `npm run skillpacks:verify`, and `npm --workspace packages/skillpacks run test:node` (178/178).
- Focused layer1 regression coverage passed: `pnpm --dir tests exec vitest run --project layer1 frontmatter install routing-graph pack-skill-mirror-parity skill-install-routing-audit skill-alignment-routing-audit researchish-skill-lifecycle-audit alignment-gates interrogation-confidence-gate product-design-flow-tree post-uat-consolidation-routing` (1730/1730).
- Final commit/push and `./publish.sh --dry-run patch` are the remaining release-gate actions after task-doc and diff hygiene pass.

## Review - 0.1.20 Publish Dry-Run Prep 2026-07-04

Project: `agentic-skills`.

### Goal

Prepare the tracked source tree for the user-run `./publish.sh --dry-run patch` command without running the publish dry run in this cleanup pass.

### Review

Verified:

- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` and the public skills catalog export metadata; the package manifest was already byte-stable and the catalog export moved to the current source commit/fingerprint.
- Updated `CHANGELOG.md` `0.1.20` for post-`dc317d64b` release-boundary changes: explicit alignment gate metadata, session-triage evidence-path fixes, UX variations assemble-stop handling, repo-local skillpacks install prohibition, and regenerated catalog/package metadata.
- Removed untracked generated `.agents/skillpacks/` runtime docs from the release boundary.
- Npm latest remains `0.1.19` for both `skillpacks` and `@glexcorp/gskp`; next package version remains `0.1.20`.
- Package Node tests passed: 178 tests.
- Package verification passed: 411 active skills, 42 packs, 383 tracked convention bundles, manifest check, package staging boundary check, and `npm pack ./build --dry-run`.
- Skills catalog export verification passed.
- Skill archive audit passed: 411 skills, 0 violations.
- Task-doc audit passed after this review conversion: 0 failures, 0 warnings.
- Diff hygiene passed: `git diff --check`.

## Review - Design-Tree Handoff Verification 2026-07-02

Project: `agentic-skills`.

### Goal

Add a mandatory pre-final handoff verification step to product-design/product-testing contracts so agents cannot route to `consolidate-prototypes` unless current design-tree artifacts prove consolidation readiness.

### Plan

- [x] Archive and version affected active `SKILL.md` files.
- [x] Add shared handoff verification classifications and conservative fallback rule to `docs/design-tree-loop-convention.md`.
- [x] Update Codex and Claude `uat`, `logic-wiring`, and `consolidate-prototypes` contracts.
- [x] Extend focused layer-1 routing coverage.
- [x] Run requested verification commands.
- [x] Record review, commit, and push intended changes.

### Acceptance Criteria

- Final handoffs include `Handoff verification: <classification>; ...` immediately before terminal routing.
- The classifications are `continue-design-branch`, `manual-uat-needed`, `single-variant-convergence-needs-explicit-scope`, and `ready-for-consolidation`.
- `research/.progress.yaml` is not used or named as the readiness storage surface for UAT/prototype/consolidation readiness.
- Contradictory artifacts conservatively block consolidation.

### Verification Plan

- `pnpm --dir tests exec vitest run --project layer1 layer1/post-uat-consolidation-routing.test.ts`
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`

### Review

Verified:

- `pnpm --dir tests exec vitest run --project layer1 layer1/post-uat-consolidation-routing.test.ts` passed: 5 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 415 skills, 0 violations.
- `git diff --check` passed.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes.

## Review - 0.1.20 Publish Readiness 2026-07-02

Project: `agentic-skills`.

### Goal

Prepare the repository for the next package publish after npm `0.1.19`: document the full changelog, package existing skill/doc changes, verify generated artifacts, and leave no dirty tracked tree.

### Review

Verified:

- Npm latest is `0.1.19` for both `skillpacks` and `@glexcorp/gskp`; the next prepared release is `0.1.20`.
- Package changelog and ship manifest document the full post-`0.1.19` release boundary.
- Generated design-tree loop bundles were stale during the first package verification run; regenerated 22 bundles and reran package verification successfully.
- Catalog export metadata was stale during the first export check; regenerated and reran export verification successfully.
- Package Node tests passed: 178 tests.
- Package verification passed: 415 active skills, 42 packs, 385 tracked convention bundles, manifest check, package staging boundary check, and `npm pack ./build --dry-run`.
- Skill archive audit passed: 415 skills, 0 violations.
- Pattern A handoff audit passed.
- Task-doc audit passed after converting review checklist items to evidence text.
- Diff hygiene passed.

## Review - Post-UAT Consolidation Routing Fix 2026-07-02

Project: `agentic-skills`.

### Goal

Prevent product-design handoffs from implying `$consolidate-prototypes` or `/consolidate-prototypes` is next after only one built prototype when other approved UX variants remain unbuilt or UAT evidence is not recorded.

### Plan

- [x] Archive and version the active Codex/Claude `uat`, `logic-wiring`, and `consolidate-prototypes` skill contracts.
- [x] Tighten UAT variant-evaluation readiness language to distinguish built/evaluated, built/not-run, approved-unbuilt/deferred, and explicitly MVP-excluded variants.
- [x] Tighten `logic-wiring` routing so prototype approval routes only to UAT; consolidation remains a later evidence/scope decision.
- [x] Harden `consolidate-prototypes` evidence gates for not-ready UAT files, unchecked readiness items, all-`Not run` logs, and unbuilt approved branches.
- [x] Update shared reusable routing docs for UAT-evidence plus explicit unbuilt/deferred-branch handling.
- [x] Add focused layer-1 contract coverage and run the requested tests/audits.

### Acceptance Criteria

- Active Codex and Claude skill mirrors do not route directly from one built prototype to consolidation.
- Consolidation readiness requires UAT evidence and explicit handling of unbuilt/deferred approved branches.
- Single-variant MVP convergence is allowed only when the user explicitly chooses that scope.
- Conservative fallback routes back to the next approved unbuilt UX/UI branch instead of consolidating by default.

### Verification Plan

- `pnpm exec vitest tests/layer1/post-uat-consolidation-routing.test.ts`
- `pnpm exec vitest tests/layer1/product-design-customer-discovery-routing.test.ts tests/layer1/product-testing-customer-discovery-routing.test.ts`
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`

### Review

Verified:

- Root-level `pnpm exec vitest tests/layer1/post-uat-consolidation-routing.test.ts` failed because `vitest` is not installed at the repository root.
- `pnpm --dir tests exec vitest run --project layer1 layer1/post-uat-consolidation-routing.test.ts` passed: 4 tests.
- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-customer-discovery-routing.test.ts layer1/product-testing-customer-discovery-routing.test.ts` passed: 3 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 415 skills, 0 violations.
- `git diff --check` passed.

## Review - Interrogation Agent-Owned Depth Convention 2026-07-02

Project: `agentic-skills`.

Status: VERIFIED (2026-07-02).

### Goal

Update the interrogation-page convention so agents own interrogation depth, route unknowns correctly, and keep the confidence gate from passing on shallow "covered or waived" alignment.

### Plan

- [x] Update the canonical interrogation convention.
- [x] Regenerate legacy `INTERROGATION-PAGE.md` bundles from the canonical convention.
- [x] Update focused layer1 assertions for the new contract.
- [x] Run generator and focused test verification.
- [x] Record review notes and ship intended changes.

### Review

Verified:

- `node scripts/upgrade-interrogation-page.mjs --legacy-bundles --dry-run` passed with `Updated: 0`.
- `node scripts/upgrade-interrogation-page.mjs --legacy-bundles --check` passed with exact bundles, paths, and resolver stubs.
- `node scripts/upgrade-interrogation-page.mjs --check` passed with exact shared resolver stubs.
- `pnpm --dir tests exec vitest run --project layer1 layer1/interrogation-confidence-gate.test.ts` passed: 43 tests.
- `npm run skillpacks:build` passed; the unrelated manifest fingerprint side effect was restored.

Recent completed work has been reconciled into `tasks/history.md`, `tasks/roadmap.md`, task ship manifests, and `tasks/reconciliation-report.md`. Advisory recurring work remains in `tasks/recurring-todo.md` until explicitly promoted.

## Review - Development Docs Reconciliation 2026-07-02

Project: `agentic-skills`.

Status: VERIFIED (2026-07-02).

### Plan

- [x] Capture the `$reconcile-dev-docs fix tasks` invocation prompt.
- [x] Audit `tasks/roadmap.md`, `tasks/todo.md`, advisory task files, recent git history, and the task-doc audit.
- [x] Mark completed current-task headings as historical/no-active state.
- [x] Add factual reconciliation evidence to history and reconciliation report.
- [x] Run task-doc audit and diff checks.

### Review

Verified:

- `node scripts/audit-task-docs.mjs` passed after the current-task cleanup.
- `git diff --check` passed for whitespace hygiene.
- `tasks/roadmap.md` has no promoted `Current Implementation` heading after this reconciliation.
- `tasks/todo.md` has no active implementation task and no stale unchecked executable items.
- The two unchecked recurring items remain advisory in `tasks/recurring-todo.md`.

## Historical Implementation - YAML-Only Routing Handoff Audit

Project: `agentic-skills`.

Status: VERIFIED (2026-07-02).

### Goal

Remove duplicate continuation routing from active chunked skill handoffs: when a handoff includes `## Invoke With YAML`, the resolved continuation command lives in YAML (`command` / `agent_routing.command`) and the YAML is the single copy/paste artifact.

### Plan

- [x] Inspect existing dirty work and routing handoff hits without reverting unrelated changes.
- [x] Patch stale canonical or installed skill mirrors that still require an `Exact next command` alongside YAML.
- [x] Ensure focused regression coverage catches active chunked skills that combine `Exact next command:` with `## Invoke With YAML`.
- [x] Run generator checks, archive audits, focused tests, whitespace checks, and status checks.
- [x] Reconciled as historical follow-up, not active executable work in this task file.

### Acceptance Criteria

- Active generated design-tree loop bundles do not tell users to copy both an exact command line and `## Invoke With YAML` for the same chunked continuation.
- Chunked skill instructions route repeated commands through `agent_routing.command`.
- Local installed `.codex/skills` and `.claude/skills` mirrors that users may invoke directly no longer repeat the stale duplicate-command wording.
- Historical archives, changelogs, alignment-page YAML contracts, Pattern A review-loop command YAML, and post-write `Recommended Next Command` sections remain unchanged unless directly implicated.

### Verification Plan

- `rg` audit for `Exact next command`, `run the Exact next command`, `alongside the command`, and `give the exact resolved next`.
- `node scripts/upgrade-design-tree-loop.mjs --check`
- `bash scripts/skill-archive-audit.sh --strict`
- Focused Vitest for product-design routing handoffs.
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts -t "YAML as the single copy-paste artifact"` passed from `tests/`.
- Stale phrase audit passed with no hits for duplicate exact-command handoff wording in active scanned surfaces.
- `git diff --check` passed.

Known unrelated residual:

- Full `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` still fails on the existing base-pack migration path because `base/codex/idea-scope-brief/SKILL.md` is missing after base skills moved under `packs/base/...`.

## Historical Implementation - UX Variations YAML-Only Chunked Handoff

Project: `agentic-skills`.

### Goal

Remove duplicate chunked-handoff routing in `ux-variations` so the resolved continuation command appears in `## Invoke With YAML` / `agent_routing.command` instead of both YAML and a separate "Exact next command" line.

### Plan

- [x] Record the user correction in `tasks/lessons.md`.
- [x] Archive and version active `ux-variations` skill contracts before behavior edits.
- [x] Update the design-tree convention and mirrored `ux-variations` handoff wording.
- [x] Regenerate/check bundled design-tree convention files.
- [x] Run focused tests and archive/diff verification.

### Review

Verified:

- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes.
- `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts -t "requires progress handoff blocks"` from `tests/` passed: 1 test, 18 skipped.
- Full `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` still fails only on a pre-existing dirty-tree base-pack migration path: `base/codex/idea-scope-brief/SKILL.md` is missing because the tree has moved base skills under `packs/base/...`.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.

## Historical Implementation - Base Pack Nesting Migration

Project: `agentic-skills`.

### Goal

Move the canonical base skill source from top-level `base/{claude,codex}` to `packs/base/{claude,codex}` while preserving base-skill install/runtime semantics.

### Execution Profile

- Parallel mode: serial.
- Reason: the change renames a source root and touches package discovery, generated manifests, tests, docs, and task records.
- Safety boundary: preserve unrelated dirty work already present in the shared worktree; keep legacy `base/...` managed marker ownership valid for cleanup/refresh; do not add the base pack to `enabled_packs`; do not implement `research-amend` in this shipping boundary.

### Plan

- [x] Move tracked base skill sources and archives to `packs/base/{claude,codex}` and add `packs/base/PACK.md`.
- [x] Update catalog, package, lifecycle, ownership, audit, generator, and docs code so `packs/base` remains `scope: "base"` with `pack: null`.
- [x] Update focused manifest/lifecycle/package-boundary/layer1 tests for the new canonical paths and legacy marker compatibility.
- [x] Regenerate package manifest/catalog exports from staged source and run focused verification.
- [x] Record review, ship manifest, and history for this base migration before starting `research-amend`.

### Acceptance Criteria

- Base skills are sourced from `packs/base/{claude,codex}`.
- Base skills still report `scope: "base"` and `pack: null` in install/runtime manifests.
- `npx skillpacks init` still installs all base skills and records `base_skills: true`.
- `npx skillpacks install idea-scope-brief` still records `enabled_skills["idea-scope-brief"] = "base"`.
- Refresh/uninstall cleanup still recognizes existing managed markers pointing at old `base/...` paths.
- `packs/base` is not treated as an `enabled_packs` domain pack.
- `research-amend` remains the next separately shippable change.

### Test Plan

- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `bash scripts/skill-mirror-parity-audit.sh`
- `bash scripts/skill-install-routing-audit.sh`
- `npm run skillpacks:build`
- `npm run skillpacks:verify`
- `node scripts/generate-skills-catalog-export.mjs`
- `scripts/validate-skills-catalog-export.sh`
- Focused Node/Vitest tests for `packs/base` layout, init/refresh/install lifecycle behavior, package boundary, and routing/audit path updates
- `git diff --check`

### Review

Verified:

- `npm run skillpacks:build` passed after staging the migrated base source.
- `npm run skillpacks:verify` passed; `node bin/skillpacks.mjs list` no longer lists `base` as a normal pack.
- Manifest semantic check passed: `packs/base/codex/skills/SKILL.md` is installable with `scope: "base"`, `pack: null`, and `packs[].name !== "base"`.
- `npm --workspace packages/skillpacks run test:node` passed: 176 tests.
- `npm --workspace packages/skillpacks run build:check` passed.
- `scripts/validate-skills-catalog-export.sh` passed and confirmed export artifacts are fresh.
- `bash scripts/skill-versions.sh --missing` passed: all 363 skills have a version field.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `bash scripts/skill-deps.sh --broken` passed.
- `bash scripts/skill-install-routing-audit.sh --active` passed: 413 active `SKILL.md` files scanned, P1 coverage 12/12, findings 0.
- `node scripts/upgrade-alignment-page.mjs --check`, `node scripts/upgrade-interrogation-page.mjs --check`, and `node scripts/upgrade-design-tree-loop.mjs --check` passed.
- `bash scripts/base-skill-version-parity-audit.sh` and `bash scripts/skill-pack-routing-audit.sh` passed.
- Focused layer1 suite passed from `tests/`: 7 files, 393 tests.

Known residual outside this shipping boundary:

- Broad mirror/layer1 validations in this dirty worktree still include unrelated pre-existing convention/version work in `packs/agent-work-admin`, `packs/exec-loop`, `packs/product-design`, `packs/docs-health`, `packs/monorepo`, and `youtube-meta-research`. These were not changed or corrected in the base nesting migration.
- `bash scripts/skill-mirror-parity-audit.sh` still fails on 10 dirty-tree parity issues: `agent-work-admin/plan-phase`, `base/provision-agentic-config`, `docs-health/hygiene`, `exec-loop/ship-end`, `monorepo/mono-plan`, `product-design/consolidate-prototypes`, `product-design/logic-wiring`, `product-design/state-model`, `product-design/ux-variations`, and `vard/vard-align`.
- A parallel package build/check attempt raced on `packages/skillpacks/build` and produced a transient `ENOENT`; the same commands passed when rerun serially.

## Historical Implementation - Cross-Agent SKILL.md Convention Audit

Project: `agentic-skills`.

### Goal

Audit active Codex and Claude `SKILL.md` files and fix platform-convention mismatches so Codex skill copies use Codex-facing invocation and tooling language, while Claude skill copies use Claude-facing invocation and tooling language.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for any active `SKILL.md`, tests, and task docs.
- Reason: this is a broad documentation-contract audit across mirrored agent skill sources.
- Safety boundary: exclude archived `SKILL.md` snapshots unless an active generated convention requires regeneration, preserve unrelated dirty package files and prompt logs, and do not introduce GitHub Actions.

### Plan

- [x] Inventory active Codex and Claude `SKILL.md` files and define mismatch patterns.
- [x] Patch clear platform-convention mismatches with minimal edits.
- [x] Run active-skill audits, archive/version checks, diff checks, and status checks.
- Commit and push intended changes on the primary branch while preserving unrelated dirty work. This was left as prior-session follow-up, not active executable work in this task file.

### Acceptance Criteria

- [x] Active Codex `SKILL.md` files do not contain user-facing slash invocation commands where a `$skill` command is intended.
- [x] Active Claude `SKILL.md` files do not contain user-facing dollar invocation commands where a `/skill` command is intended.
- [x] Agent-specific reload/session guidance points at Codex for Codex skills and Claude Code for Claude skills.
- [x] Any changed active `SKILL.md` files follow archive/version/changelog requirements.

### Test Plan

- Targeted active-source grep/audit checks for Codex slash invocations and Claude dollar invocations.
- Targeted grep checks for cross-agent tool/reload wording.
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- Targeted active-source grep checks removed the known bad patterns: Codex `/sync`, Codex `/roadmap`/`/plan-phase`, Codex `/clear` chunk guidance, Claude `$reconcile-dev-docs`, and final-route fallback text that recommended the wrong runner syntax.
- Remaining raw command grep hits were reviewed as intentional target-block text, explicit Claude↔Codex bridge contracts, filesystem/URL route examples, or same-runner command examples.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `node scripts/audit-task-docs.mjs` passed: failures 0, warnings 0.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes after regeneration.
- `npm run skillpacks:build` passed.
- `npm run skillpacks:verify` passed after regenerating stale design-tree-loop bundles.
- `git diff --check` passed.

Commit/push not performed from this session because a large overlapping base-pack migration appeared in the working tree while verification was running (`base/**` deleted, `packs/base/**` added, package/catalog scripts changed, and prompt logs added). The audit edits are present in the current tree, including the migrated `packs/base/codex/provision-agentic-config` copy, but staging them safely requires separating that concurrent migration boundary first.

## Historical Implementation - UAT Pack Availability Guard Handoff

Project: `agentic-skills`.

### Goal

Update product-design UAT handoffs so routes to `$uat --variant-evaluation` or `/uat --variant-evaluation` give plain install-then-run instructions when `uat` may be unavailable. The guidance must install the providing `product-testing` pack, never the `uat` skill directly, and Codex must mention the fresh-session fallback.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for versioned skills, canonical convention, generated bundles, tests, and task docs.
- Reason: the change touches mirrored product-design skills, generated design-tree-loop bundles, and regression tests.
- Safety boundary: preserve unrelated dirty package files, do not edit generated local skill roots under `.claude/skills` or `.codex/skills`, and do not introduce GitHub Actions.

### Plan

- [x] Record task plan and prompt history for the UAT pack availability guard work.
- [x] Archive and version the four active product-design skills before behavior changes.
- [x] Update `logic-wiring` mirrors with explicit Pack Availability Guard wording and non-bare UAT handoffs.
- [x] Update `consolidate-prototypes` mirrors so missing UAT evidence routes with plain install-then-run guidance.
- [x] Update canonical design-tree loop convention and regenerate generated bundles.
- [x] Add focused product-design flow-tree regression assertions.
- [x] Run targeted tests, generator checks, grep audits, diff checks, and status checks.
- Commit and push intended changes on the primary branch while preserving unrelated dirty work. This was left as prior-session follow-up, not active executable work in this task file.

### Acceptance Criteria

- [x] `logic-wiring` and `consolidate-prototypes` both identify `uat` as provided by `product-testing` when unavailable.
- [x] Codex handoffs include `npx skillpacks install product-testing`, then `$uat --variant-evaluation`, and mention a fresh Codex CLI session fallback.
- [x] Claude handoffs include `npx skillpacks install product-testing`, then `/uat --variant-evaluation`.
- [x] No active updated handoff recommends installing the `uat` skill directly.
- [x] `agent_routing` YAML is not the only human-facing UAT command.
- [x] Changed `SKILL.md` files are archived, versioned, and have changelog entries.

### Test Plan

- `pnpm test -- tests/layer1/product-design-flow-tree.test.ts`
- `pnpm test -- tests/layer1/skill-install-routing-audit.test.ts`
- `node scripts/upgrade-design-tree-loop.mjs --check`
- Targeted `rg` checks for `install it`, `install product-testing if unavailable`, the direct `uat` install command, and bare UAT-only handoff blocks.
- `bash scripts/skill-archive-audit.sh --strict`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `pnpm test -- tests/layer1/product-design-flow-tree.test.ts` and `pnpm test -- tests/layer1/skill-install-routing-audit.test.ts` from the repo root failed immediately because the repo has no root `test` script and the shell reported `test: --: unexpected operator`.
- `pnpm exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` from `tests/` passed: 1 file, 19 tests.
- `pnpm exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts` from `tests/` passed: 1 file, 2 tests.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed: 22 skills checked, 0 bundle writes.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.
- Scoped active-source grep audits found no vague `install it`, no `install product-testing if unavailable`, no direct `uat` install command, and no bare UAT-only recommended command blocks in the updated UAT handoff surfaces.
- Pre-existing unrelated dirty files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Historical Implementation - BIP Prompt And Blocker Cleanup

Project: `agentic-skills`.

### Goal

Make `idea-scope-brief` the only skill that may ask a Build-In-Public (BIP) gate question. Everywhere else, BIP is non-blocking read-only output behavior. `ship` and `ship-end` may ask about BIP only as a terminal-only prompt after reporting, and only when `.agents/project.json.alignment.build_in_public` is absent.

## Historical Plan - Explicit Alignment Gate Outcome Metadata

### Goal

Update alignment-page review readiness so it is driven by machine-readable gate outcome metadata, and propagate the focused `ui-interview` behavior update through versioned source mirrors and generated bundles.

### Current Phase

- [x] Write prompt-history records for the `skill-creator` and `ui-interview` invocations.
- [x] Patch the canonical alignment-page convention and focused layer-1 tests.
- [x] Archive and bump both active `ui-interview` skill mirrors to `v0.30`.
- [x] Regenerate generated alignment-page artifacts.
- [x] Refresh the managed `gblock-party-redux` installed skill copy from source.
- [x] Remediate the active `gblock-party-redux` review page still carrying the incident pattern.
- [x] Run verification and record review results.

### Review

Verified so far:

- `node scripts/upgrade-alignment-page.mjs --legacy-bundles --check` passed: 315 output paths exact, 313 resolver stubs exact.
- `node scripts/upgrade-alignment-page.mjs --check` passed: 315 output paths exact, 313 resolver stubs exact.
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts` passed: 40 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 415 skills checked, 0 violations.
- `git diff --check` passed after task-doc updates.
- `git -C /Users/georgele/projects/web/dev/gblock-party-redux diff --check` passed after active-page remediation.
- `gblock-party-redux` managed `.codex/skills/ui-interview` now reports `source_version=v0.30` from the source checkout.
- `gblock-party-redux/alignment/ui-interview-v1-operator-console.html` static fixture check passed: all-approve ready, one blocking option not-approved, and `No decision-critical coverage is missing.` remains an approving path through `data-approval-effect="approve"`.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for canonical conventions, shipping skills, tests, generated bundles, catalog exports, and task docs.
- Reason: the change touches shared workflow policy, generated alignment bundles, mirrored `ship`/`ship-end` skill contracts, versioned skill archives, and catalog metadata.
- Safety boundary: do not edit generated `.claude/skills/**` or `.codex/skills/**` local roots; do not run npm publish, deploy, or GitHub Actions; preserve unrelated pre-existing package/export dirty state unless regeneration for this task intentionally updates it.

### Plan

- [x] Inspect BIP language in `CLAUDE.md`, generated alignment convention bundles, `ship`/`ship-end` skills, tests, and repo status.
- [x] Archive and version the four active source shipping skills before behavior changes.
- [x] Update shared BIP policy so `idea-scope-brief` is the only BIP gate-question owner and all other BIP output is read-only/non-blocking.
- [x] Update `ship` and `ship-end` contracts for terminal-only absent-setting prompting, explicit-false suppression, and no BIP blockers/review gates.
- [x] Regenerate bundled alignment-page conventions from `docs/alignment-page-convention.md`.
- [x] Refresh skills catalog exports required by skill changes while preserving unrelated package metadata.
- [x] Run focused tests, archive/generator audits, task-doc audit, and diff hygiene checks.
- [x] Commit and push the intended BIP cleanup boundary on the primary branch while preserving unrelated dirty work.

### Acceptance Criteria

- [x] `CLAUDE.md` states BIP is never a blocker, required approval gate, required review step, or downstream-routing prerequisite outside `idea-scope-brief`.
- [x] `ship`/`ship-end` treat `alignment.build_in_public: false` as "do not ask and do not generate BIP."
- [x] `ship`/`ship-end` prompt only in terminal output when `alignment.build_in_public` is absent and `alignment.bip_prompt_dismissed !== true`.
- [x] BIP output remains generated only when enabled or explicitly invoked, and it is read-only help/review content.
- [x] Active non-archived skill/convention text has no BIP blocker language except the allowed `idea-scope-brief` gate and normal non-BIP alignment approval gates.
- [x] Changed `SKILL.md` files are archived, versioned, and have changelog entries.
- [x] Generated catalog exports validate.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `npx vitest run tests/layer1/ship-end-bip.test.ts tests/layer1/alignment-gates.test.ts`
- `bash scripts/skill-archive-audit.sh --strict`
- `node scripts/generate-skills-catalog-export.mjs`
- `scripts/validate-skills-catalog-export.sh`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `node scripts/upgrade-alignment-page.mjs --check` passed: 313 output paths exact, 311 generated bundles exact.
- `npx vitest run tests/layer1/ship-end-bip.test.ts tests/layer1/alignment-gates.test.ts` passed: 2 files, 49 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `scripts/validate-skills-catalog-export.sh` passed after regenerating and staging `exports/skills-catalog/v1/`.
- `node scripts/audit-task-docs.mjs` passed: failures 0, warnings 0.
- `git diff --check` passed.
- Focused BIP prompt grep confirmed only `idea-scope-brief` owns the kickoff gate question; `ship` and `ship-end` are terminal-only and absence-gated.
- Pre-existing unrelated package files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Historical Implementation - SKILL.md Language Deduplication Review

Project: `agentic-skills`.

### Goal

Review active `SKILL.md` files for duplicated language within the same document and repeated language between a `SKILL.md` and the Markdown documents it directly references. Remove or consolidate redundant prose without changing skill behavior.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for skill/reference/task docs.
- Reason: this is a broad documentation-quality pass across active skill contracts and directly referenced companion docs.
- Safety boundary: exclude archived `SKILL.md` snapshots unless directly referenced by an active skill, preserve unrelated dirty package files, and avoid GitHub Actions.

### Plan

- [x] Inspect repo guidance, lessons, current task state, and active `SKILL.md` inventory.
- [x] Build or run an audit for repeated normalized paragraphs within active skills and against direct Markdown references.
- [x] Review high-signal duplicate findings and classify each as intentional mirror, generated convention copy, or redundant local prose.
- [x] Patch only clear same-document or skill/reference duplication with minimal wording changes.
- [x] Run targeted duplicate audit, archive/version audit if skills change, diff checks, and status checks.
- [x] Commit and push intended changes on the primary branch while preserving unrelated dirty work.

### Acceptance Criteria

- [x] No clear duplicated paragraphs remain within an edited active `SKILL.md`.
- [x] No edited active `SKILL.md` repeats substantial prose from its direct Markdown references when a pointer or shorter instruction is sufficient.
- [x] Behaviorally important instructions remain present in either the skill or the referenced document.
- [x] Verification output is recorded in the Review section.

### Test Plan

- Duplicate audit script/check used for this task.
- `bash scripts/skill-archive-audit.sh --strict` if active `SKILL.md` files change.
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- Normalized duplicate audit over 413 active source `SKILL.md` files found `ref_exact_count: 0` and `ref_overlap_count: 0` after edits. The remaining intra-file matches are the intentional generated target policy blocks inside `base/claude/provision-agentic-config/SKILL.md`.
- `node scripts/upgrade-alignment-page.mjs --check` passed: 313 output paths exact, 311 generated bundles exact.
- `npx vitest run tests/layer1/alignment-gates.test.ts tests/layer1/positioning-alignment-contract.test.ts` passed: 2 files, 42 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.
- Pre-existing dirty package files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Historical Implementation - BIP Page Location And Fresh-Audience Clarity

Project: `agentic-skills`.

### Goal

Improve Build-In-Public output so generated posts are understandable to a fresh audience and stop adding top-level `alignment/bip-*.html` pages. Standardize BIP page output under a dedicated `alignment/bip/` location.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for canonical conventions, tests, generated bundles, and task docs.
- Reason: this changes shared alignment/BIP contracts, audit behavior, generated per-skill bundles, and regression tests.
- Safety boundary: do not change GitHub Actions, do not publish, and preserve pre-existing package version/manifest working-tree changes unless a required generator intentionally touches them.

### Plan

- [x] Inspect the canonical BIP convention, social-output routers, audit script, and focused tests.
- [x] Update `docs/alignment-page-convention.md` so post-confirmation BIP pages live at `alignment/bip/{skill-name}.html`.
- [x] Add fresh-audience context requirements to BIP generation: explain project/work context, define jargon, state why the work matters, and tie each post angle to an understandable public hook.
- [x] Update social post/video output-shape guidance where needed so generated candidates carry audience/context fields.
- [x] Update `scripts/audit-alignment-pages.mjs` and focused tests to enforce the new BIP path shape and clarity fields.
- [x] Regenerate alignment convention bundles and packaged assets as needed.
- [x] Run focused verification and record results.
- [x] Commit and push intended changes on `master` while preserving unrelated dirty work.

### Acceptance Criteria

- [x] Generated alignment convention text names `alignment/bip/{skill-name}.html`, including archive paths under `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/bip/{skill-name}.html`.
- [x] Active BIP audit accepts and enforces the dedicated `alignment/bip/` directory, and rejects stale top-level or old checkpoint shapes.
- [x] BIP candidates must include fresh-audience context, jargon expansion, public-facing significance, source basis, claim safety, risk level, publish precheck, loaded convention path, and recommendation status.
- [x] Central alignment index guidance treats `alignment/bip/*.html` as BIP review/help pages without making them look like new primary alignment pages.
- [x] Focused tests cover the new path and required context fields.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/audit-alignment-pages.mjs`
- `npm test -- tests/layer1/alignment-gates.test.ts tests/layer1/ship-end-bip.test.ts tests/layer1/audit-alignment-pages.test.ts`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `node scripts/upgrade-alignment-page.mjs --check` passed: 311 generated bundles exact, 313 output paths exact.
- `node scripts/audit-alignment-pages.mjs` passed: 61 active pages exact, 1 post-confirmation BIP page exact, 61 index entries exact.
- `npm test -- tests/layer1/alignment-gates.test.ts tests/layer1/ship-end-bip.test.ts tests/layer1/audit-alignment-pages.test.ts` could not run because the repo has no root `test` script.
- `npx vitest run tests/layer1/alignment-gates.test.ts tests/layer1/ship-end-bip.test.ts tests/layer1/audit-alignment-pages.test.ts` passed: 3 files, 75 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.
- BIP implementation committed and pushed on `master`: `2d6548b17 fix: standardize bip page output`.
- Pre-existing dirty package files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Paused Implementation - Create YouTube Meta Research Skill

This section is preserved from the pre-existing task state and is intentionally not part of release-prep metadata and changelog work.

## Investigation Fix: ux-variations assemble+approve chunk stop collides with alignment Pre-approval stop

**Root cause (verified).** At the chunked assemble+approve stop the alignment page is in `review`, but the chunking contract still mandates the full Progress Handoff Block, which foregrounds "Why repeat this command" + a `## Invoke With YAML` (`$ux-variations`) payload. This competes with the alignment convention's **Pre-approval stop**, which says the next action is HTML review + the page's compiled response YAML and forbids repeat/downstream routing framing. Two YAMLs (routing metadata vs. consumed response YAML) both carry `command: "$ux-variations …"`, producing the "which do I paste / why the same command" confusion. Neither convention yields at this boundary. (Note: the literal `Exact next command` line the original report cited is already banned in v0.32 — the fix targets the block's applicability + YAML precedence at the review-page stop, not that line.)

**Chosen approach.** Keep the Progress Handoff Block at the assemble-ready stop but reframe it as a review gate: foreground "Review required", drop the repeat-command framing, suppress the second `## Invoke With YAML`, present only the page's compiled response YAML. Keep completed-count + durable-cursor lines. Repeat-command framing + `Invoke With YAML` stay only for setup and per-variation stops.

- [x] Add review-gate precedence clause to the **Pre-approval stop** — `docs/alignment-page-convention.md` (~line 123) — when a chunked assemble stop's next action is the binding review gate (page in `review`), the Pre-approval stop governs over any chunk Progress Handoff repeat-command framing; present exactly one YAML (the page's compiled response YAML). Write generically for all chunked design skills.
- [x] Add assemble-ready carve-out to **§5 Progress Handoff Block** — `docs/design-tree-loop-convention.md` (~lines 454–481) — at the assemble-ready stop where the deliverable's alignment page is in `review`, the block must not foreground "repeat this command" or a `## Invoke With YAML` payload; it foregrounds "Review required" and presents only the compiled response YAML. Reserve repeat-command framing for setup + per-unit stops.
- [x] Mirror the carve-out in the codex skill — `packs/product-design/codex/ux-variations/SKILL.md` (§0c Required Progress Handoff Block lines ~82,89–92; step 8 line ~285) — assemble-ready leads with the HTML review path + single compiled response YAML; no same-command rerun line, no second YAML.
- [x] Mirror the same carve-out in the claude variant — `packs/product-design/claude/ux-variations/SKILL.md` — identical change with `/ux-variations` syntax.
- [x] Version bump (codex v0.32→v0.33, claude v0.31→v0.32; variants had diverged so each bumped one decimal step) — ran `scripts/skill-archive.sh` for both (archived codex v0.32, claude v0.31), bumped `version:` frontmatter, added `CHANGELOG.md` entries. Original path was `scripts/skill-archive.sh packs/product-design/codex/ux-variations` and `scripts/skill-archive.sh packs/product-design/claude/ux-variations`, bump `version:` frontmatter in both, add `CHANGELOG.md` entries describing the assemble-stop review-gate carve-out — behavioral change requires archive + changelog.
- [x] Regenerate bundles — ran `node scripts/upgrade-design-tree-loop.mjs` (22 `DESIGN-TREE-LOOP.md` bundles rewritten with the assemble-ready exception) and `node scripts/upgrade-alignment-page.mjs`. Note: in default mode the alignment script updates SKILL.md resolver stubs only and does **not** rewrite the legacy sibling `ALIGNMENT-PAGE.md` bundles (those are frozen fallback artifacts, not `--check`-validated by default); the alignment convention edit propagates to runtime via the packaged convention resolver, regenerated at build/publish time (`/ship`). Both `--check` gates exit 0.
- [x] Confirm no other SKILL.md hard-codes the assemble-stop framing — checked `state-model`, `ui-interview`, `user-flow-map` (both codex+claude). None hard-code emitting the full repeat-command Progress Handoff Block **at** the assemble+approve review-page stop: `state-model` §4 says "Stop for compiled YAML", `ui-interview`/`user-flow-map` say "build the one alignment page … on approval …". Their Progress Handoff Block applies to setup/per-unit/synthesis-**ready** handoffs (into the assemble session), not the review-gate stop. ux-variations was unique in its step-8 "emit the required Progress Handoff Block" at that stop. Siblings rely on the shared convention; the §5 edit (regenerated into all `DESIGN-TREE-LOOP.md` bundles) covers them. No additional SKILL.md edits needed.
- [x] Publish + manifest (done in `/ship`) — staged source first, regenerated the public catalog export (`generate-skills-catalog-export.mjs` + validate → fresh) and the index-generated `skillpacks-manifest.json` (`build:manifest`; `build:check` passed: 411 skills, 383 bundles), committed source + bundles + catalog + manifest atomically, then ran `scripts/pack.sh refresh` to republish the untracked local `.codex/skills/` `.claude/skills/` roots (gitignored, not committed).
- [x] Verify: `node scripts/upgrade-design-tree-loop.mjs --check` and `node scripts/audit-alignment-pages.mjs` both exit 0. (Also ran `node scripts/upgrade-alignment-page.mjs --check` → exit 0, and `git diff --check` → clean.)
- [x] Verify: contract grep — `rg -n "assemble-ready|Progress Handoff Block|whole-set alignment review|Invoke With YAML" packs/product-design/codex/ux-variations/SKILL.md docs/design-tree-loop-convention.md` confirms assemble-ready (SKILL.md:285, convention §5:476–481) decoupled from repeat-command/second-YAML framing; setup (234–235) + per-variation (242) stops retain it. Canonical-source acceptance replay confirmed (a) leads with HTML review path, (b) only compiled response YAML, (c) no repeat-`$ux-variations`/second-YAML/`Exact next command`, (d) retains completed-count + durable-cursor.
- [x] Verify (acceptance): confirmed on the refreshed runtime `.codex/skills/ux-variations/{SKILL,DESIGN-TREE-LOOP}.md` — SKILL.md is v0.33 with the §0c exception + step-8 carve-out (lead with HTML review path, only the compiled response YAML, no repeat-`$ux-variations`/second-YAML/`Exact next command`, retains completed-count + durable-cursor); DESIGN-TREE-LOOP.md carries the Assemble-ready review-gate exception.
- [x] Commit source + regenerated bundles + manifest together on `master` and push — commit `a81db4dc7`, pushed `a5098efa4..a81db4dc7`; scoped to these files, pre-existing untracked `.agents/skillpacks/` left untouched (concurrent-session caution).

## Historical Implementation - Shared Alignment and Interrogation HTML Scaffolds

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for CLI code, templates, tests, package metadata, and skill docs.
- Safety boundary: preserve unrelated product-design renames and pre-existing task edits; do not run install/init skillpacks commands in this source repo; do not publish.

### Plan

- [x] Inspect existing CLI namespace, package staging, and package boundary tests.
- [x] Add scaffold templates and CLI command resolution.
- [x] Update package staging and npm boundary assertions.
- [x] Update create-alignment-page and convention text for scaffold usage.
- [x] Add focused CLI and fixture audit tests.
- [x] Run verification and record results.

### Review

Verified:

- `node --test packages/skillpacks/test/alignment.test.mjs` passed: 19 tests, including alignment and interrogation scaffold fixture audits.
- `node --test packages/skillpacks/test/package-boundary.test.mjs` passed and confirmed both `assets/templates/*.html` files are in the npm tarball.
- `npm --workspace skillpacks run test:node` passed: 184 tests.
- `npm --workspace skillpacks run build:check` passed after the final docs updates.
- `npm --workspace skillpacks run pack:dry-run` passed and the dry-run tarball listed `assets/templates/alignment-page.html`, `assets/templates/interrogation-page.html`, and `src/cli/page-scaffold.mjs`.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.

## Review - Cleanup Command and BIP Removal

### Plan

- [x] Inspect `uninstall-global`, BIP config storage, docs, and tests.
- [x] Implement `cleanup` as the primary command with `uninstall-global` preserved as a compatibility alias.
- [x] Add BIP config cleanup for discovered projects, including dry-run reporting.
- [x] Update README/help/changelog with cleanup wording and canary-only experimental-feature guidance.
- [x] Add focused tests and run verification.

### Review

Verified:

- `node --test packages/skillpacks/test/lifecycle.test.mjs` passed: 63 tests.
- `node --test packages/skillpacks/test/project-config.test.mjs` passed: 25 tests.
- `node --test packages/skillpacks/test/compatibility.test.mjs` passed: 5 tests.
- `npm view skillpacks dist-tags --json` returned only `latest: 0.1.19`.
- `npm view @glexcorp/gskp dist-tags --json` returned only `latest: 0.1.19`.
- Initial `npm --workspace packages/skillpacks run test:node` exposed package test-file concurrency around `process.chdir`; changed `test:node` to `node --test --test-concurrency=1 test/*.test.mjs`.
- `npm --workspace packages/skillpacks run test:node` passed after serialization: 187 tests.
- `npm --workspace packages/skillpacks run build:check` passed.
- `git diff --check` passed.

## Current Plan - Fix Dangling Shipping Contract Pointers

### Goal

Make provisioned agent docs self-sufficient for shared shipping contract references without rewriting every per-skill stub.

### Plan

- [x] Inspect current provision skill variants, root shipping contract wording, lifecycle tests, archives, and generated package scripts.
- [x] Archive and bump both `provision-agentic-config` skill variants.
- [x] Add `### Shipping Contract Convention` to the canonical Claude and AGENTS provision blocks.
- [x] Add lifecycle coverage that generated `CLAUDE.md` and `AGENTS.md` contain the shared shipping contract pointer and rules.
- [x] Refresh generated package artifacts.
- [x] Run focused verification and record results.

### Safety Boundary

- Preserve unrelated untracked prompt-history work unless it is intentionally included in this shipping boundary.
- Do not run `npx skillpacks install`, `npx skillpacks init`, or other install/package commands to obtain skills in this source repo.
- Do not create or edit GitHub Actions.

### Review

Verified:

- `node --test packages/skillpacks/test/lifecycle.test.mjs` passed: 66 tests.
- `npm --prefix packages/skillpacks run build:check` passed; manifest check and package staging boundary both passed for 407 skills.
- `scripts/validate-skills-catalog-export.sh` passed after staging regenerated export artifacts.
- `bash scripts/skill-archive-audit.sh --strict` passed: 407 skills checked, 0 violations.
- `git diff --cached --check` passed.
- Targeted extraction check passed: both Claude and Codex `provision-agentic-config` skills expose two canonical provision blocks, and every block contains the shipping contract heading, pointer text, next-step routing, commit/push, clean tracked tree, and safety-exception rules.
- Targeted active-stub search found 352 active `SKILL.md` files still referencing `Follow the shared shipping contract convention in CLAUDE.md`.
- `packages/skillpacks/dist/skillpacks-manifest.json` now reports `provision-agentic-config` at Claude `v0.14` and Codex `v0.15`.
