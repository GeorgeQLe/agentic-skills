---
name: dead-code
description: Scan for unused exports, unreachable code, orphaned files, and stale dependencies
type: analysis
version: v0.0
---

# Dead Code

Invoke as `$dead-code`.

Use this skill when the user wants to identify unused code, orphaned files, or stale dependencies for cleanup.

## Workflow

1. Determine scope (specific package or entire project).
2. Scan for unused exports by cross-referencing imports.
3. Scan for orphaned files not imported anywhere.
4. Scan for stale package.json dependencies.
5. Scan for dead code patterns (unreachable code, commented-out blocks).
6. Cross-reference with git history for staleness.
7. Verify findings (false-positive filter):
   - Re-read actual source code for every flagged item. Confirm: exports are genuinely unused (check barrel files, dynamic imports), orphaned files aren't consumed by tools/frameworks, stale dependencies aren't used implicitly (plugins, peer deps, CLI tools in scripts).
   - Drop any finding you cannot re-confirm on second read. If uncertain, move to "Needs Investigation" instead of "Safe to Remove."

## Output Format

- **Unused Exports**: file, export name, last modified
- **Orphaned Files**: files not imported anywhere
- **Stale Dependencies**: unused packages
- **Dead Code Patterns**: unreachable code, commented blocks
- **Safe to Remove**: prioritized cleanup list

## Follow-Through

After presenting findings, write "Safe to Remove" items to `tasks/todo.md` under a `## Dead Code Cleanup` heading (append or replace existing section). One checkbox per item. Do not add "Needs Investigation" items. If a finding is only a non-blocking future validation or condition-gated cleanup record, write it to `tasks/record-todo.md` instead with source, condition, non-blocking reason, evidence, and promotion rule. Suggest `$run` to execute concrete cleanup.

## Constraints

- Never automatically delete anything — only report and write todo items.
- Be conservative with false positives.
- Exclude entry points, config files, and tool-consumed files.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/dead-code-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/dead-code-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
