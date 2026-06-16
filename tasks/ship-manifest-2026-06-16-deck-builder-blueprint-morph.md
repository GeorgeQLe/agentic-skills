# Ship Manifest — Deck-Builder `blueprint-morph` Motion Slice

**Date:** 2026-06-16
**Skill route:** `/exec` → `/ship` against `apps/skills-showcase/docs/animation-plan-deck-builder.md` §A/§D/§E/§G

## User goal

Implement contract A `blueprint-morph` (open + close) on top of the motion-free
deck-builder skeleton — the deck blueprint ↔ builder panel layout morph, content
stagger-in, reduced-motion crossfade fallback, hard-load skip-open, and the §G
proof gate for the morph. Card-flight (contract B) and the §F debug-harness
extension stay deferred.

## Changed files (shipping boundary)

- `apps/skills-showcase/src/deck-builder/DeckTableShell.tsx` — async morph-driven
  phase machine, AnimatePresence morph target/source, reduced-motion read, shared
  morph-spring constant.
- `apps/skills-showcase/src/deck-builder/DeckTableShell.test.tsx` — phase-order +
  one-shot + reduced-motion Vitest coverage via the `__deckMorphComplete` bridge.
- `apps/skills-showcase/e2e/deck-table-shell.spec.ts` — per-frame double-vision
  sampler, content-gating, focus-restore, Back-returns-to-table.
- `apps/skills-showcase/app/globals.css` — `transform-origin` on source + builder
  for a stable morph corner; opacity keeps the source in flow.
- `prompts/exec/skill-prompt-20260616-113920-deck-builder-blueprint-morph-slice.md`
  — visible `/exec` invocation capture (prompt-history convention).

## Per-file purpose / user-goal mapping

- `DeckTableShell.tsx`: parks open on `blueprint-morphing` (advances on
  BuilderPanel `onLayoutAnimationComplete`), parks close on `builder-dismissing`
  (advances on `AnimatePresence onExitComplete`), one-shot latches, focus restore,
  `closingSlug` keeps the dismissing source hidden so the exiting panel morphs
  back without a flash; reduced motion omits `layoutId` and fires completions
  synchronously for an identical phase chain. → the morph contract itself.
- `DeckTableShell.test.tsx`: asserts `table→blueprint-morphing→builder-open`,
  taps-ignored-while-morphing, `builder-open→builder-dismissing→table`, one-shot
  fires once, hard-load skips morph, reduced-motion same chain. → §G Vitest gate.
- `deck-table-shell.spec.ts`: zero disjoint double-vision frames across open+close,
  content hidden until `builder-open`, focus returns to origin, Back→table. → §G
  Playwright gate + §A "never" items.
- `globals.css`: morph-support styling only. → legibility guardrail (§E).

## Tests run (executable verification)

- `pnpm --dir apps/skills-showcase typecheck` — clean (tsc --noEmit).
- `pnpm --dir apps/skills-showcase test` — 144 passed (14 files); new deck phase-
  order/reduced-motion tests green, prior 141 non-regressed.
- `pnpm --dir apps/skills-showcase test:e2e` — 5 passed (Chromium), incl. the
  no-double-vision sampler and focus-restore.
- `pnpm --dir apps/skills-showcase build` — 16/16 pages.
- `node scripts/audit-alignment-pages.mjs` — exit 0.

All re-run after the post-review refactor (shared morph-spring extraction).

## Skipped tests

- Manual slow-motion `--debug-speed 0.25` review (plan §D apex) — deferred; the
  deck route mounts no DebugProvider yet (§F slice). Automated double-vision
  sampler covers the apex frame in lieu.
- Production deploy checks (`tasks/deploy.md`) — out of scope for this slice.
- Card-flight (§B) and §F harness Vitest/Playwright — not in this slice.

## Adversarial review

High-effort `/code-review` (4 finder angles + targeted verifier):

- **Morph-spring literal duplicated across the two paired `layoutId` owners**
  (source blueprint + target panel) — real drift hazard. **Fixed:** extracted
  `MORPH_LAYOUT_TRANSITION` single-sourced and referenced by both; gates re-run.
- **No fallback timer if `onLayoutAnimationComplete`/`onExitComplete` never fires
  (wedge risk).** **REFUTED** by verifier: the cited `SealedPack`/`PackOpener`
  timers guard a tear→auto-open hop and an imperative collapse-fade, not a
  layoutId morph; where the siblings drive a real layoutId morph they too rely on
  `onLayoutAnimationComplete` with no timer. The panel box is always ≫ the
  blueprint box (real layout delta), reduced motion omits layoutId + fires
  synchronously, and popstate re-arms latches + reconciles phase directly. Pattern
  is at the right altitude, not a bandaid. Happy path proven green in e2e.

## Residual risk (accepted)

- **Stale reduced-motion read:** preference is read once on mount with no
  `matchMedia` change listener; a mid-session OS toggle won't re-sync. Matches the
  existing `useWorkflowPlayer.ts` limitation; low impact. Candidate for a shared
  `useReducedMotion` follow-up.
- **Focus-restore via single `requestAnimationFrame`:** theoretically races the
  disabled→enabled commit, but verified to land reliably in Chromium (e2e green;
  manual activeElement probe confirmed). Kept as-is.
- **Hard-load `/deck/[unknown-slug]`** seeds `builder-open` with a null
  `activeDeck` → panel-less table with disabled blueprints. **Pre-existing** in
  the skeleton (not introduced here); slug-validation/404 is a separate product
  decision, out of this slice's scope.
- Minor cleanup deferred: content-wrapper motion props repeated 3× (differ only by
  `custom` index); `reducedMotionRef` mirrors `reducedMotion` state.

## Rollback note

Revert the shipped commit to restore the motion-free skeleton (instant phase
transitions, plain `<button>`/`<section>`, conditional BuilderPanel mount). No
schema/route/data changes; CSS additions are additive.

## Next command

`/exec` — §F debug-harness extension for the deck route (deck lanes/nodes +
`DECK_OPEN_STEPS`/`DECK_CLOSE_STEPS` + `openDeck`/`dismissDeck` drivers +
`DebugProvider`/`DebugPanel` on the deck route), then contract B `card-flight`.
