---
name: spec-drift
description: "Audit specs against codebase — find unimplemented features, diverged implementations, and undocumented code"
type: analysis
version: v0.1
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Spec Drift — Spec-to-Code Conformance Audit

Invoke as `$spec-drift`.

Checks that specs and codebase tell the same story. Extracts verifiable claims from spec documents, checks each against the actual implementation, and flags divergence. Complementary to `$reconcile-research` (doc-to-doc) and `$expert-review` (broad code review).

## Prerequisites

At least one spec file must exist in `specs/` (or `specs/{app}/`, `docs/specifications/`). If no specs exist, tell the user to run `$spec-interview` first.

## Workflow

### 0. App Scope Resolution (Monorepo Support)

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `specs/`, use it.
2. If `specs/` contains subdirectories, list them and ask the user which app to target. If only one, use it automatically.
3. If no subdirectories exist, check `docs/specifications/` as alternative. Otherwise proceed with flat structure.

### 1. Determine Mode & Inventory Specs

Parse `$ARGUMENTS` for mode (`audit` default, or `fix`) and scope (specific file or `all`). Scan spec directories for `.md` files, skipping non-spec files (README, index, changelog, mvp-gap, scale-audit, `*-interview.md`).

### 2. Pre-Scan & Extract Claims

1. Build a codebase summary: tech stack, key directories, routes, data models.
2. For each spec, extract verifiable claims across: routes/endpoints, data models, feature behaviors, config/env vars, UI flows, commands, pricing/limits, integration points.
3. Each claim records: source spec, section heading, direct quote, claim type.

### 3. Verify Claims & Detect Undocumented Code

For each claim, search the codebase and classify:
- **Verified** — code matches spec (cite file:line)
- **Diverged** — code exists but differs (spec quote + code quote)
- **Unimplemented** — spec describes it, code doesn't have it
- **Removed** — evidence of intentional removal

Then scan for significant undocumented code: routes, models, feature flags, and public APIs with no spec coverage. Only flag user-facing or public items.

### 4. Report Findings

Group by severity:
- **Error** — Diverged claims (spec contradicts code)
- **Warning** — Unimplemented or removed claims
- **Info** — Undocumented code that should have spec coverage

### 5. Fix Mode (if specified)

1. Present Errors with side-by-side spec vs code quotes. Ask: code right or spec right?
   - Code right → archive the existing spec, then update the canonical spec to match the implementation. Spec right → add concrete implementation fixes to `tasks/todo.md`.
2. Present Warnings — either archive then update the spec, add concrete work to `tasks/todo.md`, or add non-blocking condition-gated validation to `tasks/record-todo.md`.
3. Write `specs/drift-report.md` (or `specs/{app}/drift-report.md`) as audit trail.
4. Check downstream impact on `research/journey-map.md`, `research/metrics.md`, `tasks/roadmap.md`. If major, recommend `$reconcile-research`.

## Deliverables

- **Audit mode**: Summary displayed directly — errors, warnings, info, verified count, and totals
- **Fix mode**: Same report plus `specs/drift-report.md` with resolved/deferred/remaining sections

## Constraints

- Read-only by default. Only modify files in `fix` mode.
- Never auto-resolve Errors — always require user input.
- Every finding must cite spec quote + code reference.
- If uncertain, classify as Info, not Error.
- Respect monorepo structure with app-scoped paths.
- Do not make code changes — only update specs, `tasks/todo.md`, and `tasks/record-todo.md`; archive existing specs before replacement per the Archive-First Replacement Policy.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/spec-drift-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/spec-drift-{topic}.html`.

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
