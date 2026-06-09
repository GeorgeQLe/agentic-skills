# Scripts Reference

Compact command index for all scripts in this repository.

## Install & Global

| Command | Description |
| --- | --- |
| `./init.sh` | Symlink global core skills to `~/.claude/skills/` and `~/.codex/skills/` |
| `./init.sh --uninstall` | Remove global symlinks that point back to this checkout |
| `./init.sh --pin ship=v0.0` | Pin a global skill to an archived version during initialization |

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

## Global Skill Management

| Command | Description |
| --- | --- |
| `scripts/init-agentic-skills.sh doctor` | Check global skill drift |
| `scripts/init-agentic-skills.sh hook enable` | Enable session-start drift-check hook |
| `scripts/init-agentic-skills.sh hook disable` | Disable session-start drift-check hook |
| `scripts/init-agentic-skills.sh set-pref <key> <value>` | Set a preference in `~/.agentic-skills/preferences.json` |
| `scripts/init-agentic-skills.sh show-prefs` | Show current preferences |

## Testing & Benchmarks

| Command | Description |
| --- | --- |
| `pnpm --dir tests test` | Run unit and integration tests (no model calls) |
| `pnpm --dir tests test:live` | Run live agent behavior tests (Claude + Codex) |
| `pnpm --dir tests test:live:claude` | Run live tests (Claude only) |
| `pnpm --dir tests test:live:codex` | Run live tests (Codex only) |

## Showcase & Data Generation

| Command | Description |
| --- | --- |
| `pnpm --dir apps/skills-showcase generate:data` | Generate Skills Showcase app data and the temporary docs mirror |
| `pnpm --dir apps/skills-showcase validate:data` | Validate website-owned generated showcase data |
| `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` | Direct shell validator for generated showcase data freshness |

## Alignment Page Management

| Command | Description |
| --- | --- |
| `node scripts/open-html-page.mjs <html-path-or-url> --browser auto` | Open or focus a local HTML page with best-effort cross-platform browser handling |
| `node scripts/upgrade-alignment-page.mjs` | Regenerate per-skill ALIGNMENT-PAGE.md from convention |
