# Changelog

## v0.6 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.5 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.4 - 2026-06-10

- Added npm-aware install-route guidance for business-ops cross-pack recommendations, preserving `$pack install <pack>` inside Codex while offering `npx skillpacks install <pack>` from the project shell.

## v0.3 - 2026-06-07

- Route missing product-path manifest guidance to `$customer-discovery` instead of the retired `$icp` executable.

## v0.2 - 2026-06-04

- Added the shared Alignment Page contract to match the Claude mirror and restored version parity.

## v0.1 - 2026-05-30

- Split product-path operations into `activate`, `archive`, `restore`, and app-graduation `promote` modes.
- Updated the manifest schema for `archived`, `promoted`, archival timestamps/reasons, and backward-compatible `active_path`/legacy `abandoned` reads.

## v0.0

- Archived previous skill contract.
