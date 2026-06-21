# Managed Skill Library SaaS - Idea-Scope Prompt

Use this prompt in the separate skill-library product repo:

```text
$idea-scope-brief managed-skill-library-saas

We are exploring a spin-off product inspired by the `skillpacks` / `@glexcorp/gskp` npm package from the agentic-skills repo.

The rough product idea: a managed SaaS for companies, agencies, consultants, developer-platform teams, and AI transformation teams that want to create, govern, white-label, distribute, and update their own agent skills and skill libraries without operating a local package/repo workflow themselves.

This is not yet an ICP decision. Treat all audiences below as hypotheses. The goal of this run is to produce a pre-ICP idea brief that clarifies the concept, problem hypothesis, beneficiary hypothesis, value wedge, constraints, non-goals, and riskiest unknowns before we run ICP or competitive-analysis skills.

## Existing Product Inspiration

The source product inspiration is the current `skillpacks` package:

- It is a CLI and packaged Markdown skill library for Claude Code and OpenAI Codex.
- It installs base skills and project-local packs into `.claude/skills/`, `.codex/skills/`, and `.agents/project.json`.
- It supports `init`, `install`, `install-deck`, `refresh`, `status`, `doctor`, `which`, `pin`, `unpin`, and alignment-page tooling.
- It treats `SKILL.md` as the core authoring format, with pack/deck composition, version pinning, project-local roots, and repo-governed workflows.
- It currently assumes technical users can run npm/CLI commands and manage repo-local generated skill roots.

The SaaS spin-off should preserve the best parts of that model, but test whether there is demand for a managed control plane:

- browser-based skill authoring and review
- customer-owned private skill registry
- branded/white-labeled public or private library pages
- generated install commands and docs
- Claude/Codex/Cursor/GitHub Copilot/Windsurf-compatible packaging targets
- versioning, changelogs, approvals, deprecation, rollback, and pinning
- import from GitHub repos or existing skill folders
- export to GitHub, npm, `.well-known`, zip, or direct agent install targets
- security/audit workflow for executable scripts and prompt-injection risk
- team/admin controls, permissions, environments, analytics, and adoption reporting

## Research Packet To Use As Context

Treat the following as initial market context, not validation.

### skills.sh competitor context

- skills.sh positions itself as "The Open Agent Skills Ecosystem" and "The Agent Skills Directory."
- It lets users install open skills with commands such as `npx skills add <owner/repo>`.
- It supports many agent surfaces, including Claude Code, Cursor, Codex, GitHub Copilot, Windsurf, Gemini, Cline, AMP, VS Code, Zed, and others.
- Its homepage shows a leaderboard with install counts, trending/hot views, and visible ecosystem scale.
- Its docs say rankings are based on anonymous telemetry collected by the `skills` CLI when users install skills.
- Its API offers programmatic access to listing, search, curated official skills, detail/file-tree endpoints, and audit results.
- Its security page combines audit results from providers such as Gen Agent Trust Hub, Socket, and Snyk, but the docs also state they cannot guarantee every skill's quality or security and users should review skills before installing.
- Its official-skills page lists makers such as Anthropic, Microsoft, Vercel, OpenAI, Cloudflare, Supabase, GitHub, Firebase, Stripe, Sentry, and many others.

Initial inference: skills.sh is strong at public discovery, open ecosystem telemetry, CLI install, catalog APIs, and public security metadata. It does not obviously present itself as a managed white-label SaaS for a customer to create and operate its own private/branded skill library with governance workflows.

Source URLs checked:

- https://www.skills.sh/
- https://www.skills.sh/docs
- https://www.skills.sh/docs/cli
- https://www.skills.sh/docs/api
- https://www.skills.sh/audits
- https://www.skills.sh/official

### Agent Skills standard context

- agentskills.io describes Agent Skills as a standardized way to give AI agents new capabilities and expertise.
- Its docs cover client implementation, creator best practices, evaluation, description optimization, scripts in skills, and the format specification.

Initial inference: standardization creates an opening for tooling that is agent-neutral and export-oriented, instead of tied to one model vendor or one directory.

Source URLs checked:

- https://agentskills.io/
- https://agentskills.io/llms.txt

### Claude Skills context

- Claude Code docs say skills extend Claude with a `SKILL.md` file and optional supporting files.
- Claude Code supports personal, project, enterprise, and plugin skill locations.
- Claude Code skills follow the Agent Skills open standard and add Claude-specific features such as invocation control, subagent execution, dynamic context injection, and tool approval.
- Skills load only when used, which makes long reference material cheaper than always-loaded project instructions.

Initial inference: Anthropic is legitimizing skills as a native agent capability, but there may still be tooling gaps around cross-tool packaging, customer-branded registries, governance, and operational lifecycle management outside Claude's own product boundary.

Source URL checked:

- https://docs.anthropic.com/en/docs/claude-code/skills

### OpenAI / custom GPT and agent context

- OpenAI's GPT help docs describe GPT knowledge uploads, capabilities, apps, and actions. Knowledge is for reference material, instructions govern behavior, and actions connect a GPT to external APIs.
- OpenAI's current platform docs emphasize building, evaluating, deploying, and scaling agents, including tools, safety checks, workload identity, deployment checklists, and evals.

Initial inference: OpenAI has strong first-party custom GPT and agent-builder surfaces, but those are not the same as a customer-owned, cross-agent skill library registry that exports standard `SKILL.md` packages across Claude Code, Codex, Cursor, Copilot, and similar developer agents.

Source URLs checked:

- https://help.openai.com/en/articles/8554397-creating-a-gpt
- https://platform.openai.com/docs/guides/agents

### Broader market signals

- Recent research and market coverage point to fast growth in public skill marketplaces, ecosystem homogeneity/redundancy, safety risk, and the need for skill organization, orchestration, verification, and governance.
- One 2026 paper analyzed 40,285 publicly listed skills and found category concentration, supply-demand imbalance, redundancy, and non-trivial safety risks.
- Another 2026 paper frames skill ecosystem management around organizing, selecting, orchestrating, and benchmarking agent skills at scale.
- Recent security research highlights malicious or dynamic skill attacks as an emerging supply-chain issue for agentic AI.

Initial inference: "managed governance for reusable agent skills" may be a more defensible wedge than "skill marketplace." The buyer pain may be internal trust, lifecycle, compliance, adoption, and distribution rather than public discovery alone.

Source URLs checked:

- https://arxiv.org/abs/2602.08004
- https://arxiv.org/abs/2603.02176
- https://arxiv.org/abs/2606.16287

## Concept Hypothesis

Managed Skill Library SaaS is a control plane for reusable agent skills.

Customers can create a branded private or public skill library, author skills through guided workflows, package them for multiple agent clients, approve/version/sign/audit releases, publish install surfaces, and track adoption.

The product may have two modes:

1. Internal library mode: teams govern their own private skills for employees and projects.
2. White-label publisher mode: consultants, agencies, vendors, and devtool companies publish branded skill libraries for customers or communities.

Do not assume both modes should ship together. Treat this as a segmentation question for ICP.

## Problem Hypotheses

- Teams are creating reusable AI-agent instructions, prompts, workflows, scripts, and conventions, but they are scattered across repos, docs, GPTs, Claude project settings, personal snippets, and Slack messages.
- Public directories help discovery but do not solve customer-owned governance, private distribution, branded presentation, review workflows, versioning, or rollback.
- Technical package workflows are powerful but too operationally heavy for many buyers who want to author and distribute skills as a product or internal enablement asset.
- Agent/vendor fragmentation makes skill distribution hard: one organization may need Claude Code, Codex, Cursor, Copilot, Windsurf, and internal agent runners.
- Skills with scripts create supply-chain and compliance risk. Buyers may need audit trails, approvals, permission boundaries, provenance, and safe installation surfaces.

## Beneficiary Hypotheses

Possible beneficiaries to test later:

- Developer relations or developer-platform teams that want official product skills for their SDK/API/cloud/tool.
- AI enablement teams inside companies that need internal reusable workflows and governed adoption.
- Agencies or consultants that want to package proprietary operating methods as customer-branded skill libraries.
- SaaS vendors that want a branded skill hub for customers using coding agents or workplace agents.
- Security/compliance teams that need visibility and control over agent skills installed across projects.

Do not pick one yet. The idea brief should identify which assumptions matter most for ICP.

## Product Category Guesses

Possible category frames:

- Managed skill registry for AI agents
- White-label agent-skill library platform
- Agent skill CMS plus package registry
- Governance and distribution layer for enterprise agent skills
- Developer-marketing product for publishing official AI-agent skills

Ask whether the first concept should be framed as a SaaS control plane, a publishing platform, or a governance product.

## Value Wedge Hypotheses

Potential wedge against skills.sh:

- skills.sh is the public directory; this product is the customer's managed/private/branded skill library.
- skills.sh installs open skills; this product helps customers create, review, version, sign, publish, and operate their own skills.
- skills.sh has leaderboard/audit metadata; this product adds authoring workflows, approval gates, private teams, lifecycle controls, cross-agent packaging, analytics, and white-label pages.

Potential wedge against the existing `skillpacks` npm package:

- `skillpacks` is powerful for technical users and repo workflows; the SaaS makes skill-library operations accessible to teams that want a managed UI, collaboration, governance, analytics, and customer-facing distribution.
- The SaaS can still export to npm/GitHub/standard skill folders rather than replacing the CLI.

## Constraints

- Preserve `SKILL.md` and the Agent Skills standard as the core artifact wherever possible.
- Prefer exportability and no lock-in as a strategic differentiator.
- Assume early product should integrate with GitHub and npm before inventing a proprietary runtime.
- Treat security and governance as first-order, not enterprise add-ons.
- Avoid building a generic prompt marketplace unless research proves that is the stronger wedge.
- Do not assume this should be a full agent runtime, MCP marketplace, or hosted automation platform.

## Non-Goals For The First Concept

- Do not build another undifferentiated public skill leaderboard.
- Do not create a general GPT Store competitor.
- Do not require customers to abandon GitHub, npm, or existing agent-specific skill folders.
- Do not make the first product depend on training or fine-tuning models.
- Do not define implementation architecture yet.
- Do not run ICP, competitive analysis, UI design, roadmap, or pricing in this skill run.

## Riskiest Unknowns

- Is the buyer pain strongest for authoring, governance, white-label publishing, install distribution, analytics, or security?
- Who is most likely to pay: devrel/devtool vendors, internal AI enablement, agencies, enterprise platform teams, or security/compliance?
- Is skills.sh likely to expand into managed/private/white-label libraries quickly?
- Are customers willing to manage "skills" as durable assets, or do they see them as disposable prompts?
- Does cross-agent compatibility matter enough to pay for, or will first-party ecosystems win?
- What minimum proof would show that managed SaaS beats a polished open-source CLI plus docs?
- Which artifact should be the durable system of record: GitHub repo, npm package, SaaS registry, or all three synced?
- What trust model is required for executable scripts inside skills: scan-only, approval workflow, signing, sandboxing, or policy enforcement?

## Desired Output From idea-scope-brief

Produce a pre-ICP idea brief with:

- concept summary
- problem hypothesis
- beneficiary hypothesis
- product/category guess
- value wedge
- constraints
- non-goals
- assumptions and unknowns
- ICP readiness
- next steps

Also include a Market Structure Handoff if this appears multi-sided. Candidate sides might include:

- skill-library operators/publishers
- skill authors/reviewers
- skill installers/end users
- downstream customers/communities
- agent/client ecosystems

Keep those as hypotheses. Do not decide buyer vs user yet.

Before writing canonical artifacts, follow the idea-scope-brief skill's normal alignment-page approval flow in this repo.
```

## Research Synthesis

The strongest initial gap is not a public catalog gap. skills.sh already has public discovery, broad client compatibility, install telemetry, API access, official-skill surfacing, and security-audit aggregation. The plausible SaaS gap is customer-owned operation of skill libraries: authoring, review, white-label publishing, private access control, governance, versioning, security workflow, analytics, and export to multiple agent clients.

The prompt intentionally keeps two possible wedge shapes alive:

- **Internal governance:** enterprises and AI enablement teams need a trusted private registry and lifecycle controls.
- **White-label publishing:** agencies, consultants, SaaS vendors, and devrel teams need branded libraries they can ship to customers.

Those should be separated during ICP rather than blended into one generic target customer.

## Sources

- skills.sh homepage: https://www.skills.sh/
- skills.sh docs: https://www.skills.sh/docs
- skills.sh CLI docs: https://www.skills.sh/docs/cli
- skills.sh API docs: https://www.skills.sh/docs/api
- skills.sh audits: https://www.skills.sh/audits
- skills.sh official skills: https://www.skills.sh/official
- Agent Skills docs index: https://agentskills.io/llms.txt
- Claude Code skills docs: https://docs.anthropic.com/en/docs/claude-code/skills
- OpenAI GPT creation docs: https://help.openai.com/en/articles/8554397-creating-a-gpt
- OpenAI Agents docs: https://platform.openai.com/docs/guides/agents
- Agent Skills ecosystem analysis: https://arxiv.org/abs/2602.08004
- AgentSkillOS paper: https://arxiv.org/abs/2603.02176
- Dynamic malicious skills paper: https://arxiv.org/abs/2606.16287
