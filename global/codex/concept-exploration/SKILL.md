---
name: concept-exploration
description: Shape a rough product or project idea into an actionable concept brief before ICP, market research, specifications, UX, UI, or implementation planning
type: planning
version: v0.1
argument-hint: "[optional rough idea, product thought, or app scope]"
---

# Concept Exploration

Invoke as `$concept-exploration`.

Use this skill when the user has a half-formed idea and needs it cleaned up enough to enter the normal research and planning workflow. This skill is intentionally pre-ICP: it clarifies the concept, problem hypothesis, beneficiary hypothesis, value wedge, constraints, non-goals, and unknowns, but does not select an ICP, analyze competitors, define UX/UI, choose architecture, or write implementation specs.

## Workflow

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read README, CLAUDE.md, AGENTS.md, existing `research/`, `specs/`, and task docs when present.
   - Determine whether the current directory is already a bootstrapped project. Treat it as bootstrapped when it has meaningful `README.md` plus `AGENTS.md` or `CLAUDE.md`; treat it as unbootstrapped when those are missing, placeholder-only, or the user is describing an idea outside any project repo.
   - If `$ARGUMENTS` contains a rough idea, use it as the starting draft.
   - If `$ARGUMENTS` names an app that matches `research/{app}/`, use app-scoped output paths. Otherwise use top-level `research/`.
   - Determine the concept identity and a normalized concept slug as soon as either is known from `$ARGUMENTS`, repo context, or the interview. Normalize by lowercasing, removing URL suffix noise, replacing non-alphanumeric runs with `-`, trimming leading/trailing `-`, and dropping only project-wide brand prefixes when the remaining word is the actual scoped concept (for example, `poketo.work` -> `work`; `Poketo Core` -> `poketo-core`).
   - If existing research or the prompt suggests multiple related concepts may exist, prefer slugged output paths over generic filenames. Reserve generic `concept-brief.md` only for a single unambiguous project-level concept.
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
   - Codex interview cadence is one primary decision question per turn by default. Use short follow-up bullets only when they clarify the same decision, not to batch unrelated questions.
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
   - Restate the resolved concept identity, slug, and exact output paths before writing.
   - If the conversation pivoted from the initial concept to a different central concept, write the pivoted concept to its own slugged brief and preserve the initial concept as a related or future concept in the brief and interview log. Do not merge both concepts into one generic project-level brief.
   - Ask whether any core premise, constraint, or non-goal is wrong before writing.

## Output

Write:

- For one unambiguous project-level concept only: `research/concept-brief.md` and `research/concept-brief-interview.md`.
- When a concept identity is known, multiple concepts exist or may exist, or a pivot occurs: `research/concept-brief-{slug}.md` and `research/concept-brief-{slug}-interview.md`.
- If `$ARGUMENTS` names an app that matches `research/{app}/`, use the same filenames under `research/{app}/`: `research/{app}/concept-brief-{slug}.md` and `research/{app}/concept-brief-{slug}-interview.md`, or unsuffixed app-scoped files only when that app has one unambiguous concept.

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

- If the concept appears to be a business app or user-facing product and the business discovery lane is not enabled: `$pack install business-discovery` — this installs the research skills (ICP, competitive analysis, value prop, positioning, lean canvas) needed before any repo bootstrapping or development.
- If `business-discovery` or the compatibility `business-app` alias is enabled: `$icp`
- If the concept already has ICP/market evidence but needs journey, onboarding, conversion, or retention planning: `$pack install customer-lifecycle`
- If project type is unclear: `$pack recommend`

Include 1-3 other options only when they are materially useful.

### Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/concept-exploration-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/concept-exploration-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Keep the skill short and pre-research.
- Do not write specs, UX variants, UI specs, roadmap phases, or implementation tasks.
- Do not recommend `$scaffold` unless the user explicitly asks to create a package/app shell before research; normal product flow scaffolds after research, prototype consolidation, spec, roadmap, and phase planning identify the first implementation target.
- Do not update `tasks/todo.md`.
- New files do not need archive snapshots. Before replacing an existing concept brief, including slugged briefs, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
