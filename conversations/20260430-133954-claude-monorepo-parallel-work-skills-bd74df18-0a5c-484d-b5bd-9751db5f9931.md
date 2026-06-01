# monorepo-parallel-work-skills

| Field | Value |
|-------|-------|
| **Date** | 2026-04-30 13:39:54 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `bd74df18-0a5c-484d-b5bd-9751db5f9931` |
| **Entrypoint** | cli |
| **Version** | 2.1.123 |

---

## User _13:39:54_

Implement the following plan:

# Plan: New Parallel-Work Skill Suite for Monorepo Projects

## Context

On Apr 27, 9 parallel Codex agents building bismarck-v5 game packages deadlocked fighting over `pnpm-lock.yaml`. The existing roadmap/plan-phase/run skills have no monorepo awareness — they don't detect shared files, don't align lanes to package boundaries, and don't prevent lockfile contention at plan time. Rather than bloating those existing skills, we'll create two new focused skills that integrate at natural seams in the workflow.

## Design: Two New Skills

### Why two (not one, not three)

- One skill would conflate planning-time and execution-time concerns
- Three+ adds discovery burden to an already 50+ skill repo
- Two maps cleanly to two lifecycle moments: plan-time lane generation and pre-dispatch safety validation

---

### Skill 1: `mono-plan`

**Purpose:** Detect monorepo structure, recommend parallelization strategy, generate safe lane specs aligned to package boundaries.

**When to invoke:** After `/roadmap` sets `agent-team` or `implementation-safe` on a phase, before `/plan-phase` decomposes it. The user runs `/mono-plan 2` to get lane specs for phase 2, then `/plan-phase 2` incorporates them.

**Files to create:**
- `global/claude/mono-plan/SKILL.md`
- `global/codex/mono-plan/SKILL.md`

**Process:**
1. Detect monorepo (pnpm-workspace.yaml, turbo.json, package.json workspaces, lerna.json) — same approach as `affected`
2. Enumerate packages, build internal dependency graph
3. Identify shared chokepoints (lockfiles, root configs, high-fan-out shared packages)
4. Map phase scope to packages (read phase's Scope/Acceptance Criteria from roadmap)
5. Classify packages: independent / dependent / shared
6. Recommend strategy: agent-team with package lanes, serial deps lane, or downgrade
7. Generate lane specs in the exact execution profile format that plan-phase expects (`Owns`, `Must not edit`, `Depends on`, etc.)
8. If lockfile changes needed: auto-generate serial "deps" lane (Lane 0) that all write lanes depend on
9. Every write lane gets `Must not edit: pnpm-lock.yaml, ...` and scope text: "Do NOT run pnpm install or any lockfile-modifying command"

**Output:** Advisory `### Mono Plan: Phase N` block with shared chokepoints, package graph, recommended strategy, and lane specifications. Does NOT modify task docs — user/plan-phase incorporates the output.

**Key constraint:** Lockfiles must appear in `Must not edit` for ALL parallel write lanes, OR be owned by exactly one serial deps lane that all others depend on.

---

### Skill 2: `mono-guard`

**Purpose:** Pre-flight validation of execution profile lane boundaries against actual monorepo structure. Prevents dispatch of unsafe lane configurations.

**When to invoke:** Before `/run` dispatches agent-team lanes. User runs `/mono-guard` to validate, or `/run` can recommend it when monorepo signals are present.

**Files to create:**
- `global/claude/mono-guard/SKILL.md`
- `global/codex/mono-guard/SKILL.md`

**Checks (pre-flight mode, default):**
1. **Lockfile safety**: every lockfile is in `Must not edit` for all write lanes, OR owned by exactly one serial lane with all others depending on it
2. **Root config safety**: same ownership/exclusion rules for tsconfig.base.json, turbo.json, etc.
3. **Package boundary isolation**: Owns paths are disjoint, within recognized package directories, no prefix overlaps
4. **Dependency ordering**: if package X depends on package Y and both are in write lanes, lane-X must depend on lane-Y
5. **Serialization check**: if any step mentions adding dependencies, verify a serial deps lane exists
6. **Install command check**: no write lane's Scope contains `pnpm install`, `npm install`, `yarn add`, etc.

**Post-integration mode** (`--post-integration`): defense-in-depth check after `/run` integrates lanes — verifies lockfile was only touched by one lane or main agent.

**Verdicts:** PASS / WARN (advisory) / FAIL (blocks dispatch). Each finding includes which check failed, which lanes, which files, and recommended fix.

**Output:** Advisory report. Does NOT modify task docs.

---

## Integration Without Modifying Existing Skills

The skills integrate through convention, not by editing roadmap/plan-phase/run:

```
/roadmap              → sets parallelization mode per phase (already does this)
/mono-plan 2          → generates monorepo-safe lane specs for phase 2 (NEW)
/plan-phase 2         → incorporates lane specs into execution profile (already does this)
/mono-guard           → pre-flight validation of the profile (NEW)
/run                  → dispatches lanes (already auto-invokes /patch-exec-profile if needed)
/mono-guard --post    → optional defense-in-depth after integration (NEW)
```

- `mono-plan` output is in the exact format plan-phase expects for execution profiles
- `mono-guard` extends what `patch-exec-profile` validates (disjoint Owns, valid DAG) with monorepo-specific checks (lockfile safety, package dependency ordering, root config isolation)
- No existing SKILL.md files are modified

## Files to Create

| File | Based on | Notes |
|------|----------|-------|
| `global/claude/mono-plan/SKILL.md` | Full Claude variant with detailed process | ~90 lines |
| `global/codex/mono-plan/SKILL.md` | Condensed Codex variant (follows codex/affected pattern) | ~45 lines |
| `global/claude/mono-guard/SKILL.md` | Full Claude variant with check descriptions | ~100 lines |
| `global/codex/mono-guard/SKILL.md` | Condensed Codex variant | ~50 lines |

## Implementation Order

1. `mono-plan` (both variants) — planning skill, no runtime dependencies
2. `mono-guard` (both variants) — validation skill, references mono-plan's output format
3. Update `install.sh` to symlink the new skills (if needed — check if glob already covers `global/claude/*/SKILL.md`)

## What This Prevents

The bismarck-v5 failure specifically:
- `mono-plan` would detect pnpm-lock.yaml as a chokepoint and generate a serial deps lane
- All 9 package lanes would have `Must not edit: pnpm-lock.yaml` and scope text forbidding install commands
- `mono-guard` would FAIL pre-flight if any lane could touch the lockfile
- Even bypassing both, `mono-guard --post-integration` catches lockfile conflicts after the fact

## Verification

1. Run `/mono-plan` on bismarck-v5 — verify it detects 9 packages, identifies pnpm-lock.yaml as chokepoint, generates 9 write lanes + 1 deps lane
2. Manually remove lockfile from a lane's `Must not edit` and run `/mono-guard` — verify FAIL verdict with specific fix recommendation
3. Run `/mono-guard --post-integration` on a clean integration — verify PASS


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/e90582b7-e61f-4fa2-b5b9-1373fc19a096.jsonl

## Assistant _13:39:58_

I'll start by understanding the existing skill patterns, then create all four files in parallel.

## Assistant _13:40:04_

<details><summary>Tool calls</summary>

- Agent: Explore existing skill patterns

</details>

## Assistant _13:41:14_

Good, I have the full pattern reference. Let me read two key files for exact formatting, then create all four skills.

## Assistant _13:41:15_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/affected/SKILL.md`

</details>

## Assistant _13:41:16_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/affected/SKILL.md`

</details>

## Assistant _13:41:16_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/patch-exec-profile/SKILL.md`

</details>

## Assistant _13:41:17_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/affected/agents/openai.yaml`

</details>

## Assistant _13:41:22_

Now I have the exact patterns. Creating all four skill files plus their Codex agent configs.

## Assistant _13:41:24_

<details><summary>Tool calls</summary>

- Bash: Create directories for all four skill variants

</details>

## Assistant _13:42:10_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/global/claude/mono-plan/SKILL.md`

</details>

## Assistant _13:42:51_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/global/claude/mono-guard/SKILL.md`

</details>

## Assistant _13:43:07_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/global/codex/mono-plan/SKILL.md`

</details>

## Assistant _13:43:18_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/global/codex/mono-guard/SKILL.md`

</details>

## Assistant _13:43:20_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/global/codex/mono-plan/agents/openai.yaml`

</details>

## Assistant _13:43:21_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/global/codex/mono-guard/agents/openai.yaml`

</details>

## Assistant _13:43:25_

All 6 files created. Let me verify the install.sh glob covers new directories automatically, then commit and push.

## Assistant _13:43:26_

<details><summary>Tool calls</summary>

- Bash: Verify install.sh glob pattern covers new skill dirs

</details>

## Assistant _13:43:27_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _13:43:30_

The glob at line 92 (`"$source_root"/*/`) auto-discovers all subdirectories — no install.sh changes needed. Committing and pushing.

## Assistant _13:43:31_

<details><summary>Tool calls</summary>

- Bash: Check recent commit message style

</details>

## Assistant _13:43:38_

<details><summary>Tool calls</summary>

- Bash: Stage and commit all new skill files

</details>

## Assistant _13:43:40_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _13:43:49_

Done. Created and shipped 6 files:

| File | Lines | Purpose |
|------|-------|---------|
| `global/claude/mono-plan/SKILL.md` | ~130 | Full Claude variant — 9-step process for detecting monorepo structure, building dependency graphs, and generating safe lane specs |
| `global/codex/mono-plan/SKILL.md` | ~50 | Condensed Codex variant with `$mono-plan` invocation |
| `global/codex/mono-plan/agents/openai.yaml` | 8 | Codex agent policy |
| `global/claude/mono-guard/SKILL.md` | ~140 | Full Claude variant — 7 pre-flight checks + 3 post-integration checks with PASS/WARN/FAIL verdicts |
| `global/codex/mono-guard/SKILL.md` | ~55 | Condensed Codex variant with `$mono-guard` invocation |
| `global/codex/mono-guard/agents/openai.yaml` | 8 | Codex agent policy |

No changes to `install.sh` needed — the existing glob auto-discovers new skill directories. The workflow integrates at convention seams: `/roadmap` → `/mono-plan N` → `/plan-phase N` → `/mono-guard` → `/run`.
