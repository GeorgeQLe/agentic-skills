---
name: devtool-workflow
description: Use only for developer-facing tools, libraries, SDKs, CLIs, APIs, and infrastructure products
type: planning
version: v0.5
required_conventions: [alignment-page, briefing-slides, interrogation-page]
invocation: orchestrator
context_intake: scoped
visual_tier: visual
---

# Devtool Workflow

Use this skill when the project is primarily developer-facing.

## Scope-First Router Workflow

This skill is the devtool AFPS scope/router orchestrator. It does not perform downstream research itself and it does not route to downstream devtool skills until the user has approved the route and scope through compiled YAML.

0. **Stage 0 - Interrogation.** Build the stage-zero HTML interrogation page for devtool identity, target developer audience, buyer/champion/operator distinctions, available evidence, maturity, constraints, non-goals, and desired AFPS route. Loop until the confidence gate passes and consume the compiled interrogation YAML before building the route/scope alignment page.
1. **Stage 1 - Route and scope approval.** Inspect only enough repository and user-provided context to classify the project as developer-facing, identify missing devtool artifacts, propose the first concrete next skill, and name the evidence or decision that makes it first. Build `alignment/devtool-workflow-{topic}.html` as a `review` page with the proposed route, scope, assumptions/confidence, missing artifact matrix, candidate next skills, and approval gates. Stop for final compiled YAML approval. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language before approval YAML is consumed.
2. **Stage 2 - Confirmed routing.** Only after approved compiled YAML with no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback, apply approved edits, convert the alignment page to `confirmed` with the approval record preserved, and emit exactly one next devtool command using the approved route. If the route is still ambiguous after feedback, keep the page in `review` and ask for the missing decision instead of guessing.

Default sequence when no more specific approved route overrides it: `/devtool-user-map`, `/devtool-integration-map`, `/devtool-dx-journey`, `/devtool-adoption`, `/devtool-positioning`, `/devtool-monetization`, `/devtool-docs-audit`.

## Output

After final compiled YAML approval is consumed and the alignment page is converted to `confirmed`, recommend the next single devtool-pack skill to run and explain the missing artifact or decision that makes it next. In the final response, include `Recommended next skill: <command>` only after that approval. Before approval, the next action is review of the HTML alignment page.


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/devtool-workflow-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `/devtool-workflow`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/devtool-workflow-{topic}.html`.

## Interrogation Page

Follow the shared interrogation-page convention via the packaged convention resolver; output path is `interrogation/devtool-workflow-r{N}-{branch}.html`. Before producing research, run the stage-zero interrogation loop, starting with the assumptions manifest as round 1, and loop until the confidence gate passes. This skill **cannot advance to stage one until** the confidence gate passes with at least one completed interrogation round and every interview area covered or waived. Each round page must contain at least one genuinely open input (`data-open-input`).

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
