# Recurring Tasks

## Documentation Recurring Work

- [ ] Devtool docs audit refresh
  - Cadence: monthly or after 50+ skill/pack commits
  - Owner/agent: `/devtool-docs-audit`
  - Scope: project-wide skill and documentation coverage
  - Trigger: commit count threshold or calendar month
  - Last run: 2026-04-30
  - Next due: 2026-05-30
  - Command/skill: `/devtool-docs-audit`
  - Evidence/output path: `research/devtool-docs-audit.md`
  - Escalation conditions: becomes blocking if new skills are undocumented in discovery docs or README

- [ ] Spec drift check
  - Cadence: monthly or after 30+ skill/pack commits
  - Owner/agent: `/spec-drift fix all`
  - Scope: all specs vs. current codebase
  - Trigger: commit count threshold or calendar month
  - Last run: 2026-05-04
  - Next due: 2026-06-04
  - Command/skill: `/spec-drift fix all`
  - Evidence/output path: `specs/drift-report.md`
  - Escalation conditions: becomes blocking if specs are used to generate roadmap phases for unimplemented work
