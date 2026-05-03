# YouTube Video Audit

**Project:** Claude Skills / agentic-skills
**Current phase:** 15 of 15
**Source roadmap:** `tasks/roadmap.md`
**Source spec:** User request and YouTube API/docs research

## Phase 15: YouTube Video Audit

**Goal:** Add an evidence-first single-video YouTube audit skill that analyzes public metadata, transcript/content, packaging, release timing, comments, and optional owner analytics for one video.

**Scope:**
- Add mirrored Claude/Codex `youtube-video-audit` skill definitions.
- Default to public evidence through `yt-dlp`, public transcript tooling, and optional YouTube Data API enrichment when `YOUTUBE_API_KEY` is already available.
- Support optional owner-provided analytics exports or OAuth/API output for retention, impressions/CTR, traffic sources, watch time, average view duration, subscriber change, shares, and time-series performance.
- Persist raw evidence under `research/youtube/data/<video-id>/` and write `research/youtube/video-audit-<video-id>-YYYY-MM-DD.md`.
- Wire pack docs and discovery references so single-video work routes to `youtube-video-audit` without replacing channel-level `youtube-channel-audit`.

**Acceptance Criteria:**
- [ ] `youtube-video-audit` exists for both Claude and Codex.
- [ ] The skill has a public-first evidence path and optional owner-analytics path.
- [ ] The skill distinguishes public evidence from owner-provided/private analytics and records evidence gaps.
- [ ] The report contract covers release timing, performance snapshot, packaging, hook/content structure, transcript evidence, comments/audience response, and prioritized fixes.
- [ ] Creator-media docs/reference lists include `youtube-video-audit` and preserve the existing channel audit flow.
- [ ] Validation passes with skill dependency/version checks and targeted routing scans.

**Parallelization:** serial
**Coordination Notes:** Keep this serial because it touches mirrored skills, pack routing, and docs. Do not add dependencies or GitHub Actions.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Implementation
- [ ] Step 15.1: Create mirrored `youtube-video-audit` skill contracts.
  - Classification: automated
  - Files: create `packs/creator-media/claude/youtube-video-audit/SKILL.md`, create `packs/creator-media/codex/youtube-video-audit/SKILL.md`
  - Require video URL or ID input, public-first evidence capture, optional owner analytics, raw evidence paths, report output path, and final-response next-skill routing.
- [ ] Step 15.2: Define the report contract and evidence boundaries.
  - Classification: automated
  - Files: modify mirrored `youtube-video-audit` skill files
  - Require sections for evidence coverage, public metadata, release timing, performance snapshot, packaging, transcript/content structure, comments/audience response, owner analytics when present, prioritized fixes, and evidence gaps.
- [ ] Step 15.3: Wire `youtube-video-audit` into creator-media pack docs and discovery references.
  - Classification: automated
  - Files: modify `packs/creator-media/PACK.md`, `README.md`, `docs/skills-reference.md`
  - Put `youtube-video-audit` near `youtube-channel-audit` and document that it is the single-video lane, not the channel-level trend lane.

### Green
- [ ] Step 15.4: Run focused validation and record results.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run targeted scans for mirrored files, frontmatter, output paths, evidence boundaries, optional owner analytics, report sections, docs routing, plus `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, and `git diff --check`.

### Milestone: YouTube Video Audit
**Acceptance Criteria:**
- [ ] `youtube-video-audit` exists for both Claude and Codex.
- [ ] The skill has a public-first evidence path and optional owner-analytics path.
- [ ] The skill distinguishes public evidence from owner-provided/private analytics and records evidence gaps.
- [ ] The report contract covers release timing, performance snapshot, packaging, hook/content structure, transcript evidence, comments/audience response, and prioritized fixes.
- [ ] Creator-media docs/reference lists include `youtube-video-audit` and preserve the existing channel audit flow.
- [ ] Validation passes with skill dependency/version checks and targeted routing scans.

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
