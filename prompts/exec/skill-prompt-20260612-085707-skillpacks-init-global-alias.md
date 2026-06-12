---
skill: exec
agent: codex
captured_at: 2026-06-12T08:57:42-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Add `skillpacks init --global` Alias

## Summary
Add an npm CLI compatibility alias so the intuitive command `npx skillpacks init --global` performs the same global-core install as `npx skillpacks init-global`, while preserving current `npx skillpacks init` project-local behavior.

## Key Changes
- In `packages/skillpacks/src/cli/run-pack-script.mjs`, route `init --global` to the existing `init-global` implementation: require `bash`, then run packaged `init.sh`.
- Keep `init` with any other argument rejected.
- Update CLI help/docs to list both:
  - `init` for project-local base skills
  - `init --global` / `init-global` for user-home global core skills
- Do not change global install semantics: only global core skills, no domain packs globally.

## Test Plan
- Add lifecycle/CLI tests covering:
  - `skillpacks init --global --help` reaches packaged `init.sh --help`
  - `skillpacks init --bad` still errors
  - `skillpacks init` still installs project-local base skills
- Run:
  - `npm --workspace skillpacks run test:node`
  - `npm --workspace skillpacks run build:check`

## Assumptions
- `init-global` remains supported for backward compatibility.
- `init --global` refreshes globals from the package snapshot being run; it will not fetch GitHub or update a source checkout.
- Prompt-history capture for this skill invocation is deferred because the current session is in Plan Mode, which prohibits tracked-file mutations.
