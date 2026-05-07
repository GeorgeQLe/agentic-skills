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
- [x] Step 32.2: Add generated skill catalog data.
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
- [x] Step 32.3: Add generated GitHub/open-source proof data.
  - Files: add `scripts/generate-skills-showcase-github-data.mjs`, add generated `docs/skills-showcase/assets/github-proof-data.js`
  - Implementation plan:
    - Write a dependency-free Node.js generator that produces `window.SKILLS_SHOWCASE_GITHUB_PROOF_DATA` for static use by the Inspect page.
    - Use public/local evidence only: repository URL from `git remote get-url origin`, current branch/HEAD commit from local git, tracked proof artifact paths such as `tasks/history.md` and validation scripts, and optional public GitHub metadata only when unauthenticated network access is available without secrets.
    - Degrade honestly when public GitHub metadata cannot be refreshed by writing fallback fields with `status`, `reason`, and local evidence instead of failing or inventing metrics.
    - Keep output deterministic for unchanged local sources by using Git commit timestamps/fingerprints rather than wall-clock timestamps where possible.
    - Do not add secrets, analytics, a runtime API, a database, GitHub Actions, or dependencies.
  - Verification plan:
    - Run `node scripts/generate-skills-showcase-github-data.mjs`.
    - Run a targeted Node check confirming the browser global, repository evidence, local commit evidence, proof artifact links, and fallback status fields exist.
    - Run `git diff --check`.
- [ ] Step 32.4: Add stale-data validation and tests.
  - Files: add `scripts/validate-skills-showcase-data.sh`, add `tests/layer1/skills-showcase-data.test.ts` if script-level coverage is needed
  - Implementation plan:
    - Add `scripts/validate-skills-showcase-data.sh` as the canonical freshness gate for the static showcase generated assets.
    - Make the validator rerun `node scripts/generate-skills-showcase-data.mjs` and `node scripts/generate-skills-showcase-github-data.mjs`, then fail if either committed generated asset changes.
    - Keep the script dependency-light and POSIX/Bash compatible with existing repository script style; do not install dependencies or mutate shared lockfiles.
    - Add focused layer1 coverage only if script-level behavior needs a fixture; otherwise use direct shell validation plus idempotence checks to avoid unnecessary test scaffolding.
    - Include clear failure output telling the operator to rerun both generators and commit the generated files.
  - Verification plan:
    - Run `bash -n scripts/validate-skills-showcase-data.sh`.
    - Run `scripts/validate-skills-showcase-data.sh`.
    - Run targeted checks confirming the validator references both generator scripts and both generated assets.
    - Run `git diff --check`.
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

#### 2026-05-07 - Targeted Skill Builder: Spec Interview Checkpoint Fix

- **User goal:** Update the mirrored `spec-interview` contracts so `$spec-interview` behaves like an interview-first workflow instead of stopping at a blocking assumptions manifest.
- **Changed files:** `global/codex/spec-interview/SKILL.md`, `global/claude/spec-interview/SKILL.md`, `tasks/todo.md`.
- **Decision:** Existing-skill update. The verified issue was a contract gap in `spec-interview`, not a missing new skill or a random local execution drift.
- **Evidence used:** User-provided session-triage verdict; `tasks/lessons.md`; current Codex and Claude `spec-interview` contracts; targeted `rg` search for blocking manifest language.
- **Evidence intentionally skipped:** Broad session-history scanning, because the correction was already verified and the target skill paths were explicit.
- **Overlap findings:** Existing `spec-interview` owns the workflow; no new skill is needed. Nearby interview skills also contain assumption checkpoints, but this fix intentionally changes only the verified failing contract.
- **Validation results:** `./install.sh` passed; `./scripts/skill-deps.sh --broken` passed; `./scripts/skill-versions.sh --missing` passed; `./scripts/skill-next-step-routing.sh --missing` passed; targeted `rg` confirmed no blocking manifest language remains in either spec-interview contract; `node scripts/generate-skills-showcase-data.mjs` and `node scripts/generate-skills-showcase-github-data.mjs` passed; `git diff --check` passed. `scripts/validate-skills-showcase-data.sh` could not run because Step 32.4 has not added that planned script yet.

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

#### 2026-05-07 - Step 32.2 Ship Manifest

- **User goal:** Execute `$run` for the next incomplete Phase 32 step by adding generated skill catalog data for the static showcase.
- **Changed files:** `scripts/generate-skills-showcase-data.mjs`, `docs/skills-showcase/assets/skills-data.js`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The generator scans tracked global and pack skill sources, parses frontmatter, derives catalog metadata, pack summaries, and a source fingerprint; the generated browser data file commits the static catalog payload for Vercel; task/history docs record completion, validation, and the next executable plan.
- **User-goal mapping:** Step 32.2 requires generated data covering every tracked source skill under `global/` and `packs/`; the generator uses `git ls-files` for the tracked source boundary and generated `312` skills across `16` packs from `327` source inputs.
- **Tests run:** `node scripts/generate-skills-showcase-data.mjs` passed; `node --check scripts/generate-skills-showcase-data.mjs` passed; targeted Node data-shape check confirmed `window.SKILLS_SHOWCASE_DATA`, `sourceFingerprint`, `generatedAt`, `global/codex/run/SKILL.md`, `$run`, pack-scoped monorepo records, and mirrored monorepo pack platforms; idempotence check `node scripts/generate-skills-showcase-data.mjs && git diff --exit-code -- docs/skills-showcase/assets/skills-data.js` passed; `git diff --check` passed.
- **Skipped tests:** Full stale-data validator was not run because Step 32.4 has not added `scripts/validate-skills-showcase-data.sh` yet. Browser catalog rendering against generated data was not run because Step 32.2 only commits the generated payload; wiring the UI to consume it belongs to the later experience phase.
- **Adversarial review:** Self-review found and fixed an unstable wall-clock `generatedAt` value that would have made future freshness checks noisy; the final generator derives `generatedAt` from the latest Git commit timestamp for tracked source inputs and uses a content fingerprint for stale-data detection. Review also checked that no dependency, secret, runtime API, database, GitHub Actions, or invented skill metadata was introduced.
- **Residual risk:** The frontmatter parser intentionally supports simple scalar fields only; this matches current skill metadata but would need expansion if future `SKILL.md` frontmatter adopts nested YAML. Step 32.4 should encode stale-data validation against this exact generator contract.
- **Rollback note:** Revert the Step 32.2 commit to remove the generator, generated `skills-data.js`, and task/history bookkeeping.
- **Next command:** `$run`

#### 2026-05-07 - Step 32.3 Ship Manifest

- **User goal:** Execute `$run` for the next incomplete Phase 32 step by adding generated GitHub/open-source proof data for the static showcase.
- **Changed files:** `scripts/generate-skills-showcase-github-data.mjs`, `docs/skills-showcase/assets/github-proof-data.js`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The generator writes static browser proof data from local/public repository evidence; the generated asset commits proof artifacts, validation script references, local HEAD metadata, public GitHub status, and honest boundaries; task/history docs record completion, validation, and the next Step 32.4 plan.
- **User-goal mapping:** Step 32.3 requires committed proof data or an honest fallback without secrets; the generator records local git evidence, tracked proof artifacts, validation scripts, and fallback status when public GitHub metadata is unavailable.
- **Tests run:** `node scripts/generate-skills-showcase-github-data.mjs` passed; `node --check scripts/generate-skills-showcase-github-data.mjs` passed; targeted Node data-shape check confirmed `window.SKILLS_SHOWCASE_GITHUB_PROOF_DATA`, repository HEAD evidence, `tasks/history.md`, validation command references, public GitHub `refreshed`/`fallback` status, and boundary language; targeted `rg` proof scan passed; idempotence check `node scripts/generate-skills-showcase-github-data.mjs && git diff --exit-code -- docs/skills-showcase/assets/github-proof-data.js` passed; `git diff --check` passed.
- **Skipped tests:** Network-backed GitHub metadata was not required for success because the contract explicitly requires honest fallback behavior without secrets. Full stale-data validation was not run because Step 32.4 adds the validator.
- **Adversarial review:** Self-review checked that the generator does not require credentials, does not fail when public GitHub metadata cannot refresh, does not claim live LexCorp metrics or analytics, and does not add dependencies, a runtime API, a database, or GitHub Actions.
- **Residual risk:** Public GitHub metadata may remain in fallback status in restricted environments; the static proof surface still has local commit and artifact evidence, and Step 32.4 should protect both generated assets from stale commits.
- **Rollback note:** Revert the Step 32.3 commit to remove the proof generator, generated proof asset, and task/history bookkeeping.
- **Next command:** `$run`

## Next Work

Start Step 32.4 by adding stale-data validation for the generated showcase data.

**Recommended next command:** `$run`
