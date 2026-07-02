# Current Task State

## Current Implementation - BIP Page Location And Fresh-Audience Clarity

Project: `agentic-skills`.

### Goal

Improve Build-In-Public output so generated posts are understandable to a fresh audience and stop adding top-level `alignment/bip-*.html` pages. Standardize BIP page output under a dedicated `alignment/bip/` location.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for canonical conventions, tests, generated bundles, and task docs.
- Reason: this changes shared alignment/BIP contracts, audit behavior, generated per-skill bundles, and regression tests.
- Safety boundary: do not change GitHub Actions, do not publish, and preserve pre-existing package version/manifest working-tree changes unless a required generator intentionally touches them.

### Plan

- [x] Inspect the canonical BIP convention, social-output routers, audit script, and focused tests.
- [x] Update `docs/alignment-page-convention.md` so post-confirmation BIP pages live at `alignment/bip/{skill-name}.html`.
- [x] Add fresh-audience context requirements to BIP generation: explain project/work context, define jargon, state why the work matters, and tie each post angle to an understandable public hook.
- [x] Update social post/video output-shape guidance where needed so generated candidates carry audience/context fields.
- [x] Update `scripts/audit-alignment-pages.mjs` and focused tests to enforce the new BIP path shape and clarity fields.
- [x] Regenerate alignment convention bundles and packaged assets as needed.
- [x] Run focused verification and record results.
- [x] Commit and push intended changes on `master` while preserving unrelated dirty work.

### Acceptance Criteria

- [x] Generated alignment convention text names `alignment/bip/{skill-name}.html`, including archive paths under `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/bip/{skill-name}.html`.
- [x] Active BIP audit accepts and enforces the dedicated `alignment/bip/` directory, and rejects stale top-level or old checkpoint shapes.
- [x] BIP candidates must include fresh-audience context, jargon expansion, public-facing significance, source basis, claim safety, risk level, publish precheck, loaded convention path, and recommendation status.
- [x] Central alignment index guidance treats `alignment/bip/*.html` as BIP review/help pages without making them look like new primary alignment pages.
- [x] Focused tests cover the new path and required context fields.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/audit-alignment-pages.mjs`
- `npm test -- tests/layer1/alignment-gates.test.ts tests/layer1/ship-end-bip.test.ts tests/layer1/audit-alignment-pages.test.ts`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `node scripts/upgrade-alignment-page.mjs --check` passed: 311 generated bundles exact, 313 output paths exact.
- `node scripts/audit-alignment-pages.mjs` passed: 61 active pages exact, 1 post-confirmation BIP page exact, 61 index entries exact.
- `npm test -- tests/layer1/alignment-gates.test.ts tests/layer1/ship-end-bip.test.ts tests/layer1/audit-alignment-pages.test.ts` could not run because the repo has no root `test` script.
- `npx vitest run tests/layer1/alignment-gates.test.ts tests/layer1/ship-end-bip.test.ts tests/layer1/audit-alignment-pages.test.ts` passed: 3 files, 75 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.
- BIP implementation committed and pushed on `master`: `2d6548b17 fix: standardize bip page output`.
- Pre-existing dirty package files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Paused Implementation - Create YouTube Meta Research Skill

This section is preserved from the pre-existing task state and is intentionally not part of release-prep metadata and changelog work.
