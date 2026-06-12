---
skill: user-flow-map
agent: codex
captured_at: 2026-06-12T09:49:18-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Alignment-First Plan For `skill-execution-handoff`

## Summary

Create the `user-flow-map` deliverables in an approval-gated sequence: first build `alignment/user-flow-map-skill-execution-handoff.html` in `review` state, with the complete proposed spec, interview log, and evidence context rendered inline. Only after user approval via final compiled response YAML should the canonical markdown files be written and the page converted to `confirmed`.

Use the clarified persona wording:

> Personas covered: a new evaluator choosing a GSkillPacks deck for adoption, and an existing user configuring another repo. Their shared goal is to leave the site with a clear command or config they can run locally.

## Evidence To Include

- Active product path: `skills-showcase` from `research/.progress.yaml`.
- Product basis: `research/skills-showcase/idea-brief.md`.
- Upstream flow: `specs/skills-showcase/user-flow-deck-creation.md` and its interview log.
- Locked UX decisions: `apps/skills-showcase/docs/deck-builder-ux.md`.
- Deck/install model: `docs/decks.md` and deck output expectations.
- Execution/handoff model: `docs/operating-modes.md`, especially direct execution, hybrid `/delegate`, async `/handoff --target=codex`, approval packet lifecycle, stale packet behavior, and `jq` prerequisite.
- Current app surface: `/workflows` and the Production workflow in `apps/skills-showcase/src/showcase/tui/workflow-data.ts`.
- Confirmed checkpoints from this conversation: assumptions confirmed as-is, coverage reviewed, and corrected persona wording.

## Key Changes

- Build only the review alignment page first.
- The page must fully render the proposed content for:
  - `specs/skills-showcase/user-flow-skill-execution-handoff.md`
  - `specs/skills-showcase/user-flow-skill-execution-handoff-interview.md`
- Do not write the spec or interview log while the alignment page is still in `review`.
- Include gates for evidence coverage, assumptions, flow map approval, branch/state/handoff coverage, artifact destination, proposed file changes, and downstream route.
- Maintain `alignment/index.html` with the new review page entry.

## Approval Flow

- If the user provides partial response YAML, section feedback, `needs-clarification`, or negative feedback:
  - archive the current review page,
  - revise the alignment page,
  - visibly mark changed sections,
  - keep the page in `review`.
- If the user provides final compiled YAML with `approval_status: ready-for-agent-review` and no unresolved negative feedback:
  - apply approved edits,
  - write the canonical spec and interview log,
  - convert the alignment page to `confirmed`,
  - preserve the approval record in the page.

## Test Plan

- Run `node scripts/audit-alignment-pages.mjs`.
- Run `git diff --check`.
- Verify the review page contains the proposed spec/interview/evidence inline, not as iframe/object/embed or link-only content.
- Verify the confirmed page removes active controls and records confirmed artifact paths.
- Verify no existing `specs/skills-showcase/user-flow-deck-creation*` files are modified.

## Assumptions

- Product path remains `skills-showcase`.
- Existing deck-creation flow is upstream evidence only.
- No implementation code, CLI behavior, GitHub Actions, or visual design changes are part of this task.
- Downstream route after approval is `$ui-interview --requirements-only skill-execution-handoff`.
