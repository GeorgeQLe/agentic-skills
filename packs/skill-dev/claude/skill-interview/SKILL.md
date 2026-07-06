---
name: skill-interview
description: Interview the user to define the characteristics of a skill they want created
type: planning
version: v0.4
required_conventions: [alignment-page, briefing-slides]
argument-hint: "[skill-name-or-topic]"
context_intake: deep
---

# Skill Interview

Use this skill when the user wants to create or substantially redesign a skill but the desired behavior, scope, triggers, outputs, validation, or agent compatibility is not yet clear. This skill interrogates the user and turns the answers into a creation-ready skill brief. It does not create the skill itself. After the brief is complete: for a personal project-local skill route to `/create-local-skill`; for a repo-managed skill in the `agentic-skills` repo, hand the brief to an agent working in that repo to implement following the skill conventions (`docs/skill-anatomy.md`, CLAUDE.md skill-versioning); for a change to an existing shared skill route to `/session-triage`, which emits a managing-layer handoff payload for the fix.

## Process

1. **Identify the target skill idea.**
   - Treat the user's initial request as a draft, not a complete requirement.
   - Resolve the likely skill name in kebab-case when possible.
   - If the request is a correction to an existing shared skill or workflow gap, route to `/session-triage` after the interview instead of scaffolding a new skill.
   - If the user wants an experimental personal skill under `~/.claude/skills`, plan for `/create-local-skill`; otherwise default to a repo-managed skill implemented directly in the `agentic-skills` repo.

2. **Gather local evidence before probing.**
   - Search for overlapping skills in the active skill list and repository paths such as `base/codex/`, `base/claude/`, and `packs/*/{codex,claude}/`.
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
   - Deliver the checkpoint inline as the final message text of its own turn — never only as mid-turn text in a turn that ends with a tool call. In the next turn, use AskUserQuestion to ask the user to confirm or correct it and include the first 1 to 3 focused interview questions so momentum is kept. Option previews may mirror the checkpoint as a supplement but are never the sole channel.
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
   - Before concluding, summarize each covered area with the decision made and source evidence, delivered inline as the final message text of its own turn.
   - In the next turn, use AskUserQuestion to ask: "Does this cover the skill you want, or is there any behavior, boundary, or output we should revisit?"
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

- Implement a repo-managed skill directly in the `agentic-skills` repo, following `docs/skill-anatomy.md` and CLAUDE.md skill-versioning, using the brief as the spec.
- `/create-local-skill <skill-name>` for personal local-only skills.
- `/session-triage <existing-skill> <gap>` when the interview found that an existing shared skill should be updated instead of creating a new skill — it emits a managing-layer handoff payload for the fix.
- `init-agentic-skills` (guided pack setup) or a pack-local creation route when the skill belongs inside a project-local pack rather than base skills.

Output exactly two lines beyond the normal report:

- **Next work:** <specific skill creation or update task>
- **Recommended next command:** <one command>


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/skill-interview-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `/skill-interview`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/skill-interview-{topic}.html`.

## Constraints

- Use AskUserQuestion for all interview turns; do not assume answers.
- Do not create or edit the final `SKILL.md` during the interview unless the user explicitly asks to skip the brief and create the skill now.
- Do not assume a new skill is needed when an existing skill update would satisfy the workflow gap.
- Do not batch unrelated interview questions.
- Do not invent benchmark coverage; if deterministic local coverage is unsafe or impractical, mark the coverage plan as blocked with a reason and next command.
- Keep the final brief implementation-ready enough that an agent implementing in the `agentic-skills` repo, or `/create-local-skill`, can execute without re-interviewing the same decisions.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

