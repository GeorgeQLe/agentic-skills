# Preliminary Repo Glossary Research

> Stage: Stage 2 review packet only | Mode: parent glossary bootstrap | Date: 2026-06-12 | Sources scanned: 8 files | Proposed terms: 8 | Proposed acronyms: 1

## Status

This is the non-canonical review packet for `$repo-glossary` focused on the skill metadata terminology migration from `interview_depth` to `context_intake`. It replaces the stale 2026-06-05 bootstrap packet for this active review cycle.

No canonical glossary write has been made. `research/glossary.md` remains absent until final compiled YAML from `alignment/repo-glossary-skill-conventions.html` approves the starter terms and canonical output.

## Scope Resolution

- `research/.progress.yaml`: present, with `skills-showcase` as an active product path.
- Vocabulary scope: repo-level skill convention metadata shared by all packs and global skills.
- Active write target after approval: parent glossary `research/glossary.md`.
- Scoped glossary target: none for this run.
- Existing parent glossary: absent; this is bootstrap mode.
- Approval state: pending final compiled YAML from the review alignment page.

## Source Inventory

| Source | Evidence role |
| --- | --- |
| `docs/interview-convention.md` | Defines `context_intake`, public intake labels, valid values, and the migration note away from `interview_depth`. |
| `docs/skill-anatomy.md` | Defines SKILL.md frontmatter, `type`, `context_intake`, and `visual_tier` as skill metadata fields. |
| `docs/alignment-page-convention.md` | Defines `visual_tier` as the rendering-tier selector and references generated context-intake guidance. |
| `scripts/upgrade-alignment-page.mjs` | Reads `context_intake` and `visual_tier` from frontmatter for generated alignment-page guidance. |
| `scripts/catalog/index.mjs` | Exposes `contextIntake` and `visualTier` in catalog data parsed from skill frontmatter. |
| `scripts/skill-mirror-parity-audit.sh` | Treats `context_intake` and `visual_tier` as parity-significant mirrored frontmatter keys. |
| `apps/skills-showcase/src/showcase/types.ts` | Carries `contextIntake` and `visualTier` through the Skills Showcase data model. |
| `tests/layer1/frontmatter.test.ts` | Enforces valid active `context_intake` and `visual_tier` values and blocks the retired key. |

## Existing Terms

No existing Terms table was available because `research/glossary.md` does not exist.

## Missing Terms Proposed For Approval

| Term | Proposed definition | Category | Source evidence | Confidence |
| --- | --- | --- | --- | --- |
| `Frontmatter` | The YAML metadata block at the top of `SKILL.md` that declares machine-readable skill fields before the prose contract. | technical | `docs/skill-anatomy.md` | High |
| `Skill metadata` | Structured fields parsed from `SKILL.md` frontmatter and used by docs, generators, catalogs, audits, and showcase data. | technical | `docs/skill-anatomy.md`, `scripts/catalog/index.mjs` | High |
| `type` | The broad workflow category for a skill, preserved as one of `planning`, `research`, `analysis`, `execution`, `review`, `shipping`, `ops`, or `router`. | workflow | `docs/skill-anatomy.md` | High |
| `context_intake` | The canonical skill frontmatter field that declares the expected user/context discovery cadence before substantive work; valid values are `deep`, `scoped`, and `artifact_only`. | workflow | `docs/interview-convention.md`, `scripts/upgrade-alignment-page.mjs`, `tests/layer1/frontmatter.test.ts` | High |
| `visual_tier` | The skill frontmatter field that declares the expected alignment-page rendering tier: `document`, `visual`, or `prototype`. | workflow | `docs/skill-anatomy.md`, `docs/alignment-page-convention.md`, `scripts/upgrade-alignment-page.mjs` | High |
| `Deep interview` | Public label for `context_intake: deep`, meaning broad upfront discovery, assumptions validation, and checkpoints before durable output. | workflow | `docs/interview-convention.md`, `scripts/upgrade-alignment-page.mjs` | High |
| `Scoped intake` | Public label for `context_intake: scoped`, meaning focused clarification for bounded tasks or known artifacts before execution. | workflow | `docs/interview-convention.md`, `scripts/upgrade-alignment-page.mjs` | High |
| `Artifact-driven` | Public label for `context_intake: artifact_only`, meaning the skill primarily works from supplied artifacts and visible context; it does not require a pre-work discovery interview, but may still ask blocker questions. | workflow | `docs/interview-convention.md`, `scripts/upgrade-alignment-page.mjs` | High |

## Acronym Candidates

| Acronym | Expansion | Source evidence |
| --- | --- | --- |
| `YAML` | YAML Ain't Markup Language; the structured data syntax used for SKILL.md frontmatter and alignment-page approval payloads. | `docs/skill-anatomy.md`, `docs/alignment-page-convention.md` |

## Conflicting Or Retired Terms

| Term or wording | Current decision | Evidence | Follow-up impact |
| --- | --- | --- | --- |
| `interview_depth` | Retired active frontmatter key. Active non-archived skills should use `context_intake`. | `docs/interview-convention.md`, `tests/layer1/frontmatter.test.ts` | Keep only migration notes and regression tests; do not expose as a long-term alias. |
| `full`, `light`, `none` | Retired intake values mapped to `deep`, `scoped`, and `artifact_only`. | `docs/interview-convention.md` | Use the new labels in docs and generated guidance. |
| `interrogation` | Avoid as public terminology for skill intake. | `docs/workflow-refactor-proposal.html`, active skill wording checks | Use `Deep interview`, `Scoped intake`, or `Artifact-driven` depending on the metadata value. |

## Evidence Matrix

| Proposed change | Evidence | Inference | Confidence | Decision impact |
| --- | --- | --- | --- | --- |
| Bootstrap starter glossary terms after approval | No `research/glossary.md` exists, and the new metadata convention is now used across docs, scripts, tests, and showcase types. | Readers need one canonical vocabulary source for the new field and labels. | High | Approval creates `research/glossary.md` with the eight starter terms. |
| Use `context_intake` as canonical | Docs define the field; generator and catalog consumers read it; frontmatter tests reject the retired key. | The migration should not preserve `interview_depth` as an active alias. | High | Approved glossary should define only `context_intake` as the live field. |
| Preserve `type` as broad workflow category | `docs/skill-anatomy.md` lists type categories separately from context intake. | Interaction cadence and workflow category are independent metadata axes. | High | Glossary should prevent future pressure to reclassify intake behavior as `type`. |
| Treat `visual_tier` as discoverable metadata | Alignment convention, generator, catalog, parity audit, and types now expose or validate it. | Visual rendering tier is part of the same metadata vocabulary family. | High | Glossary should define the field alongside `context_intake`. |
| Use public intake labels instead of "interrogation" | Convention docs and active wording checks now use Deep interview, Scoped intake, and Artifact-driven. | Public docs should describe user experience in neutral product language. | High | Glossary entries should use the public labels and avoid the retired wording. |

## Source Coverage Gaps

- Archived skills and archived alignment pages were intentionally excluded from active metadata migration checks.
- Historical benchmark run logs may still contain old public wording because they are execution evidence, not active skill contracts.
- Final glossary status remains unconfirmed until the review page receives final compiled YAML.

## Proposed Canonical Glossary Write After Approval

Create `research/glossary.md` in flat parent format:

```markdown
# Glossary

> Last updated: 2026-06-12 | Sources: 8 docs | Terms: 8

## Terms

| Term | Definition | Source | Category | Status |
|------|-----------|--------|----------|--------|

## Acronyms

| Acronym | Expansion | Source |
|---------|-----------|--------|

## Recently Added

| Term | Added | Source Skill | Approved In |
|------|-------|-------------|-------------|
```

If approved, every starter term should be written with `Status` set to `confirmed`, source paths from the evidence table, `Source Skill` set to `$repo-glossary`, and `Approved In` set to `alignment/repo-glossary-skill-conventions.html`.

## Open Review Questions

- Does the starter term set cover the metadata vocabulary needed for the `context_intake` migration?
- Should `research/glossary.md` remain absent until final compiled YAML, or should the user approve creating it now through the page?
- Are the proposed definitions narrow enough to prevent future confusion between `type`, `context_intake`, and `visual_tier`?

## Proposed File Changes After Approval

- Create `research/glossary.md` with Terms, Acronyms, and Recently Added tables.
- Add the eight approved starter terms as `confirmed`.
- Add `YAML` to the Acronyms table.
- Convert `alignment/repo-glossary-skill-conventions.html` from `review` to `confirmed` and preserve the approval record.
- Archive this working packet under `docs/history/archive/YYYY-MM-DD/HHMMSS/research/_working/preliminary-repo-glossary-research.md` and remove the active working packet.
