---
name: skills
description: Browse and search all available skills, grouped by workflow stage
argument-hint: [list | search <keyword>]
---

# Skills

Discover and search all available skills in this repository, grouped by workflow stage.

## Process

1. **Parse arguments:**
   - If `$ARGUMENTS` is empty or `list` → **list mode** (show all skills).
   - If `$ARGUMENTS` starts with `search ` → **search mode** (filter by keyword after `search`).

2. **Discover skills:**
   - Use Glob to find all `claude/*/SKILL.md` files.
   - Read the first 5 lines of each file to extract YAML frontmatter fields: `name`, `description`.

3. **Group skills by workflow stage** using this static mapping:

   | Stage | Skills |
   |-------|--------|
   | Discovery & Market Fit | `icp`, `enterprise-icp` |
   | Planning | `brainstorm`, `brainstorm-kanban`, `plan-interview`, `plan-interview-ideas`, `plan-interview-kanban` |
   | Strategize | `roadmap`, `roadmap-kanban`, `competitive-analysis` |
   | Detail | `plan-phases` |
   | Execution | `run`, `run-step`, `run-phases`, `run-kanban` |
   | Shipping | `ship`, `ship-then-plan`, `ship-end`, `ship-kanban`, `ship-end-kanban` |
   | Code Quality | `expert-review`, `regression-check`, `dead-code` |
   | Debugging | `investigate`, `debug`, `trace` |
   | Refactoring & Migration | `migrate`, `decommission`, `scaffold` |
   | Monorepo | `affected` |
   | Release & Deploy | `release`, `deploy` |
   | Context & Session | `handoff`, `sync` |
   | Utility | `commit-and-push-by-feature`, `analyze-sessions`, `install-workflow-orchestration`, `poketo-kanban`, `kanban-archive`, `sync-roadmap-kanban`, `skills` |

   Skills not found in the mapping go into an **Other** group at the end.

4. **Apply filter (search mode only):**
   - Match the keyword case-insensitively against each skill's `name` and `description`.
   - Keep only matching skills. Remove empty stage groups.

5. **Output results:**
   - Print each non-empty stage as a `## Stage Name` heading.
   - Under each heading, list skills as `/<name> — <description>`.
   - Omit stages that have no skills (after filtering in search mode).
   - At the bottom, print a total count: `**N skills** found` (or `**N skills** matching "<keyword>"`).

## Output Format

```
## Discovery & Market Fit
/icp — Customer discovery interview...
/enterprise-icp — Enterprise multi-stakeholder discovery...

## Planning
/brainstorm — Evaluate the codebase and suggest ideas...
/brainstorm-kanban — Brainstorm ideas and create kanban cards...
...

**43 skills** found
```

## Constraints

- This is a read-only scan — never modify any files.
- Always read the live frontmatter from SKILL.md files; do not hardcode descriptions.
- Use the static stage mapping above for grouping; do not infer categories from file paths.
- Keep output compact — one line per skill, no extra detail beyond name and description.
- In search mode, if no skills match the keyword, print: `No skills matching "<keyword>"`.
