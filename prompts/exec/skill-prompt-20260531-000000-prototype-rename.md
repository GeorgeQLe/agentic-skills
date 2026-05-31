---
skill: exec
agent: claude
captured_at: 2026-05-31
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Next step: rename concept-brief → idea-brief in `prototype` consumer

## Context

The `idea-scope-brief` artifact was renamed `concept-brief.md` → `idea-brief.md`. Phase 2
(routing doc) and 4 of 7 Phase-3 consumers (icp, competitive-analysis, lean-canvas,
value-prop-canvas) are now shipped. The next incomplete step is the **product-design
`prototype`** consumer (claude + codex).

The full, self-contained implementation plan is in `tasks/todo.md` under
**"Next Step (self-contained) — Phase 3 consumer: product-design `prototype`"**.

## Summary

Hard-rename the 2 `concept-brief` references per file (lines ~50, ~65) in:
- `packs/product-design/claude/prototype/SKILL.md`
- `packs/product-design/codex/prototype/SKILL.md`

Line 50 = path only. Line 65 = three tokens: `**Concept brief**` label → `**Idea brief**`,
the path, and `concept-brief assumption` → `idea-brief assumption`. Preserve "concept"
where it means the product concept; preserve "core value proposition" prose. No version
bump / archive / changelog (coordinated mechanical sync). Write `/exec` prompt-history,
check off the Phase 3 prototype line.

## Verification

- `grep -n "concept-brief\|Concept brief" packs/product-design/{claude,codex}/prototype/SKILL.md` → nothing
- `git diff --check` clean

## Handoff

Implement only this step, validate it, then run `/ship` when done.
