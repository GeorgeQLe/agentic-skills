# Skill Anatomy

This repository uses a versioned skillpack layout:

- Global skills live under `global/{claude,codex}/<skill>/SKILL.md`.
- Pack skills live under `packs/<pack>/{claude,codex}/<skill>/SKILL.md`.
- Archived versions live under `archive/<version>/SKILL.md` inside the owning skill directory.

Keep this structure. It supports agent-specific command syntax, pack installation, pinning, benchmarks, generated showcase data, and historical audits.

## Frontmatter

Every active `SKILL.md` must include YAML frontmatter with:

- `name`: the command or skill identifier.
- `description`: a concise trigger description.
- `version`: repository skill version in `vMAJOR.MINOR` form, usually `v0.x`.

Allowed optional fields include:

- `type`: broad workflow category used by repo tooling.
- `argument-hint`: a short invocation hint for commands that usually take an argument.

Do not add new frontmatter keys unless a generator, installer, benchmark, or documented workflow consumes them.

## Versioning

New skills start at `version: v0.0`.

For substantive behavior or output changes:

1. Run `bash scripts/skill-archive.sh <skill-dir>` before editing the active contract.
2. Bump the active `version:` decimal, for example `v0.0` to `v0.1`.
3. Update `CHANGELOG.md` in the same skill directory.

Behavior-preserving refactors do not need a version bump. Archived `SKILL.md` snapshots are historical records; do not normalize or rewrite them as part of active-skill cleanup.

## Changelog And Archive Rules

If a skill has any `archive/<version>/SKILL.md` entry, it must have `CHANGELOG.md`.

`CHANGELOG.md` must include a heading for every archived version:

```md
# Changelog

## v0.1

- ...

## v0.0

- Archived previous skill contract.
```

The archive audit is the owner for historical integrity:

```sh
bash scripts/skill-archive-audit.sh --strict
```

General active-skill audits should ignore `archive/` unless they are explicitly checking archive integrity.

## Mirrors

When a skill exists for both Claude and Codex, keep behavior, routes, versioning, archives, and changelog entries in sync unless the difference is agent-specific. Agent-specific command syntax is expected: Claude uses slash commands, Codex uses dollar commands.

## Progressive Disclosure

Keep hard gates, stop rules, routing contracts, safety constraints, and required output shape directly in `SKILL.md`.

Move reusable or bulky detail into one-level helper files only when it is not always needed at invocation time:

- `references/` for examples, rubrics, templates, policy detail, or long domain background.
- `scripts/` for repeatable checks, generators, migrations, or setup helpers.
- `assets/` for static fixtures or visual/source assets.

Prefer one-hop references from `SKILL.md`. Avoid deep reference chains that make the active contract hard to audit.
