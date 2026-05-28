---
name: guide
description: Click-by-click instructions for manual blockers — DNS, OAuth, signups, and other GUI-dependent tasks
type: analysis
version: v0.1
argument-hint: "[optional: task description or manual-todo item text]"
---

# Guide

Produce detailed, click-by-click instructions for human-only manual tasks that block automated progress — service signups, DNS configuration, OAuth credential creation with no authenticated CLI/API path, dashboard settings that cannot be scripted, production smoke checks needing a real account/device or human sign-off, and anything else that requires a third-party portal or subjective human judgment.

This skill is not for development-document bookkeeping. If the requested task is
auditing, reconciling, checking off, moving, or classifying entries in
`tasks/manual-todo.md`, `tasks/todo.md`, `tasks/record-todo.md`, or history
against repo reality, stop and route to `/reconcile-dev-docs fix tasks` or a
direct dev-doc audit instead.

This skill is also not for agent-executable work. If the task is repo edits,
SDK wiring, generated assets, local commands, tests, audits, or CLI/API work
with available authentication, stop and route it to `/exec`, `/ship`, or the
specific implementation skill instead of producing click instructions.

## Process

1. **Find the blocker:**
   - If `$ARGUMENTS` is non-empty, use the provided text as the task description.
   - If `$ARGUMENTS` explicitly references `tasks/record-todo.md`, use that record item as the task description and produce instructions for satisfying its condition or collecting its evidence. Do not use record items by default.
   - If `$ARGUMENTS` is empty, read `tasks/manual-todo.md`:
     - Find the first unchecked item (`- [ ]`) that contains a `_(blocks: ...)_` annotation.
     - If no blocking item exists, find the first unchecked item.
     - If the file does not exist or has no unchecked items, ask the user what they need help with.

2. **Gather project context:**
   - Read `tasks/todo.md`, `tasks/roadmap.md`, and `CLAUDE.md` (where they exist) to understand what the manual task is for — what service, what domain, what credentials are expected and where they will be consumed.
   - Search the codebase for references to the service or credentials (env var names, config keys, import paths) to identify:
     - Exact values the user will need to fill in (callback URLs, domain names, scopes).
     - Where outputs should be stored (`.env`, config files, secrets manager).

3. **Research current instructions:**
   - Use web search to find up-to-date instructions for the specific service or platform.
   - Prioritize official documentation over blog posts.
   - Service UIs change frequently — never rely solely on prior knowledge; always search.

4. **Produce click-by-click guide:**
   - Write numbered steps with:
     - Exact UI elements to click (button text, menu paths, tab names).
     - Fields to fill and the specific values to use, drawn from project context (e.g., "Set **Authorized redirect URI** to `http://localhost:3000/auth/callback`" not just "set a redirect URI").
     - What to look for on each screen to confirm you're in the right place.
     - Warnings about common gotchas or easy-to-miss settings.
   - Group steps into logical phases when the task spans multiple screens or services.
   - If the task involves waiting (DNS propagation, approval queues), say how long and what to do in the meantime.

5. **Show where to put results:**
   - For each output the task produces (API keys, client IDs, tokens, URLs, DNS records), specify:
     - The exact file path where it belongs (e.g., `.env`, `config/auth.ts`).
     - The exact variable or key name to set.
     - Example format if it matters (e.g., "paste the full JSON key file, not just the client ID").
   - If the destination file does not exist yet, say so and show what it should look like.

6. **Offer to check off:**
   - After presenting the guide, tell the user: "When you've completed these steps, let me know and I'll mark the item done in `tasks/manual-todo.md`."
   - When the user confirms, check off the item (`- [x]`) in `tasks/manual-todo.md`.

## Output Format

```
## Guide: [Task title]

**Context**: [One sentence — why this task is needed and what it unblocks]

### Steps

1. Go to [URL].
2. Click **[Button/Link text]** in the [location description].
3. Fill in **[Field name]**: `[exact value from project context]`
   ...

### Where to put the results

| Output | File | Key / Variable |
|--------|------|----------------|
| Client ID | `.env` | `OAUTH_CLIENT_ID` |
| Client Secret | `.env` | `OAUTH_CLIENT_SECRET` |

### Gotchas

- [Common mistake or easy-to-miss setting]

---

When you've completed these steps, let me know and I'll mark the item done in `tasks/manual-todo.md`.
```

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/guide-{topic}.html`.

## Constraints

- **Always web search** — never produce instructions from memory alone. Service UIs change; stale steps are worse than none.
- **Project-specific values** — never give generic placeholders when the codebase contains the actual values to use.
- **Read-only by default** — this skill does not modify code. The only file it may edit is `tasks/manual-todo.md` (to check off a completed item), and only after the user confirms completion.
- Do not check off or modify `tasks/record-todo.md`; record items are advisory unless a separate workflow updates them.
- **No shipping contract** — checking off a manual-todo item is a minor bookkeeping edit, not a code change. Do not auto-commit just for that. If other tracked changes are present, leave them for a proper shipping skill.
- **One task at a time** — if multiple blockers exist, guide the user through the first one. They can run `/guide` again for the next.
- **No task-ledger reconciliation** — do not produce a guide for requests such as "reconcile manual-todo", "audit stale manual tasks", or "check off completed todo items". Route those to `/reconcile-dev-docs fix tasks` or a direct dev-doc audit.
- **No agent-executable work** — do not produce a guide for repo edits, local commands, SDK adoption, generated assets, test runs, Lighthouse/Playwright checks, or authenticated CLI/API operations.
- **Don't execute the task** — produce instructions for the user to follow. Do not attempt to call external APIs, create accounts, or configure services on the user's behalf.
