---
skill: exec
agent: codex
captured_at: 2026-07-08T09:43:36-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Plan: Identify and Patch the Next Package Validation Bottleneck

## Summary
Profile the package validation path, identify the single largest reproducible local bottleneck, and patch it only if the fix is low-risk and preserves package/release correctness. Target scope is package validation: `test:node`, `build:check`, `verify:package`, and their slowest component tests/scripts.

## Key Changes
- Preserve the active canary closeout work already in the tree:
  - Record starting `git status --short --branch --untracked-files=normal`.
  - Do not overwrite unrelated task-doc edits or release-state edits unless they are already part of the active closeout source state.
  - Do not run `npx skillpacks install/init/which` in this repo.

- Profile before patching:
  - Run package checks serially because `test:node`, `build:check`, and `verify:package` share `packages/skillpacks/build`.
  - Use `npm_config_cache=/tmp/skillpacks-npm-cache` for npm-based commands.
  - Capture timings for:
    - `npm --workspace packages/skillpacks run test:node`
    - `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check`
    - `SKILLPACKS_PACKAGE_LANE=canary npm_config_cache=/tmp/skillpacks-npm-cache npm --workspace packages/skillpacks run verify:package`
    - Any slow individual test files surfaced by `node --test` output.

- Patch only confirmed duplicate or avoidable work:
  - Prefer test-side or script-side caching where the same generated manifest, package staging result, or `npm pack --dry-run` result is recomputed against identical inputs.
  - Keep at least one full package staging and one full `npm pack --dry-run` check for every distinct lane/package-state combination under test.
  - Do not weaken package boundary allow/deny assertions, release lane assertions, manifest freshness checks, or publish/recovery behavior.
  - If no low-risk patch yields clear savings, document the measured bottleneck and stop without source changes.

- Update repo tracking:
  - Update `tasks/todo.md` and `tasks/roadmap.md` with the active bottleneck plan, measurements, accepted/rejected patch rationale, and final verification.
  - If tracked package source changes require a manifest fingerprint refresh, regenerate only the relevant canary manifest and verify it.

## Test Plan
- Baseline and after timings:
  - Full `test:node` elapsed time and slowest test-file blocks.
  - Focused timing for the patched file/script.
  - `build:check` and `verify:package` elapsed time if the patch touches build/package behavior.

- Required correctness checks after any patch:
  - Focused affected tests.
  - `npm_config_cache=/tmp/skillpacks-npm-cache npm --workspace packages/skillpacks run test:node`
  - `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check`
  - `SKILLPACKS_PACKAGE_LANE=canary npm_config_cache=/tmp/skillpacks-npm-cache npm --workspace packages/skillpacks run verify:package`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`

- Final safety:
  - Confirm `git status --short --branch --untracked-files=normal` shows only intended changes plus any pre-existing unrelated files.
  - Commit and push intended tracked changes if a patch is made.

## Assumptions
- “Next bottleneck” means the next slowest local package validation bottleneck, not the publish pipeline.
- A patch is acceptable only if it reduces repeated validation work without reducing release/package coverage.
- Parallelizing commands that write `packages/skillpacks/build` is out of scope unless the implementation first isolates build output paths.
- Real npm publishing and npm dist-tag mutation are out of scope.
