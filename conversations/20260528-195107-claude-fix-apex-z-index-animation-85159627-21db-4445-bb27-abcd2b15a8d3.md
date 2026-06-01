# fix-apex-z-index-animation

| Field | Value |
|-------|-------|
| **Date** | 2026-05-28 19:51:07 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `85159627-21db-4445-bb27-abcd2b15a8d3` |
| **Entrypoint** | cli |
| **Version** | 2.1.152 |

---

## User _19:51:07_

Implement the following plan:

# Fix Close Apex Z-Index — Card Behind Pack Body During Layout Animation

## Context

The initial apex animation fixes (tear-to-open and close hold) are applied. User feedback: during the close animation, the card appears **behind** the pack body while transitioning from the drawer to the apex. The card should be visible (in front) during that transition, and only go behind the pack body during the downward descent.

## Root Cause

Two compounding issues:

1. **`packBodyElevated` gives pack body z-[70]**, higher than the card's z-60. During the close layout animation, the card is hidden behind the pack body.
2. **React state timing**: `setCardElevated(true)` in `useLayoutEffect` may not flush before Framer Motion starts the layout animation, so the card can mount with z-undefined for the first frame(s).

Key observation: **the working open paths (click, drag) never set `packBodyElevated` at all.** The card emerges from behind the pack body (z-auto vs z-1) during the rise, and at the apex (y=-180) there's zero overlap with the pack body (card bottom 74px < pack body top ~85px), so z-index is irrelevant. The same geometry applies to close.

## Changes

**Single file**: `apps/skills-showcase/src/components/SealedPack.tsx`

### 1. Remove `packBodyElevated` state entirely
- Delete the `useState` declaration and all `setPackBodyElevated` calls
- Hardcode pack body to `z-[1]` (remove ternary)

### 2. Derive card z-index in render phase (not effects)
Add before the JSX return:
```tsx
const isClosingFromDrawer = prevDrawerOpen.current && !isDrawerOpen;
```
Card style becomes:
```tsx
zIndex: (cardElevated || isClosingFromDrawer) ? 60 : undefined,
```
This ensures z-60 is set on the very first render when the drawer closes, before any `useLayoutEffect` runs — fixing the timing gap.

### 3. Simplify tear path in `onLayoutAnimationComplete`
Match `handlePackClick` pattern — only `setCardElevated(true)` after the animation, no `setPackBodyElevated`:
```tsx
if (pendingOpen.current) {
  pendingOpen.current = false;
  if (!isDrawerOpen) {
    animate(cardSlideY, -180, {
      type: "spring",
      stiffness: 400,
      damping: 25,
    }).then(() => {
      setCardElevated(true);
      setTimeout(() => onOpen(getOrigin()), 200);
    });
  }
  return;
}
```

### 4. Close descent: set `cardElevated(false)` before animate
In the `wasInDrawer` branch, set `cardElevated(false)` before starting descent so the card goes behind the pack body:
```tsx
if (!isDrawerOpen && wasInDrawer.current) {
  wasInDrawer.current = false;
  setTimeout(() => {
    setCardElevated(false);
    animate(cardSlideY, 0, {
      type: "spring",
      stiffness: 300,
      damping: 25,
    }).then(() => {
      hasCardTriggered.current = false;
    });
  }, 180);
}
```

### 5. useLayoutEffect: remove `setPackBodyElevated` call
Keep `setCardElevated(true)` (still useful as a secondary signal after the render-phase derivation takes over).


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/103a347b-ad35-499d-8ae6-fd63401782db.jsonl

## Assistant _19:51:10_

Let me read the current file to understand the code structure before making changes.

## Assistant _19:51:11_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _19:51:18_

I'll apply all five changes to `SealedPack.tsx` now.

## Assistant _19:51:19_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _19:51:25_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _19:51:28_

Now add the render-phase derivation and update the card's z-index style.

## Assistant _19:51:29_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _19:51:32_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _19:51:34_

Now simplify the tear path in `onLayoutAnimationComplete` and fix the close descent ordering.

## Assistant _19:51:40_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _19:51:44_

Finally, hardcode the pack body to `z-[1]`.

## Assistant _19:51:45_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _19:51:48_

Let me verify the final file looks correct.

## Assistant _19:51:48_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _19:51:51_

All five changes are applied. Let me also verify no stray `setPackBodyElevated` or `packBodyElevated` references remain.

## Assistant _19:51:52_

<details><summary>Tool calls</summary>

- Bash: Check for remaining packBodyElevated references

</details>

## Assistant _19:51:55_

Clean — no remaining references. Now let me verify the build passes.

## Assistant _19:51:56_

<details><summary>Tool calls</summary>

- Bash: Type-check SealedPack.tsx changes

</details>

## Assistant _19:52:06_

Type check passes with no errors. Here's a summary of what changed in `SealedPack.tsx`:

1. **Removed `packBodyElevated` state** — deleted the `useState`, all `setPackBodyElevated` calls, and hardcoded pack body to `z-[1]`
2. **Render-phase z-index derivation** — added `isClosingFromDrawer` computed from refs, ensuring z-60 is set on the first render when the drawer closes (before any effects run)
3. **Simplified tear path** — `onLayoutAnimationComplete` no longer sets `packBodyElevated`; sets `cardElevated(true)` only after the slide animation completes (matching `handlePackClick` pattern)
4. **Close descent ordering** — `setCardElevated(false)` now runs *before* the descend animation starts, so the card goes behind the pack body during the downward spring
5. **Cleaned up useLayoutEffect** — removed the `setPackBodyElevated(false)` call

## User _20:04:42_

<command-message>pack</command-message>
<command-name>/pack</command-name>
<command-args>install investigate</command-args>

## User _20:04:42_

Base directory for this skill: /Users/georgele/.claude/skills/pack

# Pack

Use this skill when the user wants to inspect, recommend, install, remove, or refresh project-local skill packs or individual skills from those packs.

## Workflow

1. Parse `install investigate`.
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
     - Use AskUserQuestion to ask which pack or packs to install. Include the recommended pack first. Include kanban only as an explicit opt-in when there is evidence of PoketoWork usage or the user asked for kanban.
     - After the user confirms, run `scripts/pack.sh install <pack...>`.
     - If the user cancels or asks for more detail, do not install anything.
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
   - that the user should start a fresh Claude Code or Codex CLI session if the active session does not show the changed skills

## Pack Model

- Global skills are domain-neutral and initialized by `init.sh`.
- Domain workflows live in project-local packs.
- Project designation is stored in `.agents/project.json`.
- Mixed monorepos may keep a coarse default `project_type` and add `project_scopes` entries for subtrees that need different domain routing.
- `enabled_packs` is the union of packs available to the repository; `project_scopes[].packs` explains which packs are appropriate for a specific path or glob.
- Pack installs use repo-managed skill roots that point back to this skill-library repository and exclude archived skill snapshots by default.
- `scripts/pack.sh install`, `remove`, `refresh`, and `set-mode` preserve existing `project_scopes` and `notes` fields when `jq` is available.
- `scripts/pack.sh install <name>` treats `<name>` as a pack first, then as an individual skill provided by a pack.
- Pack writes use `.agents/.pack.lock` with owner metadata (`pid`, `started_at`, `command`); if a recorded owner process is gone, the next pack command removes that stale lock automatically.
- `scripts/pack.sh refresh` recreates project-local skill roots from `.agents/project.json`; it does not refresh the active Claude Code or Codex process.
- Claude Code and Codex may load available skills at session startup. If newly installed or removed skills are not visible, start a fresh CLI session. No supported in-session CLI skill refresh command is configured in this pack workflow.

## Individual Skill Installation

When a name passed to `install` or `remove` doesn't match a pack, the system checks whether it matches a skill inside any pack. If it does, only that single skill root is installed, not the entire pack.

- `pack install icp` — installs only the `icp` skill from `business-discovery`, not the whole pack.
- `pack install code-review icp` — installs the `code-review` pack (all skills) plus the individual `icp` skill.
- `pack remove icp` — removes only the `icp` skill root and its `enabled_skills` entry.

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

## Missing Skill Resolution

When a user invokes a skill that is not found in the current session:

1. Run `scripts/pack.sh which <skill-name>` to check if the skill exists in any pack.
2. If found in an **uninstalled pack**: tell the user which pack provides the skill, recommend `/pack install <skill>` (for just that skill) or `/pack install <pack>` (for the full pack), and note that a new session is needed after installing.
3. If found in an **installed pack**: the skill should already be available — suggest starting a fresh session to pick up the local skill roots.
4. If **not found in any pack**: suggest `/skills` to browse available skills or `/skills search <keyword>` to search.

## Constraints

- Never install `packs/*` into `~/.claude/skills` or `~/.codex/skills`.
- Do not overwrite real directories or files in `.claude/skills` or `.codex/skills`; skip them with a warning.
- If local skill discovery is not available in the active assistant, treat `pack` as the launcher and read the project-local pack files directly.
- Do not create `.agents/project.json` without user confirmation during guided setup.

## Assistant _20:04:45_

<details><summary>Tool calls</summary>

- Bash: Install the investigate skill via pack.sh

</details>

## Assistant _20:04:49_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _20:04:54_

Installed the **investigate** skill from the `code-debug` pack. Skill roots created:

- `.claude/skills/investigate` → `packs/code-debug/claude/investigate`
- `.codex/skills/investigate` → `packs/code-debug/codex/investigate`

Start a fresh CLI session to use it — the current session's skill list was loaded at startup.

## Assistant _20:04:54_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _20:05:54_

[Request interrupted by user for tool use]
