---
skill: autoresearch-prep
agent: claude
captured_at: 2026-06-09T12:00:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Plan: `autoresearch-prep` Skill

## Context

The `/autoresearch` skill requires a `program.md` file the user must create manually. This prep skill scaffolds that file by auto-detecting codebase signals (benchmarks, tests, sandbox boundaries) and asking the user only what it can't infer (metric direction, research directions). This reduces friction for getting started with autoresearch.

## Files

### Create
- **`global/claude/autoresearch-prep/SKILL.md`** — the skill contract
- **`global/claude/autoresearch-prep/CHANGELOG.md`** — v0.0 initial
- **`prompts/autoresearch-prep/skill-prompt-*.md`** — prompt history

### Modify
- **`global/claude/autoresearch/SKILL.md`** — add recommendation for `/autoresearch-prep` when `program.md` is missing (two small edits: Preconditions bullet and Step 0 validation)

## SKILL.md Design

**Frontmatter:** `name: autoresearch-prep`, `type: planning`, `version: v0.0`, `invocation: chained`, `interview_depth: light`

**Process (6 steps):**

0. **Resolve output path** — from `$ARGUMENTS` or default `./program.md`. Warn if file exists.

1. **Auto-detect codebase signals** — scan for:
   - Benchmark commands (package.json scripts, bench/ dirs, Makefile targets, cargo bench, go test -bench, pytest-benchmark)
   - Test commands (package.json test, Makefile test, pytest, cargo test, go test, etc.)
   - Sandbox globs (src/**, lib/**, app/** based on what exists)
   - Exclude patterns (test files, config, benchmark harness, build output, lock files)

2. **Light interview (1-3 questions)** — present detected signals, then ask:
   - Metric command + direction (always required — human insight)
   - Research directions (always required — the strategic part)
   - Budget (offer default of 20)

3. **Findings validation** — show complete proposed program.md, user confirms/adjusts

4. **Validate metric command** — run it once, confirm it outputs a parseable number. Stop if broken.

5. **Write program.md** — exact format matching autoresearch contract. Include baseline value in Context section.

6. **Route** — recommend `/autoresearch [path]`

**Constraints:** Don't run the loop, don't modify source files, don't create `.autoresearch/` dir, don't create alignment pages.

## Autoresearch SKILL.md Edits

Two targeted changes:

1. **Preconditions bullet** (line 20): append "If missing, recommend `/autoresearch-prep` to scaffold one."
2. **Step 0 body** (after "Resolve `program.md` path"): add "If the file does not exist, stop and recommend `/autoresearch-prep`."

## Verification

1. `bash scripts/skill-archive-audit.sh --strict` — must pass with 0 violations
2. Read both SKILL.md files to confirm cross-references are correct
3. Commit and push to master
