---
name: icp
description: Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs, pain points, value props, and cross-ICP prioritization
type: research
version: v0.2
argument-hint: <spec file path, concept/idea, or empty to use concept brief>
---

# ICP — Research-Driven Customer Discovery

Invoke as `$icp`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Automated research that identifies **multiple ICP candidates**, maps pain points and value props, and selects a primary ICP. Uses web search + codebase analysis instead of interviews. If `research/concept-brief.md` or `research/{app}/concept-brief.md` exists, use it as starting context for the research frame.

Default stance: assume the user has no insider knowledge of the market. Explain segments, pain signals, and tradeoffs from first principles so the recommendation is defensible without founder intuition. Ask for corrections, hard constraints, or proprietary facts only when needed.

## Workflow

0. **App Scope Resolution (Monorepo Support)**: Before parsing input, determine the app scope: (a) If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it. (b) If `research/` contains subdirectories (excluding files), list them and ask the user which app to target; if the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`, otherwise ask in plain text; if only one subdirectory exists, use it automatically. (c) If no subdirectories exist, proceed with flat structure (single-product mode). When app scope `{app}` is active: read/write research from `research/{app}/` instead of `research/`, read/write specs from `specs/{app}/` instead of `specs/`, prefer `research/{app}/concept-brief.md` as concept context when present, and also read `research/icp.md` (cross-app overview) for broader context.
1. **Parse input and gather concept context**:
   - Read `$ARGUMENTS` as a spec file path or concept text when provided.
   - Read `research/{app}/concept-brief.md` in app scope, or `research/concept-brief.md` in flat scope, when present. Treat it as starting context and source hypotheses, not as settled truth.
   - If `$ARGUMENTS` is empty and a concept brief exists, use the concept brief as the primary input before falling back to README, specs, or codebase inference.
   - If `$ARGUMENTS` conflicts with the concept brief, flag the mismatch at the first checkpoint and ask which premise should guide ICP research.
   - Read codebase if it exists. Read existing research for background.
   - **Detect monorepo** (`turbo.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, or `package.json` workspaces) — if multiple distinct user-facing products exist, run the full ICP process per app and produce `research/{app-name}/icp.md` per app plus a unified `research/icp.md`.
   - **Migrate old convention:** If `research/icp-{app}.md` files exist (old naming), offer to move them to `research/{app}/icp.md` (and corresponding search logs to `research/{app}/icp-search-log.md`). Create the subdirectories as needed.
2. **Broad market research**: WebSearch with 8–12 query strategies (personas, pain points, segments, trends, competitors, forums, job postings, industry reports, business model). Log all queries and findings. **Classify the business model** into one or more of: B2B SaaS (PLG), B2B SaaS (SLG), B2C, B2C subscription, marketplace/platform, B2B2C, D2C, open-source/open-core, API/developer-first. Document classification with evidence in search log — this gates which sub-sections appear in the Discovery & Evaluation Behavior section.
3. **Identify 2–5 ICP candidates** from research evidence — note who they are, pain evidence, accessibility, and value potential.
4. **Checkpoint 1 — Present candidates to user.** Show ICP candidates with rationale — cite pain evidence found, accessibility signals, and value delivery reasoning from search findings for each candidate. Ask: "Do any surprise you? Any segment I'm missing?" Incorporate feedback before proceeding.
5. **Deep research per ICP**: Targeted WebSearch to fill the 9-section framework for each candidate:
   - **Customer Profile** — buyer persona, budget, discovery channels. Include **Geographic Focus** (only if the product has regulatory, language, or market-specific constraints — initial target region, why, expansion sequence), **Named Accounts** (B2B: 5–10 real companies that fit, with name, size, industry, and why they fit), and **Business Model & Go-to-Market Motion** (model type with evidence, primary motion PLG/SLG/community/partner/hybrid, buyer-user relationship)
   - **User Profile(s)** — daily users, sophistication, goals, frustrations
   - **Trigger Events** — what causes them to look NOW? Job changes, growth milestones, compliance deadlines, tool sunsets, contract renewals, funding events, new regulations. Rank by frequency and urgency.
   - **Current State Journey** — step-by-step current workflow
   - **Pain Map** — breakdowns, severity, frequency
   - **Current Alternatives (User Perspective)** — what users say they currently use or have tried, in their own words
   - **Market Sizing** — TAM/SAM/SOM via bottom-up (company counts × deal size) and top-down (industry reports, competitor revenue). Flag confidence level.
   - **Stated Value Drivers** — what customers say matters in their own language, the "aha moment" as they describe it
   - **Customer ↔ User Dynamics** — post-purchase buyer-user relationship (provisioning, onboarding, admin vs end-user dynamics). For B2B, detailed buying process and DMU live in Discovery & Evaluation Behavior; this section focuses on the post-purchase relationship.
   - **Discovery & Evaluation Behavior** — how this persona found, evaluated, and chose solutions. Capture behavioural signals only (where they searched, who they asked, what they compared). Populate section 10.
6. **Checkpoint 2 — Present scoring matrix and primary ICP selection.** Show Value x Accessibility scores. Ask: "Which constraints, missing segments, or weak evidence should change this ranking?" Incorporate feedback.
7. **Cross-ICP analysis**: Shared pains, conflicts, product line recs, build sequence, lowest-hanging-fruit x most-value prioritization, discovery & evaluation comparison (how discovery and evaluation behavior differs across ICPs; do different ICPs find and choose solutions through different paths?).
8. **Checkpoint 3 — Present cross-ICP analysis and build sequence.** Show shared pains with source data, conflicts with specific examples, and build sequence rationale grounded in the scoring matrix. Ask: "Does this sequencing make sense?" Incorporate feedback.
9. **Final review**: Present complete findings summary. Ask: "Ready to write? Anything to adjust?" Only write after user confirms.

**After writing is complete, repeat the Recommended next step from the generated `## Next Steps` section in the final chat response.**

## Deliverables

- `research/icp.md` — Primary ICP in canonical 9 top-level `##` sections (Customer Profile, User Profile(s), Trigger Events, Current State Journey, Pain Map, Current Alternatives (User Perspective), Market Sizing, Stated Value Drivers, Customer ↔ User Dynamics), then supplementary `## Discovery & Evaluation Behavior` (section 10: how they find solutions, how they evaluate, how they choose), then `## Additional ICPs` (condensed 9-section + condensed discovery & evaluation per ICP), then `## Cross-ICP Analysis` (prioritization matrix, shared pains, conflicts, product line recs, build sequence, discovery & evaluation comparison), then `## Signals for Downstream Research` (unvalidated observations routed to /competitive-analysis, /positioning, /monetization, /gtm)
- `research/icp-search-log.md` — Raw research log: every query, findings, evidence, scoring rationale
- **Monorepo**: `research/{app-name}/icp.md` + `research/{app-name}/icp-search-log.md` per app, plus unified `research/icp.md` cross-referencing all app-level ICPs with top-level prioritization

The output file must end with a `## Next Steps` section based on which files exist. Include a **Recommended** item (the single highest-impact next step given current project state) with a one-line reason, followed by **Other options** (2–4 alternatives). Use this format in the output:

## Next Steps

**Recommended:** `$competitive-analysis` — maps the landscape your ICP operates in so positioning and GTM have competitive grounding

Other options:
- `$spec-interview` — validate the riskiest ICP assumption with a targeted interview (if `specs/` exist)
- `$journey-map` — map the current-state journey to find intervention points (if no `research/journey-map.md`)
- `$mvp-gap` — check if the codebase delivers on the ICP's top pain point (if codebase exists)
- `$brainstorm` — generate solution ideas grounded in the ICP research (if `research/competitive-analysis.md` exists)

Only include items whose conditions are met. The recommendation (`$competitive-analysis`) is always applicable.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Stay in problem space — do not propose features, architecture, or solutions.
- Evidence-based — every claim must trace to research logged in `research/icp-search-log.md`.
- Primary ICP must use canonical 9 `##` headers for downstream compatibility (`$spec-interview`, `$mvp-gap`, `$roadmap`, `$journey-map`). The renamed sections (`Current Alternatives (User Perspective)`, `Stated Value Drivers`) replace the former `Market Landscape` and `Value Proposition` headers. Section 10 (`## Discovery & Evaluation Behavior`) is supplementary and does not affect downstream parsing.
- Section 10 captures behavioural signals only — how personas find, evaluate, and choose solutions. Do not include GTM strategy, channel analysis, budget authority, procurement process, or pricing expectations — those belong in downstream skills (`$gtm`, `$monetization`, `$enterprise-icp`).
- Minimum 8 WebSearch queries before identifying candidates, 2–3 per candidate after.
- Do not overwrite existing `research/icp.md` without asking.
- Present before writing — never write output until findings are validated through checkpoints.
- `## Next Steps` must be the final section in the output file, with a recommended next step and 2–4 other options.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/icp-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.

**ICP research translation.** Render segment claims, exclusion rationale, buyer/user distinction, source coverage by customer category, evidence-backed pain intensity, uncertainty about reachable audiences, and the recommended next research or positioning decision as first-class research gates.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/icp-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

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
