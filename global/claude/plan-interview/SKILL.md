---
name: plan-interview
description: Interview to validate and complete a specification
type: planning
version: 1.0.0
argument-hint: "[optional-topic-override] [--ideas]"
---

# Plan Interview

Interview the user to validate, refine, and complete a specification from a rough idea.

## Process

1. **Check project designation and research context:**
   - If `.agents/project.json` exists, read `project_type` and `enabled_packs` before choosing a research frame.
   - For `business-app`, read `research/icp.md` when present and ground solution decisions against the ICP.
   - For `game`, read game research artifacts when present: `research/game-audience.md`, `research/game-fantasy.md`, `research/game-core-loop.md`.
   - For `devtool`, read devtool research artifacts when present: `research/devtool-user-map.md`, `research/devtool-dx-journey.md`, `research/devtool-integration-map.md`.
   - If project type is missing or mismatched, recommend `/pack recommend` or `/pack install <pack>` before doing domain-specific planning.
   - If `research/icp.md` exists in a business-app project, treat it as foundational context: does this feature serve the user journey? Does this architecture match the user's technical sophistication? Does this UX match how the customer provisions and onboards?
   - When the user proposes something that conflicts with the ICP, flag it — e.g., "Your ICP says users are non-technical ops managers — does this CLI-based workflow fit their profile?"
   - Do not re-interview on ICP topics already covered — focus on solution design.

2. **Conduct the interview:**
   - Use the project description provided as a working draft. Treat the existing spec as a starting point that requires confirmation rather than settled decisions.
   - Ask the user to validate key assumptions and choices from the original document.
   - Probe for ambiguities and missing details, and explore edge cases, technical implementation, UI and UX considerations, concerns, and tradeoffs.
   - Ask probing questions that challenge assumptions, explore failure modes, and uncover implicit requirements. Do not assume that what is written in the spec is final since the user may deviate from it.
   - Ask one to three focused questions per turn.
   - **Research and recommend by default.** For each decision point, use web search, upstream research docs (`research/*.md`), and codebase analysis to gather evidence before asking the user. Present your findings with data, state your recommendation with reasoning, and ask the user to approve, adjust, or override. When a decision point genuinely has multiple viable approaches, list each option with a clear rationale, pros/cons, and your recommendation with reasoning. For the recommended option, explain how the con can be mitigated if feasible. Only ask the user to choose without a recommendation when the decision genuinely requires insider knowledge (internal constraints, personal preferences, strategic bets). Do not manufacture choices.

3. **Cover all areas:**
   - Continue until you have thoroughly covered: goals, user stories, technical architecture, data models, APIs, UI flows, edge cases, security, performance, and scope boundaries.
   - **Coverage checkpoint** — Before concluding, use AskUserQuestion to present a structured summary: list each area covered with the key decisions made and the evidence or reasoning that supported each decision. Then ask: "Does this cover everything? Any areas we should revisit or that I missed?"

4. **Write outputs:**
   - Write the completed specification to `specs/[topic].md` (create the `specs/` directory if it doesn't exist) where `topic` is a short kebab-case summary.
   - Create an interview log file named `[topic]-interview.md` recording each turn of the interview including questions asked, options presented with pros/cons, and user selections. Conclude with a summary of significant deviations from the original spec.

## Output Format

Two files written:

- `specs/[topic].md` — the completed specification
- `[topic]-interview.md` — full interview log with deviation summary

## Constraints

- Use AskUserQuestion for all interview turns — do not assume answers.
- One to three focused questions per turn, not more.
- Do not re-interview on ICP topics already covered in `research/icp.md`.
- Do not conclude the interview without explicit user confirmation that all areas are addressed.

## Ideas Mode (`--ideas`)

When `$ARGUMENTS` contains `--ideas`, read `tasks/ideas.md` and run the interview process for each idea sequentially.

### Process

1. Read `tasks/ideas.md` and extract every distinct idea entry. If `$ARGUMENTS` includes a filter keyword (beyond `--ideas`), limit to matching ideas.
2. Show the user the list and ask them to confirm, skip any, or reorder.
3. For each idea, run the standard interview process using the idea's title and description as the initial draft.
4. Write deliverables (`specs/[topic].md` and `[topic]-interview.md`) for each completed idea.
5. After each idea, summarize decisions and move to the next. The user may say "skip" to move on.

If the user stops partway through, write deliverables for completed ideas and note which remain.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
