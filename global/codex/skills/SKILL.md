---
name: skills
description: Browse and search all available skills, grouped by workflow stage or activity type
type: ops
version: 1.1.0
argument-hint: "[list | types | search <keyword>]"
---

# Skills

Discover and search installed global skills plus enabled project-local pack skills, grouped by workflow stage or activity type.

## Process

1. **Parse arguments:**
   - If `$ARGUMENTS` is empty or `list` → **list mode** (show all skills grouped by workflow stage).
   - If `$ARGUMENTS` is `types` → **type mode** (show all skills grouped by activity type).
   - If `$ARGUMENTS` starts with `search ` → **search mode** (filter by keyword after `search`).

2. **Discover skills:**
   - Always scan global Codex skills in `global/codex/*/SKILL.md`.
   - If `.agents/project.json` exists, read `enabled_packs` and scan `packs/<pack>/codex/*/SKILL.md` for each enabled pack.
   - If `.codex/skills/*/SKILL.md` exists in the current project, include those local skills too.
   - Read the first 6 lines of each file to extract YAML frontmatter fields: `name`, `description`, `type`.

3. **Group skills by workflow stage** using this static mapping:

   The mapping includes global skills and pack-provided skills. Only skills
   discovered in step 2 should be printed, so domain and kanban entries appear
   only when the corresponding project-local pack is enabled or linked.

   | Stage | Skills |
   |-------|--------|
   | Pack Management | `pack`, `pack list`, `pack status`, `pack recommend`, `pack install <pack>`, `pack remove <pack>` |
   | Discovery & Market Fit | `icp`, `enterprise-icp` |
   | Game Development | `game-workflow`, `game-audience`, `game-fantasy`, `game-genre-map`, `game-comparables`, `game-core-loop`, `game-prototype-test`, `game-store-page-test`, `game-playtest-metrics`, `game-roadmap`, `game-launch` |
   | Devtool Development | `devtool-workflow`, `devtool-user-map`, `devtool-integration-map`, `devtool-dx-journey`, `devtool-adoption`, `devtool-positioning`, `devtool-monetization`, `devtool-docs-audit` |
   | Planning | `brainstorm`, `brainstorm-kanban`, `clone-spec-store`, `concept-exploration`, `feature-interview`, `spec-interview`, `spec-interview --ideas`, `ui-interview`, `ux-variation`, `spec-interview-kanban`, `experiment` |
   | Mapping | `journey-map`, `metrics` |
   | Strategize | `roadmap`, `roadmap-kanban`, `competitive-analysis`, `platform-strategy`, `gtm`, `landing-copy`, `monetization`, `positioning`, `runway-model` |
   | Evaluate | `dogfood`, `mvp-gap`, `scale-audit`, `customer-feedback`, `assumption-tracker`, `cohort-review`, `retro` |
   | Research Health | `research-roadmap`, `reconcile-research`, `reconcile-dev-docs` |
   | Detail | `plan-phase` |
   | Execution | `run`, `run-kanban` |
   | Shipping | `ship`, `ship-end`, `ship-kanban`, `ship-end-kanban` |
   | Code Quality | `expert-review`, `regression-check`, `dead-code` |
   | Debugging | `investigate`, `debug`, `trace` |
   | Refactoring & Migration | `migrate`, `decommission`, `scaffold` |
   | Monorepo | `affected` |
   | Release & Deploy | `release`, `deploy` |
   | Context & Session | `handoff`, `sync`, `investor-update` |
   | Git Workflow | `branch-lifecycle` |
   | Utility | `commit-and-push-by-feature`, `analyze-sessions`, `install-agentic-skills`, `targeted-skill-builder`, `provision-agentic-config`, `poketo-kanban`, `poketo-kanban --archive`, `sync-roadmap-kanban`, `skills`, `risk-register` |

   Skills not found in the mapping go into an **Other** group at the end.

4. **Group skills by activity type** (type mode only) using the `type` field from frontmatter:

   | Type | Description |
   |------|-------------|
   | `research` | Web search + analysis → produces documents |
   | `analysis` | Reads codebase/docs → produces assessments |
   | `planning` | Interactive → produces specs/plans |
   | `execution` | Writes/modifies code |
   | `review` | Reads code → reports issues (no changes) |
   | `debugging` | Investigates + fixes problems |
   | `shipping` | Commits, deploys, session management |
   | `ops` | Manages boards, branches, meta-tooling |

   Display order: research → analysis → planning → execution → review → debugging → shipping → ops.
   Skills with no `type` field go into an **Other** group at the end.

5. **Apply filter (search mode only):**
   - Match the keyword case-insensitively against each skill's `name`, `description`, and `type`.
   - Keep only matching skills. Remove empty groups.

6. **Output results:**
   - Print each non-empty group as a `## Group Name` heading.
   - Under each heading, list skills as `$<name> — <description>`.
   - In type mode, append the type tag: `$<name> — <description>  [type]`.
   - In list mode (stage grouping), append the type tag: `$<name> — <description>  [type]`.
   - Omit groups that have no skills (after filtering in search mode).
   - At the bottom, print a total count: `**N skills** found` (or `**N skills** matching "<keyword>"`).

## Output Format

### List mode (default — grouped by workflow stage)
```
## Discovery & Market Fit
$icp — Customer discovery interview...  [research]
$enterprise-icp — Enterprise multi-stakeholder discovery...  [research]

## Planning
$brainstorm — Evaluate the codebase and suggest ideas...  [planning]
...

## Planning (when a kanban pack is enabled)
$brainstorm-kanban — Brainstorm ideas and create kanban cards...  [planning]
...

**N skills** found
```

### Type mode (`$skills types`)
```
## Research
$icp — Customer discovery interview...
$competitive-analysis — Research competitors...
...

## Analysis
$mvp-gap — Evaluate codebase against ICP...
...

**N skills** found
```

## Constraints

- This is a read-only scan — never modify any files.
- Always read the live frontmatter from SKILL.md files; do not hardcode descriptions.
- Use the static stage mapping for stage grouping; use the `type` frontmatter field for type grouping.
- Keep output compact — one line per skill, no extra detail beyond name, description, and type tag.
- In search mode, if no skills match the keyword, print: `No skills matching "<keyword>"`.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
