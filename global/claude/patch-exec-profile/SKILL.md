---
name: patch-exec-profile
description: Audit and fill missing lane metadata (Mode, Depends on, Owns, Branch) in agent-team and implementation-safe execution profiles in tasks/todo.md
type: execution
version: 1.0.0
---

# Patch Exec Profile

Audit and fill missing lane metadata in the `### Execution Profile` blocks of `tasks/todo.md`. This skill is invoked just-in-time — typically auto-invoked by `/run` when an `agent-team` phase has incomplete lane specs. Without complete `Mode`, `Depends on`, and (for write lanes) `Owns` / `Must not edit` / `Branch` values, `/run` cannot build the lane DAG, push branch-backed lane work, open PRs, or enforce write-boundary integration.

## Prerequisites

- `tasks/todo.md` must exist and contain at least one `### Execution Profile` block.

## Protocol

1. **Read `tasks/todo.md`.** Find every phase with `Parallel mode: agent-team` or `Parallel mode: implementation-safe`.
2. **For each lane in each such profile**, check presence and concreteness of:
   - `Mode:` — one of `read-only | write | review`.
   - `Depends on:` — comma-separated lane names within the same phase, or `none`.
   - `Owns:` — required when `Mode: write`.
   - `Must not edit:` — required when `Mode: write`.
   - `Branch:` — required for `agent-team` write lanes and must not be `main` or `master`.
   - Placeholder values (e.g., `read-only | write | review`, `[lane, step, or none]`, `path/or/glob`) count as missing.
3. **Apply inference rules for obvious cases:**
   - Lane name contains `review` (e.g., `correctness-review`, `security-reviewer`) → `Mode: review`, `Depends on: <all write lanes in the phase>`.
   - Lane name contains `research`, `explorer`, `docs-research`, or ends in `-research-only` → `Mode: read-only`, `Depends on: none`.
   - Otherwise → `Mode: write`. `Depends on:` defaults to `none` unless step text references an explicit ordering (e.g., "after lane X completes").
4. **For ambiguous cases** (write lanes with no clear dependency signal but plausible orderings, multiple review lanes with unclear scope), enter plan mode and ask the user via `AskUserQuestion` before writing. Do not guess.
5. **Validate after inference:**
   - All write lanes in a phase have disjoint `Owns` paths (no path prefix overlap). If overlap is detected, surface it and stop — this is a profile design error, not a fill-in.
   - Every `Depends on:` reference names an existing lane in the same phase.
   - The lane DAG has no cycles.
   - Every `agent-team` write lane has a unique non-primary `Branch:` value.
   - The phase includes a consolidation/PR review step after write lanes and before final validation or shipping. If it is missing, surface it and stop; do not invent new implementation steps.
6. **Write the patched profile back to `tasks/todo.md`.** Do not commit. Do not push. `/ship` owns shipping.

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/patch-exec-profile-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/patch-exec-profile-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/patch-exec-profile-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Do not modify anything outside `### Execution Profile` blocks.
- Do not change `Parallel mode` itself — that is a `/plan-phase` decision.
- Do not invent new lanes or new implementation steps. Only fill missing metadata on lanes that already exist.
- Do not fill `Owns` or `Must not edit` by inference — those are load-bearing write-boundary declarations. If a write lane is missing either field, stop and ask the user via `AskUserQuestion`.
- Do not fill `Branch` by inference when the phase naming or lane identity is ambiguous. If obvious, use `agent-team/phase-N-<lane-name>` and ensure it is unique.
- Do not touch `tasks/roadmap.md`, `tasks/history.md`, `tasks/manual-todo.md`, or any non-task file.

## Output

Report concisely:
- Phase(s) audited
- Lanes patched (lane name → fields filled with inferred values)
- Lanes flagged for user input (with the ambiguity)
- Validation errors surfaced (overlapping `Owns`, unresolved `Depends on`, cycles)

## Next-Step Routing

- **Next work:** resume the original executor (typically `/run`) against the patched profile.
- **Recommended next command:** `/run` (or whatever invoked this skill).
