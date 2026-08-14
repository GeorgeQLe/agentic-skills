# Ship Manifest — Stable 1.0 Distribution Cleanup Intake

## User goal

Begin the Stable 1.0 distribution cleanup after the merged AFPS foundation, then wrap the planning session cleanly with issue-backed delivery.

## Accountability

- Topology: `sol-only-trivial`.
- Risk classification: documentation/task-only planning and shipping records; no executable behavior or workflow policy changed.
- Sol requested/resolved model: requested identity not specified; resolved model unavailable. Sol inspected, integrated, verified, committed, and published the complete boundary.
- Luna assignments/results: none; parallel implementation would not benefit this narrow shared-task-document update.
- Terra review: not required under `docs/codex-accountable-agent-workflow.md` for narrow documentation/task changes. Sol performed a changed-file, failure-oriented self-review.
- Model-routing fallback: role ownership was enforced without claiming an unavailable runtime model identity.

## Changed files

- `prompts/roadmap/skill-prompt-20260813-224312-stable-1.0-distribution-cleanup.md`
- `prompts/ship-end/skill-prompt-20260813-234339-stable-1.0-cleanup-intake.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-08-13-stable-1.0-distribution-cleanup-intake.md`

## Per-file purpose

- Roadmap prompt record: preserves the exact visible cleanup intake invocation.
- Ship-end prompt record: preserves the exact visible wrap-up invocation.
- `tasks/roadmap.md`: replaces stale pre-merge AFPS delivery state with the issue-backed Stable 1.0 audit phase and archives the merged predecessor outcome.
- `tasks/todo.md`: makes the stable/canary distribution boundary audit the sole executable current task and records planning verification.
- `tasks/history.md`: records the session outcome and published delivery evidence.
- This manifest: proves the exact documentation-only shipping boundary, verification, risk, rollback, and continuation route.

## User-goal mapping

- Issue `#25`, branch `chore/25-stable-1.0-distribution-cleanup`, and ready PR `#26` establish the requested workstream after AFPS PR `#16` merged.
- The audit-first phase inventories stable/canary distribution coupling before removal and explicitly evaluates the deferred `ship-end` and `sync` survivors.
- Release publication, dist-tag mutation, tagging, deployment, and destructive consumer cleanup remain outside the authorized phase.

## Ownership boundary

Included files are the six paths listed above. Pre-existing untracked `apps/`, `scratchpad/`, `prompts/expert-review/skill-prompt-20260615-230417-ord-align-refactor.md`, and `prompts/sync/skill-prompt-20260620-231338-sync.md` are unrelated user/local artifacts; they remain untouched and unstaged. Generated `.claude/skills/**` and `.codex/skills/**` roots are also excluded.

## Tests run

- `node scripts/audit-task-docs.mjs` — passed on the final task/history boundary with zero failures and zero warnings.
- `git diff --check` and `git diff --cached --check` — passed on the planning commits and final staged closeout boundary.
- Staged-boundary scan through `scripts/detect-secrets.sh` — passed with no detected credential pattern.
- `git rev-list --left-right --count @{upstream}...HEAD` — reported `0 0` before closeout, proving the ready PR branch was current.
- GitHub inspection — PR `#26` is open, ready, and contains planning commits `41b6dc874` and `cf90032be` before this closeout commit.

## Skipped tests

- Source lint, typecheck, unit, integration, package build, stable/canary manifest generation, and runtime checks are not applicable to this closeout because no source, script, configuration, schema, generated asset, package, or runtime behavior changed.
- Visual/UI checks are not applicable because no rendered artifact changed.
- Conversation export was not requested.
- Deployment is skipped because this work is unmerged development state and neither `deploy.md` nor `tasks/deploy.md` exists.

## Adversarial review

Sol reviewed for stale predecessor state, premature deletion assumptions, mixed stable/canary defaults, accidental release authority, self-referential task routing, unrelated-file capture, and misleading claims that `ship-end` or `sync` must be removed. No finding survived: the plan remains audit-first, the task audit passes, and unrelated artifacts are excluded.

## Terra findings and dispositions

- Findings: none; Terra was not required for this trivial documentation/task boundary.
- Dispositions: none.
- Remediation: none required.
- Focused re-review: not required because there was no Terra finding and no security, authentication, billing, persistence, migration, concurrency, privacy, data-loss, or cross-package remediation.

## Residual risk

The cleanup implementation boundary is intentionally not yet proven. Phase 1 must inventory actual stable/canary manifests, dependencies, lifecycle behavior, catalogs, and tests before any keep/migrate/move-lane/retire decision is implemented. The pre-existing untracked build/scratch artifacts remain visible in `git status` but are outside the tracked PR boundary.

## Rollback note

Revert the documentation-only commits on PR `#26` to restore the post-AFPS task state. No package, consumer install, release tag, dist-tag, deployment, or runtime state needs rollback.

## Final Sol acceptance

Accepted for shipping after the final task audit, whitespace checks, staged-path inspection, and secret scan passed. Push and PR-head verification are the remaining delivery operations; no accepted Critical/High finding exists.

## Next command

`$exec`
