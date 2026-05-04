---
name: pack
description: Manage project-local skill packs and project designation without installing domain skills globally
type: ops
version: 1.2.0
argument-hint: "[list|status|recommend|install <pack>|remove <pack>|refresh] or no args for guided setup"
---

# Pack

Invoke as `$pack`.

Use this skill when the user wants to inspect, recommend, install, remove, or refresh project-local skill packs.

## Workflow

1. Parse `$ARGUMENTS`.
   - Treat commas as separators.
   - Treat `business` as `business-app`.
   - Ignore filler words such as `pack` or `packs`.
2. If no arguments were provided, run guided setup:
   - If `.agents/project.json` exists, run `scripts/pack.sh refresh` to recreate local pack links from committed project state, then report the project type, enabled packs, and links.
   - If `.agents/project.json` is missing, inspect the repository before asking the user:
     - Run `scripts/pack.sh recommend`.
     - Check top-level files and directories, package manifests, app/framework configs, source layout, docs, existing `research/`, `specs/`, and `tasks/` files.
     - Classify likely packs using the pack selection rules below.
     - Present a concise recommendation with evidence.
     - Mock Claude's AskUserQuestion flow with a **Pack Decision Checkpoint**: show 2-4 numbered choices, mark the recommended choice, explain the tradeoff for each, and ask the user to reply with a number, exact pack list, `status`, or `cancel`.
     - Stop after the checkpoint. Do not install anything until the user explicitly confirms a choice in a later message.
     - After the user confirms, run `scripts/pack.sh install <pack...>`.
   - If `.agents/project.json` exists but `refresh` fails, report the failure and the exact command the user can retry.
3. Run the matching helper command from this skill library's bundled launcher for explicit commands:
   - `scripts/pack.sh list`
   - `scripts/pack.sh status`
   - `scripts/pack.sh recommend`
   - `scripts/pack.sh install <pack>`
   - `scripts/pack.sh remove <pack>`
   - `scripts/pack.sh refresh`
   The launcher is intentionally located at `scripts/pack.sh` under this skill directory and forwards to the repository-level pack manager.
4. For `install`, `remove`, `refresh`, and guided setup installs, report:
   - `.agents/project.json` project type and enabled packs
   - any `project_scopes` entries when present, including the path, `project_type`, packs, and purpose
   - local skill links created or removed under `.claude/skills` and `.codex/skills`
   - any skipped links caused by non-symlink targets
   - that the user should start a fresh Claude Code or Codex CLI session if the active session does not show the changed skills

## Pack Model

- Global skills are domain-neutral and installed by `install.sh`.
- Domain workflows live in project-local packs.
- Project designation is stored in `.agents/project.json`.
- Mixed monorepos may keep a coarse default `project_type` and add `project_scopes` entries for subtrees that need different domain routing.
- `enabled_packs` is the union of packs available to the repository; `project_scopes[].packs` explains which packs are appropriate for a specific path or glob.
- Pack installs use symlinks back to this skill-library repository by default.
- `scripts/pack.sh install`, `remove`, `refresh`, and `set-mode` preserve existing `project_scopes` and `notes` fields when `jq` is available.
- Pack writes use `.agents/.pack.lock` with owner metadata (`pid`, `started_at`, `command`); if a recorded owner process is gone, the next pack command removes that stale lock automatically.
- `scripts/pack.sh refresh` recreates project-local symlinks from `.agents/project.json`; it does not refresh the active Claude Code or Codex process.
- Claude Code and Codex may load available skills at session startup. If newly installed or removed skills are not visible, start a fresh CLI session. No supported in-session CLI skill refresh command is configured in this pack workflow.

## Pack Selection

- Use `business-discovery`, `business-growth`, or `business-ops` for SaaS, marketplaces, productivity apps, internal/admin tools, business workflows, and enterprise applications. `business-app` is a compatibility alias for all three.
- Use `creator-foundation`, `youtube-ops`, and `remotion` separately for creator-media work; `creator-media` is a compatibility alias for foundation plus YouTube operations.
- Use `project-fleet` for control repositories that manage downstream repos, spec-store portfolios, or spin-offs.
- Use `code-quality` as an additive pack for behavior-preserving refactors, type hygiene, import honesty, dependency-boundary cleanup, and module organization.
- Use `game` for video games, prototypes, playable entertainment, game engines, store pages, playtest loops, and game assets.
- Use `devtool` for SDKs, CLIs, APIs, libraries, infrastructure products, developer platforms, and documentation-first developer workflows.
- Use `business-app-kanban`, `game-kanban`, or `devtool-kanban` only when the project intentionally uses PoketoWork boards.
- Use `poketowork-kanban` only when the user wants the generic board-management utilities independent of a domain pack.

## Mixed Monorepos

Use one repo-level `.agents/project.json` with a primary default plus scoped overrides:

```json
{
  "project_type": "devtool",
  "enabled_packs": ["devtool", "business-discovery", "business-growth"],
  "skill_pack_version": 1,
  "project_scopes": [
    {
      "path": "apps/pitwall-local",
      "project_type": "devtool",
      "packs": ["devtool"],
      "purpose": "Pitwall Local / OSS developer utility work."
    },
    {
      "path": "apps/pitwall-calcllm",
      "project_type": "business-app",
      "packs": ["business-discovery", "business-growth"],
      "purpose": "CalcLLM-powered connected edition research, GTM, monetization, and SaaS product work."
    },
    {
      "path": "packages/calcllm-sync",
      "project_type": "business-app",
      "packs": ["business-discovery", "business-growth"],
      "purpose": "Connected-edition sync and SaaS integration work."
    }
  ]
}
```

When a task clearly names a scoped path, route to that scope's `project_type` and packs. When no scope matches, use the top-level `project_type` as the default.

## Pack Decision Checkpoint

Use this format when Codex needs user confirmation and `request_user_input` is unavailable:

```
## Pack Decision Checkpoint

Detected:
- [evidence]

Recommendation: `<pack>` because [reason].

Choose one:
1. `<pack>` (Recommended) — [impact/tradeoff]
2. `<alternate-pack>` — [impact/tradeoff]
3. `<pack> <matching-kanban-pack>` — [impact/tradeoff]
4. `cancel` — leave the project unconfigured

Reply with a number or an exact pack list to install.
```

## Constraints

- Never install `packs/*` into `~/.claude/skills` or `~/.codex/skills`.
- Do not overwrite real directories or files in `.claude/skills` or `.codex/skills`; skip them with a warning.
- If local skill discovery is not available in the active assistant, treat `pack` as the launcher and read the project-local pack files directly.
- Do not create `.agents/project.json` without user confirmation during guided setup.
