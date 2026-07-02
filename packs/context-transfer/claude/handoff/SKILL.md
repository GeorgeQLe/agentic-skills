---
name: handoff
description: Generate a project-level context snapshot for resuming work in a fresh session
type: shipping
version: v0.2
required_conventions: [alignment-page]
argument-hint: "[focus area] [--target=codex]"
---

# Handoff

Generate a self-contained context document that captures exactly where you left off in a project, so a fresh Claude session can pick up immediately without re-reading the entire codebase.

## Process

1. **Gather current state:**
   - Read `tasks/todo.md` for the current phase detail and active step.
   - Read `tasks/roadmap.md` for overall progress context (which phases are done, what's ahead).
   - Read `tasks/manual-todo.md` (if it exists) for pending manual tasks.
   - Read `tasks/record-todo.md` and `tasks/recurring-todo.md` (if they exist) for advisory task counts.
   - Read `CLAUDE.md` for project conventions.
   - Run `git status` and `git log --oneline -10` for recent activity.
   - Run `git diff --stat` if there are uncommitted changes.
   - Check for any blockers or notes in `tasks/todo.md`.

2. **Identify the work in progress:**
   - What phase/step was being worked on.
   - What files were being modified (from git status/diff).
   - What technical decisions were made during this session.
   - What approach was being taken and why.

3. **Check for loose ends:**
   - Uncommitted changes that need attention.
   - Failing tests.
   - TODOs or FIXMEs added during the session.
   - Blockers or open questions.

4. **If `$ARGUMENTS` specifies a focus area**, emphasize that in the handoff context.

5. **If `$ARGUMENTS` contains `--target=codex`, produce a cross-CLI approval packet** before writing the handoff doc. **Requires `jq` on PATH:** `scripts/approved-plan.sh draft` (step 5.4) and the pretty-print in step 5.5 both invoke `jq`; if absent, `scripts/approved-plan.sh`'s `require_jq_write` (at `scripts/approved-plan.sh:21`) dies with `ERROR: jq required for write operations. Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu).` before any packet is drafted. No degraded path — install `jq` and retry.
   1. Resolve the effective agent mode via `./scripts/agent-mode.sh`. If the resolved mode is `codex-only`, stop immediately with a `mode-mismatch:` error — Claude is not the planner in that mode.
   2. Require a clean tracked tree. If `git status --porcelain` reports dirty paths, the user must pass repeatable `--allow-dirty <glob>` flags covering every dirty path. Glob semantics match the Step 4 consumer (`scripts/approved-plan.sh check`) — `case "$path" in $glob)` shell globbing, not regex.
   3. Derive `phase` / `step` / `title` from `tasks/todo.md`. Read the **first unchecked** `- [ ]` under the `### Active Step Plan` block; if no such block exists, fall back to the first unchecked `- [ ]` under the current `## Phase N` header. Parse the `Phase N` and `Step N.X` tokens out of the surrounding context; use the checkbox line's text (stripped of `- [ ] **Step N.X** — `) as `title`.
   4. Call `./scripts/approved-plan.sh draft --phase "Phase N" --step "Step N.X" --title "<title>"` plus any `--allow-dirty <glob>` flags the user supplied. Surface the helper's single-line failure reason verbatim if it fails.
   5. Pretty-print the drafted packet with `jq . .agents/approved-plan.json`, then ask exactly one concise question: *"Approve this packet for Codex execution?"*. On yes → `./scripts/approved-plan.sh approve`. On no → leave the packet at `draft` and tell the user they can approve it later with `./scripts/approved-plan.sh approve` or discard it with `./scripts/approved-plan.sh supersede`.
   6. When writing `tasks/handoff.md` in the next step, add a **Cross-CLI handoff** section naming `.agents/approved-plan.json` (JSON, gitignored), `tasks/approved-plan.md` (committable mirror), and the resume command: `$exec --execute-approved` (Codex).

6. **Write the handoff to `tasks/handoff.md`:**

## Handoff Document Format

```markdown
# Handoff — [Project Name] — [Date]

## Current State
- **Phase**: X — [phase name]
- **Step**: Y — [step name]
- **Status**: in-progress / blocked / ready-for-next
- **Branch**: [branch name]
- **Last commit**: [hash] [message]

## What Was Done This Session
- [Concise bullet list of completed work]

## Work In Progress
- [What's partially done, with file paths]
- [Technical decisions made and why]
- [Approach being taken]

## Uncommitted Changes
- [List of modified files and what changed, or "none"]

## Blockers / Open Questions
- [Any blockers, or "none"]

## Pending Manual Tasks
- [Unchecked items from `tasks/manual-todo.md`, or "none"]
- [Note any that block upcoming automated steps]

## Pending Advisory Tasks
- [Record/recurring task counts from `tasks/record-todo.md` and `tasks/recurring-todo.md`, or "none"]
- [Note that these are not execution blockers unless promoted to `tasks/todo.md`]

## Next Steps
- [Exactly what to do next, specific enough to execute without re-reading context]
- [Files to read first]
- [Commands to run]

## Key Files for Context
- [List of 3-5 files most relevant to the current work]
```

## Output

After writing the handoff, report:
- Path to the handoff document
- One-line summary of the project state
- Whether there are uncommitted changes that should be committed first

## Constraints
- The handoff must be **self-contained** — a fresh session should be able to read only this file, `tasks/todo.md`, and optionally `tasks/roadmap.md` to start working.
- Do not include full file contents — only paths and brief descriptions.
- Keep it concise — the handoff should be under 100 lines.
- Do not commit the handoff document automatically — let the user decide.
- If there are uncommitted changes, warn the user to commit or stash before switching contexts.


## Alignment Page

Follow `ALIGNMENT-PAGE.md` in this skill's directory for optional alignment-page behavior and output path. By default, report results inline and write only this skill's normal durable artifacts; create an alignment page only when explicitly requested or when a concrete clarification/review need cannot be handled cleanly inline.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
