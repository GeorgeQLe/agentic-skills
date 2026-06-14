# provision-agentic-config Changelog

## v0.13 - 2026-06-14

- Added `Revision Hygiene` to the provisioned Workflow Orchestration blocks so feedback-driven edits converge on the requested final artifact instead of repeating rejected framing. Bumped block comment to v0.13.

## v0.12 - 2026-06-14

- Added a "Research vs implementation loops" note to the provisioned Workflow Orchestration blocks (Claude + AGENTS): clarifies that `tasks/roadmap.md`/`tasks/todo.md` task tracking is for implementation work, while Pattern A research orchestrators use the self-advancing Research Session Loop (`docs/research-session-loop-convention.md`). Bumped block comment to v0.12.

## v0.11 - 2026-06-13

- Updated generated missing-skill fallback blocks to recommend the primary `npx skillpacks install <pack-or-skill>` route while `@glexcorp/gskp` remains a same-version package alias.

## v0.10 - 2026-06-13

- Updated generated missing-skill fallback blocks to recommend the scoped npm route `npx @glexcorp/gskp install <pack-or-skill>`.

## v0.9 - 2026-06-12

- Updated generated missing-skill fallback blocks to recommend `npx gskp install <pack-or-skill>` as the primary npm route while preserving source-checkout lookup behavior.

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

- Clarified Claude `/exec` shipping exception language in generated `CLAUDE.md` blocks
- Updated provisioned block version comments for stale provisioning detection

## v0.2

- Add `<!-- provision-agentic-config vX.Y -->` version comment to provisioned blocks
- `/sync` can now detect stale provisioning by comparing the comment against the installed skill version

## v0.1

- Added Windows/WSL browser-opening guidance to generated `CLAUDE.md` and `AGENTS.md` blocks
- Documented the PowerShell `file://wsl.localhost/<distro>/...` fallback for HTML files when UNC path launch fails

## v0.0

- Provisioned workflow orchestration blocks for `CLAUDE.md` and `AGENTS.md`
