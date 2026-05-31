---
name: upgrade-alignment-pages
description: Audit and explicitly upgrade generated alignment/*.html review pages to the current local alignment-page standard while preserving page-specific context
type: utility
version: v0.0
argument-hint: "[--repo <path>] [--apply] [alignment/*.html...]"
---

# Upgrade Alignment Pages

Invoke as `/upgrade-alignment-pages`.

Use this skill when a repository already has generated `alignment/*.html` review pages and the user wants to audit or update them against the current local alignment-page convention. This skill targets generated alignment HTML artifacts only.

## Inputs

- Default target repository: current working directory.
- Optional `--repo <path>` to target another repository.
- Optional explicit page paths under the target repository's `alignment/` directory.
- Optional `--apply`, or clear user wording such as "apply the upgrade" or "upgrade these pages", to allow page rewrites.

## Mode

- Default mode is audit/dry-run.
- The skill name alone is not apply intent; do not modify files unless the visible user request explicitly asks to apply or upgrade existing pages.
- In audit/dry-run mode, inspect pages and report drift without creating, editing, moving, or deleting any files.

## Workflow

1. Resolve scope:
   - Locate the project-root `alignment/` directory; stop if absent.
   - Enumerate `alignment/*.html`, excluding `alignment/index.html`.
   - If the user provided page paths, include only those paths after confirming they are inside the project-root `alignment/` directory.

2. Load local standards:
   - Read applicable local convention sources from `AGENTS.md`, `CLAUDE.md`, and active bundled `ALIGNMENT-PAGE.md` files found under `global/`, `packs/`, `.claude/skills/`, and `.codex/skills/`.
   - Treat those local files as read-only standards. Do not fetch external standards.
   - Extract the current required HTML behaviors: dark-mode styling, inline approval gates, section feedback controls, feedback-only YAML, final answer YAML, copy fallback behavior, unanswered-question handling, archive-before-replace behavior, and diff/change highlighting for updates.

3. Audit every selected page:
   - Read the whole HTML file before judging it.
   - Identify page-specific substance: title, meta/context, research findings, evidence/source matrices, assumptions, decisions, open questions, approval gates, review notes, proposed file changes, prior user feedback, and any page-specific scripts.
   - Report missing or stale standard features per page.
   - Classify each page as `current`, `upgrade-needed`, or `blocked-content-loss-risk`.

4. Stop on content-loss risk:
   - If a page's structure is too ambiguous to upgrade while preserving substantive content, do not rewrite it.
   - Report exactly what content could not be mapped and what human decision is needed.

5. Apply only when explicit:
   - Before replacing each page, archive the original to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/<filename>.html`.
   - Rewrite the page contextually from the original, preserving page-specific research, decisions, questions, gates, review context, and user feedback.
   - Add or modernize missing standard elements without replacing the page with a generic template.
   - Preserve relative links and keep the page self-contained unless the original already used explicit external resources.
   - Highlight upgrade changes where useful with inline notes, a change summary section, or scoped diff styling.

6. Verify after apply:
   - Confirm every changed page has a matching archive copy.
   - Re-open each changed page textually and confirm the preserved title, decisions/findings, questions, and gates still exist.
   - Run or recommend `/compile-central-alignment` so `alignment/index.html` reflects updated page metadata.

## Audit Report

Include:

- Target repository and mode.
- Standards sources read.
- Pages inspected and pages excluded.
- Per-page status with missing standard features.
- Content preservation risks or blockers.
- In apply mode, archive paths and changed page paths.
- Verification performed.
- Next action: usually `/compile-central-alignment` after successful apply, or no mutation needed when all pages are current.

## Constraints

- Do not edit `CLAUDE.md`, `AGENTS.md`, any `SKILL.md`, or any bundled `ALIGNMENT-PAGE.md` file.
- Do not modify non-alignment HTML files.
- Do not modify `alignment/index.html`; leave index regeneration to `/compile-central-alignment`.
- Do not rewrite pages in audit/dry-run mode.
- Do not replace page-specific content with a generic template.
- Stop and report when an upgrade is likely to lose research, decisions, questions, gates, or review context.
- Do not create or modify GitHub Actions workflows.

## Default Shipping Contract

- **Audit mode:** no file mutations; no commit or push.
- **Apply mode:** modified generated alignment pages and archive copies are normal repo artifacts. Follow the target repository's shipping rules after verification.
- **Default next-step routing:** after successful apply, `Recommended next command: /compile-central-alignment`; otherwise report the audit result and recommend no follow-up skill when no upgrades are needed.
