---
name: ship-then-plan
description: Ship current work, plan next step, then enter plan mode for clear-and-implement
---

Wrap up current work, commit, push, write the next step into `tasks/todo.md`, then enter plan mode.

Process:

1) **Check if there's anything to ship.**
   Run `git status` and `git diff --stat`.
   - If the working tree is clean AND there are no unpushed commits: skip straight to step 3 (planning).
   - If there are changes: continue to step 2.

2) **Ship the work:**
   a) Read the project's CLAUDE.md to understand current progress.
   b) Update `tasks/todo.md` — mark completed items as done (check off steps and milestone criteria).
   c) Commit and push using the /commit-and-push-by-feature workflow:
      - Group changes into logical feature/function buckets.
      - Use conventional commit messages.
      - Push to the current branch.

3) **Deploy:**
   a) Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   b) Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   c) If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   d) Run the deploy and verify the output for errors.
   e) If a health check URL or status command exists, run it.
   f) If the deploy fails, report the error. Do not retry automatically.

4) **Plan the next step:**
   a) **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
   b) Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
   c) **Check if the current phase is complete** (all steps checked, milestone criteria met):
      - If **YES — Phase transition:**
        1. Archive the completed phase: copy `tasks/todo.md` → `docs/phases/phase-N.md` (create `docs/phases/` if needed). Fill in the "On Completion" section.
        2. Check off the phase milestone in `tasks/roadmap.md`.
        3. Copy the next phase from `tasks/roadmap.md` → overwrite `tasks/todo.md`.
        4. If no more phases remain, report "all done" and stop.
      - If **NO:** find the next uncompleted step within the current phase.
   d) Write a **self-contained** implementation plan for the next step into `tasks/todo.md`. This plan must be complete enough that a fresh context can execute it by reading only CLAUDE.md and `tasks/todo.md`. Include:
      - What needs to be built/changed
      - Which files will be affected (full paths)
      - Key technical decisions or risks
      - Relevant context from the current session (gotchas, patterns established, conventions used)
      - If TDD: which tests to write first and what they should assert
      - Acceptance criteria: how to verify the step is done
   e) Commit and push `tasks/todo.md`, `tasks/roadmap.md`, and `docs/phases/` (if created).

5) **Output a brief summary** (2-3 lines max to save context):
   - What was shipped (if anything)
   - Deploy status (if deployed)
   - What the next step is (1 sentence)

6) **YOU MUST call the EnterPlanMode tool.** This is not optional. This gives the user the option to "clear context and implement" — which starts a fresh context that reads `tasks/todo.md` and implements the plan.

Constraints:
- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do NOT write plans into CLAUDE.md. CLAUDE.md is for project conventions and config only.
- `tasks/roadmap.md` is the source of truth for the full phased plan. `tasks/todo.md` holds only the current phase.
- Create `tasks/todo.md` if it doesn't exist.
- Do NOT re-read files you've already read this session. Use what's in context.
- Do NOT explore the codebase extensively for planning. Keep context footprint minimal.
- If the tree is clean and the next step plan already exists in `tasks/todo.md`, skip straight to step 6.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
- Do not amend or rewrite history.
- Do not commit secrets.
- The plan must be actionable, not vague. Include specific file paths and technical details.
