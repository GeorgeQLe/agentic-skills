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

- [x] Step 32.1: Scaffold the multi-page static shell and shared blueprint foundation.
  - Files: add `docs/skills-showcase/index.html`, `docs/skills-showcase/workflows/index.html`, `docs/skills-showcase/packs/index.html`, `docs/skills-showcase/catalog/index.html`, `docs/skills-showcase/inspect/index.html`, `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/styles.css`, `docs/skills-showcase/app.js`
- [ ] Step 32.2: Add generated skill catalog data.
  - Files: add `scripts/generate-skills-showcase-data.mjs`, add generated `docs/skills-showcase/assets/skills-data.js`
  - Implementation plan:
    - Write a dependency-free Node.js generator that scans tracked source skill files under `global/*/*/SKILL.md` and `packs/*/{claude,codex}/*/SKILL.md`, plus `packs/*/PACK.md` when present.
    - Parse frontmatter fields `name`, `description`, `type`, `version`, and `argument-hint`; derive `platform`, `scope`, `pack`, `command`, `mirrorKey`, `id`, and relative source `path` from the file path.
    - Generate deterministic `window.SKILLS_SHOWCASE_DATA` in `docs/skills-showcase/assets/skills-data.js` with `generatedAt`, `sourceFingerprint`, `skills`, `packs`, and an empty `workflows` array reserved for curated UI data.
    - Use stable sorting by path/name and a content fingerprint from source paths plus contents so later stale-data validation can detect missed regeneration.
    - Keep missing optional metadata honest: preserve blank/null fields rather than inventing claims, and avoid installing dependencies or adding a root build step.
  - Verification plan:
    - Run `node scripts/generate-skills-showcase-data.mjs`.
    - Run a targeted Node check or `rg` scan confirming `window.SKILLS_SHOWCASE_DATA`, at least one global skill, at least one pack skill, pack summaries, and `sourceFingerprint` exist.
    - Run `git diff --check`.
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

#### 2026-05-07 - Step 32.1 Ship Manifest

- **User goal:** Execute `$run` for the next incomplete Phase 32 step by scaffolding the multi-page static shell and shared blueprint foundation.
- **Changed files:** `docs/skills-showcase/index.html`, `docs/skills-showcase/workflows/index.html`, `docs/skills-showcase/packs/index.html`, `docs/skills-showcase/catalog/index.html`, `docs/skills-showcase/inspect/index.html`, `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/styles.css`, `docs/skills-showcase/app.js`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** Home route establishes the first-viewport hero, CTA, blueprint state machine, and route previews; route entrypoints establish direct-reloadable static pages for workflows, packs, catalog, inspect, and follow; shared CSS centralizes the responsive Swiss grid/blueprint visual system; shared JS centralizes mobile navigation, workflow selector behavior, and catalog sample filtering; task/history docs record completion and next work.
- **User-goal mapping:** The six HTML entrypoints satisfy the static route foundation; `styles.css` and `app.js` satisfy the shared blueprint foundation without a runtime framework or root dependency; task docs keep `$run` progress and handoff state current.
- **Tests run:** `node --check docs/skills-showcase/app.js` passed; route file presence check for all six HTML entrypoints plus shared CSS/JS passed; `git diff --check` passed; targeted `rg` review of route `href`/`src` and data hooks found the expected route references.
- **Skipped tests:** Full generated-data validation was not run because Steps 32.2-32.4 have not added the generators or stale-data validator yet. Browser screenshot QA was not run because Step 32.1 is a static foundation with no dev server requirement; the files can be opened directly, and Phase 33 owns the richer responsive/animation experience.
- **Adversarial review:** Diff-aware self-review checked that no dependency, database, runtime API, GitHub Actions, video, Remotion, or generated-data claim was introduced; corrected the nested Inspect proof link to target repository-level `tasks/history.md`; accepted that placeholder catalog/proof rows are temporary because later Phase 32 steps replace them with generated data.
- **Residual risk:** Visual polish and responsive edge cases have not had browser screenshot verification yet; the next UI-heavy Phase 33 work should run browser checks after interaction/animation content is implemented.
- **Rollback note:** Revert the Step 32.1 commit to remove the `docs/skills-showcase/` static shell and task/history bookkeeping.
- **Next command:** `$run`

## Next Work

Start Step 32.1 by scaffolding the multi-page static shell and shared blueprint foundation under `docs/skills-showcase/`.

**Recommended next command:** `$run`
