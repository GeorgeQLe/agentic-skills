# Ship Manifest - Documentation Alignment Audit

Date: 2026-06-10

## Scope

Run a repository documentation alignment audit and ship the audit artifacts only. This report does not remediate the documented inconsistencies.

## Intended Files

- `prompts/devtool-docs-audit/skill-prompt-20260610-192917-documentation-alignment-audit.md`
- `research/devtool-docs-audit.md`
- `alignment/devtool-docs-audit-documentation-alignment.html`
- `alignment/index.html`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-docs-alignment-audit.md`

## Findings Summary

- P1: active install docs still use symlink/re-symlink wording for active managed-copy installs.
- P1: `scripts/init-agentic-skills.sh` is documented but missing at the repository root.
- P1: current docs and indexed alignment pages still route to retired `icp` instead of `customer-discovery`.
- P1: the old npm strategy page remains indexed as current-looking guidance despite stale `agentic-skills` package examples.
- P2: npm docs still contain future/release-candidate wording after `skillpacks@0.1.0` publication.
- P2: Skills Showcase count docs conflict with current generated data.

## Verification

- `node scripts/audit-alignment-pages.mjs` - passed, 45 active pages with exact TTS, metadata, viewport, embed, and index integrity.
- `node scripts/upgrade-alignment-page.mjs --check` - passed, generated bundles exact.
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` - passed, 14/14 tests.
- `git diff --check` - passed.
- Targeted scans reconfirmed the reported drift for retired `icp` routes and generated Skills Showcase counts.
- `node scripts/open-html-page.mjs alignment/devtool-docs-audit-documentation-alignment.html --browser auto` returned `blocked`; file-level validation remained clean.

## Unrelated Local Work Left Untouched

The audit did not stage or modify the pre-existing unrelated local changes reported before this work:

- `alignment/user-flow-map-deck-creation.html`
- `docs/history/archive/2026-06-10/192601/`
- `specs/skills-showcase/`
