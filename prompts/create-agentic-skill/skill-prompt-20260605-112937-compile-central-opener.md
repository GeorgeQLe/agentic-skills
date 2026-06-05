---
skill: create-agentic-skill
agent: codex
captured_at: 2026-06-05T11:29:42-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Default Open Behavior For Compiled Alignment Index

## Summary
- Treat `compile-central-alignment` as the default way to open/focus the central `alignment/index.html` after it regenerates the index.
- Keep individual alignment-producing skills opening their own newly created review page with `scripts/open-html-page.mjs`; `compile-central-alignment` will use the same opener for the index.
- `upgrade-alignment-pages` should not open pages itself; after apply-mode upgrades it should continue routing to `compile-central-alignment`, which will regenerate and open/focus the index.

## Key Changes
- Update both `packs/alignment-page-admin/{claude,codex}/compile-central-alignment/SKILL.md`:
  - Replace the old WSL-specific browser-open instructions with `node scripts/open-html-page.mjs alignment/index.html --browser auto`.
  - Require reporting the script status: `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`.
  - State that `blocked` does not fail the skill if `alignment/index.html` was generated and verified.
  - Keep compile as a local convenience artifact: only create/overwrite `alignment/index.html`, do not modify other alignment pages, do not commit/push the index by default.
- Apply repo skill-versioning rules:
  - Archive both current v0.0 `SKILL.md` files to `archive/v0.0/SKILL.md`.
  - Bump both compile-central mirrors to `version: v0.1`.
  - Add `CHANGELOG.md` entries for the default opener behavior.
- Refresh generated/public metadata if version changes affect catalogs:
  - Run the Skills Showcase data generator and validation.
  - Commit generated catalog changes only if they are direct consequences of the v0.1 bump.

## Test Plan
- Add or extend layer1 coverage for `compile-central-alignment` to assert:
  - Both Claude and Codex mirrors mention `scripts/open-html-page.mjs`.
  - Both use `alignment/index.html --browser auto`.
  - Both require status reporting and blocked-open non-failure.
  - Old `wslpath -w` / `cmd.exe /c start` opener language is removed from active compile-central skill contracts.
  - Versions, archives, and changelogs are present.
- Run:
  - `pnpm --dir tests exec vitest run --project layer1 <new-or-updated-compile-central-test>`
  - `bash scripts/skill-archive-audit.sh --strict`
  - `bash scripts/skill-mirror-parity-audit.sh`
  - `bash scripts/skill-pack-routing-audit.sh`
  - `bash scripts/skill-versions.sh --missing`
  - `node scripts/generate-skills-showcase-data.mjs` if catalog metadata changes
  - `bash scripts/validate-skills-showcase-data.sh` if generated data changes
  - `git diff --check`

## Assumptions
- “compile-alignment-pages” means the existing `compile-central-alignment` skill.
- Default behavior is: generate `alignment/index.html`, then open/focus it with the shared opener script.
- `upgrade-alignment-pages` remains generation/upgrade-focused and delegates index refresh/opening to `compile-central-alignment`.
