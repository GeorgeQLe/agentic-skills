# gSkillPacks

A shared skill library for Claude Code and OpenAI Codex.

The library now uses a two-layer model:

- **Base skills** are domain-neutral and safe to expose in every project.
- **Project-local packs** hold domain-specific workflows such as business apps, video games, and developer tools.

This keeps game research out of B2B SaaS sessions, and keeps business-product assumptions out of game and devtool projects.

## Prerequisites

- **Node.js 18+** for the `gskp` npm CLI and package build.
- **bash** shell (macOS, Linux, or WSL on Windows) for `scripts/pack.sh` and the remaining shell-backed `gskp` commands.
- **jq** for git-checkout `scripts/pack.sh` write commands and `gskp install-deck` materialization: `brew install jq` (macOS) or `apt install jq` (Debian/Ubuntu). Node-owned `gskp` project commands do not require `jq`.
- **Claude Code** or **OpenAI Codex** installed on your machine
- **pnpm** (optional, for running tests): `npm install -g pnpm`

For a guided first-use walkthrough, see [`docs/QUICKSTART.md`](docs/QUICKSTART.md).

## Install Paths

### Source checkout

The source-checkout path is available today and remains supported:

```bash
git clone <this-repo-url> ~/agentic-skills
cd ~/my-project
npx skillpacks init
```

Base skills install **project-local** into the current repository (`.claude/skills/`, `.codex/skills/`). Project-local packs are installed from the checkout:

```bash
cd ~/my-project
~/agentic-skills/scripts/pack.sh install devtool
~/agentic-skills/scripts/pack.sh install game
~/agentic-skills/scripts/pack.sh status
```

**Maintainer dev-setup note.** To run the local `npx skillpacks` / `npx gskp` CLI from *inside* this monorepo checkout, run `pnpm install` once at the repo root first (this is a pnpm workspace — do **not** use `npm install`, which fails on the pnpm-managed `apps/skills-showcase`). The root `package.json` declares `skillpacks` as a `workspace:*` devDependency, so `pnpm install` links both the `skillpacks` and `gskp` bins into `node_modules/.bin`, pointing at the local `packages/skillpacks/bin/skillpacks.mjs`. Without it, the root `node_modules/.bin/` has no shims and `npx skillpacks` reports `gskp: not found`. The pure-bash `scripts/pack.sh <cmd>` route bypasses Node/pnpm entirely and needs no install — use it as the no-install fallback. (End users never hit any of this; they run `npx skillpacks` from their own project against the published package.)

### npm CLI

With the published npm package, users can install from the current project directory without cloning this repository:

```bash
cd ~/my-project
npx skillpacks init
npx skillpacks install devtool
npx skillpacks install code-quality
npx skillpacks install-deck game-afps
npx skillpacks refresh
npx skillpacks status
```

`npx skillpacks init` installs the base skills for the current repository as project-local roots. `npx skillpacks install <pack-or-skill>` adds domain packs or individual pack skills. Both write project-local files: `.agents/project.json`, `.claude/skills/*`, and `.codex/skills/*`. Package semver such as `skillpacks@0.1.0` selects the bundled skill snapshot; `npx skillpacks refresh` recreates enabled base skills and packs from that snapshot. Individual skill pins still use each skill's `version:` value through `skillpacks pin <skill> <version>` or `gskp pin <skill> <version>`.

The same release is also published as the scoped alias package `@glexcorp/gskp`, so `npx @glexcorp/gskp init` is equivalent to `npx skillpacks init` at the same version. Both packages install both `gskp` and `skillpacks` binaries for global or local `npm exec --package skillpacks ...` or `npm exec --package @glexcorp/gskp ...` usage. Do not use `npx skillpack ...` singular; that is an unrelated npm package with a different project format.

**Maintainer release note.** Publish with [`docs/release-runbook.md`](docs/release-runbook.md) and `./publish.sh`, not manual one-package `npm publish`. Each release must keep `skillpacks` and `@glexcorp/gskp` at the same version; if the scoped alias fails after `skillpacks` publishes, fix npm auth/access and rerun `./publish.sh --current`.

See [`CHANGELOG.md`](CHANGELOG.md) for public package-level release notes across npm versions. Skill-specific changes remain in each skill's local `CHANGELOG.md`.

## Initialization

```bash
cd ~/my-project
npx skillpacks init
```

`npx skillpacks init` initializes base skills **project-local** for the current repository:

- `base/claude/*` -> `<project>/.claude/skills/*`
- `base/codex/*` -> `<project>/.codex/skills/*`

It records `base_skills: true` in `.agents/project.json`, so later `npx skillpacks refresh` updates them from the package version being run. It does **not** install `packs/*` — domain packs are never installed as base skills.

There is no user-home (global) base install. To clean up legacy repo-managed base installs left in `~/.claude/skills` and `~/.codex/skills` by the retired init path:

```bash
npx skillpacks uninstall-global
```

Add `--dry-run` to preview legacy global cleanup without removing anything.

## Project Packs

Project packs are enabled per repository.

```bash
npx skillpacks list
npx skillpacks recommend
npx skillpacks install business-research
npx skillpacks install business-growth
npx skillpacks install business-ops
npx skillpacks install game
npx skillpacks install devtool
npx skillpacks install creator-foundation
npx skillpacks install youtube-ops
npx skillpacks install code-quality
npx skillpacks install agentic-skills-bench
npx skillpacks install monorepo
npx skillpacks install remotion
npx skillpacks install project-fleet
npx skillpacks install alignment-loop
npx skillpacks install design-system
npx skillpacks which design-system
npx skillpacks status
npx skillpacks remove game
npx skillpacks remove design-system
```

`npx skillpacks install <name>` accepts either a pack name or a skill name from any pack. Pack names install every skill in the pack. Skill names install only that one project-local skill and record it under `.agents/project.json` `enabled_skills`.

For source-checkout development, `scripts/pack.sh install <pack-or-skill>` remains supported from a local clone. The npm CLI also supports `npx skillpacks refresh`, `npx skillpacks doctor`, `npx skillpacks doctor --fix`, `npx skillpacks doctor --fix --agent-docs --dry-run`, and deck installation from manifest metadata including `npx skillpacks install-deck vard`, `npx skillpacks install-deck ord`, `npx skillpacks install-deck business-afps`, `npx skillpacks install-deck devtool-afps`, and `npx skillpacks install-deck game-afps`.

Alignment page commands for target repositories are consumer-safe npm wrappers:

```bash
npx skillpacks alignment pages audit
npx skillpacks alignment pages serve --port 8907
npx skillpacks alignment pages open alignment/example.html --browser auto
npx skillpacks alignment pages inject-tts --force alignment/example.html
```

Source/package maintenance commands require a checkout with `docs/`, `base/`, and `packs/`:

```bash
npx skillpacks alignment bundles --check
npx skillpacks alignment verify
```

Use direct `node scripts/upgrade-alignment-page.mjs`, `node scripts/audit-alignment-pages.mjs`, `node scripts/serve-alignment.mjs`, `node scripts/open-html-page.mjs`, and `node scripts/inject-tts.mjs` commands from a source checkout. Use `npx skillpacks alignment pages ...` from npm-installed target repos. One-off `npx skillpacks ...` works when the network is available or the npm cache is warm; target repos that need reliable repeat or offline alignment workflows should add `skillpacks` as a devDependency or run a pinned command such as `npx skillpacks@<version> alignment pages audit`.

`scripts/pack.sh list-packs` is an internal subcommand used by Codex `$exec` routing (see `base/codex/exec/SKILL.md`). It prints enabled packs from `.agents/project.json` one per line with no decoration, distinct from the human-facing `list` above; prefer `list` or `status` for interactive use.

Claude users can run `/pack` with no arguments, and Codex users can run `$pack` with no arguments. If `.agents/project.json` exists, the skill refreshes local skill roots from that committed project designation. If it is missing, the assistant inspects the repository, recommends a pack, and asks before installing.

`npx skillpacks which <skill>` shows which pack provides a skill and whether it is installed. `npx skillpacks refresh` recreates local skill roots; it does not by itself force an active CLI skill registry to reload. Claude Code watches existing `.claude/skills` roots and supports `/reload-skills`; `/clear` starts a new empty-context conversation and can also pick up refreshed skills. Restart Claude Code if `.claude/skills` did not exist when the session started or the skill is still invisible. In Codex, start a fresh Codex CLI session if the `$` skill list stays stale.

Pack installation creates local repo-managed skill roots in the current project. Active installs expose the canonical `SKILL.md` and exclude `archive/`:

```text
.claude/skills/<skill>/SKILL.md
.codex/skills/<skill>/SKILL.md
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

For mixed monorepos, keep `project_type` as the default designation, set `enabled_packs` to the union of local packs needed by the repo, and add scoped routing:

```json
{
  "project_type": "devtool",
  "enabled_packs": ["devtool", "business-research", "business-growth"],
  "skill_pack_version": 1,
  "project_scopes": [
    {
      "path": "apps/pitwall-local",
      "project_type": "devtool",
      "packs": ["devtool"],
      "purpose": "Pitwall Local / OSS developer utility work."
    },
    {
      "path": "apps/pitwall-calcllm",
      "project_type": "business-app",
      "packs": ["business-research", "business-growth"],
      "purpose": "CalcLLM-powered connected edition research, GTM, monetization, and SaaS product work."
    }
  ]
}
```

Git-checkout `scripts/pack.sh` commands preserve existing `project_scopes`, `notes`, `skill_updates`, and `alignment` fields when `jq` is available. The npm `gskp` Node-owned commands preserve `project_scopes`, `notes`, `pinned_versions`, `enabled_skills`, `skill_updates`, `alignment`, and `agent_mode` without requiring `jq`.

Pack commands also write `.agents/.pack.lock` owner metadata and automatically remove stale locks whose recorded process is no longer running.

`.agents/project.json` also accepts an optional `agent_mode` field (`"claude-only" | "codex-only" | "hybrid"`) that names the Phase 11 operating mode for the project. Set or clear it with `scripts/pack.sh set-mode <claude-only|codex-only|hybrid|unset>`; the value is preserved across `install`, `remove`, and `refresh`. `SKILLS_AGENT_MODE` overrides the file for the current shell, and `scripts/agent-mode.sh` resolves the effective mode (env > project.json > empty). See `docs/operating-modes.md`.

Alignment-producing skills can opt into Build-In-Public review by passing `--bip` or by setting the project default with `scripts/pack.sh set-bip <on|off|unset>` or `npx skillpacks set-bip <on|off|unset>`.

If an assistant does not discover project-local skills, use the base `pack` or `research-roadmap` skill as the launcher. The pack files still stay project-local.

For workflow ordering, lead-in recommendations, and overlay dependencies, see [`docs/pack-workflow-matrix.md`](docs/pack-workflow-matrix.md).

## Repository Structure

```text
agentic-skills/
├── base/
│   ├── claude/<name>/SKILL.md
│   └── codex/<name>/SKILL.md
├── packs/
│   ├── business-{discovery,growth,ops}/{claude,codex}/<name>/SKILL.md
│   ├── code-quality/{claude,codex}/<name>/SKILL.md
│   ├── game/{claude,codex}/<name>/SKILL.md
│   ├── devtool/{claude,codex}/<name>/SKILL.md
│   ├── creator-foundation/{claude,codex}/<name>/SKILL.md
│   ├── youtube-ops/{claude,codex}/<name>/SKILL.md
│   ├── agentic-skills-bench/{claude,codex}/<name>/SKILL.md
│   ├── monorepo/{claude,codex}/<name>/SKILL.md
│   ├── remotion/{claude,codex}/<name>/SKILL.md
│   ├── project-fleet/{claude,codex}/<name>/SKILL.md
│   └── *-kanban/{claude,codex}/<name>/SKILL.md
├── scripts/
│   ├── catalog/
│   ├── pack.sh
│   ├── skill-deps.sh
│   ├── skill-mirror-parity-audit.sh
│   ├── skill-pack-routing-audit.sh
│   └── skill-versions.sh
├── apps/
│   └── skills-showcase/
├── packages/
│   └── skillpacks/
└── docs/
```

The repository root is private workspace metadata. The publishable `skillpacks` package source lives in `packages/skillpacks/`; `@glexcorp/gskp` is generated as a staged package variant during release. The public Skills Showcase app and its data generators live in `apps/skills-showcase/`.

## Base Core

The base surface is intentionally small and domain-neutral. `npx skillpacks init` installs 11 skills under `base/claude/`, 8 of which are mirrored under `base/codex/`:

```text
afps-status, animation-design-planner, autoresearch, autoresearch-prep,
codebase-status, fork-idea-branch, idea-scope-brief, init-agentic-skills,
pack, provision-agentic-config, skills
```

### Claude-only base skills

Three base skills ship only under `base/claude/` (no `base/codex/` mirror):

```text
autoresearch, autoresearch-prep, fork-idea-branch
```

`$afps-status` summarizes AFPS product-workflow progress from existing artifacts and recommends the next concrete skill command. It is read-mostly reconciliation, not a competing workflow state system.

### `delegate` moved to the `agent-bridge` pack

`delegate` is **no longer a base skill** — it lives in `packs/agent-bridge/claude/delegate`. Install it with `npx skillpacks install agent-bridge`. It remains **Claude-only** with no Codex mirror.

`/delegate` is the synchronous, in-session sibling of `/handoff --target=codex`: it drafts and approves a packet via `scripts/approved-plan.sh`, then invokes `codex exec "<target-skill> --execute-approved"` live from Claude. It is `hybrid`-only by design. Codex users should not expect a `$delegate` — drive hybrid delegation from the Claude side, or use `/handoff --target=codex` for the async variant. See `packs/agent-bridge/claude/delegate/SKILL.md` and `docs/operating-modes.md`.

## Packs

### Business Packs

For SaaS, marketplaces, productivity tools, business applications, and enterprise workflows.

Install only the current lane:

```text
business-research: customer-discovery, enterprise-icp, competitive-analysis, customer-feedback,
value-prop-canvas, lean-canvas, positioning

customer-lifecycle: journey-map, onboarding-map, conversion-map,
transaction-map, retention-map, expansion-map, lifecycle-metrics

business-growth: hook-model, growth-model, metrics, gtm, monetization,
landing-copy, pmf-assessment, experiment

business-ops: assumption-tracker, cohort-review, retro, risk-register,
burn-rate, runway-model, investor-update, reconcile-research,
mvp-gap, scale-audit, platform-strategy
```

`npx skillpacks install business-app` remains a compatibility alias that installs all four, but narrow installs are preferred for context size.


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

### Creator Media Packs

For YouTube channels, non-YouTube creator platforms, founder-led media, product-led content, creator portfolios, and recurring shows.

```text
creator-foundation: research-directory-conventions,
creator-platform-capability-matrix, creator-evidence-schema,
creator-presence-dossier, creator-positioning, content-programming,
series-spec, product-led-media-map, creator-metrics-review

youtube-ops: youtube-audit, youtube-channel-audit, youtube-video-audit,
youtube-video-prelaunch-audit, youtube-vid-research, youtube-competitive-research,
youtube-derivative-cuts,
youtube-title-thumbnail-audit, youtube-description-optimizer,
youtube-portfolio, youtube-peer-benchmark, youtube-search-positioning,
youtube-cadence-diagnosis
```

`npx skillpacks install creator-media` remains a compatibility alias that installs `creator-foundation` and `youtube-ops`. Use `remotion` for `youtube-format-research`, `video-script`, and `video-build`.

LinkedIn-first evidence work uses the `creator-foundation` matrix/schema/dossier path:

```text
creator-platform-capability-matrix -> creator-evidence-schema -> creator-presence-dossier
```

The baseline is owner exports, manual snapshots, public unauthenticated captures, and user-provided files. Paid APIs, logged-in scraping, bot-protection bypass, private-data collection, private relationship graph extraction, paywall access, and access-control circumvention are out of scope; analytics are unavailable unless owner-provided, admin-provided, or already authorized.

### Project Fleet

For control repositories managing many downstream repos, clone/spec-store portfolios, or bounded spin-offs.

```text
clone-spec-store, project-fleet, spin-off, spinoff-idea
```

### Alignment Loop

For lightweight operator-agent calibration before committing to a full spec-interview pipeline.

```text
taste-calibration, destination-doc, vertical-slice-splitter
```

Default flow:

```text
taste-calibration -> destination-doc -> vertical-slice-splitter -> implementation
```

### Remotion

For Remotion-oriented video production from reference format analysis through scripting and build planning.

```text
youtube-format-research, video-script, video-build
```

Install alongside `creator-foundation` and, when YouTube evidence is needed, `youtube-ops` for the full creator strategy to Remotion production path.

### Code Quality

For behavior-preserving refactors, type hygiene, import honesty, dependency-boundary cleanup, and module organization.

```text
extract-shared-types, quality-sweep
```

`extract-shared-types` moves shared type definitions into dedicated `types/` files without runtime behavior changes. `quality-sweep` orchestrates a behavior-preserving cleanup campaign across duplication, type hygiene, dead code, dependency boundaries, defensive error handling, legacy paths, and comments — audit-only by default, with optional `fix` or `full` modes.

### Monorepo

For pnpm workspace monorepos that may use Turborepo and need package-aware execution, guardrails, and shipping.

```bash
npx skillpacks install monorepo
```

```text
mono-detect, mono-exec, mono-guard, mono-ship
```

The monorepo pack uses an augmentation injection pattern: it adds workspace detection, lane-spec generation, branch-backed package dispatch, consolidation/PR review, boundary checks, package-scoped validation, and transitive-dependent validation around the existing `exec` and `ship` skills. This differs from the former `*-kanban` duplication pattern; PoketoWork kanban packs are currently hibernated while Poketo.work is being rebuilt.

Lane dispatch uses a JSON + Markdown mirror:

```text
.agents/lane-specs.json -> machine-readable lifecycle, package lanes, owns, must_not_edit, depends_on, branch
tasks/lane-specs.md -> committed human-readable mirror
```

Lane lifecycle values are `draft`, `approved`, `dispatched`, `integrated`, and `failed`. Specs and roadmap phases may use YAML frontmatter package-scope tags:

```yaml
---
packages: [api, web]
scope: cross-cutting
---
```

Use `scope: package-scoped` for package-contained work, `scope: cross-cutting` for shared-package or multi-package work, and `scope: root-only` for root config, scripts, docs, or repository policy.

### Hibernated Kanban Packs

PoketoWork kanban packs are hibernated while Poketo.work is being rebuilt. Their source is preserved under `archive/hibernated-packs/2026-06-poketowork-rebuild/`, but they are not active install targets and should not be recommended until the service/API is stable, the auth contract is known, and smoke tests are updated.

## Moved Skills

Former base business/product skills now live in narrower project packs. `business-app` remains a compatibility alias for all four business packs. `business-discovery` is accepted as a compatibility alias for `business-research`.

```bash
npx skillpacks install business-research
npx skillpacks install customer-lifecycle
npx skillpacks install business-growth
npx skillpacks install business-ops
```

Creator-media and YouTube work is similarly split between `creator-foundation`, `youtube-ops`, and `remotion`. Fleet/portfolio work moved from base core into `project-fleet`.

## Version Pinning

Skills can be pinned to an archived version. When a skill's version is bumped, the old `SKILL.md` is archived to `archive/<version>/SKILL.md` within the skill directory.

```bash
# Archive current version before bumping
bash scripts/skill-archive.sh base/claude/codebase-status

# Pin a pack skill to an archived version
scripts/pack.sh pin devtool-adoption v0.0
scripts/pack.sh unpin devtool-adoption

# Pin a base skill to an archived version
npx skillpacks pin ship v0.0

# Audit archive integrity
bash scripts/skill-archive-audit.sh
bash scripts/skill-archive-audit.sh --json
bash scripts/skill-archive-audit.sh --strict
```

See [`docs/skill-versioning.md`](docs/skill-versioning.md) for the full versioning convention.

## Validation

```bash
./scripts/skill-deps.sh --broken
./scripts/skill-mirror-parity-audit.sh
./scripts/skill-pack-routing-audit.sh
./scripts/skill-versions.sh --missing
pnpm --dir tests test
```

`skill-deps.sh`, `skill-pack-routing-audit.sh`, and `skill-versions.sh` scan `base/` and `packs/`; `skill-mirror-parity-audit.sh` checks mirrored pack skill pairs under `packs/`.

Live agent behavior tests are opt-in because they invoke authenticated CLIs and may spend model budget:

```bash
pnpm --dir tests test:live          # Claude + Codex when both are installed
pnpm --dir tests test:live:claude   # Claude only
pnpm --dir tests test:live:codex    # Codex only
```

The live harness runs in temporary git repositories, requests structured JSON from `claude -p` or `codex exec`, and validates skill behavior such as `analyze-sessions` versus `session-triage` routing. Routine `pnpm --dir tests test` does not run live model calls.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Skill installed but not visible | Restart Claude Code or start a fresh Codex session |
| `jq required for write operations` | Install jq: `brew install jq` or `apt install jq` |
| Skills out of date after git pull | `scripts/pack.sh doctor` then `scripts/pack.sh refresh` |
| Broken skill references | `./scripts/skill-deps.sh --broken` |

For detailed recovery procedures, see [`docs/troubleshooting.md`](docs/troubleshooting.md).

For a complete script command index, see [`docs/scripts-reference.md`](docs/scripts-reference.md).
