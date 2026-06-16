# Ship Manifest — Deck-Builder Contract B `card-flight` slice

**Date:** 2026-06-16
**Branch:** master (direct-to-primary)
**Track:** deck-builder animation (driven by `/exec` + `apps/skills-showcase/docs/animation-plan-deck-builder.md`, NOT `tasks/todo.md`)

## User goal
Implement contract B `card-flight` per the approved animation plan §B / §D
card-flight storyboard / §F flight portion: a `FlightLayer` portal-clone overlay
that flies a tapped fan card to its phase slot with optimistic commit + fan dim,
slot pulse + counter tick on land, an add-all staggered batch,
`finishAllFlightsImmediately()` on dismiss, reduced-motion no-clone fill, plus
the §F harness extension (FLIGHT_STEPS, flight-layer lane/nodes, flyCard/flyAll
drivers) and the stepped-mode `gate()` wiring for the morph boundaries §F deferred.

## Changed files (shipping boundary — 13 files, all deck-builder/debug-harness)
- `src/components/debug/steps.ts` — `flight` phase; `FLIGHT_STEPS`; `flights-flushed` conditional in `DECK_CLOSE_STEPS`; folded into `ALL_STEPS`.
- `src/components/debug/animationMachine.ts` — `flight-layer` lane + `flight` phase; `AnimationMachineFlightLayerRuntime` slice (default/merge/snapshot/isReset); flight-layer nodes (`flight-clones`/`flight-settled`/`flight-batch`); flight + `deck-flights-flushed` transitions; `flightSteps` on the model; lane Y reflow.
- `src/components/debug/animationMachineStaticPage.ts` — flight steps in the table; prose; `VIEWBOX_H` 800→920.
- `src/components/debug/AnimationMachineGraph.tsx` — `VIEWBOX_H` 800→920 (live graph parity).
- `alignment/animation-state-machine.html` — regenerated from the model (test-locked to `renderAnimationStateMachineReferencePage()`).
- `src/components/debug/DebugController.tsx` — `flyCard`/`flyAll` in `DebugDrivers`.
- `src/components/debug/DebugPanel.tsx` — "Drive flight" panel section (`drive-flyCard`/`drive-flyAll`).
- `src/deck-builder/DeckTableShell.tsx` — FlightLayer (portal, fixed/pointer-events-none/z-70) + FlightClone (imperative `animate()`, one-shot mount effect via refs); stable per-card slot model; optimistic commit + fan dim; settled-gated slot fill + counter; pulse; add-all stagger; `finishAllFlightsImmediately()` published via ref + run in `closeDeck` before dismiss; reduced-motion fill; `window.__deckFlight` test bridge; `gate()` at `blueprint-morph-in`/`-out` + `flight-launch`/`-land`.
- `app/globals.css` — flight layer/clone, collect-all, slot fade-in + land pulse, reduced-motion pulse override.
- `src/deck-builder/DeckDebugHarness.tsx` — `flyCard`/`flyAll` drivers on real DOM affordances; scope note.
- `src/deck-builder/DeckTableShell.test.tsx` — flight Vitest: optimistic commit + land tick, interrupt reconcile, re-tap no-op, add-all stagger (fake timers), reduced-motion fill.
- `src/components/debug/animationMachine.deck.test.ts` — `flights-flushed` in `DECK_CLOSE_STEPS`; new `card-flight harness` block (steps/lane/nodes/runtime/transitions).
- `e2e/deck-table-shell.spec.ts` — flight Playwright: clone z-order/no-clip + slot-only-on-land sampler, re-tap no-op, close-flush + commit persistence, add-all batch, reduced-motion no-clone sampler, flyCard/flyAll driver test.

## User-goal mapping
- FlightLayer overlay + imperative animate → `DeckTableShell.tsx` FlightLayer/FlightClone + `globals.css`.
- Optimistic commit + fan dim from tap frame → `flyCard` commits via `onCollect`; `collected` drives `data-collected`/badge.
- Slot fill + counter only on land → `settledIds`-gated rendering + count; pulse on settle.
- Add-all staggered batch → `flyAll` + collect-all button (70 ms/flight).
- `finishAllFlightsImmediately()` on dismiss → `flushFlightsRef` run at top of `closeDeck`.
- Reduced-motion no-clone fill → `launchFlight` reduced path + FlightLayer null-on-reduced + CSS fade.
- §F harness → `steps.ts`/`animationMachine.ts`/panel/bridge.
- Deferred gate() wiring → `blueprint-morph-in` (BuilderPanel), `blueprint-morph-out` (shell onExitComplete), `flight-launch`/`flight-land` (FlightClone).

## Tests run (executable verification)
- `npm run typecheck` — clean.
- `npm test` (Vitest) — 160 passed / 15 files (was 152; +8 deck-flight).
- `npm run test:e2e` (Playwright, Chromium) — 12 passed (was 6; +6 flight).
- `npm run build` — 16/16 static pages.
- `node scripts/audit-alignment-pages.mjs` (repo root) — exit 0.

## Skipped tests
None. Add-all *stagger timing* is asserted deterministically in Vitest (fake timers); Playwright asserts batch convergence (timing assertions are inherently flaky in-browser).

## Adversarial review
- Found + fixed during validation: FlightClone froze mid-flight because the provider's `dbg` context identity changes on every `mark()`/`report()`, re-firing the effect whose cleanup stopped the animation. Fixed by running the flight as a one-shot mount effect reading latest `dbg`/`onLand` via refs (PackOpener idiom).
- Found + fixed: Playwright `test.use({ reducedMotion })` did not surface in `window.matchMedia` here; switched the reduced-motion spec to `page.emulateMedia({ reducedMotion: "reduce" })` (verified `matchMedia` true).
- Playwright per-frame samplers assert the §B "never" items directly: no clip outside viewport, slot never fills while a clone is flying, FlightLayer keeps fixed/pointer-events-none/z-70/portaled-to-body every frame, no clone ever paints under reduced motion. Counter-desync-after-interrupt covered by the Vitest interrupt test (deterministic).

## Residual risk
- Slot rendering is O(n²) per render (findIndex per settled card); negligible at real deck sizes.
- `await ax` on framer's `animate` controls relies on the controls being thenable (matches the in-repo PackOpener `.then()` usage); covered end-to-end by the clone-land Playwright test.
- Scroll-then-measure off-screen path is real-browser only (jsdom uses the sync zero-rect path); not directly asserted, low risk for the in-viewport skeleton.

## Rollback note
Revert this single `feat(deck-builder): card-flight` commit; no migrations, no data, no deploy-config changes. Deploy is automatic via Vercel path-based pipeline on push.

## Next command
`/exec` (continues the deck-builder track from the animation plan; `tasks/todo.md` holds an unrelated skillpacks workstream and stays untouched).
