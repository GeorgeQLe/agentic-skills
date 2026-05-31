---
skill: exec
agent: claude
captured_at: 2026-05-31T12:03:15
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Next step: rename concept-brief → idea-brief in `spec-interview` consumer

## Context

Continuation of the `concept-brief.md` → `idea-brief.md` artifact rename. Phase 3 consumers
icp, competitive-analysis, lean-canvas, value-prop-canvas, and prototype are shipped. The next
incomplete Phase-3 consumer is product-design **`spec-interview`** (claude + codex).

## Change

Each file has exactly **one** `research/concept-brief.md` path reference inside the research-evidence
read step. Rename only that path token to `research/idea-brief.md`. **Preserve** the surrounding
"concept constraints" prose — it denotes the product concept, not the document.

- `packs/product-design/claude/spec-interview/SKILL.md` — line ~49: `research/concept-brief.md` → `research/idea-brief.md`.
- `packs/product-design/codex/spec-interview/SKILL.md` — line ~51: `research/concept-brief.md` → `research/idea-brief.md`.

Coordinated mechanical sync (matching prior 5 consumers): **no** version bump / archive / changelog.
Body-only string change → no showcase skill metadata changes; `/ship` will regenerate fingerprint data.

## Verification

- `grep -n "concept-brief" packs/product-design/{claude,codex}/spec-interview/SKILL.md` → nothing.
- `git diff --check` clean.
- Check off the Phase 3 `spec-interview` line in `tasks/todo.md`; write `/exec` prompt-history.

## Handoff

Implement only this step, validate it, then run `/ship` when done.
