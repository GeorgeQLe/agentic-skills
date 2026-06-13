# Orchestrator Convention

> Companion to `docs/skill-anatomy.md` § Delegation Patterns.
> This document covers operational details for skills that coordinate other skills.

## Pattern Overview

Three orchestrator patterns exist. Each differs in how it selects targets, what it routes to, and whether it synthesizes outputs.

| Dimension | Pattern A: Framework Decomposition | Pattern B: Intent Router | Pattern C: Detect-and-Route |
|-----------|-----------------------------------|--------------------------|----------------------------|
| **Routing signal** | User multi-select from mode-appropriate defaults | Intent classification via signal words or flags | Codebase grep for dependencies/imports |
| **Target type** | Framework subskills in `frameworks/` | Peer skills in same or cross-pack | Framework subskills in `frameworks/` |
| **Subskill ownership** | Parent owns `frameworks/` dir | No ownership — routes to independent skills | Parent owns `frameworks/` dir |
| **Synthesis** | Yes — `--synthesize` reads all intermediates | No — each routed skill produces independent output | No separate synthesis — parent skill produces unified output inline |
| **Artifacts** | Framework intermediates + synthesized canonical | Routed skills own their own artifacts | Parent produces structured plan document |
| **`tasks/todo.md` usage** | Writes framework steps + synthesis step | Writes multi-step plays (Modes B–E) | Does not use `tasks/todo.md` |
| **Frontmatter** | `invocation: orchestrator` | `type: router` | `invocation: orchestrator` |
| **Reference implementations** | customer-discovery, competitive-analysis, positioning, journey-map | youtube | animation-design-planner |

**Variant: Thin Workflow Router** — a lightweight subset of Pattern B used by `devtool-workflow` and `game-workflow`. Uses project-type detection instead of intent classification, recommends one skill at a time (no multi-step plays), and does not use `tasks/todo.md`. See [Pattern B § Variant](#variant-thin-workflow-router) below.

### Which pattern should I use?

- **Multiple named frameworks the user selects between, with a synthesis step?** → Pattern A.
- **Free-text or flag-based intent that routes to independent peer skills?** → Pattern B.
- **Project-type detection that recommends the next skill in a domain workflow?** → Pattern B, Thin Workflow Router variant.
- **Codebase detection that selects one framework within a larger parent workflow?** → Pattern C.

---

## Pattern A — Framework Decomposition + Synthesis

### Frontmatter Contract

Orchestrators use `invocation: orchestrator` in frontmatter. Framework subskills use `invocation: sub-skill` and `parent: {orchestrator-name}`.

### Directory Structure

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

### Orchestrator Responsibilities

1. **Mode detection** — inspect project state (codebase, research artifacts, customer feedback, arguments) to determine which mode applies (e.g. pre-product vs product-exists).
2. **Framework recommendation** — present available frameworks as a multi-select alignment page with mode-appropriate defaults pre-checked and optional frameworks available.
3. **Task queueing** — write selected frameworks as sequential steps in `tasks/todo.md`. The orchestrator stops after writing the task list; `/exec` drives sequential framework execution.
4. **Synthesis** — when invoked with `--synthesize`, read all framework intermediate outputs and synthesize into the canonical deliverable. Present via alignment page before writing.
5. **Next-step routing** — emit routing only after synthesis is approved and written.

### Subskill Responsibilities

1. **Inherit product-path scope** from the orchestrator's scope resolution convention.
2. **Own framework-specific analysis** — each subskill applies one named framework or methodology.
3. **Write to intermediate path** — `research/{orchestrator}-{framework-slug}.md` (or `research/{slug}/{orchestrator}-{framework-slug}.md` in product-path mode).
4. **Follow staged research workflow** — working packet → alignment page → approved write.
5. **No next-step routing** — subskills do not emit `Recommended next skill`. The orchestrator handles routing after synthesis.

### Deliverable Naming

| Artifact | Path |
|----------|------|
| Framework intermediate | `research/{orchestrator}-{framework-slug}.md` |
| Synthesized canonical | `research/{orchestrator}.md` |
| Product-path intermediate | `research/{slug}/{orchestrator}-{framework-slug}.md` |
| Product-path canonical | `research/{slug}/{orchestrator}.md` |

### Execution Model

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

### Shortcut Modes

Orchestrators may define shortcut invocations (e.g. `/journey-map product`) that skip the multi-select alignment page and queue a fixed set of frameworks. Shortcuts still write to `tasks/todo.md` and require `/exec` for execution.

### Operational Modes Summary

| Mode | Trigger | Behavior |
|------|---------|----------|
| A (default) | No special flags | Mode detection → multi-select → write `tasks/todo.md` → stop |
| B (synthesize) | `--synthesize` | Read intermediates → synthesize → alignment page → write canonical |
| C (shortcut) | Per-orchestrator keyword | Skip multi-select → queue fixed set + synthesis → stop |

---

## Pattern B — Intent Router + Play Composer

### Frontmatter Contract

Intent routers use `type: router` in frontmatter. They do **not** use `invocation: orchestrator` — the `type: router` field distinguishes them from framework-decomposition orchestrators. Routed-to skills are independent peer skills with their own invocation types (typically `primary` or `chained`).

### Directory Structure

Flat — no `frameworks/` directory. The router lives alongside its peer skills in the same pack or routes cross-pack.

```
packs/<pack>/claude/<router>/
  SKILL.md                          # router — intent classification, play composition
  CHANGELOG.md
  archive/
```

### Router Responsibilities

1. **Intent classification** — match user input against a table of intents, signal words, and target skills. The table maps natural-language signals (e.g. "audit", "cadence", "compare") to specific skill invocations.
2. **Single-skill routing** — when intent maps to one skill, recommend it inline with a brief explanation of why.
3. **Play composition** — when a goal requires multiple skills in sequence, compose a named "play" — an ordered checklist of 3–5 skill invocations. Plays are written to `tasks/todo.md` as `- [ ]` items for `/exec` to drive.
4. **Play approval gate** — before writing a play, check for existing unfinished items in `tasks/todo.md`. Present the play steps to the user and write only on approval.
5. **Flag-based modes** — support explicit flags (e.g. `--health`, `--concept`, `--launch`) that bypass intent classification and route directly to predefined plays.

### Status Mode

Routers may define a read-only status mode (e.g. `--status`) that scans research artifacts and reports coverage, staleness, and gaps without writing any files.

### No Synthesis

Pattern B routers do not synthesize outputs. Each routed skill produces independent artifacts. The router is a planning and dispatching layer only.

### Variant: Thin Workflow Router

`devtool-workflow` and `game-workflow` are lightweight routers that share Pattern B's "recommend peer skills" model but differ in key ways:

| Dimension | Full Intent Router (youtube) | Thin Workflow Router |
|-----------|------------------------------|----------------------|
| **Frontmatter** | `type: router` | `invocation: orchestrator`, `type: planning` |
| **Routing signal** | Intent classification table | Project-type check via `.agents/project.json` |
| **Output** | Single skill or multi-step play | Single next-skill recommendation |
| **`tasks/todo.md`** | Writes play checklists | Does not use |
| **Status mode** | Yes (`--status`) | No |
| **Pack guard** | Checks `enabled_packs` before cross-pack routing | Auto-installs own pack if missing |

Thin Workflow Routers are stateless "what's next" advisors. They read project state (existing research artifacts, completed steps) and recommend the single next skill to run, with a brief explanation of the missing artifact or decision that makes it next. They may organize available skills into phases (e.g. early research → prototype → launch) to guide the recommendation.

**When to use the thin variant:** when a domain pack has 5+ skills with a natural ordering but no synthesis step — the router helps users discover the right next skill without requiring them to know the full pack contents.

### Reference Implementations

- `packs/youtube-ops/claude/youtube/` — full intent router with 13-row classification table, 4 named plays, status mode, cross-pack routing
- `packs/devtool/claude/devtool-workflow/` — thin workflow router, project-type guard, implicit skill ordering
- `packs/game/claude/game-workflow/` — thin workflow router, project-type guard, explicit three-phase skill ordering

---

## Pattern C — Detect-and-Route

### Frontmatter Contract

Same as Pattern A: `invocation: orchestrator`. The parent skill uses `type: planning` (not `type: router`). Framework subskills use `invocation: sub-skill` and `parent: {orchestrator-name}`.

### Directory Structure

Same as Pattern A — the parent owns a `frameworks/` directory with child subskills.

```
base/claude/<orchestrator>/
  SKILL.md                          # orchestrator — domain workflow + framework detection
  CHANGELOG.md
  ALIGNMENT-PAGE.md
  archive/
  frameworks/
    <framework-slug>/
      SKILL.md                      # sub-skill — framework-specific guardrails
      CHANGELOG.md
      ALIGNMENT-PAGE.md
      archive/
```

### Key Difference from Pattern A

Pattern A presents frameworks as a multi-select menu and delegates full execution to each selected subskill. Pattern C runs its own multi-step workflow and injects exactly one subskill's content at a specific step based on codebase detection.

The parent skill does the substantive domain work — routing is one step in a larger workflow, not the skill's primary purpose.

### Detection Responsibilities

1. **Dependency grep** — scan `package.json`, import statements, or build config for framework-specific identifiers, following a defined detection order.
2. **Single selection** — route to exactly one framework subskill. Pattern C does not support multi-select.
3. **Disambiguation** — when multiple frameworks are detected, ask the user which to use.
4. **Graceful fallback** — if no subskill matches the detected framework (or no framework is detected), the parent delivers value using baseline guardrails. The parent skill is useful even without any subskill match.

### Subskill Responsibilities

Same as Pattern A: `invocation: sub-skill`, `parent:` field. But subskills in Pattern C typically provide guardrails, constraints, or framework-specific best practices rather than independent research artifacts. The parent integrates their content into its own output.

### No Separate Synthesis

Unlike Pattern A, there is no `--synthesize` mode. The parent skill produces a unified output document that already incorporates the selected subskill's guardrails. There is no intermediate-then-merge workflow.

### Reference Implementation

- `base/claude/animation-design-planner/` — 7-step animation planning workflow, detects motion framework via codebase grep, injects framework-specific guardrails from one of 5 subskills (`motion-framer`, `css-transitions`, `gsap`, `web-animations-api`, `threejs`), produces structured plan with motion contract + storyboard + guardrails + proof gate

---

## Reference Implementations

| Skill | Pack | Pattern | Key traits |
|-------|------|---------|------------|
| `customer-discovery` | business-discovery | A | 6 frameworks, pre-product/product-exists modes, synthesis |
| `competitive-analysis` | business-discovery | A | 4 frameworks, market-structure/comparison modes, synthesis |
| `positioning` | business-discovery | A | 5 frameworks, market/product modes, synthesis |
| `journey-map` | customer-lifecycle | A | 5 frameworks, pre-product/product-exists modes, synthesis |
| `youtube` | youtube-ops | B | 13-intent classification, 4 named plays, status mode |
| `devtool-workflow` | devtool | B (thin) | Project-type guard, implicit skill ordering |
| `game-workflow` | game | B (thin) | Project-type guard, explicit three-phase ordering |
| `animation-design-planner` | base | C | 5 framework subskills, codebase grep detection, inline guardrail injection |
