---
name: guide
description: Click-by-click instructions for manual blockers — DNS, OAuth, signups, and other GUI-dependent tasks
type: analysis
version: v0.0
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
with available authentication, stop and route it to `/run`, `/ship`, or the
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/guide-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/guide-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

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
