# Ideas

## Quick wins (hours)

- **Add Codex equivalent for `/roadmap` skill** — The new `/roadmap` skill exists only in `claude/roadmap/` with no `codex/roadmap/` counterpart. Every other skill (27/28) has both. _Start with:_ `/plan-interview codex roadmap skill parity`

- **Consolidate duplicate deploy logic across ship variants** — `/ship`, `/ship-then-plan`, and `/ship-end` each inline the full deploy search+execute logic (spec.md → CLAUDE.md → Makefile → ...). Extract a shared deploy protocol reference or use `/deploy` internally to avoid drift. Signal: `ship.md:26-38`, `ship-then-plan.md:23-29`, `ship-end.md` all repeat the same search order. _Start with:_ `/plan-interview extracting shared deploy protocol across ship skills`

- **Add `--no-deploy` flag to `/ship-then-plan`** — `/ship` supports `--no-deploy` and `--no-plan`, but `/ship-then-plan` has no flag support at all. For this skills repo (and others with no deploy), the deploy step always triggers a "how do you deploy?" question. _Start with:_ `/plan-interview adding flag support to ship-then-plan`

## Medium efforts (days)

- **Skill dependency graph and validation** — Skills reference each other by name (e.g., `/roadmap` calls `/plan-phases`, `/ship` calls `/commit-and-push-by-feature`) but there's no validation that referenced skills exist or that the call chain is coherent. A `/lint-skills` skill could parse all SKILL.md files, build a dependency graph, detect broken references, circular dependencies, and inconsistent file format conventions. Signal: `roadmap/SKILL.md` references `/plan-phases`, `ship/SKILL.md` references `/commit-and-push-by-feature` — all implicit, never validated. _Start with:_ `/plan-interview skill dependency graph validation and lint tool`

- **Skill versioning and changelog** — When a skill's behavior changes (like the `/plan-phases` refactor to dual-mode), downstream users have no way to know. A lightweight versioning scheme (semver in frontmatter) plus a `CHANGELOG.md` per skill or a single `docs/skill-changelog.md` would help users of the skills library understand what changed. Signal: the recent `/plan-phases` Mode A/B refactor changed its contract but nothing tracks that. _Start with:_ `/plan-interview skill versioning and changelog system`

- **Session continuity automation** — The `/handoff` → fresh session → `/sync` → read `todo.md` loop is manual. A `/resume` skill could automate the cold-start: read `tasks/handoff.md` if present, read `tasks/todo.md`, read `CLAUDE.md`, show a status summary, and suggest next action (`/run-step`, `/run --phase`, etc.). Reduces the "what was I doing?" friction to a single command. Signal: `handoff/SKILL.md:80` says "a fresh session should be able to read only this file + todo.md + roadmap.md" — but nothing automates that read. _Start with:_ `/plan-interview session resume skill for cold-start automation`

- **Spec multi-section awareness** — `/plan-interview-ideas` appends multiple specs into a single `spec.md`, but nothing in the toolchain explicitly handles multi-section specs. `/roadmap` now reads "all sections" but other skills (e.g., `/expert-review` checking spec conformance) treat `spec.md` as monolithic. A convention for spec section headers (e.g., `## Spec: [feature-name]`) and per-section metadata would make cross-referencing reliable. Signal: `plan-interview-ideas/SKILL.md` appends to `spec.md`, `expert-review/SKILL.md:37` checks spec conformance without section awareness. _Start with:_ `/plan-interview spec.md multi-section format convention`

## Larger initiatives (weeks)

- **Skill testing framework** — No skills have tests. A framework that runs a skill against a fixture project (git repo snapshot) and asserts on outputs (files created, questions asked, plan mode entered) would catch regressions when skills are modified. Could use a `tests/` directory with fixture repos and expected outcomes per skill. Signal: 28 skills with complex interdependencies, no automated verification — the only quality gate is `/expert-review` run manually. _Start with:_ `/plan-interview testing framework for claude-skills`

- **Workflow orchestrator / meta-skill** — Users must manually chain skills (`/brainstorm` → pick idea → `/plan-interview` → `/roadmap` → `/plan-phases` → `/run`). A `/workflow` meta-skill could guide users through the full pipeline, tracking where they are and suggesting the next skill. For new users especially, the 28-skill surface area is overwhelming. Signal: `docs/skills-reference.md:32-38` shows the workflow diagram, but nothing enforces or guides it. _Start with:_ `/plan-interview workflow orchestrator meta-skill for guided pipeline execution`

- **Cross-tool portability layer** — Claude and Codex skills are maintained in parallel (`claude/` and `codex/`) with near-identical content. A shared format that generates tool-specific variants would eliminate the duplication. Could be a single `skills/<name>/skill.yaml` that compiles to both `claude/SKILL.md` and `codex/SKILL.md + agents/openai.yaml`. Signal: 27 skills duplicated across `claude/` and `codex/`, manual sync required. _Start with:_ `/plan-interview cross-tool skill portability and single-source generation`

---

## Testing-focused ideas (2026-03-27)

### Quick wins (hours)

- **Add vitest coverage reporting** — `kanban.test.mjs` has 24 tests but no coverage metrics. Add `vitest.config.mjs` with `coverage.provider: 'v8'` and `coverage.reporter: ['text', 'lcov']` to surface untested branches in `kanban.mjs`. Signal: `claude/poketo-kanban/scripts/package.json` has no coverage config; 702-line file with only integration tests. _Start with:_ `/plan-interview-kanban vitest coverage reporting for kanban.mjs`

- **Test bootstrap-session.mjs** — 110 lines of env parsing, SQLite reads, and session extraction with zero tests. Errors here silently break all kanban skills. Can test with a fixture SQLite DB or mock. Signal: `claude/poketo-kanban/scripts/bootstrap-session.mjs` — only non-SKILL.md code file without any test coverage. _Start with:_ `/plan-interview-kanban bootstrap-session.mjs unit tests`

### Medium efforts (days)

- **install.sh test suite with bats** — The 106-line bash installer has no tests. Edge cases (broken symlinks, permission errors, partial installs, --uninstall with mixed state) are verified only by manual runs. A bats-core suite using temp directories could catch regressions. Signal: `install.sh` creates/removes 83 symlinks across two directories — any bug affects all skill availability. _Start with:_ `/plan-interview-kanban install.sh test suite with bats-core`

- **Kanban edge case test expansion** — Current 24 tests cover happy paths but miss: concurrent card moves, cards with unicode/emoji names, very long descriptions, moving to same list, archiving already-archived cards, search with LIKE metacharacters (now escaped). Signal: Phase 5 fixed a LIKE injection bug and null dereference that existing tests didn't catch. _Start with:_ `/plan-interview-kanban kanban.mjs edge case and regression tests`

- **SKILL.md lint and frontmatter validation** — 84 SKILL.md files have frontmatter (`name`, `description`, `argument-hint`) but no validation. A script could verify: all required fields present, no broken skill cross-references, codex/claude parity, agents/openai.yaml exists for every codex skill. Signal: Phase 5 found a missing `agents/openai.yaml` only via manual `/expert-review`. _Start with:_ `/plan-interview-kanban skill frontmatter lint and validation script`
