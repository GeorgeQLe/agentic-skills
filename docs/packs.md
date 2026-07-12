# Project-Local Skill Packs

Project-local packs keep domain-specific workflows out of base assistant context.

## Design

- Base skills live in `packs/base/{claude,codex}`.
- Domain packs live in `packs/<pack>/{claude,codex}`.
- Project designation lives in `.agents/project.json`.
- Mixed monorepos can declare scoped domain routing in `.agents/project.json.project_scopes`.

Example:

```json
{
  "project_type": "game",
  "enabled_packs": ["game"],
  "skill_pack_version": 1
}
```

Mixed monorepo example:

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
    },
    {
      "path": "packages/calcllm-sync",
      "project_type": "business-app",
      "packs": ["business-research", "business-growth"],
      "purpose": "Connected-edition sync and SaaS integration work."
    }
  ]
}
```

In this model, `project_type` is the default designation for uncategorized work, `enabled_packs` is the union of local skills available in the repo, and each `project_scopes[]` entry tells agents which pack family to apply for a path or glob.

## Commands

npm CLI commands:

```bash
npx skillpacks list
npx skillpacks recommend
npx skillpacks install game
npx skillpacks install business-research
npx skillpacks install business-growth
npx skillpacks install business-ops
npx skillpacks install devtool
npx skillpacks install creator-foundation
npx skillpacks install youtube-ops
npx skillpacks install code-quality
npx skillpacks install agentic-skills-bench
npx skillpacks install monorepo
npx skillpacks install remotion
npx skillpacks install project-fleet
npx skillpacks install alignment-loop
npx skillpacks remove game
npx skillpacks refresh
npx skillpacks status
npx skillpacks doctor
npx skillpacks doctor --fix
npx skillpacks doctor --fix --agent-docs --dry-run
npx skillpacks set-update-mode <mode>
```

Source-checkout equivalents remain available from a local clone:

```bash
scripts/pack.sh list
scripts/pack.sh install game
scripts/pack.sh refresh
scripts/pack.sh status
```

`npx skillpacks install <name>` accepts either a pack name or a skill name from the packaged manifest. Node-owned npm commands preserve `.agents/project.json` fields without requiring `jq`; source-checkout `scripts/pack.sh` write commands still use `jq` for structured JSON edits.

`doctor` and `set-update-mode` are part of the skill-install drift model — see [Skill-install drift](#skill-install-drift-track-latest-vs-pinned) below. Build-In-Public runtime behavior has been removed; run `npx skillpacks cleanup` to remove stale BIP project config keys from projects below the current directory, or `npx skillpacks cleanup --global` to scan below the user home.

The npm CLI can install canonical decks from manifest metadata: `npx skillpacks install-deck vard`, `npx skillpacks install-deck ord`, `npx skillpacks install-deck business-afps`, `npx skillpacks install-deck devtool-afps`, and `npx skillpacks install-deck game-afps`. Deck materialization still uses the packaged shell backend in this phase, so it requires `bash` and `jq`.

Assistant-native usage also supports guided setup:

- Claude: run `/init-agentic-skills` (guided pack setup).
- Codex: run `$init-agentic-skills` (guided pack setup).

If `.agents/project.json` already exists, bare `pack` refreshes local skill roots from the committed project designation. If it is missing, the assistant inspects the repository, recommends a pack, and asks before installing. Claude uses AskUserQuestion for that checkpoint; Codex uses a text-based Pack Decision Checkpoint that waits for an explicit reply before writing `.agents/project.json`.

The `refresh` command recreates `.claude/skills` and `.codex/skills` managed skill roots from `.agents/project.json`; it is not an in-session Claude Code or Codex skill reload. After `install`, `remove`, or `refresh`, start a fresh CLI session if the changed skills are not visible.

## Local Skill Roots

Pack install creates repo-managed skill roots in the current project:

```text
.claude/skills/<skill>/SKILL.md
.codex/skills/<skill>/SKILL.md
```

The skill source stays centralized in this repository. Projects opt into packs without copying skill bodies, and active installed roots exclude archived `SKILL.md` snapshots.

## Pack Selection

- Use `business-research` for ICP, market/customer discovery, value proposition, positioning, lean canvas, and journeys.
- Use `business-growth` for GTM, growth, metrics, monetization, landing copy, experiments, and PMF.
- Use `business-ops` for assumptions, feedback/cohorts/retros, risks, runway, stakeholder updates, platform strategy, and research reconciliation.
- Use `code-quality` as an additive pack for behavior-preserving refactors, type hygiene, import honesty, dependency-boundary cleanup, and module organization.
- Use `agentic-skills-bench` when working in this repository and needing to verify or benchmark-test one skill with the local harness.
- Use `game` for Game AFPS: video games, prototypes, playable entertainment, loop validation, playtests, and store-page/wishlist validation.
- Use `devtool` for SDKs, CLIs, APIs, libraries, infrastructure products, and developer-facing platforms.
- Use `creator-foundation` for creator-media evidence foundations, dossiers, positioning, programming, series, product-led media mapping, and metrics review.
- Use `youtube-ops` for YouTube channel/video audits, unlisted prelaunch reviews, external-video context, competitive research, meta research, packaging, metadata, portfolio, benchmarking, search, and cadence.
- Use `monorepo` for pnpm workspace monorepos, with optional Turborepo, that need package-aware lane specs, guardrails, and scoped shipping.
- Use `remotion` for Remotion-oriented format research, scene-by-scene video scripting, and build/scaffold planning.
- Use `project-fleet` for control repos that manage many downstream repos, clone/spec-store portfolios, spinoff idea prompts, or spin-offs.
- Use `alignment-loop` for lightweight operator-agent calibration before committing to a full spec-interview pipeline.
- PoketoWork kanban packs are hibernated while Poketo.work is being rebuilt.

The hibernated packs are preserved under `archive/hibernated-packs/2026-06-poketowork-rebuild/` and are not available for active install or recommendation.

`business-app` is a compatibility alias that expands to `business-research`, `customer-lifecycle`, `business-growth`, and `business-ops`. `business-discovery` is accepted as a compatibility alias for `business-research`. `creator-media` is a compatibility alias that expands to `creator-foundation` and `youtube-ops`.

For the full workflow/dependency matrix, see [`docs/pack-workflow-matrix.md`](pack-workflow-matrix.md).

## Monorepo Pack

The `monorepo` pack is an execution overlay for pnpm workspace repositories. It targets repositories with `pnpm-workspace.yaml` and optionally `turbo.json`.

```bash
npx skillpacks install monorepo
```

Skills:

```text
mono-detect, mono-exec, mono-guard, mono-ship
```

The pack uses an augmentation injection pattern. Its skills add pre/post behavior around the base `exec` and `ship` contracts instead of replacing them:

- `mono-detect` writes `.agents/monorepo.json` with workspace packages, package paths, package scripts, dependency graph, and Turborepo awareness.
- `mono-exec` injects monorepo detection, lane-spec generation, guard pre-flight checks, serial cross-cutting work, and package-scoped dispatch around standard `run`.
- `mono-guard` validates lane specs before dispatch and checks integrated diffs against declared ownership after dispatch.
- `mono-ship` injects package-scoped test/lint/build and transitive-dependent validation before delegating to standard `ship`.

This differs from the former `*-kanban` duplication pattern. The hibernated kanban packs provided alternate command variants such as `exec-kanban`, `ship-kanban`, and `ship-end-kanban`; the active monorepo pack keeps the base lifecycle skills authoritative and makes them workspace-aware through pre/post steps.

Lane dispatch uses two artifacts:

```text
.agents/lane-specs.json
tasks/lane-specs.md
```

`.agents/lane-specs.json` is the machine-readable lane plan. `tasks/lane-specs.md` is the committed human-readable mirror. Lane lifecycle values are `draft`, `approved`, `dispatched`, `integrated`, and `failed`; package lanes declare `packages`, `owns`, `must_not_edit`, `depends_on`, and `mode`.

Specs and roadmap phases may declare package scope with YAML frontmatter:

```yaml
---
packages: [api, web]
scope: cross-cutting
---
```

Use `scope: package-scoped` when work is contained to declared package paths, `scope: cross-cutting` when work touches shared packages or multiple package boundaries, and `scope: root-only` for root config, scripts, docs, or repository policy. If `scope` is omitted, agents infer `package-scoped` for one package and `cross-cutting` for multiple packages.

## Remotion Pack

The `remotion` pack contains the production path that turns reference-video research and creator-media strategy into Remotion-ready artifacts.

```bash
npx skillpacks install remotion
```

Skills:

```text
youtube-format-research, video-script, video-build
```

Default flow:

```text
youtube-format-research -> video-script -> video-build
```

Install it alongside `creator-foundation` and, when YouTube evidence is needed, `youtube-ops` for the full path from channel evidence, positioning, programming, or product-led media strategy into production:

```bash
npx skillpacks install creator-foundation youtube-ops remotion
```

## Alignment Loop Pack

The `alignment-loop` pack is a lightweight planning on-ramp for projects that need shared taste and intent before a full specification cycle.

```bash
npx skillpacks install alignment-loop
```

Skills:

```text
taste-calibration, destination-doc, vertical-slice-splitter
```

Default flow:

```text
taste-calibration -> destination-doc -> vertical-slice-splitter -> implementation
```

## Compatibility

If a tool does not discover project-local `.claude/skills` or `.codex/skills`, use the base `pack` and `research-roadmap` skills as launchers. They should read `.agents/project.json` and the local pack files directly.

Do not install `packs/*` as base skills as a fallback; that recreates the context pollution this design avoids.

Commit `.agents/project.json` with the project. Do not commit generated local skill roots under `.claude/skills` or `.codex/skills`; recreate them with `npx skillpacks refresh` or, from a source checkout, `scripts/pack.sh refresh`.

`scripts/pack.sh install`, `remove`, `refresh`, and `set-mode` preserve existing `project_scopes`, `notes`, `skill_updates`, and `alignment` fields when `jq` is available. The npm `gskp` Node-owned project commands preserve `project_scopes`, `notes`, `pinned_versions`, `enabled_skills`, `skill_updates`, `alignment`, and `agent_mode` without requiring `jq`; see `docs/skillpacks-npm-distribution.md` for the current command compatibility matrix.

To migrate an existing project from a local checkout workflow to npm after publication, keep `.agents/project.json` committed and run `npx skillpacks refresh` from that project. The generated `.claude/skills` and `.codex/skills` roots will be recreated from the package snapshot. If the project pins a skill version, the installed package must include that skill's `archive/<version>/SKILL.md`.

Pack writes use `.agents/.pack.lock` with owner metadata (`pid`, `started_at`, `command`). If a previous pack command exits without releasing the lock and its recorded process is no longer running, the next pack command removes the stale lock automatically. If a live process still owns the lock, timeout errors include the owner metadata.

## Skill-install drift (track-latest vs pinned)

Installs are **copies** of canonical sources stamped with a `.agentic-skills-managed` marker. The marker now records `source_version` (the canonical `version:` at install time) and `source_sha` (a deterministic content hash of the source, excluding `archive/` and the marker). This makes "the canonical skill moved ahead of my installed copy" observable.

- **Track-latest (default).** A plain managed copy follows canonical. When the canonical source changes, the recorded `source_sha` no longer matches, and the install is reported as `stale`.
- **Pinned (frozen).** `scripts/pack.sh pin <skill> <ver>` installs `archive/<ver>` as a **symlink**; pinned installs report `pinned` and are never `stale`. `unpin` returns the skill to track-latest. There is no separate per-skill "policy" field — pinned vs latest is encoded solely by presence in `.agents/project.json` `pinned_versions`.

Report and refresh:

```bash
scripts/pack.sh doctor     # read-only drift report (ok / stale / unknown / pinned / missing-source); non-zero exit if any stale
scripts/pack.sh refresh    # re-copy installs from canonical, rewriting markers and clearing drift
```

`doctor` statuses: `ok` (matches canonical), `stale (vOld → vNew)` (canonical moved), `unknown` (a pre-upgrade marker has no `source_sha` — run `refresh` once to enable tracking, never a false `stale`), `pinned vX (frozen)`, and `missing-source` (canonical path gone). `doctor` only detects *canonical moved*; it does not detect local edits to an installed copy.

**Update mode.** `.agents/project.json` may carry `skill_updates.mode` — `warn` (default) or `auto`. Set it with `scripts/pack.sh set-update-mode <warn|auto|unset>`. A trigger (the session-start hook, or sync-with-approval) that sees `mode == auto`, or machine-wide `~/.agentic-skills/preferences.json` `skills.auto_refresh == true`, runs `refresh` automatically; otherwise it only warns. `doctor` itself never mutates — it renders the effective policy.

**Session-start hook (opt-in, off by default).** An optional `SessionStart` hook (`scripts/skill-drift-hook.sh`) warns about stale project skill installs at session start, or auto-refreshes when `skill_updates.mode == auto` (or machine-wide `~/.agentic-skills/preferences.json` `skills.auto_refresh == true`) is set. Enable it by registering a `SessionStart` entry in `~/.claude/settings.json` that runs `bash <checkout>/scripts/skill-drift-hook.sh` (Claude Code's `/update-config` can write this for you) and setting `skills.session_start_hook: true` in `~/.agentic-skills/preferences.json`. The hook is gated on that preference, so an unset or `false` value makes it a silent no-op. Remove the `SessionStart` entry (or set the preference to `false`) to disable it.

Base skill installs follow the same model: `npx skillpacks doctor` reports project base drift against `packs/base/<tool>/<skill>`, and `npx skillpacks refresh` recreates them from the package snapshot (the base "refresh").

## Team Setup Checklist

For teams adopting agentic-skills across multiple developers:

1. **Choose a checkout path.** Each developer clones this repo locally. The path does not need to match across developers, but `scripts/pack.sh refresh` may need to re-run if the checkout moves.
2. **Run `npx skillpacks init` once per project.** This installs base skills **project-local** into the project's `.claude/skills/` and `.codex/skills/` and records `base_skills: true` in `.agents/project.json`.
3. **Commit `.agents/project.json`.** This file records the project's pack designation and should be checked into the target project repository.
4. **Never commit generated skill roots.** `.claude/skills/` and `.codex/skills/` in consumer projects are generated from `.agents/project.json`. Add them to `.gitignore`.
5. **Run `scripts/pack.sh refresh` after pulling pack changes.** When `.agents/project.json` changes upstream (e.g. a new pack is added), each developer runs refresh to recreate their local skill roots.
6. **Restart CLI after install/remove/refresh.** Skills are not hot-reloaded. Claude Code: `/reload-skills` then `/clear` or restart. Codex: fresh session.
7. **Use issue-backed delivery.** Tracked mutations default to one GitHub Issue, a non-primary branch, and a ready pull request. Merge is a separate confirmed action; release and deployment wait for the merged primary branch. Record any non-GitHub tracker adapter in `.agents/project.json` `notes` or the project's agent instructions.

## Former Base Domain Skills

Business/product workflows that used to be base skills now live in narrow business packs. Prefer the current lane:

```bash
npx skillpacks install business-research
npx skillpacks install customer-lifecycle
npx skillpacks install business-growth
npx skillpacks install business-ops
```

`business-app` remains a compatibility alias that installs all four. Creator-media and YouTube work is split between `creator-foundation`, `youtube-ops`, and `remotion`; fleet/portfolio work lives in `project-fleet`.
