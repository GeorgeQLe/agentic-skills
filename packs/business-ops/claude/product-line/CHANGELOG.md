# Changelog

## v0.0 - 2026-05-27

- Initial product-line skill with five modes: review, promote, prune, fork, triggers
- Portfolio dashboard with evidence maturity and pipeline stage tracking
- Backward-compatible manifest reading (singular `active_path` → plural `active_paths`)
- Forward-only writes using `active_paths` plural form
- `max_concurrent` enforcement for parallel active paths
- Revisit trigger evaluation (file-based, evidence-based, time-based, manual)
