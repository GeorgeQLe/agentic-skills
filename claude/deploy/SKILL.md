---
name: deploy
description: Deploy the project to a target environment (defaults to staging)
argument-hint: [staging|production]
---

# Deploy

Deploy the current project to the specified environment. Defaults to `staging` if no argument is provided.

## Process

1. **Determine the target environment** from `$ARGUMENTS` (default: `staging`).
   - If `production` is specified, **ask for explicit confirmation** before proceeding.

2. **Find the deploy configuration.** Check these locations in order:
   - `CLAUDE.md` — look for a deploy section or deploy commands
   - `tasks/todo.md` — look for deploy instructions
   - `Makefile` / `Justfile` — look for deploy targets
   - `package.json` — look for deploy scripts
   - `deploy/`, `infra/`, `.github/workflows/` — look for deploy scripts or IaC
   - `docker-compose*.yml`, `Dockerfile` — container-based deploys
   - If no deploy config is found, **stop and ask the user** how to deploy this project.

3. **Pre-flight checks:**
   - Ensure the working tree is clean (`git status`). If dirty, warn and ask whether to proceed or commit first.
   - Ensure the current branch is pushed to remote.
   - Note the current commit hash for reference.

4. **Run the deploy** using the project's deploy mechanism.

5. **Post-deploy verification** (if applicable):
   - Check deploy output for errors.
   - If there's a health check URL or status command in the project config, run it.
   - Report success or failure.

6. **Output a concise summary:**
   - Environment deployed to
   - Branch and commit hash
   - Success/failure status
   - Any warnings or follow-up actions

## Constraints
- Never deploy to production without explicit user confirmation.
- If deploy fails, report the error clearly — do not retry automatically.
- Do not modify code as part of the deploy process.
