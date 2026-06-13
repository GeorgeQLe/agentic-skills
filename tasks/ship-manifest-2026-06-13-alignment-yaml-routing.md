# Ship Manifest - Alignment YAML Routing Remediation

## User Goal

Update active non-exec skills so continuation from research/artifact outputs is driven by alignment-page review state and final compiled YAML/task artifacts, not direct `$exec` or `/exec` command handoffs. Keep execution-loop skills as the direct exec-routing exception and land the isolated worktree boundary on `origin/master`.

## Changed Files

- `docs/alignment-yaml-routing-contract.md`: canonical routing contract for alignment review state, final compiled YAML approval, non-exec skill boundaries, and the audit command.
- `scripts/skill-alignment-routing-audit.mjs`: active SKILL.md audit for direct exec handoffs and targeted alignment YAML stop contracts.
- `tests/fixtures/skill-alignment-routing/**` and `tests/layer1/skill-alignment-routing-audit.test.ts`: fixture and active-scan regression coverage.
- Active skill contracts and changelogs under `global/**`, `packs/agent-work-admin/**`, `packs/alignment-page-admin/**`, `packs/business-research/**`, `packs/code-debug/**`, `packs/customer-lifecycle/**`, `packs/game/**`, and `packs/youtube-ops/**`: version-bumped behavior changes replacing direct exec handoffs with approved-artifact routing and adding missing game review-state stop language.
- Matching `archive/<old-version>/SKILL.md` snapshots: required version archives created before edits.
- `apps/skills-showcase/public/assets/*.js`, `docs/skills-showcase/assets/*.js`, and `docs/benchmark-results-matrix.md`: regenerated showcase assets after active skill metadata changes.
- Layer1 test expectation updates under `tests/layer1/**`: aligned tests with approved-artifact routing, current provision v0.9/gskp surfaces, bumped journey-map versions, and reproducible generated benchmark data.
- `prompts/exec/skill-prompt-20260613-221200-alignment-yaml-routing.md`, `tasks/todo.md`, and `tasks/history.md`: execution evidence and task/history records.

## Per-File Purpose

The source edits create an enforceable contract and remove direct exec command recommendations from non-exec skill routing. The archive/changelog/version edits satisfy skill versioning. Generated showcase files expose updated active skill metadata. Test edits prove the new routing rule and keep existing layer1 expectations aligned with current repo state.

## User-Goal Mapping

- Alignment pages and compiled YAML own review-state continuation: documented in the new contract and enforced for staged/game alignment-producing skills.
- Non-exec skills do not recommend `$exec` or `/exec`: enforced by the new audit and remediated in current active findings.
- Exec-loop remains the exception: the audit allows `packs/exec-loop/**` and `type: execution`.
- Game sequence remains post-approval: game artifact skills preserve next-skill sequencing only after approved artifact writes.

## Tests Run

- `node scripts/skill-alignment-routing-audit.mjs` — passed.
- `node scripts/upgrade-alignment-page.mjs --check` — passed.
- `pnpm --dir tests exec vitest run --project layer1` — passed, 60 files / 2235 tests.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` — passed on final fresh/idempotent pass.
- `pnpm --dir apps/skills-showcase typecheck` — passed.
- `pnpm --dir apps/skills-showcase test` — passed, 13 files / 136 tests.
- `git diff --check` — passed.
- `bash scripts/skill-archive-audit.sh --strict` — passed.
- `/opt/homebrew/bin/bash scripts/skill-versions.sh --missing` — passed.
- `/opt/homebrew/bin/bash scripts/skill-deps.sh --broken` — passed.
- `/opt/homebrew/bin/bash scripts/skill-next-step-routing.sh --missing` — passed.

## Skipped Tests

No requested validation command was skipped. The first generated-data validation pass intentionally failed after metadata changes because it rewrote stale assets; the final pass was fresh. Layer1 creates ignored benchmark run artifacts during `bench-coverage`; those were removed before final generated-data validation.

## Adversarial Review

The new audit was run against all 383 active skill files and returned zero findings. Layer1 fixtures cover a game-style non-exec skill with no exec handoff, an exec-loop skill allowed to mention exec, a non-exec skill rejected for direct exec recommendation, and a staged approval skill rejected when missing the YAML stop contract.

## Residual Risk

The audit intentionally scopes alignment-stop enforcement to staged approval-gated skills and the named game artifact skills, rather than forcing a repo-wide version bump across every alignment-capable utility. Future expansion should add more skill families deliberately with archives and focused fixtures.

## Rollback Note

Revert the shipping commit to remove the audit, contract, skill routing changes, generated showcase refresh, and tests. The version archives preserve the exact pre-change skill contracts for each modified active skill.

## Next Command

`$brainstorm`
