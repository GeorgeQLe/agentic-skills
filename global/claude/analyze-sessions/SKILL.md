---
name: analyze-sessions
description: Analyze Claude Code and Codex session history and produce a usage breakdown with automation recommendations
type: analysis
version: 1.1.0
argument-hint:
---

# Analyze Sessions

Analyze all Claude Code and Codex session history on this computer and produce a comprehensive usage breakdown.

## Process

1. **Read session histories:**
   - Read `~/.claude/history.jsonl` when present. Each line contains a Claude user message with fields such as `display`, `timestamp` in milliseconds, `project`, `sessionId`, and `pastedContents`.
   - Read `~/.codex/history.jsonl` when present. Each line contains a compact Codex user prompt with `text`, `ts` in seconds, and `session_id`.
   - Read `~/.codex/sessions/**/*.jsonl` when present. These richer Codex rollout files include `session_meta.payload.id`, `cwd`, git metadata, CLI version, model/provider, and response items.
   - If the user provides paths, use those instead of the defaults. Accept files or directories. Report missing or unreadable sources and continue with the available history.

2. **Normalize records:**
   - Use Python to process files efficiently. Prefer streaming or line-by-line processing for large histories.
   - Normalize all user prompts into a common shape:
     - `source`: `claude` or `codex`
     - `timestamp`
     - `session_id`
     - `project` or `cwd`
     - `text`
     - optional metadata such as git branch, repository URL, model, provider, and CLI version
   - For Codex, prefer `~/.codex/history.jsonl` for prompt counts and enrich those records with metadata from rollout files. Use rollout user records only for prompts missing from the compact history or for metadata checks.
   - Include Codex `response_item` records only when they represent user messages. Exclude developer, system, base instruction, and tool output payloads from prompt-pattern counts.

3. **Process and analyze:**
   - Extract and analyze:
     - **Project breakdown**: Count messages per project directory. Show top 10 projects by volume with percentages.
     - **Source breakdown**: Count messages and sessions by tool. Compare Claude vs. Codex date ranges, top projects, slash command usage, and recent trends.
     - **Activity categorization**: Cluster user messages into themes/patterns. Look for:
       - Repeated exact or near-identical messages (potential automation targets)
       - Common workflow patterns (commit/push, deploy, review, planning, debugging, scaffolding, session start/end rituals)
       - Slash command usage frequency
       - Types of work: feature development, bug fixes, refactoring, infrastructure, documentation, testing
     - **Repetition analysis**: Find the most frequently repeated messages or message patterns (exact and fuzzy matches). These are the highest-value automation targets.
     - **Workflow sequences**: Identify common multi-step sequences (e.g., "implement -> commit -> push -> plan next").
     - **Cross-tool workflow changes**: Identify workflows that moved from Claude to Codex, workflows still split across both tools, and repeated instructions that now need pack- or tool-specific streamlining.

4. **Recommend automations:**
   - For each identified pattern, recommend the best automation type:
     - **Skill (slash command)**: For repetitive manual workflows that follow a fixed sequence of steps. Best when the user types the same instruction repeatedly. Examples: commit-push routines, session start/end rituals, deployment commands, scaffolding.
     - **Plugin**: For integrations with external tools/services that need persistent connections or background processing. Best for: monitoring, notifications, external API wrappers, data syncing.
     - **Agent**: For complex multi-step autonomous tasks that require exploration, decision-making, and significant context. Best for: code reviews, large refactors, deployment pipelines with verification, research tasks.
     - **CLAUDE.md instruction**: For behavioral preferences and defaults that should always apply. Best for: coding style, debug approach, response format, "always do X after Y" rules, project lifecycle conventions.

## Output Format

Display a structured report with:

- Overview stats (total messages, sessions, date range, top projects)
- Source comparison: Claude vs. Codex totals, top projects, command usage, and recent trend
- Categorized activity patterns with message counts and specific examples from the history
- Ranked recommendations table: pattern → frequency → recommendation type → suggested name/description
- "Highest impact" section: top 5 automations ranked by how many manual messages they'd eliminate

## Constraints

- Process the entire available history, not just a sample.
- Use actual message examples from the history, not hypothetical ones.
- Be specific about frequencies — show exact counts.
- Group near-identical messages together (e.g., "commit and push" / "commit this and push" / "can you commit and push" are the same pattern).
- Deduplicate Codex prompts that appear in both `~/.codex/history.jsonl` and rollout files by `(session_id, timestamp, normalized text)` where possible.
- Do not include system, developer, base instruction, or tool output text in repeated-prompt counts.
- If one source is missing or unreadable, report that clearly and continue with the other source instead of guessing.
- If the history files are very large, use streaming/line-by-line processing in Python rather than loading them all into memory at once.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
