---
name: decommission
description: Systematically tear down and remove a service, package, or infrastructure component
type: execution
version: v0.0
argument-hint: <what to decommission, e.g. "bismarck-v0.3" or "packages/old-auth">
---

# Decommission

Systematically remove a service, package, module, or infrastructure component with verification that nothing breaks.

## Process

1. **Identify the target** from `$ARGUMENTS`:
   - What is being decommissioned (service, package, module, infra component).
   - If unclear, ask the user for specifics.

2. **Audit dependencies:**
   - Find all references to the target across the codebase:
     - Import statements and require calls
     - Package.json dependencies
     - Configuration files (env vars, docker-compose, CI/CD, Terraform)
     - Documentation references
     - API endpoints or routes that depend on it
   - Categorize references as:
     - **Active dependencies** — code that will break if the target is removed
     - **Dead references** — comments, docs, unused imports
     - **Infrastructure** — deploy configs, env vars, cloud resources

3. **Build a removal plan:**
   - Enter plan mode using EnterPlanMode.
   - Present the dependency audit results.
   - Propose removal order:
     1. Remove active dependencies (migrate consumers first)
     2. Remove the target code/config
     3. Clean up dead references
     4. Remove infrastructure (Terraform, cloud resources, CI jobs)
   - Flag any external resources that need manual cleanup (DNS, cloud console, third-party integrations).
   - Wait for user approval.

4. **Execute the removal after approval:**
   - If Claude Code already returned to normal mode after approval, do not call ExitPlanMode again; continue directly with removal. Only use the plan-mode exit tool when the session is still visibly in plan mode.
   - Step through the removal plan:
     - For each active dependency: migrate or remove the consumer code.
     - Delete the target files/directories.
     - Remove config entries (env vars, package.json deps, workspace references).
     - Update CI/CD pipelines.
   - After each major step, run tests and type-checks.

5. **Final verification:**
   - Run the full test suite.
   - Run the build.
   - Grep for any remaining references to the target.
   - Check for orphaned files (files that were only used by the target).

## Output Format

### Decommission Summary
- **Target**: what was removed
- **Scope**: X files deleted, Y files modified

### Dependencies Resolved
- List of consumers that were migrated or updated

### Infrastructure Cleanup
- **Automated**: what was removed from config/IaC
- **Manual required**: cloud resources, DNS, third-party services that need manual action

### Verification
- Tests: pass/fail
- Build: pass/fail
- Remaining references: 0 or list

## Constraints
- Always audit dependencies before removing anything.
- Always enter plan mode and get approval before making changes.
- Do not call ExitPlanMode from normal mode. If Claude Code reports "You are not in plan mode" after approval, treat approval as complete and continue implementation.
- Never delete infrastructure resources (cloud, DNS) automatically — only remove IaC definitions and flag manual cleanup.
- If active dependencies exist that can't be trivially resolved, stop and discuss with the user.
- Do not remove git history — just delete files and let git track the removal.


## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/decommission-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/decommission-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/decommission-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
