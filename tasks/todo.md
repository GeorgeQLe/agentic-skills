# Current Task State

## Current Implementation - Publish Readiness Skill Audit

**Status:** Complete - publish is blocked on npm authentication.

Project: `agentic-skills`.

### Goal

Audit the active skill library and package release surface so the next `skillpacks` / `@glexcorp/gskp` version can be published with confidence. This is a readiness audit, not a real publish or tag operation.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits and release-boundary verification.
- Reason: skill source, generated bundles, package manifests, catalog exports, and publish dry-runs share one release boundary and must stay synchronized.
- Safety boundary: do not run a real `./publish.sh patch`, create npm tags, or publish packages without explicit user approval. Do not revert unrelated work if a concurrent session changes the tree.

### Plan

- [x] Capture the visible `$expert-review` invocation prompt and promote this audit into task tracking.
- [x] Map active skill/package structure, release runbook gates, generated bundle expectations, and current git/registry version state.
- [x] Run skill integrity and routing audits for active source skills.
- [x] Run package build/check, catalog export validation, and package-boundary dry run.
- [x] Fix narrow readiness blockers discovered by verification, if any, then rerun affected checks.
- [x] Produce a durable audit report/alignment page and document results here.
- [x] Commit intended changes, then run strict `./publish.sh --dry-run patch` from the clean post-commit tree.
- [x] Record the npm-auth publish blocker and prepare the completed audit commit for push.

### Acceptance Criteria

- [x] Active `SKILL.md` files have required version metadata and generated convention bundles are current.
- [x] Claude/Codex mirrors, skill dependencies, pack routing, archives, and catalog exports pass the repo's release gates.
- [x] The actual npm publish target excludes denied repo-only paths and includes required runtime assets.
- [x] Local package version and registry state identify the correct next publish path without partial-publish ambiguity.
- [x] `./publish.sh --dry-run ...` completes for the resolved target, or any blocker is documented with an exact remediation.
- [x] Final handoff is ready to be based on a fresh `git status --short --branch` and to state whether the repo is ready to publish now.

### Test Plan

- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/base-skill-version-parity-audit.sh`
- `scripts/skill-deps.sh --broken`
- `scripts/skill-mirror-parity-audit.sh`
- `scripts/skill-pack-routing-audit.sh`
- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/upgrade-interrogation-page.mjs --check`
- `npm --workspace packages/skillpacks run test:node`
- `npm --workspace packages/skillpacks run build:check`
- `scripts/validate-skills-catalog-export.sh`
- `npm pack ./packages/skillpacks/build --dry-run --json --silent`
- `./publish.sh --dry-run patch` or `./publish.sh --dry-run --current`, depending on verified registry/source state.
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Review

Verified so far:

- Registry state: `npm view skillpacks version`, `npm view @glexcorp/gskp version`, and exact `0.1.17` lookups all returned `0.1.17`; next normal publish target is patch `0.1.18`.
- Fixed one readiness blocker: `scripts/skill-pack-routing-audit.sh` found four `session-triage` benchmark loop-closing recommendations that named `benchmark-test-skill` without the direct `agentic-skills-bench` install prerequisite nearby. Updated Claude and Codex mirrors, archived `v0.7`, bumped both to `v0.8`, and regenerated package/catalog metadata.
- Passed source gates: `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/base-skill-version-parity-audit.sh`, `scripts/skill-deps.sh --broken`, `scripts/skill-mirror-parity-audit.sh`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --check`, and `node scripts/upgrade-interrogation-page.mjs --check`.
- Passed package/catalog gates: `scripts/validate-skills-catalog-export.sh`, `npm --workspace packages/skillpacks run test:node` (175 tests), `npm --workspace packages/skillpacks run build:check`, and `npm pack ./packages/skillpacks/build --dry-run --json --silent`.
- Durable audit page: `alignment/expert-review-publish-readiness.html`; alignment audit passed with 61 active pages and 61 index entries.
- Strict publish dry run: `./publish.sh --dry-run patch` was run from the clean post-commit tree and failed in pre-bump npm auth preflight for `0.1.18` with `E401 Unauthorized` from `npm whoami`. The script left no version bump or publish state behind.

Publish blocker: log in to npm as the expected publisher (`glexcorp`) with `npm login --registry https://registry.npmjs.org/`, verify with `npm whoami --registry https://registry.npmjs.org/`, then rerun `./publish.sh --dry-run patch`.
