---
name: dogfood
description: Derive owner/operator dogfood scenarios from product evidence and active-use cadence, then produce adoption instructions and manual evaluation checks
type: analysis
version: v0.1
argument-hint: "[optional: scenario focus, persona, feature, or release]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Dogfood

Invoke as `/dogfood`.

Create a practical dogfood plan for the app owner or operator. This skill reads the codebase, specs, journey maps, stories, roadmap, and pack-specific research, then tells the operator how to adopt the product into their own workflow so they can understand, evaluate, and improve it through real use.

Dogfood is not UAT. Dogfood asks how the app owner can use the product in their own work and observe what that reveals. UAT asks whether a target user can complete meaningful real-world journeys and would accept the product as fit for use; use `/uat` for that.

This is a human-run product adoption plan, not automated testing. Do not run the product, start servers, drive a browser, call APIs, create accounts, or perform the scenarios yourself.

## Workflow

1. **Resolve project context**
   - Read `.agents/project.json` if it exists.
   - Use `project_type` and `enabled_packs` when present.
   - If project metadata is missing, infer the project type from repo signals:
     - business-app: SaaS, marketplace, productivity, workflow, enterprise, or user-facing app
     - devtool: SDK, CLI, API, library, infrastructure, docs, examples, or package-first developer workflow
     - game: game engine files, playable prototypes, store assets, or game-specific README/spec language
     - generic: no strong domain signal
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `spec.md`, and `tasks/` files when present.

2. **Load journey and story evidence**
   - Business app: read `research/icp.md`, `research/journey-map.md`, `research/customer-feedback.md`, `research/metrics.md`, and `research/mvp-gap.md` when present.
   - Devtool: read `research/devtool-user-map.md`, `research/devtool-dx-journey.md`, `research/devtool-integration-map.md`, `research/devtool-adoption.md`, docs, examples, and package manifests when present.
   - Game: read `research/game-core-loop.md`, `research/game-prototype-test.md`, `research/game-playtest-metrics.md`, `research/game-audience.md`, `research/game-fantasy.md`, and `research/game-comparables.md` when present.
   - Generic: use specs, README, routes, tests, examples, and task acceptance criteria.
   - In monorepos with `research/{app}/` or `specs/{app}/`, produce app-scoped scenarios for the requested app. If no app is specified and multiple apps are plausible, ask the user to choose.

3. **Identify active-use cadence**
   - Infer how often the app owner or operator should use the product in their own workflow: first session, daily, weekly, per incident, per project, per release, monthly review, or another cadence supported by the docs.
   - If cadence is unclear, recommend a default and state the assumption in the audit.
   - Prefer scenarios that exercise owner/operator adoption, repeated use, and product understanding over isolated feature checks.

4. **Create owner/operator scenarios**
   - Generate 3-7 scenarios unless the user requested a narrower focus.
   - Cover at least one happy path, one recovery/failure path, and one return-use or retention path when the product evidence supports them.
   - Each scenario must include:
     - owner/operator role
     - active cadence
     - trigger
     - setup and preconditions
     - exact task for the operator to perform in their own workflow
     - expected success state
     - acceptance checks
     - evidence to capture
     - friction or failure signals
     - follow-up routing
   - Use concrete product language from specs and journeys. Avoid vague instructions such as "verify the flow works."
   - If the scenario is primarily about whether a target user would accept the product, route it to `/uat` instead.

5. **Classify follow-up work**
   - Operator-run dogfood scenarios go in `tasks/manual-todo.md` under `## Dogfood Operator Scenarios`.
   - Use `_(after: research/dogfood-audit.md)_` unless the scenario blocks or follows a known roadmap step. If tied to a known step, use `_(blocks: Step N.X)_` or `_(after: Step N.X)_`.
   - Do not put operator scenarios in `tasks/todo.md`.
   - Agent-executable implementation fixes discovered after a human run belong in `tasks/todo.md`, but do not invent fixes before the operator has attempted the scenario.
   - Cadence-based dogfood obligations, such as weekly dogfood or pre-release dogfood, go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
   - If a scenario needs click-by-click help for a human-only external blocker, recommend `/guide`.

6. **Present findings before writing when risk is high**
   - If source material is thin, contradictory, or missing the target user journey, summarize the gap and ask whether to proceed with assumptions.
   - If source material is sufficient, write the audit and task sections directly.

## Deliverables

- `research/dogfood-audit.md` - scenario matrix, source evidence, owner/operator adoption instructions, evaluation checklist, findings template, and next steps.
- `tasks/manual-todo.md` - append or replace only the `## Dogfood Operator Scenarios` section.
- `tasks/recurring-todo.md` - optional, only when a recurring dogfood cadence is useful and not already tracked.

If `tasks/manual-todo.md` does not exist, create it with a `# Manual Tasks - [Project Name]` title, a short note that these items require human-only action, and the dogfood section. Preserve all non-dogfood sections when updating an existing file.

Use this scenario format in `research/dogfood-audit.md`:

```markdown
### Scenario N: [Name]

- Owner/operator role: [role]
- Active cadence: [first session/daily/weekly/per incident/per release/etc.]
- Trigger: [why the user opens the product]
- Setup: [accounts, data, environment, permissions, or sample state needed]
- Task: [specific action sequence in the operator's own workflow]
- Expected success state: [observable result]
- Acceptance checks:
  - [ ] [specific check]
- Evidence to capture: [screenshots, command output, notes, timestamps, records]
- Friction/failure signals: [what counts as confusion, delay, breakage, or mismatch]
- Follow-up routing: [manual note, /uat, /spec-interview, /journey-map, /guide, or task promotion guidance]

#### Operator result log

- Status: Not run | Pass | Fail | Blocked
- Evidence captured:
- Notes:
- Follow-up tasks promoted:
```

Use this item format in `tasks/manual-todo.md`:

```markdown
## Dogfood Operator Scenarios

- [ ] Perform dogfood scenario: [Scenario name] for [owner/operator role] ([cadence]) _(after: research/dogfood-audit.md)_ - capture evidence in `research/dogfood-audit.md`.
```

## Task Classification

- Human/operator scenario execution goes in `tasks/manual-todo.md`.
- Immediate implementation or documentation fixes confirmed by a completed dogfood run go in `tasks/todo.md`.
- One-time condition-gated evidence collection goes in `tasks/record-todo.md`.
- Cadence-based dogfood checks go in `tasks/recurring-todo.md`.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Do not run or operate the product in this skill.
- Do not start dev servers, launch browsers, use Playwright, call APIs, create accounts, or perform CLI workflows.
- Do not mark scenarios complete; only the human operator can do that after performing them.
- Do not duplicate existing unchecked dogfood/manual tasks. Reference existing items when they already cover the same scenario.
- Prefer evidence-backed owner/operator adoption scenarios over exhaustive coverage.
- Keep dogfood and UAT separate: use `/dogfood` for owner/operator adoption into the builder's workflow; use `/uat` for target-user acceptance journeys.
- If no credible user journey, story, spec, or product surface can be found, stop and recommend `/spec-interview`, `/journey-map`, or the relevant pack research skill. For `/journey-map` and other pack-based skills, apply the Pack Availability Guard — if the target skill's pack is not in `.agents/project.json` `enabled_packs`, recommend `/pack install <pack>` before the skill.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/dogfood-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

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

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/dogfood-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
