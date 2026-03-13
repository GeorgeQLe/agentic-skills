---
name: analyze-sessions
description: Analyze local Claude Code session history and produce a structured usage report with repeated workflow patterns, automation opportunities, and concrete recommendations for skills, agents, plugins, or standing instructions.
---

# Analyze Sessions

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
