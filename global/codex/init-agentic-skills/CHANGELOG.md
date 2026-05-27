# Changelog

## v0.3

- Add explicit `status` output for local checkout, remote URL, and GitHub freshness preference
- Add `update` / `latest` mode for confirmed fast-forward-only checkout refresh followed by `init.sh`
- Preserve project-local pack handling; no global pack installs

## v0.2

- Hard-renamed `install-agentic-skills` to `init-agentic-skills`.
- Updated the workflow to run `init.sh` and describe archive-free managed skill installs instead of symlink-only installs.

## v0.1

- Clarified that project-local access stays under `$pack`, including single-skill installs with `$pack install <skill>`.

## v0.0

- Initial Codex global skill installer workflow.
