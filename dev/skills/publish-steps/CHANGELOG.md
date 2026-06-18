# Changelog

## v0.0 - 2026-06-18

- Initial `publish-steps` command: summarizes `docs/release-runbook.md` (auth, release gates, `./publish.sh`, post-publish verification, recovery) for the `skillpacks` + `@glexcorp/gskp` dual-package release. Repo-maintainer tooling sourced from `dev/skills/` (does not ship to npm consumers); installed into the local agent skill roots by `sync.md` on every `/sync`.
