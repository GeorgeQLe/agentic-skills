# provision-agentic-config Changelog

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
