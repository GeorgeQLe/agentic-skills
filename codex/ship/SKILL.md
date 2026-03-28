---
name: ship
description: Ship current work (update docs, commit, push, deploy) and optionally plan the next step.
---

# Ship

Ship current work, commit, push, deploy, and plan the next step.

## Workflow

1. Check if there is anything to ship:
   - Run `git status` and `git diff --stat`.
   - If the working tree is clean and there are no unpushed commits, skip to step 3.
   - If there are changes, continue to step 2.
2. Ship the work:
   - Read `CLAUDE.md` to understand current progress.
   - Update `tasks/todo.md` — mark completed items as done.
   - Update `tasks/history.md` — append a brief record of what was accomplished. Create it if needed.
   - Commit and push using the commit-and-push-by-feature workflow.
3. Deploy:
   - Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   - Run the deploy and verify the output for errors.
   - If a health check URL or status command exists, run it.
   - If the deploy fails, report the error. Do not retry automatically.
4. Plan the next step:
   - **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
   - Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
   - **Check if the current phase is complete** (all steps checked, milestone criteria met):
     - If **YES — Phase transition:**
       1. Archive the completed phase: copy `tasks/todo.md` → `docs/phases/phase-N.md` (create `docs/phases/` if needed). Fill in the "On Completion" section.
       2. Check off the phase milestone in `tasks/roadmap.md`.
       3. Copy the next phase from `tasks/roadmap.md` → overwrite `tasks/todo.md`.
       4. If no more phases remain, report "all done" and stop.
       5. **Just-in-time planning:** Invoke `/plan-phases` for the new phase. This generates TDD steps and file-level detail using the full context of what was learned during prior phases.
     - If **NO:** find the next uncompleted step within the current phase.
5. Write a self-contained implementation plan for the next step into `tasks/todo.md`, complete enough for a fresh session to execute from `tasks/todo.md` alone.
6. Commit and push `tasks/todo.md`, `tasks/roadmap.md`, and `docs/phases/` (if created).
7. Output a brief summary:
   - What was shipped (if anything)
   - Deploy status (if deployed)
   - Test status — explicitly state whether any failing tests are expected (red phase: tests before implementation) or unexpected (regressions/bugs)
   - What the next step is

## Constraints

- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do not write plans into `CLAUDE.md`. It is for project conventions only.
- `tasks/roadmap.md` is the source of truth for the full phased plan. `tasks/todo.md` holds only the current phase.
- Create `tasks/todo.md` if it does not exist.
- Do not amend or rewrite history.
- Do not commit secrets.
- The plan must be actionable with specific file paths and technical details.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
- Do not modify code as part of the deploy process.
