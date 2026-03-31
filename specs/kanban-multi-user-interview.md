# Interview Log: Multi-User Kanban Concurrency Support

**Date:** 2026-03-31

---

## Turn 1: Use Case Scoping

**Q:** What's the actual multi-user scenario you're targeting?
- Multiple Claude agents
- Claude + web app users
- Both scenarios

**A:** Both scenarios — multiple agents AND web app users all operating on shared boards.

---

## Turn 2: Audit Trail + Conflict Detection

**Q1:** How important is audit parity with the web app?
- Options: Full parity (recommended) / CLI-only tracking / No tracking
- **A:** Full parity — CLI writes to board_actions with same schema as web app.

**Q2:** What level of conflict safety?
- Options: Optimistic locking (recommended) / Advisory warnings / Last-write-wins
- **A:** Optimistic locking. Follow-up question: "How frustrated would a human user be if they're blocked by an agent? Can we use websockets so things look interactive?"
- **Clarification provided:** The optimistic lock only affects the CLI side — web users are never blocked. WebSockets would require switching Neon drivers and is a separate concern for the web app.

---

## Turn 3: Conflict Resolution

**Q:** Given that conflict errors only hit CLI, does fail-with-error work?
- Options: Fail + smart retry (recommended) / Always fail / Always auto-retry
- **A:** Fail + smart retry — simple ops auto-retry, content ops surface to user.

---

## Turn 4: Atomicity + Lock Implementation

**Q1:** How to handle non-atomic audit logging (no transaction support)?
- Options: Best-effort logging (recommended) / Switch to WebSocket driver / Raw SQL batch
- **A:** Best-effort logging — mutation first, audit second, warn on audit failure.

**Q2:** How to implement optimistic lock without transactions?
- Options: Single UPDATE with RETURNING (recommended) / Accept race window
- **A:** Single UPDATE...WHERE updated_at=X RETURNING * — atomic check-and-write in one HTTP call.

---

## Turn 5: Agent Identity + Description Cleanup

**Q1:** How should CLI sessions identify themselves in audit log?
- Options: userId + actorType='agent' (recommended) / userId + actorType='user' / Configurable
- **A:** userId from config.json + actorType='agent', agentTemplateId='claude-code-kanban'.

**Q2:** With audit logging, stop writing metadata to card descriptions?
- Options: Move to audit log only (recommended) / Keep both / Migrate gradually
- **A:** Move to audit log only — descriptions for user content, metadata in board_actions.

---

## Turn 6: Lock Flag + Poketo Work Discovery

**Q1:** Should --expect-updated-at be required or optional?
- Options: Optional (recommended) / Required for all / Required for update+move only
- **A:** Optional, default off — backwards-compatible, upgrade incrementally.

**User observation:** "I don't think we have multi-user/multiplayer capability on the poketowork side, can you confirm?"

**Research confirmed:** Poketo Work has ZERO real-time features. No WebSockets, no subscriptions, no polling, no presence. Board data loads once on page load. The requirements.md documents these features but none are implemented. Brain app has Hocuspocus/Yjs but Work doesn't use it.

---

## Turn 7: Scope Decision

**Q:** Should spec cover CLI-only or full stack?
- Options: CLI-only (recommended) / Full stack / Pause entirely
- **A:** Full stack — spec both CLI and web app changes. Two linked specs in their respective repos.
- **Spec locations:** `claude-skills/specs/kanban-multi-user.md` + `poke/monorepo/docs/specifications/work-realtime-collaboration-spec.md`

---

## Turn 8: Real-Time Approach

**Q:** Which real-time approach for the web app?
- Options: Hocuspocus/Yjs (reuse from Brain) / tRPC subscriptions / Polling
- **A:** User asked for more detail on the approaches (unfamiliar with Brain app relevance).
- **Elaboration provided:** Explained all three approaches with tradeoffs.
- **A (after elaboration):** Hocuspocus/Yjs CRDT.

---

## Turn 9: Y.Doc Design + Presence

**Q1:** How should board state map to Y.Doc?
- Options: Yjs as real-time layer, Postgres as source of truth (recommended) / Yjs as source of truth
- **A:** Postgres as source of truth, Yjs as real-time layer.

**Q2:** Presence richness?
- Options: Online + card focus (recommended) / Online only / Full with typing indicators
- **A:** User asked "what's the difference between option 1 and 3?"
- **Clarification:** Option 1 shows who's focused on which card. Option 3 adds typing/editing indicators so you know when someone is actively writing in a card field.
- **A (after clarification):** Full presence with typing indicators.

---

## Turn 10: CLI Sync + Activity Reads

**Q1:** How should CLI writes propagate to Yjs?
- Options: DB trigger -> Hocuspocus webhook (recommended) / CLI calls Hocuspocus API / Periodic refresh
- **A:** DB trigger -> Hocuspocus webhook.

**Q2:** Should CLI read board_actions to show recent activity?
- Options: Yes, show recent activity (recommended) / Write-only
- **A:** Yes — show last 5 actions before mutations.

---

## Turn 11: Coverage Checkpoint

**Presented full decision summary across CLI and web app.**
- **A:** "Looks complete" — write the specs.

---

## Deviations from Original Scope

The original ask was "multi-user kanban skills" — focused on the CLI side. During the interview, we discovered that Poketo Work itself has no real-time multi-user support, expanding the scope to a full-stack spec covering both CLI (audit logging, optimistic locking) and web app (Hocuspocus/Yjs, presence, sync bridge). Two companion specs were written instead of one.
