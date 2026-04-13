# Project-Local Skill Packs

Project-local packs keep domain-specific workflows out of global assistant context.

## Design

- Global skills live in `global/{claude,codex}`.
- Domain packs live in `packs/<pack>/{claude,codex}`.
- Project designation lives in `.agents/project.json`.

Example:

```json
{
  "project_type": "game",
  "enabled_packs": ["game"],
  "skill_pack_version": 1
}
```

## Commands

```bash
scripts/pack.sh list
scripts/pack.sh recommend
scripts/pack.sh install game
scripts/pack.sh install business-app
scripts/pack.sh install devtool
scripts/pack.sh install code-quality
scripts/pack.sh install game-kanban
scripts/pack.sh remove game
scripts/pack.sh refresh
scripts/pack.sh status
```

Assistant-native usage also supports guided setup:

- Claude: run `/pack` with no arguments.
- Codex: run `$pack` with no arguments.

If `.agents/project.json` already exists, bare `pack` refreshes local links from the committed project designation. If it is missing, the assistant inspects the repository, recommends a pack, and asks before installing. Claude uses AskUserQuestion for that checkpoint; Codex uses a text-based Pack Decision Checkpoint that waits for an explicit reply before writing `.agents/project.json`.

## Local Symlinks

Pack install creates symlinks in the current project:

```text
.claude/skills/<skill> -> <skill-library>/packs/<pack>/claude/<skill>
.codex/skills/<skill> -> <skill-library>/packs/<pack>/codex/<skill>
```

The skill source stays centralized in this repository. Projects opt into packs without copying skill bodies.

## Pack Selection

- Use `business-app` for SaaS, marketplaces, productivity apps, business workflows, and enterprise applications.
- Use `code-quality` as an additive pack for behavior-preserving refactors, type hygiene, import honesty, dependency-boundary cleanup, and module organization.
- Use `game` for video games, prototypes, playable entertainment, and store-page/wishlist validation.
- Use `devtool` for SDKs, CLIs, APIs, libraries, infrastructure products, and developer-facing platforms.
- Use `business-app-kanban`, `game-kanban`, or `devtool-kanban` only when the project intentionally uses PoketoWork boards.

Kanban packs are never installed automatically by the base domain packs. Install the base domain pack and the matching kanban variant as separate, explicit choices:

```bash
scripts/pack.sh install business-app
scripts/pack.sh install business-app-kanban
```

The generic `poketowork-kanban` pack contains direct board-management utilities, including `poketo-kanban` and `sync-roadmap-kanban`.

## Compatibility

If a tool does not discover project-local `.claude/skills` or `.codex/skills`, use the global `pack` and `workflow` skills as launchers. They should read `.agents/project.json` and the local pack files directly.

Do not install `packs/*` globally as a fallback; that recreates the context pollution this design avoids.

Commit `.agents/project.json` with the project. Do not commit generated local skill links under `.claude/skills` or `.codex/skills`; recreate them with `/pack`, `$pack`, or `scripts/pack.sh refresh`.

## Former Global Domain Skills

Business/product workflows that used to be globally installed now live only in the `business-app` pack. Restore them in a project with:

```bash
scripts/pack.sh install business-app
```

For assistant-native invocation, use `/pack install business-app` in Claude or `$pack install business-app` in Codex.
