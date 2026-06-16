# Ship Manifest - Layer1 Skill Alignment Routing Audit

## User Goal

Fix `layer1/skill-alignment-routing-audit.test.ts` by correcting false positives in `scripts/skill-alignment-routing-audit.mjs`, preserving active skill contracts and keeping existing invalid fixtures failing.

## Changed Files

- `scripts/skill-alignment-routing-audit.mjs`
- `tests/layer1/skill-alignment-routing-audit.test.ts`
- `tests/fixtures/skill-alignment-routing/valid/non-exec-prohibits-exec/SKILL.md`
- `tests/fixtures/skill-alignment-routing/valid/staged-current-wording/SKILL.md`
- `prompts/exec/skill-prompt-20260615-210807-layer1-routing-audit.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-15-layer1-skill-alignment-routing-audit.md`

## Per-File Purpose

- `scripts/skill-alignment-routing-audit.mjs`: distinguishes prohibitive `$exec`/`/exec` mentions from positive handoffs and validates the alignment stop contract semantically.
- `tests/layer1/skill-alignment-routing-audit.test.ts`: updates fixture count and asserts the new valid fixtures stay clean.
- `tests/fixtures/skill-alignment-routing/valid/non-exec-prohibits-exec/SKILL.md`: covers valid non-exec prohibitive `/exec` and `$exec` wording.
- `tests/fixtures/skill-alignment-routing/valid/staged-current-wording/SKILL.md`: covers valid staged research wording used by current active skills.
- `prompts/exec/skill-prompt-20260615-210807-layer1-routing-audit.md`: records the visible skill invocation and handoff plan.
- `tasks/todo.md`: records the execution checklist, review notes, and validation evidence.
- `tasks/history.md`: records the shipped change.
- `tasks/ship-manifest-2026-06-15-layer1-skill-alignment-routing-audit.md`: records the quality gate and shipping boundary.

## User-Goal Mapping

- False positive direct exec findings are fixed by sentence-level prohibitive detection.
- False positive missing stop-contract findings are fixed by requiring the actual approval-gate semantics instead of one exact sentence.
- Existing invalid fixtures still produce findings, preserving the guardrail against positive `$exec` handoffs and preapproval downstream routing.
- Active `SKILL.md` contracts were not modified, matching the explicit non-goal.

## Tests Run

- `node scripts/skill-alignment-routing-audit.mjs --fixtures tests/fixtures/skill-alignment-routing`
  - Expected exit 1, because invalid fixtures are intentionally present.
  - Output listed only:
    - `invalid/non-exec-recommends-exec/SKILL.md`
    - `invalid/preapproval-routing/SKILL.md`
- `node scripts/skill-alignment-routing-audit.mjs --report`
  - Passed.
  - `Active SKILL.md files scanned: 393`
  - `Alignment-routing findings: 0`
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-alignment-routing-audit.test.ts`
  - Passed: 1 file, 2 tests.
- `git diff --check`
  - Passed.

## Skipped Tests

- Full layer1 suite: skipped because the changed surface is one audit script plus one focused layer1 test, and the focused Vitest target exercises both fixture behavior and active-report behavior.
- Skills Showcase generation/validation: skipped because no tracked `SKILL.md` or `PACK.md` behavior/metadata changed.
- Deploy validation/build: skipped because `tasks/deploy.md` classifies script/test/task/prompt changes as non-showcase, non-deploying changes.

## Adversarial Review

Method: changed-file self-review plus targeted fixture and active-report checks.

Findings and handling:

- Risk: broad prohibitive detection could hide positive exec handoffs. Mitigation: it only skips matches when the same sentence includes prohibitive language and an exec-routing verb; the positive invalid fixture still fails.
- Risk: semantic stop-contract matching could be too permissive. Mitigation: it requires all four clauses: final compiled YAML, review, approval/stop boundary, and a downstream-routing block until approved artifacts are written or updated; the invalid preapproval-routing fixture still fails.
- Risk: active findings could be hidden by fixture-only behavior. Mitigation: the active `--report` scan passed across 393 active skill files.

## Residual Risk

The semantic matcher is still regex-based, so future contracts with substantially different wording may need audit grammar updates. Current active contracts and targeted fixtures cover the known valid and invalid shapes behind this failure.

## Rollback Note

Revert the shipping commit to restore the prior literal audit behavior and remove the new fixtures/task evidence.

## Next Command

`$ship-end`
