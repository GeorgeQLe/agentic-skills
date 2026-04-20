# Spec Drift Report

## 2026-04-20 - `packs/business-app/*/scale-audit`

### Resolved

- [x] `packs/business-app/claude/scale-audit/SKILL.md` - Replaced unconditional `/roadmap` primary guidance with state-based `## Next Steps` selection. Evidence: `docs/skill-next-step-contracts.md` says `scale-audit` should recommend `spec-interview [blocker]` when enterprise blockers lack specs and `roadmap` only when work is ready to sequence.
- [x] `packs/business-app/codex/scale-audit/SKILL.md` - Matched the same state-based recommendation contract for `$scale-audit`, including `$spec-interview [top blocker]` for unspecced hard blockers and `$roadmap` only after hard blockers are specced or already tracked.
- [x] Both variants now limit `spec-interview` prompts to gaps that lack full specs, reducing duplicate work against `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md`.

### Deferred

- [ ] No code or canonical product specs changed. This drift fix was limited to skill guidance.

### Remaining Findings

- No remaining `scale-audit` next-step drift found against `docs/skill-next-step-contracts.md` for this scope.
