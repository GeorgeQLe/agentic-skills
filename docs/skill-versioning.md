# Skill Versioning

Skills use [semantic versioning](https://semver.org/) to track changes. The version lives in each skill's `SKILL.md` frontmatter:

```yaml
---
name: my-skill
description: Does something useful
version: 1.2.0
---
```

## When to bump

| Change type | Bump | Example |
|---|---|---|
| **Breaking** — removes flags, changes output format, renames arguments | Major (`2.0.0`) | Removing `--no-plan` flag from `/ship` |
| **New feature** — adds capability without breaking existing behavior | Minor (`1.1.0`) | Adding `--dry-run` flag to `/deploy` |
| **Bug fix** — corrects behavior without changing the interface | Patch (`1.0.1`) | Fixing typo in prompt template |

## Rules

1. All new skills start at `1.0.0`.
2. Bump the version in the same commit that changes the skill.
3. Only bump once per commit, even if multiple things change — use the highest applicable level.
4. Codex skill mirrors (`codex/*/SKILL.md`) are versioned separately if needed.

## Auditing versions

Run the version audit script to check all skills:

```bash
# Table of all skills and their versions
bash scripts/skill-versions.sh

# JSON output
bash scripts/skill-versions.sh --json

# Show only skills missing a version field
bash scripts/skill-versions.sh --missing
```

The script exits `0` if all skills are versioned, `1` if any are missing.
