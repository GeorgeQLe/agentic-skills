---
name: init-agentic-skills
description: Initialize this agentic-skills checkout on a developer machine by running the repository init script, verify global managed skill installs, uninstall repo-managed installs when requested, and route project-local pack setup to the pack skill. Use when Codex needs to make all global agentic-skills skills available on the current machine, repair stale installs, confirm initialization status, or explain how to enable packs for a project.
type: ops
version: v0.3
argument-hint: "[init|status|update|latest|--uninstall]"
---

# Init Agentic Skills

Invoke as `$init-agentic-skills`.

Initialize this `agentic-skills` checkout on the current machine by installing global core skills for both Claude and Codex. Active installs are repo-managed directories that expose the canonical `SKILL.md` and exclude `archive/`; pinned installs intentionally point at `archive/<version>`. Keep domain packs project-local; use `$pack` from the target project when packs are needed.

## Workflow

1. Parse `$ARGUMENTS`:
   - No args, `init`, `refresh`, or `sync`: run `scripts/init-agentic-skills.sh`.
   - `status`: run `scripts/init-agentic-skills.sh status`, then report the local checkout commit, remote URL, and whether GitHub freshness is enabled by `~/.agentic-skills/preferences.json` at `sync.github_freshness_check`.
   - `update` or `latest`: run `scripts/init-agentic-skills.sh update` only after confirming the user wants to check GitHub, fast-forward the local checkout, and rerun `init.sh`.
   - `--uninstall`, `uninstall`, or `remove`: run `scripts/init-agentic-skills.sh --uninstall` only after confirming the user wants repo-managed global installs removed.
   - `help`, `--help`, or `-h`: run `scripts/init-agentic-skills.sh --help`.
2. Report the initializer command, the Claude and Codex skill directories, installed/skipped counts, and warnings about non-repo-managed collisions.
3. Explain pack access separately:
   - Do not install `packs/*` globally.
   - In the project that needs domain workflows, run `$pack` for guided setup or `$pack install <pack-or-skill>` for an explicit pack or individual pack skill.
   - If a project already has `.agents/project.json`, use `$pack refresh` after this global initialization to recreate local pack skill roots.
4. If the active session still cannot see a newly installed skill, tell the user to start a fresh Claude Code or Codex session.
5. For `update` / `latest` mode:
   - Confirm before running commands that fetch, pull, or reinstall.
   - Fetch GitHub freshness, compare the local checkout to `origin/HEAD`, and update only with a fast-forward-only operation such as `git pull --ff-only` or an equivalent `git fetch` + `git merge --ff-only`.
   - If the update cannot fast-forward cleanly, stop and report the exact reason without rebasing, merging, stashing, or force-resetting.
   - After a successful fast-forward, rerun `init.sh`.
   - Warn that a fresh Claude Code or Codex session may be needed to see refreshed skill instructions.

## Constraints

- Delegate global initialization to `scripts/init-agentic-skills.sh`; do not recreate install logic by hand.
- Do not overwrite real directories or files under `~/.claude/skills`, `~/.codex/skills`, `.claude/skills`, or `.codex/skills`.
- Treat packs as project-local capabilities managed by `scripts/pack.sh` through `$pack`.
- Stop and report exact errors if the launcher cannot resolve the repository root or if root `init.sh` fails.
- Do not install `packs/*` globally in any mode.
