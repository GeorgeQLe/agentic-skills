---
name: plan-interview-ideas
description: Run plan-interview sequentially for each idea in tasks/ideas.md
---

# Plan Interview Ideas

Read `tasks/ideas.md` and run a plan-interview session for each idea listed there, one at a time.

## Workflow

1. Read `tasks/ideas.md` and extract every distinct idea entry. If the user provides a filter keyword, limit to matching ideas.
2. Show the user the list and ask them to confirm, skip any, or reorder.
3. For each idea, run the plan-interview process:
   - Use the idea's title and description as the initial draft.
   - Interview the user: validate assumptions, resolve ambiguities, close gaps.
   - Ask 1–3 focused questions per turn.
   - Only present options when genuinely distinct choices exist — include pros/cons, recommendation, and mitigation.
   - Continue until goals, user stories, architecture, edge cases, and scope are covered.
   - **Coverage checkpoint** — Before concluding each idea, present a structured summary: list each area covered with key decisions made and the evidence/reasoning that supported each. Ask: "Does this cover everything for this idea? Any areas to revisit?"
4. Write deliverables for each completed idea:
   - Write the spec to `specs/[topic].md` (create `specs/` if needed).
   - Write an interview log to `[topic]-interview.md`.
5. After each idea, summarize decisions and move to the next. The user may say "skip" to move on.

## Constraints

- Do not assume any idea description is final — probe and refine.
- Keep each interview focused on its own idea.
- If the user stops partway through, write deliverables for completed ideas and note which remain.
- Do not repeat work already in `tasks/roadmap.md`, `tasks/todo.md`, or `specs/`.
