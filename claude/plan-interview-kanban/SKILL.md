---
name: plan-interview-kanban
description: Interview to validate and complete a specification, then update the matching kanban Backlog card with spec details
argument-hint: [optional-topic-override]
allowed-tools: Bash(node *)
---

# Plan Interview (Kanban)

Interview the user to validate, refine, and complete a specification. After writing the spec, find the matching kanban card and update it with spec details.

## Kanban Setup

Run these steps before the main process. If any step fails, warn the user and continue without kanban — the spec output must always succeed.

### Board Resolution

```bash
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs boards
```

1. If `tasks/.kanban-board` exists, read the board ID. Verify it via `board <id>`. If stale (error), delete the file and continue to step 2.
2. If no valid mapping: match board names against `basename $(pwd)` (case-insensitive). Prefer exact match over substring.
3. If one match → use it, save ID to `tasks/.kanban-board`.
4. If zero or multiple matches → list boards, ask the user to pick. Save their choice.
5. If no boards exist → ask the user if they want to create one. If yes: `create-board --name "$(basename $(pwd))" --template standard`. Save the ID.

### Board Validation

After resolving the board, verify all 5 required lists exist (case-insensitive name match): **Backlog, Todo, In Progress, Done, Punt**. If any are missing, create them via `create-list --board <id> --name "<name>"`. Store list IDs for use in subsequent operations.

### Graceful Degradation

If the poketo-kanban scripts are not found at `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`, or if the first kanban command fails (DB connectivity, auth error), warn the user and continue with the base plan-interview behavior. Kanban operations are additive — never block the core workflow.

### Board Overview

After board validation, display a brief board status to provide context:

1. Fetch the full board state: `board <id>`
2. Scan all cards and report:
   - **Overdue**: Cards with a due date in the past (highlight count and names)
   - **High priority**: Starred cards not yet in Done/Punt
   - **Blocked**: Cards whose description contains "blocked" or "blocker"
   - **In Progress**: Count of cards currently being worked on
   - **Backlog/Todo**: Counts for planning context
3. Display as a brief summary before proceeding. Do not take action — this is informational only.

## Process

Before starting the interview, check if `specs/icp.md` exists. If it does, read it and treat it as foundational context for the specification. Ground solution decisions against the ICP: does this feature serve the user journey? Does this architecture match the user's technical sophistication? Does this UX match how the customer provisions and onboards? When the user proposes something that conflicts with the ICP, flag it — e.g., "Your ICP says users are non-technical ops managers — does this CLI-based workflow fit their profile?" Do not re-interview on ICP topics already covered — focus on solution design.

Using the project description provided above as a working draft, interview me in detail using the AskUserQuestion tool to validate, refine, and complete the specification. Treat the existing spec as a starting point that requires confirmation rather than settled decisions. Ask me to validate key assumptions and choices from the original document, probe for ambiguities and missing details, and explore edge cases, technical implementation, UI and UX considerations, concerns, and tradeoffs. Ask probing questions that challenge assumptions, explore failure modes, and uncover implicit requirements. Do not assume that what is written in the spec is final since I may deviate from it as we work through the details.

Ask one to three focused questions per turn. When a decision point genuinely has multiple viable approaches, list each option with a clear rationale and provide a simple pros and cons comparison. State your recommendation and explain why you recommend it. For the recommended option, explain how the con can be mitigated if doing so is feasible without compromising core functionality. If mitigation isn't needed, state that explicitly with your reasoning. Only present options when distinct alternatives genuinely exist. Do not manufacture choices or generate artificial options simply to follow this format.

Continue the interview until you have thoroughly covered all aspects of the specification including goals, user stories, technical architecture, data models, APIs, UI flows, edge cases, security, performance, and scope boundaries. Confirm with me before concluding that all areas have been addressed.

When finished, write the completed specification to `specs/[topic].md` (create the `specs/` directory if it doesn't exist) where `topic` is a short kebab-case summary of the feature or product being planned. Also create an interview log file named [topic]-__interview.md__. This file should record each turn of the interview including the questions asked, any options presented with their pros and cons evaluation, and my selections and responses. Conclude the file with a summary of any significant deviations from the original spec along with the reasoning behind those changes.

## Kanban Sync

After writing the spec, sync the result to the kanban board:

1. Extract 2-3 distinctive keywords from the topic argument (e.g., "kanban board sync" → search for "kanban board").
2. Search the board across ALL lists (not just Backlog): `search --query "<keywords>"`
3. Filter results:
   - If exactly one card matches → update its description with:
     - Spec summary (2-3 sentence overview of what was specced)
     - Spec file path: `specs/[topic].md`
     - Do NOT move the card — update in place regardless of which list it's in. Never move cards backward from Done or Punt.
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs update-card --id <card-id> --description "<updated description>"
     ```
   - If multiple cards match → list them with IDs and names, ask the user which one to update.
   - If zero matches → create a new card in the Backlog list:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs create-card --board <id> --list <backlog-list-id> --name "<topic title>" --description "Spec: specs/[topic].md | <brief summary>"
     ```
4. Report: which card was updated or created.

## Constraints
- Do not assume draft text is final — the interview may change everything.
- Keep probing until the spec is decision-complete enough to implement.
- Kanban operations are additive — if board resolution or any kanban command fails, warn and continue. The spec output to `specs/[topic].md` must always succeed regardless of kanban state.
- Never move cards backward from Done or Punt — update their description in place.
