---
name: targeted-skill-builder
description: Build or update one specific skill from a concrete workflow gap, correction, or repeated bad recommendation
type: execution
version: v0.5
required_conventions: [alignment-page]
argument-hint: "[workflow gap, correction, skill name, or capability request]"
---

# Targeted Skill Builder

Use this skill when the user wants a narrow, durable workflow improvement from the current prompt or conversation: a concrete problem, user correction, repeated bad recommendation, or capability gap that may deserve a new skill, an existing-skill update, or a reusable prompt/template.

This is intentionally narrower than `/analyze-sessions`. Do not scan all Claude/Codex history by default. Treat broad session analysis as optional evidence only when the user explicitly asks for it. Use `/session-triage` first when one immediate issue, correction, repo incident, or suspected skill failure still needs verification before a skill change is designed.

## Process

1. Read `tasks/lessons.md` first when it exists. Extract only correction patterns relevant to the user's current request.
2. Identify the narrow workflow gap:
   - Problem or correction.
   - Triggering context from the current prompt/conversation.
   - Bad recommendation or missing capability to prevent.
   - Desired future behavior.
3. Ask for the intended output unless the user already made it explicit:
   - New skill.
   - Update existing skill.
   - Reusable prompt/template only.
   - Unsure, recommend.
4. Gather only targeted evidence:
   - Use the current prompt and conversation context first.
   - Read a named skill file when provided.
   - Inspect user-provided files or paths when provided.
   - Route to `/session-triage` when the user wants investigation of one immediate issue or the available evidence is not enough to verify the correction.
   - If examples are needed, ask for them or run a tightly scoped history query limited by path, skill name, date range, or exact phrase.
   - Do not scan all session history unless explicitly requested.
5. Search existing skills for overlap before creating anything:
   - Search `base/claude`, `base/codex`, `packs`, and project-local `.claude/skills` or `.codex/skills` when present.
   - Compare name, description, workflow, and next-step routing behavior.
   - If an existing skill substantially covers the job, recommend updating that skill instead of adding a duplicate.
6. Decide the smallest durable fix:
   - New skill: choose this only when no existing skill owns the workflow and the behavior is repeatable.
   - Existing skill update: choose this when the fix is a missing branch, constraint, evidence gate, or routing correction inside an existing workflow.
   - Reusable prompt/template: choose this when the behavior is too situational or not stable enough for a skill.
   - No repository change: choose this when the request is already covered and only needs a usage note.
7. Resolve the destination:
   - Default new shared Claude/Codex skills to this repository: `/Users/georgele/projects/tools/agentic-skills/base/claude/<name>/SKILL.md` and `/Users/georgele/projects/tools/agentic-skills/base/codex/<name>/SKILL.md`.
   - If the current session is not in the agentic-skills repository and the user wants to audit or amend an existing shared skill, do not edit a local copy. Provide a concise prompt for the user to run from `/Users/georgele/projects/tools/agentic-skills` with the target skill path and requested adjustment.
   - Use user-local `~/.claude/skills` or `~/.codex/skills` only when the user explicitly asks for a personal/local skill.
8. If creating or updating a repository skill:
   - Follow existing frontmatter conventions: `name`, specific `description`, `type`, `version`, and `argument-hint` when useful.
   - Keep `SKILL.md` concise and operational.
   - Include clear trigger conditions, process steps, outputs, constraints, and next-step routing for mutation-capable skills.
   - Mirror Codex when shared behavior is expected, and add Codex `agents/openai.yaml`.
   - Benchmark coverage is owned by the separate `agentic-skills-benchmarks` repository. Do not edit `tests/harness/**` or `tests/layer4/**` in this repo.
   - For every new repository skill or material skill behavior update, decide whether the benchmark repo needs a matching coverage row, custom setup, blocked row, or smoke-only follow-up after this repo's public export is refreshed.
   - In `agentic-skills-benchmarks`, add/register a deterministic custom setup under `tests/layer4/setups/` when practical, or record an explicit blocked row with `blocked_reason` and `next_command` when coverage depends on unsafe or external conditions.
   - For custom setup work, include a deterministic output-quality rubric when practical. Prefer fixture fact coverage, concrete file/command references, expected next-route handoffs, specificity checks, reference traits, and forbidden-fabrication checks over broad prose judgments.
   - If deterministic quality scoring is not reliable for the skill, record the blocked/deferred quality rationale in the setup review notes or coverage follow-up instead of shipping only silent hard assertions.
   - Update skill discovery docs and routing docs only when the new or changed skill must be discoverable or routed by other skills.
9. If writing a reusable prompt/template only:
   - Store it only when the user asks for a file or the current repo has an obvious prompt/template location.
   - Otherwise output the reusable prompt directly.
10. Run validation after repository skill changes:
    - `npx skillpacks refresh` (recreate project-local base/pack skill installs from the changed sources)
    - `./scripts/skill-deps.sh --broken`
    - `./scripts/skill-versions.sh --missing`
    - `./scripts/skill-next-step-routing.sh --missing`
    - `node scripts/generate-skills-catalog-export.mjs`
    - `scripts/validate-skills-catalog-export.sh`
    - When benchmark coverage changed in `agentic-skills-benchmarks`, run `pnpm catalog:check`, `pnpm bench:coverage`, and focused benchmark tests from that repo after importing this repo's export by pinned ref or local `SKILLS_REPO_REF=WORKTREE`.
    - If a skill change needs curated public website copy, record a follow-up for the separate `agentic-skills-showcase` repo instead of editing app files here.
    - Targeted `rg` checks for the behavior being changed.
    - `git diff --check`
11. Update `tasks/todo.md` review notes with validation results.
12. Commit and push per the repository contract when tracked files changed.

## Output

Produce a concise report with:

- Decision: new skill, existing-skill update, reusable prompt/template, or no repository change.
- Evidence used and evidence intentionally skipped.
- Existing-skill overlap findings.
- Files created or changed, if any, including public export artifacts when skill metadata or behavior changed.
- Validation results.
- Reload note: after `npx skillpacks refresh`, tell the user the runner-specific reload path. Claude Code should run `/reload-skills` first; `/clear` starts a new empty-context conversation and can pick up the refreshed registry; restart if the top-level `.claude/skills` directory did not exist at session start or the skill is still invisible. Codex should start a fresh Codex CLI session if the `$` skill list remains stale.

When an external project session needs an existing shared skill amended, output a prompt like:

```text
From /Users/georgele/projects/tools/agentic-skills, run targeted-skill-builder for:
- Target skill: <path or skill name>
- Problem: <concrete correction or workflow gap>
- Desired change: <specific behavior>
- Evidence: <small scoped files/examples>
- Preferred output: update existing skill
```

## Constraints

- Prefer the smallest durable workflow fix.
- Do not create a broad meta-skill when a precise skill, existing-skill update, or reusable prompt solves the problem.
- Do not route every idea to `/spec-interview`; use `/feature-interview` when the planning destination is uncertain.
- Treat broad `/analyze-sessions` work as optional evidence for recurrence and trend analysis, not the default workflow.
- Use `/session-triage` for one immediate issue, correction, repo incident, or suspected skill failure that needs verification before building or updating a skill.
- Do not read unrelated history, projects, or private files for examples without user direction.
- Do not create or modify GitHub Actions workflows.

## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/targeted-skill-builder-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
