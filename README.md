# Agentic Skills

A shared skill library for Claude Code and OpenAI Codex.

The library now uses a two-layer model:

- **Global core skills** are domain-neutral and safe to expose in every project.
- **Project-local packs** hold domain-specific workflows such as business apps, video games, and developer tools.

This keeps game research out of B2B SaaS sessions, and keeps business-product assumptions out of game and devtool projects.

## Installation

```bash
./install.sh
```

`install.sh` installs only:

- `global/claude/*` → `~/.claude/skills/*`
- `global/codex/*` → `~/.codex/skills/*`

It does **not** install `packs/*` globally.

To remove repo-managed global links:

```bash
./install.sh --uninstall
```

## Project Packs

Project packs are enabled per repository.

```bash
scripts/pack.sh list
scripts/pack.sh recommend
scripts/pack.sh install business-app
scripts/pack.sh install game
scripts/pack.sh install devtool
scripts/pack.sh install creator-media
scripts/pack.sh install code-quality
scripts/pack.sh install business-app-kanban
scripts/pack.sh status
scripts/pack.sh remove game
```

`scripts/pack.sh list-packs` is an internal subcommand used by Codex `$run` routing (see `global/codex/run/SKILL.md`). It prints enabled packs from `.agents/project.json` one per line with no decoration, distinct from the human-facing `list` above; prefer `list` or `status` for interactive use.

Claude users can run `/pack` with no arguments, and Codex users can run `$pack` with no arguments. If `.agents/project.json` exists, the skill refreshes local links from that committed project designation. If it is missing, the assistant inspects the repository, recommends a pack, and asks before installing.

`scripts/pack.sh refresh` recreates local symlinks; it does not reload an already-running Claude Code or Codex session. After installing, removing, or refreshing packs, start a fresh CLI session if the changed skills are not visible.

Pack installation creates local symlinks in the current project:

```text
.claude/skills/<skill> -> <this repo>/packs/<pack>/claude/<skill>
.codex/skills/<skill> -> <this repo>/packs/<pack>/codex/<skill>
```

It also writes:

```json
{
  "project_type": "game",
  "enabled_packs": ["game"],
  "skill_pack_version": 1
}
```

to `.agents/project.json`.

`.agents/project.json` also accepts an optional `agent_mode` field (`"claude-only" | "codex-only" | "hybrid"`) that names the Phase 11 operating mode for the project. Set or clear it with `scripts/pack.sh set-mode <claude-only|codex-only|hybrid|unset>`; the value is preserved across `install`, `remove`, and `refresh`. `SKILLS_AGENT_MODE` overrides the file for the current shell, and `scripts/agent-mode.sh` resolves the effective mode (env > project.json > empty). See `docs/operating-modes.md`.

If an assistant does not discover project-local skills, use the global `pack` or `research-roadmap` skill as the launcher. The pack files still stay project-local.

## Repository Structure

```text
agentic-skills/
├── global/
│   ├── claude/<name>/SKILL.md
│   └── codex/<name>/SKILL.md
├── packs/
│   ├── business-app/{claude,codex}/<name>/SKILL.md
│   ├── code-quality/{claude,codex}/<name>/SKILL.md
│   ├── game/{claude,codex}/<name>/SKILL.md
│   ├── devtool/{claude,codex}/<name>/SKILL.md
│   ├── creator-media/{claude,codex}/<name>/SKILL.md
│   └── *-kanban/{claude,codex}/<name>/SKILL.md
├── scripts/
│   ├── pack.sh
│   ├── skill-deps.sh
│   └── skill-versions.sh
├── install.sh
└── docs/
```

## Global Core

Global skills should stay domain-neutral:

```text
affected, analyze-sessions, bootstrap-repo, brainstorm, branch-lifecycle,
clone-spec-store, commit-and-push-by-feature, concept-exploration, create-skill, dead-code, debug, decommission, deploy, dogfood,
expert-review, guide, handoff, hygiene, provision-agentic-config,
investigate, migrate, pack, patch-exec-profile, spec-interview, ui-interview,
ux-variation, plan-phase, project-fleet,
reconcile-dev-docs, regression-check, release, roadmap, run, scaffold,
ship, ship-end, skills, slim-audit, spec-drift, sync,
trace, research-roadmap, uat
```

### Claude-only global skills

One global skill ships only under `global/claude/` and has no Codex mirror:

```text
delegate
```

`/delegate` is the synchronous, in-session sibling of `/handoff --target=codex`: it drafts and approves a packet via `scripts/approved-plan.sh`, then invokes `codex exec "<target-skill> --execute-approved"` live from Claude. It is `hybrid`-only by design. Codex users should not expect a `$delegate` — drive hybrid delegation from the Claude side, or use `/handoff --target=codex` for the async variant. See `global/claude/delegate/SKILL.md` and `docs/operating-modes.md`.

## Packs

### Business App

For SaaS, marketplaces, productivity tools, business applications, and enterprise workflows.

Includes the former product-research lane:

```text
icp, enterprise-icp, competitive-analysis, customer-feedback,
value-prop-canvas, lean-canvas, hook-model, growth-model, pmf-assessment,
journey-map, metrics, gtm, monetization, positioning, landing-copy,
mvp-gap, scale-audit, assumption-tracker, experiment, cohort-review,
retro, risk-register, burn-rate, runway-model, investor-update,
platform-strategy, reconcile-research
```

Default user-facing planning flow (18-step):

```text
concept-exploration -> icp -> competitive-analysis -> value-prop-canvas -> positioning
-> lean-canvas -> journey-map -> hook-model -> metrics -> monetization -> gtm
-> growth-model -> spec-interview -> ux-variation -> ui-interview -> roadmap -> run
-> pmf-assessment (post-launch)
```

### Game

For video games and playable entertainment projects.

```text
game-workflow, game-audience, game-fantasy, game-genre-map,
game-comparables, game-core-loop, game-prototype-test,
game-store-page-test, game-playtest-metrics, game-roadmap, game-launch
```

The game workflow validates desire, fantasy, core loops, replayability, store-page pull, and launch channels.

### Devtool

For developer-facing tools, libraries, SDKs, CLIs, APIs, and infrastructure products.

```text
devtool-workflow, devtool-user-map, devtool-integration-map,
devtool-dx-journey, devtool-adoption, devtool-positioning,
devtool-monetization, devtool-docs-audit
```

The devtool workflow validates developer adoption, integration fit, documentation clarity, trust, and team conversion.

### Creator Media

For YouTube channels, non-YouTube creator platforms, founder-led media, product-led content, creator portfolios, and recurring shows.

```text
creator-platform-capability-matrix, creator-evidence-schema,
creator-presence-dossier, youtube-channel-audit, youtube-video-audit,
youtube-title-thumbnail-audit, youtube-portfolio, youtube-peer-benchmark, youtube-search-positioning,
youtube-cadence-diagnosis, creator-positioning, content-programming,
series-spec, product-led-media-map, creator-metrics-review
```

The creator-media workflow validates platform evidence sources, normalized evidence records, creator presence, channel evidence, single-video performance, packaging, portfolio shape, peer benchmarks, search opportunities, publishing cadence, positioning, programming, repeatable series, product-media fit, and recurring metrics. YouTube-specific work may start at `youtube-channel-audit` for channel-level patterns or `youtube-video-audit` for one video's performance, release timing, packaging, comments, transcript/content, and optional owner analytics; creator/persona research may start at `creator-presence-dossier`, which feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`; non-YouTube or mixed-platform work starts with `creator-platform-capability-matrix` and `creator-evidence-schema`. Target use cases include `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA`.

### Code Quality

For behavior-preserving refactors, type hygiene, import honesty, dependency-boundary cleanup, and module organization.

```text
extract-shared-types, quality-sweep
```

`extract-shared-types` moves shared type definitions into dedicated `types/` files without runtime behavior changes. `quality-sweep` orchestrates a behavior-preserving cleanup campaign across duplication, type hygiene, dead code, dependency boundaries, defensive error handling, legacy paths, and comments — audit-only by default, with optional `fix` or `full` modes.

### Kanban Variants

Kanban workflow variants are explicit opt-ins for PoketoWork users. Base packs never install them automatically.

```bash
scripts/pack.sh install business-app-kanban
scripts/pack.sh install game-kanban
scripts/pack.sh install devtool-kanban
```

These packs add:

```text
brainstorm-kanban, spec-interview-kanban, roadmap-kanban,
run-kanban, ship-kanban, ship-end-kanban
```

The generic `poketowork-kanban` pack contains board-management utilities such as `poketo-kanban` and `sync-roadmap-kanban`.

## Moved Skills

Former global business/product skills now live only in the `business-app` project pack. To get those skills back in a project, install the pack from that project:

```bash
scripts/pack.sh install business-app
```

Claude users can also invoke `/pack install business-app`; Codex users can invoke `$pack install business-app`. The pack creates project-local `.claude/skills/*` and `.codex/skills/*` links without adding domain skills back to the global assistant context.

## Validation

```bash
./scripts/skill-deps.sh --broken
./scripts/skill-versions.sh --missing
cd packs/poketowork-kanban/claude/poketo-kanban/scripts && npm test
```

`skill-deps.sh` and `skill-versions.sh` scan `global/` and `packs/`.
