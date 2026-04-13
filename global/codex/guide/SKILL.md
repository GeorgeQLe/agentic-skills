---
name: guide
description: "Click-by-click instructions for manual blockers — DNS, OAuth, signups, and other GUI-dependent tasks"
version: 1.0.0
---

# Guide

Produce detailed, click-by-click instructions for manual tasks that block automated progress — service signups, DNS configuration, OAuth credential creation, dashboard settings, and anything else that requires a GUI or third-party portal.

## Workflow

1. **Find the blocker:**
   - If `$ARGUMENTS` is non-empty, use the provided text as the task description.
   - If `$ARGUMENTS` is empty, read `tasks/manual-todo.md` and find the first unchecked item (prefer items with `_(blocks: ...)_` annotations).
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

## Constraints

- Always web search — never produce instructions from memory alone.
- Use project-specific values, not generic placeholders.
- Read-only except for checking off items in `tasks/manual-todo.md`.
- One task at a time.
- Don't execute the task — produce instructions for the user to follow.
