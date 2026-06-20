# Ship Manifest — Unified Experience Phase 4: Promote the Table to `/` (pack-first landing)

**Date:** 2026-06-20
**Branch:** master (direct-to-primary)

## User goal
Phase 4 of the unified-experience build: replace the marketing `/` with the pack-first landing (domain picker + CTA → deal the picked domain's pack allotment → run each pack through the shared PackFlow ritual in inspect mode (tap = flip, no collect) → hand-off chooser), delete the routing spike, and repoint the deck Table to `/` — keeping the CI-locked deck-routing contract (mount-id, morph, flight) green. Land alone; do not start Phase 5/6.

## Changed files (shipping boundary)
- `apps/skills-showcase/app/page.tsx` (M) — marketing hero replaced with `<LandingExperience/>` + preserved `<ShowcaseFooter/>`; imports scoped `./landing.css`; keeps page metadata.
- `apps/skills-showcase/app/landing.css` (A) — scoped Tailwind + pack-primitive keyframes for `/` (mirrors `app/deck/deck.css`); Phase 5 unifies to root.
- `apps/skills-showcase/src/showcase/landing/LandingExperience.tsx` (A) — the journey client: domain picker → CTA → pack-opening allotment (SealedPack shelf + `PackFlowSheet` inspect mode, no `onCollect`) → `HandoffChooser`. Mounts `<DeckDebugHarness/>` (the blueprint Table) below from first paint as the hand-off destination, preserving the deck-routing contract at `/`. `window.__landing` test bridge mirrors the `__deckPack`/`__deckFlight` idiom.
- `apps/skills-showcase/src/showcase/landing/LandingExperience.test.tsx` (A) — 6 Vitest: picker/default, CTA reactivity, CTA deals allotment, hand-off after open-all, AFPS starter fallback, mounted table.
- `apps/skills-showcase/app/globals.css` (M) — `.landing*` chrome (picker tiles, CTA, pack shelf, hand-off chooser); palette-consistent with the deck blueprints.
- `apps/skills-showcase/src/deck-builder/DeckTableShell.tsx` (M) — `TABLE_PATH` `/prototype/deck-routing-spike` → `/` (close-deck returns to `/`).
- `apps/skills-showcase/app/prototype/deck-routing-spike/page.tsx` (D) — routing spike deleted; the Table now lives at `/`.
- `apps/skills-showcase/e2e/deck-table-shell.spec.ts` (M) — `TABLE_PATH` repointed to `/` (comment documents why the Table is reached at `/`).
- `apps/skills-showcase/e2e/landing.spec.ts` (A) — 4 Playwright: picker/CTA reactivity, CTA-deals + real tear→inspect (no `data-card-id`/`.deck-fan-card`), open-all→hand-off→`/deck/vard` hard-load, mounted-table morph.
- `apps/skills-showcase/src/deck-builder/DeckTableShell.test.tsx` (M) — baseline `pushState` URL `/prototype/deck-routing-spike` → `/`.
- `apps/skills-showcase/src/showcase/smoke.test.tsx` (M) — the two HomePage marketing assertions replaced with a landing-surface + preserved-footer smoke assertion.

## User-goal mapping
- Pack-first landing + picker + CTA + allotment + inspect ritual + hand-off → `LandingExperience.tsx` + `landing.css` + `.landing*` in `globals.css`.
- Delete the spike + repoint Table to `/` → spike deletion + `TABLE_PATH` in shell/e2e/test.
- Keep deck-routing contract green → Table mounted unconditionally below the hero (not gated), so mount-id/morph/flight/debug-driver e2e pass with `TABLE_PATH="/"` and zero behavioral spec change.
- Land alone → no Phase 5 (Tailwind-to-root) or Phase 6 (legacy 308s/nav) work; `/catalog`,`/packs`,`/workflows`,`/benchmarks`,`/inspect`,`/follow`,`/admin/newsletter` untouched.

## Tests run (executable verification)
- `npm run typecheck` → exit 0 (clean; regenerated `.next/types` after spike deletion).
- `npm run build` → exit 0; `/` static, routing spike gone, 196 SSG `/card/[id]` pages intact.
- `npm run test` (Vitest) → **182/182** (171 prior + 6 new landing + adjusted smoke).
- `npx playwright test` → **26/26** (18 deck-morph/flight/mount-id unchanged with `TABLE_PATH="/"` + 4 card-detail + 4 new landing journey).
- Visual: dev-server screenshots of picker (business default, live counts, CTA sub-label) and pack-opening shelf (5-pack business allotment, counter, table below, footer preserved).

## Skipped tests
- None. (No SKILL.md/PACK.md changed → Skills Showcase data regeneration not required; `validate:data` out of scope.)

## Adversarial review
General-purpose subagent reviewed the staged diff across 6 risk axes (duplicate testids/DOM collision, `window.__landing` staleness/SSR, inspect-mode no-collect isolation, NOOP debug context without provider, allotment derivation edge cases, hydration symmetry). **Verdict: no must-fix/should-fix.** Two benign nits (possible double `<main>` landmark — pre-existing to the Table; `openAll` bridge bypasses per-pack ritual — intentional, e2e-only). No action taken.

## Residual risk
- Low. The debug gear (DebugPanel, collapsed) now renders on the public `/` because the deck-debug harness's only home (the spike) was deleted and the Table moved to `/`. Acceptable for this phase; Phase 6 (nav rebuild/polish) can hide it. Documented, not blocking.
- A domain whose packs all resolve to zero skills would deal an empty shelf (no hand-off) — benign data-quality edge; current manifest has non-empty allotments (build/e2e green).

## Rollback note
Revert this commit: restores the marketing `app/page.tsx`, re-adds `app/prototype/deck-routing-spike/page.tsx`, and `TABLE_PATH` back to the spike path. No data/migration/config changes; pure app-surface + tests.

## Next command
`/exec`
