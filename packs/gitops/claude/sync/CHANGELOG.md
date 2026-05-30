# sync Changelog

## v0.4

- Add warn-only skill-install drift check: run `scripts/pack.sh doctor` against the resolved `agentic-skills` checkout and report `stale`/`unknown` project skill installs with the `scripts/pack.sh refresh` fix
- Keep plain sync non-mutating; never auto-refresh installs

## v0.3

- Add remembered user-local GitHub freshness preference at `~/.agentic-skills/preferences.json`
- Require local canonical `provision-agentic-config` source/version reporting during sync
- Keep plain sync non-mutating and route explicit checkout refreshes to `/init-agentic-skills update`

## v0.2

- Add canonical `CLAUDE.md`/`AGENTS.md` block drift checks against `provision-agentic-config`
- Fall back to repo-local `provision-agentic-config` when installed skill files are unavailable
- Report agent config drift in sync status

## v0.1

- Add provisioning version check: compare `<!-- provision-agentic-config vX.Y -->` in CLAUDE.md/AGENTS.md against installed skill version
- Warn when provisioned blocks are stale

## v0.0

- Initial version with pull, stash, conflict handling, outstanding work check, and sync.md support
