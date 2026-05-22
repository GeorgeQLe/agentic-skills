---
name: guide
description: "Click-by-click instructions for manual blockers — DNS, OAuth, signups, and other GUI-dependent tasks"
type: analysis
version: v0.0
---

# Guide

Invoke as `$guide`.

Produce detailed, click-by-click instructions for human-only manual tasks that block automated progress — service signups, DNS configuration, OAuth credential creation with no authenticated CLI/API path, dashboard settings that cannot be scripted, production smoke checks needing a real account/device or human sign-off, and anything else that requires a third-party portal or subjective human judgment.

This skill is not for development-document bookkeeping. If the requested task is
auditing, reconciling, checking off, moving, or classifying entries in
`tasks/manual-todo.md`, `tasks/todo.md`, `tasks/record-todo.md`, or history
against repo reality, stop and route to `$reconcile-dev-docs fix tasks` or a
direct dev-doc audit instead.

This skill is also not for agent-executable work. If the task is repo edits,
SDK wiring, generated assets, local commands, tests, audits, or CLI/API work
with available authentication, stop and route it to `$run`, `$ship`, or the
specific implementation skill instead of producing click instructions.

## Workflow

1. **Find the blocker:**
   - If `$ARGUMENTS` is non-empty, use the provided text as the task description.
   - If `$ARGUMENTS` is empty, read `tasks/manual-todo.md` and find the first unchecked item (prefer items with `_(blocks: ...)_` annotations).
   - If `$ARGUMENTS` explicitly references `tasks/record-todo.md`, use that record item as the task description and produce instructions for satisfying its condition or collecting its evidence. Do not use record items by default.
   - If no task is found, ask the user what they need help with.

2. **Gather project context:**
   - Read `tasks/todo.md`, `tasks/roadmap.md`, and `CLAUDE.md` to understand what the manual task is for.
   - Search the codebase for references to the service or credentials (env var names, config keys) to identify exact values and output destinations.

3. **Research current instructions:**
   - Use web search to find up-to-date instructions for the specific service or platform.
   - Service UIs change frequently — always search rather than relying on prior knowledge.

4. **Produce click-by-click guide:**
   - Numbered steps with exact UI elements, fields, and project-specific values.
   - Group into logical phases. Note wait times (DNS propagation, approval queues).

5. **Show where to put results:**
   - For each output (API keys, tokens, URLs), specify the exact file path, variable name, and expected format.

6. **Offer to check off:**
   - When the user confirms completion, mark the item done in `tasks/manual-todo.md`.

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/guide-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/guide-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/guide-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Always web search — never produce instructions from memory alone.
- Use project-specific values, not generic placeholders.
- Read-only except for checking off items in `tasks/manual-todo.md`.
- Do not check off or modify `tasks/record-todo.md`; record items are advisory unless a separate workflow updates them.
- One task at a time.
- No task-ledger reconciliation — do not produce a guide for requests such as
  "reconcile manual-todo", "audit stale manual tasks", or "check off completed
  todo items". Route those to `$reconcile-dev-docs fix tasks` or a direct
  dev-doc audit.
- No agent-executable work — do not produce a guide for repo edits, local
  commands, SDK adoption, generated assets, test runs, Lighthouse/Playwright
  checks, or authenticated CLI/API operations.
- Don't execute the task — produce instructions for the user to follow.
