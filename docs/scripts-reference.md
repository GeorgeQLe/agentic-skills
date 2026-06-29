# Scripts Reference

Compact command index for all scripts in this repository.

## Install & Base

| Command | Description |
| --- | --- |
| `npx skillpacks init` | Install managed base skill directories into the current project's local `.claude/skills/` and `.codex/skills/` roots and record `base_skills: true` in `.agents/project.json` |
| `npx skillpacks uninstall-global [--dry-run]` | Remove or preview legacy skillpacks-owned base installs under `~/.claude/skills` and `~/.codex/skills` (leaves unmanaged dirs untouched) |
| `npx skillpacks pin ship v0.0` | Pin a project-local base skill to an archived version |

## Project Packs

| Command | Description |
| --- | --- |
| `scripts/pack.sh list` | List available packs |
| `scripts/pack.sh recommend` | Suggest a pack based on repository contents |
| `scripts/pack.sh install <pack-or-skill>` | Install a pack or individual skill into the current project |
| `scripts/pack.sh remove <pack-or-skill>` | Remove an installed pack or skill |
| `scripts/pack.sh refresh` | Re-copy all installs from canonical sources, clearing drift |
| `scripts/pack.sh status` | Show current project designation and installed packs |
| `scripts/pack.sh doctor` | Read-only drift report (ok / stale / unknown / pinned / missing-source) |
| `scripts/pack.sh which <skill>` | Show which pack provides a skill and whether it is installed |
| `scripts/pack.sh pin <skill> <ver>` | Pin a skill to an archived version |
| `scripts/pack.sh unpin <skill>` | Return a pinned skill to track-latest |
| `scripts/pack.sh set-mode <mode>` | Set agent mode: `claude-only`, `codex-only`, `hybrid`, or `unset` |
| `scripts/pack.sh set-update-mode <mode>` | Set drift update mode: `warn`, `auto`, or `unset` |
| `scripts/pack.sh set-bip <mode>` | Set build-in-public alignment default: `on`, `off`, or `unset` |
| `scripts/pack.sh set-bip-platforms <platform...>` | Set project-level build-in-public priority platform list, or use `unset` to clear it |
| `scripts/pack.sh list-packs` | Internal: print enabled packs (used by Codex `$exec` routing) |

## Mode & Handoff

| Command | Description |
| --- | --- |
| `scripts/agent-mode.sh` | Resolve effective agent mode (env > project.json > empty) |
| `scripts/approved-plan.sh check` | Inspect approval-packet lifecycle and validity |
| `scripts/approved-plan.sh consume` | Mark an approved packet as consumed |
| `scripts/approved-plan.sh mark-stale` | Manually mark a packet as stale |

## Skill Hygiene

| Command | Description |
| --- | --- |
| `./scripts/skill-deps.sh --broken` | Find broken cross-references between skills |
| `./scripts/skill-pack-routing-audit.sh` | Audit routing contract consistency |
| `./scripts/skill-versions.sh --missing` | Find skills missing version metadata |
| `bash scripts/skill-archive.sh <skill-dir>` | Archive current SKILL.md before a version bump |
| `bash scripts/skill-archive-audit.sh` | Audit archive integrity |
| `bash scripts/skill-archive-audit.sh --strict` | Strict archive integrity (non-zero exit on any issue) |

## Base Skill Management

| Command | Description |
| --- | --- |
| `npx skillpacks init` | Install managed base skills into the current project's local `.claude/skills/` and `.codex/skills/` roots |
| `npx skillpacks doctor` | Check project-local base skill drift |
| `npx skillpacks refresh` | Re-copy project-local managed base skills, clearing drift |
| `npx skillpacks pin <skill> <version>` | Pin a project-local base skill to an archived version |
| `npx skillpacks uninstall-global [--dry-run]` | Remove or preview legacy skillpacks-owned base installs under `~/.claude/skills` and `~/.codex/skills` |

## Testing & Benchmarks

| Command | Description |
| --- | --- |
| `pnpm --dir tests test` | Run unit and integration tests (no model calls) |
| `pnpm --dir tests test:live` | Run live agent behavior tests (Claude + Codex) |
| `pnpm --dir tests test:live:claude` | Run live tests (Claude only) |
| `pnpm --dir tests test:live:codex` | Run live tests (Codex only) |

## Public Export Generation

| Command | Description |
| --- | --- |
| `node scripts/generate-skills-catalog-export.mjs` | Generate committed public skills-catalog exports |
| `scripts/validate-skills-catalog-export.sh` | Validate committed public skills-catalog exports are fresh |
| `npm run exports:check` | Package-script wrapper for the export validator |

## Alignment Page Management

| Command | Description |
| --- | --- |
| `node scripts/open-html-page.mjs <html-path-or-url> --browser auto` | Open or focus a local HTML page with best-effort cross-platform browser handling |
| `node scripts/upgrade-alignment-page.mjs` | Regenerate per-skill ALIGNMENT-PAGE.md from convention |
| `node scripts/audit-alignment-pages.mjs [--root <path>]` | Read-only convention audit for active `alignment/*.html` pages |
| `node scripts/inject-tts.mjs [--dir <subdir>] [--force] [<page>]` | Inject the Brief Me TTS include into pages (default `alignment/`; `--dir interrogation` for interrogation pages) |

## Interrogation Page Management

| Command | Description |
| --- | --- |
| `node scripts/upgrade-interrogation-page.mjs [--check] [--dry-run]` | Regenerate per-skill INTERROGATION-PAGE.md from `docs/interrogation-page-convention.md` for participating skills; `--check` is the repo-state drift gate |
| `node scripts/audit-interrogation-pages.mjs [--root <path>]` | Read-only convention audit for active `interrogation/*.html` pages (TTS, metadata, ≥1 open input, confidence gate, round naming, answer sidecar) |
