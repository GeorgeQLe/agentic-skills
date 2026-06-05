---
name: spec-interview
description: Post-prototype production deep dive — walks through consolidated prototype screen by screen to extract production specifications
type: planning
version: v0.7
argument-hint: "[optional-topic-override] [--ideas]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

## Prototype Gate

Before starting the interview process, verify:

1. A consolidated prototype exists at `prototypes/{topic}/consolidated/`. If missing, halt and recommend `/consolidate-variations` first.
2. All research tasks from the `--post-prototype` pass are completed — check `tasks/todo.md` for unchecked items under `## Priority Documentation Todo` that reference post-prototype research. If unchecked post-prototype items remain, halt and recommend completing those first.

If both gates pass, proceed with the interview.

# Spec Interview

Interview the user to validate, refine, and complete an implementation specification from a consolidated prototype and research context. For half-formed product ideas, run `/idea-scope-brief` before this skill.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

1. **Read consolidated prototype and research context:**
   - Read the consolidated prototype directory at `prototypes/{topic}/consolidated/` as the primary input. Walk through every screen, component, and interaction in the prototype to understand the current state.
   - If `.agents/project.json` exists, read `project_type` and `enabled_packs` before choosing a research frame.
   - For `business-app`, read `research/icp.md` when present and ground solution decisions against the ICP.
   - For `game`, read game research artifacts when present: `research/game-audience.md`, `research/game-fantasy.md`, `research/game-core-loop.md`.
   - For `devtool`, read devtool research artifacts when present: `research/devtool-user-map.md`, `research/devtool-dx-journey.md`, `research/devtool-integration-map.md`.
   - If project type is missing or mismatched, recommend `/pack recommend` or `/pack install <pack>` before doing domain-specific planning.
   - If `research/idea-brief.md`, `research/icp.md`, or `research/journey-map.md` exists in a business-app project, treat them as source evidence: does this implementation fit the concept constraints, user and customer journey, path to aha, conversion path, retention loop, champion dynamics, technical sophistication, and provisioning/onboarding model?
   - If lifecycle evidence is missing and the `customer-lifecycle` pack is not enabled, recommend `/pack install customer-lifecycle` before `/journey-map`.
   - When the user proposes something that conflicts with the ICP or journey map, flag it — e.g., "The journey map says the buyer needs a demo before sign-up — does this self-serve-only onboarding fit?"
   - Do not re-interview on concept, ICP, or journey topics already covered — focus on technical solution design.

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
   - Present the checkpoint with the first AskUserQuestion turn and immediately include 1 to 3 focused interview questions. Do not stop at the assumptions checkpoint unless the user explicitly asks to pause and review assumptions first.
   - If any `[inferred]` assumption is corrected, note the correction — these corrections are high-signal for downstream risk and must appear in the interview log.

3. **Screen-by-screen prototype walkthrough:**
   - Walk through each screen/page in the consolidated prototype. For each screen, use AskUserQuestion to probe:
     - **Data model?** What entities, relationships, persistence does this screen need?
     - **API calls?** What endpoints, payloads, error responses?
     - **Auth?** What permissions, roles, access control apply to this screen?
     - **Empty/error states?** What happens when data is missing, requests fail, or the user has no content yet?
     - **Performance?** Loading states, pagination, caching needs?
     - **Analytics?** What events should be tracked on this screen?
   - Ask one to three focused questions per turn.
   - **Research and recommend by default.** For each decision point, use web search, upstream research docs (`research/*.md`), and codebase analysis to gather evidence before asking the user. Present your findings with data, state your recommendation with reasoning, and ask the user to approve, adjust, or override. When a decision point genuinely has multiple viable approaches, list each option with a clear rationale, pros/cons, and your recommendation with reasoning. For the recommended option, explain how the con can be mitigated if feasible. Only ask the user to choose without a recommendation when the decision genuinely requires insider knowledge (internal constraints, personal preferences, strategic bets). Do not manufacture choices.

4. **Iterative prototype updates:**
   - When the interview reveals gaps in the prototype (missing screens, unclear flows, absent states), use AskUserQuestion: "Should I update the prototype to add [gap]? This may warrant re-running upstream steps."
   - The user decides per-update whether to update the prototype now or note it for production implementation only.
   - If the user approves a prototype update, make the change and note it in the interview log before continuing.

5. **Cover all areas:**
   - Continue until you have thoroughly covered: implementation goals, technical architecture, data models, APIs/contracts, migrations, edge cases, security, performance, observability, test strategy, and scope boundaries.
   - **Coverage checkpoint** — Before concluding, use AskUserQuestion to present a structured summary: list each area covered with the key decisions made and the evidence or reasoning that supported each decision. Then ask: "Does this cover everything? Any areas we should revisit or that I missed?"

6. **Write outputs:**
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
     - `## Assumptions & Risks` (the checkpoint output)
     Additional topic-specific sections (e.g. `## Data Model`, `## Security`) may appear between Detailed Design and Edge Cases. Do not number sections.
   - Append an **Assumptions & Risks** section to the end of the spec listing: each checkpoint assumption that was confirmed, corrected, or left unresolved during the interview, its source tag, and the downstream risk if the assumption turns out to be wrong later. Flag any `[inferred]` assumptions that were never explicitly confirmed by the user.
   - Create an interview log file named `[topic]-interview.md` recording each turn of the interview including questions asked, options presented with pros/cons, and user selections. The log must include the Assumptions Checkpoint as presented, user corrections, and a summary of significant deviations from the original spec.

## Output

Two files written:

- `specs/[topic].md` — the completed specification
- `[topic]-interview.md` — full interview log with deviation summary

### Alignment Page

Build and attempt to open `alignment/spec-interview-{topic}.html` before writing or replacing `specs/[topic].md` or the interview log.

**Page layout contract.** After the page title and short summary, include a top-of-page "Table of Contents" section with anchor links to the major review sections and the bottom compile section. Keep the Table of Contents in normal document flow. Do not use a sidebar, side rail, drawer, split-shell layout, or sticky navigation for the Table of Contents unless the user explicitly asks for that layout. Do not place compile, copy, feedback, or answer controls in a sticky or fixed bottom banner/footer. Bottom compile controls must appear as ordinary content in a bottom compile section, so they scroll with the page and do not cover content at high zoom.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. Include evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and approval gates. Render the consolidated prototype evidence, prototype-grounded assumptions checkpoint, production data/API/auth/infrastructure decisions, coverage checkpoint, and every proposed spec section with no context loss from source evidence or interview notes.

**Required inline questions.** Ask whether the evidence is sufficient for a production specification, whether any assumptions or confidence levels are wrong, whether scope/non-goals and deferred infrastructure are acceptable, whether the proposed canonical file changes are approved, and whether roadmap routing should remain blocked.

**Section feedback controls.** Add lightweight section-feedback controls to every major section of the page: approve as-is, reject or flag a concern, and clarification needed. Selecting a control reveals a multi-line section-feedback textarea placed directly under or beside the thumbs up/down/clarify controls. This textarea is separate from gate-question text inputs, so it still appears near the feedback controls even when the same section also has required gate questions with their own text boxes. These controls are optional for final approval and do not replace required gate questions. They also power the separate feedback-only YAML path so the user can send concerns or clarification requests before answering every required gate question.

**Feedback-only YAML contract.** Provide feedback-only YAML in two places: locally under each selected section-feedback textarea, and globally in the bottom compile section. When a section-feedback control is selected, show local "Compile Feedback YAML" and "Copy YAML" controls plus a read-only YAML textarea directly under that section's feedback textarea. The local feedback compile generates YAML with `alignment_page: alignment/{skill-name}-{topic}.html`, `feedback_status: revision-request`, `approval_status: not-approved`, `unanswered_required_questions`, and a `section_feedback` list containing the single selected section-feedback entry for that local control. The bottom "Compile Feedback YAML" control generates the same YAML shape but aggregates every selected section-feedback entry on the page. Enable both local and bottom feedback compile controls as soon as at least one section-feedback control is set, even if required inline gate questions are unanswered. Populate `alignment_page` from the known repo-relative output path used to write the HTML page, not from the page title, browser URL, window location, or any display label. Each feedback entry uses `section`, `feedback` (`up`, `down`, or `needs-clarification`), optional `notes` from that section's feedback textarea, and `requested_agent_action` (`accept-as-is`, `investigate-and-revise`, or `clarify-before-approval`). For `down` and `needs-clarification` feedback, the YAML must tell the agent to evaluate the feedback, investigate further when needed, and contextually amend the HTML alignment page before asking again for final approval answers. Copy and display feedback YAML locally or at the bottom with the same clipboard retry and textarea fallback behavior as final gate YAML. Do not render the bottom feedback compile controls as a sticky or fixed banner.

**Gate YAML contract.** At the bottom of the page, include an ordinary in-flow compile section with a "Compile Feedback YAML" button for selected section feedback and a separate "Compile Answers" button for final approval answers. The bottom compile section must not be sticky, fixed, floating, or styled as a persistent banner. The "Compile Answers" button compiles final approval answers into YAML with `alignment_page: alignment/{skill-name}-{topic}.html`, `approval_status: ready-for-agent-review`, `section`, `gate_type`, `status`, `decision`, `notes`, and `approved_file_changes` fields. Populate `alignment_page` from the known repo-relative output path used to write the HTML page, not from the page title, browser URL, window location, or any display label. The final approval button remains disabled until every required question has a selection. The final YAML may also include any section feedback the user set, using the feedback-only YAML `section_feedback` shape. The page must automatically attempt to copy the YAML to the clipboard, provide an explicit "Copy YAML" button, and fall back to selecting the textarea contents.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page. Ask the user to review the page and provide either local or bottom feedback-only YAML for concerns/clarification, or final compiled YAML answers when ready. Do not require the user to answer every gate before sending negative feedback or clarification needs. When feedback-only YAML is provided, treat it as a revision request: evaluate the feedback, investigate further when needed, archive and amend the HTML alignment page contextually, highlight the changes, and ask again for review. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after final compiled YAML has been provided and the approved artifacts have been written or updated.

## Constraints

- Use AskUserQuestion for all interview turns — do not assume answers.
- One to three focused questions per turn, not more.
- Do not re-interview on ICP topics already covered in `research/icp.md`.
- Do not conclude the interview without explicit user confirmation that all areas are addressed.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, prepend `/pack install <pack-name>` to the recommendation.

## Ideas Mode (`--ideas`)

When `$ARGUMENTS` contains `--ideas`, read `tasks/ideas.md` and run the interview process for each idea sequentially.

### Process

1. Read `tasks/ideas.md` and extract every distinct idea entry. If `$ARGUMENTS` includes a filter keyword (beyond `--ideas`), limit to matching ideas.
2. Show the user the list and ask them to confirm, skip any, or reorder.
3. For each idea, run the standard interview process using the idea's title and description as the initial implementation draft. If an idea is still only a raw concept, route it to `/idea-scope-brief` first.
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

Follow the shared shipping contract convention in CLAUDE.md.
