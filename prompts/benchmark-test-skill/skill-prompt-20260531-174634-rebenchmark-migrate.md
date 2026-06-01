---
skill: benchmark-test-skill
agent: claude
captured_at: 2026-05-31T17:46:34-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Next step — Phase 41: re-benchmark `migrate`

## Context

`provision-agentic-config` was re-benchmarked clean this session (Claude 100% / Codex 67%) and shipped to `master`. The Phase 41 next-target pointer now names **`migrate`**, then `prototype` — Tier 2 global skills graded pre-fixture-remediation with near-zero pass rates. The prior `migrate` report (`benchmark/test-migrate-2026-05-21.md`) shows 0% Claude + 3/3 Codex infra-blocked, the exact pre-fixture signature this clean re-run should clear.

The full self-contained implementation plan is in `tasks/todo.md` under the "▶ NEXT STEP — Phase 41: re-benchmark `migrate`" block (eligibility/fixture preflight, the out-of-scope `skill-dev` layer1 note, the stage-report-before-regenerate gotcha, validation gates, and the route-to-`/session-triage` caveat if the clean re-run is still a real non-infra failure).

## Note

This is a compute-spending step (~$6 in real model budget). This approval gate is where you decide to spend it. You can also redirect to another queue item (e.g. `$analyze-sessions split-path product research workflow`) or stop here — all prior work is shipped.

## Ship-one-step handoff

Implement only this step, validate it, then run `/ship` when done.
