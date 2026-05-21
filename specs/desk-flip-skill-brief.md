# desk-flip — Skill Brief

## Overview

Autopsy a stuck project, extract salvageable artifacts (lessons, valid specs, non-code assets), and route the user to a fresh start in a new repo via `/bootstrap-repo`.

This skill exists because the old workflow — infrastructure-first, chat-driven, late testing — produces feature-complete projects that are extremely hard to test and align on between agent and user. Rather than attempting incremental migration (which preserves the structural problems), this skill always desk-flips: the old project stays in its repo as-is, and a new project begins from scratch in a separate repo using the new file-backed, prototype-first pipeline.

## Goals

- Give stuck projects a clean exit with extracted value
- Produce an autopsy report that captures what went wrong and what's worth preserving
- Extract salvageable specs, designs, and non-code assets so the fresh start doesn't re-discover domain knowledge
- Route cleanly to `/bootstrap-repo` with extraction output as input

## Non-Goals

- Incremental migration or retrofitting the new workflow onto the old codebase
- Modifying, archiving, or deleting the old project's code or repo
- Executing the fresh start — that's `/bootstrap-repo`'s job
- Carrying forward code, dependencies, or infrastructure from the old project

## Skill Contract

- **Name:** `desk-flip`
- **Location:** `global/claude/desk-flip/SKILL.md` (repo-managed, global)
- **Trigger:** Manual invocation only — `/desk-flip` or `/desk-flip <project-path>`
- **Non-triggers:** Do not invoke for greenfield projects, projects already using the new workflow, or code/dependency migrations (use `/migrate` for those)
- **Strategy:** Always desk-flip. No assessment of "should we migrate vs. restart" — if the user invoked this skill, the answer is restart.

## Workflow

1. **Identify the stuck project.**
   - Accept an optional project path argument; default to current working directory.
   - Verify it's a git repo with existing code (not empty).
   - Read `CLAUDE.md`, `README.md`, `tasks/`, `specs/`, `docs/` if they exist.

2. **Run the autopsy.**
   - Use subagents to parallelize analysis across:
     - **Lessons extraction:** What went wrong? Scan git history, commit patterns, any existing `tasks/lessons.md`, README, and CLAUDE.md for evidence of the old workflow's failure modes (infrastructure-before-prototype, late testing, alignment drift).
     - **Spec/design extraction:** Identify specs, designs, research docs, and interview logs that capture valid domain knowledge, user needs, or product intent — regardless of whether the implementation matched.
     - **Asset inventory:** Find non-code assets worth preserving — icons, copy, research documents, API contracts, design tokens, brand assets.
   - Do NOT extract code, dependencies, database schemas, or infrastructure config.

3. **Write the autopsy report.**
   - Produce `desk-flip-report.md` with sections:
     - `## Project Summary` — what the project was, what state it's in
     - `## What Went Wrong` — specific failure modes with evidence
     - `## Salvageable Specs & Designs` — list with file paths and one-line descriptions of what's still valid
     - `## Salvageable Assets` — non-code assets with file paths
     - `## Lessons for the Fresh Start` — actionable guidance for the new project to avoid the same mistakes
     - `## Recommended Bootstrap Input` — a condensed brief suitable as input to `/bootstrap-repo`
   - Present the report to the user for review before routing.

4. **Route to fresh start.**
   - Recommend the user create a new repo and run `/bootstrap-repo` with the extraction output.
   - Do NOT create the new repo or run bootstrap-repo — the user does this.

## Inputs and Outputs

**Inputs:**
- Optional: project path (defaults to cwd)
- The existing project's codebase and git history

**Outputs:**
- `desk-flip-report.md` — autopsy report with extraction (written to the old project repo for reference)
- Terminal output: summary + recommended next command

## Safety and Side Effects

- **Read-only on the old project** — no modifications, no archival, no branch creation. The old repo stays exactly as-is.
- The only file written is `desk-flip-report.md` in the old project root.
- Does not create the new repo — the user handles that.
- Does not commit or push (no meaningful mutations to ship).
- If the project doesn't look stuck (already has new-workflow artifacts and appears healthy), warn the user and confirm before proceeding.

## Verification and Benchmark Coverage

**Deterministic (layer 1):**
- Verify `desk-flip-report.md` is produced with all required sections
- Verify no other files in the old repo are modified
- Verify extraction doesn't include code files or dependency lists

**Subjective (layer 2):**
- Agent review: Are the "What Went Wrong" findings specific and evidence-backed, not generic?
- Agent review: Are the salvageable specs correctly identified (not stale/invalid ones)?
- Agent review: Is the "Recommended Bootstrap Input" brief actionable for `/bootstrap-repo`?

## Related Skills

| Skill | Relationship |
|-------|-------------|
| `/bootstrap-repo` | Downstream — receives the extraction output to start the new project |
| `/concept-exploration` | The new project will likely enter here after bootstrap |
| `/hygiene` | Structural linter — does not handle workflow migration |
| `/migrate` | Code/dependency migration — different problem entirely |
| `/reconcile-dev-docs` | Could be useful post-bootstrap to verify the new project's docs |

## Open Questions

1. Should the autopsy report format be standardized enough that `/bootstrap-repo` can parse it automatically, or is human copy-paste fine?
2. Should the skill maintain a registry of desk-flipped projects (old repo → new repo mapping) for future reference?
3. Should there be a lightweight "pre-flight" mode that just tells the user what it would extract without writing anything?

## Assumptions & Risks

- **Assumption:** The user has already decided to desk-flip. This skill doesn't try to talk them out of it.
- **Assumption:** The old repo stays accessible for future reference (it's not deleted).
- **Risk:** Extraction quality depends on how well the old project documented itself. Projects with no specs/docs will produce thin reports.
- **Risk:** The user may expect code to carry forward. The skill explicitly does not do this — make this clear upfront.

## Recommended Creation Route

`/create-agentic-skill desk-flip`
