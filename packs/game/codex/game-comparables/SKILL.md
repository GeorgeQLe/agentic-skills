---
name: game-comparables
description: Use only for video game projects; research comparable titles, tags, prices, player signals, and positioning patterns
type: research
version: 1.0.0
---

# Game Comparables

Invoke as `$game-comparables`.

Research comparable games as market teachers, not just competitors.

## Output

Write or update `research/game-comparables.md` with comparable titles, tags, price points, review signals, update cadence, creator traction, and the positioning frame `X meets Y, but Z`.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.
