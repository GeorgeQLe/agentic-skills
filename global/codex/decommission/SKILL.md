---
name: decommission
description: Systematically tear down and remove a service, package, or infrastructure component
version: 1.0.0
---

# Decommission

Use this skill when the user wants to remove a service, package, module, or infrastructure component from the project.

## Workflow

1. Identify the target to decommission.
2. Audit all references: imports, configs, infrastructure, documentation.
3. Categorize as active dependencies, dead references, or infrastructure.
4. Present the removal plan and wait for approval. Use `update_plan` to track the work; use `request_user_input` only if the session is already in Plan mode and a structured choice would help.
5. Execute removal: migrate consumers, delete target, clean up references.
6. Verify: tests, build, grep for remaining references.

## Output Format

- **Dependencies Resolved**: consumers migrated or updated
- **Infrastructure Cleanup**: automated vs. manual required
- **Verification**: tests, build, remaining references

## Constraints

- Always audit dependencies before removing anything.
- Never delete cloud resources automatically — only IaC definitions.
- Present the plan and get approval before making changes. Do not assume a Claude-style `EnterPlanMode` or clear-context accept flow exists.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
