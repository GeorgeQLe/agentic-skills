# Phase 5: Expert Review Fixes

**Goal:** Resolve findings from `/expert-review` — credential leak, null dereference bug, stale docs, and missing codex manifest.

## Steps

- [x] **Remove leaked database credential from tracked file**
- [x] **Fix null dereference in `cmdArchiveCard`**
- [x] **Escape LIKE metacharacters in search**
- [x] **Batch list creation in `cmdCreateBoard`**
- [x] **Add missing `codex/plan-interview-ideas/agents/openai.yaml`**
- [x] **Fix stale output paths in `docs/skills-reference.md`**
- [x] **Add try/catch for malformed config JSON**

## Milestone
- [x] No credentials in tracked files, Neon password rotated
- [x] `cmdArchiveCard` handles orphaned list/board references gracefully
- [x] All codex skills have `agents/openai.yaml`
- [x] `docs/skills-reference.md` output paths match actual skill behavior

## On Completion

All 7 expert review findings resolved across 2026-03-25 to 2026-03-27. Key changes:
- Credential scrubbed from `docs/kanban-test-results.md`, Neon password rotated
- Null dereference fix + LIKE metacharacter escaping + batch list creation in `kanban.mjs`
- Missing codex agent manifest added for `plan-interview-ideas`
- Stale output paths fixed in `docs/skills-reference.md`
- Try/catch added for malformed config JSON in `loadConfig()`
