---
name: analyze-sessions
description: Analyze Claude Code and Codex session history for cross-session trends, recurring patterns, and automation opportunities
type: analysis
version: v0.4
argument-hint: "[history file, session directory, repo path, date range, or trend question]"
context_intake: artifact_only
visual_tier: visual
---

# Analyze Sessions

Use this skill when the user wants a data-driven breakdown of local Claude Code and Codex usage history across conversations, sessions, tools, projects, or time periods. This skill is for broad trend analysis, repeated prompt patterns, recurring frustrations, workflow evolution, automation opportunities, and skill performance over multiple sessions.

If the user asks about one current session, one mistake, one correction, one repo incident, or one skill failure, route to `/session-triage` instead of handling the incident here.

## Inputs

- Default Claude history file: `~/.claude/history.jsonl`
- Default Codex prompt history file: `~/.codex/history.jsonl`
- Default Codex rich session root: `~/.codex/sessions/**/*.jsonl`
- Optional paths from the user. Accept history files, session directories, repository directories, or exported logs.
- Optional filters such as repo path, project name, date range, command/skill name, exact phrase, or trend question.
- Optional model pricing table or explicit request to verify current provider pricing. Use pricing only when it is supplied by the user, present in the logs, or verified from an authoritative provider source during the run.

## Process

1. Confirm the request is broad enough for cross-session analysis:
   - Continue when the user asks for overall history, usage breakdowns, repeated prompts, recurring workflow issues, cross-tool changes, automation opportunities, or performance trends across multiple sessions.
   - Route to `/session-triage` when the user asks to investigate one immediate issue, correction, failed run, session, repo incident, or skill mistake.
   - When a request contains both a single incident and recurrence questions, recommend `/session-triage` first for the incident and use this skill afterward for frequency or trend evidence.

2. Read the full available history for the selected scope, not a sample.

3. Use a scriptable approach for scale. Prefer streaming or line-by-line processing for large files.

4. Normalize records into one common shape:
   - `source`: `claude` or `codex`
   - `timestamp`
   - `session_id`
   - `project` or `cwd`
   - `text`
   - optional token usage such as input, cached input, output, reasoning output, and total tokens
   - optional cost metadata such as estimated USD cost, billed credits, pricing source, and price-table version
   - optional metadata such as git branch, repository URL, model, provider, and CLI version

5. Parse Claude history:
   - `~/.claude/history.jsonl` lines contain user messages with fields such as `display`, `timestamp` in milliseconds, `project`, `sessionId`, and `pastedContents`.

6. Parse Codex history:
   - `~/.codex/history.jsonl` lines contain compact user prompts with `text`, `ts` in seconds, and `session_id`.
   - `~/.codex/sessions/**/*.jsonl` lines contain richer rollout records. Use `session_meta.payload.id` to map session IDs to `cwd`, git metadata, CLI version, and model/provider.
   - Include user `response_item` records only when they represent user messages. Exclude developer/system/base instruction payloads from prompt-pattern counts.
   - Prefer compact Codex prompt history for user prompt counts, enriched with rollout metadata. Use rollout user records only for prompts missing from compact history or for metadata checks.
   - Parse Codex `event_msg` records with `payload.type == "token_count"`. Normalize `payload.info.total_token_usage` and `payload.info.last_token_usage` fields such as `input_tokens`, `cached_input_tokens`, `output_tokens`, `reasoning_output_tokens`, and `total_tokens`.

7. Parse token spend and cost metadata:
   - For session-level token totals, use the final or highest cumulative `total_token_usage` snapshot per session instead of summing every cumulative snapshot.
   - For date or turn-level trends, sum deduplicated `last_token_usage` records and reconcile them against each session's final cumulative total when possible.
   - Attribute token usage by source, session, project, model, provider, and date when those fields are available; otherwise report the missing dimensions explicitly.
   - Use direct cost fields when logs include them, such as `cost`, `total_cost`, `totalCost`, `estimated_cost_usd`, or `estimatedCostUsd`, preserving their original source and units.
   - When costs are not logged, estimate USD cost only from a user-provided or freshly verified provider pricing table. Show the pricing source, retrieval date or table version, model mapping, formula, and assumptions.
   - Treat cached-input and reasoning-output tokens according to the pricing table. If the table is ambiguous, state the assumption, such as reasoning tokens billed as output tokens, and keep the estimate labeled as an estimate.
   - If no reliable cost basis is available, still report token totals and say cost is unavailable instead of guessing.

8. Extract and report:
   - Project breakdown: top projects by message volume with percentages.
   - Source breakdown: Claude vs. Codex message/session counts and date ranges.
   - Token spend breakdown: total tokens plus input, cached input, output, and reasoning output by source, project, model, and date where supported.
   - Cost breakdown: total estimated cost, cost by source/project/model/date, and top cost-driving sessions when supported by explicit cost fields or a verified/provided price table.
   - Activity categories and recurring workflow themes.
   - Exact and fuzzy repeated prompt patterns.
   - Common multi-step workflow sequences.
   - Cross-tool differences, including workflows that moved from Claude to Codex or still require different commands.
   - Skill performance patterns across multiple invocations, including recurring corrections or repeated bad recommendations when supported by scoped history evidence.

9. For each major pattern, recommend the best automation shape:
   - Skill: repeatable workflow with a stable sequence.
   - Agent: complex exploratory or autonomous work.
   - Plugin/integration: external-service or persistent-connection workflow.
   - Standing instruction/project convention: behavior that should always apply.
   - `/session-triage`: one concrete incident needs verification before a durable fix is designed.

## Remediation-Ready Handoffs

When a broad verified workflow gap routes to `/targeted-skill-builder` (skill-dev pack):

- Emit one final next route using the current runner command convention only: `/targeted-skill-builder` (skill-dev pack) `<concrete gap phrase>`.
- The command argument must name the workflow gap and likely owner surface, not just `analyze-sessions` or `targeted-skill-builder`; for example: `/targeted-skill-builder` (skill-dev pack) `run post-doc-edit validation and lessons capture gate`.
- In the recommendation table or next-work sentence, name the likely owner surface and one validation expectation, such as a layer1 contract test, focused benchmark smoke, or skill-specific validation command. If ownership is uncertain, state which evidence would decide it instead of guessing.
- Do not put both Claude slash and Codex dollar commands in the final handoff. It is fine to mention the counterpart route in cross-tool analysis, but the final `Recommended next command:` must be one Claude-native command.
- Distinguish explicit evidence from inference when labeling source, runner, project, or owner. Use language such as "explicitly says", "implies", or "not stated" rather than assigning runner ownership to sparse logs.

## Output

Produce a structured report with:

- Overview stats: total messages, sessions, date range, and top projects.
- Source comparison: Claude vs. Codex totals, top projects, command usage, and recent trend.
- Token and cost check: total tokens, token class breakdown, total estimated cost or explicit `cost unavailable`, pricing source/assumptions, and coverage gaps for sources without usage metadata.
- Categorized patterns with counts and real examples from history.
- Skill performance trends when requested or visible in the scoped data.
- Ranked recommendations table: pattern, frequency, recommendation type, suggested name/description.
- Highest-impact section: top 5 automations by avoided manual prompts.
- Recommended next skill: `/session-triage` for any concrete incident that needs verification, `/targeted-skill-builder` (skill-dev pack) `<concrete gap phrase>` for a broad verified workflow gap, or `none` when no follow-up is justified. When recommending `/targeted-skill-builder` (skill-dev pack), include the likely owner surface and validation expectation in the report.

## Constraints

- Process the entire available history for broad usage analysis, not just a sample.
- Use actual message examples from the history, not hypothetical ones.
- Be specific about frequencies; show exact counts where possible.
- Show exact token counts where available and clearly distinguish logged costs from estimated costs.
- Do not infer token counts from message length when usage metadata is missing.
- Do not estimate dollar cost from remembered or stale model pricing. Use explicit log cost fields, a user-provided price table, or a current provider source verified during the run; otherwise report cost as unavailable.
- Avoid double-counting cumulative token snapshots. For Codex `token_count` events, aggregate final session totals from `total_token_usage` and use `last_token_usage` only for deduplicated timeline or turn-level analysis.
- Group near-identical prompts together.
- Deduplicate Codex prompts that appear in both `~/.codex/history.jsonl` and rollout files by `(session_id, timestamp, normalized text)` where possible.
- Do not include system, developer, base instruction, or tool output text in repeated-prompt counts.
- Do not diagnose one immediate issue here; route it to `/session-triage`.
- Do not create or modify GitHub Actions workflows.
- If one source is missing or unreadable, report that clearly and continue with the other source instead of guessing.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, prepend `npx skillpacks install <pack-name>` to the recommendation.

## Alignment Page

By default, this skill reports results inline and writes only its normal durable artifacts (for example `tasks/*.md`, reports, queues, benchmark notes, status docs, or other skill-specific files). Do not build an alignment page automatically. Create `alignment/analyze-sessions-{topic}.html` only when the user explicitly requests an alignment page or when you explicitly identify a concrete clarification/review need that cannot be handled cleanly inline; when you create one, follow `ALIGNMENT-PAGE.md` in this skill's directory.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
