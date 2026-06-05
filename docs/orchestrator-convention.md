# Orchestrator + Framework Subskill Convention

> Companion to `docs/skill-anatomy.md` § Delegation Patterns → Pattern 1: Parent Router.
> This document covers operational details for skills that use the orchestrator pattern.

## Frontmatter Contract

Orchestrators use `invocation: orchestrator` in frontmatter. Framework subskills use `invocation: sub-skill` and `parent: {orchestrator-name}`.

## Directory Structure

```
packs/<pack>/claude/<orchestrator>/
  SKILL.md                          # orchestrator — mode detection, selection, synthesis
  CHANGELOG.md
  ALIGNMENT-PAGE.md
  archive/
  frameworks/
    <framework-slug>/
      SKILL.md                      # sub-skill — single framework analysis
      CHANGELOG.md
      ALIGNMENT-PAGE.md
      archive/
```

## Orchestrator Responsibilities

1. **Mode detection** — inspect project state (codebase, research artifacts, customer feedback, arguments) to determine which mode applies (e.g. pre-product vs product-exists).
2. **Framework recommendation** — present available frameworks as a multi-select alignment page with mode-appropriate defaults pre-checked and optional frameworks available.
3. **Task queueing** — write selected frameworks as sequential steps in `tasks/todo.md`. The orchestrator stops after writing the task list; `/exec` drives sequential framework execution.
4. **Synthesis** — when invoked with `--synthesize`, read all framework intermediate outputs and synthesize into the canonical deliverable. Present via alignment page before writing.
5. **Next-step routing** — emit routing only after synthesis is approved and written.

## Subskill Responsibilities

1. **Inherit product-path scope** from the orchestrator's scope resolution convention.
2. **Own framework-specific analysis** — each subskill applies one named framework or methodology.
3. **Write to intermediate path** — `research/{orchestrator}-{framework-slug}.md` (or `research/{slug}/{orchestrator}-{framework-slug}.md` in product-path mode).
4. **Follow staged research workflow** — working packet → alignment page → approved write.
5. **No next-step routing** — subskills do not emit `Recommended next skill`. The orchestrator handles routing after synthesis.

## Deliverable Naming

| Artifact | Path |
|----------|------|
| Framework intermediate | `research/{orchestrator}-{framework-slug}.md` |
| Synthesized canonical | `research/{orchestrator}.md` |
| Product-path intermediate | `research/{slug}/{orchestrator}-{framework-slug}.md` |
| Product-path canonical | `research/{slug}/{orchestrator}.md` |

## Execution Model

```
User invokes /orchestrator
  → Orchestrator detects mode, builds multi-select alignment page
  → User approves framework selection
  → Orchestrator writes tasks/todo.md with framework steps + synthesis step
  → Orchestrator stops

User runs /exec (repeats for each framework)
  → /exec invokes next framework subskill
  → Subskill writes intermediate research artifact
  → /exec marks step complete, moves to next

User runs /exec on synthesis step
  → /exec invokes /orchestrator --synthesize
  → Orchestrator reads all intermediates, synthesizes, presents alignment page
  → User approves → canonical deliverable written
```

## Shortcut Modes

Orchestrators may define shortcut invocations (e.g. `/journey-map product`) that skip the multi-select alignment page and queue a fixed set of frameworks. Shortcuts still write to `tasks/todo.md` and require `/exec` for execution.

## Operational Modes Summary

| Mode | Trigger | Behavior |
|------|---------|----------|
| A (default) | No special flags | Mode detection → multi-select → write `tasks/todo.md` → stop |
| B (synthesize) | `--synthesize` | Read intermediates → synthesize → alignment page → write canonical |
| C (shortcut) | Per-orchestrator keyword | Skip multi-select → queue fixed set + synthesis → stop |

## Reference Implementations

- `packs/business-discovery/claude/positioning/` — 5 positioning frameworks, market/product mode detection
- `packs/customer-lifecycle/claude/journey-map/` — 5 journey-mapping frameworks, pre-product/product-exists mode detection
