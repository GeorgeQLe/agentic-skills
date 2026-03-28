# Phase 9: Skill Infrastructure

**Goal:** Improve skill discoverability, validate cross-references, and track changes.

## Steps

- [ ] **Skill discovery command** — create a `/skills` command that lists all skills grouped by workflow stage with keyword search
- [ ] **Skill dependency graph** — parse SKILL.md cross-references, detect broken refs
- [ ] **Skill versioning** — semver in frontmatter, changelog tracking

## Acceptance Criteria
- [ ] `/skills` command lists skills grouped by workflow stage with keyword search
- [ ] Dependency graph script detects broken cross-references between skills
- [ ] At least one iteration of versioning scheme documented and applied to 3+ skills
- [ ] No broken skill cross-references in the repo

## Next Step Plan: Skill discovery command

### Context

There are 42+ skills across `claude/` and `codex/` directories. Currently the only way to find skills is by reading `docs/skills-reference.md` or browsing directories. A `/skills` command would let users search and browse skills interactively from the CLI.

### Changes

#### 1. Create `claude/skills/SKILL.md`

A new Claude skill that:
- Scans `claude/*/SKILL.md` and `codex/*/SKILL.md` to discover all skills
- Groups skills by workflow stage (planning, building, shipping, maintenance, kanban)
- Supports keyword search: `/skills search deploy` finds skills mentioning "deploy"
- Outputs a formatted table with skill name, description, and workflow stage

The workflow stage grouping should be derived from skill content or a lightweight mapping. Check `docs/skills-reference.md` for the existing grouping (it already categorizes skills by workflow stage).

#### 2. Determine workflow stage mapping

Read `docs/skills-reference.md` to understand the existing categories. The skill should either:
- Parse the reference doc for groupings, OR
- Infer stage from SKILL.md content keywords (plan, ship, deploy, test, kanban, etc.)

Pick the simpler approach. A static mapping in the skill itself is fine for v1.

#### 3. Add to `docs/skills-reference.md`

Add the new `/skills` entry to the reference doc under the appropriate section.

### Files

- `claude/skills/SKILL.md` — **new**, the skill discovery command
- `docs/skills-reference.md` — add `/skills` entry

### Verification

- `/skills` lists all 42+ skills grouped by stage
- `/skills search kanban` returns only kanban-related skills
- `/skills search deploy` returns deploy/ship skills
- No broken skill references in output

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
