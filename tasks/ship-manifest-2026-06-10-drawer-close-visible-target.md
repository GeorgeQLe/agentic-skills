# Ship Manifest — Drawer Close Visible Top-Left Collapse Verification

## User goal

Verify the user's claim that the drawer-close visible top-left collapse work should already be done, and reconcile the task queue if the unchecked backlog item is stale.

## Changed files

- `apps/skills-showcase/src/components/pack-opener-collapse-target.test.tsx`
- `prompts/investigate/skill-prompt-20260610-160953-drawer-close-verify.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/lessons.md`
- `tasks/ship-manifest-2026-06-10-drawer-close-visible-target.md`

Excluded pre-existing local worktree change:

- `apps/skills-showcase/next-env.d.ts`

## Per-file purpose

- `apps/skills-showcase/src/components/pack-opener-collapse-target.test.tsx`: commits focused proof for the already-implemented collapse target selection behavior.
- `prompts/investigate/skill-prompt-20260610-160953-drawer-close-verify.md`: required visible prompt-history capture for the investigation.
- `tasks/todo.md`: checks off the stale drawer-close backlog item and records verification evidence.
- `tasks/history.md`: records the verification and reconciliation result.
- `tasks/lessons.md`: captures the correction pattern: verify unchecked backlog items against source/history before routing them as next work.
- `tasks/ship-manifest-2026-06-10-drawer-close-visible-target.md`: records this quality-gate boundary.

## User-goal mapping

- The focused test file proves the user claim against executable behavior.
- The task/history updates reconcile stale planning state so the next route is not repeated implementation.
- The lesson update addresses the workflow correction that caused the stale task to be recommended.

## Tests run

- `pnpm --dir apps/skills-showcase exec vitest run src/components/pack-opener-collapse-target.test.tsx` — passed, 1 file / 4 tests.
- `pnpm --dir apps/skills-showcase exec vitest run src/components/prototype-close-sequence.test.tsx` — passed, 1 file / 7 tests.
- `git diff --check` — passed for tracked edits.
- `git diff --cached --check` — passed after staging the exact intended boundary.

## Skipped tests

- Full Skills Showcase build was not run because no production app source changed; this boundary adds a focused test for existing component behavior and task records.
- Full app Vitest was not run because the focused target-selection test plus the existing close-sequence test cover the changed proof surface and adjacent close state machine.
- No browser visual smoke was run because no component implementation or styling changed in this boundary.

## Adversarial review

Method: source/history verification plus changed-file self-review.

Checks:

- Confirmed `apps/skills-showcase/src/components/PackOpener.tsx` already walks to the scroll container, filters visible cards, selects the top-most visible row, and picks the left-most card in that row.
- Confirmed git history: visible target-selection logic predates this session (`fcc302a5e`), with row-buffered collapse refinements in `37c22b11`.
- Confirmed `apps/skills-showcase/src/components/pack-opener-collapse-target.test.tsx` was untracked before this session and directly covers the stale backlog acceptance criteria.
- Confirmed the unrelated `apps/skills-showcase/next-env.d.ts` change is excluded from this shipping boundary.

Finding fixed:

- The previous Phase 4 handoff recommended the stale drawer-close backlog item as next work without verifying source/history first. The implementation was already done; the missing artifact was committed proof and task reconciliation.

Correction enforcement:

- Added a new lesson in `tasks/lessons.md`. No source-level enforcement script is practical for next-work routing because the failure was operator task selection, not an executable app invariant. The focused test file prevents the specific UI behavior from regressing.

## Residual risk

The focused tests verify target-index selection from mocked card rectangles and the adjacent phase-chain test verifies close sequencing. They do not visually assert animation smoothness in a browser. If visual polish is questioned later, the next proof should be a `/prototype` browser smoke with scrolled drawer close.

## Rollback note

Revert the shipping commit to restore the backlog checkbox, history/lesson/manifest/prompt records, and remove the focused test file. The app implementation itself is not changed by this boundary.

## Next command

`$brainstorm`
