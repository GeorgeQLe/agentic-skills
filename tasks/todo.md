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

- [ ] Follow/about route converts proof interest into G, LexCorp, YouTube, X/Twitter, Discord, GitHub, and newsletter actions.
- [ ] Newsletter/email capture works with a configured provider endpoint or clearly degrades to a non-collecting fallback.
- [ ] GitHub/open-source proof telemetry is visible and does not claim live LexCorp product metrics.
- [ ] Vercel static deployment instructions and manual launch tasks are current.
- [ ] Final validation covers generated data freshness, responsive UI, accessibility/reduced-motion behavior, links, and static-route reloads.

### Execution Profile

**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** form fallback states, proof/link claims, static route behavior, deployment docs/manual tasks

**Subagent lanes:** none

### Implementation

- [ ] Step 34.1: Build the follow/about conversion route and proof/funnel preview.
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
- [ ] Step 34.2: Add static newsletter/email capture states and provider-missing fallback.
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
- [ ] Step 34.3: Present launch proof/follow telemetry and honest boundaries.
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
- [ ] Step 34.4: Add Vercel/static deployment notes and manual launch checklist.
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

No Phase 34 work has been executed yet.

## Next Work

Start Phase 34 Step 34.1 by building the follow/about conversion route and proof/funnel preview.

**Recommended next command:** `$run`
