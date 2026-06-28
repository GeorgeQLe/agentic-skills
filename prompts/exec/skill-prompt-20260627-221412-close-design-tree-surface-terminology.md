---
skill: exec
agent: codex
captured_at: 2026-06-27T22:14:12-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Close Design-Tree Surface Terminology Gaps

## Summary

Fix the remaining generated-artifact and downstream-contract gaps from commit `00503b7e0` so package metadata, flow-tree schema guidance, and downstream design-tree consumers agree with the new surface/channel terminology.

## Key Changes

- Regenerate `packages/skillpacks/dist/skillpacks-manifest.json` so `user-flow-map` reports v1.7, `ui-interview` reports v0.29, content hashes update, and new archives appear in `archive_versions`.
- Update Claude and Codex `user-flow-map` active contracts to initialize `schema_version: v0.4` and route through `logic-wiring`, not `prototype`.
- Keep `prototype_build_plan` terminology where it names the artifact, but route build-plan handoffs to `logic-wiring` as the runnable prototype owner.
- Update Claude and Codex `logic-wiring` and `spec-interview` wording to consume upstream surfaces/channels, visual UI candidates, and route/screen realizations instead of “screen order” as the only flow shape.
- Add changelog entries and archives only for skills whose active `SKILL.md` behavior changes.

## Test Plan

- `npm --workspace packages/skillpacks run build:check`
- `scripts/skill-mirror-parity-audit.sh --verbose`
- `scripts/skill-archive-audit.sh`
- `scripts/pack.sh doctor`
- targeted `rg` for stale active route/schema wording: `schema_version: v0.3`, `prototype, consolidate-prototypes`, and screen-only upstream-consumer wording
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Assumptions

- Historical changelog/archive wording can remain historical unless it describes current behavior.
- `build-ui-screens` and schema fields like per-screen build ledger can stay screen-specific because they operate after `ui-interview` has selected visual UI screens.
