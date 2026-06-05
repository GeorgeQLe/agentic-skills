# Changelog

## v0.5

- Marked PoketoWork kanban packs as hibernated during the Poketo.work rebuild and removed kanban packs from active pack-selection guidance.

## v0.4

- Added source-level shipping guidance: commit `.agents/project.json` for pack configuration changes, but never stage or commit generated local skill roots under `.claude/skills/**` or `.codex/skills/**`.

## v0.3

- Clarified post-install skill visibility guidance: Claude Code can use live detection, `/reload-skills`, `/clear`, or restart depending on directory state, while Codex still needs a fresh session when the `$` list is stale.

## v0.2

- Copied managed installs now resolve the repository checkout via `.agentic-skills-managed` provenance before delegating to the root pack manager.

## v0.1

- Documented single-skill install/remove support through `$pack install <skill>` and `$pack remove <skill>`.
- Added `$pack which <skill>` to the advertised command surface and missing-skill resolution workflow.

## v0.0

- Initial Codex project-local pack management workflow.
