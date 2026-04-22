# Devtool Integration Map — agentic-skills

Scope: maps where this specific repo — the `agentic-skills` shared skill library — fits into a developer's stack. Grounded in observable repo signals (`README.md`, `install.sh`, `scripts/pack.sh`, `scripts/agent-mode.sh`, `docs/operating-modes.md`, `docs/packs.md`, `.agents/project.json`, pack layout under `packs/`). Not a generic devtool integration checklist.

Continuity: this file is the second step in the devtool research chain and assumes the audience framing from `research/devtool-user-map.md` (solo builders, repo-embedded contributors, hybrid-mode orchestrators, and the Anthropic/OpenAI subscription-paying economic buyers above them).

## Required integrations

The tool will not function without these. Each is a hard dependency visible in the repo's own install and resolve paths:

- **POSIX shell (`bash`).** `install.sh` (line 1: `#!/usr/bin/env bash`, `set -euo pipefail`), `scripts/pack.sh`, and `scripts/agent-mode.sh` are all bash scripts. Every workflow entry point is a bash invocation. No Windows-native shell path is supported; WSL is the implicit bridge for Windows users.
- **`git`.** Required because the repo's entire shipping contract runs through git: `commit-and-push-by-feature`, ship-one-step plans, and `tasks/history.md` dated entries all assume a working tree. The `Direct-To-Primary Git Flow` principle in `CLAUDE.md` hard-codes `main`-or-`master` as the merge target.
- **A filesystem that supports symlinks.** `install.sh` and `scripts/pack.sh` wire skills into `~/.claude/skills/` and `~/.codex/skills/` (global) and `.claude/skills/` and `.codex/skills/` (project-local) via symlinks, through the shared helper `scripts/skill-links.sh` (`install.sh:7`, `scripts/pack.sh:11`). Filesystems that do not preserve symlinks — notably default Windows file sharing into containers, and some sync tools — will corrupt the install.
- **At least one of Claude Code CLI or OpenAI Codex CLI.** The three-mode operating model (`docs/operating-modes.md`) names Claude Code and Codex CLI as the only supported consumer harnesses. `claude-only` needs Claude installed; `codex-only` needs Codex installed; `hybrid` needs both plus `codex` on `$PATH` for `/delegate`'s `codex exec` invocation.
- **A writable `$HOME`.** `install.sh` creates `~/.claude/skills` and `~/.codex/skills` (lines 130, 134–135). Containers or CI images without a persistent home directory cannot host the global install.
- **Project designation file, for project-local work.** `.agents/project.json` is the commit point for `project_type`, `enabled_packs`, `skill_pack_version`, and optional `agent_mode`. `scripts/pack.sh recommend` and `scripts/pack.sh install` write this file. Research skills (including this one) degrade to recommend-then-ask flows when it is absent.

Soft integrations — used by some skills but not required for core install:

- **`jq` or awk/sed.** Not required by the installers; `scripts/agent-mode.sh:28` deliberately parses JSON with `sed` to avoid adding a `jq` dependency. Individual skills may shell out to `jq` if present, but the scripts run without it.
- **`npm` / `node`.** Required only for the `poketowork-kanban` pack (`README.md:205` — `cd packs/poketowork-kanban/claude/poketo-kanban/scripts && npm test`). The `devtool`, `business-app`, `game`, and `code-quality` base packs do not need Node.

## Ecosystem assumptions

Assumptions the repo makes about the surrounding environment — some implicit, some hard-coded:

- **Two specific AI coding CLIs and nothing else.** `install.sh` only installs to `~/.claude/skills/` and `~/.codex/skills/`. There is no adapter for Cursor, Aider, Continue.dev, Cline, Amp, Zed's agent, or any other harness. Skills are written in Claude-Code-flavored Markdown with Claude-specific tool references (`AskUserQuestion`, `EnterPlanMode`, `ExitPlanMode`, `TaskCreate`, etc.) and Codex-flavored `$skill` invocation. A non-Claude, non-Codex harness would need to both parse the SKILL.md format and emulate the tool surface.
- **Local-first, developer-machine execution.** No hosted service, no shared state, no remote skill registry. `docs/operating-modes.md` and `docs/packs.md` assume the developer runs CLIs on their own machine against their own checkout. This repo is itself the distribution channel (`git clone` + `./install.sh`).
- **One active repo at a time.** `scripts/pack.sh` always operates on `$(pwd)` (`scripts/pack.sh:6`). There is no multi-project orchestration; a developer jumping between repos accepts that each repo carries its own `.agents/project.json` and its own symlinks.
- **Project-local symlinks point back at a single checkout of `agentic-skills`.** The symlink target path is `<this repo>/packs/<pack>/...` (README § "Project Packs"). Moving or renaming the `agentic-skills` checkout breaks every project that has installed packs from it. There is no versioned artifact or published package; the repo's working tree is the runtime.
- **`main` or `master` as the default branch, no feature-branch workflow.** `CLAUDE.md` hard-codes this. Teams that require PR-per-change workflows can still use them, but the shipped skills (`commit-and-push-by-feature`, `ship`, `ship-end`) all target the primary branch by default and must be overridden per-invocation.
- **No CI gate.** `CLAUDE.md`'s explicit rule — *Do not create, modify, or suggest GitHub Actions workflows* — means the project is not used to CI-driven validation of skill contracts. Validation is `./scripts/skill-deps.sh` and `./scripts/skill-versions.sh`, run manually or by `spec-drift` / `reconcile-dev-docs` sessions.
- **Markdown + YAML frontmatter as the skill format.** Every `SKILL.md` opens with a `---`-delimited frontmatter block (name, description, type, version, optional argument-hint). A consumer that cannot parse YAML frontmatter cannot discover skills reliably.
- **Dual Claude/Codex mirrors by convention.** Every non-Claude-only skill has paired sources under `global/claude/<name>/SKILL.md` and `global/codex/<name>/SKILL.md` (or the pack equivalent). The convention is policed socially and by `spec-drift`, not by the filesystem.
- **Agent-authored work streams are normal.** `CLAUDE.md` assumes Claude and Codex themselves run `plan → run → ship → ship-end` cycles and write to `tasks/todo.md` and `tasks/history.md`. A team that forbids agent-authored commits would need to rewrite the workflow skills.

## Setup path

The minimum-viable path from a fresh clone to an operational project. Every step is either observable in the repo or explicitly documented:

1. **Install prerequisites (out of scope of this repo).**
   - Install Claude Code CLI and/or OpenAI Codex CLI via their respective vendors. This repo assumes `claude` and/or `codex` are on `$PATH` when a skill needs them.
   - Have `bash`, `git`, and a symlink-capable filesystem available.
2. **Clone `agentic-skills` to a stable path.**
   ```bash
   git clone <repo-url> ~/projects/tools/agentic-skills
   cd ~/projects/tools/agentic-skills
   ```
   The checkout location is load-bearing: it becomes the symlink target for every project that installs packs from it. Moving it later will silently break consumers.
3. **Run `./install.sh`.** This symlinks `global/claude/*` → `~/.claude/skills/*` and `global/codex/*` → `~/.codex/skills/*` (`install.sh:134–135`). Pack skills are **not** installed globally (`install.sh:142`); this is by design to keep context clean.
4. **In a project that needs domain skills, install the matching pack.**
   ```bash
   cd <my-project>
   /path/to/agentic-skills/scripts/pack.sh recommend    # optional: auto-suggest a pack
   /path/to/agentic-skills/scripts/pack.sh install devtool
   ```
   Or, from inside Claude Code / Codex: `/pack install devtool` or `$pack install devtool`. This writes `.agents/project.json` and creates `.claude/skills/*` and `.codex/skills/*` symlinks (`docs/packs.md` § "Local Symlinks").
5. **Optionally set an operating mode.**
   ```bash
   /path/to/agentic-skills/scripts/pack.sh set-mode hybrid
   # or export SKILLS_AGENT_MODE=hybrid for shell-scoped override
   ```
   Valid modes: `claude-only`, `codex-only`, `hybrid`, or `unset` to clear. `scripts/agent-mode.sh` resolves the effective mode with env > file > unset (`docs/operating-modes.md` § "Mode-signal resolution").
6. **Start a fresh CLI session.** `README.md:51` and `docs/packs.md:43` explicitly warn: `pack.sh refresh` does not hot-reload an already-running Claude Code or Codex session. The user must exit and restart the CLI for new or removed skills to appear. This is a recurring operator chore, not a one-time setup.
7. **Commit `.agents/project.json`; do not commit `.claude/skills/` or `.codex/skills/`.** `docs/packs.md:79`. Contributors regenerate the symlinks per checkout with `pack.sh refresh` or `/pack` with no arguments.
8. **Verify, optionally.**
   ```bash
   /path/to/agentic-skills/scripts/pack.sh status
   /path/to/agentic-skills/scripts/skill-deps.sh --broken
   /path/to/agentic-skills/scripts/skill-versions.sh --missing
   ```

Time budget for a comfortable shell user who already has one CLI installed: roughly 5–15 minutes to first useful skill invocation. The cliff is real for a user who has neither CLI installed yet — most of the calendar time is vendor-side subscription and auth, not this repo.

## Compatibility constraints

Known-incompatible and known-fragile environments. A prospective user should check these before committing:

- **Windows without WSL.** No native PowerShell or cmd.exe path. `install.sh` and `scripts/pack.sh` are bash-only; symlinks under native Windows filesystems are unreliable even when bash is present (e.g. Git Bash without developer mode). WSL2 with a Linux-side clone is the supported path.
- **Network filesystems and sync tools.** iCloud Drive, OneDrive, Dropbox, and similar sync clients frequently mangle symlinks or replace them with placeholder files. A `$HOME` on a synced path will break `~/.claude/skills/*` and `~/.codex/skills/*`. Put the `agentic-skills` checkout and `$HOME/.claude` / `$HOME/.codex` on a local, non-synced filesystem.
- **Container and CI environments without persistent `$HOME`.** Ephemeral containers lose the `~/.claude/skills/` and `~/.codex/skills/` links on restart. This repo is not designed to be `./install.sh`ed in a container entrypoint; it assumes a long-lived developer workstation.
- **Versioning model is "the checkout is the runtime".** There is no semver'd package, no release tag advertised as a consumer contract, no `CHANGELOG.md` at the root. `scripts/skill-versions.sh` checks that individual SKILL.md files have a `version:` field, but the repo as a whole does not publish a consumer-facing version. Projects pinning to a specific git SHA is the implicit versioning discipline.
- **Dual-CLI parity is by convention, not enforced.** Nothing in the filesystem or scripts prevents `global/claude/<name>/SKILL.md` from drifting away from `global/codex/<name>/SKILL.md`. `spec-drift` sessions catch divergence after the fact (`tasks/history.md` already shows multiple drift-fix entries, e.g. `$spec-drift fix packs/business-app/*/scale-audit`, `$spec-drift fix approval-packet references`). Consumers who rely on strict parity between the two mirrors will be surprised.
- **Claude-only `/delegate` with no Codex mirror.** `global/claude/delegate/` exists; `global/codex/delegate/` does not. A Codex user typing `$delegate` will find nothing. This is an intentional hybrid-only asymmetry documented in `README.md` § "Claude-only global skills" and `docs/skills-reference.md` § "Claude-only Global Skills", but it violates the symmetric mental model that every other global skill follows.
- **No hot reload.** As above: installing, removing, or refreshing packs requires an explicit CLI restart. Long-running Claude Code / Codex sessions that install a pack mid-session will not pick up the new skills until the next launch.
- **Agent-authored workflow is opinionated.** `CLAUDE.md`'s workflow (plan-mode-first, ship-one-step, `commit-and-push-by-feature`, direct-to-primary) is not optional advice; the shipped skills are built around it. A team with a strict PR-review-gate workflow will have to override these defaults per-invocation or fork the skills.
- **Non-POSIX shell users.** Skills and scripts assume a POSIX-ish shell. Users running `fish`, `nu`, or exotic shells for their interactive session are fine (the scripts shebang to `bash`), but hand-written `export SKILLS_AGENT_MODE=...` guidance in docs assumes bash/zsh syntax.
- **`.agents/project.json` is the single source of project truth.** Multi-repo monorepos that expect a single designation for several sub-projects will need to decide whether to put `.agents/project.json` at the root (one pack for all) or per sub-repo (one pack per). The repo does not ship a multi-pack-per-project convention beyond listing multiple entries in `enabled_packs`.

## Migration risks

Risks a team should price in before adopting or moving off `agentic-skills`:

- **Vendor concentration on Anthropic and OpenAI.** Per `research/devtool-user-map.md` § "Economic buyers", all spend is upstream: Claude Max / Claude API or OpenAI Codex CLI subscription. A price change, outage, rate-limit tightening, or policy shift at either vendor propagates directly into this repo's usefulness. The three-mode model (`claude-only` / `codex-only` / `hybrid`) mitigates single-vendor lock-in but not the joint two-vendor dependency.
- **Lock-in to the dual Claude/Codex mirror convention.** A team that invests in writing many custom skills pays the 2x authoring and maintenance cost in perpetuity. Migrating to a single-CLI world later means either deleting half the skills or porting them to whichever harness wins. Migrating to a third CLI means rewriting every skill's tool references.
- **Checkout-path coupling.** Every project that installs a pack has absolute-path symlinks into the `agentic-skills` checkout. Renaming or moving the checkout requires `pack.sh refresh` in every consumer repo — and because the links become broken immediately, there is no graceful degradation window. Teams onboarding multiple developers should standardize the clone path (e.g. `~/code/agentic-skills`) in onboarding docs.
- **No deprecation contract.** There is no published deprecation window for renamed or removed skills. `tasks/history.md` shows skills have been moved between global and pack scope (former global business/product skills now live only in `business-app` per `README.md` § "Moved Skills"), and downstream projects that referenced the old global names broke silently. A consumer pinning to a git SHA controls their own migration cadence; a consumer tracking `master` accepts that skill surface can shift.
- **No rollback tooling.** `install.sh --uninstall` removes the global symlinks that point back to the current checkout. `pack.sh remove <pack>` removes project-local links. Neither captures the *previous* state of `.agents/project.json`; a user who removes a pack and then regrets it must re-run `install <pack>` and restart the CLI. There is no `pack.sh rollback` or versioned state file.
- **Archive-first policy is manual.** Research and spec skills require snapshotting replaced docs under `docs/history/archive/YYYY-MM-DD/HHMMSS/` before rewriting (see `packs/devtool/claude/devtool-integration-map/SKILL.md` § "Archive-First Replacement Policy" and `research/devtool-user-map.md` § "Operators"). Nothing enforces the archive beyond agent discipline. A forgetful session can silently overwrite prior canonical thinking.
- **Approval-packet schema drift.** Hybrid-mode delegation depends on `specs/approved-plan.schema.json` matching what `/delegate`, `/handoff --target=codex`, and `$run --execute-approved` actually emit and consume. `tasks/history.md` already includes a `$spec-drift fix approval-packet references` entry for anchor drift. A schema change that is not mirrored into all three consumers breaks hybrid execution at the delegation boundary.
- **Onboarding cliff for new contributors.** Per `research/devtool-user-map.md` § "Adoption blockers", there is no `CONTRIBUTING.md`. A team adopting this repo as a shared library will need to author their own onboarding doc (or fork and ship one) to avoid repeatedly re-teaching the two-layer mental model, the archive-first policy, the ship-one-step contract, and the plan-mode-first default.
- **Session-restart chore compounds at scale.** Single-developer, single-repo use absorbs the "restart CLI after `pack.sh refresh`" cost easily. A team that rotates many developers through many repos — each hitting the restart chore on first pack install — will measure this in weekly aggregate friction. Any tooling that automates skill reloads would be a material improvement; none exists today.
- **No test harness for skill behavior.** `scripts/skill-deps.sh` and `scripts/skill-versions.sh` validate references and frontmatter, but not that a skill's output matches its SKILL.md contract. Combined with the explicit "No GitHub Actions" rule in `CLAUDE.md`, drift between documented and actual skill behavior is caught only during `spec-drift` and `reconcile-dev-docs` sessions — a manual, agent-authored cadence, not a gate. Teams with strict change-control needs should price this gap explicitly.
