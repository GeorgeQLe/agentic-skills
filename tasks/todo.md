# Review Findings — TODO

## High Priority

- [x] **Fix stale `/review` references in skills-reference.md** — Renamed to `/expert-review` on lines 40, 110, and 263
- [x] **Add missing `agents/openai.yaml` for brainstorm and debug** — Added agent manifests for both
- [x] **Fix asymmetric non-symlink handling in install.sh** — Codex now warns and skips like Claude side

## Medium Priority

- [x] **Delete orphaned root `brainstorm.md`** — Removed duplicate file
- [x] **Align deploy step across ship variants** — Added deploy to `ship-then-plan` and `ship-end` (both Claude and Codex)
- [x] **Fix deploy search order inconsistency** — `deploy` now matches `ship` order: spec.md first
- [x] **Add `/brainstorm` entry to skills-reference.md** — Added entry and fixed skill count to 26

## Low Priority

- [x] **Standardize `allowed-tools` usage** — Removed from `ship` and `ship-then-plan` for consistency
- [x] **Reword CI reference in install-workflow-orchestration** — Changed to "Go fix failing tests" (both Claude and Codex)
- [x] **Remove stale `docs/` plan reference in ship-end** — Removed from both Claude and Codex versions
