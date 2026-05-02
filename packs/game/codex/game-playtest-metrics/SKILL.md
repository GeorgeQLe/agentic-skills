---
name: game-playtest-metrics
description: Use only for video game projects; define playtest metrics for time-to-fun, replay, confusion, quit points, sharing, and retention
type: analysis
version: 1.0.0
---

# Game Playtest Metrics

Invoke as `$game-playtest-metrics`.

Define what evidence will prove the game is legible, compelling, replayable, and shareable.

## Output

Write or update `research/game-playtest-metrics.md` with first-session completion, time-to-fun, replay rate, confusion points, quit points, clip/share moments, demo conversion, wishlist conversion, and retention metrics where relevant.

## Next-Skill Routing

After writing the artifact, recommend the next contextual game-pack skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `$game-store-page-test`.

If prototype, playtest, or market evidence invalidates an upstream assumption, route back to the earliest affected artifact (`$game-audience`, `$game-fantasy`, `$game-genre-map`, or `$game-comparables`) and explain the evidence. Otherwise, follow the default game sequence:

`$game-audience` -> `$game-fantasy` -> `$game-genre-map` -> `$game-comparables` -> `$game-core-loop` -> `$game-prototype-test` -> `$game-playtest-metrics` -> `$game-store-page-test` -> `$game-launch` -> `$game-roadmap`

If the next artifact already exists and is current, recommend `$game-workflow` to identify the first missing or stale game-pack artifact.

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
