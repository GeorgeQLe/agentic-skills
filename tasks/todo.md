# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 41 benchmark coverage lane deferred; Phase 42 planned and ready to implement.
**Current phase:** Phase 42 — Workflow Persistent Transcript Refinement
**Total phases:** 42
**Last completed phase:** Phase 40 — Workflow Hybrid Replay Pilot

## Interrupt Task — Benchmark `update-packages` After Actionability Threshold 2026-05-18

**Goal:** Run `$benchmark-test-skill update-packages` against the current repository state and publish deterministic both-agent benchmark evidence after the benchmark actionability threshold update.

**Plan:**
- [ ] Confirm `benchmark-test-skill` is the active workflow and `update-packages` is only the benchmark target.
- [ ] Run `pnpm bench --list-skills` from `tests/` and confirm `update-packages` is known, not blocked, and note its coverage status.
- [ ] Run `pnpm verify --skill update-packages`; stop without benchmarking if verify fails.
- [ ] Run `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0` only after verify passes.
- [ ] Write and validate `benchmark/test-update-packages-2026-05-18.md`, update this review section, refresh generated evidence if needed, then commit and push intended changes.

## Interrupt Task — Targeted Update `update-packages` Benchmark Actionability Threshold 2026-05-18

**Goal:** Tighten the `update-packages` benchmark quality rubric so missing batch actionability and generic migrate routes materially lower output-quality results.

**Plan:**
- [x] Review relevant lessons, benchmark-agent review evidence, existing `update-packages` contracts, and custom benchmark setup coverage.
- [x] Update `tests/layer4/setups/tier23-global-workflows.setup.ts` so `workflow-actionability` is critical for `update-packages` and target-specific migrate routes are quality-scored.
- [x] Add focused layer1 coverage for retained weak Claude-style actionability and generic migrate routes.
- [x] Run required validation, record results, then commit and push intended changes on `master`.

## Review — Targeted Update `update-packages` Benchmark Actionability Threshold 2026-05-18

- Decision: existing benchmark setup update, not a new skill or skill-contract change. The mirrored `update-packages` contracts already require per-batch mutation command/edit, verification command, expected proof/artifact, and stop gate.
- Evidence used: `tasks/lessons.md`, `benchmark/review-update-packages-2026-05-18.md`, current `global/codex/update-packages/SKILL.md`, current Tier 2/3 setup, and focused layer1 coverage.
- Evidence intentionally skipped: broad session history, because the benchmark-agent review already isolated the gap to deterministic quality-rubric calibration.
- Existing-skill overlap: `update-packages` owns dependency update planning; the durable fix is benchmark quality calibration, not a duplicate workflow.
- Updated `tests/layer4/setups/tier23-global-workflows.setup.ts` so `workflow-actionability` is critical for `update-packages`.
- Added `workflow-targeted-migration-routes` quality scoring so bare `/migrate` or `$migrate` routes lose quality credit when a target package/tool is known.
- Added focused layer1 coverage that keeps strong retained checklist shapes passing, marks weak retained Claude-style batch/actionability shapes as critical quality failures, and lowers quality for generic migrate routes.
- Validation passed: `./install.sh`; `./scripts/skill-deps.sh --broken`; `./scripts/skill-versions.sh --missing`; `./scripts/skill-next-step-routing.sh --missing`; `pnpm --dir tests exec vitest run --project layer1 bench-setups`; `pnpm --dir tests bench:coverage`; `pnpm --dir tests verify --skill update-packages`; targeted `rg`; `git diff --check`.
- Generated Skills Showcase data was not refreshed because no tracked `SKILL.md`, `PACK.md`, curated benchmark report, or curated review report changed.
- **Recommended next command:** `$benchmark-test-skill update-packages`

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
- [x] Step 42.1: Replace the single active replay card with a persistent transcript model for the selected workflow.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`
  - Notes: Render revealed workflow steps as transcript turns; keep completed turns fully expanded; remove the remounting active-step card key that causes the blinking carousel feel.
- [x] Step 42.2: Update workflow player state so step controls jump within an existing transcript session while workflow changes reset the session.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`
  - Notes: Track revealed transcript depth separately from active step focus; keep later revealed turns available when jumping to an earlier step; reset revealed depth when selecting another workflow or restarting.
  - Implementation plan:
    - Add a revealed-depth state value to `useWorkflowPlayer` that records the furthest step shown in the current workflow session.
    - Make `nextStep` and autoplay advance both active focus and revealed depth.
    - Make `goToStep` change only active focus when the target step is already revealed, without lowering revealed depth or hiding later turns.
    - Reset active focus and revealed depth to the first turn on `selectWorkflow` and `restart`.
    - Return the revealed-depth value to `TuiWorkflow` so the transcript can render all revealed turns while highlighting the focused step.
- [ ] Step 42.3: Coordinate fake typing, proof-block reveal, and reduced-motion behavior for active turns.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`, modify `apps/skills-showcase/src/showcase/tui/shared/useTypewriter.ts`, modify `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`
  - Notes: Show user command immediately; fake-type the agent response; reveal terminal, artifact, and receipt blocks after the agent response; bypass typing and animated scroll for reduced-motion users.
  - Implementation plan:
    - Inspect the existing typewriter hook and active workflow turn rendering to identify the smallest state needed for staged reveal.
    - Wire the active transcript turn so the user command renders immediately and the agent response receives typed text only while motion is allowed.
    - Add completion state that reveals terminal, artifact, and receipt/proof blocks only after the active agent response finishes.
    - Make reduced-motion mode render complete active-turn content immediately and avoid timers that would delay proof visibility.
    - Keep already completed turns fully expanded and avoid changing the revealed-depth behavior introduced in Step 42.2.
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
- Step 42.1 completed on 2026-05-18.
- Step 42.2 completed on 2026-05-18.

### Step 42.2 Ship Manifest

- **User goal:** Execute `$run` for Step 42.2, updating `/workflows` player state so step controls jump within an existing transcript session while workflow changes reset the session.
- **Changed files:** `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`; `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`; `apps/skills-showcase/src/showcase/workflows.test.tsx`; `tasks/todo.md`; `tasks/history.md`; pre-existing task-planning edits in `tasks/roadmap.md` and `tasks/todo.md` are preserved in the same shipping boundary.
- **Per-file purpose:** `useWorkflowPlayer.ts` now tracks `revealedStep` separately from `activeStep`; `TuiWorkflow.tsx` renders transcript turns through `revealedStep` while highlighting `activeStep`; `workflows.test.tsx` covers the backward-jump transcript persistence regression; `tasks/todo.md` records completion, review, and the next-step plan; `tasks/history.md` records the shipped work; `tasks/roadmap.md` already contained the update-packages benchmark interrupt plan before this step and is not changed by the implementation.
- **User-goal mapping:** Separating revealed transcript depth from active focus lets a user click an earlier step without destructively hiding later revealed turns, while `selectWorkflow` and `restart` reset both values to a fresh first-turn session.
- **Tests run:** `pnpm --dir apps/skills-showcase test -- workflows.test.tsx` failed once because the new test used an ambiguous counter text query; fixed the test query and reran successfully with 8 files and 93 tests passing. `pnpm --dir apps/skills-showcase build` passed. `pnpm --dir apps/skills-showcase typecheck` initially failed when run concurrently with build because `.next/types/validator.ts` could not find generated `routes.js`; reran after build completed and it passed. `git diff --check` passed.
- **Skipped tests:** Full app test suite was not rerun because the changed behavior is covered by the focused workflows suite, the build includes TypeScript validation, and Step 42.7 remains the planned phase-wide validation and visual-check step. Generated Skills Showcase data validation was skipped because no generated data, `SKILL.md`, `PACK.md`, curated benchmark report, or curated review report changed.
- **Adversarial review:** Diff-aware self-review checked whether `revealedStep` resets on workflow switch and restart, whether next/autoplay advance transcript depth, whether backward navigation preserves later turns, and whether benchmark receipt lookup still keys by original step index. Finding fixed: the added regression test originally queried duplicate counter text from both legacy and TUI workflow surfaces; it now uses a broader count assertion while the behavior assertions target accessible replay labels.
- **Residual risk:** Autoplay still wraps active focus from the last step to the first while keeping all turns revealed. That preserves the Step 42.2 no-destructive-rewind goal, but the final playback cadence and scroll behavior are still unfinished and are explicitly covered by Steps 42.3 and 42.4.
- **Rollback note:** Revert the Step 42.2 commit to collapse transcript rendering back to `activeStep + 1` and remove the focused regression test.
- **Next command:** `$run`

### Step 42.1 Ship Manifest

- **User goal:** Execute `$run` for Step 42.1, replacing the single remounting `/workflows` active replay card with a persistent transcript model for revealed workflow steps.
- **Changed files:** `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`; `apps/skills-showcase/src/showcase/tui/workflow.css`; `tasks/todo.md`; `tasks/history.md`.
- **Per-file purpose:** `TuiWorkflow.tsx` now renders workflow steps `0..activeStep` as transcript turns with per-step receipt and benchmark badge state; `workflow.css` adds the transcript wrapper spacing needed by the new list; `tasks/todo.md` records completion, review, and the next-step plan; `tasks/history.md` records the shipped work.
- **User-goal mapping:** The keyed single active card was removed, so forward playback keeps prior turns mounted and expanded instead of replacing the visible replay surface.
- **Tests run:** `pnpm --dir apps/skills-showcase test -- workflows.test.tsx` passed; `pnpm --dir apps/skills-showcase test` passed; `pnpm --dir apps/skills-showcase typecheck` passed; `pnpm --dir apps/skills-showcase build` passed; `git diff --check` passed.
- **Skipped tests:** Browser visual checks are deferred to Step 42.7, where the phase explicitly verifies desktop and mobile layout after the remaining player-state, reveal-cadence, scroll, and styling changes land. Generated Skills Showcase data validation was skipped because no generated data, `SKILL.md`, `PACK.md`, curated benchmark report, or curated review report changed.
- **Adversarial review:** Diff-aware self-review checked whether per-step benchmark receipts still use each step index, whether old replay labels remain accessible for tests, whether previous turns stay mounted on forward progress, and whether the extra CSS file is justified. Finding: Step 42.1 still hides later turns when jumping back because player state only has `activeStep`; accepted as planned residual scope for Step 42.2.
- **Residual risk:** Until Step 42.2, dot navigation to an earlier step still lowers the rendered transcript depth because `activeStep` is the only depth signal. This is visible to `/workflows` users who jump backward after advancing, and Step 42.2 is the explicit follow-up.
- **Rollback note:** Revert the Step 42.1 commit to restore the single active replay card and remove `.tui-workflow__transcript`.
- **Next command:** `$run`

**Next work:** Step 42.3 — coordinate fake typing, proof-block reveal, and reduced-motion behavior for active turns.
**Recommended next command:** `$run`

## Benchmark: update-packages Fresh Run

**Goal:** Run `$benchmark-test-skill update-packages` for a fresh deterministic benchmark report dated 2026-05-18.

**Scope:**
- Confirm `update-packages` is known to the benchmark harness and note its coverage status.
- Run `pnpm verify --skill update-packages`.
- If verify passes, run `pnpm bench --skill update-packages --agent both --runs 3 --chunk-size 3 --pause 0`.
- Write `benchmark/test-update-packages-2026-05-18.md` from persisted benchmark output.
- Validate that the report includes target, agent rows, pass-rate or blocked-run data, latency, cost, raw session path, and a literal recommended next route.

### Execution
- [x] Step B.1: Confirm benchmark command resolution and harness eligibility.
- [ ] Step B.2: Run verify gate for `update-packages`.
- [ ] Step B.3: Run both-agent benchmark if verify passes.
- [ ] Step B.4: Write and validate the dated benchmark report.
- [ ] Step B.5: Commit and push intended benchmark/report changes.

### Review

- Command resolution: `$benchmark-test-skill` resolved to `packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md`; `update-packages` is the target skill argument.
- Eligibility: `update-packages` is listed with `coverage=custom` and setup `tests/layer4/setups/tier23-global-workflows.setup.ts`.
