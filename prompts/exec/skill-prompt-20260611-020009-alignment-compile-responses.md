---
skill: exec
agent: codex
captured_at: 2026-06-11T02:00:09-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Alignment Page Compile Responses Convention

## Summary
Update the shared alignment-page convention so review pages use one unified response compilation model: gate answers and section feedback compile together as “responses,” while local feedback UI stays hidden until a user selects emphasize, thumbs-down, or clarification for that section.

## Key Changes
- Edit `docs/alignment-page-convention.md` inside the `alignment-convention` block.
- Rename the feedback/gate compile model from separate “Compile Feedback YAML” and “Compile Answers” paths to a single “Compile Responses” control in the bottom compile section.
- Define compiled responses as a mixed YAML payload that may include:
  - answered gate questions under the existing gate-answer shape;
  - selected section feedback under the existing `section_feedback` shape;
  - unanswered required gate count/status when feedback is being sent before all gates are answered.
- Preserve partial-response behavior: users can compile responses when they have either answered gate questions or selected section feedback, without needing every required gate answered first.
- Keep final approval semantics: the compiled YAML is only `approval_status: ready-for-agent-review` when every required gate is answered and there are no unresolved negative/clarification feedback items.
- Update section-feedback wording so local feedback textarea, local compile/copy controls, and local read-only YAML output are hidden until one of the three feedback buttons is selected for that section; deselecting hides them again.
- Update confirmed-page wording to remove the final “Compile Responses” button, response counters, input controls, and approval-blocking UI after confirmation.

## Propagation
- Run `node scripts/upgrade-alignment-page.mjs` to regenerate all generated `ALIGNMENT-PAGE.md` bundles.
- Do not hand-edit generated bundles.
- Leave unrelated existing worktree changes, including `packages/skillpacks/package.json`, untouched unless they become directly relevant.

## Tests
- Update focused layer1 assertions in `tests/layer1/alignment-gates.test.ts` to expect:
  - one bottom “Compile Responses” control instead of separate compile feedback/answers controls;
  - mixed gate-answer and section-feedback output in one compiled payload;
  - local feedback textarea/YAML controls hidden until section feedback is selected;
  - generated bundles contain the new wording.
- Update `tests/layer1/upgrade-alignment-pages.test.ts` wording if it still expects “feedback-only YAML” or “final answer YAML” as separate page features.
- Run:
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts`
  - `pnpm --dir tests exec vitest run --project layer1 layer1/upgrade-alignment-pages.test.ts`
  - `git diff --check`

## Assumptions
- The button label should be exactly `Compile Responses`.
- The YAML field shapes for gate answers and `section_feedback` should remain backward-compatible; this is a UI/convention consolidation, not a schema rewrite.
- “Compile responses” replaces the bottom dual-button model, while local section feedback compile remains available only after a section feedback button is selected.
- Because this changes tracked files, implementation should also update `tasks/roadmap.md` and `tasks/todo.md`, then commit and push when validation passes, following the repo’s normal shipping rule.
