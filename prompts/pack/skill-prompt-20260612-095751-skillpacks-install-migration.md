---
skill: pack
agent: codex
captured_at: 2026-06-12T09:57:51-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Migrate Skill Installs To `npx skillpacks install`

## Summary

Make `npx skillpacks install <pack-or-skill>` the standard agent-facing install route, while keeping agent-doc migration deterministic and safe. `doctor` remains read-only by default. Any `AGENTS.md` / `CLAUDE.md` migration must be marker-bounded, previewable, and backed up before write.

## Key Changes

- Update active install guidance so agents recommend `npx skillpacks install <pack-or-skill>`, not `/pack install` or `$pack install`.
- Update the canonical routing contract, active skills, `AGENTS.md`, `CLAUDE.md`, `provision-agentic-config`, package docs, and routing audit fixtures.
- Keep `/pack` / `$pack` references only where explicitly documented as legacy/source-checkout behavior or inside archived snapshots.
- Apply skill versioning for changed active `SKILL.md` files: archive current version, bump `version:`, update `CHANGELOG.md`.

## `doctor` And Agent Doc Migration

- Keep `npx skillpacks doctor` read-only.
- Add `npx skillpacks doctor --fix` for generated skill-root cleanup only:
  - Remove orphaned managed skill installs.
  - Convert old unpinned skill symlinks into managed package-copy installs.
  - Preserve pinned symlinks from `.agents/project.json.pinned_versions`.
  - Preserve unmanaged local skill directories.
- Add explicit agent-doc migration mode, e.g. `npx skillpacks doctor --fix --agent-docs`.
- Agent-doc migration must:
  - Edit only recognized `<!-- provision-agentic-config ... -->` blocks.
  - Replace only the generated block span; preserve all surrounding text byte-for-byte.
  - Refuse to edit if no marker, duplicate markers, malformed block boundaries, or unknown generated version.
  - Never perform broad `$pack install` / `/pack install` text replacement across the whole file.
  - Print a unified diff before applying.
  - Create timestamped backups under `.agents/backups/` before writing.
  - Report exact files changed and backup paths.
- Provide a dry-run path, e.g. `npx skillpacks doctor --fix --agent-docs --dry-run`, that prints the diff without writing.

## Tests

- Add lifecycle tests proving:
  - Plain `doctor` is read-only.
  - `doctor --fix` cleans generated skill roots without touching agent docs.
  - `doctor --fix --agent-docs --dry-run` prints diffs and writes nothing.
  - `doctor --fix --agent-docs` backs up and replaces only marked provision blocks.
  - User-authored text before/after provision blocks is preserved exactly.
  - Missing, duplicate, malformed, or unknown markers are refused safely.
- Update routing audit tests so active `/pack install` / `$pack install` guidance fails unless explicitly allowlisted.
- Run:
  - `scripts/skill-install-routing-audit.sh --active`
  - `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`
  - `npm --workspace skillpacks run test:node`
  - `npm --workspace skillpacks run build:check`
  - `npm --workspace skillpacks run verify:package`
  - `git diff --check`

## Assumptions

- “Agent docs” means root `AGENTS.md` and `CLAUDE.md`.
- Downstream arbitrary docs are not rewritten by `doctor`.
- Agent-doc migration is generated-block replacement, not semantic document editing.
- Actual archival of the `pack` skill remains a later follow-up after the migration audit is clean.
