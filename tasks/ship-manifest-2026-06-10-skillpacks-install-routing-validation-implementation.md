# Ship Manifest - Skillpacks Install-Route Validation Implementation

## User Goal

Run `$exec` for the next incomplete Skillpacks CLI Routing Remediation step: implement the focused validation rule and initial fixtures before editing active `SKILL.md` remediation candidates.

## Changed Files

- `prompts/exec/skill-prompt-20260610-203012-exec.md`
- `scripts/skill-install-routing-audit.sh`
- `tests/fixtures/skill-install-routing/allowlist.json`
- `tests/fixtures/skill-install-routing/valid/claude-pack-guard/SKILL.md`
- `tests/fixtures/skill-install-routing/valid/codex-pack-guard/SKILL.md`
- `tests/fixtures/skill-install-routing/valid/claude-missing-skill-fallback/SKILL.md`
- `tests/fixtures/skill-install-routing/valid/codex-missing-skill-fallback/SKILL.md`
- `tests/fixtures/skill-install-routing/valid/source-checkout-allowed/SKILL.md`
- `tests/fixtures/skill-install-routing/valid/deck-install/SKILL.md`
- `tests/fixtures/skill-install-routing/invalid/pack-only-claude/SKILL.md`
- `tests/fixtures/skill-install-routing/invalid/pack-only-codex/SKILL.md`
- `tests/fixtures/skill-install-routing/invalid/source-checkout-only-missing-allowlist/SKILL.md`
- `tests/fixtures/skill-install-routing/invalid/deck-wrong-install-command/SKILL.md`
- `tests/fixtures/skill-install-routing/invalid/generic-pack-install-only/SKILL.md`
- `tests/layer1/skill-install-routing-audit.test.ts`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-install-routing-validation-implementation.md`

## Per-File Purpose

- `prompts/exec/skill-prompt-20260610-203012-exec.md`: captures the visible `$exec` invocation and visible pasted skill context.
- `scripts/skill-install-routing-audit.sh`: adds the dedicated active-skill install-route scanner and fixture runner.
- `tests/fixtures/skill-install-routing/**`: supplies valid and invalid contract examples for pack/skill installs, deck installs, and source-checkout-only allowlist handling.
- `tests/layer1/skill-install-routing-audit.test.ts`: pins fixture behavior and P1 active-scan inventory coverage.
- `tasks/todo.md`: marks implementation and verification complete, records evidence, and makes the next P1 planning step self-contained.
- `tasks/roadmap.md`: marks the canonical wording and validation design phase complete.
- `tasks/history.md`: records the shipped implementation boundary and verification.
- `tasks/ship-manifest-2026-06-10-skillpacks-install-routing-validation-implementation.md`: documents this exact shipping boundary.

## User-Goal Mapping

- The new scanner enforces the accepted wording contract from `docs/skillpacks-install-routing-contract.md` without editing active skills yet.
- Fixture cases prove the scanner distinguishes runner-local pack installs, published npm installs, source-checkout-only exceptions, and deck installs.
- The focused layer1 test keeps the validation contract executable while allowing active strict mode to remain red until P1/P2/P3 remediation removes the known debt.
- Task docs preserve the staged remediation order from `research/skillpack-cli-routing-audit.md`.

## Tests Run

- `bash -n scripts/skill-install-routing-audit.sh` - passed.
- `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing` - passed; scanned 11 fixture `SKILL.md` files and reported 6 expected invalid findings.
- `scripts/skill-install-routing-audit.sh --report` - passed; scanned 383 active `SKILL.md` files, confirmed 14/14 P1 coverage, reported 220 current findings, and exited 0.
- `scripts/skill-install-routing-audit.sh --active` - expected red; scanned 383 active `SKILL.md` files, confirmed 14/14 P1 coverage, reported 220 current findings, and exited 1 until remediation is performed.
- `bash scripts/skill-pack-routing-audit.sh` - passed with no cross-pack recommendation gaps.
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts` - passed, 2 tests.
- `git diff --check` - passed.

## Skipped Tests

- Full layer1 was skipped because the changed executable surface is the new scanner plus one focused layer1 test; the focused test and direct script modes cover the new behavior and avoid unrelated suite runtime.
- Skills Showcase generation/build was skipped because no active `SKILL.md` or `PACK.md` content, metadata, or generated showcase source changed.
- Skill version/archive/changelog checks were skipped because this slice intentionally does not edit active skill contracts.
- Production deploy was skipped because this boundary changes repository validation tooling, fixtures, prompt/task docs, and no deployable Skills Showcase runtime surface; production deploys also require explicit confirmation.

## Adversarial Review

- Changed-file self-review found and fixed one scanner false-positive risk: frontmatter text could satisfy a generic `pack install` trigger before body content. The scanner now strips YAML frontmatter before matching while preserving line numbers.
- Checked that `--report` and `--active` both scan only active `SKILL.md` files under `global/` and `packs/`, exclude `archive/**`, and do not inspect generated package build output.
- Checked that the existing `scripts/skill-pack-routing-audit.sh` remains unchanged and still passes, so the new npm-route scanner does not weaken cross-pack guard validation.
- Confirmed `--active` remains intentionally red only because of the known 220 pre-remediation findings; this is accepted residual debt for later P1/P2/P3 batches, not a regression in this slice.

## Residual Risk

The scanner is regex-based, so future unusual wording could need a fixture before strict mode becomes a permanent gate. The immediate P1 follow-up should use `--report` plus a targeted check that the 14 P1 files no longer appear while full `--active` may still fail on remaining P2/P3 debt.

## Rollback Note

Revert this commit to remove the new validation script, fixtures, focused layer1 test, and task/history records. No active skill content or generated showcase data needs rollback.

## Next Command

`$exec`
