# wire-foundation-discovery-docs

| Field | Value |
|-------|-------|
| **Date** | 2026-05-02 17:36:47 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `ddb031b9-833a-4824-9a92-81fbcd86aa31` |
| **Entrypoint** | cli |
| **Version** | 2.1.126 |

---

## User _17:36:47_

Implement the following plan:

# Step 12.3 — Wire foundation into creator-media pack docs and discovery references

## Context

Steps 12.1 and 12.2 added `creator-platform-capability-matrix` and `creator-evidence-schema` skills to the creator-media pack. These skills don't yet appear in pack docs, README, or skills-reference — so users and agents can't discover them through normal browsing. This step registers them.

## Files to modify

1. **`packs/creator-media/PACK.md`** — add both skills to the skill list and default flow
2. **`docs/skills-reference.md`** (lines 219–245) — add both skills to the creator-media section
3. **`README.md`** (lines 174–185) — add both skills to the creator-media section

## Changes

### PACK.md

- Update description to mention "multi-platform evidence foundation" alongside YouTube.
- Add a dual-entry flow showing both the YouTube-first path (unchanged) and the new foundation path:
  ```
  Non-YouTube / mixed-platform:
  creator-platform-capability-matrix -> creator-evidence-schema
  -> creator-positioning -> content-programming -> ...

  YouTube-first:
  youtube-channel-audit -> youtube-title-thumbnail-audit -> ...
  ```
- Add both new skills to the install description text.

### docs/skills-reference.md

- Add `creator-platform-capability-matrix` and `creator-evidence-schema` to the skill list (lines 230–233).
- Show the dual-entry flow in the default flow diagram (lines 238–243).
- Update the evidence-first description (line 245) to mention the platform capability matrix and evidence schema as the multi-platform foundation.

### README.md

- Add `creator-platform-capability-matrix` and `creator-evidence-schema` to the skill list (lines 179–182).
- Update the description (line 185) to mention multi-platform evidence foundation.

## Key constraints

- YouTube-first workflow remains a valid starting point — do not remove or demote it.
- Non-YouTube or mixed-platform work starts with the foundation (`creator-platform-capability-matrix`).
- Skill names must match exactly: `creator-platform-capability-matrix`, `creator-evidence-schema`.

## Verification

- `rg 'creator-platform-capability-matrix' packs/creator-media/PACK.md docs/skills-reference.md README.md` — all three files
- `rg 'creator-evidence-schema' packs/creator-media/PACK.md docs/skills-reference.md README.md` — all three files
- `rg 'youtube-channel-audit' packs/creator-media/PACK.md docs/skills-reference.md README.md` — still present in all three
- `./scripts/skill-deps.sh --broken` — no broken deps
- `./scripts/skill-versions.sh --missing` — no missing versions
- `git diff --check` — no whitespace errors

## Ship-one-step handoff

Implement only Step 12.3. Validate. Mark done in `tasks/todo.md`. Update `tasks/history.md`. Commit and push. Write step 12.4 plan. Enter plan mode for 12.4, then stop.


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/fe55afee-048c-462e-bb60-6e9be4993faf.jsonl

## Assistant _17:36:52_

I'll start by reading the three files that need modification to understand their current structure.

## Assistant _17:36:53_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/creator-media/PACK.md`

</details>

## Assistant _17:36:54_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _17:36:54_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/README.md`

</details>

## Assistant _17:37:02_

All three files already contain the new skills. Let me run the verification commands to confirm everything is properly wired.

## Assistant _17:37:03_

<details><summary>Tool calls</summary>

- Bash: Verify creator-platform-capability-matrix in all three files

</details>

## Assistant _17:37:04_

<details><summary>Tool calls</summary>

- Bash: Verify creator-evidence-schema in all three files

</details>

## Assistant _17:37:05_

<details><summary>Tool calls</summary>

- Bash: Verify youtube-channel-audit still present

</details>

## Assistant _17:37:06_

<details><summary>Tool calls</summary>

- Bash: Check for broken deps and missing versions

</details>

## Assistant _17:37:06_

<details><summary>Tool calls</summary>

- Bash: Check for whitespace errors

</details>

## Assistant _17:37:12_

All verification checks pass — the wiring was already done in the previous commit (`5e503ea`). The working tree is clean with no changes needed.

Let me check and update the task docs, then write the next step plan.

## Assistant _17:37:12_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _17:37:13_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _17:37:21_

Step 12.3 is already fully complete — the previous session committed it as `5e503ea`, updated both `tasks/todo.md` and `tasks/history.md`, and all verification passes. The next step plan (12.4) is already written in `todo.md`.

Let me verify the push status, then enter plan mode for 12.4.

## Assistant _17:37:22_

<details><summary>Tool calls</summary>

- Bash: Check if commits are pushed

</details>

## Assistant _17:37:25_

Everything is pushed. Now entering plan mode for Step 12.4.

## Assistant _17:37:25_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _17:37:27_

<details><summary>Tool calls</summary>

- EnterPlanMode

</details>

## Assistant _17:37:31_

This is a different task from the existing plan. Step 12.3 is already done — I need to write the Step 12.4 plan. The plan for 12.4 is already detailed in `todo.md` (lines 96-133). Let me quickly check the existing routing conventions in the skills that need modification.

## Assistant _17:37:37_

<details><summary>Tool calls</summary>

- Agent: Explore creator-media routing conventions

</details>

## Assistant _17:38:07_

Good — the 4 foundation skills already have `## Next-Skill Routing` sections with the correct conventions. Let me check what the plan in `todo.md` says needs to change vs what's already there.

The exploration shows:

- **capability-matrix** already routes to `creator-evidence-schema` by default, with conditional fallback
- **evidence-schema** already routes to `creator-positioning` by default, with a future `creator-presence-dossier` conditional
- Both Claude/Codex variants are mirrored with appropriate prefix styles (`/` vs `$`)
- The routing section format matches existing skills (youtube-channel-audit, creator-positioning)

The todo.md Step 12.4 plan asks to "ensure" these routing conventions exist and "tighten" them. But the exploration shows the routing is already in place from Steps 12.1 and 12.2. The acceptance criteria are already met:

1. Both capability-matrix skills contain `Recommended next skill: creator-evidence-schema` guidance — **already present**
2. Both evidence-schema skills contain `Recommended next skill: creator-presence-dossier` when available — **already present**
3. Both evidence-schema skills define fallback routing — **already present**
4. Routing language is mirrored across Claude/Codex — **already mirrored**

This means Step 12.4 is effectively a no-op validation step. Let me write the plan accordingly.

## Assistant _17:38:07_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/.claude/plans/update-the-icp-skill-ethereal-spring.md`

</details>

## Assistant _17:38:22_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/update-the-icp-skill-ethereal-spring.md`

</details>

## Assistant _17:38:24_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _17:38:28_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _02:09:03_

[Request interrupted by user for tool use]
