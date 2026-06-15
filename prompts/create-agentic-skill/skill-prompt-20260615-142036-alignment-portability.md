---
skill: create-agentic-skill
agent: codex
captured_at: 2026-06-15T14:20:36-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Alignment Portability Plan

## Summary
Make alignment-page creation and verification work in repos that only install skills via `npx skillpacks`, without assuming this source repo’s `docs/` and `scripts/` are present. The fix is to expose all required alignment operations through the `skillpacks` CLI and update generated conventions/skills to prefer those portable commands.

## Key Changes
- Add `scripts/open-html-page.mjs` to the npm package build and `package.json` `files`, then expose it as `npx skillpacks alignment pages open <alignment/page.html> [--browser auto|brave|chrome|safari|edge|default]`.
- Update `docs/alignment-page-convention.md` so generated `ALIGNMENT-PAGE.md` bundles prefer:
  - `npx skillpacks alignment pages open alignment/{skill-name}-{topic}.html --browser auto`
  - `npx skillpacks alignment pages audit`
  - `npx skillpacks alignment pages inject-tts alignment/{page}.html`
  with repo-local `node scripts/...` commands only as source-checkout fallbacks.
- Update `packages/skillpacks/src/cli/run-pack-script.mjs` to resolve and run the packaged opener script, validate safe `alignment/*.html` paths, and keep the same open statuses: `focused`, `opened`, `fallback-opened`, `blocked`, `failed`.
- Ensure `alignment pages inject-tts` continues copying `scripts/alignment-tts-kokoro.js` into the target repo before page audit/open workflows need it.
- Create the future `$create-alignment-page` skill around the portable contract: read bundled per-skill convention when available, otherwise use packaged convention guidance via `npx skillpacks`; audit and open through `npx skillpacks alignment ...`.

## Tests
- Add package staging tests proving `scripts/open-html-page.mjs` is included in the npm build and denied source-repo paths remain excluded.
- Add CLI parsing tests for `alignment pages open`, including valid `alignment/foo.html`, rejected path traversal, browser flag handling, and dry-run/json passthrough if supported by the script.
- Update layer1 convention tests so generated `ALIGNMENT-PAGE.md` files contain the portable `npx skillpacks alignment pages open` command and no longer require source-local `node scripts/open-html-page.mjs` as the primary path.
- Run:
  - `npm --workspace packages/skillpacks run test:node`
  - `npm --workspace packages/skillpacks run build:check`
  - `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/audit-alignment-pages.test.ts layer1/compile-central-alignment.test.ts`

## Assumptions
- External target repos can run `npx skillpacks` when they have installed skills from the npm package.
- Repo-local scripts remain useful for this source checkout, but generated skill instructions should default to portable npm CLI commands.
- Browser opening stays best-effort and non-fatal; a blocked open should report the absolute path and not fail an otherwise valid alignment page workflow.
