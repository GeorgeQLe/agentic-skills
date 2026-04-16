---
name: devtool-dx-journey
description: Use only for developer-facing products; analyze install, quickstart, first success, debugging, and production adoption journeys
type: analysis
version: 1.0.0
---

# Devtool DX Journey

Invoke as `$devtool-dx-journey`.

Map the developer experience from discovery to production use.

## Output

Write or update `research/devtool-dx-journey.md` with install, quickstart, first success, error recovery, production adoption, team rollout, and retention journeys.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.
