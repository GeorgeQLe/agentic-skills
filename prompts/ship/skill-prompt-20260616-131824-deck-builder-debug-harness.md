---
skill: ship
agent: claude
captured_at: 2026-06-16T13:18:24-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

# Visible User Invocation

The `/ship` skill was invoked at the end of an `/exec`-driven implementation
session whose visible user instruction was:

```text
Implement the following plan:

# Next step — Deck-Builder §F Debug-Harness Extension

[...]

## Ship-one-step handoff

Implement **only** this §F harness step, validate it (typecheck, Vitest,
Playwright, build, alignment audit), then run `/ship` when done.
```

The `/ship` invocation arguments:

```text
Ship the deck-builder §F debug-harness extension slice (deck-route harness:
DECK_OPEN_STEPS/DECK_CLOSE_STEPS, deck-shell/builder lanes+nodes+runtime slice,
openDeck/dismissDeck drivers, DeckDebugHarness mounting DebugProvider+DebugPanel
on the deck routes). Validation already green: typecheck clean, 152 Vitest,
6 Playwright (Chromium), build 16/16, alignment audit exit 0.
```
