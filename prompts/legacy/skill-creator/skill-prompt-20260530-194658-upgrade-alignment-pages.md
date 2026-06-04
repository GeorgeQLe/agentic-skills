---
skill: skill-creator
agent: codex
captured_at: 2026-05-30T19:46:58-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Create `upgrade-alignment-pages` Skill

## Summary
Add a new `alignment-page-admin` pack skill named `upgrade-alignment-pages` that upgrades existing `alignment/*.html` review pages to the repo’s current HTML alignment-page standard while preserving page-specific research, decisions, questions, gates, and review context.

The skill will target generated HTML artifacts only, not the shared convention source or bundled `ALIGNMENT-PAGE.md` files.

## Key Changes
- Add `packs/alignment-page-admin/codex/upgrade-alignment-pages/SKILL.md` with `version: v0.0`, `type: utility`, and invocation `$upgrade-alignment-pages`.
- Add matching `packs/alignment-page-admin/claude/upgrade-alignment-pages/SKILL.md` so the pack stays platform-parity with the existing admin skill.
- Add `packs/alignment-page-admin/codex/upgrade-alignment-pages/agents/openai.yaml` with concise UI metadata.
- Update `packs/alignment-page-admin/PACK.md` to list the new skill.

## Skill Behavior
- Default mode is audit/dry-run:
  - Locate project-root `alignment/`.
  - Exclude `alignment/index.html`.
  - Inspect each `.html` page for drift against the latest local standards from `AGENTS.md`, `CLAUDE.md`, and any bundled `ALIGNMENT-PAGE.md` conventions found in the repo.
  - Report pages needing upgrade and the missing standard features.
- Apply mode is explicit via user wording like “apply”, “upgrade”, or `$upgrade-alignment-pages --apply`.
  - Archive each page before replacing it at `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/<filename>.html`.
  - Rewrite pages contextually, preserving original substantive content and page-specific decisions.
  - Add or modernize required standard elements: dark-mode styling, inline gates, section feedback controls, feedback-only YAML, final answer YAML, copy fallback behavior, unanswered-question handling, and diff/change highlighting where relevant.
  - Do not replace page content with a generic template.
  - Regenerate or recommend `$compile-central-alignment` after successful upgrades.
- Constraints:
  - Do not edit `CLAUDE.md`, `AGENTS.md`, `SKILL.md`, or bundled `ALIGNMENT-PAGE.md` files.
  - Do not modify non-alignment HTML files.
  - Stop and report if a page cannot be upgraded without likely content loss.

## Repository Process
- Before implementation, capture the visible user invocation under `prompts/skill-creator/` per repo convention.
- Write task plan entries to `tasks/roadmap.md` and `tasks/todo.md` before file edits.
- Because this creates tracked skill files, finish implementation by validating, committing, and pushing unless the user explicitly says not to.

## Test Plan
- Run `scripts/skill-versions.sh` to confirm every new `SKILL.md` has `version: v0.0`.
- Run `scripts/validate-skills-showcase-data.sh`; if it reports stale generated assets, regenerate with the listed scripts and include those updates.
- Run `scripts/pack.sh which upgrade-alignment-pages` to confirm pack discovery.
- Inspect generated skill metadata and `PACK.md` entries.
- Optional manual acceptance: install or refresh `alignment-page-admin`, invoke `$upgrade-alignment-pages` in dry-run mode in a repo with `alignment/*.html`, and verify it reports drift without mutating files.

## Assumptions
- The canonical “new standards” are local repo standards, not web-fetched external standards.
- Existing HTML pages are review artifacts and may be rewritten only with explicit apply intent.
- The skill belongs in `alignment-page-admin` because it manages alignment-page artifacts rather than creating product/research deliverables.
