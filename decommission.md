---
description: Systematically tear down and remove a service, package, or infrastructure component
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
   - Exit plan mode.
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
- Never delete infrastructure resources (cloud, DNS) automatically — only remove IaC definitions and flag manual cleanup.
- If active dependencies exist that can't be trivially resolved, stop and discuss with the user.
- Do not remove git history — just delete files and let git track the removal.
