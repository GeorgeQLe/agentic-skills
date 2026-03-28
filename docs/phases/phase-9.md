# Phase 9: Skill Infrastructure

**Goal:** Improve skill discoverability, validate cross-references, and track changes.

## Steps

- [x] **Skill discovery command** — create a `/skills` command that lists all skills grouped by workflow stage with keyword search
- [x] **Skill dependency graph** — parse SKILL.md cross-references, detect broken refs
- [x] **Skill versioning** — semver in frontmatter, changelog tracking

## Acceptance Criteria
- [x] `/skills` command lists skills grouped by workflow stage with keyword search
- [x] Dependency graph script detects broken cross-references between skills
- [x] At least one iteration of versioning scheme documented and applied to 3+ skills
- [x] No broken skill cross-references in the repo

## Next Step Plan: Skill versioning

### Context

Skills currently have no version tracking. When a skill's behavior changes (new flags, altered workflow, fixed bugs), downstream consumers have no way to know. Adding semver to SKILL.md frontmatter and a per-skill CHANGELOG provides traceability. This is the last step in Phase 9.

Current SKILL.md frontmatter has: `name`, `description`, `argument-hint`. We add `version` (semver string).

### Changes

#### 1. Define the versioning scheme

Add a `version` field to SKILL.md frontmatter. Format: `version: X.Y.Z` (semver). Initial version for all existing skills: `1.0.0` (they are already stable and in use).

Versioning rules (document in a short `docs/skill-versioning.md`):
- **Major** (X): breaking change to skill behavior, renamed/removed flags, changed output format
- **Minor** (Y): new capability, new flag, expanded scope (backward-compatible)
- **Patch** (Z): bug fix, wording tweak, no behavior change

#### 2. Add `version: 1.0.0` to all SKILL.md frontmatter

For every `claude/*/SKILL.md`, add `version: 1.0.0` after the `description` line (before `argument-hint` if present). This is a bulk edit across all 43 skills.

#### 3. Create `scripts/skill-versions.sh`

A script that:
- Scans all `claude/*/SKILL.md` files
- Extracts the `version:` field from frontmatter
- Reports: skill name, version, and flags any missing versions
- Supports `--json` for programmatic output
- Exit code 0 if all skills have versions, 1 if any missing

#### 4. Apply version bumps to 3+ recently changed skills

Pick at least 3 skills that were modified in Phase 9 and bump their versions to demonstrate the scheme:
- `claude/skills/SKILL.md` → `1.0.0` (new in Phase 9, so `1.0.0` is correct)
- `claude/ship/SKILL.md` → review recent changes, bump if warranted
- `claude/run/SKILL.md` → review recent changes, bump if warranted

### Files

- `claude/*/SKILL.md` (all 43) — **edit**, add `version: 1.0.0` to frontmatter
- `docs/skill-versioning.md` — **new**, versioning scheme documentation
- `scripts/skill-versions.sh` — **new**, version audit script

### Verification

- All 43 SKILL.md files have `version:` in frontmatter: `grep -rL '^version:' claude/*/SKILL.md` returns nothing
- `bash scripts/skill-versions.sh` exits 0 with all versions listed
- `bash scripts/skill-versions.sh --json` returns valid JSON
- Remove a version from one SKILL.md → script catches it, exits 1
- `docs/skill-versioning.md` explains major/minor/patch rules

## On Completion
- Deviations from plan: Skipped per-skill CHANGELOG files — version field + git history is sufficient. Applied v1.0.0 to all 43 skills rather than selectively bumping 3 (all are stable, uniform baseline is cleaner). Skipped codex skills (out of scope).
- Tech debt / follow-ups: Codex skills could be versioned later if needed.
- Ready for next phase: Yes — Phase 9 complete.
