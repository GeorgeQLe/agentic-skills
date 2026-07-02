# Current Task State

## Current Implementation - BIP Prompt And Blocker Cleanup

Project: `agentic-skills`.

### Goal

Make `idea-scope-brief` the only skill that may ask a Build-In-Public (BIP) gate question. Everywhere else, BIP is non-blocking read-only output behavior. `ship` and `ship-end` may ask about BIP only as a terminal-only prompt after reporting, and only when `.agents/project.json.alignment.build_in_public` is absent.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for canonical conventions, shipping skills, tests, generated bundles, catalog exports, and task docs.
- Reason: the change touches shared workflow policy, generated alignment bundles, mirrored `ship`/`ship-end` skill contracts, versioned skill archives, and catalog metadata.
- Safety boundary: do not edit generated `.claude/skills/**` or `.codex/skills/**` local roots; do not run npm publish, deploy, or GitHub Actions; preserve unrelated pre-existing package/export dirty state unless regeneration for this task intentionally updates it.

### Plan

- [x] Inspect BIP language in `CLAUDE.md`, generated alignment convention bundles, `ship`/`ship-end` skills, tests, and repo status.
- [x] Archive and version the four active source shipping skills before behavior changes.
- [x] Update shared BIP policy so `idea-scope-brief` is the only BIP gate-question owner and all other BIP output is read-only/non-blocking.
- [x] Update `ship` and `ship-end` contracts for terminal-only absent-setting prompting, explicit-false suppression, and no BIP blockers/review gates.
- [x] Regenerate bundled alignment-page conventions from `docs/alignment-page-convention.md`.
- [x] Refresh skills catalog exports required by skill changes while preserving unrelated package metadata.
- [x] Run focused tests, archive/generator audits, task-doc audit, and diff hygiene checks.
- [x] Commit and push the intended BIP cleanup boundary on the primary branch while preserving unrelated dirty work.

### Acceptance Criteria

- [x] `CLAUDE.md` states BIP is never a blocker, required approval gate, required review step, or downstream-routing prerequisite outside `idea-scope-brief`.
- [x] `ship`/`ship-end` treat `alignment.build_in_public: false` as "do not ask and do not generate BIP."
- [x] `ship`/`ship-end` prompt only in terminal output when `alignment.build_in_public` is absent and `alignment.bip_prompt_dismissed !== true`.
- [x] BIP output remains generated only when enabled or explicitly invoked, and it is read-only help/review content.
- [x] Active non-archived skill/convention text has no BIP blocker language except the allowed `idea-scope-brief` gate and normal non-BIP alignment approval gates.
- [x] Changed `SKILL.md` files are archived, versioned, and have changelog entries.
- [x] Generated catalog exports validate.

### Test Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `npx vitest run tests/layer1/ship-end-bip.test.ts tests/layer1/alignment-gates.test.ts`
- `bash scripts/skill-archive-audit.sh --strict`
- `node scripts/generate-skills-catalog-export.mjs`
- `scripts/validate-skills-catalog-export.sh`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- `node scripts/upgrade-alignment-page.mjs --check` passed: 313 output paths exact, 311 generated bundles exact.
- `npx vitest run tests/layer1/ship-end-bip.test.ts tests/layer1/alignment-gates.test.ts` passed: 2 files, 49 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `scripts/validate-skills-catalog-export.sh` passed after regenerating and staging `exports/skills-catalog/v1/`.
- `node scripts/audit-task-docs.mjs` passed: failures 0, warnings 0.
- `git diff --check` passed.
- Focused BIP prompt grep confirmed only `idea-scope-brief` owns the kickoff gate question; `ship` and `ship-end` are terminal-only and absence-gated.
- Pre-existing unrelated package files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Historical Implementation - SKILL.md Language Deduplication Review

Project: `agentic-skills`.

### Goal

Review active `SKILL.md` files for duplicated language within the same document and repeated language between a `SKILL.md` and the Markdown documents it directly references. Remove or consolidate redundant prose without changing skill behavior.

### Execution Profile

- Parallel mode: parallel read-only inspection where useful; serial edits for skill/reference/task docs.
- Reason: this is a broad documentation-quality pass across active skill contracts and directly referenced companion docs.
- Safety boundary: exclude archived `SKILL.md` snapshots unless directly referenced by an active skill, preserve unrelated dirty package files, and avoid GitHub Actions.

### Plan

- [x] Inspect repo guidance, lessons, current task state, and active `SKILL.md` inventory.
- [x] Build or run an audit for repeated normalized paragraphs within active skills and against direct Markdown references.
- [x] Review high-signal duplicate findings and classify each as intentional mirror, generated convention copy, or redundant local prose.
- [x] Patch only clear same-document or skill/reference duplication with minimal wording changes.
- [x] Run targeted duplicate audit, archive/version audit if skills change, diff checks, and status checks.
- [x] Commit and push intended changes on the primary branch while preserving unrelated dirty work.

### Acceptance Criteria

- [x] No clear duplicated paragraphs remain within an edited active `SKILL.md`.
- [x] No edited active `SKILL.md` repeats substantial prose from its direct Markdown references when a pointer or shorter instruction is sufficient.
- [x] Behaviorally important instructions remain present in either the skill or the referenced document.
- [x] Verification output is recorded in the Review section.

### Test Plan

- Duplicate audit script/check used for this task.
- `bash scripts/skill-archive-audit.sh --strict` if active `SKILL.md` files change.
- `git diff --check`
- `git status --short --branch`

### Review

Verified:

- Normalized duplicate audit over 413 active source `SKILL.md` files found `ref_exact_count: 0` and `ref_overlap_count: 0` after edits. The remaining intra-file matches are the intentional generated target policy blocks inside `base/claude/provision-agentic-config/SKILL.md`.
- `node scripts/upgrade-alignment-page.mjs --check` passed: 313 output paths exact, 311 generated bundles exact.
- `npx vitest run tests/layer1/alignment-gates.test.ts tests/layer1/positioning-alignment-contract.test.ts` passed: 2 files, 42 tests.
- `bash scripts/skill-archive-audit.sh --strict` passed: 413 skills checked, 0 violations.
- `git diff --check` passed.
- Pre-existing dirty package files were preserved out of scope: `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

## Historical Implementation - BIP Page Location And Fresh-Audience Clarity

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
