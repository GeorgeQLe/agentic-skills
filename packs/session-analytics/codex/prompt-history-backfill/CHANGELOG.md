# Changelog

## v0.1 - 2026-06-04

- Add legacy skill routing: hardcoded map of renamed/removed/never-existed skill slugs (`run`, `review`, `skill-creator`, `verify`, `simplify`, `schedule`).
- Legacy skill prompts write to `prompts/legacy/<old-slug>/` instead of top-level `prompts/<old-slug>/`.
- Legacy prompt files include `legacy: true` and optional `successor` in YAML frontmatter.
- Candidates matching legacy slugs are tagged `legacy: true` during classification.

## v0.0 - 2026-05-30

- Initial prompt-history backfill skill for report-only audits and explicit `--apply` prompt file creation.
