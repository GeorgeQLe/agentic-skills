# Lessons

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
