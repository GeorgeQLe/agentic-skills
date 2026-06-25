# Troubleshooting

Symptom-led recovery for common issues.

## Quick Reference

| Symptom | Likely Cause | Command | Expected Result |
| --- | --- | --- | --- |
| Skill installed but not visible | CLI session loaded before skill roots existed | Restart Claude Code or start fresh Codex session | Skill appears in `/skills` or `$skills` |
| Skill was visible, now gone | Pack removed or refresh cleared it | `scripts/pack.sh status` | Shows current installs; reinstall if missing |
| `jq required for write operations` | jq not installed | `brew install jq` (macOS) or `apt install jq` | Pack commands succeed |
| Skills out of date after git pull | Canonical skills moved ahead of installed copies | `scripts/pack.sh doctor` then `scripts/pack.sh refresh` | Doctor reports `ok` for all skills |
| `Unknown pack or skill` error | Typo or pack not available | `scripts/pack.sh list` | See available packs; retry with correct name |
| Lock timeout error | Another pack command is running | Wait for the other command, or check if the listed PID is still alive | Lock released; retry |
| Broken skill references | A skill references another that was moved or deleted | `./scripts/skill-deps.sh --broken` | Lists broken refs; fix or remove |
| Missing version metadata | Skill lacks required version field | `./scripts/skill-versions.sh --missing` | Lists skills needing version bump |
| Pinned skill archive missing | Archived version was deleted | `bash scripts/skill-archive-audit.sh --strict` | Lists integrity issues; restore archive or unpin |
| Base skills stale | Base install older than repo | `npx skillpacks doctor` then `npx skillpacks refresh` | Re-copies managed base skills |

## Detailed Recovery Procedures

### Skills Not Visible After Install

Pack installation creates file-system skill roots but does not hot-reload the active CLI session.

1. Run `scripts/pack.sh status` to confirm the pack is installed.
2. **Claude Code:**
   - Run `/reload-skills` to pick up new skill roots.
   - If skills are still missing, run `/clear` to start a fresh conversation.
   - If `.claude/skills/` did not exist when the session started, restart Claude Code entirely.
3. **Codex:** start a fresh Codex CLI session.

### Skill-Install Drift

When canonical skill sources in this repo are updated (e.g. after `git pull`), installed copies in consumer projects may become stale.

1. Run `scripts/pack.sh doctor` to see drift status for each installed skill.
2. Statuses:
   - `ok` — installed copy matches canonical source.
   - `stale (v0.0 → v0.1)` — canonical moved ahead. Run `scripts/pack.sh refresh`.
   - `unknown` — pre-upgrade marker without content hash. Run `scripts/pack.sh refresh` once to enable tracking.
   - `pinned vX (frozen)` — intentionally frozen; will not drift. Use `scripts/pack.sh unpin <skill>` to return to track-latest.
   - `missing-source` — canonical source path no longer exists. The skill may have been removed or renamed.
3. Run `scripts/pack.sh refresh` to re-copy all installs from canonical sources.
4. Restart your CLI session after refresh.

### jq Errors

`jq` is required for source-checkout `scripts/pack.sh` write operations (install, remove, refresh, set-mode, set-update-mode, set-bip). Node-owned `npx skillpacks` project-config commands do not require `jq`, except `install-deck` still uses shell materialization.

- **macOS:** `brew install jq`
- **Debian/Ubuntu:** `sudo apt install jq`
- **Other Linux:** check your package manager or download from https://jqlang.github.io/jq/

If `jq` produces empty output or parse errors, check that `.agents/project.json` is valid JSON:
```bash
jq . .agents/project.json
```

### Lock Contention

Pack commands use `.agents/.pack.lock` to prevent concurrent writes. If a previous command crashed without releasing the lock:

1. Check if the recorded PID is still running (the error message includes owner metadata).
2. If the process is gone, the next pack command will auto-clean the stale lock.
3. If auto-cleaning fails, manually remove `.agents/.pack.lock` and retry.

### Base Skill Drift

Base skills (installed project-local via `npx skillpacks init`) can also drift after the repo is updated.

1. Run `npx skillpacks doctor` to check project-local base drift.
2. Run `npx skillpacks refresh` to re-copy managed base skills.
3. Restart your CLI session.

### Windows/WSL Issues

This tool requires a bash environment. On Windows, use WSL2 with a Linux-side clone.

- Native PowerShell or cmd.exe is not supported.
- Git Bash without developer mode may have unreliable pinned archive symlinks.
- If opening HTML files from WSL fails, see the WSL file-opening guidance in CLAUDE.md.

### Validation Commands

Run these to check repo health:

```bash
./scripts/skill-deps.sh --broken           # broken skill cross-references
./scripts/skill-pack-routing-audit.sh      # routing contract consistency
./scripts/skill-versions.sh --missing      # skills missing version metadata
bash scripts/skill-archive-audit.sh --strict  # archive integrity
pnpm --dir tests test                      # unit and integration tests
```
