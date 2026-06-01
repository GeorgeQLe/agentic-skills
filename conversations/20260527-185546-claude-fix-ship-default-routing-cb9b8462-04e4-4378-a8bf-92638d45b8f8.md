# fix-ship-default-routing

| Field | Value |
|-------|-------|
| **Date** | 2026-05-27 18:55:46 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `cb9b8462-04e4-4378-a8bf-92638d45b8f8` |
| **Entrypoint** | cli |
| **Version** | 2.1.152 |

---

## User _18:55:46_

Implement the following plan:

# Fix /ship default routing when no work remains

## Context

When `/ship` completes and there's genuinely no next work item (no unchecked steps, no remaining phases, no manual blockers), it still recommends `/exec` because of the constraint "completed /ship runs must not self-route back to /ship; route to /exec or a more specific next actionable skill." But `/exec` assumes `tasks/todo.md` has unchecked steps — it has no "nothing to do" fallback. The user gets a useless recommendation.

## Approach

Add an explicit "no remaining work" escape hatch at three levels in both claude and codex variants of the ship skill. 6 small edits, no restructuring.

## Files to modify

- `packs/exec-loop/claude/ship/SKILL.md`
- `packs/exec-loop/codex/ship/SKILL.md`

## Edits

### Claude variant

1. **Ship manifest convention (line ~50):** Change "Do not leave `Next command` blank." to allow `none` when all planned work is complete.

2. **New early-exit rule in Next-Step Routing rules list (after "Do not use agent mode itself as the next work item"):** Insert:
   > If no remaining work exists — no unchecked steps in `tasks/todo.md`, no phases remaining in `tasks/roadmap.md`, no pending manual blockers, no validation gaps, and no deploy failures — emit `**Next work:** none` and `**Recommended next command:** none — all planned work is complete`. Do not force a route to `/exec` when there is genuinely nothing to execute.

3. **Final route contract (line ~158):** Append ", or emit `none` when all planned work is genuinely complete" to the existing sentence.

### Codex variant

4. **Ship manifest convention (line ~29):** Same `none` allowance as claude.

5. **Anti-none rule (line ~89):** Add "or all planned work is genuinely complete" as a valid reason to emit `none`, alongside the existing "user explicitly asks to pause/park/archive."

6. **Final route contract (line ~101):** Same append as claude.

## Verification

- Archive current skill versions before bumping
- Bump both skills to next version, write changelogs
- Refresh skills showcase data
- Commit and push


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/8cd630ee-a574-42f8-84f7-8e82a4205b99.jsonl

## Assistant _18:55:49_

I'll read both skill files to understand the current content before making edits.

## Assistant _18:55:50_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/claude/ship/SKILL.md`

</details>

## Assistant _18:55:50_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/codex/ship/SKILL.md`

</details>

## Assistant _18:55:54_

Now I'll check the archive script exists and look at the current skill changelogs/archives.

## Assistant _18:55:56_

<details><summary>Tool calls</summary>

- Bash: List ship skill directories

</details>

## Assistant _18:55:56_

<details><summary>Tool calls</summary>

- Bash: Check archive script exists

</details>

## Assistant _18:55:59_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/claude/ship/CHANGELOG.md`

</details>

## Assistant _18:56:00_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/codex/ship/CHANGELOG.md`

</details>

## Assistant _18:56:03_

Good, both are at v0.1. Now I'll archive both current versions, then make all 6 edits.

## Assistant _18:56:04_

<details><summary>Tool calls</summary>

- Bash: Archive claude ship skill v0.1

</details>

## Assistant _18:56:05_

<details><summary>Tool calls</summary>

- Bash: Archive codex ship skill v0.1

</details>

## Assistant _18:56:11_

Archives done. Now making all 6 edits plus version bumps and changelogs.

**Claude variant — 3 edits:**

## Assistant _18:56:12_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/claude/ship/SKILL.md`

</details>

## Assistant _18:56:12_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/codex/ship/SKILL.md`

</details>

## Assistant _18:56:19_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/claude/ship/SKILL.md`

</details>

## Assistant _18:56:25_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/claude/ship/SKILL.md`

</details>

## Assistant _18:56:28_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/claude/ship/SKILL.md`

</details>

## Assistant _18:56:30_

**Codex variant — 3 edits:**

## Assistant _18:56:31_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/codex/ship/SKILL.md`

</details>

## Assistant _18:56:36_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/codex/ship/SKILL.md`

</details>

## Assistant _18:56:38_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/codex/ship/SKILL.md`

</details>

## Assistant _18:56:41_

All 6 edits done. Now update changelogs.

## Assistant _18:56:43_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/claude/ship/CHANGELOG.md`

</details>

## Assistant _18:56:45_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/exec-loop/codex/ship/CHANGELOG.md`

</details>

## Assistant _18:56:48_

Now refresh the skills showcase data.

## Assistant _18:56:48_

<details><summary>Tool calls</summary>

- Bash: Generate skills showcase data

</details>

## Assistant _18:56:53_

<details><summary>Tool calls</summary>

- Bash: Generate skills showcase GitHub data

</details>

## Assistant _18:56:58_

<details><summary>Tool calls</summary>

- Bash: Validate skills showcase data

</details>

## Assistant _18:57:03_

Showcase data is fresh. Now let me verify the edits look correct, then commit and push.

## Assistant _18:57:03_

<details><summary>Tool calls</summary>

- Bash: Show changed files

</details>

## Assistant _18:57:06_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _18:57:11_

<details><summary>Tool calls</summary>

- Bash: Stage all changed files

</details>

## Assistant _18:57:15_

<details><summary>Tool calls</summary>

- Bash: Commit ship skill changes

</details>

## Assistant _18:57:18_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _18:57:25_

Done. Both `/ship` (claude) and `$ship` (codex) variants bumped to v0.2 with the "no remaining work" escape hatch:

1. **Ship manifest convention** — allows `none` in the `Next command` field when all work is complete
2. **Next-Step Routing rules** — new rule (claude) / relaxed anti-none rule (codex) to emit `none` routing when no unchecked steps, phases, blockers, or validation gaps remain
3. **Final route contract** — both variants now explicitly allow `none` as a valid terminal state

Archives of v0.1 created, changelogs updated, showcase data refreshed.
