---
name: uat-guide
description: Expand a UAT journey into click-by-click tester instructions, then update the result log on completion
type: analysis
version: v0.0
argument-hint: "[optional: journey number, journey name, or 'next']"
---

# UAT Guide

Invoke as `/uat-guide`.

Expand a single UAT journey from `research/uat-plan.md` into detailed, step-by-step tester instructions. UAT planning (`/uat`) produces high-level task sequences ("sign up", "navigate to dashboard"); this skill turns each step into click-by-click, command-by-command, or request-by-request guidance that a tester unfamiliar with the product can follow without ambiguity.

This skill does not generate UAT journeys. If no UAT plan exists, stop and recommend `/uat`.

## Workflow

1. **Locate UAT plan**
   - Read `research/uat-plan.md`.
   - If the file does not exist, stop and tell the user: "No UAT plan found. Run `/uat` first to generate acceptance journeys."

2. **Select journey**
   - Parse all `### Journey N:` headings and their `#### UAT result log` status fields.
   - If `$ARGUMENTS` is non-empty, match by journey number or name (case-insensitive substring match).
   - If `$ARGUMENTS` is `next` or empty, pick the first journey whose status is `Not run`.
   - If all journeys have status `Pass`, `Fail`, or `Blocked`, tell the user all journeys are complete and offer to re-run a specific one.

3. **Gather project context**
   - Read `.agents/project.json`, `README.md`, `CLAUDE.md`, relevant `specs/`, `docs/`, and `tasks/` files when present.
   - Search the codebase for routes, UI components, CLI entry points, API endpoints, environment variables, configuration files, and navigation structure relevant to the selected journey's task sequence.

4. **Detect product interface type**
   - Classify the product surface the journey touches:
     - **Web app** -> click-by-click instructions (buttons, links, forms, pages).
     - **CLI** -> command-by-command instructions (exact commands, flags, expected output).
     - **API** -> request-by-request instructions (method, URL, headers, body, expected response).
     - **Hybrid** -> mixed instructions matching each step's surface.
   - Use the detected type to shape the instruction style for step 6.

5. **Research current instructions**
   - Use web search to find up-to-date documentation for any external services or platforms referenced in the journey (OAuth providers, third-party dashboards, payment processors, DNS registrars, etc.).
   - Prioritize official documentation over blog posts.
   - Service UIs change frequently — never rely solely on prior knowledge; always search.

6. **Expand task sequence**
   - For each step in the journey's task sequence, produce:
     - **Numbered sub-steps** with exact UI elements to click, commands to run, or requests to make. Use project-specific values (URLs, routes, field names, env vars) drawn from codebase context.
     - **Checkpoint** tied to the journey's acceptance criteria — what the tester should observe to confirm the step succeeded.
     - **Evidence capture point** — what to screenshot, copy, or record at this step.
     - **Gotchas** — common mistakes, timing issues, or easy-to-miss details.
   - Begin the guide with a **Preparation** section drawn from the journey's Setup field (accounts, data, environment, permissions needed before starting).
   - End the guide with a **Final verification** section drawn from the journey's acceptance criteria and expected success state.

7. **Present guide**
   - Output the guide directly in the conversation. Do not write it to a file.

8. **Collect results**
   - After presenting the guide, tell the user: "When you've completed this journey, let me know the result (Pass / Fail / Blocked) and any notes, and I'll update the result log."
   - When the user reports completion:
     - Update the `#### UAT result log` section for this journey inline in `research/uat-plan.md` with the reported status, evidence, tester notes, and any follow-up tasks promoted.
     - Check off the corresponding item in `tasks/manual-todo.md`.
     - If the result is `Fail` or `Blocked`, suggest follow-up routing: `/debug` for reproducible failures, `/guide` for external blockers, `/spec-interview` for unclear acceptance criteria, or `/uat-guide [next]` for the next journey.

## Output Format

```
## UAT Guide: Journey N — [Journey Name]

**Target user**: [persona or role]
**User goal**: [what the user is trying to accomplish]
**Product surface**: [Web app | CLI | API | Hybrid]

### Preparation

- [Account, data, environment, or permission setup needed before starting]
- [Pre-existing state or sample data to have ready]

### Steps

#### Step 1: [Task sequence step name]

1. [Exact action — click, type, run, send]
2. [Next action with specific UI element / command / request detail]
3. ...

**Checkpoint**: [What the tester should see or verify]
**Evidence**: [What to capture — screenshot, output, response]
**Gotchas**: [Common mistake or easy-to-miss detail, if any]

#### Step 2: [Task sequence step name]

1. ...

...

### Final Verification

- [ ] [Acceptance criterion from the journey]
- [ ] [Another acceptance criterion]
- [ ] Expected success state: [observable user-visible result]

### Non-Acceptance Signals

- [Confusion, delay, missing affordance, incorrect result, trust issue, or blocker to watch for]

### Tester Notes Prompt

> [Question from the journey that captures whether the target user would accept this]

---

When you've completed this journey, let me know the result (Pass / Fail / Blocked) and any notes, and I'll update the result log.
```

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/uat-guide-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/uat-guide-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- **Always web search** for external services and platforms referenced in the journey. Service UIs change; stale steps are worse than none.
- **Project-specific values** — never give generic placeholders when the codebase contains the actual values to use (URLs, routes, env vars, field names, commands).
- **Read-only except result log** — this skill does not modify code. The only files it may edit are `research/uat-plan.md` (result log section) and `tasks/manual-todo.md` (to check off a completed item), and only after the user reports completion.
- **No shipping contract** — updating a result log and checking off a manual-todo item is minor bookkeeping, not a code change. Do not auto-commit just for that. If other tracked changes are present, leave them for a proper shipping skill.
- **One journey at a time** — guide the user through one journey per invocation. They can run `/uat-guide next` for the next one.
- **Don't execute the product** — produce instructions for the user to follow. Do not start dev servers, launch browsers, call APIs, create accounts, or perform CLI workflows.
- **Don't mark complete unprompted** — only update the result log after the user explicitly reports the outcome.
- **Don't invent acceptance criteria** — use only the criteria defined in the UAT plan. If criteria are missing or unclear, recommend `/spec-interview` to clarify them.
- **Handle all product surface types** — web apps get click-by-click, CLIs get command-by-command, APIs get request-by-request, hybrids get mixed. Detect from codebase context; don't assume web.
- **Prerequisite: UAT plan must exist** — if `research/uat-plan.md` is missing, stop immediately and recommend `/uat`.
