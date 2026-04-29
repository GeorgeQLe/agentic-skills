---
name: spec-interview
description: Interview to validate and complete a specification
type: planning
version: 1.0.0
argument-hint: "[optional-topic-override] [--ideas]"
---

# Spec Interview

Interview the user to validate, refine, and complete an implementation specification from a concept brief, research-backed opportunity, draft spec, or feature description. For half-formed product ideas, run `/concept-exploration` before this skill.

## Process

1. **Check project designation and research context:**
   - If `.agents/project.json` exists, read `project_type` and `enabled_packs` before choosing a research frame.
   - For `business-app`, read `research/icp.md` when present and ground solution decisions against the ICP.
   - For `game`, read game research artifacts when present: `research/game-audience.md`, `research/game-fantasy.md`, `research/game-core-loop.md`.
   - For `devtool`, read devtool research artifacts when present: `research/devtool-user-map.md`, `research/devtool-dx-journey.md`, `research/devtool-integration-map.md`.
   - If project type is missing or mismatched, recommend `/pack recommend` or `/pack install <pack>` before doing domain-specific planning.
   - If `research/concept-brief.md`, `research/icp.md`, or `research/journey-map.md` exists in a business-app project, treat them as source evidence: does this implementation fit the concept constraints, user and customer journey, path to aha, conversion path, retention loop, champion dynamics, technical sophistication, and provisioning/onboarding model?
   - When the user proposes something that conflicts with the ICP or journey map, flag it — e.g., "The journey map says the buyer needs a demo before sign-up — does this self-serve-only onboarding fit?"
   - Do not re-interview on concept, ICP, or journey topics already covered — focus on technical solution design.

2. **Surface assumptions before probing (Assumptions Manifest):**
   - After reading the draft/prompt and research context but **before** asking deep probing questions, compile and present an **Assumptions Manifest** — a structured list of everything you are taking as given.
   - Tag each assumption with its source:
     - `[from spec]` — explicitly stated in the draft or spec document
     - `[from codebase]` — derived from reading existing code, config, or infrastructure
     - `[from research]` — derived from research docs (ICP, audience, journey maps)
     - `[inferred]` — not stated anywhere; you filled in a default or made a judgment call
   - The manifest must cover these categories at minimum:
     - **Source context**: concept, ICP, journey, and spec inputs being used as product evidence
     - **Implementation goal**: what concrete capability this spec will make buildable
     - **Technical foundation**: stack, hosting, deployment model, existing infra to preserve or replace
     - **Integration risk**: whether this work touches, replaces, or coexists with existing features — and what breaks if the assumption is wrong
     - **Data model**: what persists, what's ephemeral, migration path from current state
     - **API and contract surface**: routes, events, SDKs, schemas, external integrations, or CLI contracts
     - **Operational requirements**: security, privacy, permissions, performance, observability, and failure handling
   - Present the manifest using AskUserQuestion and explicitly ask the user to confirm, correct, or flag any assumption before proceeding. Do not continue the interview until the user has reviewed the manifest.
   - If any `[inferred]` assumption is corrected, note the correction — these corrections are high-signal for downstream risk and must appear in the interview log.

3. **Conduct the interview:**
   - Use the project description provided as a working draft. Treat the existing spec as a starting point that requires confirmation rather than settled decisions.
   - Ask the user to validate key assumptions and choices from the original document.
   - Probe for ambiguities and missing details, and explore edge cases, technical implementation, interfaces, data flow, operational concerns, and tradeoffs.
   - Ask probing questions that challenge assumptions, explore failure modes, and uncover implicit requirements. Do not assume that what is written in the spec is final since the user may deviate from it.
   - Ask one to three focused questions per turn.
   - **Research and recommend by default.** For each decision point, use web search, upstream research docs (`research/*.md`), and codebase analysis to gather evidence before asking the user. Present your findings with data, state your recommendation with reasoning, and ask the user to approve, adjust, or override. When a decision point genuinely has multiple viable approaches, list each option with a clear rationale, pros/cons, and your recommendation with reasoning. For the recommended option, explain how the con can be mitigated if feasible. Only ask the user to choose without a recommendation when the decision genuinely requires insider knowledge (internal constraints, personal preferences, strategic bets). Do not manufacture choices.

4. **Cover all areas:**
   - Continue until you have thoroughly covered: implementation goals, technical architecture, data models, APIs/contracts, migrations, edge cases, security, performance, observability, test strategy, and scope boundaries.
   - **Coverage checkpoint** — Before concluding, use AskUserQuestion to present a structured summary: list each area covered with the key decisions made and the evidence or reasoning that supported each decision. Then ask: "Does this cover everything? Any areas we should revisit or that I missed?"

5. **Write outputs:**
   - Write the completed specification to `specs/[topic].md` (create the `specs/` directory if it doesn't exist) where `topic` is a short kebab-case summary.
   - The spec must use these canonical section headings (unnumbered):
     - `## Overview`
     - `## Goals`
     - `## Non-Goals`
     - `## Detailed Design` (architecture, data models, APIs, UI flows)
     - `## Edge Cases`
     - `## Test Plan`
     - `## Acceptance Criteria`
     - `## Open Questions`
     - `## Assumptions & Risks` (the manifest output)
     Additional topic-specific sections (e.g. `## Data Model`, `## Security`) may appear between Detailed Design and Edge Cases. Do not number sections.
   - Append an **Assumptions & Risks** section to the end of the spec listing: each assumption that was confirmed or corrected during the manifest review, its source tag, and the downstream risk if the assumption turns out to be wrong later. Flag any `[inferred]` assumptions that were never explicitly confirmed by the user.
   - Create an interview log file named `[topic]-interview.md` recording each turn of the interview including questions asked, options presented with pros/cons, and user selections. The log must include the full Assumptions Manifest as presented, user corrections, and a summary of significant deviations from the original spec.

## Output Format

Two files written:

- `specs/[topic].md` — the completed specification
- `[topic]-interview.md` — full interview log with deviation summary

After writing the files, tell the user the next step based on available context: for user-facing work with no journey map, run `/journey-map`; for user-facing work with a journey map but no experience variants, run `/ux-variation`; for user-facing work with a chosen experience plan but no UI spec, run `/ui-interview`; otherwise run `/roadmap` to sequence specs into phases and seed Phase 1 implementation. Do not invoke the next skill automatically — the user may want to run multiple planning sessions first.

If the interview identifies follow-up work that is itself a named skill, recommend invoking that skill directly instead of phrasing it as another `/spec-interview` run. For example: say "run `/icp` and `/monetization`, then `/roadmap`" rather than "run `/spec-interview` for `/icp` and `/monetization`." This applies to research and planning skills such as `/icp`, `/monetization`, `/metrics`, `/positioning`, and `/competitive-analysis`.

## Next-Step Routing

Before handing back, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal report:

- **Next work:** <specific planning, research, or execution task>
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. For user-facing completed specs, prefer missing journey, UX variation, and UI interview work before roadmap. If follow-up research skills were identified, name those first. Use roadmap only when product, journey, UX, and UI planning are complete enough for implementation sequencing or the work has no meaningful human-facing interface.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Claude slash invocation (`/spec-interview`, `/roadmap`, `/delegate`) or orchestration-heavy work → recommend the matching `/...` route.
  - Codex skill invocation (`$spec-interview`, `$roadmap`) → recommend the matching `$...` command.
  - Manual or evidence-gathering work that needs browser access → recommend `/guide` or a Claude-guided manual step.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

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
3. For each idea, run the standard interview process using the idea's title and description as the initial implementation draft. If an idea is still only a raw concept, route it to `/concept-exploration` first.
4. Write deliverables (`specs/[topic].md` and `[topic]-interview.md`) for each completed idea.
5. After each idea, summarize decisions and move to the next. The user may say "skip" to move on.

If the user stops partway through, write deliverables for completed ideas and note which remain.

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
