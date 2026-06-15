# Changelog

## v0.0 - 2026-06-15

- Initial ORD traction check: compares a published package's post-launch signals (npm downloads, stars, non-author issues, integration requests, mentions) against the ORD graduation thresholds and recommends iterate, graduate to Devtool AFPS, cross-domain graduate to Business AFPS, or archive. Acts as the semi-automatic graduation gate — recommends, user confirms. Routes Devtool AFPS graduations through the `devtool` pack with the install prerequisite.
