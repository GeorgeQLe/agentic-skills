# Ship Manifest — AFPS Flow Docs Customer Discovery Rename

## User Goal

Execute the next `$exec` step from `tasks/todo.md`: Phase 4.1, update AFPS flow docs so active workflow documentation uses `customer-discovery` instead of legacy executable `icp` naming where the rename has landed.

## Changed Files

- `docs/canonical-workflow-report.md`
- `docs/skill-next-step-contracts.md`
- `docs/skills-reference.md`
- `docs/skill-anatomy.md`
- `docs/skill-invocation-types.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-06-afps-flow-docs.md`
- `prompts/exec/skill-prompt-20260606-183607-exec.md`

## Per-File Purpose

- `docs/canonical-workflow-report.md`: Replace active `icp` command routes with `customer-discovery` and align the canonical post-positioning sequence with `user-flow-map`, requirements-only UI interview, and layout-mode UX variations.
- `docs/skill-next-step-contracts.md`: Update default AFPS route and next-step rules that previously recommended the legacy `icp` command.
- `docs/skills-reference.md`: Update the business-discovery skill list.
- `docs/skill-anatomy.md`: Replace the stale `icp` frontmatter example with a current global-skill example.
- `docs/skill-invocation-types.md`: Classify `customer-discovery` as the business-discovery orchestrator and remove the stale `icp` row.
- `tasks/todo.md`: Mark Phase 4.1 complete, record validation, and add the next self-contained plan.
- `tasks/history.md`: Append completion evidence for this shipped step.
- `tasks/ship-manifest-2026-06-06-afps-flow-docs.md`: Record quality-gate evidence and shipping boundary.
- `prompts/exec/skill-prompt-20260606-183607-exec.md`: Record the visible `$exec` skill invocation.

## User-Goal Mapping

- The five docs updates satisfy the requested Phase 4.1 documentation step.
- The task/history/manifest updates satisfy the exec-loop tracking and shipping contract.
- The prompt file satisfies the repository prompt-history rule for skill invocations.

## Tests Run

- `rg -n "icp|/icp|\\$icp|icp-needed" docs/canonical-workflow-report.md docs/skill-next-step-contracts.md docs/skills-reference.md docs/skill-anatomy.md docs/skill-invocation-types.md`
  - Passed for this scope: results are intentional `enterprise-icp` skill references and `research/icp.md` artifact references only.
- `git diff --check`
  - Passed with no whitespace errors.
- `pnpm --dir tests exec vitest run --project layer1 layer1/competitive-analysis-routing.test.ts layer1/journey-map-routing.test.ts layer1/codebase-status-routing.test.ts`
  - Passed: 3 test files, 14 tests.

## Skipped Tests

- Full `pnpm --dir tests test` was skipped because the active task file documents 46 known unrelated layer1 failures from stale `icp` paths, staged-research contract gaps, YouTube handoff tests, existing alignment/index wording drift, a stale `poketowork-kanban` symlink, and pre-existing benchmark/demo contract drift. This step is documentation-only and the focused route tests cover the changed next-step contract surface.
- Skills Showcase generation was skipped because this step did not change any tracked `SKILL.md` or `PACK.md`; the next planned `PACK.md` step must refresh showcase data.

## Adversarial Review

Method: changed-file self-review plus targeted route scans.

Findings:

- Verified that `research/icp.md` should not be renamed in these docs because the active `customer-discovery` contract still writes that artifact.
- Verified that `enterprise-icp` remains a separate skill and should not be rewritten.
- Found one self-review scan command was incorrectly shell-quoted with backticks and failed before producing evidence; reran the scan with safe quoting using `rg -n -- ...`.
- Confirmed the remaining `icp` matches in edited docs are intentional artifact or separate-skill references, while unresolved legacy command routes remain in later Phase 4 scopes.

## Residual Risk

- Other project docs, `PACK.md`, and skill contracts still contain legacy `icp` route references by design; they are queued as separate Phase 4 items to keep this step narrow.
- `docs/skill-routing-map.html` still has legacy route data outside this step's file list. If that map is still an active reference, it should be handled in the later docs-health/research-admin/pack-skills phase rather than hidden in this AFPS-doc-only step.

## Rollback Note

Revert the shipping commit to restore the previous AFPS docs and task-state entries. No generated assets, skill contracts, or runtime code were changed.

## Ownership Boundary

Included in this shipping boundary: the files listed above.

Excluded unrelated worktree item: `prompts/investigate/skill-prompt-20260606-183821-scriptable-skills.md`. It was already present as an untracked prompt-history artifact for a different investigation and is not part of this `$exec` step.

## Next Command

`$exec`
