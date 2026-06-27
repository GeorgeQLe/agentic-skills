# Ship Manifest - Optional Human Review Summary Convention

Date: 2026-06-27

## Scope

- Updated the canonical design-tree loop convention so Terminal text owns optional human-review recaps for chunked handoffs.
- Added the `### Optional Human Review Summary` contract to the self-routing handoff format.
- Required every intra-skill chunked stop to append the optional human-review prompt after `## Invoke With YAML`.
- Defined yes-response behavior as terminal-only, no file writes, no approval decision, no HTML page unless explicitly requested, and derived from the just-written intermediate plus shared brief/durable cursor.
- Regenerated all tracked `DESIGN-TREE-LOOP.md` bundles for active design-tree skills.
- Refreshed generated project-local skill installs after source bundle regeneration; this produced no additional tracked diff.

## Verification

- `node scripts/upgrade-design-tree-loop.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `rg "Optional Human Review|Do you want a summary of what was executed this step" docs packs .codex/skills .claude/skills`
- `rg "per-section HTML review|non-approval and non-canonical|no file writes" docs packs .codex/skills .claude/skills`
- targeted Claude/Codex `user-flow-map` bundle scan across `packs/` and local installs
- `git diff --name-only -- '*SKILL.md'` (no active `SKILL.md` changes)
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Deploy

Not applicable. This change updates skill conventions, generated convention bundles, and task documentation; it does not modify a deployed runtime surface.
