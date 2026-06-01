# re-benchmark-pack-local-skills

| Field | Value |
|-------|-------|
| **Date** | 2026-05-21 13:36:55 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `b6fd2ce1-f209-4a88-8220-de6ba22d9128` |
| **Entrypoint** | cli |
| **Version** | 2.1.145 |

---

## User _13:36:55_

Implement the following plan:

# Ship handoff — Step 43.6: Re-benchmark Pack-Local Skills After Domain Enrichment

## What was shipped

- Batch 41.5 Group 2 complete: 10 pack-local skills benchmarked with both agents (3 runs each).
- Claude 100% hard assertion pass rate across all 10 skills. Codex 100% on 9/10; `creator-platform-capability-matrix` 66.7% (1 Codex exit failure).
- Generated data refreshed: 133 graded + 17 incomplete rows (up from 112 + 17).
- Deploy skipped: test infrastructure only, no Skills Showcase app changes.

## Test status

- Benchmark coverage: PASS (158 skills)
- Generated data: validated fresh
- `git diff --check`: clean
- No failing tests — all expected to pass.

## Advisory tasks

- Manual: 4 unchecked items in `tasks/manual-todo.md` (none blocking)
- Recurring: 2 unchecked items in `tasks/recurring-todo.md`

## Next step: Step 43.6 — Re-benchmark Representative Pack-Local Skills

**Full implementation plan is in `tasks/todo.md`** (lines 131-178).

Re-benchmark 5 previously-low-scoring pack-local skills to validate that Step 43.5's domain-context enrichment improves quality scores. These skills previously scored 0% on domain criteria.

**Selected skills (5 skills across 5 pack families):**
1. `burn-rate` (business-ops) — was 69.2% quality, 0% traits
2. `content-programming` (creator-foundation) — was 80.8% quality, 0% traits
3. `conversion-map` (customer-lifecycle) — was 85.0% quality, 0% traits
4. `devtool-adoption` (devtool) — was 87.5% quality, 0% traits
5. `destination-doc` (alignment-loop) — was 95.0% quality, 50% traits

**Approach:**
- For each skill: `pnpm verify --skill <skill>`, then `pnpm bench --skill <skill> --agent both --runs 3 --chunk-size 3 --pause 0`
- Write `benchmark/test-<skill>-2026-05-21.md` per skill
- Compare domain-criteria scores before vs after enrichment
- Mark Step 43.6 complete and commit

**Files:** `benchmark/test-<skill>-2026-05-21.md` (5 new), `docs/benchmark-results-matrix.md`, generated showcase data, `tasks/todo.md`, `tasks/history.md`.

**Execution Profile:** serial, main agent, low conflict risk (new files only).

**Acceptance criteria:**
- All 5 benchmark reports written with current-date results.
- Domain-criteria scores improved from 0% baseline for at least 4 of 5 skills.
- No regressions in hard assertion pass rates (should remain 100%).

**Ship-one-step handoff:** Implement only this step, validate it, then run `/ship` when done.

**Next work:** Re-benchmark 5 pack-local skills to validate domain enrichment (Step 43.6)
**Recommended next command:** `/run`


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/ce5ca9ed-44bb-4038-81f5-83ab404786a2.jsonl

## Assistant _13:36:59_

I'll re-benchmark 5 pack-local skills to validate the domain-context enrichment from Step 43.5. Let me start by reading the plan and understanding the project structure.

## Assistant _13:37:00_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _13:37:02_

<details><summary>Tool calls</summary>

- Bash: Check existing benchmark files and package scripts

</details>

## Assistant _13:37:06_

Good, I can see the previous benchmark reports from 2026-05-20. Let me check the benchmark skill and one existing report to understand the format.

## Assistant _13:37:06_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/benchmark/test-burn-rate-2026-05-20.md`

</details>

## Assistant _13:37:08_

<details><summary>Tool calls</summary>

- Bash: Check benchmark skill exists and size

</details>

## Assistant _13:37:14_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md`

</details>

## Assistant _13:37:20_

Now I understand the workflow. I'll run verify + bench for each of the 5 skills sequentially. Starting with `burn-rate`.

## Assistant _13:37:21_

<details><summary>Tool calls</summary>

- Bash: List benchmark-eligible skills

</details>

## Assistant _13:37:24_

All 5 skills are listed with custom coverage. Let me run verify and bench for each skill. Starting with `burn-rate`.

## Assistant _13:37:24_

<details><summary>Tool calls</summary>

- Bash: Verify burn-rate skill

</details>

## Assistant _13:37:31_

Verify passed for burn-rate. Now running the benchmark.

## Assistant _13:37:33_

<details><summary>Tool calls</summary>

- Bash: Benchmark burn-rate skill

</details>

## Assistant _13:41:23_

<details><summary>Tool calls</summary>

- Bash: Read burn-rate Claude report

</details>

## Assistant _13:41:25_

<details><summary>Tool calls</summary>

- Bash: Read burn-rate Codex report

</details>

## Assistant _13:41:29_

Excellent — `burn-rate` domain criterion (`business-ops-context`) jumped from 0% to 100% for both agents. Let me write the report and move to the next skill.

## Assistant _13:41:40_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/benchmark/test-burn-rate-2026-05-21.md`

</details>

## Assistant _13:41:52_

<details><summary>Tool calls</summary>

- Bash: Write burn-rate benchmark report

</details>

## Assistant _13:41:55_

Burn-rate done (1/5). Now running `content-programming`.

## Assistant _13:41:55_

<details><summary>Tool calls</summary>

- Bash: Verify content-programming skill

</details>

## Assistant _13:42:02_

<details><summary>Tool calls</summary>

- Bash: Benchmark content-programming skill

</details>

## Assistant _13:48:24_

<details><summary>Tool calls</summary>

- Bash: Read content-programming Claude report

</details>

## Assistant _13:48:24_

<details><summary>Tool calls</summary>

- Bash: Read content-programming Codex report

</details>

## Assistant _13:48:28_

Domain criterion `creator-media-context` improved from 0% to 100% for both agents. Writing report and moving to next skill.

## Assistant _13:48:35_

<details><summary>Tool calls</summary>

- Bash: Write content-programming benchmark report

</details>

## Assistant _13:48:38_

Content-programming done (2/5). Now `conversion-map`.

## Assistant _13:48:39_

<details><summary>Tool calls</summary>

- Bash: Verify conversion-map skill

</details>

## Assistant _13:48:46_

<details><summary>Tool calls</summary>

- Bash: Benchmark conversion-map skill

</details>

## Assistant _13:52:20_

<details><summary>Tool calls</summary>

- Bash: Read conversion-map Claude report

</details>

## Assistant _13:52:20_

<details><summary>Tool calls</summary>

- Bash: Read conversion-map Codex report

</details>

## Assistant _13:52:23_

`conversion-map` perfect — `customer-lifecycle-context` went from 0% to 100%, overall quality 100% for both agents. Writing report and continuing.

## Assistant _13:52:30_

<details><summary>Tool calls</summary>

- Bash: Write conversion-map benchmark report

</details>

## Assistant _13:52:32_

Conversion-map done (3/5). Now `devtool-adoption`.

## Assistant _13:52:33_

<details><summary>Tool calls</summary>

- Bash: Verify devtool-adoption skill

</details>

## Assistant _13:52:40_

<details><summary>Tool calls</summary>

- Bash: Benchmark devtool-adoption skill

</details>

## Assistant _13:56:15_

<details><summary>Tool calls</summary>

- Bash: Read devtool-adoption Claude report

</details>

## Assistant _13:56:15_

<details><summary>Tool calls</summary>

- Bash: Read devtool-adoption Codex report

</details>

## Assistant _13:56:19_

`devtool-adoption` perfect — `devtool-context` from 0% to 100%, overall 100% both agents.

## Assistant _13:56:24_

<details><summary>Tool calls</summary>

- Bash: Write devtool-adoption benchmark report

</details>

## Assistant _13:56:26_

Devtool-adoption done (4/5). Last one — `destination-doc`.

## Assistant _13:56:27_

<details><summary>Tool calls</summary>

- Bash: Verify destination-doc skill

</details>

## Assistant _13:57:10_

Both layers passed for destination-doc. Running benchmark.

## Assistant _13:57:11_

<details><summary>Tool calls</summary>

- Bash: Benchmark destination-doc skill

</details>

## Assistant _14:16:01_

Benchmark running in background for destination-doc. Waiting for it to complete.

## Assistant _14:16:02_

<details><summary>Tool calls</summary>

- Read `/private/tmp/claude-501/-Users-georgele-projects-tools-agentic-skills/eed771b2-c294-49ba-8139-5d8b918476b5/tasks/bkav0e1zb.output`

</details>

## Assistant _14:16:08_

<details><summary>Tool calls</summary>

- Bash: Read destination-doc Claude report

</details>

## Assistant _14:16:09_

<details><summary>Tool calls</summary>

- Bash: Read destination-doc Codex report

</details>

## Assistant _14:16:13_

`destination-doc` — `alignment-loop-context` from 0% baseline to 100% for both agents. Codex had 1 infrastructure-blocked run (timeout) but 2/2 evaluated passed with 100% quality. Writing the last report.

## Assistant _14:16:20_

<details><summary>Tool calls</summary>

- Bash: Write destination-doc benchmark report

</details>

## Assistant _14:16:24_

All 5 benchmark reports written. Now I need to update the generated showcase data and the benchmark results matrix. Let me check what needs updating.

## Assistant _14:16:25_

<details><summary>Tool calls</summary>

- Bash: Check benchmark results matrix

</details>

## Assistant _14:16:27_

<details><summary>Tool calls</summary>

- Bash: Find data generation scripts

</details>

## Assistant _14:28:38_

<details><summary>Tool calls</summary>

- Bash: Check for showcase data generator

</details>

## Assistant _14:28:41_

<details><summary>Tool calls</summary>

- Bash: Regenerate showcase data and benchmark matrix

</details>

## Assistant _14:28:45_

Generated data refreshed — 133 graded + 17 incomplete rows (same count as before, since these are re-benchmarks of already-graded skills with updated scores). Let me verify the matrix now reflects the new scores for our 5 skills.

## Assistant _14:28:47_

<details><summary>Tool calls</summary>

- Bash: Verify updated scores in matrix

</details>

## Assistant _14:28:50_

Matrix updated with new session IDs and scores. Now let me update the todo.md to mark Step 43.6 items complete.

## Assistant _14:28:51_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:28:59_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:29:01_

Now let me update tasks/history.md with the Step 43.6 completion record.

## Assistant _14:29:02_

<details><summary>Tool calls</summary>

- Bash: Check history format

</details>

## Assistant _14:29:05_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _14:29:15_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _14:29:17_

Now let me verify everything is clean and commit.

## Assistant _14:29:18_

<details><summary>Tool calls</summary>

- Bash: Check for whitespace errors and status

</details>

## Assistant _14:29:21_

Clean, no whitespace errors. Let me also verify the new benchmark run data directories exist.

## Assistant _14:29:24_

<details><summary>Tool calls</summary>

- Bash: Verify all benchmark run data exists

</details>

## Assistant _14:29:26_

All data verified. Committing and pushing.

## Assistant _14:29:28_

<details><summary>Tool calls</summary>

- Bash: Stage all Step 43.6 files

</details>

## Assistant _14:29:32_

<details><summary>Tool calls</summary>

- Bash: Commit Step 43.6 results

</details>

## Assistant _14:29:35_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _14:29:38_

<details><summary>Tool calls</summary>

- Bash: Pull with rebase then push

</details>

## Assistant _14:29:50_

Step 43.6 is complete. Here's the summary:

**All 5 domain-specific criteria improved from 0% to 100%** (5/5 acceptance threshold met):

| Skill | Domain Criterion | Quality Before → After (Claude) | Quality Before → After (Codex) |
|---|---|---|---|
| burn-rate | `business-ops-context` | 69.2% → 93.3% | 75.8% → 100.0% |
| content-programming | `creator-media-context` | 80.8% → 84.6% | — → 94.9% |
| conversion-map | `customer-lifecycle-context` | 85.0% → 100.0% | — → 100.0% |
| devtool-adoption | `devtool-context` | 87.5% → 100.0% | — → 100.0% |
| destination-doc | `alignment-loop-context` | 95.0% → 100.0% | — → 100.0% |

- Hard assertion pass rate: 100% across all skills and agents (no regressions).
- 1 Codex infrastructure-blocked run on destination-doc (timeout), not a skill failure.
- Total cost: $30.

Running `/ship` for the handoff.

## Assistant _14:29:50_

<details><summary>Tool calls</summary>

- Skill: /ship

</details>

## User _14:29:50_

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

### 1c. Skills Showcase freshness
If the shipping boundary creates, deletes, renames, or changes behavior/metadata in any tracked `SKILL.md` or `PACK.md`, refresh the Skills Showcase before commit:

- `node scripts/generate-skills-showcase-data.mjs`
- `node scripts/generate-skills-showcase-github-data.mjs`
- `scripts/validate-skills-showcase-data.sh`

Include changed generated assets in the same shipping boundary. For skill behavior changes, review curated showcase copy, catalog grouping, workflow animation text, and proof receipts; update affected site files or record why no curated website copy changed.

### 1d. Ship manifest route convention
When writing a ship manifest, summary, task review note, or final response with a `Next command` field, use Claude slash-command syntax. For a completed `/ship` run, the default executable handoff is `/run` unless project state names a more specific next route. Do not leave `Next command` blank.

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

a) **Check for deploy contract.** Look for `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, continue.

b) **Invoke `/deploy`** targeting the default environment (staging).
   - Pass the deploy contract context to `/deploy`.
   - Skip ledger recording and staleness reporting — those are for standalone `/deploy` invocations only.
   - If `/deploy` reports failure, report the error. Do not retry.

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
d0) **Skip no-op verification handoffs:** If the next uncompleted step is verification-only/no-op-only (for example, "refactor if validation exposes drift", "verify", "run validation", or `Files: no source changes expected`) and the current session already has passing validation evidence for the same scope, do not write a clear-context plan for it. Mark the step complete in `tasks/todo.md`, record the no-op result in the review/history, ship those task-doc updates, then continue selecting the next substantive step. If verification found failures, drift, warnings needing judgment, or source edits are required, treat that remediation as substantive work and plan it normally.
d) Write a **self-contained** implementation plan for the next step into `tasks/todo.md`. This plan must be complete enough that a fresh context can execute it by reading only CLAUDE.md and `tasks/todo.md`. Include:
   - What needs to be built/changed
   - Which files will be affected (full paths)
   - Key technical decisions or risks
   - Relevant context from the current session (gotchas, patterns established, conventions used)
   - If test strategy is `tdd`: which tests to write first and what they should assert
   - If test strategy is `tests-after`: note that tests will be written in the Green step
   - The current phase's `### Execution Profile`, including whether the next execution is serial, research-only, review-only, implementation-safe, or agent-team
   - Acceptance criteria: how to verify the step is done
   - **Ship-one-step handoff contract:** the next clear-context implementation session must implement only this step, validate it, then run `/ship` when done.
e) Ship `tasks/todo.md`, `tasks/roadmap.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and `tasks/phases/` (if created) via `/commit-and-push-by-feature`, landing them on `main` or `master`.

### 5. Enter plan mode (skip if `--no-plan`)
**Before entering plan mode**, read `.claude/settings.local.json` and ensure `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"` are set. If the file doesn't exist, create it with `{ "showClearContextOnPlanAccept": true, "defaultMode": "acceptEdits" }`. If it exists but lacks either key, add the missing key (preserve existing settings). `defaultMode: "acceptEdits"` is the Claude Code setting that makes newly opened sessions prefer accept-edits mode when startup settings are honored; there is no separate known setting that only controls the clear-context launch.

**YOU MUST run the full plan-mode approval sequence.** This is not optional. A next-step plan being written or already present is not a completed `/ship` unless `--no-plan` is set or the approval UI is presented successfully.

1. Call `EnterPlanMode`. This enters plan mode.
2. In plan mode, write the plan file to the path specified by the plan-mode system prompt. Keep it brief: name the next step, state that the full implementation plan is in `tasks/todo.md`, and include the ship-one-step handoff: "implement only this step, validate it, then run `/ship` when done." Do not explore the codebase or perform multi-phase planning; this is a pass-through to present the approval UI.
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
- **Ship-one-step handoff contract:** after approval, implement only this step, validate it, then run `/ship` when done.
- Any decisions or trade-offs the user should weigh in on

This gives the user something concrete to review before selecting "clear context and implement".

## Next-Step Routing

After writing the next-step plan and before entering plan mode (or before stopping when `--no-plan` is set), identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal ship summary:

- **Next work:** <specific task name, manual blocker, verification gap, or "none">
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from the next-step plan, `tasks/todo.md`, `tasks/manual-todo.md`, deploy status, validation gaps, smoke-test gaps, or the absence of remaining work. Do not use agent mode itself as the next work item.
- Never recommend `/ship`, `/ship --no-deploy`, or `/ship --no-plan` as the routine next command from a completed `/ship` run. `/ship` packages current work; after it completes, hand off to the next executable route such as `/run`, `/roadmap`, `/guide`, or `/reconcile-dev-docs fix tasks` based on project state. Recommend `/ship` again only when shipping failed before commit/push or when the next concrete work is explicitly to retry an incomplete shipping operation.
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
- Do not enter plan mode solely for verification-only/no-op-only work whose commands already passed in the current session and whose expected source changes are none. Record the completed verification/no-op result and advance to the next substantive item.
- Unless `--no-plan` is set or a documented blocker stops planning, do not end the turn after writing, finding, or shipping the next-step plan; ensure `defaultMode: "acceptEdits"` is set, then run the full `EnterPlanMode` -> pass-through plan -> `ExitPlanMode` approval sequence. If `EnterPlanMode` is denied because an explicit user request is required, stop with that blocker instead of attempting `ExitPlanMode`.
- The plan shown to the clear-context implementation session must include the ship-one-step handoff: "implement only this step, validate it, then run `/ship` when done." The plan-mode prompt is the human approval boundary that prevents a runaway loop.
- The plan must be actionable, not vague. Include specific file paths, technical details, and the current phase's `### Execution Profile`.
- Do not execute or plan from `tasks/record-todo.md` or `tasks/recurring-todo.md`; report their counts only unless an item has been promoted into `tasks/todo.md`.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff. A completed `/ship` run must not self-route back to `/ship` or `/ship --no-deploy` unless the shipping operation itself remains incomplete and needs a retry.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.

## Assistant _14:29:55_

<details><summary>Tool calls</summary>

- Bash: Check git state for ship

</details>

## Assistant _14:29:58_

Tree is clean, everything pushed. Skipping to step 3 — planning the next step. Let me check what's next.

## Assistant _14:29:59_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:30:02_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:30:06_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:30:09_

Step 43.6 is done. Let me check Step 43.7 and the phase milestone.

## Assistant _14:30:09_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/roadmap.md`

</details>

## Assistant _14:30:13_

<details><summary>Tool calls</summary>

- Bash: Find Phase 43 milestone in roadmap

</details>

## Assistant _14:30:16_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/roadmap.md`

</details>

## Assistant _14:30:21_

Now I need to check if Step 43.7 is a no-op since I already refreshed generated data in this session. Let me check.

Step 43.7 says: "Refresh generated data and validate" — I already ran `generate-skills-showcase-data.mjs` and verified the matrix. Let me check the remaining validation commands.

## Assistant _14:30:22_

<details><summary>Tool calls</summary>

- Bash: Check validation script exists

</details>

## Assistant _14:30:25_

<details><summary>Tool calls</summary>

- Bash: Validate skills showcase data

</details>

## Assistant _14:30:26_

<details><summary>Tool calls</summary>

- Bash: Check benchmark coverage

</details>

## Assistant _14:30:26_

<details><summary>Tool calls</summary>

- Bash: Check whitespace errors

</details>

## Assistant _14:30:33_

The validation script detected stale data because the GitHub proof data also needs regenerating. Let me fix this.

## Assistant _14:30:34_

<details><summary>Tool calls</summary>

- Bash: Regenerate all showcase data

</details>

## Assistant _14:30:37_

<details><summary>Tool calls</summary>

- Bash: Re-validate showcase data

</details>

## Assistant _14:30:38_

<details><summary>Tool calls</summary>

- Bash: Check benchmark coverage count

</details>

## Assistant _14:30:41_

<details><summary>Tool calls</summary>

- Bash: Check whitespace errors

</details>

## Assistant _14:30:45_

All validation passes. Step 43.7 is effectively done (generated data refreshed and validated). Since this was already partially done in Step 43.6, let me mark Step 43.6 complete in the roadmap, mark Step 43.7 complete, and check the phase milestone. Let me also check the phase acceptance criteria — all should now be met.

## Assistant _14:30:45_

<details><summary>Tool calls</summary>

- Bash: Check for uncommitted changes

</details>

## Assistant _14:30:50_

There are stale generated data changes from the github-proof script. Let me now update todo.md to mark Steps 43.6 and 43.7 complete, check off phase milestone items, and update the roadmap.

## Assistant _14:30:52_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:30:55_

All steps in Phase 43 are now complete. Let me check the phase acceptance criteria and check those off in the roadmap.

## Assistant _14:31:05_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/roadmap.md`

</details>

## Assistant _14:31:08_

Also update the phase acceptance criteria in todo.md:

## Assistant _14:31:09_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:31:17_

Now I need to check the roadmap phase acceptance criteria in todo.md. Let me look at lines around 337 (the milestone).

## Assistant _14:31:18_

<details><summary>Tool calls</summary>

- Bash: Find phase milestone in todo.md

</details>

## Assistant _14:31:21_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:31:26_

That's the Phase 41 acceptance criteria. The Phase 43 acceptance criteria don't exist separately in todo.md — they're in the "Phase 43 Next Steps" section at the top which I've already checked off. The phase is complete.

Now I need to handle the phase transition per the ship skill instructions. Let me archive Phase 43 and check what's next.

## Assistant _14:31:27_

<details><summary>Tool calls</summary>

- Bash: Check existing phase archives

</details>

## Assistant _14:31:28_

<details><summary>Tool calls</summary>

- Bash: Check advisory task files

</details>

## Assistant _14:31:32_

<details><summary>Tool calls</summary>

- Bash: Count unchecked advisory items

</details>

## Assistant _14:31:36_

<details><summary>Tool calls</summary>

- Bash: Check for blocking manual items

</details>

## Assistant _14:31:38_

No blocking manual items. Phase 43 is complete — all steps checked off, all acceptance criteria met, no blockers. Let me archive the phase and check what's next.

## Assistant _14:31:39_

<details><summary>Tool calls</summary>

- Bash: Archive Phase 43

</details>

## Assistant _14:31:42_

Now check if there's a next phase in the roadmap after Phase 43.

## Assistant _14:31:43_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/roadmap.md`

</details>

## Assistant _14:31:47_

Phase 43 is the last numbered phase — only deferred/future work remains. Per the ship skill instructions, I should run `/roadmap` to recommend the next action. But first, let me commit the current changes (phase completion bookkeeping + generated data refresh).

## Assistant _14:31:50_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _14:31:54_

Now commit and push all the phase-completion changes.

## Assistant _14:31:55_

<details><summary>Tool calls</summary>

- Bash: Stage phase completion files

</details>

## Assistant _14:31:58_

<details><summary>Tool calls</summary>

- Bash: Check if phase archive is gitignored

</details>

## Assistant _14:32:01_

<details><summary>Tool calls</summary>

- Bash: Check phases directory

</details>

## Assistant _14:32:04_

The phases directory exists and is tracked. The file was copied but maybe the current working directory was wrong. Let me check.

## Assistant _14:32:05_

<details><summary>Tool calls</summary>

- Bash: Re-copy phase archive with absolute paths

</details>

## Assistant _14:32:11_

<details><summary>Tool calls</summary>

- Bash: Commit phase completion

</details>

## Assistant _14:32:14_

<details><summary>Tool calls</summary>

- Bash: Check remaining changes

</details>

## Assistant _14:32:16_

<details><summary>Tool calls</summary>

- Bash: Check what was actually committed

</details>

## Assistant _14:32:20_

The other files (roadmap, todo, generated data) weren't included because they were already staged in the previous commit's working tree state. Let me check if they need a separate commit.

## Assistant _14:32:22_

<details><summary>Tool calls</summary>

- Bash: Check if roadmap/todo/generated changes are committed

</details>

## Assistant _14:32:26_

<details><summary>Tool calls</summary>

- Bash: Check uncommitted roadmap/todo changes

</details>

## Assistant _14:32:30_

All clean — the roadmap and todo edits were included. Let me push.

## Assistant _14:32:30_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _14:32:34_

Phase 43 is complete and pushed. Since Phase 43 was the last numbered phase and only deferred/future work remains, per the ship skill instructions I should run `/roadmap` to recommend the next action.

## Assistant _14:32:34_

<details><summary>Tool calls</summary>

- Skill: /roadmap

</details>

## User _14:32:34_

Base directory for this skill: /Users/georgele/.claude/skills/roadmap

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Roadmap - Task Pipeline Manager

Use this skill to keep the task execution pipeline healthy and moving. It scans roadmap, todo, manual tasks, record tasks, recurring tasks, history, ideas, specs, and git state, then either builds a roadmap (when none exists) or updates `tasks/todo.md` with a priority task queue.

Do not run the queued skills from this workflow. The job here is to maintain the task queue so the user can resolve all pipeline issues in the right order.

## Process

### 1. Resolve Project Context

1. Read `.agents/project.json` if it exists.
2. Use `project_type` and `enabled_packs` to decide which project-pack skills apply.
3. If `.agents/project.json` is missing, infer the project type from repository signals:
   - game: game engine files, Steam/store assets, playable prototypes, or game-specific README/spec language
   - devtool: SDK, CLI, API, library, infra, docs, examples, or package-first developer workflow
   - business-app: SaaS, marketplace, productivity, workflow, enterprise, or user-facing app
4. If the project type cannot be inferred, default to `business-app`.
5. Read `CLAUDE.md` for project conventions.
6. Read `README.md` or equivalent for project overview.

### 2. Scan Pipeline State

Record existence, content summary, and last-modified timestamps for:

- `tasks/roadmap.md` — full phased plan
- `tasks/todo.md` — current phase working document
- `tasks/todo.md` § `Priority Documentation Todo` — current documentation queue and whether it has unchecked items
- `tasks/manual-todo.md` — pending manual tasks
- `tasks/record-todo.md` — non-blocking condition-gated records and measurements
- `tasks/recurring-todo.md` — cadence-based operational, research, or maintenance tasks
- `tasks/history.md` — completed work log
- `tasks/ideas.md` — unspecced ideas
- `tasks/phases/` — archived phase files
- `tasks/lessons.md` — accumulated lessons
- `specs/` or `spec.md` — specifications
- `specs/ux-variationss-*.md` — UX variation plans for user-facing work
- `specs/ui-*.md` — implementation-ready UI specifications for user-facing work
- `research/journey-map.md` — user/customer journey context for user-facing work

Also gather:

- Git log (last 20 commits) for recent activity
- Working tree status (uncommitted changes, unpushed commits)

### 3. Determine Project State

Route behavior based on the current pipeline state:

| State | Condition | Behavior |
|-------|-----------|----------|
| A0 — No specs, missing journey | User-facing business-app work has no specs and no `research/journey-map.md` | Queue `/journey-map`. Done (skip to step 7). |
| A — No specs | No `specs/` files, no `spec.md`, and journey is complete or not applicable | Queue `/feature-interview` when an idea/research gap exists and the planning destination is not confirmed; queue `/spec-interview` only when the user already selected full-spec creation. Done (skip to step 7). |
| B0 — Specs, missing design gate | User-facing specs exist, but `research/journey-map.md`, `specs/ux-variationss-*.md`, `specs/ui-*.md`, consolidated prototype at `prototypes/*/consolidated/`, or production spec is missing | Queue the missing planning item. Done (skip to step 7). |
| B — Specs, no roadmap | Specs exist and required journey/UX/UI planning is complete or not applicable, `tasks/roadmap.md` missing or empty | Go to step 4 (build roadmap), then continue to step 5. |
| C — Work in progress | `tasks/roadmap.md` exists, unchecked phases remain | Skip to step 5 (classify issues). |
| G — Roadmap extension needed | `tasks/roadmap.md` exists, all phases are checked, and a substantive spec exists that is newer than the roadmap or is not represented in any completed phase | Go to step 4 in extension mode: interview only for the new/changed spec scope, append the agreed next phase(s), then seed the first new phase with `/plan-phase N`. Do not queue `/roadmap`. |
| D — All complete, documentation scan needed | All phases in `tasks/roadmap.md` are checked and `tasks/todo.md` has no current `## Priority Documentation Todo` section from a previous `/research-roadmap` run | Queue `/research-roadmap` for documentation scan. Done (skip to step 7). |
| E — All complete, documentation queue active | All phases in `tasks/roadmap.md` are checked and `tasks/todo.md` has an unchecked `## Priority Documentation Todo` item | Preserve the existing documentation queue and recommend the first unchecked documentation item. Done (skip to step 8; do not add another `/research-roadmap` task). |
| F — All complete, documentation current | All phases in `tasks/roadmap.md` are checked and `tasks/todo.md` § `Priority Documentation Todo` says documentation is current with no unchecked documentation items | Report that implementation phases and documentation scan are complete; do not queue `/research-roadmap` again. Done (skip to step 8). |

### 4. Build or Extend Roadmap (States B and G)

When specs exist but no roadmap does, interview the user to build one. When State G applies, interview only on the new or changed spec scope needed to extend the existing roadmap; preserve completed phases and append the agreed next phase(s).

#### 4a. Synthesize and Present

Present the user with a structured summary:

- List each spec section / feature area identified
- Note dependencies between them
- Highlight any conflicts or overlaps between specs
- Flag specs that seem incomplete or ambiguous

#### 4b. Interview on Strategy

Use the AskUserQuestion tool to align on roadmap decisions. Ask one to three focused questions per turn. Cover:

- **Priority**: Which features/specs are most important? What's MVP vs. later?
- **Grouping**: Should any specs be combined into a single phase? Split apart?
- **Sequencing**: What depends on what? What should ship first for user value or risk reduction?
- **Scope**: Should anything be deferred, dropped, or marked as stretch?
- **Market fit** (when ICP/gap specs exist): Which phases directly address customer pain points or deal-blockers from gap analysis? Prioritise these unless technically impossible. Surface tension between technical sequencing and market urgency.
- **Phase sizing**: Preference for many small phases vs. fewer larger ones?
- **Manual tasks**: Are there human-only external prerequisites (DNS/account setup, OAuth app creation, billing/approval, real-device or production browser verification with subjective sign-off)? Which phases do they block or follow? Do not classify repo edits, SDK wiring, CLI/API work, local tests, or audits as manual.
- **Parallelization**: Which phase work can run independently, which modules or files are shared chokepoints, and where should work stay serial?
- **Review needs**: Which phases need specialized review gates (correctness, tests, security, performance, docs/API conformance, UX)?
- **Agent-team fit**: Which phases are too broad or cross-cutting for local in-session subagents and should instead use branch-backed worktree isolation or Claude agent teams with consolidation/PR review?

When options exist, present pros/cons with a recommendation — same style as `/spec-interview`. Do not manufacture artificial choices.

Continue until the user confirms the phase structure is complete.

#### 4c. Write the Roadmap

Write or update `tasks/roadmap.md` with the agreed phase structure. In State B, create the full roadmap. In State G, append or adjust only the new/changed future phase scope needed for the changed spec; do not rewrite completed phases except to add a short note that a later phase supersedes or extends prior work.

Use this format:

```markdown
# Roadmap: [Project Name]

> Generated from: [source files]
> Date: [current date]
> Total Phases: [N]

## Summary
[2-3 sentence overview of the implementation strategy and sequencing rationale]

## Phase Overview
| Phase | Title | Source Spec(s) | Key Deliverable | Est. Complexity |
|-------|-------|----------------|-----------------|-----------------|
| 1     | ...   | ...            | ...             | S / M / L       |
| 2     | ...   | ...            | ...             | S / M / L       |

---

## Phase 1: [Title]

**Goal**: [What this phase achieves and why it comes first]

**Scope**:
- [Feature/capability 1 from spec section X]
- [Feature/capability 2 from spec section Y]

**Acceptance Criteria:**
- [ ] [Specific, verifiable criterion 1]
- [ ] [Specific, verifiable criterion 2]
- [ ] [Specific, verifiable criterion 3]

**Manual Tasks** (if any):
- [Human-only external prerequisite] _(blocks: Step N.X)_ or _(after: Step N.X)_

**Parallelization:** serial | research-only | review-only | implementation-safe | agent-team

**Coordination Notes:** [dependencies, shared chokepoints, and why this mode was chosen]

**On Completion** (fill in when phase is done):
- Deviations from plan: [none, or describe]
- Tech debt / follow-ups: [none, or list]
- Ready for next phase: yes/no

---

[Repeat for each phase]

---

## Deferred / Future Work
- [Items explicitly descoped during interview, with reasoning]

## Cross-Phase Concerns
### Integration Tests
- [Tests that span multiple phases, and when to write them]
### Non-Functional Requirements
- [Performance, security, accessibility — and which phase addresses each]
```

**Important**: The roadmap defines phases, goals, scope, acceptance criteria, and strategic parallelization mode — but NOT implementation steps, TDD structure, subagent lanes, write ownership, or file-level detail. That's `/plan-phase`'s job.

If a phase has human-gated prerequisites, include only those external prerequisites in `**Manual Tasks:**`. Split mixed work: human account/approval/credential steps belong in `**Manual Tasks:**`; code changes, repo configuration, CLI/API calls with available auth, tests, audits, and generated assets stay in Scope/Acceptance Criteria for `/plan-phase` to turn into `tasks/todo.md`.

Use `serial` when work is tightly coupled or file ownership cannot be separated. Use `research-only` when parallel exploration helps but implementation should remain integrated. Use `review-only` when the build should be serial but post-implementation review benefits from multiple lenses. Use `implementation-safe` only when likely write ownership can be cleanly separated. Use `agent-team` for broad cross-cutting phases that should run in isolated GitHub branches/worktrees or a dedicated multi-agent team rather than one shared local tree; the later `/plan-phase` detail must include branch-backed write lanes and a consolidation/PR review gate.

#### 4d. Seed Phase 1

After writing `tasks/roadmap.md`, immediately invoke `/plan-phase 1` for State B or `/plan-phase N` for the first newly appended State G phase to generate implementation detail. This produces `tasks/todo.md` and, when applicable, `tasks/manual-todo.md`, `tasks/record-todo.md`, or `tasks/recurring-todo.md`, so the user lands on an actionable starting point rather than an undecomposed roadmap.

Do not decompose later phases — those are generated just-in-time when each phase begins (via `/ship` or `/run`).

After `/plan-phase` completes, continue to step 5 to scan the freshly-created or freshly-extended roadmap for any pipeline issues.

### 5. Classify Issues (States B-after, G-after, and C)

Check for each issue type in order. Include timestamps or evidence for every finding.

#### 1. Dirty Working Tree
Uncommitted changes or unpushed commits exist. These must be resolved before task pipeline work.

#### 2. Phase Completion Not Advanced
`tasks/todo.md` has all steps checked and milestone criteria met, but the phase has not been archived or the next phase loaded. Evidence: all `- [x]` in todo, no `- [ ]` remaining under implementation steps.

#### 3. Blocking Manual Tasks
`tasks/manual-todo.md` contains unchecked items with `_(blocks: Step N.X)_` annotations for steps that are next in the execution queue. These block automated progress.

#### 4. Stale Todo
`tasks/roadmap.md` was modified more recently than `tasks/todo.md`, suggesting the roadmap was updated but the current working document was not refreshed. Evidence: roadmap mtime vs todo mtime.

#### 5. Missing Implementation Steps
A roadmap phase has acceptance criteria but no implementation steps (no `### Tests First`, `### Implementation`, or `### Green` section). This phase needs `/plan-phase` before `/run` can execute it.

#### 6. Orphaned Manual Tasks
`tasks/manual-todo.md` references a phase that has already been completed or archived, but unchecked items remain. These need resolution or explicit deferral.

#### 7. Eligible Record Tasks
`tasks/record-todo.md` contains unchecked items whose condition appears to be true. These are advisory by default. Queue promotion to `tasks/todo.md` only when the item is now concrete execution work; otherwise leave it in `tasks/record-todo.md` with updated evidence or revisit timing.

#### 8. Due Recurring Tasks
`tasks/recurring-todo.md` contains unchecked or active items whose `Next due` is today or earlier. These are advisory by default. Queue promotion to `tasks/todo.md` only when the due item requires real execution work; otherwise leave it in `tasks/recurring-todo.md` with updated run/evidence state.

#### 9. History Gap
Work has been completed (checked-off steps in todo, archived phases) but `tasks/history.md` is missing, empty, or its last entry predates the most recent phase archive. Evidence: phase archive timestamps vs history mtime.

#### 10. Spec-Task Drift
Specs have been modified more recently than the roadmap, suggesting the plan may not reflect the current specifications. Evidence: spec mtime vs roadmap mtime. Only flag when the spec modification is substantive (not just formatting). If the drift is a new or changed implementation scope after all roadmap phases are complete, handle it as State G in this run by extending the roadmap and seeding the first new phase; do not queue `/roadmap`. Queue `/spec-interview` only when the changed spec is incomplete or ambiguous enough that roadmap sequencing cannot proceed.

#### 11. Missing Journey/UX/UI Planning
User-facing specs exist, but one or more required design-planning artifacts are missing:

- `research/journey-map.md` — run `/journey-map` first to define discovery, onboarding, aha, conversion, retention, and advocacy.
- `specs/ux-variationss-*.md` — run `/ux-variations` after journey/spec context to compare onboarding, workflow, sharing, return-use, and UI variants.
- `specs/ui-*.md` — run `/ui-interview` after UX variation to lock buildable screen-level detail.

Only flag this for user-facing product work. Skip for pure backend, CLI, library, infrastructure, or internal automation specs unless they include a meaningful human workflow or interface.

#### 12. Missing Roadmap (internal consistency fallback)
Specs exist in `specs/` (or `spec.md`) but `tasks/roadmap.md` does not exist. Do not queue `/roadmap` for this. This means State B was misclassified or the roadmap disappeared during the run. Re-enter State B in the same run, build the roadmap through step 4, then seed `/plan-phase 1`. If the roadmap cannot be built because required input is missing, queue the missing upstream input skill (`/spec-interview`, `/journey-map`, `/ux-variations`, or `/ui-interview`) with evidence.

#### 13. Lessons Not Reviewed
`tasks/lessons.md` was updated more recently than the current phase's implementation steps were written, suggesting new lessons may apply to in-progress work.

#### 14. Unspecced Ideas
`tasks/ideas.md` contains ideas that have no corresponding spec in `specs/`. These are candidates for `/feature-interview` triage. Use `/spec-interview --ideas` or individual `/spec-interview` runs only when the user explicitly wants full specs for every selected idea.

### 6. Order the Priority Queue

Order action items so the user can resolve pipeline issues without guessing:

1. Dirty working tree (uncommitted/unpushed work).
2. Phase completion not advanced (work is done but pipeline is stuck).
3. Blocking manual tasks (human action needed before automation can continue).
4. Stale todo (working document out of sync with roadmap).
5. Missing implementation steps (phase needs decomposition before execution).
6. Orphaned manual tasks (leftover from completed phases).
7. Eligible record tasks (advisory unless promoted to execution work).
8. Due recurring tasks (advisory unless promoted to execution work).
9. History gap (completed work not recorded).
10. Spec-task drift (plan may be outdated).
11. Missing journey/UX/UI planning (user-facing specs are not ready for roadmap).
12. Missing roadmap fallback (recover in this run by building the roadmap or queueing the missing upstream input; never queue `/roadmap`).
13. Lessons not reviewed (new lessons may apply).
14. Unspecced ideas (ideas waiting for interview).

Within each category, prefer items that unblock the most downstream work.

### 7. Update `tasks/todo.md`

Write a single top-level section named exactly:

```md
## Priority Task Queue
```

Rules:

1. If `tasks/todo.md` does not exist, create it with only this section.
2. If a previous `## Priority Task Queue` section exists, replace only that section.
3. Put the section before existing implementation work. If the file starts with a title or status block, keep that orientation text at the top and insert the priority section immediately after it.
4. Preserve all other todo content exactly unless it is inside the old priority section.
5. Do not mark existing implementation steps complete.
6. Do not remove unrelated todo sections.
7. Use unchecked boxes for unresolved issues.
8. Use checked boxes only when an issue is already resolved.
9. Never write `/roadmap` into `## Priority Task Queue`. If an issue appears to require `/roadmap`, resolve the underlying state in this run:
   - specs missing: queue `/feature-interview` for idea triage, `/spec-interview` when full spec creation is already confirmed, or the relevant upstream planning command
   - user-facing design gate missing: queue `/journey-map`, `/ux-variations`, or `/ui-interview`
   - specs exist but roadmap missing: build `tasks/roadmap.md` through State B and seed `/plan-phase 1`
   - existing queue already contains `/roadmap`: replace it with `/reconcile-dev-docs fix tasks` because the queue is stale/self-referential

Action item format:

```md
- [ ] `/skill [args]` - [action description] because [reason with evidence].
```

For external manual tasks that block progress (browser/service-console work with
no reliable authenticated CLI/API path, such as DNS, OAuth, Stripe/Vercel/GitHub
dashboard setup, signups, paid account approval, or production smoke checks that
need a real account/device or human sign-off):

```md
- [ ] Complete manual task: "[task description]" _(blocks: Step N.X)_ — resolve before `/run` can continue.
```

Do not use this format for agent-executable work or for bookkeeping/documentation
reconciliation just because the finding mentions `tasks/manual-todo.md`. If the
work is repo edits, SDK wiring, generated assets, local commands, tests, audits,
or CLI/API work with available auth, put it in `tasks/todo.md`. If the work is
auditing, classifying, checking off, moving, or reconciling task-doc entries
against repo reality, route it to `/reconcile-dev-docs fix tasks` or describe it
as a direct dev-doc audit task.

For advisory record or recurring tasks:

```md
- [ ] Review `tasks/record-todo.md`: "[task description]" — condition appears eligible; promote to `tasks/todo.md` only if this is now concrete execution work.
- [ ] Review `tasks/recurring-todo.md`: "[task description]" — next due is today or earlier; promote to `tasks/todo.md` only if this requires execution work.
```

For dirty tree:

```md
- [ ] `/ship-end --no-deploy` - commit and push uncommitted changes before continuing task work.
```

For missing journey/UX/UI planning:

```md
- [ ] `/journey-map` - create `research/journey-map.md` before roadmap because user-facing specs need lifecycle context.
- [ ] `/ux-variations` - create `specs/ux-variationss-[topic].md` before roadmap because user-facing specs need experience alternatives.
- [ ] `/ui-interview` - create `specs/ui-[topic].md` before roadmap because the selected experience needs implementation-ready interface detail.
```

If all pipeline checks pass:

```md
- [x] Task pipeline is healthy; no issues found. Ready for `/run`.
```

### 8. Output to User

After editing, summarize:

```
## Roadmap Updated

- Wrote/updated `tasks/todo.md`
- Priority task items: N
- Blocking issues: N (must resolve before `/run`)
- Advisory issues: N (should resolve soon)

Next: start at the first unchecked item in `tasks/todo.md`.
```

For State A (no specs):

```
## No Specs Found

- No specifications found in `specs/` or `spec.md`
- Queued `/journey-map` first if user-facing lifecycle context is missing; otherwise queued `/feature-interview` to confirm whether to create a new spec, update an existing spec, or route elsewhere

Next: `/journey-map` to define the customer/user lifecycle, or `/feature-interview` when journey context is already present or not applicable.
```

For State D (all complete, documentation scan needed):

```
## All Phases Complete

- All roadmap phases are checked off
- No current `## Priority Documentation Todo` section from a previous `/research-roadmap` run was found
- Queued `/research-roadmap` for documentation scan

Next: `/research-roadmap` to check documentation health.
```

For State E (all complete, documentation queue active):

```
## Documentation Queue Active

- All roadmap phases are checked off
- Existing `## Priority Documentation Todo` contains unchecked documentation work

Next: start at the first unchecked item in `tasks/todo.md` § `Priority Documentation Todo`.
```

For State F (all complete, documentation current):

```
## Roadmap Complete

- All roadmap phases are checked off
- Documentation scan is current; no missing or stale documentation work is queued

Next: no roadmap or documentation pipeline work is queued.
```

If the pipeline is fully healthy:

```
## Roadmap Updated

- Task pipeline is healthy
- No blocking or advisory issues found

Next: `/run` to continue execution.
```

## Next-Step Routing

Before handing back, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal report:

- **Next work:** <specific planning, priority-queue, research, or execution task>
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from the roadmap state, the first unchecked priority-queue item, the next unplanned phase, advisory queues, or the absence of remaining work. Do not use agent mode itself as the next work item.
- Never recommend `/roadmap` as the next command from a `/roadmap` run. This skill is the scanner/router; once it has updated the queue, the next command must be the first queued actionable skill (`/feature-interview`, `/spec-interview`, `/journey-map`, `/ux-variations`, `/ui-interview`, `/prototype`, `/consolidate-variations`, `/research-roadmap`, `/plan-phase N`, `/ship-end --no-deploy`, `/reconcile-dev-docs fix tasks`, `/run`, `/guide`, or `none`). If the first unchecked item itself says `/roadmap`, treat that as a stale/self-referential queue item and route to `/reconcile-dev-docs fix tasks` with evidence.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Claude slash invocation (`/roadmap`, `/plan-phase`, `/run`, `/delegate`) or orchestration-heavy work → recommend the matching `/...` route.
  - Codex skill invocation (`$roadmap`, `$plan-phase`, `$run`, `$research-roadmap`) → recommend the matching `$...` command.
  - External manual work or browser-gathered evidence with no reliable authenticated CLI/API path (DNS/OAuth/service dashboards, auth setup, production smoke checks that need real account/device or human sign-off) → recommend `/guide` or a Claude-guided manual step.
  - Task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → recommend `/reconcile-dev-docs fix tasks` or a direct dev-doc audit, not `/guide`.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

## Constraints

- **Always interview for new roadmaps.** Do not produce a roadmap without user input on priorities and sequencing when building one from scratch (State B).
- **Respect existing specs.** Do not modify files in `specs/` (or `spec.md`) — the roadmap references specs, it doesn't rewrite them.
- **Phase headers must use `## Phase N: [Title]` format** for compatibility with `/run`, `/ship`, and phase transition logic.
- **Acceptance criteria must be specific and checkable** — not vague statements like "works correctly."
- **Do not include TDD steps or file-level implementation detail** in the roadmap. That belongs in `/plan-phase`.
- **`tasks/roadmap.md` is the source of truth** for the full phased plan. `tasks/todo.md` holds only the current phase.
- **Do not put roadmap content in CLAUDE.md** — CLAUDE.md is for project conventions only.
- **Keep the interview focused.** This is about sequencing and priority, not re-litigating spec decisions. If a spec question comes up, note it and suggest running `/spec-interview` again for that topic.
- This skill updates `tasks/todo.md` and `tasks/roadmap.md`; it must not run queued priority items. It may invoke `/plan-phase 1` only as the explicit Phase 1 seed described above.
- Preserve user-authored todo content outside `## Priority Task Queue`.
- Every issue must include evidence (timestamps, checked-item counts, file existence).
- Do not directly modify `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, or any specs (except to create `tasks/roadmap.md` in State B). `/plan-phase 1` may create or update task files during the explicit Phase 1 seed.
- Do not put agent-executable work in `**Manual Tasks:**` or `tasks/manual-todo.md`. Manual means human-only external prerequisite; automatable repo, CLI, API, test, audit, or asset work belongs in `tasks/todo.md`.
- Do not treat `tasks/record-todo.md` or `tasks/recurring-todo.md` as execution queues. They are advisory surfaces unless an item is explicitly promoted into `tasks/todo.md`.
- Do not create or modify source code.
- Do not archive phases, advance the pipeline, or execute implementation steps.
- Prefer actionable skill invocations (`/ship`, `/run`, `/plan-phase N`, `/research-roadmap`) over vague guidance.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.

## Assistant _14:32:38_

Let me scan the pipeline state now that Phase 43 (the last numbered phase) is complete.

## Assistant _14:32:39_

<details><summary>Tool calls</summary>

- Bash: Check git state

</details>

## Assistant _14:32:40_

<details><summary>Tool calls</summary>

- Bash: Count checked/unchecked phases

</details>

## Assistant _14:32:41_

<details><summary>Tool calls</summary>

- Bash: Check for documentation queue in todo

</details>

## Assistant _14:32:44_

<details><summary>Tool calls</summary>

- Bash: Find unchecked items in roadmap

</details>

## Assistant _14:32:52_

<details><summary>Tool calls</summary>

- Bash: Find phase headers and milestones

</details>

## Assistant _14:32:55_

<details><summary>Tool calls</summary>

- Bash: Check Phase 40 and 41 status

</details>

## Assistant _14:32:58_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/roadmap.md`

</details>

## Assistant _14:33:02_

I see — Phase 41 still has unchecked items. Let me check if it's actually been worked on or if it's truly incomplete.

## Assistant _14:33:04_

<details><summary>Tool calls</summary>

- Bash: Count completed phases

</details>

## Assistant _14:33:07_

<details><summary>Tool calls</summary>

- Bash: Find incomplete phases

</details>

## Assistant _14:33:13_

Phases 40, 41, 42, 43 don't have the `✓` mark in the roadmap. But Phase 40 and 42 are described as complete in the summary. Phase 43 was just completed. Phase 41 is the remaining incomplete work. This is State C — work in progress. Phase 41 has unchecked batches remaining.

Let me check the Phase 41 batch progress more carefully.

## Assistant _14:33:13_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/roadmap.md`

</details>

## Assistant _14:33:21_

The roadmap hasn't been updated to reflect actual Phase 41 progress. Based on the history, Batches 41.1 through 41.5 have been extensively worked. Phase 41 is partially complete but its roadmap entries aren't checked off. This is a "stale todo" / roadmap sync issue, but more importantly, Phase 43 was just completed and the todo.md still has Phase 43 content.

The pipeline state is: Phase 43 complete, Phase 41 still has remaining work (it was paused for Phase 43 fixture remediation). Now that fixtures are remediated, Phase 41 can resume. But there are no more phases after 43 — the next work is to resume Phase 41's remaining batches.

Let me check what's actually been done in Phase 41 vs what remains.

## Assistant _14:33:21_

<details><summary>Tool calls</summary>

- Bash: Check Phase 41 batch history

</details>

## Assistant _14:33:25_

<details><summary>Tool calls</summary>

- Bash: Count graded benchmark rows

</details>

## Assistant _14:33:29_

<details><summary>Tool calls</summary>

- Bash: Count unique graded skill names

</details>

## Assistant _14:33:33_

69 unique skills graded out of 158 total. Phase 41 has significant remaining work (89 skills ungraded). Batches 41.1-41.3 and 41.5 (Groups 1-2) are done. Remaining: 41.4 (git-fixture skills), 41.5 (remaining pack-local families), and 41.6 (blocked skills).

Now let me write the priority queue and update todo.md. Since Phase 43 is complete, I need to load Phase 41 (the remaining incomplete phase) as the active phase.

## Assistant _14:33:34_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:33:38_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:33:41_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:33:49_

I have a thorough understanding of the state now. Phase 41 has remaining batches (41.4, 41.5, 41.6) but the Batch 41.5 checkbox in the todo.md is unchecked despite 2 groups being completed. This is a stale-todo issue. However, Phase 43 just completed (route + domain fixes) which should dramatically improve the Tier 2 global pass rates from Batch 41.3 — those were the skills that had near-universal route assertion failures.

This is State D — all phases are effectively complete (Phase 41's remaining batches are continuation work, not a blocked phase), and there's no `## Priority Documentation Todo` section. Let me write the priority queue.

## Assistant _14:33:49_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:33:53_

I need to update the status header and insert a priority queue. Since Phase 43 is now complete and Phase 41 is the remaining active work, let me update accordingly.

## Assistant _14:34:01_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _14:34:04_

Now commit and push the roadmap scan results.

## Assistant _14:34:06_

<details><summary>Tool calls</summary>

- Bash: Commit and push roadmap scan updates

</details>

## Assistant _14:34:10_

Now let me check the settings file and enter plan mode for the next step handoff.

## Assistant _14:34:11_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/.claude/settings.local.json`

</details>

## Assistant _14:34:14_

Settings already have `showClearContextOnPlanAccept: true` and `defaultMode: "acceptEdits"`. Now enter plan mode.

## Assistant _14:34:14_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _14:34:19_

<details><summary>Tool calls</summary>

- EnterPlanMode

</details>

## Assistant _14:34:22_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/.claude/plans/desk-flip-benchmark-artifact-reference-f-graceful-dewdrop.md`

</details>

## Assistant _14:34:26_

This is the old plan from the previous step. I need to overwrite it with the new handoff for resuming Phase 41.

## Assistant _14:34:46_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/.claude/plans/desk-flip-benchmark-artifact-reference-f-graceful-dewdrop.md`

</details>

## Assistant _14:34:49_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _14:34:55_

[Request interrupted by user for tool use]
