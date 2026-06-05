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

## Process

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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/analyze-sessions-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
