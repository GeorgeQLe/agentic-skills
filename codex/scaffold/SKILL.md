---
name: scaffold
description: Generate a new package or app in the monorepo following the project's established conventions, using an existing package as the template.
---

# Scaffold

Use this skill when the user wants to create a new package or app in their monorepo.

## Workflow

1. Parse the type (package/app) and name from arguments.
2. Learn conventions from CLAUDE.md and monorepo config.
3. Find the most recently created package/app as a template.
4. Enter plan mode with the scaffold plan and wait for approval.
5. Generate files, adapting the template with the new name.
6. Run install and type-check to verify.

## Output Format

- **Scaffolded**: type, name, location
- **Files Created**: list of generated files
- **Next Steps**: what to do after scaffolding

## Constraints

- Always use an existing package as the reference template.
- Enter plan mode before creating files.
- Keep the scaffold minimal — no unnecessary boilerplate.
