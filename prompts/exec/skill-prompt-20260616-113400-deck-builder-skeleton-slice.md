---
skill: exec
agent: claude
captured_at: 2026-06-16T11:34:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Deck-Builder Skeleton — Next Implementation Slice

## Context

The Skills Showcase (`apps/skills-showcase/`, Next.js 16.2.6) has an **approved** animation design phase for the deck-builder, produced by `$animation-design-planner` and locked at `apps/skills-showcase/docs/animation-plan-deck-builder.md` (all 9 gates answered, `section_feedback: []`). The plan defines two new framer-motion transitions — `blueprint-morph` (table blueprint card ↔ builder panel at `/deck/[slug]`) and `card-flight` (fan card flies into a deck slot).

The load-bearing risk — whether Next 16.2.6 tolerates shallow `window.history.pushState` + `popstate` without remounting the shared shell — has already been **proven green** by the shipped routing spike (`tasks/ship-manifest-2026-06-11-deck-builder-routing-spike.md`: 136 unit tests + 2 Playwright tests passing; a hydration-mismatch bug was found and fixed).

The plan's Implementation Handoff step 5 says: *"Only after the spike is green, proceed to full table + builder skeleton and then motion implementation."* The spike is green, so **this slice builds the skeleton only** — real `DeckTableShell`, the `DeckFlowPhase` state machine, `BuilderPanel`, and localStorage-backed deck state — **with no motion yet** (no `layoutId` morph, no `FlightLayer` clones). This is the smallest reviewable slice and keeps the motion work as a clean follow-up.

This was confirmed with the user: scope = "Skeleton only first"; focus = "Yes, resume deck-builder."

## Goal

Replace the throwaway `DeckRoutingSpikeShell` proof harness with a real, motion-free deck-builder skeleton that:
- renders a table of deck blueprints at `/` and an open builder at `/deck/[slug]`,
- owns `DeckFlowPhase` and per-slug collected-card state (localStorage),
- routes open/close via the spike's proven `pushState` + `popstate` + `usePathname` pattern,
- correctly hydrates hard-loads of `/deck/[slug]` directly into `builder-open`.

Phase transitions land **instantly** in this slice; the named phases exist as state so the later motion slice only adds animation + completion callbacks, not new control flow.

(Full plan body continues in the implementation; captured verbatim from the user's visible invocation. The plan's Approach, Critical files, and Verification sections governed this slice.)
