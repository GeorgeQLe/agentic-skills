---
name: slim-audit
description: Audit codebase for opportunities to reduce lines of code while preserving functionality, performance, and quality
type: analysis
version: v0.0
---

# Slim Audit

Invoke as `$slim-audit`.

Use this skill when the user wants to identify opportunities to reduce lines of code while maintaining or improving functionality, performance, and code quality.

## Workflow

1. Read project context (CLAUDE.md, specs, docs, conventions).
2. Determine scope (specific path from arguments, or entire project).
3. Analyze for reduction opportunities:
   - Duplicate and near-duplicate code that can be consolidated.
   - Over-abstraction: unnecessary wrappers, adapters, single-implementation interfaces.
   - Verbose patterns with idiomatic shorter equivalents (optional chaining, collection methods, etc.).
   - Redundant logic: duplicate validation, always-true branches, redundant conversions.
   - Hand-rolled implementations replaceable by already-imported dependencies.
   - Structural bloat: unnecessary barrel files, excessive file splitting, boilerplate.
4. Cross-reference findings against specs/docs — skip intentionally verbose patterns.
5. Estimate LOC savings, risk level, and effort for each opportunity.
6. Cross-reference with git history for context and prioritization.
7. Verify findings (false-positive filter):
   - Re-read actual source code for every finding. Confirm duplicates are genuine, wrappers don't handle hidden edge cases, replacements are behaviorally equivalent, and redundant checks are truly redundant.
   - Drop any finding you cannot re-confirm on second read. If uncertain, move to "Needs Investigation."

## Output Format

- **Summary**: total opportunities, estimated LOC reduction, risk breakdown
- **High-Value Reductions**: low risk, high savings — with location, category, savings, and proposed approach
- **Medium-Value Reductions**: moderate savings or risk
- **Low-Value Reductions**: small wins worth tracking
- **Behavior Change Risk**: reductions that may alter visible behavior
- **Intentional Decisions**: verbose patterns kept for documented reasons
- **Needs Investigation**: ambiguous findings needing manual review

## Constraints

- Never automatically modify code — only report.
- Functionality preservation is the top priority — every recommendation must preserve existing behavior.
- Do not recommend reductions that trade LOC for readability.
- Do not suggest adding new dependencies — only use what's already imported.
- Do not flag test code unless reduction clearly improves maintainability.
- Be specific with file paths and line numbers.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/slim-audit-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Inline questions.** After each content section that involves a decision, ambiguity, or clarification, place the relevant multiple-choice questions immediately below that section's content, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Answer compilation.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline question blocks throughout the page, including any free-text notes attached to selections. The button: remains disabled until every question has a selection (including "Need clarification" as a valid selection) and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions have a selection, generates a structured YAML block of all Q&A pairs (grouped by the section they belong to, with status — answered / other / needs-clarification — and any notes included) and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/slim-audit-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
