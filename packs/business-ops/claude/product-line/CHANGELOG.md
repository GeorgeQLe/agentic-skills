# Changelog

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
