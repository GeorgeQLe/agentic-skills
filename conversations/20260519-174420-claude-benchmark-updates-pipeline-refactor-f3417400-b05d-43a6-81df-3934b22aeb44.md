# benchmark-updates-pipeline-refactor

| Field | Value |
|-------|-------|
| **Date** | 2026-05-19 17:44:20 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `f3417400-b05d-43a6-81df-3934b22aeb44` |
| **Entrypoint** | cli |
| **Version** | 2.1.144 |

---

## User _17:44:20_

Implement the following plan:

# Benchmark Updates for Prototype-First Pipeline Refactor

## Context

The prototype-first pipeline refactor (commit d84f6fe) renamed `ux-variation` → `ux-variations`, `ui-consolidate` → `consolidate-variations`, and added a new `prototype` skill. The benchmark coverage matrix and test setups still reference the old skill names and don't cover the new skill. This causes the coverage validator (`pnpm bench:coverage`) to fail because it discovers skills from `global/claude/*/SKILL.md` but the registry still lists old names.

---

## Changes Required

### 1. Update `tests/harness/bench-coverage.ts`

**File:** `tests/harness/bench-coverage.ts`

- **TIER23_GLOBAL_CUSTOM_SKILLS array** (lines 32-69): Rename entries:
  - `"ui-consolidate"` → `"consolidate-variations"`
  - `"ux-variation"` → `"ux-variations"`
  - Add `"prototype"` (alphabetically between `"provision-agentic-config"` and `"reconcile-dev-docs"`)

### 2. Update `tests/layer4/setups/tier23-global-workflows.setup.ts`

**File:** `tests/layer4/setups/tier23-global-workflows.setup.ts`

- **Rename `ux-variation` definition** (line 853): Change `skill: "ux-variation"` → `skill: "ux-variations"`, update prompt text and recommendedRoute to reflect new pipeline (next step after ux-variations is `/ui-interview` per variation → `/prototype`, not `$run`)
  
- **Rename `ui-consolidate` definition** (line 815): Change `skill: "ui-consolidate"` → `skill: "consolidate-variations"`, update:
  - `outputPath`: `"specs/ui-final-dashboard.md"` → `"prototypes/dashboard/consolidated/index.html"` (output is now a consolidated prototype, not a spec)
  - `prompt`: Reference `consolidate-variations` skill, output to `prototypes/` not `specs/`
  - `recommendedRoute`: `"$design-system"` → `"$research-roadmap --post-prototype"` (new pipeline routing)
  - `expectedIncludes`: Keep consolidation matrix + conflict resolutions, add "consolidated prototype"
  - `fixtureFiles`: Add prototype variation directories as fixtures

- **Add `prototype` definition**: New entry for the prototype skill with:
  - `skill: "prototype"`
  - `outputPath: "prototypes/dashboard/index.html"` (hub page)
  - `prompt`: Reference prototype skill, build from ux-variations and ui specs
  - `fixtureFiles`: `specs/ux-variations-dashboard.md`, `specs/ui-dashboard.md`, `.agents/project.json`
  - `expectedIncludes`: ["variation", "hub page", "clickable", "fake data"]
  - `recommendedRoute: "$uat --variant-evaluation"`

### 3. Update `tests/layer4/setups/tier1-workflows.setup.ts`

**File:** `tests/layer4/setups/tier1-workflows.setup.ts`

- **`spec-interview` definition** (line 618): Update to reflect post-prototype deep dive:
  - Change prompt to reference consolidated prototype as primary input instead of draft spec
  - Update `fixtureFiles`: Add `prototypes/dashboard/consolidated/index.html` fixture, keep `specs/draft.md`
  - Remove "Prototype Phase 0" from prompt and expectedIncludes
  - Change `recommendedRoute`: `"$roadmap"` → `"$research-roadmap --post-spec"` (new pipeline routing)
  - Remove `prototypeFirstProductGateCriterion` from `extraCriteria` (prototype work is now upstream)

- **`roadmap` definition** (line 513): Update prompt to remove "separate prototype/experiment phase with route-based experiments" language. The roadmap no longer creates Phase 0; prototypes happen upstream. Update fixture to include consolidated prototype evidence.
  - Remove `prototypeFirstProductGateCriterion` from `extraCriteria`

- **`plan-phase` definition** (line 545): Update prompt to remove "separate prototype/experiment phase, route-based experiments" language. Add reference to consolidated prototype as visual spec.
  - Remove `prototypeFirstProductGateCriterion` from `extraCriteria`

- **`feature-interview` definition** (line 566): Update prompt to remove "prototype-first gate, route-based experiments" and add scope triage language (small/medium/large re-entry). Keep evidence and decision markers.
  - Remove `prototypeFirstProductGateCriterion` from `extraCriteria`

- **`prototypeFirstProductGateCriterion`** (line 269): Either remove entirely or rename to reflect the new pipeline where prototype work is explicit and upstream. Since no tier1 skills use it anymore after the above changes, it can be removed. Check if any remaining references exist.

### 4. Update `research-roadmap` tier23 definition

- Update the `research-roadmap` definition (line 659) to test the default mode. The `--post-prototype` and `--post-spec` modes are new but don't need separate benchmark setups yet (the default mode coverage is sufficient for now).

---

## Verification

1. Run `pnpm --dir tests bench:coverage` to validate the coverage matrix has no broken references
2. Run `grep -rn "ux-variation\|ui-consolidate" tests/` to confirm no stale references remain in test files
3. Verify all three new/renamed skill entries (`prototype`, `ux-variations`, `consolidate-variations`) appear in the coverage matrix output
4. Verify the `prototypeFirstProductGateCriterion` is cleanly removed with no dangling references


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/ba01a89f-6661-4c41-8573-9a0550ef83df.jsonl

## Assistant _17:44:24_

I'll read the key files first, then make all the changes.

## Assistant _17:44:25_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/harness/bench-coverage.ts`

</details>

## Assistant _17:44:26_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier23-global-workflows.setup.ts`

</details>

## Assistant _17:44:26_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:44:30_

Let me read more of the tier1 file and the rest of the tier23 file.

## Assistant _17:44:31_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:44:32_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:44:35_

Let me read the research-roadmap definition and check for all `prototypeFirstProductGateCriterion` references.

## Assistant _17:44:37_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier23-global-workflows.setup.ts`

</details>

## Assistant _17:44:37_

<details><summary>Tool calls</summary>

- Bash: Find all references to prototypeFirstProductGateCriterion

</details>

## Assistant _17:44:41_

Let me also read the line 421 reference for context.

## Assistant _17:44:41_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:44:46_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:44:49_

Now I have all the context I need. Let me make all the changes. Starting with the simpler edits in parallel.

## Assistant _17:44:50_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/harness/bench-coverage.ts`

</details>

## Assistant _17:44:51_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/harness/bench-coverage.ts`

</details>

## Assistant _17:44:55_

<details><summary>Tool calls</summary>

- Bash: Find all occurrences of old skill names

</details>

## Assistant _17:44:58_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/harness/bench-coverage.ts`

</details>

## Assistant _17:44:59_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/harness/bench-coverage.ts`

</details>

## Assistant _17:45:03_

Now let me check if `"prototype"` needs to be added to the second array too (around line 336).

## Assistant _17:45:03_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/harness/bench-coverage.ts`

</details>

## Assistant _17:45:06_

This is a different array — looks like all known skills. I need to add `"prototype"` here too. Let me find the right alphabetical spot.

## Assistant _17:45:07_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/harness/bench-coverage.ts`

</details>

## Assistant _17:45:10_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/harness/bench-coverage.ts`

</details>

## Assistant _17:45:13_

Good. Now let me update the tier23 setup file — rename `ux-variation`, `ui-consolidate`, and add `prototype`.

## Assistant _17:45:24_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier23-global-workflows.setup.ts`

</details>

## Assistant _17:45:26_

Now update the `ux-variation` → `ux-variations` entry.

## Assistant _17:45:31_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier23-global-workflows.setup.ts`

</details>

## Assistant _17:45:34_

Now add the `prototype` definition. Let me add it after the `provision-agentic-config` entry alphabetically. Let me find that entry.

## Assistant _17:45:35_

<details><summary>Tool calls</summary>

- Bash: Find location for prototype entry

</details>

## Assistant _17:45:38_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier23-global-workflows.setup.ts`

</details>

## Assistant _17:45:46_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier23-global-workflows.setup.ts`

</details>

## Assistant _17:45:50_

Now update the tier1 file. First, remove `prototypeFirstProductGateCriterion` and update the skill definitions.

## Assistant _17:46:09_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:46:12_

Now remove all references to `prototypeFirstProductGateCriterion` from the extraCriteria arrays and the `run` skill.

## Assistant _17:46:12_

<details><summary>Tool calls</summary>

- Bash: Find remaining references

</details>

## Assistant _17:46:16_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:46:20_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:46:24_

Now handle the `extraCriteria: [prototypeFirstProductGateCriterion]` entries — these should become empty or the property removed. Let me check each one.

## Assistant _17:46:24_

<details><summary>Tool calls</summary>

- Bash: Check remaining references

</details>

## Assistant _17:46:27_

All four are `extraCriteria: [prototypeFirstProductGateCriterion]` — I'll replace all with empty arrays.

## Assistant _17:46:28_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:46:31_

Now update the `roadmap` definition prompt and fixture.

## Assistant _17:46:32_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:46:35_

Now update the `roadmap` prompt and fixture to remove prototype/experiment phase language and reference consolidated prototype.

## Assistant _17:46:40_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:46:44_

Update `plan-phase` prompt.

## Assistant _17:46:47_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:46:50_

Update `feature-interview` prompt.

## Assistant _17:46:54_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:46:59_

Now update `spec-interview`.

## Assistant _17:47:00_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:47:11_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:47:15_

Now update `run` skill's expectedIncludes to remove "prototype" since prototype is now upstream.

## Assistant _17:47:15_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:47:19_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer4/setups/tier1-workflows.setup.ts`

</details>

## Assistant _17:47:21_

Now let me run the verification steps.

## Assistant _17:47:22_

<details><summary>Tool calls</summary>

- Bash: Check for stale references in test files

</details>

## Assistant _17:47:24_

<details><summary>Tool calls</summary>

- Bash: Check for dangling prototypeFirstProductGateCriterion references

</details>

## Assistant _17:47:27_

`prototypeFirstProductGateCriterion` is clean. There are stale references in `tests/layer1/codex-interview-cadence.test.ts` and `tests/layer1/bench-setups.test.ts`. Let me check those.

## Assistant _17:47:28_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/codex-interview-cadence.test.ts`

</details>

## Assistant _17:47:29_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:47:33_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer1/codex-interview-cadence.test.ts`

</details>

## Assistant _17:47:34_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:47:37_

Now let me check if there are more stale refs (excluding benchmark run JSON files which are historical).

## Assistant _17:47:38_

<details><summary>Tool calls</summary>

- Bash: Check for stale references in test source files only

</details>

## Assistant _17:47:41_

All remaining references are to the new names (`ux-variations`, `consolidate-variations`). Now run the coverage validator.

## Assistant _17:47:42_

<details><summary>Tool calls</summary>

- Bash: Run coverage validator

</details>

## Assistant _17:47:45_

Coverage matrix passes. Let me also verify the three new/renamed skills appear in the output.

## Assistant _17:47:46_

<details><summary>Tool calls</summary>

- Bash: Verify new skill names in coverage output

</details>

## Assistant _17:47:49_

The validator only outputs a summary line when valid. Let me check the matrix directly to confirm.

## Assistant _17:47:51_

<details><summary>Tool calls</summary>

- Bash: Verify new skills in coverage arrays

</details>

## Assistant _17:48:35_

All three skills are present in both arrays. Let me run the layer1 tests to make sure nothing is broken there.

## Assistant _17:48:36_

<details><summary>Tool calls</summary>

- Bash: Run relevant layer1 tests

</details>

## Assistant _17:48:41_

There's a test failure. Let me look at the failing test.

## Assistant _17:48:41_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:48:44_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:48:49_

The test at line 1988 looks up `prototype-first-product-gate` criterion which we removed. The test expects it to exist. I need to remove these test assertions. Let me see the full test to understand its scope.

## Assistant _17:48:50_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:48:53_

I need to remove the entire `prototypeGateCriterion` test block (lines 1988-2031). Let me also check if there are other tests that reference the prototype gate.

## Assistant _17:48:54_

<details><summary>Tool calls</summary>

- Bash: Find all prototype gate references in bench-setups test

</details>

## Assistant _17:49:03_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:49:06_

Now let me re-run the tests to check.

## Assistant _17:49:07_

<details><summary>Tool calls</summary>

- Bash: Re-run relevant tests

</details>

## Assistant _17:49:15_

Different failure now. Let me see line 1752.

## Assistant _17:49:16_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:49:19_

This test checks that the spec-interview skill files contain certain route strings. Let me check whether those skill files were changed by the pipeline refactor.

## Assistant _17:49:20_

<details><summary>Tool calls</summary>

- Bash: Check current route text in spec-interview skills

</details>

## Assistant _17:49:23_

<details><summary>Tool calls</summary>

- Bash: Check route text in codex spec-interview skill

</details>

## Assistant _17:49:27_

The skill file was changed by the refactor. The test expects `"Treat \`$roadmap\` as the default next route after a completed or updated spec"` but now the text says `"Treat \`$research-roadmap --post-spec\` as the primary next route after a completed or updated spec when research gaps exist, and \`$roadmap\` as the default when research is current."` Let me update the test.

## Assistant _17:49:27_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:49:33_

I need to update the spec-interview test. The test checks that the skill files contain the route text and that the setup routes to `$roadmap`. Both need updating since the route is now `$research-roadmap --post-spec`.

## Assistant _17:49:34_

<details><summary>Tool calls</summary>

- Bash: Check claude spec-interview skill route text

</details>

## Assistant _17:49:38_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:49:41_

Now I also need to update the route assertions in this test. The setup now routes to `$research-roadmap --post-spec`, and the test fixture output still says `$roadmap`. Let me update the fixture output to match, and update the route assertions.

## Assistant _17:49:49_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer1/bench-setups.test.ts`

</details>

## Assistant _17:49:53_

<details><summary>Tool calls</summary>

- Bash: Re-run tests after fixes

</details>

## Assistant _17:49:59_

All tests pass. Let me run the full verification.

## Assistant _17:50:01_

<details><summary>Tool calls</summary>

- Bash: Final verification: coverage matrix + stale reference check

</details>

## Assistant _17:50:04_

All checks pass. Let me commit and push.

## Assistant _17:50:04_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _17:50:05_

<details><summary>Tool calls</summary>

- Bash: Show diff summary

</details>

## Assistant _17:50:05_

<details><summary>Tool calls</summary>

- Bash: Show recent commits

</details>

## Assistant _17:50:11_

<details><summary>Tool calls</summary>

- Bash: Commit benchmark updates

</details>

## Assistant _17:50:14_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _17:50:25_

Done. All benchmark coverage is aligned with the prototype-first pipeline refactor:

- **Renamed**: `ux-variation` → `ux-variations`, `ui-consolidate` → `consolidate-variations` across all coverage arrays and test setups
- **Added**: `prototype` skill with hub page output, fixture files, and `$uat --variant-evaluation` routing
- **Removed**: `prototypeFirstProductGateCriterion` and all 5 references (prototype work is now an explicit upstream skill, not a gate criterion on downstream skills)
- **Updated**: `spec-interview` routing from `$roadmap` → `$research-roadmap --post-spec`, plus aligned test assertions with the refactored skill contracts
- **Updated**: tier1 prompts/fixtures for `roadmap`, `plan-phase`, `feature-interview` to reference consolidated prototypes instead of Phase 0 language

Coverage matrix valid (156 skills), all layer1 tests passing.

## User _17:50:53_

<command-message>ship</command-message>
<command-name>/ship</command-name>

## User _17:50:53_

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

## Assistant _17:51:01_

Working tree is clean with no unpushed commits — nothing to ship. Let me check task state and plan the next step.

## Assistant _17:51:02_

<details><summary>Tool calls</summary>

- Bash: Check for task files

</details>

## Assistant _17:51:05_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _17:51:08_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _17:51:11_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _17:51:14_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _17:51:23_

This todo file has a lot of completed interrupt tasks. Let me find where the actual current uncompleted work is.

## Assistant _17:51:23_

<details><summary>Tool calls</summary>

- Bash: Find uncompleted items in todo

</details>

## Assistant _17:51:27_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _17:51:32_

Now I understand the project state. The current phase is Phase 41 — Remaining Skill Benchmark Result Coverage, with Batch 41.1 as the next uncompleted batch. Let me also check the most recent interrupt task — the prototype-first pipeline refactor benchmark update we just shipped.

The work we just did (benchmark coverage alignment for the prototype-first pipeline refactor) was an interrupt task that isn't recorded in `tasks/todo.md` or `tasks/history.md`. Let me update both and ship.

## Assistant _17:51:33_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _17:51:36_

Now let me add the interrupt task record to todo.md and history.md, then check for the Skills Showcase freshness.

## Assistant _17:51:37_

<details><summary>Tool calls</summary>

- Bash: Check if any skill/pack files changed in last commit

</details>

## Assistant _17:51:41_

No showcase refresh needed. Now update task docs.

## Assistant _17:51:57_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _17:52:03_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _17:52:06_

Now update the baseline count in todo.md since we went from 152 → 156 skills.

## Assistant _17:52:07_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _17:52:11_

<details><summary>Tool calls</summary>

- Bash: Commit and push task doc updates

</details>

## Assistant _17:52:14_

Now let me check deploy contract and proceed to planning.

## Assistant _17:52:16_

<details><summary>Tool calls</summary>

- Bash: Check for deploy contract

</details>

## Assistant _17:52:23_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/deploy.md`

</details>

## Assistant _17:52:30_

Deploy contract exists, but this change only touched test files — no showcase app code or generated data changed. The deploy would be a no-op. Let me skip it and move to planning.

Deploy skipped: only test harness files changed, no app or generated data modifications.

The next uncompleted work is **Batch 41.1** — benchmark the remaining first batch of skills. Let me set up the plan-mode settings and write the next-step plan.

## Assistant _17:52:30_

<details><summary>Tool calls</summary>

- Bash: Check settings.local.json

</details>

## Assistant _17:52:34_

Settings are already correct. Now let me enter plan mode.

## Assistant _17:52:34_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _17:52:39_

**Next work:** Batch 41.1 — benchmark remaining first batch of skills (`targeted-skill-builder`, `affected`, and recompute queue after prototype-first refactor changed skill count from 152 → 156).

**Recommended next command:** `/run`

## Assistant _17:52:39_

<details><summary>Tool calls</summary>

- EnterPlanMode

</details>

## Assistant _17:52:43_

This is a pass-through to present the approval UI for the next step already planned in `tasks/todo.md`. The next work is Batch 41.1 of Phase 41.

## Assistant _17:53:02_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/bright-giggling-lampson.md`

</details>

## Assistant _17:53:05_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/.claude/plans/bright-giggling-lampson.md`

</details>

## Assistant _17:53:12_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/bright-giggling-lampson.md`

</details>

## Assistant _17:53:15_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _18:05:59_

[Request interrupted by user for tool use]
