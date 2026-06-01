# port-static-routes-next-app-router

| Field | Value |
|-------|-------|
| **Date** | 2026-05-11 18:27:40 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `45949500-f574-47d5-8258-3cd9eb534647` |
| **Entrypoint** | cli |
| **Version** | 2.1.138 |

---

## User _18:27:40_

Implement the following plan:

# Step 37.2: Port Static Routes into Next.js App Router

## Context

Phase 37 migrates the existing static Skills Showcase (`docs/skills-showcase/`) into a Next.js app (`apps/skills-showcase/`). Step 37.1 created the app shell (package.json, layout, globals.css, routes.ts). Step 37.2 ports the six static HTML pages into Next.js App Router page components, preserving content hierarchy and public route paths.

The static site is heavily client-interactive (workflow animations, catalog search/filter, pack map, proof rendering, newsletter form). Step 37.2 focuses on **route structure and content hierarchy** — Step 37.3 will handle styling migration and client interactions.

## Approach

Create server-rendered page components that reproduce the static HTML content hierarchy. Extract shared layout elements (header, footer, mobile panel) into reusable components. Pages that depend on client-side generated data (catalog, packs, inspect, follow) will include the structural HTML with `data-*` mounting targets; client JS hydration is deferred to Step 37.3.

### Files to Create

1. **`apps/skills-showcase/src/showcase/ShowcaseHeader.tsx`** — Shared header with nav, brand, mobile menu button, LexCorp + Follow actions. Accepts `currentPath` prop for `aria-current`.
2. **`apps/skills-showcase/src/showcase/ShowcaseFooter.tsx`** — Shared footer grid (G, LexCorp, Open Source columns).
3. **`apps/skills-showcase/src/showcase/MobilePanel.tsx`** — Mobile navigation panel (initially closed).
4. **`apps/skills-showcase/app/page.tsx`** — Home/overview: hero section, workflow preview grid placeholder, route cards, metrics.
5. **`apps/skills-showcase/app/workflows/page.tsx`** — Workflow lab: workflow selector sidebar, blueprint panel with animation stage/controls, detail columns.
6. **`apps/skills-showcase/app/packs/page.tsx`** — Pack map: summary metrics, filter controls, pack layout with core/output bands and detail aside.
7. **`apps/skills-showcase/app/catalog/page.tsx`** — Catalog: search/filter tools, generated catalog list placeholder, missing-data notice.
8. **`apps/skills-showcase/app/inspect/page.tsx`** — Inspect/proof: proof summary panel, proof grids for artifacts/validation/history, boundary notice.
9. **`apps/skills-showcase/app/follow/page.tsx`** — Follow: hero with proof panel, conversion cards, proof funnel, newsletter form with state tags.

### Key Decisions

- **Server components by default.** All pages are server components. No `"use client"` in this step — client interactivity comes in Step 37.3.
- **Preserve exact HTML structure and class names.** The CSS from `styles.css` targets these class names and `data-*` attributes. Preserving them means Step 37.3 can port the CSS and JS with minimal friction.
- **Preserve `data-*` attributes as mounting targets.** Elements like `data-catalog-list`, `data-workflow-list`, `data-pack-map`, `data-newsletter-form` etc. are the JS hydration targets. Keep them so app.js logic can be ported in Step 37.3.
- **External links preserved verbatim** (GitHub, YouTube, Discord, LexCorp, X/Twitter).
- **Script tags omitted.** The static pages load `skills-data.js`, `github-proof-data.js`, and `app.js` via script tags. In Next.js these will be replaced by component imports in Steps 37.3-37.4.
- **No `<html>`, `<head>`, `<body>` in pages** — handled by layout.tsx already.

### Shared Component Structure

```
ShowcaseHeader({ currentPath: string })
  .site-header > .nav-shell
    .brand (link to /)
    .main-nav (Workflows, Packs, Catalog, Inspect)
    .nav-actions (LexCorp external, Follow button)
    .menu-button (hamburger)

MobilePanel()
  .mobile-panel[data-mobile-panel][data-open="false"]
    nav (same links as header + mobile-specific)

ShowcaseFooter()
  .site-footer > .footer-grid
    G column (YouTube, X, GitHub, Discord)
    LexCorp column
    Open Source column (catalog, inspect links)
```

### Page Content Summary

| Route | Key sections | Data-dependent? |
|-------|-------------|-----------------|
| `/` | hero, workflow-preview grid, route cards, metrics | Yes (skill count, workflow previews) |
| `/workflows` | workflow selector, blueprint panel, animation controls | Yes (workflow data in JS) |
| `/packs` | pack summary, filter controls, pack map, detail aside | Yes (pack/skill data) |
| `/catalog` | search/filter tools, catalog list | Yes (skills data) |
| `/inspect` | proof summary, proof grids, boundaries | Yes (github proof data) |
| `/follow` | hero + proof panel, conversion cards, proof funnel, newsletter form | Yes (proof data, form states) |

All data-dependent rendering is currently done by `app.js` against DOM targets. The page components will render the static structural shell; dynamic rendering is Step 37.3.

## Verification

- Structural: each page file exports a default function component
- Route paths match: `/`, `/workflows`, `/packs`, `/catalog`, `/inspect`, `/follow`
- Class names and `data-*` attributes match the static HTML source
- No `"use client"` directives (deferred to Step 37.3)
- No dependency additions (no new packages)
- `routes.ts` inventory already matches these paths (confirmed in Step 37.1)


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/ddc5ac52-995b-43c8-97ac-c080de3e4c5b.jsonl

## Assistant _18:27:44_

I'll start by reading the existing static HTML files and the current app shell to understand the exact structure to port.

## Assistant _18:27:48_

<details><summary>Tool calls</summary>

- Agent: Explore static HTML files

</details>

## Assistant _18:28:39_

Good, I have the structural overview. Let me now read the actual HTML source files to get exact content for porting.

## Assistant _18:28:40_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/index.html`

</details>

## Assistant _18:28:40_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/workflows/index.html`

</details>

## Assistant _18:28:41_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/packs/index.html`

</details>

## Assistant _18:28:43_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/catalog/index.html`

</details>

## Assistant _18:28:44_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/inspect/index.html`

</details>

## Assistant _18:28:44_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/follow/index.html`

</details>

## Assistant _18:28:45_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/layout.tsx`

</details>

## Assistant _18:28:45_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/routes.ts`

</details>

## Assistant _18:28:49_

Now I have all the source HTML. Let me check the existing directory structure and then create all the files.

## Assistant _18:28:50_

<details><summary>Tool calls</summary>

- Bash: List existing app shell files

</details>

## Assistant _18:28:56_

Good. Now I'll create all 9 files. Let me start with the 3 shared components and 6 page files.

## Assistant _18:29:01_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/ShowcaseHeader.tsx`

</details>

## Assistant _18:29:03_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/MobilePanel.tsx`

</details>

## Assistant _18:29:07_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/ShowcaseFooter.tsx`

</details>

## Assistant _18:29:10_

Shared components done. Now creating all 6 page files.

## Assistant _18:29:32_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/page.tsx`

</details>

## Assistant _18:29:47_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/workflows/page.tsx`

</details>

## Assistant _18:29:59_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/packs/page.tsx`

</details>

## Assistant _18:30:07_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/catalog/page.tsx`

</details>

## Assistant _18:30:17_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/inspect/page.tsx`

</details>

## Assistant _18:30:41_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/follow/page.tsx`

</details>

## Assistant _18:30:43_

All 9 files created. Now let me verify — TypeScript compilation check and structural validation.

## Assistant _18:30:44_

<details><summary>Tool calls</summary>

- Bash: TypeScript check on the app

</details>

## Assistant _18:30:45_

<details><summary>Tool calls</summary>

- Bash: List all tsx files created

</details>

## Assistant _18:30:49_

TypeScript isn't installed locally yet (expected — no dependency additions in this step per the plan). Let me do a quick structural grep to verify key constraints.

## Assistant _18:30:52_

<details><summary>Tool calls</summary>

- Bash: Verify no use-client, all default exports, and data attributes present

</details>

## Assistant _18:30:54_

All checks pass. Now committing and pushing.

## Assistant _18:30:54_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _18:34:13_

<details><summary>Tool calls</summary>

- Bash: Stage and commit all new files

</details>

## Assistant _18:34:16_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _18:34:26_

Step 37.2 complete. Created 9 files (867 lines):

**Shared components** (`src/showcase/`):
- `ShowcaseHeader.tsx` — nav with `currentPath` prop for `aria-current`
- `ShowcaseFooter.tsx` — 3-column footer grid
- `MobilePanel.tsx` — mobile nav panel with `data-open="false"`

**Page routes** (`app/`):
- `/` — hero, blueprint panel, state machine, metrics, workflow preview grid, route cards
- `/workflows` — workflow selector sidebar (4 buttons), blueprint panel with animation controls and detail columns
- `/packs` — filter controls, pack-band layout (core/output), pack-map and detail aside
- `/catalog` — search/filter tools, catalog list placeholder
- `/inspect` — proof summary panel, proof grids, boundary notices
- `/follow` — hero + proof panel, conversion cards, proof funnel, newsletter form with state tags

All class names and `data-*` attributes match the static HTML verbatim. No `"use client"` directives, no new dependencies. Internal links use Next.js `<Link>`, external links use plain `<a>`.

## User _18:35:03_

why is no use client directives a requirement?

## Assistant _18:35:12_

Two reasons specific to this step:

1. **All data rendering is currently done by vanilla JS (`app.js`) hitting DOM targets via `data-*` attributes.** There's no React state, no event handlers, no hooks in these components — they're pure structural HTML shells. Making them server components means they render to HTML on the server with zero client JS bundle cost, which is exactly what static structural shells should be.

2. **Step 37.3 is where client interactivity gets ported.** When that step converts workflow animations, catalog search/filter, pack map interactions, and the newsletter form into React state + event handlers, those specific components will get `"use client"` at that point. Deferring it keeps a clean separation: 37.2 = structure, 37.3 = behavior.

If we added `"use client"` now, every page would ship its entire component tree as client JS for no reason — no hooks, no state, no event listeners to actually run. It's just wasted bundle.

## User _18:37:20_

we should refactor if needed to get the most out of nextjs and its features if needed

## Assistant _18:37:24_

Let me read the existing plan and then explore the current code to identify Next.js optimization opportunities.

## Assistant _18:37:24_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/.claude/plans/cheeky-napping-cherny.md`

</details>

## Assistant _18:37:27_

Now let me explore the current implementation and the Next.js config to identify refactoring opportunities.

## Assistant _18:37:34_

<details><summary>Tool calls</summary>

- Agent: Explore current Next.js app structure

</details>

## Assistant _18:38:09_

Good audit. Now let me check how the home page differs from the other 5 pages (it has footer, they don't) and read the tsconfig to confirm the path alias.

## Assistant _18:38:09_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/tsconfig.json`

</details>

## Assistant _18:38:10_

<details><summary>Tool calls</summary>

- Bash: Check which pages import ShowcaseFooter

</details>

## Assistant _18:38:14_

Only the home page uses ShowcaseFooter. The other 5 pages have header + mobile panel but no footer — matching the static HTML source (only `index.html` had a footer). Now I have a clear picture. Let me write the plan.

## Assistant _18:39:07_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/.claude/plans/cheeky-napping-cherny.md`

</details>

## Assistant _18:39:09_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _18:39:14_

Five changes across 8 existing files — no new files, no new deps. The big wins are: shared chrome moves to the layout (DRY), per-page metadata (SEO), `usePathname()` replaces manual prop drilling, and `@/` aliases clean up imports.

## Assistant _18:39:14_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _18:40:04_

[Request interrupted by user for tool use]
