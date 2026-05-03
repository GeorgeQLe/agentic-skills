# Creator Platform Evidence Foundation

**Project:** Claude Skills / agentic-skills
**Current phase:** 12 of 14
**Source roadmap:** `tasks/roadmap.md`
**Source spec:** `specs/creator-platform-evidence-schema.md`

## Phase 12: Creator Platform Evidence Foundation

**Goal:** Add the shared creator-media foundation for non-YouTube platforms: a platform capability matrix and normalized evidence schema that future platform-specific skills can consume.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add mirrored Claude/Codex `creator-platform-capability-matrix` skill definitions.
- Add mirrored Claude/Codex `creator-evidence-schema` skill definitions.
- Define output artifacts under `research/creator-platforms/`.
- Document supported baseline collection methods: `export`, `manual_snapshot`, `rss_feed`, `public_page_capture`, `open_source_tool`, and `free_api`.
- Update creator-media pack docs and global skill references so the new foundation appears before platform-specific audits.
- Validate mirrored skill metadata, references, and required output-path language.

**Acceptance Criteria:**
- [ ] `creator-platform-capability-matrix` exists for both Claude and Codex.
- [ ] `creator-evidence-schema` exists for both Claude and Codex.
- [ ] The capability matrix skill records platform evidence sources, fields, missing fields, metric availability, audit depth, operational risk, and recommended next skill.
- [ ] The schema skill defines normalized evidence records, metric confidence, evidence confidence, capture method, auth context, raw evidence paths, and privacy notes.
- [ ] Pack docs route non-YouTube creator-media work through the foundation before platform-specific skills.
- [ ] Validation passes with skill dependency/version checks and targeted reference scans.

**Parallelization:** serial
**Coordination Notes:** This phase changes shared pack contracts and docs, so keep it integrated. Later platform-specific work should depend on this schema instead of creating incompatible evidence fields.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Implementation
- [x] Step 12.1: Create mirrored `creator-platform-capability-matrix` skill contracts.
  - Classification: automated
  - Files: create `packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md`, create `packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md`
  - Include platform rows for LinkedIn personal profile, LinkedIn company page, personal website/blog, newsletter, podcast, GitHub, X/Threads/Instagram/TikTok, and Bluesky/Mastodon.
  - Require output at `research/creator-platforms/capability-matrix.md`.
  - Require columns for evidence sources, likely fields, missing fields, metric availability, body/media/transcript availability, peer benchmarking practicality, operational risk, audit depth, and recommended next skill.
  - Classify collection methods as `export`, `manual_snapshot`, `rss_feed`, `public_page_capture`, `open_source_tool`, or `free_api`.
- [x] Step 12.2: Create mirrored `creator-evidence-schema` skill contracts.
  - Classification: automated
  - Files: create `packs/creator-media/claude/creator-evidence-schema/SKILL.md`, create `packs/creator-media/codex/creator-evidence-schema/SKILL.md`
  - Require output at `research/creator-platforms/evidence-schema.md`.
  - Define raw evidence root `research/creator-platforms/data/<platform>/<slug>/`.
  - Define normalized record fields for `evidence_id`, `platform`, `source_type`, `source_url`, `raw_path`, `captured_at`, `capture_method`, `auth_context`, `terms_risk`, `title`, `body_text_path`, `published_at`, `creator_role`, `media_type`, `topic_tags`, `content_role`, `metrics`, `metric_confidence`, `evidence_confidence`, privacy notes, and review notes.
  - State that optional metrics must not be invented and missing metrics/bodies must be recorded as evidence gaps.
- [x] Step 12.3: Wire the foundation into creator-media pack docs and discovery references.
  - Classification: automated
  - Files: modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Put `creator-platform-capability-matrix` and `creator-evidence-schema` before platform-specific audits in the creator-media skill list and default flow.
  - Document that YouTube-specific work may still start at `youtube-channel-audit`, while non-YouTube or mixed-platform work starts with the foundation.
- [x] Step 12.4: Align creator-media next-skill routing with the new foundation.
  - Classification: automated
  - Files: modify `packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-media/claude/creator-evidence-schema/SKILL.md`, modify `packs/creator-media/codex/creator-evidence-schema/SKILL.md`, inspect existing `packs/creator-media/{claude,codex}/*/SKILL.md`
  - Ensure the new skills emit `Recommended next skill: <command>` in the final response.
  - Route matrix to schema by default; route schema to the future creator presence dossier when present, otherwise to platform-specific audits or `creator-positioning` based on available evidence.
  - Preserve existing YouTube workflow routing unless a non-YouTube evidence foundation is missing.

### Green
- [x] Step 12.5: Write regression validation coverage for Phase 12 acceptance criteria.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run targeted scans confirming mirrored new skill files, frontmatter names, output paths, collection method language, normalized schema fields, LinkedIn baseline language, and pack-doc routing.
- [x] Step 12.6: Run repository validation.
  - Classification: automated
  - Files: no source changes expected
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, targeted `rg` checks, and `git diff --check`.
- Step 12.7: Refactor wording for consistency if validation exposes drift while keeping the contracts unchanged.
  - Classification: automated
  - Files: modify only the new skill files and creator-media reference docs if needed.

### Milestone: Creator Platform Evidence Foundation
**Acceptance Criteria:**
- [ ] `creator-platform-capability-matrix` exists for both Claude and Codex.
- [ ] `creator-evidence-schema` exists for both Claude and Codex.
- [ ] The capability matrix skill records platform evidence sources, fields, missing fields, metric availability, audit depth, operational risk, and recommended next skill.
- [ ] The schema skill defines normalized evidence records, metric confidence, evidence confidence, capture method, auth context, raw evidence paths, and privacy notes.
- [ ] Pack docs route non-YouTube creator-media work through the foundation before platform-specific skills.
- [ ] Validation passes with skill dependency/version checks and targeted reference scans.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

---

### Next Step: 12.7 — Refactor wording for consistency if validation exposes drift

**What:** Inspect the Phase 12 foundation skill contracts and creator-media discovery docs for wording drift after the repository validation gate. Make only minimal consistency edits if a concrete inconsistency is found; otherwise record that no refactor was needed and complete the step.

**Files to modify:**
- `tasks/todo.md`
- `tasks/history.md`
- Only if needed: `packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md`
- Only if needed: `packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md`
- Only if needed: `packs/creator-media/claude/creator-evidence-schema/SKILL.md`
- Only if needed: `packs/creator-media/codex/creator-evidence-schema/SKILL.md`
- Only if needed: `packs/creator-media/PACK.md`
- Only if needed: `README.md`
- Only if needed: `docs/skills-reference.md`

**Requirements:**
- Compare the mirrored Claude/Codex `creator-platform-capability-matrix` contracts for required output path, collection method vocabulary, matrix columns, platform baseline language, and final-response next-skill wording.
- Compare the mirrored Claude/Codex `creator-evidence-schema` contracts for required output path, raw evidence root, normalized field names, confidence/privacy wording, missing-evidence handling, and final-response next-skill wording.
- Inspect creator-media pack docs and discovery references for consistent routing language around YouTube-only versus non-YouTube or mixed-platform work.
- If wording drift is found, apply the smallest edits that restore consistency without changing the Phase 12 contracts.
- If no drift is found, do not churn source docs; record the no-op result in the review section.
- Run targeted `rg` checks for any edited wording plus `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, and `git diff --check`.
- Record warnings as fixed, accepted with rationale, or unresolved.

**Reference files:**
- `tasks/todo.md`
- `packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md`
- `packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md`
- `packs/creator-media/claude/creator-evidence-schema/SKILL.md`
- `packs/creator-media/codex/creator-evidence-schema/SKILL.md`

**Execution Profile:**
- Parallel mode: serial
- Integration owner: main agent
- Classification: automated

**Acceptance criteria:**
- Mirrored Claude/Codex foundation skill wording is consistent.
- Creator-media pack docs and public references route non-YouTube or mixed-platform work through the foundation before platform-specific audits.
- Any source edits are minimal and preserve existing contracts.
- Validation passes with no unresolved warnings.

**Ship-one-step handoff contract:** Implement only Step 12.7. Update the review section with exact validation commands and results. Mark step done in `tasks/todo.md`. Update `tasks/history.md`. Commit and push. Prepare the phase transition if all Phase 12 acceptance criteria are satisfied.

### Review
- Step 12.1 completed: added mirrored Claude/Codex capability-matrix skill contracts with baseline platform rows, required matrix columns, collection method vocabulary, output path, operational risk guidance, and next-skill routing to `creator-evidence-schema`.
- Step 12.1 validation: `rg` targeted scans for frontmatter names, output path, platforms, collection methods, matrix columns, LinkedIn guidance, and next-skill language; `./scripts/skill-versions.sh --missing`; `./scripts/skill-deps.sh --broken`; `git diff --check`.
- Deviations from plan: none for Step 12.1.
- Tech debt / follow-ups: Step 12.2 should create the mirrored evidence schema contracts and keep the same final-response next-skill convention.
- Ready for next phase: no
- Step 12.2 completed: added mirrored Claude/Codex `creator-evidence-schema` skill contracts with the required evidence-schema output path, raw evidence root, normalized record fields, metric/evidence confidence rules, privacy notes, collection method vocabulary, missing-evidence gap handling, and contextual next-skill routing.
- Step 12.2 validation: `rg` targeted scans for frontmatter names, version fields, output paths, raw evidence root, normalized schema fields, collection methods, confidence/privacy language, missing metrics/bodies handling, and next-skill language; `./scripts/skill-versions.sh --missing`; `./scripts/skill-deps.sh --broken`; `git diff --check`.
- Deviations from plan: none for Step 12.2.
- Tech debt / follow-ups: Step 12.3 should register the two foundation skills in creator-media pack docs and public discovery references before platform-specific audits.
- Ready for next phase: no
- Step 12.3 completed: wired `creator-platform-capability-matrix` and `creator-evidence-schema` into creator-media pack docs and public discovery references before platform-specific audits.
- Step 12.3 validation: `rg -n "creator-platform-capability-matrix, creator-evidence-schema|creator-platform-capability-matrix -> creator-evidence-schema|YouTube-specific work may|non-YouTube or mixed-platform" packs/creator-media/PACK.md README.md docs/skills-reference.md`; `rg -n "research/creator-platforms|platform-specific audit|youtube-channel-audit" packs/creator-media/PACK.md README.md docs/skills-reference.md`; `./scripts/skill-versions.sh --missing`; `./scripts/skill-deps.sh --broken`; `git diff --check`.
- Deviations from plan: none for Step 12.3.
- Tech debt / follow-ups: Step 12.4 should tighten final-response next-skill routing in the new foundation skills and preserve the YouTube-specific shortcut.
- Ready for next phase: no
- Step 12.4 completed: tightened mirrored Claude/Codex next-skill routing in the capability-matrix and evidence-schema foundation skills.
- Step 12.4 validation: inspected existing creator-media routing conventions with `rg`; confirmed explicit final-response lines and routing fallbacks with `rg -n 'Recommended next skill: [/\\$]creator-evidence-schema|Recommended next skill: [/\\$]creator-presence-dossier|Recommended next skill: [/\\$]creator-positioning|non-YouTube or mixed-platform work must not skip|non-YouTube or mixed-platform work should use this foundation|YouTube-only work with channel evidence' packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md packs/creator-media/claude/creator-evidence-schema/SKILL.md packs/creator-media/codex/creator-evidence-schema/SKILL.md`; `./scripts/skill-versions.sh --missing`; `./scripts/skill-deps.sh --broken`; `git diff --check`.
- Step 12.4 warnings: one initial targeted `rg` command used unsafe shell quoting around Markdown backticks and printed `command not found: Recommended`; reran with safe single-quoted regex and the scan passed cleanly.
- Deviations from plan: none for Step 12.4.
- Tech debt / follow-ups: Step 12.5 should record full regression coverage for all Phase 12 acceptance criteria.
- Ready for next phase: no
- Step 12.5 completed: recorded full regression validation coverage for the Phase 12 creator platform evidence foundation acceptance criteria.
- Step 12.5 validation: `rg -n '^name: creator-platform-capability-matrix$|^name: creator-evidence-schema$' packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md packs/creator-media/claude/creator-evidence-schema/SKILL.md packs/creator-media/codex/creator-evidence-schema/SKILL.md`; `rg -n 'research/creator-platforms/capability-matrix.md|research/creator-platforms/evidence-schema.md|research/creator-platforms/data/<platform>/<slug>/' packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md packs/creator-media/claude/creator-evidence-schema/SKILL.md packs/creator-media/codex/creator-evidence-schema/SKILL.md`; `rg -n 'export|manual_snapshot|rss_feed|public_page_capture|open_source_tool|free_api' packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md packs/creator-media/claude/creator-evidence-schema/SKILL.md packs/creator-media/codex/creator-evidence-schema/SKILL.md`; `rg -n 'evidence_id|platform|source_type|source_url|raw_path|captured_at|capture_method|auth_context|terms_risk|metric_confidence|evidence_confidence|privacy_notes|review_notes' packs/creator-media/claude/creator-evidence-schema/SKILL.md packs/creator-media/codex/creator-evidence-schema/SKILL.md`; `rg -n 'LinkedIn personal profile|LinkedIn company page|evidence sources|likely fields|missing fields|metric availability|audit depth|operational risk|recommended next skill|body/media/transcript availability|peer benchmarking practicality' packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md`; `rg -n 'non-YouTube or mixed-platform|creator-platform-capability-matrix -> creator-evidence-schema|creator-platform-capability-matrix, creator-evidence-schema|YouTube-specific work may still start at youtube-channel-audit|platform-specific audits' packs/creator-media/PACK.md README.md docs/skills-reference.md`; `rg -n 'Recommended next skill: [/\\$]creator-evidence-schema|Recommended next skill: [/\\$]creator-presence-dossier|Recommended next skill: [/\\$]creator-positioning|YouTube-only work with channel evidence|non-YouTube or mixed-platform work should use this foundation' packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md packs/creator-media/claude/creator-evidence-schema/SKILL.md packs/creator-media/codex/creator-evidence-schema/SKILL.md`; `./scripts/skill-versions.sh --missing`; `./scripts/skill-deps.sh --broken`; `git diff --check`.
- Step 12.5 validation results: frontmatter names, output paths, collection methods, normalized schema fields, LinkedIn baseline language, pack-doc routing, next-skill routing, skill versions, skill dependencies, and whitespace checks all passed. `./scripts/skill-versions.sh --missing` reported `All 267 skills have a version field.`; `./scripts/skill-deps.sh --broken` reported `No broken references found.`; `git diff --check` produced no output.
- Step 12.5 warnings: none.
- Deviations from plan: none for Step 12.5.
- Tech debt / follow-ups: Step 12.6 should run repository validation as the formal green gate before any Step 12.7 wording cleanup.
- Ready for next phase: no
- Step 12.6 completed: ran the formal repository validation gate for Phase 12.
- Step 12.6 validation: `./scripts/skill-deps.sh --broken`; `./scripts/skill-versions.sh --missing`; `git diff --check`.
- Step 12.6 validation results: `./scripts/skill-deps.sh --broken` reported `No broken references found.`; `./scripts/skill-versions.sh --missing` reported `All 267 skills have a version field.`; `git diff --check` produced no output.
- Step 12.6 warnings: none.
- Deviations from plan: none for Step 12.6.
- Tech debt / follow-ups: Step 12.7 should inspect wording consistency and avoid source churn if no concrete drift is present.
- Ready for next phase: no
