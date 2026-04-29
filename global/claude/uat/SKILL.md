---
name: uat
description: Create user acceptance test journeys from a target user's perspective, with role-based scenarios, acceptance criteria, and evidence capture
type: analysis
version: 1.0.0
argument-hint: "[optional: persona, feature, release, journey, or app]"
---

# UAT

Invoke as `/uat`.

Create a user acceptance testing plan from the perspective of a potential or target user. This skill reads the product surface, specs, journeys, stories, roadmap, and relevant research, then produces realistic end-to-end user journeys that validate whether the product satisfies user goals.

UAT is not dogfooding. Dogfood asks how the app owner can adopt the product into their own workflow to understand and evaluate it. UAT asks whether a target user can complete meaningful real-world journeys and would accept the product as fit for use.

This is a human-run acceptance plan, not automated testing. Do not start servers, drive browsers, call APIs, create accounts, or perform the scenarios yourself.

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

2. **Load user evidence**
   - Business app: read `research/icp.md`, `research/journey-map.md`, `research/customer-feedback.md`, `research/metrics.md`, and `research/mvp-gap.md` when present.
   - Devtool: read `research/devtool-user-map.md`, `research/devtool-dx-journey.md`, `research/devtool-integration-map.md`, docs, examples, and package manifests when present.
   - Game: read `research/game-audience.md`, `research/game-fantasy.md`, `research/game-core-loop.md`, `research/game-prototype-test.md`, and `research/game-playtest-metrics.md` when present.
   - Generic: use specs, README, routes, tests, examples, issue descriptions, and task acceptance criteria.
   - In monorepos with `research/{app}/` or `specs/{app}/`, produce app-scoped UAT journeys for the requested app. If no app is specified and multiple apps are plausible, ask the user to choose.

3. **Define acceptance perspective**
   - Identify 1-3 target user personas or roles from the evidence.
   - For each selected persona, define the job-to-be-done, context, goal, constraints, and acceptance threshold.
   - Prefer external target users, buyers, evaluators, administrators, developers, or players over the product owner unless the owner is also the target user.
   - If the target user is unclear, stop and recommend `/spec-interview`, `/journey-map`, or the relevant pack research skill.

4. **Create UAT journeys**
   - Generate 3-7 journeys unless the user requested a narrower focus.
   - Cover at least one critical happy path, one realistic obstacle or recovery path, and one return-use or handoff path when supported by the product evidence.
   - Each journey must include:
     - target user
     - user goal
     - real-world trigger
     - setup and preconditions
     - end-to-end task sequence
     - expected user-visible success state
     - acceptance criteria
     - non-acceptance signals
     - evidence to capture
     - tester notes prompt
     - follow-up routing
   - Use concrete product language from specs and journeys. Avoid vague instructions such as "verify the feature works."

5. **Classify follow-up work**
   - Human-run UAT journeys go in `tasks/manual-todo.md` under `## UAT Journeys`.
   - Use `_(after: research/uat-plan.md)_` unless the journey blocks or follows a known roadmap step. If tied to a known step, use `_(blocks: Step N.X)_` or `_(after: Step N.X)_`.
   - Do not put human-run UAT journeys in `tasks/todo.md`.
   - Implementation or documentation fixes discovered after a completed UAT run belong in `tasks/todo.md`, but do not invent fixes before the user journey has been attempted.
   - One-time evidence collection belongs in `tasks/record-todo.md`.
   - Recurring release acceptance checks belong in `tasks/recurring-todo.md` only when there is a clear release cadence.
   - If a journey needs step-by-step tester guidance, recommend `/uat-guide`.
   - If a journey step needs click-by-click help for a human-only external blocker (OAuth, DNS, service signup), recommend `/guide`.

6. **Present findings before writing when risk is high**
   - If source material is thin, contradictory, or missing target-user evidence, summarize the gap and ask whether to proceed with assumptions.
   - If source material is sufficient, write the plan and task sections directly.

## Deliverables

- `research/uat-plan.md` - persona assumptions, journey matrix, source evidence, acceptance checklist, result log template, and follow-up guidance.
- `tasks/manual-todo.md` - append or replace only the `## UAT Journeys` section.
- `tasks/recurring-todo.md` - optional, only when recurring UAT is useful and not already tracked.

If `tasks/manual-todo.md` does not exist, create it with a `# Manual Tasks - [Project Name]` title, a short note that these items require human-only action, and the UAT section. Preserve all non-UAT sections when updating an existing file.

Use this journey format in `research/uat-plan.md`:

```markdown
### Journey N: [Name]

- Target user: [persona or role]
- User goal: [what the user is trying to accomplish]
- Trigger: [real-world reason the user starts]
- Setup: [accounts, data, environment, permissions, or sample state needed]
- Task sequence:
  - [step the human tester performs as the target user]
- Expected success state: [observable user-visible result]
- Acceptance criteria:
  - [ ] [specific criterion]
- Non-acceptance signals: [confusion, delay, missing affordance, incorrect result, trust issue, or blocker]
- Evidence to capture: [screenshots, recordings, notes, timestamps, records, command output, or artifacts]
- Tester notes prompt: [question that captures whether the target user would accept this]
- Follow-up routing: [manual note, /spec-interview, /journey-map, /guide, or task promotion guidance]

#### UAT result log

- Status: Not run | Pass | Fail | Blocked
- Evidence captured:
- Tester notes:
- Follow-up tasks promoted:
```

Use this item format in `tasks/manual-todo.md`:

```markdown
## UAT Journeys

- [ ] Run UAT journey: [Journey name] as [target user] _(after: research/uat-plan.md)_ - capture evidence in `research/uat-plan.md`.
```

## Task Classification

- Human UAT journey execution goes in `tasks/manual-todo.md`.
- Immediate implementation or documentation fixes confirmed by completed UAT go in `tasks/todo.md`.
- One-time condition-gated evidence collection goes in `tasks/record-todo.md`.
- Release-cadence UAT checks go in `tasks/recurring-todo.md`.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Do not run or operate the product in this skill.
- Do not start dev servers, launch browsers, use Playwright, call APIs, create accounts, or perform CLI workflows.
- Do not mark journeys complete; only a human tester can do that after performing them.
- Do not duplicate existing unchecked UAT or manual tasks. Reference existing items when they already cover the same journey.
- Prefer evidence-backed target-user journeys over exhaustive feature coverage.
- Keep dogfood and UAT separate: use `/dogfood` for owner/operator adoption into the builder's workflow; use `/uat` for target-user acceptance journeys.
- If no credible user journey, story, spec, or product surface can be found, stop and recommend `/spec-interview`, `/journey-map`, or the relevant pack research skill.

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
