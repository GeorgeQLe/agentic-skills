---
skill: gh-address-comments
agent: codex
captured_at: 2026-08-12T13:26:44-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# PR #18 Review Remediation Plan

## Summary

Address all three unresolved review threads on PR #18 while preserving uninstall safety and exact recovery semantics. Commit and push the remediation to `feat/17-skillpacks-uninstall`; do not merge, reply to comments, or resolve threads.

## Implementation Changes

- Unify install ownership checking so preview and deletion use the same scoped predicate. Project removal will recognize current and legacy project-managed copied installs; global removal retains its existing global-source rules.
- Canonicalize `enabled_packs` in memory with the existing project-config reconciliation rules before generating `uninstall --all` recovery commands. Do not rewrite config before confirmation; aliases such as `quality` become `code-quality`.
- For targeted uninstall, snapshot requested targets under the project lock before removal:
  - Include a pack when it is configured or has an ownership-verified installed skill.
  - Include a skill when it is configured or has an ownership-verified install.
  - Preserve request order, deduplicate targets, and omit absent targets.
- Print recovery guidance only when the snapshot is non-empty. Mixed requests list only removed/configured selections; a wholly absent request prints no misleading reinstall command.
- Update `tasks/roadmap.md` and `tasks/todo.md` with the three dispositions and verification evidence. Include the existing prompt-history capture in the remediation commit.

## Test Plan

- Confirm `uninstall --all` previews and removes legacy managed copied installs, clears intent, and reports the correct removal count.
- Confirm a stored `quality` alias produces `npx skillpacks install code-quality`, and executing the recovery sequence restores canonical configuration.
- Confirm targeted uninstall of an absent pack or skill emits no reinstall guidance.
- Confirm mixed installed/absent requests include only the installed target.
- Confirm configured-but-missing and owned-but-unconfigured targets remain recoverable.
- Re-run:
  - Focused lifecycle and pack-normalization tests.
  - `npm --workspace packages/skillpacks run test:node`.
  - `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check`.
  - `node scripts/audit-task-docs.mjs`.
  - `git diff --check`.

## Delivery Assumptions

- All three unresolved threads are in scope.
- Existing `remove` behavior, unmanaged-content preservation, confirmation/cancellation behavior, and unrelated project configuration remain unchanged.
- Push one remediation commit to PR #18’s current branch. GitHub replies, thread resolution, merge, release, and deployment remain outside scope.
