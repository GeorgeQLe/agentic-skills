---
name: decommission
description: Systematically tear down a service, package, or infrastructure component by auditing dependencies, planning removal, and verifying nothing breaks.
---

# Decommission

Use this skill when the user wants to remove a service, package, module, or infrastructure component from the project.

## Workflow

1. Identify the target to decommission.
2. Audit all references: imports, configs, infrastructure, documentation.
3. Categorize as active dependencies, dead references, or infrastructure.
4. Enter plan mode with removal plan and wait for approval.
5. Execute removal: migrate consumers, delete target, clean up references.
6. Verify: tests, build, grep for remaining references.

## Output Format

- **Dependencies Resolved**: consumers migrated or updated
- **Infrastructure Cleanup**: automated vs. manual required
- **Verification**: tests, build, remaining references

## Constraints

- Always audit dependencies before removing anything.
- Never delete cloud resources automatically — only IaC definitions.
- Enter plan mode and get approval before making changes.
