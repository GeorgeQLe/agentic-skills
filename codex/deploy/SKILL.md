---
name: deploy
description: Deploy the project to a target environment (defaults to staging).
---

# Deploy

Deploy the current project to the specified environment. Defaults to staging if no environment is provided.

## Workflow

1. Determine the target environment from the user's request (default: staging).
   - If production is specified, ask for explicit confirmation before proceeding.
2. Find the deploy configuration. Check these locations in order:
   - `spec.md` — deployment section
   - `CLAUDE.md` — deploy commands or instructions
   - `tasks/todo.md` — deploy instructions
   - `Makefile` / `Justfile` — deploy targets
   - `package.json` — deploy scripts
   - `deploy/`, `infra/`, `scripts/` — deploy scripts or IaC
   - `docker-compose*.yml`, `Dockerfile` — container-based deploys
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If no deploy config is found, stop and ask the user how to deploy.
3. Pre-flight checks:
   - Ensure the working tree is clean. If dirty, warn and ask whether to proceed or commit first.
   - Ensure the current branch is pushed to remote.
   - Note the current commit hash for reference.
4. Run the deploy using the project's deploy mechanism.
5. Post-deploy verification (if applicable):
   - Check deploy output for errors.
   - If there is a health check URL or status command, run it.
   - Report success or failure.
6. Output a concise summary:
   - Environment deployed to
   - Branch and commit hash
   - Success/failure status
   - Any warnings or follow-up actions

## Constraints

- Never deploy to production without explicit user confirmation.
- If deploy fails, report the error clearly — do not retry automatically.
- Do not modify code as part of the deploy process.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
