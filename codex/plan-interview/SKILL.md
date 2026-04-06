---
name: plan-interview
description: Interview to validate and complete a specification
argument-hint: "[--kanban] [--ideas]"
---

# Plan Interview

Use this skill when the user has a draft spec, feature description, or rough idea that needs to be validated and turned into a complete implementation specification.

## Workflow

1. Check if `research/icp.md` exists. If so, read it and use it as foundational context — ground solution decisions against the ICP's user journey, technical sophistication, and customer provisioning model. Flag conflicts (e.g., "ICP says users are non-technical — does this CLI workflow fit?"). Do not re-interview on ICP topics.
2. Treat the existing spec or prompt as a draft, not a final decision record.
2. Interview the user in depth to validate assumptions, resolve ambiguities, and close gaps.
3. If the session is already in Plan mode, prefer `request_user_input` for material decisions with 2-3 real options. Otherwise ask concise direct questions in plain text.
4. Ask 1 to 3 focused questions per turn.
5. **Research and recommend by default.** Use web search, upstream research docs, and codebase analysis to gather evidence before asking the user. Present findings with data, state recommendation with reasoning, user approves/adjusts/overrides. Only present options without a recommendation when insider knowledge is required. For each real choice:
   - Explain the options with evidence
   - Give a brief pros and cons comparison
   - State a recommendation and why
   - Explain how to mitigate the recommended option's downside when useful
6. Continue until goals, user stories, architecture, data models, APIs, UX flows, edge cases, security, performance, and scope boundaries are all covered.
7. **Coverage checkpoint** — Before concluding, present a structured summary: list each area covered with key decisions made and the evidence/reasoning that supported each. Ask: "Does this cover everything? Any areas to revisit?"

## Deliverables

- Write the completed specification to `specs/[topic].md` (create the `specs/` directory if needed), where `topic` is a short kebab-case summary
- Write an interview log to `[topic]-interview.md`

The interview log should include:

- Each question asked
- Options presented, if any
- The user's responses and chosen direction
- A closing summary of significant deviations from the initial draft and why they changed

## Constraints

- Do not assume draft text is final.
- Keep probing until the spec is decision-complete enough to implement.

## Kanban Mode (`--kanban`)

When `$ARGUMENTS` contains `--kanban`, perform kanban operations after writing the spec.

### Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask the user. If the session is already in Plan mode and there are 2-3 concrete board choices, prefer `request_user_input`; otherwise ask a concise plain-text question. If no boards exist, offer to create one with `create-board --name "$(basename $(pwd))" --template standard`.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `create-list`.
3. If poketo-kanban scripts are missing or DB is unreachable, warn and continue without kanban.
4. **Board Overview:** Fetch board state and display a brief summary.

All kanban commands use: `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs <command>`

### Kanban Sync

After writing the spec:

1. Extract 2-3 keywords from the topic argument.
2. Search the board across ALL lists: `search --query "<keywords>"`
3. If 1 match → update card description with spec summary and file path. Do not move the card — update in place. Never move backward from Done/Punt.
4. If multiple → list cards and ask the user to pick. If in Plan mode with 2-3 choices, prefer `request_user_input`.
5. If 0 → create new card in Backlog with spec details.
6. Report which card was updated or created.

Kanban operations are additive — if any kanban command fails, warn and continue. Spec output must always succeed. Never move cards backward from Done or Punt.

## Ideas Mode (`--ideas`)

When `$ARGUMENTS` contains `--ideas`, read `tasks/ideas.md` and run the interview process for each idea sequentially.

1. Read `tasks/ideas.md` and extract every distinct idea entry. If a filter keyword is provided, limit to matching ideas.
2. Show the user the list and ask them to confirm, skip any, or reorder.
3. For each idea, run the standard interview process using the idea's title and description as the initial draft.
4. Write deliverables (`specs/[topic].md` and `[topic]-interview.md`) for each completed idea.
5. After each idea, summarize decisions and move to the next. The user may say "skip".
6. If the user stops partway through, write deliverables for completed ideas and note which remain.

Do not repeat work already in `tasks/roadmap.md`, `tasks/todo.md`, or `specs/`.
