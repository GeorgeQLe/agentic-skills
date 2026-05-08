# Active Phase: None

**Project:** Claude Skills / agentic-skills
**Status:** Phase 34 is complete as of 2026-05-08. No implementation phase is currently active.

## Completed Phase

Phase 34 - Skills Showcase Distribution Launch is archived at `tasks/phases/phase-34.md`.

## Launch Follow-Ups

Manual launch tasks remain in `tasks/manual-todo.md`:

- Choose and configure the static newsletter/email provider endpoint on `/follow/`, then re-run local validation.
- Configure the Vercel project for `docs/skills-showcase/` and verify deployed static route reloads after final local validation.

## Validation Snapshot

- `scripts/validate-skills-showcase-data.sh` passed after refreshing generated proof data.
- `node --check docs/skills-showcase/app.js` passed.
- Static route files exist for `/`, `/workflows/`, `/packs/`, `/catalog/`, `/inspect/`, and `/follow/`.
- One local HTTP HEAD check for `/` returned `HTTP/1.0 200 OK`; repeated temporary-server curl checks were unreliable in the sandbox.
- Targeted scans confirmed LexCorp, YouTube, X/Twitter, Discord, GitHub, newsletter states, proof boundaries, accessibility hooks, and reduced-motion handling.
- `git diff --check` passed.

## Next Work

Discover the next candidate project phase, or explicitly park the project after manual launch tasks are handled.

**Recommended next command:** `$brainstorm`

## Current Hotfix: Skills Showcase Hero Overlap

**Status:** Fixed on 2026-05-08.

**Plan**

- [x] Validate the reported homepage hero text/diagram collision against the current static site.
- [x] Trace the responsible hero HTML/CSS and recent git history.
- [x] Apply the smallest responsive layout fix that preserves the blueprint design.
- [x] Verify static syntax, generated data freshness, whitespace, and desktop/mobile visual layout.
- [x] Record investigation results and ship the tracked changes.

## Review

**Strategy Used:** UI investigation. No pivot required.

**User Claims Validated:** Confirmed. The homepage hero placed large headline text in a 5-column grid track while the right-side blueprint occupied 7 columns, and the layout did not stack until `900px`.

**Root Cause:** `docs/skills-showcase/styles.css` used an asymmetric desktop hero grid (`.hero-copy` span 5, `.hero-visual` span 7) with `h1` scaling up to `9vw`, so mid-size desktop/tablet widths could let the headline overflow into the blueprint area. The relevant layout was introduced with the initial showcase shell commit `bac0b1e`.

**Fix Applied:** Adjusted the hero to a balanced 6/6 desktop grid, added `min-width: 0` to both hero grid items, reduced the desktop headline clamp, moved the single-column hero breakpoint to `1080px`, and tightened stacked/mobile headline and blueprint wrapping so the diagram drops below the text before crowding it.

**Prevention:** Browser visual checks at desktop, tablet, and mobile widths should be part of showcase UI validation whenever hero copy or blueprint layout changes.
