# Check for skill creation interrogation tool

| Field | Value |
|-------|-------|
| **Date** | 2026-05-20 13:56:52 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `eed771b2-c294-49ba-8139-5d8b918476b5` |
| **Entrypoint** | cli |
| **Version** | 2.1.145 |

---

## User _13:56:52_

do we have an interrogation skill for creating skills?

## Assistant _13:57:01_

Looking at the available skills, there are a few candidates. Let me explore what we have.

## Assistant _13:57:02_

<details><summary>Tool calls</summary>

- Agent: Find skill-creation skills

</details>

## Assistant _13:57:30_

Yes — **`skill-interview`** is exactly that. It's an interrogation-style skill that iteratively interviews you to define a new skill, asking 1-3 focused questions per turn about scope, triggers, outputs, and validation.

The creation pipeline is two-step:

1. **`/skill-interview`** — interrogates you to produce a skill brief (`specs/<name>-skill-brief.md`) and decision log (`specs/<name>-skill-interview.md`). Does not write the skill itself.
2. **`/create-agentic-skill`** — takes the brief and actually scaffolds the `SKILL.md`, updates benchmarks, validates, and ships.

There's also **`/targeted-skill-builder`** for smaller fixes — when you have a concrete workflow gap or correction and just need to patch or create a skill without a full interview.

Is there something specific you're looking to build, or were you just checking what exists?

## User _14:06:47_

<command-message>skill-interview</command-message>
<command-name>/skill-interview</command-name>
<command-args>we need a skill to help migrate an existing project to our new workflow? Is hygiene adequeate for that? Or should we have it that for all projects that are stuck, hitting the main problem of the old workflow which is feature complete and buttoned down products are really hard to test and gain alignment between agent and user, to start from scratch with the new workflow?</command-args>

## User _14:06:47_

Base directory for this skill: /Users/georgele/.claude/skills/skill-interview

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

## Constraints

- Use AskUserQuestion for all interview turns; do not assume answers.
- Do not create or edit the final `SKILL.md` during the interview unless the user explicitly asks to skip the brief and create the skill now.
- Do not assume a new skill is needed when an existing skill update would satisfy the workflow gap.
- Do not batch unrelated interview questions.
- Do not invent benchmark coverage; if deterministic local coverage is unsafe or impractical, mark the coverage plan as blocked with a reason and next command.
- Keep the final brief implementation-ready enough that `/create-agentic-skill` or `/create-local-skill` can execute without re-interviewing the same decisions.


ARGUMENTS: we need a skill to help migrate an existing project to our new workflow? Is hygiene adequeate for that? Or should we have it that for all projects that are stuck, hitting the main problem of the old workflow which is feature complete and buttoned down products are really hard to test and gain alignment between agent and user, to start from scratch with the new workflow?

## Assistant _14:06:56_

Let me gather evidence on the existing `hygiene` skill and your current workflow conventions before we start the interview.

## Assistant _14:06:58_

<details><summary>Tool calls</summary>

- Agent: Explore hygiene skill

</details>

## Assistant _14:07:04_

<details><summary>Tool calls</summary>

- Agent: Explore workflow conventions

</details>

## Assistant _14:07:06_

<details><summary>Tool calls</summary>

- Agent: Explore migrate skill

</details>

## Assistant _14:08:58_

Good — I've got a clear picture of the landscape. Let me surface what I found and start the interview.

**Evidence summary:**

- **`/hygiene`** is a structural linter (frontmatter, doc templates, naming). It doesn't guide workflow adoption — it just checks whether the files that exist conform to conventions.
- **`/migrate`** handles code/dependency migrations ("upgrade Next.js", "move components"). Not workflow migrations.
- **Neither covers what you're describing** — taking a project stuck in the old infrastructure-first, chat-driven mode and moving it to the new file-backed, prototype-first pipeline.
- The new workflow pipeline is: `concept-exploration → roadmap → plan-phase → run → ship`, with prototype-first gates and file-backed state (`specs/`, `tasks/roadmap.md`, `tasks/todo.md`, etc.).
- `lessons.md` documents the core problem: infrastructure-before-prototype bias (2.6x more infra messages than prototype messages), late testing, feature-complete products that are hard to align on.

Here are my initial assumptions and first questions:

**Assumptions checkpoint:**

1. `[from request]` The target is existing projects that are feature-complete / buttoned-down and stuck — not greenfield repos
2. `[from lessons]` The core problem is infrastructure was built before prototype/taste alignment, making UAT and agent-user alignment very difficult retroactively
3. `[inferred]` "Start from scratch" means re-entering at `concept-exploration` or `bootstrap-repo`, not deleting code — the existing codebase becomes reference material while the workflow restarts from specs/prototype
4. `[from codebase]` The new workflow requires `specs/`, `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md` — a stuck project likely has none or incomplete versions of these
5. `[inferred]` This skill would be repo-managed and global (not pack-local), since it applies to any project type
6. `[inferred]` The skill should assess whether a project can be incrementally adopted into the new workflow vs. needs a full restart

## Assistant _14:09:11_

<details><summary>Tool calls</summary>

- AskUserQuestion

</details>

## Assistant _14:13:04_

Good — so "full reset" is on the table as a real option. That changes the shape of this skill significantly. Let me dig into that.

So the flow would be: **assess first** → if the project is salvageable, migrate incrementally; if it's too far gone, desk-flip and start from scratch (archive code, literally begin again).

## Assistant _14:13:17_

<details><summary>Tool calls</summary>

- AskUserQuestion

</details>

## Assistant _14:14:18_

Clear — this is much simpler than I initially scoped. It's always desk-flip, no incremental migration path. The skill is essentially: **autopsy the stuck project, extract what's worth carrying forward, then route to `/bootstrap-repo` in a fresh repo.**

## Assistant _14:14:25_

<details><summary>Tool calls</summary>

- AskUserQuestion

</details>

## Assistant _14:15:14_

**Coverage checkpoint** — here's what I have for the skill contract. Confirm or correct before I write the brief:

| Area | Decision | Source |
|------|----------|--------|
| **Name** | `desk-flip` | user choice |
| **Purpose** | Autopsy a stuck project, extract salvageable artifacts, route to fresh start in a new repo | user choice |
| **Location** | Repo-managed global (`global/claude/desk-flip/`) | inferred |
| **Trigger** | Manual invocation only (`/desk-flip`) | user choice |
| **Strategy** | Always desk-flip — no incremental migration path | user choice |
| **Extraction scope** | Lessons (what went wrong), valid specs/designs, non-code assets (icons, copy, research) | user choice |
| **Old project** | Stays in its current repo untouched | user choice (separate repo) |
| **New project** | Fresh repo via `/bootstrap-repo` | user choice |
| **Deliverable** | Autopsy/extraction report that becomes input for `/bootstrap-repo` in the new repo | inferred |
| **Execution depth** | Assess + extract, then route to `/bootstrap-repo` | user choice |
| **Commit/push** | No mutations to old repo — extraction report written to new repo or handed off | inferred |
| **Benchmark coverage** | Deterministic: verify extraction report structure; subjective: quality of lessons/extraction | inferred |

## Assistant _14:15:15_

<details><summary>Tool calls</summary>

- AskUserQuestion

</details>

## Assistant _14:16:14_

Writing the skill brief and interview log, then the plan file.

## Assistant _14:16:14_

<details><summary>Tool calls</summary>

- Bash: Check specs directory exists

</details>

## Assistant _14:16:54_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/specs/desk-flip-skill-brief.md`

</details>

## Assistant _14:17:11_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/specs/desk-flip-skill-interview.md`

</details>

## Assistant _14:17:44_

Now writing the plan file.

## Assistant _14:17:51_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/do-we-have-an-floating-tome.md`

</details>

## Assistant _14:17:54_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _14:17:58_

Skill interview complete. Wrote both deliverables:

- **`specs/desk-flip-skill-brief.md`** — creation-ready brief
- **`specs/desk-flip-skill-interview.md`** — full interview log

**Next work:** Create the `desk-flip` skill from the brief
**Recommended next command:** `/create-agentic-skill desk-flip`

## Assistant _14:17:58_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _14:17:59_

[Request interrupted by user for tool use]
