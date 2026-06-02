---
name: afps-status
description: Summarize AFPS product-workflow progress from existing artifacts and recommend the next concrete skill command
type: analysis
version: v0.0
argument-hint: "[optional project path, product path, or focus]"
---

# AFPS Status

Invoke as `/afps-status`.

Use this skill when the user asks where a product project is in the AFPS workflow, what research/planning/implementation artifact is missing next, whether task docs match product evidence, or which AFPS command should run next.

AFPS here means the product workflow from raw idea through concept scoping, ICP/research, lifecycle/growth planning, specs, roadmap/phase work, implementation, validation, and shipping. This is read-mostly reconciliation. It summarizes existing artifacts and recommends a route; it does not create a competing workflow state system.

## Workflow

1. Resolve target project:
   - Default to the current working directory.
   - If `$ARGUMENTS` names a path, inspect that project.
   - If `$ARGUMENTS` names a product path, app, ICP, or focus, prioritize matching artifacts under `research/`, `specs/`, `tasks/`, and `alignment/`.
   - Confirm whether the target is a git worktree when possible. Continue with filesystem evidence if git is unavailable.
2. Read project orientation:
   - `.agents/project.json`
   - `README.md`, `AGENTS.md`, `CLAUDE.md`
   - package/workspace manifests and obvious app entrypoints when needed to understand whether implementation exists.
   - Use `scripts/pack.sh list-packs` when available to determine enabled packs; do not grep `.agents/project.json` directly when choosing installed-pack routes.
3. Inspect AFPS evidence from existing artifacts:
   - Product-path state: `research/.progress.yaml`, including legacy `active_path` normalized mentally to `active_paths`.
   - Concept artifacts: `research/idea-brief*.md`, app-scoped `research/*/idea-brief*.md`, and concept/interview notes.
   - Discovery artifacts: ICP docs, competitive analysis, customer feedback, journey/lifecycle maps, value-prop canvas, positioning, lean canvas, market evidence, and assumption/risk trackers.
   - Lifecycle/growth artifacts: onboarding, activation, retention, conversion, monetization, GTM, growth model, metrics, PMF, and experiment docs.
   - Product/spec artifacts: `specs/`, `spec.md`, app/feature specs, UX/UI/prototype/UAT/consolidation notes, and alignment pages under `alignment/`.
   - Execution artifacts: `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, `tasks/phases/`, and recent validation notes.
   - Git evidence: `git status --short`, current branch/upstream, last relevant commits, unpushed commits, and changed files.
4. Reconcile evidence instead of trusting one file:
   - Distinguish missing artifacts, stale artifacts, contradictory artifacts, completed work, active implementation tasks, manual blockers, unvalidated implementation, and unshipped local changes.
   - Treat `research/.progress.yaml` as a manifest of product/app/ICP focus, not as the source of truth over concrete artifacts.
   - If product-path manifest entries are missing or stale, report the exact proposed update in prose. Do not write `research/.progress.yaml` unless the user explicitly asks for mutation.
   - If task docs contradict research/spec/code/git evidence, call out the contradiction and route to reconciliation rather than choosing whichever artifact is newest.
5. Classify AFPS stage:
   - `unscoped`: no concept brief or the concept is too unclear for ICP.
   - `concept-ready`: concept exists but discovery pack/skills are not enabled.
   - `icp-needed`: concept exists and discovery skills are enabled, but ICP is absent or not specific enough.
   - `research-incomplete`: ICP exists but market, competitive, value, positioning, journey, or lifecycle evidence is missing.
   - `lifecycle-gap`: discovery exists but onboarding, conversion, activation, retention, monetization, GTM, or metrics questions block spec quality.
   - `spec-needed`: research is sufficient but durable product/spec artifacts are absent or stale.
   - `roadmap-needed`: research/spec artifacts exist but `tasks/roadmap.md` or `tasks/todo.md` is missing, stale, contradictory, or not actionable.
   - `execution-ready`: a clear unchecked implementation task exists with no blocking manual task.
   - `ship-needed`: implementation changes are present, completed, or unpushed but validation, task review, commit, push, or deploy packaging is pending.
   - `reconcile-needed`: artifacts conflict enough that the next step should be reconciliation before new research or implementation.
6. Choose the next route with these rules:
   - No concept brief or unclear concept: `/idea-scope-brief`
   - Concept exists but business discovery is missing: `/pack install business-discovery`
   - Concept exists and discovery is enabled, but no ICP: `/icp`
   - ICP exists but market/value evidence is missing: the most specific discovery command, usually `/competitive-analysis`, `/value-prop-canvas`, or `/positioning`
   - Journey/lifecycle/growth questions are missing after discovery: recommend the relevant installed command, or the required pack install first, such as `/pack install customer-lifecycle` or `/pack install business-growth`
   - Research/specs exist but task queue is stale or absent: `/roadmap`
   - Clear executable task exists: `/exec`
   - Implementation is done but unvalidated, dirty, uncommitted, unpushed, or otherwise unshipped: `/ship`
   - Contradictory research/spec/task evidence: `/reconcile-research` when business-ops is enabled, `/spec-drift` when agent-work-admin is enabled, otherwise `/codebase-status` with a focused prompt naming the contradiction.
7. Validate command availability before recommending pack-local routes:
   - Use `scripts/pack.sh list-packs` when present to detect enabled packs.
   - If the best command lives in an uninstalled pack, recommend the pack install command instead of the unavailable command.
   - If `scripts/pack.sh` is missing or pack lookup fails, silently fall back to the global/default route and mention the degraded lookup only if it changes confidence.

## Output

Produce a concise structured report with:

- **Overview:** repo path, product/app focus, git status, enabled packs, and whether AFPS evidence is single-path or multi-path.
- **Artifact Map:** concept, ICP/research, lifecycle/growth, specs/prototypes/UAT, tasks, alignment pages, and shipping evidence with present/missing/stale status.
- **AFPS Stage:** one stage label from the workflow above, with confidence and evidence.
- **Contradictions And Gaps:** conflicting artifacts, missing product-path manifest updates, stale task queues, manual blockers, validation/shipping gaps, and uncertainty.
- **Recommended Route:** the next concrete work item and why it is the narrowest route.

End with exactly:

```md
**Next work:** <specific AFPS step or blocker>
**Recommended next command:** <one command or route>
```

## Constraints

- Read-only by default. Do not modify workflow state, task docs, research docs, specs, or git state unless the user explicitly asks for mutation.
- Do not create a new AFPS state file or schema. Use existing artifacts, especially `research/.progress.yaml`, `research/`, `specs/`, `tasks/`, `alignment/`, and git.
- Propose missing `research/.progress.yaml` updates in the report instead of writing them by default.
- Do not run expensive tests, installs, web research, deploys, or external-account actions during status synthesis.
- Do not treat `tasks/record-todo.md` or `tasks/recurring-todo.md` as execution queues unless an item has clearly been promoted into `tasks/todo.md`.
- Do not route agent-executable repo work to `/guide`; reserve guided/manual routes for human-only blockers.
- Do not create or modify GitHub Actions workflows.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/afps-status-{topic}.html`.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- This skill is normally read-only and should not create or modify tracked repository files.
- If the user explicitly asks this skill to create or modify tracked files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, production deploy confirmation, paid actions, or public visibility changes.
