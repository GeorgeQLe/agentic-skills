---
name: migrate
description: Guide a structural migration or dependency upgrade with a step-by-step plan and verification
type: execution
version: v0.1
required_conventions: [alignment-page]
---

# Migrate

Invoke as `$migrate`.

Use this skill when the user needs to perform a large-scale codebase reorganization, dependency upgrade, or pattern migration.

## Process

1. Understand the migration target from the user's description.
2. Audit the current state — find all instances of the old pattern.
3. Present the migration plan and wait for approval. Use `update_plan` to track the work; use `request_user_input` only if the session is already in Plan mode and a structured choice would help.
4. Execute in verifiable batches, running type-checks and tests after each.
5. Final verification: full test suite, build, and grep for remaining old patterns.

## Output

- **Scope**: files and packages affected
- **Changes Made**: batch-by-batch summary
- **Verification**: type-check, tests, build results
- **Manual Follow-ups**: anything that couldn't be automated

## Constraints

- Always present the plan and get approval before making changes. Do not assume a Claude-style `EnterPlanMode` or clear-context accept flow exists.
- Process one package at a time in monorepos.
- Do not change behavior — migrations should be structural only.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/migrate-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
