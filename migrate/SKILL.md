---
name: migrate
description: Guide a structural migration or dependency upgrade with a step-by-step plan, batch execution, and verification at each step.
---

# Migrate

Use this skill when the user needs to perform a large-scale codebase reorganization, dependency upgrade, or pattern migration.

## Workflow

1. Understand the migration target from the user's description.
2. Audit the current state — find all instances of the old pattern.
3. Enter plan mode with the migration plan and wait for approval.
4. Execute in verifiable batches, running type-checks and tests after each.
5. Final verification: full test suite, build, and grep for remaining old patterns.

## Output Format

- **Scope**: files and packages affected
- **Changes Made**: batch-by-batch summary
- **Verification**: type-check, tests, build results
- **Manual Follow-ups**: anything that couldn't be automated

## Constraints

- Always enter plan mode before making changes.
- Process one package at a time in monorepos.
- Do not change behavior — migrations should be structural only.
