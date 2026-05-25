---
name: desk-flip
description: Autopsy a stuck project, extract salvageable artifacts, and route to a fresh start via /bootstrap-repo reset or new-repo bootstrap
type: execution
version: v0.0
argument-hint: "<project-path>"
---

# Desk Flip

Autopsy a stuck project, extract salvageable artifacts (lessons, valid specs, non-code assets), and route the user to a fresh start either in a new repo or by resetting the existing repo with `/bootstrap-repo --reset-existing`.

This skill always desk-flips. If the user invoked it, the decision to restart is already made — do not offer incremental migration or attempt to fix the old project in place.

## Process

1. **Identify the stuck project.**
   - Accept an optional project path from `$ARGUMENTS`; default to the current working directory.
   - Verify the target is a git repo with existing code (not an empty repo).
   - If the project appears to already use the new workflow (file-backed specs, prototype-first artifacts, healthy structure), warn the user and confirm before proceeding.

2. **Survey the project.**
   - Read `CLAUDE.md`, `README.md`, `package.json` or equivalent manifest, and directory structure.
   - Read `tasks/`, `specs/`, `docs/` directories if they exist.
   - Scan recent git history (last ~50 commits) for commit patterns and timeline.
   - Read any existing `tasks/lessons.md` or post-mortem docs.

3. **Run the autopsy** using subagents in parallel:
   - **Lessons extraction:** What went wrong? Look for evidence of failure modes — infrastructure before prototype, late testing, chat-driven alignment drift, scope creep, untestable architecture. Cite specific commits, files, or timeline evidence.
   - **Spec/design extraction:** Identify specs, designs, research docs, interview logs, and product briefs that capture valid domain knowledge or user needs — regardless of whether the implementation matched. Mark each as `valid`, `partially valid`, or `stale` with a one-line rationale.
   - **Asset inventory:** Find non-code assets worth preserving — icons, images, copy, API contracts, design tokens, brand assets, research documents.

   Do NOT extract code, dependencies, database schemas, or infrastructure config.

4. **Write the autopsy report.**
   - Produce `desk-flip-report.md` in the project root with these sections:

   ```
   ## Project Summary
   What the project was and what state it's in now.

   ## What Went Wrong
   Specific failure modes with evidence (commits, files, timeline).

   ## Salvageable Specs & Designs
   List with file paths, validity status, and one-line descriptions.

   ## Salvageable Assets
   Non-code assets with file paths.

   ## Lessons for the Fresh Start
   Actionable guidance for the new project to avoid the same mistakes.

   ## Recommended Bootstrap Input
   A condensed brief suitable as input to /bootstrap-repo.
   ```

5. **Choose the fresh-start path.**
   - If the user explicitly wants a new repository, route to `/bootstrap-repo <condensed brief>`.
   - If the user wants to keep the existing repository, or the current repo name, remotes, issues, deployment linkage, or local tooling are valuable, route to `/bootstrap-repo --reset-existing <condensed brief>`.
   - For in-place reset, state that `/bootstrap-repo --reset-existing` must archive the old implementation under `archive/` before writing the fresh bootstrap docs. It must not delete the old code outright.
   - The archive should preserve old implementation and documentation evidence without treating it as reusable foundation code or active source-of-truth docs. The fresh start should continue only from a high-level concept seed derived from the report, plus lessons captured in the report.

6. **Present and route.**
   - Show the user a terminal summary of the report.
   - Recommend the appropriate `/bootstrap-repo` command with the recommended bootstrap input from the report.
   - Do NOT create the new repo or run `/bootstrap-repo` — the user does this.
   - After bootstrap, route product/app restarts into the research-first alignment workflow using the high-level concept seed as input: `/icp` to define who this is for, `/competitive-analysis` to map the market, `/journey-map` to map lifecycle and task flow, `/ux-variations` to explore experience directions, `/ui-interview` to specify interface details, then prototype work, `/uat --variant-evaluation`, and `/consolidate-variations` before `/spec-interview` or `/roadmap`.
   - If the business-discovery or customer-lifecycle packs are not enabled in the fresh repo, recommend `/pack install business-discovery` and `/pack install customer-lifecycle` before the research sequence.

## Output Format

```markdown
Desk-flipped: <project name>
- Report: desk-flip-report.md written to <project-path>
- Specs extracted: <count> (<valid>/<partial>/<stale>)
- Assets found: <count>
- Lessons captured: <count>

**Next work:** Reset the existing repo by archiving old implementation files, or create a new repo if the user prefers a separate fresh start
**Recommended next command:** /bootstrap-repo --reset-existing <condensed brief from report>
```

## Constraints

- **Read-only during desk-flip** — no modifications to existing files, no archival, no branch creation. The only file written by this skill is `desk-flip-report.md`.
- Do not carry forward code, dependencies, infrastructure, old research, old specs, or old task docs from the old project as active files.
- Do not create the new repo or invoke `/bootstrap-repo` — the user handles that transition.
- Do not commit or push (the report is informational, not a meaningful mutation to ship).
- Do not delete, archive, or rename anything in the old repo during desk-flip. Only the downstream `/bootstrap-repo --reset-existing` step may perform archival after the user chooses that route.
- If the project has no specs, docs, or meaningful git history, produce the report anyway but note the thin evidence in each section.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/desk-flip-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/desk-flip-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- This skill does NOT commit or push. The only side effect is `desk-flip-report.md` written to the project root.
- **Default next-step routing:** when reporting completion, include the two-line pair `**Next work:** <specific task>` and `**Recommended next command:** /bootstrap-repo --reset-existing <brief>` for in-place restarts, or `/bootstrap-repo <brief>` only when a separate new repo is explicitly the right path.
- **Post-bootstrap route:** include in the report that the fresh project should proceed from the high-level concept seed to `/icp`, then `/competitive-analysis`, `/journey-map`, `/ux-variations`, `/ui-interview`, and prototype work. Mention `/pack install business-discovery` or `/pack install customer-lifecycle` first if those packs are not enabled.
