# Ship Manifest — Skillpacks Install-Route Validation Design

Date: 2026-06-10

## User Goal

Run `$exec` for the next incomplete task: decide the validation shape for npm-aware Skillpacks install-route remediation before editing active `SKILL.md` files.

## Changed Files

- `prompts/exec/skill-prompt-20260610-201743-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-install-routing-validation-design.md`

## Per-File Purpose

- `prompts/exec/skill-prompt-20260610-201743-exec.md`: Captures the visible `$exec` invocation and pasted skill context required by the prompt-history convention.
- `tasks/todo.md`: Marks the validation-shape decision complete and records the dedicated-script, fixture-test, scanner-mode, P1-coverage, deck-route, and allowlist contracts for the next implementation step.
- `tasks/history.md`: Records the decision-only boundary and notes that no active skill or generated runtime files changed.
- `tasks/ship-manifest-2026-06-10-skillpacks-install-routing-validation-design.md`: Records the shipping boundary, verification, skipped checks, and next route.

## User-Goal Mapping

- The next incomplete `$exec` step asked for a validation-shape decision. The task now selects a dedicated active-skill scanner plus fixture-backed layer1 coverage, while preserving the existing cross-pack routing audit's narrower scope.
- The next implementation step is now self-contained in `tasks/todo.md`, including exact modes, fixture categories, allowlist fields, and verification commands.

## Tests Run

- `git diff --check` — passed.
- `bash scripts/skill-pack-routing-audit.sh` — passed with `No cross-pack recommendation gaps found.`

## Skipped Tests

- Full layer1 was skipped because this boundary changes only prompt/task/history/manifest files and does not change source, active `SKILL.md`, scripts, generated runtime assets, package metadata, or validation behavior.
- Skills Showcase refresh was skipped because no active `SKILL.md` or `PACK.md` content/metadata changed.
- The new install-route audit does not exist yet; this step only records its design. Implementation and fixture validation are the next task.

## Adversarial Review

- Checked whether the design would weaken the existing cross-pack guard audit; it does not because `scripts/skill-pack-routing-audit.sh` remains unchanged and scoped to cross-pack recommendation gaps.
- Checked whether a layer1 active-scan gate would immediately fail on the known 220-file pre-remediation debt; the design avoids that by making layer1 fixture-backed first and using active report/strict modes separately.
- Checked whether deck installs could be accidentally counted as ordinary pack installs; the design explicitly separates `npx skillpacks install-deck <deck>` from `npx skillpacks install <pack-or-skill>`.

## Residual Risk

- The scanner is not implemented in this boundary; the next step must translate the design into script/test fixtures without editing active skills.
- Active strict mode is expected to fail until the staged remediation removes the known install-route debt.
- The worktree contains unrelated in-progress VARD/ORD task and skill-archive changes from another boundary; those are intentionally excluded from this manifest and commit.

## Rollback Note

Revert this task/prompt/history/manifest boundary to restore the previous broad implementation plan. No source or generated runtime rollback is required.

## Next Command

`$exec`
