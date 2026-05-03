# Creator Presence Dossier

**Project:** Claude Skills / agentic-skills
**Current phase:** 13 of 14
**Source roadmap:** `tasks/roadmap.md`
**Source spec:** `specs/creator-platform-evidence-schema.md`

## Phase 13: Creator Presence Dossier

**Goal:** Add a repo-backed Markdown dossier skill that tracks a creator's public professional presence, career arc, platform roles, proof assets, and content opportunities over time.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add mirrored Claude/Codex `creator-presence-dossier` skill definitions.
- Make the dossier consume `research/creator-platforms/capability-matrix.md`, `research/creator-platforms/evidence-schema.md`, and available creator evidence.
- Define output under `research/creator-presence/<slug>.md`.
- Include sections for identity, career timeline, platform map, core themes, expertise claims, proof assets, signature formats, audience/community signals, product/company links, evidence register, gaps, and next collection tasks.
- Update pack docs and references so the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.

**Acceptance Criteria:**
- [ ] `creator-presence-dossier` exists for both Claude and Codex.
- [ ] The skill distinguishes public/professional evidence from private repo planning context.
- [ ] The skill requires source paths, capture dates, confidence levels, and evidence gaps.
- [ ] The dossier contract supports LinkedIn, personal websites, GitHub, podcasts, talks, newsletters, and product docs.
- [ ] Follow-up routing recommends the correct creator-media strategy skill from dossier findings.
- [ ] Validation passes with skill dependency/version checks and targeted reference scans.

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
- [ ] Step 13.3: Wire `creator-presence-dossier` into creator-media pack docs and discovery references.
  - Classification: automated
  - Files: modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Put `creator-presence-dossier` after `creator-evidence-schema` and before platform-specific audits or strategy synthesis in creator-media skill lists and default flows.
  - Document that the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.
- [ ] Step 13.4: Align downstream creator-media routing with the dossier.
  - Classification: automated
  - Files: inspect and modify only as needed in `packs/creator-media/claude/creator-evidence-schema/SKILL.md`, `packs/creator-media/codex/creator-evidence-schema/SKILL.md`, `packs/creator-media/claude/creator-positioning/SKILL.md`, `packs/creator-media/codex/creator-positioning/SKILL.md`, `packs/creator-media/claude/content-programming/SKILL.md`, `packs/creator-media/codex/content-programming/SKILL.md`, `packs/creator-media/claude/product-led-media-map/SKILL.md`, `packs/creator-media/codex/product-led-media-map/SKILL.md`, `packs/creator-media/claude/creator-metrics-review/SKILL.md`, `packs/creator-media/codex/creator-metrics-review/SKILL.md`
  - Ensure schema routing can recommend the now-present dossier for mixed-platform, LinkedIn-first, career-signal, or owned-presence work.
  - Ensure strategy skills mention the dossier as a preferred creator context source without breaking the existing YouTube evidence flow.

### Green
- [ ] Step 13.5: Write regression validation coverage for Phase 13 acceptance criteria.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run targeted scans confirming mirrored dossier skill files, frontmatter names, output path, required sections, public/private evidence boundaries, confidence/capture/source fields, supported source types, pack-doc routing, and final-response next-skill language.
- [ ] Step 13.6: Run repository validation.
  - Classification: automated
  - Files: no source changes expected
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, targeted `rg` checks, and `git diff --check`.
- [ ] Step 13.7: Refactor wording for consistency if validation exposes drift while keeping the contracts unchanged.
  - Classification: automated
  - Files: modify only the new skill files and creator-media reference docs if needed.

### Milestone: Creator Presence Dossier
**Acceptance Criteria:**
- [ ] `creator-presence-dossier` exists for both Claude and Codex.
- [ ] The skill distinguishes public/professional evidence from private repo planning context.
- [ ] The skill requires source paths, capture dates, confidence levels, and evidence gaps.
- [ ] The dossier contract supports LinkedIn, personal websites, GitHub, podcasts, talks, newsletters, and product docs.
- [ ] Follow-up routing recommends the correct creator-media strategy skill from dossier findings.
- [ ] Validation passes with skill dependency/version checks and targeted reference scans.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: [fill when complete]
- Tech debt / follow-ups: [fill when complete]
- Ready for next phase: no

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

### Next Step: 13.3 — Wire `creator-presence-dossier` into creator-media pack docs and discovery references

**What:** Add `creator-presence-dossier` to the creator-media pack docs and public discovery references so it sits after `creator-evidence-schema` and before platform-specific audits or strategy synthesis.

**Files to modify:**
- `packs/creator-media/PACK.md`
- `README.md`
- `docs/skills-reference.md`
- `tasks/todo.md`
- `tasks/history.md`

**Requirements:**
- Put `creator-presence-dossier` after `creator-evidence-schema` in creator-media skill lists and default flows.
- Put `creator-presence-dossier` before platform-specific audits or strategy synthesis where the pack describes recommended sequence.
- Document that the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.
- Preserve existing YouTube-only routing notes where they are already documented.

**Execution Profile:**
- Parallel mode: serial
- Integration owner: main agent
- Classification: automated

**Acceptance criteria:**
- Creator-media pack docs list `creator-presence-dossier` in the intended sequence.
- `README.md` and `docs/skills-reference.md` expose the new skill.
- Reference docs explain that the dossier feeds the downstream creator-media strategy skills.
- Targeted scans and repository validation pass.

**Ship-one-step handoff contract:** Implement only Step 13.3. Update the review section with exact validation commands and results. Mark step done in `tasks/todo.md`. Update `tasks/history.md`. Commit and push. Stop after preparing the next step.
