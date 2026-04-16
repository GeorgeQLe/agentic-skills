---
name: game-genre-map
description: Use only for video game projects; map genre conventions, player expectations, review complaints, and anti-patterns
type: research
version: 1.0.0
---

# Game Genre Map

Invoke as `$game-genre-map`.

Map the genre contract for the game.

## Output

Write or update `research/game-genre-map.md` with expected conventions, common complaints, overused mechanics, underserved combinations, and player tolerance risks.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.
