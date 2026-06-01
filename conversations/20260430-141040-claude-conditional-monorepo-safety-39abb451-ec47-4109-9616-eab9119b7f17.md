# conditional-monorepo-safety

| Field | Value |
|-------|-------|
| **Date** | 2026-04-30 14:10:40 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `39abb451-ec47-4109-9616-eab9119b7f17` |
| **Entrypoint** | cli |
| **Version** | 2.1.123 |

---

## User _14:10:40_

Implement the following plan:

# Plan: Make monorepo parallel-work safety conditional

## Context
Section 7 ("Monorepo Parallel-Work Safety") was added statically to the orchestration block after the bismarck-v5 incident where 194 Codex sessions wasted compute fighting over `pnpm-lock.yaml`. But it shouldn't be injected into single-package repos where it's noise. The skill should detect monorepos at runtime and conditionally include it.

## Approach

### Detection heuristics (check in order, any match = monorepo)
1. `pnpm-workspace.yaml` exists at repo root
2. `package.json` has a `workspaces` field
3. `lerna.json` exists at repo root
4. `packages/` or `apps/` directory exists with 2+ subdirectories containing `package.json`

### Changes

**Both skill files** (`global/claude/provision-agentic-config/SKILL.md` and `global/codex/provision-agentic-config/SKILL.md`):

1. **Remove section 7 from the static template block** — pull the `### 7. Monorepo Parallel-Work Safety` block out of the verbatim markdown between sections 6 and `## Task Management`.

2. **Add a new conditional step** between the current "insert block" step and the "report" step:
   - Detect if the repo is a monorepo using the heuristics above
   - If yes, append the section 7 block after section 6 (before `## Task Management`) in both target files
   - If no, ensure section 7 is removed from both target files (in case it was previously inserted)
   - Report whether the monorepo block was included or skipped

3. **Update the output format** to include monorepo detection result.

**Repo config files** (`CLAUDE.md` and `AGENTS.md` at repo root):
- Leave as-is — this repo (agentic-skills) is not a monorepo, so on next re-provision the block would be removed. But since this is the skills repo itself and already has the block, we can leave it for now (it doesn't hurt a non-monorepo, it's just unnecessary).

### Files to modify
- `/Users/georgele/projects/tools/agentic-skills/global/claude/provision-agentic-config/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/global/codex/provision-agentic-config/SKILL.md`

### Verification
- Read both files after edit to confirm section 7 is not in the static block
- Confirm the conditional step references the correct detection heuristics
- Confirm the monorepo block content matches what was previously in section 7


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/e9123403-268c-4392-8987-79721a7c7a61.jsonl

## Assistant _14:10:44_

Let me start by reading both skill files to understand the current structure.

## Assistant _14:10:45_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/provision-agentic-config/SKILL.md`

</details>

## Assistant _14:10:45_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/provision-agentic-config/SKILL.md`

</details>

## Assistant _14:11:00_

I'll edit both skill files in parallel to remove section 7 from the static block and add the conditional monorepo detection step.

## Assistant _14:11:03_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/provision-agentic-config/SKILL.md`

</details>

## Assistant _14:11:08_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/provision-agentic-config/SKILL.md`

</details>

## Assistant _14:11:10_

Now I'll add the conditional monorepo detection step and update the output format in both files.

## Assistant _14:11:25_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/provision-agentic-config/SKILL.md`

</details>

## Assistant _14:11:33_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/provision-agentic-config/SKILL.md`

</details>

## Assistant _14:11:35_

Now let me verify both files look correct.

## Assistant _14:11:36_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/provision-agentic-config/SKILL.md`

</details>

## Assistant _14:11:36_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/provision-agentic-config/SKILL.md`

</details>

## Assistant _14:11:44_

Both files look correct. Let me verify the key points:

- **Static block**: Section 7 is removed — sections go 1-6, then straight to `## Task Management` (Claude: line 66-67, Codex: line 66-68)
- **Conditional step**: Added as step 3 (Claude) / step 5 (Codex) with the 4 detection heuristics and the full monorepo block content
- **Cleanup logic**: Includes "if not a monorepo, remove section 7" for idempotent re-runs
- **Output format**: Updated to report monorepo detection result

Now committing and pushing.

## Assistant _14:11:45_

<details><summary>Tool calls</summary>

- Bash: Check diff stats

</details>

## Assistant _14:11:45_

<details><summary>Tool calls</summary>

- Bash: Recent commits for style

</details>

## Assistant _14:11:54_

<details><summary>Tool calls</summary>

- Bash: Commit changes

</details>

## Assistant _14:11:58_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _14:12:04_

Done. Both skill files now:

- **Static block** ends at section 6 (Autonomous Bug Fixing) — no monorepo section baked in
- **Conditional step** detects monorepos at runtime using 4 heuristics (pnpm-workspace.yaml, workspaces field, lerna.json, packages/apps with 2+ package.json dirs) and appends or removes section 7 accordingly
- **Output format** reports whether the monorepo block was included or skipped
