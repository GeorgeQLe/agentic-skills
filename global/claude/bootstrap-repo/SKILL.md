---
name: bootstrap-repo
description: Initialize or reset a repository README and agent workflow docs from a short project brief
type: execution
version: 1.0.0
argument-hint: "<project brief>"
---

# Bootstrap Repo

Initialize a repository with a useful `README.md` and the standard agent workflow docs. When invoked with `--reset-existing`, first archive stale implementation files from a non-empty stuck repo so the fresh start is not built on old code by accident.

## Process

1. **Parse the project brief and mode** from `$ARGUMENTS`:
   - Detect `--reset-existing`, `--in-place-reset`, or an explicit request to archive/reset the current codebase before bootstrap.
   - Extract the project name, purpose, setup instructions, run/test commands, and any constraints.
   - If the brief is missing or too thin to write a useful README, ask for the project name and one-sentence purpose. Ask for setup or run instructions only when the repository does not make them discoverable.

2. **Inspect the target repository:**
   - Read existing `README.md`, `CLAUDE.md`, `AGENTS.md`, package manifests, obvious build files, and directory names.
   - Preserve discovered commands and facts. Do not invent dependency managers, deployment targets, or product claims.

3. **Reset existing stale repo when explicitly requested:**
   - Only perform this step when reset mode is explicit. Never archive or move implementation files during ordinary bootstrap.
   - Confirm the repo is non-empty and contains stale implementation files or stale generated app structure. If it is already empty or freshly initialized, skip archival and note why.
   - Create `archive/YYYY-MM-DD-HHMMSS/` and move stale implementation files/directories there before writing fresh bootstrap docs.
   - Do not archive `.git/`, `.agents/`, `archive/`, `desk-flip-report.md`, valid salvage docs named in the desk-flip report, valid non-code assets named in the desk-flip report, or root agent config files needed for the current session.
   - Preserve a manifest at `archive/YYYY-MM-DD-HHMMSS/MANIFEST.md` listing every moved path, every intentionally preserved path, and the source report/brief that justified the reset.
   - Prefer `git mv` for tracked paths so history remains understandable. Use ordinary moves only for untracked paths.
   - Do not delete old files outright. If a path cannot be moved safely, stop and report the blocker instead of partially resetting further.
   - After archival, the root should contain only the fresh-start sources of truth: git metadata, agent config, the archive directory, desk-flip report, validated salvage artifacts, and any newly written bootstrap docs.

4. **Create or update `README.md`:**
   - If `README.md` is absent, empty, or placeholder-like, write a concise README with:
     - `# <Project Name>`
     - A short purpose summary.
     - `## Getting Started`
     - `## Development`
     - `## Notes`
   - If `README.md` already has substantial content, preserve it. Ask before replacing it; otherwise add a small bootstrap section only when it improves the file.
   - Use the project brief as the primary source and repository inspection as supporting evidence.

5. **Provision agent workflow docs:**
   - Run `/provision-agentic-config` for the same repository.
   - Confirm `CLAUDE.md` and `AGENTS.md` exist after provisioning.
   - Preserve unrelated existing content in both files.

6. **Verify the result:**
   - Check that `README.md`, `CLAUDE.md`, and `AGENTS.md` exist.
   - Confirm the corresponding workflow orchestration block appears exactly once in each of `CLAUDE.md` and `AGENTS.md`.
   - Report whether the monorepo safety block was included or skipped by `/provision-agentic-config`.
   - In reset mode, check that `archive/YYYY-MM-DD-HHMMSS/MANIFEST.md` exists and lists moved and preserved paths.

7. **Route alignment-first after bootstrap:**
   - If this is a product, app, SaaS, dashboard, internal tool, marketplace, website, or other user-facing restart, recommend `/ui-interview --requirements-only <topic>` as the next command unless a current accepted requirements artifact already exists.
   - If current requirements exist but visual or workflow direction is still open, recommend `/ux-variations --layout-mode <topic>`.
   - Only route directly to `/roadmap` or `/run` when the project is non-UI/non-product work or already has accepted alignment artifacts and a consolidated prototype.
   - The intended product sequence after reset is: `/ui-interview --requirements-only` -> `/ux-variations --layout-mode` -> build variants via `/run` or the applicable prototype-building route -> `/uat --variant-evaluation` -> `/consolidate-variations` -> `/research-roadmap --post-prototype` -> `/spec-interview` or `/roadmap`.

## Output Format

```markdown
Bootstrapped repository
- README.md: [created | updated | preserved], source: [arguments | prompts | existing content]
- Reset archive: [created archive/YYYY-MM-DD-HHMMSS | skipped (<reason>)]
- CLAUDE.md: [created | updated | unchanged], corresponding workflow block appears once
- AGENTS.md: [created | updated | unchanged], corresponding workflow block appears once
- Monorepo safety block: [included (<heuristic>) | skipped]
- Verification: [commands/checks run]
- Recommended next command: [/ui-interview --requirements-only <topic> | /ux-variations --layout-mode <topic> | /roadmap | /run]
```

## Constraints

- Do not overwrite substantial existing `README.md` content without explicit user confirmation.
- Do not invent setup, test, deploy, or architecture details that are not in the brief or repository.
- Keep the README concise and useful for a new contributor.
- Do not modify files other than `README.md`, `CLAUDE.md`, and `AGENTS.md` unless the user explicitly asks or invokes reset mode.
- Reset mode may move stale files into `archive/YYYY-MM-DD-HHMMSS/` and write that archive's `MANIFEST.md`; it may not delete files outright.
- Do not create, modify, or suggest GitHub Actions workflows.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
