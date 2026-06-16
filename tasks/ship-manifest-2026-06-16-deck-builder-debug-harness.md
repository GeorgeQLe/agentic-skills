# Ship Manifest — Deck-Builder §F Debug-Harness Extension

**Date:** 2026-06-16
**Skill route:** `/exec` → `/ship` against `apps/skills-showcase/docs/animation-plan-deck-builder.md` §F

## User goal

Extend the `/prototype` animation debug harness to cover the deck route per §F:
new `DECK_OPEN_STEPS`/`DECK_CLOSE_STEPS`, `deck-shell` + `builder` lanes/nodes +
a runtime slice in the canonical machine model, `openDeck`/`dismissDeck` debug
drivers, and `DebugProvider` + `DebugPanel` mounted on the deck route — all
additive, with zero rework in `DeckTableShell.tsx`. `FLIGHT_STEPS` /
`flight-layer` are deferred to the later card-flight slice (contract B).

## Changed files (shipping boundary)

- `apps/skills-showcase/src/components/debug/steps.ts` — `DECK_OPEN_STEPS`,
  `DECK_CLOSE_STEPS`, extended `Phase` union, folded into `ALL_STEPS`.
- `apps/skills-showcase/src/components/debug/animationMachine.ts` — `deck-shell`
  + `builder` lanes/nodes, 9 deck transitions, `deckShell`/`builder` runtime
  slice (types, defaults, merge, snapshot, `isReset` extension), `DeckFlowPhase`,
  `deckOpenSteps`/`deckCloseSteps` on the model.
- `apps/skills-showcase/src/components/debug/DebugController.tsx` — `openDeck` /
  `dismissDeck` drivers + timeline-reset wiring in `drive()`.
- `apps/skills-showcase/src/components/debug/DebugPanel.tsx` — deck driver
  buttons, DECK OPEN/CLOSE timelines, testids.
- `apps/skills-showcase/src/components/debug/AnimationMachineGraph.tsx` — viewBox
  bumped to 2400×800 for the new lanes/gate nodes.
- `apps/skills-showcase/src/components/debug/animationMachineStaticPage.ts` —
  deck steps in the step table, lane/prose updates, viewBox 2400×800.
- `apps/skills-showcase/alignment/animation-state-machine.html` — regenerated
  from the model (drift-locked by the static-page Vitest).
- `apps/skills-showcase/src/deck-builder/DeckDebugHarness.tsx` (new) — mounts
  `DebugProvider` + `DebugPanel` on the deck routes; DOM bridge that registers
  the deck drivers and maps observed phase → step marks + runtime report.
- `apps/skills-showcase/app/prototype/deck-routing-spike/page.tsx`,
  `apps/skills-showcase/app/deck/[slug]/page.tsx` — render `DeckDebugHarness`.
- `apps/skills-showcase/src/components/debug/animationMachine.deck.test.ts`
  (new) — deck harness model Vitest.
- `apps/skills-showcase/e2e/deck-table-shell.spec.ts` — new harness-driver e2e.
- `tasks/history.md`, `prompts/ship/skill-prompt-20260616-131824-…md` — evidence.

## Per-file purpose / user-goal mapping

- `steps.ts`: the §F step catalog — the deck open/close boundaries, apex on
  `blueprint-morph-out`. → step arrays requirement.
- `animationMachine.ts`: deck lanes/nodes/transitions + runtime slice so the
  graph and panel model the deck flow; `isReset` widened so an active deck never
  reads as a reset machine. → lanes/nodes + runtime slice requirement.
- `DebugController.tsx` / `DebugPanel.tsx`: `openDeck`/`dismissDeck` drivers and
  their panel UI. → new drivers requirement.
- `DeckDebugHarness.tsx` + route pages: `DebugProvider`/`DebugPanel` on the deck
  route; the bridge supplies drivers + reporting without touching the shell. →
  mount requirement + the "zero rework in DeckTableShell" constraint.
- Static page + graph viewBox + regenerated HTML: keep the canonical model's
  static reference in sync (enforced by `animationMachine.test.ts`).
- Deck Vitest + e2e: prove the model shape and end-to-end driver wiring.

## Tests run (executable verification)

- `pnpm --dir apps/skills-showcase typecheck` — clean (`tsc --noEmit`).
- `pnpm --dir apps/skills-showcase test` — 152 passed (15 files); 8 new deck
  harness model tests, prior 144 non-regressed, static-page regen test green.
- `pnpm --dir apps/skills-showcase test:e2e` — 6 passed (Chromium); new
  harness-driver test plus the prior 5 (incl. the no-double-vision sampler).
- `pnpm --dir apps/skills-showcase build` — 16/16 pages.
- `node scripts/audit-alignment-pages.mjs` — exit 0.

## Skipped tests

- Stepped-mode frame freezing of the deck morph (awaiting `gate()` inside the
  morph callbacks) — intentionally deferred; this slice MARKS the deck steps and
  reports runtime from observed phase transitions. True gate-freeze wiring lands
  with the card-flight slice, which is the next deck step.
- `FLIGHT_STEPS` / `flight-layer` Vitest + Playwright — contract B, next slice.
- Production deploy smoke checks (`tasks/deploy.md`) — deploy is path-based
  automatic via Vercel; see Deploy status below.

## Adversarial review

General-purpose adversarial subagent over the full diff + the two new files,
scoped to correctness:

- **Feedback-loop / effect-stability of the `DeckDebugHarness` bridge** —
  confirmed clean: `mark`/`report` are `useCallback([])`-stable, so `report()`
  re-renders never re-trigger the observer effect; the `phase === prev` guard
  no-ops spurious fires; `report()` only re-renders the sibling `DebugPanel`,
  not the observed subtree.
- **DebugProvider OFF behavior** — `scaleT` is identity and `gate` resolves
  synchronously when disabled, so mounting the provider does not change
  `DeckTableShell` behavior. Shell correctly left unmodified.
- **`isReset` / snapshot** — active deck cannot be misread as reset; default
  runtime still passes. **Transition endpoints** — all 9 deck transitions
  reference existing node ids.
- **Verdict:** no material correctness bugs. Applied its one optional
  improvement — guard `observer.observe` behind `enabled` for strictly
  zero-overhead-when-off; re-ran typecheck + 6 e2e green after.

## Residual risk (accepted)

- The deck steps are observed-and-marked, not yet `gate()`-frozen mid-morph in
  stepped mode (documented in `DeckDebugHarness.tsx`); deferred with card-flight.
- The bridge reads phase from rendered debug testids rather than from shell
  internals — deliberate, to honor "zero rework in DeckTableShell." If those
  testids are renamed, the bridge mapping must follow.
- Pack-flow driver buttons (`Open (click)`/etc.) render on the deck route where
  those drivers are unregistered; clicking is a harmless no-op. UI nit only.

## Rollback note

Revert the shipped commit(s). The change is additive: deleting
`DeckDebugHarness.tsx` and pointing both route pages back at `DeckTableShell`
restores the prior harness-free deck route; the model/steps additions are
unused without consumers. No schema/route/data changes.

## Deploy status

Path-based automatic via Vercel (Ignored Build Step `scripts/vercel-ignore-build.sh`):
this slice touches `apps/skills-showcase/**`, a deploy-relevant surface, so the
push triggers a build. No generated public showcase data changed (no
`SKILL.md`/`PACK.md` edits). The release-ops `/deploy` skill is not installed
(`agent-bridge`/release-ops absent from `enabled_packs`); no manual deploy step.

## Next command

`/exec` — contract B `card-flight` slice against
`apps/skills-showcase/docs/animation-plan-deck-builder.md` §B/§D/§F-flight:
`FLIGHT_STEPS`, the `flight-layer` lane/nodes, the `FlightLayer` portal-clone
overlay + `flyCard`/`flyAll` drivers, and the stepped-mode `gate()` wiring for
the deck morph boundaries deferred here.
