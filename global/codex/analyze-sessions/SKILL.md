---
name: analyze-sessions
description: Analyze Claude Code and Codex session history for cross-session trends, recurring patterns, and automation opportunities
type: analysis
version: v0.1
argument-hint: "[history file, session directory, repo path, date range, or trend question]"
---

# Analyze Sessions

Invoke as `$analyze-sessions`.

Use this skill when the user wants a data-driven breakdown of local Claude Code and Codex usage history across conversations, sessions, tools, projects, or time periods. This skill is for broad trend analysis, repeated prompt patterns, recurring frustrations, workflow evolution, automation opportunities, and skill performance over multiple sessions.

If the user asks about one current session, one mistake, one correction, one repo incident, or one skill failure, route to `$session-triage` instead of handling the incident here.

## Inputs

- Default Claude history file: `~/.claude/history.jsonl`
- Default Codex prompt history file: `~/.codex/history.jsonl`
- Default Codex rich session root: `~/.codex/sessions/**/*.jsonl`
- Optional paths from the user. Accept history files, session directories, repository directories, or exported logs.
- Optional filters such as repo path, project name, date range, command/skill name, exact phrase, or trend question.

## Workflow

1. Confirm the request is broad enough for cross-session analysis:
   - Continue when the user asks for overall history, usage breakdowns, repeated prompts, recurring workflow issues, cross-tool changes, automation opportunities, or performance trends across multiple sessions.
   - Route to `$session-triage` when the user asks to investigate one immediate issue, correction, failed run, session, repo incident, or skill mistake.
   - When a request contains both a single incident and recurrence questions, recommend `$session-triage` first for the incident and use this skill afterward for frequency or trend evidence.

2. Read the full available history for the selected scope, not a sample.

3. Use a scriptable approach for scale. Prefer streaming or line-by-line processing for large files.

4. Normalize records into one common shape:
   - `source`: `claude` or `codex`
   - `timestamp`
   - `session_id`
   - `project` or `cwd`
   - `text`
   - optional metadata such as git branch, repository URL, model, provider, and CLI version

5. Parse Claude history:
   - `~/.claude/history.jsonl` lines contain user messages with fields such as `display`, `timestamp` in milliseconds, `project`, `sessionId`, and `pastedContents`.

6. Parse Codex history:
   - `~/.codex/history.jsonl` lines contain compact user prompts with `text`, `ts` in seconds, and `session_id`.
   - `~/.codex/sessions/**/*.jsonl` lines contain richer rollout records. Use `session_meta.payload.id` to map session IDs to `cwd`, git metadata, CLI version, and model/provider.
   - Include user `response_item` records only when they represent user messages. Exclude developer/system/base instruction payloads from prompt-pattern counts.
   - Prefer compact Codex prompt history for user prompt counts, enriched with rollout metadata. Use rollout user records only for prompts missing from compact history or for metadata checks.

7. Extract and report:
   - Project breakdown: top projects by message volume with percentages.
   - Source breakdown: Claude vs. Codex message/session counts and date ranges.
   - Activity categories and recurring workflow themes.
   - Exact and fuzzy repeated prompt patterns.
   - Common multi-step workflow sequences.
   - Cross-tool differences, including workflows that moved from Claude to Codex or still require different commands.
   - Skill performance patterns across multiple invocations, including recurring corrections or repeated bad recommendations when supported by scoped history evidence.

8. For each major pattern, recommend the best automation shape:
   - Skill: repeatable workflow with a stable sequence.
   - Agent: complex exploratory or autonomous work.
   - Plugin/integration: external-service or persistent-connection workflow.
   - Standing instruction/project convention: behavior that should always apply.
   - `$session-triage`: one concrete incident needs verification before a durable fix is designed.

## Remediation-Ready Handoffs

When a broad verified workflow gap routes to `$targeted-skill-builder`:

- Emit one final next route using the current runner command convention only: `$targeted-skill-builder <concrete gap phrase>`.
- The command argument must name the workflow gap and likely owner surface, not just `analyze-sessions` or `targeted-skill-builder`; for example: `$targeted-skill-builder run post-doc-edit validation and lessons capture gate`.
- In the recommendation table or next-work sentence, name the likely owner surface and one validation expectation, such as a layer1 contract test, focused benchmark smoke, or skill-specific validation command. If ownership is uncertain, state which evidence would decide it instead of guessing.
- Do not put both Claude slash and Codex dollar commands in the final handoff. It is fine to mention the counterpart route in cross-tool analysis, but the final `Recommended next command:` must be one Codex-native command.
- Distinguish explicit evidence from inference when labeling source, runner, project, or owner. Use language such as "explicitly says", "implies", or "not stated" rather than assigning runner ownership to sparse logs.

## Output

Produce a structured report with:

- Overview stats: total messages, sessions, date range, and top projects.
- Source comparison: Claude vs. Codex totals, top projects, command usage, and recent trend.
- Categorized patterns with counts and real examples from history.
- Skill performance trends when requested or visible in the scoped data.
- Ranked recommendations table: pattern, frequency, recommendation type, suggested name/description.
- Highest-impact section: top 5 automations by avoided manual prompts.
- Recommended next skill: `$session-triage` for any concrete incident that needs verification, `$targeted-skill-builder <concrete gap phrase>` for a broad verified workflow gap, or `none` when no follow-up is justified. When recommending `$targeted-skill-builder`, include the likely owner surface and validation expectation in the report.

## Constraints

- Use real message examples from history.
- Show exact counts where possible.
- Group near-identical prompts into one pattern.
- Deduplicate Codex prompts that appear in both `~/.codex/history.jsonl` and rollout files by `(session_id, timestamp, normalized text)` where possible.
- Do not include system, developer, base instruction, or tool output text in repeated-prompt counts.
- Do not diagnose one immediate issue here; route it to `$session-triage`.
- Do not create or modify GitHub Actions workflows.
- If one source is missing or unreadable, report that clearly and continue with the other source instead of guessing.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/analyze-sessions-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

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

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/analyze-sessions-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
