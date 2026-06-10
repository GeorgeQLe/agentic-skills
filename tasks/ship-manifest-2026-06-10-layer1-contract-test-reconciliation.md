# Ship Manifest — 2026-06-10 — Layer1 Contract Test Reconciliation

## User goal

Reconcile the 18 pre-existing failing layer1 contract tests (11 files) against current repo reality so `pnpm --dir tests exec vitest run --project layer1` passes with 0 failures, categorizing each failure as stale-pin, stale-assertion, or regressed-skill before editing.

## Changed files

Included in this boundary:

- `tests/layer1/afps-alignment-preview-gates.test.ts`
- `tests/layer1/benchmark-results-matrix.test.ts`
- `tests/layer1/compile-central-alignment.test.ts`
- `tests/layer1/marketplace-side-handoff.test.ts`
- `tests/layer1/pack-reload-contract.test.ts`
- `tests/layer1/pack-shipping-boundary.test.ts`
- `tests/layer1/pack-skill-mirror-parity.test.ts`
- `tests/layer1/product-path-manifest.test.ts`
- `tests/layer1/prompt-history-backfill.test.ts`
- `tests/layer1/skill-reload-language.test.ts`
- `tests/layer1/skills-showcase-benchmark-demo.test.ts`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-layer1-contract-test-reconciliation.md`

## Per-file purpose

- `afps-alignment-preview-gates.test.ts` — repointed `icp` → `customer-discovery`; replaced the old preview-page gate assertions with the current scope-first staged-approval contract (`8c655082`).
- `benchmark-results-matrix.test.ts` — updated the generator header path to `apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` (workspace split).
- `compile-central-alignment.test.ts` — relaxed the v0.1 pin to a well-formed-version pattern; kept v0.0 archive and v0.1 changelog assertions.
- `marketplace-side-handoff.test.ts` — repointed `icp` → `customer-discovery` paths/commands; updated to "hypotheses, not validated customer segments"; replaced byte-equal preflight mirror assertion with shared-core-phrase assertions (Codex mirror is a deliberately condensed orchestrator).
- `pack-reload-contract.test.ts` / `pack-shipping-boundary.test.ts` — relaxed the `pack` v0.4 pin to a bumped-version pattern (now v0.6).
- `pack-skill-mirror-parity.test.ts` — replaced exact per-skill version pins with extraction + cross-mirror version-equality assertion (strictly stronger on parity, no longer stale on bumps).
- `product-path-manifest.test.ts` — repointed `icp` → `customer-discovery`; excluded `invocation: sub-skill` framework files from the strict scope-resolution sweeps and added a new light sub-skill contract test; dropped customer-discovery from the manifest-schema contracts (orchestrator no longer enumerates the schema); rewrote the icp migration test to the current output contract; exempted the screen-flow "branches" phrase from the git-branch disambiguation heuristic.
- `prompt-history-backfill.test.ts` — relaxed the v0.0 pin; updated `--apply` path-constraint assertions to the legacy-aware v0.1 sentences.
- `skill-reload-language.test.ts` — relaxed targeted-skill-builder/create-local-skill version pins to a bumped-version pattern.
- `skills-showcase-benchmark-demo.test.ts` — repointed the demo assertion from the `pack` Codex skill (raw runs no longer exist locally; runs are gitignored) to the `skills` Codex demo present in committed data.
- `tasks/todo.md` — checked off the reconciliation steps/acceptance criteria and recorded per-test verdicts in review notes.
- `tasks/history.md` — session record.
- Ship manifest — this file.

## User-goal mapping

Every changed test file maps 1:1 to one or more of the 18 categorized failures; the task docs record the verdicts the goal required. No other files needed changes because categorization found zero regressed skill contracts.

## Tests run (executable verification)

- `pnpm --dir tests exec vitest run --project layer1` — 54 files, 2166 tests, 0 failed (was 18 failed / 2147 passed; +1 new sub-skill contract test).
- Per-assertion repo-reality checks (grep/node scans) against all referenced SKILL.md mirrors before each edit.
- `git diff --check` — clean.

## Skipped tests

- Other vitest projects (layer4 benchmarks etc.) — out of scope; this boundary touches only layer1 test files and task docs.
- `scripts/skill-versions.sh --missing` / `scripts/skill-archive-audit.sh --strict` / Skills Showcase regeneration — not required; no SKILL.md or PACK.md changed.

## Adversarial review

Changed-file self-review of the full diff (test-contract changes; equivalent targeted review for a tests-only boundary). Findings fixed before commit: version-pin relaxations initially used `v0\.\d+`-family patterns that would go stale again at a v1.0 major bump — replaced with patterns accepting any bumped/well-formed version. Confirmed no contract was silently weakened: mirror-parity now additionally asserts cross-mirror version equality, and the sub-skill sweep exclusion is offset by a new explicit sub-skill scope-section test.

## Residual risk

- Relaxed version patterns no longer pin exact versions; deliberate-bump enforcement now relies on the skill-versioning convention and changelog audits rather than these contract tests (accepted: exact pins were the recurring stale-failure source).
- `skills-showcase-benchmark-demo` still depends on machine-local gitignored run artifacts having produced the committed data; if `skills-codex-*` runs are pruned locally and data regenerated, the demo example will need repointing again (pre-existing test design, unchanged).

## Rollback note

Single-commit revert of the test-file commit restores prior assertions; task-doc commit is documentation-only. No skill, script, or generated-data changes to roll back.

## Untouched files

- `prompts/analyze-sessions/skill-prompt-20260610-020338-skill-gaps-manual-asks.md` (untracked) — prompt history from a concurrent session's `/analyze-sessions` invocation; left for that session to ship. Boundary is safe: nothing in this ship reads or depends on it.

## Next command

`/exec`
