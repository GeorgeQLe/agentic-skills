# Phase 9: Skill Infrastructure

**Goal:** Improve skill discoverability, validate cross-references, and track changes.

## Steps

- [x] **Skill discovery command** — create a `/skills` command that lists all skills grouped by workflow stage with keyword search
- [ ] **Skill dependency graph** — parse SKILL.md cross-references, detect broken refs
- [ ] **Skill versioning** — semver in frontmatter, changelog tracking

## Acceptance Criteria
- [x] `/skills` command lists skills grouped by workflow stage with keyword search
- [ ] Dependency graph script detects broken cross-references between skills
- [ ] At least one iteration of versioning scheme documented and applied to 3+ skills
- [ ] No broken skill cross-references in the repo

## Next Step Plan: Skill dependency graph

### Context

Skills reference each other via `/skill-name` mentions in their SKILL.md content (e.g., `/ship` mentions `/commit-and-push-by-feature`). These cross-references can become stale when skills are renamed or removed. A dependency graph script can parse all SKILL.md files, extract `/skill-name` references, build a graph, and report broken refs.

### Changes

#### 1. Create `scripts/skill-deps.sh` (or `.mjs`)

A script that:
- Scans all `claude/*/SKILL.md` files
- Extracts `/skill-name` references from each file's body (after frontmatter)
- Builds a dependency map: `{ skill-name: [referenced-skills] }`
- Validates each reference against discovered skills (from Step 1's Glob pattern)
- Reports:
  - **Broken references** — `/foo` mentioned but no `claude/foo/SKILL.md` exists
  - **Dependency summary** — which skills reference which (optional, for info)
- Exit code 0 if no broken refs, 1 if any found

Regex for extracting refs: match `\/[a-z][a-z0-9-]+` patterns in SKILL.md body text. Filter out false positives:
- Skip code blocks (lines starting with spaces/tabs or inside ``` fences)
- Skip filesystem paths (e.g., `/home/`, `/usr/`, `/tmp/`, paths containing `.` like `/path/to/file.md`)
- Skip patterns inside URLs
- Only match known skill name patterns (lowercase, hyphens, no dots or slashes after)

#### 2. Run the script and fix any broken references found

If the script finds broken refs, fix them in the relevant SKILL.md files.

#### 3. Update `docs/skills-reference.md`

Document the script in the reference or in a "Development" section if appropriate.

### Files

- `scripts/skill-deps.sh` or `scripts/skill-deps.mjs` — **new**, dependency graph + validation script
- Any SKILL.md files with broken refs — **fix**

### Verification

- `node scripts/skill-deps.mjs` (or `bash scripts/skill-deps.sh`) exits 0 with clean output
- Intentionally break a ref → script catches it and exits 1
- No false positives on filesystem paths or URLs

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
