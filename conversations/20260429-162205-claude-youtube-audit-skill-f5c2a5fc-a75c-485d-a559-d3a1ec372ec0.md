# youtube-audit-skill

| Field | Value |
|-------|-------|
| **Date** | 2026-04-29 16:22:05 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `f5c2a5fc-a75c-485d-a559-d3a1ec372ec0` |
| **Entrypoint** | cli |
| **Version** | 2.1.123 |

---

## User _16:22:05_

Implement the following plan:

# Plan: YouTube Audit Skill

## Context

The user wants a new skill (`/youtube-audit`) that analyzes a YouTube channel's content quality by fetching video metadata and transcripts, then producing a critical audit report. The goal is to identify repeated strengths and weaknesses across dimensions like positioning, hooks, interview style, credibility, topic selection, pacing, editing, startup rigor, and audience trust.

**Feasibility confirmed**: Two CLI tools handle data fetching without API keys:
- **yt-dlp**: Lists channel videos as JSON (`--flat-playlist --dump-json`)
- **youtube-transcript-api**: Fetches transcripts via Python (no auth needed)

Neither tool is currently installed — the skill will check for them and instruct the user to install if missing.

## Implementation

### Create `global/claude/youtube-audit/SKILL.md`

Single new file. Follows existing skill conventions (frontmatter, declarative process steps, shipping contract).

**Skill process flow:**

1. **Parse arguments** — Accept channel URL/handle + optional `--count N` (default 20, max 50). Validate yt-dlp and youtube-transcript-api are installed.

2. **Archive previous audit** — If `research/youtube-audit-*.md` exists for the same channel, archive to `docs/history/archive/YYYY-MM-DD/HHMMSS/` before proceeding.

3. **Fetch video list** — `yt-dlp --flat-playlist --dump-json --playlist-end N "CHANNEL_URL/videos"`. Parse JSON lines for id, title, upload_date, url, duration, view_count.

4. **Fetch transcripts** — Inline Python script batching video IDs, 1.5s delay between fetches to avoid rate limiting. Skip videos without transcripts (log reason). Warn user if >80% lack transcripts.

5. **Prepare analysis context** — Structured records per video (title, date, URL, transcript). Truncate to 80K words total if needed, preserving first 500 words (hook) and last 300 words (outro) of each transcript.

6. **Analyze content** — Single reasoning pass across all transcripts. Split into positive patterns (double down) and critical patterns (fix). Every finding must cite evidence from 2+ videos to qualify as a pattern. Critical dimensions: positioning, hooks, interview style, credibility, topic selection, pacing, editing signals, startup rigor, audience trust.

7. **Write report** — Save to `research/youtube-audit-YYYY-MM-DD.md`. Includes: video table with dates/links, positive findings with frequency/evidence/recommendations, critical findings with severity/frequency/evidence/impact/recommendations, top 3 strengths, top 3 weaknesses, strategic recommendation.

8. **Summarize in thread** — Output key strengths, key issues, and strategic recommendation after saving.

**Key design decisions:**
- Sequential transcript fetching (not parallel) to avoid IP rate limiting
- Pattern-only reporting: findings require evidence from 2+ videos
- Smart truncation: preserve hooks and outros, trim middles
- No API keys required — both tools work unauthenticated against public data

### Also create `global/codex/youtube-audit/SKILL.md`

Mirror for Codex compatibility, following the same pattern as other skills in the repo (every `global/claude/` skill has a `global/codex/` counterpart).

## Files to create
- `global/claude/youtube-audit/SKILL.md` (new)
- `global/codex/youtube-audit/SKILL.md` (new — Codex mirror)

## Files to reference
- `global/claude/research-roadmap/SKILL.md` — archive-first policy, shipping contract
- `packs/business-app/claude/competitive-analysis/SKILL.md` — web research skill pattern, checkpoint pattern
- `global/claude/concept-exploration/SKILL.md` — argument parsing, dated output pattern

## Verification
1. Read the created SKILL.md files and confirm they follow repo conventions (frontmatter, sections, shipping contract)
2. Verify the Codex mirror matches the Claude version with appropriate adaptations
3. Dry-run the yt-dlp and youtube-transcript-api commands mentally against the skill steps to confirm the pipeline is coherent
4. Commit and push to master per the Direct-To-Primary Git Flow policy


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/48d91c1c-68db-4a77-8fe7-9c35f72e4c76.jsonl

## Assistant _16:22:07_

I'll start by reading the reference files to understand the conventions, then create both skill files.

## Assistant _16:22:08_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/research-roadmap/SKILL.md`

</details>

## User _16:22:08_

[Request interrupted by user]

## User _16:23:29_

continue sorry

## User _16:23:43_

before you continue, can you add that to the research pack?

## Assistant _16:23:55_

Let me check what "research pack" means in this repo so I add it in the right place.

## Assistant _16:23:56_

<details><summary>Tool calls</summary>

- Bash: List available packs

</details>

## Assistant _16:23:57_

<details><summary>Tool calls</summary>

- Bash: Check if youtube-audit is already referenced

</details>

## Assistant _16:24:02_

Could you clarify what you mean by "the research pack"? I see these packs: `business-app`, `devtool`, `game`, and their kanban variants. 

The youtube-audit skill lives in `global/` (not pack-specific), so I could add it to the research-roadmap's **documentation-producing non-research skills** table (the global one around line 105). Would that be the right place, or did you have a specific pack in mind?

## User _16:24:57_

ok, no global is fine

## Assistant _16:25:04_

I'll add `/youtube-audit` to the research-roadmap's global documentation-producing skills table in both the Claude and Codex versions.

## Assistant _16:25:05_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/research-roadmap/SKILL.md`

</details>

## Assistant _16:25:05_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/research-roadmap/SKILL.md`

</details>

## Assistant _16:25:12_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/research-roadmap/SKILL.md`

</details>

## Assistant _16:25:13_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/research-roadmap/SKILL.md`

</details>

## Assistant _16:25:19_

Done. Added `/youtube-audit` → `research/youtube-audit-YYYY-MM-DD.md` to the documentation-producing skills table in both `global/claude/research-roadmap/SKILL.md` and `global/codex/research-roadmap/SKILL.md`. 

Now I'll continue with creating the skill files. Let me read the reference files first.

## Assistant _16:25:20_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/business-app/claude/competitive-analysis/SKILL.md`

</details>

## Assistant _16:25:20_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/concept-exploration/SKILL.md`

</details>

## Assistant _16:25:22_

Now let me check an existing Codex skill to see how the mirror differs.

## Assistant _16:25:24_

<details><summary>Tool calls</summary>

- Bash: Check Codex frontmatter conventions

</details>

## Assistant _16:25:25_

<details><summary>Tool calls</summary>

- Bash: See Claude vs Codex differences

</details>

## Assistant _16:25:32_

<details><summary>Tool calls</summary>

- Bash: Check competitive-analysis Claude vs Codex diff for tool name conventions

</details>

## Assistant _16:25:37_

Good — I can see the Codex pattern: `/` becomes `$`, "## Process" becomes "## Workflow", adds "Invoke as `$skill-name`.", tool references like `AskUserQuestion` are dropped (plain text instead), and prose is more compressed. Now I have enough context to create both files.

## Assistant _16:25:38_

<details><summary>Tool calls</summary>

- Bash: Create skill directories

</details>

## Assistant _16:26:38_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/global/claude/youtube-audit/SKILL.md`

</details>

## Assistant _16:26:43_

Now the Codex mirror — `/` → `$`, "Process" → "Workflow", add invocation line, compress prose where the Codex pattern does.

## Assistant _16:27:22_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/global/codex/youtube-audit/SKILL.md`

</details>

## Assistant _16:27:28_

Both skill files are created. Now let me commit and push per the shipping contract. There's existing dirty state in the working tree, so I'll include everything in sensible commits.

## Assistant _16:27:28_

<details><summary>Tool calls</summary>

- Bash: Check full working tree status

</details>

## Assistant _16:27:29_

<details><summary>Tool calls</summary>

- Bash: Recent commit messages

</details>

## Assistant _16:27:33_

Good — all changes are related to the youtube-audit skill (the new files + the research-roadmap additions). The previously staged changes from the git status at session start are no longer showing, so the tree is clean except for our work.

## Assistant _16:27:34_

<details><summary>Tool calls</summary>

- Bash: Stage youtube-audit skill files and research-roadmap updates

</details>

## Assistant _16:27:40_

<details><summary>Tool calls</summary>

- Bash: Commit youtube-audit skill

</details>

## Assistant _16:27:42_

<details><summary>Tool calls</summary>

- Bash: Push to master

</details>

## Assistant _16:27:48_

Done. Created and shipped the `/youtube-audit` skill:

- **`global/claude/youtube-audit/SKILL.md`** — full skill with 8-step process (parse args, archive, fetch videos via yt-dlp, fetch transcripts, prepare context with smart truncation, analyze across 9 dimensions, write dated report, summarize)
- **`global/codex/youtube-audit/SKILL.md`** — Codex mirror (`$` prefix, "Workflow" heading, compressed prose)
- **`global/claude/research-roadmap/SKILL.md`** and **`global/codex/research-roadmap/SKILL.md`** — added `/youtube-audit` → `research/youtube-audit-YYYY-MM-DD.md` to the documentation-producing skills table

## User _16:27:58_

can you run the install script?

## Assistant _16:28:02_

<details><summary>Tool calls</summary>

- Agent: Find install script

</details>

## Assistant _16:28:26_

Found it — `install.sh` at the repo root. It symlinks global skills into `~/.claude/skills/` and `~/.codex/skills/`.

## Assistant _16:28:26_

<details><summary>Tool calls</summary>

- Bash: Run install script to symlink global skills

</details>

## Assistant _16:28:29_

Installed. The `youtube-audit` skill is now symlinked into both `~/.claude/skills/` and `~/.codex/skills/` along with the other new skills.
