# Devtool Monetization — agentic-skills

Scope: designs realistic monetization for this repository — the `agentic-skills` shared skill library for Claude Code and OpenAI Codex. Grounded in the prior devtool research chain (`research/devtool-user-map.md`, `research/devtool-integration-map.md`, `research/devtool-dx-journey.md`, `research/devtool-adoption.md`, `research/devtool-positioning.md`) and observable repo constraints (`README.md`, `CLAUDE.md`, `docs/operating-modes.md`, `docs/packs.md`, `scripts/pack.sh`, `install.sh`). This is not a generic SaaS pricing sheet.

Continuity: sixth step in the devtool research chain. The positioning artifact frames `agentic-skills` as a local-first workflow library, not a hosted agent platform. Monetization should preserve that trust claim: keep the core inspectable, local, and usable without telemetry or a managed control plane.

## Free / Open-Source Stance

The core repo should stay free and source-available by default. The product's strongest adoption loop is "clone, inspect, install, dogfood"; putting the global skills, pack mechanics, task-file protocol, or three-mode operating model behind payment would weaken the exact trust claims established in `research/devtool-positioning.md`.

Recommended stance:

- **Keep core skills free.** `run`, `ship`, `ship-end`, `roadmap`, `plan-phase`, `spec-drift`, `reconcile-dev-docs`, `pack`, and mode-resolution workflows should remain available in the public repo.
- **Keep pack architecture free.** Project-local packs are the extensibility primitive. Charging for the mechanism would reduce third-party pack authorship and make the repo feel like a gated prompt marketplace.
- **Do not add telemetry by default.** The adoption artifact explicitly notes that current activation metrics are local proxies from git/task history. Preserving "no hidden telemetry" is a monetization asset, not just a privacy posture.
- **Use commercial terms around services, maintained extensions, and support.** The monetizable surface should be expertise and operationalization, not local file access.

Open-source boundary:

- Free: global workflow skills, public domain packs, install/pack scripts, validation scripts, docs, research artifacts, approval-packet schema, and local task-file workflows.
- Commercial: private pack design, team onboarding, migration support, audits, maintained enterprise pack bundles, optional hosted registry/control-plane experiments, and support retainers.

## Packaging

Packaging should follow how value is actually realized: individual developers get value from local workflow discipline; teams pay when they need repeatability, onboarding, and shared maintenance.

### Package 1: Free Core

Audience: solo builders, power users, small OSS maintainers, and evaluators.

Includes:

- Global Claude/Codex skills.
- Public packs: `devtool`, `business-app`, `game`, `creator-media`, `code-quality`, and kanban variants.
- `install.sh`, `scripts/pack.sh`, `scripts/skill-deps.sh`, `scripts/skill-versions.sh`.
- Docs and research chain artifacts.

Purpose: maximize trust, adoption, examples, and contributions. This is the proof surface.

### Package 2: Team Enablement Kit

Audience: founders, staff engineers, DX leads, and small teams standardizing AI-assisted workflows.

Could be sold as a fixed-fee engagement or downloadable paid bundle.

Includes:

- Team onboarding guide customized to the team's repo conventions.
- Recommended `.agents/project.json` and pack set per repo.
- A private pack skeleton with mirrored Claude/Codex skill templates.
- Migration from ad hoc prompts into repo-local packs.
- Validation checklist for `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, `tasks/lessons.md`, and direct-to-primary or PR-based variants.
- One or two custom skills that encode team-specific planning, review, or release policy.

Why it fits: the adoption blockers are not "missing features"; they are terminology, contribution workflow, clone-path discipline, restart expectations, and mirror maintenance. A paid kit turns setup friction into a serviceable outcome.

### Package 3: Maintained Private Pack Subscription

Audience: teams that want the workflow but do not want to maintain pack drift.

Includes:

- A private pack repo or private directory branch maintained against upstream `agentic-skills`.
- Versioned updates for Claude/Codex mirrors.
- Periodic `spec-drift` / `reconcile-dev-docs` audits.
- Skill version bump enforcement and dependency scans.
- Quarterly pack review against team usage.

Pricing model: monthly retainer per team or per repo, not per seat. The value is maintenance and drift reduction, and the cost driver is number of packs/skills, not number of developers.

### Package 4: Advisory / Implementation Services

Audience: teams trying to standardize agent workflows quickly.

Includes:

- Workflow audit.
- Agent-mode recommendation (`claude-only`, `codex-only`, `hybrid`) based on actual subscriptions and availability.
- Conversion of existing prompts/runbooks into skills.
- Plan → run → ship adoption coaching.
- Contribution workflow design for teams that cannot use direct-to-primary.

Pricing model: fixed-scope project. This is likely the first real revenue path because it matches the current repo's shape without adding product infrastructure.

### Package 5: Optional Managed Layer

Audience: larger teams that want admin controls the current repo explicitly does not provide.

Only pursue after services prove repeated demand.

Possible features:

- Private skill/pack registry.
- Version pinning and update notifications.
- Policy checks for required sections, approval-packet compatibility, and mirror drift.
- Team-level inventory of enabled packs across repos.
- Optional local-first reporting generated from task/git history, uploaded only with explicit consent.

This is a different product. It should not distort the local-first core until repeated paid-services work proves the demand.

## Usage Limits

The free core should avoid artificial usage limits. There is no hosted compute, no API bill, and no server-side marginal cost in the current architecture. Rate limits would be fake friction.

Meaningful limits belong in paid support and maintained-pack contracts:

- Number of private repos covered.
- Number of custom packs maintained.
- Number of custom skills maintained per month.
- Response-time SLA for support.
- Frequency of drift audits.
- Number of onboarding or training sessions.
- Number of upstream compatibility updates included.

If a managed layer is later introduced, usage limits can map to hosted costs:

- Private registry seats.
- Repos tracked.
- Pack versions stored.
- Policy checks per month.
- Optional report retention period.

Avoid metering raw skill invocations unless there is a hosted runtime. Invocation metering conflicts with the current trust model and would be difficult to enforce without telemetry.

## Team Conversion

Conversion should be driven by the pain that appears after one or two developers succeed individually: how do we make everyone else use the same workflow without re-teaching it every week?

Conversion path:

1. **Individual proof.** A solo developer installs the free core, runs a few ship cycles, and accumulates visible `tasks/history.md` entries.
2. **Shared repo designation.** The developer commits `.agents/project.json` and has one teammate regenerate symlinks with `pack.sh refresh`.
3. **First team friction.** The team hits clone-path differences, CLI restart confusion, or "which pack do we use here?" questions.
4. **Enablement offer.** Sell a Team Enablement Kit that writes the missing onboarding, standardizes pack choice, and converts one team-specific workflow into skills.
5. **Maintenance offer.** Once custom skills exist, sell a Maintained Private Pack Subscription to keep Claude/Codex mirrors, docs, and version fields aligned.

Best buyer triggers:

- A team has more than one developer using Claude Code or Codex.
- The team already has copied prompt snippets or private slash commands.
- The team has several repos with different domains and wants context hygiene.
- A staff engineer or founder is already enforcing linters, templates, release docs, or architecture decision records.
- The team is experimenting with both Claude and Codex and wants hybrid handoff without inventing its own contract.

Weak buyer triggers:

- A team wants a hosted agent platform with admin analytics today.
- A team refuses task-file workflows.
- A team cannot use symlinks or local CLI tools.
- A team requires CI-enforced governance but will not fund the managed layer or internal integration work.

## Enterprise Triggers

Enterprise demand is plausible, but the current repo is not enterprise-ready. Treat enterprise as a services-led discovery path.

Triggers that justify an enterprise conversation:

- Need for a private skill registry or internal distribution path.
- Need to pin approved pack versions across many repos.
- Need for auditable policy checks without GitHub Actions.
- Need for Claude-only, Codex-only, and hybrid modes across uneven vendor access.
- Need to migrate an existing internal prompt library into a governed skill-pack structure.
- Need for custom contribution workflow because direct-to-primary is not acceptable.
- Need for legal/security review of no-telemetry local-first behavior.

What to avoid promising:

- Central RBAC in the current repo.
- Hosted audit dashboards.
- Vendor-neutral support beyond Claude Code and Codex.
- CI-enforced behavioral correctness of every skill.
- Zero-lock-in migration away from the skill format.

Enterprise packaging should be framed as "private workflow library implementation and maintenance" before it is framed as SaaS.

## Unit Economics

Current local-first distribution has favorable software margins but limited direct monetization leverage.

Cost drivers:

- Maintaining dual Claude/Codex mirrors for every paid custom skill.
- Keeping private packs aligned with upstream changes.
- Writing and updating onboarding docs.
- Running drift audits and fixing findings.
- Supporting shell, symlink, and CLI restart issues.
- Handling customer-specific git flow variants.

Low-cost assets:

- Public core repository distribution through git.
- Markdown skill format.
- Shell scripts with no hosted runtime.
- Local validation scripts.
- Reusable pack skeletons.

Best early economics:

- Fixed-scope enablement projects have the cleanest margin because the output is mostly docs, skills, and scripts.
- Monthly maintained-pack subscriptions create recurring revenue but require clear caps on custom skill count and audit cadence.
- A managed layer has higher upside but introduces support, security, hosting, auth, billing, and compliance costs that the current repo deliberately avoids.

Pricing anchors to test:

- **Team Enablement Kit:** fixed fee per team/repo rollout.
- **Custom Skill Pack:** fixed fee per pack, with extra cost for mirrored Claude/Codex variants and validation docs.
- **Maintained Pack Subscription:** monthly per team or repo, capped by number of custom skills and support SLA.
- **Enterprise Implementation:** custom statement of work for private registry, governance, migration, and training.

Avoid per-seat pricing for the local core. The buyer does not receive per-seat hosted value from this repo; the measurable value is standardized workflow and reduced agent rework.

## Monetization Risks

- **Gating the core would damage trust.** The strongest positioning claim is inspectable local-first workflow. Charging for basic access would make the repo feel less like infrastructure and more like a prompt marketplace.
- **Services can hide product gaps.** Early revenue from onboarding may mask repeatable product opportunities. Track repeated asks across engagements before building a managed layer.
- **Dual-mirror maintenance can erode margins.** Paid private packs double the edit and review surface unless the team explicitly accepts Claude-only or Codex-only scope.
- **Enterprise asks may pull away from the target user.** RBAC, dashboards, and central policy are valuable but can dilute the solo/small-team workflow that makes the repo compelling.
- **No-telemetry stance limits growth analytics.** This is a trust advantage, but it means activation must be inferred from customer-shared task/git history or optional reports.
- **Vendor dependence affects willingness to pay.** Buyers already pay Anthropic and/or OpenAI. The monetized offer must be clearly incremental: standardization, private workflow design, maintenance, and reduced rework.
- **Direct-to-primary defaults may block team adoption.** Teams with PR gates need a paid adaptation or documented variant before they will standardize on the workflow.
- **Symlink and restart friction becomes support load.** The same friction surfaced in adoption/DX research becomes a support cost in any paid offer.

## Recommended Monetization Path

1. Keep the public repo free and local-first.
2. Publish a short "Team Enablement Kit" offer around onboarding, pack selection, and first private skill pack.
3. Use those engagements to identify repeated private-pack maintenance needs.
4. Offer maintained private packs with explicit caps and drift-audit cadence.
5. Only consider a managed registry/control plane after several teams independently ask for version pinning, inventory, and policy checks.

Concise monetization thesis: `agentic-skills` should monetize the work of making agent workflows team-ready, not the local workflow library itself.
