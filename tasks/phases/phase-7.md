# Pattern A Routing Wording

- [x] Capture `$investigate` prompt history.
- [x] Validate the wording issue against active Pattern A routing contracts.
- [x] Update conventions, audits, and active skill wording.
- [x] Run focused verification.
- [x] Record review, commit, and push.

## Pattern A Routing Wording Review

- User claim validated: the review-pending command section repeated fresh-session routing that `Next Work` already covered.
- Changed the pending-YAML command section to `## Invoke With YAML` so it only names the parent invocation.
- Regenerated the skillpacks package snapshot and verified the Pattern A audit, package build check, and diff hygiene.

# Unified Experience — Phase 7: Deferred polish (custom-deck output + reduced-motion branches)

> Full design context: `apps/skills-showcase/docs/unified-experience.md` — §"Build phasing" step 7 ("Deferred polish — custom-deck output + overlay install lines; reduced-motion branches for `SealedPack`/`PackOpener` fan stagger"), §"Distribution / install lines" (line ~129: starter → one-line `install-deck`; custom/modified → explicit `install <pack>` list + overlay lines + `?c=` share encoding), and §"Persistence" (line ~189: `?c=` share-deck URL param). Phases 1–6 shipped — see `tasks/history.md` (2026-06-19 ×3, 2026-06-20 ×3) and commits through Phase 6 (legacy archive + nav rebuild).

## Phase 6 review (COMPLETE — shipped 2026-06-20)

- [x] 308-redirected the five folded routes (`/catalog`, `/packs`, `/workflows`, `/benchmarks`, `/inspect`) → `/` via config-level `next.config.mjs` `async redirects()`; deleted their `app/<route>/page.tsx`.
- [x] Deleted orphaned components + tests: `catalog.tsx`(+test), `benchmarks.tsx`(+test), `workflows.tsx`(+test), and the fully-orphaned `src/showcase/tui/` tree (user-confirmed).
- [x] Extracted `/follow`'s proof hydration into `src/showcase/follow-proof.tsx` (the only surviving consumer of catalog.tsx's `renderFollowProof`); rewired `/follow`, deleted catalog.tsx. `/follow` output unchanged.
- [x] Rebuilt global nav (game metaphor): `routes.ts` (3 routes), `ShowcaseHeader`, `MobilePanel`, `ShowcaseFooter`. **Cards → `/`** (user-confirmed; no `/card` index this phase). Fixed all dead-route hrefs (`card/[id]` back-link, `/follow` links, stale `skillsData.ts` comment). Grep-clean.
- [x] Hid the deck-debug gear on production via `process.env.NODE_ENV === "production"` gate in `DebugPanel.tsx`. e2e (dev) keeps the gear; prod bundle DCE-confirmed gear-free; `window.__deck*` bridges intact.
- [x] Tests: rewrote `routes.test.ts`, trimmed `smoke.test.tsx`, added `e2e/legacy-redirects.spec.ts`. Updated `tasks/deploy.md` Routes/Launch-Checks.
- [x] Verified: typecheck clean, build (`/` static + 196 SSG cards), Vitest 125/125, Playwright 37/37 (26 prior + 11 new), grep-clean, prod-bundle DCE.

## Execution Profile

**Serial, implementation-safe, additive.** This is the final unified-experience phase — pure feature/polish on the deck builder, no destructive deletes, no route changes. Single lane, direct to master. Test strategy: **tests-after** (extend `DeckTableShell.test.tsx` for custom-deck output; extend the deck/landing e2e for `?c=` round-trip + reduced-motion). The existing green suite (Vitest 125 + Playwright 37) is the regression gate — none of it should change behavior.

## Goal

Close out the two deferred items from the design doc:
1. **Custom-deck output** — when a deck is custom-built or modified (not a pristine starter), emit the explicit `install <pack>` list + overlay `install <pack>` lines in the CLI panel, and encode the deck contents into a compact `?c=` share URL param (`/deck/custom?c=…`) so a customized deck is shareable with no backend.
2. **Reduced-motion branches** — add `prefers-reduced-motion: reduce` fallbacks for the `SealedPack` tear/curl and the `PackOpener` fan-stagger entrance (the design doc specifies 120 ms crossfade, no stagger). Other surfaces (deck morph, slot fill, card flight) already implement reduced-motion; this fills the two pack-primitive gaps.

## What to build

### 1. Custom-deck output (CLI panel + share encoding)
- **Locate** the builder CLI panel (`BuilderCliPanel`, per design doc line ~113) and `DeckTableShell.tsx` (line ~213 in the doc: "consume `Phase[]`; custom-deck output; info-vs-collect split"). Read both before editing to confirm the current starter `install-deck` one-liner.
- **Starter vs custom detection:** a deck is "custom/modified" when its collected-card set differs from the canonical starter deck's contents (or it is the `custom` slug). Pristine starter → keep the existing one-line `install-deck <slug>`. Custom/modified → emit the explicit `install <pack>` list (one line per distinct pack among collected cards) + overlay `install <pack>` lines for any overlay packs.
- **`?c=` share encoding:** encode the custom deck's contents (collected card ids, overlay ids, optional custom name/phases — mirror the localStorage shape at design-doc line ~188/133) into a compact URL-safe param. Add a "Share deck" affordance that produces `/deck/custom?c=<encoded>`; `/deck/custom` hard-load with `?c=` decodes and enters `builder-open` with that content. Keep it backend-free. Confirm the existing `/deck/[slug]` route handles a `custom` slug (or add minimal handling).

### 2. Reduced-motion branches for SealedPack / PackOpener
- **`SealedPack`** (`src/components/SealedPack.tsx`): under reduced motion, replace the flap-clip + curl + card-rise sequence with an instant/120 ms crossfade open (no transform animation). The `onOpeningApex`/`onOpen` callbacks must still fire (the flow machine depends on them).
- **`PackOpener`** (the fan composition, likely in `PackRitual.tsx`): under reduced motion, render the fan without the staggered spring entrance — 120 ms crossfade, no per-card `delay`.
- Use the same `window.matchMedia("(prefers-reduced-motion: reduce)")` pattern already used elsewhere (see `DeckDebugHarness.tsx` line ~114 and the deck morph reduced-motion branch).

## Files affected (full paths, under `apps/skills-showcase/`)
- Edit: `src/deck-builder/DeckTableShell.tsx` (+ the `BuilderCliPanel` / `BuilderPackFlow` components it composes) — custom-deck install-line emission + share affordance.
- Add/edit: a share-encoding util (e.g. `src/deck-builder/shareDeck.ts`) — encode/decode `?c=`.
- Possibly edit: `app/deck/[slug]/page.tsx` — handle the `custom` slug + `?c=` decode on hard-load.
- Edit: `src/components/SealedPack.tsx` — reduced-motion open branch.
- Edit: `src/components/PackRitual.tsx` (`PackOpener` fan) — reduced-motion entrance branch.
- Tests: extend `src/deck-builder/DeckTableShell.test.tsx` (custom vs starter output), add an e2e for `?c=` round-trip and a reduced-motion assertion (Playwright `emulateMedia({ reducedMotion: "reduce" })`).

## Key decisions / risks
- **Don't regress the green suite.** The deck morph (CI-locked stable `deck-mount-id`), card flight, and `/follow`+newsletter stay exactly as-is. Reduced-motion branches must be additive guards, not rewrites of the default path.
- **`?c=` format:** keep it compact + URL-safe (e.g. base64url of a minimal JSON, or a delimited id list). No backend, no PII. Decide encoding in plan-mode review.
- **Custom-deck detection edge:** a starter deck the user fully filled with exactly the starter's cards is still "starter" (one-liner); any deviation (extra/removed cards, overlays, rename) flips to the explicit list.
- **Reduced-motion callbacks:** the flow machine relies on `onOpeningApex`/`onOpen`/settle callbacks firing — the reduced-motion path must still invoke them (synchronously or on a short timer), or the ritual deadlocks.

## Acceptance criteria
- `npm run typecheck` clean; `npm run build` succeeds (`/` static + 196 SSG cards intact).
- Pristine starter deck → one-line `install-deck <slug>`; custom/modified deck → explicit `install <pack>` list + overlay lines.
- A custom deck produces a `/deck/custom?c=…` link that, on hard-load, decodes to the same contents (round-trip verified in e2e).
- Under `prefers-reduced-motion: reduce`, `SealedPack` opens and `PackOpener` fans with a crossfade and no stagger, and the pack ritual still completes (callbacks fire) — asserted in e2e.
- Vitest all-green (extended DeckTableShell test); Playwright all-green (37 existing + new `?c=` + reduced-motion assertions).
- Manual (`/run` or dev server): build a custom deck, copy the share link, open it in a fresh tab → same deck; toggle OS reduced-motion → packs open without stagger.

## Phase 7 review (COMPLETE — 2026-06-20)

- [x] **Custom-deck output.** New `src/deck-builder/shareDeck.ts` owns the backend-free `?c=` codec: `encodeDeckParam`/`decodeDeckParam` (base64url(JSON), byte-compatible with Node `Buffer.toString("base64url")`), `buildCustomDeck` (resolves the payload against the catalog into a synthetic `custom`-slug `Deck` with phases + overlay packs), and `customInstallLines` (one `npx skillpacks install <pack>` per distinct core pack + overlay packs). Moved `deckPacks` to `decks.ts` (now takes `Skill[]`) and extended `Deck` with optional `overlayPacks`/`overlaySkills` + `CUSTOM_SLUG`.
- [x] **BuilderCliPanel** detects the `custom` slug → always-unlocked multi-line explicit install list (`data-custom`/`data-multiline`) + a `ShareDeckControl` ("Share deck" → `/deck/custom?c=…`, clipboard best-effort + selectable `deck-share-url` readout). Canonical decks keep the locked/unlocked one-line `install-deck`. `DeckCompletionPanel` command + share are custom-aware too.
- [x] **`/deck/custom?c=` hard-load.** `app/deck/[slug]/page.tsx` reads `searchParams.c` → threads `customDeckParam` through `DeckDebugHarness` → `DeckTableShell`, which decodes it into the active deck. The custom panel opens/closes **morphless** (crossfade, no `layoutId`) since it has no blueprint tile to morph against; AnimatePresence still drives the close completion.
- [x] **Reduced-motion branches.** `SealedPack` open (tear / drag-up / click) collapses to an instant reveal that calls `proceedToOpen` directly — no clip/curl sweep or card-rise — with `onTear`/`onOpeningApex`/`onOpen` still firing (no deadlock). `PackOpener` fan entrance drops the staggered spring for a flat 120 ms crossfade (no per-card delay, no transform); the last card's `onAnimationComplete` still advances `onOpenMorphComplete`.
- [x] **Tests.** `shareDeck.test.ts` (codec round-trip, byte-compat, malformed-param null, buildCustomDeck, install lines). `DeckTableShell.test.tsx` +1 (custom `?c=` hard-load → install list + share link). e2e +2 (`?c=` round-trip incl. re-share; reduced-motion tear → fan opens → ritual completes).
- [x] **Verified:** `npm run typecheck` clean · `npm run build` (`/` static + 196 SSG cards, `/deck/[slug]` dynamic for `?c=`) · Vitest 132/132 (was 125, +7) · Playwright 39/39 (was 37, +2).

## Ship-one-step handoff contract
Implement **only Phase 7**, validate it (all acceptance criteria green, custom-deck round-trip + reduced-motion verified, existing suite unchanged), then run `/ship` when done. This is the final unified-experience phase — on completion the build is done.

## On Completion

- Deviations from plan: none recorded in this archival pass; Phase 7 was completed and shipped before this archive.
- Tech debt / follow-ups: deferred production newsletter setup remains in `tasks/manual-todo.md`; it is unrelated to Unified Experience completion.
- Ready for next phase: yes. No active implementation phase remains selected; next work should be discovered or the project should be parked intentionally.
