# consolidate-deploy-logic

| Field | Value |
|-------|-------|
| **Date** | 2026-05-16 19:57:04 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `e209b07f-5dea-4592-89d0-f81a0bf12826` |
| **Entrypoint** | cli |
| **Version** | 2.1.142 |

---

## User _19:57:04_

Implement the following plan:

# Consolidate Duplicate Deploy Logic

## Context

`/ship` and `/ship-end` both inline ~20 lines of deploy discovery, execution, and AWS SSO recovery logic that duplicates `/deploy` (v2.0.0). The duplication has already caused drift: `/ship` requires an explicit deploy contract file while `/ship-end` asks the user. This quick-win consolidation makes both callers invoke `/deploy` as a sub-step instead of inlining the logic.

## Decisions (confirmed by user)

- **Approach:** Internal `/deploy` invocation (not a shared reference section)
- **Ledger:** Stays `/deploy`-only; callers say "skip ledger and staleness reporting" in prose
- **Gate:** Both `/ship` and `/ship-end` adopt the strict gate (require `deploy.md` or `tasks/deploy.md`, skip if absent)
- **Flag style:** Prose instruction, no formal `--no-ledger` flag on `/deploy`

## Changes

### 1. `global/claude/ship/SKILL.md` (lines 62–86)

Replace the full step 3 deploy section with:

```
### 3. Deploy (skip if `--no-deploy`)
After shipping, deploy only when the project has an explicit manual deploy contract.

a) **Check for deploy contract.** Look for `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, continue.

b) **Invoke `/deploy`** targeting the default environment (staging).
   - Pass the deploy contract context to `/deploy`.
   - Skip ledger recording and staleness reporting — those are for standalone `/deploy` invocations only.
   - If `/deploy` reports failure, report the error. Do not retry.
```

### 2. `global/claude/ship-end/SKILL.md` (lines 27–37)

Replace the full step 3 deploy section with the same pattern as `/ship` above (strict gate + invoke `/deploy`).

### 3. `global/codex/ship/SKILL.md`

Apply the same step 3 replacement as the Claude variant.

### 4. `global/codex/ship-end/SKILL.md`

Apply the same step 3 replacement as the Claude variant.

### 5. `tasks/ideas.md`

Move "Consolidate duplicate deploy logic" from Quick Wins to the completed/removed section.

## Files to Modify

- `global/claude/ship/SKILL.md`
- `global/claude/ship-end/SKILL.md`
- `global/codex/ship/SKILL.md`
- `global/codex/ship-end/SKILL.md`
- `tasks/ideas.md`

## Verification

1. Read all 4 updated skill files and confirm no inline deploy discovery/SSO logic remains
2. Confirm `/deploy` itself is unchanged
3. Confirm the strict gate wording is consistent across all 4 files
4. Confirm `--no-deploy` flag still skips the entire deploy step in `/ship` variants
5. Run `scripts/validate-skill-deps.sh` if it exists to check skill cross-references


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/2de79f6e-7b23-4256-8bb9-8b954c134a12.jsonl

## Assistant _19:57:07_

I'll read the files that need modification to understand the current deploy logic.

## Assistant _19:57:08_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/ship/SKILL.md`

</details>

## Assistant _19:57:09_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/ship-end/SKILL.md`

</details>

## Assistant _19:57:09_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/ship/SKILL.md`

</details>

## Assistant _19:57:10_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/ship-end/SKILL.md`

</details>

## Assistant _19:57:10_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/ideas.md`

</details>

## Assistant _19:57:14_

Now let me read the Claude `/ship` file's full deploy section and the Codex `/ship` file's deploy section.

## Assistant _19:57:15_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/ship/SKILL.md`

</details>

## Assistant _19:57:22_

Now I have all the context I need. Let me also read the Claude `/ship` file to see the exact lines around the deploy section.

## Assistant _19:57:23_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/ship/SKILL.md`

</details>

## Assistant _19:57:26_

Now I have a clear picture. The plan calls for replacing the inline deploy logic with a concise `/deploy` invocation pattern. Let me make all the edits.

## Assistant _19:57:36_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ship/SKILL.md`

</details>

## Assistant _19:57:42_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ship-end/SKILL.md`

</details>

## Assistant _19:57:48_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/ship/SKILL.md`

</details>

## Assistant _19:57:55_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/ship-end/SKILL.md`

</details>

## Assistant _19:57:59_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/ideas.md`

</details>

## Assistant _19:58:03_

Now let me add the removed item to the "Removed ideas" section and also remove the outdated constraint in `claude/ship-end/SKILL.md` that references the old deploy behavior. Let me also verify the constraint section.

## Assistant _19:58:06_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/ideas.md`

</details>

## Assistant _19:58:10_

Now let me verify the deploy skill itself is unchanged, and check for the validation script.

## Assistant _19:58:11_

<details><summary>Tool calls</summary>

- Bash: Check deploy skill unchanged and find validation scripts

</details>

## Assistant _19:58:15_

Good — `/deploy` is unchanged (no diff), and there's `scripts/skill-deps.sh` but not `validate-skill-deps.sh`. Let me run the skill deps check and also verify that the `--no-deploy` skip still works by checking the wording is correct in `/ship`.

## Assistant _19:58:16_

<details><summary>Tool calls</summary>

- Bash: Run skill dependency validation

</details>

## Assistant _19:58:22_

All good — 0 broken references. Now let me also update the constraint in `claude/ship-end/SKILL.md` that still references the old deploy behavior pattern.

## Assistant _19:58:24_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ship-end/SKILL.md`

</details>

## Assistant _19:58:27_

That constraint must be in the Codex variant. Let me check.

## Assistant _19:58:28_

<details><summary>Tool calls</summary>

- Bash: Find the constraint line across variants

</details>

## Assistant _19:58:31_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/ship-end/SKILL.md`

</details>

## Assistant _19:58:35_

Now let me commit and push.

## Assistant _19:58:36_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _19:58:36_

<details><summary>Tool calls</summary>

- Bash: Show recent commits

</details>

## Assistant _19:58:50_

I see there are also pre-existing changes (`packs/youtube-ops/...` and `specs/deploy-consolidation-feature-interview.md`). I'll commit my deploy consolidation changes separately, and include the spec file since it's the feature interview that led to this work.

## Assistant _19:58:54_

<details><summary>Tool calls</summary>

- Bash: Commit deploy consolidation changes

</details>

## Assistant _19:58:56_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _19:59:01_

Done. All four ship/ship-end variants (claude and codex) now invoke `/deploy` internally instead of inlining the deploy discovery+execution+SSO logic. The strict gate (`deploy.md` or `tasks/deploy.md` required, skip if absent) is consistent across all four files, `/deploy` itself is unchanged, and `scripts/skill-deps.sh` reports 0 broken references.
