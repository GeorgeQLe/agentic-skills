---
name: plan-interview-kanban
description: Interview to validate and complete a specification, then update the matching kanban Backlog card with spec details
---

# Plan Interview (Kanban)

Use this skill when the user has a draft spec, feature description, or rough idea that needs to be validated and turned into a complete implementation specification. After writing the spec, updates the matching kanban card.

## Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask user. If no boards, offer to create one with `create-board --name "$(basename $(pwd))" --template standard`.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `create-list`.
3. If poketo-kanban scripts are missing or DB is unreachable, warn and continue without kanban.
4. **Board Overview:** Fetch board state and display a brief summary — overdue cards, starred/high-priority items, blocked cards, In Progress/Backlog/Todo counts. Informational only, no actions taken.

All kanban commands use: `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs <command>`

## Workflow

1. Check if `research/icp.md` exists. If so, read it and use it as foundational context — ground solution decisions against the ICP's user journey, technical sophistication, and customer provisioning model. Flag conflicts. Do not re-interview on ICP topics.
2. Treat the existing spec or prompt as a draft, not a final decision record.
3. Interview the user in depth to validate assumptions, resolve ambiguities, and close gaps.
4. Prefer Codex's structured user-input flow for material decisions when available; otherwise ask concise direct questions.
5. Ask 1 to 3 focused questions per turn.
6. Only present options when there are genuinely distinct choices. For each real choice: explain options, give pros/cons, state recommendation.
7. Continue until goals, user stories, architecture, data models, APIs, UX flows, edge cases, security, performance, and scope boundaries are all covered.
8. **Coverage checkpoint** — Before concluding, present a structured summary: list each area covered with key decisions made and the evidence/reasoning that supported each. Ask: "Does this cover everything? Any areas to revisit?"

## Deliverables

- Write the completed specification to `specs/[topic].md` (create `specs/` if needed)
- Write an interview log to `[topic]-interview.md`

## Kanban Sync

After writing the spec:
1. Extract 2-3 keywords from the topic argument
2. Search the board across ALL lists: `search --query "<keywords>"`
3. If 1 match → update card description with spec summary and file path. Do not move the card — update in place. Never move backward from Done/Punt.
4. If multiple → list cards, ask user to pick
5. If 0 → create new card in Backlog with spec details
6. Report which card was updated or created

## Constraints

- Do not assume draft text is final.
- Keep probing until the spec is decision-complete enough to implement.
- Kanban operations are additive — if any kanban command fails, warn and continue. Spec output must always succeed.
- Never move cards backward from Done or Punt.
