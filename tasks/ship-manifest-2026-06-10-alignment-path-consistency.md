# Ship Manifest — 2026-06-10 — Alignment Bundle Path-Consistency Validation (Drift Plan Phase 2 Step 3)

## User goal

Add path-consistency validation to `scripts/upgrade-alignment-page.mjs` so every active `ALIGNMENT-PAGE.md` bundle references only its owning skill's `alignment/{skill-name}-{topic}.html` output path, with failing diagnostics (exit 1) in both dry-run and write mode, layer1 coverage, and documentation — per the approved clear-context plan (Drift Plan Phase 2 Step 3, ship-one-step contract).

## Changed files

Included in this boundary:

- `scripts/upgrade-alignment-page.mjs`
- `tests/layer1/upgrade-alignment-page-bespoke.test.ts`
- `docs/alignment-page-convention.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-alignment-path-consistency.md`
- `prompts/ship/skill-prompt-20260610-102128-alignment-path-consistency.md`

No unrelated tracked changes are present in the worktree; the boundary is the full dirty tree.

## Per-file purpose

- `scripts/upgrade-alignment-page.mjs` — new output-path validation pass after the write loop: scans every `ALIGNMENT-PAGE.md` beside an active claude/codex `SKILL.md` for `alignment/<name>-{topic}.html` occurrences and collects `Foreign output path` diagnostics when `<name>` differs from the owning skill directory name; adds the `Output paths: N bundles, exact|DRIFT` summary line; both diagnostic blocks (bespoke + path) now print before one shared exit-1.
- `tests/layer1/upgrade-alignment-page-bespoke.test.ts` — fixture helpers hoisted to module scope for reuse; new repo-state assertion that every active bundle references only its own output path; three new `--root` fixture tests (foreign-path bundle dry-run → exit 1 with named diagnostic and DRIFT summary; bespoke allowlisted foreign-path bundle in write mode → exit 1; clean tree write-mode then dry-run → exit 0, `exact`). Fixture convention body now carries an `Output:` path line so generated fixture bundles exercise the check.
- `docs/alignment-page-convention.md` — new **Output path consistency** paragraph beside the bespoke-allowlist paragraph, outside the generated-marker block (no bundle regeneration triggered).
- `tasks/todo.md` — checked off the step's checklist and acceptance criteria, added review notes, checked off Phase 2 Step 3 in the drift plan with a Step 3 review note.
- `tasks/history.md` — session record.
- Ship manifest — this file.
- Prompt history — visible plan-handoff invocation captured per the repo prompt-history convention.

## User-goal mapping

Every change traces directly to the four planned files plus required ship bookkeeping: the script change implements the validation and summary line; the test change implements the planned repo-state + fixture coverage (placed in the existing Step 2 test file, the plan's default); the docs change documents the rule outside the marker block; the task docs check off the step and drift-plan item. The plan's default recommendation was adopted: validation applies to every active bundle (bespoke and skip-listed included) since the path contract is universal.

## Tests run

- `node --check scripts/upgrade-alignment-page.mjs` — pass.
- `node scripts/upgrade-alignment-page.mjs --dry-run` — exit 0, `Output paths: 270 bundles, exact`, `Bespoke allowlist: 7 skills, exact`, `Updated: 0`.
- `node scripts/upgrade-alignment-page.mjs` (write mode) — exit 0, no new tracked changes (boundary unchanged).
- `pnpm --dir tests exec vitest run --project layer1 layer1/upgrade-alignment-page-bespoke.test.ts layer1/upgrade-alignment-pages.test.ts` — 17 tests passed.
- `pnpm --dir tests exec vitest run --project layer1` — 54 files / 2170 tests / 0 failed (executable verification for the source change).
- Pre-implementation repo scan: 270 active bundles, 0 cross-skill path references (confirmed the new gate passes on the current tree before wiring it in).
- `git diff --check` — clean.

## Skipped tests

- Skills Showcase data regeneration/validation — not applicable: no `SKILL.md` or `PACK.md` changed in this boundary.
- Package/workspace test suites (`skillpacks`) — not applicable: no package files changed; the layer1 suite is the test surface for `scripts/` and `tests/layer1/`.

## Adversarial review

Changed-file self-review plus behavioral fixture oracles (the targeted equivalent for this small, fully fixture-tested diff): checked regex reuse safety with `matchAll`, validation ordering relative to the write loop (write mode validates final on-disk state, including bundles written by the same invocation), scope decision for bespoke/skip-listed bundles, archive-path matching via the trailing segment, and exit-code merging of the two diagnostic lists. One defect was caught and fixed before commit: the clean-tree fixture test initially asserted `Output paths: 0 bundles` for write mode, but validation runs after the write loop and sees the self-written bundles (correct value: 2); the assertion and a clarifying comment were corrected.

## Residual risk

- An orphaned `ALIGNMENT-PAGE.md` with no sibling `SKILL.md` is not scanned (the pass iterates active SKILL.md files). No such orphan exists today; Phase 2 Step 4 (renderer-output drift validation) is the natural place to widen coverage if needed.
- Concrete (non-`{topic}`) alignment paths like `alignment/foo-bar-baz.html` are out of scope by design — topic-boundary attribution is ambiguous; only the templated `-{topic}.html` form is validated, matching the plan.

## Rollback note

Single-step revert of the two commits in this boundary (`git revert <feat-sha> <docs-sha>`) restores the previous generator behavior; the validation is additive and writes nothing, so reverting only removes the gate.

## Next command

`/exec`
