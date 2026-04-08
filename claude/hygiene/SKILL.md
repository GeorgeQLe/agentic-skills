---
name: hygiene
description: Audit project structure for convention violations, missing files, template drift, and cross-platform sync gaps — optionally auto-fix
type: analysis
version: 1.0.0
argument-hint: "[audit|fix] [skills|tasks|docs|codex|all]"
---

# Hygiene — Project Structure Audit

Checks that project files follow established conventions, flags gaps and drift, and optionally fixes mechanical issues. Think of it as a linter for project structure rather than code.

## Process

### 1. Determine Mode and Scope

Parse `$ARGUMENTS`:

- **Mode**: `audit` (default, read-only) or `fix` (apply mechanical fixes)
- **Scope**: `skills`, `tasks`, `docs`, `codex`, or `all` (default)

Read `CLAUDE.md` for project conventions. Read `docs/skills-reference.md` for the canonical skill list.

### 2. Audit Skills (`skills` scope)

For each directory in `claude/*/SKILL.md`:

**Frontmatter check:**
- Has `name` field — matches directory name
- Has `description` field — non-empty, under 120 characters
- Has `version` field — valid semver (X.Y.Z)
- Has `argument-hint` field (can be empty)

**Section check:**
- Has a top-level `# Heading` that matches the skill's purpose
- Has `## Process` section with numbered steps
- Has `## Output Format` section (or explicit "no files written" note)
- Has `## Constraints` section

**Naming check:**
- Directory name uses kebab-case
- Directory name matches frontmatter `name`

Flag each violation with the file path and what's wrong.

### 3. Audit Tasks (`tasks` scope)

Check expected project files exist based on project phase:

**Always expected:**
- `tasks/roadmap.md` — has content, not just a placeholder
- `tasks/todo.md` — has content with checkable items (`- [ ]` or `- [x]`)
- `tasks/history.md` — exists

**Expected if specs exist:**
- `tasks/ideas.md` — exists if `specs/*.md` has 2+ files

**Phase archives:**
- If `tasks/roadmap.md` has completed phases (checked-off milestones), `tasks/phases/` should exist with corresponding `phase-N.md` files

**Staleness (informational, not violations):**
- `tasks/todo.md` has all items checked but phase isn't marked complete in `tasks/roadmap.md`
- `tasks/roadmap.md` references phases that have no corresponding detail

### 4. Audit Docs (`docs` scope)

**Skills reference sync:**
- Every directory in `claude/` has a corresponding entry in `docs/skills-reference.md`
- Every entry in `docs/skills-reference.md` has a corresponding directory in `claude/`
- The Quick Reference table at the bottom is complete (no missing, no extras)

**Required docs:**
- `CLAUDE.md` exists at project root

### 5. Audit Codex Mirror (`codex` scope)

Compare `claude/` and `codex/` directories:

- Every skill in `claude/` should have a corresponding `codex/<name>/SKILL.md`
- Flag skills that exist in one but not the other
- For skills that exist in both, check that the codex version has:
  - Matching frontmatter `name` and `description`
  - An `agents/openai.yaml` manifest (if the skill is execution-oriented, not display-only)

**Known exceptions** (skills that intentionally only exist in one platform):
- Check for a `# codex-skip` comment in the claude skill's frontmatter — if present, don't flag the missing codex mirror

### 6. Generate Report

Categorize all findings:

| Severity | Meaning |
|----------|---------|
| **Error** | Convention violation that should be fixed (missing required field, naming mismatch) |
| **Warning** | Drift or gap that may be intentional (missing codex mirror, incomplete sections) |
| **Info** | Suggestions for improvement (long descriptions, missing optional sections) |

### 7. Auto-Fix (if `fix` mode)

Only fix mechanical, unambiguous issues:

- Add missing `argument-hint:` field (empty) to frontmatter
- Fix `name` field to match directory name
- Create stub `codex/<name>/SKILL.md` from claude version (copy frontmatter + intro, add TODO for codex-specific content)
- Add missing skill entries to the Quick Reference table in `docs/skills-reference.md`

**Never auto-fix:**
- Missing Process/Output/Constraints sections (these need human judgment)
- Content mismatches between claude and codex versions
- Roadmap or todo content

After fixing, re-run the audit to show remaining issues.

## Output Format

Display directly to the user (no files written in audit mode):

```
## Hygiene Report — [scope]

### Errors (X)
- **claude/foo/SKILL.md** — missing `version` field in frontmatter
- **claude/bar/SKILL.md** — directory name `bar` doesn't match frontmatter name `baz`

### Warnings (X)
- **codex/poketo-kanban/** — missing codex mirror (exists in claude/ only)
- **docs/skills-reference.md** — `/hygiene` not listed in Quick Reference table

### Info (X)
- **claude/ship/SKILL.md** — no `## Constraints` section (consider adding)

### Summary
- Skills: 48 checked, 2 errors, 1 warning
- Tasks: 4 checked, 0 errors
- Docs: 3 checked, 1 warning
- Codex: 46 checked, 2 warnings
```

In `fix` mode, prepend each fixed item with a checkmark:

```
### Fixed
- [x] Added missing `argument-hint:` to claude/foo/SKILL.md
- [x] Created stub codex/hygiene/SKILL.md

### Remaining Errors (X)
...
```

## Constraints

- **Read-only by default.** Only modify files when explicitly invoked with `fix` mode.
- **No content generation.** Auto-fix only adds structural scaffolding, never writes substantive content.
- **Show evidence.** Every finding must include the specific file path and what's wrong.
- **No false positives.** If uncertain whether something is a violation, classify it as Info, not Error.
- **Respect exceptions.** Check for `# codex-skip` and similar markers before flagging intentional gaps.
- **Use subagents** to parallelize scanning across skills, tasks, docs, and codex scopes when running `all`.
