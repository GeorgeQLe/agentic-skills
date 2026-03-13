---
description: Generate a new package or app in the monorepo following established project conventions
argument-hint: <type> <name> (e.g. "package utils" or "app admin-dashboard")
---

# Scaffold

Generate a new package or app in the monorepo that follows the project's established conventions and patterns.

## Process

1. **Parse the input** from `$ARGUMENTS`:
   - Extract the type (`package` or `app`) and the name.
   - If not provided or unclear, ask the user.

2. **Learn the project's conventions:**
   - Read `CLAUDE.md` for project structure and conventions.
   - Read the monorepo config (`turbo.json`, `pnpm-workspace.yaml`, or equivalent).
   - Identify the directory pattern:
     - Where do packages live? (`packages/`, `libs/`, etc.)
     - Where do apps live? (`apps/`, `services/`, etc.)

3. **Find a reference to copy from:**
   - List existing packages/apps of the same type.
   - Read the most recently created one (by git log) as the template.
   - Identify the standard files:
     - `package.json` (scripts, dependencies, exports)
     - `tsconfig.json` (extends pattern)
     - Source structure (`src/`, `index.ts`, etc.)
     - Test setup (if present)
     - Any other config files (`.eslintrc`, `tailwind.config.*`, etc.)

4. **Enter plan mode:**
   - Enter plan mode using EnterPlanMode.
   - Present the scaffold plan:
     - Directory: where it will be created
     - Files to generate (with brief content description)
     - Dependencies to include
     - Reference package used as template
   - Wait for user approval.

5. **Generate the scaffold after approval:**
   - Exit plan mode.
   - Create the directory structure.
   - Generate each file, adapting the template:
     - Update `name` in `package.json` to match the new package name.
     - Update paths and references.
     - Create minimal placeholder source files (`src/index.ts` with a basic export).
     - Include the standard test setup if the project uses tests.
   - Run `pnpm install` (or equivalent) to link the new package.
   - Run type-checking to verify the scaffold compiles.

## Output Format

### Scaffolded
- **Type**: package/app
- **Name**: `@scope/name`
- **Location**: `packages/name/`

### Files Created
- `packages/name/package.json`
- `packages/name/tsconfig.json`
- `packages/name/src/index.ts`
- ...

### Next Steps
- What the user should do next (add dependencies, implement features, wire up routes, etc.)

## Constraints
- Always use an existing package/app as the reference template — do not invent conventions.
- Always enter plan mode before creating files.
- Do not add unnecessary boilerplate — keep the scaffold minimal and consistent with existing packages.
- If the project does not appear to be a monorepo, inform the user and ask how to proceed.
- Do not install external dependencies beyond what the template uses.
