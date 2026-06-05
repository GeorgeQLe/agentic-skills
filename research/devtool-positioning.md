# Devtool Positioning — agentic-skills

> **Terminology note (2026-06-05):** References to `install.sh` in this document reflect the installer name at time of writing. The script has since been renamed to `init.sh`. See `README.md` for current commands.

Scope: positions this specific repository — the `agentic-skills` shared skill library for Claude Code and OpenAI Codex — against the alternatives a developer actually considers. Grounded in observable repo signals (`README.md`, `docs/operating-modes.md`, `docs/packs.md`, `docs/skills-reference.md`, `CLAUDE.md`, `scripts/pack.sh`, `install.sh`, `tasks/history.md`) and the prior devtool research chain (`research/devtool-user-map.md`, `research/devtool-integration-map.md`, `research/devtool-dx-journey.md`, `research/devtool-adoption.md`). Not a generic positioning sheet for AI coding.

Continuity: fifth step in the devtool research chain. Assumes the audience from `research/devtool-user-map.md`, setup and compatibility constraints from `research/devtool-integration-map.md`, lived adoption sequence from `research/devtool-dx-journey.md`, and proof/adoption loops from `research/devtool-adoption.md`.

## Alternatives

The buyer does not compare `agentic-skills` to a blank page. They compare it to several already-available ways of making AI coding assistants behave consistently.

- **Raw Claude Code or Codex usage.** The default alternative is no shared skill library at all: open the CLI, type bespoke prompts, and rely on session memory or local project instructions. This is lowest setup cost and highest variance. It works for one-off work, but it does not create reusable planning, shipping, research, or self-improvement loops across repos.
- **Personal dotfiles and ad hoc slash commands.** A power user can keep private prompts under `~/.claude/skills`, `~/.codex/skills`, shell snippets, or repo-local Markdown files. This competes directly with `agentic-skills` for solo builders. It is more flexible, but weaker at shared conventions: no pack registry, no dual Claude/Codex mirror discipline, no shared task-file protocol, and no standard way to promote a private skill into a project-local pack.
- **Vendor-native project instructions.** `CLAUDE.md`, Codex instructions, and per-repo system prompts can encode local preferences. They are useful for broad behavioral defaults, but they do not package named workflows with outputs, validation steps, archive policies, and next-step routing. They are context, not a workflow library.
- **Generic prompt libraries.** Public prompt collections can give a user better wording for code review, planning, or research. They usually stop at prompt text. They do not install into both harnesses, inspect task state, update `tasks/history.md`, validate skill metadata, or ship changes through a direct-to-primary git contract.
- **Task runners and Makefiles.** Conventional scripts can enforce build, lint, test, deploy, or release commands. They are complementary, not a replacement. They execute known commands well, but they do not interview, plan, reconcile docs, choose the next incomplete step, or translate a project type into domain-specific agent behavior.
- **Hosted agent platforms and IDE agent extensions.** Tools such as IDE agents, hosted coding agents, or workflow automation platforms compete for the same "make the agent useful" budget. They offer tighter UI or cloud execution, but usually lock the user into a single vendor surface. `agentic-skills` instead assumes local CLI use, git as the distribution channel, and explicit support for Claude-only, Codex-only, and hybrid operation.
- **Internal platform-team prompt frameworks.** In a team, the real enterprise alternative is often a private repo of prompts plus onboarding docs. `agentic-skills` is closer to this than to a consumer app. Its differentiator is that it already ships the workflow substrate: packs, global skills, task docs, mode resolution, approval packets, validation scripts, and archive-first research policy.

## Unique Workflow Advantages

The strongest positioning is workflow-level, not feature-level. The repo wins when the user values a repeatable agent operating system more than a single clever prompt.

- **Two-layer skill surface.** Global core skills stay domain-neutral; project-local packs add domain assumptions only where they belong. A developer can keep `run`, `ship`, `spec-drift`, and `reconcile-dev-docs` everywhere while installing `devtool`, `business-app`, `game`, `creator-media`, `code-quality`, or kanban packs per repo.
- **Task-file driven execution.** `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, `tasks/phases/`, and related advisory files are not incidental docs. They are the work queue, the audit trail, and the resume surface. This gives agent sessions a stable handoff contract across time and across CLIs.
- **Plan → run → ship as the unit of progress.** The core workflow does not end at code generation. It requires planning, implementation, validation, task updates, history updates, commit, push, deploy when explicitly contracted, and next-step preparation. That is heavier than a raw prompt, but it turns sessions into finished increments.
- **Mode pluralism without dead ends.** The three-mode model (`claude-only`, `codex-only`, `hybrid`) accepts that users may have only one CLI, both CLIs, rate-limit constraints, or outages. The same repository can continue operating in each mode, with `/delegate` and `/handoff --target=codex` providing the hybrid bridge when both are available.
- **Approval-packet boundary for hybrid work.** Hybrid mode does not rely on vague "go do the thing" handoff text. It uses `.agents/approved-plan.json` and `tasks/approved-plan.md` with freshness checks, lifecycle states, dirty-path constraints, manual-task snapshots, and a Codex-side `--execute-approved` consumer.
- **Pack-aware specialization.** Devtool, business, game, code-quality, creator-media, and kanban packs create different behavior without polluting global context. That is the core context-hygiene promise: the right skills for this repo, not every skill everywhere.
- **Archive-first research discipline.** Research and spec skills require snapshots before substantive rewrites of canonical docs. That makes market, product, and planning thinking reviewable over time instead of silently overwritten.
- **Self-auditing maintenance surface.** Skills such as `spec-drift`, `reconcile-dev-docs`, `skill-deps.sh`, and `skill-versions.sh` make the library inspect itself. The repo treats drift as normal and gives the agents explicit tools to find and repair it.

## Ecosystem Fit

`agentic-skills` fits developers who already accept local-first AI coding, git-centric workflows, and explicit task files.

- **Best fit: power users of Claude Code and/or Codex CLI.** The ideal user is comfortable with shell, git, symlinks, Markdown, and repo-local process docs. They do not need a hosted UI to see value; they want their local agents to behave more consistently.
- **Best fit: solo builders and small teams.** The direct-to-primary shipping contract, task-file protocol, and pack install model are well matched to one-person or small-team repos where speed and consistency matter more than formal PR gates.
- **Best fit: teams standardizing AI-assisted workflows.** A staff engineer, DX lead, or founder can treat packs like linters or editor config: shared repo assets that encode how the team wants agents to plan, research, ship, and recover.
- **Best fit: multi-repo operators.** The two-layer model is useful when the same developer moves between SaaS, devtool, game, media, and refactor projects. Global skills provide the common operating system; packs provide project-specific language.
- **Weak fit: teams that need managed SaaS controls.** There is no hosted admin UI, central policy server, telemetry, permissions dashboard, or package registry. A team that needs those should treat this as a reference implementation or private fork, not an out-of-the-box enterprise platform.
- **Weak fit: users who dislike visible process.** The value comes from task docs, plans, histories, and explicit validation. Users who want a silent autocomplete-style assistant will see the workflow as too heavy.
- **Weak fit: non-POSIX or non-symlink environments.** The install and pack mechanics assume bash and symlinks. Windows without WSL, synced home directories, and ephemeral containers are fragile environments for this model.

## Trust Claims

The credible trust claims are all evidence-backed by the repo. Claims that depend on broad adoption, formal security review, or enterprise support should not be made yet.

- **Claim: local-first and inspectable.** Skills are Markdown files, scripts are shell scripts, project designation is JSON, and the runtime is the checkout. A user can inspect every behavior before installing it.
- **Claim: no hidden telemetry.** The repo does not phone home through `install.sh`, `scripts/pack.sh`, or the skills. Adoption metrics discussed in `research/devtool-adoption.md` are local proxies from git history and task files, not network instrumentation.
- **Claim: self-dogfooded.** The repository uses its own workflows to maintain itself. `tasks/history.md` records the shipped steps, and the devtool research artifacts in `research/` are produced by the devtool pack being positioned here.
- **Claim: explicit validation exists for skill metadata.** `scripts/skill-deps.sh --broken` and `scripts/skill-versions.sh --missing` catch broken references and missing version fields. This is not full behavioral testing, but it is stronger than an unvalidated prompt folder.
- **Claim: mode and handoff boundaries are documented.** `docs/operating-modes.md` defines the three modes, resolver precedence, approval packet, lifecycle, and degraded-path audit. Hybrid delegation is not an implicit convention.
- **Claim: reversible install shape.** `install.sh --uninstall` removes repo-managed global links, and `scripts/pack.sh remove` removes project-local pack links. User-authored skills are not removed by global uninstall.

Claims to avoid or qualify:

- **Do not claim enterprise-ready governance.** There is no centralized auth, policy, audit dashboard, or role-based permission model.
- **Do not claim broad community proof.** There is no documented community channel, public usage metric, testimonials list, or release cadence.
- **Do not claim CI-enforced behavior.** The project explicitly avoids GitHub Actions, and the existing scripts validate metadata and references rather than the behavioral contract of every skill.
- **Do not claim zero lock-in.** The repo is intentionally tied to Claude Code and Codex CLI, with skills written for those harnesses and symlink installs pointing back to one checkout.

## Switching Cost

Switching into `agentic-skills` is cheap for a single user who already has a supported CLI, but the cost rises with team size and custom skill count.

- **Install cost is low.** Clone, run `./install.sh`, install a pack per project, restart the CLI. For a shell-comfortable user this is a short setup path.
- **Mental-model cost is medium to high.** Users must learn global vs pack, task docs, plan-mode-first, ship-one-step, operating modes, approval packets, archive-first research, and direct-to-primary shipping. This vocabulary is the main adoption cliff.
- **Workflow migration cost is medium.** A repo without `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/history.md` needs to adopt tasks-as-docs before `$run` is useful. The tool is strongest once the project accepts that work is planned and resumed through those files.
- **Team rollout cost is medium.** Teams must commit `.agents/project.json`, regenerate symlinks per checkout, standardize the `agentic-skills` clone location or tolerate refresh churn, and teach CLI restart behavior.
- **Customization cost compounds.** Teams writing their own skills usually need Claude and Codex mirrors. That 2x maintenance tax is real, and drift must be caught through `spec-drift`, `reconcile-dev-docs`, or disciplined review.
- **Switching away is possible but not free.** Skills are Markdown, task docs are normal files, and there is no proprietary data store. But projects that internalize the task-file protocol and custom packs will need to port those workflows into a new harness if they leave Claude Code/Codex CLI.

## Positioning

### Short Positioning

`agentic-skills` is a local-first workflow library for developers who want Claude Code and Codex to plan, execute, validate, and ship through the same repeatable project protocol.

### One-Sentence Pitch

For AI-coding power users and small teams, `agentic-skills` turns raw Claude Code and Codex sessions into a shared plan → run → ship operating system with project-local packs, task-file memory, and explicit hybrid handoff.

### Homepage-Style Copy

Stop rebuilding your agent workflow in every chat. `agentic-skills` installs a stable set of global skills, lets each repo opt into the packs it needs, and keeps work moving through task docs, validation, history, commits, and next-step plans.

Use Claude only, Codex only, or both together. The same repo can keep working in each mode, and hybrid delegation moves through a checked approval packet instead of a vague handoff prompt.

### Differentiated Claims

- **Not a prompt dump:** a workflow system with task state, validation, shipping, and history.
- **Not a single-vendor bet:** first-class Claude-only, Codex-only, and hybrid paths.
- **Not every skill everywhere:** global core plus project-local packs.
- **Not hidden automation:** local files, visible scripts, inspectable Markdown, no telemetry.
- **Not just planning:** the default contract is to ship mutations, update docs, commit, push, and prepare the next step.

### Best Tagline Candidates

- "Shared workflows for Claude Code and Codex."
- "A local operating system for AI coding sessions."
- "Plan, run, ship, and resume across AI coding CLIs."
- "Project-local skills for repeatable agent work."

### Avoided Positioning

- **"AI agent framework."** Too broad and implies runtime orchestration infrastructure this repo does not provide.
- **"Prompt library."** Too small; misses task docs, pack management, approval packets, and shipping.
- **"Enterprise AI coding platform."** Overclaims governance, hosted controls, and support posture.
- **"Claude/Codex compatibility layer."** Too technical and undersells the workflow outcome.
- **"Autonomous coding system."** Misleading; the repo is opinionated about planning, approval, validation, and explicit user-controlled handoff.
