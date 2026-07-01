# Changelog

## v0.1 - 2026-07-01

- Made `$devtool-workflow` the default Devtool AFPS graduation orchestrator after `npx skillpacks install devtool`.
- Kept `$devtool-user-map` as the direct first concrete research step when requested.
- Expanded the evidence handoff to include ORD scan, align, ship-log, and traction-log entries.
- Updated touched invocation and handoff examples to Codex `$...` command syntax.

## v0.0 - 2026-06-15

- Initial ORD traction check: compares a published package's post-launch signals (npm downloads, stars, non-author issues, integration requests, mentions) against the ORD graduation thresholds and recommends iterate, graduate to Devtool AFPS, cross-domain graduate to Business AFPS, or archive. Acts as the semi-automatic graduation gate — recommends, user confirms. Routes Devtool AFPS graduations through the `devtool` pack with the install prerequisite.
