---
name: devtool-adoption
description: Use only for developer-facing products; plan adoption loops, examples, templates, community, and proof artifacts
type: research
version: v0.2
---

# Devtool Adoption

Invoke as `$devtool-adoption`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Plan how developers find, try, trust, and keep using the tool.

## Output

Write or update `research/devtool-adoption.md` with adoption loops, examples, templates, community channels, proof artifacts, and activation metrics. In the final response, include `Recommended next skill: <command>` using the `## Next-Skill Routing` rules below.

## Next-Skill Routing

After writing the artifact, recommend the next contextual skill:

1. If `tasks/todo.md` has an unchecked devtool item in `## Priority Documentation Todo`, recommend the first unchecked devtool command from that queue.
2. Otherwise, follow the default devtool sequence: `$devtool-positioning` after this skill.
3. If the sequence is ambiguous or multiple devtool artifacts are stale: check `.agents/project.json.enabled_packs` for `research-admin` — if `research-admin` is not enabled, recommend `$pack install research-admin` first; if `research-admin` is enabled, recommend `$research-roadmap` — to rebuild the ordered documentation queue.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/devtool-adoption-{topic}.html`.

