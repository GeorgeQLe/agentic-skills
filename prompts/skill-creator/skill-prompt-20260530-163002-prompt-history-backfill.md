---
skill: skill-creator
agent: codex
captured_at: 2026-05-30T16:30:02-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Prompt History Backfill Skill

## Summary

Create a new mirrored session-analytics skill named `prompt-history-backfill` for both Claude and Codex. It will scan local Claude/Codex conversation history for visible user prompts that invoked skills, compare them against the repository’s `prompts/<skill-slug>/` convention, and produce a reviewable backfill report by default. It will only write missing prompt files when explicitly invoked with an apply flag.

## Key Changes

- Add `packs/session-analytics/claude/prompt-history-backfill/SKILL.md` and `packs/session-analytics/codex/prompt-history-backfill/SKILL.md`.
- Add Codex UI metadata at `packs/session-analytics/codex/prompt-history-backfill/agents/openai.yaml`.
- Update `packs/session-analytics/PACK.md` to list the new skill.
- Add `CHANGELOG.md` files for the new mirrored skill roots.
- Refresh generated Skills Showcase data after the new skill is added.

## Skill Behavior

- Invocation names:
  - Claude: `/prompt-history-backfill`
  - Codex: `$prompt-history-backfill`
- Default mode: report-only.
- Write mode: explicit `--apply`.
- Default target repo: current working directory.
- Optional arguments:
  - `--repo <path>` to target another repository.
  - `--skill <slug>` to limit to one skill.
  - `--since YYYY-MM-DD` / `--until YYYY-MM-DD` for date filters.
  - `--apply` to create missing prompt files.
- Read sources:
  - `~/.claude/history.jsonl`
  - `~/.codex/history.jsonl`
  - `~/.codex/sessions/**/*.jsonl`
  - Optional user-provided history/export paths.
- Candidate detection:
  - High confidence: visible user prompt begins with or clearly invokes `/skill-name`, `$skill-name`, or “You have the <skill> skill installed.”
  - Medium confidence: visible user prompt names a known skill and asks to use it, but does not use command syntax.
  - Low confidence: exclude from writes; report only.
- Secret handling:
  - Before writing, scan candidate prompt text for likely secrets.
  - If a candidate contains a likely secret, do not write it; report it as blocked and ask for a sanitized prompt.
- Output:
  - In report-only mode, write a review artifact such as `alignment/prompt-history-backfill-{topic}.html` following the pack’s alignment-page convention, plus a concise chat summary.
  - In `--apply` mode, create missing files under `prompts/<skill-slug>/skill-prompt-YYYYMMDD-HHMMSS-<short-topic>.md`.
  - Use YAML frontmatter exactly matching the project convention: `skill`, `agent`, `captured_at`, `source`, and `prompt_scope: visible-user-invocation`.
  - Preserve exact visible user prompt content without summarizing, redacting, or truncating.
  - Skip existing identical prompt files. If a timestamp filename collides with different content, add a deterministic short session suffix while preserving the `skill-prompt-YYYYMMDD-HHMMSS-<short-topic>` base.

## Tests

- Add focused layer1 contract coverage asserting:
  - Both mirrored skill files exist and have `version: v0.0`.
  - The skill defaults to report-only and requires `--apply` before creating prompt files.
  - It reads the expected Claude/Codex history sources.
  - It writes only under `prompts/<skill-slug>/`.
  - It includes required YAML frontmatter fields and `prompt_scope: visible-user-invocation`.
  - It preserves exact visible prompt text and excludes hidden system/developer/tool output.
  - It blocks likely secrets instead of writing them.
  - `PACK.md` lists `prompt-history-backfill`.
- Run:
  - Focused layer1 tests for the new contract.
  - `bash scripts/skill-versions.sh --missing`.
  - `scripts/validate-skills-showcase-data.sh`.
  - `git diff --check`.

## Assumptions

- The skill belongs in `packs/session-analytics` because it reads conversation/session history and produces session-derived artifacts.
- The implementation should be mirrored for Claude and Codex.
- The safe default is report-only; writing backfilled prompt artifacts requires `--apply`.
- The target repository defaults to the current working directory, with optional `--repo <path>` for other repos.
