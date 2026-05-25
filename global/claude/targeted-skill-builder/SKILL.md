---
name: targeted-skill-builder
description: Build or update one specific skill from a concrete workflow gap, correction, or repeated bad recommendation
type: execution
version: v0.1
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
   - Search `global/claude`, `global/codex`, `packs`, and project-local `.claude/skills` or `.codex/skills` when present.
   - Compare name, description, workflow, and next-step routing behavior.
   - If an existing skill substantially covers the job, recommend updating that skill instead of adding a duplicate.
6. Decide the smallest durable fix:
   - New skill: choose this only when no existing skill owns the workflow and the behavior is repeatable.
   - Existing skill update: choose this when the fix is a missing branch, constraint, evidence gate, or routing correction inside an existing workflow.
   - Reusable prompt/template: choose this when the behavior is too situational or not stable enough for a skill.
   - No repository change: choose this when the request is already covered and only needs a usage note.
7. Resolve the destination:
   - Default new shared Claude/Codex skills to this repository: `/Users/georgele/projects/tools/agentic-skills/global/claude/<name>/SKILL.md` and `/Users/georgele/projects/tools/agentic-skills/global/codex/<name>/SKILL.md`.
   - If the current session is not in the agentic-skills repository and the user wants to audit or amend an existing shared skill, do not edit a local copy. Provide a concise prompt for the user to run from `/Users/georgele/projects/tools/agentic-skills` with the target skill path and requested adjustment.
   - Use user-local `~/.claude/skills` or `~/.codex/skills` only when the user explicitly asks for a personal/local skill.
8. If creating or updating a repository skill:
   - Follow existing frontmatter conventions: `name`, specific `description`, `type`, `version`, and `argument-hint` when useful.
   - Keep `SKILL.md` concise and operational.
   - Include clear trigger conditions, process steps, outputs, constraints, and next-step routing for mutation-capable skills.
   - Mirror Codex when shared behavior is expected, and add Codex `agents/openai.yaml`.
   - Update `tests/harness/bench-coverage.ts` for every new repository skill or material skill behavior update.
   - Add/register a deterministic custom setup under `tests/layer4/setups/` when practical, or record an explicit blocked row with `blocked_reason` and `next_command` when coverage depends on unsafe or external conditions.
   - For custom setup work, include a deterministic output-quality rubric when practical. Prefer fixture fact coverage, concrete file/command references, expected next-route handoffs, specificity checks, reference traits, and forbidden-fabrication checks over broad prose judgments.
   - If deterministic quality scoring is not reliable for the skill, record the blocked/deferred quality rationale in the setup review notes or coverage follow-up instead of shipping only silent hard assertions.
   - Update skill discovery docs and routing docs only when the new or changed skill must be discoverable or routed by other skills.
9. If writing a reusable prompt/template only:
   - Store it only when the user asks for a file or the current repo has an obvious prompt/template location.
   - Otherwise output the reusable prompt directly.
10. Run validation after repository skill changes:
    - `./install.sh`
    - `./scripts/skill-deps.sh --broken`
    - `./scripts/skill-versions.sh --missing`
    - `./scripts/skill-next-step-routing.sh --missing`
    - `pnpm --dir tests bench:coverage`
    - Focused layer1 benchmark setup tests when `tests/harness/bench-coverage.ts`, `tests/harness/bench-setups.ts`, or `tests/layer4/setups/` changed.
    - If any tracked `SKILL.md` or `PACK.md` behavior or metadata changed, refresh the Skills Showcase data:
      - `node scripts/generate-skills-showcase-data.mjs`
      - `node scripts/generate-skills-showcase-github-data.mjs`
      - `scripts/validate-skills-showcase-data.sh`
    - Review curated showcase copy, catalog grouping, workflow animation text, and proof receipts when the skill change could affect the public website; update those files or record why no curated website copy changed.
    - Targeted `rg` checks for the behavior being changed.
    - `git diff --check`
11. Update `tasks/todo.md` review notes with validation results.
12. Commit and push per the repository contract when tracked files changed.

## Output

Produce a concise report with:

- Decision: new skill, existing-skill update, reusable prompt/template, or no repository change.
- Evidence used and evidence intentionally skipped.
- Existing-skill overlap findings.
- Files created or changed, if any, including generated showcase assets when skill metadata or behavior changed.
- Validation results.
- Reload note: after `./install.sh`, tell the user to start a fresh Claude Code or Codex CLI/session if the new or changed skill is not visible yet.

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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/targeted-skill-builder-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/targeted-skill-builder-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
