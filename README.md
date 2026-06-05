# Agentic Skills

A shared skill library for Claude Code and OpenAI Codex.

The library now uses a two-layer model:

- **Global core skills** are domain-neutral and safe to expose in every project.
- **Project-local packs** hold domain-specific workflows such as business apps, video games, and developer tools.

This keeps game research out of B2B SaaS sessions, and keeps business-product assumptions out of game and devtool projects.

## Prerequisites

- **bash** shell (macOS, Linux, or WSL on Windows)
- **jq** for pack installation: `brew install jq` (macOS) or `apt install jq` (Debian/Ubuntu)
- **Claude Code** or **OpenAI Codex** installed on your machine
- **pnpm** (optional, for running tests): `npm install -g pnpm`

For a guided first-use walkthrough, see [`docs/QUICKSTART.md`](docs/QUICKSTART.md).

## Initialization

```bash
./init.sh
```

`init.sh` initializes only the global core skills:

- `global/claude/*` → `~/.claude/skills/*`
- `global/codex/*` → `~/.codex/skills/*`

It does **not** install `packs/*` globally.

To remove repo-managed global skill installs:

```bash
./init.sh --uninstall
```

## Project Packs

Project packs are enabled per repository.

```bash
scripts/pack.sh list
scripts/pack.sh recommend
scripts/pack.sh install business-discovery
scripts/pack.sh install business-growth
scripts/pack.sh install business-ops
scripts/pack.sh install game
scripts/pack.sh install devtool
scripts/pack.sh install creator-foundation
scripts/pack.sh install youtube-ops
scripts/pack.sh install code-quality
scripts/pack.sh install agentic-skills-bench
scripts/pack.sh install monorepo
scripts/pack.sh install remotion
scripts/pack.sh install project-fleet
scripts/pack.sh install alignment-loop
scripts/pack.sh install design-system
scripts/pack.sh which design-system
scripts/pack.sh status
scripts/pack.sh remove game
scripts/pack.sh remove design-system
```

`scripts/pack.sh install <name>` accepts either a pack name or a skill name from any pack. Pack names install every skill in the pack. Skill names install only that one project-local skill and record it under `.agents/project.json` `enabled_skills`.

`scripts/pack.sh list-packs` is an internal subcommand used by Codex `$exec` routing (see `global/codex/exec/SKILL.md`). It prints enabled packs from `.agents/project.json` one per line with no decoration, distinct from the human-facing `list` above; prefer `list` or `status` for interactive use.

Claude users can run `/pack` with no arguments, and Codex users can run `$pack` with no arguments. If `.agents/project.json` exists, the skill refreshes local skill roots from that committed project designation. If it is missing, the assistant inspects the repository, recommends a pack, and asks before installing.

`scripts/pack.sh which <skill>` shows which pack provides a skill and whether it is installed. `scripts/pack.sh refresh` recreates local skill roots; it does not by itself force an active CLI skill registry to reload. Claude Code watches existing `.claude/skills` roots and supports `/reload-skills`; `/clear` starts a new empty-context conversation and can also pick up refreshed skills. Restart Claude Code if `.claude/skills` did not exist when the session started or the skill is still invisible. In Codex, start a fresh Codex CLI session if the `$` skill list stays stale.

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
  "enabled_packs": ["devtool", "business-discovery", "business-growth"],
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
      "packs": ["business-discovery", "business-growth"],
      "purpose": "CalcLLM-powered connected edition research, GTM, monetization, and SaaS product work."
    }
  ]
}
```

Pack commands preserve existing `project_scopes` and `notes` fields when `jq` is available.

Pack commands also write `.agents/.pack.lock` owner metadata and automatically remove stale locks whose recorded process is no longer running.

`.agents/project.json` also accepts an optional `agent_mode` field (`"claude-only" | "codex-only" | "hybrid"`) that names the Phase 11 operating mode for the project. Set or clear it with `scripts/pack.sh set-mode <claude-only|codex-only|hybrid|unset>`; the value is preserved across `install`, `remove`, and `refresh`. `SKILLS_AGENT_MODE` overrides the file for the current shell, and `scripts/agent-mode.sh` resolves the effective mode (env > project.json > empty). See `docs/operating-modes.md`.

If an assistant does not discover project-local skills, use the global `pack` or `research-roadmap` skill as the launcher. The pack files still stay project-local.

For workflow ordering, lead-in recommendations, and overlay dependencies, see [`docs/pack-workflow-matrix.md`](docs/pack-workflow-matrix.md).

## Repository Structure

```text
agentic-skills/
├── global/
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
│   ├── pack.sh
│   ├── skill-deps.sh
│   ├── skill-mirror-parity-audit.sh
│   ├── skill-pack-routing-audit.sh
│   └── skill-versions.sh
├── init.sh
└── docs/
```

## Global Core

The global surface is intentionally small and domain-neutral. `./init.sh` installs six skills under `global/claude/` (mirrored under `global/codex/`):

```text
codebase-status, idea-scope-brief, init-agentic-skills, pack,
provision-agentic-config, skills
```

### Codex-only global skill

One global skill ships only under `global/codex/` (no `global/claude/` mirror):

```text
afps-status
```

`$afps-status` summarizes AFPS product-workflow progress from existing artifacts and recommends the next concrete skill command. It is read-mostly reconciliation, not a competing workflow state system.

### `delegate` moved to the `agent-bridge` pack

`delegate` is **no longer global** — it lives in `packs/agent-bridge/claude/delegate`. Install it with `scripts/pack.sh install agent-bridge`. It remains **Claude-only** with no Codex mirror.

`/delegate` is the synchronous, in-session sibling of `/handoff --target=codex`: it drafts and approves a packet via `scripts/approved-plan.sh`, then invokes `codex exec "<target-skill> --execute-approved"` live from Claude. It is `hybrid`-only by design. Codex users should not expect a `$delegate` — drive hybrid delegation from the Claude side, or use `/handoff --target=codex` for the async variant. See `packs/agent-bridge/claude/delegate/SKILL.md` and `docs/operating-modes.md`.

## Packs

### Business Packs

For SaaS, marketplaces, productivity tools, business applications, and enterprise workflows.

Install only the current lane:

```text
business-discovery: icp, enterprise-icp, competitive-analysis, customer-feedback,
value-prop-canvas, lean-canvas, positioning

customer-lifecycle: journey-map, onboarding-map, conversion-map,
transaction-map, retention-map, expansion-map, lifecycle-metrics

business-growth: hook-model, growth-model, metrics, gtm, monetization,
landing-copy, pmf-assessment, experiment

business-ops: assumption-tracker, cohort-review, retro, risk-register,
burn-rate, runway-model, investor-update, reconcile-research,
mvp-gap, scale-audit, platform-strategy
```

`scripts/pack.sh install business-app` remains a compatibility alias that installs all four, but narrow installs are preferred for context size.


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
youtube-vid-research, youtube-competitive-research,
youtube-title-thumbnail-audit, youtube-description-optimizer,
youtube-portfolio, youtube-peer-benchmark, youtube-search-positioning,
youtube-cadence-diagnosis
```

`scripts/pack.sh install creator-media` remains a compatibility alias that installs `creator-foundation` and `youtube-ops`. Use `remotion` for `youtube-format-research`, `video-script`, and `video-build`.

LinkedIn-first evidence work uses the `creator-foundation` matrix/schema/dossier path:

```text
creator-platform-capability-matrix -> creator-evidence-schema -> creator-presence-dossier
```

The baseline is owner exports, manual snapshots, public unauthenticated captures, and user-provided files. Paid APIs, logged-in scraping, bot-protection bypass, private-data collection, private relationship graph extraction, paywall access, and access-control circumvention are out of scope; analytics are unavailable unless owner-provided, admin-provided, or already authorized.

### Project Fleet

For control repositories managing many downstream repos, clone/spec-store portfolios, or bounded spin-offs.

```text
clone-spec-store, project-fleet, spin-off
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
scripts/pack.sh install monorepo
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

Former global business/product skills now live in narrower project packs. `business-app` remains a compatibility alias for all four business packs.

```bash
scripts/pack.sh install business-discovery
scripts/pack.sh install customer-lifecycle
scripts/pack.sh install business-growth
scripts/pack.sh install business-ops
```

Creator-media and YouTube work is similarly split between `creator-foundation`, `youtube-ops`, and `remotion`. Fleet/portfolio work moved from global core into `project-fleet`.

## Version Pinning

Skills can be pinned to an archived version. When a skill's version is bumped, the old `SKILL.md` is archived to `archive/<version>/SKILL.md` within the skill directory.

```bash
# Archive current version before bumping
bash scripts/skill-archive.sh global/claude/ship

# Pin a pack skill to an archived version
scripts/pack.sh pin devtool-adoption v0.0
scripts/pack.sh unpin devtool-adoption

# Pin a global skill during initialization
./init.sh --pin ship=v0.0

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

`skill-deps.sh`, `skill-pack-routing-audit.sh`, and `skill-versions.sh` scan `global/` and `packs/`; `skill-mirror-parity-audit.sh` checks mirrored pack skill pairs under `packs/`.

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
