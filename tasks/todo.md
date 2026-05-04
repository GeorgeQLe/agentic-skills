# Quality Gate Hardening

**Project:** Claude Skills / agentic-skills
**Current phase:** 21 of 21
**Source roadmap:** `tasks/roadmap.md`
**Source spec:** `tasks/session-workflow-quality-audit.md`

## Phase 21: Quality Gate Hardening

**Goal:** Make anti-slop quality controls a default part of non-trivial mutation and shipping workflows so code cannot be committed by procedural compliance alone.

**Scope:**
- Add a shared quality-gate contract for mutation/shipping skills that requires changed files, user-goal mapping, tests run, skipped tests, residual risk, and next command.
- Harden `$run`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` so non-trivial source mutations require a diff-aware ship manifest and cannot rely on doc-only verification.
- Promote targeted `quality-sweep audit` or equivalent adversarial review into the default pre-ship path for non-trivial code changes.
- Add a lightweight local validation script that can check generated ship manifests or final-response drafts for required quality-gate fields.
- Document how user corrections flow from `tasks/lessons.md` into relevant skill/test updates when a correction exposes a repeatable workflow failure.
- Preserve existing direct-to-primary shipping and next-step routing contracts.

**Acceptance Criteria:**
- [ ] A reusable quality-gate contract exists and is referenced by the global mutation/shipping skills.
- [ ] `$run`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` require a ship manifest for non-trivial source changes.
- [ ] The ship manifest requires changed files, per-file purpose, user-goal mapping, tests run, skipped tests, residual risk, and next command.
- [ ] Non-trivial source changes require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review before commit/push.
- [ ] A validation script detects missing required ship-manifest fields and passes on a complete fixture.
- [ ] User-correction handling requires updating `tasks/lessons.md` and, when applicable, the relevant skill or validation check.
- [ ] Validation passes with targeted contract scans, script fixture checks, skill dependency/version/routing audits, and `git diff --check`.

**Parallelization:** review-only
**Coordination Notes:** Keep implementation serial because the phase touches shared global workflow skills and validation scripts. Use review-only lanes for adversarial contract review after the main edits are drafted.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** review-only
**Integration owner:** main agent
**Conflict risk:** high
**Review gates:** correctness, tests, docs/API conformance, workflow safety

**Subagent lanes:**
- Lane: quality-contract-review
  - Agent: explorer
  - Role: reviewer
  - Mode: review
  - Scope: Review the proposed quality-gate contract and skill-routing changes for loopholes that would still allow source changes to ship without diff-aware evidence.
  - Depends on: Step 21.4
  - Deliverable: Review report listing blockers, recommended wording changes, and validation gaps.

### Implementation
- [x] Step 21.1: Add reusable quality-gate contract documentation.
  - Classification: automated
  - Files: create `docs/quality-gate-contract.md`
  - Define non-trivial mutation, ship manifest fields, skipped-test rationale, residual-risk language, adversarial review expectations, and direct-to-primary compatibility.
  - Include the recommended policy from `tasks/session-workflow-quality-audit.md`: Plan, Implement, Self-review, Quality sweep, Verification, Ship manifest.
- [x] Step 21.2: Add ship-manifest validation script and fixtures.
  - Classification: automated
  - Files: create `scripts/ship-quality-gate.sh`, create `tests/fixtures/ship-quality-gate/complete.md`, create `tests/fixtures/ship-quality-gate/missing-fields.md`
  - Script should fail on missing required fields and pass on a complete manifest fixture.
  - Keep it dependency-light and shell-compatible with existing repository scripts.
  - Implementation plan:
    - Create a POSIX/Bash-compatible local script that accepts one manifest path, prints a clear usage error when missing, and scans for the required contract fields from `docs/quality-gate-contract.md`.
    - Required fields for the first validation pass: User goal, Changed files, Per-file purpose, User-goal mapping, Tests run, Skipped tests, Adversarial review, Residual risk, Rollback note, Next command.
    - Make missing fields fail non-zero with one line per missing field so future skills can use the output directly.
    - Add one complete fixture that passes and one incomplete fixture that intentionally omits multiple fields.
    - Do not add external dependencies or package-manager changes.
- [x] Step 21.3: Harden global execution and shipping skill contracts.
  - Classification: automated
  - Files: modify `global/codex/run/SKILL.md`, modify `global/codex/ship/SKILL.md`, modify `global/codex/ship-end/SKILL.md`, modify `global/codex/commit-and-push-by-feature/SKILL.md`
  - Require ship manifest generation for non-trivial source mutations before commit/push.
  - Require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review for non-trivial code changes.
  - Require final responses to distinguish executable verification from doc-only/task-only checks.
- [x] Step 21.4: Add user-correction enforcement guidance.
  - Classification: automated
  - Files: modify `global/codex/run/SKILL.md`, modify `global/codex/ship/SKILL.md`, modify `global/codex/ship-end/SKILL.md`, modify `global/codex/commit-and-push-by-feature/SKILL.md`, modify `docs/quality-gate-contract.md`
  - Require corrections to update `tasks/lessons.md`.
  - Require a relevant skill or validation script update when the correction exposes a repeatable workflow failure.
  - Require explicit "not applicable" rationale when no skill/test update is made.

### Green
- [ ] Step 21.5: Write and run focused validation for the quality gate.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/complete.md` and confirm it passes.
  - Run `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/missing-fields.md` and confirm it fails for the expected missing fields.
  - Run targeted `rg` scans confirming `docs/quality-gate-contract.md` references and required manifest fields in all touched global skills.
- [ ] Step 21.6: Run repository validation and review gate.
  - Classification: automated
  - Files: no source changes expected beyond review-driven fixes and task review notes
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, and `git diff --check`.
  - Apply concrete review findings from the `quality-contract-review` lane before marking the phase complete.

### Milestone: Quality Gate Hardening
**Acceptance Criteria:**
- [ ] A reusable quality-gate contract exists and is referenced by the global mutation/shipping skills.
- [ ] `$run`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` require a ship manifest for non-trivial source changes.
- [ ] The ship manifest requires changed files, per-file purpose, user-goal mapping, tests run, skipped tests, residual risk, and next command.
- [ ] Non-trivial source changes require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review before commit/push.
- [ ] A validation script detects missing required ship-manifest fields and passes on a complete fixture.
- [ ] User-correction handling requires updating `tasks/lessons.md` and, when applicable, the relevant skill or validation check.
- [ ] Validation passes with targeted contract scans, script fixture checks, skill dependency/version/routing audits, and `git diff --check`.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: [fill when complete]
- Tech debt / follow-ups: [fill when complete]
- Ready for next phase: [fill when complete]

---

### Review
- Planned from `tasks/session-workflow-quality-audit.md` after the audit found that workflows constrain planning/routing slop but do not yet enforce implementation quality strongly enough by default.
- Step 21.1 complete: added `docs/quality-gate-contract.md` with the reusable quality-gate contract for non-trivial mutations, the required Plan/Implement/Self-review/Quality sweep/Verification/Ship manifest flow, ship-manifest fields, skipped-test and residual-risk standards, adversarial review expectations, user-correction handling, and direct-to-primary compatibility.
- Validation:
  - `rg -n "non-trivial|Ship Manifest|Skipped-Test|Residual-Risk|Adversarial Review|Direct-To-Primary|Plan:|Implement:|Self-review:|Quality sweep:|Verification:|User Corrections" docs/quality-gate-contract.md` - passed; confirmed the Step 21.1 required topics are present.
  - `git diff --check` - passed; no whitespace errors.
- Step 21.2 complete: added `scripts/ship-quality-gate.sh` and the complete/missing-fields fixtures under `tests/fixtures/ship-quality-gate/`.
- Validation:
  - `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/complete.md` - passed; complete manifest fixture includes all required fields.
  - `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/missing-fields.md` - failed as expected with missing `Per-file purpose`, `User-goal mapping`, `Skipped tests`, `Adversarial review`, `Residual risk`, and `Rollback note`.
  - `git diff --check` - passed; no whitespace errors.
- Step 21.3 complete: hardened `global/codex/run/SKILL.md`, `global/codex/ship/SKILL.md`, `global/codex/ship-end/SKILL.md`, and `global/codex/commit-and-push-by-feature/SKILL.md` so non-trivial mutations require the `docs/quality-gate-contract.md` ship manifest before commit/push.
- Step 21.3 ship manifest:
  - User goal: Execute Phase 21 Step 21.3 by making global execution and shipping contracts require diff-aware quality-gate evidence for non-trivial source mutations.
  - Changed files: `global/codex/run/SKILL.md`, `global/codex/ship/SKILL.md`, `global/codex/ship-end/SKILL.md`, `global/codex/commit-and-push-by-feature/SKILL.md`, `tasks/todo.md`, `tasks/history.md`, and pre-existing `tasks/lessons.md`.
  - Per-file purpose: the four global skill files add quality-gate, manifest, adversarial-review, and executable-verification requirements; `tasks/todo.md` records completion and evidence; `tasks/history.md` records the shipped step; `tasks/lessons.md` contains a pre-existing lesson about human-only blocker routing and is not part of Step 21.3 implementation.
  - User-goal mapping: the skill edits satisfy the Step 21.3 hardening goal; task/history edits satisfy `$run` progress and shipping requirements; `tasks/lessons.md` is separated as an already-present workflow lesson so the ship boundary is explicit.
  - Tests run: `rg -n "docs/quality-gate-contract.md|ship manifest|User goal|Changed files|Per-file purpose|User-goal mapping|Tests run|Skipped tests|Adversarial review|Residual risk|Rollback note|Next command|documentation-only|task-only" global/codex/run/SKILL.md global/codex/ship/SKILL.md global/codex/ship-end/SKILL.md global/codex/commit-and-push-by-feature/SKILL.md` - passed; all touched global skills contain the expected contract references and fields. `git diff --check` - passed; no whitespace errors.
  - Skipped tests: no executable runtime test suite was run for Step 21.3 because the change is workflow-policy Markdown only; targeted contract scans and whitespace validation cover the changed behavior surface.
  - Adversarial review: changed-file self-review plus targeted `rg` scans checked for loopholes allowing non-trivial source changes to ship without a manifest, adversarial review, or executable-verification distinction. One unrelated next-step-routing drift in the diff was removed before validation.
  - Residual risk: the wording is policy-only until operators follow it; Step 21.5 will add broader focused validation scans across the quality-gate contract.
  - Rollback note: revert the Step 21.3 commit to remove the new skill-contract enforcement language.
  - Next command: `$run`.
- Validation:
  - `rg -n "docs/quality-gate-contract.md|ship manifest|User goal|Changed files|Per-file purpose|User-goal mapping|Tests run|Skipped tests|Adversarial review|Residual risk|Rollback note|Next command|documentation-only|task-only" global/codex/run/SKILL.md global/codex/ship/SKILL.md global/codex/ship-end/SKILL.md global/codex/commit-and-push-by-feature/SKILL.md` - passed; required quality-gate references and manifest fields are present in all touched global skills.
  - `git diff --check` - passed; no whitespace errors.
- Next implementation step: Step 21.4.
- Step 21.4 complete: tightened user-correction enforcement in `docs/quality-gate-contract.md`, `global/codex/run/SKILL.md`, `global/codex/ship/SKILL.md`, `global/codex/ship-end/SKILL.md`, and `global/codex/commit-and-push-by-feature/SKILL.md`.
- Step 21.4 ship manifest:
  - User goal: Execute Phase 21 Step 21.4 by making user-correction handling enforceable in the reusable quality gate and the global execution/shipping workflows.
  - Changed files: `docs/quality-gate-contract.md`, `global/codex/run/SKILL.md`, `global/codex/ship/SKILL.md`, `global/codex/ship-end/SKILL.md`, `global/codex/commit-and-push-by-feature/SKILL.md`, `tasks/todo.md`, and `tasks/history.md`.
  - Per-file purpose: `docs/quality-gate-contract.md` defines the canonical correction-enforcement contract; the four global skill files apply that contract during run/ship/session-wrap/commit-push flows; `tasks/todo.md` records completion, validation, review, and the ship manifest; `tasks/history.md` records the shipped step.
  - User-goal mapping: the quality contract and skill edits satisfy the Step 21.4 requirements to update `tasks/lessons.md`, require a relevant skill/script/fixture/test update when a correction exposes a repeatable workflow failure, and require an explicit not-applicable rationale when no enforcement update applies.
  - Tests run: `rg -n "User corrections are presumed repeatable|exact shipping boundary|tasks/lessons.md update for the current correction|Correction enforcement|pre-commit ship manifest|existing rule|concrete follow-up file|validation script, fixture, or test" docs/quality-gate-contract.md global/codex/run/SKILL.md global/codex/ship/SKILL.md global/codex/ship-end/SKILL.md global/codex/commit-and-push-by-feature/SKILL.md` - passed; all touched contracts contain the stricter correction-enforcement wording. `git diff --check` - passed; no whitespace errors.
  - Skipped tests: no executable runtime suite was run because Step 21.4 changes workflow-policy Markdown only; targeted contract scans and whitespace validation cover the changed behavior surface. Broader script fixture checks and repository validation remain explicitly scheduled for Steps 21.5 and 21.6.
  - Adversarial review: the `quality-contract-review` explorer lane found four loopholes: `when practical` escape wording, final-response rationale after commit/push, stale `tasks/lessons.md` satisfaction, and unsupported existing-rule claims. The final wording fixes those by making current shipping-boundary evidence mandatory, requiring pre-commit manifest rationale for mutation shipping, and requiring exact file/rule/check citations for existing-rule coverage.
  - Residual risk: enforcement is still policy-based until Step 21.5 expands focused validation; the review lane also noted that `scripts/ship-quality-gate.sh` does not yet conditionally validate correction-follow-up manifests.
  - Rollback note: revert the Step 21.4 commit to remove the correction-enforcement hardening language.
  - Next command: `$run`.
- Validation:
  - `rg -n "User corrections are presumed repeatable|exact shipping boundary|tasks/lessons.md update for the current correction|Correction enforcement|pre-commit ship manifest|existing rule|concrete follow-up file|validation script, fixture, or test" docs/quality-gate-contract.md global/codex/run/SKILL.md global/codex/ship/SKILL.md global/codex/ship-end/SKILL.md global/codex/commit-and-push-by-feature/SKILL.md` - passed; required correction-enforcement wording is present in the canonical contract and all touched global skills.
  - `git diff --check` - passed; no whitespace errors.
- Next implementation step: Step 21.5.
