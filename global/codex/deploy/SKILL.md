---
name: deploy
description: Deploy the project to a target environment (defaults to staging) with deployment history tracking.
version: 1.0.0
---

# Deploy

Deploy the current project to the specified environment. Defaults to staging if no environment is provided. Maintains a deployment ledger (`tasks/deploys.md`) to track what was deployed when, enabling staleness detection. Use `--status` to view staleness without deploying.

## Workflow

1. Determine the target environment from the user's request (default: staging). If `--status`, skip to step 7.
   - If production is specified, ask for explicit confirmation before proceeding.
2. Find the deploy configuration. Check these locations in order:
   - `spec.md` — deployment section
   - `CLAUDE.md` — deploy commands or instructions
   - `tasks/roadmap.md` — deploy instructions
   - `tasks/todo.md` — deploy instructions
   - `Makefile` / `Justfile` — deploy targets
   - `package.json` — deploy scripts
   - `deploy/`, `infra/`, `scripts/` — deploy scripts or IaC
   - `docker-compose*.yml`, `Dockerfile` — container-based deploys
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If no deploy config is found, stop and ask the user how to deploy.
3. Pre-flight checks:
   - Ensure the working tree is clean. If dirty, warn and ask whether to proceed or commit first.
   - Resolve the primary branch: prefer `main`; if it does not exist, use `master`. If neither exists, stop and explain the blocker.
   - Ensure the current branch is the primary branch. If not, stop and tell the user to land the work on `main`/`master` first rather than deploying from a feature branch.
   - Ensure the primary branch is pushed to remote.
   - Note the current commit hash for reference.
4. Compare against last deployment:
   - Read `tasks/deploys.md` (if it exists) and find the most recent successful entry for the target environment.
   - If a previous deploy exists, run `git log --oneline <last-deployed-commit>..HEAD` to show what's changed.
   - Report commit count and time since last deploy.
5. Run the deploy using the project's deploy mechanism.
6. Post-deploy verification (if applicable):
   - Check deploy output for errors.
   - If there is a health check URL or status command, run it.
   - Report success or failure.
7. Record to ledger (`tasks/deploys.md`):
   - Prepend a new entry under the environment heading with: date (UTC), branch, commit range, commit count, status (success/failed).
   - Include a collapsed details block with the commit list.
   - Failed deploys are recorded but do not reset the staleness clock.
8. Report staleness across all environments:
   - For each environment with a successful deploy: last deploy date, commits behind HEAD, days since deploy.
   - Flag environments 7+ days old or 20+ commits behind as stale.
9. Output summary: environment, branch, commit range, status, staleness across environments.

## Constraints

- Never deploy to production without explicit user confirmation.
- If deploy fails, report the error clearly — do not retry automatically. Still record the failed attempt.
- Do not modify code as part of the deploy process.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- The ledger (`tasks/deploys.md`) is the only file this skill writes. Only count `success` entries for staleness.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
