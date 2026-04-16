---
name: analyze-sessions
description: Analyze all Claude Code session history and produce a comprehensive usage breakdown with automation recommendations
type: analysis
version: 1.0.0
---

# Analyze Sessions

Invoke as `$analyze-sessions`.

Use this skill when the user wants a data-driven breakdown of their local Claude Code usage history, repeated prompts, or workflow automation opportunities.

## Inputs

- Default history file: `~/.claude/history.jsonl`
- If the user provides another path, use that instead.

## Workflow

1. Read the full history file, not a sample.
2. Use a scriptable approach for scale. Prefer streaming or line-by-line processing for large files.
3. Extract and report:
   - Project breakdown: top projects by message volume with percentages
   - Activity categories and recurring workflow themes
   - Exact and fuzzy repeated prompt patterns
   - Common multi-step workflow sequences
4. For each major pattern, recommend the best automation shape:
   - Skill: repeatable workflow with a stable sequence
   - Agent: complex exploratory or autonomous work
   - Plugin/integration: external-service or persistent-connection workflow
   - Standing instruction/project convention: behavior that should always apply

## Output

Produce a structured report with:

- Overview stats: total messages, sessions, date range, top projects
- Categorized patterns with counts and real examples from history
- Ranked recommendations table: pattern, frequency, recommendation type, suggested name/description
- Highest-impact section: top 5 automations by avoided manual prompts

## Constraints

- Use real message examples from the history.
- Show exact counts where possible.
- Group near-identical prompts into one pattern.
- If the history file is missing or unreadable, report that clearly instead of guessing.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
