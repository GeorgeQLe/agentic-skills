# Phase 40: Workflow Hybrid Replay Pilot

**Status:** Complete on 2026-05-17.

**Goal:** Turn the `/workflows` Playful Lab into a hybrid chat-and-terminal replay pilot where step circles drive a benchmark-grounded recreation of successful skill runs.

**Source:** `specs/workflow-hybrid-replay-feature-interview.md` and the updated `/workflows` section of `specs/ui-skills-showcase-website.md` from 2026-05-17.

## Scope

- Replace the primary selected-step surface in `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx` with a hybrid replay panel for `/workflows`.
- Keep `/workflows` as the pilot surface only.
- Model workflow steps as structured replay states instead of expanding positional tuple fields.
- Render chat-style user and agent messages with embedded terminal, validation, artifact, and benchmark-proof blocks.
- Promote benchmark evidence from collapsed details into visible receipt blocks when persisted evidence exists.
- Preserve graceful non-benchmarked step states, reduced-motion behavior, keyboard-accessible controls, and mobile overflow safety.

## Completed Steps

- [x] Step 40.1: Defined structured replay data for workflow steps.
- [x] Step 40.2: Replaced the active step card with the hybrid replay panel.
- [x] Step 40.3: Promoted benchmark receipts into the visible replay.
- [x] Step 40.4: Styled and hardened the `/workflows` replay pilot.
- [x] Step 40.5: Added focused regression coverage for replay data, navigation, receipts, and no-receipt states.
- [x] Step 40.6: Ran app validation and desktop/mobile visual sanity checks.

## Acceptance Criteria

- [x] `/workflows` renders a hybrid replay panel as the primary selected-step surface.
- [x] Step circles change the active replay state and expose user prompt/command, agent response, artifact/result, and proof content for each step.
- [x] Benchmarked steps show visible pass-rate, quality, agent/run metadata, and report/run artifact paths without requiring a collapsed details panel.
- [x] Non-benchmarked steps render curated scenario transcript content and a clear no-receipt state.
- [x] The implementation uses structured replay data rather than adding more positional fields to `WorkflowStep`.
- [x] Mobile layouts constrain chat, command, report path, and benchmark output blocks without horizontal page overflow.
- [x] Focused component/data tests, typecheck, build, and whitespace validation pass.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

## Validation

- `pnpm --dir apps/skills-showcase test` passed: 8 files, 92 tests.
- `pnpm --dir apps/skills-showcase typecheck` passed.
- `pnpm --dir apps/skills-showcase build` passed.
- `git diff --check` passed.
- Safari desktop visual check passed for `/workflows`.
- Safari narrow mobile-width visual check passed for `/workflows`.

## On Completion

- Deviations from plan: Browser visual verification used Safari/Computer Use because the in-app Browser plugin's required Node REPL tool was unavailable in this session.
- Tech debt / follow-ups: evaluate whether the validated replay pattern should expand to homepage preview, catalog proof, and benchmark surfaces.
- Ready for next phase: yes. Phase 41 remaining benchmark result coverage is active.
