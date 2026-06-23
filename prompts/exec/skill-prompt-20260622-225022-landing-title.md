---
skill: exec
agent: codex
captured_at: 2026-06-22T22:50:22-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Keep Landing Hero Title On One Line

## Summary
Fix the landing hero H1 so `What are you building?` stays on one line when there is available horizontal space, and scale it down on mobile instead of wrapping awkwardly.

## Key Changes
- Override the global `h1 { max-width: 13ch; }` rule for `.landing-title`.
- Set `.landing-title` to use the available hero width instead of inheriting the narrow global marketing-page heading width.
- Add a mobile-specific `.landing-title` font-size rule so the title remains smaller and fits cleanly on narrow screens.
- Keep the existing hero copy, spacing, and browse-section spacing unchanged.

## Implementation
- In `apps/skills-showcase/app/globals.css`, update `.landing-title`:
  - Add `max-width: none`.
  - Add `white-space: nowrap` so desktop/tablet does not wrap when space exists.
- In the existing `@media (max-width: 700px)` block, add:
  - `.landing-title { font-size: clamp(1.55rem, 7vw, 2rem); }`
- Do not change the JSX; the current text has no forced line break.

## Test Plan
- Verify desktop at `1440px`: title renders as one line.
- Verify tablet at `700px`: title renders as one line.
- Verify mobile at `390px`: title renders as one line with smaller text and no horizontal overflow.
- Run focused landing test:
  - `pnpm --dir apps/skills-showcase test src/showcase/landing/LandingExperience.test.tsx`
- Use Playwright measurement to confirm `body.scrollWidth === viewportWidth` on mobile.

## Assumptions
- The desired behavior is one-line title across common desktop, tablet, and mobile widths.
- The title text remains exactly `What are you building?`.
