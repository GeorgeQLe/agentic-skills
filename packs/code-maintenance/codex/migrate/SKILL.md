---
name: migrate
description: Guide a structural migration or dependency upgrade with a step-by-step plan and verification
type: execution
version: v0.2
required_conventions: [alignment-page, briefing-slides]
---

# Migrate

Invoke as `$migrate`.

Use this skill when the user needs to perform a large-scale codebase reorganization, dependency upgrade, or pattern migration.

## Process

1. Understand the migration target from the user's description.
2. Audit the current state — find all instances of the old pattern.
3. Present the migration plan and wait for approval. Use `update_plan` to track the work; use `request_user_input` only if the session is already in Plan mode and a structured choice would help.
4. Execute in verifiable batches, running type-checks and tests after each.
5. Final verification: full test suite, build, and grep for remaining old patterns.

## Output

- **Scope**: files and packages affected
- **Changes Made**: batch-by-batch summary
- **Verification**: type-check, tests, build results
- **Manual Follow-ups**: anything that couldn't be automated

## Constraints

- Always present the plan and get approval before making changes. Do not assume a Claude-style `EnterPlanMode` or clear-context accept flow exists.
- Process one package at a time in monorepos.
- Do not change behavior — migrations should be structural only.



## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/migrate-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `$migrate`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/migrate-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
