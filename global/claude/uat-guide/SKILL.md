---
name: uat-guide
description: Expand a UAT journey into click-by-click tester instructions, then update the result log on completion
type: analysis
version: v0.1
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

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

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
