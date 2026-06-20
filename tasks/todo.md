# Unified Experience — Phase 6: Legacy archive + nav rebuild

> Full design context: `apps/skills-showcase/docs/unified-experience.md` — §"Build phasing" step 6 ("Legacy archive + nav rebuild — redirects + delete folded routes/tests + rebuild header"), §"Legacy migration + shell", and the route table (§"/deck/[slug]: keep the pushState morph"). Phases 1–5 shipped — see `tasks/history.md` (2026-06-19 ×3, 2026-06-20 ×2) and commits through `5ff0c6e5` (Phase 5 Tailwind-to-root).

## Phase 5 review (COMPLETE — shipped 2026-06-20, commit `5ff0c6e5`)

- [x] Moved the single `@import "tailwindcss";` to the root `app/globals.css`; deleted the four scoped imports (`landing.css`, `deck/deck.css`, `card/card.css`, `prototype/prototype.css`) + the three pure pass-through layouts (`card`, `deck`, `@modal`) that existed only to inject scoped Tailwind. Absorbed the byte-identical pack-primitive keyframes into one globals block. CSS-plumbing only.
- [x] Preflight regression (browser-default `p` bottom margin zeroed) fixed with one scoped `.page p { margin-bottom: 1em }`; Tailwind-designed surfaces (outside `.page`) untouched.
- [x] Verified: typecheck clean (after `rm -rf .next`), build (`/` static + 196 SSG cards), Vitest 182/182, Playwright 26/26, dev-server before/after screenshots of all 7 marketing routes (4 pixel-exact, 3 imperceptible). Only one `@import "tailwindcss";` remains.

## Execution Profile

**Serial, implementation-safe, but the highest-blast-radius unified-experience phase.** This deletes/redirects five live marketing routes and rebuilds the global header/footer/mobile nav. Single lane, direct to master. Test strategy: **tests-after** for the redirect/nav behavior (add e2e asserting each legacy path 308s → `/` and the new nav links resolve), and **delete** the obsolete component tests in the same commits as their components. Do NOT start Phase 7 (deferred polish: custom-deck output + overlay install lines + reduced-motion `SealedPack`/`PackOpener` branches).

> **Scope confirmation (destructive):** This phase deletes tracked route pages, showcase components, and their tests, and rewrites the global nav. That is the explicitly planned Phase 6 scope (per the unified-experience doc), so it is in-scope, but the implementer should re-state the exact delete list in the ship manifest and confirm no out-of-plan file is swept in.

## Goal

Make `/` the only content front door: 308-redirect the five folded marketing routes to `/`, delete their now-orphaned pages + components + tests, and rebuild the global header / mobile panel / footer around the game metaphor (brand → `/`, a Cards browse entry, Follow, LexCorp) so nothing links to a removed route. Keep the newsletter + TRPC backend fully intact. Hide the deck-debug gear on public `/`.

## What to build

### 1. 308 redirects for the folded routes
- Replace each of `app/catalog/page.tsx`, `app/packs/page.tsx`, `app/workflows/page.tsx`, `app/benchmarks/page.tsx`, `app/inspect/page.tsx` with a permanent redirect to `/`. Two viable mechanisms — pick one and apply uniformly:
  - **Preferred:** `next.config` `async redirects()` returning `{ source, destination: "/", permanent: true }` for all five (one config-level source of truth, real 308s, no React render). Verify the showcase's `next.config.*` location and current contents first; if `redirects()` already exists, extend it.
  - **Alternative:** per-route `export default function() { redirect("/"); }` using `next/navigation` `redirect` (issues 307 by default — use `permanentRedirect` for 308). Config-level is cleaner and is what the doc implies ("308 → `/`").
- Delete the route directories' page bodies; if using config redirects, the `app/<route>/page.tsx` files should be removed entirely so the redirect (not a stale page) serves the path.

### 2. Delete the folded components + their tests
- Delete `src/showcase/catalog.tsx` + `catalog.test.tsx`, `src/showcase/workflows.tsx` + `workflows.test.tsx`, `src/showcase/benchmarks.tsx` + `benchmarks.test.tsx`. ( `/packs` and `/inspect` render inline in their `page.tsx` — confirm by reading those files; delete any now-dead helpers they pulled in, but do NOT delete shared data/util modules still used by `/`, `/card`, `/deck`.)
- **Keep:** `src/showcase/admin-newsletter.tsx` (+ test), `newsletter-form.tsx` (+ test), `ShowcaseFooter.tsx`, `ShowcaseHeader.tsx`, `MobilePanel.tsx`, `ShowcaseShell.tsx`, `smoke.test.tsx` (update its assertions, don't delete), `routes.ts`, and everything under `app/follow`, `app/admin/newsletter`, `app/api/trpc`, `TRPCProvider`.

### 3. Rebuild the global nav (header + mobile panel + footer + routes.ts)
- Rewrite `src/showcase/routes.ts` to the game-metaphor surface: brand → `/`, **Cards** (browse), **Follow** (`/follow`), **LexCorp** (external `https://leexperimental.com`). Drop the Overview/Workflows/Packs/Catalog/Benchmarks/Inspect entries.
- **Decision/risk — "Cards" browse target:** the doc's nav names "Cards → `/card` browse", but no `/card` index route exists yet (Phase 3 built only `/card/[id]`). Resolve in plan-mode review: either (a) point "Cards" at `/` (the landing already mounts the deck Table / card surfaces — simplest, no new route), or (b) scope a thin `/card` index page in this phase. **Default to (a)** unless the user wants the index now — a `/card` index is arguably Phase 7 polish. Do not build it speculatively.
- Update `src/showcase/ShowcaseHeader.tsx` + `MobilePanel.tsx` to render from the rewritten `routes.ts` (or hardcode the small new set) — remove the hardcoded `/workflows`/`/packs`/… `<Link>`s. Update `ShowcaseFooter.tsx`'s "Skills catalog" / "Inspect the system" links (they point at `/catalog` + `/inspect`) to surviving routes.
- **Grep every `href`/`Link`/route string to a removed path before finishing** (`/catalog`, `/packs`, `/workflows`, `/benchmarks`, `/inspect`) across `src/` and `app/` and fix each. Known current referrers (from Phase 5 grep): `routes.ts`, `ShowcaseHeader.tsx`, `MobilePanel.tsx`, `ShowcaseFooter.tsx`, the deleted component files, `app/card/[id]/page.tsx`, `app/globals.css` (CSS class names like `.catalog-row` are NOT routes — leave styling alone unless its component is deleted), and `src/server/skillsData.ts` (verify whether it emits any `/catalog`-style link; likely just `/deck/<slug>` — confirm).

### 4. Hide the deck-debug gear on public `/`
- Phase 4 residual: the collapsed `DebugPanel` gear renders on public `/` (the deck-debug harness's only home after the spike was deleted). Gate it so it does not show in production — e.g. render the debug controller/panel only when a debug flag/query param is present, or guard on `process.env.NODE_ENV !== "production"`. Locate the mount in `DeckTableShell.tsx` / `DeckDebugHarness` and the `DebugPanel` import; keep the e2e debug drivers working (the Playwright suite drives the harness via `window.__deck*` bridges, not the visible gear — confirm the gate doesn't break those bridges).

## Files affected (full paths, under `apps/skills-showcase/`)
- `next.config.*` (confirm exact name) — add/extend `async redirects()` for the five legacy paths (if using the preferred mechanism).
- Delete: `app/catalog/page.tsx`, `app/packs/page.tsx`, `app/workflows/page.tsx`, `app/benchmarks/page.tsx`, `app/inspect/page.tsx` (+ empty dirs).
- Delete: `src/showcase/catalog.tsx`, `catalog.test.tsx`, `workflows.tsx`, `workflows.test.tsx`, `benchmarks.tsx`, `benchmarks.test.tsx`.
- Edit: `src/showcase/routes.ts`, `ShowcaseHeader.tsx`, `MobilePanel.tsx`, `ShowcaseFooter.tsx`, `smoke.test.tsx`.
- Edit: `src/deck-builder/DeckTableShell.tsx` (or wherever `DebugPanel`/`DebugProvider` mounts) — gate the gear off production.
- Add: `e2e/legacy-redirects.spec.ts` (assert each legacy path → 308/`/`) + a nav-link e2e (or extend an existing spec).
- Possibly edit: `app/globals.css` — only if deleting a component orphans now-unused CSS blocks (`.catalog-*`, `.workflow-*`, `.pack-*`, `.benchmark-*`, `.proof-*`). **Low priority / optional:** dead CSS is harmless; removing it is a nicety, not required. If removed, do it carefully (those classes may be shared — grep first).

## Key decisions / risks
- **Redirect mechanism:** config-level `redirects()` (308, no render) over per-page `redirect()`. Confirm `next.config` shape first.
- **"Cards" nav target:** default to `/` (no new route); only build a `/card` index if the user asks. Flag this in plan-mode approval.
- **Don't touch the deck morph or newsletter:** `/deck/[slug]` pushState morph (CI-locked stable `deck-mount-id`) and `/follow`+`/admin/newsletter`+`/api/trpc` stay exactly as-is. The redirects/nav changes must not alter them.
- **smoke.test.tsx:** it currently asserts landing-surface + preserved-footer (updated in Phase 4). Re-check its footer-link assertions after the footer links change; update, don't delete.
- **Dead CSS:** optional cleanup; if touched, grep each class — several `.pack-*`/`.proof-*` blocks may still be used by surviving surfaces.

## Acceptance criteria
- `npm run typecheck` clean.
- `npm run build` succeeds; `/` static + 196 SSG `/card/*` pages intact; the five legacy routes no longer build as pages (they redirect).
- Each of `/catalog`, `/packs`, `/workflows`, `/benchmarks`, `/inspect` returns a 308 (or 307 if `redirect()` chosen — prefer 308) to `/` (curl `-o /dev/null -w "%{http_code}"` against the dev/preview server, or assert in `e2e/legacy-redirects.spec.ts`).
- No `href`/route string anywhere in `src/`+`app/` points at a removed route (grep clean).
- Header / mobile panel / footer render the new game-metaphor nav; every nav link resolves (no 404).
- The deck-debug gear is hidden on production `/`; the Playwright deck suite still passes (debug bridges intact).
- Vitest all-green (obsolete component tests deleted, smoke updated); Playwright all-green (26 existing + new redirect/nav assertions).
- Manual (`/run` or dev server): walk the full journey per the doc's §Verification — land `/` → pick domain → CTA → tear packs → inspect/flip → hand-off → load AFPS starter → collect to completion → open a `/card/[id]` direct link → Back (morphs to table); confirm `/catalog`,`/packs` 308 → `/`, and `/follow` + `/admin/newsletter` unchanged.

## Ship-one-step handoff contract
Implement **only Phase 6**, validate it (all acceptance criteria green, full-journey manual walk + legacy redirects + newsletter pages verified), then run `/ship` when done. Do not start Phase 7 (deferred polish) in that session.
