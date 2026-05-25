---
name: journey-map
description: Map the full user and customer lifecycle from trigger and discovery through onboarding, aha, conversion, retention, expansion, and advocacy
type: analysis
version: v0.1
argument-hint: "[optional: app, use case, persona, or lifecycle stage]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Journey Map — Lifecycle Overview



Create or update the canonical lifecycle overview. This is the top-level map for user task journeys and the customer relationship lifecycle; deeper stage docs belong in `/onboarding-map`, `/conversion-map`, `/transaction-map`, `/retention-map`, `/expansion-map`, and `/lifecycle-metrics`.

## Prerequisites

- `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) must exist — run `/icp` first.
- Specs, competitive analysis, enterprise ICP, customer feedback, and codebase evidence are supporting context when present.

## Workflow

0. **App scope resolution**: If `$ARGUMENTS` names a subdirectory of `research/`, use `research/{app}/` and `specs/{app}/`. If `research/` has multiple app subdirectories and no app is specified, ask the user to choose. If one app subdirectory exists, use it automatically. Otherwise use flat `research/` and `specs/`.
1. **Load context**: Read ICP, competitive analysis, enterprise ICP, customer feedback, existing lifecycle docs, specs, README/AGENTS/CLAUDE, and relevant source files when they clarify real product surfaces.
2. **Map user journeys**: For each key persona, identify 3-5 core use cases, entry points, task steps, decision points, happy path, failure modes, outputs, and delta from current state.
3. **Map customer lifecycle**: Cover trigger, discovery, evaluation, onboarding, aha moment, conversion, transaction, retention, expansion, advocacy, churn, and recovery.
4. **Identify critical moments**: Name the 3-5 moments where the product wins or loses the user/customer, with evidence and success criteria.
5. **Present before writing**: Summarize the lifecycle, evidence, open assumptions, and stage docs that should be split out. Ask what needs correction or product-specific context. Continue until validated.
6. **Write only after validation**, archiving existing canonical files first when replacing them.

## Deliverables

- `research/journey-map.md` (or `research/{app}/journey-map.md`) — canonical lifecycle overview with links or references to deeper stage docs when they exist.
- `research/journey-map-interview.md` (or `research/{app}/journey-map-interview.md`) — raw interview log and decisions.

The output file must end with `## Next Steps` using "Pick one:" framing. Default AFPS routing after the overview is `/positioning` when `research/positioning.md` is missing, because positioning should use ICP, competitive analysis, and journey evidence. Then route to `/ux-variations`, `/ui-interview`, prototype work, `/uat --variant-evaluation`, `/consolidate-variations`, `/research-roadmap --post-prototype`, `/spec-interview`, and `/roadmap` as evidence becomes available. Recommend deeper lifecycle maps (`/onboarding-map`, `/conversion-map`, `/transaction-map`, `/retention-map`, `/expansion-map`, `/lifecycle-metrics`) only when the overview exposes a specific stage risk that needs detail before positioning or UX work.

## Output Shape

```markdown
# Journey Map

> Based on: research/icp.md[, other evidence]
> Date: YYYY-MM-DD

## Summary
## User Journeys
## Customer Lifecycle
## Critical Moments
## Stage Detail Index
## Journey Gaps
## Next Steps
```

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/journey-map-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.

**Discovery-specific gates.** Render evidence coverage, assumptions/confidence, recommended path, artifact destination, proposed file changes, approval, and post-approval route as gates before creating or updating canonical discovery artifacts.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/journey-map-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Keep this file as the overview; put step-level stage detail in the focused lifecycle skills.
- Ground every important step in ICP, research, specs, feedback, or codebase evidence.
- Do not prescribe UI or architecture.
- Present findings before writing.
- Follow the archive-first replacement policy for canonical research/spec documents.
