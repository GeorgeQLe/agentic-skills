---
name: scaffold
description: Generate a new package or app in the monorepo following established project conventions
---

# Scaffold

Use this skill when the user wants to create a new package or app in their monorepo.

## Workflow

1. Parse the type (package/app) and name from arguments.
2. Learn conventions from CLAUDE.md and monorepo config.
3. Find the most recently created package/app as a template.
4. Present the scaffold plan and wait for approval. Use `update_plan` to track the work; use `request_user_input` only if the session is already in Plan mode and a structured choice would help.
5. Generate files, adapting the template with the new name.
6. Run install and type-check to verify.

## Output Format

- **Scaffolded**: type, name, location
- **Files Created**: list of generated files
- **Next Steps**: what to do after scaffolding

## Constraints

- Always use an existing package as the reference template.
- Present the plan and get approval before creating files. Do not assume a Claude-style `EnterPlanMode` or clear-context accept flow exists.
- Keep the scaffold minimal — no unnecessary boilerplate.
