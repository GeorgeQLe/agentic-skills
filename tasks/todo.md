# Active Phase: Phase 14 - LinkedIn Evidence Lane

**Project:** Claude Skills / agentic-skills
**Current phase:** 14 of 26
**Status:** Planned; ready for `$run`.

## Phase 14: LinkedIn Evidence Lane

**Goal:** Add LinkedIn-first free/manual evidence support that uses owner exports, manual snapshots, and public page captures without paid APIs, logged-in scraping, or access-control bypassing.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add LinkedIn-specific collection guidance to the creator-media pack.
- Provide templates or skill guidance for owner-provided LinkedIn exports, profile snapshots, article/post snapshots, rich media evidence, recommendations, skills, and career timeline records.
- Define redaction guidance for sensitive export fields such as private contacts, messages, or relationship data.
- Add optional parsing/template support only where it can operate on local user-provided files.
- Route LinkedIn evidence into `creator-evidence-schema` and `creator-presence-dossier`.
- Document analytics as unavailable unless owner-provided; official company/page APIs are a later authorized lane, not a baseline dependency.

**Acceptance Criteria:**
- [ ] LinkedIn evidence guidance is present in mirrored creator-media skills or a dedicated mirrored LinkedIn skill, depending on Phase 12/13 implementation shape.
- [ ] The LinkedIn lane uses owner exports and manual/public snapshots as the baseline.
- [ ] The lane explicitly forbids logged-in scraping, paid API dependency, bot-protection bypass, and private-data collection.
- [ ] Redaction and privacy handling are documented before analysis.
- [ ] LinkedIn records normalize into the shared evidence schema and dossier.
- [ ] Validation passes with targeted checks for LinkedIn baseline, privacy constraints, and no paid/API-first language.

**Parallelization:** serial
**Coordination Notes:** LinkedIn access constraints are the highest-risk part of the expansion. Implement after the shared foundation and dossier exist so LinkedIn remains one evidence lane, not a special-case schema.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, security, docs/API conformance

**Subagent lanes:** none

### Implementation
- Step 14.1: Harden the LinkedIn baseline in the platform foundation skills.
  - Classification: automated
  - Files: modify `packs/creator-media/claude/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-media/codex/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-media/claude/creator-evidence-schema/SKILL.md`, modify `packs/creator-media/codex/creator-evidence-schema/SKILL.md`
  - Make owner exports, manual snapshots, public unauthenticated page captures, and user-provided files the default LinkedIn collection lane.
  - Treat LinkedIn personal analytics, company/page analytics, and API fields as unavailable unless owner-provided or already authorized.
  - Require redaction/exclusion guidance for private contacts, messages, relationship data, sensitive account data, and unrelated personal information before analysis.
  - Require high-risk LinkedIn surfaces to stop for user-provided evidence instead of attempting logged-in scraping, bot-protection bypass, paywall access, or access-control circumvention.
- Step 14.2: Make the creator presence dossier explicitly consume LinkedIn evidence without leaking private material.
  - Classification: automated
  - Files: modify `packs/creator-media/claude/creator-presence-dossier/SKILL.md`, modify `packs/creator-media/codex/creator-presence-dossier/SKILL.md`
  - Add LinkedIn evidence-register requirements for profile exports, profile snapshots, posts/shares, articles, rich media, recommendations, skills, positions, education, company pages, and manual/public snapshots when provided.
  - Require the dossier to classify LinkedIn evidence as public, owner-provided, admin-provided, internal notes, or mixed/redaction needed.
  - Route private or mixed LinkedIn material to redaction/exclusion before synthesis.
- Step 14.3: Update creator-media pack and discovery docs for the LinkedIn lane.
  - Classification: automated
  - Files: modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Document the LinkedIn-first lane as part of the existing matrix/schema/dossier workflow rather than a standalone scraper.
  - State that LinkedIn collection starts from owner exports, manual snapshots, public unauthenticated captures, and user-provided files.
  - State that paid APIs, logged-in scraping, bot-protection bypass, private-data collection, and access-control circumvention are out of scope.
- Step 14.4: Add focused validation coverage for LinkedIn lane contracts.
  - Classification: automated
  - Files: modify `tests/layer1/routing-graph.test.ts` or create `tests/layer1/creator-media-linkedin.test.ts`
  - Add layer1 checks that mirrored Claude/Codex creator-media contracts include LinkedIn baseline language, redaction/privacy language, normalized evidence routing, and forbidden access patterns.
  - Keep checks structural and deterministic; do not require network, LinkedIn credentials, or external exports.

### Green
- Step 14.5: Run focused validation for the LinkedIn evidence lane.
  - Classification: automated
  - Files: modify `tasks/todo.md`
  - Run targeted `rg` checks over creator-media pack skills and docs for owner export/manual snapshot/public capture baseline, redaction language, normalized schema/dossier routing, and forbidden scraping/API-first language.
  - Run `pnpm --dir tests test`.
  - Run `./scripts/skill-deps.sh --broken`.
  - Run `./scripts/skill-versions.sh --missing`.
  - Run `./scripts/skill-next-step-routing.sh --missing`.
  - Run `git diff --check`.
  - Record exact command results in the `tasks/todo.md` review section and perform only concrete cleanup found by validation.

### Milestone: Phase 14 LinkedIn Evidence Lane
**Acceptance Criteria:**
- [ ] LinkedIn evidence guidance is present in mirrored creator-media skills or a dedicated mirrored LinkedIn skill, depending on Phase 12/13 implementation shape.
- [ ] The LinkedIn lane uses owner exports and manual/public snapshots as the baseline.
- [ ] The lane explicitly forbids logged-in scraping, paid API dependency, bot-protection bypass, and private-data collection.
- [ ] Redaction and privacy handling are documented before analysis.
- [ ] LinkedIn records normalize into the shared evidence schema and dossier.
- [ ] Validation passes with targeted checks for LinkedIn baseline, privacy constraints, and no paid/API-first language.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: [none, or describe]
- Tech debt / follow-ups: [none, or list]
- Ready for next phase: yes/no

## Review

- Activated after completing and archiving Phase 26 on 2026-05-04.
- No manual tasks identified yet; this phase is repo-edit, documentation, and local-validation work unless implementation discovers otherwise.
- No record or recurring tasks identified.
