---
name: spec-interview
description: Post-prototype production deep dive — walks through consolidated prototype screen by screen to extract production specifications
type: planning
version: 1.0.0
argument-hint: "[--ideas]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

## Prototype Gate

Before starting the interview process, verify:

1. A consolidated prototype exists at `prototypes/{topic}/consolidated/`. If missing, halt and recommend `$consolidate-variations` first.
2. All research tasks from the `--post-prototype` pass are completed — check `tasks/todo.md` for unchecked items under `## Priority Documentation Todo` that reference post-prototype research. If unchecked post-prototype items remain, halt and recommend completing those first.

If both gates pass, proceed with the interview.

# Spec Interview

Invoke as `$spec-interview`.

Use this skill when the user has a consolidated prototype and research context that needs to be turned into a complete production implementation specification. For half-formed product ideas, run `$concept-exploration` before this skill.

## Workflow

1. **Read consolidated prototype and research context:**
   - Read the consolidated prototype directory at `prototypes/{topic}/consolidated/` as the primary input. Walk through every screen, component, and interaction in the prototype to understand the current state.
   - Check `.agents/project.json` first. If it exists, use `project_type` and `enabled_packs` to choose the right research frame:
     - `business-app` → use business research artifacts such as `research/icp.md`.
     - `game` → use game artifacts such as `research/game-audience.md`, `research/game-fantasy.md`, and `research/game-core-loop.md`.
     - `devtool` → use devtool artifacts such as `research/devtool-user-map.md`, `research/devtool-dx-journey.md`, and `research/devtool-integration-map.md`.
   - If project type is missing or mismatched, recommend `$pack recommend` or `$pack install <pack>` before doing domain-specific planning.
   - For business-app projects, check if `research/concept-brief.md`, `research/icp.md`, and `research/journey-map.md` exist. Read them as source evidence — ground implementation decisions against the concept constraints, ICP, user journey, customer journey, technical sophistication, customer provisioning model, path to aha, conversion path, retention loop, and champion dynamics. If lifecycle evidence is missing and the `customer-lifecycle` pack is not enabled, recommend `$pack install customer-lifecycle` before `$journey-map`. Flag conflicts (e.g., "Journey map says the buyer needs a demo before sign-up — does this self-serve-only onboarding fit?"). Do not re-interview on concept, ICP, or journey topics already covered.

2. **Surface a prototype-grounded assumptions checkpoint before probing:**
   - After reading the consolidated prototype and research context but **before** asking deep probing questions, present a concise **Assumptions Checkpoint** grounded in what the prototype reveals.
   - Tag each assumption with its source:
     - `[from spec]` — explicitly stated in the draft or spec document
     - `[from codebase]` — derived from reading existing code, config, or infrastructure
     - `[from research]` — derived from research docs (ICP, audience, journey maps)
     - `[from prototype]` — derived from the consolidated prototype
     - `[inferred]` — not stated anywhere; you filled in a default or made a judgment call
   - Keep the checkpoint short enough to preserve interview momentum: normally 3 to 7 bullets, grouped only when useful. Do not dump a comprehensive manifest unless the user explicitly asks to review assumptions first.
   - Bias the checkpoint toward assumptions that are uncertain, risky, contradicted by evidence, or likely to change data/API/architecture choices. Omit obvious restatements that can be captured later in the spec.
   - Focus the checkpoint on what the prototype assumes vs what production needs:
     - What the prototype assumes about **data model** — what's fake/fixture vs what needs real persistence
     - What the prototype assumes about **auth** — none? mock? real?
     - What **fake data needs to become real** — hardcoded lists, mock APIs, placeholder content
     - What **missing infrastructure** is needed — database, auth, payments, analytics, deployment
     - What **error/empty states** the prototype skips vs what production needs
   - Immediately follow the checkpoint with one focused interview question. Do not stop at the assumptions checkpoint unless the user explicitly asks to pause and review assumptions first.
   - If any `[inferred]` assumption is corrected, note the correction — these corrections are high-signal for downstream risk and must appear in the interview log.

3. **Screen-by-screen prototype walkthrough:**
   - Walk through each screen/page in the consolidated prototype. For each screen, probe:
     - **Data model?** What entities, relationships, persistence does this screen need?
     - **API calls?** What endpoints, payloads, error responses?
     - **Auth?** What permissions, roles, access control apply to this screen?
     - **Empty/error states?** What happens when data is missing, requests fail, or the user has no content yet?
     - **Performance?** Loading states, pagination, caching needs?
     - **Analytics?** What events should be tracked on this screen?
   - Codex interview cadence: ask one primary decision question per turn by default. Use short follow-up bullets only when they clarify the same decision, not to batch unrelated questions.
   - If the session is already in Plan mode, `request_user_input` may present 2-3 real options for the current material decision. Otherwise ask one concise direct question in plain text.
   - **Research and recommend by default.** Use web search, upstream research docs, and codebase analysis to gather evidence before asking the user. Assume the user has no insider knowledge unless they explicitly provide it. Present findings with data, define relevant terms, state a recommendation with reasoning, and ask the user to approve, adjust, or override based on hard constraints, proprietary facts, or corrections. Only present options without a recommendation when internal constraints, preferences, or missing facts make evidence insufficient. For each real choice:
     - Explain the options with evidence
     - Give a brief pros and cons comparison
     - State a recommendation and why
     - Explain how to mitigate the recommended option's downside when useful

4. **Iterative prototype updates:**
   - When the interview reveals gaps in the prototype (missing screens, unclear flows, absent states), ask: "Should I update the prototype to add [gap]? This may warrant re-running upstream steps."
   - The user decides per-update whether to update the prototype now or note it for production implementation only.
   - If the user approves a prototype update, make the change and note it in the interview log before continuing.

5. **Cover all areas:**
   - Continue until implementation goals, architecture, data models, APIs/contracts, migrations, edge cases, security, performance, observability, test strategy, and scope boundaries are all covered.
   - **Coverage checkpoint** — Before concluding, present a structured summary: list each area covered with key decisions made and the evidence/reasoning that supported each. Ask: "Does this cover everything? Any constraints, missing facts, or areas to revisit?"

## Deliverables

- Write the completed specification to `specs/[topic].md` (create the `specs/` directory if needed), where `topic` is a short kebab-case summary
- The spec must use these canonical section headings (unnumbered):
  - `## Overview`
  - `## Goals`
  - `## Non-Goals`
  - `## Detailed Design` (architecture, data models, APIs, UI flows)
  - `## Edge Cases`
  - `## Test Plan`
  - `## Acceptance Criteria`
  - `## Open Questions`
  - `## Assumptions & Risks` (the checkpoint output)
  Additional topic-specific sections (e.g. `## Data Model`, `## Security`) may appear between Detailed Design and Edge Cases. Do not number sections.
- Write an interview log to `[topic]-interview.md`

The interview log should include:

- The Assumptions Checkpoint as presented, with user corrections noted
- Each question asked
- Options presented, if any
- The user's responses and chosen direction
- A closing summary of significant deviations from the initial draft and why they changed

Append an **Assumptions & Risks** section to the end of the spec listing: each checkpoint assumption that was confirmed, corrected, or left unresolved during the interview, its source tag, and the downstream risk if the assumption turns out to be wrong later. Flag any `[inferred]` assumptions that were never explicitly confirmed by the user.

### Alignment Page

After writing deliverables, build a custom HTML alignment page at `alignment/spec-interview-{topic}.html` and attempt to open it in the browser and report whether the browser open succeeded or was blocked. The page should visualize the spec's architecture, data model, API surface, and key decisions in a format tailored to the specific spec produced. Archive any previous alignment page at that path first to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/...`.

Do not use a shared template or CSS framework — craft the page to fit the situation.

## Next-Step Routing

After writing the files, tell the user the next step based on available context: if research artifacts are stale or missing, run `$research-roadmap --post-spec`; otherwise run `$roadmap` to sequence specs into phases and seed Phase 1 implementation. Treat `$research-roadmap --post-spec` as the primary next route after a completed or updated spec when research gaps exist, and `$roadmap` as the default when research is current. Do not invoke the next skill automatically — the user may want to run multiple planning sessions first.

If the interview identifies follow-up work that is itself a named skill, recommend invoking that skill directly instead of phrasing it as another `$spec-interview` run. For example: say "run `$icp` and `$monetization`, then `$roadmap`" rather than "run `$spec-interview` for `$icp` and `$monetization`." This applies to research and planning skills such as `$icp`, `$monetization`, `$metrics`, `$positioning`, and `$competitive-analysis`. For these pack-based skills, apply the Pack Availability Guard — if the target skill's pack is not in `.agents/project.json` `enabled_packs`, recommend `$pack install <pack>` before the skill.

Before handing back, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal report:

- **Next work:** <specific planning, research, or execution task>
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. If follow-up research skills were identified, name those first. Use `$research-roadmap --post-spec` when research gaps were surfaced during the interview. Use `$roadmap` when research is current and the spec is ready for implementation sequencing.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Codex skill invocation (`$spec-interview`, `$roadmap`) → recommend the matching `$...` command.
  - Claude slash invocation (`/spec-interview`, `/roadmap`, `/delegate`) or orchestration-heavy work → recommend the matching `/...` route.
  - Manual or evidence-gathering work that needs browser access → recommend `$guide` or a Claude-guided manual step.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

## Constraints

- Do not assume draft text is final.
- Keep probing until the spec is decision-complete enough to implement.

## Ideas Mode (`--ideas`)

When `$ARGUMENTS` contains `--ideas`, read `tasks/ideas.md` and run the interview process for each idea sequentially.

1. Read `tasks/ideas.md` and extract every distinct idea entry. If a filter keyword is provided, limit to matching ideas.
2. Show the user the list and ask them to confirm, skip any, or reorder.
3. For each idea, run the standard interview process using the idea's title and description as the initial implementation draft. If an idea is still only a raw concept, route it to `$concept-exploration` first.
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

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
