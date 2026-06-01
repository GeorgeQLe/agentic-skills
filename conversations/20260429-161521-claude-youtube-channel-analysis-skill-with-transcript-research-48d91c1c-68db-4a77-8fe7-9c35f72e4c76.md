# YouTube channel analysis skill with transcript research

| Field | Value |
|-------|-------|
| **Date** | 2026-04-29 16:15:21 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `48d91c1c-68db-4a77-8fe7-9c35f72e4c76` |
| **Entrypoint** | cli |
| **Version** | 2.1.123 |

---

## User _16:15:21_

can you do some deep research and determine if there is a way for you as an agent to look up and research a given youtube channel. I want to create a skill which can do the following: Pull the videoes published by that channel, fetch the transcripts for those videos, and create a positve/negative report telling me what I'm doing well and should double down on, what I'm doing wrong. Focus on repeated weaknesses in positioning, hooks, interview style, credibility, topic selection, pacing, editing, startup rigor, and audience trust. Include the videos reviewed with publish dates and links, then the critical findings. Save the report as a markdown file with the date in the filename and summarize the key issues in the thread.

## Assistant _16:15:32_

I'll research the feasibility of YouTube channel analysis — specifically video listing, transcript fetching, and what tools/APIs are available to me as an agent. Let me explore in parallel.

## Assistant _16:15:41_

<details><summary>Tool calls</summary>

- Agent: Research YouTube API capabilities

</details>

## Assistant _16:15:46_

<details><summary>Tool calls</summary>

- Agent: Explore existing skill patterns

</details>

## Assistant _16:16:52_

Good research results. The approach is feasible using **yt-dlp** (list channel videos) + **youtube-transcript-api** (fetch transcripts) — both work without API keys. Let me check what's already installed and read a skill template to nail the format.

## Assistant _16:16:53_

<details><summary>Tool calls</summary>

- Bash: Check if yt-dlp and youtube-transcript-api are installed

</details>

## Assistant _16:16:55_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/research-roadmap/SKILL.md`

</details>

## Assistant _16:16:56_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/competitive-analysis/SKILL.md`

</details>

## Assistant _16:17:53_

Now I have a solid understanding. Let me design the skill with a Plan agent.

## Assistant _16:18:14_

<details><summary>Tool calls</summary>

- Agent: Design youtube-audit skill

</details>

## Assistant _16:20:33_

Good research complete. The approach is fully feasible. Let me write the plan.

## Assistant _16:21:03_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/can-you-do-some-serene-willow.md`

</details>

## Assistant _16:21:07_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _16:21:13_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _16:22:05_

[Request interrupted by user for tool use]
