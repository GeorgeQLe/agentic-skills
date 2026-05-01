---
name: devtool-user-map
description: Use only for developer-facing products; map users, buyers, champions, contributors, and operational stakeholders
type: research
version: 1.0.0
---

# Devtool User Map

Invoke as `$devtool-user-map`.

Map the developer-facing audience and buying context.

## Output

Write or update `research/devtool-user-map.md` with developer users, economic buyers, champions, maintainers, operators, use cases, and adoption blockers.

## Next-Skill Routing

After writing the artifact, recommend the next contextual skill:

1. If `tasks/todo.md` has an unchecked devtool item in `## Priority Documentation Todo`, recommend the first unchecked devtool command from that queue.
2. Otherwise, follow the default devtool sequence: `$devtool-integration-map` after this skill.
3. If the sequence is ambiguous or multiple devtool artifacts are stale, recommend `$research-roadmap` to rebuild the ordered documentation queue.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.
