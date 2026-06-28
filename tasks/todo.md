# Current Task State

## Status

Active implementation: none.

Project: `agentic-skills`.
Last completed task: Close Design-Tree Surface Terminology Gaps.

Completed implementation records live in `tasks/history.md`, `tasks/reconciliation-report.md`, commit history, and ship manifests.

## Review - Close Design-Tree Surface Terminology Gaps

### Goal

Close generated-artifact and downstream-contract gaps from commit `00503b7e0` so package metadata, flow-tree schema guidance, and downstream product-design consumers agree with surface/channel terminology and the `logic-wiring` route step.

### Results

- Updated mirrored `user-flow-map` contracts to v1.8 with `schema_version: v0.4`, `logic-wiring` route step 4, and build-plan handoffs to `logic-wiring`.
- Updated mirrored `state-model` contracts to v0.10 so the documented locked route tuple uses `logic-wiring` while `state-model` remains off-route.
- Updated mirrored `logic-wiring` contracts to v0.21 so it consumes upstream surfaces/channels, visual UI candidates, route/screen realizations, and non-visual channel behavior.
- Updated mirrored `spec-interview` contracts to v0.18 so production specs consume surface/channel and route/screen evidence instead of screen order alone.
- Archived prior active versions for all changed mirrors.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` and Skills Showcase generated data.
- Refreshed project-local skill installs; no tracked install-copy diff remained.

### Verification

Passed:

- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `npm --workspace packages/skillpacks run build:check`
- `scripts/skill-mirror-parity-audit.sh --verbose`
- `scripts/skill-archive-audit.sh`
- `scripts/pack.sh doctor`
- `pnpm --dir apps/skills-showcase build`
- targeted stale active-route/schema scans
- targeted screen-only upstream-consumer scan
- manifest version/archive spot check
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`

Ship manifest: `tasks/ship-manifest-2026-06-27-close-design-tree-surface-terminology-gaps.md`.
