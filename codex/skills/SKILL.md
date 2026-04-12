---
name: skills
description: Browse and search all available skills, grouped by workflow stage or activity type
type: ops
version: 1.1.0
argument-hint: "[list | types | search <keyword>]"
---

# Skills

Discover and search all available skills in this repository, grouped by workflow stage or activity type.

## Process

1. **Parse arguments:**
   - If `$ARGUMENTS` is empty or `list` → **list mode** (show all skills grouped by workflow stage).
   - If `$ARGUMENTS` is `types` → **type mode** (show all skills grouped by activity type).
   - If `$ARGUMENTS` starts with `search ` → **search mode** (filter by keyword after `search`).

2. **Discover skills:**
   - Use Glob to find all `codex/*/SKILL.md` files.
   - Read the first 6 lines of each file to extract YAML frontmatter fields: `name`, `description`, `type`.

3. **Group skills by workflow stage** using this static mapping:

   | Stage | Skills |
   |-------|--------|
   | Discovery & Market Fit | `icp`, `enterprise-icp` |
   | Planning | `brainstorm`, `brainstorm --kanban`, `plan-interview`, `plan-interview --ideas`, `plan-interview --kanban`, `experiment` |
   | Mapping | `journey-map`, `metrics` |
   | Strategize | `roadmap`, `roadmap --kanban`, `competitive-analysis`, `platform-strategy`, `gtm`, `landing-copy`, `monetization`, `positioning`, `runway-model` |
   | Evaluate | `mvp-gap`, `scale-audit`, `customer-feedback`, `assumption-tracker`, `cohort-review`, `retro` |
   | Workflow | `workflow`, `reconcile-research`, `reconcile-dev-docs` |
   | Detail | `plan-phases` |
   | Execution | `run`, `run --kanban` |
   | Shipping | `ship`, `ship-end`, `ship --kanban`, `ship-end --kanban` |
   | Code Quality | `expert-review`, `regression-check`, `dead-code` |
   | Debugging | `investigate`, `debug`, `trace` |
   | Refactoring & Migration | `migrate`, `decommission`, `scaffold` |
   | Monorepo | `affected` |
   | Release & Deploy | `release`, `deploy` |
   | Context & Session | `handoff`, `sync`, `investor-update` |
   | Git Workflow | `branch-lifecycle` |
   | Utility | `commit-and-push-by-feature`, `analyze-sessions`, `install-workflow-orchestration`, `poketo-kanban`, `poketo-kanban --archive`, `sync-roadmap-kanban`, `skills`, `risk-register` |

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
$brainstorm --kanban — Brainstorm ideas and create kanban cards...  [planning]
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

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
