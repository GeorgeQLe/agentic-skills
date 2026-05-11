# Lessons

## 2026-05-11 — Review reports need remediation-ready next steps

- A `$benchmark-agent-review ship` report identified weaknesses but did not make every remediation decision definitive enough for the next operator.
- Agent-review skills should convert each material weakness into a remediation target: owning skill or harness file, exact contract or rubric gap, validation command, and recommended next route.
- Keep the output-quality verdict primary, but add a remediation plan that distinguishes skill contract fixes from benchmark rubric fixes, retained-evidence issues, and one-off run problems.
- Validate this with contract-lint coverage so future review workflows cannot stop at broad advice like "tighten the rubric" when the report found actionable output-quality issues.

## 2026-05-11 — Agent benchmark reviews judge skill outputs first

- A `$benchmark-agent-review ship` run over-focused on deterministic benchmark laxness and recommended benchmark tightening as the primary conclusion.
- `$benchmark-agent-review` should treat hard assertions and deterministic quality scores as context for triage, not as the object of review.
- Lead with the generated skill output verdict against the agent-review rubric: usefulness, specificity, validation strength, scope control, route ergonomics, absence of invented facts, and residual-risk awareness.
- Mention deterministic rubric tightening only after the output-quality judgment, and only when it would help future triage surface the same skill-output issue.

## 2026-05-11 — Preserve existing product surfaces before proposing framework migration

- A first-party newsletter capture spec initially discussed moving to a minimal app framework without first making the existing Skills Showcase site concrete.
- When a user asks to extend an existing product surface, inspect and name the current files/routes before recommending a migration or architecture change.
- Treat framework migration as a preservation refactor when the product surface already exists: port the current content, route map, data contracts, and visual system unless the user explicitly asks for a redesign.
- If a requested library stack fits poorly with the current implementation style, explain the mismatch against the existing files and frame the refactor as the smallest way to support the new capability.

## 2026-05-11 — Benchmarks must respect Claude slash and Codex dollar route conventions

- A `ship` benchmark initially treated Claude failure as a skill failure because the setup expected `$run` for both Claude and Codex.
- When a benchmark runs both agents, hard assertions and quality rubrics must use the corresponding route convention for the runner: slash commands for Claude (`/run`, `/ship`) and dollar commands for Codex (`$run`, `$ship`).
- Before diagnosing a mirrored skill as failed, compare the benchmark setup against both `global/claude/<skill>/SKILL.md` and `global/codex/<skill>/SKILL.md`; a mismatch in the harness is a test bug, not proof of a skill-contract bug.
- Add deterministic layer1 coverage for runner-specific route expectations whenever a shared setup supports both agents.

## 2026-05-11 — UI consolidation needs UAT after variants are built

- A workflow audit initially treated low `ui-consolidate` usage as a missing handoff, but the user clarified that consolidation can also be recommended too early.
- After UX/UI variants are built, route through a UAT/evaluation step before `ui-consolidate` so the user has time and structure to try each variant and form a defensible opinion.
- Variant deliverables should define how to test each option: target task, success criteria, comparison questions, evidence to capture, and what tradeoffs to notice.
- Recommend `ui-consolidate` only after evaluation evidence exists or the user explicitly says they have reviewed the variants and are ready to converge.

## 2026-05-10 — Missing injected skills may still exist in project packs

- The session skill list can omit project-local pack skills when the pack is not loaded into the active runtime context, even if the skill exists in the repository.
- When a user invokes `$<command> <arg>` and `<command>` is missing from the injected skill list, search `packs/*/{codex,claude}/<command>/SKILL.md` and project pack metadata before treating `<arg>` as the active skill.
- In this repository, `benchmark-test-skill` lives under `packs/agentic-skills-bench/` and should be resolved there before falling back to `design-system`.
- When a rule applies to both Claude and Codex command resolution, update both `CLAUDE.md` and `AGENTS.md` unless the user explicitly limits it to one agent file.

## 2026-05-10 — Benchmark rate limits are infrastructure blocks, not skill failures

- When a benchmark runner reports a rate limit, quota exhaustion, or account-capacity error, classify that run as infrastructure-blocked instead of counting it as a failed skill assertion.
- `$benchmark-test-skill <skill>` should benchmark both Claude and Codex by default so one runner's capacity or behavior does not stand in for the skill as a whole.
- Report pass rate over evaluated runs only, and separately report blocked-run counts and reasons.

## 2026-05-10 — Benchmark-test-skill means skill benchmark, not target skill execution

- `$benchmark-test-skill <skill>` belongs to the `agentic-skills-bench` pack and should run the harness verification plus benchmark extension for that skill.
- Do not interpret `$benchmark-test-skill design-system` as "run design-system in a benchmark mode" or produce app/site design-system deliverables unless the user explicitly asks for those artifacts.
- Prefer explicit command names when a workflow takes another skill name as its argument; ambiguous names make the active command and target skill easier to reverse.
- When a command composes two skill-like names, resolve the leading command first, including project-local pack skills and dirty/untracked pack additions, before applying the trailing argument as the active workflow.

## 2026-05-07 — Treat product showcases as product roadmaps, not one-off pages

- A showcase for an agentic workflow library can be a real top-of-funnel product, not a single marketing page, when the user's goal includes personal brand, distribution, community, and product proof.
- Do not defer newsletter/email capture, public GitHub proof data, or multi-page routing by default just because the first implementation can be static.
- Distinguish public/open-source proof telemetry from visitor-tracking analytics and from unrelated live product metrics; GitHub proof data can belong in MVP while live LexCorp metrics remain out of scope.
- When the user wants skill changes to keep the site current, roadmap the freshness contract explicitly: generated data, validation, and skill-changing workflow prompts all need to agree.

## 2026-05-07 — Agent-team parallel work needs branch and PR isolation

- A direct-to-primary rule is correct for sequential work, but it becomes unsafe when multiple write agents work in parallel from one base.
- When a phase uses `agent-team` write lanes, each lane needs its own non-primary GitHub branch, commit evidence, pushed branch, and PR URL before returning.
- Planning skills must include a consolidation/PR review step after parallel lane completion and before final validation, shipping, or integration into the primary branch.
- Treat branch-backed lane PRs as the explicit exception to the normal direct-to-primary workflow; do not let broad feature-branch habits leak back into serial work.

## 2026-05-05 — Avoid singular/plural skill name ambiguity

- Splitting one workflow into broad and focused commands can create a near-duplicate naming trap when the only visible difference is singular versus plural.
- When users identify a likely command-selection ambiguity, prefer a semantically distinct name for the focused workflow instead of a one-letter variant.
- For session analysis, keep `$analyze-sessions` as the broad cross-session trend command and use `$session-triage` for one immediate issue, correction, repo/session incident, or skill failure.

## 2026-05-05 — Keep Claude and Codex agent config blocks separate

- A config conflict was easy to underweight because Codex reads `AGENTS.md`, not `CLAUDE.md`, but the provisioning workflow had been copying Claude-oriented subagent guidance into both files.
- When auditing or generating agent config, evaluate each file according to the agent that consumes it instead of assuming mirrored instructions are harmless.
- Keep Codex `AGENTS.md` subagent guidance constrained by active Codex tool permissions; Claude-specific subagent defaults belong only in `CLAUDE.md`.

## 2026-05-05 — Next-step skill routing must validate pack installation

- A next-step routing answer initially cited the universal contract but did not check for existing skill contracts that still recommend pack-local skills directly.
- When auditing or writing next-step recommendations, validate the target skill against the active platform and `.agents/project.json.enabled_packs`, not only against repository-wide skill existence.
- If a target skill lives in a pack that is not guaranteed active, the recommending skill must either check the pack is enabled before recommending it or recommend installing/enabling the pack first, e.g. `$pack install <pack>` / `/pack install <pack>`.
- Cross-pack examples, routing tables, and "default recommendation" lines need the same fallback language because agents often copy them into final responses.

## 2026-05-04 — Remotion pack scope includes format, script, and build

- A Remotion pack split was initially scoped only to `video-build`, but the user clarified that `youtube-format-research`, `video-script`, and `video-build` belong together.
- When separating a domain-specific pack from a broader workflow pack, include the full adjacent workflow chain, not just the terminal implementation skill.
- For Remotion work, treat `youtube-format-research -> video-script -> video-build` as the cohesive pack boundary unless the user explicitly asks for a narrower split.

## 2026-05-04 — Use repo-managed skill creation for agentic-skills contributions

- `$create-local-skill` creates user-local skills under `~/.codex/skills` or `~/.claude/skills`; it is not the right workflow when the user wants a skill added to this `agentic-skills` repository.
- When the user is working inside `agentic-skills` and asks to create a skill for the library, use `$create-agentic-skill` and create it under `global/codex/<name>/` and/or `global/claude/<name>/`, following repository conventions.
- Before invoking or following a skill-creation workflow, distinguish "personal/local skill" from "repo-managed global skill" and state the target path.
- If the wrong target is created, remove the mistaken local copy after preserving any useful draft content in the intended repo path.

## 2026-05-04 — Human-only blockers should not route back to run

- A handoff identified a manual overlay playtest as next work but still recommended `/run`, which made an external human-only validation look agent-executable.
- When next work requires human-only browser/OS interaction, real device access, authenticated dashboards without a reliable CLI/API path, or explicit sign-off, record it in `tasks/manual-todo.md` as a blocking manual task when it blocks the next automated step.
- The recommended next route should be `$guide`, a Claude-guided manual step, or an explicit manual-blocker handoff, not `/run` or `$run`.
- Keep the next work item primary; command routing should serve the work classification rather than mechanically matching the current skill invocation.

## 2026-05-04 — Exhausted queues route to discovery, not none

- A completed roadmap plus current documentation scan allowed `Recommended next command: none`, leaving a repo in a dead-end handoff even though candidate new-phase discovery was still possible.
- Scanner and shipping skills should reserve `none` for explicit user-requested pause, park, archive, or wait states.
- When implementation phases, documentation work, and promotable advisory items are all exhausted, recommend `$brainstorm` to discover candidate next phases before formal `$spec-interview` work.
- Keep this rule in both output templates and next-step routing sections so final responses cannot bypass it.

## 2026-05-04 — Distinguish workflow policy from existing orchestration skills

- A recommendation for a "workflow" around `mobile-ideas` sounded like inventing a new skill even though `$project-fleet` already exists.
- When an orchestration skill already exists, frame recommendations as project-specific policy, queues, scoring gates, and defaults that the existing skill should consume.
- Say "extend/configure `$project-fleet` for this fleet shape" instead of implying a separate new controller unless there is a clear missing primitive.
- For repeated fleet work, recommend durable playbooks/config/contracts first, then skill changes only where the current skill cannot read or enforce those contracts.

## 2026-05-03 — Verification gates should not become no-op plan handoffs

- A clean validation gate was followed by a separate "refactor if validation exposes drift" step, which forced Claude `/ship` to open a clear-context plan even though no remediation was expected.
- Keep verification mandatory, but fold conditional cleanup into the active Green/validation step unless there is known concrete remediation work.
- If validation passes and the expected source changes are none, record the no-op result, mark the gate complete, and advance to the next substantive step.
- Enter plan mode only when verification discovers failures, drift, warnings needing judgment, or a non-trivial remediation plan.

## 2026-05-03 — Variation pruning belongs before full specification

- `$ux-variation` surfaced "remove, merge, make more extreme, or add a fourth" only after presenting three fully framed variants, which made the checkpoint feel like late-stage rework instead of concept selection.
- For interrogation skills that generate alternatives, split the flow into two gates: first present lightweight concept candidates for keep/remove/merge/extreme/add decisions, then fully specify only the approved set.
- Wording should ask for a bounded adjustment action and optional rationale, not combine several vague decisions into one prose question.
- Do not say "before I commit" or imply implementation/build commitment when the actual next step is writing a planning deliverable.

## 2026-05-02 — Scanner skills must not route to themselves

- A `$roadmap` run could end by recommending `$roadmap` again because final routing chose a matching command without a self-recursion guard.
- For scanner/router skills, explicitly forbid recommending the same skill as the next command after it has updated its queue.
- If the first unchecked queue item is self-referential, treat it as stale task-doc state and route to `$reconcile-dev-docs fix tasks` (or the Claude slash equivalent) with evidence.
- Also fix the queue-writing source: a scanner should not write itself into its own priority queue. For `$roadmap`, missing-roadmap states must be handled by State B in the same run or by queueing the missing upstream input, never by queueing `$roadmap`.
- When a completed roadmap has a newer substantive spec, `$roadmap` must extend the roadmap in the same run and seed the new phase with `$plan-phase N`; it must not write a `$roadmap` queue item asking a later run to do that extension.

## 2026-05-01 — Use local venv for YouTube transcript dependency

- A `$youtube-audit` prerequisite failure under Homebrew Python was handled with a system-Python install recommendation, which conflicts with the skill's PEP 668-safe instructions.
- When `youtube_transcript_api` is missing, create or reuse project `.venv` and install with `.venv/bin/python -m pip install youtube-transcript-api`.
- Do not recommend `python3 -m pip install youtube-transcript-api` against Homebrew/system Python, and do not recommend `--break-system-packages`.

## 2026-05-01 — Put required handoffs in Output, not only routing notes

- Devtool pack skills had `## Next-Skill Routing` sections, but users still saw runs that did not recommend the next skill.
- When a skill must emit a handoff, state the requirement in `## Output` and specify the exact final-response shape, then keep the routing section as the decision logic.
- Validate both presence of the routing logic and presence of the final-output phrase across mirrored Claude/Codex skills.

## 2026-04-30 — Completed-roadmap scans must be idempotent

- `$roadmap` and `/roadmap` previously re-queued research-roadmap whenever all implementation phases were complete, even after research-roadmap had already written an active or current `## Priority Documentation Todo`.
- When one planning skill queues another one-shot scan, teach the caller to recognize the callee's completion surface before recommending it again.
- For completed implementation roadmaps, route to the first unchecked documentation item when the documentation queue exists, and only queue research-roadmap when no current documentation queue/result exists.

## 2026-04-30 — Codex `$run` plans are implicitly approved

- Session history showed the user consistently accepted `$run` plans with bare approvals (`y`, `yes`, `yes please`) and did not reject normal `$run` execution plans.
- Treat a `$run` invocation as approval for the next planned step or scoped phase after presenting the plan. Do not add a second routine approval question.
- Still ask explicitly for separate safety decisions: destructive commands, production deploys, paid/external account actions, credential or secret handling beyond the project contract, execution-profile downgrades, blockers, or material scope changes.

## 2026-04-17 — Check live AWS auth before SSO login

- When a deploy path may use AWS SSO, do not infer that credentials are expired from stale context, earlier logs, or memory.
- First verify current auth with `aws sts get-caller-identity --profile <profile>` or let the deploy command fail with a current credential error.
- Only run `aws sso login --profile <profile>` after that live check proves credentials are missing or expired.

## 2026-04-22 — `/run` must trust profile metadata over legacy step prose

- `/run` auto-dispatches `agent-team` phases via isolated worktrees. Do not stop just because the profile says `agent-team` or because the phase/step body contains stale advisory text like *"do not implement in a single `/run`"* or *"use `/delegate`"*.
- That prose typically predates the agent-team dispatch feature. The current authority is the `### Execution Profile` block (after `/patch-exec-profile` fills it), not narrative embedded in the step description.
- Only stop if `/patch-exec-profile` cannot resolve the profile (overlapping `Owns`, cyclic `Depends on`, missing lane specs that can't be inferred). `/delegate` is for Claude↔Codex handoff, not lane parallelism.

## 2026-04-19 — Keep Claude `/run` execution-only and `/ship` handoffs bounded

- Claude `/run` should execute exactly one approved step and then hand the dirty tree to `/ship`; it should not commit or push.
- Claude `/ship` is not complete after writing the next-step plan. Unless `--no-plan` is set or a blocker is documented, it must enter plan mode so the user can clear context and implement.
- Clear-context sessions launched by `/ship` plan mode are ship-one-step sessions. The plan handed to them must explicitly say to implement the approved step, validate, commit/push, deploy only with an explicit manual deploy contract, write the following step's plan, set/check `showClearContextOnPlanAccept` and `defaultMode: "acceptEdits"`, start the next approval UI with `EnterPlanMode` before `ExitPlanMode`, and stop before implementing it.
- If Claude refuses `EnterPlanMode` because Auto mode or the active permission mode requires an explicit user request, do not try `ExitPlanMode`; stop and ask the user to explicitly request plan mode, such as `/plan <next step>`.
- Deploy discovery should not stall shipping in repos with no explicit manual deploy contract; skip deploy unless `deploy.md` or `tasks/deploy.md` exists.
