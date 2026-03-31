---
name: plan-interview-kanban
description: Interview to validate and complete a specification, then update the matching kanban Backlog card with spec details
version: 1.0.0
argument-hint: [optional-topic-override]
allowed-tools: Bash(node *)
---

# Plan Interview (Kanban)

Interview the user to validate, refine, and complete a specification. After writing the spec, find the matching kanban card and update it with spec details.

## Kanban Setup

Read and follow the Kanban Setup protocol in `~/.claude/skills/poketo-kanban/KANBAN-SETUP.md` (all sections including Board Overview).

## Process

Before starting the interview, check if `research/icp.md` exists. If it does, read it and treat it as foundational context for the specification. Ground solution decisions against the ICP: does this feature serve the user journey? Does this architecture match the user's technical sophistication? Does this UX match how the customer provisions and onboards? When the user proposes something that conflicts with the ICP, flag it — e.g., "Your ICP says users are non-technical ops managers — does this CLI-based workflow fit their profile?" Do not re-interview on ICP topics already covered — focus on solution design.

Using the project description provided above as a working draft, interview me in detail using the AskUserQuestion tool to validate, refine, and complete the specification. Treat the existing spec as a starting point that requires confirmation rather than settled decisions. Ask me to validate key assumptions and choices from the original document, probe for ambiguities and missing details, and explore edge cases, technical implementation, UI and UX considerations, concerns, and tradeoffs. Ask probing questions that challenge assumptions, explore failure modes, and uncover implicit requirements. Do not assume that what is written in the spec is final since I may deviate from it as we work through the details.

Ask one to three focused questions per turn. When a decision point genuinely has multiple viable approaches, list each option with a clear rationale and provide a simple pros and cons comparison. State your recommendation and explain why you recommend it. For the recommended option, explain how the con can be mitigated if doing so is feasible without compromising core functionality. If mitigation isn't needed, state that explicitly with your reasoning. Only present options when distinct alternatives genuinely exist. Do not manufacture choices or generate artificial options simply to follow this format.

Continue the interview until you have thoroughly covered all aspects of the specification including goals, user stories, technical architecture, data models, APIs, UI flows, edge cases, security, performance, and scope boundaries. **Coverage checkpoint** — Before concluding, use AskUserQuestion to present a structured summary: list each area covered with the key decisions made and the evidence or reasoning that supported each decision. Then ask: "Does this cover everything? Any areas we should revisit or that I missed?"

When finished, write the completed specification to `specs/[topic].md` (create the `specs/` directory if it doesn't exist) where `topic` is a short kebab-case summary of the feature or product being planned. Also create an interview log file named [topic]-__interview.md__. This file should record each turn of the interview including the questions asked, any options presented with their pros and cons evaluation, and my selections and responses. Conclude the file with a summary of any significant deviations from the original spec along with the reasoning behind those changes.

## Kanban Sync

After writing the spec, sync the result to the kanban board:

1. Extract 2-3 distinctive keywords from the topic argument (e.g., "kanban board sync" → search for "kanban board").
2. Search the board across ALL lists (not just Backlog): `search --board <board-id> --query "<keywords>"`
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
