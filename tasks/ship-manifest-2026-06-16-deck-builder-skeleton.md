# Ship Manifest - Deck-Builder Motion-Free Skeleton

## User Goal

Implement the approved animation plan's first post-spike slice: replace the throwaway `DeckRoutingSpikeShell` proof harness with a real, motion-free deck-builder skeleton (`DeckTableShell`, `DeckFlowPhase` state machine, `BuilderPanel`, localStorage-backed per-slug collected state) that reuses the spike's proven `pushState` + `popstate` + `usePathname` routing. No `blueprint-morph`/`card-flight` motion in this slice.

## Changed Files

- `apps/skills-showcase/src/deck-builder/decks.ts` (new) — shared deck data model.
- `apps/skills-showcase/src/deck-builder/DeckTableShell.tsx` (new) — real shell + colocated TableSurface/BuilderPanel.
- `apps/skills-showcase/src/deck-builder/DeckTableShell.test.tsx` (new) — Vitest skeleton sequence + persistence tests.
- `apps/skills-showcase/src/deck-builder/DeckRoutingSpikeShell.tsx` (deleted) — retired proof harness.
- `apps/skills-showcase/e2e/deck-table-shell.spec.ts` (new) — migrated spike Playwright assertions.
- `apps/skills-showcase/e2e/deck-routing-spike.spec.ts` (deleted) — superseded by the above.
- `apps/skills-showcase/app/deck/[slug]/page.tsx` — hard-load route repointed to `DeckTableShell`.
- `apps/skills-showcase/app/prototype/deck-routing-spike/page.tsx` — table route repointed to `DeckTableShell`.
- `apps/skills-showcase/app/prototype/page.tsx` — consumes `SETS`/`getSetSkills` from `decks.ts`.
- `apps/skills-showcase/app/globals.css` — replaced `.deck-spike-*` styles with `.deck-table-shell`/`.deck-builder` styles.
- `apps/skills-showcase/.gitignore` — ignore Playwright `test-results/`, `playwright-report/`.
- `prompts/exec/skill-prompt-20260616-113400-deck-builder-skeleton-slice.md` — visible invocation prompt.
- `tasks/ship-manifest-2026-06-16-deck-builder-skeleton.md` — this manifest.

## Per-File Purpose

- `decks.ts`: extracts `SetDef`, `SETS`, `getSetSkills` out of the prototype page and adds `buildDecks`/`getDeckBySlug` so the prototype and the real shell share one source. A resolved `Deck` exposes `{ name, slug, phases, skills }`; `phases` seeds the builder slot columns.
- `DeckTableShell.tsx`: single client owner per the plan's Lifecycle Ownership Map (§C). Owns `DeckFlowPhase` (`table` and `builder-open` observable; `blueprint-morphing`/`builder-dismissing` defined in the type and passed through instantly as the motion seam), `activeDeckSlug` derived from the route, and `collectedBySlug` (localStorage `deck:${slug}:collected`, optimistic commit, no rollback). Reuses the spike's `deckSlugFromPath`, mount-id-after-hydration fix, `pushState` open/close, and `popstate` listener. `TableSurface` is always mounted; `BuilderPanel` mounts while `activeDeck != null`. Both wrapped in one `<LayoutGroup>` so the morph slice can attach `layoutId` without restructuring.
- `app/deck/[slug]/page.tsx`: hard-load enters `builder-open` with no origin morph (contract A "Hard load").
- `app/prototype/deck-routing-spike/page.tsx`: reused as the table entry (kept off the production `/` homepage per the deferred-homepage decision), `noindex`.
- `app/prototype/page.tsx`: deduplicates the deck data by importing from `decks.ts`; pack-opening flow unchanged.
- `app/globals.css`: dark-theme styling for the real table/builder surfaces; the hidden `.deck-spike-*` block is removed.

## User-Goal Mapping

- "Skeleton only first" → no framer-motion `animate`/`layoutId` deck transitions added; `LayoutGroup` is present but carries no morph yet; `FlightLayer`/`card-flight` and the `steps.ts`/`animationMachine.ts` debug extensions are explicitly left to the next slice.
- Proven routing reused verbatim in spirit: shallow `pushState`, `popstate` reconciliation, `usePathname` as route truth, and the mount-id-after-hydration fix (the spike's hydration-mismatch bug stays fixed).
- Per-slug `collectedCardIds` are localStorage-backed with optimistic commit; re-tap of a collected card is a data-level no-op (plan §B interruption rule).
- Pack-opening `PackFlowPhase` retrofit stays out of scope (plan §E).

## Tests Run

- `pnpm --dir apps/skills-showcase typecheck` — clean.
- `pnpm --dir apps/skills-showcase build` — 16/16 pages, `/deck/[slug]` dynamic + `/prototype/deck-routing-spike` static.
- `pnpm --dir apps/skills-showcase test` — 14 files, 141 tests passed (5 new skeleton tests: open/close phase order, hard-load → builder-open with no morph, collect persist, re-tap no-op, localStorage hydration).
- `pnpm --dir apps/skills-showcase test:e2e` — 2 Playwright tests passed (pushState open/close with stable mount identity + browser Back; hard-load renders builder).
- `node scripts/audit-alignment-pages.mjs` — exit 0 (52 active pages, all checks exact).

## Failed-Then-Fixed Validation

- Initial Vitest run failed: the test runner's `window.localStorage` is partial and lacks `.clear`. Fix: install a Map-backed `Storage` stub in the test's `beforeEach` rather than relying on the runtime's localStorage.

## Skipped Tests

- Production deploy checks (`tasks/deploy.md`) not run — deploy is a later shipping step and out of scope for this slice.
- Manual slow-motion motion review (plan §D apex frame, clone z-order) not applicable — no motion exists yet in this slice.

## Adversarial Review

- Hydration stability: the mount id is still assigned in `useEffect`, never during render; the e2e asserts the mount id stays identical across `pushState` and browser Back, so the spike's hydration-mismatch fix is preserved.
- Interruption rule: blueprint taps are guarded by `phase !== "table"` (button `disabled`) and `openDeck` re-checks `phaseRef.current`; `closeDeck` is guarded to `builder-open`.
- Commit safety: collect is optimistic with no rollback; re-tap is a guarded no-op verified at the data level; localStorage write is best-effort (try/catch for private-mode failures).
- No dangling spike references remain (`grep` for `DeckRoutingSpikeShell`/`deck-spike`/`spike-`/`__deckRoutingSpikeMounts` returns nothing).
- Artifact hygiene: reverted Next's auto-generated `next-env.d.ts` build noise; added `test-results/` to `.gitignore` so Playwright output is not committed.

## Residual Risk

- The skeleton lands phases instantly; the `blueprint-morph` + `card-flight` motion (plan §D/§F), `FlightLayer`, reduced-motion paths, and the nested `BuilderPackFlow` are intentionally not implemented.
- The table lives on the `/prototype/deck-routing-spike` route, not the production `/` homepage (homepage replacement remains deferred).

## Rollback Note

Revert the shipped commit to restore the routing spike and remove the skeleton. To keep the spike but drop only the skeleton, restore `DeckRoutingSpikeShell.tsx` and `e2e/deck-routing-spike.spec.ts`, repoint both routes back to the spike shell, restore the `.deck-spike-*` CSS, and delete `decks.ts`/`DeckTableShell.tsx`/its test.

## Next Work

The `blueprint-morph` + `card-flight` motion slice — attach `layoutId="deck-blueprint-${slug}"` to the morph, park transitions on `blueprint-morphing`/`builder-dismissing` with completion callbacks, add `FlightLayer` clones, and extend `steps.ts`/`animationMachine.ts` (`DECK_OPEN_STEPS`/`DECK_CLOSE_STEPS`/`FLIGHT_STEPS`).

## Recommended Next Command

`$exec` against `apps/skills-showcase/docs/animation-plan-deck-builder.md` §D/§F.
