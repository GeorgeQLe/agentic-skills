---
skill: repo-glossary
agent: codex
captured_at: 2026-06-12T13:04:15-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Synchronize Skill Metadata Docs And Bootstrap Repo Glossary

## Summary
- Make `context_intake` the canonical frontmatter field for user/context intake, replacing `interview_depth`.
- Use values `deep`, `scoped`, and `artifact_only`.
- Synchronize docs, generators, catalog data, audits, and glossary starter content so the terminology is consistent and discoverable.
- Preserve `type` as the broad workflow category: `planning`, `research`, `analysis`, `execution`, `review`, `shipping`, `ops`, `router`.

## Key Changes
- Update skill frontmatter:
  - Convert `interview_depth: full` to `context_intake: deep`.
  - Convert `interview_depth: light` to `context_intake: scoped`.
  - Convert `interview_depth: none` to `context_intake: artifact_only`.
  - Remove `interview_depth` from active non-archived `SKILL.md` files.
- Update documentation:
  - Rename `docs/interview-convention.md` conceptually to a context-intake convention, or rewrite it in place if avoiding a file rename.
  - Update `docs/skill-anatomy.md` to list `context_intake` and `visual_tier` in the optional frontmatter reference.
  - Update `docs/orchestrator-convention.md` only where frontmatter examples or routing language need the new field.
  - Public wording should use "Deep interview," "Scoped intake," and "Artifact-driven," not "interrogation."
- Update tooling:
  - Change `scripts/upgrade-alignment-page.mjs` to read `context_intake` from frontmatter instead of hardcoded full/light skill sets.
  - Update catalog parsing in `scripts/catalog/index.mjs` and Skills Showcase types/data to expose `contextIntake`.
  - Update mirror parity audit frontmatter keys to include `context_intake` and `visual_tier` where mirrored skills should match.
- Bootstrap glossary:
  - Refresh `research/_working/preliminary-repo-glossary-research.md` with new terms for `Frontmatter`, `Skill metadata`, `type`, `context_intake`, `visual_tier`, `Artifact-driven`, `Scoped intake`, and `Deep interview`.
  - Create or update the review alignment page for glossary approval.
  - After final approval, create `research/glossary.md` in flat glossary format with approved starter terms.

## Test Plan
- Static checks:
  - `rg "interview_depth" docs scripts apps tests global packs .codex/skills --glob '!**/archive/**'` should return no active references except migration notes if intentionally kept.
  - Verify active `SKILL.md` files use only `context_intake`.
- Generator checks:
  - Run the alignment-page generator dry run and confirm no unexpected drift after regenerated bundles.
  - Regenerate Skills Showcase data if catalog shape changes.
- Unit/audit checks:
  - Run affected layer1 tests for alignment-page generation, interview/context cadence, skill inventory/catalog behavior, and mirror parity.
  - Run `git diff --check`.
- Glossary checks:
  - Confirm `research/glossary.md` has Terms, Acronyms, and Recently Added tables.
  - Confirm every new glossary term has source references and status `confirmed` only after approval.

## Assumptions
- `context_intake` is the chosen canonical field.
- `interview_depth` will not remain as a long-term alias.
- `artifact_only` means no required pre-work discovery interview, not "never ask questions."
- The glossary write should follow the existing repo-glossary approval flow: working packet and alignment review first, canonical `research/glossary.md` only after approval.
