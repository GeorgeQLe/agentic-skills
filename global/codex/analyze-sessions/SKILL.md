---
name: analyze-sessions
description: Analyze Claude Code and Codex session history and produce a usage breakdown with automation recommendations
type: analysis
version: 1.1.0
---

# Analyze Sessions

Invoke as `$analyze-sessions`.

Use this skill when the user wants a data-driven breakdown of their local Claude Code and Codex usage history, repeated prompts, cross-tool workflow changes, or workflow automation opportunities.

## Inputs

- Default Claude history file: `~/.claude/history.jsonl`
- Default Codex prompt history file: `~/.codex/history.jsonl`
- Default Codex rich session root: `~/.codex/sessions/**/*.jsonl`
- If the user provides one or more paths, use those instead. Accept files or directories.

## Workflow

1. Read the full available history, not a sample.
2. Use a scriptable approach for scale. Prefer streaming or line-by-line processing for large files.
3. Normalize records into one common shape:
   - `source`: `claude` or `codex`
   - `timestamp`
   - `session_id`
   - `project` or `cwd`
   - `text`
   - optional metadata such as git branch, repository URL, model, and CLI version
4. Parse Claude history:
   - `~/.claude/history.jsonl` lines contain user messages with `display`, `timestamp` in milliseconds, `project`, `sessionId`, and `pastedContents`.
5. Parse Codex history:
   - `~/.codex/history.jsonl` lines contain compact user prompts with `text`, `ts` in seconds, and `session_id`.
   - `~/.codex/sessions/**/*.jsonl` lines contain richer rollout records. Use `session_meta.payload.id` to map session IDs to `cwd`, git metadata, CLI version, and model/provider.
   - Include user `response_item` records only when they represent user messages. Exclude developer/system/base instruction payloads from prompt-pattern counts.
   - Prefer the compact prompt history for user prompt counts, enriched with session metadata from rollout files. Use rollout user records only for prompts missing from the compact history or for metadata checks.
6. Extract and report:
   - Project breakdown: top projects by message volume with percentages
   - Source breakdown: Claude vs. Codex message/session counts and date ranges
   - Activity categories and recurring workflow themes
   - Exact and fuzzy repeated prompt patterns
   - Common multi-step workflow sequences
   - Cross-tool differences, including workflows that moved from Claude to Codex or still require different commands
7. For each major pattern, recommend the best automation shape:
   - Skill: repeatable workflow with a stable sequence
   - Agent: complex exploratory or autonomous work
   - Plugin/integration: external-service or persistent-connection workflow
   - Standing instruction/project convention: behavior that should always apply

## Output

Produce a structured report with:

- Overview stats: total messages, sessions, date range, top projects
- Source comparison: Claude vs. Codex totals, top projects, command usage, and recent trend
- Categorized patterns with counts and real examples from history
- Ranked recommendations table: pattern, frequency, recommendation type, suggested name/description
- Highest-impact section: top 5 automations by avoided manual prompts

## Constraints

- Use real message examples from the history.
- Show exact counts where possible.
- Group near-identical prompts into one pattern.
- Deduplicate Codex prompts that appear in both `~/.codex/history.jsonl` and rollout files by `(session_id, timestamp, normalized text)` where possible.
- Do not include system, developer, base instruction, or tool output text in repeated-prompt counts.
- If one source is missing or unreadable, report that clearly and continue with the other source instead of guessing.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
