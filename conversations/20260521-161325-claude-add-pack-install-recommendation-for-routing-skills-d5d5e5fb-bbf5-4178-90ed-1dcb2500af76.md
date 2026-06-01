# Add pack install recommendation for routing skills

| Field | Value |
|-------|-------|
| **Date** | 2026-05-21 16:13:25 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `d5d5e5fb-bbf5-4178-90ed-1dcb2500af76` |
| **Entrypoint** | cli |
| **Version** | 2.1.146 |

---

## User _16:13:25_

some of the skills if they're routing to icp and other research skills, they should recommend pack install if the skill does not exist in that directory

## Assistant _16:13:29_

Let me explore the skills to find which ones route to ICP/research skills and understand the current pattern.

## Assistant _16:13:34_

<details><summary>Tool calls</summary>

- Agent: Find skills routing to research/ICP

</details>

## Assistant _16:15:14_

Good findings. It sounds like most skills already have a "Pack Availability Guard" pattern, but I need to check which ones are missing it or implementing it inconsistently. Let me look at the specific global skills that route to pack-based research skills.

## Assistant _16:15:16_

<details><summary>Tool calls</summary>

- Bash: Find global skills referencing pack-based research skills

</details>

## Assistant _16:15:17_

<details><summary>Tool calls</summary>

- Bash: Find global skills that already have the pack guard

</details>

## Assistant _16:15:21_

Several global skills reference pack-based research skills but lack the Pack Availability Guard. Let me check each one.

## Assistant _16:15:24_

<details><summary>Tool calls</summary>

- Bash: Check how each skill references pack-based research skills

</details>

## Assistant _16:15:51_

Let me check brainstorm and prototype more closely — they reference research skills and might route users to them.

## Assistant _16:15:53_

<details><summary>Tool calls</summary>

- Bash: Check brainstorm's routing/next-step patterns

</details>

## Assistant _16:15:53_

<details><summary>Tool calls</summary>

- Bash: Check prototype's routing/next-step patterns

</details>

## Assistant _16:15:54_

<details><summary>Tool calls</summary>

- Bash: Check ux-variations' routing/next-step patterns

</details>

## Assistant _16:15:55_

<details><summary>Tool calls</summary>

- Bash: Check ui-interview's routing/next-step patterns

</details>

## Assistant _16:16:15_

Let me also check the Codex versions and any other skills that might route to pack skills without the guard.

## Assistant _16:16:17_

<details><summary>Tool calls</summary>

- Bash: Find codex skills referencing pack-based research skills

</details>

## Assistant _16:16:17_

<details><summary>Tool calls</summary>

- Bash: Check which codex skills have the guard

</details>

## Assistant _16:16:32_

Let me check pack-based skills that route to other pack skills — those might be missing guards too.

## Assistant _16:16:33_

<details><summary>Tool calls</summary>

- Bash: Check which pack skills have the guard

</details>

## Assistant _16:16:35_

<details><summary>Tool calls</summary>

- Bash: Find pack skills that reference other pack skills

</details>

## Assistant _16:17:30_

Let me narrow this down to cross-pack references — same-pack references don't need the guard.

## Assistant _16:17:37_

<details><summary>Tool calls</summary>

- Bash: Find cross-pack skill references

</details>

## Assistant _16:20:34_

Here's what I found:

**Global skills that route to pack-based research skills:**
- `concept-exploration`, `desk-flip`, `bootstrap-repo` — already have explicit `/pack install` guards
- `feature-interview`, `research-roadmap`, `roadmap`, `spec-drift`, `spec-interview`, `uat`, `dogfood` — already have the generic "Pack Availability Guard" section

**Global skills that reference research files but DON'T route to pack skills:**
- `brainstorm`, `prototype`, `ux-variations`, `ui-interview` — these read research files as inputs and route to other global skills, not to `/icp` etc.

**Pack skills with heavy cross-pack references (no guard at all):**
- `business-discovery` skills reference `customer-lifecycle`, `business-growth`, and `business-ops` skills
- `business-growth` skills reference `business-discovery` and `customer-lifecycle` skills
- `business-ops` skills reference `business-discovery` and `business-growth` skills
- Total: ~30+ pack skills with cross-pack routing and zero guards

The pack-to-pack cross-references are the biggest gap. None of the pack skills have the guard.

## Assistant _16:20:37_

<details><summary>Tool calls</summary>

- AskUserQuestion

</details>

## Assistant _16:22:23_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _16:22:27_

Let me identify exactly which pack skills have explicit next-step routing to skills from other packs, then plan the changes.

## Assistant _16:22:27_

<details><summary>Tool calls</summary>

- EnterPlanMode

</details>

## Assistant _16:22:41_

<details><summary>Tool calls</summary>

- Agent: Find pack skills with cross-pack next-step routing

</details>

## Assistant _16:24:02_

Let me check the Codex versions of the skills that have inline pack install logic to see if they match.

## Assistant _16:24:03_

<details><summary>Tool calls</summary>

- Bash: Check codex versions for pack install guards

</details>

## Assistant _16:24:05_

<details><summary>Tool calls</summary>

- Bash: Check tail of skills without guards for routing

</details>

## Assistant _16:24:21_

Let me search more specifically for skills that recommend `/icp` as a command to run.

## Assistant _16:24:23_

<details><summary>Tool calls</summary>

- Bash: Find all skills that recommend running /icp

</details>

## Assistant _16:24:24_

<details><summary>Tool calls</summary>

- Bash: Find all skills that recommend /competitive-analysis

</details>

## Assistant _16:24:25_

<details><summary>Tool calls</summary>

- Bash: Find all skills that recommend /journey-map

</details>

## Assistant _16:24:49_

Now I have a complete picture. Let me read the existing Pack Availability Guard pattern to understand the exact format.

## Assistant _16:24:50_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/feature-interview/SKILL.md`

</details>

## Assistant _16:24:51_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/spec-interview/SKILL.md`

</details>

## Assistant _16:25:00_

Now I have all the context. Let me read the `roadmap` skill's routing to `/journey-map` to understand the pattern there.

## Assistant _16:25:01_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/roadmap/SKILL.md`

</details>

## Assistant _16:25:03_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/roadmap/SKILL.md`

</details>

## Assistant _16:25:06_

Good. Now I have the full picture. Let me write the plan.

## Assistant _16:25:21_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/effervescent-scribbling-cray.md`

</details>

## Assistant _16:25:24_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _16:25:26_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _16:25:47_

[Request interrupted by user for tool use]
