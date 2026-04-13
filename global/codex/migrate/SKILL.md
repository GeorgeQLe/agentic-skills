---
name: migrate
description: Guide a structural migration or dependency upgrade with a step-by-step plan and verification
version: 1.0.0
---

# Migrate

Use this skill when the user needs to perform a large-scale codebase reorganization, dependency upgrade, or pattern migration.

## Workflow

1. Understand the migration target from the user's description.
2. Audit the current state — find all instances of the old pattern.
3. Present the migration plan and wait for approval. Use `update_plan` to track the work; use `request_user_input` only if the session is already in Plan mode and a structured choice would help.
4. Execute in verifiable batches, running type-checks and tests after each.
5. Final verification: full test suite, build, and grep for remaining old patterns.

## Output Format

- **Scope**: files and packages affected
- **Changes Made**: batch-by-batch summary
- **Verification**: type-check, tests, build results
- **Manual Follow-ups**: anything that couldn't be automated

## Constraints

- Always present the plan and get approval before making changes. Do not assume a Claude-style `EnterPlanMode` or clear-context accept flow exists.
- Process one package at a time in monorepos.
- Do not change behavior — migrations should be structural only.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
