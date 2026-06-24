---
skill: exec
agent: codex
captured_at: 2026-06-24T10:39:55-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Plan: Clarify Alignment Review YAML Handoffs

## Summary
Update the alignment-page routing docs so agents give users explicit next-step instructions after an HTML alignment page is ready for review: review the page, compile YAML, then continue in the producing skill context. The rule should distinguish feedback/revision YAML from final approval YAML, and avoid recommending another context clear when YAML is already being consumed in a fresh session.

## Key Changes
- Update the canonical alignment convention in `docs/alignment-page-convention.md`:
  - In `Pre-approval stop`, add explicit handoff wording: ask the user to review the HTML page, compile either local section-feedback YAML or bottom response YAML, then paste it into the producing skill/session route.
  - Clarify that `approval_status: not-approved`, `feedback_status: revision-request`, or partial YAML routes back to feedback handling, investigation, amendment, and renewed review.
  - Keep downstream routing blocked until approved artifacts are written and the page is confirmed.
  - Preserve the existing fresh-session rule: if the user already cleared context and pasted YAML, do not ask for another clear; route directly through the current skill’s YAML handling.

- Update `base/{codex,claude}/create-alignment-page/SKILL.md` handoff language:
  - Replace the generic “return section-feedback YAML or bottom compiled response YAML” instruction with a concrete user-facing handoff.
  - Include platform-specific command phrasing: Codex uses `$<producing-skill> ...`; Claude uses `/<producing-skill> ...`.
  - State that section-feedback or not-approved YAML requests review/revision, while final ready-for-agent-review YAML authorizes artifact confirmation.
  - Because this changes skill behavior, archive each current `SKILL.md` with `scripts/skill-archive.sh` and bump `version: v0.1` to `v0.2`; update each `CHANGELOG.md`.

- Regenerate generated alignment bundles:
  - Run `node scripts/upgrade-alignment-page.mjs` after the canonical convention edit.
  - Do not hand-edit generated `ALIGNMENT-PAGE.md` files.
  - Expect many generated bundle diffs because the canonical convention is propagated.

- Update enforcement tests:
  - Extend `tests/layer1/alignment-gates.test.ts` to assert generated bundles include the new handoff rule.
  - Add or extend a focused test for `create-alignment-page` to assert both Codex and Claude skills contain the explicit review/compile/paste handoff.
  - Keep existing Pattern A tests unchanged unless a wording assertion needs a narrow update; Pattern A’s `## Invoke With YAML` exception should remain intact.

## Test Plan
- Run `node scripts/upgrade-alignment-page.mjs --check`.
- Run `node scripts/skill-alignment-routing-audit.mjs --report`.
- Run `scripts/skill-research-loop-handoff-audit.sh`.
- Run focused tests with the available Vitest binary:
  - `apps/skills-showcase/node_modules/.bin/vitest run tests/layer1/alignment-gates.test.ts tests/layer1/skill-alignment-routing-audit.test.ts tests/layer1/afps-alignment-preview-gates.test.ts --root .`
- Run `git diff --check`.

## Assumptions
- The intended change is documentation/contract only, not runtime YAML parsing.
- The producing skill invocation can be described generically as the skill that created the page; Pattern A pages continue to use their existing `## Invoke With YAML` parent-orchestrator route.
- Implementation should follow repo rules: update task docs before mutation, archive/bump changed skills, commit and push intended tracked changes when done.
