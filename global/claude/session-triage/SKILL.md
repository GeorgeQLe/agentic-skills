---
name: session-triage
description: Investigate one immediate session, correction, repo incident, or skill failure and recommend a verified fix
type: analysis
version: v0.0
argument-hint: "[session id/file, repo path, skill name/path, correction text, or issue description]"
---

# Session Triage

Use this skill when the user wants a focused investigation of one immediate issue: a current conversation problem, one correction, one session, one repo incident, one failed run, or one suspected skill failure. This skill verifies what happened before recommending a durable fix.

Use `/analyze-sessions` instead when the user wants broad cross-session trends, recurring frustration analysis, performance evaluation over time, repeated prompt patterns, or automation opportunities.

## Inputs

- Active conversation context.
- Optional session ID, session file, or exported log.
- Optional repository path or current working directory.
- Optional skill name or `SKILL.md` path.
- Optional user correction text, error output, test failure, log excerpt, file path, commit, or issue description.

## Process

1. Define the investigation scope:
   - Treat the current conversation and current working directory as the default scope.
   - Prefer user-provided session IDs, files, repo paths, skill names, exact correction phrases, errors, logs, and test failures over broad history searches.
   - Resolve named skills from `global/codex`, `global/claude`, `packs`, project-local `.agents`, `.codex`, `.claude`, and installed `~/.codex/skills` or `~/.claude/skills` as read-only fallback evidence.
   - Do not create an `/analyze-session` alias or route; use this distinct command name to avoid singular/plural confusion.

2. Gather narrow evidence first:
   - Read the target skill contract when a skill is named.
   - Read directly relevant project instructions such as `AGENTS.md`, `CLAUDE.md`, task docs, pack docs, logs, or test output.
   - Search only the scoped repo/session/history for the issue text, skill name, invocation command, relevant file paths, user correction, and nearby agent actions.
   - Include the active conversation as evidence when the correction is happening now.
   - Broaden to `/analyze-sessions` only when recurrence, frequency, or trend evidence is needed.

3. Verify the issue before diagnosing:
   - Separate the **user-identified issue** from the **agent-verified issue**.
   - Classify the verification verdict as `verified`, `partially verified`, `not verified`, or `inconclusive`.
   - A verified issue requires evidence for what the agent did, what the skill/repo/user contract required, and why the outcome was wrong or risky.
   - If evidence shows the skill contract was adequate and the agent ignored it, say that directly.

4. Build a concise timeline:
   - User request or trigger.
   - Skill or instruction that should have applied.
   - Agent action or omission.
   - Failure, correction, or observed impact.
   - Relevant repo/session state.

5. Diagnose root cause:
   - Identify whether the cause is a missing trigger, ambiguous trigger, missing evidence gate, insufficient scope resolution, weak output contract, bad next-step routing, missing validation, missing safety constraint, stale mirrored contract, repo instruction conflict, or agent noncompliance with an adequate contract.
   - Compare Claude and Codex skill versions when both exist and flag mirrored drift.
   - Check `tasks/lessons.md` when working in `agentic-skills`; reuse existing lessons or recommend a new lesson when the pattern is novel.
   - For benchmark failures, check recent same-skill `benchmark/triage-<skill>-*.md` reports and `tasks/lessons.md` before recommending a narrow tolerance patch. If two or more recent reports classify the same family of valid outputs as benchmark false negatives, stop patching individual phrasings and route to a generalized rubric, semantic evaluator, fixture-family, or infrastructure-classifier fix that covers the family.

6. Recommend the smallest durable fix:
   - Name exact skill file(s), instruction file(s), or docs to change.
   - Provide concrete rule text or workflow-step wording when a skill-contract change is justified.
   - Include validation checks that prove the revised behavior prevents the issue, such as targeted `rg` checks, mirrored contract checks, version checks, replay of the decision path, or the failing test/log command.
   - For repeated benchmark false-negative families, the recommended fix must name the owning harness or setup file, the family-level behavior to recognize or reject, positive and negative fixture shapes to add, and a validation command such as focused layer1 setup tests plus `pnpm --dir tests verify --skill <skill>`.
   - Route verified skill changes to `/targeted-skill-builder` for a narrow update or `/create-agentic-skill` for a new repo-managed skill.

## Output Format

Produce a structured report with:

- Target: session/repo/skill scope and evidence sources.
- User-identified issue: the user's claim in concise terms.
- Verification verdict: `verified`, `partially verified`, `not verified`, or `inconclusive`, with supporting evidence.
- Timeline: short sequence from trigger to correction or impact.
- Root cause: the specific contract gap, repo conflict, or agent noncompliance pattern.
- Responsible contract gap: skill, project instruction, task doc, or none.
- Recommended fix: exact file(s), section(s), and proposed wording or behavior change.
- Validation plan: commands or checks to prove the fix.
- Confidence and evidence gaps: what is known, what could not be verified, and whether `/analyze-sessions` is needed for recurrence analysis.
- Recommended next skill: `/targeted-skill-builder`, `/create-agentic-skill`, `/analyze-sessions`, or `none` when no follow-up is justified.

## Constraints

- Start narrow and evidence-bound; do not scan all local history by default.
- Do not claim a user-identified issue is agent-verified without independent evidence.
- Do not modify the target skill during analysis unless the user also asked for implementation and the active workflow permits edits.
- Do not recommend a skill change when the evidence points only to one-off agent noncompliance and the contract is already clear.
- Do not create or suggest `/analyze-session`; use `/session-triage`.
- Do not create or modify GitHub Actions workflows.
- If a source is missing or unreadable, report that clearly and continue with available evidence instead of guessing.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/session-triage-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/session-triage-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
