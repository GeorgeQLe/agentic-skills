# Active Phase: Phase 32 - Skills Showcase Product Foundation

**Project:** Claude Skills / agentic-skills
**Current phase:** Phase 32 of 34
**Status:** Active as of 2026-05-07.

## Phase 32: Skills Showcase Product Foundation
> Test strategy: tests-after

### Goal

Establish the static product foundation for the showcase: multi-page routing, shared blueprint visual system, generated source data, generated GitHub/open-source proof data, and the freshness contract that makes future skill changes update the website when relevant.

### Scope

- Scaffold `docs/skills-showcase/` as a multi-page static website with direct-reloadable routes for home, workflows, packs, catalog, inspect, and follow.
- Add shared HTML/CSS/JS foundations for the Swiss grid and blueprint motif without introducing a runtime framework or root dependency requirement.
- Add generated skill catalog data from every tracked `SKILL.md` under `global/` and `packs/`.
- Add generated GitHub/open-source proof data from public GitHub/local git evidence with deterministic fallback behavior.
- Add validation that fails when generated showcase data is stale after source changes.
- Update skill-changing workflow contracts so agents regenerate the site data and review curated showcase copy/animations when skill behavior changes.

### Acceptance Criteria

- [ ] Static route entrypoints exist for `/`, `/workflows/`, `/packs/`, `/catalog/`, `/inspect/`, and `/follow/`.
- [ ] Shared styles and scripts provide the responsive Swiss grid/blueprint foundation without one-off page styling.
- [ ] `scripts/generate-skills-showcase-data.mjs` writes committed generated data covering every tracked source skill.
- [ ] `scripts/generate-skills-showcase-github-data.mjs` writes committed proof data or an honest fallback without requiring secrets.
- [ ] `scripts/validate-skills-showcase-data.sh` fails when generated showcase data is stale.
- [ ] Skill-changing contracts prompt regeneration and curated website review when `SKILL.md` behavior or metadata changes.
- [ ] Focused validation passes without adding a database, video, Remotion, runtime API, GitHub Actions, or unnecessary root dependencies.

### Execution Profile

**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** data contract, static-route behavior, skill-contract consistency, validation freshness

**Subagent lanes:** none

### Implementation

- [ ] Step 32.1: Scaffold the multi-page static shell and shared blueprint foundation.
  - Files: add `docs/skills-showcase/index.html`, `docs/skills-showcase/workflows/index.html`, `docs/skills-showcase/packs/index.html`, `docs/skills-showcase/catalog/index.html`, `docs/skills-showcase/inspect/index.html`, `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/styles.css`, `docs/skills-showcase/app.js`
- [ ] Step 32.2: Add generated skill catalog data.
  - Files: add `scripts/generate-skills-showcase-data.mjs`, add generated `docs/skills-showcase/assets/skills-data.js`
- [ ] Step 32.3: Add generated GitHub/open-source proof data.
  - Files: add `scripts/generate-skills-showcase-github-data.mjs`, add generated `docs/skills-showcase/assets/github-proof-data.js`
- [ ] Step 32.4: Add stale-data validation and tests.
  - Files: add `scripts/validate-skills-showcase-data.sh`, add `tests/layer1/skills-showcase-data.test.ts` if script-level coverage is needed
- [ ] Step 32.5: Update skill mutation contracts to maintain the website after skill changes.
  - Files: modify `global/codex/create-agentic-skill/SKILL.md`, `global/claude/create-agentic-skill/SKILL.md`, `global/codex/targeted-skill-builder/SKILL.md`, `global/claude/targeted-skill-builder/SKILL.md`, `global/codex/run/SKILL.md`, `global/claude/run/SKILL.md`, `global/codex/ship/SKILL.md`, `global/claude/ship/SKILL.md`, `docs/skills-reference.md`
- [ ] Step 32.6: Validate and record the phase.
  - Files: modify `tasks/todo.md`, `tasks/history.md`

### Green / Verification

- [ ] Run `node scripts/generate-skills-showcase-data.mjs`.
- [ ] Run `node scripts/generate-skills-showcase-github-data.mjs`.
- [ ] Run `scripts/validate-skills-showcase-data.sh`.
- [ ] Run `./scripts/skill-deps.sh --broken`.
- [ ] Run `./scripts/skill-versions.sh --missing`.
- [ ] Run `./scripts/skill-next-step-routing.sh --missing`.
- [ ] Run `./scripts/skill-pack-routing-audit.sh`.
- [ ] Run focused tests for any added generator or validator coverage.
- [ ] Run `git diff --check`.

### Manual Tasks

No manual tasks block Phase 32. Vercel deployment and newsletter provider setup are planned for Phase 34 after source implementation and local validation.

### Review

Not started.

## Next Work

Start Step 32.1 by scaffolding the multi-page static shell and shared blueprint foundation under `docs/skills-showcase/`.

**Recommended next command:** `$run`
