---
name: brainstorm-kanban
description: Evaluate the codebase, suggest ideas, and create kanban Backlog cards for each idea
type: planning
version: 1.0.0
argument-hint: [optional: focus area e.g. "performance", "new features", "DX"]
allowed-tools: Bash(node *)
---

# Brainstorm (Kanban)

Evaluate the current codebase and generate actionable suggestions that the user can take into `/plan-interview-kanban` for deeper exploration and specification. After generating ideas, create a kanban Backlog card for each new idea.

## Kanban Setup

Read and follow the Kanban Setup protocol in `~/.claude/skills/poketo-kanban/KANBAN-SETUP.md` (all sections including Board Overview).

## Process

1. **Understand the project**: Read CLAUDE.md, README, package config, and key source files to understand what the project does, its architecture, tech stack, and current state.
2. **Check existing plans**: Read `tasks/roadmap.md`, `tasks/todo.md`, and specs from `specs/` (or `spec.md`) if they exist to understand work already planned or in progress — avoid suggesting things already covered.
3. **Analyse the codebase** across these dimensions:

   **Strategic / Product**
   - **New features**: Capabilities that would make the project significantly more useful or valuable to its users — think beyond what exists today
   - **New workflows**: End-to-end flows or automation that the project could enable but doesn't yet
   - **Product line expansion**: If the project's core could serve adjacent use cases, new audiences, or spin off complementary products — suggest them
   - **Integration opportunities**: External tools, services, platforms, or APIs that would multiply the project's value

   **Improvement**
   - **Missing capabilities**: Features the project's architecture is set up for but doesn't yet offer
   - **Pain points**: Rough edges, inconsistencies, or manual steps that could be automated
   - **Performance opportunities**: Obvious bottlenecks or low-hanging optimisations
   - **Developer experience**: Build times, debugging ergonomics, onboarding friction

   **Hygiene**
   - **Technical debt**: Areas where the code has outgrown its original design
   - **Testing gaps**: Untested critical paths or missing test infrastructure
   - **Security hardening**: Areas where security posture could be improved

   **Market Fit** (only when `research/icp.md` or `specs/mvp-gap.md` exist)
   - **ICP alignment**: Features that directly address ICP pain points but are missing or incomplete
   - **Journey gaps**: Steps in the user or customer journey where the product loses them
   - **Unaddressed MVP gaps**: Gaps from `specs/mvp-gap.md` not yet tracked in roadmap or todo
   - **Competitive positioning**: Weaknesses relative to the ICP's current alternatives
4. **Scope**: If `$ARGUMENTS` is provided, focus the analysis on that area. Otherwise, cover all dimensions.

## Output

Append the suggestions to `tasks/ideas.md` (do not overwrite existing content). Also display them to the user.

Present suggestions grouped by effort level, with each suggestion framed as a topic ready to hand to `/plan-interview-kanban`:

### Quick wins (hours)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/plan-interview-kanban <topic>`

### Medium efforts (days)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/plan-interview-kanban <topic>`

### Larger initiatives (weeks)
- **Suggestion title** — One-line description of what and why. _Start with:_ `/plan-interview-kanban <topic>`

## Kanban Sync

After generating and displaying the ideas, sync them to the kanban board:

1. For each idea in the output (each `- **Title** — description` bullet):
   a. Extract the title (text between `**...**`)
   b. Search the board for a card with the same name: `search --board <board-id> --query "<title>"`
   c. If a card with that exact name is found → skip (log "Card '<title>' already exists, skipping")
   d. If not found → create in the Backlog list:
      ```bash
      node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs create-card --board <id> --list <backlog-list-id> --name "<title>" --description "<description> | Effort: <category>"
      ```
2. After processing all ideas, report: "Created X new cards in Backlog, skipped Y existing."

## Constraints
- Each suggestion must be specific and actionable — not vague aspirations like "improve testing."
- Include the concrete signal from the codebase that motivates each suggestion (file, pattern, or metric).
- Provide the `/plan-interview-kanban <topic>` prompt the user can copy-paste to kick off planning.
- Limit to 3–5 suggestions per effort level to avoid overwhelming the user.
- Do not suggest changes that conflict with patterns established in CLAUDE.md.
- Do not repeat work already tracked in `tasks/roadmap.md`, `tasks/todo.md`, or `specs/`.
- Kanban operations are additive — if board resolution or any kanban command fails, warn and continue. The brainstorm output to `tasks/ideas.md` must always succeed regardless of kanban state.
