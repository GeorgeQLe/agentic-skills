# Current Task

> Project: Agentic Skills
> Current phase: 2

## Phase 2: Public Catalog Release-Lane Identity
> Test strategy: TDD

### Goal

Make stable-versus-canary identity explicit and testable on every public catalog skill record without changing any skill's lane or publishing a package.

### Scope

- Add additive item-level release-lane identity to the public catalog, sourced from canonical skill metadata.
- Keep the package manifest as the install authority and verify catalog/package projection parity.
- Regenerate public catalog artifacts and document the public shape where required.
- Exclude skill behavior changes, lane reassignment, publication, tags, dist-tags, deployment, and installed-consumer mutation.

### Execution Profile

**Parallel mode:** serial
**Accountability topology:** sol-terra
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, schema/API compatibility, generated-artifact freshness

**Subagent lanes:** none

### Implementation

- [ ] Step 2.1: Establish failing release-lane catalog assertions
  - Files: create `tests/layer1/skills-catalog-release-lane.test.ts`; extend focused package manifest/boundary tests only if projection parity is not already covered.
  - Prove every catalog skill requires a valid lane and that only the two `create-briefing-slides` mirrors are canary.
- [ ] Step 2.2: Generate additive item-level identity and lane counts
  - Files: `scripts/catalog/index.mjs`, `scripts/generate-skills-catalog-export.mjs`, and public schema/readme files that define the record shape.
  - Source identity from frontmatter with the canonical stable default; do not introduce a second lane registry.
- [ ] Step 2.3: Regenerate the public export boundary
  - Files: `exports/skills-catalog/v1/catalog.json`, `manifest.json`, and `proof.json`.
  - Confirm catalog projections and package manifest projections agree.
- [ ] Step 2.4: Validate compatibility and delivery evidence
  - Run focused catalog tests, manifest/package-boundary tests, stable and canary build checks, catalog freshness, task-doc audit, diff hygiene, secret scan, and fresh read-only review.

### Milestone: Public Discovery Cannot Hide Canary Identity

**Acceptance Criteria:**

- [ ] Every public catalog skill record has `release_lane: stable|canary`, derived from canonical metadata with stable as the documented default.
- [ ] Stable and canary projections agree across catalog and package generation; only the two `create-briefing-slides` mirrors are canary.
- [ ] The field is additive for existing consumers, and the package manifest remains the installation source of truth.
- [ ] Generated exports are current and focused tests reject missing, invalid, or leaked identity.
- [ ] No publish, tag, dist-tag, deployment, lane reassignment, or installed-consumer mutation occurs.

**On Completion**

- Deviations from plan: pending
- Tech debt / follow-ups: `sync` safety migration and workflow-family AFPS 2.0 migrations remain separately bounded follow-ups.
- Ready for next phase: no
