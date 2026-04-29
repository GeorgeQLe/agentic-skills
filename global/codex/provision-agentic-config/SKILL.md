---
name: provision-agentic-config
description: Provision workflow orchestration and agent conventions into project CLAUDE.md and AGENTS.md
type: ops
version: 1.0.0
---

# Install Workflow Orchestration

Invoke as `$provision-agentic-config`.

Use this skill when the user wants the repository's `CLAUDE.md` and `AGENTS.md` updated with the workflow orchestration policy block from this workflow.

## Target

- Current repository files: `./CLAUDE.md` and `./AGENTS.md`

## Workflow

1. Ensure `./CLAUDE.md` and `./AGENTS.md` exist.
2. Insert the policy block below verbatim into both files.
3. If the same block already exists anywhere in either file, replace it so the block appears exactly once per file.
4. Preserve any unrelated content already in `CLAUDE.md` and `AGENTS.md`.

## Required Block

```md
## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity
- In Codex: use `update_plan` in Default mode and `request_user_input` only when already in Plan mode
- Do not assume a Claude-style clear-context-on-accept flow or related JSON setting exists

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff your behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/roadmap.md` (full plan) and `tasks/todo.md` (current phase) with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Direct-To-Primary Git Flow**: Default to committing and pushing on the repository primary branch (`main` when present, otherwise `master`). Do not introduce or continue feature-branch workflows unless the user explicitly asks for them.
- **Always Ship Mutations**: If a task creates or modifies tracked files, finish by committing and pushing all intended changes before stopping unless the user explicitly says not to. Do not leave a dirty tracked tree or unpushed commits behind.
- **No GitHub Actions**: Do not create, modify, or suggest GitHub Actions workflows. This project does not use GitHub Actions for CI/CD.
```

## Output

After updating the files, report:

- Whether `./CLAUDE.md` and `./AGENTS.md` were created or modified
- Where the block was inserted in each file
- Confirmation that the final block appears exactly once in each file


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
