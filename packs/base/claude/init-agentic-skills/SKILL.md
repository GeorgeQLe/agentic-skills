---
name: init-agentic-skills
description: Make the base agentic-skills available in a project by installing them project-local with npx skillpacks init, report and fix skill-install drift, clean up legacy user-home installs, and run guided setup for project-local domain packs. Use when Claude needs to enable base skills for a project, repair stale installs, confirm initialization status, remove old global installs, or set up and route domain packs.
type: ops
version: v0.12
argument-hint: "[init|status|doctor|refresh|uninstall-global]"
---

# Init Agentic Skills

Make the base agentic-skills available by installing them **project-local** into the current project's `.claude/skills` and `.codex/skills`. Installation is distributed through the npm `skillpacks` package — there is no user-home (global) install path. Active installs are repo-managed directories that expose the canonical `SKILL.md` and exclude `archive/`; pinned installs intentionally point at `archive/<version>`. Keep domain packs project-local too; use the **Guided Pack Setup** below, or `npx skillpacks install <pack-or-skill>` when packs are needed.

## Process

1. Parse `$ARGUMENTS`:
   - No args, `init`, or `refresh`: run `npx skillpacks init` from the project root to install the base skills project-local (`.claude/skills` + `.codex/skills`) and enable `base_skills` in `.agents/project.json`. Use `npx skillpacks refresh` instead when the project is already initialized and you only need to recreate roots from `.agents/project.json`.
   - `status`: run `npx skillpacks status` to report the project designation, enabled packs, and installed skills.
   - `doctor`: run `npx skillpacks doctor` to report project skill-install drift (read-only). It compares installed `.claude/skills` and `.codex/skills` copies against their canonical sources via the `.agentic-skills-managed` marker's `source_sha`. Report `STALE` skills with the printed fix command, `unknown` skills as needing a refresh to enable tracking, `missing` skills whose source is gone, and `pinned` skills as frozen. Run `npx skillpacks doctor --fix` to clean generated skill-root drift.
   - `uninstall-global`: run `npx skillpacks uninstall-global` only after confirming the user wants legacy repo-managed base installs removed from `~/.claude/skills` and `~/.codex/skills`. This cleans up installs created by the retired user-home init path; it removes only skillpacks-owned installs and leaves unmanaged directories untouched.
   - `help`, `--help`, or `-h`: run `npx skillpacks --help`.
2. Report the command run, the project skill directories, installed counts, and any warnings about non-repo-managed collisions.
3. Explain pack access separately:
   - Do not install `packs/*` as base skills.
   - In the project that needs domain workflows, run the **Guided Pack Setup** below, or `npx skillpacks install <pack-or-skill>` from the project shell for an explicit pack or individual pack skill.
   - If a project already has `.agents/project.json`, run `scripts/pack.sh refresh` (or `npx skillpacks refresh`) after this base initialization to recreate local pack skill roots.
4. If the active session still cannot see a newly installed or refreshed skill, report the skill-visibility reload path:
   - Claude Code: run `/reload-skills` first; `/clear` starts a new empty-context conversation and can pick up the refreshed registry; restart if the top-level `.claude/skills` directory did not exist at session start or the skill is still invisible.
   - Codex: start a fresh Codex CLI session if the `$` skill list remains stale.

## Guided Pack Setup

Run this when the user wants to enable domain packs in a project and has not named an explicit pack list.

1. If `.agents/project.json` exists, run `scripts/pack.sh refresh` to recreate local pack skill roots from committed project state, then report the project type, enabled packs, and installed skills.
2. If `.agents/project.json` is missing, inspect the repository before asking the user:
   - Run `scripts/pack.sh recommend`.
   - Check top-level files and directories, package manifests, app/framework configs, source layout, docs, existing `research/`, `specs/`, and `tasks/` files.
   - Classify likely packs using the Pack Selection rules below.
   - Present a concise recommendation with evidence.
   - Use `AskUserQuestion` to ask which pack or packs to install. Include the recommended pack first. Include kanban only as an explicit opt-in when there is evidence of PoketoWork usage or the user asked for kanban.
   - After the user confirms, run the source-checkout helper `scripts/pack.sh install <pack...>`. For package consumers outside this checkout, the equivalent project-shell route is `npx skillpacks install <pack...>`.
   - If the user cancels or asks for more detail, do not install anything.
3. For `install`, `refresh`, and guided setup installs, report:
   - `.agents/project.json` project type and enabled packs
   - any `enabled_skills` entries when present, including the skill name and source pack
   - any `project_scopes` entries when present, including the path, `project_type`, packs, and purpose
   - local skill roots created or removed under `.claude/skills` and `.codex/skills`
   - any skipped roots caused by non-repo-managed targets
   - shipping guidance: `.agents/project.json` is the committed project designation and should be committed when pack configuration changed; `.claude/skills/**` and `.codex/skills/**` are generated local skill roots recreated by `scripts/pack.sh refresh`, and generated skill roots must not be staged or committed

Do not create `.agents/project.json` without user confirmation during guided setup.

## Pack Selection

- Use `business-discovery`, `customer-lifecycle`, `business-growth`, or `business-ops` for SaaS, marketplaces, productivity apps, internal/admin tools, business workflows, and enterprise applications. `business-app` is a compatibility alias for all four.
- Use `creator-foundation`, `youtube-ops`, and `remotion` separately for creator-media work; `creator-media` is a compatibility alias for foundation plus YouTube operations.
- Use `project-fleet` for control repositories that manage downstream repos, spec-store portfolios, or spin-offs.
- Use `code-quality` as an additive pack for behavior-preserving refactors, type hygiene, import honesty, dependency-boundary cleanup, and module organization.
- Use `alignment-loop` for lightweight operator-agent calibration before committing to a full spec-interview pipeline.
- Use `game` for video games, prototypes, playable entertainment, game engines, store pages, playtest loops, and game assets.
- Use `devtool` for SDKs, CLIs, APIs, libraries, infrastructure products, developer platforms, and documentation-first developer workflows.
- PoketoWork kanban packs (`business-app-kanban`, `devtool-kanban`, `game-kanban`, and `poketowork-kanban`) are hibernated while Poketo.work is being rebuilt. Do not recommend or install kanban packs until they are reactivated.
- Use `exec-loop` for the plan-exec-ship execution workflow (ship, run, ship-end).
- Use `agent-work-admin` for roadmap management, phase planning, and spec-drift auditing.
- Use `product-design` for UX exploration, prototyping, feature/spec/UI interviews, brainstorming, and design systems.
- Use `code-review` for expert reviews, slim audits, dead-code scans, and regression checks.
- Use `code-debug` for investigation, debugging, and request tracing.
- Use `release-ops` for branch lifecycle management, deployment, and releases.
- Use `product-testing` for UAT journeys and dogfooding.
- Use `docs-health` for project hygiene auditing and dev-docs reconciliation.
- Use `research-admin` for research and documentation queue management.
- Use `skill-dev` for building, interviewing, and creating agentic skills.
- Use `guided-walkthrough` for step-by-step guides and UAT walkthroughs.
- Use `session-analytics` for session history analysis and incident triage.
- Use `teardown` for project teardowns and decommissioning.
- Use `code-maintenance` for migrations and package updates.
- Use `gitops` for git sync and feature-based commit workflows.
- Use `context-transfer` for session handoffs.
- Use `agent-bridge` for delegating work to other agents.
- Use `repo-maintenance` for bootstrapping new repos.
- Use `website-polish` for icon and web asset handling.
- Use `report-gen` for generating HTML report websites.
- Use `knowledge-check` for quiz-style knowledge reviews.
- Use `exec-profile` for execution profile patching.
- Use `alignment-page-admin` for compiling central alignment pages.
- Treat `monorepo` and `code-quality` as overlays. Pair overlays with a domain pack unless the user explicitly wants only the overlay behavior.
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

## Constraints

- Drive installation through `npx skillpacks` (the npm `skillpacks` CLI); do not recreate install logic by hand or reintroduce a user-home/global install path.
- Base skills are project-local: they install into the current project's `.claude/skills` and `.codex/skills`, not into `~/.claude/skills` or `~/.codex/skills`.
- Do not overwrite real directories or files under `.claude/skills` or `.codex/skills` that are not repo-managed.
- Treat packs as project-local capabilities managed through the Guided Pack Setup above or `scripts/pack.sh` (`npx skillpacks` under the hood).
- Stop and report exact errors if `npx skillpacks` fails.
- Do not install `packs/*` as base skills in any mode.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
