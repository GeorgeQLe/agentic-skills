# Session Workflow Quality Audit

Generated: 2026-05-03T21:55:18-04:00

## Inputs
- codex_rollout_files: 1704
- claude_history: /Users/georgele/.claude/history.jsonl
- codex_history: /Users/georgele/.codex/history.jsonl

## Overview Stats
- Total normalized user messages: 13142
- Total sessions: 4794
- Date range: 2025-12-10T16:50:51.393000+00:00 to 2026-05-04T01:49:56.136000+00:00

## Source Comparison
- claude: 8475 messages, 3129 sessions
- codex: 4667 messages, 1665 sessions

## Recent Trend
- 2025-12: Claude 190, Codex 0
- 2026-01: Claude 1309, Codex 89
- 2026-02: Claude 1786, Codex 0
- 2026-03: Claude 2544, Codex 178
- 2026-04: Claude 2468, Codex 4129
- 2026-05: Claude 178, Codex 271

## Top Projects
- apps/bismarck-v0.4: 1440 (11.0%)
- poke/monorepo: 1294 (9.8%)
- experimental/metternich-engine: 1101 (8.4%)
- apps/lexcorp-war-room: 949 (7.2%)
- apps/bismarck-v0.3: 929 (7.1%)
- apps/loadoutworks.com: 839 (6.4%)
- tools/agentic-skills: 459 (3.5%)
- apps/lexcorp-sdk: 416 (3.2%)
- apps/lexcorp-landing: 353 (2.7%)
- apps/pitwall: 350 (2.7%)
- apps/b4: 345 (2.6%)
- apps/claude-usage-review: 338 (2.6%)
- dev/mobile-ideas: 285 (2.2%)
- dev/iphone-emulator: 284 (2.2%)
- tools/claude-skills: 235 (1.8%)

## Category Counts
- skills_workflow: 6049 (46.0%)
- uncategorized: 4564 (34.7%)
- ship_commit_push: 2863 (21.8%)
- plan_spec_roadmap: 1681 (12.8%)
- run_execute_phase: 1464 (11.1%)
- verification_tests: 761 (5.8%)
- frontend_app: 698 (5.3%)
- review_audit: 535 (4.1%)
- quality_slop: 91 (0.7%)
- correction_feedback: 84 (0.6%)

## Skill Command Counts
- ship: 1239
- clear: 734
- ship-end: 233
- run: 184
- ship-then-plan: 161
- sync: 95
- usage: 88
- investigate: 59
- plan-interview: 57
- roadmap: 55
- resume: 50
- plan-phases: 36
- spec-interview: 33
- plan-phase: 30
- guide: 28
- pack: 20
- delegate: 20
- analyze-sessions: 17
- run-step: 17
- spec-drift: 16
- api: 15
- deploy: 14
- opt: 14
- model: 13
- install-workflow-orchestration: 13
- reconcile-dev-docs: 13
- src: 12
- brainstorm: 12
- workflow: 12
- competitive-analysis: 11

## Repeated Prompt Patterns
- 1220x exact: /ship
- 1014x exact: [$run](/users/georgele/projects/tools/agentic-skills/global/codex/run/skill.md)
- 733x exact: /clear
- 222x exact: /ship-end
- 161x exact: /ship-then-plan
- 160x exact: continue
- 155x exact: yes please
- 146x exact: commit and push
- 141x exact: /run
- 118x exact: [$run](/users/georgele/projects/tools/agentic-skills/codex/run/skill.md)
- 92x exact: /sync
- 88x exact: /usage
- 76x exact: update docs, commit and push
- 64x exact: [$ship](/users/georgele/projects/tools/agentic-skills/global/codex/ship/skill.md)
- 63x exact: implement the plan.
- 49x exact: deploy to staging
- 48x exact: [pasted text #<num> +<num> lines]
- 47x exact: /resume
- 44x exact: what's next?
- 42x exact: update docs, commit and push, plan to implement the next step
- 41x exact: update docs, commit and push, then plan to implement the next step
- 40x exact: [$guide](/users/georgele/projects/tools/agentic-skills/global/codex/guide/skill.md)
- 34x exact: implement phase <num>

## Category Examples
### correction_feedback
- "woah wait why did you make that change to the index? everything in the old code works"
- "why did we change the svgmap and imagemap in the database?"
- "can we provide support for right-side view as well? I don't think top view would be often used. I might be wrong but that's my personal feeling"
- "how can I fix this: [Pasted text #1 +44 lines]"
### frontend_app
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "have you been able to properly increate a landing page, and login interactions?"
- "can you make the component sidebar take up 40% of the space on the screen? and on mobile, it should just replace the rifle view area with the build summary remaining underneath"
### plan_spec_roadmap
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. [Pasted text #1 +312 lines]"
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "let's continue, I will add the svgs and images later, place placeholder or TODO values for now in development"
### quality_slop
- "take note that we should in the future refactor the service manager and other large files down into smaller chunks for maintanability and code quality"
- "You are an expert programmer and code architect, your job is to conduct an extensive code review of the current project with a focus on code quality, performance checks, and potential tech debt. Compile a report of your..."
- "You are an expert programmer and code architect, your job is to conduct an extensive code review of the current project with a focus on code quality, performance checks, and potential tech debt. Compile a report of your..."
- "You are an expert programmer and code architect, your job is to conduct an extensive code review of the current project with a focus on code quality, performance checks, and potential tech debt. Compile a report of your..."
### review_audit
- "we can remove the black borders we put in for debug purposes"
- "ok taking a few steps back and taking the role of experienced programmer and code architect, can you conduct an exhaustive and thorough code review of the project?"
- "review the current project and determine what's todo to fix issue wise or build feature wise"
- "can you review the claude.md and the documentation in the project and determine if the project is up to date. Then we need to make the errors that is presented to the console via our AI richer as a lot of errors are non..."
### run_execute_phase
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "can you help ensure that this project passes npm run build?"
- "can you try npm run build again?"
### ship_commit_push
- "ok can you push the changes to github with the appropriate commit message?"
- "before we continue can you push our changes to github with the appropriate commit message?"
- "can we push our changes to the database and seed if we haven't done that already?"
- "Warning Found data-loss statements: · You're about to add not-null sku column without default value, which contains 24 items · You're about to delete platform_slug column in part table with 24 items · You're about to de..."
### skills_workflow
- "/init"
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "type ZoneId = | "upper-receiver_left" | "buttstock-left" | "barrel-left" | "optic-left" | "magazine-left" | "trigger-left" | "handguard-left" | "lower-receiver-left"; interface WeaponSvgProps { selectedZone: ZoneId | nu..."
### uncategorized
- "yes please"
- "can you change the filenames to be weapon-svg.tsx, part-card.ts etc"
- "insert this in chart.tsx"
- "yes please"
### verification_tests
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "Based on your observations and the following prd, edit the claude.md and prepare a todo list that is ready for development. # Product Requirements Document (PRD) # Virtual Gunsmith / Firearm Customization Platform # Ver..."
- "can you help ensure that this project passes npm run build?"
- "can you try npm run build again?"

## Quality Signal Metrics
- verification_prompts: 761
- ship_prompts: 2863
- planning_prompts: 1681
- review_prompts: 535
- skill_prompts: 6049
- correction_prompts: 84
- quality_prompts: 91

## Derived Judgment
Short answer: the new workflows and skill usage are constraining AI slop in planning, routing, evidence capture, and repeatability, but they are not yet strong enough to constrain AI slop in implementation by default.

The current workflow appears to constrain low-quality output when it forces evidence capture, scoped execution, review, and verification before shipping. The strongest positive signal is the high volume of explicit planning, verification, audit, and skill-routing prompts. The main negative signal is procedural surface area: many prompts are about shipping, routing, and next-step repair, which can hide weak implementation quality if the gate checks only docs or command success.

The risk is not that skills inherently create more bad code. The risk is that skills can create compliant-looking work: plans, checkboxes, commits, and next commands that look rigorous while code quality is only indirectly tested. The system should therefore make code quality gates executable, diff-aware, and failure-oriented instead of primarily prose-oriented.

## Audit Of New Workflow Shape
- Recent repo work has clearly shifted toward durable workflow primitives: `run`, `ship`, `roadmap`, `research-roadmap`, `creator-media` evidence lanes, `alignment-loop`, and explicit next-step routing.
- Recent commits show the system is improving routing and workflow correctness, including no-op verification handoff fixes, variation-gate fixes, roadmap self-routing fixes, mutation routing audits, alignment-loop additions, and creator-media evidence/routing additions.
- `tasks/lessons.md` shows a real self-improvement loop. Recent lessons address dead-end handoffs, self-routing, late variation pruning, no-op verification handoffs, and final-response next-step omissions.
- Existing code-quality infrastructure is present but underused as a default ship gate. `packs/code-quality/codex/quality-sweep/SKILL.md` already audits duplication, shared types, dead code, circular dependencies, weak types, error handling, legacy paths, and stale comments. That should become part of mutation shipping, not an optional cleanup lane.

## Where Slop Is Still Getting Through
- Verification is often command-based rather than claim-based. A passing `build` or `git diff --check` does not prove the implementation matches the user intent, preserves behavior, or has meaningful edge coverage.
- Shipping is overrepresented. There are 2863 shipping/commit/push prompts versus 761 verification/test prompts. That does not prove bad shipping, but it shows the workflow pressure is toward closure.
- Skill routing can become a compliance ritual. Recommending the next command is useful, but it is not a code-quality control unless the next command is selected from evidence and failure modes.
- The current history has only 84 correction/feedback prompts and 91 explicit quality/slop prompts. Those are valuable but sparse compared with the number of implementation and shipping actions.
- Prompt examples show real correction moments, such as "woah wait why did you make that change to the index? everything in the old code works" and "why did we change the svgmap and imagemap in the database?" These are exactly the type of changes a diff-aware pre-ship review should catch before the user sees them.

## Aggressive Anti-Slop Standard
- No implementation ships without a manifest: changed files, why each file changed, user goal mapping, tests run, tests not run, known risk, and rollback note.
- No non-trivial implementation ships without a second-pass review. Use a reviewer/subagent or `expert-review`/`quality-sweep audit` depending on scope, but require an adversarial pass before `ship`.
- No feature is done until at least one negative/edge case is checked. For UI, that means responsive and state checks. For backend, that means invalid input and boundary behavior. For data migrations, that means current data compatibility.
- No generated abstraction without a reason-to-change test. The agent must say what duplication or risk the abstraction removes; otherwise it stays local and boring.
- No doc-only verification for code changes. Docs can be updated, but code changes need executable validation or an explicit, high-friction `not verified` risk entry.
- No silent scope growth. If the diff touches files outside the plan, the ship gate must call that out and justify it.
- No commit/push while unresolved unrelated tracked changes exist unless the ship manifest explicitly separates ownership and the operator accepts the boundary.

## Ranked Recommendations
| Rank | Pattern | Evidence Count | Recommendation Type | Suggested Control |
| --- | --- | ---: | --- | --- |
| 1 | Verification/test prompts | 761 | Standing instruction + skill contract | Every mutating skill must list exact changed files, exact tests, and untested risk. |
| 2 | Shipping prompts | 2863 | Ship gate | Block commit/push unless diff summary maps each changed file to user goal and verification. |
| 3 | Planning/spec prompts | 1681 | Plan quality gate | Require acceptance criteria to include negative tests and rollback/escape hatch for risky work. |
| 4 | Review/audit prompts | 535 | Agent/review lane | Run a mandatory adversarial review for non-trivial code before shipping. |
| 5 | Skill/workflow prompts | 6049 | Skill schema | Add a shared `Quality Gate` section to all implementation/shipping skills. |
| 6 | Correction prompts | 84 | Lessons loop | Convert corrections into concrete skill tests or final-response checks within 24 hours. |

## Required Workflow Changes
- Promote `quality-sweep audit` into the default pre-ship path for non-trivial code changes. Use full `quality-sweep full` only for explicit cleanup campaigns.
- Add a shared `Quality Gate` contract to `run`, `ship`, `ship-end`, `commit-and-push-by-feature`, and pack-level mutation skills.
- Make `ship` refuse to summarize only docs/tasks when source files changed. It should include code file review, test evidence, and residual risk.
- Add a lightweight script that scans a final response or ship manifest for required fields: changed files, tests, skipped tests, residual risk, next command.
- Add `user correction -> lesson -> skill/test update` enforcement. A correction should not end at `tasks/lessons.md`; the relevant skill or validation script should change when possible.
- Route implementation phases through labels: `afk`, `human-review`, or `pair`. High-risk work defaults to `human-review` even if an agent can technically implement it.
- Treat `AI slop` as a measurable class: weak types, stale comments, speculative fallback paths, broad abstractions, untested UI states, unused exports, and source changes not traceable to the user goal.

## Highest-Impact Automations
- `quality-gate` skill: diff-aware pre-ship check that inspects changed files, test coverage, risk, and claims before commit/push.
- `slop-check` review prompt or agent: asks what a rushed agent would have missed, then verifies the answer against code and tests.
- `ship` hardening: require a machine-readable ship manifest with files, purpose, tests, skipped tests, and residual risk.
- `run` hardening: require implementation steps to name concrete verification commands before edits begin.
- `lessons` enforcement: add a test/scan that fails when a correction pattern is only documented but not reflected in the relevant skill.

## Recommended Policy
Default posture should be: agents may move fast, but shipping is adversarial. The work can be autonomous; acceptance cannot be casual.

For every non-trivial mutation, require:
- `Plan`: explicit scope, non-goals, risk, and verification commands.
- `Implement`: smallest coherent diff, no opportunistic refactors.
- `Self-review`: changed-file walkthrough and `what could be wrong?` list.
- `Quality sweep`: targeted `quality-sweep audit` or equivalent code-quality lane.
- `Verification`: executable checks plus manual/visual checks where relevant.
- `Ship manifest`: commit boundary, tests, residual risk, next command.
