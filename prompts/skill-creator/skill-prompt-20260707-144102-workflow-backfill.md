---
skill: skill-creator
agent: codex
captured_at: 2026-07-07T14:41:02-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Canary Artifact Backfill Orchestrator

## Summary
Create a new canary skill, tentatively `$workflow-backfill`, focused on deterministic artifact backfill after a canary skill refresh. It will not write canonical research/prototype deliverables. It will scan a target repo, identify stale installed skill copies and missing canary review artifacts, present an approval-gated plan, then backfill only safe artifacts such as briefing decks, alignment indexes, and audit fixes.

## Key Changes
- Add a canary base/admin skill that:
  - verifies installed skill markers against npm/source lane and reports stale `source_package`, `source_version`, and missing dependency skills;
  - scans `alignment/*.html` and `interrogation/*.html` for pages whose owning skill requires `briefing-slides` but lack `briefing-slides/<owner-topic>.html`;
  - detects pending canonical research/prototype gates and routes them back to the owning skill instead of writing canonical files;
  - builds an alignment-gated backfill plan before mutation.
- Approved execution may:
  - run the appropriate skill refresh command;
  - create missing briefing slide decks from existing dense pages using the briefing slide convention/template;
  - update alignment/briefing indexes where the repo convention requires it;
  - run relevant audits and report exact pass/fail status.
- Explicit non-goals:
  - no automatic canonical `research/*.md`, `design/*.md`, `specs/*.md`, or prototype implementation writes;
  - no bypass of review-state alignment/interrogation gates;
  - no broad research reconciliation beyond routing to `$reconcile-research`, `$research-amend`, or the producing skill.

## Test Plan
- Fixture repo with stale `journey-map v0.26` and missing deck: scan reports refresh needed and deck backfill candidate.
- Fixture with review-state synthesis page and missing canonical research: plan routes canonical write back to `$journey-map` and does not create `journey-map.md`.
- Fixture with existing deck: skill archives before replacement only when approved.
- Run canary package checks ensuring the new skill, `briefing-slides` dependencies, template, and audit script are present in the canary package and excluded/handled correctly for stable.
- Run focused audits: briefing slide audit, alignment index audit, manifest/package boundary tests.

## Assumptions
- The first version is canary-only and artifact-focused.
- `$afps-status` remains read-only.
- `$create-briefing-slides` remains the single-page deck authoring primitive; the new skill orchestrates discovery and approved batch use.
- Canonical research/prototype repair stays owned by the original producing workflow.
