# Current Task State

## Current Implementation - Refactor BIP To Post-Approval HTML Output

Project: `agentic-skills`.

### Execution Profile

- Parallel mode: serial edits, parallel read-only inspection where useful.
- Reason: the canonical alignment convention, generated bundled instructions, social-routing docs, package-boundary tests, and audit script share one workflow contract and must stay synchronized.
- Safety boundary: do not create or modify GitHub Actions; do not publish social posts or write social-ledger records; preserve unrelated working-tree changes if they appear.

### Plan

- [x] Capture the visible `exec` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect the current BIP alignment convention, social post/video conventions, `idea-scope-brief` Codex and Claude skill instructions, audit diagnostics, and package tests.
- [x] Update the canonical alignment-page convention so BIP is a post-confirmation artifact at `alignment/bip-{skill-name}.html`, archived before replacement, indexed, and opened after the skill concludes.
- [x] Update social routing conventions so enabled BIP mode loads every bundled channel convention, with `alignment.bip_platforms` used only as prioritization metadata.
- [x] Update Codex and Claude `idea-scope-brief` instructions so the one-time BIP prompt enables `set-bip on`, dismisses the prompt, and generates/opens `alignment/bip-idea-scope-brief.html` after `idea-brief.md` is written.
- [x] Revise alignment-page auditing and package-boundary expectations for the new post-confirmation BIP page shape and exhaustive channel behavior.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundles and run the requested focused verification.
- [x] Document results, produce a ship manifest, commit, and push intended changes on `master`.

### Acceptance Criteria

- BIP is no longer specified as a pre-final Stage 2 halfway approval gate.
- Enabled BIP creates a review/help HTML artifact after approved canonical markdown is written and the alignment page is confirmed.
- The BIP artifact path is `alignment/bip-{skill-name}.html`, is archived before replacement, is linked from `alignment/index.html`, and is opened after the skill concludes.
- The BIP page lists exhaustive post candidates for every bundled social channel, including recommendation notes, source basis, claim-safety notes, risk, publish precheck, and `recommended` / `not-now` / `rejected` status.
- `set-bip on` means automatic exhaustive BIP generation with no extra BIP approval gate.
- `alignment.bip_platforms` remains supported as optional ranking/prioritization metadata, not as a filter.
- `idea-scope-brief` keeps the one-time BIP enablement prompt and generates/opens `alignment/bip-idea-scope-brief.html` after `idea-brief.md` writes when BIP is enabled.
- Audit and package-boundary tests reflect the new post-confirmation BIP contract.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/upgrade-alignment-page.mjs`
- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/audit-alignment-pages.mjs`
- `node --test packages/skillpacks/test/project-config.test.mjs packages/skillpacks/test/package-boundary.test.mjs`
- `npx skillpacks alignment verify`
- Additional focused tests if the audit or package-boundary changes expose narrower fixtures.

### Results

- Moved BIP in the canonical alignment convention from a pre-final Stage 2 checkpoint to a post-confirmation read-only page at `alignment/bip-{skill-name}.html`.
- Updated social post/video routing so active BIP loads every bundled channel convention; `alignment.bip_platforms` is retained only as priority/ranking metadata.
- Updated `idea-scope-brief` Codex/Claude instructions to keep the one-time enablement prompt, run `set-bip on` plus `set-bip-prompt dismiss` on yes, and generate/open `alignment/bip-idea-scope-brief.html` after canonical artifacts are written and alignment is confirmed.
- Updated `ship-end` Codex/Claude BIP behavior to keep wrap-up post suggestions exhaustive across bundled channels and use saved platforms only for priority/ranking metadata.
- Reworked `scripts/audit-alignment-pages.mjs` to validate post-confirmation BIP pages and fail stale checkpoint metadata, while no longer requiring Stage 2 BIP checkpoint gates.
- Regenerated generated `ALIGNMENT-PAGE.md` bundles, skillpacks manifest, and public skills-catalog export; archived and bumped modified SKILL.md files per skill-versioning rules.
- Verification passed:
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `node scripts/audit-alignment-pages.mjs`
  - `node --test packages/skillpacks/test/project-config.test.mjs packages/skillpacks/test/package-boundary.test.mjs`
  - `npm --workspace skillpacks run test:node`
  - `pnpm --dir tests test:layer1 -- audit-alignment-pages alignment-gates ship-end-bip social-ledger-convention`
  - `npm --workspace skillpacks run build:check`
  - `scripts/validate-skills-catalog-export.sh`
  - `node packages/skillpacks/bin/skillpacks.mjs alignment verify`
  - `scripts/skill-archive-audit.sh --strict`
  - `scripts/skill-versions.sh --missing`
  - `scripts/base-skill-version-parity-audit.sh`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`
- `npx skillpacks alignment verify` was attempted and failed in this checkout with `sh: gskp: command not found`; the local packaged CLI equivalent above passed.
