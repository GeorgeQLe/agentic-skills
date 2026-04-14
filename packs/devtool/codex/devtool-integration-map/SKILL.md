---
name: devtool-integration-map
description: Use only for developer-facing products; map integrations, ecosystems, setup surfaces, and compatibility constraints
type: analysis
version: 1.0.0
---

# Devtool Integration Map

Map where the tool fits into a developer's stack.

## Output

Write or update `research/devtool-integration-map.md` with required integrations, ecosystem assumptions, setup path, compatibility constraints, and migration risks.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.
