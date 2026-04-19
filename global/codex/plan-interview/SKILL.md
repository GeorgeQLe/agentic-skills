---
name: plan-interview
description: Interview to validate and complete a specification
type: planning
version: 1.0.0
argument-hint: "[--ideas]"
---

# Plan Interview

Invoke as `$plan-interview`.

Use this skill when the user has a draft spec, feature description, or rough idea that needs to be validated and turned into a complete implementation specification.

## Workflow

1. Check `.agents/project.json` first. If it exists, use `project_type` and `enabled_packs` to choose the right research frame:
   - `business-app` → use business research artifacts such as `research/icp.md`.
   - `game` → use game artifacts such as `research/game-audience.md`, `research/game-fantasy.md`, and `research/game-core-loop.md`.
   - `devtool` → use devtool artifacts such as `research/devtool-user-map.md`, `research/devtool-dx-journey.md`, and `research/devtool-integration-map.md`.
   If project type is missing or mismatched, recommend `$pack recommend` or `$pack install <pack>` before doing domain-specific planning.
2. For business-app projects, check if `research/icp.md` exists. If so, read it and use it as foundational context — ground solution decisions against the ICP's user journey, technical sophistication, and customer provisioning model. Flag conflicts (e.g., "ICP says users are non-technical — does this CLI workflow fit?"). Do not re-interview on ICP topics.
3. Treat the existing spec or prompt as a draft, not a final decision record.
4. Interview the user in depth to validate assumptions, resolve ambiguities, and close gaps.
5. If the session is already in Plan mode, prefer `request_user_input` for material decisions with 2-3 real options. Otherwise ask concise direct questions in plain text.
6. Ask 1 to 3 focused questions per turn.
7. **Research and recommend by default.** Use web search, upstream research docs, and codebase analysis to gather evidence before asking the user. Assume the user has no insider knowledge unless they explicitly provide it. Present findings with data, define relevant terms, state a recommendation with reasoning, and ask the user to approve, adjust, or override based on hard constraints, proprietary facts, or corrections. Only present options without a recommendation when internal constraints, preferences, or missing facts make evidence insufficient. For each real choice:
   - Explain the options with evidence
   - Give a brief pros and cons comparison
   - State a recommendation and why
   - Explain how to mitigate the recommended option's downside when useful
8. Continue until goals, user stories, architecture, data models, APIs, UX flows, edge cases, security, performance, and scope boundaries are all covered.
9. **Coverage checkpoint** — Before concluding, present a structured summary: list each area covered with key decisions made and the evidence/reasoning that supported each. Ask: "Does this cover everything? Any constraints, missing facts, or areas to revisit?"

## Deliverables

- Write the completed specification to `specs/[topic].md` (create the `specs/` directory if needed), where `topic` is a short kebab-case summary
- Write an interview log to `[topic]-interview.md`

The interview log should include:

- Each question asked
- Options presented, if any
- The user's responses and chosen direction
- A closing summary of significant deviations from the initial draft and why they changed

After writing the files, tell the user the next step: run `$roadmap` to sequence specs into phases and seed Phase 1 implementation. Do not invoke `$roadmap` automatically — the user may want to run multiple `$plan-interview` sessions first.

If the interview identifies follow-up work that is itself a named skill, recommend invoking that skill directly instead of phrasing it as another `$plan-interview` run. For example: say "run `$icp` and `$monetization`, then `$roadmap`" rather than "run `$plan-interview` for `$icp` and `$monetization`." This applies to research and planning skills such as `$icp`, `$monetization`, `$metrics`, `$positioning`, and `$competitive-analysis`.

## Mode-aware next-step recommendation

Before handing back to the user, resolve the effective agent mode via `./scripts/agent-mode.sh` and emit exactly one recommendation line matching the resolved agent mode via scripts/agent-mode.sh:

- `hybrid` → **Next:** return to Claude for the next orchestration step (run `/roadmap` there) — Claude orchestrates in hybrid; do not delegate further from Codex.
- `codex-only` → **Next:** run `$roadmap` — stay in Codex.
- `claude-only` → **Next:** switch to Claude and run `/roadmap` — Codex is not the planner in this mode.
- unset → present all three options and point the user at `docs/operating-modes.md` for mode-signal resolution rules.

Keep it to one line beyond the normal report; do not restate mode-signal precedence in skill copy.

## Constraints

- Do not assume draft text is final.
- Keep probing until the spec is decision-complete enough to implement.

## Ideas Mode (`--ideas`)

When `$ARGUMENTS` contains `--ideas`, read `tasks/ideas.md` and run the interview process for each idea sequentially.

1. Read `tasks/ideas.md` and extract every distinct idea entry. If a filter keyword is provided, limit to matching ideas.
2. Show the user the list and ask them to confirm, skip any, or reorder.
3. For each idea, run the standard interview process using the idea's title and description as the initial draft.
4. Write deliverables (`specs/[topic].md` and `[topic]-interview.md`) for each completed idea.
5. After each idea, summarize decisions and move to the next. The user may say "skip".
6. If the user stops partway through, write deliverables for completed ideas and note which remain.

Do not repeat work already in `tasks/roadmap.md`, `tasks/todo.md`, or `specs/`.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
