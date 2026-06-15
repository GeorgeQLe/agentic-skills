---
skill: create-agentic-skill
agent: codex
captured_at: 2026-06-15T19:53:39-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix Alignment Fallback And npx Caveat Docs

## Summary
- Make the fix doc/skill-text only: `alignment bundles` remains a source/package-maintenance command, not a consumer fallback.
- Correct `create-alignment-page` so agents load the installed skill’s sibling `ALIGNMENT-PAGE.md` first, and if missing, report the missing bundled convention instead of recommending `npx skillpacks alignment bundles --check`.
- Document the narrowed npx expectation: transient `npx skillpacks ...` works when online/cache-warm; repeat/offline alignment workflows should add `skillpacks` as a devDependency or use an explicit pinned npm spec.

## Implementation Changes
- Update both `base/codex/create-alignment-page/SKILL.md` and `base/claude/create-alignment-page/SKILL.md`:
  - Remove the “packaged convention path via `alignment bundles --check`” fallback.
  - State that `alignment bundles --check` is only valid in source/package-shaped checkouts with `docs/`, `base/`, and `packs/`.
  - Add the fallback behavior: if no installed `ALIGNMENT-PAGE.md` exists, stop and report which skill convention is missing; do not invent a simplified template.
- Apply skill versioning hygiene:
  - Run `scripts/skill-archive.sh` for both create-alignment-page skill dirs before edits.
  - Bump each skill from `v0.0` to `v0.1`.
  - Add/update each skill’s `CHANGELOG.md` with the fallback-doc correction.
- Update public docs where the current wording overgeneralizes:
  - In README/Quickstart/package distribution docs, separate consumer-safe commands (`pages audit`, `pages inject-tts`, `pages open`, `pages serve`) from source-maintenance commands (`bundles`, `verify`).
  - Add one concise note that target repos needing reliable repeat/offline use should add `skillpacks` as a devDependency or run a pinned `npx skillpacks@<version> ...` command.
- Do not change CLI behavior, command names, package files, or `upgrade-alignment-page.mjs`.

## Test Plan
- Static text checks:
  - Confirm no create-alignment-page skill text recommends `alignment bundles --check` as a bare target repo fallback.
  - Confirm docs distinguish source-maintenance alignment commands from consumer-safe page commands.
  - Confirm the npx repeat/offline expectation appears in user-facing docs.
- Versioning checks:
  - Confirm archived `SKILL.md` copies exist under `archive/v0.0/`.
  - Confirm active create-alignment-page skills are `version: v0.1`.
  - Confirm changelog entries exist for `v0.1`.
- Regression checks:
  - `npm --workspace packages/skillpacks run test:node`
  - Any existing layer1 skill/version or routing tests relevant to skill metadata if present.
  - Optional sanity: rerun the bare-target reproduction and document that it still fails by design for `bundles --check`, while `pages` commands remain the consumer path.

## Assumptions
- The accepted fix is doc-only, so `alignment bundles --check` should not be made consumer-safe.
- No target repo `package.json` mutation is required; devDependency guidance is documentation, not enforced behavior.
- Existing packaged `ALIGNMENT-PAGE.md` copies installed beside skills remain the supported convention source for consumer repos.
