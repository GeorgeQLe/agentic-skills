# Active Phase: Phase 34 - Skills Showcase Distribution Launch

**Project:** Claude Skills / agentic-skills
**Current phase:** Phase 34 of 34
**Status:** Planned as of 2026-05-08.

## Phase 34: Skills Showcase Distribution Launch
> Test strategy: tests-after

### Goal

Finish the top-of-funnel launch surface: G/LexCorp/community conversion paths, newsletter/email capture, GitHub/open-source proof telemetry presentation, deployment guidance, and final launch validation.

### Source

`specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`, and the completed Phase 32-33 static showcase foundation.

### Scope

- Build the follow/about route with G, LexCorp, YouTube, X/Twitter, Discord, GitHub, and newsletter/email capture CTAs.
- Integrate static newsletter/email capture with provider-missing, pending, success, error, and invalid-email states.
- Present generated GitHub/open-source proof data honestly without implying live LexCorp metrics.
- Add deployment notes for Vercel static hosting and manual launch checks.
- Run final local/browser/static validation and document launch readiness.

### Acceptance Criteria

- [x] Follow/about route converts proof interest into G, LexCorp, YouTube, X/Twitter, Discord, GitHub, and newsletter actions.
- [x] Newsletter/email capture works with a configured provider endpoint or clearly degrades to a non-collecting fallback.
- [x] GitHub/open-source proof telemetry is visible and does not claim live LexCorp product metrics.
- [x] Vercel static deployment instructions and manual launch tasks are current.
- [ ] Final validation covers generated data freshness, responsive UI, accessibility/reduced-motion behavior, links, and static-route reloads.

### Execution Profile

**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** form fallback states, proof/link claims, static route behavior, deployment docs/manual tasks

**Subagent lanes:** none

### Implementation

- [x] Step 34.1: Build the follow/about conversion route and proof/funnel preview.
  - Files: modify `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/styles.css`, `docs/skills-showcase/app.js`
  - Implementation plan:
    - Replace the Phase 32 follow placeholder with a launch-oriented route for G, LexCorp, YouTube, X/Twitter, Discord, GitHub, and newsletter actions.
    - Add proof-to-follow copy and route-level sections that connect generated skill coverage and workflow proof to the conversion choices.
    - Keep the route static, direct-reloadable, accessible, and honest about unavailable live metrics.
  - Verification plan:
    - Run `node --check docs/skills-showcase/app.js`.
    - Run route/content scans for the expected CTAs and proof/funnel hooks.
    - Browser-check desktop and mobile follow route layout.
    - Run `git diff --check`.
- [x] Step 34.2: Add static newsletter/email capture states and provider-missing fallback.
  - Files: modify `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/app.js`, `docs/skills-showcase/styles.css`
  - Implementation plan:
    - Add a static newsletter form contract with invalid-email, pending, success, error, and provider-missing states.
    - Avoid collecting email when no provider endpoint is configured; explain the fallback through UI state rather than hidden assumptions.
    - Keep the provider endpoint configurable without adding a runtime API, database, root dependency, or GitHub Actions workflow.
  - Verification plan:
    - Run `node --check docs/skills-showcase/app.js`.
    - Browser-check invalid email, missing-provider, and configured-endpoint simulation paths where static behavior permits.
    - Run targeted scans for fallback-state copy and no runtime API/dependency additions.
    - Run `git diff --check`.
- [x] Step 34.3: Present launch proof/follow telemetry and honest boundaries.
  - Files: modify `docs/skills-showcase/inspect/index.html`, `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/app.js`, `docs/skills-showcase/styles.css`
  - Implementation plan:
    - Strengthen generated proof presentation around public GitHub/local evidence, validation artifacts, route freshness, and clear metric boundaries.
    - Cross-link inspect and follow routes so interested visitors can move from proof receipts to community/follow/newsletter actions.
    - Keep LexCorp/community claims static and bounded; do not imply live product analytics.
  - Verification plan:
    - Run `scripts/validate-skills-showcase-data.sh`.
    - Run `node --check docs/skills-showcase/app.js`.
    - Browser-check inspect and follow route proof/CTA links.
    - Run `git diff --check`.
- [x] Step 34.4: Add Vercel/static deployment notes and manual launch checklist.
  - Files: add or modify `tasks/deploy.md`, `tasks/manual-todo.md`, `tasks/todo.md`
  - Implementation plan:
    - Record the explicit manual deploy contract for hosting `docs/skills-showcase/` as a static site.
    - Keep newsletter provider and Vercel setup as manual launch tasks with clear after-step timing.
    - Avoid GitHub Actions or implicit CI/CD assumptions.
  - Verification plan:
    - Run targeted scans for deploy root/output settings, manual task entries, and the no-GitHub-Actions boundary.
    - Run `git diff --check`.
- [ ] Step 34.5: Final Phase 34 launch validation and phase transition.
  - Files: modify `tasks/todo.md`, `tasks/history.md`, `tasks/roadmap.md`, `tasks/phases/phase-34.md`
  - Implementation plan:
    - Run final generated-data, syntax, static-route, link/CTA, reduced-motion, desktop, and mobile validation.
    - Confirm manual launch tasks are current and no hidden deployment/provider assumptions remain.
    - Archive Phase 34 and document MVP readiness or the exact remaining blocker.
  - Verification plan:
    - Run all Green commands below.
    - Record launch-readiness evidence and residual risks in the review notes.

### Green / Verification

- [ ] Run `scripts/validate-skills-showcase-data.sh`.
- [ ] Run `node --check docs/skills-showcase/app.js`.
- [ ] Run static route reload checks across `/`, `/workflows/`, `/packs/`, `/catalog/`, `/inspect/`, and `/follow/`.
- [ ] Run browser desktop/mobile checks for follow form states, proof links, navigation, and responsive layout.
- [ ] Run link/CTA scans for G, LexCorp, YouTube, X/Twitter, Discord, GitHub, and newsletter actions.
- [ ] Run `git diff --check`.

### Manual Tasks

Manual launch tasks are tracked in `tasks/manual-todo.md`.

### Review

#### 2026-05-08 - Step 34.1 follow/about conversion route

**User goal:** Execute Phase 34 Step 34.1 by replacing the follow placeholder with a static launch-oriented route for G, LexCorp, community, GitHub, and newsletter preview actions.

**Changed files:** `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/styles.css`, `docs/skills-showcase/app.js`, `tasks/todo.md`, `tasks/history.md`.

**Per-file purpose:** `follow/index.html` now contains the conversion route, static proof/funnel preview, honest LexCorp metric boundaries, external CTAs, and disabled newsletter preview. `styles.css` adds scoped follow cards, proof stats, receipt grid, newsletter preview, and responsive grid behavior. `app.js` renders follow-route proof stats and receipt cards from generated static proof data. Task/history files record execution and next work.

**User-goal mapping:** The follow route now routes visitors to G, LexCorp, YouTube, X/Twitter, Discord, GitHub, inspect, catalog, and newsletter-preview actions without implying live LexCorp metrics or collecting email before Step 34.2.

**Tests run:** `scripts/validate-skills-showcase-data.sh` passed and rewrote generated data with no diff. `node --check docs/skills-showcase/app.js` passed. Targeted `rg` scans confirmed expected CTAs, proof boundaries, provider-missing/non-collecting copy, and data hooks. `curl -sS -I http://localhost:8765/follow/` returned `HTTP/1.0 200 OK`. `curl -sS http://localhost:8765/follow/` confirmed the static route body loads. `git diff --check` passed.

**Skipped tests:** Programmatic desktop/mobile browser smoke was attempted through the Node browser runtime, but `playwright` is not installed. Full viewport/browser validation remains covered by Step 34.5 final launch validation; this step still has executable syntax, content, generated-data, HTTP route, and diff checks.

**Adversarial review:** Diff-aware self-review checked that the route does not claim live LexCorp metrics, the newsletter preview is disabled/non-collecting, proof cards consume only generated static data, CSS changes are scoped to follow-specific classes, and responsive rules collapse new grids. One accidental footer-link selector expansion was found and fixed before validation.

**Residual risk:** Without an installed browser runtime, visual spacing and overflow on real desktop/mobile viewports still need final browser confirmation in Step 34.5. The most likely issue would be copy density in the follow hero or proof cards, not data loss or collection behavior.

**Rollback note:** Revert the Step 34.1 commit to restore the placeholder follow route and remove the follow proof renderer/styles.

**Next command:** `$run`

#### 2026-05-08 - Step 34.4 Vercel static deployment contract

**User goal:** Execute Phase 34 Step 34.4 by adding current Vercel/static deployment instructions and manual launch checklist tasks without introducing GitHub Actions or implicit CI/CD.

**Changed files:** `tasks/deploy.md`, `tasks/manual-todo.md`, `tasks/todo.md`, `tasks/history.md`.

**Per-file purpose:** `tasks/deploy.md` records the explicit manual deploy contract for hosting `docs/skills-showcase/` on Vercel as a static site. `tasks/manual-todo.md` now separates provider endpoint setup from Vercel project setup with after-step timing and exact Vercel settings. `tasks/todo.md` marks Step 34.4 and the deployment acceptance criterion complete with this manifest. `tasks/history.md` records the shipped task.

**User-goal mapping:** The project now has a concrete deploy contract that says root `docs/skills-showcase/`, no build command, no install command, output directory `.`, no runtime API, no database, no GitHub Actions, and manual route/link verification.

**Tests run:** Targeted scans confirmed `tasks/deploy.md` contains Vercel provider, `docs/skills-showcase/` root, no build/install commands, output directory `.`, no runtime API/database/GitHub Actions, newsletter provider instructions, and route reload checks. Targeted scans confirmed `tasks/manual-todo.md` has newsletter provider and Vercel setup tasks with `after:` timing. `git diff --check` passed.

**Skipped tests:** No executable app checks were required because this step only changes deployment/task documentation and does not alter source, generated assets, scripts, or runtime behavior.

**Adversarial review:** Diff-aware self-review checked that the contract does not create or suggest GitHub Actions, does not imply automatic deployment, keeps production launch manual, and does not ask for a backend/database/analytics.

**Residual risk:** Actual Vercel UI labels may vary slightly, and the selected newsletter provider may require provider-specific fields. Those are manual launch tasks after this source contract and should be verified before production launch.

**Rollback note:** Revert the Step 34.4 commit to remove `tasks/deploy.md` and restore prior manual launch task wording.

**Next command:** `$run`

#### 2026-05-08 - Step 34.3 launch proof/follow telemetry boundaries

**User goal:** Execute Phase 34 Step 34.3 by making GitHub/open-source proof telemetry visible across inspect and follow while keeping LexCorp/community/newsletter claims static and bounded.

**Changed files:** `docs/skills-showcase/inspect/index.html`, `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/app.js`, `docs/skills-showcase/styles.css`, `docs/skills-showcase/assets/skills-data.js`, `docs/skills-showcase/assets/github-proof-data.js`, `tasks/todo.md`, `tasks/history.md`.

**Per-file purpose:** `inspect/index.html` now adds proof-to-follow CTAs, a generated telemetry summary slot, and explicit static-proof limitations. `follow/index.html` expands proof-funnel copy to include route freshness, GitHub fallback status, and newsletter-performance boundaries. `app.js` renders inspect proof summary telemetry, extra boundary rows, and follow-side GitHub enrichment cards from generated proof data. `styles.css` adds scoped proof summary styling. Generated assets were refreshed because validation found stale fingerprints/history/skill metadata. Task/history files record execution and next work.

**User-goal mapping:** Visitors can now move from proof receipts to follow/community actions, and both routes state that static telemetry proves repository artifacts, validation commands, freshness, and fallback behavior only, not live LexCorp adoption, visitor analytics, community membership, or newsletter performance.

**Tests run:** `scripts/validate-skills-showcase-data.sh` initially failed with stale generated assets, then passed after regeneration. `node --check docs/skills-showcase/app.js` passed. Targeted `rg` scans confirmed proof summary text, inspect/follow cross-links, GitHub fallback language, and no-live-metric boundaries. Local HTTP HEAD checks for `/inspect/` and `/follow/` returned `HTTP/1.0 200 OK`. `git diff --check` passed.

**Skipped tests:** Full browser screenshot/interaction checks remain deferred to Step 34.5 final validation because the local Node runtime still lacks Playwright. This step has executable generated-data freshness, syntax, route-load, content-boundary, and whitespace checks.

**Adversarial review:** Diff-aware self-review checked that new telemetry counts come from generated proof arrays, GitHub enrichment is labeled optional/fallback, follow/community/newsletter actions are explicitly not measured outcomes, generated asset changes are freshness-only output, and no live analytics or LexCorp metric claims were introduced.

**Residual risk:** The static proof summary depends on generated proof data being present; if the asset is missing, the existing inspect missing-data notice still handles the failure, but the summary aside remains empty. Final route/browser validation should confirm the empty-state layout if assets are removed or blocked.

**Rollback note:** Revert the Step 34.3 commit to remove the proof summary/cross-link copy and restore the previous generated assets.

**Next command:** `$run`

#### 2026-05-08 - Step 34.2 newsletter static provider contract

**User goal:** Execute Phase 34 Step 34.2 by adding static newsletter/email capture states and a provider-missing fallback without adding a runtime API, database, root dependency, or GitHub Actions workflow.

**Changed files:** `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/app.js`, `docs/skills-showcase/styles.css`, `tasks/todo.md`, `tasks/history.md`.

**Per-file purpose:** `follow/index.html` now exposes a static newsletter form with `data-provider-endpoint`, accessible email input, submit button, provider-missing/invalid/pending/success/error state labels, live status copy, and provider configuration note. `app.js` validates email, prevents default submission, avoids network calls when no endpoint is configured, posts to a configured static provider endpoint only, and renders pending/success/error states. `styles.css` adds scoped newsletter layout, invalid input styling, active state tags, and status borders. Task/history files record completion and next work.

**User-goal mapping:** The route can now degrade honestly to a non-collecting fallback by default, while the manual launch operator can later configure a static provider endpoint without code architecture changes.

**Tests run:** `node --check docs/skills-showcase/app.js` passed. Targeted `rg` scans confirmed `data-newsletter-form`, `data-provider-endpoint`, provider-missing, invalid-email, pending, success, error, non-collecting copy, `fetch`, `URLSearchParams`, and `FormData` coverage. A forbidden-surface scan over the changed showcase files found no API/server/database/Supabase/Neon/GitHub Actions/package-manager additions. `curl -sS -I http://127.0.0.1:8766/follow/` returned `HTTP/1.0 200 OK`. `git diff --check` passed.

**Skipped tests:** Full browser interaction testing was not run because the available Node runtime still lacks Playwright, and repeated body fetches from the temporary static server failed after the first successful HEAD check despite the server process staying up. Step 34.5 retains the full desktop/mobile browser validation gate; this step has source-level state coverage, syntax validation, route HEAD validation, and no-backend scans.

**Adversarial review:** Diff-aware self-review checked that the default form has an empty endpoint, the no-endpoint submit path returns before `fetch`, email is never written to repository files or a local backend, configured-provider submission is isolated to `fetch(providerEndpoint)`, and all required states have visible labels and status styling. Residual concern is limited to visual/interactive browser confirmation.

**Residual risk:** The configured-provider branch depends on the eventual provider accepting `application/x-www-form-urlencoded` `email` submissions. If the selected provider requires extra hidden fields or JSON, the manual provider setup task after Step 34.2 must update the static form attributes or provider configuration.

**Rollback note:** Revert the Step 34.2 commit to restore the provider-pending preview while keeping the Step 34.1 follow route.

**Next command:** `$run`

## Next Work

Start Phase 34 Step 34.5 by running final launch validation and phase transition.

**Recommended next command:** `$run`
