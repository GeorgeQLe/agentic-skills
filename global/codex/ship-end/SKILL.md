---
name: ship-end
description: "Wrap up the current session — update docs, commit, and push"
type: shipping
version: 1.0.0
argument-hint: "[--no-deploy]"
---

# Ship End

Invoke as `$ship-end`.

Use this skill when the user wants the current session wrapped up cleanly.

## Workflow

1. Inspect `git status` and diffs.
2. If the tree is clean and there are no unpushed commits, report that there is nothing to ship and stop.
3. Update `tasks/todo.md` with completed items and blockers. Also update milestone progress in `tasks/roadmap.md` if criteria were met.
3b. Check `tasks/manual-todo.md` (if it exists) — note the status of manual tasks (checked vs unchecked). Do NOT modify checked items.
3c. Check `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist — note unchecked advisory counts only. Do NOT treat them as blockers unless an item has been promoted into `tasks/todo.md`.
4. Update `tasks/history.md` with a brief record of the session. Create it if needed.
5. **Pre-ship validation:**
   - First check conversation context for lint/typecheck/test/build output already produced this session (e.g., from a TDD run step). Do NOT re-run commands whose results are already available.
   - For any validation category not already run, find commands from: `CLAUDE.md`, `Makefile`/`Justfile` (check/lint/typecheck/test/build targets), `package.json` (lint/typecheck/check/test/build scripts), `pyproject.toml`/`setup.cfg`, `Cargo.toml`. If none found and no prior output exists, skip.
   - Inspect validation output even when commands exit zero. If warnings are emitted, either fix them, record them as explicitly accepted with rationale, or report them clearly as unresolved.
   - If errors are found (from prior output or fresh runs), fix them and re-run only the failing commands to confirm. Include fixes in the session-wrap-up commit, or a separate commit if unrelated.
   - If errors can't be auto-fixed, **STOP. Do not ship.** Report the errors to the user and ask how to proceed. Never commit or push code with known build/lint/type/test failures.
5b. **Quality gate for non-trivial mutations:**
   - Apply `docs/quality-gate-contract.md` when the session changed source code, scripts, configuration, schemas, generated runtime assets, deploy behavior, workflow policy, validation rules, command surfaces, or multiple files.
   - Build a ship manifest from the exact diff and unpushed commits that will be included in the session wrap-up. The manifest must include: User goal, Changed files, Per-file purpose, User-goal mapping, Tests run, Skipped tests, Adversarial review, Residual risk, Rollback note, and Next command.
   - For non-trivial source changes, run a targeted `quality-sweep audit`, `$expert-review`, configured review lane, or explicitly justified equivalent adversarial review before commit/push. Fix findings or record accepted residual concerns in the manifest.
   - Final output must distinguish executable verification from documentation-only or task-only checks. Documentation/task checks can support source changes, but cannot be the only proof for non-trivial source mutations.
   - If no executable check is relevant, state why in `Skipped tests` and explain the residual risk. Do not write "not run" without a rationale.
   - If the user corrected the agent during the session, the pre-commit ship manifest must prove the exact shipping boundary includes a `tasks/lessons.md` update for the current correction. Treat the correction as repeatable unless the manifest proves otherwise. If it exposes a workflow failure, also include the relevant skill contract, validation script, fixture, or test enforcement update in the same shipping boundary, or include `Correction enforcement:` with the blocker or not-applicable rationale and the concrete follow-up file/command when needed.
6. Deploy (skip if `--no-deploy`):
   - Check for an explicit manual deploy contract in `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, read it first and use it to determine the deploy method.
   - Supplement the contract by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If a deploy contract exists but no deploy method is found, ask the user how deployment works. Do not guess.
   - Run the deploy and verify the output for errors.
   - Do not run `aws sso login` preemptively from stale context, old logs, or assumptions. If the deploy method uses an AWS profile and auth status is uncertain, first run `aws sts get-caller-identity --profile <profile>` using the profile from the deploy contract or deploy command.
   - If the AWS identity check succeeds, proceed directly with the deploy and do not run `aws sso login`.
   - If the AWS identity check or the deploy command fails because AWS SSO credentials are missing or expired, do not skip deployment. Run the matching `aws sso login --profile <profile>` command, using the profile from the deploy contract, deploy command, or error output.
   - When `aws sso login` prints a browser URL, device code, or verification instructions, relay them to the user and tell them to navigate to the provided URL and complete the login in their browser. Keep the login command running until it succeeds, fails, or times out.
   - After a successful SSO login, rerun the original deploy command once. This auth recovery is part of the same deploy attempt, not an automatic retry of a failed deploy.
   - If the user cannot complete SSO login or the login command fails, report the deploy as blocked by authentication. Do not report it as skipped.
   - If the deploy fails, report the error. Do not retry automatically.
7. Commit and push using the `commit-and-push-by-feature` workflow. That workflow must land the resulting commits on `main` or `master`, not on an existing feature branch.
8. Report:
   - What was accomplished
   - Validation status — explicitly state whether any failing tests are expected (red phase: tests before implementation) or unexpected (regressions/bugs), and call out any warnings as fixed, accepted, or unresolved
   - Manual tasks — X/Y complete (from `tasks/manual-todo.md`, if it exists)
   - Advisory tasks — pending record/recurring counts from `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist
   - What is still outstanding
   - Branch name
   - Commit list
   - Final working-tree state
   - **Next work:** the next concrete project task, blocker, smoke test, or follow-up
   - **Recommended next command:** one command or route for that work

## Next-Step Routing

Before closing out the session, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal report:

- **Next work:** <specific task name, manual blocker, verification gap, or "none">
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from `tasks/todo.md`, `tasks/manual-todo.md`, deploy status, validation gaps, smoke-test gaps, phase-transition output, outstanding session work, or the absence of any remaining work. Do not use agent mode itself as the next work item.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Codex skill invocation (`$run`, `$ship`, `$ship-end`) → recommend the matching `$...` command.
  - Claude slash invocation (`/run`, `/ship-end`, `/delegate`) or orchestration-heavy work → recommend the matching `/...` route.
  - External human-only manual work (browser/auth/DNS/service dashboard work with no reliable authenticated CLI/API path, paid account setup, real-device checks, or production smoke-test work needing human sign-off) → recommend `$guide` or a Claude-guided manual step rather than `$run`.
  - Agent-executable work misfiled in `tasks/manual-todo.md`, task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → recommend `$reconcile-dev-docs fix tasks`, promotion to `tasks/todo.md`, or a direct dev-doc audit, not `$guide`.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

## Constraints

- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do not modify `CLAUDE.md` as part of progress tracking.
- Do not execute or block wrap-up on `tasks/record-todo.md` or `tasks/recurring-todo.md` items unless they were explicitly promoted into `tasks/todo.md`.
- Do not switch or create branches unless the current state requires it.
- Do not amend or rewrite history.
- Stop and report if secrets are detected.
- Do not push session-wrap-up commits to an existing feature branch. Use `commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely.
- `ship-end` only runs a deploy when `deploy.md` or `tasks/deploy.md` explicitly documents a manual deployment workflow. Repos without one are assumed to auto-deploy or require no manual deploy step.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- For non-trivial mutations, include the `docs/quality-gate-contract.md` ship manifest in the task review notes, history entry, or final response before invoking `$commit-and-push-by-feature`.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
