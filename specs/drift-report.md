# Spec Drift Report

## 2026-04-22 - `docs/operating-modes.md` + `global/codex/handoff`

### Resolved

- [x] `docs/operating-modes.md` § "Approval packet" (line 51) - Corrected claim that `codex-only` cross-session handoff uses the shared approval packet. Packet-producing handoff is Claude-side only (`/handoff --target=codex`); `codex-only` projects have no packet writer. Reworded to "cross-session handoff from `claude-only` or `hybrid` into a later Codex session."
- [x] `docs/operating-modes.md` § "Skills matrix" handoff row (line 192) - Expanded the note to disambiguate Claude `/handoff --target=codex` (produces approval packet) from Codex `$handoff` (writes `tasks/handoff.md` prose only, no packet).
- [x] `global/codex/handoff/SKILL.md` § "Constraints" - Added an explicit note that `$handoff` does not produce `.agents/approved-plan.json` or `tasks/approved-plan.md`, and pointed packet-needing users at Claude-side `/handoff --target=codex` + `$run --execute-approved`.

### Deferred

- [ ] No skill behavior, schema, or script changed. Doc-only disambiguation.

### Remaining Findings

- None in scope. Next queue item: `$spec-drift fix approval-packet references` (stale `## Approval / Delegation Packet` anchors).

## 2026-04-20 - `packs/business-app/*/scale-audit`

### Resolved

- [x] `packs/business-app/claude/scale-audit/SKILL.md` - Replaced unconditional `/roadmap` primary guidance with state-based `## Next Steps` selection. Evidence: `docs/skill-next-step-contracts.md` says `scale-audit` should recommend `spec-interview [blocker]` when enterprise blockers lack specs and `roadmap` only when work is ready to sequence.
- [x] `packs/business-app/codex/scale-audit/SKILL.md` - Matched the same state-based recommendation contract for `$scale-audit`, including `$spec-interview [top blocker]` for unspecced hard blockers and `$roadmap` only after hard blockers are specced or already tracked.
- [x] Both variants now limit `spec-interview` prompts to gaps that lack full specs, reducing duplicate work against `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md`.

### Deferred

- [ ] No code or canonical product specs changed. This drift fix was limited to skill guidance.

### Remaining Findings

- No remaining `scale-audit` next-step drift found against `docs/skill-next-step-contracts.md` for this scope.
