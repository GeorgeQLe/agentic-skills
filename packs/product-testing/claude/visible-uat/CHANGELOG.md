# Changelog

## v0.0 - 2026-07-07

- Added `visible-uat` as an execution skill for deterministic visible UAT using Computer Use or another available visible UI tool.
- Required `/tmp`-only transient setup, isolated test state where possible, visible UI assertions, Markdown reports under `docs/testing/`, supplemental-only automated checks, and cleanup of started processes.
- Clarified that `/visible-uat` is distinct from `/uat`, which remains a human-run UAT planning skill.
