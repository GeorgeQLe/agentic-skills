---
name: bootstrap-repo
description: Initialize a repository README and agent workflow docs from a short project brief
type: execution
version: 1.0.0
argument-hint: "<project brief>"
---

# Bootstrap Repo

Invoke as `$bootstrap-repo`.

Initialize a repository with a useful `README.md` and the standard agent workflow docs.

## Process

1. **Parse the project brief** from `$ARGUMENTS`:
   - Extract the project name, purpose, setup instructions, run/test commands, and any constraints.
   - If the brief is missing or too thin to write a useful README, ask for the project name and one-sentence purpose. Ask for setup or run instructions only when the repository does not make them discoverable.

2. **Inspect the target repository:**
   - Read existing `README.md`, `CLAUDE.md`, `AGENTS.md`, package manifests, obvious build files, and directory names.
   - Preserve discovered commands and facts. Do not invent dependency managers, deployment targets, or product claims.

3. **Create or update `README.md`:**
   - If `README.md` is absent, empty, or placeholder-like, write a concise README with:
     - `# <Project Name>`
     - A short purpose summary.
     - `## Getting Started`
     - `## Development`
     - `## Notes`
   - If `README.md` already has substantial content, preserve it. Ask before replacing it; otherwise add a small bootstrap section only when it improves the file.
   - Use the project brief as the primary source and repository inspection as supporting evidence.

4. **Provision agent workflow docs:**
   - Run `$provision-agentic-config` for the same repository.
   - Confirm `CLAUDE.md` and `AGENTS.md` exist after provisioning.
   - Preserve unrelated existing content in both files.

5. **Verify the result:**
   - Check that `README.md`, `CLAUDE.md`, and `AGENTS.md` exist.
   - Confirm the workflow orchestration block appears exactly once in both `CLAUDE.md` and `AGENTS.md`.
   - Report whether the monorepo safety block was included or skipped by `$provision-agentic-config`.

## Output Format

```markdown
Bootstrapped repository
- README.md: [created | updated | preserved], source: [arguments | prompts | existing content]
- CLAUDE.md: [created | updated | unchanged], workflow block appears once
- AGENTS.md: [created | updated | unchanged], workflow block appears once
- Monorepo safety block: [included (<heuristic>) | skipped]
- Verification: [commands/checks run]
```

## Constraints

- Do not overwrite substantial existing `README.md` content without explicit user confirmation.
- Do not invent setup, test, deploy, or architecture details that are not in the brief or repository.
- Keep the README concise and useful for a new contributor.
- Do not modify files other than `README.md`, `CLAUDE.md`, and `AGENTS.md` unless the user explicitly asks.
- Do not create, modify, or suggest GitHub Actions workflows.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
