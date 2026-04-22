# Code Quality Skill Pack Report

## Summary

The project-local `code-quality` pack ships behavior-preserving code health workflows. It currently includes two skills: `extract-shared-types` for targeted type extraction refactors, and `quality-sweep` for broader audit-and-cleanup campaigns across the codebase. Skill names describe the actual refactor clearly; skill descriptions carry discoverable trigger terms such as type hoisting, type barreling, shared type directory, type-only imports, barrel exports, dead code, circular dependencies, weak types, defensive error handling, and legacy paths.

The pack lives under the existing local pack layout:

```text
packs/code-quality/
├── PACK.md
├── claude/
│   ├── extract-shared-types/SKILL.md
│   └── quality-sweep/SKILL.md
└── codex/
    ├── extract-shared-types/
    │   ├── SKILL.md
    │   └── agents/openai.yaml
    └── quality-sweep/
        ├── SKILL.md
        └── agents/openai.yaml
```

## Naming Recommendation

- Pack name: `code-quality`
- Shipped skills: `extract-shared-types`, `quality-sweep`
- Display labels: `Extract Shared Types`, `Quality Sweep`
- Invocation examples: `/extract-shared-types` and `/quality-sweep` in Claude Code; `$extract-shared-types` and `$quality-sweep` in Codex.

`extract-shared-types` is preferable to `type-barrel` because a barrel is optional and should depend on local conventions. It is also preferable to `type-hoist` because it is clearer to a developer browsing available skills. `quality-sweep` names a multi-lane cleanup campaign rather than any single concern, which matches how the skill orchestrates duplication, type hygiene, dead code, dependency boundaries, error handling, legacy paths, and comment lanes under one workflow.

## Claude Code vs Codex Differences

Both tools use skill folders centered on `SKILL.md`, but their surrounding conventions differ.

Claude Code documents skills as Markdown folders installed in user or project skill directories, with invocation through slash commands such as `/skill-name`. Claude-specific skill metadata and behavior can include frontmatter fields for model invocation, context, agent selection, allowed tools, paths, and hooks. Source: [Claude Code Skills](https://code.claude.com/docs/en/skills).

OpenAI Codex documents skills as folders discovered from configured skill roots, invoked with `$skill-name` or through `/skills`. Codex skills use `SKILL.md` and may include `agents/openai.yaml` for product-facing metadata such as display name, short description, default prompt, and implicit invocation policy. Source: [OpenAI Codex Skills](https://developers.openai.com/codex/skills).

This repository adds a shared abstraction over both tools: project-local packs live under `packs/<pack>/{claude,codex}/<skill>/SKILL.md`, and `scripts/pack.sh` creates local symlinks into `.claude/skills` and `.codex/skills`. That means the implementation should keep mirrored Claude and Codex variants, with Codex UI metadata when the skill is meant to be discoverable in Codex.

## Skill Specifications

### `extract-shared-types`

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

### `quality-sweep`

`quality-sweep` orchestrates a behavior-preserving code quality cleanup campaign spanning multiple concerns. Invocation accepts a mode and an optional scope: `[audit|fix|full] [package | app | directory | domain]`. Mode defaults to `audit` when unspecified.

Audit lanes:

- **Duplication:** find duplicate or near-duplicate code where consolidation reduces coupling, maintenance cost, or complexity.
- **Shared types:** find type definitions that should move to a shared boundary; follow `extract-shared-types` rules for any implementation.
- **Unused code:** use code search and available tools such as `knip` to find unused exports, orphaned files, stale dependencies, and unreachable branches.
- **Circular dependencies:** use code search and available tools such as `madge` to identify dependency cycles and import-boundary issues.
- **Weak types:** find unsafe `any` and unjustified weak typing; preserve `unknown` at trust boundaries unless a stronger validated type exists.
- **Error handling:** audit `try`/`catch` and defensive patterns; preserve boundary handling, parsing, cleanup, rollback, external-service handling, and error translation.
- **Legacy paths:** find deprecated, migration, compatibility, fallback, and alternate code paths that may now be obsolete.
- **Comments and stubs:** remove or rewrite stale comments, in-motion notes, stubs, and comments that describe previous work instead of current behavior.

Required behavior:

- Establish a baseline (project instructions, manifests, configs, scripts, docs, specs, roadmap/todo/history) before proposing or making changes.
- Triage every finding into `Safe to Fix`, `Needs Investigation`, or `Do Not Change`. Re-read source before finalizing; drop findings that cannot be reconfirmed.
- Never edit files in `audit` mode. Only implement approved safe cleanup in `fix` or `full`.
- Batch edits by lane or subsystem and re-run the narrowest relevant validation after each batch.
- Use subagents for audit-first lanes only when the user explicitly requests them or when mode is `full` and the environment permits. The main agent always owns final triage, integration, edits, and verification.
- Report out with sections for Summary, Safe to Fix, Implemented (fix/full only), Needs Investigation, Do Not Change, and Verification.

Non-goals:

- No behavior changes.
- No public API, package export, migration, or data-compatibility changes.
- No replacement of `unknown` with weaker or speculative types.
- No removal of error handling that defines a clear boundary, adds actionable context, performs cleanup, or preserves system integrity.
- No adoption of new cleanup tools without explicit user approval; prefer repository-native tooling.
- No blanket DRY enforcement; consolidate only when it reduces real maintenance burden without hiding distinct reasons to change.

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
- Keep the skills instruction-only. Type extraction is too dependent on language, module boundaries, TS config, and package export maps to script safely; cleanup sweeps are too dependent on project conventions, architecture intent, and repository-native tooling to encode as a single command.
- Add Codex `agents/openai.yaml` for each skill because both are execution-oriented and should be discoverable in Codex skill lists.

## Acceptance Criteria

- `scripts/pack.sh list` includes `code-quality`.
- `scripts/pack.sh install code-quality` links `.claude/skills/extract-shared-types`, `.claude/skills/quality-sweep`, `.codex/skills/extract-shared-types`, and `.codex/skills/quality-sweep` in a temporary project.
- `scripts/pack.sh install quality` installs the same pack through alias normalization.
- `./scripts/skill-deps.sh --broken` reports no broken skill dependencies.
- `./scripts/skill-versions.sh --missing` reports no missing versions for the pack's skill files.
