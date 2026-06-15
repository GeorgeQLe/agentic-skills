---
skill: targeted-skill-builder
agent: codex
captured_at: 2026-06-15T11:55:22-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Alignment Gate Reactivity Contract

## Summary
Update the shared alignment-page contract, not a new skill. The durable fix is to make revised review pages regenerate their gate set after feedback changes the artifact premise, and make the active-page audit catch confirmed pages that still retain active gate/compile UI.

## Key Changes
- Record the skill invocation prompt under `prompts/targeted-skill-builder/` before implementation work, then update `tasks/roadmap.md` and `tasks/todo.md` with this scoped plan and progress.
- Edit `docs/alignment-page-convention.md` inside the `alignment-convention` block:
  - Add a **Gate reactivity after revisions** rule.
  - Require feedback, partial YAML, `other`, `needs-clarification`, and approval-with-edits revisions to regenerate affected gate questions, options, defaults, blocking state, `unanswered_required_questions`, and any `requiredGateNames`/gate registry from the revised artifact.
  - Require superseded gates to be removed or rewritten, not carried forward mechanically.
  - Require changed gates to be visibly marked in the revised review page.
  - Strengthen confirmed-page wording so confirmed pages may preserve decisions only as read-only records, never active inputs, compile buttons, stale gate registries, or retained controls.
- Extend `scripts/audit-alignment-pages.mjs` with an `Alignment status controls` check:
  - Detect confirmed pages via `data-alignment-status="confirmed"` or visible `alignment_status: confirmed`.
  - Fail confirmed pages containing active gate/feedback/compile controls: `.question-block`, required gate inputs/textareas, `.section-feedback`, local YAML/compile controls, `Compile Responses`, `Compile Feedback YAML`, `requiredGateNames`, response counters, approval-blocking wording, or “retained controls” wording.
  - Keep review-page registry mismatch checks out of this patch unless they can be added without making current active review pages fail unexpectedly.
- Regenerate all generated `ALIGNMENT-PAGE.md` bundles with `node scripts/upgrade-alignment-page.mjs`.
- Patch only bespoke/custom alignment generators if they bypass the shared bundle and directly violate the new confirmed-page or revision-reactivity contract.

## Tests
- Add `tests/layer1/alignment-gates.test.ts` assertions that every generated bundle contains the new gate-reactivity contract language and the stronger confirmed-page prohibition.
- Add `tests/layer1/audit-alignment-pages.test.ts` fixture coverage:
  - confirmed page with read-only approval record passes;
  - confirmed page with `.question-block`, compile controls, `requiredGateNames`, or retained-controls wording fails with the new diagnostic group;
  - review page with active controls still passes existing audit checks.
- Run validation:
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `pnpm --dir tests vitest run layer1/alignment-gates.test.ts layer1/audit-alignment-pages.test.ts`
  - `node scripts/audit-alignment-pages.mjs`
  - `git diff --check`
  - If tracked `SKILL.md` or `PACK.md` behavior/metadata changes unexpectedly, run the skill validation/showcase refresh commands required by `targeted-skill-builder`; otherwise skip showcase refresh as not applicable.

## Assumptions
- This is an existing shared convention/audit update, not a new skill.
- The implementation should not broadly rewrite all alignment-producing skills; generated bundle propagation handles normal skills.
- Current active confirmed pages that still contain controls should fail after the audit change and be handled as follow-up cleanup unless the same implementation pass intentionally updates those pages.
- No GitHub Actions changes.
