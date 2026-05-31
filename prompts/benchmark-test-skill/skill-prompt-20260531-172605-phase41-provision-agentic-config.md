---
skill: benchmark-test-skill
agent: claude
captured_at: 2026-05-31T17:26:05
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Next step — Phase 41: re-benchmark `provision-agentic-config`

## Context

The `concept-brief → idea-brief` rename is **fully complete and shipped** this session
(all 6 phases: producer + routing doc + 8 consumers + test fixture; Phase 5 resolved as
coordinated mechanical sync; Phase 6 verification clean). The repo's **active phase** is
**Phase 41 — Remaining Skill Benchmark Result Coverage**. The next concrete step, per the
Priority Task Queue triage note, is to re-benchmark the next Tier 2 global skill that was
graded pre-fixture-remediation: **`provision-agentic-config`** (then `migrate`, `prototype`).

## What this step does (ONE skill)

Re-benchmark `provision-agentic-config` via the established `benchmark-test-skill` flow
(pack `agentic-skills-bench`, enabled), persist the run outputs under `tests/benchmarks/runs/`,
refresh benchmark coverage metadata, and update the graded-skill count.

The full self-contained implementation plan is in **`tasks/todo.md`** under the
"▶ NEXT STEP — Phase 41" block (scope, process, files affected, acceptance criteria).

## Note

This is a separate, **compute-spending** initiative from the just-finished rename — benchmark
runs consume real model budget. This approval gate is where you decide to spend it. You can also
redirect to a different queue item (e.g. `$analyze-sessions split-path product research workflow`)
or stop here, since the rename session's work is already fully shipped.

## Ship-one-step handoff

Implement only this step, validate it, then run `/ship` when done.
