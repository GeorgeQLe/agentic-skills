---
skill: pack
agent: codex
captured_at: 2026-05-30T00:44:22-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

User message:

```text
A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Equip Shipping Skills For Pack-Install Artifacts

## Summary
Update the shipping contracts so downstream pack setup ships `.agents/project.json` but never ships generated `.claude/skills/**` or `.codex/skills/**` roots. Treat generated skill roots as local recreation artifacts from `$pack` / `/pack` / `scripts/pack.sh refresh`.

## Key Changes
- Update active Claude and Codex `ship` and `ship-end` skills to add a “Pack install artifact boundary” rule:
  - Include `.agents/project.json` when pack configuration changed.
  - Exclude `.claude/skills/**` and `.codex/skills/**` from shipping boundaries.
  - If those roots are untracked, leave them uncommitted and report them as generated local artifacts.
  - If those roots are already tracked or modified as tracked files, stop unless the current task explicitly includes repo hygiene to untrack/ignore them.
- Update Claude and Codex `commit-and-push-by-feature` to forbid bucketing generated local skill roots, even in final leftover cleanup.
- Optionally add a short matching note to the active `pack` skill output/reporting contract so pack install users see the commit rule at the source.
- Because these are behavior changes to skills, archive each changed active `SKILL.md` with `scripts/skill-archive.sh <skill-dir>`, bump `version:` by one decimal, and update each local `CHANGELOG.md`.

## Test Plan
- Add or update layer1 contract tests that assert active `ship`, `ship-end`, and `commit-and-push-by-feature` files mention:
  - `.agents/project.json` is the committed project designation.
  - `.claude/skills/**` and `.codex/skills/**` are generated local roots.
  - generated skill roots must not be staged or committed.
- Run targeted validation:
  - `pnpm --dir tests test:layer1` or the repo’s equivalent layer1 test command.
  - `scripts/skill-versions.sh --missing`
  - `git diff --check`
- Since `SKILL.md` behavior changes affect showcase metadata, run:
  - `node scripts/generate-skills-showcase-data.mjs`
  - `node scripts/generate-skills-showcase-github-data.mjs`
  - `scripts/validate-skills-showcase-data.sh`

## Assumptions
- We should fix the full shipping chain, not only the top-level `ship` / `ship-end` text, because both delegate to `commit-and-push-by-feature`.
- Generated local skill roots should remain uncommitted even if a downstream repo has not yet ignored them.
- A tracked generated skill root is a repository hygiene blocker unless the task explicitly asks to remove it from version control.
```

Visible skill context:

```text
<skill>
<name>pack</name>
<path>/home/georgeqle/.codex/skills/pack/SKILL.md</path>
---
name: pack
description: Manage project-local skill packs, individual pack skill roots, and project designation without installing domain skills globally
type: ops
version: v0.3
argument-hint: "[list|status|recommend|install <pack-or-skill>|remove <pack-or-skill>|refresh|which <skill>] or no args for guided setup"
---

# Pack

Invoke as `$pack`.

Use this skill when the user wants to inspect, recommend, install, remove, or refresh project-local skill packs or individual skills from those packs.

## Workflow

1. Parse `$ARGUMENTS`.
   - Treat commas as separators.
   - Treat `business` as `business-app`.
   - Ignore filler words such as `pack` or `packs`.
2. If no arguments were provided, run guided setup:
   - If `.agents/project.json` exists, run `scripts/pack.sh refresh` to recreate local pack skill roots from committed project state, then report the project type, enabled packs, and installed skills.
   - If `.agents/project.json` is missing, inspect the repository before asking the user:
     - Run `scripts/pack.sh recommend`.
     - Check top-level files and directories, package manifests, app/framework configs, source layout, docs, existing `research/`, `specs/`, and `tasks/` files.
     - Classify likely packs using the pack selection rules below.
     - Present a concise recommendation with evidence.
     - Present a plain-text **Pack Decision Checkpoint**: show 2-4 numbered choices, mark the recommended choice, explain the tradeoff for each, and ask the user to reply with a number, exact pack list, `status`, or `cancel`.
     - Stop after the checkpoint. Do not install anything until the user explicitly confirms a choice in a later message.
     - After the user confirms, run `scripts/pack.sh install <pack...>`.
   - If `.agents/project.json` exists but `refresh` fails, report the failure and the exact command the user can retry.
3. Run the matching helper command from this skill library's bundled launcher for explicit commands:
   - `scripts/pack.sh list`
   - `scripts/pack.sh status`
   - `scripts/pack.sh recommend`
   - `scripts/pack.sh install <pack-or-skill>`
   - `scripts/pack.sh remove <pack-or-skill>`
   - `scripts/pack.sh refresh`
   - `scripts/pack.sh which <skill>`
   The launcher is intentionally located at `scripts/pack.sh` under this skill directory and forwards to the repository-level pack manager.
4. For `install`, `remove`, `refresh`, and guided setup installs, report:
   - `.agents/project.json` project type and enabled packs
   - any `enabled_skills` entries when present, including the skill name and source pack
   - any `project_scopes` entries when present, including the path, `project_type`, packs, and purpose
   - local skill roots created or removed under `.claude/skills` and `.codex/skills`
   - any skipped roots caused by non-repo-managed targets
   - skill-visibility reload guidance: Claude Code watches existing `.claude/skills` roots and supports `/reload-skills`; `/clear` starts a new conversation and can pick up the refreshed registry, while a full restart remains the fallback if the top-level skills directory did not exist at session start or the skill remains invisible. Codex users should start a fresh Codex CLI session if the active session does not show the changed skills.

## Pack Model

- Global skills are domain-neutral and initialized by `init.sh`.
- Domain workflows live in project-local packs.
- Project designation is stored in `.agents/project.json`.
- Mixed monorepos may keep a coarse default `project_type` and add `project_scopes` entries for subtrees that need different domain routing.
- `enabled_packs` is the union of packs available to the repository; `project_scopes[].packs` explains which packs are appropriate for a specific path or glob.
- Pack installs use repo-managed skill roots that point back to this skill-library repository and exclude archived skill snapshots by default.
- The bundled launcher resolves copied managed installs through `.agentic-skills-managed` provenance before delegating to the repository-level pack manager.
- `scripts/pack.sh install`, `remove`, `refresh`, and `set-mode` preserve existing `project_scopes` and `notes` fields when `jq` is available.
- `scripts/pack.sh install <name>` treats `<name>` as a pack first, then as an individual skill provided by a pack.
- Pack writes use `.agents/.pack.lock` with owner metadata (`pid`, `started_at`, `command`); if a recorded owner process is gone, the next pack command removes that stale lock automatically.
- `scripts/pack.sh refresh` recreates project-local skill roots from `.agents/project.json`; it does not by itself force an active CLI skill registry to reload.
- Claude Code watches skill files under existing `.claude/skills` roots and supports `/reload-skills` to rescan skills and commands during a session. If a newly installed skill is not visible, run `/reload-skills`; `/clear` starts a new empty-context conversation and can also pick up the refreshed registry. Restart Claude Code if the top-level `.claude/skills` directory did not exist when the session started or the skill is still invisible.
- Codex may keep the `$` skill list loaded from session start. This pack workflow has no supported in-session Codex CLI skill refresh command, so start a fresh Codex CLI session if changed skills are not visible.

## Individual Skill Installation

When a name passed to `install` or `remove` does not match a pack, the system checks whether it matches a skill inside any pack. If it does, only that single skill root is installed, not the entire pack.

- `$pack install design-system` installs only the `design-system` skill from `product-design`, not the whole pack.
- `$pack install code-review icp` installs the `code-review` pack plus the individual `icp` skill.
- `$pack remove icp` removes only the `icp` skill root and its `enabled_skills` entry.
- `$pack which design-system` shows the source pack and whether the skill is installed.

Individual skills are tracked in `enabled_skills` in `.agents/project.json`:

```json
{
  "enabled_skills": {"icp": "business-discovery", "positioning": "business-discovery"}
}
```

The `{skill: pack}` format tracks provenance so `refresh` knows where to rebuild from. When a name matches both a pack and a skill, the pack takes precedence.

## Pack Selection

- Use `business-discovery`, `customer-lifecycle`, `business-growth`, or `business-ops` for SaaS, marketplaces, productivity apps, internal/admin tools, business workflows, and enterprise applications. `business-app` is a compatibility alias for all four.
- Use `creator-foundation`, `youtube-ops`, and `remotion` separately for creator-media work; `creator-media` is a compatibility alias for foundation plus YouTube operations.
- Use `project-fleet` for control repositories that manage downstream repos, spec-store portfolios, or spin-offs.
- Use `code-quality` as an additive pack for behavior-preserving refactors, type hygiene, import honesty, dependency-boundary cleanup, and module organization.
- Use `alignment-loop` for lightweight operator-agent calibration before committing to a full spec-interview pipeline.
- Use `game` for video games, prototypes, playable entertainment, game engines, store pages, playtest loops, and game assets.
- Use `devtool` for SDKs, CLIs, APIs, libraries, infrastructure products, developer platforms, and documentation-first developer workflows.
- Use `business-app-kanban`, `game-kanban`, or `devtool-kanban` only when the project intentionally uses PoketoWork boards.
- Use `poketowork-kanban` only when the user wants the generic board-management utilities independent of a domain pack.
- Treat `monorepo`, `code-quality`, and `*-kanban` packs as overlays. Pair them with a domain pack unless the user explicitly wants only the overlay behavior.
- For workflow ordering, lead-in recommendations, and overlay dependencies, read `docs/pack-workflow-matrix.md`.

## Mixed Monorepos

Use one repo-level `.agents/project.json` with a primary default plus scoped overrides:

```json
{
  "project_type": "devtool",
  "enabled_packs": ["devtool", "business-discovery", "customer-lifecycle", "business-growth"],
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
      "packs": ["business-discovery", "customer-lifecycle", "business-growth"],
      "purpose": "CalcLLM-powered connected edition research, GTM, monetization, and SaaS product work."
    },
    {
      "path": "packages/calcllm-sync",
      "project_type": "business-app",
      "packs": ["business-discovery", "customer-lifecycle", "business-growth"],
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

## Missing Skill Resolution

When a user invokes a skill that is not found in the current session:

1. Run `scripts/pack.sh which <skill-name>` to check if the skill exists in any pack.
2. If found in an uninstalled pack: tell the user which pack provides the skill, recommend `$pack install <skill>` for just that skill or `$pack install <pack>` for the full pack, and note the post-install reload path: Claude Code `/reload-skills` first, `/clear` or restart if needed; Codex fresh session if the `$` list stays stale.
3. If found in an installed pack: the skill should already be available, so suggest the same reload path to pick up the local skill roots.
4. If not found in any pack: suggest `$skills` to browse available skills or `$skills search <keyword>` to search.

## Constraints

- Never install `packs/*` into `~/.claude/skills` or `~/.codex/skills`.
- Do not overwrite real directories or files in `.claude/skills` or `.codex/skills`; skip them with a warning.
- If local skill discovery is not available in the active assistant, treat `pack` as the launcher and read the project-local pack files directly.
- Do not create `.agents/project.json` without user confirmation during guided setup.

</skill>
```
