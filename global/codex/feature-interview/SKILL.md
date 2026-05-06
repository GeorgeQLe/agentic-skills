---
name: feature-interview
description: Interview a feature idea with evidence-backed alignment, then decide whether to create/update docs, specs, roadmap, or tasks
type: planning
version: 1.1.0
argument-hint: "[feature idea or tasks/ideas.md entry]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Feature Interview

Invoke as `$feature-interview`.

Use this skill when the user has a feature idea, brainstorm suggestion, research gap, bug-shaped improvement, or implementation direction that needs evidence-backed alignment before deciding whether to write or update research docs, journey docs, specs, roadmap entries, task queues, or route directly to another planning skill.

This is narrower than `$spec-interview`: it performs the same assumption surfacing and user interrogation needed for human/agent alignment, but it does not assume the output must be a full new implementation spec. It borrows `$investigate`'s evidence discipline for claims, codebase fit, and technical gotchas, but it does not fix bugs or implement the feature.

## Workflow

1. Resolve the feature input:
   - If `$ARGUMENTS` names or quotes an idea, use it as the seed.
   - If `$ARGUMENTS` references `tasks/ideas.md`, read matching entries and ask the user to choose one when multiple entries match.
   - If no feature is provided, read `tasks/ideas.md` and present the top unspecced candidates; ask the user which one to interview.
2. Gather context before asking deep questions:
   - Read `.agents/project.json`, CLAUDE.md or AGENTS.md, README, package config, and key source files relevant to the idea.
   - Read `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, and `tasks/ideas.md` when they exist.
   - Read existing specs from `specs/`, `spec.md`, or `docs/specifications/`, plus relevant research docs such as ICP, journey map, competitive analysis, customer feedback, metrics, and MVP gap artifacts.
   - Read git evidence (`git log`, `git diff`, `git blame`) only where it can confirm related prior decisions, recent regressions, ownership, or why the current system shape exists.
   - Avoid re-interviewing on facts already covered by current concept, research, journey, UX, UI, or spec docs.
3. Run an evidence-backed intake pass before deciding what to ask:
   - Extract the user's explicit claims, hypotheses, constraints, and desired outcomes. Do not treat a desired outcome as a factual claim.
   - Validate factual claims against code, docs, research, task state, and git history. Classify each as `confirmed`, `partially supported`, `not supported`, or `unknown / needs user context`.
   - Identify likely technical gotchas: architecture fit, shared modules, data model, API/contracts, migrations, security/privacy, permissions, performance, observability, tests, rollout, external dependencies, and backwards compatibility.
   - Identify how the feature fits into the user story, customer journey, developer workflow, game loop, or other project-specific journey artifact. If no credible journey exists for user-facing work, flag that as a planning gap.
   - Identify whether research docs, journey docs, specs, roadmap, or task queues need a durable update if the feature proceeds.
4. Match the feature against existing planning artifacts:
   - Identify whether it is already fully represented in a spec, partially represented in a spec, only present as an idea/research gap, or already sequenced in the roadmap.
   - If it duplicates planned work, stop and recommend the existing route (`$roadmap`, `$plan-phase N`, `$run`, or `$ship`) with evidence.
5. Present a **Feature Evidence Brief + Assumptions Manifest** before probing:
   - Evidence sources: files, docs, research artifacts, task docs, and git history consulted.
   - Claim validation: verdict for each factual claim or hypothesis, with concise evidence.
   - Technical gotchas: likely integration risks, operational risks, unknowns, and what would break if each assumption is wrong.
   - Journey placement: where this feature belongs in the user story, journey map, workflow, or loop; note missing or conflicting journey evidence.
   - Documentation destination: likely `new spec`, `update existing spec`, `update research/journey docs`, `roadmap/task update`, `interview log only`, `run another planning/research skill first`, or `no action`.
   - Source context: idea/research/spec/roadmap inputs used.
   - Human intent: what outcome the user appears to want and who benefits.
   - Agent interpretation: the concrete capability or change the agent would plan from the input.
   - Existing-system fit: code paths, specs, tasks, and research artifacts likely affected.
   - Planning destination: likely `new spec`, `update existing spec`, `roadmap/task update`, `research/design skill first`, or `no new planning needed`.
   - Priority hypothesis: recommended priority relative to current roadmap/todo, with dependency and risk rationale.
   - Implementation shape: product behavior, design/UX needs, data model, APIs/contracts, migrations, tests, operations, and rollout surface as far as they can be inferred.
   - Risks and unknowns: ambiguity, integration risk, user-facing risk, external dependencies, and what breaks if the assumption is wrong.
   Tag each assumption with `[from idea]`, `[from spec]`, `[from codebase]`, `[from research]`, `[from roadmap]`, `[from git]`, or `[inferred]`.
6. Ask the user to confirm, correct, or flag the evidence brief, claim verdicts, assumptions, journey placement, documentation destination, and priority hypothesis before continuing. Do not proceed past this checkpoint until the user has reviewed it.
7. Interview in focused passes, 1 to 3 questions per turn. If the session is already in Plan mode and there are 2-3 concrete options, prefer `request_user_input`; otherwise ask concise direct questions.
8. Cover only the areas needed to choose and prepare the planning destination:
   - Intent and success criteria.
   - Target users, jobs, and journey/design implications.
   - Feature behavior and scope boundaries.
   - Existing spec fit: whether to create a new spec, update an existing spec, or split the work.
   - Implementation constraints: architecture, data model, API/contract surface, migrations, security, privacy, performance, observability, test strategy, and rollout.
   - Research and journey implications: whether canonical research, journey, UX, UI, or customer/developer docs need updates.
   - Roadmap coupling: dependencies, phase fit, priority, ordering, parallelization, manual blockers, and the smallest useful implementation slice.
9. Research and recommend by default. Use codebase evidence, existing docs, and web search when the decision depends on current external facts. Present options with pros/cons, state a recommendation, and ask the user to approve, adjust, or override.
10. Before concluding, present a **Planning Destination + Priority Checkpoint**:
   - Decision: new spec, update spec, update research/journey docs, update roadmap/tasks only, run another named planning/research skill first, interview log only, or no action.
   - Target artifact path(s).
   - Journey/workflow placement to record.
   - Scope to include now and explicitly defer.
   - Priority decision: user-confirmed priority, dependencies, and whether the feature should interrupt, follow, or remain parked relative to current roadmap/todo work.
   - Roadmap/task impact and recommended next command.
   Ask: "Does this destination, priority, and scope match what you want?"

## Deliverables

After confirmation, write the minimum durable artifact needed:

- New spec: write `specs/[topic].md` using the `$spec-interview` canonical section headings.
- Existing spec update: archive the existing canonical spec first, then update only the relevant sections.
- Research or journey update: archive the existing canonical research/journey document first when replacing or substantively rewriting sections, then make the smallest scoped update. If the missing research requires a named skill, write the interview log and recommend that skill instead of inventing unsupported research.
- Roadmap/task-only change: update `tasks/roadmap.md`, `tasks/todo.md`, `tasks/record-todo.md`, or `tasks/manual-todo.md` only when no spec/research change is needed and the user has confirmed priority.
- Upstream planning/research needed: write an interview log and recommend the named skill instead of inventing a placeholder spec.
- No action: write an interview log explaining why the idea is already covered, duplicate, deferred, or intentionally parked.

Always write an interview log to `specs/[topic]-feature-interview.md` (or `docs/specifications/[topic]-feature-interview.md` if that is the repo's canonical spec location). Include:

- The Feature Evidence Brief and Assumptions Manifest with user corrections.
- Claim validation verdicts and evidence.
- Technical gotchas, mitigations, and unresolved unknowns.
- Journey/user-story/workflow placement and any research or journey doc changes needed.
- Questions asked and answers received.
- Options and recommendations presented.
- Planning Destination + Priority Checkpoint and confirmed decision.
- The exact next command for sequencing.

When replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>` before editing it.

## Next-Step Routing

After writing deliverables, route tightly into the task pipeline:

- If a new or updated spec is ready for sequencing, recommend `$roadmap` so it can extend/build the roadmap and seed `$plan-phase`.
- If research or journey documentation changed but the spec is not ready, recommend the named research/design skill or `$feature-interview` follow-up with the remaining question.
- If user-facing work still lacks journey, UX variation, or UI detail, recommend `$journey-map`, `$ux-variation`, or `$ui-interview` before `$roadmap`.
- If the feature is already sequenced, recommend the concrete executor (`$plan-phase N`, `$run`, `$ship`, or `$guide`) rather than another interview.
- If research is missing, recommend the named research skill and explain what evidence it must produce before returning to `$feature-interview` or `$roadmap`.
- If the idea is duplicate or parked, recommend `$brainstorm` only when the user wants a different candidate; otherwise recommend the existing tracked work.

Output exactly two lines beyond the normal report:

- **Next work:** <specific planning, research, or execution task>
- **Recommended next command:** <one command or route>

## Constraints

- Do not default to a new spec when an existing spec should be updated.
- Do not update roadmap or task sequencing until the planning destination and priority are confirmed by the user.
- Do not produce a full implementation spec unless the interview proves a new or rewritten spec is the right destination.
- Do not route brainstorm ideas directly to `$spec-interview`; use `$feature-interview` for triage unless the user explicitly asks for a full spec.
- Do not implement fixes or feature code from this skill. If the evidence pass uncovers a bug, route to `$investigate`; if it uncovers buildable planned work, route through `$roadmap`, `$plan-phase`, or `$run`.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
