# rename-concept-exploration-skill

| Field | Value |
|-------|-------|
| **Date** | 2026-05-27 19:34:17 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `b15c5218-8a2a-4a98-9815-56cc47dbfc2e` |
| **Entrypoint** | cli |
| **Version** | 2.1.152 |

---

## User _19:34:17_

Implement the following plan:

# Rename `concept-exploration` → `idea-scope-brief`

## Context

The user wants to rename the `concept-exploration` skill to `idea-scope-brief` across the entire repo — both claude and codex variants, plus all references. The description should shift to "scope" language. The skill is at v0.4 (claude) / v0.4 (codex).

## Approach

This is a directory rename + find-and-replace. No version bump — this is a rename/refactor, not a behavioral change (per skill versioning rules in CLAUDE.md).

### Step 1: Rename directories

```
git mv global/claude/concept-exploration global/claude/idea-scope-brief
git mv global/codex/concept-exploration global/codex/idea-scope-brief
```

### Step 2: Update SKILL.md frontmatter (both claude and codex)

- `name: concept-exploration` → `name: idea-scope-brief`
- `description:` → "Shape a rough product or project idea into a scoped brief before ICP, market research, specifications, UX, UI, or implementation planning"

### Step 3: Update SKILL.md body references

- Claude SKILL.md heading: `# Concept Exploration` → `# Idea Scope Brief`
- Codex SKILL.md heading + invocation: `# Concept Exploration` → `# Idea Scope Brief`, `$concept-exploration` → `$idea-scope-brief`
- Both: any `pipeline_stage: concept-exploration` references → `pipeline_stage: idea-scope-brief`
- Both: any `/concept-exploration` or `concept-exploration` self-references in routing text

### Step 4: Update CHANGELOG.md (both claude and codex)

- Header: `# concept-exploration Changelog` → `# idea-scope-brief Changelog`

### Step 5: Update all repo-wide references

Pattern: replace `concept-exploration` with `idea-scope-brief` in these files:

- `tests/layer1/product-path-manifest.test.ts` (lines 12-13)
- `tests/harness/bench-coverage.ts` (lines 40, 221)
- `tests/layer4/setups/tier23-global-workflows.setup.ts` (lines 486-490)
- `apps/skills-showcase/src/showcase/tui/workflow-data.ts`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `README.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/lessons.md`
- Benchmark files: `benchmark/test-concept-exploration-*.md` (rename files too)

### Step 6: Update codex agents YAML

- `global/codex/idea-scope-brief/agents/openai.yaml` — update any name references inside

### Step 7: Verify

- `grep -r "concept-exploration" .` should return zero hits (excluding `.git/`)
- Run existing tests if applicable: `npx vitest run tests/layer1/product-path-manifest.test.ts`

### Step 8: Commit and push

Single commit: `rename: concept-exploration → idea-scope-brief`


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/f7b76acd-46e5-4c28-aee7-d38e354175d6.jsonl

## Assistant _19:34:24_

I'll start by verifying the directories exist and then execute the rename plan.

## Assistant _19:34:25_

<details><summary>Tool calls</summary>

- Bash: Check concept-exploration directories exist

</details>

## Assistant _19:34:26_

<details><summary>Tool calls</summary>

- Bash: Find all files referencing concept-exploration

</details>

## Assistant _19:34:30_

Lots of files to update. Let me start with the directory renames and then do bulk find-and-replace.

## Assistant _19:34:31_

<details><summary>Tool calls</summary>

- Bash: Rename both skill directories

</details>

## Assistant _19:34:32_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:32_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:35_

Directories renamed. Now I'll update both SKILL.md files and then do the bulk replacement across all other files.

## Assistant _19:34:37_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:38_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:39_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:40_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:42_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:43_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:44_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:45_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/idea-scope-brief/SKILL.md`

</details>

## Assistant _19:34:47_

Now let me update the CHANGELOG.md files and do the bulk sed replacement across all other files.

## Assistant _19:34:47_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/idea-scope-brief/CHANGELOG.md`

</details>

## Assistant _19:34:48_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/idea-scope-brief/CHANGELOG.md`

</details>

## Assistant _19:34:49_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/codex/idea-scope-brief/agents/openai.yaml`

</details>

## Assistant _19:34:52_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/idea-scope-brief/CHANGELOG.md`

</details>

## Assistant _19:34:53_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/idea-scope-brief/CHANGELOG.md`

</details>

## Assistant _19:34:53_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/idea-scope-brief/CHANGELOG.md`

</details>

## Assistant _19:34:55_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/codex/idea-scope-brief/agents/openai.yaml`

</details>

## Assistant _19:34:58_

Now let me do the bulk replacement across all remaining files. I'll use sed for the large batch of files, then rename the benchmark files.

## Assistant _19:35:00_

<details><summary>Tool calls</summary>

- Bash: List remaining files needing replacement

</details>

## Assistant _19:35:05_

<details><summary>Tool calls</summary>

- Bash: Replace concept-exploration with idea-scope-brief in all remaining files

</details>

## Assistant _19:35:10_

Now let me also replace "Concept Exploration" (title case) references across files.

## Assistant _19:35:11_

<details><summary>Tool calls</summary>

- Bash: Find remaining Concept Exploration title case references

</details>

## Assistant _19:35:14_

<details><summary>Tool calls</summary>

- Bash: Replace title-case references

</details>

## Assistant _19:35:19_

Now rename the benchmark files.

## Assistant _19:35:19_

<details><summary>Tool calls</summary>

- Bash: Check benchmark files to rename

</details>

## Assistant _19:35:22_

<details><summary>Tool calls</summary>

- Bash: Rename benchmark files

</details>

## Assistant _19:35:25_

Now let me verify no references remain.

## Assistant _19:35:26_

<details><summary>Tool calls</summary>

- Bash: Check for remaining concept-exploration references

</details>

## Assistant _19:35:26_

<details><summary>Tool calls</summary>

- Bash: Check for remaining Concept Exploration references

</details>

## Assistant _19:35:29_

There are more files to update: `scripts/upgrade-alignment-page.mjs`, `apps/skills-showcase/app/page.tsx`, and `apps/skills-showcase/src/showcase/workflows.test.tsx`. The archive files under `idea-scope-brief/archive/` I'll leave as-is since those are historical snapshots.

## Assistant _19:35:30_

<details><summary>Tool calls</summary>

- Bash: Replace in remaining non-archive files

</details>

## Assistant _19:35:36_

Wait, I need to check the scripts file more carefully — the "Concept-specific" text in the description value shouldn't change, but the key name and skill name references should.

## Assistant _19:35:36_

<details><summary>Tool calls</summary>

- Bash: Verify script replacements

</details>

## Assistant _19:35:39_

Good, the key name changed but the description content is preserved. Now let me do the final check.

## Assistant _19:35:40_

<details><summary>Tool calls</summary>

- Bash: Final check excluding archive directories

</details>

## Assistant _19:35:43_

Zero hits outside archive directories. Now let me run the test to verify.

## Assistant _19:35:43_

<details><summary>Tool calls</summary>

- Bash: Run product path manifest test

</details>

## Assistant _19:35:46_

A test failure — let me check what it expects.

## Assistant _19:35:47_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/product-path-manifest.test.ts`

</details>

## Assistant _19:35:50_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/product-path-manifest.test.ts`

</details>

## Assistant _19:35:54_

<details><summary>Tool calls</summary>

- Bash: Get detailed test failures

</details>

## Assistant _19:35:58_

These failures are pre-existing — they're about ICP and competitive-analysis skills, not about concept-exploration. Let me verify by checking if these same tests fail on the current master.

## Assistant _19:35:59_

<details><summary>Tool calls</summary>

- Bash: Check if test failures are pre-existing

</details>

## Assistant _19:36:03_

Confirmed — 3 failed, 4 passed on master too, so the failures are pre-existing. I also notice git stash pop brought the sync pack changes along. Let me check those aren't part of our rename.

## Assistant _19:36:04_

<details><summary>Tool calls</summary>

- Bash: Check sync pack changes

</details>

## Assistant _19:36:06_

<details><summary>Tool calls</summary>

- Bash: Check what changed in sync skill

</details>

## Assistant _19:36:10_

These sync pack changes are pre-existing from a prior commit, not from our rename. Let me ensure our commit only includes rename-related changes. Let me now commit everything.

## Assistant _19:36:10_

<details><summary>Tool calls</summary>

- Bash: Check recent commits

</details>

## Assistant _19:36:13_

<details><summary>Tool calls</summary>

- Bash: Stage all and count changes

</details>

## Assistant _19:36:16_

Wait — the sync pack changes and untracked files are being included. Let me check if those are from a prior dirty state and should be included or excluded.

## Assistant _19:36:17_

<details><summary>Tool calls</summary>

- Bash: Find staged files unrelated to rename

</details>

## Assistant _19:36:22_

The unrelated files are: sync pack changes, init-agentic-skills archive, and the untracked `alignment/skills-inventory.html`. Per CLAUDE.md's shipping contract ("If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker"), I'll include everything since those were already dirty. Let me commit.

## Assistant _19:36:25_

<details><summary>Tool calls</summary>

- Bash: Commit the rename

</details>

## Assistant _19:36:29_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _19:36:34_

Done. Renamed `concept-exploration` → `idea-scope-brief` across the entire repo — directories, SKILL.md frontmatter/body, changelogs, agents YAML, benchmark files, tests, docs, alignment pages, showcase apps, pack skills, and scripts. Zero remaining references outside archive snapshots. Pre-existing test failures (3 in `product-path-manifest.test.ts`) are unrelated to this rename.

## User _19:38:09_

can you plan to fix those pre-existing test failures?

## Assistant _19:38:13_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _19:38:15_

<details><summary>Tool calls</summary>

- EnterPlanMode

</details>

## Assistant _19:38:20_

Let me explore the failing tests to understand what they expect and what the actual skill files contain.

## Assistant _19:38:29_

<details><summary>Tool calls</summary>

- Agent: Explore failing test expectations

</details>

## Assistant _19:39:12_

Good findings. The core question is whether to fix the tests or the skills. Let me check which direction is correct — the skills were updated to use `active_paths` (plural) intentionally in v0.4, so the tests are likely stale.

## Assistant _19:39:13_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/product-path-manifest.test.ts`

</details>

## Assistant _19:39:16_

<details><summary>Tool calls</summary>

- Bash: Check ICP skill active_path usage

</details>

## Assistant _19:39:17_

<details><summary>Tool calls</summary>

- Bash: Check competitive-analysis skill content

</details>

## Assistant _19:39:20_

Now I have the full picture. Let me read the competitive-analysis codex variant to confirm it matches.

## Assistant _19:39:21_

<details><summary>Tool calls</summary>

- Bash: Check codex competitive-analysis

</details>

## Assistant _19:39:25_

Now I see the issue clearly. The tests use stale regexes that expect singular `active_path` field references, but the skills were updated to use plural `active_paths`. The skills are correct (they normalize singular→plural). The tests need updating. Let me also check the `## Implications for Deferred Product Paths` issue — it's actually in the output section of the SKILL.md, not as a standalone heading.

## Assistant _19:39:26_

<details><summary>Tool calls</summary>

- Bash: Check if section heading exists literally

</details>

## Assistant _19:39:30_

Wait — that heading IS present. Let me re-check why the test fails then. The `toContain` should match a substring...

## Assistant _19:39:30_

<details><summary>Tool calls</summary>

- Bash: Check exact text match

</details>

## Assistant _19:39:34_

OK so `## Implications for Deferred Product Paths` IS in the content (as inline text), so `toContain` should match it. The test must fail on the regex assertion at line 90 *before* reaching line 91. Let me confirm by running the test with verbose output.

## Assistant _19:39:36_

<details><summary>Tool calls</summary>

- Bash: Get competitive analysis failure detail

</details>

## Assistant _19:39:41_

Now I see the full picture. The tests have 3 failures, all due to stale regex patterns expecting singular `active_path` when the skills now use `active_paths`. The `## Implications for Deferred Product Paths` content IS present. Let me also check the research-roadmap failure.

## Assistant _19:39:42_

<details><summary>Tool calls</summary>

- Bash: Check research-roadmap content

</details>

## Assistant _19:39:46_

<details><summary>Tool calls</summary>

- Bash: Check exact phrase match

</details>

## Assistant _19:39:50_

<details><summary>Tool calls</summary>

- Bash: Check research-roadmap queue assertion

</details>

## Assistant _19:39:55_

So the research-roadmap test (test 3) fails because the SKILL.md doesn't contain the exact phrases "show active and deferred product paths" or "only for `active` or `promoted` paths". The content is there conceptually but with different wording.

Now I have enough to write the plan. The fix is to update the 3 test regexes/assertions to match the actual (correct) wording in the skill files.

## Assistant _19:40:09_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/serialized-waddling-manatee.md`

</details>

## Assistant _19:40:11_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/.claude/plans/serialized-waddling-manatee.md`

</details>

## Assistant _19:40:19_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/serialized-waddling-manatee.md`

</details>

## Assistant _19:40:22_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _19:40:25_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## Assistant _19:41:10_

Good question. These tests verify that specific SKILL.md files contain certain phrases about the product-path manifest contract (how skills interact with `research/.progress.yaml`). They're a form of "documentation contract test" — ensuring skills don't silently drop required instructions about how to handle active/deferred product paths.

Whether they're *necessary* depends on how much you trust manual review vs. automated checks for skill content. The tradeoff:

- **Keep them (updated):** They catch regressions if a skill rewrite accidentally drops the manifest integration instructions. But they're brittle — any rewording breaks them, as we just saw.
- **Delete them:** The skills are the source of truth. If a skill drops manifest handling, that's a behavioral issue caught during use, not a string-matching issue. These tests add maintenance burden without testing real behavior.

I'd lean toward deleting the 3 failing tests and keeping the 4 passing ones (which check broader structural things like schema fields and terminology). But it's your call — want me to delete the 3 failing tests, fix them, or drop the whole file?

## User _19:42:16_

what are the best way to test these skills? The benchmark test suite instead?

## Assistant _19:42:30_

There are roughly two tiers of testing in this repo:

**Layer 1 (static content tests)** — what's failing now. These grep SKILL.md files for required phrases. They're cheap and fast but brittle: any rewording breaks them, and they don't test whether the skill actually *does* the thing, just whether the instructions *mention* it.

**Benchmark tests (`/benchmark-test-skill`)** — these actually invoke the skill, feed it a scenario, and grade the output against expectations. They test real behavior: did the skill produce a manifest entry? Did it scope to the active path? Did the output contain the right sections? Much higher signal, but slower and costs API tokens.

For contracts like "ICP must write `active_paths` to the manifest" or "competitive-analysis must scope to the active path," benchmark tests are the right layer. A benchmark scenario can verify the skill actually reads `.progress.yaml` and produces correct output — something no amount of string-matching on SKILL.md can guarantee.

My recommendation: **delete the 3 failing layer1 tests** (the 4 passing ones that check schema field names and terminology are still useful as a cheap lint). If you want the behavioral contracts covered, that's a `/benchmark-test-skill` task for icp, competitive-analysis, and research-roadmap — but that's separate work. Want me to just delete the 3 failing tests for now?

## User _19:43:46_

yes please

## Assistant _19:43:49_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tests/layer1/product-path-manifest.test.ts`

</details>

## Assistant _19:43:59_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer1/product-path-manifest.test.ts`

</details>

## Assistant _19:44:41_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tests/layer1/product-path-manifest.test.ts`

</details>

## Assistant _19:45:42_

<details><summary>Tool calls</summary>

- Bash: Run tests to verify all pass

</details>

## Assistant _19:45:46_

All 4 remaining tests pass. Now let me commit and push.

## Assistant _19:45:48_

<details><summary>Tool calls</summary>

- Bash: Commit test cleanup

</details>

## Assistant _19:45:51_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _19:45:55_

Removed the 3 brittle string-matching tests. The 4 remaining tests (schema fields, terminology, platform candidates, feature/UX route experiments) all pass.
