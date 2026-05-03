# YouTube Description Optimizer

**Project:** Claude Skills / agentic-skills
**Current phase:** 19 of 19
**Source roadmap:** `tasks/roadmap.md`
**Source spec:** User request on 2026-05-03

## Phase 19: YouTube Description Optimizer

**Goal:** Add a focused YouTube description and metadata optimization skill for existing videos, future uploads, and reusable series templates.

**Scope:**
- Add mirrored Claude/Codex `youtube-description-optimizer` skill definitions to the creator-media pack.
- Support audit, draft, and template modes.
- Cover first-two-lines promise support, search clarity, CTA/link hierarchy, chapters, hashtags, disclosures, pinned-comment fit, and rewritten description blocks.
- Wire creator-media docs and routing so description optimization sits between title/thumbnail audit and portfolio decisions.

**Acceptance Criteria:**
- [x] `youtube-description-optimizer` exists for both Claude and Codex.
- [x] The skill supports `audit`, `draft`, and `template` modes with explicit output paths.
- [x] The skill requires evidence coverage and forbids invented links, sponsors, disclosures, chapters, transcript details, comments, and owner-only metrics.
- [x] Creator-media docs/reference lists include `youtube-description-optimizer` in the packaging flow.
- [x] Creator-media next-skill routing includes `youtube-description-optimizer` between title/thumbnail audit and portfolio.
- [x] Validation passes with skill dependency/version checks, next-step routing audit, targeted mirrored-contract scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep this serial because it touches mirrored skills, shared creator-media routing, and public pack docs. Preserve any in-progress creator-media video-script/video-build routing work.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, docs/API conformance, routing, validation

**Subagent lanes:** none

### Implementation
- [x] Step 19.1: Add mirrored `youtube-description-optimizer` skill contracts.
  - Classification: automated
  - Files: `packs/creator-media/claude/youtube-description-optimizer/SKILL.md`, `packs/creator-media/codex/youtube-description-optimizer/SKILL.md`
- [x] Step 19.2: Wire creator-media docs and discovery references.
  - Classification: automated
  - Files: `packs/creator-media/PACK.md`, `README.md`, `docs/skills-reference.md`
- [x] Step 19.3: Align creator-media next-skill routing.
  - Classification: automated
  - Files: mirrored creator-media `SKILL.md` routing sections

### Green
- [x] Step 19.4: Run focused validation and record results.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run targeted contract/routing scans, mirrored diff normalization, skill dependency/version checks, next-step routing audit, and `git diff --check`.

### Milestone: YouTube Description Optimizer
**Acceptance Criteria:**
- [x] `youtube-description-optimizer` exists for both Claude and Codex.
- [x] The skill supports `audit`, `draft`, and `template` modes with explicit output paths.
- [x] The skill requires evidence coverage and forbids invented links, sponsors, disclosures, chapters, transcript details, comments, and owner-only metrics.
- [x] Creator-media docs/reference lists include `youtube-description-optimizer` in the packaging flow.
- [x] Creator-media next-skill routing includes `youtube-description-optimizer` between title/thumbnail audit and portfolio.
- [x] Validation passes with skill dependency/version checks, next-step routing audit, targeted mirrored-contract scans, and `git diff --check`.

**On Completion:**
- Deviations from plan: none.
- Tech debt / follow-ups: none.
- Ready for next phase: yes

---

### Review
- Step 19.1 complete: added mirrored `youtube-description-optimizer` skill contracts under `packs/creator-media/claude/` and `packs/creator-media/codex/`.
- Step 19.2 complete: updated creator-media pack docs and public discovery references to place description optimization between title/thumbnail audit and portfolio.
- Step 19.3 complete: updated mirrored creator-media routing lists and `youtube-video-audit` default routing so description/CTA/link/chapter/hashtag/disclosure issues route to the new skill.
- Validation:
  - `rg -n 'name: youtube-description-optimizer|version:|Invoke as|--mode audit\|draft\|template|description-optimizer-<video-id>|description-draft-<slug>|description-template-<slug>|Do not invent links|owner-only metrics|Evidence Coverage|Recommended next skill' packs/creator-media/claude/youtube-description-optimizer/SKILL.md packs/creator-media/codex/youtube-description-optimizer/SKILL.md` - passed; confirmed mirrored contract fields, modes, outputs, evidence coverage, and anti-fabrication language.
  - `rg -n 'youtube-title-thumbnail-audit -> youtube-description-optimizer -> youtube-portfolio|youtube-title-thumbnail-audit, youtube-description-optimizer, youtube-portfolio|packaging, descriptions, portfolio|description optimization' README.md docs/skills-reference.md packs/creator-media/PACK.md` - passed; confirmed docs expose the new flow.
  - `rg -n 'youtube-title-thumbnail-audit.*youtube-description-optimizer.*youtube-portfolio|Default recommendation:.*youtube-description-optimizer|description support, CTA/link structure' packs/creator-media -g 'SKILL.md'` - passed; confirmed routing placement and video-audit handoff language.
  - Normalized Claude/Codex `youtube-description-optimizer` command syntax and ran `diff -u /tmp/youtube-description-optimizer-claude-normalized.md /tmp/youtube-description-optimizer-codex-normalized.md` - passed; no output.
  - `/opt/homebrew/bin/bash ./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `/opt/homebrew/bin/bash ./scripts/skill-versions.sh --missing` - passed; `All 277 skills have a version field.`
  - `./scripts/skill-next-step-routing.sh --missing` - passed; `All 211 mutation-capable skills have next-step routing.`
  - `git diff --check` - passed; no output.

---

# Pack Lock Stale Recovery

**Project:** Claude Skills / agentic-skills
**Current phase:** 18 of 18
**Source roadmap:** `tasks/roadmap.md`
**Source spec:** User report from `pitwall-monorepo` `$pack refresh`

## Phase 18: Pack Lock Stale Recovery

**Goal:** Make pack lock failures diagnosable and recover automatically when a previous pack process left a stale lock behind.

**Scope:**
- Add owner metadata to `.agents/.pack.lock`.
- Remove stale locks automatically when the recorded owner PID is no longer running.
- Include lock owner details in timeout errors.
- Document the lock behavior in pack docs.

**Acceptance Criteria:**
- [x] `scripts/pack.sh` writes lock owner metadata and removes stale dead-PID locks.
- [x] Timeout errors report lock owner metadata.
- [x] Pack docs describe stale-lock behavior.
- [x] Focused smoke tests cover live-lock waiting and stale-lock recovery.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this is shared pack write coordination. Do not add dependencies or GitHub Actions.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Implementation
- [x] Step 18.1: Analyze session evidence and current lock state.
  - Classification: automated
  - Files: inspect only
  - Read full local Claude/Codex history and identify the failing `pitwall-monorepo` `$pack refresh` prompt.
  - Check current `pitwall-monorepo` lock state.
- [x] Step 18.2: Harden pack lock acquisition.
  - Classification: automated
  - Files: `scripts/pack.sh`
  - Write `pid`, `started_at`, and `command` into `.agents/.pack.lock`.
  - Remove stale locks when the recorded PID is not running.
  - Include owner metadata in timeout errors.
- [x] Step 18.3: Document lock behavior.
  - Classification: automated
  - Files: `global/claude/pack/SKILL.md`, `global/codex/pack/SKILL.md`, `README.md`, `docs/packs.md`

### Green
- [x] Step 18.4: Run focused validation and record results.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run shell syntax checks, stale-lock and live-lock smoke tests, skill dependency/version checks, and `git diff --check`.

### Milestone: Pack Lock Stale Recovery
**Acceptance Criteria:**
- [x] `scripts/pack.sh` writes lock owner metadata and removes stale dead-PID locks.
- [x] Timeout errors report lock owner metadata.
- [x] Pack docs describe stale-lock behavior.
- [x] Focused smoke tests cover live-lock waiting and stale-lock recovery.

**On Completion:**
- Deviations from plan: none.
- Tech debt / follow-ups: none.
- Ready for next phase: yes

---

### Review
- Session analysis:
  - Read 572,617 JSONL lines across 1,691 Claude/Codex history/session files.
  - Found the reported prompt in `~/.codex/history.jsonl` session `019df025-a516-74d3-9606-e67aa42d35f9`.
  - Current live check showed `/Users/georgele/projects/apps/pitwall-monorepo/.agents` exists and `.agents/.pack.lock` is absent.
  - Root risk: the previous pack lock had no owner metadata, so a timeout could not distinguish a live competing process from a stale lock or tell the user what held it.
- Step 18.2 complete: `scripts/pack.sh` now writes `pid`, `started_at`, and `command` files inside `.agents/.pack.lock`, removes stale locks whose recorded PID is no longer running, and includes owner metadata in timeout errors. `PACK_LOCK_MAX_ATTEMPTS` and `PACK_LOCK_SLEEP_SECONDS` allow fast lock-path tests.
- Step 18.3 complete: documented lock owner metadata and stale-lock cleanup in mirrored pack skills, `README.md`, and `docs/packs.md`.
- Step 18.4 validation:
  - `bash -n scripts/pack.sh` - passed.
  - Stale-lock smoke test - passed; lock with dead PID `999999` was removed, `refresh` completed, and devtool skill links were created.
  - Live-lock smoke test - passed; lock owned by the current shell PID timed out with `pid`, `started_at`, and `command` in the error.
  - `/opt/homebrew/bin/bash ./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `/opt/homebrew/bin/bash ./scripts/skill-versions.sh --missing` - passed; `All 271 skills have a version field.`
  - `git diff --check` - passed; no output.
- User claim validation:
  - Confirmed: a single repo-level `project_type` is too coarse for a repo containing both Pitwall Local / OSS devtool work and CalcLLM-powered SaaS/business-app work.
  - Confirmed: before this phase, `scripts/pack.sh` rewrote `.agents/project.json` from `project_type`, `enabled_packs`, `skill_pack_version`, and optional `agent_mode`, which would drop hand-authored mixed-monorepo metadata.
  - Confirmed direction: keep `devtool` as the coarse default for local/OSS developer tooling, enable both `devtool` and `business-app`, and use scoped routing for CalcLLM-connected paths.
- Step 17.2 complete: documented mixed-monorepo routing in mirrored Claude/Codex `pack` skills and public pack docs. The documented model keeps `project_type` as the default, `enabled_packs` as the repository-wide union, and `project_scopes[]` as path-scoped routing metadata.
- Step 17.3 complete: updated `scripts/pack.sh` so pack writes preserve existing `project_scopes` and `notes` fields when `jq` is available.
- Step 17.4 validation:
  - `bash -n scripts/pack.sh` - passed.
  - `/opt/homebrew/bin/bash ./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `/opt/homebrew/bin/bash ./scripts/skill-versions.sh --missing` - passed; `All 271 skills have a version field.`
  - `git diff --check` - passed; no output.
  - Temp-project smoke test for `scripts/pack.sh set-mode hybrid` - passed; `agent_mode`, `project_scopes[0].path`, and `notes.devtool` were all present after rewrite.
  - Temp-project smoke test for `scripts/pack.sh install business-app` - passed; `enabled_packs` contained both `devtool` and `business-app`, and existing `project_scopes` and `notes` survived.
  - Note: `./scripts/skill-deps.sh --broken` and `./scripts/skill-versions.sh --missing` fail under macOS `/bin/bash` because those existing scripts use associative arrays; validation used `/opt/homebrew/bin/bash`.
- Step 16.1 complete: added a mutation-capable contract audit and used its initial `--missing` output to identify gaps in default shipping-contract skills and kanban mutation wrappers.
- Step 16.2 complete: patched 139 default shipping-contract skill files with a `Default next-step routing` requirement, and patched 40 kanban mutation wrappers with a `## Next-Step Routing` section.
- Step 16.3 complete: added `scripts/skill-next-step-routing.sh` with `--missing` and `--list` modes. The audit scans `global/` and `packs/` `SKILL.md` files for mutation signals and requires `Recommended next skill`, `Recommended next command`, `Recommended next step`, `## Next Steps`, `## Next-Step Routing`, or `## Next-Skill Routing`.
- Step 16.4 validation:
  - `./scripts/skill-next-step-routing.sh --missing` - passed; `All 211 mutation-capable skills have next-step routing.`
  - `./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `./scripts/skill-versions.sh --missing` - passed; `All 271 skills have a version field.`
  - `rg -n "Default next-step routing" global packs -g 'SKILL.md' | wc -l` - passed; `139`.
  - `rg -n "## Next-Step Routing" packs/*-kanban packs/poketowork-kanban -g 'SKILL.md' | wc -l` - passed; `40`.
  - `./scripts/skill-next-step-routing.sh --list | wc -l` - passed; `211`.
  - `git diff --check` - passed; no output.

---

## Prior Phase Snapshot: Creator Presence Dossier

**Goal:** Add a repo-backed Markdown dossier skill that tracks a creator's public professional presence, career arc, platform roles, proof assets, and content opportunities over time.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add mirrored Claude/Codex `creator-presence-dossier` skill definitions.
- Make the dossier consume `research/creator-platforms/capability-matrix.md`, `research/creator-platforms/evidence-schema.md`, and available creator evidence.
- Define output under `research/creator-presence/<slug>.md`.
- Include sections for identity, career timeline, platform map, core themes, expertise claims, proof assets, signature formats, audience/community signals, product/company links, evidence register, gaps, and next collection tasks.
- Update pack docs and references so the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.

**Acceptance Criteria:**
- [x] `creator-presence-dossier` exists for both Claude and Codex.
- [x] The skill distinguishes public/professional evidence from private repo planning context.
- [x] The skill requires source paths, capture dates, confidence levels, and evidence gaps.
- [x] The dossier contract supports LinkedIn, personal websites, GitHub, podcasts, talks, newsletters, and product docs.
- [x] Follow-up routing recommends the correct creator-media strategy skill from dossier findings.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.

**Parallelization:** serial
**Coordination Notes:** The dossier depends on the Phase 12 matrix/schema contract. Keep implementation serial because it touches pack routing and cross-skill handoffs.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Implementation
- [x] Step 13.1: Create mirrored `creator-presence-dossier` skill contracts.
  - Classification: automated
  - Files: create `packs/creator-media/claude/creator-presence-dossier/SKILL.md`, create `packs/creator-media/codex/creator-presence-dossier/SKILL.md`
  - Require output at `research/creator-presence/<slug>.md`.
  - Require reading `research/creator-platforms/capability-matrix.md`, `research/creator-platforms/evidence-schema.md`, and available normalized/raw creator evidence before synthesis.
  - Require public/professional evidence boundaries so private repo planning context is excluded unless explicitly marked as internal notes.
  - Include final-response next-skill routing as `Recommended next skill: <command>`.
- [x] Step 13.2: Define the dossier Markdown contract and evidence register requirements.
  - Classification: automated
  - Files: modify `packs/creator-media/claude/creator-presence-dossier/SKILL.md`, modify `packs/creator-media/codex/creator-presence-dossier/SKILL.md`
  - Require sections for identity, current public promise, career timeline, platform map, core themes, expertise claims, proof assets, signature formats, audience/community signals, product/company connections, gaps/contradictions/stale positioning, evidence register, next collection tasks, and recommended next skills.
  - Require evidence rows to include source path or URL, capture date, confidence level, public/private boundary, and evidence gaps.
  - Require support for LinkedIn, personal websites/blogs, GitHub, podcasts, talks, newsletters, and product docs when evidence is present.
- [x] Step 13.3: Wire `creator-presence-dossier` into creator-media pack docs and discovery references.
  - Classification: automated
  - Files: modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Put `creator-presence-dossier` after `creator-evidence-schema` and before platform-specific audits or strategy synthesis in creator-media skill lists and default flows.
  - Document that the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.
- [x] Step 13.4: Align downstream creator-media routing with the dossier.
  - Classification: automated
  - Files: inspect and modify only as needed in `packs/creator-media/claude/creator-evidence-schema/SKILL.md`, `packs/creator-media/codex/creator-evidence-schema/SKILL.md`, `packs/creator-media/claude/creator-positioning/SKILL.md`, `packs/creator-media/codex/creator-positioning/SKILL.md`, `packs/creator-media/claude/content-programming/SKILL.md`, `packs/creator-media/codex/content-programming/SKILL.md`, `packs/creator-media/claude/product-led-media-map/SKILL.md`, `packs/creator-media/codex/product-led-media-map/SKILL.md`, `packs/creator-media/claude/creator-metrics-review/SKILL.md`, `packs/creator-media/codex/creator-metrics-review/SKILL.md`
  - Ensure schema routing can recommend the now-present dossier for mixed-platform, LinkedIn-first, career-signal, or owned-presence work.
  - Ensure strategy skills mention the dossier as a preferred creator context source without breaking the existing YouTube evidence flow.

### Green
- [x] Step 13.5: Write regression validation coverage for Phase 13 acceptance criteria.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run targeted scans confirming mirrored dossier skill files, frontmatter names, output path, required sections, public/private evidence boundaries, confidence/capture/source fields, supported source types, pack-doc routing, and final-response next-skill language.
- [x] Step 13.6: Run repository validation.
  - Classification: automated
  - Files: no source changes expected
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, targeted `rg` checks, `git diff --check`, and perform only concrete cleanup found by validation.

### Milestone: Creator Presence Dossier
**Acceptance Criteria:**
- [x] `creator-presence-dossier` exists for both Claude and Codex.
- [x] The skill distinguishes public/professional evidence from private repo planning context.
- [x] The skill requires source paths, capture dates, confidence levels, and evidence gaps.
- [x] The dossier contract supports LinkedIn, personal websites, GitHub, podcasts, talks, newsletters, and product docs.
- [x] Follow-up routing recommends the correct creator-media strategy skill from dossier findings.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: Folded the conditional no-op wording cleanup into the validation gate to avoid a separate plan-mode handoff after clean checks.
- Tech debt / follow-ups: none.
- Ready for next phase: yes

---

### Review
- Phase 13 planned just in time after Phase 12 completion.
- Ready for implementation: Step 13.1.
- Step 13.1 complete: added mirrored Claude/Codex `creator-presence-dossier` skill contracts with frontmatter, output path, Phase 12 foundation reads, public/professional evidence boundaries, evidence-path citation, and final-response next-skill routing.
- Validation:
  - `rg -n "name: creator-presence-dossier|version:|Invoke as|research/creator-presence/<slug>\\.md|research/creator-platforms/capability-matrix\\.md|research/creator-platforms/evidence-schema\\.md|public/professional|private repo planning context|source paths|capture dates|confidence levels|Recommended next skill: <command>|creator-positioning|content-programming|product-led-media-map|creator-metrics-review" packs/creator-media/claude/creator-presence-dossier/SKILL.md packs/creator-media/codex/creator-presence-dossier/SKILL.md` - passed; confirmed mirrored contract strings and routing language.
  - `./scripts/skill-versions.sh --missing` - passed; `All 269 skills have a version field.`
  - `./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `git diff --check` - passed; no output.
- Step 13.2 complete: expanded mirrored Claude/Codex `creator-presence-dossier` skills with a section-by-section Markdown contract, evidence register row schema, confidence level rules, required public/private boundary field, and explicit support for LinkedIn, personal websites/blogs, GitHub, podcasts, talks, newsletters, and product docs when evidence is present.
- Validation:
  - `rg -n "## Markdown Contract|## Scope and Capture|## Identity|## Current Public Promise|## Career Timeline|## Platform Map|## Core Themes|## Expertise Claims|## Proof Assets|## Signature Formats|## Audience and Community Signals|## Product and Company Connections|## Gaps, Contradictions, and Stale Positioning|## Evidence Register|## Next Collection Tasks|## Recommended Next Skills|Source path or URL|Capture date|Source family|Public/private boundary|Confidence level|Claims supported|Evidence gaps|LinkedIn|personal websites/blogs|GitHub|podcasts|talks|newsletters|product docs" packs/creator-media/claude/creator-presence-dossier/SKILL.md packs/creator-media/codex/creator-presence-dossier/SKILL.md` - passed; confirmed required sections, row fields, confidence/capture/source language, and source families in both mirrored skills.
  - `perl -0pe ... packs/creator-media/claude/creator-presence-dossier/SKILL.md > /tmp/creator-presence-claude-normalized.md`; `perl -0pe ... packs/creator-media/codex/creator-presence-dossier/SKILL.md > /tmp/creator-presence-codex-normalized.md`; `diff -u /tmp/creator-presence-claude-normalized.md /tmp/creator-presence-codex-normalized.md` - passed; no output after normalizing command syntax.
  - `./scripts/skill-versions.sh --missing` - passed; `All 269 skills have a version field.`
  - `./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `git diff --check` - passed; no output.
- Step 13.3 complete: wired `creator-presence-dossier` into creator-media pack docs and discovery references after `creator-evidence-schema`, before platform-specific audits or strategy synthesis, and documented that the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.
- Validation:
  - `rg -n "creator-platform-capability-matrix, creator-evidence-schema,|creator-presence-dossier|creator-presence-dossier.*creator-positioning|creator-positioning.*content-programming|product-led-media-map|creator-metrics-review" README.md packs/creator-media/PACK.md docs/skills-reference.md` - passed; confirmed the dossier is exposed in public references and downstream strategy routing language appears in all three docs.
  - `rg -n "creator-platform-capability-matrix -> creator-evidence-schema|-> creator-presence-dossier|-> youtube-channel-audit / platform-specific audit" packs/creator-media/PACK.md docs/skills-reference.md` - passed; confirmed the default flow places the dossier after the evidence schema and before platform-specific audits.
  - `./scripts/skill-versions.sh --missing` - passed; `All 269 skills have a version field.`
  - `./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `git diff --check` - passed; no output.
- Step 13.4 complete: aligned downstream creator-media routing with the new dossier. `creator-evidence-schema` now routes mixed-platform, LinkedIn-first, career-signal/career signal, owned-presence/owned presence, personal website, GitHub-profile, podcast, talk, newsletter, and professional bio work to `creator-presence-dossier` when available. `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review` now treat `research/creator-presence/<slug>.md` as preferred optional creator context while preserving the existing YouTube-only channel audit flow.
- Validation:
  - `rg -n "Recommended next skill: (\\$|/)creator-presence-dossier|mixed-platform, LinkedIn-first, career signal, career-signal, owned presence, owned-presence|personal website|GitHub-profile|podcast|talk|newsletter|professional bio" packs/creator-media/claude/creator-evidence-schema/SKILL.md packs/creator-media/codex/creator-evidence-schema/SKILL.md` - passed; confirmed mirrored schema routing triggers and final-response dossier recommendations.
  - `rg -n "research/creator-presence/<slug>\\.md|creator-presence-dossier.*youtube-channel-audit|YouTube-only|channel-only|preferred creator context|optional preferred creator context|not a replacement for YouTube audit evidence|preserve raw YouTube evidence" packs/creator-media/claude/creator-positioning/SKILL.md packs/creator-media/codex/creator-positioning/SKILL.md packs/creator-media/claude/content-programming/SKILL.md packs/creator-media/codex/content-programming/SKILL.md packs/creator-media/claude/product-led-media-map/SKILL.md packs/creator-media/codex/product-led-media-map/SKILL.md packs/creator-media/claude/creator-metrics-review/SKILL.md packs/creator-media/codex/creator-metrics-review/SKILL.md` - passed; confirmed strategy skills prefer the dossier when present and preserve YouTube evidence paths.
  - `perl -0pe ... packs/creator-media/claude/creator-evidence-schema/SKILL.md > /tmp/a`; `perl -0pe ... packs/creator-media/codex/creator-evidence-schema/SKILL.md > /tmp/b`; `diff -u /tmp/a /tmp/b` - passed; confirmed `creator-evidence-schema` mirrors after command-token normalization.
  - `./scripts/skill-versions.sh --missing` - passed; `All 269 skills have a version field.`
  - `./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `git diff --check` - passed; no output.
- Step 13.5 complete: recorded focused regression validation coverage for the Phase 13 acceptance criteria. The scans confirmed mirrored dossier skill files, frontmatter names, output path, required sections, public/private evidence boundaries, confidence/capture/source fields, supported source families, pack-doc routing, downstream routing, and final-response next-skill language. No source contract edits were needed.
- Validation:
  - `rg -n "name: creator-presence-dossier|version:|research/creator-presence/<slug>\\.md|research/creator-platforms/capability-matrix\\.md|research/creator-platforms/evidence-schema\\.md" packs/creator-media/claude/creator-presence-dossier/SKILL.md packs/creator-media/codex/creator-presence-dossier/SKILL.md` - passed; confirmed mirrored frontmatter names, version fields, required output path, and Phase 12 foundation reads in both dossier skills.
  - `rg -n "## Identity|## Current Public Promise|## Career Timeline|## Platform Map|## Core Themes|## Expertise Claims|## Proof Assets|## Signature Formats|## Audience and Community Signals|## Product and Company Connections|## Gaps, Contradictions, and Stale Positioning|## Evidence Register|## Next Collection Tasks|## Recommended Next Skills" packs/creator-media/claude/creator-presence-dossier/SKILL.md packs/creator-media/codex/creator-presence-dossier/SKILL.md` - passed; confirmed all required dossier sections in both mirrored skills.
  - `rg -n "public/professional|private repo planning context|Source path or URL|Capture date|Confidence level|Evidence gaps|Public/private boundary|LinkedIn|personal websites/blogs|GitHub|podcasts|talks|newsletters|product docs" packs/creator-media/claude/creator-presence-dossier/SKILL.md packs/creator-media/codex/creator-presence-dossier/SKILL.md` - passed; confirmed public/private evidence boundaries, evidence register fields, and supported source families in both mirrored skills.
  - `rg -n "creator-presence-dossier|creator-positioning|content-programming|product-led-media-map|creator-metrics-review|creator-platform-capability-matrix -> creator-evidence-schema|-> creator-presence-dossier" README.md packs/creator-media/PACK.md docs/skills-reference.md` - passed; confirmed pack docs and discovery references expose the dossier after the evidence schema and before downstream strategy skills.
  - `rg -n "Recommended next skill: (\\$|/)creator-presence-dossier|mixed-platform, LinkedIn-first, career signal, career-signal, owned presence, owned-presence|personal website|GitHub-profile|podcast|talk|newsletter|professional bio" packs/creator-media/claude/creator-evidence-schema/SKILL.md packs/creator-media/codex/creator-evidence-schema/SKILL.md` - passed; confirmed schema follow-up routing recommends the dossier for mixed-platform and career/owned-presence work in both command syntaxes.
  - `rg -n "research/creator-presence/<slug>\\.md|creator-presence-dossier.*youtube-channel-audit|YouTube-only|channel-only|preferred creator context|optional preferred creator context|not a replacement for YouTube audit evidence|preserve raw YouTube evidence" packs/creator-media/claude/creator-positioning/SKILL.md packs/creator-media/codex/creator-positioning/SKILL.md packs/creator-media/claude/content-programming/SKILL.md packs/creator-media/codex/content-programming/SKILL.md packs/creator-media/claude/product-led-media-map/SKILL.md packs/creator-media/codex/product-led-media-map/SKILL.md packs/creator-media/claude/creator-metrics-review/SKILL.md packs/creator-media/codex/creator-metrics-review/SKILL.md` - passed; confirmed downstream strategy skills prefer the dossier when present while preserving YouTube evidence flow.
  - `./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `./scripts/skill-versions.sh --missing` - passed; `All 269 skills have a version field.`
  - `git diff --check` - passed; no output.
- Step 13.6 complete: ran the formal repository validation gate for Phase 13 after targeted acceptance-criteria scans. No source contract edits were needed and no unresolved warnings were emitted.
- Validation:
  - `./scripts/skill-deps.sh --broken` - passed; `No broken references found.`
  - `./scripts/skill-versions.sh --missing` - passed; `All 269 skills have a version field.`
  - `rg -n "name: creator-presence-dossier|version:|research/creator-presence/<slug>\\.md|research/creator-platforms/capability-matrix\\.md|research/creator-platforms/evidence-schema\\.md" packs/creator-media/claude/creator-presence-dossier/SKILL.md packs/creator-media/codex/creator-presence-dossier/SKILL.md` - passed; confirmed mirrored frontmatter names, version fields, required output path, and Phase 12 foundation reads in both dossier skills.
  - `rg -n "## Identity|## Current Public Promise|## Career Timeline|## Platform Map|## Core Themes|## Expertise Claims|## Proof Assets|## Signature Formats|## Audience and Community Signals|## Product and Company Connections|## Gaps, Contradictions, and Stale Positioning|## Evidence Register|## Next Collection Tasks|## Recommended Next Skills" packs/creator-media/claude/creator-presence-dossier/SKILL.md packs/creator-media/codex/creator-presence-dossier/SKILL.md` - passed; confirmed all required dossier sections in both mirrored skills.
  - `rg -n "public/professional|private repo planning context|Source path or URL|Capture date|Confidence level|Evidence gaps|Public/private boundary|LinkedIn|personal websites/blogs|GitHub|podcasts|talks|newsletters|product docs" packs/creator-media/claude/creator-presence-dossier/SKILL.md packs/creator-media/codex/creator-presence-dossier/SKILL.md` - passed; confirmed public/private evidence boundaries, evidence register fields, and supported source families in both mirrored skills.
  - `rg -n "creator-presence-dossier|creator-positioning|content-programming|product-led-media-map|creator-metrics-review|creator-platform-capability-matrix -> creator-evidence-schema|-> creator-presence-dossier" README.md packs/creator-media/PACK.md docs/skills-reference.md` - passed; confirmed pack docs and discovery references expose the dossier after the evidence schema and before downstream strategy skills.
  - `rg -n "Recommended next skill: (\\$|/)creator-presence-dossier|mixed-platform, LinkedIn-first, career signal, career-signal, owned presence, owned-presence|personal website|GitHub-profile|podcast|talk|newsletter|professional bio" packs/creator-media/claude/creator-evidence-schema/SKILL.md packs/creator-media/codex/creator-evidence-schema/SKILL.md` - passed; confirmed schema follow-up routing recommends the dossier for mixed-platform and career/owned-presence work in both command syntaxes.
  - `rg -n "research/creator-presence/<slug>\\.md|creator-presence-dossier.*youtube-channel-audit|YouTube-only|channel-only|preferred creator context|optional preferred creator context|not a replacement for YouTube audit evidence|preserve raw YouTube evidence" packs/creator-media/claude/creator-positioning/SKILL.md packs/creator-media/codex/creator-positioning/SKILL.md packs/creator-media/claude/content-programming/SKILL.md packs/creator-media/codex/content-programming/SKILL.md packs/creator-media/claude/product-led-media-map/SKILL.md packs/creator-media/codex/product-led-media-map/SKILL.md packs/creator-media/claude/creator-metrics-review/SKILL.md packs/creator-media/codex/creator-metrics-review/SKILL.md` - passed; confirmed downstream strategy skills prefer the dossier when present while preserving YouTube evidence flow.
  - `git diff --check` - passed; no output.
- Phase 13 no-op cleanup folded into Step 13.6: the successful validation gate exposed no concrete wording drift or regression, so no separate source-doc cleanup step was needed. This avoids a clear-context plan for a step whose expected source changes are none.
