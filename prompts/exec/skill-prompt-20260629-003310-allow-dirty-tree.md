---
skill: exec
agent: codex
captured_at: 2026-06-29T00:33:10-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Add an Explicit Dirty-Tree Override to `publish.sh`

## Summary
Keep the default release behavior strict: `./publish.sh patch` still fails on tracked dirty files. Add an explicit escape hatch for known non-package dirty work, so a release can continue when unrelated files like `alignment/*.html`, `alignment/index.html`, `tasks/*`, or other non-published artifacts are present.

## Key Changes
- Add a new flag: `--allow-dirty-tree`.
  - Works with normal targets and dry runs, for example `./publish.sh --allow-dirty-tree patch` and `./publish.sh --dry-run --allow-dirty-tree patch`.
  - Does not apply to `--current` recovery’s existing release-metadata exception, which stays narrow and unchanged.
- Keep the hard block unless the flag is present.
  - Without the flag, current behavior remains: print `git status --short`, then fail on tracked changes.
  - With the flag, inspect dirty tracked paths and continue only if every dirty path is outside the npm package/release boundary.
- Treat dirty paths as release-impacting if they can affect the published package or release metadata.
  - Always reject dirty tracked paths under package inputs such as `packages/skillpacks/**`, `base/**`, `packs/**`, `scripts/**`, package-bundled docs/assets, `README.md`, `CHANGELOG.md`, and `LICENSE`.
  - Allow only non-package artifacts such as `alignment/**`, `tasks/**`, `prompts/**`, `tests/**`, `apps/**`, root agent docs, and other explicitly non-published paths.
- Improve diagnostics.
  - When blocked, group paths as “release-impacting dirty paths” and “non-release dirty paths”.
  - When continuing with the flag, print a warning that the release will not include those dirty changes and they must be committed or removed separately.
  - Keep the existing warning for untracked files, but include it in the same dirty-tree summary for clarity.

## Test Plan
- Add shell/script tests covering:
  - default tracked dirty path still blocks;
  - `--allow-dirty-tree` allows dirty `alignment/index.html` plus an untracked `alignment/*.html`;
  - `--allow-dirty-tree` rejects dirty package-impacting paths such as `packs/.../SKILL.md`, `scripts/audit-alignment-pages.mjs`, `docs/alignment-page-convention.md`, or `packages/skillpacks/package.json`;
  - flag parsing works with `--dry-run patch`, `patch --allow-dirty-tree`, and rejects unknown flags.
- Run:
  - `./publish.sh --dry-run --allow-dirty-tree patch` from a fixture or controlled dirty non-package state;
  - `npm --workspace skillpacks run test:node`;
  - `npm --workspace skillpacks run build:check`;
  - `node scripts/audit-task-docs.mjs`;
  - `git diff --check`.

## Assumptions
- The flag should be explicit every time; no environment variable or persistent config.
- The script should not auto-commit or auto-stage unrelated work.
- The release package must never include uncommitted package-impacting source, even when the override flag is used.
