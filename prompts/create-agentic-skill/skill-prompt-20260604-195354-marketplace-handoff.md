---
skill: create-agentic-skill
agent: codex
captured_at: 2026-06-04T19:53:54-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Marketplace Handoff: Idea Scope Brief Flags, ICP Validates

## Summary

Add a small cross-skill contract so `idea-scope-brief` records marketplace/platform shape as a hypothesis, and `icp` must validate that shape before generating ICP candidates. Keep `idea-scope-brief` pre-research and make `icp` the owner of research-backed side coverage.

Do this as a follow-up after the currently staged parity/versioning work lands, because the current worktree already has staged edits touching `idea-scope-brief` and `icp`.

## Key Changes

- In both `idea-scope-brief` mirrors, add a compact **Market Structure Handoff** requirement:
  - During the Idea Assumptions Manifest, if the concept appears marketplace/platform/B2B2C/multi-sided, name the apparent sides and value exchange.
  - Mark those sides as hypotheses, not validated ICPs.
  - In `## ICP Readiness`, include those sides as explicit inputs for `$icp` or `/icp`.

- In both `icp` mirrors, add a **Marketplace Side Preflight** before ICP candidate generation:
  - Read any market-structure handoff from the idea brief.
  - Infer likely sides from concept context if no idea brief exists.
  - Validate/refute the marketplace/platform classification during broad research.
  - Require candidate generation to cover each material side, or explicitly explain why a side is excluded, deferred, or not a customer side.

- Versioning and changelogs:
  - Archive current `SKILL.md` files with `scripts/skill-archive.sh` before bumping versions.
  - Bump both Claude and Codex mirrors for each touched skill.
  - Add changelog entries describing the handoff/preflight behavior.

- Task docs:
  - Once the current dirty/staged parity work is clean, add this plan to `tasks/roadmap.md` and `tasks/todo.md`.
  - Do not mix this change into the current staged parity remediation boundary unless that boundary is explicitly reopened.

## Test Plan

- Add focused layer1 contract tests:
  - `idea-scope-brief` mirrors mention marketplace/platform/B2B2C/multi-sided handoff, apparent sides, value exchange, and ICP readiness handoff.
  - `icp` mirrors mention marketplace side preflight, idea-brief side intake, research validation/refutation, and side coverage/exclusion before candidate generation.
  - Existing mirror parity expectations still pass for shared sections.

- Run:
  - focused new test file
  - `tests/layer1/idea-scope-brief-approval-ordering.test.ts`
  - existing ICP/product-path contract tests
  - mirror parity audit if present
  - `git diff --check`

## Assumptions

- `idea-scope-brief` should not perform market research or decide the ICP.
- `icp` must handle direct invocation without an idea brief.
- Marketplace “sides” are concept-level hypotheses in the idea brief and evidence-backed segment inputs in ICP.
- Current staged parity/versioning work lands first; this plan is implemented on a clean or intentionally reconciled worktree.
