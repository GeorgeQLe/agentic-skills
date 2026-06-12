# provision-agentic-config Changelog

## v0.8 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.7 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.6 - 2026-06-11

- Updated generated missing-skill fallback blocks to include `npx skillpacks install <pack-or-skill>` alongside runner-specific pack install routes.

## v0.5

- Tightened generated missing-skill fallback guidance to recommend runner-specific pack install commands and post-install reload paths: Claude Code `/reload-skills`, `/clear`, then restart fallback; Codex fresh session when `$` discovery remains stale.

## v0.4

- Add Prompt History to generated `CLAUDE.md` and `AGENTS.md` blocks
- Require visible user skill-invocation prompts to be saved under `prompts/<skill-slug>/`
- Document prompt frontmatter, tracked-artifact defaults, visible-context scope, and secret-stop handling

## v0.3

- Added missing-skill fallback and project-local pack command resolution guidance to generated blocks
- Documented `scripts/pack.sh which <skill-name>` routing for unavailable skills

## v0.2

- Add `<!-- provision-agentic-config vX.Y -->` version comment to provisioned blocks
- `/sync` can now detect stale provisioning by comparing the comment against the installed skill version

## v0.1

- Added Windows/WSL browser-opening guidance to generated `CLAUDE.md` and `AGENTS.md` blocks
- Documented the PowerShell `file://wsl.localhost/<distro>/...` fallback for HTML files when UNC path launch fails

## v0.0

- Provisioned workflow orchestration blocks for `CLAUDE.md` and `AGENTS.md`
