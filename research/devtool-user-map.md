# Devtool User Map — agentic-skills

> **Terminology note (2026-06-05):** References to `install.sh` in this document reflect the installer name at time of writing. The script has since been renamed to `init.sh`. See `README.md` for current commands.

Scope: maps the audience and buying context for this specific repository — the `agentic-skills` shared skill library for Claude Code and OpenAI Codex. Grounded in observable repo signals (`README.md`, `docs/skills-reference.md`, `docs/operating-modes.md`, `docs/packs.md`, `CLAUDE.md`, `scripts/pack.sh`, pack layout under `packs/`). Not a generic devtool persona sheet.

## Developer users

The direct end users are individual engineers who already run at least one of Claude Code or Codex CLI locally and want to share structured workflows across sessions. Three concrete shapes:

- **Solo builder / indie operator.** Works across several personal repos of different kinds — a SaaS side project, a game prototype, a CLI tool. Wants domain-appropriate skills without polluting every session with irrelevant personas (game research showing up in a B2B SaaS session, or monetization research showing up in a game repo). Installs `global/*` once and opts into packs per repo via `scripts/pack.sh install <pack>`.
- **Repo-embedded contributor.** Joins an existing repo that already has `.agents/project.json` and `.claude/skills/*` or `.codex/skills/*` symlinks committed. Expects `/pack` or `$pack` with no arguments to reconcile their local checkout against the committed project designation. Does not necessarily maintain `agentic-skills` itself.
- **Hybrid-mode orchestrator.** Runs Claude Code as the planner and delegates execution to Codex via `/delegate` or `/handoff --target=codex` (see `docs/operating-modes.md`). Needs both CLIs installed, needs the `hybrid` agent mode set in `.agents/project.json` or `SKILLS_AGENT_MODE`, and relies on the approval-packet contract in `tasks/approved-plan.md` / `.agents/approved-plan.json`.

All three share one prerequisite: they must be comfortable with shell, git, symlinks, and editing JSON/Markdown by hand. This is an agent-harness power-user tool, not a managed product.

## Economic buyers

There is no direct monetization surface in this repo — no license file gating commercial use, no paid tier, no hosted service. The real spend sits upstream:

- **Claude API / Claude Max subscription (Anthropic).** Claude Code is billed per API usage or via a Max subscription. Any team adopting `agentic-skills` in Claude-only or hybrid mode is implicitly paying Anthropic.
- **OpenAI Codex CLI subscription (OpenAI).** Codex CLI billing covers codex-only and hybrid-mode execution.
- **Engineering time.** The dominant cost. Maintaining dual Claude/Codex mirrors under `global/` and `packs/*/{claude,codex}/` is a per-skill 2x cost, visible in the repo's `global/claude/<name>/SKILL.md` + `global/codex/<name>/SKILL.md` pairs.

In a team setting, the budget holder is whoever owns the "AI coding tooling" line — typically an engineering manager, head of platform, or founder/CTO at smaller shops. They are not the day-to-day user; they approve the CLI subscriptions the users depend on. `agentic-skills` itself is a zero-cost OSS overlay on top of those paid CLIs.

## Champions

Internal advocates who pull `agentic-skills` into a team look like:

- **Staff/principal engineers** who already standardize tooling (formatters, linters, CI config) and see skill packs as the same kind of shared asset.
- **DX / developer-tooling leads** chartered to improve AI-assisted workflows across a codebase. The pack model (`business-app`, `game`, `devtool`, `code-quality`, `*-kanban`) lets them treat agent skills as project artifacts rather than personal dotfiles.
- **Workflow-obsessed founders** who already curate custom slash commands and want a structured place to keep them — the `create-skill` → `pack promote` flow in `global/{claude,codex}/create-skill/` makes the repo a natural home for personal forks.

The champion profile is consistent: someone who cares about standardized, repeatable agent behavior and is willing to invest time learning a two-layer (global + pack) mental model.

## Maintainers

This is a single-user/OSS-library-style codebase. Observable maintainer surface:

- **Primary maintainer.** The user running these sessions (per `CLAUDE.md`, `tasks/history.md` cadence of near-daily updates, and `legeorge4@gmail.com` in session context). Owns roadmap decisions in `tasks/roadmap.md` and documentation shape in `docs/`.
- **Agent co-maintainers.** Claude and Codex themselves, per the workflow described in `CLAUDE.md` (`plan mode first`, `ship-one-step`, `commit-and-push-by-feature`). Commits are signed by the human but the task stream is agent-authored.
- **No external contributor process is documented.** There is no `CONTRIBUTING.md`, no issue template, no PR template. A drive-by contributor would need to read `CLAUDE.md` and the `docs/operating-modes.md` chain to figure out how to land a change. This is an adoption blocker (see below).

## Operators

"Operator" in the skill contract normally means SRE / platform / runbook-owner roles. In this repo's context that maps to:

- **Skill-pack operators.** Users running `scripts/pack.sh install|remove|refresh|status|set-mode` to wire a project into a pack. `scripts/pack.sh list-packs` (documented as an internal subcommand used by Codex `$run` routing) is the machine-facing operator surface.
- **Mode resolver operators.** Anyone reading `scripts/agent-mode.sh` output or setting `SKILLS_AGENT_MODE` in shell profiles. Typically the same person as the developer user.
- **Session-restart operators.** A named ergonomic cost: `README.md` and `docs/packs.md` both warn that `pack.sh refresh` does not hot-reload an already-running CLI — users must manually start a fresh Claude Code or Codex session after changing skills. This is a recurring operator chore, not a one-time setup.
- **Archive operators.** The archive-first replacement policy in research/spec skills (e.g. in `devtool-user-map/SKILL.md` § "Archive-First Replacement Policy") requires snapshotting old docs under `docs/history/archive/YYYY-MM-DD/HHMMSS/` before substantive rewrites. That is operator discipline, not tooling-enforced.

There is no production service to page on; operations are local to a developer's machine and repo.

## Use cases

Concrete workflows the repo already supports end-to-end:

- **Single-repo workflow standardization.** A developer installs `global/*` once, runs `scripts/pack.sh recommend` per project, and from then on has consistent `/plan`, `/run`, `/ship`, `/ship-end` (or `$plan`, `$run`, `$ship`, `$ship-end`) semantics across projects of different kinds.
- **Research-driven product development.** The `business-app`, `game`, and `devtool` packs ship a research chain (ICP / audience → journey → adoption → positioning → monetization → docs-audit). A founder validates a product concept through those sequential research skills before implementing.
- **Hybrid planner/executor delegation.** Claude interviews and plans; Codex executes. Mediated by the approval packet in `tasks/approved-plan.md` + `.agents/approved-plan.json`, with `/delegate` as the live Claude→Codex bridge and `/handoff --target=codex` as the async variant.
- **Archive-first research replacement.** Research skills snapshot old canonical docs to `docs/history/archive/YYYY-MM-DD/HHMMSS/` before rewriting, giving a provable chain of prior thinking without polluting the canonical path.
- **Behavior-preserving refactor campaigns.** The `code-quality` pack (`extract-shared-types`, `quality-sweep`) runs multi-day cleanup sweeps — audit-only by default, with explicit `fix` and `full` modes gating behavior changes.
- **Project-local launcher scripts.** Pack installation uses symlinks under `.claude/skills/` and `.codex/skills/`, so the same skill body serves both CLIs without duplication at the install site.
- **Ship-one-step handoff.** `/ship` enters plan mode, writes a self-contained next-step plan, and hands off to a clear-context implementation session that implements exactly one step before stopping at the next approval UI.

## Adoption blockers

Honest friction points visible in the repo itself — these are the reasons a curious developer might bounce before getting value:

- **Dual Claude/Codex maintenance tax.** Every non-Claude-only skill has two source files: `global/claude/<name>/SKILL.md` and `global/codex/<name>/SKILL.md`, or the pack equivalent. `docs/skill-next-step-contracts.md` and recent `tasks/history.md` entries (`$spec-drift fix packs/business-app/*/scale-audit`, `$spec-drift fix approval-packet references`) show the mirroring drifts in practice. Contributors must remember to update both sides.
- **Hybrid-mode prerequisites are multi-step.** To use `hybrid` mode a user must: install Claude Code, install Codex CLI, set `agent_mode` in `.agents/project.json` (or export `SKILLS_AGENT_MODE`), understand the approval-packet schema (`specs/approved-plan.schema.json`), and read `docs/operating-modes.md` end-to-end. That's a real cliff for first-time users.
- **Install is symlink-based and requires CLI restart.** `install.sh` and `scripts/pack.sh refresh` write filesystem symlinks; changes are not visible until the Claude Code or Codex session restarts. Documented but still a foot-gun — users assume hot reload and get confused.
- **Operating-modes document is long and dense.** `docs/operating-modes.md` is the authoritative reference, but it is also the longest single doc in the repo. The mode-signal precedence, approval-packet lifecycle, and per-skill degradation matrix take sustained reading. There is no shorter "5-minute start" version.
- **No CONTRIBUTING guidance.** New contributors have to infer the workflow from `CLAUDE.md` and scattered `tasks/*` files. The absence of an onboarding doc biases contribution toward the primary maintainer and the agent co-maintainers.
- **Asymmetric Claude-only surface is a stumbling block.** `/delegate` exists under `global/claude/` with no Codex mirror, which is correct given hybrid semantics but surprising. The recent `$reconcile-dev-docs fix skills-reference` session added README and skills-reference entries to name this asymmetry — prior to that, a Codex user could reasonably expect `$delegate` and get confused when it was missing.
- **Project designation file `.agents/project.json` is not always present.** The devtool research chain assumes it, but the file can be absent on a fresh checkout (it is in this repo at time of writing). Skills that key off project type degrade to guided recommendation flows, which is fine — but the docs don't always make the degraded path obvious.
- **Terminology overhead.** "Global", "pack", "skill", "operating mode", "approval packet", "archive-first", "implementation-safe vs review-only", "ship-one-step" — the vocabulary is rich and self-consistent but has no glossary in one place. A casual reader runs out of slots quickly.
- **No test harness for skill contracts.** `scripts/skill-deps.sh` and `scripts/skill-versions.sh` catch broken references and missing versions, but there is no test that asserts a skill's documented behavior matches its SKILL.md. Drift is caught by `spec-drift` and `reconcile-dev-docs` runs rather than CI — and per `CLAUDE.md`, "No GitHub Actions" is an explicit project rule, so there is no automated gate at all.
