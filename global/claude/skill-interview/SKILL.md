---
name: skill-interview
description: Interview the user to define the characteristics of a skill they want created
type: planning
version: v0.0
argument-hint: "[skill-name-or-topic]"
---

# Skill Interview

Use this skill when the user wants to create or substantially redesign a skill but the desired behavior, scope, triggers, outputs, validation, or agent compatibility is not yet clear. This skill interrogates the user and turns the answers into a creation-ready skill brief. It does not create the skill itself; route to `/create-agentic-skill`, `/create-local-skill`, or `/targeted-skill-builder` after the brief is complete.

## Workflow

1. **Identify the target skill idea.**
   - Treat the user's initial request as a draft, not a complete requirement.
   - Resolve the likely skill name in kebab-case when possible.
   - If the request is a correction to an existing workflow gap, consider whether `/targeted-skill-builder` is a better next route after the interview.
   - If the user wants an experimental personal skill under `~/.claude/skills`, plan for `/create-local-skill`; otherwise default to repo-managed `/create-agentic-skill`.

2. **Gather local evidence before probing.**
   - Search for overlapping skills in the active skill list and repository paths such as `global/codex/`, `global/claude/`, and `packs/*/{codex,claude}/`.
   - Read the closest existing skill contracts and any relevant `tasks/lessons.md` entries before asking detailed questions.
   - If an existing skill already covers the request, explain the overlap and ask whether the user wants an update, alias, narrower variant, or new skill.

3. **Surface a lightweight assumptions checkpoint.**
   - Before deep probing, present 3 to 7 assumptions most likely to affect the skill contract.
   - Tag each assumption:
     - `[from request]` — explicitly stated by the user
     - `[from existing skill]` — derived from a current skill contract
     - `[from lessons]` — derived from `tasks/lessons.md`
     - `[from codebase]` — derived from repository conventions or test harnesses
     - `[inferred]` — a default judgment that needs confirmation
   - Bias toward assumptions that affect trigger rules, allowed side effects, deliverables, verification, benchmarkability, and next-step routing.
   - Present the checkpoint with the first AskUserQuestion turn and immediately include 1 to 3 focused interview questions.
   - If an `[inferred]` assumption is corrected, preserve the correction in the interview log and final brief.

4. **Interview material decisions.**
   - Use AskUserQuestion for all interview turns.
   - Ask one to three focused questions per turn, not more.
   - Research and recommend by default: use local codebase evidence and, when the user requests current external facts, web evidence before asking the user to choose.
   - For each material choice, explain the options, recommend one, and ask the user to approve, adjust, or override.

5. **Cover the skill characteristics completely.**
   - Continue until the brief captures:
     - Skill name and one-line description
     - Target location: repo-managed, local-only, pack-local, Codex-only, Claude-only, or mirrored
     - Trigger rules and explicit non-triggers
     - Inputs and argument syntax
     - Required evidence gathering before questions or edits
     - Interview cadence or execution workflow
     - Deliverables and file paths
     - Side-effect permissions and safety constraints
     - Verification and benchmark coverage strategy
     - Next-step routing after successful completion
     - Relationship to overlapping skills
   - For mutation-capable skills, explicitly define whether the skill should commit and push by default.
   - For repo-managed skills, include benchmark coverage expectations in the brief.

6. **Coverage checkpoint.**
   - Before concluding, use AskUserQuestion to summarize each covered area with the decision made and source evidence.
   - Ask: "Does this cover the skill you want, or is there any behavior, boundary, or output we should revisit?"
   - Do not write final deliverables until the user confirms the checkpoint or provides final corrections.

7. **Write deliverables.**
   - Create `specs/[skill-name]-skill-brief.md` with:
     - `## Overview`
     - `## Goals`
     - `## Non-Goals`
     - `## Skill Contract`
     - `## Workflow`
     - `## Inputs and Outputs`
     - `## Safety and Side Effects`
     - `## Verification and Benchmark Coverage`
     - `## Related Skills`
     - `## Open Questions`
     - `## Assumptions & Risks`
     - `## Recommended Creation Route`
   - Create `specs/[skill-name]-skill-interview.md` with:
     - Assumptions checkpoint and corrections
     - Questions asked
     - Options and recommendations presented
     - User responses and decisions
     - Deviations from the initial request
   - If the repository uses another canonical specification directory, use that directory and note the path.

## Next-Step Routing

After writing the brief and interview log, recommend exactly one next command:

- `/create-agentic-skill <skill-name>` for repo-managed global skills.
- `/create-local-skill <skill-name>` for personal local-only skills.
- `/targeted-skill-builder <existing-skill> <gap>` when the interview found that an existing skill should be updated instead of creating a new skill.
- `/pack` or a pack-local creation route when the skill belongs inside a project-local pack rather than global skills.

Output exactly two lines beyond the normal report:

- **Next work:** <specific skill creation or update task>
- **Recommended next command:** <one command>

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/skill-interview-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/skill-interview-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Use AskUserQuestion for all interview turns; do not assume answers.
- Do not create or edit the final `SKILL.md` during the interview unless the user explicitly asks to skip the brief and create the skill now.
- Do not assume a new skill is needed when an existing skill update would satisfy the workflow gap.
- Do not batch unrelated interview questions.
- Do not invent benchmark coverage; if deterministic local coverage is unsafe or impractical, mark the coverage plan as blocked with a reason and next command.
- Keep the final brief implementation-ready enough that `/create-agentic-skill` or `/create-local-skill` can execute without re-interviewing the same decisions.
