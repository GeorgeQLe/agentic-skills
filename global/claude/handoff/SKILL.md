---
name: handoff
description: Generate a project-level context snapshot for resuming work in a fresh session
type: shipping
version: v0.1
argument-hint: "[focus area] [--target=codex]"
---

# Handoff

Generate a self-contained context document that captures exactly where you left off in a project, so a fresh Claude session can pick up immediately without re-reading the entire codebase.

## Process

1. **Gather current state:**
   - Read `tasks/todo.md` for the current phase detail and active step.
   - Read `tasks/roadmap.md` for overall progress context (which phases are done, what's ahead).
   - Read `tasks/manual-todo.md` (if it exists) for pending manual tasks.
   - Read `tasks/record-todo.md` and `tasks/recurring-todo.md` (if they exist) for advisory task counts.
   - Read `CLAUDE.md` for project conventions.
   - Run `git status` and `git log --oneline -10` for recent activity.
   - Run `git diff --stat` if there are uncommitted changes.
   - Check for any blockers or notes in `tasks/todo.md`.

2. **Identify the work in progress:**
   - What phase/step was being worked on.
   - What files were being modified (from git status/diff).
   - What technical decisions were made during this session.
   - What approach was being taken and why.

3. **Check for loose ends:**
   - Uncommitted changes that need attention.
   - Failing tests.
   - TODOs or FIXMEs added during the session.
   - Blockers or open questions.

4. **If `$ARGUMENTS` specifies a focus area**, emphasize that in the handoff context.

5. **If `$ARGUMENTS` contains `--target=codex`, produce a cross-CLI approval packet** before writing the handoff doc. **Requires `jq` on PATH:** `scripts/approved-plan.sh draft` (step 5.4) and the pretty-print in step 5.5 both invoke `jq`; if absent, `scripts/approved-plan.sh`'s `require_jq_write` (at `scripts/approved-plan.sh:21`) dies with `ERROR: jq required for write operations. Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu).` before any packet is drafted. No degraded path — install `jq` and retry.
   1. Resolve the effective agent mode via `./scripts/agent-mode.sh`. If the resolved mode is `codex-only`, stop immediately with a `mode-mismatch:` error — Claude is not the planner in that mode.
   2. Require a clean tracked tree. If `git status --porcelain` reports dirty paths, the user must pass repeatable `--allow-dirty <glob>` flags covering every dirty path. Glob semantics match the Step 4 consumer (`scripts/approved-plan.sh check`) — `case "$path" in $glob)` shell globbing, not regex.
   3. Derive `phase` / `step` / `title` from `tasks/todo.md`. Read the **first unchecked** `- [ ]` under the `### Active Step Plan` block; if no such block exists, fall back to the first unchecked `- [ ]` under the current `## Phase N` header. Parse the `Phase N` and `Step N.X` tokens out of the surrounding context; use the checkbox line's text (stripped of `- [ ] **Step N.X** — `) as `title`.
   4. Call `./scripts/approved-plan.sh draft --phase "Phase N" --step "Step N.X" --title "<title>"` plus any `--allow-dirty <glob>` flags the user supplied. Surface the helper's single-line failure reason verbatim if it fails.
   5. Pretty-print the drafted packet with `jq . .agents/approved-plan.json`, then ask exactly one concise question: *"Approve this packet for Codex execution?"*. On yes → `./scripts/approved-plan.sh approve`. On no → leave the packet at `draft` and tell the user they can approve it later with `./scripts/approved-plan.sh approve` or discard it with `./scripts/approved-plan.sh supersede`.
   6. When writing `tasks/handoff.md` in the next step, add a **Cross-CLI handoff** section naming `.agents/approved-plan.json` (JSON, gitignored), `tasks/approved-plan.md` (committable mirror), and the resume command: `$run --execute-approved` (Codex).

6. **Write the handoff to `tasks/handoff.md`:**

## Handoff Document Format

```markdown
# Handoff — [Project Name] — [Date]

## Current State
- **Phase**: X — [phase name]
- **Step**: Y — [step name]
- **Status**: in-progress / blocked / ready-for-next
- **Branch**: [branch name]
- **Last commit**: [hash] [message]

## What Was Done This Session
- [Concise bullet list of completed work]

## Work In Progress
- [What's partially done, with file paths]
- [Technical decisions made and why]
- [Approach being taken]

## Uncommitted Changes
- [List of modified files and what changed, or "none"]

## Blockers / Open Questions
- [Any blockers, or "none"]

## Pending Manual Tasks
- [Unchecked items from `tasks/manual-todo.md`, or "none"]
- [Note any that block upcoming automated steps]

## Pending Advisory Tasks
- [Record/recurring task counts from `tasks/record-todo.md` and `tasks/recurring-todo.md`, or "none"]
- [Note that these are not execution blockers unless promoted to `tasks/todo.md`]

## Next Steps
- [Exactly what to do next, specific enough to execute without re-reading context]
- [Files to read first]
- [Commands to run]

## Key Files for Context
- [List of 3-5 files most relevant to the current work]
```

## Output Format

After writing the handoff, report:
- Path to the handoff document
- One-line summary of the project state
- Whether there are uncommitted changes that should be committed first

## Constraints
- The handoff must be **self-contained** — a fresh session should be able to read only this file, `tasks/todo.md`, and optionally `tasks/roadmap.md` to start working.
- Do not include full file contents — only paths and brief descriptions.
- Keep it concise — the handoff should be under 100 lines.
- Do not commit the handoff document automatically — let the user decide.
- If there are uncommitted changes, warn the user to commit or stash before switching contexts.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/handoff-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

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

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/handoff-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
