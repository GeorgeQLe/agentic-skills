# Mobile Ideas Return Assessment

Date: 2026-05-03
Target repo: `/Users/georgele/projects/mobile/dev/mobile-ideas`
Method: `$analyze-sessions` over full local Claude/Codex histories plus repository artifact inventory.

## Executive Verdict

The work produced a real planning asset, but the return is uneven.

High return:
- 1,000 app specs exist in the canonical spec store.
- 1,000 downstream GitHub repo manifest rows are checked and recorded as private, non-empty, and seeded with README/source-spec evidence.
- 280 specs are implementation-ready public-source V1.
- The repo has 162 commits over 14 active commit days, clean working tree, repeatable readiness/seeding scripts, and strong legal/non-affiliation guardrails.

Low return:
- 720 specs remain Draft/non-ready, with 2,160 source-discovery placeholder rows.
- The 1,000 downstream repos are mostly scaffold/planning inventory, not product progress.
- Local downstream clone count is 132, which suggests the repo-fleet is too large for manual follow-through without tighter selection gates.
- Session history shows many repeated orchestration prompts and approvals instead of a single resumable controller.

Best interpretation: `mobile-ideas` has become a broad spec-store and private repo-fleet seed factory. It has not yet converted proportionally into buildable apps or validated product bets.

## Evidence Summary

History parsed:
- `~/.codex/history.jsonl`: 4,338 lines.
- `~/.claude/history.jsonl`: 8,437 lines.
- `~/.codex/sessions/**/*.jsonl`: 1,695 files, 561,190 lines.
- Scoped `mobile-ideas` compact user prompts: 272 across 104 sessions.
- Source split: Codex 219 prompts, Claude 53 prompts.
- Date range: 2026-04-16 through 2026-05-03.

Repository outputs:
- 162 commits from 2026-04-16 through 2026-05-03.
- 1,000 numbered spec files under `specs/batch-*`.
- 1,046 total spec Markdown files including batch READMEs.
- 116 docs/task Markdown files.
- 1,000 checked downstream manifest rows, 0 unchecked.
- 280 implementation-ready specs, 720 Draft/non-ready specs.
- 2,160 source-discovery placeholder rows across 720 files.
- Current `mobile-ideas` working tree is clean.

Commit shape:
- 72 `feat` commits.
- 72 `docs` commits.
- 16 `chore` commits.
- 2 `fix` commits.

## Repeated Prompt Patterns

| Pattern | Count | Assessment |
|---|---:|---|
| `$run` invocation | 56 | The phase runner helped, but each micro-step still required a new prompt/session. |
| `y` approval | 35 | Approval friction became a measurable tax. This should be collapsed for pre-approved serial work. |
| "let's do more downstream work on the different apps that were referenced in this repo" | 23 | Good intent, but too vague for selecting high-return downstream work. |
| "Continue the mobile clone seeding/downstream workflow..." | 16 | Strong candidate for a dedicated resumable fleet command. |
| `continue` | 11 | Indicates state was carried by agent memory/context rather than a durable control plane. |
| `/ship` | 6 | Shipping existed, but repeatedly as manual ceremony. |
| `$project-fleet --execute` | 3 | Correct direction, under-used relative to the amount of repeated custom orchestration. |

Representative examples from history:
- "I'd like for us to brainstorm and create 100 mobile app clone ideas..."
- "can we run through 5 parallel agents to create technical specs and run through all 100?"
- "Continue the mobile clone seeding/downstream workflow..."
- "let's do more downstream work on the different apps that were referenced in this repo"
- "$project-fleet --execute"

## Return On Effort

The highest-return work was the work that created durable machinery:
- `scripts/seed-downstream-batch.mjs`
- `scripts/check-implementation-readiness.mjs`
- downstream templates
- manifest evidence logs
- readiness gate
- category-batch promotion process

The lowest-return work was breadth without decision compression:
- Extending to 1,000 ideas before enough downstream apps had shipped.
- Seeding 1,000 private repos while only 280 specs were implementation-ready.
- Repeatedly asking agents to "continue" instead of using a ledger-backed queue with explicit next eligible item, stop condition, and outcome recording.
- Advancing many downstream repos through planning docs while product validation remained unclear.

The project got a lot of structured inventory. It got much less validated product surface.

## What To Do Differently

1. Add a portfolio scoring gate before more breadth.
   Score each app on build leverage, legal/provider risk, data availability, implementation cost, demo value, and reusable platform components. Keep only the top 10-20 active.

2. Replace repeated "continue seeding/downstream" prompts with a resumable controller.
   The command should read the manifest, rate-limit state, readiness status, and downstream todo state, then perform the next safe batch until a real blocker appears.

3. Separate spec-store completion from product-building.
   Treat IDs 281-1000 readiness promotion as backlog maintenance, not the main value path. Product value comes from selecting a narrow tranche and building.

4. Require "return evidence" for each downstream repo before further planning.
   A repo should not receive more planning passes unless it has a clear next build milestone, a runnable stack, and a reason it is in the active portfolio.

5. Convert manual approval loops into standing policy.
   For safe, private, serial, documented seeding with existing scripts and clean prechecks, the user should not need to type `y` dozens of times.

## Ranked Automations

| Rank | Pattern | Frequency | Type | Suggested Name | Description |
|---:|---|---:|---|---|---|
| 1 | Continue seeding/downstream workflow | 16 long prompts plus related `continue` prompts | Skill | `$mobile-fleet` | Resumable controller for seeding windows, readiness promotion, downstream selection, blocker logging, and clean-boundary stopping. |
| 2 | `$run` plus `y` approval loop | 91 combined prompts | Standing instruction / skill contract | `$run --auto-approved-safe-step` | Treat routine already-planned safe steps as approved when invoked directly, while preserving blockers for destructive/external-risk actions. |
| 3 | "more downstream work" selection | 23 prompts | Agent / controller | `downstream-selector` | Scores repos, chooses the highest-return active app, and refuses low-value planning churn. |
| 4 | Readiness promotion slices | recurring phase work | Skill | `$spec-readiness-batch` | Promotes a category batch with exact URL checks, placeholder audit, category risks, and queue update in one command. |
| 5 | Repo fleet evidence logging | repeated manual evidence | Plugin/integration | `github-private-fleet-ledger` | Uses GitHub API state to verify private repos, root commits, source specs, and manifests without repeated bespoke shell checks. |

## Highest-Impact Changes

Top 5 by avoided manual prompts:
- `$run` safe-step approval policy: avoids roughly 35 explicit `y` prompts and many duplicate run/approval turns.
- `$mobile-fleet`: avoids the 16 long seeding/downstream prompts and converts fragile prose into state-machine behavior.
- `downstream-selector`: avoids 23 vague "do more downstream work" prompts by forcing ranked selection.
- `$spec-readiness-batch`: collapses category promotion, readiness audit, and task-doc update into one repeatable workflow.
- GitHub fleet ledger: removes repeated repo visibility/root-commit/source-spec checks from the conversation loop.

## Recommended Operating Model

For future large fleet work:
- Stop expanding at 100 until at least 3 apps have runnable MVPs.
- Maintain three queues only: `candidate`, `active-build`, `archive`.
- Cap `active-build` at 5 repos.
- Do not seed a downstream repo until its source spec is implementation-ready, unless the repo is explicitly tagged `scaffold-only`.
- Every session should advance one measurable asset: readiness count, runnable app milestone, verified repo state, or blocker reduction.

Recommended next skill: `$project-fleet --plan`
