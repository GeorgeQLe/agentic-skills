# Implement branching R&D workflow support

| Field | Value |
|-------|-------|
| **Date** | 2026-05-27 17:48:55 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `74216698-fc82-46c4-8c6a-51850c72f27e` |
| **Entrypoint** | cli |
| **Version** | 2.1.152 |

---

## User _17:48:55_

Implement the following plan:

# Plan: Branching R&D Workflow Support

## Context

The user's workflow pattern: a single concept spawns multiple product opportunity branches — from different ICPs discovered, problems found during research, and competitive gaps identified. These branches together form a product line. The aim is to explore all potential paths in research and execute on the fruitful ones.

The skill ecosystem has a foundation for this via `research/.progress.yaml` (product-path manifest), but the support is incomplete. Seven skills create or read the manifest at the edges of the pipeline, while **17 mid/late-pipeline skills have zero product-path awareness**. There is no skill to manage the portfolio of branches itself — no way to promote, prune, compare, or fork branches.

## Gap Summary

| # | Gap | Impact |
|---|-----|--------|
| 1 | No "promote path" workflow | Can't switch active branch or resume a deferred one |
| 2 | No portfolio review skill | Can't compare all branches side-by-side with evidence maturity |
| 3 | Only one `active_path` at a time | Can't research two branches in parallel |
| 4 | No branch creation from mid-pipeline discoveries | Competitive gaps or journey insights can't spawn new branches |
| 5 | No convergence/pruning skill | Can't deliberately abandon a branch with documented rationale |
| 6 | No per-branch pipeline progress tracking | Can't see "Branch A is at journey-map, Branch B is at ICP" |
| 7 | Revisit triggers are passive | Nothing checks whether deferred-path triggers have fired |

## Recommended Approach: 3-Tier Implementation

### Tier 1 — New `product-line` Skill (MVP, unblocks the workflow)

Create `packs/business-ops/claude/product-line/SKILL.md` — a single multi-mode skill that handles portfolio management for product branches.

**Manifest evolution** — `research/.progress.yaml`:
- `active_path` (singular) → `active_paths` (plural list of path IDs)
- Backward compat: singular field treated as `[value]` during migration
- New optional field on each path entry: `pipeline_stage` (last completed skill in the chain)
- New optional top-level field: `max_concurrent` (default 1 for backward compat)

**Skill modes:**
1. `/product-line review` — Portfolio dashboard comparing all paths (evidence maturity, pipeline stage, age, triggers)
2. `/product-line promote <path-id>` — Move deferred→active, scan existing research to set starting point
3. `/product-line prune <path-id>` — Set abandoned with documented evidence and rationale
4. `/product-line fork <label> [--from <skill>]` — Create new branch from mid-pipeline discovery
5. `/product-line triggers` — Check all revisit_trigger conditions, recommend promotions

**Files:**
- `packs/business-ops/claude/product-line/SKILL.md` — NEW
- `packs/business-ops/codex/product-line/SKILL.md` — NEW (codex mirror)
- `packs/business-ops/claude/product-line/CHANGELOG.md` — NEW
- `packs/business-ops/PACK.md` — add product-line to skills list

### Tier 2 — Update Existing Manifest-Aware Skills

Update the 7 skills that already read `.progress.yaml` to handle `active_paths` (plural) and write `pipeline_stage`:

1. `global/claude/concept-exploration/SKILL.md` — handle plural, set `pipeline_stage: concept-exploration`
2. `packs/business-discovery/claude/icp/SKILL.md` — handle plural, set stage, recommend `/product-line promote` for secondary ICPs
3. `packs/business-discovery/claude/competitive-analysis/SKILL.md` — handle plural, recommend `/product-line fork` when gaps imply new products
4. `packs/business-ops/claude/platform-strategy/SKILL.md` — handle plural, set stage
5. `packs/product-design/claude/ux-variations/SKILL.md` — handle plural
6. `packs/research-admin/claude/research-roadmap/SKILL.md` — **biggest change**: show per-branch pipeline progress, queue research for ALL active paths, recommend `/product-line review` when deferred paths accumulate
7. `packs/business-ops/claude/reconcile-research/SKILL.md` — handle plural, add cross-path consistency checks

Each skill gets: archive current version, bump version, update CHANGELOG.

### Tier 3 — Propagate Awareness to Mid-Pipeline Skills

Add minimal `.progress.yaml` reading to the 17 currently-blind skills. Templated change (~5-10 lines per skill):
- Read manifest, scope to active path's `scope_path`
- When discovering branch-worthy insights, add `## Product Path Implications` section recommending `/product-line fork`

**Priority order by pipeline position:**
1. `positioning` (business-discovery) — first skill after the manifest-aware zone ends
2. `journey-map` (customer-lifecycle) — pivot between discovery and design
3. `metrics` (business-growth) — feeds many downstream skills
4. `gtm`, `monetization` (business-growth)
5. `experiment` (business-growth) — needs to know which path it validates
6. Remaining customer-lifecycle maps (onboarding, conversion, retention, expansion, transaction, lifecycle-metrics)
7. Remaining business-growth (landing-copy, growth-model, hook-model, pmf-assessment)

Each: archive, bump version, update CHANGELOG, codex mirror.

## What NOT to Build

- No new pack — `product-line` fits in business-ops alongside platform-strategy and reconcile-research
- No automated scheduled trigger checking — users can run `/product-line triggers` manually or `/schedule` it later
- No parallel-execution orchestrator — multiple active paths means the user switches context, not parallel agents

## Verification

- New `product-line` skill: reads both `active_path` (legacy) and `active_paths` (new), each mode produces correct manifest mutations, alignment page convention followed
- Updated skills: read `.progress.yaml` without errors when present, fall back cleanly when absent, respect active path scope
- `scripts/skill-deps.sh --broken` passes (no broken skill references)
- Version bumps follow CLAUDE.md section 9 (archive → bump → changelog)

## Execution Sequence (All Tiers — Full Session)

**Phase 1**: Tier 1 — create `product-line` skill + update `research-roadmap` for plural active paths
**Phase 2**: Tier 2 — update remaining 6 manifest-aware skills for `active_paths` plural + `pipeline_stage`
**Phase 3**: Tier 3 — propagate manifest awareness to all 17 mid/late-pipeline skills

Strategy: Use subagents for parallel skill updates within each phase. Group by pack to minimize context switching. Archive/version-bump/changelog for every touched skill.


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/c942ec23-f954-4749-bdf6-729b1d6bba13.jsonl

## Assistant _17:48:59_

I'll start by reading the key files to understand the current structure before implementing.

## Assistant _17:49:04_

<details><summary>Tool calls</summary>

- Agent: Explore manifest and skill structure

</details>

## Assistant _17:50:51_

Starting Phase 1 — creating the `product-line` skill and reading the existing skills I need to update. Let me gather the exact content of key files first.

## Assistant _17:50:51_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-ops/claude/platform-strategy/SKILL.md`

</details>

## Assistant _17:50:52_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-ops/claude/reconcile-research/SKILL.md`

</details>

## Assistant _17:50:52_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/concept-exploration/SKILL.md`

</details>

## Assistant _17:50:53_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-ops/PACK.md`

</details>

## Assistant _17:50:56_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-discovery/claude/icp/SKILL.md`

</details>

## Assistant _17:50:57_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-discovery/claude/competitive-analysis/SKILL.md`

</details>

## Assistant _17:50:58_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/product-design/claude/ux-variations/SKILL.md`

</details>

## Assistant _17:50:58_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/research-admin/claude/research-roadmap/SKILL.md`

</details>

## Assistant _17:51:04_

Now let me check the codex mirror format and look at a few Tier 3 skills to understand the pattern.

## Assistant _17:51:05_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-ops/codex/platform-strategy/SKILL.md`

</details>

## Assistant _17:51:07_

<details><summary>Tool calls</summary>

- Bash: Check existence of Tier 3 skill files

</details>

## Assistant _17:51:08_

<details><summary>Tool calls</summary>

- Bash: List all claude skill files across packs

</details>

## Assistant _17:51:12_

<details><summary>Tool calls</summary>

- Bash: List all Tier 3 skills

</details>

## Assistant _17:51:16_

<details><summary>Tool calls</summary>

- Bash: List customer-lifecycle skills

</details>

## Assistant _17:51:19_

Good. Now I have the full picture. Let me read a couple of Tier 3 skills to understand their frontmatter and where to inject the manifest-reading block.

## Assistant _17:51:20_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-discovery/claude/positioning/SKILL.md`

</details>

## Assistant _17:51:20_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/customer-lifecycle/claude/journey-map/SKILL.md`

</details>

## Assistant _17:51:21_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/claude/metrics/SKILL.md`

</details>

## Assistant _17:51:35_

I have a clear picture of the codebase structure. This is a large implementation across ~25 skills. I'll use subagents aggressively to parallelize. Let me start with Phase 1 — creating the `product-line` skill.

## Assistant _17:51:35_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _17:51:41_

<details><summary>Tool calls</summary>

- TaskCreate

</details>

## Assistant _17:51:43_

<details><summary>Tool calls</summary>

- TaskCreate

</details>

## Assistant _17:51:45_

<details><summary>Tool calls</summary>

- TaskCreate

</details>

## Assistant _17:51:46_

<details><summary>Tool calls</summary>

- TaskCreate

</details>

## Assistant _17:51:49_

<details><summary>Tool calls</summary>

- TaskUpdate

</details>

## Assistant _17:51:52_

Starting Phase 1 — creating the `product-line` skill. Let me create all the files.

## Assistant _17:51:53_

<details><summary>Tool calls</summary>

- Bash: Create product-line skill directories

</details>

## Assistant _17:52:57_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/packs/business-ops/claude/product-line/SKILL.md`

</details>

## Assistant _17:53:02_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/packs/business-ops/claude/product-line/CHANGELOG.md`

</details>

## Assistant _17:53:18_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/packs/business-ops/codex/product-line/SKILL.md`

</details>

## Assistant _17:53:21_

Now update PACK.md to include product-line.

## Assistant _17:53:26_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/business-ops/PACK.md`

</details>

## Assistant _17:53:29_

<details><summary>Tool calls</summary>

- TaskUpdate

</details>

## Assistant _17:53:29_

<details><summary>Tool calls</summary>

- TaskUpdate

</details>

## Assistant _17:53:33_

Phase 1 complete. Starting Phase 2 — updating the 7 manifest-aware skills. I'll run archives first, then use subagents for the parallel edits.

## Assistant _17:53:35_

<details><summary>Tool calls</summary>

- Bash: Archive all 7 manifest-aware skills before version bump

</details>

## Assistant _17:53:43_

All 7 skills archived. Now I need to update each one. The changes per skill are:

1. **Version bump** in frontmatter
2. **Replace `active_path` references** with `active_paths` plural handling + backward compat
3. **Add `pipeline_stage` writing** where the skill creates/updates manifest entries
4. **Recommend `/product-line`** where appropriate
5. **Update CHANGELOG**

Let me also check if codex mirrors exist for these skills and need updating.

## Assistant _17:53:44_

<details><summary>Tool calls</summary>

- Bash: Find codex mirrors for the 7 skills

</details>

## Assistant _17:53:51_

All 7 have codex mirrors. Now let me launch parallel subagents to update the skills. I'll split into groups to keep each agent focused.

## Assistant _17:54:03_

<details><summary>Tool calls</summary>

- Agent: Update concept-exploration skill

</details>

## Assistant _17:54:12_

<details><summary>Tool calls</summary>

- Agent: Update icp skill

</details>

## Assistant _17:54:20_

<details><summary>Tool calls</summary>

- Agent: Update competitive-analysis skill

</details>

## Assistant _17:54:26_

<details><summary>Tool calls</summary>

- Agent: Update platform-strategy skill

</details>

## Assistant _17:54:31_

<details><summary>Tool calls</summary>

- Agent: Update ux-variations skill

</details>

## Assistant _17:54:45_

<details><summary>Tool calls</summary>

- Agent: Update research-roadmap skill

</details>

## Assistant _17:54:55_

<details><summary>Tool calls</summary>

- Agent: Update reconcile-research skill

</details>

## Assistant _17:54:59_

Concept-exploration agent done. Waiting for the other 6 Phase 2 agents to complete, then I'll start Phase 3 prep in the meantime.

Let me get the Tier 3 skill archives started while the Phase 2 agents finish — these are independent operations.

## Assistant _17:55:04_

<details><summary>Tool calls</summary>

- Bash: Archive all 16 Tier 3 skills before version bump

</details>

## Assistant _17:55:10_

All 16 Tier 3 skill archives done. 4 of 7 Phase 2 agents complete (concept-exploration, icp, platform-strategy, ux-variations). Waiting for competitive-analysis, research-roadmap, and reconcile-research agents.

Let me now check which Tier 3 skills have codex mirrors so I can include them in the subagent prompts.

## Assistant _17:55:12_

<details><summary>Tool calls</summary>

- Bash: Check codex mirrors for Tier 3 skills

</details>

## Assistant _17:55:24_

All 16 have codex mirrors. 5 of 7 Phase 2 agents complete now — competitive-analysis just finished. Just waiting for research-roadmap and reconcile-research.

Let me start Phase 3 — launching subagents for the Tier 3 skills. I'll batch them by pack to keep it organized. Each agent handles 3-5 skills.

## Assistant _17:55:24_

<details><summary>Tool calls</summary>

- TaskUpdate

</details>

## Assistant _17:55:39_

<details><summary>Tool calls</summary>

- Agent: Tier 3: positioning skill

</details>

## Assistant _17:55:44_

<details><summary>Tool calls</summary>

- Agent: Tier 3: journey-map skill

</details>

## Assistant _17:55:58_

<details><summary>Tool calls</summary>

- Agent: Tier 3: business-growth batch 1

</details>

## Assistant _17:56:07_

<details><summary>Tool calls</summary>

- Agent: Tier 3: business-growth batch 2

</details>

## Assistant _17:56:18_

<details><summary>Tool calls</summary>

- Agent: Tier 3: customer-lifecycle batch

</details>

## Assistant _17:56:23_

Phase 2 complete — all 7 manifest-aware skills updated. Phase 3 has 2 of 5 batches done (positioning, journey-map). Waiting on the 3 remaining batch agents.

## Assistant _17:56:24_

<details><summary>Tool calls</summary>

- TaskUpdate

</details>

## User _17:58:08_

<task-notification>
<task-id>a0393c2ceae1e3109</task-id>
<tool-use-id>toolu_01M3RgXtg1SsTxjdpX3uRatp</tool-use-id>
<output-file>/private/tmp/claude-501/-Users-georgele-projects-tools-agentic-skills/c942ec23-f954-4749-bdf6-729b1d6bba13/tasks/a0393c2ceae1e3109.output</output-file>
<status>completed</status>
<summary>Agent "Tier 3: business-growth batch 2" completed</summary>
<result>All 16 edits complete across 12 files. Here is a summary:

**Updated files (all under `packs/business-growth/`):**

| Skill | Files changed | Key additions |
|-------|--------------|---------------|
| **landing-copy** | `claude/landing-copy/SKILL.md`, `codex/landing-copy/SKILL.md`, `claude/landing-copy/CHANGELOG.md` | v0.1 to v0.2, step 0a manifest reading, scoped to active product path |
| **growth-model** | `claude/growth-model/SKILL.md`, `codex/growth-model/SKILL.md`, `claude/growth-model/CHANGELOG.md` | v0.1 to v0.2, step 0a manifest reading, scoped to active product path, `## Product Path Implications` for deferred paths with different growth characteristics |
| **hook-model** | `claude/hook-model/SKILL.md`, `codex/hook-model/SKILL.md`, `claude/hook-model/CHANGELOG.md` | v0.1 to v0.2, step 0a manifest reading, scoped to active product path |
| **pmf-assessment** | `claude/pmf-assessment/SKILL.md`, `codex/pmf-assessment/SKILL.md`, `claude/pmf-assessment/CHANGELOG.md` | v0.1 to v0.2, step 0a manifest reading, scoped to active product path, `## Product Path Implications` recommending `/product-line promote` (or `$product-line promote` in Codex) when deferred path shows stronger PMF |

Each manifest block was inserted as step `### 0a. Product Path Manifest` before the existing `### 0. App Scope Resolution`. Codex variants use `$` prefix for skill commands; Claude variants use `/`.</result>
<usage><total_tokens>66834</total_tokens><tool_uses>32</tool_uses><duration_ms>119223</duration_ms></usage>
</task-notification>

## Assistant _17:58:11_

Business-growth batch 2 done. Still waiting on business-growth batch 1 and customer-lifecycle batch.

## User _17:58:23_

<task-notification>
<task-id>aad47838793a7071f</task-id>
<tool-use-id>toolu_01PS8Zg5DL68PYmxYhW8Tpxy</tool-use-id>
<output-file>/private/tmp/claude-501/-Users-georgele-projects-tools-agentic-skills/c942ec23-f954-4749-bdf6-729b1d6bba13/tasks/aad47838793a7071f.output</output-file>
<status>completed</status>
<summary>Agent "Tier 3: business-growth batch 1" completed</summary>
<result>Everything checks out. All 12 files are updated correctly:

**Summary of changes across 4 business-growth skills (metrics, gtm, monetization, experiment):**

1. **Version bumps** -- metrics v0.1-&gt;v0.2, gtm v0.2-&gt;v0.3, monetization v0.2-&gt;v0.3, experiment v0.1-&gt;v0.2 -- applied in both claude and codex SKILL.md files (8 files total).

2. **Product Path Manifest step** -- Added as step 1 after "App Scope Resolution (step 0)" in each skill's Process section, with skill-specific scoping language and `## Product Path Implications` section guidance. Claude variants use `/` prefix for skill commands, codex variants use `$` prefix. All subsequent steps renumbered accordingly (8 files).

3. **CHANGELOG.md updates** -- Added v0.2/v0.3 entries dated 2026-05-27 to all 4 changelog files documenting the manifest awareness addition.

Files modified:
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/claude/metrics/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/codex/metrics/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/claude/metrics/CHANGELOG.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/claude/gtm/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/codex/gtm/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/claude/gtm/CHANGELOG.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/claude/monetization/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/codex/monetization/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/claude/monetization/CHANGELOG.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/claude/experiment/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/codex/experiment/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/packs/business-growth/claude/experiment/CHANGELOG.md`</result>
<usage><total_tokens>73001</total_tokens><tool_uses>85</tool_uses><duration_ms>141734</duration_ms></usage>
</task-notification>

## Assistant _17:58:26_

Business-growth batch 1 done. Just waiting on the customer-lifecycle batch (6 skills) to complete Phase 3.

## User _17:59:31_

<task-notification>
<task-id>a009d7670905fd2b7</task-id>
<tool-use-id>toolu_011fG3ok1uDUVTKmr2NT5pBP</tool-use-id>
<output-file>/private/tmp/claude-501/-Users-georgele-projects-tools-agentic-skills/c942ec23-f954-4749-bdf6-729b1d6bba13/tasks/a009d7670905fd2b7.output</output-file>
<status>completed</status>
<summary>Agent "Tier 3: customer-lifecycle batch" completed</summary>
<result>The diff shows a lot of other changes already staged/modified from before my work. The 18 files I edited (12 SKILL.md + 6 CHANGELOG.md) are all showing the correct changes in the customer-lifecycle directory.

All 18 files updated:

**12 SKILL.md files** (6 claude + 6 codex):
- Version bumped from v0.1 to v0.2 in frontmatter
- Added manifest reading step (step 2) to each Workflow section after app scope resolution
- Renumbered subsequent steps (3-7)
- Codex variants use `$` prefix instead of `/` for skill commands (including `$product-line promote` in expansion-map codex)

**6 CHANGELOG.md files** -- each got a new `## v0.2 - 2026-05-27` entry with the two changelog lines.

**Expansion-map** has the extra sentence about `## Product Path Implications` and `/product-line promote` (or `$product-line promote` in codex) as specified.</result>
<usage><total_tokens>49116</total_tokens><tool_uses>77</tool_uses><duration_ms>190819</duration_ms></usage>
</task-notification>

## Assistant _17:59:35_

All Phase 3 agents complete. Let me verify the changes and ship.

## Assistant _17:59:36_

<details><summary>Tool calls</summary>

- TaskUpdate

</details>

## Assistant _17:59:36_

<details><summary>Tool calls</summary>

- TaskUpdate

</details>

## Assistant _17:59:40_

<details><summary>Tool calls</summary>

- Bash: Check for broken skill references

</details>

## Assistant _17:59:40_

<details><summary>Tool calls</summary>

- Bash: Show diff stats for all changes

</details>

## Assistant _17:59:44_

No broken references. Let me spot-check a few key edits to verify correctness.

## Assistant _17:59:48_

<details><summary>Tool calls</summary>

- Bash: Verify version bumps across representative skills

</details>

## Assistant _17:59:50_

<details><summary>Tool calls</summary>

- Bash: Verify active_paths references across skills

</details>

## Assistant _17:59:52_

<details><summary>Tool calls</summary>

- Bash: Verify product-line references in key skills

</details>

## Assistant _17:59:57_

All checks pass:
- Version bumps correct across all skills
- `active_paths` plural references present in all updated skills
- `product-line` cross-references exist where expected (competitive-analysis, research-roadmap, pmf-assessment)
- No broken skill references

Let me also verify the untracked files (new product-line skill + archives) are all accounted for.

## Assistant _17:59:58_

<details><summary>Tool calls</summary>

- Bash: Show git status summary

</details>

## Assistant _18:00:00_

<details><summary>Tool calls</summary>

- Bash: Show untracked files

</details>

## Assistant _18:00:03_

<details><summary>Tool calls</summary>

- Bash: Count untracked files

</details>

## Assistant _18:00:06_

Everything looks good. Let me check the git log for commit style, then commit and push.

## Assistant _18:00:06_

<details><summary>Tool calls</summary>

- Bash: Check recent commit style

</details>

## Assistant _18:00:11_

<details><summary>Tool calls</summary>

- Bash: Stage all skill changes

</details>

## Assistant _18:00:14_

<details><summary>Tool calls</summary>

- Bash: Verify staged changes

</details>

## Assistant _18:00:17_

96 files staged — that's the right scope (new skill files + archives + edits + codex mirrors + changelogs).

## Assistant _18:00:21_

<details><summary>Tool calls</summary>

- Bash: Commit all changes

</details>

## Assistant _18:00:24_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _18:00:28_

<details><summary>Tool calls</summary>

- TaskUpdate

</details>

## Assistant _18:00:38_

All done. Here's what shipped:

**New skill:** `product-line` (business-ops pack) — 5 modes: `review`, `promote`, `prune`, `fork`, `triggers`

**Manifest evolution:**
- `active_path` (singular) → `active_paths` (plural list) with backward compat
- New `pipeline_stage` field per path entry
- New `max_concurrent` top-level field

**Updated 23 skills across 6 packs:**
- **7 manifest-aware** (Tier 2): concept-exploration, icp, competitive-analysis, platform-strategy, ux-variations, research-roadmap, reconcile-research — all handle plural `active_paths`, write `pipeline_stage`, and cross-reference `/product-line` where appropriate
- **16 mid/late-pipeline** (Tier 3): positioning, journey-map, metrics, gtm, monetization, experiment, landing-copy, growth-model, hook-model, pmf-assessment, onboarding-map, conversion-map, retention-map, expansion-map, transaction-map, lifecycle-metrics — all now read the manifest and scope to the active product path

Every skill got: archive → version bump → SKILL.md edit → CHANGELOG update → codex mirror update. 96 files changed, `skill-deps.sh --broken` passes clean.
