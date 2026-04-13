---
name: pack
description: Manage project-local skill packs and project designation without installing domain skills globally
type: ops
version: 1.0.0
argument-hint: "[list|status|recommend|install <pack>|remove <pack>|refresh]"
---

# Pack

Use this skill when the user wants to inspect, recommend, install, remove, or refresh project-local skill packs.

## Workflow

1. Parse `$ARGUMENTS`.
2. Run the matching helper command from this skill library:
   - `scripts/pack.sh list`
   - `scripts/pack.sh status`
   - `scripts/pack.sh recommend`
   - `scripts/pack.sh install <pack>`
   - `scripts/pack.sh remove <pack>`
   - `scripts/pack.sh refresh`
3. For `install`, `remove`, and `refresh`, report:
   - `.agents/project.json` project type and enabled packs
   - local skill links created or removed under `.claude/skills` and `.codex/skills`
   - any skipped links caused by non-symlink targets

## Pack Model

- Global skills are domain-neutral and installed by `install.sh`.
- Domain workflows live in project-local packs.
- Project designation is stored in `.agents/project.json`.
- Pack installs use symlinks back to this skill-library repository by default.

## Constraints

- Never install `packs/*` into `~/.claude/skills` or `~/.codex/skills`.
- Do not overwrite real directories or files in `.claude/skills` or `.codex/skills`; skip them with a warning.
- If local skill discovery is not available in the active assistant, treat `pack` as the launcher and read the project-local pack files directly.
