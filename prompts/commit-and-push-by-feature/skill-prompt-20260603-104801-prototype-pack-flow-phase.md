---
skill: commit-and-push-by-feature
agent: codex
captured_at: 2026-06-03T10:48:01-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Single-Phase Pack Animation Flow Plan

## Summary

Refactor `/prototype` pack/drawer orchestration so one `PackFlowPhase` state is the lifecycle authority. Keep `activePack` as separate data identity, but remove page-level lifecycle booleans such as `isSheetMounted`, `isDrawerClosing`, and `isDrawerClosingRef`. The current implementation works by coordinating those parallel states, but that recreates the “two sources of truth” surface: sheet lifetime, drawer collapse, shared-layout identity, and debug readout can drift.

## Key Changes

- Add a page-owned phase type:
  ```ts
  type PackFlowPhase =
    | "sealed"
    | "opening-apex"
    | "drawer-open"
    | "closing-collapse"
    | "sheet-exiting"
    | "layout-morph-out"
    | "drop-elevation";
  ```
- Keep only:
  ```ts
  activePack: OpenPackState | null
  openedPacks: Set<string>
  phase: PackFlowPhase
  ```
- Derive runtime booleans:
  ```ts
  isSheetOpen = phase === "drawer-open" || phase === "closing-collapse"
  isDrawerClosing = phase === "closing-collapse"
  canDismiss = phase === "drawer-open"
  isPackInDrawer = activePack?.packName === pack.name && phase !== "sealed"
  ```
- Do not clear `activePack` until the final close phase completes. This preserves Framer Motion `layoutId` continuity through collapse, sheet exit, morph-out, and elevation drop.

## Implementation Changes

- In `app/prototype/page.tsx`, replace `openPack`, `isDrawerClosing`, `isSheetMounted`, and `isDrawerClosingRef` lifecycle coordination with `activePack + phase`.
- On open, set `activePack`, mark pack opened, and move to `drawer-open` after the existing SealedPack open callback. Preserve current click/drag/first-tear behavior; do not redesign visuals.
- On close, transition:
  `drawer-open -> closing-collapse -> sheet-exiting -> layout-morph-out -> drop-elevation -> sealed`.
- `BottomSheet.isOpen` must be derived from phase. `BottomSheet.onExitComplete` should only advance phase to `layout-morph-out`; it must not clear `activePack`.
- `PackOpener` should still receive a boolean prop, but it should be derived: `isClosing={phase === "closing-collapse"}`. Its `onCollapseComplete` should advance to `sheet-exiting`.
- `SealedPack` should receive the active phase or equivalent derived props needed to report and complete `layout-morph-out` / `drop-elevation`. It should call back when the close morph and elevation drop are done so the page can clear `activePack` and set `phase = "sealed"`.
- Update the debug animation-machine runtime to report `page.phase` and derived values. Replace `page.isDrawerClosing` / `page.isSheetMounted` as source fields; they may remain only as derived display fields if needed for compatibility.

## Test Plan

- Update `prototype-close-sequence.test.tsx` to assert phase transitions instead of independent booleans:
  `drawer-open -> closing-collapse -> sheet-exiting -> layout-morph-out -> drop-elevation -> sealed`.
- Assert `BottomSheet` remains open during `closing-collapse`, begins exit during `sheet-exiting`, and `activePack` remains set until `drop-elevation` completes.
- Assert reset sets `phase = "sealed"`, clears `activePack`, clears `openedPacks`, and calls `SealedPack.resetValues`.
- Add a source/regression assertion that `page.tsx` no longer declares `isSheetMounted`, `isDrawerClosing`, or `isDrawerClosingRef`.
- Preserve existing tests for PackOpener one-shot collapse completion, one-card close completion, and SealedPack gate order: `layout-morph-out` before `drop-elevation` before elevation drop.
- Run:
  - `pnpm --dir apps/skills-showcase typecheck`
  - `pnpm --dir apps/skills-showcase test`
  - manual/browser check on `/prototype` with debug stepped mode through open and close.

## Assumptions

- This is a state-orchestration refactor, not a visual redesign.
- Existing working behaviors stay intact: click/drag open apex, first-tear auto-open, drawer fan-out, visible top-left collapse targeting, debug gates, and current animation timing.
- `activePack` is allowed to be separate from `phase` because it is data identity, not lifecycle authority.
- The implementation should not introduce a new animation library or replace Framer Motion `layoutId`; it should make the current Framer flow deterministic.
