---
name: dogfood
description: Derive operator-run product scenarios from journeys, user stories, specs, and active-use cadence, then produce UAT-style dogfood instructions and manual acceptance checks
type: analysis
version: 1.0.0
argument-hint: "[optional: scenario focus, persona, feature, or release]"
---

# Dogfood

Invoke as `$dogfood`.

Create a practical dogfood plan for a human operator. This skill reads the codebase, specs, journey maps, stories, roadmap, and pack-specific research, then tells the operator what real product scenarios to perform and what evidence to capture.

This is a UAT proxy, not automated testing. Do not run the product, start servers, drive a browser, call APIs, create accounts, or perform the scenarios yourself.

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
   - Infer how often a real target user would use the product: first session, daily, weekly, per incident, per project, per release, monthly review, or another cadence supported by the docs.
   - If cadence is unclear, recommend a default and state the assumption in the audit.
   - Prefer scenarios that exercise the expected habit loop or activation loop over isolated feature checks.

4. **Create operator scenarios**
   - Generate 3-7 scenarios unless the user requested a narrower focus.
   - Cover at least one happy path, one recovery/failure path, and one return-use or retention path when the product evidence supports them.
   - Each scenario must include:
     - persona or role
     - active cadence
     - trigger
     - setup and preconditions
     - exact task for the operator to perform
     - expected success state
     - acceptance checks
     - evidence to capture
     - friction or failure signals
     - follow-up routing
   - Use concrete product language from specs and journeys. Avoid vague instructions such as "verify the flow works."

5. **Classify follow-up work**
   - Operator-run dogfood scenarios go in `tasks/manual-todo.md` under `## Dogfood Operator Scenarios`.
   - Use `_(after: research/dogfood-audit.md)_` unless the scenario blocks or follows a known roadmap step. If tied to a known step, use `_(blocks: Step N.X)_` or `_(after: Step N.X)_`.
   - Do not put operator scenarios in `tasks/todo.md`.
   - Agent-executable implementation fixes discovered after a human run belong in `tasks/todo.md`, but do not invent fixes before the operator has attempted the scenario.
   - Cadence-based dogfood obligations, such as weekly dogfood or pre-release dogfood, go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
   - If a scenario needs click-by-click help for a human-only external blocker, recommend `$guide`.

6. **Present findings before writing when risk is high**
   - If source material is thin, contradictory, or missing the target user journey, summarize the gap and ask whether to proceed with assumptions.
   - If source material is sufficient, write the audit and task sections directly.

## Deliverables

- `research/dogfood-audit.md` - scenario matrix, source evidence, operator instructions, acceptance checklist, findings template, and next steps.
- `tasks/manual-todo.md` - append or replace only the `## Dogfood Operator Scenarios` section.
- `tasks/recurring-todo.md` - optional, only when a recurring dogfood cadence is useful and not already tracked.

If `tasks/manual-todo.md` does not exist, create it with a `# Manual Tasks - [Project Name]` title, a short note that these items require human-only action, and the dogfood section. Preserve all non-dogfood sections when updating an existing file.

Use this scenario format in `research/dogfood-audit.md`:

```markdown
### Scenario N: [Name]

- Persona: [role]
- Active cadence: [first session/daily/weekly/per incident/per release/etc.]
- Trigger: [why the user opens the product]
- Setup: [accounts, data, environment, permissions, or sample state needed]
- Task: [specific operator action sequence]
- Expected success state: [observable result]
- Acceptance checks:
  - [ ] [specific check]
- Evidence to capture: [screenshots, command output, notes, timestamps, records]
- Friction/failure signals: [what counts as confusion, delay, breakage, or mismatch]
- Follow-up routing: [manual note, $spec-interview, $journey-map, $guide, or task promotion guidance]

#### Operator result log

- Status: Not run | Pass | Fail | Blocked
- Evidence captured:
- Notes:
- Follow-up tasks promoted:
```

Use this item format in `tasks/manual-todo.md`:

```markdown
## Dogfood Operator Scenarios

- [ ] Perform dogfood scenario: [Scenario name] for [persona] ([cadence]) _(after: research/dogfood-audit.md)_ - capture evidence in `research/dogfood-audit.md`.
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
- Prefer evidence-backed scenarios over exhaustive coverage.
- If no credible user journey, story, spec, or product surface can be found, stop and recommend `$spec-interview`, `$journey-map`, or the relevant pack research skill.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
