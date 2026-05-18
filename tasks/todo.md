# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 41 benchmark coverage lane deferred; Phase 42 planned and ready to implement.
**Current phase:** Phase 42 — Workflow Persistent Transcript Refinement
**Total phases:** 42
**Last completed phase:** Phase 40 — Workflow Hybrid Replay Pilot

## Interrupt Task — Targeted Update `update-packages` Benchmark Actionability Threshold 2026-05-18

**Goal:** Tighten the `update-packages` benchmark quality rubric so missing batch actionability and generic migrate routes materially lower output-quality results.

**Plan:**
- [x] Review relevant lessons, benchmark-agent review evidence, existing `update-packages` contracts, and custom benchmark setup coverage.
- [x] Update `tests/layer4/setups/tier23-global-workflows.setup.ts` so `workflow-actionability` is critical for `update-packages` and target-specific migrate routes are quality-scored.
- [x] Add focused layer1 coverage for retained weak Claude-style actionability and generic migrate routes.
- [ ] Run required validation, record results, then commit and push intended changes on `master`.

## Phase 42: Workflow Persistent Transcript Refinement

> Test strategy: tests-after

**Goal:** Refine the `/workflows` hybrid replay pilot so each selected workflow behaves like one persistent ChatGPT/Claude-style terminal session instead of a card carousel.

**Source:** `specs/workflow-persistent-transcript-feature-interview.md`, `specs/ui-skills-showcase-website.md`, Phase 40 implementation evidence, and the user-confirmed design decisions from 2026-05-18.

**Scope:**
- Keep `/workflows` as the pilot surface; do not expand the pattern to homepage, catalog, or inspect routes in this phase.
- Render a selected workflow as a persistent transcript where each skill invocation is a new turn.
- Keep step controls at the top and treat them as jump controls into existing transcript turns.
- Reveal turns in the confirmed order: user command appears immediately, agent response fake-types in a ChatGPT/Claude style, then terminal/proof/artifact/receipt blocks reveal.
- Keep completed turns fully expanded while auto-scrolling the active turn into view during playback.
- Reset the transcript when changing workflows, but do not delete later turns when clicking an earlier step inside the current workflow.
- Preserve benchmark receipts and curated no-receipt states as primary proof blocks inside transcript turns.
- Preserve reduced-motion behavior by showing complete turn content without fake typing or animated scroll.

**Acceptance Criteria:**
- [ ] `/workflows` no longer remounts the active replay as a blinking step card when advancing through steps.
- [ ] Playback reveals each new workflow turn with the confirmed ChatGPT/Claude-style cadence.
- [ ] Completed turns stay fully expanded, and the active turn is followed by viewport scroll during playback.
- [ ] Step controls jump to existing turns without destructive rewind or hiding later turns.
- [ ] Workflow switching starts a fresh transcript session.
- [ ] Benchmark receipt rendering remains available for benchmarked steps, and non-benchmarked steps show clear curated/no-receipt states.
- [ ] Reduced-motion users receive complete content without fake typing or animated scroll.
- [ ] Desktop and mobile visual checks confirm no horizontal overflow, clipped proof blocks, or overlapping transcript/controls.
- [ ] Existing Skills Showcase tests, typecheck/build, generated-data validation when needed, and whitespace checks pass.

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, performance, UX

**Subagent lanes:** none

### Implementation
- [ ] Step 42.1: Replace the single active replay card with a persistent transcript model for the selected workflow.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`
  - Notes: Render revealed workflow steps as transcript turns; keep completed turns fully expanded; remove the remounting active-step card key that causes the blinking carousel feel.
- [ ] Step 42.2: Update workflow player state so step controls jump within an existing transcript session while workflow changes reset the session.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`
  - Notes: Track revealed transcript depth separately from active step focus; keep later revealed turns available when jumping to an earlier step; reset revealed depth when selecting another workflow or restarting.
- [ ] Step 42.3: Coordinate fake typing, proof-block reveal, and reduced-motion behavior for active turns.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`, modify `apps/skills-showcase/src/showcase/tui/shared/useTypewriter.ts`, modify `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`
  - Notes: Show user command immediately; fake-type the agent response; reveal terminal, artifact, and receipt blocks after the agent response; bypass typing and animated scroll for reduced-motion users.
- [ ] Step 42.4: Add transcript auto-scroll and stable benchmark/no-receipt proof rendering.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`, modify `apps/skills-showcase/src/showcase/tui/workflow.css`
  - Notes: Scroll the active transcript turn into view during playback; keep benchmark receipt metadata available for benchmarked steps; preserve curated/no-receipt states for non-benchmarked steps.
- [ ] Step 42.5: Restyle `/workflows` for persistent transcript layout across desktop and mobile.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/workflow.css`
  - Notes: Keep workflow selectors and step controls visible above the transcript; prevent horizontal overflow, clipped proof blocks, and control/transcript overlap at mobile and desktop widths.

### Green
- [ ] Step 42.6: Write regression tests covering the persistent transcript behavior.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/workflows.test.tsx`
  - Test cases: completed turns remain expanded after advancing; clicking an earlier step jumps to an existing turn without hiding later turns; workflow switching resets the transcript; benchmark receipts and curated no-receipt states render inside turns; reduced-motion shows complete content without typing delay.
- [ ] Step 42.7: Run validation and perform only concrete cleanup found by validation.
  - Classification: automated
  - Files: no planned source edits beyond fixes required by failed validation
  - Commands: `pnpm --dir apps/skills-showcase test`, `pnpm --dir apps/skills-showcase build`, `scripts/validate-skills-showcase-data.sh` if generated data changes, `git diff --check`
  - Visual checks: verify `/workflows` at desktop and mobile widths for no horizontal overflow, clipped proof blocks, or overlapping transcript/controls.

### Milestone: Phase 42 Workflow Persistent Transcript Refinement
**Acceptance Criteria:**
- [ ] `/workflows` no longer remounts the active replay as a blinking step card when advancing through steps.
- [ ] Playback reveals each new workflow turn with the confirmed ChatGPT/Claude-style cadence.
- [ ] Completed turns stay fully expanded, and the active turn is followed by viewport scroll during playback.
- [ ] Step controls jump to existing turns without destructive rewind or hiding later turns.
- [ ] Workflow switching starts a fresh transcript session.
- [ ] Benchmark receipt rendering remains available for benchmarked steps, and non-benchmarked steps show clear curated/no-receipt states.
- [ ] Reduced-motion users receive complete content without fake typing or animated scroll.
- [ ] Desktop and mobile visual checks confirm no horizontal overflow, clipped proof blocks, or overlapping transcript/controls.
- [ ] Existing Skills Showcase tests, typecheck/build, generated-data validation when needed, and whitespace checks pass.
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

## Review

- Planning source: Phase 42 in `tasks/roadmap.md` and `specs/workflow-persistent-transcript-feature-interview.md`.
- Test strategy: tests-after, because this is a UI refinement of an accepted pilot with interaction details that should be implemented before regression coverage is finalized.
- Execution profile: serial, because workflow state, fake typing, scroll behavior, proof rendering, and CSS layout share one tightly coupled component surface.
- Manual tasks: none for this phase.
- Record tasks: none for this phase.
- Recurring tasks: none for this phase.

**Next work:** Step 42.1 — replace the single active replay card with a persistent transcript model for the selected workflow.
**Recommended next command:** `$run`
