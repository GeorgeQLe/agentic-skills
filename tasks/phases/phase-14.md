# Active Phase: Phase 14 - LinkedIn Evidence Lane

**Project:** Claude Skills / agentic-skills
**Current phase:** 14 of 26
**Status:** Complete; Phase 14 validated and ready to archive.

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
- [x] LinkedIn evidence guidance is present in mirrored creator-media skills or a dedicated mirrored LinkedIn skill, depending on Phase 12/13 implementation shape.
- [x] The LinkedIn lane uses owner exports and manual/public snapshots as the baseline.
- [x] The lane explicitly forbids logged-in scraping, paid API dependency, bot-protection bypass, and private-data collection.
- [x] Redaction and privacy handling are documented before analysis.
- [x] LinkedIn records normalize into the shared evidence schema and dossier.
- [x] Validation passes with targeted checks for LinkedIn baseline, privacy constraints, and no paid/API-first language.

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
- [x] Step 14.1: Harden the LinkedIn baseline in the platform foundation skills.
  - Classification: automated
  - Files: modify `packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, modify `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`
  - Make owner exports, manual snapshots, public unauthenticated page captures, and user-provided files the default LinkedIn collection lane.
  - Treat LinkedIn personal analytics, company/page analytics, and API fields as unavailable unless owner-provided or already authorized.
  - Require redaction/exclusion guidance for private contacts, messages, relationship data, sensitive account data, and unrelated personal information before analysis.
  - Require high-risk LinkedIn surfaces to stop for user-provided evidence instead of attempting logged-in scraping, bot-protection bypass, paywall access, or access-control circumvention.
- [x] Step 14.2: Make the creator presence dossier explicitly consume LinkedIn evidence without leaking private material.
  - Classification: automated
  - Files: modify `packs/creator-foundation/claude/creator-presence-dossier/SKILL.md`, modify `packs/creator-foundation/codex/creator-presence-dossier/SKILL.md`
  - Add LinkedIn evidence-register requirements for profile exports, profile snapshots, posts/shares, articles, rich media, recommendations, skills, positions, education, company pages, and manual/public snapshots when provided.
  - Require the dossier to classify LinkedIn evidence as public, owner-provided, admin-provided, internal notes, or mixed/redaction needed.
  - Route private or mixed LinkedIn material to redaction/exclusion before synthesis.
- [x] Step 14.3: Update creator-media pack and discovery docs for the LinkedIn lane.
  - Classification: automated
  - Files: modify `packs/creator-foundation/PACK.md`, modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Document the LinkedIn-first lane as part of the existing matrix/schema/dossier workflow rather than a standalone scraper.
  - State that LinkedIn collection starts from owner exports, manual snapshots, public unauthenticated captures, and user-provided files.
  - State that paid APIs, logged-in scraping, bot-protection bypass, private-data collection, and access-control circumvention are out of scope.
- [x] Step 14.4: Add focused validation coverage for LinkedIn lane contracts.
  - Classification: automated
  - Files: modify `tests/layer1/routing-graph.test.ts` or create `tests/layer1/creator-media-linkedin.test.ts`
  - Add layer1 checks that mirrored Claude/Codex creator-media contracts include LinkedIn baseline language, redaction/privacy language, normalized evidence routing, and forbidden access patterns.
  - Keep checks structural and deterministic; do not require network, LinkedIn credentials, or external exports.

### Green
- [x] Step 14.5: Run focused validation for the LinkedIn evidence lane.
  - Classification: automated
  - Files: modify `tasks/todo.md`
  - Run targeted `rg` checks over creator-foundation pack skills and creator-media compatibility docs for owner export/manual snapshot/public capture baseline, redaction language, normalized schema/dossier routing, and forbidden scraping/API-first language.
  - Run `pnpm --dir tests test`.
  - Run `./scripts/skill-deps.sh --broken`.
  - Run `./scripts/skill-versions.sh --missing`.
  - Run `./scripts/skill-next-step-routing.sh --missing`.
  - Run `git diff --check`.
  - Record exact command results in the `tasks/todo.md` review section and perform only concrete cleanup found by validation.

### Milestone: Phase 14 LinkedIn Evidence Lane
**Acceptance Criteria:**
- [x] LinkedIn evidence guidance is present in mirrored creator-media skills or a dedicated mirrored LinkedIn skill, depending on Phase 12/13 implementation shape.
- [x] The LinkedIn lane uses owner exports and manual/public snapshots as the baseline.
- [x] The lane explicitly forbids logged-in scraping, paid API dependency, bot-protection bypass, and private-data collection.
- [x] Redaction and privacy handling are documented before analysis.
- [x] LinkedIn records normalize into the shared evidence schema and dossier.
- [x] Validation passes with targeted checks for LinkedIn baseline, privacy constraints, and no paid/API-first language.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: Step 14.4 validation found two documentation wording gaps, which were fixed before the final validation gate.
- Tech debt / follow-ups: none.
- Ready for next phase: no; Phases 15-26 are already complete, so future work should come from discovery or a new roadmap phase.

## Review

- Activated after completing and archiving Phase 26 on 2026-05-04.
- No manual tasks identified yet; this phase is repo-edit, documentation, and local-validation work unless implementation discovers otherwise.
- No record or recurring tasks identified.

### Step 14.1 Review - LinkedIn Foundation Baseline

**Result:** Hardened the mirrored creator-media platform foundation skills with explicit LinkedIn baseline collection, privacy redaction, and forbidden-access constraints.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 14 plan.
- **Changed files:** `packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md`, `packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md`, `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** Capability matrix contracts now make LinkedIn owner exports, manual snapshots, public unauthenticated page captures, and user-provided files the default collection lane while treating analytics/API fields as unavailable unless owner-provided or authorized; evidence schema contracts now define LinkedIn capture paths, conservative `auth_context`, and required `privacy_notes` redaction/exclusion handling; task/history files record completion and validation evidence.
- **User-goal mapping:** Step 14.1 requires hardening LinkedIn baseline behavior in the platform foundation skills; the mirrored contract edits define the default evidence lane, privacy exclusions, high-risk stop behavior, and forbidden access patterns.
- **Tests run:** targeted `rg` scan passed for `LinkedIn Baseline`, `LinkedIn Evidence Baseline`, owner exports, manual snapshots, public unauthenticated page captures, user-provided files, logged-in scraping, bot-protection bypass, paid API dependency, access-control circumvention, private-data collection, private contacts, private messages, relationship data, sensitive account data, and unrelated personal information across the four touched contracts; Claude/Codex `diff -u` checks showed only expected slash-vs-dollar invocation/routing differences; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 310 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 225 mutation-capable skills covered; `pnpm --dir tests test` passed with 4 files and 1167 tests; `git diff --check` passed.
- **Skipped tests:** no network, LinkedIn credentials, logged-in browser flow, paid API call, or external account mutation was relevant or allowed for this contract-only step.
- **Adversarial review:** changed-contract self-review checked that the new language stops high-risk LinkedIn collection paths, distinguishes owner/admin-provided analytics from default availability, and requires redaction/exclusion before analysis rather than normalizing private LinkedIn material by default.
- **Residual risk:** Phase 14 still needs Step 14.2 dossier handling, Step 14.3 docs registration, Step 14.4 deterministic validation coverage, and Step 14.5 final focused validation before the milestone criteria are complete.
- **Rollback note:** revert the Step 14.1 shipping commit to remove the LinkedIn baseline hardening from the four foundation skill contracts and task/history records.
- **Next command:** `$run`.

### Pack Reorganization Ship Note

**Result:** Shipped the already-staged pack context reduction boundary alongside Step 14.1 because the LinkedIn foundation files had been moved into `creator-foundation` before shipping.

**Ship manifest:**
- **User goal:** Ship already-finished work present in the tree without losing the completed LinkedIn baseline step.
- **Changed files:** split `packs/business-app/**` into `packs/business-discovery/**`, `packs/business-growth/**`, and `packs/business-ops/**`; split `packs/creator-media/**` into `packs/creator-foundation/**` and `packs/youtube-ops/**`; moved fleet skills into `packs/project-fleet/**`; updated `scripts/pack.sh`, pack `PACK.md` files, `README.md`, `docs/packs.md`, `docs/operating-modes.md`, `docs/skills-reference.md`, global pack/concept/skills references, `tasks/pack-reorg-plan.md`, `tasks/todo.md`, and `tasks/history.md`.
- **Per-file purpose:** New pack directories reduce loaded domain context by lane; compatibility `PACK.md` files and `scripts/pack.sh` aliases preserve old install names; docs and global skills point users to the narrow packs; task/history files record the shipping boundary.
- **User-goal mapping:** `$ship` requires packaging already-finished tree work into a safe direct-to-primary commit; the reorg was already staged and intertwined with Step 14.1 paths, so shipping the combined verified boundary avoided leaving moved foundation files half-shipped.
- **Tests run:** see final shipping validation for pack list/install checks, skill dependency/version/routing audits, targeted LinkedIn scans, test suite, `git diff --check`, and quality gate.
- **Skipped tests:** no external network, pack installation into unrelated user projects, or LinkedIn account/API checks were relevant for this repository-local pack and contract update.
- **Adversarial review:** changed-file review checked compatibility aliases, docs references, moved skill ownership, and the LinkedIn moved-path boundary; validation scans covered broken skill references and missing skill metadata.
- **Residual risk:** Existing projects using `business-app` or `creator-media` should continue through aliases, but projects with hand-written references to old physical pack paths may need docs/config updates.
- **Rollback note:** revert the shipping commit to restore the prior pack layout and global skill locations.
- **Next command:** `$run`.

### Step 14.2 Review - LinkedIn Dossier Evidence Handling

**Result:** Hardened the mirrored creator presence dossier contracts so LinkedIn evidence is classified, redacted, and synthesized through the shared dossier without leaking private material.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 14 plan.
- **Changed files:** `packs/creator-foundation/claude/creator-presence-dossier/SKILL.md`, `packs/creator-foundation/codex/creator-presence-dossier/SKILL.md`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The mirrored dossier contracts now define allowed LinkedIn evidence sources, evidence-register boundary classifications, redaction gates for mixed/private LinkedIn material, LinkedIn-specific platform map/audience signal handling, and required evidence-kind labeling; task/history files record completion and validation evidence.
- **User-goal mapping:** Step 14.2 requires the dossier to consume LinkedIn evidence without leaking private material; the contract edits require public, owner-provided, admin-provided, internal-notes, or mixed/redaction-needed classification and block synthesis of private contacts, private messages, relationship data, sensitive account data, unrelated personal information, and confidential employer/customer material.
- **Tests run:** `diff -u packs/creator-foundation/claude/creator-presence-dossier/SKILL.md packs/creator-foundation/codex/creator-presence-dossier/SKILL.md` showed only expected slash-vs-dollar command syntax differences; targeted `rg` scan passed for `LinkedIn Evidence Handling`, owner exports, profile snapshots, public unauthenticated captures, posts/shares/articles/newsletters/rich media/recommendations/skills/positions/education/certifications, logged-in scraping, bot-protection bypass, paid API dependency, private-data collection, private relationship graph, `admin-provided`, `mixed/redaction needed`, private contacts, private messages, relationship data, confidential employer/customer material, redaction handling, and private-summary prohibition; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 310 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 225 mutation-capable skills covered; `pnpm --dir tests test` passed with 4 files and 1167 tests; `git diff --check` passed.
- **Skipped tests:** no network, LinkedIn credentials, logged-in scraping flow, paid API call, or external account mutation was relevant or allowed for this contract-only step.
- **Adversarial review:** changed-contract self-review checked that LinkedIn analytics/admin data requires user-provided authorization, mixed/private inputs stop for redaction or exclusion before synthesis, and the public dossier cannot summarize private relationship or message data.
- **Residual risk:** Phase 14 still needs Step 14.3 docs registration, Step 14.4 deterministic validation coverage, and Step 14.5 final focused validation before all milestone criteria are complete.
- **Rollback note:** revert the Step 14.2 shipping commit to remove the LinkedIn-specific evidence handling from the mirrored dossier contracts and task/history records.
- **Next command:** `$run`.

### Step 14.3 Review - LinkedIn Lane Docs

**Result:** Documented the LinkedIn-first lane in creator-foundation, creator-media compatibility, README, and skills reference surfaces.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 14 plan.
- **Changed files:** `packs/creator-foundation/PACK.md`, `packs/creator-media/PACK.md`, `README.md`, `docs/skills-reference.md`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** Creator foundation docs now state the matrix/schema/dossier LinkedIn lane and forbidden collection methods; creator-media compatibility docs route LinkedIn work to `creator-foundation`; README and skills reference expose the same public install/discovery guidance; task/history files record completion and validation evidence.
- **User-goal mapping:** Step 14.3 requires documenting LinkedIn-first evidence as part of the existing matrix/schema/dossier workflow rather than a standalone scraper, with owner exports/manual snapshots/public unauthenticated captures/user-provided files as baseline and paid APIs/logged-in scraping/bot bypass/private collection out of scope.
- **Tests run:** targeted `rg` scan passed across the four docs for `LinkedIn-first evidence`, `creator-platform-capability-matrix -> creator-evidence-schema -> creator-presence-dossier`, owner exports, manual snapshots, public unauthenticated captures, user-provided files, paid APIs, logged-in scraping, bot-protection bypass, private-data collection, private relationship graph, paywall access, access-control circumvention, and owner/admin-provided analytics language; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 310 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 225 mutation-capable skills covered; `pnpm --dir tests test` passed with 4 files and 1167 tests; `git diff --check` passed.
- **Skipped tests:** no network, LinkedIn credentials, logged-in browser flow, paid API call, or external account mutation was relevant or allowed for this documentation-only step.
- **Adversarial review:** changed-doc self-review checked that the docs do not introduce a standalone LinkedIn scraper lane, do not imply paid/API-first collection, and keep analytics unavailable unless owner-provided, admin-provided, or already authorized.
- **Residual risk:** Phase 14 still needs Step 14.4 deterministic validation coverage and Step 14.5 final focused validation before all milestone criteria are complete.
- **Rollback note:** revert the Step 14.3 shipping commit to remove the LinkedIn lane guidance from pack/public docs and task/history records.
- **Next command:** `$run`.

### Step 14.4 Review - LinkedIn Lane Contract Coverage

**Result:** Added deterministic layer1 coverage for the LinkedIn evidence lane and tightened pack docs where the new contract checks found drift.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 14 plan.
- **Changed files:** `tests/layer1/creator-media-linkedin.test.ts`, `packs/creator-foundation/PACK.md`, `packs/creator-media/PACK.md`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The new layer1 test asserts mirrored LinkedIn foundation and dossier contracts include baseline sources, redaction/privacy gates, normalized dossier routing, and forbidden access patterns; creator-foundation docs now expose the exact matrix/schema/dossier route; creator-media compatibility docs now include the owner/admin authorization boundary for analytics; task/history files record completion and validation evidence.
- **User-goal mapping:** Step 14.4 requires focused structural validation for LinkedIn lane contracts without network, LinkedIn credentials, or external exports; the new test reads local skill/docs files only and fails if the baseline, privacy, routing, or forbidden-access language disappears.
- **Tests run:** `pnpm --dir tests test -- --run tests/layer1/creator-media-linkedin.test.ts` initially failed on missing exact route wording in `packs/creator-foundation/PACK.md` and missing owner/admin authorization wording in `packs/creator-media/PACK.md`; after doc cleanup the same command passed with 5 files and 1177 tests; targeted `rg` scan passed for LinkedIn baseline, evidence handling, owner exports, manual snapshots, public unauthenticated captures, user-provided files, forbidden scraping/API/private collection patterns, mixed redaction, and matrix/schema/dossier routing; `./scripts/skill-deps.sh --broken` passed with no broken references; `./scripts/skill-versions.sh --missing` passed with all 310 skills versioned; `./scripts/skill-next-step-routing.sh --missing` passed with all 225 mutation-capable skills covered; `pnpm --dir tests test` passed with 5 files and 1177 tests; `git diff --check` passed.
- **Skipped tests:** no network, LinkedIn credentials, logged-in browser flow, paid API call, external account mutation, or live LinkedIn export parsing was relevant or allowed for this structural contract step.
- **Adversarial review:** the focused test intentionally spans Claude/Codex mirrors, pack compatibility docs, README, and skills reference so future edits cannot silently drop the LinkedIn baseline, redaction gate, normalized evidence route, or forbidden access boundary from only one surface.
- **Residual risk:** Phase 14 still needs Step 14.5 final focused validation before the milestone acceptance criteria and phase tests can be marked complete.
- **Rollback note:** revert the Step 14.4 shipping commit to remove the new layer1 test, doc wording cleanup, and task/history records.
- **Next command:** `$run`.

### Step 14.5 Review - Final LinkedIn Lane Validation

**Result:** Completed the final focused validation gate for Phase 14 and found no further cleanup needed.

**Ship manifest:**
- **User goal:** Execute the next `$run` unit from the active Phase 14 plan.
- **Changed files:** `tasks/todo.md`, `tasks/history.md`, `tasks/roadmap.md`, `tasks/phases/phase-14.md`.
- **Per-file purpose:** `tasks/todo.md` records Step 14.5, checked acceptance criteria, final phase completion notes, and the no-active-phase handoff; `tasks/history.md` records the validation and phase close; `tasks/roadmap.md` marks Phase 14 complete and updates the roadmap summary; `tasks/phases/phase-14.md` archives the completed phase plan and review evidence.
- **User-goal mapping:** Step 14.5 requires targeted LinkedIn lane validation plus exact command results; the task docs now capture the clean validation gate and close Phase 14 because all acceptance criteria are satisfied.
- **Tests run:** targeted `rg` scan over `packs/creator-foundation`, `packs/creator-media`, `README.md`, `docs/skills-reference.md`, and `tests/layer1/creator-media-linkedin.test.ts` passed for LinkedIn baseline/evidence handling, owner exports, manual snapshots, public unauthenticated captures, user-provided files, redaction/privacy language, schema/dossier routing, and forbidden scraping/API/private collection patterns; `./scripts/skill-deps.sh --broken` passed with `No broken references found.`; `./scripts/skill-versions.sh --missing` passed with `All 310 skills have a version field.`; `./scripts/skill-next-step-routing.sh --missing` passed with `All 225 mutation-capable skills have next-step routing.`; `pnpm --dir tests test` passed with 5 files and 1177 tests; `git diff --check` passed.
- **Skipped tests:** no network, LinkedIn credentials, paid API call, logged-in browser flow, external account mutation, production deploy, or live LinkedIn export parsing was relevant or allowed for this final local validation gate.
- **Adversarial review:** final review compared the validation scope against every Phase 14 acceptance criterion and confirmed the lane stays owner/manual/public-first, blocks high-risk LinkedIn collection patterns, requires redaction before analysis, and routes normalized records through the shared evidence schema and dossier rather than introducing a scraper-specific lane.
- **Residual risk:** no known residual Phase 14 risk; future LinkedIn parser/template work should be introduced as a new phase if needed and kept local-file-only unless a later authorized API lane is explicitly scoped.
- **Rollback note:** revert the Step 14.5 shipping commit to restore Phase 14 as active in task docs and remove the phase archive/roadmap closeout.
- **Next command:** `$brainstorm`.
