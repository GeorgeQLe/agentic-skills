# add-workshop-skills-validation

| Field | Value |
|-------|-------|
| **Date** | 2026-04-30 14:26:35 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `5b58abac-002d-4068-9236-ea9feb824823` |
| **Entrypoint** | cli |
| **Version** | 2.1.123 |

---

## User _14:26:35_

Implement the following plan:

# Plan: Add 5 business-app workshop skills + update workflow docs

## Context

The business-app pack has 22 research/strategy skills covering concept → ICP → competitive → positioning → journey → metrics → monetization → GTM → spec → build. Session analysis identified 5 gaps in the traditional startup workshop canon: no business-model synthesis (Lean Canvas), no solution-customer fit validation (Value Proposition Canvas), no habit-loop design (Hook Model), no growth-loop design (Growth Model), and no PMF measurement (PMF Assessment). These are the structured workshop exercises that accelerators and product teams use but the current skill set doesn't cover.

## New canonical workflow (18-step)

```
DISCOVER:
 1. concept-exploration        shape the idea
 2. icp                        discover target customers
 3. competitive-analysis       map the market

VALIDATE FIT:
 4. value-prop-canvas          does solution match customer?       NEW
 5. positioning                frame against alternatives
 6. lean-canvas                synthesize 1-page business model    NEW

DESIGN THE EXPERIENCE:
 7. journey-map                map discovery → advocacy path
 8. hook-model                 design habit loops (skip B2B)       NEW

DESIGN THE BUSINESS:
 9. metrics                    define success targets
10. monetization               design pricing & revenue
11. gtm                        plan go-to-market
12. growth-model               design compounding loops            NEW

SPEC & BUILD:
13. spec-interview             turn research into specs
14. ux-variation               explore experience alternatives
15. ui-interview               lock interface detail
16. roadmap                    sequence into phases
17. plan-phase → run → ship

VALIDATE PMF:
18. pmf-assessment             measure product-market fit          NEW
```

---

## Part 1: Create 5 Claude skill variants (new files)

Use `packs/business-app/claude/positioning/SKILL.md` as the structural template. Each skill follows: frontmatter → intro → Prerequisites → Process (Step 0 app scope, numbered steps with AskUserQuestion checkpoints, next-step routing, write output, downstream impact check) → Output (markdown template) → Task Classification → Constraints → Archive-First Policy → Shipping Contract.

### 1a. `packs/business-app/claude/value-prop-canvas/SKILL.md`
- **Frontmatter**: `name: value-prop-canvas`, `type: research`, `description: Strategyzer-style jobs/pains/gains to features/relievers/creators fit validation`
- **Hard prereq**: `research/icp.md`. **Soft**: `research/competitive-analysis.md`, `research/concept-brief.md`
- **Process**: Load ICP jobs/pains/gains → research VPC methodology for domain → build Customer Profile (jobs, pains, gains) → build Value Map (features, pain relievers, gain creators) → score fit per job → flag gaps/risks → interview to validate → write output
- **Output**: `research/value-prop.md`, `research/value-prop-search-log.md`
- **Next step**: RECOMMEND `/positioning`; other: `/spec-interview [top gap]`, `/competitive-analysis`

### 1b. `packs/business-app/claude/lean-canvas/SKILL.md`
- **Frontmatter**: `name: lean-canvas`, `type: research`, `description: One-page Lean Canvas business model synthesis (Ash Maurya)`
- **Hard prereq**: `research/icp.md`. **Soft**: `research/competitive-analysis.md`, `research/positioning.md`, `research/value-prop.md`, `research/concept-brief.md`
- **Process**: Load all upstream research → synthesize each canvas section from research (Problem from ICP pains, Segments from ICP, UVP from positioning, Solution from concept-brief, Channels from competitive) → Revenue Streams & Cost Structure as hypotheses marked "to be validated by `/monetization`" → Unfair Advantage from positioning → interview to validate → write output
- **Output**: `research/lean-canvas.md`, `research/lean-canvas-search-log.md`
- **Next step**: ALWAYS `/journey-map`; other: `/monetization` (validate revenue/cost), `/spec-interview`

### 1c. `packs/business-app/claude/hook-model/SKILL.md`
- **Frontmatter**: `name: hook-model`, `type: research`, `description: Nir Eyal engagement loop design — trigger, action, variable reward, investment`
- **Hard prereq**: `research/journey-map.md`. **Soft**: `research/icp.md`, `research/competitive-analysis.md`
- **Process**: Load journey retention/habit data → **applicability check** (detect B2B/enterprise, offer skip to `/metrics` via AskUserQuestion) → research hook patterns for domain → design each loop: External Triggers (from journey discovery), Internal Triggers (from ICP emotional pains), Action (simplest behavior), Variable Reward (tribe/hunt/self), Investment (loads next trigger) → map multiple hooks if distinct loops exist → interview to validate → write output
- **Output**: `research/hook-model.md`, `research/hook-model-search-log.md`
- **Next step**: ALWAYS `/metrics`; other: `/spec-interview [engagement mechanism]`
- **Key constraint**: Must be explicitly skippable for B2B/enterprise

### 1d. `packs/business-app/claude/growth-model/SKILL.md`
- **Frontmatter**: `name: growth-model`, `type: research`, `description: Reforge-style growth loop design — acquisition, retention, and monetization loops`
- **Hard prereq**: `research/metrics.md`, `research/gtm.md`. **Soft**: `research/journey-map.md`, `research/monetization.md`, `research/hook-model.md`
- **Process**: Load metrics + GTM + journey + monetization → research growth loops for category → identify loop candidates (viral, content, paid, sales; retention; monetization) → interview on candidates → design primary loop (steps, conversion hypotheses, compounding mechanism) → design 1-2 supporting loops → map dependencies and metrics alignment → interview to validate → write output
- **Output**: `research/growth-model.md`, `research/growth-model-search-log.md`
- **Next step**: RECOMMEND `/spec-interview [top growth mechanism]`; other: `/roadmap`, `/experiment [growth hypothesis]`

### 1e. `packs/business-app/claude/pmf-assessment/SKILL.md`
- **Frontmatter**: `name: pmf-assessment`, `type: research`, `description: Sean Ellis PMF survey design + qualitative signal analysis for post-launch fit measurement`
- **Hard prereq**: `research/metrics.md`. **Soft**: `research/icp.md`, `research/journey-map.md`, `research/customer-feedback.md`
- **Process**: Load metrics + ICP + journey + feedback → **launch check** (warn if no live product evidence) → research Sean Ellis methodology → design survey (core "very disappointed" question + 3-5 tailored follow-ups) → qualitative signal analysis from customer-feedback if exists → scoring framework (40% threshold + signals checklist) → interview to validate → write output
- **Output**: `research/pmf-assessment.md`, `research/pmf-assessment-search-log.md`
- **Next step**: Weak PMF → skill addressing weakest area; Strong PMF → `/growth-model` or `/roadmap`

---

## Part 2: Create 5 Codex skill variants (new files)

Each goes to `packs/business-app/codex/{name}/SKILL.md`. Apply Codex conventions: `$skill` syntax, `request_user_input` in Plan mode, "Invoke as `$name`" line, Recommended + Other options next-step format.

- `packs/business-app/codex/value-prop-canvas/SKILL.md`
- `packs/business-app/codex/lean-canvas/SKILL.md`
- `packs/business-app/codex/hook-model/SKILL.md`
- `packs/business-app/codex/growth-model/SKILL.md`
- `packs/business-app/codex/pmf-assessment/SKILL.md`

---

## Part 3: Create 5 Codex agent configs (new files)

Each goes to `packs/business-app/codex/{name}/agents/openai.yaml` with display_name, short_description, default_prompt, `allow_implicit_invocation: true`.

---

## Part 4: Update existing skill routing (8 file edits)

### `competitive-analysis` (Claude + Codex)
Insert `/value-prop-canvas` as first standard-mode recommendation, before `/journey-map`.

### `positioning` (Claude + Codex)
Replace ALWAYS `/gtm` with ALWAYS `/lean-canvas`. Add `/journey-map` as high-priority option. Keep `/gtm` as conditional.

### `journey-map` (Claude + Codex)
Add `/hook-model` for consumer/PLG before the existing ALWAYS `/metrics`. Make `/metrics` the fallback when hook-model is skipped or exists.

### `gtm` (Claude + Codex)
Add `/growth-model` as conditional recommendation when `research/growth-model.md` doesn't exist, before `/roadmap`.

---

## Part 5: Update documentation (6 files)

### `docs/skills-reference.md` (lines 107-125)
- Add 5 skills to comma-separated list
- Replace default flow diagram with new 18-step phased workflow

### `README.md` (lines 130-143)
- Add 5 skills to list
- Update default flow diagram to match

### `docs/canonical-workflow-report.md` (lines 200-224)
- Update Fresh Directory workflow sequence to include new skills
- Update "Canonical behavior" descriptions (item 3: expand research sequence)

### `docs/codex-workflow.md`
- Mirror workflow sequence changes for Codex `$` syntax

### `docs/skill-next-step-contracts.md` (lines 44-58)
- Add 5 new rows to Multi-State Skill Rules table
- Update `positioning` row: `gtm` → `lean-canvas` as natural next step
- Update `competitive-analysis` row: mention `value-prop-canvas`
- Update `gtm` row: add `growth-model`

### `docs/operating-modes.md` (Pack emphasis)
- Update `business-app` pack Notes to mention new skills

---

## Execution order

| Step | What | Files | Count |
|------|------|-------|-------|
| 1 | Claude variants | `packs/business-app/claude/{5 skills}/SKILL.md` | 5 new |
| 2 | Codex variants | `packs/business-app/codex/{5 skills}/SKILL.md` | 5 new |
| 3 | Agent configs | `packs/business-app/codex/{5 skills}/agents/openai.yaml` | 5 new |
| 4 | Routing updates | 4 skills × 2 variants | 8 edits |
| 5 | Doc updates | 6 documentation files | 6 edits |
| 6 | Commit & push | Group by feature | — |

Total: 15 new files + 14 edits = 29 file operations.

---

## Verification

1. `ls packs/business-app/claude/ | wc -l` → 27 (was 22)
2. `ls packs/business-app/codex/ | wc -l` → 27 (was 22)
3. `grep -r "value-prop-canvas\|lean-canvas\|hook-model\|growth-model\|pmf-assessment" docs/skills-reference.md` → all 5 present
4. `grep -r "value-prop-canvas" packs/business-app/claude/competitive-analysis/SKILL.md` → routing updated
5. `grep -r "lean-canvas" packs/business-app/claude/positioning/SKILL.md` → routing updated
6. `grep -r "hook-model" packs/business-app/claude/journey-map/SKILL.md` → routing updated
7. `grep -r "growth-model" packs/business-app/claude/gtm/SKILL.md` → routing updated
8. New workflow in docs matches: concept → icp → competitive → value-prop-canvas → positioning → lean-canvas → journey → hook-model → metrics → monetization → gtm → growth-model → spec → ux → ui → roadmap → build → pmf-assessment


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/d9fa3b0e-9c04-4abd-baf9-3651e8b68f65.jsonl

## Assistant _14:26:40_

I'll start by reading the template skill and understanding the existing file structure, then execute the 5 parts in parallel where possible.

## Assistant _14:26:41_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/positioning/SKILL.md`

</details>

## Assistant _14:26:42_

<details><summary>Tool calls</summary>

- Bash: `ls /Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/`

</details>

## Assistant _14:26:42_

<details><summary>Tool calls</summary>

- Bash: `ls /Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/`

</details>

## Assistant _14:26:46_

Good, I have the template. Let me also read a Codex variant and agent config for the template patterns.

## Assistant _14:26:48_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/positioning/SKILL.md`

</details>

## Assistant _14:26:48_

<details><summary>Tool calls</summary>

- Bash: `ls /Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/positioning/`

</details>

## Assistant _14:26:49_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/competitive-analysis/SKILL.md`

</details>

## Assistant _14:26:53_

Now let me check the agent config pattern and read the files I need to edit for routing updates.

## Assistant _14:26:54_

<details><summary>Tool calls</summary>

- Bash: `find /Users/georgele/projects/tools/agentic-skills/packs/business-app/codex -name "openai.yaml" |...`

</details>

## Assistant _14:26:55_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/competitive-analysis/SKILL.md`

</details>

## Assistant _14:26:56_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/journey-map/SKILL.md`

</details>

## Assistant _14:26:57_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/gtm/SKILL.md`

</details>

## Assistant _14:27:04_

<details><summary>Tool calls</summary>

- Bash: `cat /Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/positioning/agents/ope...`

</details>

## Assistant _14:27:09_

Now let me read the routing/next-steps sections of the 4 skills I need to update, plus the Codex variants.

## Assistant _14:27:10_

<details><summary>Tool calls</summary>

- Bash: `grep -n "Next Steps\|next step\|Recommended\|ALWAYS\|Other options" /Users/georgele/projects/tool...`

</details>

## Assistant _14:27:11_

<details><summary>Tool calls</summary>

- Bash: `grep -n "Next Steps\|next step\|Recommended\|ALWAYS\|Other options" /Users/georgele/projects/tool...`

</details>

## Assistant _14:27:11_

<details><summary>Tool calls</summary>

- Bash: `grep -n "Next Steps\|next step\|Recommended\|ALWAYS\|Other options" /Users/georgele/projects/tool...`

</details>

## Assistant _14:27:12_

<details><summary>Tool calls</summary>

- Bash: `grep -n "Next Steps\|next step\|Recommended\|ALWAYS\|Other options" /Users/georgele/projects/tool...`

</details>

## Assistant _14:27:13_

<details><summary>Tool calls</summary>

- Bash: `grep -n "Next Steps\|next step\|Recommended\|ALWAYS\|Other options" /Users/georgele/projects/tool...`

</details>

## Assistant _14:27:13_

<details><summary>Tool calls</summary>

- Bash: `grep -n "Next Steps\|next step\|Recommended\|ALWAYS\|Other options" /Users/georgele/projects/tool...`

</details>

## Assistant _14:27:17_

Now let me read the specific next-steps sections for the 4 Claude skills I need to update routing on.

## Assistant _14:27:18_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/competitive-analysis/SKILL.md`

</details>

## Assistant _14:27:19_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/journey-map/SKILL.md`

</details>

## Assistant _14:27:20_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/gtm/SKILL.md`

</details>

## Assistant _14:27:20_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/positioning/SKILL.md`

</details>

## Assistant _14:27:24_

Now let me read the Codex variants of the same 4 skills I need to update routing on.

## Assistant _14:27:24_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/competitive-analysis/SKILL.md`

</details>

## Assistant _14:27:25_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/journey-map/SKILL.md`

</details>

## Assistant _14:27:26_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/gtm/SKILL.md`

</details>

## Assistant _14:27:26_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/positioning/SKILL.md`

</details>

## Assistant _14:27:31_

Good, I now have a thorough understanding of all templates and routing sections. This is a large task — I'll parallelize by spawning agents for each part. Let me launch 5 agents to create the Claude skill variants in parallel, since those are the most complex files.

## Assistant _14:28:04_

<details><summary>Tool calls</summary>

- Agent: Create value-prop-canvas Claude skill

</details>

## Assistant _14:28:25_

<details><summary>Tool calls</summary>

- Agent: Create lean-canvas Claude skill

</details>

## Assistant _14:28:51_

<details><summary>Tool calls</summary>

- Agent: Create hook-model Claude skill

</details>

## Assistant _14:29:16_

<details><summary>Tool calls</summary>

- Agent: Create growth-model Claude skill

</details>

## Assistant _14:29:43_

<details><summary>Tool calls</summary>

- Agent: Create pmf-assessment Claude skill

</details>

## Assistant _14:31:39_

All 5 Claude skill variants created. Now let me create the 5 Codex variants, 5 agent configs, and do the routing updates in parallel. First let me read one of the new Claude files to use as reference for the Codex adaptation.

## Assistant _14:31:39_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/value-prop-canvas/SKILL.md`

</details>

## Assistant _14:31:40_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/positioning/SKILL.md`

</details>

## Assistant _14:31:44_

Good, I see the Codex pattern — adds "Invoke as `$name`.", "Default stance" paragraph, uses `$skill` syntax, uses `request_user_input` in Plan mode. Now let me spawn agents for the remaining work in parallel.

## Assistant _14:31:59_

<details><summary>Tool calls</summary>

- Agent: Create 5 Codex skill variants

</details>

## Assistant _14:32:09_

<details><summary>Tool calls</summary>

- Agent: Create 5 agent configs

</details>

## Assistant _14:32:39_

<details><summary>Tool calls</summary>

- Agent: Update routing in 8 skill files

</details>

## Assistant _14:38:37_

Parts 1-4 done (15 new files + 8 routing edits). Now Part 5: documentation updates. Let me read the doc files I need to update.

## Assistant _14:38:38_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _14:38:39_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/README.md`

</details>

## Assistant _14:38:40_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/canonical-workflow-report.md`

</details>

## Assistant _14:38:41_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/codex-workflow.md`

</details>

## Assistant _14:38:42_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skill-next-step-contracts.md`

</details>

## Assistant _14:38:43_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/operating-modes.md`

</details>

## Assistant _14:38:47_

Let me read the pack emphasis section of operating-modes.md and the codex-workflow.md flow section.

## Assistant _14:38:49_

<details><summary>Tool calls</summary>

- Bash: `grep -n "business-app\|Business.App\|Pack emphasis\|Pack Notes\|## Pack" /Users/georgele/projects...`

</details>

## Assistant _14:38:50_

<details><summary>Tool calls</summary>

- Bash: `grep -n "concept-exploration\|icp\|competitive\|positioning\|journey\|spec-interview\|roadmap\|De...`

</details>

## Assistant _14:38:53_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/operating-modes.md`

</details>

## Assistant _14:38:54_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/codex-workflow.md`

</details>

## Assistant _14:38:56_

Now I have all the context. Let me do all 6 documentation edits.

## Assistant _14:39:01_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _14:39:11_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _14:39:15_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/README.md`

</details>

## Assistant _14:39:17_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/README.md`

</details>

## Assistant _14:39:24_

Now update canonical-workflow-report.md, codex-workflow.md, skill-next-step-contracts.md, and operating-modes.md.

## Assistant _14:39:28_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/canonical-workflow-report.md`

</details>

## Assistant _14:39:31_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/canonical-workflow-report.md`

</details>

## Assistant _14:39:34_

Now let me check if there's a Claude-side workflow in that same file that also needs updating.

## Assistant _14:39:34_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/canonical-workflow-report.md`

</details>

## Assistant _14:39:37_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/canonical-workflow-report.md`

</details>

## Assistant _14:39:42_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/canonical-workflow-report.md`

</details>

## Assistant _14:39:44_

Now update codex-workflow.md.

## Assistant _14:39:55_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/codex-workflow.md`

</details>

## Assistant _14:39:59_

Now update skill-next-step-contracts.md — add 5 new rows and update 3 existing rows.

## Assistant _14:40:04_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/skill-next-step-contracts.md`

</details>

## Assistant _14:40:10_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/skill-next-step-contracts.md`

</details>

## Assistant _14:40:13_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/skill-next-step-contracts.md`

</details>

## Assistant _14:40:15_

Now add the 5 new skill rows to the multi-state table.

## Assistant _14:40:27_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/skill-next-step-contracts.md`

</details>

## Assistant _14:40:29_

Now update operating-modes.md.

## Assistant _14:40:32_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/operating-modes.md`

</details>

## Assistant _14:40:34_

All documentation updated. Now let me run the verification checks.

## Assistant _14:40:35_

<details><summary>Tool calls</summary>

- Bash: `ls /Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/ | wc -l`

</details>

## Assistant _14:40:35_

<details><summary>Tool calls</summary>

- Bash: `ls /Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/ | wc -l`

</details>

## Assistant _14:40:36_

<details><summary>Tool calls</summary>

- Bash: `grep -c "value-prop-canvas\|lean-canvas\|hook-model\|growth-model\|pmf-assessment" /Users/georgel...`

</details>

## Assistant _14:40:37_

<details><summary>Tool calls</summary>

- Bash: `grep "value-prop-canvas" /Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/...`

</details>

## Assistant _14:40:38_

<details><summary>Tool calls</summary>

- Bash: `grep "lean-canvas" /Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/positi...`

</details>

## Assistant _14:40:38_

<details><summary>Tool calls</summary>

- Bash: `grep "hook-model" /Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/journey...`

</details>

## Assistant _14:40:39_

<details><summary>Tool calls</summary>

- Bash: `grep "growth-model" /Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/gtm/S...`

</details>

## Assistant _14:40:44_

All 8 verification checks pass:
1. 27 Claude skills (was 22) ✓
2. 27 Codex skills (was 22) ✓
3. All 5 new skills present in skills-reference.md ✓
4. `value-prop-canvas` routing in competitive-analysis ✓
5. `lean-canvas` routing in positioning ✓
6. `hook-model` routing in journey-map ✓
7. `growth-model` routing in gtm ✓

Let me also verify the agent configs exist.

## Assistant _14:40:46_

<details><summary>Tool calls</summary>

- Bash: `ls /Users/georgele/projects/tools/agentic-skills/packs/business-app/codex/value-prop-canvas/agent...`

</details>

## Assistant _14:40:50_

All 15 new files + 14 edits complete and verified. Now let me commit and push.

## Assistant _14:40:50_

<details><summary>Tool calls</summary>

- Bash: `git status -u`

</details>

## Assistant _14:40:51_

<details><summary>Tool calls</summary>

- Bash: `git log --oneline -3`

</details>

## Assistant _14:40:58_

I see some subagents already committed their work. Let me check what's already committed vs what's still pending.

## Assistant _14:40:58_

<details><summary>Tool calls</summary>

- Bash: `git log --oneline -5`

</details>

## Assistant _14:40:58_

<details><summary>Tool calls</summary>

- Bash: `git diff --stat HEAD~2..HEAD`

</details>

## Assistant _14:41:02_

Good — growth-model Claude + all 5 Codex variants are committed. Still need to stage and commit: 4 remaining Claude skills, 5 agent configs, 8 routing edits, and 6 doc updates.

## Assistant _14:41:06_

<details><summary>Tool calls</summary>

- Bash: `git add packs/business-app/claude/value-prop-canvas/SKILL.md packs/business-app/claude/lean-canva...`

</details>

## Assistant _14:41:13_

<details><summary>Tool calls</summary>

- Bash: `git commit -m "$(cat <<'EOF'
feat(skills): add 5 business-app workshop skills + update workflow d...`

</details>

## Assistant _14:41:16_

<details><summary>Tool calls</summary>

- Bash: `git push`

</details>

## Assistant _14:41:23_

Done. Here's what was shipped:

**15 new files:**
- 5 Claude skill variants: `value-prop-canvas`, `lean-canvas`, `hook-model`, `growth-model`, `pmf-assessment`
- 5 Codex skill variants (same 5)
- 5 Codex agent configs (`agents/openai.yaml`)

**14 edits:**
- 8 routing updates across `competitive-analysis`, `positioning`, `journey-map`, `gtm` (Claude + Codex each)
- 6 doc updates: `skills-reference.md`, `README.md`, `canonical-workflow-report.md`, `codex-workflow.md`, `skill-next-step-contracts.md`, `operating-modes.md`

**Verification:** 27 skills in both Claude and Codex dirs (was 22), all routing and doc references confirmed present.

## User _14:42:46_

is all documentation is up to date?

## Assistant _14:42:51_

Let me check all the documentation files systematically to see if anything was missed or is inconsistent.

## Assistant _14:43:02_

<details><summary>Tool calls</summary>

- Agent: Audit docs for new skills

</details>

## Assistant _14:46:52_

One discrepancy found — the "Bottom Line" section in `canonical-workflow-report.md` still has the old flow. Let me fix it.

## Assistant _14:46:52_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/canonical-workflow-report.md`

</details>

## Assistant _14:46:58_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/canonical-workflow-report.md`

</details>

## Assistant _14:47:03_

<details><summary>Tool calls</summary>

- Bash: `git add docs/canonical-workflow-report.md && git commit -m "$(cat <<'EOF'
fix(docs): update Botto...`

</details>

## Assistant _14:47:08_

Found and fixed one missed spot — the "Bottom Line" summary in `canonical-workflow-report.md` (line 593) still had the old 13-step flow. All documentation is now consistent with the 18-step workflow across all 6 doc files + README.

## User _14:48:38_

<command-message>ship</command-message>
<command-name>/ship</command-name>

## User _14:48:38_

Base directory for this skill: /Users/georgele/.claude/skills/ship

# Ship

Ship current work, commit, push, deploy, and plan the next step. If `` contains `--no-plan`, skip planning. If `` contains `--no-deploy`, skip deployment.

## Process

### 1. Check if there's anything to ship
Run `git status` and `git diff --stat`.
- If the working tree is clean AND there are no unpushed commits: skip to step 3 (or stop if `--no-plan`).
- If there are changes: continue to step 2.

### 1b. Pre-ship error check
Before shipping, check for pre-existing errors so they get fixed and included in this step's commit.

a) **Check conversation context first.** If lint, typecheck, or test output already exists in the current session (e.g., from a TDD run step or plan-mode execution), use that output. Do NOT re-run commands whose results are already available.

b) **Run only what's missing.** For any validation category (lint, typecheck, tests) that was NOT already run this session, find and run the project's commands. Check these sources:
   - `CLAUDE.md` — look for lint, typecheck, or test commands
   - `Makefile` / `Justfile` — look for `check`, `lint`, `typecheck`, `test` targets
   - `package.json` — look for `lint`, `typecheck`, `check`, `test` scripts
   - `pyproject.toml` / `setup.cfg` — look for tool configs (ruff, mypy, pytest)
   - `Cargo.toml` — `cargo check`, `cargo clippy`
   - If no validation commands are found and no prior output exists, skip this step.

c) **Fix errors.** If any pre-existing errors are found (from prior session output or fresh runs):
   - Fix them.
   - Re-run only the previously-failing commands to confirm the fixes.
   - These fixes will be committed alongside the current work in step 2d (or as a separate commit if the fixes are unrelated to the current feature).

d) **If errors can't be auto-fixed** (e.g., requires user decision, third-party dependency issue), **STOP. Do not ship.** Report the errors clearly to the user and ask how they want to proceed. Never commit or push code with known build/lint/type/test failures.

### 2. Ship the work
a) Read the project's CLAUDE.md to understand current progress.
b) Update `tasks/todo.md` — mark completed items as done (check off steps and milestone criteria).
c) Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.
d) Ship the changes using the /commit-and-push-by-feature workflow:
   - Group changes into logical feature/function buckets.
   - Use conventional commit messages.
   - Land the resulting commits on `main` or `master`, not on an existing feature branch.
   - `commit-and-push-by-feature` means commit and push when the workflow succeeds.

### 3. Deploy (skip if `--no-deploy`)
After shipping, deploy only when the project has an explicit manual deploy contract.

a) **Find the deploy contract.**
   - First check for `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, read it first and use it to determine the deploy method.
   - Supplement the contract by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile` / `Justfile`, `package.json`, `deploy/`, `infra/`, `scripts/`, and `docker-compose*.yml`.
   - **Do NOT look in `.github/workflows/`** — this project does not use GitHub Actions.
   - If a deploy contract exists but no deploy method is found, **ask the user** how deployment works for this project. Do not guess.

b) **Run the deploy** using the discovered mechanism.
   - Do not run `aws sso login` preemptively from stale context, old logs, or assumptions. If the deploy method uses an AWS profile and auth status is uncertain, first run `aws sts get-caller-identity --profile <profile>` using the profile from the deploy contract or deploy command.
   - If the AWS identity check succeeds, proceed directly with the deploy and do not run `aws sso login`.
   - If the AWS identity check or the deploy command fails because AWS SSO credentials are missing or expired, do not skip deployment. Run the matching `aws sso login --profile <profile>` command, using the profile from the deploy contract, deploy command, or error output.
   - When `aws sso login` prints a browser URL, device code, or verification instructions, relay them to the user and tell them to navigate to the provided URL and complete the login in their browser. Keep the login command running until it succeeds, fails, or times out.
   - After a successful SSO login, rerun the original deploy command once. This auth recovery is part of the same deploy attempt, not an automatic retry of a failed deploy.
   - If the user cannot complete SSO login or the login command fails, report the deploy as blocked by authentication. Do not report it as skipped.

c) **Verify the deploy:**
   - Check output for errors.
   - If there's a health check URL or status command in the project config, run it.
   - Report success or failure.

d) If the deploy fails, report the error clearly. Do not retry automatically.

### 4. Plan the next step (skip if `--no-plan`)

**Prerequisite:** If neither `tasks/todo.md` nor `tasks/roadmap.md` exists, or if no uncompleted steps remain, there is no plan to continue. Run `/roadmap` to scan task pipeline health and recommend the next context-aware action (stale todo, missing steps, etc.). Then stop (do not enter plan mode).

a) **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
b) Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
b2) If `tasks/record-todo.md` or `tasks/recurring-todo.md` exists, count unchecked advisory items for status only. Do not select them as next work.
c) **Check if the current phase is complete** (all steps checked, milestone criteria met):
   - If **YES — Phase transition:**
     1. Archive the completed phase: copy `tasks/todo.md` → `tasks/phases/phase-N.md` (create `tasks/phases/` if needed). Fill in the "On Completion" section.
     1b. If `tasks/manual-todo.md` exists, inspect unchecked items before advancing phases:
         - If any unchecked `_(blocks: Step N.X)_` items still apply to the completed phase, stop. Do NOT archive the manual task file, mark the phase complete, or advance to the next phase unless the user explicitly overrides the blocker.
         - Unchecked `_(after: Step N.X)_` items are non-blocking follow-up tasks. Archive them with the phase and warn the user that they remain incomplete.
     2. Check off the phase milestone in `tasks/roadmap.md`.
     3. Copy the next phase from `tasks/roadmap.md` → overwrite `tasks/todo.md`.
     3b. Extract the next phase's manual tasks (from `**Manual Tasks:**` in `tasks/roadmap.md`) into a fresh `tasks/manual-todo.md`. If the next phase has no manual tasks, delete `tasks/manual-todo.md` if it exists.
     4. If no more phases remain, run `/roadmap` to recommend the next action based on project state. Then stop (do not enter plan mode).
     5. **Just-in-time planning:** **You MUST invoke `/plan-phase` for the new phase** — do NOT tell the user the phase is "deferred" or ask them to run `/plan-phase` manually. A phase without implementation steps is NOT deferred; it simply hasn't been decomposed yet (only items under the `## Deferred / Future Work` heading in the roadmap are actually deferred). This auto-invocation generates implementation steps, the phase `### Execution Profile`, and file-level detail using the full context of what was learned during prior phases. The roadmap only stores strategic outlines — implementation detail is generated when a phase is started, not upfront.
   - If **NO:** find the next uncompleted step within the current phase.
d) Write a **self-contained** implementation plan for the next step into `tasks/todo.md`. This plan must be complete enough that a fresh context can execute it by reading only CLAUDE.md and `tasks/todo.md`. Include:
   - What needs to be built/changed
   - Which files will be affected (full paths)
   - Key technical decisions or risks
   - Relevant context from the current session (gotchas, patterns established, conventions used)
   - If test strategy is `tdd`: which tests to write first and what they should assert
   - If test strategy is `tests-after`: note that tests will be written in the Green step
   - The current phase's `### Execution Profile`, including whether the next execution is serial, research-only, review-only, implementation-safe, or agent-team
   - Acceptance criteria: how to verify the step is done
   - **Ship-one-step handoff contract:** the next clear-context implementation session must implement only this step, validate it, mark the step done in `tasks/todo.md`, update `tasks/history.md`, commit and push the completed work, deploy only when an explicit manual deploy contract exists, write the following step's plan, ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`, start the approval UI for that following step by calling `EnterPlanMode` first, write a brief pass-through plan in plan mode, call `ExitPlanMode`, and stop before implementing it. Do not call `ExitPlanMode` from normal mode. If Claude Code refuses `EnterPlanMode` because the current mode requires an explicit user request, stop and ask the user to explicitly run `/plan <next step>` or switch to accept-edits mode before retrying `/ship`; do not fall through to `ExitPlanMode`.
e) Ship `tasks/todo.md`, `tasks/roadmap.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and `tasks/phases/` (if created) via `/commit-and-push-by-feature`, landing them on `main` or `master`.

### 5. Enter plan mode (skip if `--no-plan`)
**Before entering plan mode**, read `.claude/settings.local.json` and ensure `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"` are set. If the file doesn't exist, create it with `{ "showClearContextOnPlanAccept": true, "defaultMode": "acceptEdits" }`. If it exists but lacks either key, add the missing key (preserve existing settings). `defaultMode: "acceptEdits"` is the Claude Code setting that makes newly opened sessions prefer accept-edits mode when startup settings are honored; there is no separate known setting that only controls the clear-context launch.

**YOU MUST run the full plan-mode approval sequence.** This is not optional. A next-step plan being written or already present is not a completed `/ship` unless `--no-plan` is set or the approval UI is presented successfully.

1. Call `EnterPlanMode`. This enters plan mode.
2. In plan mode, write the plan file to the path specified by the plan-mode system prompt. Keep it brief: name the next step, state that the full implementation plan is in `tasks/todo.md`, and include the ship-one-step handoff contract. Do not explore the codebase or perform multi-phase planning; this is a pass-through to present the approval UI.
3. Call `ExitPlanMode`. This presents the approval UI where the user can choose "clear context and implement" to start a fresh context that reads `tasks/todo.md` and implements the plan.

`EnterPlanMode` alone does not present the approval UI. `ExitPlanMode` must only be called after `EnterPlanMode` has succeeded and the session is visibly in plan mode. If Claude Code reports "You are not in plan mode", do not retry `ExitPlanMode`; call `EnterPlanMode` first, then write the brief pass-through plan and call `ExitPlanMode`.

If `EnterPlanMode` is denied because Auto mode or the active permission mode requires an explicit user request to enter plan mode, stop. Report that the next plan is written and the user must explicitly request plan mode, for example: `/plan <next step name>` or "enter plan mode for <next step name>". Do not attempt `ExitPlanMode`, do not summarize as shipped into plan mode, and do not implement the following step.

There is no normal final-answer checkpoint between writing/finding the next plan and presenting the approval UI. If the prior tool call was interrupted after the plan was written, resume by calling `EnterPlanMode` rather than summarizing and stopping, unless the session is already visibly in plan mode.

### 6. Plan-mode approval content (skip if `--no-plan`)
When writing the brief pass-through plan in step 5, include a short ship summary (2-3 lines max) and **present the execution plan** to the user. Summarize the plan that was written to `tasks/todo.md` in step 4d:
- What was shipped (if anything)
- Deploy status (if deployed or skipped)
- Test status — **explicitly state whether any failing tests are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
- Manual tasks — pending count from `tasks/manual-todo.md` (if it exists), note any that block upcoming steps
- Advisory tasks — pending record/recurring counts from `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist
- What needs to be built/changed
- Which files will be created or modified (full paths)
- The approach (e.g., test strategy, key technical decisions)
- **Ship-one-step handoff contract:** after approval, implement only this step; validate it; mark it done in `tasks/todo.md`; update `tasks/history.md`; commit and push the completed work; deploy only when an explicit manual deploy contract exists; write the following step's plan; ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"`; start the approval UI for that following step by calling `EnterPlanMode` first, write a brief pass-through plan in plan mode, call `ExitPlanMode`, and stop before implementing it. Do not call `ExitPlanMode` from normal mode. If `EnterPlanMode` is denied because an explicit user request is required, stop and ask for that explicit `/plan` request.
- Any decisions or trade-offs the user should weigh in on

This gives the user something concrete to review before selecting "clear context and implement".

## Next-Step Routing

After writing the next-step plan and before entering plan mode (or before stopping when `--no-plan` is set), identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal ship summary:

- **Next work:** <specific task name, manual blocker, verification gap, or "none">
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from the next-step plan, `tasks/todo.md`, `tasks/manual-todo.md`, deploy status, validation gaps, smoke-test gaps, or the absence of remaining work. Do not use agent mode itself as the next work item.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Hybrid execution handoff → recommend `/delegate $run`.
  - Claude-only or orchestration-heavy work → recommend `/run`.
  - Codex-only execution → recommend `$run`.
  - External human-only manual work (browser/auth/DNS/service dashboard work with no reliable authenticated CLI/API path, paid account setup, real-device checks, or production smoke-test work needing human sign-off) → recommend `/guide` or a Claude-guided manual step rather than `/run`.
  - Agent-executable work misfiled in `tasks/manual-todo.md`, task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → recommend `/reconcile-dev-docs fix tasks`, promotion to `tasks/todo.md`, or a direct dev-doc audit, not `/guide`.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

## Constraints
- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do NOT write plans into CLAUDE.md. CLAUDE.md is for project conventions and config only.
- `tasks/roadmap.md` is the source of truth for the full phased plan. `tasks/todo.md` holds only the current phase.
- Do NOT create `tasks/todo.md` from scratch — if it doesn't exist and there's no roadmap, suggest discovery skills instead.
- Do NOT re-read files you've already read this session. Use what's in context.
- Do NOT explore the codebase extensively for planning. Keep context footprint minimal.
- If the tree is clean and the next step plan already exists in `tasks/todo.md`, skip straight to step 5.
- Unless `--no-plan` is set or a documented blocker stops planning, do not end the turn after writing, finding, or shipping the next-step plan; ensure `defaultMode: "acceptEdits"` is set, then run the full `EnterPlanMode` -> pass-through plan -> `ExitPlanMode` approval sequence. If `EnterPlanMode` is denied because an explicit user request is required, stop with that blocker instead of attempting `ExitPlanMode`.
- The plan shown to the clear-context implementation session must explicitly say this is a ship-one-step handoff: ship the approved step, set/check accept-edits startup mode, start the following step's approval UI with `EnterPlanMode` before `ExitPlanMode`, and stop. The plan-mode prompt is the human approval boundary that prevents a runaway loop.
- Do not amend or rewrite history.
- Do not commit secrets.
- Do not push shipping commits to an existing feature branch. Use `/commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely.
- The plan must be actionable, not vague. Include specific file paths, technical details, and the current phase's `### Execution Profile`.
- Do not execute or plan from `tasks/record-todo.md` or `tasks/recurring-todo.md`; report their counts only unless an item has been promoted into `tasks/todo.md`.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
- Do not modify code as part of the deploy process.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.

## Assistant _14:48:44_

<details><summary>Tool calls</summary>

- Bash: `git status && echo "---" && git diff --stat`

</details>

## Assistant _14:48:44_

<details><summary>Tool calls</summary>

- Bash: `git log --oneline origin/master..HEAD`

</details>

## Assistant _14:48:48_

Working tree is clean and no unpushed commits. Skipping to step 3 (deploy) and step 4 (plan).

## Assistant _14:48:49_

<details><summary>Tool calls</summary>

- Bash: `test -f /Users/georgele/projects/tools/agentic-skills/deploy.md && echo "EXISTS" || echo "NONE"; ...`

</details>

## Assistant _14:48:50_

<details><summary>Tool calls</summary>

- Bash: `test -f /Users/georgele/projects/tools/agentic-skills/tasks/todo.md && echo "TODO EXISTS" || echo...`

</details>

## Assistant _14:48:53_

Deploy skipped: no explicit manual deploy contract. Let me check the roadmap/todo for next step planning.

## Assistant _14:48:53_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:48:53_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/roadmap.md`

</details>

## Assistant _14:49:02_

All 11 phases are complete with no remaining planned work. Let me check `tasks/todo.md` for the current state.

## Assistant _14:49:03_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:49:13_

The roadmap has all 11 phases complete with no remaining phases. The todo has a queued `/research-roadmap` task but no active implementation work. Per the ship skill's step 4 prerequisite: "If no uncompleted steps remain, run `/roadmap` to scan task pipeline health and recommend the next context-aware action."

Nothing to ship — the tree is clean, all commits are pushed, and the roadmap is fully complete. The only queued item is a `/research-roadmap` scan to determine what comes next.

**Next work:** Run `/research-roadmap` to scan documentation and project health, then decide the next workstream.
**Recommended next command:** `/research-roadmap`
