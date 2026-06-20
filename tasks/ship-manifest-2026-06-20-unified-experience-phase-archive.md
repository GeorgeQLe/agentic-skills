# Ship Manifest — Unified Experience Phase Archive

## User goal

Run `$exec` for the next available repository task.

## Changed files

- `prompts/exec/skill-prompt-20260620-160118-exec.md`
- `tasks/todo.md`
- `tasks/phases/phase-7.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-20-unified-experience-phase-archive.md`

## Per-file purpose

- `prompts/exec/skill-prompt-20260620-160118-exec.md`: records the visible `$exec` invocation required by project prompt-history rules.
- `tasks/todo.md`: prevents the completed Phase 7 from being re-selected as active work and points the next operator at phase discovery.
- `tasks/phases/phase-7.md`: preserves the completed Phase 7 task state with an `On Completion` section.
- `tasks/history.md`: records the archival pass and validation evidence.
- `tasks/ship-manifest-2026-06-20-unified-experience-phase-archive.md`: documents the exact task-only shipping boundary.

## User-goal mapping

`$exec` found no unchecked implementation step in the active todo. The selected work became phase-completion bookkeeping: archive the completed phase, make the active todo unambiguous, and ship the resulting task artifacts.

## Tests run

- `git diff --check` — passed.

## Skipped tests

- Source lint/typecheck/test/build were skipped because this boundary changes only task, history, manifest, and prompt-history files. No executable app, package, script, generated runtime asset, or workflow policy changed.

## Adversarial review

Changed-file self-review:

- Verified the active todo no longer contains stale unchecked implementation items.
- Verified the manual tasks are deferred Phase 38 production setup tasks and do not block this archival pass.
- Verified recurring advisory items remain advisory and were not promoted into active execution.
- Verified the archive keeps the completed Phase 7 details available for future reference.

## Residual risk

`tasks/roadmap.md` still contains historical unchecked items from older completed work. This pass did not reconcile the full roadmap ledger because the active `$exec` scope was the current todo completion state, not a repo-wide dev-doc reconciliation.

## Rollback note

Revert this commit to restore the previous active todo and remove the archive/prompt/manifest additions.

## Next command

`$brainstorm`
