# Ideas

## Quick wins (hours)

## Medium efforts (days)

- **Skill dependency graph and validation** — Skills reference each other by name (e.g., `/roadmap` calls `/plan-phase`, `/ship` calls `/commit-and-push-by-feature`) but there's no validation that referenced skills exist or that the call chain is coherent. `scripts/skill-deps.sh` exists for broken-dep checking but no graph visualization or circular-dependency detection. _Start with:_ `/feature-interview skill dependency graph validation and lint tool`

- **Session continuity automation** — The `/handoff` → fresh session → `/sync` → read `todo.md` loop is manual. A `/resume` skill could automate the cold-start: read `tasks/handoff.md` if present, read `tasks/todo.md`, read `CLAUDE.md`, show a status summary, and suggest next action. Reduces the "what was I doing?" friction to a single command. _Start with:_ `/feature-interview session resume skill for cold-start automation`

- **Kanban card labels** — Cards lack categorization beyond name/description. A tags or labels field would enable filtering by type (bug, feature, test, debt) and improve Board Overview reporting. _Start with:_ `/feature-interview card labels and tag-based filtering for kanban boards`

- **Kanban input validation layer** — `--progress` validates via `parseIntegerArg()` but `--due` accepts invalid date strings that silently become `Invalid Date`. No centralized validation layer exists. _Start with:_ `/feature-interview input validation layer for kanban CLI`

- **Kanban database error path tests** — All kanban tests are happy-path only. `returning()` results are unchecked, and real DB errors propagate as unhandled rejections. _Start with:_ `/feature-interview database error path testing for kanban`

## Larger initiatives (weeks)

- **Workflow orchestrator / meta-skill** — Users must manually chain skills (`/brainstorm` → `/feature-interview` → `/spec-interview` → `/roadmap` → `/plan-phase` → `/run`). A workflow-orchestrator skill could guide users through the full pipeline, tracking where they are and suggesting the next skill. _Start with:_ `/feature-interview workflow orchestrator meta-skill for guided pipeline execution`

- **Cross-tool portability layer** — Claude (57 skills) and Codex (54 skills) are maintained in parallel with near-identical content and manual sync. A shared format that generates tool-specific variants would eliminate the duplication. _Start with:_ `/feature-interview cross-tool skill portability and single-source generation`

---

## Removed ideas (addressed by shipped work)

> Cleaned 2026-05-15. These ideas were implemented during Phases 1-39 or became obsolete.

- ~~Consolidate duplicate deploy logic across ship variants~~ — `/ship` and `/ship-end` now invoke `/deploy` internally instead of inlining discovery+execution logic.

- ~~Redesign execution workflow for Codex~~ — Codex-native execution patterns documented in `docs/codex-workflow.md`; codex/run and codex/ship skills exist.
- ~~Add `--no-deploy` flag to `/ship-then-plan`~~ — `/ship-then-plan` no longer exists; `/ship` and `/ship-end` both support `--no-deploy`.
- ~~Skill versioning and changelog~~ — Versioning shipped: all 105+ skills have `version:` semver frontmatter, `scripts/skill-versions.sh` audits. Per-skill changelogs not added but git log serves.
- ~~Spec multi-section awareness~~ — Specs moved to individual files in `specs/`; monolithic `spec.md` pattern retired.
- ~~Skill testing framework~~ — `tests/` directory with layer1-4 structure, `frontmatter.test.ts`, benchmark harness, and custom skill setups.
- ~~Add vitest coverage reporting~~ — Coverage exists via layer1-4 test structure; kanban-specific coverage is low priority given project direction.
- ~~Test bootstrap-session.mjs~~ — Kanban scripts are stable; low priority.
- ~~install.sh test suite with bats~~ — `tests/layer1/install.test.ts` covers pack installation; `install.sh` itself is stable.
- ~~SKILL.md lint and frontmatter validation~~ — `frontmatter.test.ts` validates all 105+ SKILL.md files.
- ~~Add `--board` flag to kanban search~~ — Implemented: `cmdSearch()` accepts `--board` arguments.
- ~~Add Codex poketo-kanban skill~~ — Codex skeleton exists at `packs/poketowork-kanban/codex/poketo-kanban/`.
- ~~Unify env path lists~~ — `env-paths.mjs` consolidates path discovery; low priority remaining gap.
- ~~Dry-run mode for kanban skills~~ — Implemented: create-card, move-card, update-card, update-list, create-list all support `--dry-run`.
- ~~Skill discovery command~~ — `/skills` command exists in both claude and codex.
- ~~Kanban edge case test expansion~~ — Backslash escape fixed; `parseIntegerArg()` added. Remaining gaps folded into "input validation" and "error path" ideas above.
- ~~Fix search escape: backslash~~ — Fixed: `kanban.mjs` line 696 handles backslash, %, and _ escaping.
- ~~Test create-list command~~ — 5 test blocks exist in `kanban.test.mjs` covering create-list.

---

## 2026-08-09 — AFPS 2.0: faster alignment through executable evidence

### Quick wins (hours)

- **Define a risk-based decision boundary for AFPS 2.0** — Replace universal evidence, assumption, scope, destination, file-change, coverage, and routing approvals with a small taxonomy: infer and proceed for reversible choices; show a recommendation for costly architecture or taste choices; require explicit approval only for irreversible, external, paid, destructive, security-sensitive, or legally material actions. Current signal: `docs/alignment-page-convention.md` lists broad default gate types, while 138 of 183 active Codex pack skills carry alignment-page contracts. _Start with:_ `$feature-interview AFPS 2.0 decision-boundary taxonomy and stop conditions`

### Medium efforts (days)

- **Canary a lab-first AFPS loop on three skill archetypes** — Pilot one research skill, one visual-design skill, and `game-prototype-test` with a single flow: infer intent from prompt/repo, build the cheapest decision-relevant slices against one canonical fixture or real runtime, then present one briefing checkpoint with an agent recommendation and at most three unresolved decisions. Current signal: 3K Stars wraps its real deterministic simulation in focused stations, while Chromux holds product state constant across self-contained visual variants. _Start with:_ `$feature-interview lab-first AFPS canary across research design and gameplay skills`

### Larger initiatives (weeks)

- **Retire staged alignment/interrogation infrastructure in favor of checkpoint briefings** — After the canary proves lower question count and rework, migrate active skills away from dense alignment pages, interrogation rounds, compiled-YAML handoffs, duplicated briefing decks, and fixed long-form deck chains. Preserve archived pages as historical evidence, keep canonical research/spec/task outputs, and make briefing slides optional convergence/checkpoint surfaces rather than wrappers around dense pages. Current signal: the three core conventions plus their generators/auditors exceed 3,400 lines, were shaped by 80 commits, and currently require decks to preserve rather than replace dense artifacts. _Start with:_ `$feature-interview AFPS 2.0 staged migration and compatibility plan`
