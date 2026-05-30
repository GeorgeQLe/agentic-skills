# Changelog

## v0.3

- Clarified post-install skill visibility guidance: Claude Code can use live detection, `/reload-skills`, `/clear`, or restart depending on directory state, while Codex still needs a fresh session when the `$` list is stale.

## v0.2

- Copied managed installs now resolve the repository checkout via `.agentic-skills-managed` provenance before delegating to the root pack manager.

## v0.1

- Documented single-skill install/remove support through `/pack install <skill>` and `/pack remove <skill>`.
- Added `/pack which <skill>` to the advertised command surface and missing-skill resolution workflow.

## v0.0

- Initial Claude project-local pack management workflow.
