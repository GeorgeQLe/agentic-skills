# Changelog

## v0.5 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.4 - 2026-06-10

- Added npm-aware install-route guidance for business-ops cross-pack recommendations, preserving `/pack install <pack>` inside Claude Code while offering `npx skillpacks install <pack>` from the project shell.

## v0.3 - 2026-06-07

- Route missing product-path manifest guidance to `/customer-discovery` instead of the retired `/icp` executable.

## v0.2 - 2026-06-04

- Restored mirror version parity for the shared Alignment Page contract.

## v0.1 - 2026-05-30

- Split product-path operations into `activate`, `archive`, `restore`, and app-graduation `promote` modes.
- Updated the manifest schema for `archived`, `promoted`, archival timestamps/reasons, and backward-compatible `active_path`/legacy `abandoned` reads.


## v0.0 - 2026-05-27

- Initial product-line skill with five modes: review, promote, prune, fork, triggers
- Portfolio dashboard with evidence maturity and pipeline stage tracking
- Backward-compatible manifest reading (singular `active_path` → plural `active_paths`)
- Forward-only writes using `active_paths` plural form
- `max_concurrent` enforcement for parallel active paths
- Revisit trigger evaluation (file-based, evidence-based, time-based, manual)
