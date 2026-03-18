# Session History

## 2026-03-15 — Expert review fixes

Resolved all 10 findings from `/expert-review`:
- Fixed stale `/review` → `/expert-review` references in skills-reference.md
- Added missing `agents/openai.yaml` for brainstorm and debug codex skills
- Fixed unsafe `rm -rf` in install.sh codex path (now warns and skips like claude side)
- Deleted orphaned root `brainstorm.md`
- Added deploy step to `ship-then-plan` and `ship-end` (both claude and codex)
- Aligned deploy search order across `deploy` and `ship` skills
- Added `/brainstorm` entry to skills-reference.md, fixed skill count to 26
- Removed inconsistent `allowed-tools` from `ship` and `ship-then-plan`
- Rewrote "CI tests" → "tests" in install-workflow-orchestration
- Removed stale `docs/` plan reference from `ship-end`

## 2026-03-18 — Brainstorm output & plan-interview-ideas skill

- Updated `/brainstorm` (Claude + Codex) to append suggestions to `tasks/ideas.md`
- Created new `/plan-interview-ideas` skill (Claude + Codex) that reads `tasks/ideas.md` and runs a plan-interview for each idea sequentially
