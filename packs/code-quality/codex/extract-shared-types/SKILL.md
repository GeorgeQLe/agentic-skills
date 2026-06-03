---
name: extract-shared-types
description: Extract shared type definitions into a dedicated types directory without runtime behavior changes
type: execution
version: v0.1
argument-hint: "[optional: package, app, directory, or domain to refactor]"
---

# Extract Shared Types

Invoke as `$extract-shared-types`.

Use this skill for type hoisting, type barreling, shared `types/` directories, import honesty, and circular-dependency prevention when the requested change is explicitly structural and behavior-preserving.

## Process

1. **Establish scope.**
   - Read `$ARGUMENTS` for a package, app, directory, or domain.
   - If no scope is provided, inspect the repo and choose the smallest coherent area with shared exported types.
   - Read project instructions, package manifests, TypeScript config, path aliases, lint rules, package export maps, and existing `types/` or barrel conventions.

2. **Classify declarations before editing.**
   - Candidate moves: exported `type` aliases, `interface` declarations, ambient declarations, generic helper shapes, DTO/result shapes, props/state shapes, and domain data shapes.
   - Do not move runtime values: functions, constants, classes, runtime enums, schemas, validators, database/API clients, React components, business logic, or anything imported as a value.
   - Treat TypeScript `enum` as runtime unless the project already uses `const enum` safely and the compiler settings make the move clearly type-only.

3. **Design the target type layout.**
   - Create or reuse a dedicated `types/` directory at the nearest appropriate boundary.
   - Organize files by domain, feature, or package convention rather than by source file name when a domain boundary is clear.
   - Prefer direct imports from domain type files. Add `types/index.ts` only if the project already uses barrels or repeated type imports would otherwise become noisy.

4. **Move type declarations.**
   - Move only the approved type declarations.
   - Preserve exported names, generic parameters, comments that explain shape semantics, and public visibility.
   - Keep runtime implementation files focused on runtime logic, importing moved declarations with `import type` where supported.

5. **Update imports and compatibility.**
   - Update internal imports to the new type files.
   - Use `import type` for type-only imports and avoid creating new value imports from `types/`.
   - If old import paths are part of a public API or package boundary, leave type-only re-exports from the original module rather than forcing a breaking migration.
   - Avoid widening public barrels unless the repo already exposes that type surface intentionally.

6. **Verify behavior preservation.**
   - Run the narrowest relevant typecheck, tests, lint/import checks, and dependency-cycle checks available.
   - Inspect the diff for runtime changes: implementation logic, emitted values, schema definitions, package exports, route behavior, and component behavior should not change.
   - If verification fails, fix import/type issues without changing runtime behavior.

## Output

When reporting completion, include:

- Scope refactored.
- Type files created or reused.
- Compatibility re-exports left in place, if any.
- Verification commands run and their results.
- Any skipped candidates with the reason they were runtime-coupled or public-API-sensitive.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/extract-shared-types-{topic}.html`.

## Constraints

- Zero runtime behavior changes.
- Do not move declarations unless they are type-only.
- Do not introduce dependency upgrades, schema redesigns, or broad module restructuring.
- Do not remove public import paths unless the user explicitly requests a breaking change.
- Preserve unrelated user changes in the working tree.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

