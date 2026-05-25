---
name: concept-exploration
description: Shape a rough product or project idea into an actionable concept brief before ICP, market research, specifications, UX, UI, or implementation planning
type: planning
version: v0.2
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

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.

**Concept-specific gates.** Render the Concept Assumptions Manifest as a first-class assumptions/confidence gate inside the alignment page before proposed deliverables. The concept identity, slug, scope/non-goals, ICP readiness, artifact destination, and proposed file changes must each be reviewable gates.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

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
