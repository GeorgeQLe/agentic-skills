# Documentation Template Contract

Use this reference when `$hygiene` runs with `docs` or `all` scope. The goal is to check structure, parseability, and canonical placement for generated project documents. Do not use this audit to decide whether document claims are true, current, or complete.

## Classification

Classify files by path before checking headings:

| Family | Paths | Strictness |
| --- | --- | --- |
| Task pipeline | `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, `tasks/phases/phase-N.md`, `tasks/ideas.md`, `tasks/handoff.md`, `tasks/lessons.md` | Strict for workflow-owned files |
| Specs | `specs/*.md`, `specs/{app}/*.md`, `docs/specifications/*.md` | Strict, except `*-interview.md` |
| Interview logs | `*-interview.md`, `research/*-interview.md`, `research/{app}/*-interview.md` | Moderate |
| Research docs | `research/*.md`, `research/{app}/*.md` | Strict for known skill outputs |
| Research support logs | `research/*-search-log.md`, `research/{app}/*-search-log.md` | Moderate |
| Experiments | `research/experiments/*.md`, `research/{app}/experiments/*.md` | Strict |
| Audit/report docs | `specs/drift-report.md`, `tasks/reconciliation-report.md`, `research/reconciliation-report.md`, `docs/debug-changelog.md` | Moderate; append-only reports may vary |
| Ops docs | `sync.md`, `deploy.md`, `tasks/deploy.md`, `tasks/deploys.md` | Strict where headings are named below |
| Agent/project docs | `CLAUDE.md`, `AGENTS.md`, `.agents/project.json`, `README.md` | Structural only |
| Skill-library docs | `SKILL.md`, `PACK.md`, `docs/skills-reference.md` | Use the existing skill and skills-reference checks first |

Skip strict template checks for `docs/history/archive/**`. Treat unknown hand-written Markdown as Info unless a path or heading clearly identifies it as a generated workflow document.

## Universal Checks

- First non-empty Markdown heading is exactly one `#` H1.
- Generated files have at most one H1.
- Required sections for the file family appear once.
- Required sections appear in the expected order when downstream skills parse them.
- Checkable workflow docs use `- [ ]` or `- [x]` for actionable items.
- Non-ledger research/spec/task artifacts should include a metadata quote block when the family template requires it.
- Main research/spec docs end with `## Next Steps`, or explicitly state why no next step exists.
- Canonical roots are `tasks/`, `specs/`, and `research/`. `docs/specifications/` is a fallback spec location only.
- New `docs/plan.md` or `docs/phases/` planning artifacts are legacy drift because current workflows write plans under `tasks/`.

## Task Pipeline Templates

### `tasks/roadmap.md`

Required:
- H1 title.
- `## Summary` or equivalent orientation section.
- Phase overview table or clearly labeled phase list.
- Repeated `## Phase N:` sections.
- Each phase has a milestone or acceptance criteria section.
- Multi-phase roadmaps include `## Cross-Phase Concerns`.

Flag as Error when phase numbering is malformed or downstream skills cannot identify phases. Flag as Warning when older roadmaps use equivalent but non-standard headings.

### `tasks/todo.md`

Required:
- H1 title or current phase heading.
- Checkable work items, `## Priority Task Queue`, or `## Priority Documentation Todo`.
- Current-phase scope only, unless the file is visibly in legacy migration state.

Flag as Error when there are no checkboxes and no priority queue. Flag as Warning when it appears to contain the full roadmap instead of the active phase.

### `tasks/manual-todo.md`

Required:
- Checkable human-only external tasks.
- Every unchecked item includes `_(blocks: Step N.X)_` or `_(after: Step N.X)_`.
- No agent-executable repo/code/config/test/audit/CLI/API work.

Missing blocker/after annotations are Errors because `$run` and `$ship` use them to avoid executing blocked work. Agent-executable work in `tasks/manual-todo.md` is also an Error because it hides runnable work from the execution queue.

### `tasks/record-todo.md`

Required for each unchecked item:
- Checkable one-time record or measurement task.
- Source.
- Condition that makes the record eligible.
- Non-blocking reason.
- Required data or access.
- Measurement/query or exact evidence to collect.
- Target or acceptance note.
- Revisit cadence/date.
- Completion evidence.
- Promotion rule for when the item should move into `tasks/todo.md`.

Flag as Error when the file contains executable implementation work that belongs in `tasks/todo.md`, or manual blockers that belong in `tasks/manual-todo.md`. Flag missing required fields as Warning unless downstream automation depends on them.

### `tasks/recurring-todo.md`

Required for each unchecked or active item:
- Recurring task.
- Cadence.
- Owner/agent.
- Scope.
- Trigger.
- Last run.
- Next due.
- Command/skill to run.
- Evidence/output path.
- Escalation conditions.

Flag as Error when recurring items are written as current execution steps without an explicit promotion rule. Flag missing cadence, next due, or evidence path as Warning.

### `tasks/history.md`

Required:
- H1 title.
- Append-only dated entries, preferably `## YYYY-MM-DD - summary`.

Do not require old entries to be rewritten. Missing dates are Warnings unless they prevent reconciliation.

### `tasks/phases/phase-N.md`

Required:
- H1 phase title.
- Completed steps.
- Milestone or acceptance criteria.
- `## On Completion` or equivalent completion summary.

## Spec Templates

### Implementation specs

Applies to `specs/*.md`, `specs/{app}/*.md`, and fallback `docs/specifications/*.md`, excluding interview logs and generated audit reports.

Required sections:
- `## Overview`
- `## Goals`
- `## Non-Goals`
- `## Detailed Design`
- `## Edge Cases`
- `## Test Plan`
- `## Acceptance Criteria`
- `## Open Questions` or explicit `None`

Equivalent headings may be Warning instead of Error if the document is older but still readable. Missing acceptance criteria or test plan is Warning unless another workflow depends on it directly.

### Interview logs

Required:
- H1 `Interview Log: <topic>` or equivalent.
- Questions asked.
- Options presented when options were used.
- User responses or decisions.
- Final deviations from the initial draft or coverage summary.

## Research Templates

### Main research docs

Applies to known research-skill outputs such as `research/icp.md`, `research/competitive-analysis.md`, `research/journey-map.md`, `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `research/customer-feedback.md`, `research/enterprise-icp.md`, and app-scoped equivalents.

Required:
- H1 title.
- Metadata quote block with `Last updated`, `Status`, and `Sources` when practical.
- `## Summary`.
- Body sections matching the producing skill's documented output.
- Source/evidence orientation for factual claims.
- Assumptions, risks, or validation gaps when relevant.
- Final `## Next Steps`.

Missing `Next Steps`, metadata, or source orientation is Warning by default.

### Search logs

Required:
- H1 title identifying the log.
- Query list or table.
- Findings.
- Source attribution.
- Scoring or reasoning notes when the producing skill requires them.

Search logs are supporting context, not primary completion artifacts.

### Experiments

Required:
- `## Hypothesis`
- `## Method`
- `## Success Criteria`
- `## Timeline`
- `## Budget`
- `## Decision Rules`
- `## Results`
- `## Next Steps`

## Audit And Ops Templates

### Reconciliation and drift reports

Applies to `tasks/reconciliation-report.md`, `research/reconciliation-report.md`, and `specs/drift-report.md`.

Required:
- H1 report title.
- Resolved findings.
- Deferred findings.
- Remaining findings or confirmation that none remain.
- Evidence references.

### `docs/debug-changelog.md`

Required per entry:
- Date.
- Symptom.
- Category and severity.
- Root cause.
- Fix.
- Test results.
- Related entries.
- Systemic flag.

### `sync.md`

Required top-level sections:
- `## Dependencies`
- `## Conflict Resolution`
- `## Custom`
- `## Notifications`

Shell commands should be fenced code blocks under executable sections.

### `tasks/deploys.md`

Required:
- Environment headings.
- Dated deployment entries.
- Branch.
- Commit range.
- Commit count.
- Status: success or failed.

Failed deploys may be recorded but should not reset staleness.

## Agent And Project Docs

- `CLAUDE.md` must exist.
- If `AGENTS.md` exists, it should not contradict `CLAUDE.md` on workflow orchestration, task roots, or shipping policy.
- `.agents/project.json`, when present, must be valid JSON and include project designation fields used by pack-aware skills.
- `README.md` should have overview, installation or usage, structure, and validation sections, but missing sections are Info unless this repository's conventions make them required.

## Severity Guide

- Error: automation-breaking structure, invalid JSON in machine-read files, missing task state in workflow-owned docs, malformed phase numbering, or missing blocker annotations.
- Warning: template drift, missing metadata, missing `Next Steps`, missing acceptance criteria, missing source orientation, legacy roots, or older equivalent headings.
- Info: unknown hand-written docs, optional cleanup, uncertain classification, or style improvements.

## Fix Policy

Auto-fix only mechanical structure. It is safe to add empty metadata scaffolding when the template explicitly requires metadata and values can be left blank. It is safe to normalize duplicate blank lines around headings.

Never auto-generate summaries, sources, acceptance criteria, research claims, history entries, task status, or next-step recommendations. Never rewrite specs or research docs to fit a template; report those findings and let the generating/reconciliation skill handle contentful changes.
