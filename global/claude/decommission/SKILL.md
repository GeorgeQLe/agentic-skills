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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/decommission-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/decommission-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
