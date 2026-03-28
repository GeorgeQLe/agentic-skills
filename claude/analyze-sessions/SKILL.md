---
name: analyze-sessions
description: Analyze all Claude Code session history and produce a comprehensive usage breakdown with automation recommendations
version: 1.0.0
---

Analyze all Claude Code session history on this computer and produce a comprehensive usage breakdown.

Process:
1) Read `~/.claude/history.jsonl` which contains all user messages across all sessions. Each line is JSON with fields: `display` (user message), `timestamp`, `project`, `sessionId`, `pastedContents`.
2) Use Python to process the file efficiently. Extract and analyze:
   a) **Project breakdown**: Count messages per project directory. Show top 10 projects by volume with percentages.
   b) **Activity categorization**: Cluster user messages into themes/patterns. Look for:
      - Repeated exact or near-identical messages (potential automation targets)
      - Common workflow patterns (commit/push, deploy, review, planning, debugging, scaffolding, session start/end rituals)
      - Slash command usage frequency
      - Types of work: feature development, bug fixes, refactoring, infrastructure, documentation, testing
   c) **Repetition analysis**: Find the most frequently repeated messages or message patterns (exact and fuzzy matches). These are the highest-value automation targets.
   d) **Workflow sequences**: Identify common multi-step sequences (e.g., "implement -> commit -> push -> plan next").

3) For each identified pattern, recommend the best automation type:
   - **Skill (slash command)**: For repetitive manual workflows that follow a fixed sequence of steps. Best when the user types the same instruction repeatedly. Examples: commit-push routines, session start/end rituals, deployment commands, scaffolding.
   - **Plugin**: For integrations with external tools/services that need persistent connections or background processing. Best for: monitoring, notifications, external API wrappers, data syncing.
   - **Agent**: For complex multi-step autonomous tasks that require exploration, decision-making, and significant context. Best for: code reviews, large refactors, deployment pipelines with verification, research tasks.
   - **CLAUDE.md instruction**: For behavioral preferences and defaults that should always apply. Best for: coding style, debug approach, response format, "always do X after Y" rules, project lifecycle conventions.

4) Output a structured report with:
   - Overview stats (total messages, sessions, date range, top projects)
   - Categorized activity patterns with message counts and specific examples from the history
   - Ranked recommendations table: pattern → frequency → recommendation type → suggested name/description
   - "Highest impact" section: top 5 automations ranked by how many manual messages they'd eliminate

Constraints:
- Process the entire history file, not just a sample.
- Use actual message examples from the history, not hypothetical ones.
- Be specific about frequencies — show exact counts.
- Group near-identical messages together (e.g., "commit and push" / "commit this and push" / "can you commit and push" are the same pattern).
- If the history file is very large, use streaming/line-by-line processing in Python rather than loading it all into memory at once.
