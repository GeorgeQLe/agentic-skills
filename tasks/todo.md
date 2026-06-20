# Unified Experience — Phase 4: Promote the Table to `/` (pack-first landing)

> Full design context: `apps/skills-showcase/docs/unified-experience.md` — §"The journey" steps 1–4 (Landing → Pack Receipt → Pack Opening allotment → Hand-off chooser), §"Routing table" (line ~154: `/` = Table-as-landing, delete `app/prototype/deck-routing-spike/`), §"Build phasing" step 4. Phases 1–3 shipped — see `tasks/history.md` (2026-06-19) and commits `c532be7e`, `dc12b4a5`, plus this session's Phase 3.

## Execution Profile

**Serial, implementation-safe, land alone.** This is the structural pivot — it moves the front door and deletes the routing spike, so it MUST be its own phase/commit set, not bundled with later work (CSS unify / legacy retirement are Phases 5–6). Single lane, direct to master. Test strategy: **tests-after** (write the new `/` + journey e2e/Vitest in the Green step). Do NOT start Phase 5 (Tailwind-to-root) or Phase 6 (legacy route 308s + nav rebuild) here — `/catalog`,`/packs`,`/workflows`,`/benchmarks`,`/inspect` stay as-is this phase.

## Goal

Replace the marketing `/` with the **pack-first landing**: a domain picker + CTA that deals the picked domain's sealed packs, runs each pack through the existing `PackFlowPhase` opening ritual in **pre-deck inspect mode** (tap = flip, no collect), and after the last pack of the allotment closes, surfaces the **Hand-off chooser** (build custom deck vs load the domain's starter deck). Delete the orphaned routing spike `app/prototype/deck-routing-spike/`. The builder (`/deck/[slug]`) and `/card/[id]` are unchanged destinations reached from the hand-off / direct links.

## What to build

### 1. Landing `/` — replace marketing `app/page.tsx` (§journey step 1)
- Read the current `apps/skills-showcase/app/page.tsx` + `src/showcase/*` (ShowcaseHeader/Shell/MobilePanel are wired in the root layout) before replacing — preserve footer links and the `/follow` + `/admin/newsletter` routes (unchanged).
- New client landing: dark front door; dual-branded promise ("Open a pack. Build your workflow deck."); a **domain picker row** (business / devtool / game tiles; default business/AFPS); primary **CTA** "Open your starter packs" with a sub-label showing the picked domain's pack/skill counts (derive from `useSkillsData()` → `data.sets[]` grouped by `domain`, and `data.packs[]`/`data.skills[]` counts).
- States: loading (`useSkillsData()` pending) · idle · domain hover (tile glow, CTA sub-label updates) · CTA pressed → deal packs (Pack Receipt state).
- The five decks group into Sets by domain (spec §"five canonical decks"): **business** = {VARD, Business AFPS}, **devtool** = {ORD, Devtool AFPS}, **game** = {Game AFPS}. The picked domain's **pack allotment** = the union of `full_packs` across that domain's decks (from `data.sets[].packs`).
- This is a Tailwind surface — `/` currently renders under the root layout (no Tailwind). Decision needed (see Risks): either add a scoped Tailwind layout for `/` like `app/deck/layout.tsx`, OR fold into the Phase 5 Tailwind-to-root move. For Phase 4, take the **scoped-layout** path (mirror `app/deck/deck.css`) to keep the structural pivot isolated; Phase 5 unifies later.

### 2. Pack Receipt + Pack-opening allotment (§journey steps 2–3) — transient `/` states, not routes
- After CTA: deal N `SealedPack`s (N = pack allotment count) using `PackOpener`'s fan-in entrance values applied to whole packs (`opacity 0, scale 0.8, rotateZ`, staggered spring). Reduced motion: 120 ms crossfade, no stagger.
- Drive each pack through the shared ritual: reuse `usePackFlow()` + `<PackFlowSheet>` (`src/components/PackRitual.tsx`) in **inspect mode** — pass NO `onCollect`/`onCollectAll`, so tapping a fanned card flips it (the `/prototype` behavior), there is no slot to fly to. Keep the `onExpand` wire so fan-card expand still opens the `/card/[id]` modal (Phase 3).
- Sequence: each pack = one full `PackFlowPhase` cycle (`sealed → opening-apex → drawer-open → … → card-settling`); advance an **allotment counter** ("Pack k of N") as each closes. Opened-pack state is session-only (reseal on reload). After the last pack closes → Hand-off chooser.
- `/prototype` already demonstrates the N-pack shelf consumer (`PrototypeInner`) — model the landing's multi-pack consumer on it, but keyed to the picked domain's allotment rather than all decks.

### 3. Hand-off chooser (§journey step 4) — the pack-opening → deck pivot
- Surfaces after the allotment closes. Two large choices: **"Build a deck"** (custom) and **"Load the {domain} Starter"** (the canonical deck whose packs were just opened — e.g. business → VARD), plus a strip of the other starter blueprints (the `deck-blueprint-${slug}` morph sources for every deck).
- Selecting a starter / blueprint → navigate to `/deck/[slug]` (the builder is already built; it hard-loads into `builder-open`). The blueprint→builder `layoutId="deck-blueprint-${slug}"` morph currently lives in the spike's `TableSurface`; for Phase 4 a direct `router.push('/deck/<slug>')` (or `<Link>`) into the hard-load path is acceptable — the in-place morph from the chooser is polish that can ride Phase 4 if cheap, else note as deferred. Carry-in is **locked** (opening commits nothing; the builder's `wantedIds` already lights the suggested slots from the deck's phases — no pre-filled cards).
- "Build a deck" (custom) → for Phase 4, route to a starter builder or a neutral deck entry; full custom-deck authoring output is Phase 7 deferred polish. Keep this choice present but minimal.

### 4. Delete the routing spike (§routing table)
- Delete `apps/skills-showcase/app/prototype/deck-routing-spike/` (the Table now lives at `/`). Check for references: the deck e2e `e2e/deck-table-shell.spec.ts` uses `TABLE_PATH = "/prototype/deck-routing-spike"` and `deck-blueprint-${slug}` from `TableSurface` — these MUST be repointed to the new `/` landing surface (or the table/blueprint chooser must keep equivalent `data-testid` hooks at `/`). Audit `DeckTableShell.tsx` `TABLE_PATH` const (line ~60) + `deckSlugFromPath` and `pushDeckPath` (they push back to `TABLE_PATH` on close) — closing a deck must return to `/`, not the deleted spike path. This is the highest-risk edit; keep the deck-mount-id stability + morph/flight suites green.
- Leave `app/prototype/page.tsx` + `app/prototype/layout.tsx` + `prototype.css` decision to the spec — the N-pack prototype harness may stay as a dev surface or fold in; default: keep `app/prototype/page.tsx` (dev harness) and delete only `deck-routing-spike/`.

## Files affected (full paths)
- `apps/skills-showcase/app/page.tsx` — replace marketing with pack-first landing + domain picker + CTA (new client component(s), likely `src/showcase/landing/` or `src/deck-builder/`).
- `apps/skills-showcase/app/layout.tsx` (root) — if `/` needs scoped Tailwind, add a layout for it (or `app/(landing)/layout.tsx`); verify ShowcaseHeader/Shell still behave on `/`.
- New landing components (new dir, e.g. `apps/skills-showcase/src/showcase/landing/` or reuse `src/deck-builder/`).
- `apps/skills-showcase/src/deck-builder/DeckTableShell.tsx` — `TABLE_PATH`/`pushDeckPath`/`deckSlugFromPath` repoint from `/prototype/deck-routing-spike` to `/`; the blueprint chooser / hand-off may extract from the spike's `TableSurface`.
- DELETE `apps/skills-showcase/app/prototype/deck-routing-spike/`.
- `apps/skills-showcase/e2e/deck-table-shell.spec.ts` — repoint `TABLE_PATH` to `/` (or new landing entry); keep all morph/flight/mount-id assertions green.
- New tests: landing render + domain-pick + CTA-deals-packs + allotment→hand-off journey (Vitest and/or e2e).

## Key decisions / risks
- **This deletes the only `TABLE_PATH` the deck e2e uses.** The 18 deck-morph/flight specs hard-load `/deck/[slug]` (unaffected) but the pushState-routing spec (`e2e/deck-table-shell.spec.ts:35`) starts at `TABLE_PATH` and asserts close returns there. Repoint carefully; the stable `deck-mount-id` + `doubleVision===0`/`slotBeforeLand===0` samplers must still hold.
- **Tailwind scope:** `/` is currently non-Tailwind (marketing). Take the scoped-layout path this phase; do NOT do the Tailwind-to-root move (Phase 5).
- **Pre-deck inspect mode is the no-collect path:** pass no `onCollect` to `PackFlowSheet` so tap = flip. Do not wire collection into the landing — collection is a builder-only behavior.
- **Hand-off morph is polish:** a direct `/deck/<slug>` navigation is acceptable for Phase 4; the in-place `layoutId` morph from the chooser can be deferred if it complicates the spike deletion.
- **Keep `/follow` + `/admin/newsletter` + the legacy marketing routes untouched** (Phase 6 retires the legacy routes).

## Acceptance criteria
- `npm run typecheck` clean.
- `npm run build` succeeds; `/` statically renders the landing; `/prototype/deck-routing-spike` is gone (no dead route, no broken import).
- New landing/journey tests green (domain pick updates CTA; CTA deals the allotment; after the allotment the hand-off chooser appears; picking a starter lands `/deck/<slug>`).
- Vitest still all-green (+ new); Playwright still all-green (+ new) — the deck-morph + flight + card-detail suites unchanged in behavior, only `TABLE_PATH` repointed.
- Manual (`/run` or dev server): land `/` → pick domain → CTA → tear N packs → inspect/flip (tap=flip, no collect) → hand-off → load starter → `/deck/<slug>` builder → Back morphs to `/`. `/card/[id]` direct link + fan-expand modal still work. `/catalog`,`/packs` still render (not yet retired).

## Ship-one-step handoff contract
Implement **only Phase 4**, validate it (all acceptance criteria green), then run `/ship` when done. Do not start Phase 5 (Tailwind-to-root) or Phase 6 (legacy 308s + nav rebuild) in that session.
