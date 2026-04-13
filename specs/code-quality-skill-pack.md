# Code Quality Skill Pack Report

## Summary

Create a project-local `code-quality` pack for behavior-preserving code health workflows. The first skill should be named `extract-shared-types` because the name describes the actual refactor clearly, while the skill description can still include discoverable trigger terms such as type hoisting, type barreling, shared type directory, type-only imports, and barrel exports.

The pack should live under the existing local pack layout:

```text
packs/code-quality/
├── PACK.md
├── claude/extract-shared-types/SKILL.md
└── codex/extract-shared-types/
    ├── SKILL.md
    └── agents/openai.yaml
```

## Naming Recommendation

- Pack name: `code-quality`
- First skill name: `extract-shared-types`
- Display label: `Extract Shared Types`
- Invocation examples: `/extract-shared-types` in Claude Code and `$extract-shared-types` in Codex.

`extract-shared-types` is preferable to `type-barrel` because a barrel is optional and should depend on local conventions. It is also preferable to `type-hoist` because it is clearer to a developer browsing available skills.

## Claude Code vs Codex Differences

Both tools use skill folders centered on `SKILL.md`, but their surrounding conventions differ.

Claude Code documents skills as Markdown folders installed in user or project skill directories, with invocation through slash commands such as `/skill-name`. Claude-specific skill metadata and behavior can include frontmatter fields for model invocation, context, agent selection, allowed tools, paths, and hooks. Source: [Claude Code Skills](https://code.claude.com/docs/en/skills).

OpenAI Codex documents skills as folders discovered from configured skill roots, invoked with `$skill-name` or through `/skills`. Codex skills use `SKILL.md` and may include `agents/openai.yaml` for product-facing metadata such as display name, short description, default prompt, and implicit invocation policy. Source: [OpenAI Codex Skills](https://developers.openai.com/codex/skills).

This repository adds a shared abstraction over both tools: project-local packs live under `packs/<pack>/{claude,codex}/<skill>/SKILL.md`, and `scripts/pack.sh` creates local symlinks into `.claude/skills` and `.codex/skills`. That means the implementation should keep mirrored Claude and Codex variants, with Codex UI metadata when the skill is meant to be discoverable in Codex.

## First Skill Specification

`extract-shared-types` should guide structural refactors that move shared type/interface declarations into a dedicated, domain-organized `types/` directory without runtime behavior changes.

Required behavior:

- Inspect the repo's language, module system, path aliases, lint rules, existing type organization, package boundaries, and public API surfaces before editing.
- Move only type declarations: TypeScript `type` aliases, `interface` declarations, ambient declarations, and type-only helper shapes.
- Do not move runtime values, functions, constants, classes, runtime enums, schemas, validators, React components, database clients, API clients, or business logic.
- Update imports to use `import type` where supported by the project.
- Prefer direct imports from domain type files. Add a barrel only when the codebase already uses barrels or when repeated type imports would otherwise become noisy.
- Preserve public import compatibility with re-exports from the original modules when downstream consumers may depend on the old import path.
- Verify with typecheck, tests, dependency-cycle checks if present, and a runtime diff sanity check where feasible.

Non-goals:

- No runtime behavior changes.
- No schema redesign.
- No broad module reorganization.
- No dependency upgrades.
- No public API changes unless the user explicitly requests a breaking migration.

## Recommended Future Skills

- `type-only-imports`: convert value imports used only as types into `import type` and audit import honesty.
- `barrel-audit`: review barrel files for hidden runtime imports, accidental public API expansion, and circular dependency risk.
- `dependency-boundary-audit`: identify cross-layer imports that violate package, app, domain, or architecture boundaries.
- `circular-import-audit`: detect import cycles and prioritize type extraction before runtime refactors.
- `schema-type-separation`: separate runtime schemas or validators from inferred/exported type surfaces without changing validation behavior.
- `public-api-surface-audit`: review exported symbols and barrels for accidental public API exposure.
- `dead-export-prune`: remove unused exported types/functions after confirming they are not package API.
- `module-slim`: split large mixed-purpose modules into runtime logic, adapters, and type declarations with behavior-preserving checks.

## Implementation Notes

- Make `code-quality` a standalone pack that can be installed alongside domain packs. It is not a replacement for `business-app`, `game`, or `devtool`.
- Add aliases in `scripts/pack.sh` so `quality`, `codequality`, and `code_quality` normalize to `code-quality`.
- Keep the skill instruction-only for the first version. Type extraction is too dependent on language, module boundaries, TS config, and package export maps to script safely at v1.
- Add Codex `agents/openai.yaml` because the skill is execution-oriented and should be discoverable in Codex skill lists.

## Acceptance Criteria

- `scripts/pack.sh list` includes `code-quality`.
- `scripts/pack.sh install code-quality` links both `.claude/skills/extract-shared-types` and `.codex/skills/extract-shared-types` in a temporary project.
- `scripts/pack.sh install quality` installs the same pack through alias normalization.
- `./scripts/skill-deps.sh --broken` reports no broken skill dependencies.
- `./scripts/skill-versions.sh --missing` reports no missing versions for the new skill files.
