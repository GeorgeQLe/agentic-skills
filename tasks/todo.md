# Active Phase: Phase 33 - Skills Showcase Workflow Experience

**Project:** Claude Skills / agentic-skills
**Current phase:** Phase 33 of 34
**Status:** Active as of 2026-05-07.

## Phase 33: Skills Showcase Workflow Experience
> Test strategy: tests-after

### Goal

Build the user-facing product experience on top of the Phase 32 foundation: animated workflow explanations, pack map, generated catalog interactions, proof UI, and accessible responsive page behavior.

### Source

`specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`, and the completed Phase 32 static shell/data contracts.

### Scope

- Implement the homepage previews and full workflow, pack, catalog, and inspect route experiences.
- Build browser-native animations for the eight curated workflows: first successful cycle, pack selection, plan -> run -> ship, spec -> roadmap -> implementation, research chains, hybrid handoff, skill authoring, and validation/troubleshooting.
- Implement the pack map, project-type highlighter, generated catalog search/filter/expand controls, and proof receipt links.
- Honor reduced-motion, keyboard, focus, and mobile layout requirements.
- Keep all factual counts and skill claims tied to generated data or clearly marked static receipts.

### Acceptance Criteria

- [ ] Every curated workflow has selectable text, steps, artifacts, and a non-video browser-native animation or static reduced-motion fallback.
- [ ] Pack map distinguishes global core, packs, overlays, and compatibility aliases with usable mobile behavior.
- [ ] Catalog search, filtering, result counts, asymmetry labels, and expandable rows work against generated skill data.
- [ ] Inspect/proof UI links to public GitHub receipts and validation artifacts.
- [ ] Desktop, tablet, and mobile layouts avoid overlap and meet the UI spec's accessibility states.
- [ ] Focused frontend and data validation passes.

### Execution Profile

**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** generated-data rendering, interaction states, responsive UI, accessibility/reduced-motion behavior

**Subagent lanes:** none

### Implementation

- [ ] Step 33.1: Wire generated catalog and proof data into the static routes.
  - Files: modify `docs/skills-showcase/app.js`, `docs/skills-showcase/catalog/index.html`, `docs/skills-showcase/inspect/index.html`, `docs/skills-showcase/packs/index.html`, `docs/skills-showcase/styles.css`
  - Implementation plan:
    - Replace placeholder catalog rows with rendering from `window.SKILLS_SHOWCASE_DATA.skills`, including search, platform/type/scope filters, result counts, asymmetry labels for one-platform skills, and expandable detail rows with source paths.
    - Render pack summaries from `window.SKILLS_SHOWCASE_DATA.packs` on the packs route and keep labels tied to generated pack metadata rather than hard-coded counts.
    - Render proof artifacts, validation scripts, fallback/refreshed GitHub metadata, and boundary language from `window.SKILLS_SHOWCASE_GITHUB_PROOF_DATA` on the inspect route.
    - Keep the site static: no runtime API, database, GitHub Actions workflow, root dependency, video, Remotion build, visitor analytics, or live LexCorp metrics.
    - Preserve direct-reloadable route behavior and shared CSS/JS foundations from Phase 32.
  - Verification plan:
    - Run `node --check docs/skills-showcase/app.js`.
    - Run `scripts/validate-skills-showcase-data.sh`.
    - Run targeted `rg` checks that catalog, pack, and proof route placeholders were replaced with generated-data hooks and that generated browser globals are referenced.
    - Use browser or screenshot verification when interaction/rendering changes need visual proof; at minimum test desktop and mobile widths for text overlap and nonblank generated lists.
    - Run `git diff --check`.
- [ ] Step 33.2: Build workflow lab content and browser-native animations.
  - Files: modify `docs/skills-showcase/index.html`, `docs/skills-showcase/workflows/index.html`, `docs/skills-showcase/app.js`, `docs/skills-showcase/styles.css`
  - Implementation plan:
    - Define eight curated workflow narratives with steps, artifacts, commands, and static reduced-motion fallbacks.
    - Implement selectable workflow lab controls and browser-native animation states without video or Remotion.
    - Reuse generated data where counts or skill names are factual; keep curated explanatory text clearly static.
    - Honor keyboard navigation, focus states, and `prefers-reduced-motion`.
  - Verification plan:
    - Run `node --check docs/skills-showcase/app.js`.
    - Run browser/screenshot checks for desktop and mobile workflow states, including reduced-motion fallback where practical.
    - Run targeted `rg` checks for the eight workflow names and animation/reduced-motion hooks.
    - Run `git diff --check`.
- [ ] Step 33.3: Improve pack map and route-level responsive behavior.
  - Files: modify `docs/skills-showcase/packs/index.html`, `docs/skills-showcase/styles.css`, `docs/skills-showcase/app.js`
  - Implementation plan:
    - Build the pack map from generated pack data plus curated overlay/compatibility annotations.
    - Add project-type highlighter behavior and usable mobile navigation for global core, domain packs, overlays, and aliases.
    - Tighten responsive constraints so cards, controls, generated rows, and route headers do not overlap on mobile or desktop.
  - Verification plan:
    - Run `node --check docs/skills-showcase/app.js`.
    - Run desktop/mobile browser or screenshot checks for packs route layout and controls.
    - Run targeted route/content checks.
    - Run `git diff --check`.
- [ ] Step 33.4: Final Phase 33 frontend/data validation.
  - Files: modify `tasks/todo.md`, `tasks/history.md`
  - Implementation plan:
    - Run `scripts/validate-skills-showcase-data.sh`, `node --check docs/skills-showcase/app.js`, and focused browser/screenshot validation across home, workflows, packs, catalog, inspect, and follow routes.
    - Verify keyboard/focus/reduced-motion behavior for the new interactions.
    - Check all Phase 33 acceptance criteria and record residual risks or manual follow-ups.
    - If complete, archive Phase 33 and prepare Phase 34 according to the phase-transition workflow.
  - Verification plan:
    - Run the commands above plus `git diff --check`.
    - Record screenshot/browser evidence summary in the review notes.

### Green / Verification

- [ ] Run `scripts/validate-skills-showcase-data.sh`.
- [ ] Run `node --check docs/skills-showcase/app.js`.
- [ ] Run browser/screenshot validation for generated catalog, packs, proof, and workflow interactions on desktop and mobile.
- [ ] Run targeted route/content scans.
- [ ] Run `git diff --check`.

### Manual Tasks

No manual tasks block Phase 33. Vercel deployment and newsletter provider setup are planned for Phase 34 after source implementation and local validation.

### Review

No Phase 33 work has shipped yet.

## Next Work

Start Step 33.1 by wiring generated catalog and proof data into the static showcase routes.

**Recommended next command:** `$run`
