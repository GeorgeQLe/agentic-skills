---
name: plan-interview
description: Run a detailed requirements interview from an existing draft spec or project description, use Codex's user-input flow for material decisions, and finish by writing a completed spec plus an interview log.
---

# Plan Interview

Use this skill when the user has a draft spec, feature description, or rough idea that needs to be validated and turned into a complete implementation specification.

## Workflow

1. Check if `research/icp.md` exists. If so, read it and use it as foundational context — ground solution decisions against the ICP's user journey, technical sophistication, and customer provisioning model. Flag conflicts (e.g., "ICP says users are non-technical — does this CLI workflow fit?"). Do not re-interview on ICP topics.
2. Treat the existing spec or prompt as a draft, not a final decision record.
2. Interview the user in depth to validate assumptions, resolve ambiguities, and close gaps.
3. Prefer Codex's structured user-input flow for material decisions when available; otherwise ask concise direct questions.
4. Ask 1 to 3 focused questions per turn.
5. Only present options when there are genuinely distinct choices. For each real choice:
   - Explain the options
   - Give a brief pros and cons comparison
   - State a recommendation and why
   - Explain how to mitigate the recommended option's downside when useful
6. Continue until goals, user stories, architecture, data models, APIs, UX flows, edge cases, security, performance, and scope boundaries are all covered.
7. Confirm with the user before concluding that all major areas have been addressed.

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
