---
skill: exec
agent: codex
captured_at: 2026-06-01T10:49:49-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Animation State Machine Visualization Plan

## Summary
Build both a live `/prototype` debug-panel visualization and a durable static reference page from one canonical state-machine model. Use a custom responsive SVG renderer with no new dependencies. The graph should show the full animation state machine, including debug step boundaries, React state, refs, and key motion values.

## Key Changes
- Add a canonical model under the existing debug subsystem, with typed nodes and transitions for:
  - Page state: `openPack`, `openedPacks`, `isDrawerClosing`, `isSheetMounted`.
  - Pack state: `dragX`, `curlOpacity`, `pendingOpen`, `cardDragY`, `cardSlideY`, `cardElevated`, `wasInDrawer`, `isCloseMorphBackInFlight`.
  - Drawer state: `fanOffsets`, `collapseState`, `targetIndex`, `card0X/card0Y`, collapse counters, `collapseCompleteFiredRef`.
  - Sheet state: `sheetY`, mounted/open/exiting, dismissable.
  - Debug boundaries: all existing `OPEN_STEPS` and `CLOSE_STEPS`, including apex nodes.
- Extend the debug readout contract to include a `machine` snapshot, reported by `PrototypePage`, `SealedPack`, `PackOpener`, and `BottomSheet`.
- Add a reusable custom SVG component that renders:
  - Swimlanes for Page, SealedPack, BottomSheet, PackOpener, and Debug Gates.
  - Directed transitions for open-click, open-tear, drag-up, close, collapse, sheet exit, morph-out, and reset.
  - Active, reached, paused, apex, blocked, and reset states.
  - A side detail panel for selected node internals and transition triggers.
- Extend `DebugPanel` with a compact “State machine” section:
  - Default collapsed on small screens.
  - Highlights `pausedAtStep` and `reachedSteps`.
  - Shows current internals from the new machine snapshot.
- Add a static page, preferably `apps/skills-showcase/alignment/animation-state-machine.html`, generated from the same model and linked from the existing animation audit/forensics docs.

## Interfaces / Types
- Add types similar to:
  - `AnimationMachineNode`: `id`, `label`, `lane`, `phase`, `kind`, `stepId?`, `apex?`, `trackedFields`, `description`, `x`, `y`.
  - `AnimationMachineTransition`: `from`, `to`, `trigger`, `source`, `guard?`, `effect?`, `stepId?`.
  - `AnimationMachineSnapshot`: current page/pack/drawer/sheet/debug values plus `activeNodeIds` and `activeTransitionIds`.
- Keep the existing `StepDef` ids stable. The visualization must consume `OPEN_STEPS` and `CLOSE_STEPS` rather than duplicating step labels.
- Do not add React Flow, Mermaid, Graphviz, or other graph dependencies.

## Test Plan
- Unit-test the model:
  - Every `OPEN_STEPS` / `CLOSE_STEPS` id maps to at least one graph node or transition.
  - Apex steps render with apex metadata.
  - All transition endpoints reference valid nodes.
  - Static page and live graph consume the same model export.
- Extend prototype tests:
  - Close path highlights `close-trigger -> collapse-measure -> collapse-fan -> collapse-complete -> drawer-teardown -> sheet-exit -> layout-morph-out -> drop-elevation`.
  - Reset clears reached/active graph state.
  - One-card/no-container collapse still reaches `collapse-complete`.
- Run:
  - `pnpm --dir apps/skills-showcase typecheck`
  - `pnpm --dir apps/skills-showcase test`
  - Browser verification on `/prototype` for desktop and mobile panel layout.
  - `git diff --check`

## Assumptions
- The live visualization is part of the existing `/prototype` debug harness, not a new app route.
- The static artifact is documentation/reference, while the live panel is the source for runtime truth.
- The implementation should update task docs, produce prompt/task artifacts if required by repo workflow, then commit and push intended tracked changes on `master`.
