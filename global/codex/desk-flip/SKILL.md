---
name: desk-flip
description: Autopsy a stuck project, extract salvageable artifacts, and route to a fresh start via $bootstrap-repo
type: execution
version: 1.0.0
argument-hint: "<project-path>"
---

# Desk Flip

Invoke as `$desk-flip`.

Autopsy a stuck project, extract salvageable artifacts (lessons, valid specs, non-code assets), and route the user to a fresh start in a new repo via `$bootstrap-repo`.

This skill always desk-flips. If the user invoked it, the decision to restart is already made. Do not offer incremental migration or attempt to fix the old project in place.

## Workflow

1. **Identify the stuck project.**
   - Accept an optional project path from the invocation arguments; default to the current working directory.
   - Verify the target is a git repo with existing code, not an empty repo.
   - If the project appears to already use the new workflow (file-backed specs, prototype-first artifacts, healthy structure), warn the user and confirm before proceeding.

2. **Survey the project.**
   - Read `AGENTS.md`, `CLAUDE.md`, `README.md`, `package.json` or equivalent manifest, and directory structure when present.
   - Read `tasks/`, `specs/`, and `docs/` directories if they exist.
   - Scan recent git history (last ~50 commits) for commit patterns and timeline.
   - Read any existing `tasks/lessons.md` or post-mortem docs.

3. **Run the autopsy.**
   - **Lessons extraction:** What went wrong? Look for evidence of failure modes: infrastructure before prototype, late testing, chat-driven alignment drift, scope creep, untestable architecture. Cite specific commits, files, or timeline evidence.
   - **Spec/design extraction:** Identify specs, designs, research docs, interview logs, and product briefs that capture valid domain knowledge or user needs, regardless of whether the implementation matched. Mark each as `valid`, `partially valid`, or `stale` with a one-line rationale.
   - **Asset inventory:** Find non-code assets worth preserving: icons, images, copy, API contracts, design tokens, brand assets, research documents.

   Do not extract code, dependencies, database schemas, or infrastructure config.

4. **Write the autopsy report.**
   - Produce `desk-flip-report.md` in the project root with these sections:

   ```markdown
   ## Project Summary
   What the project was and what state it's in now.

   ## What Went Wrong
   Specific failure modes with evidence (commits, files, timeline).

   ## Salvageable Specs & Designs
   List with file paths, validity status, and one-line descriptions.

   ## Salvageable Assets
   Non-code assets with file paths.

   ## Lessons for the Fresh Start
   Actionable guidance for the new project to avoid the same mistakes.

   ## Recommended Bootstrap Input
   A condensed brief suitable as input to $bootstrap-repo.
   ```

5. **Present and route.**
   - Show the user a terminal summary of the report.
   - Recommend the user create a new repo and run `$bootstrap-repo` with the recommended bootstrap input from the report.
   - Do not create the new repo or run `$bootstrap-repo`; the user does this.

## Output

```markdown
Desk-flipped: <project name>
- Report: desk-flip-report.md written to <project-path>
- Specs extracted: <count> (<valid>/<partial>/<stale>)
- Assets found: <count>
- Lessons captured: <count>

**Next work:** Create a new repo for the fresh start
**Recommended next command:** $bootstrap-repo <condensed brief from report>
```

## Constraints

- **Read-only on the old project**: no modifications to existing files, no archival, no branch creation. The only file written is `desk-flip-report.md`.
- Do not carry forward code, dependencies, or infrastructure from the old project.
- Do not create the new repo or invoke `$bootstrap-repo`; the user handles that transition.
- Do not commit or push; the report is informational, not a meaningful mutation to ship.
- Do not delete, archive, or rename anything in the old repo.
- If the project has no specs, docs, or meaningful git history, produce the report anyway but note the thin evidence in each section.

## Default Shipping Contract

- This skill does not commit or push. The only side effect is `desk-flip-report.md` written to the project root.
- **Default next-step routing:** when reporting completion, include the two-line pair `**Next work:** <specific task>` and `**Recommended next command:** $bootstrap-repo <brief>` so the user has a concrete handoff.
