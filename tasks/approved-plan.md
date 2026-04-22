# Approved Plan (Sanitized Mirror)

This file is the committable, human-readable mirror of `.agents/approved-plan.json` (the machine-readable source of truth, which is gitignored developer-local state). Only `.md`-safe fields are projected here. See `docs/operating-modes.md` § "Approval packet" for the full schema, lifecycle, and safety classification.

## Status

No packet currently approved.

The JSON source of truth (`.agents/approved-plan.json`) is absent or its `lifecycle` is not `approved`. Execution primitives that require an approved packet (`$run --execute-approved`, `/handoff --target=codex`, `/delegate`) will fall back to their standard approval prompt.

This mirror is written by the first consumer to approve a packet (Step 4, `$run --execute-approved`). Step 3 ships only the contract.

## Worked Example (illustrative, not live)

When a packet is approved, this file will look roughly like:

```
## Status

Approved.

- **Step:** Phase 11 / Step 4 — `$run --execute-approved` (Codex)
- **Approved at:** 2026-04-19T18:42:07Z
- **Approved by:** legeorge4@host
- **Git HEAD:** 8ab429c1f2...  (full SHA in JSON)
- **todo.md hash:** 9f3c...e1  (sha256, see JSON for full)
- **TTL:** 3600s
- **Lifecycle:** approved
- **Blocking manual tasks:** none

Fields excluded from this mirror: `allowed_dirty_paths`, `notes`.
```

The full JSON record (including `allowed_dirty_paths` and `notes`) stays in `.agents/approved-plan.json` and is never committed.
