---
name: slim-audit
description: Audit codebase for opportunities to reduce lines of code while preserving functionality, performance, and quality
type: analysis
version: v0.0
argument-hint: "[optional: specific package, directory, or file to scope the audit]"
---

# Slim Audit

Audit the codebase, documentation, and specs to identify concrete opportunities to reduce lines of code while maintaining or improving functionality, performance, and code quality. Outputs a prioritized reduction plan with estimated LOC savings.

## Process

1. **Gather project context:**
   - Read `CLAUDE.md`, `README.md`, and project config files to understand conventions, architecture, and constraints.
   - Search for and read project documentation: specs (`specs/`, `spec.md`, `docs/`), changelogs (`CHANGELOG.md`, `tasks/history.md`), ADRs, and design docs.
   - Read `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md` if they exist to understand in-progress and advisory work.
   - Build a mental model of **intentional decisions** — patterns, trade-offs, and constraints the team has deliberately chosen.

2. **Determine scope:**
   - If `$ARGUMENTS` specifies a package, directory, or file, scope the audit there.
   - Otherwise, audit the entire project (or all packages in a monorepo).

3. **Analyze for reduction opportunities across these categories:**

   **a. Duplicate and near-duplicate code:**
   - Identify code blocks that are identical or structurally similar (same logic, different names/values).
   - Flag copy-paste patterns across files that could be consolidated into a shared function or module.
   - Look for repeated patterns in tests that could use shared fixtures, helpers, or parameterized tests.

   **b. Over-abstraction and unnecessary indirection:**
   - Wrapper functions/classes that add no logic — they just forward calls to an inner implementation.
   - Adapter or facade layers with a single consumer that could be inlined.
   - Abstract base classes or interfaces implemented by only one concrete class.
   - Factory patterns where a direct constructor or function call would suffice.
   - Middleware or decorator chains that could be collapsed.

   **c. Verbose patterns with idiomatic alternatives:**
   - Manual loops that could be replaced by built-in array/collection methods (`map`, `filter`, `reduce`).
   - Verbose null/undefined checks that could use optional chaining, nullish coalescing, or pattern matching.
   - Hand-rolled utility functions that duplicate standard library or already-imported dependency functionality.
   - Explicit type definitions that could be inferred by the compiler/runtime.
   - Verbose error handling patterns that could use a shared error handler or middleware.

   **d. Redundant logic:**
   - Validation or guard checks already performed upstream (caller validates, callee re-validates).
   - Dead branches in conditionals — conditions that are always true/false given the surrounding code.
   - Redundant type conversions or serialization round-trips.
   - Configuration or initialization code that duplicates framework defaults.

   **e. Hand-rolled implementations replaceable by dependencies:**
   - Custom implementations of functionality provided by an already-imported library (e.g., hand-rolled date formatting when `date-fns` is already in `package.json`).
   - Utility code that reimplements well-tested standard library functions.
   - **Note:** Only suggest replacing with libraries *already in the dependency tree*. Do not suggest adding new dependencies.

   **f. Structural bloat:**
   - Files that exist purely for re-export (barrel files) with no additional logic, where the re-exports could be replaced by direct imports.
   - Excessive file splitting where closely related code (used together, changed together) is scattered across many small files that could be a single cohesive module.
   - Boilerplate-heavy patterns that could be reduced with code generation, decorators, or framework conventions.

4. **Cross-reference findings against documentation:**
   - Before reporting a finding, check if the pattern was an intentional decision documented in specs, ADRs, changelogs, or design docs.
   - If a verbose pattern exists because of a documented constraint (performance, compatibility, readability preference), **do not flag it**. Note it under "Intentional Decisions" instead.
   - If a finding would change externally-visible behavior (API contracts, output format, error messages), flag it as **Behavior Change Risk** rather than a safe reduction.

5. **Estimate impact:**
   - For each opportunity, estimate the approximate LOC reduction (net lines removed after the refactor).
   - Assess risk: Low (pure refactor, no behavior change), Medium (internal behavior change, needs testing), High (external behavior change risk).
   - Assess effort: Small (< 30 min), Medium (1-2 hours), Large (half-day+).

6. **Cross-reference with git:**
   - For flagged areas, check `git log` and `git blame` to understand why the code exists in its current form.
   - Code with recent intentional refactoring history should be flagged with lower confidence.
   - Code untouched for 6+ months with clear reduction paths gets higher priority.

7. **Verify findings (false-positive filter):**
   - Before finalizing, re-read the actual source code for every finding. For each one, confirm:
     - The "duplicate" code is genuinely duplicated — not just structurally similar with important semantic differences.
     - The "unnecessary wrapper" doesn't handle edge cases, logging, error transformation, or other subtle behavior you missed on first read.
     - The "verbose pattern" replacement is actually equivalent — same behavior for all inputs, including edge cases.
     - The "redundant check" is genuinely redundant — the upstream validation actually covers all cases the downstream check handles.
     - The suggested library replacement produces identical output for all relevant inputs.
     - The reduction **preserves all existing functionality** unless the current behavior is a clear, demonstrable bug.
   - **Drop any finding you cannot re-confirm with a second read.** If uncertain, move it to "Needs Investigation" rather than recommending removal.

## Output Format

### Summary
- **Total opportunities found**: N
- **Estimated total LOC reduction**: ~N lines
- **Risk breakdown**: N low / N medium / N high

### High-Value Reductions (low risk, high LOC savings)
| Location | Category | Current LOC | Est. Savings | Risk | Description |
|----------|----------|-------------|--------------|------|-------------|
| `path/file.ts:20-85` | Duplication | 65 | ~40 | Low | Consolidate into shared helper |

For each high-value finding, include:
- **Current code**: brief description or snippet of the verbose/duplicated pattern
- **Proposed approach**: how to reduce it
- **Why it's safe**: what guarantees functionality is preserved

### Medium-Value Reductions
Same table format — moderate savings or moderate risk.

### Low-Value Reductions
Brief list — small savings, worth tracking but not urgent.

### Behavior Change Risk
Opportunities that would reduce code but may alter externally-visible behavior. Each includes:
- What would change
- Why it might be acceptable (e.g., fixing a likely bug)
- What testing would be needed to confirm safety

### Intentional Decisions (no action)
Verbose patterns that exist for documented reasons — not flagged as issues.

### Needs Investigation
Items that look reducible but have ambiguous usage patterns or unclear intent. Each includes what specifically needs to be investigated.

## Constraints
- Use subagents to parallelize analysis across packages in a monorepo.
- **Never automatically modify code** — only report findings and recommendations.
- **Functionality preservation is the top priority.** Every recommendation must preserve existing behavior unless the current behavior is a clear, demonstrable bug. When in doubt, classify as "Behavior Change Risk" rather than recommending removal.
- Do not recommend reductions that trade LOC for readability — if the verbose version is clearer, it stays.
- Do not recommend adding new dependencies to replace hand-rolled code. Only suggest replacements using libraries already in the dependency tree.
- Do not flag test code for reduction unless the reduction clearly improves test maintainability (e.g., shared fixtures reducing update burden).
- Do not flag configuration files, migration files, or generated code.
- Be specific — always include file paths and line numbers or ranges.
- Every recommendation must include a concrete "proposed approach," not just "simplify this."
- Prefer many small, independent reductions over large sweeping refactors — smaller changes are safer and easier to review.
- If the codebase has no specs or documentation, proceed with the audit but note the absence and increase the confidence threshold for recommendations.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/slim-audit-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/slim-audit-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
