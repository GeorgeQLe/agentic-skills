---
name: skills
description: Browse and search all available skills, grouped by workflow stage
version: 1.0.0
argument-hint: [list | search <keyword>]
---

# Skills

Discover and search all available skills in this repository, grouped by workflow stage.

## Process

1. **Parse arguments:**
   - If `$ARGUMENTS` is empty or `list` → **list mode** (show all skills).
   - If `$ARGUMENTS` starts with `search ` → **search mode** (filter by keyword).

2. **Discover skills:**
   - Find all `claude/*/SKILL.md` files.
   - Read frontmatter from each to extract `name` and `description`.

3. **Group by workflow stage** using the static mapping:
   - Discovery & Market Fit, Planning, Mapping, Strategize, Evaluate, Workflow, Detail, Execution, Shipping, Code Quality, Debugging, Refactoring & Migration, Monorepo, Release & Deploy, Context & Session, Utility.
   - Skills not in the mapping go into **Other**.

4. **Apply filter (search mode only):**
   - Match keyword case-insensitively against `name` and `description`.

5. **Output results:**
   - Print each non-empty stage as a heading with skills listed as `/<name> — <description>`.
   - Print total count at the bottom.

## Output Format

```
## Discovery & Market Fit
/icp — Customer discovery interview...
/enterprise-icp — Enterprise multi-stakeholder discovery...

## Planning
/brainstorm — Evaluate the codebase and suggest ideas...

**N skills** found
```

## Constraints

- Read-only — never modify any files.
- Always read live frontmatter from SKILL.md files; do not hardcode descriptions.
- Use the static stage mapping for grouping; do not infer categories from file paths.
- Keep output compact — one line per skill.
- In search mode, if no skills match: `No skills matching "<keyword>"`.
