# Create UAT-guide skill for step-by-step instructions

| Field | Value |
|-------|-------|
| **Date** | 2026-04-29 14:56:01 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `79f12ef8-b77f-42ce-acae-547e6b6caa4c` |
| **Entrypoint** | cli |
| **Version** | 2.1.123 |

---

## User _14:56:01_

I want you to extend the UAT skill so that it doesn't just produce files but that it can provide the click by click instructions for a user (a la the guide skill) so that a user can be guided through the process of UAT. Perhaps we could build a separate UAT-guide skill which would work off the initially generated UAT skill? What do you recommend?

## Assistant _14:56:06_

Let me explore the UAT skill and guide skill to understand both patterns before recommending an approach.

## Assistant _14:56:09_

<details><summary>Tool calls</summary>

- Agent: Explore UAT and guide skills

</details>

## Assistant _14:57:02_

Good, I have a clear picture of both skills. Let me read the actual skill files to ground my design.

## Assistant _14:57:02_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/uat/SKILL.md`

</details>

## Assistant _14:57:02_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/guide/SKILL.md`

</details>

## Assistant _14:57:18_

I have a clear picture of both skills. Here's my recommendation:

**A separate `/uat-guide` skill is the right call.** The UAT skill is a planning/analysis tool (generates journeys), while the guide skill is an interactive walkthrough tool. These are fundamentally different modes — mixing them would bloat UAT and make the guide behavior harder to invoke on demand. The existing UAT skill already routes to `/guide` for external blockers, so a `/uat-guide` that reads `research/uat-plan.md` and walks through journeys one-at-a-time fits naturally into that same routing pattern.

The key design: `/uat-guide` reads the UAT plan, picks the next unrun journey (or one the user specifies), and produces click-by-click steps tailored to the actual product UI — using the same web-search-for-current-UI approach as `/guide`, but oriented around the UAT journey's task sequence rather than an external service blocker.

Let me design this properly.

## Assistant _14:57:39_

<details><summary>Tool calls</summary>

- Agent: Design uat-guide skill

</details>

## Assistant _14:59:21_

Now let me check what else needs updating when adding a new skill.

## Assistant _14:59:22_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _14:59:23_

<details><summary>Tool calls</summary>

- Bash: Check create-skill directory

</details>

## Assistant _14:59:27_

<details><summary>Tool calls</summary>

- Bash: Find UAT entries in skills reference

</details>

## Assistant _14:59:27_

<details><summary>Tool calls</summary>

- Bash: Check skills index directory

</details>

## Assistant _14:59:30_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _14:59:32_

Now let me check the next-step contracts doc since it's referenced.

## Assistant _14:59:33_

<details><summary>Tool calls</summary>

- Bash: Find UAT/guide references in next-step contracts

</details>

## Assistant _14:59:35_

Good, I have all the context I need. Let me write the plan.

## Assistant _15:00:02_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/i-want-you-to-velvety-brooks.md`

</details>

## Assistant _15:00:05_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _15:00:09_

The plan creates a new `/uat-guide` skill that reads UAT journeys from `research/uat-plan.md` and expands each high-level task-sequence step into click-by-click (or command-by-command) tester instructions — same pattern as `/guide` but structured around a full UAT journey lifecycle. It also updates the UAT skill's follow-up routing to point to `/uat-guide` and registers the new skill in the reference docs.

## Assistant _15:00:09_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _15:00:35_

[Request interrupted by user for tool use]
