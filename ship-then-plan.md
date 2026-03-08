Wrap up current work, commit, push, then plan the next implementation step.

Process:
1) Do everything from /ship-end:
   a) Read the project's CLAUDE.md (or equivalent tracking doc) to understand current progress and phase.
   b) Run `git status` and `git diff` to see all changes.
   c) Update documentation:
      - Update CLAUDE.md with what was accomplished this session.
      - Note any outstanding items, known issues, or blockers discovered.
      - Mark completed items/phases as done.
   d) Commit and push using the /commit-and-push-by-feature workflow:
      - Group changes into logical feature/function buckets.
      - Use conventional commit messages.
      - Push to the current branch.

2) Then plan the next step:
   a) Re-read the updated CLAUDE.md and any implementation plan / spec / PRD files in the project (e.g., plan.md, spec.md).
   b) Identify the next uncompleted phase, step, or priority item.
   c) Produce a concrete, self-contained implementation plan that a fresh context can execute immediately without needing to read any other files. Include:
      - What needs to be built/changed
      - Which files will be affected (full paths)
      - Key technical decisions or risks
      - Relevant context from the current session (gotchas, patterns established, conventions used)
      - If TDD: which tests to write first and what they should assert
      - Acceptance criteria: how to verify the step is done
   d) Write the plan into CLAUDE.md under a `## Up Next` section. This section should be complete enough that the instruction "read CLAUDE.md and implement the plan" is all that's needed — no ambiguity, no need to cross-reference other docs.
   e) Commit and push the updated plan.

3) Output a summary:
   - What was accomplished this session
   - What the next step is and its plan
   - Branch and commit list
   - Confirm working tree is clean

Constraints:
- Do not switch branches or create new branches unless the current state requires it.
- Do not amend or rewrite history.
- Do not commit secrets.
- If pre-commit hooks fail, fix and retry.
- The next-step plan should be actionable, not vague. Include specific file paths and technical details.
