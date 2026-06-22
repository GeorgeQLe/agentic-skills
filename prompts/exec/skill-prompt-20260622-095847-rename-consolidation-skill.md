---
skill: exec
agent: codex
captured_at: 2026-06-22T09:58:47-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Rename Consolidation Skill And Add AFPS Graduation

## Summary

Rename the primary skill from `consolidate-variations` to `consolidate-prototypes`, because its real job is converging evaluated prototype branches into one cohesive MVP for UAT approval and spec handoff. Add an AFPS graduation document produced at that handoff so a project has a durable marker that research/prototyping is complete and production planning can begin.

## Key Changes

- Add `consolidate-prototypes` as the primary product-design skill in both Claude and Codex skill roots.
- Keep `consolidate-variations` as a deprecated compatibility alias that routes to `consolidate-prototypes` for one transition period.
- Update product-design pack docs, routing docs, skill maps, and research-roadmap routes from:
  - `$consolidate-variations`
  - to `$consolidate-prototypes`
- Update the skill description and outputs to emphasize:
  - combining discrete built prototypes
  - resolving UAT findings into one MVP
  - producing a user-approved consolidated prototype
  - preparing the handoff into `$spec-interview`

## AFPS Graduation Document

- Add a required graduation artifact created by `consolidate-prototypes` after the consolidated MVP is approved.
- Output path:
  - flat mode: `design/afps-graduation-{topic}.md`
  - product-path mode: `design/{slug}/afps-graduation-{topic}.md`
- Graduation document contents:
  - project/product path
  - consolidated prototype path
  - source prototypes reviewed
  - UAT evidence used
  - final MVP decisions
  - rejected alternatives
  - unresolved risks or assumptions
  - stale research cleanup status
  - recommended next route: `$research-roadmap --post-prototype`, then `$spec-interview`
  - production readiness statement for exec-loop after spec approval

## Research Cleanup Behavior

- Keep `$research-roadmap --post-prototype` as the cleanup pass, but make it graduation-aware:
  - read the AFPS graduation document when present
  - queue only research that is contradicted, stale, or required before spec
  - avoid reloading or recommending broad research skills that are no longer immediately needed
- Update `$spec-interview` prototype gate to accept the graduation document as an explicit readiness signal, while still requiring:
  - consolidated prototype exists
  - post-prototype research cleanup has no unchecked blocking items

## Compatibility And Versioning

- Archive current `SKILL.md` files with `scripts/skill-archive.sh` before changing behavior.
- Bump `consolidate-prototypes` skill version from the inherited current version by one decimal.
- Add changelog entries for:
  - rename from `consolidate-variations`
  - graduation document output
  - updated post-prototype handoff
- Do not rewrite historical archive files except through the required archive step.

## Test Plan

- Run targeted `rg` checks to confirm active references route to `consolidate-prototypes`.
- Run existing skill parity/audit scripts that cover:
  - Claude/Codex mirror consistency
  - skill frontmatter validity
  - alignment page conventions
  - routing-map references
- Verify `research-roadmap --post-prototype` docs and `spec-interview` gates still describe a coherent sequence:
  `$prototype` → `$uat --variant-evaluation` → `$consolidate-prototypes` → `$research-roadmap --post-prototype` → `$spec-interview` → `$roadmap`/`$exec`.

## Assumptions

- `consolidate-prototypes` is the preferred final name.
- `consolidate-variations` should remain as a deprecated alias temporarily to avoid breaking existing task docs and user muscle memory.
- The AFPS graduation document belongs in `design/`, because it closes the design/prototype phase and precedes canonical production specs in `specs/`.
- Research skills should not be removed from packs; they should be de-emphasized by routing and context cleanup once graduation marks them non-immediate.

The visible follow-up invocation pasted the active `exec` skill contract from `/Users/georgele/projects/tools/agentic-skills/.codex/skills/exec/SKILL.md` and requested execution under that contract.
