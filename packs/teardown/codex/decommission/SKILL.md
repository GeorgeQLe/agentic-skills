---
name: decommission
description: Systematically tear down and remove a service, package, or infrastructure component
type: execution
version: v0.2
release_lane: canary
required_conventions: [alignment-page, briefing-slides]
---

# Decommission

Invoke as `$decommission`.

Use this skill when the user wants to remove a service, package, module, or infrastructure component from the project.

## Process

1. Identify the target to decommission.
2. Audit all references: imports, configs, infrastructure, documentation.
3. Categorize as active dependencies, dead references, or infrastructure.
4. Present the removal plan and wait for approval. Use `update_plan` to track the work; use `request_user_input` only if the session is already in Plan mode and a structured choice would help.
5. Execute removal: migrate consumers, delete target, clean up references.
6. Verify: tests, build, grep for remaining references.

## Output

- **Dependencies Resolved**: consumers migrated or updated
- **Infrastructure Cleanup**: automated vs. manual required
- **Verification**: tests, build, remaining references

## Constraints

- Always audit dependencies before removing anything.
- Never delete cloud resources automatically — only IaC definitions.
- Present the plan and get approval before making changes. Do not assume a Claude-style `EnterPlanMode` or clear-context accept flow exists.



## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/decommission-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `$decommission`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/decommission-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
