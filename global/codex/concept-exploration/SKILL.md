---
name: concept-exploration
description: Shape a rough product or project idea into an actionable concept brief before ICP, market research, specifications, UX, UI, or implementation planning
type: planning
version: 1.0.0
argument-hint: "[optional rough idea, product thought, or app scope]"
---

# Concept Exploration

Invoke as `$concept-exploration`.

Use this skill when the user has a half-formed idea and needs it cleaned up enough to enter the normal research and planning workflow. This skill is intentionally pre-ICP: it clarifies the concept, problem hypothesis, beneficiary hypothesis, value wedge, constraints, non-goals, and unknowns, but does not select an ICP, analyze competitors, define UX/UI, choose architecture, or write implementation specs.

## Workflow

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read README, CLAUDE.md, AGENTS.md, existing `research/`, `specs/`, and task docs when present.
   - If `$ARGUMENTS` contains a rough idea, use it as the starting draft.
   - If `$ARGUMENTS` names an app that matches `research/{app}/`, use app-scoped output paths. Otherwise use top-level `research/`.
   - If no rough idea is available from arguments or repo context, ask the user for the idea in plain language.

2. **Keep the boundary clear**
   - Do not run ICP, competitive analysis, journey mapping, UX variation, UI interview, roadmap, or implementation planning inside this skill.
   - Do not validate the market with broad web research. Use light repo/context inspection only; downstream research skills own evidence gathering.
   - Treat every user claim as a hypothesis unless supported by existing project files.

3. **Surface a Concept Assumptions Manifest**
   - Before deep questioning, present what you think the concept is.
   - Tag assumptions as `[from prompt]`, `[from repo]`, `[from research]`, or `[inferred]`.
   - Cover:
     - concept summary
     - problem hypothesis
     - target beneficiary or user hypothesis
     - product/category guess
     - value wedge
     - constraints
     - non-goals
     - riskiest unknowns
   - Ask the user to confirm, correct, or flag assumptions before writing.

4. **Interview until concept-ready**
   - Ask 1 to 3 focused questions per turn.
   - Resolve only concept-level ambiguity:
     - what problem exists
     - who might care
     - what outcome changes for them
     - what makes the idea different enough to investigate
     - what must stay out of scope
     - what constraints are real now
   - When unsure, recommend a practical default and clearly mark it as an assumption.

5. **Coverage checkpoint**
   - Present the final concept summary, unknowns, and readiness for ICP.
   - Ask whether any core premise, constraint, or non-goal is wrong before writing.

## Output

Write:

- `research/concept-brief.md` or `research/{app}/concept-brief.md`
- `research/concept-brief-interview.md` or `research/{app}/concept-brief-interview.md`

The concept brief must include:

- `## Summary`
- `## Problem Hypothesis`
- `## Beneficiary Hypothesis`
- `## Product Category Guess`
- `## Value Wedge`
- `## Constraints`
- `## Non-Goals`
- `## Assumptions And Unknowns`
- `## ICP Readiness`
- `## Next Steps`

The `## ICP Readiness` section must state whether the concept is ready for `$icp`, what inputs `$icp` should use, and which assumptions should be tested first.

The `## Next Steps` section must recommend exactly one primary command:

- If the concept appears to be a business app or user-facing product and the business discovery lane is not enabled: `$pack install business-discovery`
- If the concept already has ICP/market evidence but needs journey, onboarding, conversion, or retention planning: `$pack install customer-lifecycle`
- If `business-discovery` or the compatibility `business-app` alias is enabled: `$icp`
- If project type is unclear: `$pack recommend`

Include 1-3 other options only when they are materially useful.

## Constraints

- Keep the skill short and pre-research.
- Do not write specs, UX variants, UI specs, roadmap phases, or implementation tasks.
- Do not update `tasks/todo.md`.
- New files do not need archive snapshots. Before replacing an existing concept brief, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
