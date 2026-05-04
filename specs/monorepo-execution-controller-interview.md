# Monorepo Execution Controller — Interview Log

**Date:** 2026-05-03
**Interviewer:** Claude (spec-interview skill)
**Topic:** monorepo execution controller integration

---

## Assumptions Manifest

Presented before probing. Categories: Source Context, Implementation Goal, Technical Foundation, Integration Risk, Data Model, API/Contract Surface, Operational Requirements.

Key assumptions by source:
- `[from codebase]` Existing execution skills: `/run`, `/ship`, `/ship-end`, `/mono-guard`, `/mono-plan`, `/affected`, `/delegate`, `$project-fleet`.
- `[from codebase]` Three-mode operating model with approval packet contract.
- `[from codebase]` Ideas backlog lists "Workflow orchestrator / meta-skill" as a larger initiative.
- `[inferred]` The spec is about wiring monorepo-aware skills into the execution pipeline.
- `[inferred]` `$project-fleet` (multi-repo) and monorepo execution (intra-repo) should compose but not merge.
- `[inferred]` A structured lane-spec artifact may be needed for `/run` to consume `/mono-plan` output.

**User review:** Confirmed scope but significantly broadened it — not just execution pipeline wiring, but making ALL skills monorepo-aware across research, planning, execution, and shipping.

---

## Turn 1: Scope Confirmation

**Questions:**
1. Does the Assumptions Manifest accurately capture the scope?
2. Should /mono-plan output a structured lane-spec artifact?
3. What should happen when a parallel lane fails?

**Answers:**
1. "Yes but also research skills, devtools, business skills, along with workflow routing and planning skills like roadmap and plan-phases. Ship too." — **Significant deviation from initial assumption.** Scope expanded from execution-pipeline wiring to full cross-cutting monorepo awareness.
2. Structured artifact (JSON + Markdown mirror) — Recommended option accepted.
3. Stop all lanes, report — Recommended option accepted.

---

## Turn 2: Skill Routing and Architecture

**Questions:**
1. Should the controller use phase-type routing, pack-aware routing, or both?
2. How should the controller relate to /run and /ship?
3. Full lifecycle or step-at-a-time?

**Answers:**
1. "No I just want all of the skills to be aware that they're in a monorepo and to be able to deal with it accordingly. Whether that requires a full set of new skills stored in a monorepo pack or to extend existing skills to handle monorepos. I also wonder if we should restructure our research and spec workflow in order to be separate per subordinate app/package or we should keep things at the root level." — **Major reframe.** Not a routing/controller architecture question — it's about monorepo-awareness as a cross-cutting concern.
2. "Square with previous clarification" — Architecture follows from the monorepo-awareness decision.
3. Configurable via flags — step-at-a-time default with `--phase` and `--pipeline` options.

---

## Turn 3: Pack Structure and Spec Location

**Questions:**
1. Root-level vs per-package specs/research?
2. New monorepo pack vs extending core skills?
3. Root-level vs per-package task management?

**Answers:**
1. Root with package tags (Recommended) — YAML frontmatter `packages:` field.
2. New monorepo pack (Recommended) — Keeps core skills simple for single-repo users.
3. Root-level, package-tagged — "Also we probably need a skill to help in migrating a repo from a single app to a monorepo?" — **New requirement surfaced:** migration skill.

---

## Turn 4: Tooling and Migration

**Questions:**
1. Which workspace managers/build orchestrators?
2. Migration skill scope?
3. Which existing skills need monorepo-aware variants?

**Answers:**
1. pnpm workspaces + Turborepo (Recommended) — First-class support.
2. Planning + guided execution — Generate migration plan, require user approval at each step.
3. All of the above — Execution, planning, and analysis skills all get monorepo variants.

---

## Turn 5: Technical Design Details

**Questions:**
1. Lane-spec artifact format?
2. Skill augmentation pattern?
3. Package-scope tag format?

**Answers:**
1. JSON + Markdown mirror (Recommended) — Following approval-packet pattern.
2. Augmentation injection (Recommended) — Pack skills add pre/post steps, don't duplicate global skills.
3. YAML frontmatter field (Recommended) — `packages: [api, web]` with `scope: cross-cutting|package-scoped|root-only`.

---

## Turn 6: Edge Cases and Operations

**Questions:**
1. Cross-cutting step handling during agent-team dispatch?
2. Migration scope beyond single-app → monorepo?
3. Turborepo task pipeline integration?

**Answers:**
1. Serial-only for cross-cutting (Recommended) — Never dispatched to parallel lanes.
2. Single-app → monorepo only (Recommended) — Keep migration skill focused.
3. Defer to Turbo when available (Recommended) — Use `turbo run` for build/test/lint.

---

## Turn 7: Testing and V1 Scope

**Questions:**
1. Testing approach?
2. V1 skill list?

**Answers:**
1. Script-based validation (Recommended) — Shell scripts checking contracts, detection, tags.
2. Minimal: detect + run + ship + guard (Recommended) — V2 adds planning, analysis, migration.

---

## Turn 8: Coverage Checkpoint

Presented structured summary of all decisions. User confirmed: "Looks complete, write the spec."

---

## Significant Deviations from Original Assumptions

1. **Scope expansion:** Initial assumption was execution-pipeline wiring (`/mono-plan` → `/mono-guard` → `/run`). Actual scope is cross-cutting monorepo awareness across all skill types.
2. **New requirement:** Migration skill (single-app → monorepo) surfaced during the task management question.
3. **Architecture pivot:** From "controller that wraps existing skills" to "new pack with augmentation injection pattern" — a cleaner separation that keeps core skills unchanged.
4. **V1/V2 split:** User chose minimal v1 (4 skills) over full set, deferring planning/analysis/migration to v2.

## Corrected Inferred Assumptions

| Original Assumption | Correction |
|---------------------|------------|
| `[inferred]` Spec is about wiring /mono-plan → /mono-guard → /run | Broadened to all skills being monorepo-aware, not just the execution pipeline |
| `[inferred]` `$project-fleet` interaction needs to be defined here | Deferred — fleet is multi-repo, this spec is intra-repo. They compose naturally without explicit integration |
| `[inferred]` Architecture should wrap /run and /ship | Changed to augmentation injection pattern — cleaner, less coupling |
