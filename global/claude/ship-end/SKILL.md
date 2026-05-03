---
name: ship-end
description: Wrap up the current session — update docs, commit, and push
type: shipping
version: 1.0.0
argument-hint: "[--no-deploy]"
---

# Ship End

Wrap up the current session: mark progress, commit, and push.

## Process

1. **Check for changes:**
   - Run `git status` and `git diff` to see all changes.
   - If the working tree is clean and no unpushed commits: report "nothing to ship" and stop.

2. **Update task tracking:**
   - Update `tasks/todo.md` — mark completed items as done, note any outstanding items or blockers.
   - Update milestone progress in `tasks/roadmap.md` if criteria were met.
   - Check `tasks/manual-todo.md` (if it exists) — note the status of manual tasks (how many checked vs unchecked). Do NOT modify checked items.
   - Check `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist — note unchecked advisory counts only. Do NOT treat them as blockers unless an item has been promoted into `tasks/todo.md`.
   - Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.

3. **Deploy:**
   - Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   - Run the deploy and verify the output for errors.
   - Do not run `aws sso login` preemptively from stale context, old logs, or assumptions. If the deploy method uses an AWS profile and auth status is uncertain, first run `aws sts get-caller-identity --profile <profile>` using the profile from the deploy contract or deploy command.
   - If the AWS identity check succeeds, proceed directly with the deploy and do not run `aws sso login`.
   - If the AWS identity check or the deploy command fails because AWS SSO credentials are missing or expired, do not skip deployment. Run the matching `aws sso login --profile <profile>` command, using the profile from the deploy contract, deploy command, or error output.
   - When `aws sso login` prints a browser URL, device code, or verification instructions, relay them to the user and tell them to navigate to the provided URL and complete the login in their browser. Keep the login command running until it succeeds, fails, or times out.
   - After a successful SSO login, rerun the original deploy command once. This auth recovery is part of the same deploy attempt, not an automatic retry of a failed deploy.
   - If the user cannot complete SSO login or the login command fails, report the deploy as blocked by authentication. Do not report it as skipped.
   - If the deploy fails, report the error. Do not retry automatically.

4. **Ship the session changes:**
   - Use the `/commit-and-push-by-feature` workflow: group changes into logical feature/function buckets, use conventional commit messages, land the resulting commits on `main` or `master`, and push them there when the workflow succeeds.

5. **Report session summary:**
   - What was accomplished
   - Deploy status (if deployed)
   - Test status — explicitly state whether any failing tests are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)
   - What's outstanding
   - Branch and commit list
   - Confirm working tree is clean

## Output Format

```
## Session Summary
- **Accomplished**: [what was done]
- **Deploy**: [status]
- **Tests**: [pass/fail — expected or unexpected]
- **Manual tasks**: [X/Y complete, or "none"]
- **Advisory tasks**: [record/recurring counts, or "none"]
- **Outstanding**: [remaining work]
- **Branch**: [branch name]
- **Commits**: [list]
- **Working tree**: clean
- **Next work:** [specific task, blocker, verification gap, or "none"]
- **Recommended next command:** [one command or route]
```

## Next-Step Routing

Before closing out the session, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal session summary:

- **Next work:** <specific task name, manual blocker, verification gap, or "none">
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from `tasks/todo.md`, `tasks/manual-todo.md`, deploy status, validation gaps, smoke-test gaps, outstanding session work, or the absence of any remaining work. Do not use agent mode itself as the next work item.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Hybrid execution handoff → recommend `/delegate $run`.
  - Claude-only or orchestration-heavy work → recommend `/run`.
  - Codex-only execution → recommend `$run`.
  - External human-only manual work (browser/auth/DNS/service dashboard work with no reliable authenticated CLI/API path, paid account setup, real-device checks, or production smoke-test work needing human sign-off) → recommend `/guide` or a Claude-guided manual step rather than `/run`.
  - Agent-executable work misfiled in `tasks/manual-todo.md`, task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → recommend `/reconcile-dev-docs fix tasks`, promotion to `tasks/todo.md`, or a direct dev-doc audit, not `/guide`.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

## Constraints

- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message.
- Do NOT modify CLAUDE.md. CLAUDE.md is for project conventions and config only — not progress tracking.
- Progress and active work go in `tasks/todo.md`. Completed work history goes in `tasks/history.md`.
- Do not execute or block wrap-up on `tasks/record-todo.md` or `tasks/recurring-todo.md` items unless they were explicitly promoted into `tasks/todo.md`.
- Do not switch branches or create new branches unless the current state requires it.
- Do not amend or rewrite history.
- Do not commit secrets.
- Do not push session-wrap-up commits to an existing feature branch. Use `/commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely.
- If pre-commit hooks fail, fix and retry.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
