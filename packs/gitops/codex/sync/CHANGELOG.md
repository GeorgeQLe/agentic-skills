# sync Changelog

## v0.6

- Provisioner lookup prefers project-local `.codex/skills` / `.claude/skills` (base skills now install project-local). Stale-checkout guidance points to an explicit checkout/package update followed by `npx skillpacks refresh` instead of the removed `$init-agentic-skills update` flow.

## v0.5

- Fix skill-install drift fix routing: surface the doctor-reported context-aware refresh command instead of a bare `scripts/pack.sh refresh`, which fails to resolve from a non-checkout project directory
- Prefer `npx skillpacks refresh` for installs managed by the published npx `skillpacks` package; use `scripts/pack.sh refresh` only from a resolved source checkout
- Apply the same routing to `unknown`-install hints and the Report status drift line

## v0.4

- Add warn-only skill-install drift check: run `scripts/pack.sh doctor` against the resolved `agentic-skills` checkout and report `stale`/`unknown` project skill installs with the `scripts/pack.sh refresh` fix
- Keep plain sync non-mutating; never auto-refresh installs

## v0.3

- Add remembered user-local GitHub freshness preference at `~/.agentic-skills/preferences.json`
- Require local canonical `provision-agentic-config` source/version reporting during sync
- Keep plain sync non-mutating and route explicit checkout refreshes to `$init-agentic-skills update`

## v0.2

- Add canonical `CLAUDE.md`/`AGENTS.md` block drift checks against `provision-agentic-config`
- Fall back to repo-local `provision-agentic-config` when installed skill files are unavailable
- Report agent config drift in sync status

## v0.1

- Add provisioning version check: compare `<!-- provision-agentic-config vX.Y -->` in CLAUDE.md/AGENTS.md against installed skill version
- Warn when provisioned blocks are stale

## v0.0

- Initial version with pull, stash, conflict handling, outstanding work check, and sync.md support
