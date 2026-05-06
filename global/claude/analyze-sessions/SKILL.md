---
name: analyze-sessions
description: Analyze Claude Code and Codex session history, including targeted retrospectives on a skill's verified performance mistakes
type: analysis
version: 1.2.0
argument-hint: "[skill name/path, repo/session path, or mistake description]"
---

# Analyze Sessions

Use this skill when the user wants either a data-driven breakdown of local Claude Code and Codex usage history or a targeted retrospective on how a particular skill performed in a repository/session after a user identified a possible mistake.

## Inputs

- Default Claude history file: `~/.claude/history.jsonl`
- Default Codex prompt history file: `~/.codex/history.jsonl`
- Default Codex rich session root: `~/.codex/sessions/**/*.jsonl`
- Optional paths from the user. Accept history files, session files, repository directories, or skill files.
- Optional target skill. Accept `/skill-name`, `skill-name`, a `SKILL.md` path, or a pack/project-local skill path.
- Optional mistake description. Treat this as a user-identified claim until independently verified from session, repo, log, test, or skill-contract evidence.

## Process

1. Choose the analysis mode:
   - Use **broad usage analysis** when the user asks for overall history, usage breakdowns, repeated prompts, workflow trends, or automation opportunities without naming a target skill or mistake.
   - Use **targeted skill retrospective** when the user names a skill, provides a skill path, points at a repo/session, cites a correction, or asks why a skill led to a bad recommendation or behavior.
   - If both are requested, run the targeted retrospective first, then use broader history only for recurrence and frequency evidence.

2. For broad usage analysis:
   - Read the full available history, not a sample.
   - Use a scriptable approach for scale. Prefer streaming or line-by-line processing for large files.
   - Normalize records into one common shape:
     - `source`: `claude` or `codex`
     - `timestamp`
     - `session_id`
     - `project` or `cwd`
     - `text`
     - optional metadata such as git branch, repository URL, model, and CLI version
   - Parse Claude history from `~/.claude/history.jsonl` lines with fields such as `display`, `timestamp` in milliseconds, `project`, `sessionId`, and `pastedContents`.
   - Parse Codex history from `~/.codex/history.jsonl` compact prompts and `~/.codex/sessions/**/*.jsonl` rollout records. Use `session_meta.payload.id` to map session IDs to `cwd`, git metadata, CLI version, and model/provider.
   - Include user `response_item` records only when they represent user messages. Exclude developer/system/base instruction payloads from prompt-pattern counts.
   - Prefer compact Codex prompt history for user prompt counts, enriched with rollout metadata. Use rollout user records only for prompts missing from compact history or for metadata checks.
   - Extract project breakdowns, source breakdowns, activity categories, repeated prompts, common multi-step sequences, cross-tool workflow changes, and automation recommendations.

3. For targeted skill retrospectives, resolve the target skill and scope:
   - Treat the current working directory as the invoking repo unless the user provided a repo path or session path.
   - If running inside `agentic-skills`, search `global/codex`, `global/claude`, and `packs` for the named skill.
   - If running from another repo, search project-local `.agents`, `.codex`, `.claude`, and pack directories first, then use installed `~/.codex/skills` or `~/.claude/skills` only as read-only fallback evidence.
   - If the user provides a `SKILL.md` path, use it as the primary contract and still check the mirrored Claude/Codex counterpart when it exists.
   - Use Codex rollout `session_meta.payload.cwd`, git metadata, and Claude `project` fields to associate sessions with the invoking repo. Prefer user-provided session IDs, files, date ranges, or exact correction phrases before broader searches.
   - Report the resolved skill path, repo/session scope, and whether the evidence came from `agentic-skills`, a project-local copy, an installed copy, or local session history.

4. Gather targeted evidence:
   - Read the target skill contract and any directly related project instructions such as `AGENTS.md`, `CLAUDE.md`, task docs, or pack docs when they affect the target behavior.
   - Search only the scoped repo/session/history for the skill name, invocation command, user correction text, claimed mistake, relevant file paths, and nearby agent actions.
   - Include the current conversation as evidence when the correction is happening in the active session.
   - Broaden to full Claude/Codex history only when scoped evidence is insufficient or the user explicitly asks for recurrence analysis. State when and why the scope was broadened.
   - Keep excerpts short, redact secrets, and do not include unrelated private prompt text.

5. Verify the mistake before diagnosing it:
   - Separate the **user-identified mistake** from the **agent-verified mistake**.
   - A mistake is agent-verified only when independent evidence shows what the agent did, what the skill or repo contract required, and why the outcome was wrong or risky.
   - Classify the verdict as `verified`, `partially verified`, `not verified`, or `inconclusive`.
   - If the evidence shows the skill already gave the correct instruction and the agent ignored it, say that directly. Recommend a skill wording change only if it would materially reduce recurrence.

6. Diagnose the skill-contract failure:
   - Identify whether the root cause is a missing trigger, ambiguous trigger, missing evidence gate, insufficient scope resolution, weak output contract, bad next-step routing, missing validation, missing safety constraint, stale mirrored contract, or agent noncompliance with an adequate contract.
   - Compare Claude and Codex versions when both exist. Flag drift when one version would prevent the mistake and the other would not.
   - Check `tasks/lessons.md` when working in `agentic-skills`; reuse existing lessons that match the correction and recommend a new lesson when the pattern is novel.

7. Recommend the smallest durable fix:
   - Name the exact skill file(s) and section(s) to change.
   - Provide concrete rule text or workflow-step wording, not just a generic suggestion.
   - Include validation checks that would prove the skill now prevents the mistake, such as targeted `rg` checks, mirrored contract checks, version checks, and a replay of the corrected decision path.
   - If implementation is requested, route the verified fix to `/targeted-skill-builder` or `/create-agentic-skill` as appropriate. Otherwise, keep the output as an analysis report.

## Output Format

For broad usage analysis, produce a structured report with:

- Overview stats: total messages, sessions, date range, top projects
- Source comparison: Claude vs. Codex totals, top projects, command usage, and recent trend
- Categorized patterns with counts and real examples from history
- Ranked recommendations table: pattern, frequency, recommendation type, suggested name/description
- Highest-impact section: top 5 automations by avoided manual prompts

For targeted skill retrospectives, produce a structured report with:

- Target: skill name, resolved skill file(s), invoking repo/session scope, and evidence sources
- User-identified mistake: the user's claim in concise terms
- Verification verdict: `verified`, `partially verified`, `not verified`, or `inconclusive`, with the evidence that supports the verdict
- What happened: short timeline of user prompt, skill trigger, agent behavior, correction, and relevant repo/session state
- Root cause: the specific skill-contract gap or agent noncompliance pattern
- Recommended skill fixes: exact file(s), section(s), and proposed wording or workflow changes
- Validation plan: commands or checks to prove the revised skill prevents the mistake
- Confidence and gaps: what is known, what could not be verified, and whether broader session analysis is needed
- Recommended next skill: `/targeted-skill-builder` for a verified narrow update, `/create-agentic-skill` for a new repo-managed skill, or `none` when no skill change is justified

## Constraints

- Process the entire available history for broad usage analysis, not just a sample.
- Use actual message examples from the history or active conversation, not hypothetical ones.
- Be specific about frequencies; show exact counts where possible.
- Group near-identical prompts together.
- Deduplicate Codex prompts that appear in both `~/.codex/history.jsonl` and rollout files by `(session_id, timestamp, normalized text)` where possible.
- Do not include system, developer, base instruction, or tool output text in repeated-prompt counts.
- Do not claim a user-identified mistake is agent-verified without independent evidence.
- Do not run broad full-history scans for targeted retrospectives until scoped evidence has been checked or the user explicitly requests recurrence analysis.
- Do not modify the target skill during analysis unless the user also asked for implementation and the active workflow permits edits.
- Do not create or modify GitHub Actions workflows.
- If one source is missing or unreadable, report that clearly and continue with the other source instead of guessing.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
