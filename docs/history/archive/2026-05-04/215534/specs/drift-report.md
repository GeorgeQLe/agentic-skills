# Spec Drift Report

## 2026-05-04 - `$spec-drift fix all`

### Scope

Refreshed the drift report after `e350448` (`spec: monorepo execution controller integration`) added `specs/monorepo-execution-controller.md` and `specs/monorepo-execution-controller-interview.md`, and after the task-doc reconciliation commit `8ae7d4a`.

Spec inventory audited:

- `specs/approved-plan.schema.json`
- `specs/code-quality-skill-pack.md`
- `specs/creator-platform-evidence-schema.md`
- `specs/monorepo-execution-controller.md`
- `specs/project-fleet.md`
- `specs/poketo-headless-auth-migration.md`
- legacy kanban fallback specs:
  - `specs/board-flag-kanban-search.md`
  - `specs/kanban-command-test-coverage.md`
  - `specs/kanban-multi-user.md`
  - `specs/kanban-offline-queue-soft-delete.md`
  - `specs/kanban-production-test-plan.md`

Skipped by contract: `*-interview.md` files and this drift report.

### Summary

- **Errors:** 0
- **Warnings:** 1
- **Info:** 0
- **Verified / intentionally scoped:** 8 groups

No Error-class spec/code contradictions were found. One Warning-class unimplemented spec surface remains: the new monorepo execution controller spec describes a future monorepo pack and scripts that are not implemented yet. The spec appears to be the intended target, so the fix is to queue concrete implementation work rather than rewrite the spec.

### Verified

- [x] `specs/approved-plan.schema.json` still matches the approval-packet consumers.
  - Spec claim: `description` says the packet is consumed by `$run --execute-approved`, `/handoff --target=codex`, and `/delegate`.
  - Evidence: `global/codex/run/SKILL.md` documents `--execute-approved` consumption and freshness handling; `global/claude/handoff/SKILL.md` documents `--target=codex` packet drafting; `global/claude/delegate/SKILL.md` documents live packet drafting and Codex execution.
  - Evidence: `scripts/approved-plan.sh` implements lifecycle states `draft`, `approved`, `consumed`, `stale`, `superseded`, and `uncertain`; `specs/approved-plan.schema.json` permits the same enum.

- [x] `specs/code-quality-skill-pack.md` still matches the shipped pack layout and aliases.
  - Spec claim: the pack lives at `packs/code-quality/` with mirrored Claude/Codex `extract-shared-types` and `quality-sweep` skills.
  - Evidence: `packs/code-quality/PACK.md`, `packs/code-quality/claude/extract-shared-types/SKILL.md`, `packs/code-quality/claude/quality-sweep/SKILL.md`, `packs/code-quality/codex/extract-shared-types/SKILL.md`, and `packs/code-quality/codex/quality-sweep/SKILL.md` exist.
  - Evidence: `scripts/pack.sh` normalizes `quality`, `codequality`, `code_quality`, and `code-quality` to `code-quality`.
  - Evidence: `README.md` and `docs/skills-reference.md` include `code-quality` install guidance.

- [x] `specs/project-fleet.md` still matches the public `$project-fleet` workflow.
  - Spec claim: `$project-fleet` owns fleet queue state, guarded provisioning, blocker handling, productive fallback work, verification, status reporting, and shipping.
  - Evidence: `global/codex/project-fleet/SKILL.md` defines the same core model, state machine, lane selection, guarded provisioning rules, blocker ledger, output contract, constraints, and default shipping contract.
  - Evidence: `global/codex/clone-spec-store/SKILL.md` routes ongoing multi-repo queue operation through `$project-fleet` after Phase 6 exists.
  - Evidence: `README.md` lists `project-fleet` in the global skill catalog.

- [x] `specs/creator-platform-evidence-schema.md` remains represented by the shipped creator-media evidence foundation.
  - Spec claim: creator platform work starts with capability and evidence schema foundations before platform-specific audits.
  - Evidence: `packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md`, `packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md`, `packs/creator-media/claude/creator-evidence-schema/SKILL.md`, and `packs/creator-media/codex/creator-evidence-schema/SKILL.md` exist.
  - Evidence: `packs/creator-media/PACK.md`, `README.md`, and `docs/skills-reference.md` route non-YouTube creator-media work through the foundation skills.

- [x] `specs/poketo-headless-auth-migration.md` remains the active architectural reference for kanban migration.
  - Spec claim: active kanban skills should run on the headless path, while `kanban.mjs` remains fallback/admin tooling.
  - Evidence: the legacy kanban specs carry a banner naming `kanban.mjs` as fallback/admin-only and point to `specs/poketo-headless-auth-migration.md` for the active path.
  - Evidence: `packs/poketowork-kanban/claude/poketo-kanban/` still contains the standalone script surface, so the fallback specs remain historical context rather than active product claims.

- [x] Legacy kanban specs are intentionally scoped as fallback-path documents.
  - Spec claim: each legacy file begins with `Status: Legacy (kanban.mjs fallback path)` and points to the headless migration spec.
  - Evidence: `specs/board-flag-kanban-search.md`, `specs/kanban-command-test-coverage.md`, `specs/kanban-multi-user.md`, `specs/kanban-offline-queue-soft-delete.md`, and `specs/kanban-production-test-plan.md` all carry that banner.
  - Decision: unimplemented future-work claims inside those files are not active drift unless the fallback/admin script becomes the primary path again.

- [x] Devtool research artifacts remain research-chain outputs, not implementation specs.
  - Evidence: `research/devtool-positioning.md`, `research/devtool-monetization.md`, and `research/devtool-docs-audit.md` are canonical research artifacts under `research/`, not spec claims under `specs/`.
  - Decision: no code conformance work is required from those artifacts. They remain inputs to future roadmap/research work.

- [x] Recent global workflow skills without dedicated specs are self-documented skill surfaces, not active spec drift.
  - Evidence: `global/codex/codebase-status/SKILL.md`, `global/codex/install-agentic-skills/SKILL.md`, `global/codex/targeted-skill-builder/SKILL.md`, and `global/codex/feature-interview/SKILL.md` each define their own workflow contract and are registered in README/discovery docs.
  - Decision: no existing spec contradicts these skills. Treat them as skill-contract documentation unless they become shared schemas, public APIs, or cross-repo controllers that need dedicated specs.

### Warnings

- [ ] `specs/monorepo-execution-controller.md` describes an unimplemented monorepo pack.
  - Spec quote: "A new `monorepo` pack for the agentic-skills library" and "V1 ships four skills: `mono-detect`, `mono-run`, `mono-ship`, and `mono-guard`."
  - Code evidence: `packs/monorepo/` does not exist; no `mono-detect`, `mono-run`, or `mono-ship` skill exists under `global/` or `packs/`; no `scripts/mono-detect.sh`, `scripts/lane-spec-validate.sh`, or `scripts/monorepo-validate.sh` exists.
  - Related code evidence: only global advisory skills exist today: `global/codex/mono-plan/SKILL.md`, `global/codex/mono-guard/SKILL.md`, `global/claude/mono-plan/SKILL.md`, and `global/claude/mono-guard/SKILL.md`.
  - Fix applied: queued concrete implementation work in `tasks/todo.md` under `## Spec Drift Follow-up`.

### Resolved

- [x] Refreshed `specs/drift-report.md` with the current audit scope and evidence.
- [x] Preserved the previous drift report at `docs/history/archive/2026-05-04/110835/specs/drift-report.md` before replacement.
- [x] Confirmed no Error-class active spec/code contradictions require user arbitration.
- [x] Queued the unimplemented monorepo execution controller spec as concrete task work instead of rewriting the spec.

### Deferred

- [ ] Implement the monorepo execution controller pack or explicitly revise the spec scope if the intended implementation should stay with global `mono-plan` / `mono-guard` only.

### Remaining Findings

- No Error findings remain in this audit scope.
- One Warning remains tracked in `tasks/todo.md`: implement or rescope the monorepo execution controller spec.

## 2026-05-01 - `$spec-drift fix all`

### Scope

Refreshed the drift report after `3e3bbf6` (`fix(skills): use local venv for youtube transcripts`, 2026-05-01 10:19:30 -0400) updated skill/documentation surfaces after the previous drift report.

Spec inventory audited:

- `specs/approved-plan.schema.json`
- `specs/code-quality-skill-pack.md`
- `specs/project-fleet.md`
- `specs/poketo-headless-auth-migration.md`
- legacy kanban fallback specs:
  - `specs/board-flag-kanban-search.md`
  - `specs/kanban-command-test-coverage.md`
  - `specs/kanban-multi-user.md`
  - `specs/kanban-offline-queue-soft-delete.md`
  - `specs/kanban-production-test-plan.md`

Skipped by contract: `*-interview.md` files and this drift report.

### Summary

- **Errors:** 0
- **Warnings:** 0
- **Info:** 0
- **Verified / intentionally scoped:** 7 groups

No Error-class spec/code contradictions were found. No Warning-class active spec claims were found that require implementation work. The prior Info-class coverage gap for `$project-fleet` is resolved by the new canonical `specs/project-fleet.md`.

### Verified

- [x] `specs/approved-plan.schema.json` still matches the approval-packet consumers.
  - Spec claim: `description` says the packet is consumed by `$run --execute-approved`, `/handoff --target=codex`, and `/delegate`.
  - Evidence: `global/codex/run/SKILL.md` documents `--execute-approved` consumption and freshness handling; `global/claude/handoff/SKILL.md` documents `--target=codex` packet drafting; `global/claude/delegate/SKILL.md` documents live packet drafting and Codex execution.
  - Evidence: `scripts/approved-plan.sh` implements lifecycle states `draft`, `approved`, `consumed`, `stale`, `superseded`, and `uncertain`; `specs/approved-plan.schema.json` permits the same enum.

- [x] `specs/code-quality-skill-pack.md` still matches the shipped pack layout and aliases.
  - Spec claim: the pack lives at `packs/code-quality/` with mirrored Claude/Codex `extract-shared-types` and `quality-sweep` skills.
  - Evidence: `packs/code-quality/PACK.md`, `packs/code-quality/claude/extract-shared-types/SKILL.md`, `packs/code-quality/claude/quality-sweep/SKILL.md`, `packs/code-quality/codex/extract-shared-types/SKILL.md`, and `packs/code-quality/codex/quality-sweep/SKILL.md` exist.
  - Evidence: `scripts/pack.sh` normalizes `quality`, `codequality`, `code_quality`, and `code-quality` to `code-quality`.
  - Evidence: `README.md` and `docs/skills-reference.md` include `code-quality` install guidance.

- [x] `specs/project-fleet.md` now covers the public `$project-fleet` workflow.
  - Spec claim: `$project-fleet` owns fleet queue state, guarded provisioning, blocker handling, productive fallback work, verification, status reporting, and shipping.
  - Evidence: `global/codex/project-fleet/SKILL.md` defines the same core model, state machine, lane selection, guarded provisioning rules, blocker ledger, output contract, constraints, and default shipping contract.
  - Evidence: `global/codex/clone-spec-store/SKILL.md` routes ongoing multi-repo queue operation through `$project-fleet` after Phase 6 exists.
  - Evidence: `README.md` lists `project-fleet` in the global skill catalog.

- [x] `specs/poketo-headless-auth-migration.md` remains the active architectural reference for kanban migration.
  - Spec claim: active kanban skills should run on the headless path, while `kanban.mjs` remains fallback/admin tooling.
  - Evidence: the legacy kanban specs carry a banner naming `kanban.mjs` as fallback/admin-only and point to `specs/poketo-headless-auth-migration.md` for the active path.
  - Evidence: `packs/poketowork-kanban/claude/poketo-kanban/` still contains the standalone script surface, so the fallback specs remain historical context rather than active product claims.

- [x] Legacy kanban specs are intentionally scoped as fallback-path documents.
  - Spec claim: each legacy file begins with `Status: Legacy (kanban.mjs fallback path)` and points to the headless migration spec.
  - Evidence: `specs/board-flag-kanban-search.md`, `specs/kanban-command-test-coverage.md`, `specs/kanban-multi-user.md`, `specs/kanban-offline-queue-soft-delete.md`, and `specs/kanban-production-test-plan.md` all carry that banner.
  - Decision: unimplemented future-work claims inside those files are not active drift unless the fallback/admin script becomes the primary path again.

- [x] Devtool research artifacts are research-chain outputs, not implementation specs.
  - Evidence: `research/devtool-positioning.md`, `research/devtool-monetization.md`, and `research/devtool-docs-audit.md` are canonical research artifacts under `research/`, not spec claims under `specs/`.
  - Decision: no code conformance work is required from those artifacts. They remain inputs to future roadmap/research work.

- [x] The 2026-05-01 `$youtube-audit` local-venv change is skill guidance, not drift against an existing canonical spec.
  - Evidence: `global/codex/youtube-audit/SKILL.md` now prefers `.venv/bin/python` when present and instructs users to install `youtube-transcript-api` in a project-local virtual environment when system Python is externally managed.
  - Evidence: no canonical `specs/youtube-audit.md` exists and no existing spec claims a different transcript dependency installation contract.
  - Decision: classify as no drift rather than undocumented spec coverage because `$youtube-audit` is self-documented in `SKILL.md` and the change does not expose a new public API, route, data model, or shared contract.

### Resolved

- [x] Added `specs/project-fleet.md` to resolve the previous Info-class undocumented public workflow finding.
- [x] Refreshed `specs/drift-report.md` with the current audit scope and evidence.
- [x] Preserved the previous drift report at `docs/history/archive/2026-05-01/112050/specs/drift-report.md` before replacement.
- [x] Confirmed no active spec/code contradictions require user arbitration.

### Deferred

- [ ] No deferred drift findings remain in this audit scope.

### Remaining Findings

- No Error, Warning, or Info findings remain in this audit scope.

## 2026-04-30 - `$spec-drift fix all`

### Scope

Refreshed the drift report after the 2026-04-30 documentation and skill-surface changes, including:

- `73374eb feat(skills): add project fleet orchestration`
- `7d105c3 docs(devtool): add monetization research`

Spec inventory audited:

- `specs/approved-plan.schema.json`
- `specs/code-quality-skill-pack.md`
- `specs/poketo-headless-auth-migration.md`
- legacy kanban fallback specs:
  - `specs/board-flag-kanban-search.md`
  - `specs/kanban-command-test-coverage.md`
  - `specs/kanban-multi-user.md`
  - `specs/kanban-offline-queue-soft-delete.md`
  - `specs/kanban-production-test-plan.md`

Skipped by contract: `*-interview.md` files and this drift report.

### Summary

- **Errors:** 0
- **Warnings:** 0
- **Info:** 1
- **Verified / intentionally scoped:** 5 groups

No Error-class spec/code contradictions were found. No Warning-class active spec claims were found that require implementation work. The only new finding is an Info-class coverage gap: the public `$project-fleet` skill is documented and linked from `clone-spec-store`, but it does not yet have a canonical spec.

### Verified

- [x] `specs/approved-plan.schema.json` still matches the approval-packet consumers.
  - Spec claim: `description` says the packet is consumed by `$run --execute-approved`, `/handoff --target=codex`, and `/delegate`.
  - Evidence: `global/codex/run/SKILL.md` documents `--execute-approved` consumption and freshness handling; `global/claude/handoff/SKILL.md` documents `--target=codex` packet drafting; `global/claude/delegate/SKILL.md` documents live packet drafting and Codex execution.
  - Evidence: `scripts/approved-plan.sh` implements lifecycle states `draft`, `approved`, `consumed`, `stale`, `superseded`, and `uncertain`; `specs/approved-plan.schema.json` permits the same enum.

- [x] `specs/code-quality-skill-pack.md` still matches the shipped pack layout and aliases.
  - Spec claim: the pack lives at `packs/code-quality/` with mirrored Claude/Codex `extract-shared-types` and `quality-sweep` skills.
  - Evidence: `packs/code-quality/PACK.md`, `packs/code-quality/claude/extract-shared-types/SKILL.md`, `packs/code-quality/claude/quality-sweep/SKILL.md`, `packs/code-quality/codex/extract-shared-types/SKILL.md`, and `packs/code-quality/codex/quality-sweep/SKILL.md` exist.
  - Evidence: `scripts/pack.sh` normalizes `quality`, `codequality`, `code_quality`, and `code-quality` to `code-quality`.
  - Evidence: `README.md` and `docs/skills-reference.md` include `code-quality` install guidance.

- [x] `specs/poketo-headless-auth-migration.md` remains the active architectural reference for kanban migration.
  - Spec claim: active kanban skills should run on the headless path, while `kanban.mjs` remains fallback/admin tooling.
  - Evidence: the legacy kanban specs now carry a banner naming `kanban.mjs` as fallback/admin-only and point to `specs/poketo-headless-auth-migration.md` for the active path.
  - Evidence: `packs/poketowork-kanban/claude/poketo-kanban/` still contains the standalone script surface, so the fallback specs remain historical context rather than active product claims.

- [x] Legacy kanban specs are intentionally scoped as fallback-path documents.
  - Spec claim: each legacy file begins with `Status: Legacy (kanban.mjs fallback path)` and points to the headless migration spec.
  - Evidence: `specs/board-flag-kanban-search.md`, `specs/kanban-command-test-coverage.md`, `specs/kanban-multi-user.md`, `specs/kanban-offline-queue-soft-delete.md`, and `specs/kanban-production-test-plan.md` all carry that banner.
  - Decision: unimplemented future-work claims inside those files are not active drift unless the fallback/admin script becomes the primary path again.

- [x] Devtool research artifacts added after the last drift report are research-chain outputs, not implementation specs.
  - Evidence: `research/devtool-positioning.md` and `research/devtool-monetization.md` are canonical research artifacts under `research/`, not spec claims under `specs/`.
  - Decision: no code conformance work is required from those artifacts. They remain inputs to future roadmap/research work.

### Info

- [ ] `global/codex/project-fleet/SKILL.md` is a significant public skill without a canonical spec.
  - Code/doc evidence: `global/codex/project-fleet/SKILL.md` defines `$project-fleet` as an orchestration skill for central control repositories coordinating downstream repositories or work items.
  - Code/doc evidence: `global/codex/clone-spec-store/SKILL.md` routes ongoing multi-repo queue operation through `$project-fleet` after Phase 6 exists.
  - Code/doc evidence: `README.md` lists `project-fleet` in the global skill catalog.
  - Why Info, not Error: no existing spec contradicts the implementation. The skill is documented in README and its own `SKILL.md`; it simply lacks a dedicated canonical spec under `specs/`.
  - Recommended follow-up: if `$project-fleet` becomes a core cross-project workflow rather than a helper for clone/spec-store fleets, create `specs/project-fleet.md` that captures its state model, guarded provisioning rules, blocker ledger, status files, and shipping constraints.

### Resolved

- [x] Refreshed `specs/drift-report.md` with the current audit scope and evidence.
- [x] Preserved the previous drift report at `docs/history/archive/2026-04-30/180205/specs/drift-report.md` before replacement.
- [x] Confirmed no active spec/code contradictions require user arbitration.

### Deferred

- [ ] Optional future spec: `specs/project-fleet.md` if the `$project-fleet` workflow needs a durable canonical spec beyond README and `SKILL.md`.

### Remaining Findings

- No Error or Warning findings remain in this audit scope.

## 2026-04-22 - `docs/operating-modes.md` + `global/codex/handoff`

### Resolved

- [x] `docs/operating-modes.md` § "Approval packet" (line 51) - Corrected claim that `codex-only` cross-session handoff uses the shared approval packet. Packet-producing handoff is Claude-side only (`/handoff --target=codex`); `codex-only` projects have no packet writer. Reworded to "cross-session handoff from `claude-only` or `hybrid` into a later Codex session."
- [x] `docs/operating-modes.md` § "Skills matrix" handoff row (line 192) - Expanded the note to disambiguate Claude `/handoff --target=codex` (produces approval packet) from Codex `$handoff` (writes `tasks/handoff.md` prose only, no packet).
- [x] `global/codex/handoff/SKILL.md` § "Constraints" - Added an explicit note that `$handoff` does not produce `.agents/approved-plan.json` or `tasks/approved-plan.md`, and pointed packet-needing users at Claude-side `/handoff --target=codex` + `$run --execute-approved`.

### Deferred

- [ ] No skill behavior, schema, or script changed. Doc-only disambiguation.

### Remaining Findings

- None in scope. Next queue item: `$spec-drift fix approval-packet references` (stale `## Approval / Delegation Packet` anchors).

## 2026-04-20 - `packs/business-app/*/scale-audit`

### Resolved

- [x] `packs/business-app/claude/scale-audit/SKILL.md` - Replaced unconditional `/roadmap` primary guidance with state-based `## Next Steps` selection. Evidence: `docs/skill-next-step-contracts.md` says `scale-audit` should recommend `spec-interview [blocker]` when enterprise blockers lack specs and `roadmap` only when work is ready to sequence.
- [x] `packs/business-app/codex/scale-audit/SKILL.md` - Matched the same state-based recommendation contract for `$scale-audit`, including `$spec-interview [top blocker]` for unspecced hard blockers and `$roadmap` only after hard blockers are specced or already tracked.
- [x] Both variants now limit `spec-interview` prompts to gaps that lack full specs, reducing duplicate work against `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md`.

### Deferred

- [ ] No code or canonical product specs changed. This drift fix was limited to skill guidance.

### Remaining Findings

- No remaining `scale-audit` next-step drift found against `docs/skill-next-step-contracts.md` for this scope.
