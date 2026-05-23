---
name: pack
description: Manage project-local skill packs and project designation without installing domain skills globally
type: ops
version: v0.0
argument-hint: "[list|status|recommend|install <pack>|remove <pack>|refresh] or no args for guided setup"
---

# Pack

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
     - Use AskUserQuestion to ask which pack or packs to install. Include the recommended pack first. Include kanban only as an explicit opt-in when there is evidence of PoketoWork usage or the user asked for kanban.
     - After the user confirms, run `scripts/pack.sh install <pack...>`.
     - If the user cancels or asks for more detail, do not install anything.
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

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/pack-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/pack-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Never install `packs/*` into `~/.claude/skills` or `~/.codex/skills`.
- Do not overwrite real directories or files in `.claude/skills` or `.codex/skills`; skip them with a warning.
- If local skill discovery is not available in the active assistant, treat `pack` as the launcher and read the project-local pack files directly.
- Do not create `.agents/project.json` without user confirmation during guided setup.
