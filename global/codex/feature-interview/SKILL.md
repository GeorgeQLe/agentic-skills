---
name: feature-interview
description: Interview a feature idea, align human and agent intent, then decide whether to create or update a spec
type: planning
version: 1.0.0
argument-hint: "[feature idea or tasks/ideas.md entry]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Feature Interview

Invoke as `$feature-interview`.

Use this skill when the user has a feature idea, brainstorm suggestion, research gap, bug-shaped improvement, or implementation direction that needs alignment before deciding whether to write a new spec, update an existing spec, or route directly to another planning skill.

This is narrower than `$spec-interview`: it performs the same assumption surfacing and user interrogation needed for human/agent alignment, but it does not assume the output must be a full new implementation spec.

## Workflow

1. Resolve the feature input:
   - If `$ARGUMENTS` names or quotes an idea, use it as the seed.
   - If `$ARGUMENTS` references `tasks/ideas.md`, read matching entries and ask the user to choose one when multiple entries match.
   - If no feature is provided, read `tasks/ideas.md` and present the top unspecced candidates; ask the user which one to interview.
2. Gather context before asking deep questions:
   - Read `.agents/project.json`, CLAUDE.md or AGENTS.md, README, package config, and key source files relevant to the idea.
   - Read `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, and `tasks/ideas.md` when they exist.
   - Read existing specs from `specs/`, `spec.md`, or `docs/specifications/`, plus relevant research docs such as ICP, journey map, competitive analysis, customer feedback, metrics, and MVP gap artifacts.
   - Avoid re-interviewing on facts already covered by current concept, research, journey, UX, UI, or spec docs.
3. Match the feature against existing planning artifacts:
   - Identify whether it is already fully represented in a spec, partially represented in a spec, only present as an idea/research gap, or already sequenced in the roadmap.
   - If it duplicates planned work, stop and recommend the existing route (`$roadmap`, `$plan-phase N`, `$run`, or `$ship`) with evidence.
4. Present a **Feature Assumptions Manifest** before probing:
   - Source context: idea/research/spec/roadmap inputs used.
   - Human intent: what outcome the user appears to want and who benefits.
   - Agent interpretation: the concrete capability or change the agent would plan from the input.
   - Existing-system fit: code paths, specs, tasks, and research artifacts likely affected.
   - Planning destination: likely `new spec`, `update existing spec`, `roadmap/task update`, `research/design skill first`, or `no new planning needed`.
   - Implementation shape: product behavior, design/UX needs, data model, APIs/contracts, migrations, tests, operations, and rollout surface as far as they can be inferred.
   - Risks and unknowns: ambiguity, integration risk, user-facing risk, external dependencies, and what breaks if the assumption is wrong.
   Tag each assumption with `[from idea]`, `[from spec]`, `[from codebase]`, `[from research]`, `[from roadmap]`, or `[inferred]`.
5. Ask the user to confirm, correct, or flag assumptions before continuing. Do not proceed past the manifest until the user has reviewed it.
6. Interview in focused passes, 1 to 3 questions per turn. If the session is already in Plan mode and there are 2-3 concrete options, prefer `request_user_input`; otherwise ask concise direct questions.
7. Cover only the areas needed to choose and prepare the planning destination:
   - Intent and success criteria.
   - Target users, jobs, and journey/design implications.
   - Feature behavior and scope boundaries.
   - Existing spec fit: whether to create a new spec, update an existing spec, or split the work.
   - Implementation constraints: architecture, data model, API/contract surface, migrations, security, privacy, performance, observability, test strategy, and rollout.
   - Roadmap coupling: dependencies, phase fit, ordering, parallelization, manual blockers, and the smallest useful implementation slice.
8. Research and recommend by default. Use codebase evidence, existing docs, and web search when the decision depends on current external facts. Present options with pros/cons, state a recommendation, and ask the user to approve, adjust, or override.
9. Before concluding, present a **Planning Destination Checkpoint**:
   - Decision: new spec, update spec, update roadmap/tasks only, run another named planning/research skill first, or no action.
   - Target artifact path(s).
   - Scope to include now and explicitly defer.
   - Roadmap impact and recommended next command.
   Ask: "Does this destination and scope match what you want?"

## Deliverables

After confirmation, write the minimum durable artifact needed:

- New spec: write `specs/[topic].md` using the `$spec-interview` canonical section headings.
- Existing spec update: archive the existing canonical spec first, then update only the relevant sections.
- Roadmap/task-only change: update `tasks/roadmap.md`, `tasks/todo.md`, `tasks/record-todo.md`, or `tasks/manual-todo.md` only when no spec change is needed.
- Upstream planning/research needed: write an interview log and recommend the named skill instead of inventing a placeholder spec.
- No action: write an interview log explaining why the idea is already covered, duplicate, deferred, or intentionally parked.

Always write an interview log to `specs/[topic]-feature-interview.md` (or `docs/specifications/[topic]-feature-interview.md` if that is the repo's canonical spec location). Include:

- The Feature Assumptions Manifest with user corrections.
- Questions asked and answers received.
- Options and recommendations presented.
- Planning Destination Checkpoint and confirmed decision.
- The exact next command for sequencing.

When replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>` before editing it.

## Next-Step Routing

After writing deliverables, route tightly into the task pipeline:

- If a new or updated spec is ready for sequencing, recommend `$roadmap` so it can extend/build the roadmap and seed `$plan-phase`.
- If user-facing work still lacks journey, UX variation, or UI detail, recommend `$journey-map`, `$ux-variation`, or `$ui-interview` before `$roadmap`.
- If the feature is already sequenced, recommend the concrete executor (`$plan-phase N`, `$run`, `$ship`, or `$guide`) rather than another interview.
- If research is missing, recommend the named research skill and explain what evidence it must produce before returning to `$feature-interview` or `$roadmap`.
- If the idea is duplicate or parked, recommend `$brainstorm` only when the user wants a different candidate; otherwise recommend the existing tracked work.

Output exactly two lines beyond the normal report:

- **Next work:** <specific planning, research, or execution task>
- **Recommended next command:** <one command or route>

## Constraints

- Do not default to a new spec when an existing spec should be updated.
- Do not update roadmap sequencing until the planning destination is confirmed.
- Do not produce a full implementation spec unless the interview proves a new or rewritten spec is the right destination.
- Do not route brainstorm ideas directly to `$spec-interview`; use `$feature-interview` for triage unless the user explicitly asks for a full spec.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
