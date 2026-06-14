# Skill Anatomy

This repository uses a versioned skillpack layout:

- Base skills live under `base/{claude,codex}/<skill>/SKILL.md`.
- Pack skills live under `packs/<pack>/{claude,codex}/<skill>/SKILL.md`.
- Archived versions live under `archive/<version>/SKILL.md` inside the owning skill directory.

Keep this structure. It supports agent-specific command syntax, pack installation, pinning, benchmarks, generated showcase data, and historical audits.

## First Time?

If you are creating your first skill, use `/skill-interview` (Claude) or `$skill-interview` (Codex) for a guided flow. For bulk creation from a workflow gap, use `/create-agentic-skill` or `/targeted-skill-builder`.

### Minimal SKILL.md Template

```yaml
---
name: my-skill
description: One-line trigger description for when this skill should activate
version: v0.0
---

# My Skill

What this skill does in one sentence.

## Output

Describe what this skill produces: file writes, research artifacts, task updates, etc.
```

Required frontmatter: `name`, `description`, `version`. Everything else is optional. See below for the full field reference.

## Frontmatter

Every active `SKILL.md` must include YAML frontmatter with:

- `name`: the command or skill identifier.
- `description`: a concise trigger description.
- `version`: repository skill version in `vMAJOR.MINOR` form, usually `v0.x`.

Allowed optional fields include:

- `type`: broad workflow category used by repo tooling. Preserve it for workflow semantics: `planning`, `research`, `analysis`, `execution`, `review`, `shipping`, `ops`, or `router`.
- `context_intake`: how much user/project context the skill gathers before producing output. Values: `deep`, `scoped`, or `artifact_only`. See `docs/interview-convention.md`.
- `visual_tier`: alignment-page rendering tier. Values: `document`, `visual`, or `prototype`.
- `argument-hint`: a short invocation hint for commands that usually take an argument.
- `invocation`: one of `primary`, `chained`, `sub-skill`, or `orchestrator`. See [Invocation Types](#invocation-types) below. Defaults to `primary` when absent — only add explicitly for non-primary skills.
- `parent`: names the parent skill for sub-skills (e.g., `parent: positioning`). Used by the `/skills` browser to show sub-skills indented under their parent. Only valid when `invocation: sub-skill`.

Do not add new frontmatter keys unless a generator, installer, benchmark, or documented workflow consumes them.

## Versioning

New skills start at `version: v0.0`.

For substantive behavior or output changes:

1. Run `bash scripts/skill-archive.sh <skill-dir>` before editing the active contract.
2. Bump the active `version:` decimal, for example `v0.0` to `v0.1`.
3. Update `CHANGELOG.md` in the same skill directory.

Behavior-preserving refactors do not need a version bump. Archived `SKILL.md` snapshots are historical records; do not normalize or rewrite them as part of active-skill cleanup.

## Changelog And Archive Rules

If a skill has any `archive/<version>/SKILL.md` entry, it must have `CHANGELOG.md`.

`CHANGELOG.md` must include a heading for every archived version:

```md
# Changelog

## v0.1

- ...

## v0.0

- Archived previous skill contract.
```

The archive audit is the owner for historical integrity:

```sh
bash scripts/skill-archive-audit.sh --strict
```

General active-skill audits should ignore `archive/` unless they are explicitly checking archive integrity.

## Mirrors

When a skill exists for both Claude and Codex, keep behavior, routes, versioning, archives, and changelog entries in sync unless the difference is agent-specific. Agent-specific command syntax is expected: Claude uses slash commands, Codex uses dollar commands.

## Progressive Disclosure

Keep hard gates, stop rules, routing contracts, safety constraints, and required output shape directly in `SKILL.md`.

Move reusable or bulky detail into one-level helper files only when it is not always needed at invocation time:

- `references/` for examples, rubrics, templates, policy detail, or long domain background.
- `scripts/` for repeatable checks, generators, migrations, or setup helpers.
- `assets/` for static fixtures or visual/source assets.

Prefer one-hop references from `SKILL.md`. Avoid deep reference chains that make the active contract hard to audit.

## Invocation Types

Every skill has an invocation type that describes how it enters a workflow. The full classification lives in `docs/skill-invocation-types.md`.

| Type | Frontmatter value | Description |
|------|-------------------|-------------|
| **Primary** | `primary` (default) | User invokes directly as a workflow entry point. No `invocation:` field needed. |
| **Chained** | `chained` | User invokes, but typically after another skill recommends it. The recommending skill names the artifact or condition that makes invocation valid. |
| **Sub-skill** | `sub-skill` | Agent invokes automatically via a parent router or auto-invocation. User rarely invokes directly. Requires `parent:` field naming the parent skill. |
| **Orchestrator** | `orchestrator` | Coordinates execution of other skills. User invokes to drive work forward. Examples: `/exec`, `/ship`, `/positioning`. |

### Frontmatter examples

Primary (implicit — no extra fields needed):
```yaml
name: idea-scope-brief
description: Shape a rough project idea into a scoped brief before ICP and market research
version: v0.0
type: planning
context_intake: deep
visual_tier: document
```

Sub-skill with parent:
```yaml
name: jtbd-positioning
description: Jobs to Be Done positioning framework
version: v0.0
invocation: sub-skill
parent: positioning
```

Orchestrator:
```yaml
name: exec
description: Execute next plan step...
version: v0.5
invocation: orchestrator
```

## Delegation Patterns

Three patterns exist for skill-to-skill delegation. Choose based on what the user needs to know and whether the delegated work involves judgment. For orchestrator-specific conventions (framework decomposition, intent routing, detect-and-route), see `docs/orchestrator-convention.md`.

### Pattern 1: Parent Router (positioning model)

A parent skill detects context, presents methodology choices, and delegates execution to child sub-skills. The parent handles synthesis after child skills complete.

**Structure:**
```
packs/<pack>/claude/<parent>/SKILL.md          # router + synthesis
packs/<pack>/claude/<parent>/frameworks/
  <child-a>/SKILL.md                           # invocation: sub-skill, parent: <parent>
  <child-b>/SKILL.md
```

**When to use:**
- A skill has 3+ distinct methodologies or frameworks the user should choose between.
- Each methodology is independently complex enough to warrant its own contract.
- The parent adds value beyond dispatching — it synthesizes outputs across frameworks.

**Exemplar:** `positioning` routes to `category-design`, `jtbd-positioning`, `moore-positioning`, `obviously-awesome`, and `strategic-canvas`, then synthesizes their outputs into unified positioning.

**Advancing through the children.** Pattern A research orchestrators advance through their sub-skills with the **Research Session Loop** — each invocation runs one heavy phase (interview, one framework, or synthesis) and stops, and the parent re-invokes itself to continue, giving every phase a fresh context window. They keep state in a run manifest plus the research artifacts rather than a task queue. See `docs/research-session-loop-convention.md` and `docs/orchestrator-convention.md` § Pattern A.

### Pattern 2: Auto-invocation (exec/plan-phase model)

A parent skill detects a missing prerequisite and transparently invokes a sub-skill to fill it. The user does not need to know about the sub-skill invocation.

**Structure:**
```
packs/<parent-pack>/claude/<parent>/SKILL.md   # detects gap, invokes sub-skill
packs/<sub-pack>/claude/<sub-skill>/SKILL.md   # invocation: sub-skill, parent: <parent>
```

**When to use:**
- A prerequisite is missing that the user should not need to know about.
- The invoked skill is mechanical/deterministic, not a research or judgment step.
- The sub-skill has no meaningful choices for the user to make.

**Exemplars:**
- `/exec` auto-invokes `patch-exec-profile` when agent-team lane metadata is incomplete.
- `/exec` and `/ship` auto-invoke `plan-phase` when a new roadmap phase begins.

### Pattern 3: Task-document sequencing (chained skills)

A skill writes its recommendation to `tasks/todo.md` or a `## Next Steps` section. The user (or `/exec`) picks up the recommendation and invokes the next skill.

**When to use:**
- The next skill involves research or judgment that needs user buy-in.
- The recommendation depends on the current skill's findings (not predetermined).
- Steps are independently useful and could be composed differently.

**Exemplar:** `/competitive-analysis` recommends `/journey-map` in its next steps when customer lifecycle mapping is missing. The user decides whether to follow the recommendation.

### When to stay monolithic

Do not split a skill into sub-skills when:
- The skill has one clear methodology and linear execution.
- Steps are not independently useful outside the parent context.
- Splitting would create indirection with no compositional benefit.
- The skill would stay under ~400 lines with all logic inline.

Three similar steps inside one skill is better than three sub-skills with a router that adds no synthesis value.
