---
skill: exec
agent: codex
captured_at: 2026-07-12T01:15:53-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Codex Accountable Multi-Agent Lifecycle

## Summary

Implement a Codex-only, risk-based accountability lifecycle across planning, execution, independent review, quality gating, and shipping. Sol remains the sole integration and delivery owner; Luna performs bounded implementation only when safe; Terra independently audits the integrated result. Claude skill sources remain unchanged.

Before implementation, preserve and reconcile the current dirty worktree so existing user changes are neither overwritten nor accidentally shipped.

## Implementation Changes

- Add `docs/codex-accountable-agent-workflow.md` as the canonical Codex-only convention:
  - Define Sol, Luna, and Terra responsibilities and lifecycle order.
  - Treat model names as requested roles: record requested and resolved model identity, preserve role semantics when model selection is unavailable, and disclose fallback.
  - Activate independent Terra review for every non-trivial Codex mutation; use Luna only when parallelization is beneficial and ownership is disjoint.
  - Limit Luna implementation fan-out to three agents by default.
  - Define the Luna assignment/report contract, Terra finding schema, Sol disposition ledger, remediation rules, focused re-audit triggers, and final reporting contract.
  - Keep trivial text, formatting, and task-checkbox changes on the existing single-owner path.

- Amend Codex planning and execution:
  - Extend `plan-phase` with an orthogonal `Accountability topology` field rather than adding another parallelization mode.
  - Require decision-complete Luna lanes: objective, acceptance criteria, context, allowed paths, forbidden/shared paths, verification commands, dependencies, model request/resolution, and return evidence.
  - Extend `exec` into the lifecycle controller: plan as Sol, dispatch eligible Luna lanes, wait, inspect actual diffs and surrounding code, enforce ownership, integrate personally, verify the integrated state, launch a fresh read-only Terra audit, disposition every finding, remediate accepted findings, run focused Terra re-review for high-risk fixes, and perform final Sol acceptance.
  - Keep task docs, shared manifests, lockfiles, migrations, generated artifacts, integration, commits, pushes, and deployment under Sol unless exclusive ownership is explicitly assigned.
  - Preserve existing `implementation-safe` same-worktree behavior and branch-isolated `agent-team` behavior; reject overlapping write lanes.

- Amend review and quality gating:
  - Add `--adversarial-diff --read-only` behavior to Codex `expert-review`.
  - In delegated Terra mode, prohibit repository and task-document writes and require severity, file/line evidence, impact, remediation, verification method, and confidence for every non-stylistic finding.
  - Update the shared quality-gate document only with a generic pointer that Codex executors may impose a stricter platform-specific independent-review contract; keep Sol/Luna/Terra terminology in the Codex convention.
  - Require a Sol disposition of `accepted`, `rejected`, or `deferred` for every Terra finding. Accepted Critical/High findings block shipping; rejections require evidence; deferrals require residual-risk and next-step records.
  - Require a fresh focused Terra verification after remediation affecting security, authentication, billing, persistence, migrations, concurrency, privacy, data loss, or broad cross-package contracts.

- Amend Codex shipping:
  - Extend `ship` and `ship-end` manifests and terminal reports with Luna assignments/results, Sol inspection and integration evidence, Terra findings and dispositions, remediation, focused re-review, model-routing fallbacks, integrated verification, grouped changed files, deferred risks, and unavailable checks.
  - Refuse shipping when an accepted Critical/High finding is unresolved, required integrated verification failed, or a required focused re-audit is missing.
  - Preserve existing direct-to-primary and agent-team branch-consolidation rules.

- Version and package correctly:
  - Archive each affected current Codex `SKILL.md` with `scripts/skill-archive.sh`, bump `plan-phase` and `exec` to `v0.7`, `expert-review` to `v0.2`, `ship` to `v0.14`, and `ship-end` to `v0.16`, and update each skill’s `CHANGELOG.md`.
  - Do not edit Claude mirrors or generated `.codex/skills/**` files directly.
  - Add narrowly justified Codex/Claude parity exceptions only where the parity audit requires them.
  - Refresh runtime copies with `scripts/pack.sh refresh`, regenerate the public skills catalog export, and update any focused audit that pins the changed Codex versions.
  - Record the implementation in `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/history.md` without overwriting the current unrelated task state.

## Test Plan

- Add a layer-one contract test covering:
  - risk-based activation and trivial-change exemption;
  - maximum three Luna agents;
  - complete Luna assignment and return fields;
  - rejection of overlapping ownership;
  - Sol-only integration and shipping ownership;
  - Terra freshness and read-only enforcement;
  - required structured findings and Sol dispositions;
  - blocking unresolved accepted Critical/High findings;
  - high-risk focused re-audit triggers;
  - required final accountability report fields;
  - model-selection fallback disclosure.

- Run:
  - targeted new lifecycle contract tests;
  - skill archive audit;
  - Codex/Claude mirror-parity audit;
  - task-document audit;
  - alignment resolver/audit checks affected by skill version changes;
  - catalog generation and catalog validation;
  - full layer-one test suite;
  - `scripts/pack.sh refresh` followed by source/runtime consistency checks.

- Inspect the final diff to confirm no Claude skill source changed, generated runtime roots are not staged, existing user changes remain intact, and every changed file maps to the accountable lifecycle objective.

## Assumptions

- Risk-based activation is the selected default: independent Terra review for non-trivial Codex mutations, Luna only for safely parallelizable work, and focused Terra verification for high-risk remediation.
- Sol/Luna/Terra are enforceable role contracts; exact model routing is requested and reported but never falsely claimed when the runtime lacks a model selector.
- No new standalone orchestration skill is introduced; the lifecycle extends the existing `plan-phase` → `exec` → review → shipping path.
- Claude skills and behavior remain unchanged.
