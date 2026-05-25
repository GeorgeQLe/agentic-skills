---
name: spec-drift
description: Audit specs against codebase — find unimplemented features, diverged implementations, and undocumented code
type: analysis
version: v0.1
argument-hint: "[audit|fix] [spec-file|all]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Spec Drift — Spec-to-Code Conformance Audit

Checks that specs and codebase tell the same story. Extracts verifiable claims from spec documents, checks each against the actual implementation, and flags divergence. Think of it as a linter for spec-to-code fidelity — complementary to `/reconcile-research` (doc-to-doc) and `/expert-review` (broad code review).

## Prerequisites

At least one spec file must exist in `specs/` (or `specs/{app}/`, `docs/specifications/`). If no specs exist, display a message and exit — there's nothing to audit.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, detect the app structure:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `specs/`, use it.
2. If `specs/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, check `docs/specifications/` as an alternative spec location.
4. If no subdirectories exist in any location, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read specs from `specs/{app}/` instead of `specs/`
- Also check `docs/specifications/` for additional spec documents

### 1. Determine Mode and Scope

Parse `$ARGUMENTS`:

- **Mode**: `audit` (default, read-only) or `fix` (update specs or flag code issues, write drift report)
- **Scope**: specific spec file path, or `all` (default — scan all specs)

### 2. Inventory Specs

Scan `specs/` (or `specs/{app}/`, `docs/specifications/`) for `.md` files. Skip non-spec files (README, index, changelog, mvp-gap, scale-audit, and files matching `*-interview.md`).

For each spec, record:
- File path
- Last-modified timestamp (via `stat`)
- Title (first `#` heading)

**Stop condition**: If no spec files are found, display a message suggesting `/spec-interview` and exit.

### 3. Extract Claims Per Spec

Launch a **subagent per spec** to extract verifiable claims. Each subagent reads one spec and returns structured claims:

| Claim type | What to look for | How to verify |
|------------|-----------------|---------------|
| **Routes/endpoints** | API paths, HTTP methods, request/response shapes | Grep routes, check handlers |
| **Data models/schema** | Field names, types, relations, constraints | Read schema files, model definitions |
| **Feature behaviors** | "When X happens, Y occurs", business logic rules | Read implementation, check conditionals |
| **Config/env vars** | Named config values, feature flags, env vars | Grep for usage |
| **UI flows** | Screen names, navigation paths, component structure | Check components/pages |
| **Commands/CLI** | Command names, arguments, behavior | Check command handlers |
| **Pricing/limits** | Tier names, limits, gates | Check config, middleware, constants |
| **Integration points** | External service calls, webhooks, events | Grep for client calls |

Each claim includes:
- **Source spec**: file path
- **Section heading**: the `##`/`###` heading the claim appears under
- **Direct quote**: the exact text making the claim
- **Claim type**: one of the types above

### 4. Verify Claims Against Codebase

Launch **subagents per claim group** (grouped by claim type or by spec, whichever produces fewer groups) to verify each claim against the codebase:

For each claim:
1. Search the codebase for evidence (grep, glob, read relevant files)
2. Classify the claim:

| Status | Meaning | Evidence required |
|--------|---------|-------------------|
| **Verified** | Code matches spec | File:line where behavior is implemented |
| **Diverged** | Code exists but behaves differently than spec says | Spec quote + code quote showing the difference |
| **Unimplemented** | Spec describes it but code doesn't have it | Search terms used + confirmation of absence |
| **Removed** | Spec describes it but evidence suggests intentional removal | Git log showing removal, or TODO/deprecated markers |

For **Diverged** and **Unimplemented** findings, include the specific file:line references (or search terms used) as evidence.

### 5. Detect Undocumented Code

Scan for significant code patterns not covered by any spec claim:

- Routes/endpoints with no spec coverage
- Data models not mentioned in specs
- Feature flags/config not documented
- Public API endpoints without spec descriptions

This is a **lighter scan** — only flag things that look like they *should* have spec coverage (public API, user-facing features, documented config). Do not flag internal utilities, helper functions, or infrastructure code.

### 6. Classify and Report Findings

Group all findings by severity:

| Severity | Meaning | Example |
|----------|---------|---------|
| **Error** | Spec actively contradicts code behavior | Spec says "free tier: 10 projects" but code enforces limit of 5 |
| **Warning** | Drift — spec may be stale or incomplete | Spec describes 3 API endpoints but code has 5 |
| **Info** | Undocumented code that probably should have spec coverage | New route `/api/v2/export` exists with no spec |

Classification rules:
- **Diverged** claims → Error (spec and code disagree on behavior)
- **Unimplemented** claims → Warning (spec describes something code doesn't have yet)
- **Removed** claims → Warning (spec describes something that was intentionally removed)
- **Undocumented code** → Info (code exists without spec coverage)
- If uncertain whether something is a real divergence, classify as Info, not Error.

### 7. Fix Mode (if `fix` was specified)

If mode is `fix`:

1. **Present all Errors** to the user. For each Error, show the spec claim and code reality side-by-side with direct quotes. Ask: **is the code right or the spec right?**
   - **Code is right** → archive the existing spec, then update the canonical spec section to match the implementation
   - **Spec is right** → add concrete implementation bugs to `tasks/todo.md` with the spec reference
2. **Present Warnings** — ask user whether to archive then update spec (remove unimplemented/removed claims), add concrete work to `tasks/todo.md`, or add non-blocking condition-gated validation to `tasks/record-todo.md`.
3. **Skip Info items** — these are suggestions only.
4. Apply approved archive-first changes.
5. Write `specs/drift-report.md` (or `specs/{app}/drift-report.md`) as audit trail:

```markdown
# Spec Drift Report — [date]

## Resolved
- [Error description] — resolved by archiving and updating [spec file] to match code
- [Error description] — resolved by adding implementation task to tasks/todo.md

## Deferred
- [Warning/Info description] — no action taken

## Remaining
- [Any Errors the user chose to defer]
```

6. Re-run the audit to confirm fixes resolved the flagged issues.

**Downstream Impact Check** — after fix mode, check if spec updates affect:

| File | What to check | Impact if affected |
|------|---------------|-------------------|
| `research/journey-map.md` | Journey stages referenced by changed spec sections | Journey map may describe flows that no longer match |
| `research/metrics.md` | Metrics tied to features that drifted | Metrics may track behaviors that changed |
| `tasks/roadmap.md` | Roadmap items that reference changed specs | Roadmap priorities may need re-evaluation |

Classify impact as **None**, **Minor** (cosmetic references), or **Major** (core assumptions affected). If any impact is Major, recommend running `/reconcile-research` to propagate changes.

## Output Format

**Audit mode** (default): Display directly to the user. No files written.

```
## Spec Drift Report — [scope]

### Errors (X)
- **specs/feature-a.md § Pricing** → `src/config/limits.ts:42` — Spec says "10 project limit" but code enforces 5

### Warnings (X)
- **specs/feature-a.md § API Endpoints** → code has 2 undocumented endpoints: `/api/v2/export`, `/api/v2/import`
- **specs/feature-b.md § Auth Flow** → spec describes OAuth2 PKCE but no implementation found

### Info (X)
- **Undocumented**: `src/routes/webhooks.ts` — webhook handler with no spec coverage

### Verified (X of Y claims)
- specs/feature-a.md: 15/18 claims verified
- specs/feature-b.md: 8/12 claims verified

### Summary
- Specs scanned: 4
- Claims extracted: 72
- Verified: 58, Diverged: 6, Unimplemented: 3, Undocumented: 5
```

**Fix mode**: Same report format, with a `### Fixed` section prepended and `specs/drift-report.md` written as audit trail.

## Constraints

- **Read-only by default.** Only modify files when explicitly invoked with `fix` mode.
- **Never auto-resolve Errors.** Errors always require user input on whether the code or spec is correct.
- **Show evidence.** Every finding must include the spec quote + code reference (file:line).
- **No false positives.** If uncertain whether something is a real divergence, classify it as Info, not Error.
- **Skip absent specs gracefully.** If no specs exist, display a message and exit.
- **Respect monorepo structure.** Use app-scoped paths when monorepo is detected.
- **Use subagents** for claim extraction (one per spec) and verification (one per claim group) to parallelize work.
- **Idempotent.** Running audit twice with no changes between should produce identical output.
- **Do not make code changes.** In fix mode, only update spec documents, `tasks/todo.md`, and `tasks/record-todo.md` — never modify source code. Archive existing specs before replacement per the Archive-First Replacement Policy.

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
