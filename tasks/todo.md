# Unified Experience — Phase 3: Card Detail `/card/[id]` (SEO surface)

> Full design context: `apps/skills-showcase/docs/unified-experience.md` (§6, §"Architecture reconciliation" routing table, §"Build phases" step 3). Phase 1 (`PackRitual` engine) and Phase 2 (real deck data model) shipped — see `tasks/history.md` (2026-06-19) and commits `c532be7e`, `dc12b4a5`.

## Execution Profile

Serial, implementation-safe (single lane, direct to master). New additive routes only — no existing route behavior changes. Test strategy: tests-after (write the route tests in the Green step).

## Goal

Add the `/card/[id]` card-detail surface: the indexed SEO page for the ~190 mirrorKey-deduped skill cards, plus an `@modal` intercepting overlay so a fan-card "expand" opens it over its current context without a full navigation. This is the **one** place intercepting routes enter the app.

## What to build

### 1. Standalone page — `apps/skills-showcase/app/card/[id]/page.tsx` (NEW)
- Server component, statically generated. `generateStaticParams()` enumerates the mirrorKey-deduped card ids — the same dedup the catalog/benchmarks views already use (`text(skill.mirrorKey, skill.name)` first-seen by path-sorted order → claude variant wins). Source ids from the generated skills data; for a server component, read the generated JSON the same way existing server/SSG code in this app does (data is emitted to `docs/skills-showcase/assets/skills-data.js` and `apps/skills-showcase/public/assets/skills-data.js` — check how existing `app/*` pages obtain skills data server-side before inventing a new loader).
- Indexed (no `noindex`). Render the enlarged card + full back-face stats: description, platform, scope, version, tags, benchmark grade + per-agent pass rates (`skill.benchmarkEvidence`), plus "part of deck(s): …" chips linking to `/deck/<slug>` for every deck whose phases suggest this card (derive from `data.decks[].phases[].suggestedCardIds`).
- `id` is the showcase skill id (e.g. `pack-vard-claude-vard-scan`). Resolve against the skills list; 404 (`notFound()`) on an unknown id.

### 2. Intercepting modal — `apps/skills-showcase/app/@modal/(.)card/[id]/page.tsx` (NEW)
- Parallel-route `@modal` slot rendering the same card detail as an overlay (scrim + dialog), reusing the card-detail body from step 1 (extract a shared `CardDetail` presentational component so the standalone page and the modal share one renderer).
- `SkillCard` flip at larger scale; reduced motion = instant; mobile = full-screen, swipe-down dismiss (mirror existing BottomSheet dismiss patterns).

### 3. Modal slot wiring — `apps/skills-showcase/app/@modal/default.tsx` (NEW)
- Returns `null` (default state when the `@modal` slot has no match). Required by Next.js parallel routes so non-intercepted renders don't error.
- Render the `modal` slot prop in the root `app/layout.tsx` alongside `children`. **Verify this does not disturb the existing `/deck/[slug]` pushState morph** — the routing note (§ Architecture) is explicit that intercepting routes render in a *different subtree* and must not touch the shared-`layoutId` deck morph. The deck builder stays on its own `pushState` path; only `/card/[id]` uses the parallel slot.

### 4. Expand affordances (wire the entry points)
- Fan card "expand" control and filled-slot "expand" → push `/card/[id]` (intercepted → modal). Add the affordance where the fan/slot card renders (`DeckTableShell.tsx` / `PackRitual.tsx` / `SkillCard`), guarded so **expand ≠ collect** (info-vs-collect tap split — tapping the card body still collects/flips; only the explicit expand control routes to `/card/[id]`). Do not regress collect/flight behavior.

## Files affected (full paths)
- `apps/skills-showcase/app/card/[id]/page.tsx` (new)
- `apps/skills-showcase/app/@modal/(.)card/[id]/page.tsx` (new)
- `apps/skills-showcase/app/@modal/default.tsx` (new)
- `apps/skills-showcase/app/layout.tsx` (add `modal` slot)
- A shared `CardDetail` component (new — match where comparable presentational components live, e.g. `src/showcase/` or `src/deck-builder/`)
- `apps/skills-showcase/src/deck-builder/DeckTableShell.tsx` and/or `src/components/PackRitual.tsx` / `SkillCard` (expand affordance)
- New tests: an e2e spec for `/card/[id]` standalone + intercept, and/or a Vitest test for `CardDetail` + `generateStaticParams` dedup.

## Key decisions / risks
- **Intercepting routes are new to this app** — the parallel-route `@modal` slot + `default.tsx` is the load-bearing Next.js mechanism; get the slot wiring right before styling. Confirm against the installed Next.js version's parallel/intercepting-route API.
- **Do not break the deck morph.** The `/deck/[slug]` pushState one-shell-mounted guarantee is CI-locked (`e2e/deck-table-shell.spec.ts` asserts a stable `deck-mount-id`, 18/18). Re-run that suite after the layout `modal` slot change.
- **Dedup parity:** `generateStaticParams` must enumerate exactly the mirrorKey-deduped set the catalog/benchmarks views show (~190) — reuse the existing dedup helper, don't reimplement.
- This phase is **additive**; the `/catalog`,`/packs`,`/workflows`,`/benchmarks`,`/inspect` → 308 retirement and the `/` landing rebuild are LATER phases — do NOT start them here.

## Acceptance criteria
- `npm run typecheck` clean.
- `npm run build` succeeds; `/card/[id]` statically generates the deduped card set.
- New `/card/[id]` tests green (standalone renders stats; expand opens the intercept modal over context; unknown id → 404).
- Vitest still 171/171 (+ new), Playwright still 18/18 (+ new) — the deck-morph + flight suites unchanged.
- Manual (`/run` or dev server): tap a fan card's expand → modal over the builder; open a `/card/[id]` direct link → standalone page indexed-renderable; Back dismisses the modal without disturbing the builder.

## Ship-one-step handoff contract
Implement **only Phase 3**, validate it (all acceptance criteria green), then run `/ship` when done. Do not start the route-retirement or `/`-landing phases in that session.
