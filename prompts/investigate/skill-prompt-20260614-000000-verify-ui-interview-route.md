---
skill: investigate
agent: codex
captured_at: 2026-06-13T23:15:45-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Implemented and pushed in eafc34ae.

  What changed:

  - Added user-flow-map --prototype-build-plan [topic] as the synthesis step after ui-interview.
  - It writes design/prototype-build-plan-[topic].md as the explicit todo ledger for prototype.
  - Extended design/flow-tree.schema.json with prototype_build_plan.items[].
  - Added build statuses: pending, built, needs-revision, deferred, dropped.
  - Updated prototype to require/read that build plan, skip deferred/dropped items, and update the build-plan/flow-tree ledger after builds.
  - Updated route docs to include:
    ui-interview -> user-flow-map --prototype-build-plan -> prototype Can you verify that the skill is able to route users to run the synthesis step after the last ui-interview?
