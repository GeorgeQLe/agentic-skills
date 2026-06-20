# Unified Experience — Phase 5: Tailwind-to-root + CSS unify

> Full design context: `apps/skills-showcase/docs/unified-experience.md` — §"Build phasing" step 5 ("Tailwind-to-root + CSS unify — isolated; verify newsletter pages"). Phases 1–4 shipped — see `tasks/history.md` (2026-06-19 ×3, 2026-06-20) and commits `c532be7e`, `dc12b4a5`, the Phase 3 `/card/[id]` ship, and the Phase 4 landing ship.

## Phase 4 review (COMPLETE — shipped 2026-06-20)

- [x] Replaced marketing `/` with the pack-first landing (`src/showcase/landing/LandingExperience.tsx`): domain picker → CTA → pack-opening allotment (inspect mode, no collect) → hand-off chooser.
- [x] Mounted the deck blueprint Table (`<DeckDebugHarness/>`) below the journey from first paint → deck-routing contract (mount-id, morph, flight, debug drivers) preserved at `/`.
- [x] `TABLE_PATH` `/prototype/deck-routing-spike` → `/` in `DeckTableShell.tsx` + `e2e/deck-table-shell.spec.ts` + `DeckTableShell.test.tsx`.
- [x] Deleted the routing spike `app/prototype/deck-routing-spike/` (kept `app/prototype/page.tsx`).
- [x] Scoped Tailwind `app/landing.css` (mirrors `app/deck/deck.css`) + `.landing*` chrome in `globals.css`. Footer + `/follow` + `/admin/newsletter` untouched.
- [x] Tests: 6 new Vitest (`LandingExperience.test.tsx`) + 4 new Playwright (`landing.spec.ts`). Typecheck clean; build `/` static + 196 SSG card pages; Vitest 182/182; Playwright 26/26. Adversarial review: no must-fix.

## Execution Profile

**Serial, implementation-safe, isolated.** Pure CSS/layout refactor — unify the scoped Tailwind imports into the root so utilities resolve globally, then delete the now-redundant per-route scoped CSS imports. Single lane, direct to master. Test strategy: **tests-after** (the existing Vitest + Playwright suites are the regression net; add a render assertion only if a route's styling contract is newly load-bearing). Do NOT start Phase 6 (legacy archive + nav rebuild: 308 redirects, delete folded routes/tests, rebuild header).

## Goal

Move the Tailwind import to the root layout (`app/globals.css` or root layout) so every route has Tailwind, then retire the three scoped Tailwind imports (`app/landing.css`, `app/deck/deck.css`, `app/card/card.css`, and the `@modal` layout's scoped Tailwind) that only exist because the root had no Tailwind. The non-Tailwind marketing/catalog/newsletter routes must NOT visually regress when Tailwind utilities become globally available.

## What to build

### 1. Add Tailwind at the root (§build phasing step 5)
- Add `@import "tailwindcss";` to `app/globals.css` (loaded by the root layout for every route). This makes Tailwind utilities resolve on `/catalog`, `/packs`, `/workflows`, `/benchmarks`, `/inspect`, `/follow`, `/admin/newsletter` — which currently have NO Tailwind.
- **Risk — utility/class collisions:** the marketing routes are authored with plain CSS classes in `globals.css`. Tailwind v4's preflight (base reset) can change default element styling (margins, headings, lists, buttons). Audit the marketing pages for preflight regressions: heading margins, `ul/ol` list-style, `button` appearance, `a` underline. If preflight breaks them, either (a) scope preflight, or (b) add the small set of compensating base styles to `globals.css`. Prefer the smallest change that keeps the marketing pages pixel-stable.

### 2. Retire the scoped Tailwind imports
- Once Tailwind is global, delete the `@import "tailwindcss";` from `app/landing.css`, `app/deck/deck.css`, `app/card/card.css`, and `app/@modal/layout.tsx`'s scoped CSS. Keep the pack-primitive **keyframes** (shimmer/arrow-pulse/scrim-pulse + `.shimmer-foil`/`.tear-hint-arrow`) — move them to `globals.css` (single-source) or leave the per-route CSS files carrying only keyframes. Simplest: move the keyframes into `globals.css` and delete the now-empty/near-empty scoped CSS files + their imports.
- Verify `app/deck/layout.tsx`, `app/card/layout.tsx`, `app/page.tsx` no longer import a dead CSS file.

### 3. Verify the newsletter + marketing pages (explicit acceptance gate)
- `/follow` (newsletter form) and `/admin/newsletter` are the highest-risk non-Tailwind pages (forms, inputs, buttons). Manually verify (dev server / `/run`) they render unchanged after Tailwind goes global. The smoke tests already assert their headings/controls render — keep them green.

## Files affected (full paths)
- `apps/skills-showcase/app/globals.css` — add `@import "tailwindcss";` at top; absorb the pack keyframes; possibly small preflight-compensation base styles.
- `apps/skills-showcase/app/landing.css`, `apps/skills-showcase/app/deck/deck.css`, `apps/skills-showcase/app/card/card.css` — drop the Tailwind import (and the file entirely if it becomes empty after keyframes move); update the importers (`app/page.tsx`, `app/deck/layout.tsx`, `app/card/layout.tsx`).
- `apps/skills-showcase/app/@modal/layout.tsx` — drop its scoped Tailwind.
- `apps/skills-showcase/app/prototype/prototype.css` + `app/prototype/layout.tsx` — the prototype dev harness also scopes Tailwind; fold or leave (it's a dev route — lowest priority; note decision).

## Key decisions / risks
- **Tailwind v4 preflight is the main risk.** Going global applies the base reset to the marketing pages for the first time. This is exactly why the doc calls out "verify newsletter pages." Budget the bulk of the effort here: diff the marketing routes before/after, fix preflight regressions with the minimal base-style additions.
- **Do not change any component markup** — this is a CSS-plumbing phase. If a component needs restyling, that's Phase 6/7, not here.
- **Keep all 26 Playwright + 182 Vitest green** — the pack primitives / deck / card / landing already rely on Tailwind; moving it to root must not change their resolved styles (same utilities, broader scope).

## Acceptance criteria
- `npm run typecheck` clean.
- `npm run build` succeeds; every route renders; no dead CSS import.
- Vitest still all-green (+ any new); Playwright still all-green — deck-morph/flight/mount-id + card-detail + landing suites unchanged in behavior.
- Manual (`/run` or dev server): `/`, `/deck/<slug>`, `/card/<id>`, `/catalog`, `/packs`, `/workflows`, `/benchmarks`, `/inspect`, `/follow`, `/admin/newsletter` all render with no visual regression (especially `/follow` + `/admin/newsletter` forms).
- Only one `@import "tailwindcss";` remains in the tree (at the root).

## Ship-one-step handoff contract
Implement **only Phase 5**, validate it (all acceptance criteria green, marketing/newsletter pages visually verified), then run `/ship` when done. Do not start Phase 6 (legacy archive + nav rebuild) in that session.
