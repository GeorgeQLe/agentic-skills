# Ship Manifest - Tighten BIP Agent Compliance

## User Goal

Implement the accepted plan to make enabled Build-In-Public mode enforceable in alignment-producing flows through convention changes, active-page audits, packaged audit behavior, regression fixtures, and generated bundle propagation.

## Changed Files

Exact shipping boundary:

- `docs/alignment-page-convention.md`
- `scripts/audit-alignment-pages.mjs`
- `tests/layer1/alignment-gates.test.ts`
- `tests/layer1/audit-alignment-pages.test.ts`
- `prompts/exec/skill-prompt-20260628-202255-tighten-bip-agent-compliance.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-28-tighten-bip-agent-compliance.md`
- Generator-owned alignment convention bundles: every staged path matching `base/**/ALIGNMENT-PAGE.md` and `packs/**/ALIGNMENT-PAGE.md` in `git diff --cached --name-only` for this commit. The staged bundle set contains 309 files and was produced by `node scripts/upgrade-alignment-page.mjs`.

No unrelated tracked changes are included. The staged bundle set is intentionally broad because the convention bundle is generated per alignment-producing skill.

## Per-File Purpose

- `docs/alignment-page-convention.md`: Defines enforceable BIP handling: Stage 2 stage metadata, stable BIP page metadata, normal-page BIP checkpoint states, approved BIP YAML fields, handoff text before final artifact approval, and active BIP page index inclusion.
- `scripts/audit-alignment-pages.mjs`: Reads `.agents/project.json`, detects enabled BIP mode, validates BIP page metadata, enforces Stage 2 BIP checkpoints or sibling pages, avoids Stage 1/confirmed false positives, and reports a `BIP handling` audit summary.
- `tests/layer1/audit-alignment-pages.test.ts`: Adds fixtures for BIP enabled/disabled audit behavior, linked sibling BIP pages, missing checkpoint failure, BIP metadata failure, Stage 1 false-positive avoidance, and final-handoff routing.
- `tests/layer1/alignment-gates.test.ts`: Locks canonical convention text and generated bundle propagation for the enforceable BIP checkpoint contract.
- `base/**/ALIGNMENT-PAGE.md` and `packs/**/ALIGNMENT-PAGE.md`: Generated propagation of the canonical convention into every generator-owned alignment-producing skill bundle.
- `prompts/exec/skill-prompt-20260628-202255-tighten-bip-agent-compliance.md`: Required visible invocation capture for the `exec` skill run.
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`: Required task plan, progress, verification, and session history records.
- `tasks/ship-manifest-2026-06-28-tighten-bip-agent-compliance.md`: This quality-gate manifest.

## User-Goal Mapping

- "Investigate why enabled BIP mode is ignored": reproduced that `.agents/project.json` has `alignment.build_in_public: true`, no `alignment/*-bip.html` pages exist, and the prior active-page audit did not enforce BIP.
- "Add an enforceable BIP checkpoint": added normal Stage 2 `data-bip-status` states plus approved YAML and not-applicable metadata requirements to the canonical convention.
- "BIP review pages must carry stable metadata": added convention text and audit diagnostics for `data-alignment-page-kind="bip"` and `data-bip-gates`.
- "Normal handoff text must route through BIP": added convention text and audit fixture failure when linked BIP handling does not instruct reviewers to open/review the BIP page before final artifact approval.
- "Extend audits and package surface": updated the shared audit script used by both source and packaged CLI paths; verified both `node scripts/audit-alignment-pages.mjs` and `node packages/skillpacks/bin/skillpacks.mjs alignment pages audit`.
- "Add regression coverage": added focused layer1 fixtures and convention/bundle propagation assertions.
- "Regenerate bundles": regenerated generator-owned `ALIGNMENT-PAGE.md` bundles from `docs/alignment-page-convention.md`.
- "Ship hygiene": captured prompt history, updated task docs/history, created this manifest, and will commit/push on `master`.

## Tests Run

- `node scripts/upgrade-alignment-page.mjs --check` - passed; generated bundles exact.
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts layer1/alignment-gates.test.ts layer1/upgrade-alignment-pages.test.ts` - passed; 3 files, 71 tests.
- `npm --workspace skillpacks run build:check` - passed; includes convention bundle audit, manifest check, and package staging boundary check.
- `npm --workspace skillpacks run test:node` - passed; 155 package node tests, including existing project config and `set-bip` coverage.
- `node scripts/audit-alignment-pages.mjs` - passed; BIP handling summary exact for the source repo.
- `node packages/skillpacks/bin/skillpacks.mjs alignment pages audit` - passed; packaged CLI path reaches the updated audit behavior.
- `node scripts/skill-convention-bundle-audit.mjs` - passed; convention bundles are consistent.
- `node scripts/audit-task-docs.mjs` - passed after fixing the active task heading; advisory manual/recurring items remain non-blocking.
- `git diff --check` - passed.
- `git diff --cached --check` - passed.

## Skipped Tests

- No browser or visual page rendering was run. This change modifies markdown conventions, a Node audit script, generated markdown bundles, and fixture HTML; no runtime web UI or rendered alignment page layout changed.
- A full repository test run was not repeated after the focused layer1, package build/check, package node, source audit, packaged audit, convention bundle audit, task-doc audit, and diff hygiene checks. The changed behavior is covered by the focused suites and command surfaces above.

## Adversarial Review

Method: changed-file self-review plus targeted scans and executable fixture coverage, which is stronger than a generic prose review for this contract because the failure mode is audit bypass.

Findings and handling:

- The initial task-doc update used a heading that failed `node scripts/audit-task-docs.mjs`; fixed by restoring the required `## Current Implementation - Tighten BIP Agent Compliance` heading and rerunning the audit.
- The audit intentionally requires Stage 2 artifact-review signals before enforcing BIP on normal pages, so existing Stage 1 or legacy review pages do not false-fail solely because project BIP is enabled.
- The packaged audit path is not duplicated; it wraps the same source script. Verified with the package CLI smoke instead of copying behavior.
- Generated bundle breadth was reviewed as expected convention propagation from the canonical source, not hand-edited skill drift.

## Residual Risk

- Stage 2 detection is heuristic for legacy pages that omit `data-alignment-stage="stage-2"` and lack recognizable final-artifact approval wording. Such pages may still need convention updates before the audit can classify them. The new convention and tests make the stable metadata path explicit for newly generated pages.
- The audit checks for a narrow not-applicable reason length and metadata presence, but it cannot semantically prove the reason is correct. Human review remains responsible for rejecting generic skips.

## Rollback Note

Revert the shipping commit to restore the previous convention, generated bundles, audit script, fixtures, and task evidence. If only the audit behavior needs emergency neutralization, revert `scripts/audit-alignment-pages.mjs` and rerun `node scripts/upgrade-alignment-page.mjs` only after restoring the canonical convention.

## Next Command

`$brainstorm`
