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
- [ ] Step 21.3: Harden global execution and shipping skill contracts.
  - Classification: automated
  - Files: modify `global/codex/run/SKILL.md`, modify `global/codex/ship/SKILL.md`, modify `global/codex/ship-end/SKILL.md`, modify `global/codex/commit-and-push-by-feature/SKILL.md`
  - Require ship manifest generation for non-trivial source mutations before commit/push.
  - Require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review for non-trivial code changes.
  - Require final responses to distinguish executable verification from doc-only/task-only checks.
- [ ] Step 21.4: Add user-correction enforcement guidance.
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
- Next implementation step: Step 21.3.
