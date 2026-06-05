# Skill Versioning

Skills use a `v0.0` decimal convention to track changes. The version lives in each skill's `SKILL.md` frontmatter:

```yaml
---
name: my-skill
description: Does something useful
version: v0.0
---
```

## Convention

- New skills start at `version: v0.0`
- Bump the decimal (e.g. `v0.0` → `v0.1`) for non-refactor changes — adjustments, tweaks, behavioral updates
- Refactors or full overhauls do NOT bump the version; only substantive behavior/output changes do
- Bump in the same commit that changes the skill

## Archive on Bump

When bumping a version, archive the current `SKILL.md` before overwriting it:

1. Copy the current `SKILL.md` to `archive/<old-version>/SKILL.md` in the skill directory
2. Update the `version:` field in `SKILL.md`
3. Update `CHANGELOG.md`
4. Commit all three changes together

Use the convenience script to automate the archive step:

```bash
bash scripts/skill-archive.sh global/claude/ship
```

This reads the current version, creates `archive/<version>/SKILL.md`, and prints confirmation. Then bump the version and update the changelog manually.

## Directory Structure

Each skill directory can contain an `archive/` subdirectory with snapshots of prior versions:

```text
global/claude/ship/
  SKILL.md              # current version (e.g., v0.1)
  CHANGELOG.md          # reverse-chronological changes
  archive/
    v0.0/SKILL.md       # snapshot at v0.0

packs/devtool/claude/devtool-adoption/
  SKILL.md
  CHANGELOG.md
  archive/
    v0.0/SKILL.md
```

The repo-root `archive/` directory is unrelated — it holds fully deprecated packs.

## Changelog

Each skill that has been bumped must have a `CHANGELOG.md` in its directory with reverse-chronological entries:

```markdown
# Changelog

## v0.1

- Added --dry-run flag
- Improved error messages for missing arguments

## v0.0

- Initial version
```

Each archived version must have a corresponding heading in the changelog.

## Version Pinning

Skills can be pinned to an archived version so that an older snapshot is used instead of the current `SKILL.md`.

### Pack skills (`pack.sh`)

```bash
scripts/pack.sh pin <skill> <version>    # pin a pack skill to an archived version
scripts/pack.sh unpin <skill>            # revert to latest
```

Pin state is stored in `.agents/project.json` under `pinned_versions`:

```json
{
  "project_type": "devtool",
  "enabled_packs": ["devtool"],
  "skill_pack_version": 1,
  "pinned_versions": { "devtool-adoption": "v0.0" }
}
```

When a skill is pinned, `pack.sh install/refresh` points the installed skill root at `archive/<version>/` instead of the active skill root.

### Global skills (`init.sh`)

```bash
./init.sh --pin ship=v0.0
```

Pin state is stored in `~/.claude/skill-pins.json`:

```json
{ "ship": "v0.0" }
```

When a global skill is pinned, `init.sh` points the installed skill root at the `archive/<version>/` subdirectory.

## Auditing

### Version audit

```bash
bash scripts/skill-versions.sh           # table of all skills and versions
bash scripts/skill-versions.sh --json     # JSON output
bash scripts/skill-versions.sh --missing  # skills missing a version field
```

### Archive audit

```bash
bash scripts/skill-archive-audit.sh           # table output
bash scripts/skill-archive-audit.sh --json    # JSON output
bash scripts/skill-archive-audit.sh --strict  # exit 1 on any violation
```

The archive audit checks:
1. Every `archive/<version>/SKILL.md` has a `version:` field matching its directory name
2. Any skill at `v0.1`+ has corresponding archive entries for prior versions
3. If `archive/` has entries, `CHANGELOG.md` must exist
4. Each archived version has a heading in `CHANGELOG.md`

### Mirror parity audit

```bash
bash scripts/skill-mirror-parity-audit.sh
bash scripts/skill-mirror-parity-audit.sh --verbose
```

The mirror parity audit checks pack skill pairs under `packs/*/{claude,codex}/*/SKILL.md` for missing mirrors, frontmatter drift (`name`, `type`, `version`, `argument-hint`), required shared-section drift, and command-syntax-normalized heading drift. Intentional one-sided skills and documented pre-existing platform-specific drift are allowlisted inside the script.
