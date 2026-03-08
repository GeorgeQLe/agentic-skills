---
description: Ship current work, plan next step, then enter plan mode for clear-and-implement
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, EnterPlanMode
---

Wrap up current work, commit, push, write the next step plan into CLAUDE.md, then enter plan mode so the user can select "clear context and implement."

Process:

1) **Check if there's anything to ship.**
   Run `git status` and `git diff --stat`.
   - If the working tree is clean AND there are no unpushed commits: skip straight to step 3 (planning).
   - If there are changes: continue to step 2.

2) **Ship the work:**
   a) Read the project's CLAUDE.md (or equivalent tracking doc) to understand current progress.
   b) Update documentation:
      - Update CLAUDE.md with what was accomplished this session.
      - Note any outstanding items, known issues, or blockers discovered.
      - Mark completed items/phases as done.
   c) Commit and push using the /commit-and-push-by-feature workflow:
      - Group changes into logical feature/function buckets.
      - Use conventional commit messages.
      - Push to the current branch.

3) **Plan the next step:**
   a) Read CLAUDE.md and any implementation plan / spec / PRD files in the project (e.g., plan.md, spec.md).
   b) Identify the next uncompleted phase, step, or priority item.
   c) Write a **self-contained** implementation plan into CLAUDE.md under a `## Up Next` section. This plan must be complete enough that a fresh context can execute it by only reading CLAUDE.md. Include:
      - What needs to be built/changed
      - Which files will be affected (full paths)
      - Key technical decisions or risks
      - Relevant context from the current session (gotchas, patterns established, conventions used)
      - If TDD: which tests to write first and what they should assert
      - Acceptance criteria: how to verify the step is done
   d) Commit and push the updated CLAUDE.md.

4) **Output a brief summary** (keep it short to save context):
   - What was shipped (if anything)
   - What the next step is (1-2 sentences)

5) **Enter plan mode** using the EnterPlanMode tool. This gives the user the option to "clear context and implement" — which starts a fresh context that reads CLAUDE.md and implements the plan.

Constraints:
- Do NOT re-read files you've already read this session. Use what's in context.
- Do NOT explore the codebase extensively for planning. Use knowledge from the current session + CLAUDE.md + plan docs. Keep context footprint minimal.
- If the tree is clean and the plan already exists in CLAUDE.md, skip straight to step 5 (enter plan mode).
- Do not switch branches or create new branches unless the current state requires it.
- Do not amend or rewrite history.
- Do not commit secrets.
- The next-step plan must be actionable, not vague. Include specific file paths and technical details.
