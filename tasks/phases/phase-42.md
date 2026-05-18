# Phase 42: Workflow Persistent Transcript Refinement

**Status:** Complete on 2026-05-18.

**Goal:** Refine the `/workflows` hybrid replay pilot so each selected workflow behaves like one persistent ChatGPT/Claude-style terminal session instead of a card carousel.

**Source:** `specs/workflow-persistent-transcript-feature-interview.md`, `specs/ui-skills-showcase-website.md`, Phase 40 implementation evidence, and the user-confirmed design decisions from 2026-05-18.

## Scope

- Keep `/workflows` as the pilot surface; do not expand the pattern to homepage, catalog, or inspect routes in this phase.
- Render a selected workflow as a persistent transcript where each skill invocation is a new turn.
- Keep step controls at the top and treat them as jump controls into existing transcript turns.
- Reveal turns in the confirmed order: user command appears immediately, agent response fake-types in a ChatGPT/Claude style, then terminal/proof/artifact/receipt blocks reveal.
- Keep completed turns fully expanded while auto-scrolling the active turn into view during playback.
- Reset the transcript when changing workflows, but do not delete later turns when clicking an earlier step inside the current workflow.
- Preserve benchmark receipts and curated no-receipt states as primary proof blocks inside transcript turns.
- Preserve reduced-motion behavior by showing complete turn content without fake typing or animated scroll.

## Completed Steps

- [x] Step 42.1: Replaced the single active replay card with a persistent transcript model for the selected workflow.
- [x] Step 42.2: Updated workflow player state so step controls jump within an existing transcript session while workflow changes reset the session.
- [x] Step 42.3: Coordinated fake typing, proof-block reveal, and reduced-motion behavior for active turns.
- [x] Step 42.4: Added transcript auto-scroll and stable benchmark/no-receipt proof rendering.
- [x] Step 42.5: Restyled `/workflows` for persistent transcript layout across desktop and mobile.
- [x] Step 42.6: Wrote regression tests covering the persistent transcript behavior.
- [x] Step 42.7: Ran validation and performed concrete generated-data cleanup found by validation.

## Acceptance Criteria

- [x] `/workflows` no longer remounts the active replay as a blinking step card when advancing through steps.
- [x] Playback reveals each new workflow turn with the confirmed ChatGPT/Claude-style cadence.
- [x] Completed turns stay fully expanded, and the active turn is followed by viewport scroll during playback.
- [x] Step controls jump to existing turns without destructive rewind or hiding later turns.
- [x] Workflow switching starts a fresh transcript session.
- [x] Benchmark receipt rendering remains available for benchmarked steps, and non-benchmarked steps show clear curated/no-receipt states.
- [x] Reduced-motion users receive complete content without fake typing or animated scroll.
- [x] Desktop and mobile visual checks confirm no horizontal overflow, clipped proof blocks, or overlapping transcript/controls.
- [x] Existing Skills Showcase tests, typecheck/build, generated-data validation when needed, and whitespace checks pass.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

## Validation

- `pnpm --dir apps/skills-showcase test` passed: 8 files, 98 tests.
- `pnpm --dir apps/skills-showcase build` passed.
- `scripts/validate-skills-showcase-data.sh` initially found stale generated proof/matrix assets, regenerated them, and then passed.
- `git diff --check` passed.
- Safari desktop visual check passed for `/workflows`.
- Safari narrow mobile-width visual check passed for `/workflows`.

## On Completion

- Deviations from plan: Generated proof/matrix assets were stale and were refreshed during validation. Safari visual checks were used because no project Playwright/browser automation setup is configured, and Safari JavaScript-from-Apple-Events is disabled for direct DOM width assertions.
- Tech debt / follow-ups: Phase 41 benchmark result coverage remains deferred and should resume with Batch 41.1.
- Ready for next phase: yes. Phase 41 remaining benchmark result coverage is the next active work.
