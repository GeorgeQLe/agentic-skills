# Changelog

## v0.9 - 2026-06-13

- Switched the default project-shell pack install recommendation from `npx gskp install <pack-or-skill>` to `npx skillpacks install <pack-or-skill>`, matching the canonical install-routing contract and the Claude mirror.

## v0.8 - 2026-06-12

- Standardized active pack and skill install guidance on `npx gskp install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.7 - 2026-06-11

- Added npm-aware project-shell pack install guidance alongside Codex `$pack install` guidance for project-local domain workflows.

## v0.6

- Replace generic fresh-session guidance with the runner-specific skill reload path: Claude Code `/reload-skills`, `/clear`, then restart fallback; Codex fresh CLI session when `$` discovery remains stale.
- Update the `update`/`latest` launcher completion notice with the same reload guidance.

## v0.5

- Add `doctor` subcommand: read-only global skill-install drift report against canonical `global/<tool>` sources via the marker `source_sha`.
- Add opt-in first-run prompts (off by default) that persist `skills.session_start_hook` and `skills.auto_refresh` in `~/.agentic-skills/preferences.json`.
- Add `hook enable|disable`, `set-pref`, and `show-prefs` subcommands; `hook enable` registers a `SessionStart` drift hook (`scripts/skill-drift-hook.sh`) in `~/.claude/settings.json`.
- Document that `update`/`latest` re-copy is the global refresh that rewrites markers and clears drift.

## v0.4

- Copied managed installs now resolve the repository checkout via `.agentic-skills-managed` provenance before reporting status, updating, or rerunning `init.sh`.

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
