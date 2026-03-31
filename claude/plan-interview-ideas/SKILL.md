---
name: plan-interview-ideas
description: Run plan-interview sequentially for each idea in tasks/ideas.md
type: planning
version: 1.0.0
argument-hint: [optional: filter keyword to limit which ideas to interview]
---

# Plan Interview Ideas

Read `tasks/ideas.md` and run a plan-interview session for each idea listed there, one at a time.

## Process

1. **Parse ideas**: Read `tasks/ideas.md` and extract every distinct suggestion/idea entry. If `$ARGUMENTS` is provided, filter to only ideas whose title or description matches that keyword.
2. **Present the list**: Show the user the list of ideas that will be interviewed and ask them to confirm, remove any they want to skip, or reorder.
3. **Interview each idea sequentially**: For each idea, run the same interview process as `/plan-interview`:
   - Treat the idea's title and description as the initial draft.
   - Interview the user to validate assumptions, resolve ambiguities, and close gaps.
   - Ask 1–3 focused questions per turn using the AskUserQuestionTool.
   - Only present options when genuinely distinct choices exist — include pros/cons, a recommendation, and mitigation for downsides.
   - Continue until goals, user stories, architecture, edge cases, and scope boundaries are covered for that idea.
   - **Coverage checkpoint** — Before concluding each idea's interview, use AskUserQuestion to present a structured summary: list each area covered with key decisions made and the evidence or reasoning that supported each. Ask: "Does this cover everything for this idea? Any areas to revisit?"
4. **Write deliverables for each idea**:
   - Write the completed spec to `specs/[topic].md` where `topic` is a short kebab-case summary of the idea. Create the `specs/` directory if it doesn't exist.
   - Write an interview log to `[topic]-interview.md`.
5. **Transition**: After finishing one idea's interview, briefly summarize what was decided and move to the next idea. The user may say "skip" to move past any idea.

## Constraints

- Do not assume any idea's description is final — probe and refine during the interview.
- Keep each idea's interview focused on that idea; do not blend concerns across ideas.
- If the user wants to stop partway through, write deliverables for all completed ideas and note which remain unaddressed.
- Do not repeat work already tracked in `tasks/roadmap.md`, `tasks/todo.md`, or `specs/`.
