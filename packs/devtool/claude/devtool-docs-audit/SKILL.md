---
name: devtool-docs-audit
description: Use only for developer-facing products; audit docs for quickstart clarity, examples, API reference, troubleshooting, and migration paths
type: review
version: 1.0.0
---

# Devtool Docs Audit

Review developer documentation for adoption blockers.

## Output

Write or update `research/devtool-docs-audit.md` with a findings-first docs audit covering quickstart clarity, examples, API reference, troubleshooting, migration paths, and missing proof artifacts. In the final response, include `Recommended next skill: <command>` using the `## Next-Skill Routing` rules below.

## Alignment Page

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/devtool-docs-audit-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/devtool-docs-audit-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual skill:

1. If `tasks/todo.md` has an unchecked devtool item in `## Priority Documentation Todo`, recommend the first unchecked devtool command from that queue.
2. Otherwise, recommend `/research-roadmap` to confirm the devtool documentation queue is complete and identify any non-devtool follow-up.
3. If `/research-roadmap` reports no queue, recommend `/roadmap` only when implementation planning is missing or stale.
