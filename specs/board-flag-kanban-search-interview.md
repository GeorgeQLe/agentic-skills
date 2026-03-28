# Interview Log: Add --board flag to kanban search

## Turn 1

### Questions
1. **Flag format:** Should `--board` accept only a board ID, or also support board name matching (case-insensitive substring)?
2. **Output shape:** When `--board` is provided, should search still enrich results with board name/ID, or simplify the response?
3. **Search scope:** Should `--board` also search card descriptions, or keep name-only ILIKE?

### Options Presented
1. ID only (recommended) vs ID or name — chose **ID only** for simplicity and unambiguity.
2. Keep enrichment (recommended) vs strip board fields — chose **keep enrichment** for consistent output shape.
3. Name only (recommended) vs name + description — chose **name only** to keep the change focused.

### Responses
All three recommended options selected. Rationale: skills already resolve board IDs, so name matching adds complexity without value. Consistent output avoids breaking consumers. Description search is orthogonal.

---

## Turn 2

### Questions
1. **Error handling:** If `--board` ID doesn't exist or isn't in the user's org, error or empty result?
2. **Multi-board:** Single `--board` only, or allow repeated flags for subset search?

### Options Presented
1. Error and exit (recommended) vs empty result set — chose **error and exit** for fail-fast behavior.
2. Single board only (recommended) vs allow multiple — chose **allow multiple `--board` flags** (deviated from recommendation).

### Responses
Error exit chosen to prevent silent wrong-board bugs. Multi-board support chosen despite YAGNI recommendation — user sees future value in subset searches.

---

## Turn 3

### Questions
1. **Arg parsing:** New `getAllArgs` helper vs inline logic in `cmdSearch`?
2. **Wrap up:** Ready to write the spec?

### Options Presented
1. New getAllArgs helper (recommended) vs inline — chose **getAllArgs helper** for reusability.
2. Yes, write the spec vs continue — chose **write the spec**.

---

## Deviations from Original Card Description

| Aspect | Original Card | Final Spec |
|--------|--------------|------------|
| Multi-board | Implied single `--board <id>` | Repeatable flag: `--board <id1> --board <id2>` |
| Arg parsing | Not specified | New `getAllArgs` utility alongside existing `getArg` |
| Error handling | Not specified | Explicit error exit on invalid board ID |

**Reasoning:** Multi-board support was a user preference diverging from the YAGNI recommendation. This required the `getAllArgs` helper instead of reusing `getArg`. Error handling was specified to prevent silent failures in automated skill scripts.
